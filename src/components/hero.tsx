"use client";

import { motion } from "framer-motion";
import GoldButton from "./gold-button";
import LiveTicker from "./live-ticker";

const words = ["The", "Future", "of", "Gold", "is", "Intelligent"];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-24">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full bg-gold/[0.05] blur-[120px] animate-pulse" />
        <div
          className="absolute top-1/4 left-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] rounded-full bg-gold-dark/[0.04] blur-[100px]"
          style={{ animation: "float 8s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[150px] md:w-[300px] h-[150px] md:h-[300px] rounded-full bg-gold/[0.03] blur-[80px]"
          style={{ animation: "float 10s ease-in-out infinite reverse" }}
        />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(160,160,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(160,160,184,0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Live Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <LiveTicker />
        </motion.div>

        {/* Headline — word by word */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter leading-[1] mb-8">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
              className={`inline-block mr-[0.25em] ${
                word === "Gold" ? "text-gradient" : ""
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          AI-powered analytics, blockchain provenance, and enterprise platforms
          that redefine how the world trades, tracks, and invests in precious
          metals.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <GoldButton href="/products">Explore Products</GoldButton>
          <GoldButton href="/contact" variant="outline">
            Get in Touch
          </GoldButton>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-line-bold flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-gold/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
