import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/product/app-shell";

export const metadata: Metadata = {
  title: "Product Demo",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
