import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { getAccessContext } from "@/lib/services/access/permissions";
import { requireUser } from "@/lib/supabase/auth";

export default async function SettingsLayout({ children }: { children: ReactNode }) {
  const { user } = await requireUser();
  const { subscription, plan } = await getAccessContext(user.id);

  return (
    <div className="min-h-screen bg-[#020819] text-[#e6ecff]">
      <DashboardSidebar credits={subscription.credits_remaining} planLabel={plan.label} userEmail={user.email ?? "user@launchpix.app"} />
      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardTopbar credits={subscription.credits_remaining} planLabel={plan.label} />
        <main className="flex-1 px-5 pb-5 pt-4 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
