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

export default function ProjectsView() {
  const { theme } = useTheme();
  return theme === "brutalist" ? <BrutalistProjects /> : <TerminalProjects />;
}
