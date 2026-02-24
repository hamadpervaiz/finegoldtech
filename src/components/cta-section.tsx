"use client";

import SectionWrapper from "./section-wrapper";
import GoldButton from "./gold-button";

export default function CTASection() {
  return (
    <SectionWrapper className="py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-card border border-line overflow-hidden p-8 sm:p-12 md:p-20 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-gold/[0.05] blur-[100px]" />
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[400px] h-[400px] rounded-full bg-gold-dark/[0.03] blur-[80px]" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
              Ready to transform your{" "}
              <span className="text-gradient">gold business</span>?
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10">
              Join the leading companies using Fine Gold Technologies to
              modernize their precious metals operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GoldButton href="/contact">Get in Touch</GoldButton>
              <GoldButton href="/products" variant="outline">
                Explore Products
              </GoldButton>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
