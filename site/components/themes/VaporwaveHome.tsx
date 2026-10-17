"use client";

import { useMemo } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { useRepos } from "@/components/ReposProvider";
import { langColor } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * 蒸汽波主题首页。
 *
 * 信息架构：中轴对称「展廊」—— 页面以一条垂直中轴组织：
 * 太阳与网格海面在上，展廊层是「左翼三件 + 中央立柱 + 右翼三件」的
 * 镜像结构，阅读路径是从中轴出发向两侧对称扫描。
 * 与故障的满幅交错、极简的直线单列都不同：这里是严格对称的。
 *
 * 视觉：粉紫黄昏底、镭射渐变字、透视网格海面、发光太阳。
 */
export default function VaporwaveHome() {
  const { repos } = useRepos();

  const { featured, totalStars, langCount } = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    const stars = repos.reduce((sum, p) => sum + p.stars, 0);
    const langs = new Set(repos.map((p) => p.lang).filter(Boolean));
    return { featured: sorted.slice(0, 6), totalStars: stars, langCount: langs.size };
  }, [repos]);

  const left = featured.slice(0, 3);
  const right = featured.slice(3, 6);

  const RepoCard = ({ p, i }: { p: (typeof featured)[number]; i: number }) => (
    <a
      href={p.url}
      target="_blank"
      rel="noreferrer"
      className={
        "group block border border-border bg-card-bg/80 p-5 backdrop-blur-sm transition-colors hover:border-primary " +
        (i % 2 === 1 ? "text-left" : "text-left")
      }
    >
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
        <span className="chrome-text font-bold">{String(i + 1).padStart(2, "0")}</span>
        <span>★ {p.stars}</span>
      </div>
      <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
        {p.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.desc}</p>
      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: langColor[p.lang] ?? "#9d7ab8" }}
        />
        {p.lang || "—"}
        <span className="ml-auto text-primary opacity-0 transition-opacity group-hover:opacity-100">
          ↗
        </span>
      </div>
    </a>
  );

  return (
    <div className="min-h-screen">
      {/* ================= HERO：太阳与海面 ================= */}
      <section className="relative overflow-hidden">
        <div className="container relative mx-auto flex flex-col items-center px-6 pb-10 pt-16 text-center">
          <div className="vapor-sun mx-auto h-32 w-32 sm:h-40 sm:w-40" />
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em] text-text-dim">
            {SITE.name} // {new Date().getFullYear()}
          </p>
          <h1 className="display-title mt-6 text-[clamp(2.6rem,7vw,5.5rem)]">
            <span className="chrome-text">COMPILE THIS</span>
            <br />
            <span className="text-foreground">WORLD</span>
          </h1>
          <p className="mt-6 max-w-md leading-relaxed text-text-muted">
            开源工具与 AI 智能体。
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-5">
            <Link
              href="/projects/"
              className="border border-primary bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-85"
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
        {/* 网格海面 */}
        <div className="pointer-events-none relative h-28 overflow-hidden sm:h-36">
          <div className="vapor-floor absolute inset-x-[-30%] top-0 h-[220%]" />
          <div className="absolute inset-x-0 top-0 h-px bg-secondary/60" />
        </div>
      </section>

      {/* ================= 展廊：左翼 + 中央立柱 + 右翼 ================= */}
      <section id="projects" className="container mx-auto px-6 py-14">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
            <h2 className="flex items-baseline gap-4">
              <span className="chrome-text font-mono text-sm font-bold">01</span>
              <span className="display-title text-2xl text-foreground sm:text-3xl">展廊</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                Gallery Wing
              </span>
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
              {featured.length} / {repos.length} Exhibits
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1fr_auto_1fr]">
            {/* 左翼 */}
            <div className="space-y-6">
              {left.map((p, i) => (
                <RepoCard key={p.name} p={p} i={i} />
              ))}
            </div>

            {/* 中央立柱 */}
            <div className="mx-auto flex w-48 flex-col items-center gap-6 text-center">
              <div className="rounded-full border border-border-strong bg-card-bg/60 p-3">
                <img
                  src="/logo.jpg"
                  alt={SITE.name}
                  className="h-28 w-28 rounded-full border border-border object-cover"
                />
              </div>
              <p className="writing-vertical-rl font-mono text-[11px] uppercase tracking-[0.4em] text-text-dim">
                {SITE.tagline}
              </p>
            </div>

            {/* 右翼 */}
            <div className="space-y-6">
              {right.map((p, i) => (
                <RepoCard key={p.name} p={p} i={i + 3} />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 text-center">
            <Link
              href="/projects/"
              className="chrome-text font-mono text-xs uppercase tracking-[0.3em] underline decoration-border underline-offset-8 hover:decoration-primary"
            >
              全部 {repos.length} 件展品 →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ================= 数据：中轴对称三联 ================= */}
      <section className="border-y border-border">
        <div className="container mx-auto grid grid-cols-3 divide-x divide-border px-6">
          {[
            [repos.length, "Exhibits"],
            [totalStars, "Stars"],
            [langCount, "Mediums"],
          ].map(([num, label]) => (
            <div key={label} className="py-12 text-center">
              <p className="chrome-text text-4xl font-light tracking-tight sm:text-5xl">{num}</p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 联系：中轴收束 ================= */}
      <section className="container mx-auto px-6 py-16 text-center sm:py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-dim">
          ＿ Contact ＿
        </p>
        <h2 className="display-title mt-4 text-3xl sm:text-4xl">
          <span className="chrome-text">{SITE.tagline}</span>
        </h2>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="border border-primary bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-85"
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
      </section>
    </div>
  );
}
