import Link from "next/link";
import { signInWithMagicLink } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md"><CardContent className="p-8"><h1 className="text-2xl font-semibold">Sign in to LaunchPix</h1><p className="mt-2 text-sm text-muted-foreground">Use your email to continue to your dashboard.</p>{params.sent ? <p className="mt-3 rounded-lg bg-emerald-500/10 p-2 text-xs text-emerald-600">Magic link sent. Check your inbox.</p> : null}<form action={signInWithMagicLink} className="mt-6 space-y-3"><input name="email" type="email" required placeholder="you@company.com" className="h-10 w-full rounded-lg border border-border bg-transparent px-3" /><Button className="w-full">Send magic link</Button></form><p className="mt-5 text-xs text-muted-foreground">By continuing you agree to our terms. <Link href="/" className="underline">Back home</Link></p></CardContent></Card>
    </main>
  );
}
