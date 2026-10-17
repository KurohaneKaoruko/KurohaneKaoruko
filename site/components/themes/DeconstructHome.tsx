"use client";

import { useMemo } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { useRepos } from "@/components/ReposProvider";
import { langColor } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * 解构主题首页。
 *
 * 信息架构：「被拆开又叠回去的海报」—— 页面没有一条贯穿的轴。大标题被
 * 切成两段错位叠放，说明文字压在一块倾斜的碎片上，项目是六张各自歪着
 * 摆的纸片。阅读路径不是自上而下的扫描，而是被斜线牵引着沿对角线坠落。
 *
 * 与粗野的区别：粗野是**对齐**的强硬（粗黑框、偏移阴影、严格栏宽）；
 * 这里是**错位**的强硬 —— 框被切开、第二印偏出去、留白被挪走。
 * 悬停时碎片被"按回原位"（旋转归零、抬起），是这套版面唯一的秩序瞬间。
 */

/** 纸片的倾斜角：三档轮换，错位要有节奏，不能是乱码 */
const TILTS = ["rotate-[-1.4deg]", "rotate-[1.1deg]", "rotate-[-0.6deg]"];

export default function DeconstructHome() {
  const { repos } = useRepos();

  const { featured, totalStars, langCount } = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    const stars = repos.reduce((sum, p) => sum + p.stars, 0);
    const langs = new Set(repos.map((p) => p.lang).filter(Boolean));
    return { featured: sorted.slice(0, 6), totalStars: stars, langCount: langs.size };
  }, [repos]);

  return (
    <div className="min-h-screen">
      {/* ================= 断裂的报头 ================= */}
      <section className="relative overflow-hidden border-b border-border">
        {/* 两块实色斜片：像从别处裁下来贴上去的。只在宽屏出现 ——
            窄屏版心本来就窄，碎片会直接压在标题和按钮上 */}
        <div
          aria-hidden="true"
          className="dc-shard pointer-events-none absolute -right-16 top-28 hidden h-52 w-72 rotate-[8deg] bg-primary/80 lg:block"
        />
        <div
          aria-hidden="true"
          className="dc-shard pointer-events-none absolute -right-10 bottom-0 hidden h-24 w-56 rotate-[14deg] bg-foreground/85 lg:block"
        />

        <div className="container relative mx-auto px-6 pb-16 pt-12">
          {/* 顶部错版信息条 */}
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
            <span className="font-bold text-foreground">{SITE.short}</span>
            <span className="hidden sm:inline">Portfolio — 2026</span>
            <span>github.com/{SITE.handle}</span>
          </div>
          <div className="dc-rule mt-3" />

          <div className="relative mt-10 grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            {/* 主标题：被切成两段，下半段向右挪开 */}
            <div className="lg:col-span-8">
              <h1 className="display-title text-[clamp(3.2rem,11.5vw,9.5rem)] leading-[0.8] text-foreground">
                <span className="dc-misprint block">DECON</span>
                <span className="block translate-x-[8%] text-primary">STRUCT</span>
              </h1>

              <p className="mt-7 max-w-md border-l-2 border-primary pl-4 text-lg leading-relaxed text-text-muted">
                开源工具与 AI 智能体。
              </p>
            </div>

            {/* 副栏：倾斜的碎片便签 */}
            <div className="lg:col-span-4 lg:pt-4">
              <div className="dc-ghost relative rotate-[1.4deg] border border-foreground bg-card-bg p-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-primary">
                  Now
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  最近在写 ExMachina —— 一个事件驱动的多智能体框架。剩下的时间给了小说编辑器和
                  Screeps 的工具。
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
                  Kurohane Kaoruko
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/projects/"
              className="dc-frag group inline-flex items-center gap-3 bg-foreground px-8 py-4 font-mono text-xs uppercase tracking-[0.28em] text-background transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              项目库
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            {/* 描边按钮不切角：1px 边框被切掉一段会像渲染坏了，
                切角只留给实心面（卡片、实心按钮） */}
            <Link
              href="/about/"
              className="inline-block border border-foreground px-8 py-4 font-mono text-xs uppercase tracking-[0.28em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              关于我
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 01 碎片索引 ================= */}
      <section id="projects" className="border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
                  01 / 项目
                </p>
                <h2 className="display-title mt-3 text-3xl text-foreground sm:text-4xl">
                  精选项目
                </h2>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
                {featured.length} of {repos.length} — by stars
              </p>
            </div>
            <div className="dc-rule mt-4" />
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              /* 中列整体下沉，网格基线被推开一档 —— 六张纸片不在同一条水平线上 */
              <Reveal key={p.name} delay={0.04 + i * 0.03} className={i % 3 === 1 ? "lg:mt-6" : ""}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    "group relative flex h-full min-h-[210px] flex-col border border-border bg-card-bg p-6 " +
                    "transition-all duration-300 hover:-translate-y-1 hover:rotate-0 hover:border-foreground hover:bg-foreground hover:text-background " +
                    (i % 2 ? "dc-frag " : "dc-frag-alt ") +
                    TILTS[i % TILTS.length]
                  }
                >
                  <span className="flex items-baseline justify-between">
                    <span className="font-mono text-2xl font-bold leading-none text-text-dim transition-colors group-hover:text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim transition-colors group-hover:text-background/70">
                      ↗
                    </span>
                  </span>

                  <span className="mt-auto block pt-8">
                    <span className="block text-lg font-bold tracking-tight">{p.name}</span>
                    <span className="mt-1.5 line-clamp-2 block text-sm leading-relaxed text-text-muted transition-colors group-hover:text-background/75">
                      {p.desc}
                    </span>
                    <span className="mt-4 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim transition-colors group-hover:text-background/70">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: langColor[p.lang] ?? "#8a8175" }}
                      />
                      {p.lang || "—"}
                      <span className="ml-auto font-bold">★ {p.stars}</span>
                    </span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.08}>
            <Link
              href="/projects/"
              className="mt-8 inline-block font-mono text-xs uppercase tracking-[0.28em] text-foreground underline decoration-primary decoration-2 underline-offset-8 transition-colors hover:text-primary"
            >
              全部 {repos.length} 个仓库 →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================= 数据：错位的一行 ================= */}
      <section className="border-b border-border">
        <div className="container mx-auto grid gap-y-8 px-6 py-14 sm:grid-cols-3 sm:gap-x-8">
          {[
            [repos.length, "Repositories"],
            [totalStars, "Stars"],
            [langCount, "Languages"],
          ].map(([num, label], i) => (
            <div
              key={label}
              className={i === 1 ? "sm:translate-y-7" : i === 2 ? "sm:translate-y-3" : ""}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-text-dim">
                {label}
              </p>
              <p className="display-title mt-2 text-5xl text-foreground sm:text-6xl">{num}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 02 联系 ================= */}
      <section className="container mx-auto px-6 py-16 sm:py-20">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary">
                02 / 联系
              </p>
              <a
                href={"mailto:" + SITE.email}
                className="display-title mt-4 block text-[clamp(1.5rem,3.4vw,2.5rem)] [overflow-wrap:anywhere] text-foreground transition-colors hover:text-primary"
              >
                {SITE.email}
              </a>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-text-muted">
                有事发邮件，或者来 GitHub 找我。
              </p>
            </div>

            <div className="lg:col-span-5 lg:border-l lg:border-border lg:pl-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-text-dim">
                Elsewhere
              </p>
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block font-mono text-xs uppercase tracking-[0.22em] text-foreground underline decoration-primary decoration-2 underline-offset-8 transition-colors hover:text-primary"
              >
                github.com/{SITE.handle} ↗
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
