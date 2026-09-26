"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import type { ThemeMeta } from "@/lib/themes";

/** 色卡：左半底色、右半强调色，一眼看出主题调性 */
function Swatch({ theme, size = 12 }: { theme: ThemeMeta; size?: number }) {
  return (
    <span
      className="theme-swatch"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="flex h-full w-full">
        <span className="h-full w-1/2" style={{ backgroundColor: theme.swatch[0] }} />
        <span className="h-full w-1/2" style={{ backgroundColor: theme.swatch[1] }} />
      </span>
    </span>
  );
}

/**
 * 主题切换器。切换的是整站主题（<html data-theme>），
 * 所有页面、所有组件同步换色，不存在"只换首页"的情况。
 *
 * 两种形态，都是"主题数量增长友好"的：
 *   dropdown —— 导航栏用。触发按钮只占一个主题的宽度，面板内部滚动，
 *               加到十几个主题也不会撑爆导航
 *   grid     —— 移动端抽屉与首页用。多列网格，纵向排布
 */
export function ThemeSwitcher({
  variant = "dropdown",
  className,
}: {
  variant?: "dropdown" | "grid";
  className?: string;
}) {
  const { theme, themes, setTheme, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const active = themes.find((t) => t.id === theme) ?? themes[0];

  const close = useCallback(() => setOpen(false), []);

  // 点击外部 / Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>(".theme-trigger")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // 打开时把焦点放到当前主题
  useEffect(() => {
    if (!open) return;
    setFocusIndex(Math.max(0, themes.findIndex((t) => t.id === theme)));
  }, [open, theme, themes]);

  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      setFocusIndex((i) => (i + delta + themes.length) % themes.length);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setFocusIndex(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setFocusIndex(themes.length - 1);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const target = themes[focusIndex];
      if (target) setTheme(target.id);
      setOpen(false);
    }
  };

  // 焦点移动时把对应项滚进可视区
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelectorAll<HTMLElement>("[data-theme-option]")[focusIndex];
    el?.scrollIntoView({ block: "nearest" });
  }, [focusIndex, open]);

  if (variant === "grid") {
    return (
      <div
        className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}
        role="radiogroup"
        aria-label="站点主题"
      >
        {themes.map((t) => {
          const isActive = mounted && t.id === theme;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setTheme(t.id)}
              data-active={isActive}
              className="theme-option group flex items-start gap-3 border border-border bg-card-bg/50 p-4 text-left transition-colors"
            >
              <Swatch theme={t} size={16} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-mono text-xs uppercase tracking-[0.18em]",
                      isActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {t.label}
                  </span>
                  <span className="truncate font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
                    {t.name}
                  </span>
                  {isActive && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
                </span>
                <span className="mt-1.5 block text-[11px] leading-relaxed text-text-muted">
                  {t.desc}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        className="theme-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
        title={"站点主题：" + active.label + " / " + active.name}
      >
        <Swatch theme={active} />
        <span className="hidden sm:inline">{mounted ? active.label : "主题"}</span>
        <ChevronDown
          className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          id={panelId}
          ref={listRef}
          role="listbox"
          aria-label="站点主题"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          className="theme-panel absolute right-0 top-[calc(100%+8px)] z-[80] max-h-[min(70vh,26rem)] w-[19rem] overflow-y-auto p-1.5"
        >
          <p className="px-2.5 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
            站点主题 / THEME ({themes.length})
          </p>
          {themes.map((t, i) => {
            const isActive = mounted && t.id === theme;
            return (
              <button
                key={t.id}
                type="button"
                data-theme-option
                role="option"
                aria-selected={isActive}
                data-active={isActive}
                onMouseEnter={() => setFocusIndex(i)}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={cn(
                  "theme-option flex w-full items-start gap-3 border border-transparent px-2.5 py-2.5 text-left transition-colors",
                  i === focusIndex && "bg-foreground/5"
                )}
              >
                <Swatch theme={t} size={14} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-mono text-[11px] uppercase tracking-[0.18em]",
                        isActive ? "text-primary" : "text-foreground"
                      )}
                    >
                      {t.label}
                    </span>
                    <span className="truncate font-mono text-[9px] uppercase tracking-[0.15em] text-text-dim">
                      {t.name}
                    </span>
                    {isActive && <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-primary" />}
                  </span>
                  <span className="mt-1 block text-[10px] leading-relaxed text-text-muted">
                    {t.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
