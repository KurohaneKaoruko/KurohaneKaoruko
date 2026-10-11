"use client";

import { useMemo } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { useRepos } from "@/components/ReposProvider";
import { langColor } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * 瑞士风格（国际主义排版）主题首页。
 *
 * 信息架构：「模数网格海报」—— 网格本身是设计语言：页面被发丝线切成
 * 严格的单元格，项目是等宽网格里的格子，阅读路径是逐行光栅扫描。
 * 竖排文字贴左边缘，红/黑/白三色，其余装饰全部不存在。
 *
 * 与极简的区别：极简是无线单列直线阅读；这里是有线多列网格扫描，
 * 结构线外露、对齐处即分界。悬停时整个单元格反色为瑞士红。
 */
export default function SwissHome() {
  const { repos } = useRepos();

  const { featured, totalStars, langCount } = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    const stars = repos.reduce((sum, p) => sum + p.stars, 0);
    const langs = new Set(repos.map((p) => p.lang).filter(Boolean));
    return { featured: sorted.slice(0, 6), totalStars: stars, langCount: langs.size };
  }, [repos]);

  return (
    <div className="min-h-screen">
      {/* ================= 海报头 ================= */}
      <section className="relative border-b border-border">
        {/* 竖排贴边 */}
        <p className="writing-vertical-rl absolute left-4 top-8 hidden font-mono text-[10px] uppercase tracking-[0.35em] text-text-dim lg:block">
          {SITE.name} — Portfolio {new Date().getFullYear()}
        </p>

        <div className="container mx-auto px-6 pb-16 pl-6 pt-10 lg:pl-16">
          {/* 海报头信息行 */}
          <div className="grid grid-cols-2 gap-4 border-b-2 border-foreground pb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted sm:grid-cols-4">
            <span className="font-bold text-foreground">{SITE.short}</span>
            <span>AI · Tools · Games</span>
            <span className="hidden sm:block">github.com/{SITE.handle}</span>
            <span className="text-right">
              <span className="mr-2 inline-block h-2.5 w-2.5 bg-primary align-middle" />
              Live Data
            </span>
          </div>

          <h1 className="display-title mt-12 text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] tracking-[-0.04em] text-foreground">
            COMPILE
            <br />
            THIS <span className="text-primary">WORLD</span>
          </h1>

          <div className="mt-10 flex items-start gap-6">
            <span className="mt-1 hidden h-24 w-16 bg-primary sm:block" />
            <p className="max-w-xl text-lg leading-relaxed text-text-muted">
              开源工具、AI 智能体与游戏 —— 全部来自真实的 GitHub 仓库，按语言筛选与排序。
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/projects/"
              className="bg-primary px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-foreground"
            >
              进入项目库
            </Link>
            <Link
              href="/about/"
              className="border-2 border-foreground px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.25em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              关于我
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 模数网格：项目 ================= */}
      <section id="projects" className="container mx-auto px-6 py-16">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-foreground pb-3">
            <h2 className="flex items-baseline gap-4">
              <span className="font-mono text-sm font-bold text-primary">01</span>
              <span className="display-title text-2xl text-foreground sm:text-3xl">项目</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                Modular Grid
              </span>
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
              {featured.length} / {repos.length} — Featured
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          {/* gap-px + 深色底 = 外露的发丝网格 */}
          <div className="mt-8 grid gap-px border border-foreground/25 bg-foreground/25 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-[220px] flex-col bg-background p-6 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <span className="text-5xl font-bold leading-none tracking-tight text-foreground transition-colors group-hover:text-primary-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-auto pt-8">
                  <span className="block text-lg font-bold tracking-tight">{p.name}</span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-text-muted transition-colors group-hover:text-primary-foreground/85">
                    {p.desc}
                  </span>
                  <span className="mt-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim transition-colors group-hover:text-primary-foreground/75">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: langColor[p.lang] ?? "#8f8f8f" }}
                    />
                    {p.lang || "—"}
                    <span className="ml-auto font-bold">★ {p.stars}</span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <Link
            href="/projects/"
            className="mt-6 inline-block font-mono text-xs font-bold uppercase tracking-[0.25em] text-foreground underline decoration-2 underline-offset-8 transition-colors hover:text-primary"
          >
            全部 {repos.length} 个仓库 →
          </Link>
        </Reveal>
      </section>

      {/* ================= 数据：大数字行 ================= */}
      <section className="border-t-4 border-foreground">
        <div className="container mx-auto grid grid-cols-3 gap-px bg-foreground/25">
          {[
            [repos.length, "Repositories"],
            [totalStars, "Stars"],
            [langCount, "Languages"],
          ].map(([num, label]) => (
            <div key={label} className="bg-background px-6 py-12 text-center">
              <p className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">{num}</p>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 联系：海报落版 ================= */}
      <section className="container mx-auto px-6 py-16 sm:py-20">
        <Reveal>
          <div className="flex items-start gap-6">
            <span className="mt-2 hidden h-16 w-16 shrink-0 bg-primary sm:block" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                Contact
              </p>
              <a
                href={"mailto:" + SITE.email}
                className="display-title mt-3 block text-2xl [overflow-wrap:anywhere] text-foreground transition-colors hover:text-primary sm:text-4xl"
              >
                {SITE.email}
              </a>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.2em]">
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground underline decoration-2 underline-offset-8 transition-colors hover:text-primary"
                >
                  github.com/{SITE.handle} ↗
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
