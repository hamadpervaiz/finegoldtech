"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { TrendingUp, BarChart3, Globe, Brain } from "lucide-react";
import SectionWrapper from "./section-wrapper";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MetricData {
  label: string;
  sublabel: string;
  icon: React.ElementType;
  value: number;
  prevValue: number;
  format: (v: number) => string;
  delta: number;
  sparkline: number[];
  interval: number; // ms between updates
  rangeLow: number;
  rangeHigh: number;
  step: number;
}

// ---------------------------------------------------------------------------
// Utility – generate smooth random data
// ---------------------------------------------------------------------------

function generateSmoothData(
  length: number,
  min: number,
  max: number,
  smoothing = 0.3
): number[] {
  const data: number[] = [];
  let current = min + Math.random() * (max - min);
  for (let i = 0; i < length; i++) {
    const target = min + Math.random() * (max - min);
    current += (target - current) * smoothing;
    data.push(current);
  }
  return data;
}

// Historical data type
interface HistoricalData {
  dates: string[];
  prices: number[];
}

// Convert data points to a smooth SVG path using cubic bezier
function pointsToPath(
  points: number[],
  width: number,
  height: number,
  padding: { top: number; bottom: number; left: number; right: number }
): string {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const plotWidth = width - padding.left - padding.right;
  const usableHeight = height - padding.top - padding.bottom;

  const coords = points.map((p, i) => ({
    x: padding.left + (i / (points.length - 1)) * plotWidth,
    y: padding.top + usableHeight - ((p - min) / range) * usableHeight,
  }));

  let d = `M ${coords[0].x},${coords[0].y}`;

  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpy1 = prev.y;
    const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
    const cpy2 = curr.y;
    d += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${curr.x},${curr.y}`;
  }

  return d;
}

// Area path (closed shape for gradient fill)
function pointsToArea(
  points: number[],
  width: number,
  height: number,
  padding: { top: number; bottom: number; left: number; right: number }
): string {
  const linePath = pointsToPath(points, width, height, padding);
  const plotWidth = width - padding.left - padding.right;
  const lastX = padding.left + plotWidth;
  const firstX = padding.left;
  const bottomY = height - padding.bottom;
  return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
}

// Sparkline SVG path for small inline charts
function sparklinePath(data: number[], w: number, h: number): string {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * h,
  }));

  let d = `M ${coords[0].x},${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.35;
    const cpx2 = curr.x - (curr.x - prev.x) * 0.35;
    d += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
  }
  return d;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHART_WIDTH = 720;
const CHART_HEIGHT = 340;
const CHART_PADDING = { top: 20, bottom: 40, left: 70, right: 20 };
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS = MONTH_NAMES;
const VOLUME_BARS = 32;

/** Generate ~48 data points simulating a 1-year gold price trend */
function generateChartData(): number[] {
  return generateSmoothData(48, 1950, 2850, 0.15);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Animated number that slides up/down on change */
function AnimatedValue({
  value,
  format,
  direction,
}: {
  value: number;
  format: (v: number) => string;
  direction: "up" | "down" | "none";
}) {
  return (
    <div className="relative h-8 overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value.toFixed(4)}
          initial={{ y: direction === "up" ? 20 : direction === "down" ? -20 : 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction === "up" ? -20 : direction === "down" ? 20 : 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute left-0 top-0 text-2xl font-display font-bold whitespace-nowrap"
        >
          {format(value)}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/** Circular progress indicator for AI Confidence */
function CircularProgress({ value, inView }: { value: number; inView: boolean }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const mv = useMotionValue(0);
  const offset = useTransform(mv, (v) => circumference - (v / 100) * circumference);

  useEffect(() => {
    if (inView) {
      animate(mv, value, { duration: 1.2, ease: "easeOut" });
    }
  }, [value, inView, mv]);

  return (
    <svg width={44} height={44} viewBox="0 0 44 44" className="shrink-0">
      <circle
        cx={22}
        cy={22}
        r={radius}
        fill="none"
        stroke="#1E1E26"
        strokeWidth={3}
      />
      <motion.circle
        cx={22}
        cy={22}
        r={radius}
        fill="none"
        stroke="#C8A960"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        style={{ strokeDashoffset: offset }}
        transform="rotate(-90 22 22)"
      />
      <text
        x={22}
        y={23}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#C8A960"
        fontSize={10}
        fontWeight={700}
        fontFamily="var(--font-display)"
      >
        {Math.round(value)}%
      </text>
    </svg>
  );
}

/** Inline sparkline mini-chart */
function Sparkline({ data, color, inView }: { data: number[]; color: string; inView: boolean }) {
  const d = useMemo(() => sparklinePath(data, 56, 22), [data]);

  return (
    <svg width={56} height={22} viewBox="0 0 56 22" className="shrink-0">
      <defs>
        <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0.8} />
        </linearGradient>
      </defs>
      <motion.path
        d={d}
        fill="none"
        stroke={`url(#spark-${color.replace("#", "")})`}
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </svg>
  );
}

/** Single metric card */
function MetricCard({
  metric,
  index,
  inView,
}: {
  metric: MetricData;
  index: number;
  inView: boolean;
}) {
  const isUp = metric.delta >= 0;
  const direction = metric.value > metric.prevValue ? "up" : metric.value < metric.prevValue ? "down" : "none";
  const Icon = metric.icon;
  const isAI = metric.label === "AI Confidence";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.6 + index * 0.1, ease: "easeOut" }}
      className="group relative rounded-xl bg-elevated/50 border border-line hover:border-line-bold p-4 transition-colors duration-300"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-xl bg-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gold/[0.08] flex items-center justify-center text-gold">
              <Icon size={16} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted leading-tight">{metric.label}</p>
              <p className="text-[10px] text-faint leading-tight">{metric.sublabel}</p>
            </div>
          </div>

          <AnimatedValue value={metric.value} format={metric.format} direction={direction} />

          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`text-xs font-semibold ${
                isUp ? "text-emerald" : "text-red"
              }`}
            >
              {isUp ? "↑" : "↓"}{" "}
              {Math.abs(metric.delta).toFixed(2)}%
            </span>
            <span className="text-[10px] text-faint">24h</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 pt-1">
          {isAI ? (
            <CircularProgress value={metric.value} inView={inView} />
          ) : (
            <Sparkline
              data={metric.sparkline}
              color={isUp ? "#34D399" : "#F87171"}
              inView={inView}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/** Volume bars along bottom of chart */
function VolumeBars({ inView }: { inView: boolean }) {
  const bars = useMemo(
    () =>
      Array.from({ length: VOLUME_BARS }, () => 0.2 + Math.random() * 0.8),
    []
  );

  return (
    <div className="flex items-end gap-[3px] h-10 mt-1 px-1">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{
            background: `linear-gradient(to top, rgba(200,169,96,${0.15 + h * 0.35}), rgba(200,169,96,${0.05 + h * 0.15}))`,
          }}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{
            duration: 0.4,
            delay: 0.8 + i * 0.025,
            ease: "easeOut",
          }}
          whileHover={{ scaleY: 1.15, transition: { duration: 0.15 } }}
        >
          <div style={{ height: `${h * 100}%` }} className="w-full" />
        </motion.div>
      ))}
    </div>
  );
}

/** Horizontal data-stream decoration */
function DataStream() {
  // Pre-generate stable widths/opacities so they don't change on re-render
  const segments = useMemo(
    () =>
      Array.from({ length: 80 }, () => ({
        width: Math.random() > 0.6 ? 12 + Math.random() * 20 : 2 + Math.random() * 4,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    []
  );

  return (
    <div className="relative w-full h-6 overflow-hidden mt-6 opacity-40">
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="absolute h-px w-full"
          style={{ top: `${row * 8 + 4}px` }}
        >
          <div
            className="flex gap-3"
            style={{
              animation: `data-stream ${18 + row * 4}s linear infinite`,
              animationDelay: `${row * -2.5}s`,
            }}
          >
            {segments.map((seg, i) => (
              <span
                key={i}
                className="block shrink-0 rounded-full bg-gold"
                style={{
                  width: `${seg.width}px`,
                  height: "1px",
                  opacity: seg.opacity,
                }}
              />
            ))}
          </div>
        </div>
      ))}
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-card/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-card/80 to-transparent z-10 pointer-events-none" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function MarketInsights() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const chartInView = useInView(chartRef, { once: true, margin: "-60px" });

  // ---------- Real price state ----------
  const [realPrice, setRealPrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const openPriceRef = useRef<number | null>(null);

  // ---------- Historical chart data (fetched from API) ----------
  const [historyData, setHistoryData] = useState<{ dates: string[]; prices: number[] } | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/gold-history");
        if (!res.ok) return;
        const data = await res.json();
        if (data.dates && data.prices) {
          setHistoryData(data);
        }
      } catch {
        // fall back to placeholder
      }
    };
    fetchHistory();
  }, []);

  // Use real data or a placeholder while loading
  const chartData = useMemo(() => {
    if (historyData) return historyData.prices;
    return generateChartData();
  }, [historyData]);

  // Derive month labels from actual dates
  const chartMonths = useMemo(() => {
    if (!historyData) return MONTHS;
    const seen = new Set<string>();
    const labels: string[] = [];
    for (const d of historyData.dates) {
      const month = MONTH_NAMES[new Date(d).getMonth()];
      if (!seen.has(month)) {
        seen.add(month);
        labels.push(month);
      }
    }
    return labels;
  }, [historyData]);

  const chartLinePath = useMemo(
    () => pointsToPath(chartData, CHART_WIDTH, CHART_HEIGHT, CHART_PADDING),
    [chartData]
  );
  const chartAreaPath = useMemo(
    () => pointsToArea(chartData, CHART_WIDTH, CHART_HEIGHT, CHART_PADDING),
    [chartData]
  );

  // Y-axis labels derived from real price range
  const priceMin = Math.min(...chartData);
  const priceMax = Math.max(...chartData);
  const yLabels = useMemo(() => {
    // Round to nice numbers
    const niceMin = Math.floor(priceMin / 50) * 50;
    const niceMax = Math.ceil(priceMax / 50) * 50;
    const labels: number[] = [];
    const step = (niceMax - niceMin) / 4;
    for (let i = 0; i <= 4; i++) {
      labels.push(Math.round(niceMin + step * i));
    }
    return labels;
  }, [priceMin, priceMax]);

  // ---------- Live-updating metrics ----------
  const [metrics, setMetrics] = useState<MetricData[]>(() => [
    {
      label: "Gold Spot Price",
      sublabel: "XAU/USD",
      icon: TrendingUp,
      value: 2847.32,
      prevValue: 2847.32,
      format: (v) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      delta: 1.24,
      sparkline: generateSmoothData(12, 2820, 2860, 0.35),
      interval: 3000,
      rangeLow: 2830,
      rangeHigh: 2865,
      step: 0.8,
    },
    {
      label: "24h Volume",
      sublabel: "Global Markets",
      icon: BarChart3,
      value: 287.4,
      prevValue: 287.4,
      format: (v) => `$${v.toFixed(1)}B`,
      delta: 3.47,
      sparkline: generateSmoothData(12, 275, 295, 0.3),
      interval: 4000,
      rangeLow: 278,
      rangeHigh: 298,
      step: 1.5,
    },
    {
      label: "Market Cap",
      sublabel: "Total Gold",
      icon: Globe,
      value: 15.21,
      prevValue: 15.21,
      format: (v) => `$${v.toFixed(2)}T`,
      delta: 0.82,
      sparkline: generateSmoothData(12, 15.0, 15.4, 0.25),
      interval: 5000,
      rangeLow: 15.05,
      rangeHigh: 15.38,
      step: 0.03,
    },
    {
      label: "AI Confidence",
      sublabel: "Buy Signal",
      icon: Brain,
      value: 91,
      prevValue: 91,
      format: (v) => `${v.toFixed(1)}%`,
      delta: 2.1,
      sparkline: generateSmoothData(12, 87, 94, 0.3),
      interval: 6000,
      rangeLow: 87,
      rangeHigh: 94,
      step: 0.7,
    },
  ]);

  // Interval refs for cleanup
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const goldFetchRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch real gold price for the first metric
  useEffect(() => {
    if (!inView) return;

    const fetchGold = async () => {
      try {
        const res = await fetch("/api/gold-price");
        if (!res.ok) return;
        const data = await res.json();
        setMetrics((prev) => {
          const updated = [...prev];
          const m = { ...updated[0] };
          m.prevValue = m.value;
          m.value = data.price;
          m.delta = m.value - m.prevValue;
          m.sparkline = [...m.sparkline.slice(1), data.price];
          updated[0] = m;
          return updated;
        });
      } catch {
        // silently fall back to last known value
      }
    };

    fetchGold();
    goldFetchRef.current = setInterval(fetchGold, 5000);

    return () => {
      if (goldFetchRef.current) clearInterval(goldFetchRef.current);
    };
  }, [inView]);

  const updateMetric = useCallback((index: number) => {
    // Skip index 0 — gold spot price is fetched from real API
    if (index === 0) return;
    setMetrics((prev) => {
      const updated = [...prev];
      const m = { ...updated[index] };
      const change = (Math.random() - 0.45) * m.step * 2;
      m.prevValue = m.value;
      m.value = Math.max(m.rangeLow, Math.min(m.rangeHigh, m.value + change));
      m.delta += (Math.random() - 0.48) * 0.15;
      m.delta = Math.max(-5, Math.min(8, m.delta));
      // update sparkline – push new, shift old
      m.sparkline = [...m.sparkline.slice(1), m.value];
      updated[index] = m;
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!inView) return;

    // Start intervals for simulated metrics (skip index 0 — real data)
    intervalsRef.current = metrics.map((m, i) =>
      setInterval(() => updateMetric(i), m.interval)
    );

    return () => {
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, updateMetric]);

  // ---------- Fetch real price for chart display & history ----------
  useEffect(() => {
    if (!inView) return;

    const fetchRealPrice = async () => {
      try {
        const res = await fetch("/api/gold-price");
        if (!res.ok) return;
        const data = await res.json();
        const price: number = data.price;

        setRealPrice(price);

        if (openPriceRef.current === null) {
          openPriceRef.current = price;
        }

        setPriceHistory((prev) => {
          const next = [...prev, price];
          // Keep last 48 points to match chart data length
          return next.length > 48 ? next.slice(next.length - 48) : next;
        });
      } catch {
        // silently ignore – keep last known value
      }
    };

    fetchRealPrice();
    const id = setInterval(fetchRealPrice, 5000);

    return () => clearInterval(id);
  }, [inView]);

  // Animated pulse dot (live indicator)
  const [pulse, setPulse] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <SectionWrapper className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden" id="market-insights">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gold/[0.035] blur-[140px]"
          style={{ animation: "float 12s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-60 -right-40 w-[500px] h-[500px] rounded-full bg-gold-dark/[0.03] blur-[120px]"
          style={{ animation: "float 16s ease-in-out infinite reverse" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-gold/[0.015] blur-[100px]"
          style={{ animation: "float 10s ease-in-out infinite 3s" }}
        />
      </div>

      <div ref={sectionRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">
              Market Intelligence
            </p>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald/10 border border-emerald/20">
              <span
                className={`w-1.5 h-1.5 rounded-full bg-emerald transition-opacity duration-500 ${
                  pulse ? "opacity-100" : "opacity-30"
                }`}
              />
              <span className="text-[10px] text-emerald font-medium">LIVE</span>
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-4"
          >
            Real-time{" "}
            <span className="text-gradient">Gold Analytics</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted text-base sm:text-lg leading-relaxed"
          >
            AI-powered market intelligence delivering institutional-grade insights
            across global precious metals markets.
          </motion.p>
        </div>

        {/* Main dashboard card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative rounded-2xl bg-card/60 backdrop-blur-xl border border-line overflow-hidden"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-3 border-b border-line bg-elevated/30">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-gold/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald/70" />
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-[10px] sm:text-[11px] text-faint font-mono">XAU/USD</span>
              <span className="text-[10px] sm:text-[11px] text-faint font-mono hidden sm:inline">•</span>
              <span className="text-[10px] sm:text-[11px] text-faint font-mono hidden sm:inline">1Y</span>
              <span className="text-[10px] sm:text-[11px] text-faint font-mono hidden sm:inline">•</span>
              <span className="text-[10px] sm:text-[11px] text-muted font-mono hidden sm:inline">
                Fine Gold Intelligence™
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full bg-emerald transition-opacity duration-500 ${
                  pulse ? "opacity-100" : "opacity-30"
                }`}
              />
              <span className="text-[10px] text-emerald font-medium">
                Connected
              </span>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px]">
            {/* Chart area */}
            <div ref={chartRef} className="p-4 sm:p-6 pb-2">
              {/* Price label */}
              <div className="flex items-baseline gap-2 sm:gap-3 mb-4 flex-wrap">
                <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight tabular-nums">
                  ${(realPrice ?? chartData[chartData.length - 1]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {(() => {
                  const open = openPriceRef.current ?? chartData[0];
                  const current = realPrice ?? chartData[chartData.length - 1];
                  const pctChange = ((current - open) / open) * 100;
                  return (
                    <span className={`text-sm font-semibold ${pctChange >= 0 ? "text-emerald" : "text-red"}`}>
                      {pctChange >= 0 ? "+" : ""}{pctChange.toFixed(2)}%
                    </span>
                  );
                })()}
                <span className="text-faint text-xs">1Y</span>
              </div>

              {/* SVG Chart */}
              <div className="relative w-full" style={{ aspectRatio: `${CHART_WIDTH}/${CHART_HEIGHT}` }}>
                <svg
                  viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    {/* Gradient fill below line */}
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C8A960" stopOpacity={0.2} />
                      <stop offset="50%" stopColor="#C8A960" stopOpacity={0.06} />
                      <stop offset="100%" stopColor="#C8A960" stopOpacity={0} />
                    </linearGradient>
                    {/* Line glow filter */}
                    <filter id="lineGlow" x="-10%" y="-10%" width="120%" height="120%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    {/* Dot glow */}
                    <radialGradient id="dotGlow">
                      <stop offset="0%" stopColor="#C8A960" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#C8A960" stopOpacity={0} />
                    </radialGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {yLabels.map((_, i) => {
                    const usableH = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
                    const y = CHART_PADDING.top + usableH - (i / 4) * usableH;
                    return (
                      <line
                        key={i}
                        x1={CHART_PADDING.left}
                        y1={y}
                        x2={CHART_WIDTH - CHART_PADDING.right}
                        y2={y}
                        stroke="#1E1E26"
                        strokeWidth={0.5}
                        strokeDasharray="4 4"
                      />
                    );
                  })}

                  {/* Area fill – fades in after line draws */}
                  <motion.path
                    d={chartAreaPath}
                    fill="url(#chartFill)"
                    initial={{ opacity: 0 }}
                    animate={chartInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 1.6 }}
                  />

                  {/* Main price line with glow */}
                  <motion.path
                    d={chartLinePath}
                    fill="none"
                    stroke="#C8A960"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#lineGlow)"
                    initial={{ pathLength: 0 }}
                    animate={chartInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />

                  {/* Current price dot (pulsing) at end of line */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={chartInView ? { opacity: 1 } : {}}
                    transition={{ delay: 2.1 }}
                  >
                    {(() => {
                      const lastIdx = chartData.length - 1;
                      const min = Math.min(...chartData);
                      const max = Math.max(...chartData);
                      const range = max - min || 1;
                      const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
                      const usableHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
                      const cx = CHART_PADDING.left + (lastIdx / (chartData.length - 1)) * plotWidth;
                      const cy = CHART_PADDING.top + usableHeight - ((chartData[lastIdx] - min) / range) * usableHeight;
                      return (
                        <>
                          <circle cx={cx} cy={cy} r={16} fill="url(#dotGlow)">
                            <animate
                              attributeName="r"
                              values="12;18;12"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.5;0.2;0.5"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle cx={cx} cy={cy} r={4} fill="#C8A960" />
                          <circle cx={cx} cy={cy} r={2} fill="#FFF" />
                        </>
                      );
                    })()}
                  </motion.g>

                  {/* Y axis labels */}
                  {yLabels.map((label, i) => {
                    const usableH = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
                    const y = CHART_PADDING.top + usableH - (i / 4) * usableH;
                    return (
                      <text
                        key={i}
                        x={CHART_PADDING.left - 8}
                        y={y + 4}
                        fill="#5A5A70"
                        fontSize={10}
                        textAnchor="end"
                        fontFamily="var(--font-body)"
                      >
                        ${label.toLocaleString()}
                      </text>
                    );
                  })}

                  {/* X axis labels (months) */}
                  {chartMonths.map((month, i) => {
                    const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
                    const x = CHART_PADDING.left + (i / (chartMonths.length - 1)) * plotWidth;
                    return (
                      <text
                        key={month}
                        x={x}
                        y={CHART_HEIGHT - 10}
                        fill="#5A5A70"
                        fontSize={10}
                        textAnchor="middle"
                        fontFamily="var(--font-body)"
                      >
                        {month}
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* Volume bars */}
              <VolumeBars inView={chartInView} />

              {/* Volume label */}
              <p className="text-[10px] text-faint mt-1 px-1">
                Volume (24h)
              </p>
            </div>

            {/* Metrics sidebar */}
            <div className="p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-line">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-display font-semibold text-muted">
                  Key Metrics
                </h3>
                <span className="text-[10px] text-faint">Auto-updating</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {metrics.map((metric, i) => (
                  <MetricCard
                    key={metric.label}
                    metric={metric}
                    index={i}
                    inView={inView}
                  />
                ))}
              </div>

              {/* AI Summary callout */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="mt-4 rounded-xl bg-gold/[0.04] border border-gold/10 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={14} className="text-gold" />
                  <span className="text-xs font-semibold text-gold">AI Insight</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {realPrice ? (
                    <>
                      XAU/USD trading at ${realPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.
                      {" "}Strong institutional activity detected with support holding at ${(Math.floor((realPrice - 30) / 10) * 10).toLocaleString("en-US")}.
                    </>
                  ) : (
                    <>
                      Strong bullish momentum detected across major exchanges.
                      Institutional inflows up 12.4% week-over-week.
                    </>
                  )}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Data stream */}
          <div className="border-t border-line px-4 sm:px-6 pb-3 pt-1">
            <DataStream />
          </div>
        </motion.div>
      </div>

      {/* Data stream keyframe — injected as global style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes data-stream {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}} />
    </SectionWrapper>
  );
}
