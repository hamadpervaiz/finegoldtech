"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function LiveTicker() {
  const [price, setPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const prevRef = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/gold-price");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!active) return;

        setPrevPrice(prevRef.current);
        setPrice(data.price);
        prevRef.current = data.price;
        setError(false);
      } catch {
        if (active) setError(true);
      }
    };

    fetchPrice();
    const id = setInterval(fetchPrice, 5000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  if (price === null) {
    return (
      <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full border border-line bg-card/80 backdrop-blur-sm text-xs sm:text-sm">
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
        <span className="text-xs text-muted font-medium">XAU/USD</span>
        <span className="text-sm sm:text-base font-display font-bold text-muted">
          Loading...
        </span>
      </div>
    );
  }

  const change = prevPrice !== null ? price - prevPrice : 0;
  const direction = change >= 0 ? "up" : "down";

  return (
    <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full border border-line bg-card/80 backdrop-blur-sm text-xs sm:text-sm max-w-full">
      <span
        className={`w-2 h-2 rounded-full ${error ? "bg-red" : "bg-emerald"} animate-pulse`}
      />
      <span className="text-xs text-muted font-medium">XAU/USD</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={price.toFixed(2)}
          initial={{ y: direction === "up" ? 8 : -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction === "up" ? -8 : 8, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="text-sm sm:text-base font-display font-bold tabular-nums"
        >
          ${price.toFixed(2)}
        </motion.span>
      </AnimatePresence>
      {prevPrice !== null && change !== 0 ? (
        <span
          className={`flex items-center gap-1 text-xs font-medium tabular-nums ${
            change >= 0 ? "text-emerald" : "text-red"
          }`}
        >
          {change > 0 ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {change > 0 ? "+" : ""}
          {change.toFixed(2)}
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs font-medium text-muted">
          <Minus size={12} />
          <span className="text-[10px] tracking-wide uppercase">Live</span>
        </span>
      )}
    </div>
  );
}
