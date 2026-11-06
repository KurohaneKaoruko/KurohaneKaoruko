"use client";

import { useMemo } from "react";
import Marquee from "@/components/themes/shared/Marquee";
import Reveal from "@/components/themes/shared/Reveal";
import { useRepos } from "@/components/ReposProvider";
import { marqueeTech } from "@/lib/theme-data";
import { SITE } from "@/lib/site";
import { Button, HomeHero, ProjectGrid, SectionHeader, SectionRail } from "./parts";
import TerminalSession from "./Session";

/**
 * 终端主题首页（v1 版式）。
 *
 * 区块顺序：主视觉 → 跑马灯 → 项目展示 → 会话回放 → 联系。
 * #projects 与 #terminal 在版心内部套 12 栏骨架：左 3 栏是常驻侧轴，
 * 右 9 栏是内容。两个 id 是锚点落点，必须保留。
 */
export default function TerminalHome() {
  const { repos } = useRepos();

  /** v1 的仓库源本身按星标排序；v2 在这里补上同一口径。 */
  const ordered = useMemo(
    () => [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name)),
    [repos],
  );

  return (
    <div className="min-h-screen">
      <HomeHero repos={ordered} />

      <Marquee items={marqueeTech} />

      <section id="projects" className="relative py-[var(--pad-section-loose)]">
        <div className="container mx-auto px-4">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
            <SectionRail
              index="01"
              label="PROJECTS"
              cnLabel="项目展示"
              meta="★ Sorted by stars"
              hint="Live from GitHub"
            />

            <div className="lg:col-span-9">
              <SectionHeader
                id="01"
                title="PROJECTS"
                cnTitle="项目展示"
                subtitle="Open Source Repositories"
              />
              <ProjectGrid repos={ordered} />

              <div className="mt-10 flex justify-center">
                <Button href="/projects/" variant="outline">
                  按语言筛选与排序 →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="terminal" className="bg-card-bg py-[var(--pad-section)]">
        <div className="container mx-auto px-4">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
            <SectionRail
              index="02"
              label="TERMINAL"
              cnLabel="会话记录"
              meta="Read-only replay"
              hint="No shell access"
            />

            <div className="lg:col-span-9">
              <SectionHeader
                id="02"
                title="TERMINAL"
                cnTitle="会话记录"
                subtitle="Shell Session"
              />
              <TerminalSession />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-[var(--pad-section-tight)]">
        <Reveal>
          <div className="tech-corners surface relative overflow-hidden p-8 text-center sm:p-16">
            <p className="eyebrow">GET IN TOUCH</p>
            <h2 className="display-title mt-4 text-3xl text-foreground sm:text-5xl">
              {SITE.tagline}
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <Button
                href={SITE.github}
                size="lg"
                variant="primary"
                className="clip-diagonal-tr group min-w-[200px] justify-center gap-3"
              >
                <span>GITHUB</span>
                <span className="opacity-50 transition-opacity group-hover:opacity-100">↗</span>
              </Button>
              <Button
                href={"mailto:" + SITE.email}
                size="lg"
                variant="ghost"
                className="clip-diagonal-bl min-w-[200px] justify-center gap-3 bg-foreground/10 hover:bg-foreground/20"
              >
                <span>MAIL</span>
                <span className="opacity-50">✉</span>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
