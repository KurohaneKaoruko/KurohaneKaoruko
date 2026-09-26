import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/roboto-mono";
import "./globals.css";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/features/SplashScreen";
import { LoadingTrigger } from "@/components/features/LoadingTrigger";
import TransitionProvider from "@/components/layout/TransitionProvider";
import { ReposProvider } from "@/components/ReposProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { LoadingProvider } from "@/context/LoadingContext";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: "%s — " + SITE.name,
  },
  description: SITE.description,
  keywords: [
    "Kurohane Kaoruko",
    "AI",
    "LLM Agents",
    "Rust",
    "TypeScript",
    "Python",
    "Next.js",
    "开源",
  ],
  authors: [{ name: SITE.name, url: SITE.github }],
  creator: SITE.name,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-theme="terminal" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {/* 必须最先执行：在水合前定好 <html data-theme>，否则会看到主题闪一下 */}
        <ThemeScript />

        <LoadingProvider>
          <ThemeProvider>
            {/* 仓库数据：首屏用站内快照，挂载后换成浏览器直连 GitHub 的实时数据 */}
            <ReposProvider>
              <a href="#main" className="skip-link">
                跳到主内容 / SKIP TO CONTENT
              </a>

              <SplashScreen />
              <ScrollProgress />
              <Nav />

              <TransitionProvider>
                <main id="main" className="relative z-10 pt-[var(--nav-h)]">
                  {children}
                </main>
              </TransitionProvider>

              <Footer />
              <LoadingTrigger />
            </ReposProvider>
          </ThemeProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
