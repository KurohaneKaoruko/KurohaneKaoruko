"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";

export default function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState("perspective(900px)");
  const [spot, setSpot] = useState({ x: 50, y: 50, o: 0 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt(
      `perspective(900px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 9}deg) translateY(-2px)`
    );
    setSpot({ x: px * 100, y: py * 100, o: 1 });
  };

  const onLeave = () => {
    setTilt("perspective(900px)");
    setSpot((s) => ({ ...s, o: 0 }));
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ transform: tilt }}
      className={
        "group relative overflow-hidden border border-border bg-card-bg/70 transition duration-200 hover:border-active " +
        (className ?? "")
      }
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.o,
          background: `radial-gradient(420px circle at ${spot.x}% ${spot.y}%, rgba(255,51,51,0.10), transparent 45%)`,
        }}
      />
      {children}
    </div>
  );
}
