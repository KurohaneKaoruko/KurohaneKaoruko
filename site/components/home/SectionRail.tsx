"use client";

import { useEffect, useState } from "react";
import { Portal } from "@/components/ui/Portal";

const ITEMS = [
  { id: "hero", no: "00", label: "TOP" },
  { id: "selected", no: "01", label: "SELECTED" },
  { id: "collection", no: "02", label: "INDEX" },
  { id: "data", no: "03", label: "DATA" },
];

/**
 * 页内索引。
 *
 * 贴在右缘的一列刻度，当前区块的点变红。窄屏隐藏，避免和内容抢位置。
 */
export function SectionRail() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const sections = ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el != null,
    );
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, []);

  return (
    <Portal>
      <nav className="rail" aria-label="页内导航">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="rail-item"
            data-active={active === item.id}
            onClick={() => {
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            aria-label={item.label}
            aria-current={active === item.id ? "true" : undefined}
          >
            <span className="rail-label">{item.label}</span>
            <span className="rail-dot" aria-hidden="true" />
            <span className="rail-no">{item.no}</span>
          </button>
        ))}
      </nav>
    </Portal>
  );
}
