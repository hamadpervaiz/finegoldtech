"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Linkedin } from "lucide-react";
import SectionWrapper from "@/components/section-wrapper";
import ContactForm from "@/components/contact-form";

const offices = [
  {
    city: "Houston",
    country: "United States",
    role: "Global Headquarters",
  },
  { city: "Lahore", country: "Pakistan", role: "Technology Center" },
  { city: "Doha", country: "Qatar", role: "Middle East Office" },
];

export default function ContactPageClient() {
  return (
    <>
      <section className="relative pt-40 pb-20 overflow-hidden mesh-gradient-1">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4"
          >
            Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6"
          >
            Let&apos;s{" "}
            <span className="text-gradient">connect</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted max-w-2xl mx-auto"
          >
            Have a question or want to learn more? We&apos;d love to hear
            from you.
          </motion.p>
        </div>
      </section>

      <SectionWrapper className="pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <div className="p-8 md:p-10 rounded-2xl bg-card border border-line">
                <h2 className="text-xl font-display font-bold mb-8">
                  Send us a message
                </h2>
                <ContactForm />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="p-8 rounded-2xl bg-card border border-line">
                <h3 className="text-lg font-display font-bold mb-6">
                  Contact info
                </h3>
                <div className="space-y-4">
                  <a
                    href="mailto:contact@finegoldtech.com"
                    className="flex items-center gap-3 text-muted hover:text-gold transition-colors"
                  >
                    <Mail size={16} className="text-gold" />
                    <span className="text-sm">
                      contact@finegoldtech.com
                    </span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-muted hover:text-gold transition-colors"
                  >
                    <Linkedin size={16} className="text-gold" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-card border border-line">
                <h3 className="text-lg font-display font-bold mb-6">
                  Our offices
                </h3>
                <div className="space-y-5">
                  {offices.map((o) => (
                    <div key={o.city} className="flex gap-3">
                      <MapPin
                        size={16}
                        className="text-gold shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {o.city}, {o.country}
                        </p>
                        <p className="text-xs text-muted">{o.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
