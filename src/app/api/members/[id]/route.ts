import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getMemberDetails } from "@/lib/services/member.service";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await params;
    const isStaff = ["SUPER_ADMIN", "LIBRARY_ADMIN", "LIBRARIAN", "ACCOUNTS_OPERATOR"].includes(session.role);

    // If citizen/member, can ONLY query their own account
    if (!isStaff && session.memberId !== id) {
      return NextResponse.json({ error: "Access denied. You can only view your own library account." }, { status: 403 });
    }

    const member = await getMemberDetails(id);
    return NextResponse.json({ member });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}
