import type { Metadata } from "next";
import { Urbanist, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CursorGlow from "@/components/cursor-glow";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fine Gold Technologies — AI-Powered Gold Industry Solutions",
  description:
    "Fine Gold Technologies delivers cutting-edge AI, blockchain, and SaaS platforms for the global gold and precious metals industry.",
  openGraph: {
    title: "Fine Gold Technologies",
    description:
      "AI-Powered solutions for the gold and precious metals industry",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} ${inter.variable}`}>
      <body className="grain antialiased">
        <CursorGlow />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
