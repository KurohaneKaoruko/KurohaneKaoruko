import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import HomeHero from "@/components/home/HomeHero";
import ProjectGrid from "@/components/home/ProjectGrid";
import SectionRail from "@/components/home/SectionRail";
import { SectionHeader } from "@/components/home/SectionHeader";
import TerminalSession from "@/components/home/TerminalSession";
import { Button } from "@/components/ui/Button";
import { marqueeTech } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * 终端主题首页。
 * 区块顺序：主视觉 → 跑马灯 → 项目展示 → 会话回放 → 联系。
 *
 * 版面：整页共用 `container`（版心由 globals.css:147 的 --measure 决定），
 * 但 #projects 与 #terminal 在版心内部再套一层 12 栏骨架 —— 左 3 栏是常驻侧轴
 * （SectionRail），右 9 栏是内容。这样页面从「一条竖轴往下堆」变成
 * 「侧轴 + 内容」的双轴，横向有了张力，纵向节奏也靠 --pad-section-* 拉开差距。
 *
 * 两个区块的 id 是锚点与 window.history 的落点，必须保留。
 */
export default function TerminalHome() {
  return (
    <div className="min-h-screen">
      {/* ================= HERO ================= */}
      <HomeHero />

      <Marquee items={marqueeTech} />

      {/* ================= 01 项目展示 ================= */}
      <section id="projects" className="relative py-[var(--pad-section-loose)]">
        <div className="container mx-auto px-4">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
            {/* 侧轴在 DOM 里先于内容：lg 下它在左侧，视觉顺序与 DOM 一致 */}
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
              <ProjectGrid />

              <div className="mt-10 flex justify-center">
                <Button href="/projects" variant="outline">
                  按语言筛选与排序 →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 02 会话回放 ================= */}
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

      {/* ================= CTA ================= */}
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
