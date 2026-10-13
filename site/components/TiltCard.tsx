"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

/**
 * 指针跟随的轻微倾斜卡片 + 跟随光斑。
 * 全程直接写 DOM 样式，不经过 React 状态，移动端指针为 touch 时不触发。
 */
export default function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    el.style.transform =
      "perspective(900px) rotateX(" +
      ((0.5 - py) * 6).toFixed(2) +
      "deg) rotateY(" +
      ((px - 0.5) * 8).toFixed(2) +
      "deg) translateY(-2px)";

    const spot = spotRef.current;
    if (spot) {
      spot.style.opacity = "1";
      // color-mix 让光斑自动跟随主题强调色
      spot.style.background =
        "radial-gradient(420px circle at " +
        (px * 100).toFixed(1) +
        "% " +
        (py * 100).toFixed(1) +
        "%, color-mix(in srgb, var(--primary) 12%, transparent), transparent 45%)";
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px)";
    if (spotRef.current) spotRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={
        "surface surface-hover group relative overflow-hidden duration-200 will-change-transform " +
        (className ?? "")
      }
    >
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
      />
      {children}
    </div>
  );
}
