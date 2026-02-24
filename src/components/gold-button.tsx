"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface GoldButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  size?: "sm" | "default";
}

export default function GoldButton({
  children,
  variant = "primary",
  href,
  className = "",
  onClick,
  type = "button",
  size = "default",
}: GoldButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.12);
    y.set((e.clientY - centerY) * 0.12);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base = `inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 cursor-pointer ${
    size === "sm" ? "px-5 py-2 text-xs" : "px-8 py-3.5 text-sm"
  }`;

  const styles = {
    primary:
      "bg-gold text-bg hover:bg-gold-light hover:shadow-[0_0_40px_rgba(200,169,96,0.2)]",
    outline:
      "border border-line-bold text-fg hover:border-gold/50 hover:text-gold",
  };

  const combined = `${base} ${styles[variant]} ${className}`;

  const content = href ? (
    <Link href={href} className={combined}>
      {children}
    </Link>
  ) : (
    <button type={type} onClick={onClick} className={combined}>
      {children}
    </button>
  );

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      className="inline-block"
    >
      {content}
    </motion.div>
  );
}
