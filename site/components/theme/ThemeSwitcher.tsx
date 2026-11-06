"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";
import { preloadTheme } from "@/components/theme/registry";
import { cn } from "@/lib/utils";
import type { ThemeMeta } from "@/components/theme/types";

/** 色卡：一半底色、一半强调色，一眼看出主题调性 */
function Swatch({ theme, size = 12 }: { theme: ThemeMeta; size?: number }) {
  return (
    <span
      className="flex shrink-0 overflow-hidden border border-line-strong/60"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span className="h-full w-1/2" style={{ backgroundColor: theme.swatch[0] }} />
      <span className="h-full w-1/2" style={{ backgroundColor: theme.swatch[1] }} />
    </span>
  );
}

/** 主题缩略卡：底色、强调色、字标本与状态语 */
function ThemeSpecimen({ theme }: { theme: ThemeMeta }) {
  return (
    <span
      className="relative flex h-16 w-full flex-col justify-between overflow-hidden border border-line p-2"
      style={{ backgroundColor: theme.swatch[0] }}
      aria-hidden="true"
    >
      <span
        className="font-mono text-[8px] uppercase tracking-[0.24em] opacity-70"
        style={{ color: theme.swatch[1] }}
      >
        {theme.status}
      </span>
      <span
        className="font-sans text-2xl font-semibold leading-none tracking-[-0.04em]"
        style={{ color: theme.swatch[1] }}
      >
        Aa <span className="font-cn text-base">文</span>
      </span>
      <span
        className="absolute bottom-0 right-0 h-1.5 w-14"
        style={{ backgroundColor: theme.swatch[1] }}
      />
    </span>
  );
}

/**
 * 主题切换器。
 *
 * 切换的是整站主题（<html data-theme>），所有页面、所有组件同步换色。
 *
 * 两种形态：
 *   dropdown —— 顶栏用。触发按钮只占一个主题的宽度，面板内部滚动，
 *               加到几十个主题也不会撑爆导航。
 *   grid     —— 主题页与移动端用。多列卡片，带字标本预览。
 */
export function ThemeSwitcher({
  variant = "dropdown",
  className,
  showManageLink = true,
}: {
  variant?: "dropdown" | "grid";
  className?: string;
  showManageLink?: boolean;
}) {
  const { theme, themes, setTheme, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
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
    const onGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
        return;
      }
      const buttons = Array.from(
        gridRef.current?.querySelectorAll<HTMLButtonElement>("[data-theme-option]") ?? [],
      );
      const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (current < 0) return;
      e.preventDefault();

      const columns = window.matchMedia("(min-width: 1024px)").matches
        ? 3
        : window.matchMedia("(min-width: 640px)").matches
          ? 2
          : 1;

      let next = current;
      if (e.key === "ArrowRight") next = Math.min(buttons.length - 1, current + 1);
      if (e.key === "ArrowLeft") next = Math.max(0, current - 1);
      if (e.key === "ArrowDown") next = Math.min(buttons.length - 1, current + columns);
      if (e.key === "ArrowUp") next = Math.max(0, current - columns);
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = buttons.length - 1;
      buttons[next]?.focus();
    };

    return (
      <div
        ref={gridRef}
        className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}
        role="radiogroup"
        aria-label="站点主题"
        onKeyDown={onGridKeyDown}
      >
        {themes.map((t) => {
          const isActive = mounted && t.id === theme;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              data-theme-option
              data-active={isActive}
              onClick={() => setTheme(t.id)}
              onPointerEnter={() => preloadTheme(t.id)}
              onFocus={() => preloadTheme(t.id)}
              className={cn(
                "group flex flex-col gap-3 border p-3 text-left transition-colors",
                isActive
                  ? "border-signal bg-signal/5"
                  : "border-line bg-bg-2/40 hover:border-line-strong hover:bg-bg-2/70",
              )}
            >
              <ThemeSpecimen theme={t} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <Swatch theme={t} size={13} />
                  <span
                    className={cn(
                      "font-mono text-[11px] uppercase tracking-[0.18em]",
                      isActive ? "text-signal" : "text-fg",
                    )}
                  >
                    {t.label}
                  </span>
                  <span className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                    {t.name}
                  </span>
                  {isActive && (
                    <span className="ml-auto font-mono text-[11px] text-signal" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </span>
                <span className="mt-1.5 block text-[11px] leading-relaxed text-muted">
                  {t.desc}
                </span>
                <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.22em] text-faint">
                  {t.status}
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
        className="theme-trigger flex h-8 items-center gap-2 border border-line bg-bg/50 px-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-line-strong hover:text-fg"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
        title={"站点主题：" + active.label + " / " + active.name}
      >
        <Swatch theme={active} />
        <span className="hidden md:inline">{mounted ? active.label : "主题"}</span>
        <span
          className={cn(
            "font-mono text-[8px] transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          ref={listRef}
          role="listbox"
          aria-label="站点主题"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          className="absolute right-0 top-[calc(100%+8px)] z-[80] max-h-[min(70vh,30rem)] w-[min(20rem,calc(100vw-32px))] overflow-y-auto border border-line-strong bg-bg-2 p-1.5 shadow-[0_30px_80px_-30px_#000]"
        >
          <p className="px-2.5 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-faint">
            站点主题 / THEME
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
                onPointerEnter={() => {
                  setFocusIndex(i);
                  preloadTheme(t.id);
                }}
                onFocus={() => {
                  setFocusIndex(i);
                  preloadTheme(t.id);
                }}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-start gap-3 border px-2.5 py-2.5 text-left transition-colors",
                  isActive
                    ? "border-signal bg-signal/5"
                    : "border-transparent hover:border-line hover:bg-fg/5",
                  i === focusIndex && !isActive && "bg-fg/5",
                )}
              >
                <Swatch theme={t} size={14} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-mono text-[11px] uppercase tracking-[0.18em]",
                        isActive ? "text-signal" : "text-fg",
                      )}
                    >
                      {t.label}
                    </span>
                    <span className="truncate font-mono text-[9px] uppercase tracking-[0.15em] text-faint">
                      {t.name}
                    </span>
                    {isActive && (
                      <span className="ml-auto font-mono text-[11px] text-signal" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[10px] leading-relaxed text-muted">{t.desc}</span>
                </span>
              </button>
            );
          })}

          {showManageLink && (
            <Link
              href="/themes/"
              onClick={close}
              className="mt-1 flex items-center justify-between border-t border-line px-2.5 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-signal"
            >
              <span>打开主题档案</span>
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
