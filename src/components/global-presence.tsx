"use client";

import { motion } from "framer-motion";
import SectionWrapper from "./section-wrapper";

const offices = [
  { city: "Houston", country: "United States", role: "Global HQ" },
  { city: "Lahore", country: "Pakistan", role: "Technology Center" },
  { city: "Doha", country: "Qatar", role: "Middle East Office" },
];

export default function GlobalPresence() {
  return (
    <SectionWrapper className="py-16 sm:py-20 md:py-24 lg:py-32 border-y border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-20">
          <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            Global Presence
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight">
            Three continents.{" "}
            <span className="text-gradient">One mission.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line rounded-2xl overflow-hidden">
          {offices.map((office, i) => (
            <motion.div
              key={office.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card p-8 sm:p-10 md:p-12 text-center group hover:bg-elevated transition-colors duration-500"
            >
              <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
                {office.city}
              </p>
              <p className="text-sm text-muted font-medium mb-1">
                {office.country}
              </p>
              <p className="text-xs text-gold uppercase tracking-wider">
                {office.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
