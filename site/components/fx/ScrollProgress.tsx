"use client";

import { useEffect, useRef } from "react";

/**
 * 阅读进度。
 *
 * 顶栏底缘的一条红线，长度就是这一页读了多少。只写 transform，
 * 滚动时不做任何计算以外的事，也不触发重排。
 */
export function ScrollProgress() {
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const el = bar.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${p.toFixed(4)})`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span className="scroll-progress" aria-hidden="true">
      <span className="scroll-progress-bar" ref={bar} />
    </span>
  );
}
