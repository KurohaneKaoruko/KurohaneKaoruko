"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCollectionStats, useRepos } from "@/components/ReposProvider";
import { BaseTime } from "@/components/layout/Clock";
import { Counter } from "@/components/ui/Counter";
import { FAMILIES } from "@/lib/data";
import { SITE } from "@/lib/site";

export function Hero() {
  const { repos } = useRepos();
  const stats = useCollectionStats();
  const groups = useMemo(() => {
    const counts = new Map<string, number>();
    for (const repo of repos)
      counts.set(repo.family, (counts.get(repo.family) ?? 0) + 1);
    return FAMILIES.map((family) => ({
      code: family.code,
      count: counts.get(family.id) ?? 0,
    })).filter((group) => group.count > 0);
  }, [repos]);
  const facts = [
    { label: "Works / 项目", value: stats.total, pad: 2 },
    { label: "Stars / 星标", value: stats.stars, pad: 0 },
    { label: "Languages / 语言", value: stats.langs, pad: 2 },
    { label: "Series / 分类", value: stats.families, pad: 2 },
  ];

  return (
    <section id="hero" className="border-b border-line">
      <div className="shell">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line py-3">
          <span className="label text-fg">{SITE.name}</span>
          <span className="label flex items-center gap-2">
            China · UTC+8 · <BaseTime />
          </span>
        </div>
        <div className="grid gap-12 pb-12 pt-10 lg:grid-cols-12 lg:gap-0 lg:pb-16 lg:pt-14">
          <div className="lg:col-span-8 lg:pr-12">
            <p className="eyebrow hero-rise">
              Independent developer / AI engineer
            </p>
            <h1
              className="hero-title hero-rise"
              style={{ "--d": "60ms" } as React.CSSProperties}
            >
              <span>Software</span>
              <span>
                Archive<span className="hero-title-dot">.</span>
              </span>
            </h1>
            <div className="mt-9 flex flex-col items-start gap-7 sm:flex-row sm:items-end sm:justify-between">
              <p className="hero-lede">Agents, instruments, and small games.</p>
              <Link href="/projects/" className="btn btn-primary shrink-0">
                Browse projects
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
          <aside className="lg:col-span-4 lg:border-l lg:border-line lg:pl-10">
            <div className="hero-index">
              <div className="flex items-baseline justify-between border-b border-line-strong pb-2">
                <span className="label text-fg">Index / 分类</span>
                <span className="label">
                  <Counter value={stats.total} pad={2} /> works
                </span>
              </div>
              <ul>
                {groups.map((group, index) => (
                  <li key={group.code} className="hero-family">
                    <span className="hero-family-code">{group.code}</span>
                    <span className="hero-squares" aria-hidden="true">
                      {Array.from({ length: group.count }, (_, cell) => (
                        <span
                          key={cell}
                          className={`hero-square${index === 0 ? " is-hot" : ""}`}
                        />
                      ))}
                    </span>
                    <span className="hero-family-count">
                      {String(group.count).padStart(2, "0")}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <span className="label">★ {stats.stars}</span>
                <span className="label">
                  {String(stats.langs).padStart(2, "0")} stacks
                </span>
              </div>
            </div>
          </aside>
        </div>
        <dl className="hero-facts">
          {facts.map((fact) => (
            <div key={fact.label} className="hero-fact">
              <dt className="label">{fact.label}</dt>
              <dd className="hero-fact-value">
                <Counter value={fact.value} pad={fact.pad} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
