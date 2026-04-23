import type { ReactNode } from "react";
import { TopNav } from "@/components/marketing/top-nav";
import { MarketingFooter } from "@/components/marketing/footer";

export function MarketingPageShell({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <TopNav />
      <main>
        <section className="app-shell app-section">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-5">
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="hero-title max-w-4xl text-balance">{title}</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
            </div>
            <div className="dashboard-card p-6 sm:p-7">
              <p className="dashboard-label">LaunchPix system</p>
              <div className="mt-4 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between border-b border-white/8 pb-3">
                  <span className="text-slate-500">Focus</span>
                  <span className="font-medium text-white">Fast launch execution</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/8 pb-3">
                  <span className="text-slate-500">Output</span>
                  <span className="font-medium text-white">Listing, promo, hero</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Approach</span>
                  <span className="font-medium text-white">Structured, export-ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="app-shell pb-16 sm:pb-20">{children}</section>
      </main>
      <MarketingFooter />
    </>
  );
}
