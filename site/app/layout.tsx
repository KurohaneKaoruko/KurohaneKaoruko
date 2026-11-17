import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  notoSansSC,
  plexSans,
  plexMono400,
  plexMono500,
  spaceGrotesk,
} from "./fonts";

import { Cursor } from "@/components/fx/Cursor";
import { PointerFX } from "@/components/fx/PointerFX";
import { RouteFX } from "@/components/fx/RouteFX";
import SplashScreen from "@/components/features/SplashScreen";
import { LoadingTrigger } from "@/components/features/LoadingTrigger";
import Footer from "@/components/layout/Footer";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BootScript } from "@/components/layout/BootScript";
import { ReposProvider } from "@/components/ReposProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";
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
    images: [
      {
        url: `${SITE.url}/og.png`,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — Independent developer & AI engineer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.archive}`,
    description: SITE.description,
    images: [`${SITE.url}/og.png`],
  },
  robots: { index: true, follow: true },
  /** 站内自带深色界面，阻止国内浏览器的「智能反色」再翻一次 */
  other: {
    nightmode: "disable",
    "x5-nightmode": "disable",
    "supported-color-schemes": "dark",
  },
  icons: {
    icon: [
      { url: `${BASE}/favicon-32.png`, type: "image/png", sizes: "32x32" },
      { url: `${BASE}/icon-192.png`, type: "image/png", sizes: "192x192" },
    ],
    shortcut: [{ url: `${BASE}/favicon-32.png`, type: "image/png" }],
    apple: [
      {
        url: `${BASE}/apple-touch-icon.png`,
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVars = [
    notoSansSC,
    plexSans,
    plexMono400,
    plexMono500,
    spaceGrotesk,
  ]
    .map((f) => f.variable)
    .join(" ");

  return (
    <html
      lang="zh-CN"
      data-theme="default"
      suppressHydrationWarning
      className={fontVars}
    >
      <body>
        <ThemeScript />
        <BootScript />

        <div id="top" />
        <a href="#main" className="skip-link">
          跳到主内容
        </a>

        <ThemeProvider>
          <LoadingProvider>
            <ReposProvider>
              <SplashScreen />
              <SiteHeader />
              <main id="main">
                <RouteFX>{children}</RouteFX>
              </main>
              <Footer />
              <LoadingTrigger />
              <Cursor />
              <PointerFX />
            </ReposProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
