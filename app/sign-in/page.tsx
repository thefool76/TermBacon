import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarClock, FileCheck2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentSession, isAuthEnforced, isGoogleAuthConfigured, sanitizeNextPath } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

const errors: Record<string, string> = {
  config: "Google sign-in is not configured on this deployment yet.",
  state: "That sign-in attempt expired or could not be verified. Please try again.",
  oauth: "Google sign-in was cancelled or rejected before completion. Please try again.",
  token: "Google accepted the account, but the authorization-code exchange failed. Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET come from the same Web application OAuth client and that the callback URL matches exactly.",
  profile: "Google signed you in, but TermBeacon could not read the verified profile required to create your account.",
  session: "Google sign-in succeeded, but TermBeacon could not create your workspace session. This points to the D1 auth/session layer rather than your Google credentials.",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const params = await searchParams;
  const nextPath = sanitizeNextPath(params.next);
  const session = await getCurrentSession();
  if (session) redirect(nextPath);

  const configured = isGoogleAuthConfigured();
  const authRequired = await isAuthEnforced();
  const errorMessage = params.error ? errors[params.error] : null;

  return (
    <main className="min-h-screen bg-[#f5f6f2] px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-[#52615b] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35] focus-visible:ring-offset-2">
          <ArrowLeft aria-hidden="true" size={15} /> Back to TermBeacon
        </Link>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <section className="pt-3">
            <Badge variant="neutral">Secure workspace access</Badge>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Your renewal deadlines belong to your team—not a browser tab.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#65716b]">Sign in to keep uploaded agreements, confirmed terms, and renewal decisions attached to a durable TermBeacon workspace.</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <TrustPoint icon={<FileCheck2 aria-hidden="true" size={17} />} title="Source-backed" body="Every deadline stays tied to the clause you confirmed." />
              <TrustPoint icon={<CalendarClock aria-hidden="true" size={17} />} title="Operational" body="Cancel-by dates are calculated from confirmed terms." />
              <TrustPoint icon={<ShieldCheck aria-hidden="true" size={17} />} title="Private" body="Sessions and workspace ownership are enforced server-side." />
            </div>
          </section>

          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-forest text-sm font-bold text-white">T</span>
              <div><p className="font-semibold" translate="no">TermBeacon</p><p className="text-xs text-[#7a8580]">Renewal decision workspace</p></div>
            </div>

            <h2 className="mt-7 text-2xl font-semibold tracking-[-0.035em]">Sign in to your workspace</h2>
            <p className="mt-2 text-sm leading-6 text-[#69746f]">No TermBeacon password to remember. Google is used only to verify your identity.</p>

            {errorMessage ? <div role="alert" className="mt-5 rounded-lg border border-[#e6c6c0] bg-[#fff8f6] p-3 text-sm leading-6 text-[#973d2d]">{errorMessage}</div> : null}

            {configured ? (
              <Button asChild size="lg" className="mt-6 w-full">
                <Link href={`/api/auth/google?next=${encodeURIComponent(nextPath)}`}>
                  <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-white text-xs font-bold text-[#27352f]">G</span>
                  Continue with Google <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </Button>
            ) : authRequired ? (
              <div className="mt-6 rounded-lg border border-[#e6c6c0] bg-[#fff8f6] p-4 text-sm leading-6 text-[#6b514b]">
                Sign-in is temporarily unavailable because the Google OAuth secrets are missing from this deployment. Existing workspaces remain locked rather than falling back to anonymous access.
              </div>
            ) : (
              <div className="mt-6">
                <Button disabled size="lg" className="w-full">Google sign-in setup pending</Button>
                <Button asChild variant="outline" className="mt-2 w-full"><Link href={nextPath}>Continue in temporary workspace</Link></Button>
              </div>
            )}

            <div className="mt-6 border-t border-line pt-5 text-xs leading-5 text-[#77817c]">
              Google shares your verified email, display name, and profile photo. TermBeacon never receives or stores your Google password.
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

function TrustPoint({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return <div className="rounded-xl border border-[#dce2dd] bg-white p-4"><p className="flex items-center gap-2 text-sm font-semibold text-[#23493f]">{icon}{title}</p><p className="mt-2 text-xs leading-5 text-[#717c76]">{body}</p></div>;
}
