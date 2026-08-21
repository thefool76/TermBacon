import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/product/app-shell";
import { getCurrentSession, isAuthEnforced } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Workspace",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function ProductLayout({ children }: { children: ReactNode }) {
  const authRequired = await isAuthEnforced();
  const session = await getCurrentSession();

  if (authRequired && !session) redirect("/sign-in?next=/app");

  return (
    <AppShell
      authRequired={authRequired}
      identity={session ? {
        name: session.user.name,
        email: session.user.email,
        workspaceName: session.workspace.name,
      } : null}
    >
      {children}
    </AppShell>
  );
}
