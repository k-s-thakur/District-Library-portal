import { NextResponse } from "next/server";
import { getCuratedCatalog } from "@/lib/services/catalogue.service";

export async function GET() {
  try {
    const curated = await getCuratedCatalog();
    return NextResponse.json(curated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
