import { NextRequest, NextResponse } from "next/server";
import { searchCatalogue } from "@/lib/services/catalogue.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;
    const categoryCode = searchParams.get("category") || undefined;
    const ddcPrefix = searchParams.get("ddc") || undefined;
    const language = searchParams.get("language") || undefined;
    const availableOnly = searchParams.get("available") === "true";
    const sortBy = (searchParams.get("sort") as any) || "relevance";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const result = await searchCatalogue({
      query,
      categoryCode,
      ddcPrefix,
      language,
      availableOnly,
      sortBy,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
