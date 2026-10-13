"use client";

import { useMemo } from "react";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import { useRepos } from "@/components/ReposProvider";
import { langColor, marqueeTech } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * 赛博朋克主题首页。
 *
 * 信息架构：错位「悬赏钉板」—— 双栏 masonry（CSS columns），卡片按内容
 * 自然高度错落钉在墙上，阅读路径是先左列后右列的 Z 字扫读，
 * 与极繁的整齐三列墙、故障的满幅频段都不同：这里是错落的、贴条状的。
 *
 * 视觉：夜城紫黑底、霓虹青/品红发光描边、酸黄点缀；霓虹只给关键信号。
 */
export default function CyberpunkHome() {
  const { repos } = useRepos();

  const { featured, totalStars, langCount } = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    const stars = repos.reduce((sum, p) => sum + p.stars, 0);
    const langs = new Set(repos.map((p) => p.lang).filter(Boolean));
    return { featured: sorted.slice(0, 6), totalStars: stars, langCount: langs.size };
  }, [repos]);

  return (
    <div className="min-h-screen">
      {/* ================= HERO：夜城雨幕 ================= */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container relative mx-auto px-6 pb-16 pt-10 lg:pb-20">
          <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
            <span className="flex items-center gap-2">
              <span className="neon-text-m">●</span> Night City // Sector {repos.length}
            </span>
            <span className="neon-text">Rain: Online</span>
          </div>

          <h1 className="display-title mt-12 text-[clamp(2.8rem,8vw,6.5rem)] text-foreground">
            COMPILE
            <br />
            THIS <span className="neon-text">WORLD</span>
            <span className="neon-text-m">.</span>
          </h1>

          <p className="mt-8 max-w-xl leading-relaxed text-text-muted">
            <span className="neon-text-m font-mono text-sm">&gt;&gt;</span>{" "}
            开源工具、AI 智能体与游戏 —— 全部来自真实的 GitHub 仓库，
            <span className="neon-text">数据实时拉取</span>。
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <Link
              href="/projects/"
              className="border border-primary bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground shadow-[0_0_18px_rgba(0,240,255,0.35)] transition-transform hover:-translate-y-1"
            >
              进入项目库
            </Link>
            <Link
              href="/about/"
              className="neon-frame-m px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-transform hover:-translate-y-1"
            >
              关于我
            </Link>
          </div>
        </div>
      </section>

      <div className="border-b border-border bg-card-bg">
        <Marquee items={marqueeTech} />
      </div>

      {/* ================= 悬赏钉板（双栏 masonry） ================= */}
      <section id="projects" className="container mx-auto px-6 py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-4">
          <h2 className="flex items-baseline gap-4">
            <span className="neon-text font-mono text-sm font-bold">01</span>
            <span className="display-title text-2xl text-foreground sm:text-3xl">悬赏钉板</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
              Bounty Board
            </span>
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
            {featured.length} / {repos.length} Contracts
          </span>
        </div>

        <div className="mt-8 gap-5 sm:columns-2">
          {featured.map((p, i) => {
            const magenta = i % 2 === 1;
            return (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className={
                  "group mb-5 block break-inside-avoid bg-card-bg p-5 transition-transform hover:-translate-y-0.5 " +
                  (magenta ? "neon-frame-m" : "neon-frame")
                }
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                  <span className={magenta ? "neon-text-m" : "neon-text"}>
                    CONTRACT-{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-accent">★ {p.stars}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {p.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.desc}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: langColor[p.lang] ?? "#55557a" }}
                    />
                    {p.lang || "—"}
                  </span>
                  <span className="transition-transform group-hover:translate-x-1">
                    Open Contract ↗
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <Link
          href="/projects/"
          className="neon-frame mt-4 inline-block px-6 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          全部 {repos.length} 份合同 →
        </Link>
      </section>

      {/* ================= 数据墙 ================= */}
      <section className="border-y border-border bg-card-bg">
        <div className="container mx-auto grid grid-cols-3 divide-x divide-border px-6">
          {[
            [repos.length, "Contracts"],
            [totalStars, "Bounty Stars"],
            [langCount, "Codecs"],
          ].map(([num, label], i) => (
            <div key={label} className="py-12 text-center">
              <p className={"text-4xl font-black sm:text-5xl " + (i === 1 ? "neon-text-m" : "neon-text")}>
                {num}
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 联系：开放频道 ================= */}
      <section className="container mx-auto px-6 py-16 text-center sm:py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-text-dim">
          <span className="neon-text-m">▮</span> Open Channel
        </p>
        <h2 className="display-title mt-4 text-3xl text-foreground sm:text-4xl">
          <span className="neon-text">{SITE.tagline}</span>
        </h2>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="border border-primary bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground shadow-[0_0_18px_rgba(0,240,255,0.35)] transition-transform hover:-translate-y-1"
          >
            GitHub ↗
          </a>
          <a
            href={"mailto:" + SITE.email}
            className="neon-frame-m px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-transform hover:-translate-y-1"
          >
            {SITE.email}
          </a>
        </div>
      </section>
    </div>
  );
}
