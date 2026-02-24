"use client";

import { motion } from "framer-motion";
import { Target, Eye, Heart, Users, Award, Lightbulb } from "lucide-react";
import SectionWrapper from "@/components/section-wrapper";
import GoldButton from "@/components/gold-button";

const values = [
  {
    icon: <Heart size={20} />,
    title: "Integrity",
    description:
      "Unwavering honesty and transparency in every interaction.",
  },
  {
    icon: <Lightbulb size={20} />,
    title: "Innovation",
    description:
      "Pushing boundaries with AI, blockchain, and cloud.",
  },
  {
    icon: <Users size={20} />,
    title: "Partnership",
    description: "Your success is our mission. We grow together.",
  },
  {
    icon: <Award size={20} />,
    title: "Excellence",
    description:
      "Highest standards in everything we build and deliver.",
  },
];

const milestones = [
  {
    year: "2024",
    title: "Founded",
    description:
      "Established with a vision to transform the gold industry.",
  },
  {
    year: "2024",
    title: "Product Launch",
    description: "Launched Intelligence, Ledger, and Platforms suite.",
  },
  {
    year: "2025",
    title: "Global Expansion",
    description: "Expanded to Pakistan and Qatar.",
  },
  {
    year: "2025",
    title: "Growing Impact",
    description: "Continuing to innovate and expand reach.",
  },
];

export default function AboutPageClient() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden mesh-gradient-1">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4"
          >
            About Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6"
          >
            Our <span className="text-gradient">Story</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted max-w-2xl mx-auto"
          >
            Born from a belief that the gold industry deserves better
            technology.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <SectionWrapper className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-8">
                Building the{" "}
                <span className="text-gradient">future</span> of gold
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  The gold and precious metals industry — worth over $12
                  trillion — has long relied on outdated systems and fragmented
                  processes.
                </p>
                <p>
                  We bring together expertise in AI, blockchain, and enterprise
                  software to create platforms that address real challenges
                  faced by traders, refiners, investors, and institutions
                  worldwide.
                </p>
                <p>
                  From Houston, Lahore, and Doha, we serve clients across
                  multiple continents.
                </p>
              </div>
            </div>
            <div className="rounded-3xl bg-card border border-line p-10 glow-gold">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "Global Offices", value: "3+" },
                  { label: "Core Platforms", value: "3" },
                  { label: "Uptime", value: "24/7" },
                  { label: "Market Served", value: "$12T+" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-4xl font-display font-bold text-gradient">
                      {s.value}
                    </p>
                    <p className="text-xs text-muted mt-1 tracking-wider uppercase">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Mission & Vision */}
      <SectionWrapper className="py-32 mesh-gradient-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Target size={24} />,
                title: "Our Mission",
                text: "To empower the global gold and precious metals industry with intelligent, secure, and scalable technology solutions that drive transparency, efficiency, and growth.",
              },
              {
                icon: <Eye size={24} />,
                title: "Our Vision",
                text: "To become the global standard for technology in precious metals — where every ounce is tracked, every trade is transparent, and every decision is data-driven.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 md:p-10 rounded-2xl bg-card border border-line"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">
                  {item.title}
                </h3>
                <p className="text-muted leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Our Values
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              What <span className="text-gradient">drives</span> us
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-line text-center group hover:border-gold/20 transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold mx-auto mb-4 group-hover:bg-gold/15 transition-colors">
                  {v.icon}
                </div>
                <h3 className="font-display font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Timeline */}
      <SectionWrapper className="py-32 mesh-gradient-1">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Journey
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              Key <span className="text-gradient">milestones</span>
            </h2>
          </div>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-8 items-start relative"
              >
                <div className="shrink-0 w-14 pt-1 text-right">
                  <span className="text-xs font-bold text-gradient">
                    {m.year}
                  </span>
                </div>
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                  {i < milestones.length - 1 && (
                    <div className="w-px h-full min-h-12 bg-line mt-1" />
                  )}
                </div>
                <div className="pb-10">
                  <h3 className="font-display font-bold mb-1">{m.title}</h3>
                  <p className="text-sm text-muted">{m.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Team */}
      <SectionWrapper className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Team
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              The people behind{" "}
              <span className="text-gradient">Fine Gold</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Leadership Team",
                role: "Executive",
                bio: "Seasoned professionals with decades of fintech and precious metals experience.",
              },
              {
                name: "Engineering Team",
                role: "Technology",
                bio: "World-class engineers in AI, blockchain, and enterprise platforms.",
              },
              {
                name: "Advisory Board",
                role: "Strategy",
                bio: "Industry veterans guiding market strategy and growth.",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 rounded-2xl bg-card border border-line text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mx-auto mb-5">
                  <Users size={28} />
                </div>
                <h3 className="text-lg font-display font-bold">{t.name}</h3>
                <p className="text-gold text-sm mb-3">{t.role}</p>
                <p className="text-sm text-muted">{t.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="py-32 mesh-gradient-2">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
            Join us in shaping the{" "}
            <span className="text-gradient">future</span>
          </h2>
          <p className="text-muted text-lg mb-10">
            Whether you&apos;re a potential client, partner, or team member,
            we&apos;d love to connect.
          </p>
          <GoldButton href="/contact">Get in Touch</GoldButton>
        </div>
      </SectionWrapper>
    </>
  );
}
