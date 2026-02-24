"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Globe, Cpu, Shield, Zap } from "lucide-react";
import Link from "next/link";
import SectionWrapper from "./section-wrapper";
import GoldButton from "./gold-button";

const stats = [
  { value: 3, suffix: "+", label: "Global Offices", icon: Globe },
  { value: 3, suffix: "", label: "Core Platforms", icon: Cpu },
  { value: 12, prefix: "$", suffix: "T+", label: "Market Served", icon: Zap },
  { value: 99.9, suffix: "%", label: "Uptime SLA", icon: Shield },
];

const highlights = [
  { label: "AI-powered analytics", href: "/products#intelligence" },
  { label: "Blockchain provenance", href: "/products#ledger" },
  { label: "Real-time trading", href: "/products#platforms" },
  { label: "Enterprise security", href: "/about" },
];

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Number(current.toFixed(1)));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {Number.isInteger(value) ? Math.round(display) : display.toFixed(1)}
      {suffix}
    </span>
  );
}

export default function AboutPreview() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [2, -2]);

  return (
    <SectionWrapper className="py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6" ref={containerRef}>
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4"
          >
            About Fine Gold
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tighter mb-6"
          >
            Built for the future of{" "}
            <span className="text-gradient">gold</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            We combine deep industry expertise with advanced AI, blockchain, and
            cloud technologies — operating across three continents to transform
            the precious metals industry.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={i % 2 === 1 ? { y: y1 } : undefined}
                  className="group relative bg-card border border-line rounded-2xl p-5 sm:p-6 md:p-8 hover:border-line-bold transition-colors duration-300 overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-elevated flex items-center justify-center mb-4 sm:mb-6">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                    </div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight mb-1">
                      <AnimatedNumber
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    </p>
                    <p className="text-xs sm:text-sm text-muted">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Feature Highlights + CTA */}
          <motion.div style={{ y: y2, rotate }}>
            <div className="bg-card border border-line rounded-2xl overflow-hidden">
              {/* Card Header */}
              <div className="p-5 sm:p-6 md:p-8 border-b border-line">
                <h3 className="text-lg sm:text-xl font-display font-semibold mb-2">
                  What we bring
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Enterprise-grade technology stack purpose-built for the
                  precious metals ecosystem.
                </p>
              </div>

              {/* Highlights List */}
              <div className="divide-y divide-line">
                {highlights.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between px-5 sm:px-6 md:px-8 py-4 sm:py-5 hover:bg-elevated/50 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                        <span className="text-sm sm:text-base font-medium">
                          {item.label}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-faint group-hover:text-fg group-hover:translate-x-1 transition-all duration-200" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="p-5 sm:p-6 md:p-8 bg-elevated/30">
                <GoldButton href="/about" variant="outline">
                  Learn Our Story
                </GoldButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
