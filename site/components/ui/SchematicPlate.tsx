"use client";

import { useEffect, useRef, useState } from "react";
import { StackGraph } from "@/components/ui/StackGraph";
import { accessionOf, familyOf, type Project } from "@/lib/data";

/**
 * 图版。
 *
 * 一块带网格的黑色面板，里面是这个项目对应的系统图：编号、代号、
 * 走线、刻度。同一份数据永远画出同一张图。
 */
export function SchematicPlate({
  repo,
  plateNo,
  className = "",
  size = "md",
  showCaption = true,
  animate = false,
}: {
  repo: Pick<Project, "name" | "taxon" | "family" | "lang" | "stars" | "topics">;
  plateNo?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showCaption?: boolean;
  animate?: boolean;
}) {
  const family = familyOf(repo.family);
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const pad = size === "lg" ? "p-5 sm:p-6" : size === "sm" ? "p-3" : "p-4";
  const artHeight =
    size === "lg" ? "h-[250px] sm:h-[320px]" : size === "sm" ? "h-[118px]" : "h-[170px]";

  return (
    <figure ref={ref} className={"plate corner-ticks " + className}>
      <div className="plate-inner" />
      <div className={pad}>
        <div className="flex items-center justify-between gap-3">
          <span className="plate-index">
            FIG.{plateNo ?? "—"} // {accessionOf(repo.name)}
          </span>
          <span className="plate-index">{repo.lang || "—"}</span>
        </div>

        <div
          className={
            "schematic-grid relative mt-3 flex items-center justify-center overflow-hidden border border-line-soft " +
            artHeight
          }
        >
          <StackGraph
            name={repo.name}
            topics={repo.topics}
            lang={repo.lang}
            className="plate-art h-full w-full"
            animate={animate || (showCaption && inView)}
          />
          <span className="absolute right-2 top-2 h-1 w-1 bg-signal" aria-hidden="true" />
          <span className="absolute bottom-2 left-2 h-2 w-2 border-b border-l border-line-strong" aria-hidden="true" />
        </div>

        {showCaption && (
          <figcaption className="plate-caption mt-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate font-mono text-[11px] uppercase tracking-[0.1em] text-fg">
                {repo.name}
              </span>
              <span className="label-sm shrink-0">{family.code}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-3">
              <span className="truncate font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                {repo.taxon}
              </span>
              <span className="label-sm shrink-0">★ {repo.stars}</span>
            </div>
          </figcaption>
        )}
      </div>
    </figure>
  );
}
