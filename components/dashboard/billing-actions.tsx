"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    id: "launch_pack",
    name: "Launch Pack",
    description: "One-time credit top-up for a single launch cycle.",
    variant: "outline" as const
  },
  {
    id: "starter",
    name: "Starter",
    description: "Balanced monthly plan for repeat builders.",
    variant: "default" as const
  },
  {
    id: "pro",
    name: "Pro",
    description: "Higher volume output with priority generation.",
    variant: "outline" as const
  }
];

export function BillingActions() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkout(planId: "launch_pack" | "starter" | "pro") {
    setError(null);
    setLoading(planId);

    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId })
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error || "Checkout could not start. Please try again.");
      setLoading(null);
      return;
    }

    if (json.authorization_url) {
      window.location.href = json.authorization_url;
      return;
    }

    setLoading(null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {plans.map((plan) => (
        <div key={plan.id} className="surface-muted flex flex-col gap-4 p-5">
          <div>
            <p className="text-base font-semibold">{plan.name}</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{plan.description}</p>
          </div>
          <Button variant={plan.variant} disabled={loading !== null} onClick={() => checkout(plan.id as "launch_pack" | "starter" | "pro")}>
            {loading === plan.id ? "Redirecting..." : `Choose ${plan.name}`}
          </Button>
        </div>
      ))}

      {error ? <p className="lg:col-span-3 text-sm text-rose-500">{error}</p> : <p className="lg:col-span-3 text-sm text-muted-foreground">Secure checkout via Paystack. You will be redirected to complete payment.</p>}
    </div>
  );
}
