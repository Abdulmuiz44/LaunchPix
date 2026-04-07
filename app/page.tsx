import type { Metadata } from "next";
import { TopNav } from "@/components/marketing/top-nav";
import { LandingSections } from "@/components/marketing/landing-sections";
import { MarketingFooter } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "LaunchPix | Turn screenshots into polished launch visuals",
  description: "Create store-ready screenshot packs, promo tiles, and hero banners from raw product captures.",
  openGraph: {
    title: "LaunchPix",
    description: "Turn raw screenshots into polished launch visuals in minutes.",
    url: "https://launchpix.app"
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchPix",
    description: "Deterministic launch visuals with preview-before-upgrade flow."
  }
};

export default function HomePage() {
  return (
    <>
      <TopNav />
      <LandingSections />
      <MarketingFooter />
    </>
  );
}
