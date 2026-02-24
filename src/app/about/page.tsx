import type { Metadata } from "next";
import AboutPageClient from "./about-client";

export const metadata: Metadata = {
  title: "About — Fine Gold Technologies",
  description:
    "Learn about Fine Gold Technologies, our mission, values, and global team.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
