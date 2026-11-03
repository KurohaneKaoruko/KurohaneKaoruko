"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import type { Repo } from "@/lib/repos";

/**
 * 详情面板按需加载。
 *
 * SpecimenDialog 带着 Schematic（一块几百行的 SVG 系统图）与 Portal，
 * 但只有用户真的点开某个项目时才会用到。以前是静态 import，于是首屏
 * 就为一次可能永远不会发生的点击付了打包与解析的代价。
 *
 * next/dynamic 把它拆成独立 chunk：不点不下载。ssr: false 是因为它只在
 * 点击后存在，服务端渲染它没有意义。
 */
const SpecimenDialog = dynamic(
  () => import("@/components/collection/SpecimenDialog").then((m) => m.SpecimenDialog),
  { ssr: false },
);

/** 一个按钮，点开某个项目的详情面板 */
export function SpecimenTrigger({
  repo,
  children,
  className = "",
  plateNo,
}: {
  repo: Repo;
  children: ReactNode;
  className?: string;
  plateNo?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)} aria-haspopup="dialog">
        {children}
      </button>
      {open && <SpecimenDialog repo={repo} plateNo={plateNo} onClose={() => setOpen(false)} />}
    </>
  );
}
