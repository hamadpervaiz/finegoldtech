"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Shield,
  BarChart3,
  TrendingUp,
  Database,
  Lock,
  Globe,
  Cpu,
  LineChart,
  FileCheck,
  Layers,
  Wallet,
} from "lucide-react";
import SectionWrapper from "@/components/section-wrapper";
import GoldButton from "@/components/gold-button";

const products = [
  {
    id: "intelligence",
    icon: <Brain size={32} />,
    name: "Fine Gold Intelligence",
    tagline: "AI-Powered Market Analytics",
    description:
      "Harness artificial intelligence for unparalleled market insights, predictive modeling, and real-time analytics across global precious metals markets.",
    features: [
      {
        icon: <TrendingUp size={20} />,
        title: "Predictive Analytics",
        description: "ML-powered price forecasting and trend analysis.",
      },
      {
        icon: <Database size={20} />,
        title: "Data Aggregation",
        description:
          "Real-time data from global exchanges and indicators.",
      },
      {
        icon: <LineChart size={20} />,
        title: "Custom Dashboards",
        description: "Personalized views tailored to your strategy.",
      },
      {
        icon: <Cpu size={20} />,
        title: "AI Risk Engine",
        description: "Automated risk assessment and exposure analysis.",
      },
    ],
  },
  {
    id: "ledger",
    icon: <Shield size={32} />,
    name: "Fine Gold Ledger",
    tagline: "Blockchain Provenance & Compliance",
    description:
      "Complete transparency and trust in every transaction. Immutable records of provenance, ownership, and compliance throughout the supply chain.",
    features: [
      {
        icon: <Lock size={20} />,
        title: "Immutable Records",
        description: "Tamper-proof audit trails for every transaction.",
      },
      {
        icon: <FileCheck size={20} />,
        title: "Compliance Automation",
        description: "Automated regulatory reporting.",
      },
      {
        icon: <Globe size={20} />,
        title: "Supply Chain Tracking",
        description: "End-to-end visibility from mine to market.",
      },
      {
        icon: <Layers size={20} />,
        title: "Digital Certificates",
        description: "Blockchain-verified authenticity and purity.",
      },
    ],
  },
  {
    id: "platforms",
    icon: <BarChart3 size={32} />,
    name: "Fine Gold Platforms",
    tagline: "Enterprise Trading & Investment",
    description:
      "Purpose-built trading and investment platforms designed for institutional-grade performance, security, and scale.",
    features: [
      {
        icon: <TrendingUp size={20} />,
        title: "Trading Engine",
        description: "High-performance order matching and execution.",
      },
      {
        icon: <Wallet size={20} />,
        title: "Portfolio Management",
        description: "Multi-asset portfolio tracking and analytics.",
      },
      {
        icon: <Cpu size={20} />,
        title: "API-First Design",
        description: "REST and WebSocket APIs for integration.",
      },
      {
        icon: <Lock size={20} />,
        title: "Enterprise Security",
        description: "SOC 2 compliant, multi-layer authentication.",
      },
    ],
  },
];

export default function ProductsPageClient() {
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
            Products
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6"
          >
            Technology built for{" "}
            <span className="text-gradient">gold</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted max-w-2xl mx-auto"
          >
            Three powerful platforms working together to modernize how the
            world trades, tracks, and invests in precious metals.
          </motion.p>
        </div>
      </section>

      {/* Product Sections */}
      {products.map((product, index) => (
        <SectionWrapper
          key={product.id}
          id={product.id}
          className={`py-32 ${index % 2 === 1 ? "mesh-gradient-2" : ""}`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-8">
                  {product.icon}
                </div>
                <p className="text-xs text-gold font-medium tracking-wider uppercase mb-2">
                  {product.tagline}
                </p>
                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
                  {product.name}
                </h2>
                <p className="text-muted leading-relaxed mb-10">
                  {product.description}
                </p>
                <GoldButton href="/contact">Request a Demo</GoldButton>
              </div>

              <div
                className={`grid grid-cols-2 gap-4 ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                {product.features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{
                      opacity: 0,
                      y: 15,
                      filter: "blur(8px)",
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-xl bg-card border border-line hover:border-gold/20 transition-all duration-500"
                  >
                    <div className="text-gold mb-3">{f.icon}</div>
                    <h4 className="text-sm font-display font-semibold mb-1">
                      {f.title}
                    </h4>
                    <p className="text-xs text-muted">{f.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </SectionWrapper>
      ))}

      {/* CTA */}
      <SectionWrapper className="py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
            Ready to get{" "}
            <span className="text-gradient">started</span>?
          </h2>
          <p className="text-muted text-lg mb-10">
            Schedule a demo to see how Fine Gold Technologies can transform
            your operations.
          </p>
          <GoldButton href="/contact">Schedule a Demo</GoldButton>
        </div>
      </SectionWrapper>
    </>
  );
}
