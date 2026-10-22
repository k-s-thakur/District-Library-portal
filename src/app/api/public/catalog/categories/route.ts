import { NextResponse } from "next/server";
import { getCategoriesWithCounts } from "@/lib/services/catalogue.service";

export async function GET() {
  try {
    const categories = await getCategoriesWithCounts();
    return NextResponse.json({ categories });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
