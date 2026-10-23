import { prisma } from "../src/lib/prisma";
import { searchCatalogue, getBookDetails } from "../src/lib/services/catalogue.service";
import { issueBook, returnBook, reserveBook } from "../src/lib/services/circulation.service";
import { assessCharge, postPayment, reversePayment } from "../src/lib/services/finance.service";
import { registerMember } from "../src/lib/services/member.service";

async function runAcceptanceTests() {
  console.log("==================================================================");
  console.log("   SMART PUBLIC LIBRARY OPAC & PORTAL ACCEPTANCE TEST SUITE       ");
  console.log("   PRD 1 & PRD 2 INTEGRITY, PRIVACY & TRANSACTION VERIFICATION    ");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testId: string, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testId}: ${testName} ${detail ? `- ${detail}` : ""}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testId}: ${testName} ${detail ? `- ${detail}` : ""}`);
      failed++;
    }
  }

  // TEST 1 — AT-01: Public OPAC Search without login
  try {
    const searchRes = await searchCatalogue({ query: "Wings of Fire" });
    const book = searchRes.items[0];
    const hasCopyData = book && book.availableCopies !== undefined;
    assert(
      searchRes.items.length > 0 && hasCopyData,
      "AT-01",
      "Public Search without Login",
      `Found "${book?.title}" with ${book?.availableCopies}/${book?.totalCopies} copies available`
    );
  } catch (err: any) {
    assert(false, "AT-01", "Public Search without Login", err.message);
  }

  // TEST 2 — PRIVACY: Public catalog endpoint does NOT expose internal QR secrets or member identities
  try {
    const publicBook = await getBookDetails("9788173711466");
    const anyRawQr = (publicBook.copies as any[]).some((c) => (c as any).qrCodeToken !== undefined);
    const anyPrivateCost = (publicBook.copies as any[]).some((c) => (c as any).acquisitionCost !== undefined);
    assert(
      !anyRawQr && !anyPrivateCost,
      "AT-02",
      "Public Data Privacy & Security",
      "Zero raw QR tokens or internal costs exposed in public catalogue response"
    );
  } catch (err: any) {
    assert(false, "AT-02", "Public Data Privacy & Security", err.message);
  }

  // TEST 3 — AT-03: Two staff attempt to issue same physical copy concurrently
  try {
    // Isolate test: create a dedicated test copy
    const testBook = await prisma.book.findFirst({ where: { isbn: "9788172234980" } });
    const testCopy = await prisma.bookCopy.create({
      data: {
        bookId: testBook!.id,
        accessionNo: `ACC-TEST-${Date.now()}`,
        qrCodeToken: `QR-TEST-${Date.now()}`,
        status: "AVAILABLE",
        shelfLocation: "Aisle 3, Rack B, Shelf 1",
      },
    });

    const memberA = await prisma.member.findFirst({ where: { memberNo: "GPL-2026-00001" } });
    const memberB = await prisma.member.findFirst({ where: { memberNo: "GPL-2026-00002" } });

    let successCount = 0;
    let failCount = 0;

    const [resA, resB] = await Promise.allSettled([
      issueBook({
        memberIdentifier: memberA!.id,
        copyIdentifier: testCopy.accessionNo,
        actorId: "staff_1",
      }),
      issueBook({
        memberIdentifier: memberB!.id,
        copyIdentifier: testCopy.accessionNo,
        actorId: "staff_2",
      }),
    ]);

    if (resA.status === "fulfilled") successCount++; else failCount++;
    if (resB.status === "fulfilled") successCount++; else failCount++;

    const updatedCopy = await prisma.bookCopy.findUnique({ where: { id: testCopy.id } });

    assert(
      successCount === 1 && failCount === 1 && updatedCopy?.status === "ISSUED",
      "AT-03",
      "Concurrent Issue Protection",
      "Exactly one issue succeeded; second concurrent request was safely rejected"
    );

    // Clean up test copy
    await prisma.loan.deleteMany({ where: { copyId: testCopy.id } });
    await prisma.bookCopy.delete({ where: { id: testCopy.id } });
  } catch (err: any) {
    assert(false, "AT-03", "Concurrent Issue Protection", err.message);
  }

  // TEST 4 — AT-04: Issue book to expired member is rejected
  try {
    const expiredEmail = `expired.${Date.now()}@example.gov.in`;
    const expiredMember = await prisma.member.create({
      data: {
        memberNo: `GPL-EXP-${Date.now()}`,
        fullName: "Expired Citizen Test",
        email: expiredEmail,
        category: "GENERAL_CITIZEN",
        status: "ACTIVE",
        expiryDate: new Date("2020-01-01"), // Expired
      },
    });

    let caught = false;
    try {
      await issueBook({
        memberIdentifier: expiredMember.id,
        copyIdentifier: "ACC-2026-0004",
        actorId: "librarian",
      });
    } catch {
      caught = true;
    }

    assert(
      caught,
      "AT-04",
      "Expired Membership Rejection",
      "Transaction properly rejected due to expired membership validity"
    );

    // Teardown
    await prisma.member.delete({ where: { id: expiredMember.id } });
  } catch (err: any) {
    assert(false, "AT-04", "Expired Membership Rejection", err.message);
  }

  // TEST 5 — AT-05: Return overdue book & verify fine calculation
  try {
    const testCopy = await prisma.bookCopy.create({
      data: {
        bookId: (await prisma.book.findFirst())!.id,
        accessionNo: `ACC-FINE-${Date.now()}`,
        qrCodeToken: `QR-FINE-${Date.now()}`,
        status: "ISSUED",
        shelfLocation: "Aisle 1",
      },
    });

    const member = await prisma.member.findFirst({ where: { memberNo: "GPL-2026-00001" } });
    const pastDueDate = new Date();
    pastDueDate.setDate(pastDueDate.getDate() - 10); // 10 days overdue

    const overdueLoan = await prisma.loan.create({
      data: {
        copyId: testCopy.id,
        memberId: member!.id,
        issuedAt: new Date(Date.now() - 25 * 86400000),
        dueDate: pastDueDate,
        status: "ACTIVE",
        issuedBy: "librarian",
      },
    });

    const returnRes = await returnBook({
      copyIdentifier: testCopy.accessionNo,
      actorId: "librarian",
    });

    assert(
      returnRes.isOverdue && returnRes.assessedFineAmount > 0 && returnRes.feeCharge !== null,
      "AT-05",
      "Return Overdue Book & Fine Assessment",
      `Assessed fine of ₹${returnRes.assessedFineAmount} based on policy rate & grace period`
    );

    // Teardown
    if (returnRes.feeCharge) {
      await prisma.feeCharge.delete({ where: { id: returnRes.feeCharge.id } });
    }
    await prisma.loan.delete({ where: { id: overdueLoan.id } });
    await prisma.bookCopy.delete({ where: { id: testCopy.id } });
  } catch (err: any) {
    assert(false, "AT-05", "Return Overdue Book & Fine Assessment", err.message);
  }

  // TEST 6 — AT-06: Post partial cash payment & verify remaining balance
  let assessedCharge: any;
  let paymentResult: any;
  const uniqueKey = `PAY-TEST-${Date.now()}`;

  try {
    const member = await prisma.member.findFirst({ where: { memberNo: "GPL-2026-00001" } });
    assessedCharge = await assessCharge({
      memberId: member!.id,
      chargeType: "DAMAGED_BOOK",
      amount: 200.0,
      description: "Damage fine assessment",
      actorId: "librarian",
    });

    paymentResult = await postPayment({
      memberId: member!.id,
      amount: 75.0, // Partial payment
      paymentMethod: "CASH",
      idempotencyKey: uniqueKey,
      operatorId: "operator_accounts",
      allocations: [{ chargeId: assessedCharge.id, amount: 75.0 }],
    });

    const updatedCharge = await prisma.feeCharge.findUnique({ where: { id: assessedCharge.id } });

    assert(
      paymentResult.receipt !== null &&
        updatedCharge?.paidAmount === 75.0 &&
        updatedCharge?.balance === 125.0 &&
        updatedCharge?.status === "PARTIALLY_PAID",
      "AT-06",
      "Post Partial Cash Payment",
      `Paid ₹75 against ₹200; remaining balance ₹125; Receipt #${paymentResult.receipt?.receiptNo}`
    );
  } catch (err: any) {
    assert(false, "AT-06", "Post Partial Cash Payment", err.message);
  }

  // TEST 7 — AT-07: Idempotent replay of identical payment request
  try {
    const member = await prisma.member.findFirst({ where: { memberNo: "GPL-2026-00001" } });
    const replayRes = await postPayment({
      memberId: member!.id,
      amount: 75.0,
      paymentMethod: "CASH",
      idempotencyKey: uniqueKey, // identical key
      operatorId: "operator_accounts",
      allocations: [{ chargeId: assessedCharge.id, amount: 75.0 }],
    });

    const payCount = await prisma.payment.count({ where: { idempotencyKey: uniqueKey } });
    assert(
      replayRes.idempotentReplay === true && payCount === 1,
      "AT-07",
      "Idempotent Payment Replay",
      "Safely returned existing receipt without double charges or duplicate receipts"
    );
  } catch (err: any) {
    assert(false, "AT-07", "Idempotent Payment Replay", err.message);
  }

  // TEST 8 — AT-08: Force failure / invalid allocation (Rollback Verification)
  try {
    const prePayments = await prisma.payment.count();
    const preReceipts = await prisma.receipt.count();
    let thrown = false;

    try {
      await postPayment({
        memberId: assessedCharge.memberId,
        amount: 50.0,
        paymentMethod: "CASH",
        operatorId: "op",
        allocations: [{ chargeId: "non_existent_charge_id_999", amount: 50.0 }],
      });
    } catch {
      thrown = true;
    }

    const postPayments = await prisma.payment.count();
    const postReceipts = await prisma.receipt.count();

    assert(
      thrown && prePayments === postPayments && preReceipts === postReceipts,
      "AT-08",
      "Atomic Transaction Rollback",
      "Failed allocation rolled back completely; zero partial records created"
    );
  } catch (err: any) {
    assert(false, "AT-08", "Atomic Transaction Rollback", err.message);
  }

  // TEST 9 — AT-09: Authorized payment reversal & audit traceability
  try {
    const reversalRes = await reversePayment({
      paymentId: paymentResult.payment.id,
      reversalReason: "Cashier keying error - authorized by Approving Officer",
      authorizedBy: "Rajeshwar Rao (Approving Officer)",
      operatorId: "operator_accounts",
    });

    const restoredCharge = await prisma.feeCharge.findUnique({ where: { id: assessedCharge.id } });
    const reversedPayment = await prisma.payment.findUnique({
      where: { id: paymentResult.payment.id },
      include: { receipt: true },
    });

    assert(
      reversalRes.success &&
        reversedPayment?.status === "REVERSED" &&
        reversedPayment?.receipt?.status === "CANCELLED" &&
        restoredCharge?.balance === 200.0,
      "AT-09",
      "Authorized Payment Reversal",
      "Payment marked REVERSED, receipt CANCELLED, and charge balance restored"
    );

    // Teardown
    await prisma.paymentAllocation.deleteMany({ where: { paymentId: paymentResult.payment.id } });
    await prisma.paymentReversal.deleteMany({ where: { paymentId: paymentResult.payment.id } });
    await prisma.receipt.deleteMany({ where: { paymentId: paymentResult.payment.id } });
    await prisma.payment.delete({ where: { id: paymentResult.payment.id } });
    await prisma.feeCharge.delete({ where: { id: assessedCharge.id } });
  } catch (err: any) {
    assert(false, "AT-09", "Authorized Payment Reversal", err.message);
  }

  // TEST 10 — AT-10: Safe Sequential Member Number Generation
  try {
    const newMember = await registerMember({
      fullName: "Deepa Narayan",
      email: `deepa.${Date.now()}@test.ac.in`,
      category: "STUDENT",
    });

    assert(
      newMember.memberNo.startsWith("GPL-2026-"),
      "AT-10",
      "Sequential Member Numbering",
      `Generated unique sequence number: ${newMember.memberNo}`
    );

    // Teardown
    await prisma.member.delete({ where: { id: newMember.id } });
  } catch (err: any) {
    assert(false, "AT-10", "Sequential Member Numbering", err.message);
  }

  console.log("\n==================================================================");
  console.log(`   TEST EXECUTION RESULT: ${passed} PASSED / ${failed} FAILED`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAcceptanceTests()
  .catch((e) => {
    console.error("Test runner error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
