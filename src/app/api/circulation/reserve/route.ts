import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { reserveBook } from "@/lib/services/circulation.service";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.memberId) {
      return NextResponse.json(
        { error: "Authentication required. Please log in as a registered library member to reserve titles." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bookId } = body;

    if (!bookId) {
      return NextResponse.json({ error: "bookId is required" }, { status: 400 });
    }

    const result = await reserveBook({
      memberId: session.memberId,
      bookId,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
