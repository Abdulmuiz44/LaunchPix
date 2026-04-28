"use client";

import { signIn } from "next-auth/react";
import { ArrowRight, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton() {
  return (
    <Button type="button" className="w-full" size="lg" onClick={() => signIn("google", { callbackUrl: "/dashboard/projects" })}>
      <Chrome className="size-4" />
      Continue with Google
      <ArrowRight className="size-4" />
    </Button>
  );
}
