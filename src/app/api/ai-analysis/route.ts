import { NextResponse } from "next/server";
import { getHistory, getHistoryLength } from "@/lib/price-store";
import { analyzeGoldPrice } from "@/lib/technical-analysis";

let analysisCache: ReturnType<typeof analyzeGoldPrice> = null;
let lastAnalysis = 0;
const CACHE_MS = 3_000; // re-analyze every 3 seconds

export async function GET() {
  const now = Date.now();

  // Return cached analysis if fresh
  if (analysisCache && now - lastAnalysis < CACHE_MS) {
    return NextResponse.json(analysisCache, {
      headers: { "Cache-Control": "public, max-age=3" },
    });
  }

  const history = getHistory();

  if (history.length === 0) {
    return NextResponse.json(
      {
        error: "Insufficient data",
        message: "Price history is being collected. Please wait a moment.",
        dataPoints: getHistoryLength(),
      },
      { status: 202 }
    );
  }

  const analysis = analyzeGoldPrice(history);

  if (!analysis) {
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }

  analysisCache = analysis;
  lastAnalysis = now;

  return NextResponse.json(analysis, {
    headers: { "Cache-Control": "public, max-age=3" },
  });
}
