"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRepos } from "@/components/ReposProvider";
import { SpecimenDialog } from "@/components/collection/SpecimenDialog";
import { Portal } from "@/components/ui/Portal";
import { Schematic } from "@/components/ui/Schematic";
import { SchematicPlate } from "@/components/ui/SchematicPlate";
import { accessionOf, FAMILIES, familyOf, type FamilyId } from "@/lib/data";
import { pickFeatured, type Repo } from "@/lib/repos";

type SortKey = "curated" | "stars" | "name" | "pushed";
type View = "index" | "grid";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "stars", label: "STARS" },
  { key: "curated", label: "CURATED" },
  { key: "name", label: "NAME" },
  { key: "pushed", label: "UPDATED" },
];

const monthOf = (iso?: string) => (iso ? iso.slice(0, 7).replace("-", ".") : "—");

/**
 * 项目索引。
 *
 * 首页只取前几条，档案页给出完整的检索：按分类筛、按名称搜、按星标 /
 * 更新时间排，还能在「索引」与「图版」两种看法之间切换。
 *
 * 索引行的悬停预览是本组件最费劲的部分：一块跟随指针的小面板，
 * 用 rAF 写 transform，不触发 React 重渲染。
 */
export function Collection({
  mode = "archive",
  limit,
  className = "",
}: {
  mode?: "home" | "archive";
  limit?: number;
  className?: string;
}) {
  const { repos } = useRepos();
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<FamilyId | "all">("all");
  const [sort, setSort] = useState<SortKey>("stars");
  const [view, setView] = useState<View>("index");
  const [open, setOpen] = useState<Repo | null>(null);
  const [hovered, setHovered] = useState<Repo | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  /* 「/」聚焦搜索框 */
  useEffect(() => {
    if (mode !== "archive") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return;
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (typing) return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  /* 指针位置直接写进 transform，不经过 state */
  useEffect(() => {
    if (!hovered) {
      document.documentElement.classList.remove("over-card");
      return;
    }
    document.documentElement.classList.add("over-card");

    const place = () => {
      const el = previewRef.current;
      if (!el) return;
      const { x, y } = pointer.current;
      const w = 248;
      const left = Math.min(x + 24, window.innerWidth - w - 16);
      const top = Math.max(80, Math.min(y - 110, window.innerHeight - 240));
      el.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    };

    const move = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        place();
      });
    };

    place();

    /* 滚动时浏览器不会补发 pointerleave —— 元素从指针底下走掉了，事件却不来。
       这里按最后已知的指针位置重新判定一次，落到别的行就跟过去，落空就收起。 */
    let scrollRaf = 0;
    const recheck = () => {
      scrollRaf = 0;
      const el = document.elementFromPoint(pointer.current.x, pointer.current.y);
      const row = el?.closest<HTMLElement>(".index-row");
      const name = row?.dataset.repo;
      if (!name) {
        setHovered(null);
        return;
      }
      if (name !== hovered.name) {
        setHovered(repos.find((r) => r.name === name) ?? null);
      }
    };
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(recheck);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("over-card");
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [hovered, repos]);

  const items = useMemo(() => {
    let list = repos.slice();
    if (mode === "home") {
      /* 精选已经在上面的区块里出现过，这里不再重复 */
      const featured = new Set(pickFeatured(repos).map((r) => r.name));
      list = list.filter((r) => !featured.has(r.name));
    }
    if (mode === "archive") {
      if (family !== "all") list = list.filter((r) => r.family === family);
      const q = query.trim().toLowerCase();
      if (q) {
        list = list.filter((r) =>
          [r.name, r.taxon, r.desc, r.lang, ...r.topics].join(" ").toLowerCase().includes(q),
        );
      }
      if (sort === "curated")
        list.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
      if (sort === "stars") list.sort((a, b) => b.stars - a.stars || a.order - b.order);
      if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === "pushed")
        list.sort((a, b) => (b.pushedAt ?? "").localeCompare(a.pushedAt ?? "") || a.order - b.order);
    }
    return limit ? list.slice(0, limit) : list;
  }, [repos, mode, family, query, sort, limit]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    repos.forEach((r) => map.set(r.family, (map.get(r.family) ?? 0) + 1));
    return map;
  }, [repos]);

  const reset = () => {
    setQuery("");
    setFamily("all");
  };

  /* 详情里用 ← → 在当前列表里翻页 */
  const openIndex = open ? items.findIndex((r) => r.name === open.name) : -1;
  const step = (delta: number) => {
    if (!open || openIndex < 0 || items.length < 2) return;
    setOpen(items[(openIndex + delta + items.length) % items.length]);
  };

  return (
    <div className={className}>
      {mode === "archive" && (
        <div className="mb-1 flex flex-col gap-4 border-b border-line pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="group flex min-w-[200px] flex-1 items-center gap-2.5 border border-line px-3 py-2 transition-colors focus-within:border-line-strong">
              <span className="font-mono text-[11px] text-signal">/</span>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索项目、技术栈或关键词"
                className="w-full bg-transparent text-[13px] text-fg outline-none placeholder:text-faint"
                aria-label="搜索项目"
              />
              <kbd className="hidden shrink-0 border border-line px-1.5 py-0.5 font-mono text-[9px] text-faint sm:block">
                /
              </kbd>
            </label>

            <div className="flex items-center border border-line">
              {(["index", "grid"] as View[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setView(v);
                    setHovered(null);
                  }}
                  data-active={view === v}
                  className="px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted transition-colors data-[active=true]:bg-fg data-[active=true]:text-bg hover:text-fg data-[active=true]:hover:text-bg"
                >
                  {v === "index" ? "INDEX" : "GRID"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFamily("all")}
                data-active={family === "all"}
                className="border border-transparent px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted transition-colors data-[active=true]:border-line-strong data-[active=true]:text-fg hover:text-fg"
              >
                ALL <span className="text-faint">{repos.length}</span>
              </button>
              {FAMILIES.filter((f) => (counts.get(f.id) ?? 0) > 0).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFamily(f.id)}
                  data-active={family === f.id}
                  className="border border-transparent px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted transition-colors data-[active=true]:border-line-strong data-[active=true]:text-fg hover:text-fg"
                >
                  {f.code} <span className="text-faint">{counts.get(f.id)}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="label-sm">
                {String(items.length).padStart(2, "0")} / {String(repos.length).padStart(2, "0")}
              </span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="appearance-none border border-line bg-transparent py-1.5 pl-2.5 pr-7 font-mono text-[9.5px] uppercase tracking-[0.12em] text-fg outline-none transition-colors hover:border-line-strong"
                  aria-label="排序方式"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key} className="bg-bg text-fg">
                      {s.label}
                    </option>
                  ))}
                </select>
                <svg
                  viewBox="0 0 10 6"
                  className="pointer-events-none absolute right-2.5 top-1/2 h-1.5 w-2.5 -translate-y-1/2 text-muted"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  aria-hidden="true"
                >
                  <path d="M0 0 L5 6 L10 0" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Schematic seed="no-match" variant="network" detail="mini" className="h-24 w-32 text-faint" />
          <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.18em] text-fg">NO MATCH</p>
          <p className="label mt-2">没有符合条件的项目</p>
          <button type="button" onClick={reset} className="btn btn-ghost mt-6">
            清除筛选
          </button>
        </div>
      )}

      {view === "index" && items.length > 0 && (
        <div className="index-list">
          <div className="index-head grid-cols-[34px_minmax(0,1fr)_16px] md:grid-cols-[40px_minmax(0,1fr)_84px_104px_50px_78px_16px]">
            <span className="label-sm">NO.</span>
            <span className="label-sm">PROJECT</span>
            <span className="label-sm hidden md:block">CATEGORY</span>
            <span className="label-sm hidden md:block">STACK</span>
            <span className="label-sm hidden text-right md:block">★</span>
            <span className="label-sm hidden text-right md:block">UPDATED</span>
            <span />
          </div>

          {items.map((repo, i) => {
            const fam = familyOf(repo.family);
            return (
              <button
                key={repo.name}
                type="button"
                onClick={() => setOpen(repo)}
                onPointerEnter={(e) => {
                  if (view !== "index") return;
                  if (e.pointerType === "mouse") {
                    pointer.current = { x: e.clientX, y: e.clientY };
                    setHovered(repo);
                  }
                }}
                onPointerLeave={() => setHovered(null)}
                aria-haspopup="dialog"
                data-cx-label="OPEN"
                data-repo={repo.name}
                className="index-row w-full grid-cols-[34px_minmax(0,1fr)_16px] text-left md:grid-cols-[40px_minmax(0,1fr)_84px_104px_50px_78px_16px]"
              >
                <span className="num text-[10px] text-faint">{String(i + 1).padStart(3, "0")}</span>

                <span className="row-name min-w-0">
                  <span className="flex min-w-0 items-baseline gap-3">
                    <span className="truncate text-[14.5px] font-medium uppercase tracking-[-0.01em] text-fg">
                      {repo.name}
                    </span>
                    <span className="leader hidden sm:block" aria-hidden="true" />
                  </span>
                  <span
                    className="decode mt-0.5 block truncate font-mono text-[9px] uppercase tracking-[0.12em] text-faint"
                    data-text={repo.taxon}
                  >
                    {repo.taxon}
                  </span>
                </span>

                <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted md:block">
                  {fam.code}
                </span>

                <span className="hidden truncate font-mono text-[10px] text-muted md:block">
                  {repo.lang || "—"}
                </span>

                <span className="num hidden text-right text-[10px] text-muted md:block">
                  {repo.stars > 0 ? repo.stars : "—"}
                </span>

                <span className="num hidden text-right text-[10px] text-faint md:block">
                  {monthOf(repo.pushedAt)}
                </span>

                <span className="row-arrow text-signal" aria-hidden="true">
                  ↗
                </span>
              </button>
            );
          })}
        </div>
      )}

      {view === "grid" && items.length > 0 && (
        <div className="grid-list mt-7 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((repo, i) => (
            <button
              key={repo.name}
              type="button"
              onClick={() => setOpen(repo)}
              className="cv-auto grid-card group text-left"
              aria-haspopup="dialog"
              data-cx-label="OPEN"
            >
              <SchematicPlate
                repo={repo}
                plateNo={String(i + 1).padStart(2, "0")}
                showCaption={false}
                className="liftable"
              />
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <span className="truncate text-[14px] font-medium uppercase tracking-[-0.01em] text-fg">
                  {repo.name}
                </span>
                <span className="label-sm shrink-0">{repo.lang || "—"}</span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-muted">{repo.desc}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-faint transition-colors group-hover:text-signal">
                <span className="decode" data-text={accessionOf(repo.name)}>
                  {accessionOf(repo.name)}
                </span>
                <span aria-hidden="true">↗</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {mode === "home" && (
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <p className="label">其余项目 · 完整索引见档案页</p>
          <Link href="/projects/" className="link font-mono text-[10px] uppercase tracking-[0.18em] text-fg">
            VIEW ALL {repos.length} →
          </Link>
        </div>
      )}

      {/* 跟随指针的预览 */}
      <Portal>
        <div ref={previewRef} className="cursor-plate" data-visible={hovered ? "true" : "false"}>
          {hovered && (
            <div className="w-[248px] border border-line-strong bg-bg-2 shadow-[0_30px_60px_-20px_#000]">
              <div className="flex items-baseline justify-between gap-2 border-b border-line px-3 py-2">
                <p className="truncate font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg">
                  {hovered.name}
                </p>
                <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.12em] text-signal">
                  {familyOf(hovered.family).code}
                </span>
              </div>

              <div className="px-3 py-2.5">
                <p className="line-clamp-3 text-[11.5px] leading-[1.7] text-fg-2">
                  {hovered.desc || "这个项目还没有写说明。"}
                </p>
              </div>

              <div className="flex items-baseline justify-between gap-2 border-t border-line px-3 py-1.5">
                <span className="truncate font-mono text-[8px] uppercase tracking-[0.14em] text-faint">
                  {accessionOf(hovered.name)}
                </span>
                <span className="shrink-0 font-mono text-[8px] text-fg-2">★ {hovered.stars}</span>
              </div>

              <p className="truncate border-t border-line px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                {hovered.topics.slice(0, 4).join(" / ") || hovered.lang || "—"}
              </p>
            </div>
          )}
        </div>
      </Portal>

      {open && (
        <SpecimenDialog
          repo={open}
          plateNo={String(repos.findIndex((r) => r.name === open.name) + 1).padStart(2, "0")}
          position={
            openIndex >= 0
              ? `${String(openIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`
              : undefined
          }
          onPrev={items.length > 1 ? () => step(-1) : undefined}
          onNext={items.length > 1 ? () => step(1) : undefined}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
