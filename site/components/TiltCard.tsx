"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

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
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform =
      "perspective(900px) rotateX(" +
      ((0.5 - py) * 7).toFixed(2) +
      "deg) rotateY(" +
      ((px - 0.5) * 9).toFixed(2) +
      "deg) translateY(-2px)";
    const s = spotRef.current;
    if (s) {
      s.style.opacity = "1";
      s.style.background =
        "radial-gradient(420px circle at " +
        (px * 100).toFixed(1) +
        "% " +
        (py * 100).toFixed(1) +
        "%, rgba(255,51,51,0.10), transparent 45%)";
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
        "group relative overflow-hidden border border-border bg-card-bg/70 transition duration-200 will-change-transform hover:border-active " +
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
