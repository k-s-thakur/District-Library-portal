import { prisma } from "../prisma";

export interface IssueBookParams {
  memberIdentifier: string; // memberNo or memberId
  copyIdentifier: string;   // qrCodeToken or accessionNo or copyId
  actorId: string;
}

export interface ReturnBookParams {
  copyIdentifier: string;
  actorId: string;
}

export interface RenewLoanParams {
  loanId: string;
  actorId: string;
}

export interface ReserveBookParams {
  memberId: string;
  bookId: string;
}

export async function issueBook(params: IssueBookParams) {
  return await prisma.$transaction(async (tx) => {
    // 1. Identify member
    const member = await tx.member.findFirst({
      where: {
        OR: [{ id: params.memberIdentifier }, { memberNo: params.memberIdentifier }],
      },
      include: {
        loans: { where: { status: "ACTIVE" } },
        feeCharges: { where: { status: { in: ["OUTSTANDING", "PARTIALLY_PAID"] } } },
      },
    });

    if (!member) {
      throw new Error(`Member "${params.memberIdentifier}" was not found.`);
    }

    if (member.status !== "ACTIVE") {
      throw new Error(`Circulation denied: Member status is "${member.status}".`);
    }

    if (new Date(member.expiryDate) < new Date()) {
      throw new Error(`Membership expired on ${new Date(member.expiryDate).toLocaleDateString()}. Renewal required.`);
    }

    // 2. Policy limit check
    const policy = (await tx.libraryPolicy.findUnique({
      where: { category: member.category },
    })) || {
      loanDurationDays: 14,
      maxBooks: member.maxBooks || 3,
      gracePeriodDays: 2,
      fineRatePerDay: 2.0,
      maxFine: 150.0,
      allowRenewal: true,
      renewalLimit: 2,
    };

    if (member.loans.length >= policy.maxBooks) {
      throw new Error(`Borrowing limit reached: Member has ${member.loans.length} active loan(s), quota is ${policy.maxBooks}.`);
    }

    const totalOutstandingDues = member.feeCharges.reduce((acc, c) => acc + c.balance, 0);
    if (totalOutstandingDues > 200.0) {
      throw new Error(`Circulation blocked: Outstanding dues of ₹${totalOutstandingDues.toFixed(2)} must be cleared.`);
    }

    // 3. Find physical copy
    const copy = await tx.bookCopy.findFirst({
      where: {
        OR: [
          { id: params.copyIdentifier },
          { accessionNo: params.copyIdentifier },
          { qrCodeToken: params.copyIdentifier },
        ],
      },
      include: {
        book: {
          include: {
            reservations: {
              where: { status: { in: ["PENDING", "READY_FOR_PICKUP"] } },
              orderBy: { queuePosition: "asc" },
            },
          },
        },
      },
    });

    if (!copy) {
      throw new Error(`Book copy "${params.copyIdentifier}" not found.`);
    }

    if (copy.status !== "AVAILABLE") {
      if (copy.status === "RESERVED") {
        const topRes = copy.book.reservations[0];
        if (topRes && topRes.memberId !== member.id) {
          throw new Error("This physical copy is held under reservation for another member.");
        }
      } else {
        throw new Error(`Book copy is not lendable (Current status: ${copy.status}).`);
      }
    }

    // 4. Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + policy.loanDurationDays);

    // 5. Create loan record
    const loan = await tx.loan.create({
      data: {
        copyId: copy.id,
        memberId: member.id,
        dueDate,
        status: "ACTIVE",
        issuedBy: params.actorId,
      },
    });

    // 6. Update copy status
    await tx.bookCopy.update({
      where: { id: copy.id },
      data: { status: "ISSUED" },
    });

    // 7. Fulfill reservation if applicable
    const existingRes = copy.book.reservations.find((r) => r.memberId === member.id);
    if (existingRes) {
      await tx.reservation.update({
        where: { id: existingRes.id },
        data: { status: "FULFILLED" },
      });
    }

    // 8. Audit Log
    await tx.auditLog.create({
      data: {
        actorId: params.actorId,
        action: "LOAN_ISSUED",
        entityType: "Loan",
        entityId: loan.id,
        metadataJson: JSON.stringify({
          memberNo: member.memberNo,
          accessionNo: copy.accessionNo,
          title: copy.book.title,
          dueDate: dueDate.toISOString(),
        }),
      },
    });

    return {
      loan,
      member: {
        id: member.id,
        memberNo: member.memberNo,
        name: member.fullName,
      },
      book: {
        title: copy.book.title,
        accessionNo: copy.accessionNo,
        shelfLocation: copy.shelfLocation,
      },
    };
  });
}

export async function returnBook(params: ReturnBookParams) {
  return await prisma.$transaction(async (tx) => {
    // 1. Find copy
    const copy = await tx.bookCopy.findFirst({
      where: {
        OR: [
          { id: params.copyIdentifier },
          { accessionNo: params.copyIdentifier },
          { qrCodeToken: params.copyIdentifier },
        ],
      },
      include: {
        book: {
          include: {
            reservations: {
              where: { status: "PENDING" },
              orderBy: { queuePosition: "asc" },
            },
          },
        },
      },
    });

    if (!copy) {
      throw new Error(`Book copy "${params.copyIdentifier}" not found.`);
    }

    // 2. Find active loan
    const loan = await tx.loan.findFirst({
      where: { copyId: copy.id, status: "ACTIVE" },
      include: {
        member: true,
      },
    });

    if (!loan) {
      throw new Error(`No active loan found for copy "${copy.accessionNo}". It may already have been returned.`);
    }

    // 3. Check overdue and assess fine
    const now = new Date();
    const dueDate = new Date(loan.dueDate);
    let isOverdue = false;
    let assessedFineAmount = 0.0;
    let feeCharge: any = null;

    if (now > dueDate) {
      const diffMs = now.getTime() - dueDate.getTime();
      const overdueDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      const policy = (await tx.libraryPolicy.findUnique({
        where: { category: loan.member.category },
      })) || {
        gracePeriodDays: 2,
        fineRatePerDay: 2.0,
        maxFine: 150.0,
      };

      if (overdueDays > policy.gracePeriodDays) {
        const chargeableDays = overdueDays - policy.gracePeriodDays;
        assessedFineAmount = Math.min(chargeableDays * policy.fineRatePerDay, policy.maxFine);
        isOverdue = true;

        if (assessedFineAmount > 0) {
          feeCharge = await tx.feeCharge.create({
            data: {
              memberId: loan.memberId,
              loanId: loan.id,
              chargeType: "LATE_FINE",
              description: `Overdue late fine for "${copy.book.title}" (${overdueDays} days overdue, grace: ${policy.gracePeriodDays} days)`,
              amount: assessedFineAmount,
              balance: assessedFineAmount,
              paidAmount: 0.0,
              status: "OUTSTANDING",
            },
          });
        }
      }
    }

    // 4. Close loan
    await tx.loan.update({
      where: { id: loan.id },
      data: {
        returnedAt: now,
        status: "RETURNED",
        returnedBy: params.actorId,
      },
    });

    // 5. Update copy status: check if next reservation exists
    let nextStatus = "AVAILABLE";
    if (copy.book.reservations.length > 0) {
      nextStatus = "RESERVED";
      await tx.reservation.update({
        where: { id: copy.book.reservations[0].id },
        data: { status: "READY_FOR_PICKUP" },
      });
    }

    await tx.bookCopy.update({
      where: { id: copy.id },
      data: { status: nextStatus },
    });

    // 6. Audit Log
    await tx.auditLog.create({
      data: {
        actorId: params.actorId,
        action: "LOAN_RETURNED",
        entityType: "Loan",
        entityId: loan.id,
        metadataJson: JSON.stringify({
          memberNo: loan.member.memberNo,
          accessionNo: copy.accessionNo,
          isOverdue,
          fineAmount: assessedFineAmount,
        }),
      },
    });

    return {
      success: true,
      loanId: loan.id,
      member: {
        id: loan.member.id,
        memberNo: loan.member.memberNo,
        fullName: loan.member.fullName,
      },
      book: {
        title: copy.book.title,
        accessionNo: copy.accessionNo,
        shelfLocation: copy.shelfLocation,
      },
      isOverdue,
      assessedFineAmount,
      feeCharge,
    };
  });
}

export async function reserveBook(params: ReserveBookParams) {
  return await prisma.$transaction(async (tx) => {
    const member = await tx.member.findUnique({ where: { id: params.memberId } });
    if (!member) throw new Error("Member not found");
    if (member.status !== "ACTIVE") throw new Error("Only active members can place reservations");

    const book = await tx.book.findUnique({
      where: { id: params.bookId },
      include: {
        copies: true,
        reservations: {
          where: { status: { in: ["PENDING", "READY_FOR_PICKUP"] } },
        },
      },
    });

    if (!book) throw new Error("Book not found in catalogue");

    const existingReservation = book.reservations.find((r) => r.memberId === member.id);
    if (existingReservation) {
      throw new Error("You already have an active reservation for this book title");
    }

    const availableCopies = book.copies.filter((c) => c.status === "AVAILABLE").length;
    if (availableCopies > 0) {
      throw new Error("Copies are currently available on the shelf. You may visit the library to borrow directly.");
    }

    const nextPosition = book.reservations.length + 1;
    const reservation = await tx.reservation.create({
      data: {
        bookId: book.id,
        memberId: member.id,
        queuePosition: nextPosition,
        status: "PENDING",
      },
    });

    return {
      reservation,
      queuePosition: nextPosition,
      bookTitle: book.title,
    };
  });
}
