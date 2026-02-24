import Hero from "@/components/hero";
import StatsMarquee from "@/components/stats-marquee";
import AboutPreview from "@/components/about-preview";
import MarketInsights from "@/components/market-insights";
import AIDashboard from "@/components/ai-dashboard";
import ProductsBento from "@/components/products-bento";
import WhyChooseUs from "@/components/why-choose-us";
import GlobalPresence from "@/components/global-presence";
import Testimonials from "@/components/testimonials";
import CTASection from "@/components/cta-section";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsMarquee />
      <AboutPreview />
      <MarketInsights />
      <AIDashboard />
      <ProductsBento />
      <WhyChooseUs />
      <GlobalPresence />
      <Testimonials />
      <CTASection />
    </>
  );
}
