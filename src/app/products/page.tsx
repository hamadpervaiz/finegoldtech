import type { Metadata } from "next";
import ProductsPageClient from "./products-client";

export const metadata: Metadata = {
  title: "Products — Fine Gold Technologies",
  description:
    "Explore our AI-powered intelligence, blockchain ledger, and enterprise trading platforms.",
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
