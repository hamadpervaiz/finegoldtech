"use client";

import SectionWrapper from "./section-wrapper";

const items = [
  "3 Global Offices",
  "$12T+ Market Opportunity",
  "99.9% Platform Uptime",
  "Enterprise Grade Security",
  "AI-Powered Analytics",
  "Blockchain Verified",
  "3 Core Platforms",
  "Real-Time Data Processing",
];

export default function StatsMarquee() {
  return (
    <SectionWrapper className="py-6 border-y border-line overflow-hidden">
      <div className="relative">
        <div className="flex animate-marquee">
          {[...items, ...items].map((item, i) => (
            <div key={i} className="flex items-center shrink-0 mx-4 sm:mx-8">
              <span className="w-1 h-1 rounded-full bg-faint mr-4 shrink-0" />
              <span className="text-sm font-medium text-muted whitespace-nowrap">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
