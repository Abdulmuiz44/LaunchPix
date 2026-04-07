"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

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
    if (json.authorization_url) window.location.href = json.authorization_url;
    setLoading(null);
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <Button variant="outline" disabled={loading !== null} onClick={() => checkout("launch_pack")}>Buy Launch Pack</Button>
        <Button disabled={loading !== null} onClick={() => checkout("starter")}>Choose Starter</Button>
        <Button variant="outline" disabled={loading !== null} onClick={() => checkout("pro")}>Choose Pro</Button>
      </div>
      {error ? <p className="text-sm text-rose-500">{error}</p> : <p className="text-xs text-muted-foreground">Secure checkout via Paystack. You will be redirected to complete payment.</p>}
    </div>
  );
}
