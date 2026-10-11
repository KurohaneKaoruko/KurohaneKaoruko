"use client";

import { useMemo } from "react";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import { useRepos } from "@/components/ReposProvider";
import { langColor, marqueeTech } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * 极繁主题首页。
 *
 * 信息架构：拼贴马赛克 —— 没有中轴、没有侧栏，页面由「色块 slab、纹样条、
 * 徽章贴纸、双层描边框」这些密度极高的碎片拼成。项目区是 3 列卡片墙，
 * 每张卡片带彩色眉条与序号贴纸；阅读路径是跳跃式的扫读，
 * 与终端的顺序流、粗野的编号索引、极境的主从面板、故障的满幅频段都不同。
 *
 * 装饰原则：色块要整块的（不是细条纹），纹样要看得见的（不是 5% 透明度），
 * 阴影要厚的（8px 级），能叠第二层装饰的地方绝不只放一层。
 */

/** 卡片眉条的三色轮换：朱红 / 芥末黄 / 靛蓝 */
const HEADS = ["bg-primary", "bg-[var(--max-sun)]", "bg-secondary"];
/** 序号贴纸描边三色轮换 */
const RINGS = ["border-primary", "border-[var(--max-sun)]", "border-secondary"];

export default function MaximalHome() {
  const { repos } = useRepos();

  const { featured, totalStars, langCount } = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    const stars = repos.reduce((sum, p) => sum + p.stars, 0);
    const langs = new Set(repos.map((p) => p.lang).filter(Boolean));
    return { featured: sorted.slice(0, 6), totalStars: stars, langCount: langs.size };
  }, [repos]);

  return (
    <div className="min-h-screen">
      {/* 顶部纹样带：斜纹 + 棋盘双条 */}
      <div>
        <div className="pattern-diag h-3 w-full border-b-2 border-foreground text-primary" />
        <div className="pattern-checker h-2 w-full border-b-2 border-foreground text-accent/50" />
      </div>

      {/* ================= HERO：朱红满幅色块 ================= */}
      <section className="relative overflow-hidden border-b-2 border-foreground bg-primary text-primary-foreground">
        <div className="pattern-diag pointer-events-none absolute inset-0 text-primary-foreground/15" />
        <div className="pattern-dots pointer-events-none absolute inset-0 text-primary-foreground/20" />
        <div className="container relative mx-auto grid gap-10 px-6 py-14 lg:grid-cols-12 lg:py-20">
          {/* 左：贴纸簇 + 荧光笔标题 */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="-rotate-2 border-2 border-foreground bg-[var(--max-sun)] px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground shadow-[3px_3px_0_var(--foreground)]">
                Open Source
              </span>
              <span className="rotate-1 border-2 border-foreground bg-secondary px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
                AI · Tools · Games
              </span>
              <span className="rotate-3 border-2 border-foreground bg-accent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
                ★ Live Data
              </span>
              <span className="hidden -rotate-1 border-2 border-foreground bg-card-bg px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground shadow-[3px_3px_0_var(--foreground)] sm:inline-block">
                {SITE.name}
              </span>
            </div>

            <h1 className="mt-10 font-black uppercase leading-[0.95] tracking-[-0.05em]">
              <span className="block text-[clamp(3rem,9vw,7rem)] text-primary-foreground">
                用<span className="marker-hl text-foreground">技术</span>
              </span>
              <span className="mt-3 flex flex-wrap items-center gap-5">
                <span className="bg-foreground px-4 text-[clamp(1.8rem,5vw,3.8rem)] text-background">
                  解决问题
                </span>
                <span className="pattern-diag hidden h-9 w-28 text-primary-foreground/60 sm:block" />
              </span>
            </h1>

            <p className="mt-8 max-w-lg border-l-4 border-[var(--max-sun)] pl-5 leading-relaxed text-primary-foreground/85">
              开源工具、AI 智能体与游戏 —— 全部来自真实的 GitHub 仓库，数据实时拉取。
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <Link
                href="/projects/"
                className="border-2 border-foreground bg-foreground px-7 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-background shadow-[6px_6px_0_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-1"
              >
                进入项目库 →
              </Link>
              <Link
                href="/about/"
                className="border-2 border-foreground bg-card-bg px-7 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-foreground shadow-[6px_6px_0_var(--foreground)] transition-transform hover:-translate-y-1"
              >
                关于我
              </Link>
            </div>
          </div>

          {/* 右：头像拼贴 + 三色数据 slab */}
          <div className="lg:col-span-5">
            <div className="frame-double relative mx-auto max-w-xs border-[3px] border-foreground bg-card-bg p-3 shadow-[8px_8px_0_var(--foreground)]">
              <div className="pattern-checker absolute inset-0 text-primary/25" />
              <img
                src="/logo.jpg"
                alt={SITE.name}
                className="relative w-full border-2 border-foreground object-cover"
              />
              <span className="absolute -right-3 -top-4 rotate-6 border-2 border-foreground bg-[var(--max-sun)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground shadow-[3px_3px_0_var(--foreground)]">
                ★ Maker
              </span>
              <span className="absolute -left-3 bottom-8 -rotate-6 border-2 border-foreground bg-secondary px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
                100% Real
              </span>
            </div>

            <div className="mx-auto mt-10 grid max-w-xs grid-cols-3 border-[3px] border-foreground text-center shadow-[6px_6px_0_var(--foreground)]">
              {[
                [repos.length, "仓库", "bg-primary text-primary-foreground"],
                [totalStars, "星标", "bg-[var(--max-sun)] text-foreground"],
                [langCount, "语言", "bg-secondary text-primary-foreground"],
              ].map(([num, label, tone]) => (
                <div key={label as string} className={"border-r-2 border-foreground px-2 py-4 last:border-r-0 " + tone}>
                  <p className="text-2xl font-black">{num}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] opacity-80">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 装饰分隔：双线 + 符号行 + 棋盘条 */}
      <div className="container mx-auto px-6">
        <div className="border-t-[3px] border-foreground" />
        <div className="flex items-center justify-between border-b border-foreground py-2 font-mono text-xs tracking-[0.5em] text-text-dim">
          <span>❖</span><span>◆</span><span>●</span><span>◆</span><span>❖</span>
          <span>◆</span><span>●</span><span>◆</span><span>❖</span>
        </div>
        <div className="pattern-checker h-2 w-full border-b-2 border-foreground text-primary/40" />
      </div>

      {/* ================= 01 项目卡片墙 ================= */}
      <section id="projects" className="container mx-auto px-6 py-14">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-black uppercase leading-none tracking-[-0.04em]">
              <span className="flex items-baseline gap-3 font-mono text-[11px] font-normal tracking-[0.35em] text-secondary">
                <span className="num-outline text-4xl">01</span> Showcase
              </span>
              <span className="mt-2 block text-4xl text-foreground sm:text-5xl">
                项目<span className="marker-hl">陈列室</span>
              </span>
            </h2>
            <span className="border-2 border-foreground bg-[var(--max-sun)] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground shadow-[4px_4px_0_var(--foreground)]">
              {featured.length} / {repos.length} Repos
            </span>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.name} delay={0.04 * (i % 3)}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col border-[3px] border-foreground bg-card-bg shadow-[8px_8px_0_var(--foreground)] transition-transform hover:-translate-y-1.5"
              >
                {/* 彩色眉条 slab：编号文件签 */}
                <div
                  className={
                    "flex items-center justify-between border-b-[3px] border-foreground px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] " +
                    HEADS[i % 3] +
                    (i % 3 === 1 ? " text-foreground" : " text-primary-foreground")
                  }
                >
                  <span>File №{String(i + 1).padStart(2, "0")}</span>
                  <span className="pattern-diag h-2 w-10 opacity-70" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        "-rotate-3 border-2 bg-card-bg px-2 py-0.5 font-mono text-[11px] font-bold shadow-[2px_2px_0_var(--foreground)] " +
                        RINGS[i % 3] +
                        " text-foreground"
                      }
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-primary">★ {p.stars}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {p.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-muted">{p.desc}</p>
                  <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-foreground/30 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full border-2 border-foreground/40"
                        style={{ backgroundColor: langColor[p.lang] ?? "#97897c" }}
                      />
                      {p.lang || "—"}
                    </span>
                    <span className="transition-transform group-hover:translate-x-1">↗</span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <Link
            href="/projects/"
            className="mt-10 inline-block border-[3px] border-foreground bg-foreground px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.25em] text-background shadow-[5px_5px_0_var(--primary)] transition-transform hover:-translate-y-1"
          >
            全部 {repos.length} 个仓库 →
          </Link>
        </Reveal>
      </section>

      <div className="border-y-[3px] border-foreground bg-card-bg">
        <Marquee items={marqueeTech} />
      </div>

      {/* ================= 数据横幅：反色满幅 + 纹样 ================= */}
      <section className="relative overflow-hidden border-b-[3px] border-foreground bg-foreground text-background">
        <div className="pattern-dots pointer-events-none absolute inset-0 text-background/15" />
        <div className="container relative mx-auto grid grid-cols-2 gap-y-8 px-6 py-14 sm:grid-cols-4">
          {[
            [repos.length, "开源仓库", "text-[var(--max-sun)]"],
            [totalStars, "累计星标", "text-primary"],
            [langCount, "编程语言", "text-secondary"],
            ["100%", "实时数据", "text-accent"],
          ].map(([num, label, tone]) => (
            <div key={label as string} className="text-center">
              <p className={"text-4xl font-black tracking-tight sm:text-6xl " + tone}>{num}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 联系：叠框 + 贴纸 ================= */}
      <section className="container mx-auto px-6 py-14">
        <Reveal>
          <div className="frame-double relative border-[3px] border-foreground bg-card-bg p-10 text-center shadow-[8px_8px_0_var(--foreground)] sm:p-14">
            <div className="pattern-checker absolute inset-0 text-primary/15" />
            <span className="absolute -left-3 -top-4 -rotate-6 border-2 border-foreground bg-accent px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
              ❖ Say Hi
            </span>
            <p className="relative font-mono text-[11px] uppercase tracking-[0.4em] text-text-dim">
              Contact
            </p>
            <h2 className="relative mt-4 text-3xl font-black uppercase tracking-[-0.03em] text-foreground sm:text-5xl">
              <span className="marker-hl">{SITE.tagline}</span>
            </h2>
            <div className="relative mt-10 flex flex-wrap items-center justify-center gap-5">
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="border-[3px] border-foreground bg-primary px-7 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-[6px_6px_0_var(--foreground)] transition-transform hover:-translate-y-1"
              >
                GitHub ↗
              </a>
              <a
                href={"mailto:" + SITE.email}
                className="border-[3px] border-foreground bg-card-bg px-7 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-foreground shadow-[6px_6px_0_var(--accent)] transition-transform hover:-translate-y-1"
              >
                {SITE.email}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 底部纹样带 */}
      <div>
        <div className="pattern-checker h-2 w-full border-t-2 border-foreground text-secondary/50" />
        <div className="pattern-diag h-3 w-full border-t-2 border-foreground text-secondary" />
      </div>
    </div>
  );
}
