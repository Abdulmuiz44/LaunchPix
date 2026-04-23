import Link from "next/link";

const links = [
  { href: "/pricing" as const, label: "Pricing" },
  { href: "/contact" as const, label: "Contact" },
  { href: "/privacy" as const, label: "Privacy" },
  { href: "/terms" as const, label: "Terms" }
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#050b16]">
      <div className="app-shell grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-lg font-semibold text-white">LaunchPix</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
            A focused launch studio for turning raw product screenshots into store-ready visuals, promo tiles, and banners.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:justify-end">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-400 hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
