import type { Metadata } from "next";
import ContactPageClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Fine Gold Technologies. Reach our offices in the US, Pakistan, and Qatar.",
  alternates: { canonical: "https://finegoldtech.com/contact" },
  openGraph: {
    title: "Contact Fine Gold Technologies",
    description:
      "Reach our offices in the US, Pakistan, and Qatar.",
    url: "https://finegoldtech.com/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
