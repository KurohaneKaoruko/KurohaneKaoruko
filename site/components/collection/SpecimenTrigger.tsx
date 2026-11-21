"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import type { Repo } from "@/lib/repos";

/**
 * 详情面板按需加载。
 *
 * SpecimenDialog 只在用户点开项目后渲染，拆成独立 chunk 按需加载。
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
