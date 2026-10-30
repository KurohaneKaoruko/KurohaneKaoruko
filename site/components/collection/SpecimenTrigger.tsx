"use client";

import { useState, type ReactNode } from "react";
import { SpecimenDialog } from "@/components/collection/SpecimenDialog";
import type { Repo } from "@/lib/repos";

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
