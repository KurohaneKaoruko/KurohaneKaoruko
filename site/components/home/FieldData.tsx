"use client";

import { useMemo } from "react";
import { useCollectionStats, useRepos } from "@/components/ReposProvider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

/**
 * 数据。
 *
 * 不再重复首屏已经给出的四个总数：这里只放两张表——语言分布与
 * 最近更新的条目。细线、等宽字与一条水平的进度条，足够把数据说完。
 */
export function FieldData() {
  const { repos, status, syncedAt } = useRepos();
  const stats = useCollectionStats();

  const langs = useMemo(() => {
    const map = new Map<string, number>();
    repos.forEach((repo) => {
      const key = repo.lang || "UNTYPED";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [repos]);

  const recent = useMemo(
    () =>
      repos
        .filter((repo) => repo.pushedAt)
        .sort((a, b) => (b.pushedAt ?? "").localeCompare(a.pushedAt ?? ""))
        .slice(0, 4),
    [repos],
  );

  const max = Math.max(1, ...langs.map(([, count]) => count));

  const syncedLabel = syncedAt
    ? new Date(syncedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <section id="data" className="section border-t border-line">
      <div className="shell">
        <Reveal>
          <SectionHead index="03" en="The record" cn="数据" note="GITHUB SYNC" />
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-0">
          <Reveal className="lg:col-span-7 lg:pr-12" delay={40}>
            <div className="flex items-baseline justify-between border-b border-line pb-2">
              <span className="label">Stack distribution</span>
              <span className="label">
                {String(stats.langs).padStart(2, "0")} languages
              </span>
            </div>

            <div className="record-bars mt-6">
              {langs.map(([lang, count], index) => (
                <div key={lang} className="record-bar">
                  <span className="truncate font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg-2">
                    {lang}
                  </span>
                  <span className="bar-track">
                    <span
                      className="bar-fill"
                      data-hot={index === 0 ? "true" : undefined}
                      style={{ "--w": String(count / max) } as React.CSSProperties}
                    />
                  </span>
                  <span className="num text-right text-[10px] text-muted">{count}</span>
                </div>
              ))}
            </div>

            <p className="label-sm mt-6 flex items-center gap-2">
              <span
                className={
                  "inline-block h-1.5 w-1.5 " +
                  (status === "live" ? "bg-signal" : status === "syncing" ? "bg-fg-2" : "bg-faint")
                }
                aria-hidden="true"
              />
              {status === "live"
                ? `LIVE${syncedLabel ? " · SYNCED " + syncedLabel : ""}`
                : status === "syncing"
                  ? "SYNCING…"
                  : "OFFLINE · CACHED"}
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5 lg:border-l lg:border-line lg:pl-12" delay={100}>
            <div className="flex items-baseline justify-between border-b border-line pb-2">
              <span className="label">Recently updated</span>
              <span className="label">UTC</span>
            </div>

            <ul className="record-recent mt-2">
              {recent.length === 0 && (
                <li className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                  Loading…
                </li>
              )}
              {recent.map((repo) => (
                <li key={repo.name}>
                  <span className="truncate font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg">
                    {repo.name}
                  </span>
                  <span className="num shrink-0 text-[10px] text-muted">
                    {repo.pushedAt?.slice(0, 10).replace(/-/g, ".")}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
