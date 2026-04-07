import Link from "next/link";
import { LayoutDashboard, FolderKanban, Settings, CreditCard } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/settings/billing", label: "Billing", icon: CreditCard }
];

export function DashboardSidebar() {
  return (
    <aside className="w-64 border-r border-border p-4">
      <p className="mb-4 px-2 text-sm font-medium text-muted-foreground">Workspace</p>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
