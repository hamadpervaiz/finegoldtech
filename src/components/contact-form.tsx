"use client";

import { useState, FormEvent } from "react";
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GoldButton from "./gold-button";

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-gold" />
        </div>
        <h3 className="text-2xl font-display font-bold mb-2">
          Message sent
        </h3>
        <p className="text-muted mb-8">
          We&apos;ll get back to you within 24 hours.
        </p>
        <GoldButton variant="outline" onClick={() => setStatus("idle")}>
          Send another message
        </GoldButton>
      </motion.div>
    );
  }

  const inputBase =
    "w-full px-4 py-3.5 rounded-xl bg-bg border border-line text-fg placeholder:text-faint focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/10 transition-all text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            type="text"
            required
            placeholder="Your name"
            className={inputBase}
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <input
            type="email"
            required
            placeholder="you@company.com"
            className={inputBase}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-2">Company</label>
          <input
            type="text"
            placeholder="Company name"
            className={inputBase}
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Subject *
          </label>
          <select
            required
            className={`${inputBase} appearance-none`}
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
          >
            <option value="">Select subject</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Product Demo">Product Demo</option>
            <option value="Partnership">Partnership</option>
            <option value="Support">Support</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Message *</label>
        <textarea
          required
          rows={5}
          placeholder="How can we help?"
          className={`${inputBase} resize-none`}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-red-400 text-sm"
          >
            <AlertCircle size={14} />
            Something went wrong. Please try again.
          </motion.div>
        )}
      </AnimatePresence>

      <GoldButton type="submit">
        {status === "loading" ? (
          "Sending..."
        ) : (
          <span className="flex items-center gap-2">
            Send message <ArrowRight size={14} />
          </span>
        )}
      </GoldButton>
    </form>
  );
}
