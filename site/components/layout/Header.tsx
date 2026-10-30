"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { NAV_ITEMS, SITE } from "@/lib/site";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

/**
 * 顶栏。
 *
 * 64px 高的一条系统栏：方标 + 站名，中间三个编号过的分区，
 * 右侧是搜索与 GitHub。滚动之后才出现底色与底线。
 */
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 8);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /* 导航下划线：一条红线在三个入口之间滑动，鼠标离开就回到当前页 */
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const activeHref = NAV_ITEMS.find((item) => isActive(item.href))?.href ?? "/";
  const targetHref = hoveredNav ?? activeHref;

  const placeRef = useRef<() => void>(() => {});
  placeRef.current = () => {
    const nav = navRef.current;
    const bar = barRef.current;
    if (!nav || !bar) return;
    const link = nav.querySelector<HTMLElement>(`[data-nav="${targetHref}"]`);
    if (!link) return;
    const navRect = nav.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    bar.style.width = `${r.width}px`;
    bar.style.transform = `translate3d(${r.left - navRect.left}px, 0, 0)`;
    bar.style.opacity = "1";
  };

  useEffect(() => {
    placeRef.current();
  }, [targetHref, pathname]);

  useEffect(() => {
    const onResize = () => placeRef.current();
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(onResize).catch(() => {});
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header className="site-header" data-scrolled={scrolled || menuOpen}>
        <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3" aria-label={SITE.name}>
            <span className="relative flex h-7 w-7 items-center justify-center border border-line-strong">
              <span className="font-mono text-[9px] font-medium tracking-[0.08em] text-fg">
                {SITE.mark}
              </span>
              <span className="absolute -right-[3px] -top-[3px] h-1.5 w-1.5 bg-signal" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg">
                {SITE.name}
              </span>
              <span className="label-sm mt-1.5 hidden tracking-[0.26em] sm:block">
                {SITE.archive}
              </span>
            </span>
          </Link>

          <nav
            ref={navRef}
            className="relative hidden items-center gap-8 md:flex"
            aria-label="主导航"
            onPointerLeave={() => setHoveredNav(null)}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-nav={item.href}
                className="nav-link"
                data-active={isActive(item.href)}
                onPointerEnter={() => setHoveredNav(item.href)}
                onFocus={() => setHoveredNav(item.href)}
                onBlur={() => setHoveredNav(null)}
              >
                <span className="nav-no">{item.no}</span>
                <span className="nav-cn">{item.cn}</span>
              </Link>
            ))}
            <span ref={barRef} className="nav-bar" aria-hidden="true" />
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 border border-line px-2.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-line-strong hover:text-fg sm:flex"
              aria-label="打开全站搜索"
            >
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="7" cy="7" r="4.6" />
                <path d="M10.6 10.6 L14 14" />
              </svg>
              <span>⌘K</span>
            </button>

            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hidden p-1.5 text-muted transition-colors hover:text-fg sm:block"
            >
              <GithubMark className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="relative flex h-8 w-8 items-center justify-center border border-line text-fg transition-colors hover:border-line-strong md:hidden"
              aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
              aria-expanded={menuOpen}
            >
              <span className="sr-only">菜单</span>
              <span className="flex w-3.5 flex-col gap-[3px]">
                <span
                  className={
                    "h-px w-full bg-current transition-transform duration-300 " +
                    (menuOpen ? "translate-y-[4px] rotate-45" : "")
                  }
                />
                <span className={"h-px w-full bg-current transition-opacity " + (menuOpen ? "opacity-0" : "")} />
                <span
                  className={
                    "h-px w-full bg-current transition-transform duration-300 " +
                    (menuOpen ? "-translate-y-[4px] -rotate-45" : "")
                  }
                />
              </span>
            </button>
          </div>
        </div>
        <ScrollProgress />
      </header>

      {/* 移动端整页菜单 */}
      <div
        className={
          "fixed inset-0 z-40 flex flex-col bg-bg pt-[var(--nav-h)] transition-all duration-300 md:hidden " +
          (menuOpen ? "visible opacity-100" : "invisible opacity-0")
        }
        aria-hidden={!menuOpen}
      >
        <nav className="shell flex flex-1 flex-col justify-center pb-20">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-baseline justify-between border-b border-line py-5"
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className="flex items-baseline gap-4">
                <span className="num text-[10px] text-signal">{item.no}</span>
                <span className="cn-title text-[clamp(1.9rem,9vw,2.8rem)] text-fg">{item.cn}</span>
              </span>
              <span className="label">{item.en}</span>
            </Link>
          ))}

          <div className="mt-10 flex items-center justify-between">
            <span className="label-sm flex items-center gap-2">
              <span className="status-dot" aria-hidden="true" /> SYSTEM ONLINE
            </span>
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="label flex items-center gap-2 text-fg"
              tabIndex={menuOpen ? 0 : -1}
            >
              <GithubMark className="h-4 w-4" /> GITHUB ↗
            </a>
          </div>
          <p className="label-sm mt-6">{SITE.email}</p>
        </nav>
        <div className="shell flex items-center justify-between border-t border-line py-4">
          <span className="label-sm">{SITE.archive}</span>
          <span className="label-sm">BUILD {SITE.build}</span>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
