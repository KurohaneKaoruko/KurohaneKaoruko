"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * 路由切换时的一道扫描线。
 *
 * 内容整体轻微上浮淡入，同时一条 1px 的红线从上往下扫过一屏 ——
 * 像系统在重新对焦。只做一次，不阻塞点击。
 */
export function RouteFX({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <span key={`scan-${pathname}`} className="route-scan" aria-hidden="true" />
      <div key={`in-${pathname}`} className="route-in">
        {children}
      </div>
    </>
  );
}
