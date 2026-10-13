"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import { useRepos } from "@/components/ReposProvider";
import { marqueeTech } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * 极境主题首页。
 *
 * 信息架构：主从式「仓库浏览器」—— 左侧是指引列表，右侧是一块固定的
 * 展示面板，选中哪一条，面板就切到哪一条。阅读路径是"先扫索引，再看详情"，
 * 与终端主题的双轴长页、粗野主题的编号索引都不同：
 * 同一屏内完成浏览与详读，不需要上下滚动找条目。
 *
 * 视觉：冷白底、发丝级细线、切角面板与冰蓝点缀，装饰全部让位于对齐与留白。
 */
export default function GlacialHome() {
  const { repos } = useRepos();

  const { featured, totalStars, langCount } = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    const stars = repos.reduce((sum, p) => sum + p.stars, 0);
    const langs = new Set(repos.map((p) => p.lang).filter(Boolean));
    return { featured: sorted.slice(0, 6), totalStars: stars, langCount: langs.size };
  }, [repos]);

  const [selected, setSelected] = useState(0);
  const current = featured[Math.min(selected, featured.length - 1)];

  return (
    <div className="min-h-screen">
      {/* ================= HERO ================= */}
      <section className="container mx-auto px-6">
        {/* 顶部发丝状态行 */}
        <div className="flex items-center justify-between border-b border-border pb-3 pt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          <span>Personal Archive // Index</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-primary" />
            GitHub Live Feed
          </span>
        </div>

        <div className="grid gap-x-12 gap-y-10 py-14 lg:grid-cols-12 lg:py-20">
          {/* 主栏：细字重超大标题 */}
          <div className="lg:col-span-8">
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-text-muted">
              <span className="h-2 w-2 bg-primary" />
              Portfolio — {SITE.name}
            </p>
            <h1 className="display-title mt-8 text-[clamp(2.8rem,8vw,6.5rem)] text-foreground">
              COMPILE
              <br />
              THIS WORLD<span className="text-primary">.</span>
            </h1>
            <p className="mt-6 max-w-md leading-relaxed text-text-muted">
              用技术解决问题 —— 开源工具、AI 智能体与游戏，全部来自真实的 GitHub 仓库。
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/projects/"
                className="chamfer-sm bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                进入项目库
              </Link>
              <Link
                href="/about/"
                className="chamfer-sm border border-border-strong px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                关于我
              </Link>
            </div>
          </div>

          {/* 副栏：状态面板 */}
          <div className="lg:col-span-4">
            <div className="chamfer corner-ticks border border-border bg-card-bg p-6">
              <p className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                Status
                <span className="text-primary">●</span>
              </p>
              <dl className="mt-4">
                {[
                  ["REPOS", String(repos.length)],
                  ["STARS", String(totalStars)],
                  ["LANGUAGES", String(langCount)],
                  ["STACK", "TS · Rust · Py"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between border-b border-border py-2.5 last:border-b-0"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
                      {k}
                    </dt>
                    <dd className="font-mono text-sm text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 border-t border-border pt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
                Data // api.github.com
              </p>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={marqueeTech} />

      {/* ================= 01 仓库浏览器（主从结构） ================= */}
      <section id="projects" className="container mx-auto px-6 py-[var(--pad-section)]">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
            <h2 className="flex items-baseline gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
                01
              </span>
              <span className="display-title text-2xl text-foreground sm:text-3xl">项目展示</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                Repository Viewer
              </span>
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
              Featured {String(featured.length).padStart(2, "0")} / {repos.length}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            {/* 索引列表 */}
            <ol className="lg:col-span-5">
              {featured.map((p, i) => {
                const active = i === selected;
                return (
                  <li key={p.name}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelected(i)}
                      onMouseEnter={() => setSelected(i)}
                      className="relative flex w-full items-baseline gap-4 border-b border-border px-3 py-4 text-left transition-colors hover:bg-primary/5"
                    >
                      {active && (
                        <span className="absolute bottom-0 left-0 top-0 w-[2px] bg-primary" />
                      )}
                      <span className="font-mono text-[10px] tracking-[0.2em] text-text-dim">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={
                          "flex-1 truncate font-medium tracking-tight transition-colors " +
                          (active ? "text-primary" : "text-foreground")
                        }
                      >
                        {p.name}
                      </span>
                      <span className="font-mono text-[10px] text-text-dim">★ {p.stars}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* 展示面板 */}
            {current && (
              <div className="lg:col-span-7">
                <div className="chamfer corner-ticks flex min-h-[340px] flex-col border border-border bg-card-bg p-8">
                  <div className="flex items-start justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                      Unit Data
                    </p>
                    <span className="num-outline font-mono text-6xl leading-none">
                      {String(selected + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-4 text-3xl font-medium tracking-tight text-foreground">
                    {current.name}
                  </h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-text-muted">{current.desc}</p>

                  <div className="mt-auto grid grid-cols-3 divide-x divide-border border-t border-border pt-5">
                    <div className="pr-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-dim">
                        Language
                      </p>
                      <p className="mt-1.5 text-sm text-foreground">{current.lang || "—"}</p>
                    </div>
                    <div className="px-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-dim">
                        Stars
                      </p>
                      <p className="mt-1.5 text-sm text-foreground">★ {current.stars}</p>
                    </div>
                    <div className="pl-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-dim">
                        Topics
                      </p>
                      <p className="mt-1.5 truncate text-sm text-foreground">
                        {current.topics.slice(0, 2).join(" · ") || "—"}
                      </p>
                    </div>
                  </div>

                  <a
                    href={current.url}
                    target="_blank"
                    rel="noreferrer"
                    className="chamfer-sm mt-6 self-start border border-border-strong px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Open Repository ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <Link
            href="/projects/"
            className="mt-8 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-primary underline-offset-8 hover:underline"
          >
            查看全部 {repos.length} 个仓库 →
          </Link>
        </Reveal>
      </section>

      {/* ================= 数据条 ================= */}
      <section className="border-y border-border">
        <div className="container mx-auto grid grid-cols-3 divide-x divide-border px-6">
          {[
            [repos.length, "Repositories"],
            [totalStars, "Total Stars"],
            [langCount, "Languages"],
          ].map(([num, label]) => (
            <div key={label} className="py-10 text-center">
              <p className="text-4xl font-extralight tracking-tight text-foreground sm:text-5xl">
                {num}
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 联系 ================= */}
      <section className="container mx-auto px-6 py-[var(--pad-section-tight)]">
        <Reveal>
          <div className="chamfer corner-ticks border border-border bg-card-bg p-10 text-center sm:p-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-text-dim">
              Comm Link
            </p>
            <h2 className="display-title mt-4 text-3xl text-foreground sm:text-4xl">
              {SITE.tagline}
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="chamfer-sm bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                GitHub ↗
              </a>
              <a
                href={"mailto:" + SITE.email}
                className="chamfer-sm border border-border-strong px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {SITE.email}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
