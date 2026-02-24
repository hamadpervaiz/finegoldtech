"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  Newspaper,
  Link,
  Database,
  Activity,
} from "lucide-react";
import SectionWrapper from "./section-wrapper";

/* ──────────────────────────────────────────────────────────────────────
   CONSTANTS — node positions, connections, data feed cards
   ────────────────────────────────────────────────────────────────────── */

interface NetworkNode {
  id: number;
  cx: number;
  cy: number;
  r: number;
  delay: number;
}

interface NetworkConnection {
  from: number;
  to: number;
}

// 15 manually-placed nodes in a pleasing neural-network arrangement
// Coordinates are within a 440x340 SVG viewBox
const NETWORK_NODES: NetworkNode[] = [
  // Input layer (left)
  { id: 0, cx: 60, cy: 60, r: 5, delay: 0 },
  { id: 1, cx: 50, cy: 140, r: 4, delay: 0.8 },
  { id: 2, cx: 65, cy: 220, r: 5, delay: 1.6 },
  { id: 3, cx: 55, cy: 290, r: 4, delay: 0.4 },
  // Hidden layer 1
  { id: 4, cx: 160, cy: 90, r: 7, delay: 1.2 },
  { id: 5, cx: 150, cy: 170, r: 6, delay: 2.0 },
  { id: 6, cx: 165, cy: 250, r: 7, delay: 0.6 },
  // Hidden layer 2 — key processing hubs (larger)
  { id: 7, cx: 260, cy: 70, r: 8, delay: 1.8 },
  { id: 8, cx: 250, cy: 165, r: 9, delay: 0.3 },
  { id: 9, cx: 265, cy: 260, r: 8, delay: 1.4 },
  // Hidden layer 3
  { id: 10, cx: 340, cy: 110, r: 6, delay: 2.2 },
  { id: 11, cx: 335, cy: 200, r: 7, delay: 0.9 },
  { id: 12, cx: 345, cy: 280, r: 5, delay: 1.6 },
  // Output layer (right)
  { id: 13, cx: 415, cy: 145, r: 6, delay: 1.0 },
  { id: 14, cx: 420, cy: 230, r: 5, delay: 2.4 },
];

const NETWORK_CONNECTIONS: NetworkConnection[] = [
  // Input → Hidden 1
  { from: 0, to: 4 },
  { from: 0, to: 5 },
  { from: 1, to: 4 },
  { from: 1, to: 5 },
  { from: 1, to: 6 },
  { from: 2, to: 5 },
  { from: 2, to: 6 },
  { from: 3, to: 6 },
  { from: 3, to: 5 },
  // Hidden 1 → Hidden 2
  { from: 4, to: 7 },
  { from: 4, to: 8 },
  { from: 5, to: 7 },
  { from: 5, to: 8 },
  { from: 5, to: 9 },
  { from: 6, to: 8 },
  { from: 6, to: 9 },
  // Hidden 2 → Hidden 3
  { from: 7, to: 10 },
  { from: 7, to: 11 },
  { from: 8, to: 10 },
  { from: 8, to: 11 },
  { from: 8, to: 12 },
  { from: 9, to: 11 },
  { from: 9, to: 12 },
  // Hidden 3 → Output
  { from: 10, to: 13 },
  { from: 10, to: 14 },
  { from: 11, to: 13 },
  { from: 11, to: 14 },
  { from: 12, to: 14 },
];

interface DataFeedCard {
  label: string;
  icon: React.ReactNode;
  delay: number;
}

const DATA_FEED_CARDS: DataFeedCard[] = [
  { label: "Market Data", icon: <BarChart3 size={14} />, delay: 0 },
  { label: "News Sentiment", icon: <Newspaper size={14} />, delay: 1 },
  { label: "On-Chain Data", icon: <Link size={14} />, delay: 2 },
  { label: "Historical Patterns", icon: <Database size={14} />, delay: 3 },
];

interface PatternItem {
  name: string;
  confidence: number;
  shape: string; // SVG path for tiny chart icon
  type: string;
}

const PATTERN_SHAPES: Record<string, string> = {
  "Double Bottom": "M2,12 L6,4 L10,12 L14,4 L18,8",
  "Ascending Triangle": "M2,14 L6,10 L10,14 L14,8 L18,6",
  "Support Level Hold": "M2,8 L6,6 L10,10 L14,8 L18,8",
  "Strong Uptrend": "M2,14 L6,11 L10,8 L14,5 L18,2",
  "Bearish Divergence": "M2,4 L6,6 L10,5 L14,8 L18,10",
  "Consolidation Range": "M2,8 L6,7 L10,9 L14,7 L18,8",
};

const DEFAULT_PATTERNS: PatternItem[] = [
  { name: "Double Bottom", confidence: 94, shape: PATTERN_SHAPES["Double Bottom"], type: "bullish" },
  { name: "Ascending Triangle", confidence: 87, shape: PATTERN_SHAPES["Ascending Triangle"], type: "bullish" },
  { name: "Support Level Hold", confidence: 91, shape: PATTERN_SHAPES["Support Level Hold"], type: "bullish" },
];

// Shared analysis state — fetched by the main component and passed down
interface AnalysisData {
  sentiment: number;
  sentimentLabel: string;
  patterns: { name: string; confidence: number; type: string }[];
  forecastLow: number;
  forecastHigh: number;
  forecastConfidence: number;
  riskScore: number;
  riskLevel: string;
  signalsAnalyzed: number;
  dataPoints: number;
  currentPrice: number;
  trend: string;
  rsi: number | null;
  support: number | null;
  resistance: number | null;
  volatilityLevel: string;
}

/* ──────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
   ────────────────────────────────────────────────────────────────────── */

/** Animated counter that counts from 0 to target */
function InlineCounter({
  target,
  decimals = 0,
  duration = 2,
  prefix = "",
  suffix = "",
  inView,
}: {
  target: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  inView: boolean;
}) {
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => {
    const formatted = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, target, { duration, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, target, count, duration]);

  return <motion.span>{display}</motion.span>;
}

/** LIVE processing indicator with pulsing dot + real gold price */
function LiveIndicator({ inView, dataPoints }: { inView: boolean; dataPoints: number }) {
  const signalCount = useMotionValue(2.4);
  const display = useTransform(signalCount, (v) => `${v.toFixed(1)}M signals/sec`);
  const [realPrice, setRealPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      const current = signalCount.get();
      const next = current + (Math.random() - 0.4) * 0.1;
      const clamped = Math.max(2.1, Math.min(2.8, next));
      animate(signalCount, clamped, { duration: 0.8, ease: "easeInOut" });
    }, 2000);

    return () => clearInterval(interval);
  }, [inView, signalCount]);

  useEffect(() => {
    let active = true;
    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/gold-price");
        if (!res.ok) return;
        const data = await res.json();
        if (active) setRealPrice(data.price);
      } catch { /* silent */ }
    };
    fetchPrice();
    const id = setInterval(fetchPrice, 10000);
    return () => { active = false; clearInterval(id); };
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 bg-emerald/10 border border-emerald/20 rounded-full px-2.5 py-1">
        <motion.div
          className="w-2 h-2 rounded-full bg-emerald"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <span className="text-emerald text-[10px] font-semibold tracking-wider uppercase">
          Live
        </span>
      </div>
      <span className="text-faint text-xs font-body tabular-nums">
        Processing <motion.span>{display}</motion.span>
        {dataPoints > 0 && (
          <span className="text-faint ml-1">({dataPoints} pts)</span>
        )}
      </span>
      {realPrice && (
        <span className="text-[11px] text-muted font-mono tabular-nums hidden sm:inline">
          XAU/USD ${realPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      )}
    </div>
  );
}

/** AI Neural Network SVG Visualization */
function NeuralNetwork() {
  return (
    <svg
      viewBox="0 0 440 340"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gold glow filter for nodes */}
        <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Larger glow for hub nodes */}
        <filter id="hubGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C8A960" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#C8A960" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C8A960" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Connection lines with animated dashes */}
      {NETWORK_CONNECTIONS.map((conn, i) => {
        const fromNode = NETWORK_NODES[conn.from];
        const toNode = NETWORK_NODES[conn.to];
        return (
          <motion.line
            key={`conn-${i}`}
            x1={fromNode.cx}
            y1={fromNode.cy}
            x2={toNode.cx}
            y2={toNode.cy}
            stroke="url(#connectionGrad)"
            strokeWidth={1}
            strokeDasharray="4 6"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -40 }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.15,
            }}
          />
        );
      })}

      {/* Network nodes with staggered pulsing */}
      {NETWORK_NODES.map((node) => {
        const isHub = node.r >= 8;
        return (
          <motion.circle
            key={`node-${node.id}`}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="#C8A960"
            fillOpacity={isHub ? 0.7 : 0.5}
            filter={isHub ? "url(#hubGlow)" : "url(#nodeGlow)"}
            animate={{
              r: [node.r, node.r * 1.15, node.r],
              fillOpacity: isHub
                ? [0.7, 1, 0.7]
                : [0.5, 0.85, 0.5],
            }}
            transition={{
              duration: 2 + (node.id % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: node.delay,
            }}
          />
        );
      })}

      {/* Subtle inner glow rings on hub nodes */}
      {NETWORK_NODES.filter((n) => n.r >= 7).map((node) => (
        <motion.circle
          key={`ring-${node.id}`}
          cx={node.cx}
          cy={node.cy}
          r={node.r + 6}
          fill="none"
          stroke="#C8A960"
          strokeWidth={0.5}
          animate={{
            r: [node.r + 6, node.r + 10, node.r + 6],
            strokeOpacity: [0.2, 0.05, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: node.delay + 0.5,
          }}
        />
      ))}
    </svg>
  );
}

/** Floating data feed cards that drift toward the AI network */
function DataFeedAnimation() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {DATA_FEED_CARDS.map((card, i) => (
        <motion.div
          key={card.label}
          className="absolute left-0 flex items-center gap-2 bg-elevated/80 border border-line rounded-lg px-3 py-2 backdrop-blur-sm"
          style={{ top: `${15 + i * 22}%` }}
          animate={{
            x: [-20, 180],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            delay: card.delay,
            times: [0, 0.15, 0.75, 1],
          }}
        >
          <div className="text-gold">{card.icon}</div>
          <span className="text-[11px] text-muted whitespace-nowrap font-body">
            {card.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/** Semi-circular gauge for market sentiment — driven by real analysis */
function SentimentGauge({ analysis }: { analysis: AnalysisData | null; inView?: boolean }) {
  // Position 0-1 derived from real sentiment score (0-100)
  const position = analysis ? analysis.sentiment / 100 : 0.65;

  // SVG arc math
  const centerX = 100;
  const centerY = 95;
  const radius = 70;
  const startAngle = Math.PI;
  const endAngle = 0;

  const arcStartX = centerX + radius * Math.cos(startAngle);
  const arcStartY = centerY - radius * Math.sin(startAngle);
  const arcEndX = centerX + radius * Math.cos(endAngle);
  const arcEndY = centerY - radius * Math.sin(endAngle);
  const arcPath = `M ${arcStartX} ${arcStartY} A ${radius} ${radius} 0 0 1 ${arcEndX} ${arcEndY}`;

  const needleAngle = Math.PI - position * Math.PI;
  const needleLength = radius - 10;
  const needleTipX = centerX + needleLength * Math.cos(needleAngle);
  const needleTipY = centerY - needleLength * Math.sin(needleAngle);

  return (
    <div>
      <p className="text-[11px] text-faint uppercase tracking-wider mb-2 font-body">
        Market Sentiment
      </p>
      <svg viewBox="0 0 200 110" className="w-full max-w-[200px]">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="50%" stopColor="#A0A0B8" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d={arcPath}
          stroke="#1E1E26"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
        />

        {/* Colored gauge */}
        <path
          d={arcPath}
          stroke="url(#gaugeGrad)"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          strokeOpacity={0.7}
        />

        {/* Needle */}
        <motion.line
          x1={centerX}
          y1={centerY}
          animate={{
            x2: needleTipX,
            y2: needleTipY,
          }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          stroke="#C8A960"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Needle center dot */}
        <circle cx={centerX} cy={centerY} r={4} fill="#C8A960" />

        {/* Labels */}
        <text x="20" y="108" fill="#F87171" fontSize="8" fontFamily="var(--font-body)">
          Bearish
        </text>
        <text
          x="100"
          y="108"
          fill="#A0A0B8"
          fontSize="8"
          textAnchor="middle"
          fontFamily="var(--font-body)"
        >
          Neutral
        </text>
        <text
          x="180"
          y="108"
          fill="#34D399"
          fontSize="8"
          textAnchor="end"
          fontFamily="var(--font-body)"
        >
          Bullish
        </text>
      </svg>
      <motion.p
        className={`text-sm font-semibold font-display mt-1 ${
          (analysis?.sentimentLabel ?? "Bullish") === "Bullish"
            ? "text-emerald"
            : (analysis?.sentimentLabel ?? "Neutral") === "Neutral"
              ? "text-muted"
              : "text-red"
        }`}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {analysis?.sentimentLabel ?? "Analyzing..."}
        {analysis?.rsi !== null && analysis?.rsi !== undefined && (
          <span className="text-faint text-[10px] font-normal ml-2">RSI {analysis.rsi}</span>
        )}
      </motion.p>
    </div>
  );
}

/** Pattern Recognition cards with animated confidence bars */
function PatternRecognition({ inView, analysis }: { inView: boolean; analysis: AnalysisData | null }) {
  const patterns: PatternItem[] = analysis
    ? analysis.patterns.map((p) => ({
        name: p.name,
        confidence: p.confidence,
        shape: PATTERN_SHAPES[p.name] || "M2,8 L6,7 L10,9 L14,7 L18,8",
        type: p.type,
      }))
    : DEFAULT_PATTERNS;

  return (
    <div>
      <p className="text-[11px] text-faint uppercase tracking-wider mb-3 font-body">
        Pattern Recognition
      </p>
      <div className="flex flex-col gap-2">
        {patterns.map((pattern, i) => (
          <motion.div
            key={pattern.name}
            className="flex items-center gap-3 bg-bg/50 rounded-lg px-3 py-2 border border-line/50"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.2, ease: "easeOut" }}
          >
            {/* Tiny chart icon */}
            <svg
              viewBox="0 0 20 16"
              className="w-5 h-4 shrink-0"
              fill="none"
              stroke="#C8A960"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={pattern.shape} />
            </svg>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-fg/90 truncate font-body">
                  {pattern.name}
                </span>
                <span className="text-[10px] text-gold font-semibold tabular-nums ml-2">
                  {pattern.confidence}%
                </span>
              </div>
              {/* Confidence bar */}
              <div className="h-1 bg-line rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold"
                  initial={{ width: "0%" }}
                  animate={inView ? { width: `${pattern.confidence}%` } : {}}
                  transition={{
                    duration: 1,
                    delay: 0.5 + i * 0.2,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** 24h Price Prediction panel — driven by real analysis */
function PricePrediction({ inView, analysis }: { inView: boolean; analysis: AnalysisData | null }) {
  const low = analysis?.forecastLow ?? null;
  const high = analysis?.forecastHigh ?? null;
  const confidence = analysis?.forecastConfidence ?? 82;
  const signals = analysis?.signalsAnalyzed ?? 0;
  const trend = analysis?.trend ?? "neutral";

  return (
    <div>
      <p className="text-[11px] text-faint uppercase tracking-wider mb-2 font-body">
        24h Forecast
      </p>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-fg text-lg font-display font-bold tracking-tight tabular-nums">
          {low !== null && high !== null
            ? `$${low.toLocaleString("en-US")} – $${high.toLocaleString("en-US")}`
            : "Collecting data..."}
        </span>
        <motion.div
          className={trend === "bearish" ? "text-red" : "text-emerald"}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <TrendingUp size={18} />
        </motion.div>
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-muted text-xs font-body">Confidence:</span>
        <span className="text-gold text-sm font-semibold tabular-nums">
          <InlineCounter target={confidence} suffix="%" duration={2} inView={inView} />
        </span>
      </div>
      <p className="text-faint text-[10px] font-body">
        Based on{" "}
        <span className="text-muted tabular-nums">
          <InlineCounter target={signals} duration={2} inView={inView} />
        </span>{" "}
        market signals
      </p>
    </div>
  );
}

/** Risk Assessment horizontal bar */
function RiskAssessment({ inView, analysis }: { inView: boolean; analysis: AnalysisData | null }) {
  // Real risk score mapped to position (0-100%)
  const indicatorPosition = analysis?.riskScore ?? 33;

  return (
    <div>
      <p className="text-[11px] text-faint uppercase tracking-wider mb-3 font-body">
        Risk Assessment
      </p>
      <div className="relative">
        {/* Segmented bar */}
        <div className="flex h-2.5 rounded-full overflow-hidden">
          <motion.div
            className="flex-1 bg-gradient-to-r from-emerald to-emerald/70"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />
          <motion.div
            className="flex-1 bg-gradient-to-r from-yellow-400/70 to-yellow-500/70"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />
          <motion.div
            className="flex-1 bg-gradient-to-r from-red/70 to-red"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* Indicator */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${indicatorPosition}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            inView
              ? { opacity: 1, scale: 1 }
              : {}
          }
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.div
            className="w-4 h-4 rounded-full bg-fg border-2 border-emerald"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(52,211,153,0.4)",
                "0 0 0 6px rgba(52,211,153,0)",
                "0 0 0 0 rgba(52,211,153,0.4)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Labels */}
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-emerald font-body">Low</span>
          <span className="text-[10px] text-yellow-400 font-body">Medium</span>
          <span className="text-[10px] text-red font-body">High</span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────────────────────────────── */

export default function AIDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  // Fetch real AI analysis from the technical analysis engine
  useEffect(() => {
    let active = true;
    const fetchAnalysis = async () => {
      try {
        const res = await fetch("/api/ai-analysis");
        if (!res.ok) return;
        const data = await res.json();
        if (active && !data.error) setAnalysis(data);
      } catch { /* silent */ }
    };
    fetchAnalysis();
    const id = setInterval(fetchAnalysis, 5000);
    return () => { active = false; clearInterval(id); };
  }, []);

  return (
    <SectionWrapper className="py-16 sm:py-20 md:py-24 lg:py-32" id="ai-analysis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <div className="text-center mb-10 sm:mb-16">
          <motion.p
            className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Intelligence Engine
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            AI-Powered{" "}
            <span className="text-gradient">Analysis</span>
          </motion.h2>
          <motion.p
            className="text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-body"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Deep learning models processing millions of data points in real-time
          </motion.p>
        </div>

        {/* Glass card container */}
        <motion.div
          ref={containerRef}
          className="relative glass-card rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Background gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gold/[0.04] rounded-full blur-[100px]" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold-dark/[0.03] rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/[0.015] rounded-full blur-[150px]" />
          </div>

          {/* LIVE indicator bar */}
          <div className="relative flex items-center justify-between px-4 sm:px-6 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-gold" />
              <span className="text-xs font-display font-semibold text-fg/80">
                AI Analysis Engine
              </span>
            </div>
            <LiveIndicator inView={inView} dataPoints={analysis?.dataPoints ?? 0} />
          </div>

          {/* Thin separator */}
          <div className="mx-4 sm:mx-6 h-px bg-line" />

          {/* Main content — two-column layout */}
          <div className="relative grid grid-cols-1 lg:grid-cols-[55%_45%] gap-0 lg:min-h-[420px]">
            {/* Left: Data feed + Neural Network */}
            <div className="relative p-4 sm:p-6 flex items-center hidden sm:flex">
              {/* Data feed cards animating from left */}
              <div className="absolute left-0 top-0 bottom-0 w-[180px] z-10 hidden md:block">
                <DataFeedAnimation />
              </div>

              {/* Neural network visualization */}
              <div className="w-full md:pl-16 max-w-md mx-auto lg:max-w-none">
                <NeuralNetwork />
              </div>
            </div>

            {/* Vertical separator on desktop */}
            <div className="hidden lg:block absolute left-[55%] top-[60px] bottom-6 w-px bg-line" />

            {/* Right: Analysis Metrics */}
            <div className="p-4 sm:p-6 lg:pl-8 flex flex-col gap-6 border-t lg:border-t-0 border-line">
              {/* Sentiment Gauge */}
              <SentimentGauge analysis={analysis} inView={inView} />

              {/* Separator */}
              <div className="h-px bg-line" />

              {/* Pattern Recognition */}
              <PatternRecognition inView={inView} analysis={analysis} />

              {/* Separator */}
              <div className="h-px bg-line" />

              {/* Price Prediction + Risk Assessment side by side */}
              <div className="grid sm:grid-cols-2 gap-6">
                <PricePrediction inView={inView} analysis={analysis} />
                <RiskAssessment inView={inView} analysis={analysis} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
