"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { TechCard } from "@/components/ui/TechCard";
import { SITE, SKILL_GROUPS } from "@/lib/site";

/** 粗野：头像 + 技能分组 + 联系方式 */
function BrutalistAbout() {
  return (
    <section className="container mx-auto px-6 py-20 font-sans">
      <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-black uppercase leading-[0.98] tracking-[-0.04em]">
        关于我
      </h1>

      {/* 窄屏：头像在上、技能分组竖排；lg 起头像与分组并排，头像拉伸到与分组同高 */}
      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <img
          src="/logo.jpg"
          alt="Kurohane Kaoruko"
          className="h-28 w-auto self-start border-2 border-foreground bg-background p-3 object-cover lg:aspect-square lg:h-auto lg:max-w-[14rem] lg:self-stretch"
        />

        <div className="grid flex-1 gap-x-16 gap-y-10 lg:grid-cols-3">
          {SKILL_GROUPS.map((g) => (
            <div key={g.title}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
                {g.title}
              </h3>
              <ul className="mt-4 space-y-2 text-sm font-bold tracking-wide">
                {g.items.map((it) => (
                  <li key={it} className="border-b border-foreground/15 pb-2">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 flex flex-wrap gap-5 border-t-4 border-foreground pt-10">
        <a
          href={SITE.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 border-2 border-foreground bg-foreground px-7 py-4 font-mono text-sm uppercase tracking-[0.2em] text-background shadow-[6px_6px_0_var(--primary)] transition-transform hover:-translate-y-1"
        >
          GitHub ↗
        </a>
        <a
          href={"mailto:" + SITE.email}
          className="inline-block border-2 border-foreground px-7 py-4 font-mono text-sm uppercase tracking-[0.2em] shadow-[6px_6px_0_var(--foreground)] transition-transform hover:-translate-y-1"
        >
          {SITE.email}
        </a>
      </div>
    </section>
  );
}

/** 终端：页头 + 事实格 + 技能 / GitHub 数据卡片 */
function TerminalAbout() {
  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <SubPageHeader eyebrow="ABOUT" title="关于我" />
      </Reveal>

      <Reveal delay={0.03}>
        {/* 窄屏：头像在上、技能分组竖排；lg 起头像与分组并排，头像拉伸到与分组同高 */}
        <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-stretch">
          <img
            src="/logo.jpg"
            alt="Kurohane Kaoruko"
            className="h-28 w-auto self-start border border-border bg-card-bg p-2 object-cover lg:h-auto lg:w-[10.5rem] lg:self-stretch"
          />

          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_GROUPS.map((group) => (
              <TechCard key={group.title} className="p-5">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-secondary">
                  {group.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="border border-border px-2.5 py-1 font-mono text-xs text-text-muted transition-colors hover:border-active hover:text-primary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </TechCard>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-6">
        <TechCard className="p-8">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            GITHUB INSIGHTS
          </h2>
          <p className="mt-1 font-mono text-[11px] text-text-dim">
            {"// 与个人主页 README 同源的数据卡片"}
          </p>
          <div className="mt-6 flex justify-center">
            <img
              src="https://streak-stats.demolab.com?user=KurohaneKaoruko&theme=transparent&hide_border=true"
              alt="GitHub 连续提交统计"
              loading="lazy"
              className="w-full max-w-2xl"
            />
          </div>
          <div className="mt-4 grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-2">
            <img
              src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=KurohaneKaoruko&theme=transparent"
              alt="各语言仓库数"
              loading="lazy"
              className="w-full max-w-md"
            />
            <img
              src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=KurohaneKaoruko&theme=transparent"
              alt="提交最多的语言"
              loading="lazy"
              className="w-full max-w-md"
            />
          </div>
        </TechCard>
      </Reveal>

      <Reveal className="mt-10">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href={SITE.github} variant="primary">
            访问 GitHub
          </Button>
          <Button href={"mailto:" + SITE.email} variant="outline">
            {SITE.email}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}

/** 极境：档案面板 —— 左画像数据列，右发丝线技能表 */
function GlacialAbout() {
  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          <span>Profile // {SITE.handle}</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-primary" />
            Record Active
          </span>
        </div>
        <h1 className="display-title mt-8 text-[clamp(2.5rem,6vw,4.5rem)] text-foreground">
          关于我<span className="text-primary">.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.04}>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          {/* 画像 + 数据列 */}
          <div className="lg:col-span-4">
            <div className="chamfer corner-ticks border border-border bg-card-bg p-5">
              <img
                src="/logo.jpg"
                alt={SITE.name}
                className="w-full border border-border object-cover"
              />
              <dl className="mt-5">
                {[
                  ["NAME", SITE.name],
                  ["HANDLE", "@" + SITE.handle],
                  ["FOCUS", "AI · Tools"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
                      {k}
                    </dt>
                    <dd className="truncate font-mono text-xs text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* 技能表 */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            {SKILL_GROUPS.map((g, gi) => (
              <div key={g.title}>
                <h3 className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
                  <span className="text-text-dim">{String(gi + 1).padStart(2, "0")}</span>
                  {g.title}
                </h3>
                <ul className="mt-4 border-t border-border">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="border-b border-border py-2.5 text-sm text-foreground"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <div className="chamfer corner-ticks border border-border bg-card-bg p-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
            GitHub Insights
          </h2>
          <div className="mt-6 flex justify-center">
            <img
              src="https://streak-stats.demolab.com?user=KurohaneKaoruko&theme=transparent&hide_border=true"
              alt="GitHub 连续提交统计"
              loading="lazy"
              className="w-full max-w-2xl"
            />
          </div>
          <div className="mt-4 grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-2">
            <img
              src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=KurohaneKaoruko&theme=transparent"
              alt="各语言仓库数"
              loading="lazy"
              className="w-full max-w-md"
            />
            <img
              src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=KurohaneKaoruko&theme=transparent"
              alt="提交最多的语言"
              loading="lazy"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="chamfer-sm bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            访问 GitHub ↗
          </a>
          <a
            href={"mailto:" + SITE.email}
            className="chamfer-sm border border-border-strong px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {SITE.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/** 极繁：拼贴手账 —— 叠框画像 + 稠密标签云 */
function MaximalAbout() {
  const TONES = ["border-primary", "border-[var(--max-sun)]", "border-secondary", "border-accent"];
  return (
    <section className="container mx-auto px-6 py-16">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <span className="-rotate-2 border-2 border-foreground bg-primary px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
            Profile
          </span>
          <span className="rotate-1 border-2 border-foreground bg-[var(--max-sun)] px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground shadow-[3px_3px_0_var(--foreground)]">
            @{SITE.handle}
          </span>
          <span className="rotate-3 border-2 border-foreground bg-accent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
            ★ AI · Tools
          </span>
        </div>
        <h1 className="mt-8 text-[clamp(2.5rem,7vw,5rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] text-foreground">
          关于<span className="marker-hl">我</span>
        </h1>
      </Reveal>

      <Reveal delay={0.04}>
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          {/* 画像拼贴 */}
          <div className="lg:col-span-4">
            <div className="frame-double relative mx-auto max-w-xs border-[3px] border-foreground bg-card-bg p-3 shadow-[8px_8px_0_var(--foreground)] lg:mx-0">
              <div className="pattern-checker absolute inset-0 text-primary/25" />
              <img
                src="/logo.jpg"
                alt={SITE.name}
                className="relative w-full border-2 border-foreground object-cover"
              />
              <span className="absolute -left-3 -top-3 -rotate-6 border-2 border-foreground bg-accent px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-[3px_3px_0_var(--foreground)]">
                Maker
              </span>
              <span className="absolute -right-3 bottom-10 rotate-6 border-2 border-foreground bg-[var(--max-sun)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground shadow-[3px_3px_0_var(--foreground)]">
                Since 2023
              </span>
            </div>
            <div className="mx-auto mt-8 max-w-xs border-2 border-foreground bg-card-bg lg:mx-0">
              {[["NAME", SITE.name], ["FOCUS", "AI · Tools"], ["BASE", "GitHub"]].map(
                ([k, v], i) => (
                  <div
                    key={k}
                    className={
                      "flex items-baseline justify-between gap-4 px-4 py-2.5 font-mono text-[11px] " +
                      (i > 0 ? "border-t-2 border-dashed border-foreground/30" : "")
                    }
                  >
                    <span className="uppercase tracking-[0.25em] text-text-dim">{k}</span>
                    <span className="truncate font-bold">{v}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 技能标签云 */}
          <div className="space-y-10 lg:col-span-8">
            {SKILL_GROUPS.map((g) => (
              <div key={g.title}>
                <h3 className="inline-block border-b-4 border-primary pb-1 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-foreground">
                  {g.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {g.items.map((it, ii) => (
                    <span
                      key={it}
                      className={
                        "border-2 bg-card-bg px-4 py-2 font-mono text-xs font-bold shadow-[4px_4px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 " +
                        TONES[ii % TONES.length] +
                        " text-foreground " +
                        (ii % 2 === 0 ? "-rotate-1" : "rotate-1")
                      }
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-[3px] border-foreground bg-card-bg shadow-[8px_8px_0_var(--foreground)]">
              <div className="pattern-diag h-3 border-b-[3px] border-foreground text-secondary" />
              <div className="p-6">
                <h3 className="inline-block bg-foreground px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-background">
                  GitHub Insights
                </h3>
                <div className="mt-5 flex justify-center">
                  <img
                    src="https://streak-stats.demolab.com?user=KurohaneKaoruko&theme=transparent&hide_border=true"
                    alt="GitHub 连续提交统计"
                    loading="lazy"
                    className="w-full max-w-2xl"
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-2">
                  <img
                    src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=KurohaneKaoruko&theme=transparent"
                    alt="各语言仓库数"
                    loading="lazy"
                    className="w-full max-w-md"
                  />
                  <img
                    src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=KurohaneKaoruko&theme=transparent"
                    alt="提交最多的语言"
                    loading="lazy"
                    className="w-full max-w-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="border-2 border-foreground bg-primary px-7 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-[5px_5px_0_var(--foreground)] transition-transform hover:-translate-y-1"
          >
            GitHub ↗
          </a>
          <a
            href={"mailto:" + SITE.email}
            className="border-2 border-foreground bg-card-bg px-7 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] shadow-[5px_5px_0_var(--accent)] transition-transform hover:-translate-y-1"
          >
            {SITE.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/** 故障：恢复的档案 —— 色差像框 + 解码数据块 */
function GlitchAbout() {
  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse bg-primary" />
            Archive // {SITE.handle}
          </span>
          <span className="rgb-split text-primary">FILE RECOVERED</span>
        </div>
        <h1 className="display-title mt-8 text-[clamp(2.5rem,6vw,4.5rem)] text-foreground">
          关于<span className="rgb-split text-primary">我</span>
          <span className="text-secondary">_</span>
        </h1>
      </Reveal>

      <Reveal delay={0.04}>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          {/* 色差像框画像 + 数据列 */}
          <div className="lg:col-span-4">
            <div className="relative mx-auto max-w-xs border border-border bg-card-bg p-4 shadow-[8px_0_0_var(--g-blue),-8px_0_0_var(--g-red)] lg:mx-0">
              <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
              <img
                src="/logo.jpg"
                alt={SITE.name}
                className="relative w-full border border-border object-cover"
              />
              <dl className="relative mt-5">
                {[
                  ["NAME", SITE.name],
                  ["HANDLE", "@" + SITE.handle],
                  ["FOCUS", "AI · Tools"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
                      {k}
                    </dt>
                    <dd className="truncate font-mono text-xs text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* 技能：恢复的数据块 */}
          <div className="space-y-8 lg:col-span-8">
            {SKILL_GROUPS.map((g, gi) => (
              <div key={g.title} className="border border-border bg-card-bg">
                <div className="corrupt-bar h-1.5 border-b border-border" />
                <div className="p-5">
                  <h3 className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em]">
                    <span className="rgb-split text-primary">
                      BLK-{String(gi + 1).padStart(2, "0")}
                    </span>
                    <span className="text-foreground">{g.title}</span>
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <span
                        key={it}
                        className="border border-border px-2.5 py-1 font-mono text-xs text-text-muted transition-colors hover:border-primary hover:text-primary"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="border border-border bg-card-bg">
              <div className="corrupt-bar h-1.5 border-b border-border" />
              <div className="p-5">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                  GitHub Insights
                </h3>
                <div className="mt-5 flex justify-center">
                  <img
                    src="https://streak-stats.demolab.com?user=KurohaneKaoruko&theme=transparent&hide_border=true"
                    alt="GitHub 连续提交统计"
                    loading="lazy"
                    className="w-full max-w-2xl"
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-2">
                  <img
                    src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=KurohaneKaoruko&theme=transparent"
                    alt="各语言仓库数"
                    loading="lazy"
                    className="w-full max-w-md"
                  />
                  <img
                    src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=KurohaneKaoruko&theme=transparent"
                    alt="提交最多的语言"
                    loading="lazy"
                    className="w-full max-w-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="border border-primary bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground shadow-[4px_4px_0_var(--g-blue)] transition-transform hover:-translate-y-1"
          >
            访问 GitHub ↗
          </a>
          <a
            href={"mailto:" + SITE.email}
            className="border border-border-strong px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {SITE.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/** 极简：一页纸简历 —— 刊头栏 + 细体大数字 + 发丝线数据行 */
function MinimalAbout() {
  return (
    <section className="mx-auto max-w-[46rem] px-6 py-20">
      <Reveal>
        <div className="flex items-baseline justify-between border-b border-border pb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          <span className="text-foreground">About</span>
          <span>{SITE.handle}</span>
        </div>
        <h1 className="display-title mt-12 text-[clamp(2.4rem,5.5vw,3.4rem)] text-foreground">
          关于我
        </h1>
      </Reveal>

      <Reveal delay={0.04}>
        <div className="mt-12 flex flex-col gap-10 sm:flex-row sm:gap-14">
          <div className="shrink-0">
            <img
              src="/logo.jpg"
              alt={SITE.name}
              className="h-40 w-40 border border-border object-cover"
            />
            <dl className="mt-8 w-40">
              {[
                ["NAME", SITE.name],
                ["FOCUS", "AI · Tools"],
                ["BASE", "GitHub"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-3 border-b border-border py-2.5 last:border-b-0"
                >
                  <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-text-dim">
                    {k}
                  </dt>
                  <dd className="truncate font-mono text-[11px] text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-5 text-lg font-light leading-loose text-text-muted">
            <p>
              AI engineer &amp; toolmaker。用 TypeScript、Python 与 Rust 做工具，
              关注 LLM Agents 与 Swarm Intelligence。
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-20 space-y-14">
          {SKILL_GROUPS.map((g, gi) => (
            <div key={g.title} className="relative">
              <span className="pointer-events-none absolute -top-8 right-0 select-none font-extralight leading-none text-foreground/[0.05] [font-size:7rem]">
                {String(gi + 1).padStart(2, "0")}
              </span>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                {String(gi + 1).padStart(2, "0")} — {g.title}
              </h3>
              <p className="mt-4 text-xl font-light text-foreground">
                {g.items.map((it, ii) => (
                  <span key={it}>
                    {ii > 0 && <span className="mr-3 text-text-dim">·</span>}
                    {it}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-20 border-t border-border pt-12">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
            GitHub Insights
          </h3>
          <div className="mt-6 flex justify-center">
            <img
              src="https://streak-stats.demolab.com?user=KurohaneKaoruko&theme=transparent&hide_border=true"
              alt="GitHub 连续提交统计"
              loading="lazy"
              className="w-full max-w-2xl"
            />
          </div>
          <div className="mt-4 grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-2">
            <img
              src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=KurohaneKaoruko&theme=transparent"
              alt="各语言仓库数"
              loading="lazy"
              className="w-full max-w-md"
            />
            <img
              src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=KurohaneKaoruko&theme=transparent"
              alt="提交最多的语言"
              loading="lazy"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-16 border-t border-border pt-12">
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
            className="group mt-5 inline-flex items-baseline gap-2 font-mono text-xs tracking-[0.15em] text-text-muted transition-colors hover:text-foreground"
          >
            github.com/{SITE.handle}
            <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/** 赛博：接头档案 —— 霓虹像框 + 悬赏式技能条 */
function CyberpunkAbout() {
  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          <span className="flex items-center gap-2">
            <span className="neon-text-m">●</span> Runner File // {SITE.handle}
          </span>
          <span className="neon-text">IDENTITY VERIFIED</span>
        </div>
        <h1 className="display-title mt-8 text-[clamp(2.5rem,6vw,4.5rem)] text-foreground">
          关于<span className="neon-text">我</span>
          <span className="neon-text-m">.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.04}>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="neon-frame mx-auto max-w-xs bg-card-bg p-4 lg:mx-0">
              <img src="/logo.jpg" alt={SITE.name} className="w-full border border-border object-cover" />
              <dl className="mt-5">
                {[
                  ["NAME", SITE.name],
                  ["HANDLE", "@" + SITE.handle],
                  ["FOCUS", "AI · Tools"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">{k}</dt>
                    <dd className="truncate font-mono text-xs text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-8">
            {SKILL_GROUPS.map((g, gi) => (
              <div key={g.title} className={"bg-card-bg p-5 " + (gi % 2 === 1 ? "neon-frame-m" : "neon-frame")}>
                <h3 className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em]">
                  <span className={gi % 2 === 1 ? "neon-text-m" : "neon-text"}>
                    MOD-{String(gi + 1).padStart(2, "0")}
                  </span>
                  <span className="text-foreground">{g.title}</span>
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span
                      key={it}
                      className="border border-border px-2.5 py-1 font-mono text-xs text-text-muted transition-colors hover:border-primary hover:text-primary"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div className="neon-frame bg-card-bg p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                GitHub Insights
              </h3>
              <div className="mt-5 flex justify-center">
                <img src="https://streak-stats.demolab.com?user=KurohaneKaoruko&theme=transparent&hide_border=true" alt="GitHub 连续提交统计" loading="lazy" className="w-full max-w-2xl" />
              </div>
              <div className="mt-4 grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-2">
                <img src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=KurohaneKaoruko&theme=transparent" alt="各语言仓库数" loading="lazy" className="w-full max-w-md" />
                <img src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=KurohaneKaoruko&theme=transparent" alt="提交最多的语言" loading="lazy" className="w-full max-w-md" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="border border-primary bg-primary px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground shadow-[0_0_18px_rgba(0,240,255,0.35)] transition-transform hover:-translate-y-1"
          >
            访问 GitHub ↗
          </a>
          <a
            href={"mailto:" + SITE.email}
            className="neon-frame-m px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-transform hover:-translate-y-1"
          >
            {SITE.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/** 蒸汽波：对称圣殿 —— 圆形画像居中 + 镜像技能双翼 */
function VaporwaveAbout() {
  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-dim">
            Profile // {SITE.handle}
          </p>
          <h1 className="display-title mt-6 text-[clamp(2.5rem,6vw,4.5rem)]">
            <span className="chrome-text">关于我</span>
          </h1>
        </div>
      </Reveal>

      <Reveal delay={0.04}>
        <div className="mx-auto mt-12 max-w-md text-center">
          <div className="mx-auto w-fit rounded-full border border-border-strong bg-card-bg/60 p-4">
            <img src="/logo.jpg" alt={SITE.name} className="h-40 w-40 rounded-full border border-border object-cover" />
          </div>
          <p className="mt-8 leading-loose text-text-muted">
            AI engineer &amp; toolmaker。用 TypeScript、Python 与 Rust 做工具，
            关注 LLM Agents 与 Swarm Intelligence。
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {SKILL_GROUPS.map((g) => (
            <div key={g.title} className="border border-border bg-card-bg/80 p-5 text-center backdrop-blur-sm">
              <h3 className="chrome-text font-mono text-[11px] font-bold uppercase tracking-[0.3em]">
                {g.title}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-foreground">
                {g.items.map((it) => (
                  <li key={it} className="border-b border-border pb-2 last:border-b-0">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-16 border border-border bg-card-bg/80 p-6 backdrop-blur-sm">
          <h3 className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
            GitHub Insights
          </h3>
          <div className="mt-5 flex justify-center">
            <img src="https://streak-stats.demolab.com?user=KurohaneKaoruko&theme=transparent&hide_border=true" alt="GitHub 连续提交统计" loading="lazy" className="w-full max-w-2xl" />
          </div>
          <div className="mt-4 grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-2">
            <img src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=KurohaneKaoruko&theme=transparent" alt="各语言仓库数" loading="lazy" className="w-full max-w-md" />
            <img src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=KurohaneKaoruko&theme=transparent" alt="提交最多的语言" loading="lazy" className="w-full max-w-md" />
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <div className="flex flex-wrap items-center justify-center gap-5">
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
      </Reveal>
    </section>
  );
}

/** Y2K：系统设置窗口 */
function Y2KAbout() {
  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <div className="k2-panel mx-auto max-w-2xl overflow-hidden rounded-xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-primary to-[#6a9bff] px-4 py-2 text-white">
            <span className="text-xs font-bold tracking-widest">ABOUT — {SITE.short}</span>
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
            </span>
          </div>
          <div className="px-6 py-8 sm:px-10">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <img src="/logo.jpg" alt={SITE.name} className="h-32 w-32 shrink-0 rounded-2xl border border-white/70 object-cover shadow-md" />
              <div className="space-y-3 text-center sm:text-left">
                <h1 className="display-title text-3xl text-foreground">关于我</h1>
                <p className="text-sm leading-relaxed text-text-muted">
                  AI engineer &amp; toolmaker。用 TypeScript、Python 与 Rust 做工具，
                  关注 LLM Agents 与 Swarm Intelligence。
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {SKILL_GROUPS.map((g) => (
                <div key={g.title}>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{g.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <span key={it} className="k2-panel rounded-full px-3 py-1 font-mono text-[11px] text-foreground">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <h3 className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                GitHub Insights
              </h3>
              <div className="mt-4 flex justify-center">
                <img src="https://streak-stats.demolab.com?user=KurohaneKaoruko&theme=transparent&hide_border=true" alt="GitHub 连续提交统计" loading="lazy" className="w-full max-w-2xl" />
              </div>
              <div className="mt-4 grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-2">
                <img src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=KurohaneKaoruko&theme=transparent" alt="各语言仓库数" loading="lazy" className="w-full max-w-md" />
                <img src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=KurohaneKaoruko&theme=transparent" alt="提交最多的语言" loading="lazy" className="w-full max-w-md" />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href={"mailto:" + SITE.email} className="bubble-btn rounded-full px-6 py-2.5 font-mono text-xs font-bold text-white transition-transform hover:-translate-y-0.5">
                {SITE.email}
              </a>
              <a href={SITE.github} target="_blank" rel="noreferrer" className="k2-panel rounded-full px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-foreground transition-transform hover:-translate-y-0.5">
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/** 卡带：机架档案单元 */
function CassetteAbout() {
  return (
    <section className="container mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <Reveal>
        <div className="rack-panel rounded-md p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="plate-label text-[10px]">Archive Unit — {SITE.handle}</span>
            <span className="plate-label text-[10px]">REC ●</span>
          </div>
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <img src="/logo.jpg" alt={SITE.name} className="h-36 w-36 shrink-0 rounded-sm border border-border object-cover" />
            <div>
              <h1 className="display-title text-3xl text-foreground">关于我</h1>
              <p className="mt-4 leading-relaxed text-text-muted">
                AI engineer &amp; toolmaker。用 TypeScript、Python 与 Rust 做工具，
                关注 LLM Agents 与 Swarm Intelligence。
              </p>
              <dl className="mt-5">
                {[
                  ["NAME", SITE.name],
                  ["FOCUS", "AI · Tools"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-6 border-b border-border py-2 last:border-b-0">
                    <dt className="plate-label text-[9px]">{k}</dt>
                    <dd className="font-mono text-xs text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-6 space-y-6">
          {SKILL_GROUPS.map((g, gi) => (
            <div key={g.title} className="rack-panel rounded-md p-5">
              <span className="amber-screen rounded-sm px-2 py-1 font-mono text-[10px] font-bold">
                UNIT-{String(gi + 1).padStart(2, "0")} {g.title}
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span key={it} className="border border-border px-2.5 py-1 font-mono text-xs text-text-muted transition-colors hover:border-primary hover:text-primary">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="rack-panel rounded-md p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="plate-label text-[10px]">Data Readout</span>
              <span className="plate-label text-[10px]">GitHub Insights</span>
            </div>
            <div className="mt-5 flex justify-center">
              <img src="https://streak-stats.demolab.com?user=KurohaneKaoruko&theme=transparent&hide_border=true" alt="GitHub 连续提交统计" loading="lazy" className="w-full max-w-2xl" />
            </div>
            <div className="mt-4 grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-2">
              <img src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=KurohaneKaoruko&theme=transparent" alt="各语言仓库数" loading="lazy" className="w-full max-w-md" />
              <img src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=KurohaneKaoruko&theme=transparent" alt="提交最多的语言" loading="lazy" className="w-full max-w-md" />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-6">
        <div className="rack-panel flex flex-wrap items-center justify-center gap-4 rounded-md p-5">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="border border-border-strong bg-primary px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            GitHub ↗
          </a>
          <a
            href={"mailto:" + SITE.email}
            className="border border-border-strong px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {SITE.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/** 瑞士：网格档案 —— 单元格里的照片与数据 */
function SwissAbout() {
  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <div className="flex items-baseline justify-between border-b-2 border-foreground pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          <span className="font-bold text-foreground">02 — About</span>
          <span>{SITE.handle}</span>
        </div>
        <h1 className="display-title mt-8 text-[clamp(2.5rem,6vw,4.5rem)] text-foreground">
          关于我<span className="text-primary">.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.04}>
        <div className="mt-10 grid gap-px border border-foreground/25 bg-foreground/25 lg:grid-cols-12">
          <div className="bg-background p-6 lg:col-span-4">
            <img
              src="/logo.jpg"
              alt={SITE.name}
              className="w-full border border-border object-cover"
            />
            <dl className="mt-5">
              {[
                ["NAME", SITE.name],
                ["HANDLE", "@" + SITE.handle],
                ["FOCUS", "AI · Tools"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
                    {k}
                  </dt>
                  <dd className="truncate font-mono text-xs text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-px bg-foreground/25 sm:grid-cols-3 lg:col-span-8">
            {SKILL_GROUPS.map((g, gi) => (
              <div key={g.title} className="bg-background p-6">
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                  {String(gi + 1).padStart(2, "0")} {g.title}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-foreground">
                  {g.items.map((it) => (
                    <li key={it} className="border-b border-border pb-2 last:border-b-0">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-6 grid gap-px border border-foreground/25 bg-foreground/25">
          <div className="bg-background p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
              GitHub Insights
            </p>
            <div className="mt-5 flex justify-center">
              <img
                src="https://streak-stats.demolab.com?user=KurohaneKaoruko&theme=transparent&hide_border=true"
                alt="GitHub 连续提交统计"
                loading="lazy"
                className="w-full max-w-2xl"
              />
            </div>
            <div className="mt-4 grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-2">
              <img
                src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=KurohaneKaoruko&theme=transparent"
                alt="各语言仓库数"
                loading="lazy"
                className="w-full max-w-md"
              />
              <img
                src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=KurohaneKaoruko&theme=transparent"
                alt="提交最多的语言"
                loading="lazy"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-8">
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="bg-primary px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-foreground"
          >
            访问 GitHub ↗
          </a>
          <a
            href={"mailto:" + SITE.email}
            className="border-2 border-foreground px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.25em] text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            {SITE.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/** 解构：拆开的档案 —— 照片被裁掉一角，技能是三层各自挪开的碎片 */
function DeconstructAbout() {
  return (
    <section className="container mx-auto px-6 py-16 sm:py-20">
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
          <span className="font-bold text-foreground">03 — About</span>
          <span>{SITE.handle}</span>
        </div>
        <div className="dc-rule mt-3" />

        <h1 className="display-title dc-misprint mt-8 text-[clamp(2.6rem,7vw,5rem)] text-foreground">
          关于我
        </h1>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
        {/* 档案照：裁掉一角的碎片 + 偏出去的第二印 */}
        <Reveal className="lg:col-span-4">
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-3 -top-3 block h-full w-full bg-primary/20"
            />
            <img
              src="/logo.jpg"
              alt={SITE.name}
              className="dc-frag relative w-full rotate-[-1.2deg] border border-foreground object-cover"
            />
          </div>

          <dl className="mt-7 border-t border-border">
            {[
              ["NAME", SITE.name],
              ["HANDLE", "@" + SITE.handle],
              ["FOCUS", "AI · Tools"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-baseline justify-between gap-4 border-b border-border py-2.5"
              >
                <dt className="font-mono text-[9px] uppercase tracking-[0.3em] text-text-dim">{k}</dt>
                <dd className="truncate font-mono text-xs text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* 技能：三层碎片，左边缘逐层缩进，像被推开的纸堆 */}
        <Reveal className="lg:col-span-8" delay={0.05}>
          <div className="space-y-4">
            {SKILL_GROUPS.map((g, gi) => (
              <div
                key={g.title}
                style={{ marginLeft: gi * 14 }}
                className="dc-frag-alt border border-border bg-card-bg p-5"
              >
                <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                  {String(gi + 1).padStart(2, "0")} / {g.title}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-foreground">
                  {g.items.map((it) => (
                    <li key={it} className="border-b border-border pb-0.5">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="dc-frag mt-6 border border-border bg-card-bg p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-text-dim">
              GitHub Insights
            </p>
            <div className="mt-4 flex justify-center">
              <img
                src="https://streak-stats.demolab.com?user=KurohaneKaoruko&theme=transparent&hide_border=true"
                alt="GitHub 连续提交统计"
                loading="lazy"
                className="w-full max-w-2xl"
              />
            </div>
            <div className="mt-3 grid grid-cols-1 items-start justify-items-center gap-3 sm:grid-cols-2">
              <img
                src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=KurohaneKaoruko&theme=transparent"
                alt="各语言仓库数"
                loading="lazy"
                className="w-full max-w-md"
              />
              <img
                src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=KurohaneKaoruko&theme=transparent"
                alt="提交最多的语言"
                loading="lazy"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-10">
        <div className="dc-cutline mb-8" />
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="dc-frag bg-foreground px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            访问 GitHub ↗
          </a>
          <a
            href={"mailto:" + SITE.email}
            className="border border-foreground px-7 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {SITE.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export default function AboutView() {
  const { theme } = useTheme();
  if (theme === "brutalist") return <BrutalistAbout />;
  if (theme === "glacial") return <GlacialAbout />;
  if (theme === "maximal") return <MaximalAbout />;
  if (theme === "glitch") return <GlitchAbout />;
  if (theme === "minimal") return <MinimalAbout />;
  if (theme === "cyberpunk") return <CyberpunkAbout />;
  if (theme === "vaporwave") return <VaporwaveAbout />;
  if (theme === "y2k") return <Y2KAbout />;
  if (theme === "cassette") return <CassetteAbout />;
  if (theme === "swiss") return <SwissAbout />;
  if (theme === "deconstruct") return <DeconstructAbout />;
  return <TerminalAbout />;
}
