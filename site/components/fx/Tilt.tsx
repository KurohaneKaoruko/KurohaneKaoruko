"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * 指针跟随的轻微透视。
 *
 * 只写 CSS 变量，不触发 React 重渲染。触屏与减动效偏好下不启用，
 * 面板保持完全平放。
 */
export function Tilt({
  children,
  className = "",
  max = 5,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty("--rx", `${(-py * max).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
        el.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(1)}%`);
      });
    };

    const reset = () => {
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    const enter = () => el.classList.add("is-tilting");

    /* 滚动时指针和面板的相对位置变了，透视要放平，不然会一直歪着 */
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        reset();
      });
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [max]);

  return (
    <div ref={ref} className={"tilt " + className}>
      <div className="tilt-inner">{children}</div>
      {glare && <span className="tilt-glare" aria-hidden="true" />}
    </div>
  );
}
