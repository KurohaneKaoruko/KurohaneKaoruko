"use client";

import DefaultHeader from "@/components/themes/default/Header";
import Header from "@/components/layout/Header";
import { useTheme } from "@/components/theme/ThemeProvider";

export function SiteHeader() {
  const { theme } = useTheme();
  if (theme === "default") return <DefaultHeader />;
  return (
    <>
      <div className="legacy-header-space" aria-hidden="true" />
      <Header />
    </>
  );
}
