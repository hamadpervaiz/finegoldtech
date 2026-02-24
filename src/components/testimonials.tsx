"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import SectionWrapper from "./section-wrapper";

const testimonials = [
  {
    quote:
      "Fine Gold Technologies has fundamentally changed how we approach gold trading. Their analytics platform delivers insights we simply couldn't get anywhere else.",
    name: "James Mitchell",
    title: "Director of Trading",
    company: "Meridian Precious Metals",
  },
  {
    quote:
      "The blockchain provenance system gave us complete supply chain visibility. Our compliance team saw immediate results from day one.",
    name: "Sarah Al-Rashid",
    title: "Chief Operating Officer",
    company: "Gulf Gold Exchange",
  },
  {
    quote:
      "Enterprise-grade in every sense. The platform handles our institutional volume effortlessly while maintaining an interface our team actually enjoys using.",
    name: "Robert Chen",
    title: "VP of Operations",
    company: "Pacific Bullion Group",
  },
];

export default function Testimonials() {
  return (
    <SectionWrapper className="py-16 sm:py-20 md:py-24 lg:py-32 mesh-gradient-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-20">
          <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight">
            Trusted by{" "}
            <span className="text-gradient">industry leaders</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="p-5 sm:p-6 md:p-8 rounded-2xl bg-card border border-line"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="fill-gold text-gold"
                  />
                ))}
              </div>

              <p className="text-base sm:text-lg text-fg/90 leading-relaxed mb-6 sm:mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-gold">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted">
                    {t.title}, {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
