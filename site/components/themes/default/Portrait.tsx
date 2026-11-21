"use client";

import { useRef, type PointerEvent } from "react";
import pixels from "@/public/portrait-pixels.webp";
import original from "@/public/portrait-mono.webp";

export function Portrait() {
  const root = useRef<HTMLDivElement>(null);

  const inspect = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    root.current?.style.setProperty(
      "--portrait-x",
      `${event.clientX - rect.left}px`,
    );
    root.current?.style.setProperty(
      "--portrait-y",
      `${event.clientY - rect.top}px`,
    );
    root.current?.setAttribute("data-inspecting", "true");
  };

  return (
    <div
      className="folio-portrait"
      ref={root}
      onPointerMove={inspect}
      onPointerLeave={() => root.current?.removeAttribute("data-inspecting")}
    >
      <div className="portrait-pixels-layer">
        <img
          className="portrait-pixels"
          src={pixels.src}
          alt="Kurohane Kaoruko 的像素头像"
          width={pixels.width}
          height={pixels.height}
          fetchPriority="high"
          draggable={false}
        />
      </div>
      <div className="portrait-lens" aria-hidden="true">
        <img
          className="portrait-original"
          src={original.src}
          alt=""
          width={original.width}
          height={original.height}
          draggable={false}
        />
      </div>
    </div>
  );
}
