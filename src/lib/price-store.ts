/**
 * In-memory gold price history store.
 * Shared across API routes within the same server process.
 * Accumulates prices from Swissquote feed over time.
 */

export interface PricePoint {
  price: number;
  bid: number;
  ask: number;
  ts: number;
}

const MAX_HISTORY = 500; // ~40 min at 5s intervals
const history: PricePoint[] = [];

export function addPrice(point: PricePoint) {
  // Avoid duplicates (same timestamp)
  if (history.length > 0 && history[history.length - 1].ts === point.ts) return;
  history.push(point);
  if (history.length > MAX_HISTORY) history.shift();
}

export function getHistory(): PricePoint[] {
  return [...history];
}

export function getLatest(): PricePoint | null {
  return history.length > 0 ? history[history.length - 1] : null;
}

export function getHistoryLength(): number {
  return history.length;
}
