"use client";

import { useMemo } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { useRepos } from "@/components/ReposProvider";
import { marqueeTech } from "@/lib/data";
import { SITE } from "@/lib/site";
import Marquee from "@/components/Marquee";

/**
 * 故障主题首页。
 *
 * 信息架构：满幅「截获频段」流 —— 页面是一条被恢复的传输记录：
 * 每个仓库是一段撕裂的信号频段，奇偶交错地占满幅宽（锯齿式阅读路径），
 * 频段之间夹损坏数据条。与终端的侧轴面板、极境的主从面板、
 * 极繁的卡片墙、极简的单列都不同：这里是满幅的、左右交错的、残缺的。
 *
 * 视觉：纯黑底、红蓝色差（RGB split）、扫描线与撕裂边缘。
 * 红蓝双色是主词汇，绿色不出现，彩色只用于信号语义。
 */
export default function GlitchHome() {
  const { repos } = useRepos();

  const { featured, totalStars, langCount } = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    const stars = repos.reduce((sum, p) => sum + p.stars, 0);
    const langs = new Set(repos.map((p) => p.lang).filter(Boolean));
    return { featured: sorted.slice(0, 6), totalStars: stars, langCount: langs.size };
  }, [repos]);

  return (
    <div className="min-h-screen">
      {/* ================= 信号头：撕裂黑幕 ================= */}
      <section className="tear-bottom relative overflow-hidden bg-card-bg">
        <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />
        <div className="container relative mx-auto px-6 pb-16 pt-10 lg:pb-20">
          {/* 状态行：红蓝双信号 */}
          <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse bg-primary" />
              Signal Intercepted
            </span>
            <span className="rgb-split text-primary">CH-044 // RECOVERED</span>
          </div>

          <h1 className="display-title mt-12 text-[clamp(2.8rem,8vw,6.5rem)] text-foreground">
            COMPILE
            <br />
            THIS <span className="rgb-split flicker text-primary">WORLD</span>
            <span className="text-secondary">_</span>
          </h1>

          {/* 解码日志式导语 */}
          <div className="mt-8 max-w-xl space-y-1 font-mono text-sm leading-relaxed text-text-muted">
            <p>
              <span className="text-secondary">&gt;</span> 用技术解决问题 —— 开源工具、AI
              智能体与游戏。
            </p>
            <p>
              <span className="text-secondary">&gt;</span> 全部来自真实的 GitHub 仓库，
              <span className="text-primary">数据实时拉取</span>。
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-5">
            <Link
              href="/projects/"
              className="border border-primary bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground shadow-[5px_5px_0_var(--g-blue)] transition-transform hover:-translate-y-1"
            >
              进入项目库
            </Link>
            <Link
              href="/about/"
              className="border border-border-strong px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              关于我
            </Link>
          </div>
        </div>
      </section>

      <div className="corrupt-bar h-2 w-full" />

      {/* ================= 频段流：交错满幅碎片 ================= */}
      <section id="projects" className="py-14">
        <Reveal>
          <div className="container mx-auto flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-6 pb-4">
            <h2 className="flex items-baseline gap-4">
              <span className="rgb-split font-mono text-sm font-bold text-primary">01</span>
              <span className="display-title text-2xl text-foreground sm:text-3xl">信号频段</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                Intercepted Fragments
              </span>
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
              {featured.length} / {repos.length} Recovered
            </span>
          </div>
        </Reveal>

        <div className="mt-8 space-y-5">
          {featured.map((p, i) => {
            const shift = i % 2 === 1;
            return (
              <Reveal key={p.name} delay={0.03 * (i % 3)}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    "group relative block border border-border bg-card-bg transition-colors hover:border-primary/60 hover:bg-primary/5 " +
                    (shift ? "lg:ml-auto lg:w-[94%]" : "lg:w-[94%]")
                  }
                >
                  <div className="scanlines pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-40" />
                  <div className="relative grid items-center gap-x-6 gap-y-3 px-6 py-6 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
                    <span className="rgb-split font-mono text-5xl font-black leading-none text-foreground/90 sm:text-6xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="glitch-text block text-2xl font-bold tracking-tight text-foreground">
                        {p.name}
                      </span>
                      <span className="mt-1.5 line-clamp-1 block text-sm text-text-muted">
                        {p.desc}
                      </span>
                      <span className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim sm:hidden">
                        <span className="text-secondary">{p.lang || "—"}</span>
                        <span>★ {p.stars}</span>
                      </span>
                    </span>
                    <span className="hidden shrink-0 flex-col items-end gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted sm:flex">
                      <span className="border border-border px-2 py-0.5 text-secondary">
                        {p.lang || "—"}
                      </span>
                      <span>★ {p.stars}</span>
                      <span className="text-primary transition-transform group-hover:translate-x-1">
                        ↗
                      </span>
                    </span>
                  </div>
                  <span className="absolute left-3 top-2 font-mono text-[8px] uppercase tracking-[0.3em] text-text-dim">
                    FRG-{String(i + 1).padStart(2, "0")} · RECOVERED
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.08}>
          <div className="container mx-auto px-6">
            <Link
              href="/projects/"
              className="mt-8 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-primary underline-offset-8 hover:underline"
            >
              <span className="text-secondary">&gt;</span> 恢复全部 {repos.length} 个频段 →
            </Link>
          </div>
        </Reveal>
      </section>

      <div className="corrupt-bar h-2 w-full" />
      <div className="border-y border-border bg-card-bg">
        <Marquee items={marqueeTech} />
      </div>
      <div className="corrupt-bar h-2 w-full" />

      {/* ================= 数据读数 ================= */}
      <section className="border-b border-border">
        <div className="container mx-auto grid grid-cols-3 divide-x divide-border px-6">
          {[
            [repos.length, "Fragments"],
            [totalStars, "Stars"],
            [langCount, "Codecs"],
          ].map(([num, label]) => (
            <div key={label} className="py-12 text-center">
              <p className="rgb-split text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                {num}
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 联系：撕裂收尾 ================= */}
      <section className="tear-top relative overflow-hidden bg-card-bg">
        <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />
        <div className="container relative mx-auto px-6 py-16 text-center sm:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-text-dim">
            <span className="text-primary">▮</span> Outbound Channel
          </p>
          <h2 className="display-title mt-4 text-3xl text-foreground sm:text-4xl">
            <span className="rgb-split">{SITE.tagline}</span>
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="border border-primary bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground shadow-[4px_4px_0_var(--g-blue)] transition-transform hover:-translate-y-1"
            >
              GitHub ↗
            </a>
            <a
              href={"mailto:" + SITE.email}
              className="border border-border-strong px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
