"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { TechCard } from "@/components/ui/TechCard";
import { SITE, SKILL_GROUPS } from "@/lib/site";

const facts = [
  { label: "FOCUS", value: "AI / LLM Agents / Dev Tools" },
  { label: "STACK", value: "Rust · Python · TypeScript" },
];

const brutalistFacts = [
  { label: "专注", value: "AI / LLM Agents / Dev Tools" },
  { label: "栈", value: "Rust · Python · TypeScript" },
];

/** 粗野：粗框事实清单 + 技能分组 + 联系方式 */
function BrutalistAbout() {
  return (
    <section className="container mx-auto px-6 py-20 font-sans">
      <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-black uppercase leading-[0.98] tracking-[-0.04em]">
        关于我
      </h1>

      <dl className="mt-14 max-w-3xl border-2 border-foreground">
        {brutalistFacts.map((f, i) => (
          <div
            key={f.label}
            className={
              "flex items-baseline justify-between gap-6 px-5 py-4 " +
              (i > 0 ? "border-t-2 border-foreground" : "")
            }
          >
            <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-text-muted">
              {f.label}
            </dt>
            <dd className="text-right text-sm font-bold tracking-wide">{f.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-20 grid gap-x-16 gap-y-10 border-t-4 border-foreground pt-10 lg:grid-cols-12">
        {SKILL_GROUPS.map((g) => (
          <div key={g.title} className="lg:col-span-4">
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
      </section>

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

      <Reveal delay={0.05}>
        <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.label} className="bg-card-bg p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                {f.label}
              </p>
              <p className="mt-2 font-mono text-sm text-foreground">{f.value}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-6" delay={0.08}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

export default function AboutView() {
  const { theme } = useTheme();
  return theme === "brutalist" ? <BrutalistAbout /> : <TerminalAbout />;
}
