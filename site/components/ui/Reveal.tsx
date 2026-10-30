"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 滚动显现。
 *
 * 只做一件事：元素进入视口时把 data-shown 置为 true，然后断开观察。
 * 位移与时长写在 CSS 里，组件不参与动画计算，滚动时不会触发重排。
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  threshold = 0.12,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={"reveal " + className}
      data-shown={shown ? "true" : "false"}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export default Reveal;
