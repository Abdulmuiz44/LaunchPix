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
      <main className="app-shell py-16 sm:py-20 lg:py-24">
        <section className="surface overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="hero-title mt-5 text-balance">{title}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>

          <div className="mt-10">{children}</div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
