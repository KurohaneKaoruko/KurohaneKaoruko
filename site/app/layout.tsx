import type { Metadata, Viewport } from "next";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource-variable/noto-sans-sc";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

import { Cursor } from "@/components/fx/Cursor";
import { PointerFX } from "@/components/fx/PointerFX";
import { RouteFX } from "@/components/fx/RouteFX";
import SplashScreen from "@/components/features/SplashScreen";
import { LoadingTrigger } from "@/components/features/LoadingTrigger";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { BootScript } from "@/components/layout/BootScript";
import { ReposProvider } from "@/components/ReposProvider";
import { LoadingProvider } from "@/context/LoadingContext";
import { BASE, SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.archive}`,
    template: "%s — " + SITE.name,
  },
  description: SITE.description,
  keywords: [
    "Kurohane Kaoruko",
    "开源",
    "AI Agents",
    "LLM",
    "Rust",
    "TypeScript",
    "Next.js",
    "Tauri",
    "个人网站",
  ],
  authors: [{ name: SITE.name, url: SITE.github }],
  creator: SITE.name,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.archive}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.archive}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  /** 站内自带深色界面，阻止国内浏览器的「智能反色」再翻一次 */
  other: {
    nightmode: "disable",
    "x5-nightmode": "disable",
    "supported-color-schemes": "dark",
  },
  icons: {
    icon: [{ url: `${BASE}/logo.jpg`, type: "image/jpeg" }],
    shortcut: [{ url: `${BASE}/logo.jpg`, type: "image/jpeg" }],
    apple: [{ url: `${BASE}/logo.jpg`, type: "image/jpeg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#070809",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <BootScript />

        <div id="top" />
        <a href="#main" className="skip-link">
          跳到主内容
        </a>

        <LoadingProvider>
          <ReposProvider>
            <SplashScreen />
            <Header />
            <main id="main" className="pt-[var(--nav-h)]">
              <RouteFX>{children}</RouteFX>
            </main>
            <Footer />
            <LoadingTrigger />
            <Cursor />
            <PointerFX />
          </ReposProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
