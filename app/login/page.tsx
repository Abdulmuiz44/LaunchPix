import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import { signInWithMagicLink } from "@/lib/actions/auth";
import { TopNav } from "@/components/marketing/top-nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in | LaunchPix",
  description: "Sign in to LaunchPix and start generating polished launch visuals from raw screenshots."
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const params = await searchParams;

  return (
    <>
      <TopNav />
      <main className="app-shell py-14 sm:py-20">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="surface overflow-hidden p-6 sm:p-8 lg:p-10">
            <p className="eyebrow">Secure access</p>
            <h1 className="hero-title mt-5 text-balance">Sign in with one calm, passwordless step.</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Use your work email to access projects, generation history, billing, and polished launch assets without managing another password.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: LockKeyhole, title: "Passwordless", text: "Secure magic link sign-in with Supabase Auth." },
                { icon: Sparkles, title: "Fast return", text: "Jump back into briefs, uploads, and generation in seconds." },
                { icon: CheckCircle2, title: "Production ready", text: "Access billing, exports, and project controls from one workspace." }
              ].map((item) => (
                <div key={item.title} className="surface-muted p-4">
                  <item.icon className="size-5 text-primary" />
                  <p className="mt-4 font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Account login</p>
                <h2 className="mt-3 text-2xl font-semibold">Continue to LaunchPix</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Enter your email and we will send a secure link to finish sign-in.
                </p>
              </div>

              {params.sent ? (
                <div className="rounded-[20px] border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                  Magic link sent. Check your inbox and spam folder.
                </div>
              ) : null}

              <form action={signInWithMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Work email
                  </label>
                  <input id="email" name="email" type="email" required placeholder="you@company.com" className="field h-11 w-full" />
                </div>

                <Button className="w-full" size="lg">
                  Send secure sign-in link
                  <ArrowRight className="size-4" />
                </Button>
              </form>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Need help accessing your account?{" "}
                  <a className="font-medium text-foreground underline underline-offset-4" href="mailto:support@launchpix.app">
                    support@launchpix.app
                  </a>
                </p>
                <p>
                  By continuing, you agree to our <Link href="/terms" className="underline underline-offset-4">Terms</Link> and{" "}
                  <Link href="/privacy" className="underline underline-offset-4">Privacy Policy</Link>.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
