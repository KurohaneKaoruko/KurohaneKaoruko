"use client";

import { useEffect, useRef } from "react";

/**
 * 会数数的数字。
 *
 * 进入视口后从 0 滚到目标值；数据从快照换成实时值时，从当前值再滚一次，
 * 不会跳。服务端渲染的就是最终值，禁用 JS 也不会看到 0。
 */
export function Counter({
  value,
  pad = 0,
  className = "",
}: {
  value: number;
  pad?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const last = useRef(0);
  const armed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fmt = (n: number) => String(Math.round(n)).padStart(pad, "0");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = fmt(value);
      last.current = value;
      return;
    }

    const run = (to: number) => {
      const from = last.current;
      if (from === to) {
        el.textContent = fmt(to);
        return;
      }
      const t0 = performance.now();
      const dur = 820;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(from + (to - from) * eased);
        if (p < 1) requestAnimationFrame(tick);
        else last.current = to;
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        armed.current = true;
        run(value);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => io.disconnect();
  }, [pad]);

  /* 数据更新（快照 → 实时）时再滚一次 */
  useEffect(() => {
    const el = ref.current;
    if (!el || !armed.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(Math.round(value)).padStart(pad, "0");
      last.current = value;
      return;
    }
    const from = last.current;
    if (from === value) return;
    const t0 = performance.now();
    const dur = 820;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(from + (value - from) * eased)).padStart(pad, "0");
      if (p < 1) requestAnimationFrame(tick);
      else last.current = value;
    };
    requestAnimationFrame(tick);
  }, [value, pad]);

  return (
    <span ref={ref} className={className}>
      {String(value).padStart(pad, "0")}
    </span>
  );
}
