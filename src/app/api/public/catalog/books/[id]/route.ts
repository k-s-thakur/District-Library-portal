import { NextRequest, NextResponse } from "next/server";
import { getBookDetails } from "@/lib/services/catalogue.service";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const book = await getBookDetails(id);
    return NextResponse.json({ book });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}
