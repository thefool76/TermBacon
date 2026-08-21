import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "TermBeacon — Know what renews. Know when to act.", description: "TermBeacon keeps your team ahead of contract renewal decisions." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
