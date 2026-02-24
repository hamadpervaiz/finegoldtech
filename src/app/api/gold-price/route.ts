import { NextResponse } from "next/server";
import { addPrice } from "@/lib/price-store";

interface SpreadPrice {
  spreadProfile: string;
  bid: number;
  ask: number;
}

interface QuoteEntry {
  topo: { platform: string; server: string };
  spreadProfilePrices: SpreadPrice[];
  ts: number;
}

let cache: { price: number; bid: number; ask: number; ts: number } | null =
  null;
let lastFetch = 0;
const CACHE_MS = 5_000; // cache for 5 seconds

export async function GET() {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_MS) {
    return NextResponse.json(cache, {
      headers: { "Cache-Control": "public, max-age=5" },
    });
  }

  try {
    const res = await fetch(
      "https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD",
      { cache: "no-store" }
    );

    if (!res.ok) {
      if (cache) return NextResponse.json(cache);
      return NextResponse.json(
        { error: "Failed to fetch gold price" },
        { status: 502 }
      );
    }

    const data: QuoteEntry[] = await res.json();

    // Use the first entry's premium spread profile for a reliable mid-market price
    const entry = data[0];
    const premium =
      entry.spreadProfilePrices.find((p) => p.spreadProfile === "premium") ||
      entry.spreadProfilePrices[0];

    const bid = premium.bid;
    const ask = premium.ask;
    const price = Number(((bid + ask) / 2).toFixed(2));

    cache = { price, bid, ask, ts: entry.ts };
    lastFetch = now;

    // Store in price history for technical analysis
    addPrice({ price, bid, ask, ts: entry.ts });

    return NextResponse.json(cache, {
      headers: { "Cache-Control": "public, max-age=5" },
    });
  } catch {
    if (cache) return NextResponse.json(cache);
    return NextResponse.json(
      { error: "Failed to fetch gold price" },
      { status: 502 }
    );
  }
}
