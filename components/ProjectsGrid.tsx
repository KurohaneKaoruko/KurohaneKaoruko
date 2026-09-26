"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { useRepos } from "@/components/ReposProvider";
import { cn } from "@/lib/utils";

const SORTS = [
  { id: "stars", label: "星标" },
  { id: "name", label: "名称" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

export default function ProjectsGrid() {
  const { repos } = useRepos();
  const [lang, setLang] = useState<string>("ALL");
  const [sort, setSort] = useState<SortId>("stars");

  /** 语言筛选项跟着实际数据走 —— 实时拉来的仓库里可能出现新的语言 */
  const langs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of repos) {
      if (!p.lang) continue;
      counts.set(p.lang, (counts.get(p.lang) ?? 0) + 1);
    }
    const sorted = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name]) => name);
    return ["ALL", ...sorted];
  }, [repos]);

  /** 选中的语言在新数据里消失了（仓库改语言 / 拉取失败退回快照）时退回 ALL */
  const activeLang = lang !== "ALL" && !langs.includes(lang) ? "ALL" : lang;

  const shown = useMemo(() => {
    const filtered =
      activeLang === "ALL" ? repos : repos.filter((p) => p.lang === activeLang);
    return [...filtered].sort((a, b) =>
      sort === "stars" ? b.stars - a.stars || a.name.localeCompare(b.name) : a.name.localeCompare(b.name)
    );
  }, [repos, activeLang, sort]);

  return (
    <div>
      {/* 过滤与排序 */}
      <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex flex-wrap gap-2">
          {langs.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={activeLang === l}
              className={cn(
                "border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] transition-all",
                activeLang === l
                  ? "border-active bg-primary/10 text-primary"
                  : "border-border text-text-muted hover:border-primary/50 hover:text-foreground"
              )}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
            排序
          </span>
          <div className="flex border border-border">
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSort(s.id)}
                aria-pressed={sort === s.id}
                className={cn(
                  "px-3 py-1.5 font-mono text-[11px] transition-colors",
                  sort === s.id
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:text-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </div>

      <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.3em] text-text-dim">
        {String(shown.length).padStart(2, "0")} / {repos.length} repositories
      </p>
    </div>
  );
}
