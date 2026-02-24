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
  metadataBase: new URL("https://finegoldtech.com"),
  title: {
    default: "Fine Gold Technologies — AI-Powered Gold Industry Solutions",
    template: "%s | Fine Gold Technologies",
  },
  description:
    "Fine Gold Technologies delivers cutting-edge AI analytics, blockchain provenance, and enterprise platforms for the global gold and precious metals industry.",
  keywords: [
    "gold trading",
    "gold analytics",
    "AI gold",
    "precious metals",
    "gold technology",
    "gold investment",
    "blockchain gold",
    "gold market intelligence",
    "Fine Gold Technologies",
  ],
  authors: [{ name: "Fine Gold Technologies" }],
  creator: "Fine Gold Technologies",
  publisher: "Fine Gold Technologies",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Fine Gold Technologies — AI-Powered Gold Industry Solutions",
    description:
      "Cutting-edge AI analytics, blockchain provenance, and enterprise platforms for the global gold and precious metals industry.",
    url: "https://finegoldtech.com",
    siteName: "Fine Gold Technologies",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fine Gold Technologies — AI-Powered Gold Industry Solutions",
    description:
      "Cutting-edge AI analytics, blockchain provenance, and enterprise platforms for the global gold and precious metals industry.",
  },
  alternates: {
    canonical: "https://finegoldtech.com",
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
