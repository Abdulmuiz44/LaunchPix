import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles, UploadCloud } from "lucide-react";
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
      <main className="app-shell py-12 sm:py-16 lg:py-20">
        <section className="grid gap-8 lg:grid-cols-[0.98fr_0.82fr] lg:items-center">
          <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 dark:border-white/[0.08] dark:bg-[#050810]">
            <p className="eyebrow">Get back to launch mode</p>
            <h1 className="hero-title mt-5 max-w-3xl text-balance">
              The launch pack is waiting. Do not lose another hour recreating assets.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Sign in with a secure magic link to continue your briefs, uploads, generations, billing, and export-ready visual packs.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: LockKeyhole, title: "No password drag", text: "A secure email link gets you in without another credential to manage." },
                { icon: UploadCloud, title: "Your context stays put", text: "Return to the same project brief, screenshots, and generation state." },
                { icon: Sparkles, title: "Exports stay close", text: "Billing, previews, and production downloads live in one workspace." }
              ].map((item) => (
                <div key={item.title} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.07] dark:bg-[#080d16]">
                  <item.icon className="size-5 text-cyan-200" />
                  <p className="mt-4 font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-white/[0.08] dark:bg-[#080d16]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-cyan-200" />
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                  New here? Use the same email you want tied to your projects. LaunchPix will create the account when the secure link is confirmed.
                </p>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden rounded-[30px]">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Passwordless sign in</p>
                <h2 className="mt-3 text-2xl font-semibold">Send the secure link</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  Open the email on this device, confirm the link, and you will return to your LaunchPix workspace.
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
                  <input id="email" name="email" type="email" required placeholder="you@company.com" className="field w-full" />
                </div>

                <Button className="w-full" size="lg">
                  Send secure sign-in link
                  <ArrowRight className="size-4" />
                </Button>
              </form>

              <div className="space-y-2 text-sm leading-6 text-slate-500">
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
