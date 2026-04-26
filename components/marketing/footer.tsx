import Link from "next/link";
import { LaunchPixLogo } from "@/components/brand/logo";

const links = [
  { href: "/pricing" as const, label: "Pricing" },
  { href: "/contact" as const, label: "Contact" },
  { href: "/privacy" as const, label: "Privacy" },
  { href: "/terms" as const, label: "Terms" }
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-white/8 dark:bg-[#02040a]">
      <div className="app-shell py-10 sm:py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Link href="/" className="rounded-2xl outline-none transition focus-visible:ring-2 focus-visible:ring-slate-300 dark:focus-visible:ring-white/20">
            <LaunchPixLogo className="justify-center" />
          </Link>

          <p className="mt-4 max-w-xl text-balance text-sm leading-7 text-slate-600 dark:text-slate-400">
            Turn unfinished screenshots into launch-ready visual packs for stores, campaigns, and product pages.
          </p>

          <nav className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-white/8 sm:flex-row sm:text-left">
          <p>Copyright 2026 LaunchPix. All rights reserved.</p>
          <p>Preview first. Export when it is ready.</p>
        </div>
      </div>
    </footer>
  );
}
