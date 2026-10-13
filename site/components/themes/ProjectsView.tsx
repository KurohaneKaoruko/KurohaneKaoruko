"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import ProjectsGrid from "@/components/ProjectsGrid";
import Reveal from "@/components/Reveal";
import { useRepos } from "@/components/ReposProvider";
import { SyncBadge } from "@/components/ui/SyncBadge";
import { SubPageHeader } from "@/components/ui/SubPageHeader";

/** 粗野：编号索引表 */
function BrutalistProjects() {
  const { repos } = useRepos();
  const totalStars = repos.reduce((sum, p) => sum + p.stars, 0);

  return (
    <section className="container mx-auto px-6 py-20 font-sans">
      <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-black uppercase leading-[0.98] tracking-[-0.04em]">
        项目
      </h1>
      <p className="mt-6 max-w-xl leading-relaxed text-text-muted">
        来自 GitHub 的真实仓库 —— 用技术解决问题的痕迹。
      </p>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-b-2 border-foreground pb-5 font-mono text-[11px] uppercase tracking-[0.25em]">
        <span>全部 {repos.length} 个仓库</span>
        <span>共 {totalStars} 星标</span>
      </div>

      <ol className="mt-2">
        {[...repos]
          .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name))
          .map((p, i) => (
            <li key={p.name} className="border-b border-foreground/20">
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group grid items-baseline gap-x-6 gap-y-3 py-7 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto]"
              >
                <span className="font-mono text-sm tracking-widest text-text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-2xl font-bold tracking-[-0.02em] transition-colors group-hover:text-primary sm:text-3xl">
                    {p.name}
                  </span>
                  <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-text-muted">
                    {p.desc}
                  </span>
                </span>
                <span className="flex shrink-0 items-baseline gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                  <span>{p.lang}</span>
                  <span className="text-foreground">★{p.stars}</span>
                  <span className="transition-transform group-hover:translate-x-1">↗</span>
                </span>
              </a>
            </li>
          ))}
      </ol>

      <div className="mt-10">
        <SyncBadge />
      </div>
    </section>
  );
}

/** 终端：页头 + 统计行 + 可筛选的卡片网格 */
function TerminalProjects() {
  const { repos } = useRepos();
  const totalStars = repos.reduce((sum, p) => sum + p.stars, 0);

  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <SubPageHeader
          eyebrow="REPOSITORIES"
          title="项目库"
          description="按语言筛选、按星标或名称排序。全部条目都指向真实的 GitHub 仓库。"
        />
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
            <span>
              TOTAL <span className="text-foreground">{repos.length}</span>
            </span>
            <span>
              STARS <span className="text-primary">{totalStars}</span>
            </span>
          </div>
          <SyncBadge />
        </div>
      </Reveal>

      <div className="mt-10">
        <ProjectsGrid />
      </div>
    </section>
  );
}

/** 极境：发丝线登记表 —— 列对齐的全量账目 */
function GlacialProjects() {
  const { repos } = useRepos();
  const totalStars = repos.reduce((sum, p) => sum + p.stars, 0);

  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          <span>Repository Registry</span>
          <span>{repos.length} Entries</span>
        </div>
        <h1 className="display-title mt-8 text-[clamp(2.5rem,6vw,4.5rem)] text-foreground">
          项目库<span className="text-primary">.</span>
        </h1>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div className="flex gap-8 font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
            <span>
              TOTAL <span className="text-foreground">{repos.length}</span>
            </span>
            <span>
              STARS <span className="text-primary">{totalStars}</span>
            </span>
          </div>
          <SyncBadge />
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-10">
          {/* 表头 */}
          <div className="hidden grid-cols-[3rem_minmax(0,1fr)_7rem_5rem_2rem] gap-x-6 border-b border-border-strong pb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim sm:grid">
            <span>IDX</span>
            <span>Repository</span>
            <span>Language</span>
            <span className="text-right">Stars</span>
            <span />
          </div>
          <ol>
            {[...repos]
              .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name))
              .map((p, i) => (
                <li key={p.name}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-6 border-b border-border py-4 transition-colors hover:bg-primary/5 sm:grid-cols-[3rem_minmax(0,1fr)_7rem_5rem_2rem]"
                  >
                    <span className="font-mono text-[10px] tracking-[0.2em] text-text-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {p.name}
                      </span>
                      <span className="mt-1 line-clamp-1 block text-sm text-text-muted">
                        {p.desc}
                      </span>
                    </span>
                    <span className="hidden font-mono text-[11px] text-text-muted sm:block">
                      {p.lang || "—"}
                    </span>
                    <span className="text-right font-mono text-[11px] text-foreground">
                      ★ {p.stars}
                    </span>
                    <span className="hidden text-right font-mono text-xs text-text-dim transition-colors group-hover:text-primary sm:block">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}

/** 极繁：装框目录册 —— 重框 + 彩色文件签 + 稠密行 */
function MaximalProjects() {
  const { repos } = useRepos();
  const totalStars = repos.reduce((sum, p) => sum + p.stars, 0);
  const RINGS = ["border-primary", "border-[var(--max-sun)]", "border-secondary"];

  return (
    <section className="container mx-auto px-6 py-16">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <span className="-rotate-2 border-2 border-foreground bg-primary px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
            Catalog
          </span>
          <span className="rotate-1 border-2 border-foreground bg-[var(--max-sun)] px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground shadow-[3px_3px_0_var(--foreground)]">
            ★ {totalStars} Stars
          </span>
          <span className="rotate-3 border-2 border-foreground bg-secondary px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
            {repos.length} Files
          </span>
        </div>
        <h1 className="mt-8 text-[clamp(2.5rem,7vw,5rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] text-foreground">
          项目<span className="marker-hl">目录</span>
        </h1>
        <p className="mt-5 max-w-xl border-l-4 border-secondary pl-5 leading-relaxed text-text-muted">
          全部 {repos.length} 个真实 GitHub 仓库，按星标排序。
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-12 border-[3px] border-foreground bg-card-bg shadow-[8px_8px_0_var(--foreground)]">
          <div className="pattern-diag h-3 border-b-[3px] border-foreground text-primary" />
          <div className="flex items-center justify-between border-b-2 border-foreground bg-foreground px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-background">
            <span>❖ {repos.length} Entries</span>
            <span className="hidden sm:block">Sorted by Stars</span>
          </div>
          <ol className="divide-y-2 divide-foreground/15">
            {[...repos]
              .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name))
              .map((p, i) => (
                <li key={p.name}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-5 px-5 py-4 transition-colors hover:bg-primary/10 sm:grid-cols-[3rem_minmax(0,1fr)_7rem_5rem_2rem]"
                  >
                    <span
                      className={
                        "-rotate-3 place-self-center border-2 bg-card-bg px-1.5 py-0.5 text-center font-mono text-[10px] font-bold shadow-[2px_2px_0_var(--foreground)] " +
                        RINGS[i % 3] +
                        " text-foreground"
                      }
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {p.name}
                      </span>
                      <span className="mt-0.5 line-clamp-1 block text-sm text-text-muted">
                        {p.desc}
                      </span>
                    </span>
                    <span className="hidden font-mono text-[11px] text-text-muted sm:block">
                      {p.lang || "—"}
                    </span>
                    <span className="text-right font-mono text-[11px] font-bold text-primary">
                      ★ {p.stars}
                    </span>
                    <span className="hidden text-right font-mono transition-transform group-hover:translate-x-1 sm:block">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
          </ol>
          <div className="pattern-checker h-2.5 border-t-[3px] border-foreground text-secondary/60" />
        </div>

        <div className="mt-8">
          <SyncBadge />
        </div>
      </Reveal>
    </section>
  );
}

/** 故障：频段登记 —— 满幅交错的恢复记录 */
function GlitchProjects() {
  const { repos } = useRepos();
  const totalStars = repos.reduce((sum, p) => sum + p.stars, 0);

  return (
    <section className="py-16 sm:py-20">
      <Reveal>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse bg-primary" />
              Frequency Log
            </span>
            <span className="rgb-split text-primary">
              {repos.length} SIGNALS // {totalStars} STARS
            </span>
          </div>
          <h1 className="display-title mt-8 text-[clamp(2.5rem,6vw,4.5rem)] text-foreground">
            项目<span className="rgb-split text-primary">库</span>
            <span className="text-secondary">_</span>
          </h1>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            <p className="max-w-xl font-mono text-sm leading-relaxed text-text-muted">
              <span className="text-secondary">&gt;</span> 全部 {repos.length}
              个频段，按星标排序恢复。
            </p>
            <SyncBadge />
          </div>
        </div>
      </Reveal>

      <div className="mt-10 space-y-4">
        {[...repos]
          .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name))
          .map((p, i) => {
            const shift = i % 2 === 1;
            return (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className={
                  "group relative block border border-border bg-card-bg transition-colors hover:border-primary/60 hover:bg-primary/5 " +
                  (shift ? "lg:ml-auto lg:w-[96%]" : "lg:w-[96%]")
                }
              >
                <div className="grid items-center gap-x-6 gap-y-3 px-6 py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
                  <span className="rgb-split font-mono text-4xl font-black leading-none text-foreground/90">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="glitch-text block truncate text-xl font-bold tracking-tight text-foreground">
                      {p.name}
                    </span>
                    <span className="mt-1 line-clamp-1 block text-sm text-text-muted">{p.desc}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                    <span className="hidden border border-border px-2 py-0.5 text-secondary sm:inline">
                      {p.lang || "—"}
                    </span>
                    <span>★ {p.stars}</span>
                    <span className="text-primary transition-transform group-hover:translate-x-1">
                      ↗
                    </span>
                  </span>
                </div>
                <span className="absolute left-3 top-1.5 font-mono text-[8px] uppercase tracking-[0.3em] text-text-dim">
                  FRG-{String(i + 1).padStart(2, "0")}
                </span>
              </a>
            );
          })}
      </div>
    </section>
  );
}

/** 极简：单列目录 —— 刊头栏 + 细体大数字 + 发丝线行 */
function MinimalProjects() {
  const { repos } = useRepos();
  const totalStars = repos.reduce((sum, p) => sum + p.stars, 0);

  return (
    <section className="mx-auto max-w-[46rem] px-6 py-20">
      <Reveal>
        <div className="flex items-baseline justify-between border-b border-border pb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          <span className="text-foreground">Projects</span>
          <span>{repos.length} — Sorted by Stars</span>
        </div>
        <h1 className="display-title mt-12 text-[clamp(2.4rem,5.5vw,3.4rem)] text-foreground">
          项目库
        </h1>
        <p className="mt-6 text-lg font-light leading-relaxed text-text-muted">
          来自 GitHub 的真实仓库。
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-10 grid grid-cols-2 divide-x divide-border border-y border-border">
          {[
            [repos.length, "Repositories"],
            [totalStars, "Stars"],
          ].map(([num, label]) => (
            <div key={label} className="px-6 py-8 text-center">
              <p className="text-4xl font-extralight tracking-tight text-foreground">{num}</p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">
                {label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <ol>
        {[...repos]
          .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name))
          .map((p, i) => (
            <li key={p.name} className="border-b border-border">
              <Reveal delay={0.02 * (i % 4)}>
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
                    <span className="mt-1 block text-sm leading-relaxed text-text-muted">
                      {p.desc}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-baseline gap-4 font-mono text-[11px] text-text-dim">
                    <span className="hidden sm:inline">{p.lang || "—"}</span>
                    <span>★ {p.stars}</span>
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
      </ol>

      <div className="mt-8">
        <SyncBadge />
      </div>
    </section>
  );
}

/** 赛博：合同索引 —— 霓虹双栏钉板的满编版 */
function CyberpunkProjects() {
  const { repos } = useRepos();
  const totalStars = repos.reduce((sum, p) => sum + p.stars, 0);

  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          <span className="flex items-center gap-2">
            <span className="neon-text-m">●</span> Contract Index
          </span>
          <span className="neon-text">{repos.length} FILES // {totalStars} STARS</span>
        </div>
        <h1 className="display-title mt-8 text-[clamp(2.5rem,6vw,4.5rem)] text-foreground">
          项目<span className="neon-text">库</span>
          <span className="neon-text-m">.</span>
        </h1>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <p className="max-w-xl leading-relaxed text-text-muted">
            全部 {repos.length} 份合同，按星标排序。
          </p>
          <SyncBadge />
        </div>
      </Reveal>

      <div className="mt-10 gap-5 sm:columns-2">
        {[...repos]
          .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name))
          .map((p, i) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className={
                "group mb-5 block break-inside-avoid bg-card-bg p-5 transition-transform hover:-translate-y-0.5 " +
                (i % 2 === 1 ? "neon-frame-m" : "neon-frame")
              }
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                <span className={i % 2 === 1 ? "neon-text-m" : "neon-text"}>
                  FILE-{String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-accent">★ {p.stars}</span>
              </div>
              <h3 className="glitch-text mt-3 text-lg font-bold tracking-tight text-foreground">
                {p.name}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">{p.desc}</p>
              <div className="mt-3 flex items-center gap-3 border-t border-border pt-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">
                {p.lang || "—"}
                <span className="ml-auto transition-transform group-hover:translate-x-1">↗</span>
              </div>
            </a>
          ))}
      </div>
    </section>
  );
}

/** 蒸汽波：对称展廊的满编版 */
function VaporwaveProjects() {
  const { repos } = useRepos();

  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-dim">
            Permanent Collection — {repos.length}
          </p>
          <h1 className="display-title mt-6 text-[clamp(2.5rem,6vw,4.5rem)]">
            <span className="chrome-text">项目库</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-text-muted">
            来自 GitHub 的真实仓库，按星标排序。
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...repos]
            .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name))
            .map((p, i) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group block border border-border bg-card-bg/80 p-5 backdrop-blur-sm transition-colors hover:border-primary"
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
                  <span className="chrome-text font-bold">{String(i + 1).padStart(2, "0")}</span>
                  <span>★ {p.stars}</span>
                </div>
                <h3 className="mt-3 font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {p.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-text-muted">{p.desc}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim">
                  {p.lang || "—"}
                </p>
              </a>
            ))}
        </div>
      </Reveal>

      <div className="mt-10 text-center">
        <SyncBadge />
      </div>
    </section>
  );
}

/** Y2K：全部快捷方式 */
function Y2KProjects() {
  const { repos } = useRepos();
  const totalStars = repos.reduce((sum, p) => sum + p.stars, 0);

  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <div className="k2-panel mx-auto max-w-3xl overflow-hidden rounded-xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-primary to-[#6a9bff] px-4 py-2 text-white">
            <span className="text-xs font-bold tracking-widest">PROJECTS — ALL {repos.length}</span>
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
            </span>
          </div>
          <div className="px-6 py-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h1 className="display-title text-3xl text-foreground">项目库</h1>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                {totalStars} STARS · Sorted by Stars
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-5">
              {[...repos]
                .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name))
                .map((p, i) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col items-center gap-2.5 text-center transition-transform hover:-translate-y-1"
                  >
                    <span className="k2-panel relative grid h-14 w-14 place-items-center rounded-2xl">
                      <span className="font-mono text-sm font-bold text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                        {p.name}
                      </span>
                      <span className="block truncate font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
                        {p.lang || "—"} · ★ {p.stars}
                      </span>
                    </span>
                  </a>
                ))}
            </div>

            <div className="mt-8 border-t border-border pt-5 text-center">
              <SyncBadge />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/** 卡带：磁带架满编 */
function CassetteProjects() {
  const { repos } = useRepos();

  return (
    <section className="container mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <Reveal>
        <div className="rack-panel rounded-md p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="plate-label text-[10px]">Tape Library — {repos.length} Tapes</span>
            <span className="amber-screen rounded-sm px-2 py-1 font-mono text-[10px] font-bold">
              ALL LOADED
            </span>
          </div>
          <h1 className="display-title mt-5 text-3xl text-foreground">项目库</h1>
          <p className="mt-3 leading-relaxed text-text-muted">
            来自 GitHub 的真实仓库，按星标排序。
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <ol className="mt-6 space-y-3">
          {[...repos]
            .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name))
            .map((p, i) => (
              <li key={p.name}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rack-panel group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-5 rounded-md px-4 py-3.5 transition-colors hover:bg-primary/5"
                >
                  <span className="amber-screen rounded-sm px-2 py-1 font-mono text-[10px] font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {p.name}
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-sm text-text-muted">
                      {p.desc}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted">
                    <span className="hidden sm:inline">{p.lang || "—"}</span>
                    <span>★ {p.stars}</span>
                    <span className="text-primary transition-transform group-hover:translate-x-1">
                      LOAD ↗
                    </span>
                  </span>
                </a>
              </li>
            ))}
        </ol>

        <div className="mt-6 rack-panel rounded-md p-4">
          <SyncBadge />
        </div>
      </Reveal>
    </section>
  );
}

/** 瑞士：模数网格全量目录 */
function SwissProjects() {
  const { repos } = useRepos();
  const totalStars = repos.reduce((sum, p) => sum + p.stars, 0);

  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <div className="flex items-baseline justify-between border-b-2 border-foreground pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          <span className="font-bold text-foreground">Projects — Index</span>
          <span>
            {repos.length} Entries · {totalStars} Stars
          </span>
        </div>
        <h1 className="display-title mt-8 text-[clamp(2.5rem,6vw,4.5rem)] text-foreground">
          项目库<span className="text-primary">.</span>
        </h1>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <p className="max-w-xl leading-relaxed text-text-muted">
            全部 {repos.length} 个真实 GitHub 仓库，按星标排序，对齐到网格。
          </p>
          <SyncBadge />
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-10 grid gap-px border border-foreground/25 bg-foreground/25 sm:grid-cols-2 lg:grid-cols-3">
          {[...repos]
            .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name))
            .map((p, i) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-[200px] flex-col bg-background p-6 transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <span className="flex items-baseline justify-between">
                  <span className="text-4xl font-bold leading-none tracking-tight text-foreground transition-colors group-hover:text-primary-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[11px] font-bold">★ {p.stars}</span>
                </span>
                <span className="mt-auto pt-8">
                  <span className="block truncate text-lg font-bold tracking-tight">{p.name}</span>
                  <span className="mt-1.5 line-clamp-2 block text-sm leading-relaxed text-text-muted transition-colors group-hover:text-primary-foreground/85">
                    {p.desc}
                  </span>
                  <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim transition-colors group-hover:text-primary-foreground/75">
                    {p.lang || "—"}
                  </span>
                </span>
              </a>
            ))}
        </div>
      </Reveal>
    </section>
  );
}

export default function ProjectsView() {
  const { theme } = useTheme();
  if (theme === "brutalist") return <BrutalistProjects />;
  if (theme === "glacial") return <GlacialProjects />;
  if (theme === "maximal") return <MaximalProjects />;
  if (theme === "glitch") return <GlitchProjects />;
  if (theme === "minimal") return <MinimalProjects />;
  if (theme === "cyberpunk") return <CyberpunkProjects />;
  if (theme === "vaporwave") return <VaporwaveProjects />;
  if (theme === "y2k") return <Y2KProjects />;
  if (theme === "cassette") return <CassetteProjects />;
  if (theme === "swiss") return <SwissProjects />;
  return <TerminalProjects />;
}
