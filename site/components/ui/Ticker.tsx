"use client";

import { useEffect, useRef } from "react";

/**
 * 数据跑马灯。
 *
 * 一条细带，把全部项目的代号连起来慢慢走。鼠标悬停会停下来 ——
 * 想看清某个名字的时候，它不该继续跑。
 *
 * 滚动时整条带子会被速度带歪一点，松手回正：像纸带被拖过滚轮。
 */
export function Ticker({ items }: { items: string[] }) {
  const row = [...items, ...items];
  const skewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = skewRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let last = window.scrollY;
    let skew = 0;
    let target = 0;
    let raf = 0;

    const tick = () => {
      skew += (target - skew) * 0.18;
      target *= 0.88;
      if (Math.abs(skew) < 0.02 && Math.abs(target) < 0.02) {
        el.style.setProperty("--skew", "0deg");
        raf = 0;
        return;
      }
      el.style.setProperty("--skew", `${skew.toFixed(2)}deg`);
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const v = y - last;
      last = y;
      target = Math.max(-2.6, Math.min(2.6, v * 0.22));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-skew" ref={skewRef}>
        <div className="ticker-track py-2.5">
          {row.map((item, i) => (
            <span key={i} className="flex shrink-0 items-center">
              <span className="px-5 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-2">
                {item}
              </span>
              <span className="text-[7px] text-signal opacity-70">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
