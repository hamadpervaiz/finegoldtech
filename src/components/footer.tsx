import Link from "next/link";
import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";

const links = {
  Product: [
    { href: "/products#intelligence", label: "Intelligence" },
    { href: "/products#ledger", label: "Ledger" },
    { href: "/products#platforms", label: "Platforms" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  Connect: [
    { href: "mailto:contact@finegoldtech.com", label: "Email" },
    { href: "https://www.linkedin.com/company/fine-gold-technologies/about/", label: "LinkedIn" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12">
          <div className="col-span-2">
            <Image
              src="/logo.png"
              alt="Fine Gold Technologies"
              width={140}
              height={35}
              className="h-7 w-auto mb-4"
            />
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Cutting-edge AI, blockchain, and SaaS solutions for the global
              gold and precious metals industry.
            </p>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-faint uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {items.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-fg transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-16 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-faint">
            &copy; {new Date().getFullYear()} Fine Gold Technologies. All
            rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.linkedin.com/company/fine-gold-technologies/about/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-faint hover:text-fg transition-colors"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="mailto:contact@finegoldtech.com"
              className="text-faint hover:text-fg transition-colors"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
