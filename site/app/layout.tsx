import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/roboto-mono";
import "./globals.css";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BootSplash from "@/components/features/BootSplash";

export const metadata: Metadata = {
  metadataBase: new URL("https://kurohanekaoruko.github.io/KurohaneKaoruko"),
  title: {
    default: "Kurohane Kaoruko — Portfolio Terminal",
    template: "%s — Kurohane Kaoruko",
  },
  description:
    "专注于人工智能领域，致力于用技术解决问题。偶尔写一些小工具，或者是有趣、好玩的项目。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <BootSplash />
        <Nav />
        <main className="relative z-10 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
