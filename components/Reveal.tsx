"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * 滚动入场。
 *
 * 与常见写法的区别：隐藏态不是放在服务端 HTML 里的，而是水合之后由 JS 追加。
 * 这样做的收益是 —— 没有 JS（或 JS 失败）时内容照常可见，
 * 首屏元素也不会先隐藏再"闪一下"出现。
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 已经在首屏（或上方）的元素不参与入场动画，直接呈现
    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    if (inViewport) return;

    el.classList.add("reveal-hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.classList.add("reveal-in");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={delay ? { transitionDelay: delay + "s" } : undefined}>
      {children}
    </div>
  );
}
