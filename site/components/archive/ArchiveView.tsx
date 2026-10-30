"use client";

import { useMemo } from "react";
import { useRepos } from "@/components/ReposProvider";
import { Collection } from "@/components/collection/Collection";
import { FAMILIES } from "@/lib/data";

/**
 * 项目档案页。
 *
 * 标题区给出分类概览，下面交给可检索的索引。
 */
export function ArchiveView() {
  const { repos, status } = useRepos();

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    repos.forEach((r) => map.set(r.family, (map.get(r.family) ?? 0) + 1));
    return map;
  }, [repos]);

  return (
    <>
      <header className="shell">
        <div className="flex items-center justify-between border-b border-line py-3">
          <span className="eyebrow">02 — Projects</span>
          <span className="label-sm flex items-center gap-2">
            <span
              className={
                "inline-block h-1.5 w-1.5 rounded-full " +
                (status === "live" ? "bg-signal" : status === "syncing" ? "bg-fg-2" : "bg-faint")
              }
              aria-hidden="true"
            />
            {status === "live" ? "LIVE · GITHUB" : status === "syncing" ? "SYNCING…" : "SNAPSHOT"}
          </span>
        </div>

        <div className="grid gap-10 pb-10 pt-10 lg:grid-cols-12 lg:gap-0 lg:pb-14">
          <div className="lg:col-span-8 lg:pr-10">
            <h1 className="display hero-rise text-[clamp(2.7rem,6.8vw,5.4rem)] uppercase text-fg">
              Index<span className="text-signal">.</span>
            </h1>
            <p
              className="hero-rise mt-5 max-w-[52ch] text-[14px] leading-[1.9] text-fg-2"
              style={{ "--d": "80ms" } as React.CSSProperties}
            >
              全部公开仓库，按星标排序、按分类归档。数据每天由 CI 从 GitHub 刷新一次，
              页面打开时再同步实时星标。
              点开任意一行看详情，也可以切到图版视图逐张翻看。
            </p>
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-line lg:pl-10">
            <p className="label">GROUPS</p>
            <ul className="mt-3 border-t border-line">
              {FAMILIES.filter((f) => (counts.get(f.id) ?? 0) > 0).map((f) => (
                <li
                  key={f.id}
                  className="flex items-baseline justify-between gap-4 border-b border-line-soft py-2"
                >
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-fg-2">
                    {f.code}
                  </span>
                  <span className="label-sm">{f.cn}</span>
                  <span className="num ml-auto text-[10px] text-muted">
                    {String(counts.get(f.id) ?? 0).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <div className="shell pb-16">
        <Collection mode="archive" />
      </div>
    </>
  );
}
