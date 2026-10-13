"use client";

import { useMemo } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { useRepos } from "@/components/ReposProvider";
import { THEMES } from "@/lib/themes";
import { SITE } from "@/lib/site";

/**
 * 极简主题首页。
 *
 * 信息架构：单列「编辑部」—— 窄栏纯排版，没有卡片、没有色块、没有纹样，
 * 层级由「字重、字号、发丝线、大号细体数字」表达。阅读路径是一条直线：
 * 从标题向下，依次经过数据行、项目目录、简介、联系方式。
 * 极简不等于没有设计：骨架靠发丝线网格与大号章节数字撑起来，
 * 装饰性的颜色与纹样则全部删去。
 */

/** 章节头：大号细体序号 + 标题 */
function SectionHead({ no, title }: { no: string; title: string }) {
  return (
    <div className="relative flex items-baseline gap-6">
      <span className="pointer-events-none absolute -top-10 right-0 select-none font-extralight leading-none text-foreground/[0.05] [font-size:9rem]">
        {no}
      </span>
      <span className="font-mono text-[11px] tracking-[0.3em] text-text-dim">{no}</span>
      <h2 className="display-title text-3xl text-foreground">{title}</h2>
    </div>
  );
}

export default function MinimalHome() {
  const { repos } = useRepos();

  const { featured, totalStars, langCount } = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    const stars = repos.reduce((sum, p) => sum + p.stars, 0);
    const langs = new Set(repos.map((p) => p.lang).filter(Boolean));
    return { featured: sorted.slice(0, 6), totalStars: stars, langCount: langs.size };
  }, [repos]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[46rem] px-6">
        {/* ================= 刊头信息栏 ================= */}
        <div className="flex items-baseline justify-between border-b border-border pb-4 pt-28 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim lg:pt-32">
          <span className="text-foreground">{SITE.short}</span>
          <span>Portfolio — {new Date().getFullYear()}</span>
        </div>

        {/* ================= 开篇 ================= */}
        <section className="pb-20 pt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-text-dim">
            {SITE.name} · AI Engineer &amp; Toolmaker
          </p>
          <h1 className="display-title mt-8 text-[clamp(2.6rem,6.5vw,4rem)] leading-[1.06] text-foreground">
            用技术解决问题。
          </h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-text-muted">
            开源工具、AI 智能体与游戏，全部来自真实的 GitHub 仓库。
          </p>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-2 text-sm">
            <Link
              href="/projects/"
              className="group flex items-baseline gap-2 text-foreground"
            >
              <span className="underline decoration-border underline-offset-8 transition-colors group-hover:decoration-foreground">
                进入项目库
              </span>
              <span className="text-text-dim transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link href="/about/" className="group flex items-baseline gap-2 text-foreground">
              <span className="underline decoration-border underline-offset-8 transition-colors group-hover:decoration-foreground">
                关于我
              </span>
              <span className="text-text-dim transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* ================= 数据行：三栏发丝线 ================= */}
        <div className="grid grid-cols-3 divide-x divide-border border-y border-border">
          {[
            [repos.length, "Repositories"],
            [totalStars, "Stars"],
            [langCount, "Languages"],
          ].map(([num, label]) => (
            <div key={label} className="px-4 py-8 text-center sm:px-6">
              <p className="text-4xl font-extralight tracking-tight text-foreground">{num}</p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ================= 项目目录 ================= */}
        <section id="projects" className="py-20">
          <Reveal>
            <SectionHead no="01" title="项目" />
          </Reveal>

          <ol className="mt-10">
            {featured.map((p, i) => (
              <Reveal key={p.name} delay={0.03 * (i % 3)}>
                <li className="border-b border-border">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-baseline gap-6 py-6"
                  >
                    <span className="w-8 shrink-0 font-mono text-[11px] text-text-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {p.name}
                      </span>
                      <span className="mt-1 block truncate text-sm text-text-muted">
                        {p.desc}
                      </span>
                    </span>
                    <span className="hidden shrink-0 font-mono text-[11px] text-text-dim sm:block">
                      {p.lang || "—"}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-text-dim">
                      ★ {p.stars}
                    </span>
                  </a>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.06}>
            <Link
              href="/projects/"
              className="group mt-6 inline-flex items-baseline gap-2 text-sm text-foreground"
            >
              <span className="underline decoration-border underline-offset-8 transition-colors group-hover:decoration-foreground">
                全部 {repos.length} 个仓库
              </span>
              <span className="text-text-dim transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        </section>

        {/* ================= 简介 ================= */}
        <section className="pb-20">
          <Reveal>
            <SectionHead no="02" title="关于" />
            <p className="mt-8 max-w-xl leading-loose text-text-muted">
              关注 LLM Agents、Swarm Intelligence 与开发工具；这个站点本身也是一次实践
              —— 静态导出，零后端，{THEMES.length} 套可切换主题。
            </p>
            <Link
              href="/about/"
              className="group mt-6 inline-flex items-baseline gap-2 text-sm text-foreground"
            >
              <span className="underline decoration-border underline-offset-8 transition-colors group-hover:decoration-foreground">
                继续阅读
              </span>
              <span className="text-text-dim transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        </section>

        {/* ================= 联系 ================= */}
        <section className="pb-28">
          <Reveal>
            <SectionHead no="03" title="联系" />
            <div className="mt-8 space-y-4">
              <a
                href={"mailto:" + SITE.email}
                className="block text-2xl font-light tracking-tight text-foreground underline decoration-border underline-offset-[10px] transition-colors hover:decoration-foreground"
              >
                {SITE.email}
              </a>
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-baseline gap-2 font-mono text-xs tracking-[0.15em] text-text-muted transition-colors hover:text-foreground"
              >
                github.com/{SITE.handle}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
