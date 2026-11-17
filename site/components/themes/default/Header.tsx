"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { NAV_ITEMS, SITE } from "@/lib/site";

const CommandPalette = dynamic(
  () =>
    import("@/components/layout/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false },
);

function GithubIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export default function DefaultHeader() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [palette, setPalette] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [path]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const close = () => {
      if (desktop.matches) setMenu(false);
    };
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    const background = [
      ...document.querySelectorAll<HTMLElement>("main,footer"),
    ];
    const inert = background.map((el) => el.inert);
    document.body.style.overflow = "hidden";
    background.forEach((el) => {
      el.inert = true;
    });
    const focus = requestAnimationFrame(() =>
      menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus(),
    );
    const key = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !menuRef.current?.querySelector('[role="listbox"]')
      ) {
        setMenu(false);
        buttonRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const list = [
        buttonRef.current,
        ...Array.from(
          menuRef.current?.querySelectorAll<HTMLElement>(
            "a[href],button:not([disabled])",
          ) ?? [],
        ),
      ].filter((el): el is HTMLElement => Boolean(el?.getClientRects().length));
      const index = list.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        list.at(-1)?.focus();
      } else if (!event.shiftKey && (index === list.length - 1 || index < 0)) {
        event.preventDefault();
        list[0]?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      background.forEach((el, i) => {
        el.inert = inert[i];
      });
      cancelAnimationFrame(focus);
      document.removeEventListener("keydown", key);
    };
  }, [menu]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMenu(false);
        setPalette((value) => !value);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  return (
    <>
      <header className="default-header" data-scrolled={scrolled}>
        <Link
          className="default-wordmark"
          href="/"
          aria-label={`${SITE.name} home`}
        >
          <span className="default-wordmark-icon" aria-hidden="true">
            K<span>.</span>
          </span>
          <span className="default-wordmark-name">Kurohane Kaoruko</span>
        </Link>
        <nav className="default-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                (item.href === "/" ? path === "/" : path.startsWith(item.href))
                  ? "page"
                  : undefined
              }
            >
              {item.cn}
            </Link>
          ))}
        </nav>
        <div className="default-header-actions">
          <button
            className="default-search"
            type="button"
            onClick={() => {
              setMenu(false);
              setPalette(true);
            }}
            aria-label="搜索项目，快捷键 Command K"
          >
            <svg
              viewBox="0 0 20 20"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              aria-hidden="true"
            >
              <circle cx="8.5" cy="8.5" r="5.8" />
              <path d="m13 13 4.5 4.5" />
            </svg>
            <kbd>⌘ K</kbd>
          </button>
          <a
            className="default-social"
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
          <ThemeSwitcher className="default-theme-switch" />
          <button
            className="default-menu-button"
            ref={buttonRef}
            type="button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-controls="default-mobile-menu"
            aria-label={menu ? "Close menu" : "Open menu"}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <div className="default-header-gap" aria-hidden="true" />
      <div
        ref={menuRef}
        id="default-mobile-menu"
        className="default-mobile-menu"
        data-open={menu}
        inert={!menu}
        aria-hidden={!menu}
        role="dialog"
        aria-modal={menu || undefined}
        aria-label="Site navigation"
      >
        <div className="default-mobile-menu-top">
          <span>INDEX / MENU</span>
          <ThemeSwitcher />
        </div>
        <nav aria-label="Mobile navigation">
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenu(false)}
            >
              <span>0{index + 1}</span>
              <strong>{item.cn}</strong>
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
        </nav>
        <a
          className="default-mobile-github"
          href={SITE.github}
          target="_blank"
          rel="noreferrer"
        >
          <GithubIcon /> GitHub ↗
        </a>
      </div>
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </>
  );
}
