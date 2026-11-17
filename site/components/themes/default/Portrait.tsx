"use client";

import { useRef, useState, type PointerEvent } from "react";
import { BASE } from "@/lib/site";

export function Portrait() {
  const root = useRef<HTMLDivElement>(null);
  const [original, setOriginal] = useState(false);

  const inspect = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      original ||
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
      data-original={original}
      onPointerMove={inspect}
      onPointerLeave={() => root.current?.removeAttribute("data-inspecting")}
    >
      <div className="portrait-pixels-layer">
        <img
          className="portrait-pixels"
          src={`${BASE}/portrait-pixels.webp`}
          alt="Kurohane Kaoruko 的像素头像"
          width={960}
          height={960}
          fetchPriority="high"
          draggable={false}
        />
      </div>
      <div className="portrait-lens" aria-hidden="true">
        <img
          className="portrait-original"
          src={`${BASE}/portrait-mono.webp`}
          alt=""
          width={960}
          height={960}
          draggable={false}
        />
      </div>
      <button
        type="button"
        className="portrait-mode"
        onClick={() => {
          root.current?.removeAttribute("data-inspecting");
          setOriginal(!original);
        }}
        aria-pressed={original}
        aria-label="切换头像：像素 / 原图"
      >
        <span className="portrait-mode-icon" aria-hidden="true" />
        <span>
          像素 <b>/</b> 原图
        </span>
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
