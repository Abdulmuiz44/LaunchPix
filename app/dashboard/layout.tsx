import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { requireUser } from "@/lib/supabase/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireUser();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardTopbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
