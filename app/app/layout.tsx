import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/product/app-shell";
import { getCurrentSession, isGoogleAuthConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Workspace",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function ProductLayout({ children }: { children: ReactNode }) {
  const authConfigured = isGoogleAuthConfigured();
  const session = await getCurrentSession();

  if (authConfigured && !session) redirect("/sign-in?next=/app");

  return (
    <AppShell
      authConfigured={authConfigured}
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
