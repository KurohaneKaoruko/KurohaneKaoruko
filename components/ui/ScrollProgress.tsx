"use client";

import { useEffect, useRef } from "react";

/**
 * 顶部阅读进度条。
 * 滚动风暴中以 rAF 合帧，直接写 transform，不触发 React 重渲染。
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? Math.min(doc.scrollTop / max, 1) : 0;
      if (barRef.current) {
        barRef.current.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-transparent"
    >
      <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-primary" />
    </div>
  );
}
