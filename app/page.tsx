import type { Metadata } from "next";
import { TopNav } from "@/components/marketing/top-nav";
import { LandingSections } from "@/components/marketing/landing-sections";
import { MarketingFooter } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "LaunchPix | Turn unfinished screenshots into launch-ready visuals",
  description: "Generate store-ready screenshot packs, promo tiles, and hero banners from raw product captures.",
  openGraph: {
    title: "LaunchPix",
    description: "Turn unfinished screenshots into launch-ready visual packs.",
    url: "https://launchpix.app"
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchPix",
    description: "Preview launch-ready screenshot packs before production export."
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
