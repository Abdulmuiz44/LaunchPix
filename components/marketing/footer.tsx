import Link from "next/link";

const links = [
  { href: "/pricing" as const, label: "Pricing" },
  { href: "/contact" as const, label: "Contact" },
  { href: "/privacy" as const, label: "Privacy" },
  { href: "/terms" as const, label: "Terms" }
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="app-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">LaunchPix</p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Deterministic, polished launch assets for product teams that need reliable visuals fast.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
