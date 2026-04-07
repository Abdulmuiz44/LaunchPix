import type { Metadata } from "next";
import Link from "next/link";
import { signInWithMagicLink } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in | LaunchPix",
  description: "Sign in to LaunchPix and start generating polished launch visuals from raw screenshots."
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <h1 className="text-2xl font-semibold">Sign in to LaunchPix</h1>
          <p className="mt-2 text-sm text-muted-foreground">Use your work email to continue. We send a secure magic link—no password required.</p>
          {params.sent ? <p className="mt-3 rounded-lg bg-emerald-500/10 p-2 text-xs text-emerald-600">Magic link sent. Check your inbox and spam folder.</p> : null}
          <form action={signInWithMagicLink} className="mt-6 space-y-3">
            <input name="email" type="email" required placeholder="you@company.com" className="h-10 w-full rounded-lg border border-border bg-transparent px-3" />
            <Button className="w-full">Send secure sign-in link</Button>
          </form>
          <p className="mt-5 text-xs text-muted-foreground">Need help accessing your account? Email <a className="underline" href="mailto:support@launchpix.app">support@launchpix.app</a>.</p>
          <p className="mt-2 text-xs text-muted-foreground">By continuing, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
        </CardContent>
      </Card>
    </main>
  );
}
