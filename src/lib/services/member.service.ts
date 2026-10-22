import { prisma } from "../prisma";
import bcrypt from "bcryptjs";

export interface RegisterMemberInput {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  password?: string;
  category: "GENERAL_CITIZEN" | "STUDENT" | "SENIOR_CITIZEN" | "RESEARCHER" | "GOVT_STAFF";
  actorId?: string;
}

export async function listMembers(search?: string, category?: string, status?: string) {
  const where: any = {};
  if (search && search.trim()) {
    const s = search.trim();
    where.OR = [
      { fullName: { contains: s } },
      { memberNo: { contains: s } },
      { email: { contains: s } },
      { phone: { contains: s } },
    ];
  }
  if (category) where.category = category;
  if (status) where.status = status;

  return await prisma.member.findMany({
    where,
    include: {
      loans: { where: { status: "ACTIVE" } },
      feeCharges: { where: { status: { in: ["OUTSTANDING", "PARTIALLY_PAID"] } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMemberDetails(memberNoOrId: string) {
  const member = await prisma.member.findFirst({
    where: {
      OR: [{ id: memberNoOrId }, { memberNo: memberNoOrId }, { email: memberNoOrId }],
    },
    include: {
      loans: {
        include: {
          copy: {
            include: { book: true },
          },
        },
        orderBy: { issuedAt: "desc" },
      },
      reservations: {
        include: { book: true },
        orderBy: { reservedAt: "desc" },
      },
      feeCharges: {
        include: {
          allocations: {
            include: { payment: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      payments: {
        include: { receipt: true },
        orderBy: { createdAt: "desc" },
      },
      receipts: {
        orderBy: { issueDate: "desc" },
      },
    },
  });

  if (!member) {
    throw new Error(`Member "${memberNoOrId}" not found`);
  }

  const activeLoans = member.loans.filter((l) => l.status === "ACTIVE");
  const overdueLoans = member.loans.filter(
    (l) => l.status === "ACTIVE" && new Date(l.dueDate) < new Date()
  );
  const totalOutstandingDues = member.feeCharges.reduce((acc, c) => acc + c.balance, 0);

  return {
    ...member,
    activeLoansCount: activeLoans.length,
    overdueLoansCount: overdueLoans.length,
    totalOutstandingDues: Number(totalOutstandingDues.toFixed(2)),
  };
}

export async function registerMember(input: RegisterMemberInput) {
  return await prisma.$transaction(async (tx) => {
    // 1. Email check
    const existing = await tx.member.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new Error(`Email "${input.email}" is already registered in the library system.`);
    }

    // 2. Sequential Member Number using MemberSequence table
    const currentYear = new Date().getFullYear();
    let seq = await tx.memberSequence.findUnique({ where: { year: currentYear } });
    if (!seq) {
      seq = await tx.memberSequence.create({
        data: { year: currentYear, lastNumber: 1 },
      });
    } else {
      seq = await tx.memberSequence.update({
        where: { year: currentYear },
        data: { lastNumber: { increment: 1 } },
      });
    }

    const memberNo = `GPL-${currentYear}-${String(seq.lastNumber).padStart(5, "0")}`;

    // 3. Quota by category
    const maxBooksMap: Record<string, number> = {
      GENERAL_CITIZEN: 3,
      STUDENT: 4,
      SENIOR_CITIZEN: 5,
      RESEARCHER: 8,
      GOVT_STAFF: 5,
    };
    const maxBooks = maxBooksMap[input.category] || 3;

    // 4. Validity: 1 year from now
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const passwordHash = input.password
      ? await bcrypt.hash(input.password, 10)
      : await bcrypt.hash("Member@123", 10);

    const member = await tx.member.create({
      data: {
        memberNo,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone || null,
        address: input.address || null,
        passwordHash,
        category: input.category,
        status: "ACTIVE",
        expiryDate,
        maxBooks,
      },
    });

    if (input.actorId) {
      await tx.auditLog.create({
        data: {
          actorId: input.actorId,
          action: "MEMBER_REGISTERED",
          entityType: "Member",
          entityId: member.id,
          metadataJson: JSON.stringify({
            memberNo,
            fullName: member.fullName,
            category: member.category,
          }),
        },
      });
    }

    return member;
  });
}
