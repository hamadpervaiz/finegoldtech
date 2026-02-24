import type { Metadata } from "next";
import AboutPageClient from "./about-client";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Fine Gold Technologies, our mission, values, and global team powering the future of the gold industry.",
  alternates: { canonical: "https://finegoldtech.com/about" },
  openGraph: {
    title: "About Fine Gold Technologies",
    description:
      "Our mission, values, and the global team powering the future of the gold industry.",
    url: "https://finegoldtech.com/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
