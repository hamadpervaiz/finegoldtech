import { NextResponse } from "next/server";

interface YahooChartResult {
  chart: {
    result: Array<{
      timestamp: number[];
      indicators: {
        quote: Array<{
          close: (number | null)[];
        }>;
      };
    }>;
  };
}

let cache: { ts: number; data: { dates: string[]; prices: number[] } } | null = null;
const CACHE_MS = 60 * 60 * 1000; // 1 hour cache — historical data doesn't change fast

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.ts < CACHE_MS) {
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  }

  try {
    const end = Math.floor(now / 1000);
    const start = Math.floor((now - 365 * 24 * 60 * 60 * 1000) / 1000);

    const url = `https://query2.finance.yahoo.com/v8/finance/chart/GC=F?period1=${start}&period2=${end}&interval=1d`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!res.ok) {
      throw new Error(`Yahoo Finance responded with ${res.status}`);
    }

    const json: YahooChartResult = await res.json();
    const result = json.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;

    const dates: string[] = [];
    const prices: number[] = [];

    for (let i = 0; i < timestamps.length; i++) {
      const price = closes[i];
      if (price == null) continue;
      const date = new Date(timestamps[i] * 1000);
      dates.push(date.toISOString().split("T")[0]); // YYYY-MM-DD
      prices.push(Math.round(price * 100) / 100);
    }

    const data = { dates, prices };
    cache = { ts: now, data };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch (error) {
    console.error("Gold history fetch error:", error);

    // If cache exists but expired, serve stale
    if (cache) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=300" },
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}
