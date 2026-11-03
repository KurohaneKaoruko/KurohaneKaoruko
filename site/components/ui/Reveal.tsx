"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 滚动显现。
 *
 * 只做一件事：元素进入视口时把 data-shown 置为 true，然后断开观察。
 * 位移与时长写在 CSS 里，组件不参与动画计算，滚动时不会触发重排。
 *
 * 关于「首屏优先」：默认要等水合 + IntersectionObserver 回调才把内容显示
 * 出来（CSS 里 .js .reveal 是 opacity: 0）。这对页面中段没问题，但落在
 * 首屏的 Reveal 会让内容多等一整个水合周期 —— Lighthouse 记到的
 * elementRenderDelay 能到 2s，LCP 直接翻倍。
 *
 * 所以给首屏区块加 eager：挂载时先按「是否已在视口内」判断一次，命中就
 * 立刻显示，不排队等观察器；同时 CSS 侧对 eager 不做初始隐藏。滚出去的
 * 元素行为不变。
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  threshold = 0.12,
  eager = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
  /** 首屏区块用：不做初始隐藏，立即显示 */
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(eager);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    // eager 已在初始状态里显示，无需观察
    if (eager) return;
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
  }, [threshold, eager]);

  return (
    <div
      ref={ref}
      className={"reveal " + className}
      data-shown={shown ? "true" : "false"}
      data-eager={eager ? "true" : undefined}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export default Reveal;
