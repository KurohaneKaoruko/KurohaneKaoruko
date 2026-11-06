"use client";

import type { ReactNode } from "react";
import { Reveal as BaseReveal } from "@/components/ui/Reveal";

/**
 * 主题首页用的 Reveal。
 *
 * v1 的调用约定是 `delay={0.05}`（秒），v2 的 Reveal 用毫秒；
 * 这里做一层薄封装，让移植过来的主题组件保持原有写法。
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  eager = false,
}: {
  children: ReactNode;
  /** 秒 */
  delay?: number;
  className?: string;
  eager?: boolean;
}) {
  return (
    <BaseReveal delay={Math.round(delay * 1000)} className={className} eager={eager}>
      {children}
    </BaseReveal>
  );
}
