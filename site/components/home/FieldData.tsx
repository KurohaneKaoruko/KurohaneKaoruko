"use client";

import { useMemo } from "react";
import { useCollectionStats, useRepos } from "@/components/ReposProvider";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";

/**
 * 数据。
 *
 * 不引用任何第三方统计卡片 —— 那些粗描边的 SVG 一放进来就会破坏这套
 * 单色界面。这里只用仓库数据自己画：细条形、等宽数字、最近修订。
 */
export function FieldData() {
  const { repos, status, syncedAt } = useRepos();
  const stats = useCollectionStats();

  const langs = useMemo(() => {
    const map = new Map<string, number>();
    repos.forEach((r) => {
      const key = r.lang || "UNTYPED";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [repos]);

  const recent = useMemo(
    () =>
      repos
        .filter((r) => r.pushedAt)
        .sort((a, b) => (b.pushedAt ?? "").localeCompare(a.pushedAt ?? ""))
        .slice(0, 3),
    [repos],
  );

  const max = Math.max(1, ...langs.map(([, n]) => n));

  const syncedLabel = syncedAt
    ? new Date(syncedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <section id="data" className="section border-t border-line">
      <div className="shell">
        <Reveal>
          <SectionHead
            index="03"
            en="Telemetry"
            cn="数据"
            note="GITHUB DAILY SYNC · LIVE MERGE"
          />
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-0">
          <Reveal className="lg:col-span-5 lg:pr-10" delay={40}>
            <div className="grid grid-cols-2 border-l border-t border-line">
              {[
                { label: "NODES / 项目", value: stats.total, pad: 2 },
                { label: "STARS / 星标", value: stats.stars, pad: 0 },
                { label: "STACKS / 语言", value: stats.langs, pad: 0 },
                { label: "GROUPS / 分类", value: stats.families, pad: 0 },
              ].map((stat) => (
                <div key={stat.label} className="border-b border-r border-line px-4 py-6">
                  <p className="label-sm">{stat.label}</p>
                  <p className="mono-display mt-3 text-[clamp(2rem,3.4vw,2.7rem)] text-fg">
                    <Counter value={stat.value} pad={stat.pad} />
                  </p>
                </div>
              ))}
            </div>

            <p className="label-sm mt-4 flex items-center gap-2">
              <span
                className={
                  "inline-block h-1.5 w-1.5 rounded-full " +
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

          <Reveal className="lg:col-span-7 lg:border-l lg:border-line lg:pl-10" delay={100}>
            <div>
              <div className="flex items-baseline justify-between border-b border-line pb-2">
                <span className="label">STACK DISTRIBUTION</span>
                <span className="label-sm">BY REPO COUNT</span>
              </div>

              <div className="mt-5 space-y-4">
                {langs.map(([lang, count], i) => (
                  <div key={lang} className="grid grid-cols-[96px_minmax(0,1fr)_26px] items-center gap-4">
                    <span className="truncate font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg-2">
                      {lang}
                    </span>
                    <span className="bar-track">
                      <span
                        className="bar-fill"
                        style={
                          {
                            "--w": String(count / max),
                            background: i === 0 ? "var(--signal)" : "var(--fg-2)",
                          } as React.CSSProperties
                        }
                      />
                    </span>
                    <span className="num text-right text-[10px] text-muted">{count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-9">
                <div className="flex items-baseline justify-between border-b border-line pb-2">
                  <span className="label">RECENTLY UPDATED</span>
                  <span className="label-sm">UTC</span>
                </div>
                <ul className="min-h-[96px]">
                  {recent.length === 0 && (
                    <li className="py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                      LOADING…
                    </li>
                  )}
                  {recent.map((repo) => (
                    <li
                      key={repo.name}
                      className="flex items-baseline justify-between gap-4 border-b border-line-soft py-2.5"
                    >
                      <span className="truncate font-mono text-[10.5px] uppercase tracking-[0.08em] text-fg">
                        {repo.name}
                      </span>
                      <span className="num shrink-0 text-[10px] text-muted">
                        {repo.pushedAt?.slice(0, 10).replace(/-/g, ".")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
