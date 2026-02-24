"use client";

import { Brain, Shield, BarChart3, ArrowUpRight, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import SectionWrapper from "./section-wrapper";

const products = [
  {
    icon: <Brain size={28} />,
    name: "Fine Gold Intelligence",
    tagline: "AI-Powered Analytics",
    description:
      "Harness artificial intelligence for unparalleled market insights, predictive modeling, and real-time analytics across global precious metals markets.",
    href: "/products#intelligence",
    features: [
      "Predictive price modeling",
      "Real-time market data",
      "Risk assessment engine",
      "Custom dashboards",
    ],
  },
  {
    icon: <Shield size={28} />,
    name: "Fine Gold Ledger",
    tagline: "Blockchain Provenance",
    description:
      "Complete supply chain transparency with immutable records, compliance automation, and digital certification.",
    href: "/products#ledger",
    features: [
      "Immutable audit trails",
      "Supply chain verification",
      "Digital certificates",
    ],
  },
  {
    icon: <BarChart3 size={28} />,
    name: "Fine Gold Platforms",
    tagline: "Enterprise Trading",
    description:
      "Institutional-grade trading and investment platforms built for performance, security, and scale.",
    href: "/products#platforms",
    features: [
      "Trading engine",
      "Portfolio management",
      "API-first architecture",
    ],
  },
];

function GlowCard({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setGlowPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    []
  );

  return (
    <Link
      href={href}
      className={`group block h-full rounded-2xl bg-card border border-line hover:border-line-bold transition-all duration-500 relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(200,169,96,0.06), transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </Link>
  );
}

function MiniSparkline({ data, color = "#C8A960" }: { data: number[]; color?: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function MiniDashboard() {
  const [price, setPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [analysis, setAnalysis] = useState<{
    rsi: number | null;
    sentiment: number;
    sentimentLabel: string;
    trend: string;
    volatilityLevel: string;
    support: number | null;
    resistance: number | null;
  } | null>(null);
  const prevRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const [priceRes, analysisRes] = await Promise.all([
          fetch("/api/gold-price"),
          fetch("/api/ai-analysis"),
        ]);
        if (priceRes.ok && active) {
          const data = await priceRes.json();
          setPrevPrice(prevRef.current);
          setPrice(data.price);
          prevRef.current = data.price;
          setHistory((h) => [...h.slice(-19), data.price]);
        }
        if (analysisRes.ok && active) {
          const data = await analysisRes.json();
          if (!data.error) setAnalysis(data);
        }
      } catch { /* silent */ }
    };
    fetchData();
    const id = setInterval(fetchData, 5000);
    return () => { active = false; clearInterval(id); };
  }, []);

  const change = price && prevPrice ? price - prevPrice : 0;

  return (
    <div className="mt-auto rounded-xl bg-bg/60 border border-line p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-gold" />
          <span className="text-[10px] text-muted font-medium uppercase tracking-wider">Live Preview</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
          <span className="text-[10px] text-emerald font-medium">Connected</span>
        </div>
      </div>

      {/* Price + Sparkline */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-faint uppercase tracking-wider mb-0.5">XAU/USD</p>
          <p className="text-lg font-display font-bold tabular-nums">
            {price ? `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "Loading..."}
          </p>
          {change !== 0 && (
            <p className={`text-[11px] font-medium tabular-nums flex items-center gap-1 ${change >= 0 ? "text-emerald" : "text-red"}`}>
              <TrendingUp size={10} />
              {change >= 0 ? "+" : ""}{change.toFixed(2)}
            </p>
          )}
        </div>
        <MiniSparkline data={history} color={change >= 0 ? "#34D399" : "#F87171"} />
      </div>

      {/* Analysis Metrics Row */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line">
        <div>
          <p className="text-[9px] text-faint uppercase tracking-wider">Sentiment</p>
          <p className={`text-xs font-semibold ${
            analysis?.sentimentLabel === "Bullish" ? "text-emerald" :
            analysis?.sentimentLabel === "Bearish" ? "text-red" : "text-muted"
          }`}>
            {analysis?.sentimentLabel ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-faint uppercase tracking-wider">RSI</p>
          <p className="text-xs font-semibold text-fg tabular-nums">
            {analysis?.rsi ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-faint uppercase tracking-wider">Volatility</p>
          <p className="text-xs font-semibold text-fg capitalize">
            {analysis?.volatilityLevel ?? "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProductsBento() {
  return (
    <SectionWrapper className="py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10 sm:mb-16">
          <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            Products
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Three platforms.
            <br />
            <span className="text-gradient">One vision.</span>
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed">
            Comprehensive technology solutions designed to modernize every facet
            of the precious metals industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:row-span-2"
          >
            <GlowCard href={products[0].href} className="p-5 sm:p-6 md:p-8 lg:p-10">
              <div className="relative flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-6">
                  {products[0].icon}
                </div>
                <p className="text-xs text-gold font-medium tracking-wider uppercase mb-2">
                  {products[0].tagline}
                </p>
                <h3 className="text-2xl font-display font-bold mb-3 flex items-center gap-2">
                  {products[0].name}
                  <ArrowUpRight
                    size={20}
                    className="text-faint group-hover:text-fg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </h3>
                <p className="text-muted leading-relaxed mb-6 text-sm sm:text-base">
                  {products[0].description}
                </p>

                {/* Live Mini Dashboard Preview */}
                <MiniDashboard />
              </div>
            </GlowCard>
          </motion.div>

          {products.slice(1).map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i + 1) * 0.15 }}
            >
              <GlowCard href={product.href} className="p-5 sm:p-6 md:p-8">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-6">
                    {product.icon}
                  </div>
                  <p className="text-xs text-gold font-medium tracking-wider uppercase mb-2">
                    {product.tagline}
                  </p>
                  <h3 className="text-xl font-display font-bold mb-3 flex items-center gap-2">
                    {product.name}
                    <ArrowUpRight
                      size={16}
                      className="text-faint group-hover:text-fg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-6">
                    {product.description}
                  </p>
                  <ul className="space-y-2">
                    {product.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-xs text-muted"
                      >
                        <span className="w-1 h-1 rounded-full bg-muted shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
