import type { Metadata } from "next";
import ProductsPageClient from "./products-client";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore Fine Gold Technologies AI-powered intelligence, blockchain ledger, and enterprise trading platforms for the precious metals industry.",
  alternates: { canonical: "https://finegoldtech.com/products" },
  openGraph: {
    title: "Products — Fine Gold Technologies",
    description:
      "AI-powered intelligence, blockchain ledger, and enterprise trading platforms.",
    url: "https://finegoldtech.com/products",
  },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
