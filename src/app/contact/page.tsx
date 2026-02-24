import type { Metadata } from "next";
import ContactPageClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contact — Fine Gold Technologies",
  description:
    "Get in touch with Fine Gold Technologies. Offices in the US, Pakistan, and Qatar.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
