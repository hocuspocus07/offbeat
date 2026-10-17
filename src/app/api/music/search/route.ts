import { NextRequest, NextResponse } from "next/server";
import {
  searchYouTubeVideos,
  YouTubeSearchError,
} from "@/lib/youtube/search";


export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const rawLimit = Number(request.nextUrl.searchParams.get("limit") ?? "12");

  if (query.length < 2) {
    return NextResponse.json(
      { error: "Enter at least 2 characters to search." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (query.length > 100) {
    return NextResponse.json(
      { error: "Search query must be 100 characters or fewer." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const limit = Number.isFinite(rawLimit)
    ? Math.min(25, Math.max(1, Math.trunc(rawLimit)))
    : 12;

  try {
    const items = await searchYouTubeVideos(query, limit);
    return NextResponse.json(
      { query, items },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof YouTubeSearchError) {
      return NextResponse.json(
        { error: error.publicMessage },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    }

    console.error("[YouTube search] Unexpected server error:", error);
    return NextResponse.json(
      { error: "YouTube search is temporarily unavailable." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
