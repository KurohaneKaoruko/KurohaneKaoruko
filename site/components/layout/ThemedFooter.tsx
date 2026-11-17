"use client";

import type { ReactNode } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

export function ThemedFooter({
  current,
  legacy,
}: {
  current: ReactNode;
  legacy: ReactNode;
}) {
  const { theme } = useTheme();
  return theme === "default" ? current : legacy;
}
