"use client";

import { Lock, Globe, Palette, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import SectionWrapper from "./section-wrapper";

const features = [
  {
    icon: <Lock size={20} />,
    title: "Bank-Grade Security",
    description:
      "Enterprise encryption and security protocols protecting every transaction.",
  },
  {
    icon: <Globe size={20} />,
    title: "Global Expertise",
    description:
      "Deep understanding of regional and international gold markets.",
  },
  {
    icon: <Palette size={20} />,
    title: "Intuitive Design",
    description:
      "Complex operations made simple through thoughtful interfaces.",
  },
  {
    icon: <Zap size={20} />,
    title: "Continuous Innovation",
    description:
      "Leveraging the latest in AI, blockchain, and cloud technology.",
  },
];

function FeatureCard({
  feature,
  delay,
}: {
  feature: (typeof features)[number];
  delay: number;
}) {
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setGlowPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group p-5 sm:p-6 rounded-2xl bg-card border border-line hover:border-line-bold transition-all duration-500 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(200,169,96,0.06), transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/15 transition-colors">
          {feature.icon}
        </div>
        <h3 className="font-display font-bold mb-2">{feature.title}</h3>
        <p className="text-sm text-muted leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  return (
    <SectionWrapper className="py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-10 lg:gap-20">
          <div>
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Why Fine Gold
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight">
              Built for the{" "}
              <span className="text-gradient">gold standard</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={f.title} feature={f} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
