"use client";

import { useEffect, useRef } from "react";
import { StackGraph } from "@/components/ui/StackGraph";

/**
 * 首屏的馆藏总图。
 *
 * 不指向任何一个具体项目 —— 中间是 ARCHIVE，四周是分类与数量。
 * 读者第一眼看到的是"这里有多少东西"，而不是"某一件东西"。
 *
 * 指针进到图里，会拉出一组十字准星和坐标读数：这块面板是一件仪器，
 * 不是一张插图。
 */
export function ArchivePanel({
  groups,
  total,
  stacks,
  stars,
}: {
  groups: { code: string; count: number }[];
  total: number;
  stacks: number;
  stars: number;
}) {
  const labels = groups.map((g) => `${g.code} ${String(g.count).padStart(2, "0")}`);

  const stageRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      raf = 0;
      const r = stage.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (x - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (y - r.top) / r.height));
      stage.style.setProperty("--cx", `${(px * 100).toFixed(2)}%`);
      stage.style.setProperty("--cy", `${(py * 100).toFixed(2)}%`);
      if (readRef.current) {
        readRef.current.textContent = `X${String(Math.round(px * 240)).padStart(3, "0")} Y${String(
          Math.round(py * 200),
        ).padStart(3, "0")}`;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };

    const onEnter = () => {
      stage.setAttribute("data-on", "true");
      document.documentElement.classList.add("over-plate");
    };
    const onLeave = () => {
      stage.setAttribute("data-on", "false");
      document.documentElement.classList.remove("over-plate");
    };

    /* 页面滚动后准星停在旧位置就成了错的读数，直接收起来 */
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        onLeave();
      });
    };

    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("over-plate");
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="plate corner-ticks p-4 sm:p-5">
      <div className="plate-inner" />
      <div className="flex items-center justify-between">
        <span className="plate-index">FIG.00 // ARCHIVE</span>
        <span className="plate-index">ALL PROJECTS</span>
      </div>

      <div
        ref={stageRef}
        data-on="false"
        className="plate-stage schematic-grid mt-3 h-[250px] overflow-hidden border border-line-soft sm:h-[320px]"
      >
        <StackGraph
          name="archive"
          topics={labels}
          lang={`${String(stacks).padStart(2, "0")} STACKS`}
          centerLabel="ARCHIVE"
          includeLang={false}
          className="plate-art h-full w-full"
          animate
        />
        <span className="plate-xhair" aria-hidden="true">
          <span className="plate-xhair-v" />
          <span className="plate-xhair-h" />
          <span className="plate-xhair-dot" />
          <span className="plate-xhair-read" ref={readRef}>
            X000 Y000
          </span>
        </span>
      </div>

      <div className="plate-caption mt-3 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg">
            Software Archive
          </p>
          <p className="label-sm mt-1">
            {total} PROJECTS · {groups.length} GROUPS
          </p>
        </div>
        <span className="label-sm shrink-0">★ {stars}</span>
      </div>
    </div>
  );
}
