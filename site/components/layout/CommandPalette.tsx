"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useRepos } from "@/components/ReposProvider";
import { Portal } from "@/components/ui/Portal";
import { familyOf } from "@/lib/data";
import { NAV_ITEMS, SITE } from "@/lib/site";

type Entry = {
  id: string;
  group: string;
  label: string;
  sub: string;
  href?: string;
  external?: boolean;
};

/**
 * ⌘K：全站跳转。
 *
 * 页面、全部项目、外部链接放在同一个列表里，输入即过滤，
 * 上下键选择、回车打开。
 */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { repos } = useRepos();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const entries = useMemo<Entry[]>(() => {
    const pages: Entry[] = NAV_ITEMS.map((item) => ({
      id: "page-" + item.href,
      group: "PAGES",
      label: item.cn,
      sub: item.en,
      href: item.href,
    }));
    const specimens: Entry[] = repos.map((r) => ({
      id: "repo-" + r.name,
      group: "PROJECTS",
      label: r.name,
      sub: `${familyOf(r.family).code} · ${r.lang || "—"}`,
      href: r.url,
      external: true,
    }));
    const links: Entry[] = [
      {
        id: "github",
        group: "LINKS",
        label: "GitHub",
        sub: "@" + SITE.handle,
        href: SITE.github,
        external: true,
      },
      {
        id: "mail",
        group: "LINKS",
        label: "写邮件",
        sub: SITE.email,
        href: "mailto:" + SITE.email,
        external: true,
      },
    ];
    return [...pages, ...specimens, ...links];
  }, [repos]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? entries.filter((e) => (e.label + " " + e.sub).toLowerCase().includes(q))
      : entries;
    return list.slice(0, 40);
  }, [entries, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const go = (entry: Entry) => {
    onClose();
    if (!entry.href) return;
    if (entry.external) {
      window.open(entry.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(entry.href);
    }
  };

  return (
    <Portal>
      <div className="scrim" onClick={onClose} aria-hidden="true" />
      <div className="palette" role="dialog" aria-modal="true" aria-label="全站搜索">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <span className="font-mono text-[12px] text-signal">&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                go(results[active]);
              }
            }}
            placeholder="跳转到页面或项目…"
            className="w-full bg-transparent py-4 text-[14px] text-fg outline-none placeholder:text-faint"
            aria-label="搜索"
          />
          <kbd className="shrink-0 border border-line px-1.5 py-0.5 font-mono text-[9px] text-faint">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[min(58vh,460px)] overflow-y-auto py-2">
          {results.length === 0 && (
            <p className="px-4 py-10 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              NO MATCH
            </p>
          )}
          {results.map((entry, i) => {
            const showGroup = i === 0 || results[i - 1].group !== entry.group;
            return (
              <div key={entry.id}>
                {showGroup && <p className="label-sm px-4 pb-1.5 pt-3">{entry.group}</p>}
                <button
                  type="button"
                  data-active={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(entry)}
                  className="palette-item w-full text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-fg">{entry.label}</span>
                    <span className="mt-0.5 block truncate font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                      {entry.sub}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-faint">
                    {entry.external ? "↗" : "↵"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2">
          <span className="label-sm">↑↓ SELECT · ↵ OPEN</span>
          <span className="label-sm">{SITE.archive}</span>
        </div>
      </div>
    </Portal>
  );
}
