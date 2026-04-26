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
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.72fr] lg:items-end">
            <div className="space-y-5">
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="hero-title max-w-4xl text-balance">{title}</h1>
              <p className="section-copy max-w-2xl">{description}</p>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-white p-6 sm:p-7 dark:border-white/[0.08] dark:bg-[#060a12]">
              <p className="dashboard-label">Why it matters</p>
              <div className="mt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/8">
                  <span className="text-slate-500">Pain</span>
                  <span className="font-medium text-slate-950 dark:text-white">Unpolished screenshots</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/8">
                  <span className="text-slate-500">Cost</span>
                  <span className="font-medium text-slate-950 dark:text-white">Slow handoff loops</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Fix</span>
                  <span className="font-medium text-slate-950 dark:text-white">Launch-ready packs</span>
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
