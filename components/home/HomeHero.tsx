"use client";

import { Button } from "@/components/ui/Button";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { BracketCorner } from "@/components/ui/Decorators";
import { useRepos } from "@/components/ReposProvider";
import { SITE } from "@/lib/site";

/**
 * 首页主视觉。
 * 底层是网格底纹，左栏是取景框包住的站名、使命宣言与两个动作按钮，
 * 右栏是前 3 条仓库的实时清单 —— 首屏不再只让给站名，横向也不再只有一栏。
 *
 * 高度：`min-h-screen` 保留给小屏兜底，lg 以上收到 `min(100svh,760px)`，
 * 让下面的项目区尽早露出，不再需要滚过一整屏才看到第一个项目。
 *
 * 数据：useRepos() 来自 layout.tsx:73 的 ReposProvider（包住整个 main），
 * 首页渲染树里可用；provider 的初始 state 就是站内快照 lib/data.ts 的 projects
 * （ReposProvider.tsx:42），服务端与客户端首帧一致，水合后再换成实时数据，
 * 因此这里不存在水合不一致。
 */
export default function HomeHero() {
  const { repos } = useRepos();
  /** 首屏只放前 3 条：全量名单是下面 #projects 的职责 */
  const topRepos = repos.slice(0, 3);

  return (
    // -mt-[var(--nav-h)] 抵消 main 的 pt-[var(--nav-h)]（layout.tsx:83）；
    // 该令牌两主题分别是 64px / 76px，不能写死 -mt-16
    <section className="relative -mt-[var(--nav-h)] flex min-h-screen items-center justify-center overflow-hidden pt-20 lg:min-h-[min(100svh,760px)]">
      {/* ===== 背景层 ===== */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="tech-grid-bg absolute inset-0 opacity-30" />
      </div>

      {/* ===== 主内容区 ===== */}
      <div className="container relative z-10 mx-auto overflow-visible px-4 py-4 text-center md:py-6 lg:text-left">
        <div className="fade-in-up flex flex-col items-center lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-12">
          {/* ---------- 左栏：标题组 + 动作按钮 ---------- */}
          <div className="flex w-full flex-col items-center lg:col-span-7 lg:items-start">
            {/* 主标题组 */}
            <div className="group relative z-40 mb-8 flex justify-center lg:justify-start">
              <BracketCorner
                position="top-left"
                className="-left-3 -top-3 h-6 w-6 border-primary/20 transition-all group-hover:-left-4 group-hover:-top-4 group-hover:border-primary sm:-left-4 sm:-top-4 sm:h-8 sm:w-8 sm:group-hover:-left-6 sm:group-hover:-top-6"
              />
              <BracketCorner
                position="bottom-right"
                className="-bottom-3 -right-3 h-6 w-6 border-primary/20 transition-all group-hover:-bottom-4 group-hover:-right-4 group-hover:border-primary sm:-bottom-4 sm:-right-4 sm:h-8 sm:w-8 sm:group-hover:-bottom-6 sm:group-hover:-right-6"
              />
              {/* lg 以上的字号上限比小屏低：站名现在只占 7/12 栏，
                  沿用 clamp(2.75rem,11vw,7rem) 会在 1024~1440px 顶破栏宽 */}
              <h1 className="display-title px-2 text-[clamp(2.75rem,11vw,7rem)] leading-[0.95] text-foreground lg:text-[clamp(2.5rem,6.5vw,5.5rem)]">
                KUROHANE
                <br />
                KAORUKO
              </h1>
            </div>

            {/* 副标题 / 使命宣言 */}
            <div className="relative mx-auto mb-10 max-w-2xl md:mb-12 lg:mx-0">
              <p className="mb-2 text-lg font-bold uppercase tracking-[0.2em] text-foreground md:text-xl">
                用技术解决问题
              </p>
              <div className="flex flex-col items-center font-mono text-xs uppercase text-text-dim lg:items-start">
                <div className="flex gap-4">
                  <span>Protocol v{SITE.version}</span>
                  <span>{"//"}</span>
                  <ScrambleText text="Connection Established" delay={2000} />
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col items-center gap-6 sm:flex-row lg:justify-start">
              <Button
                href="/projects"
                size="lg"
                variant="primary"
                className="clip-diagonal-tr group min-w-[200px] justify-center gap-3"
              >
                <span>EXPLORE</span>
                <span className="opacity-50 transition-opacity group-hover:opacity-100">→</span>
              </Button>
              <Button
                href={SITE.github}
                size="lg"
                variant="ghost"
                className="clip-diagonal-bl group min-w-[200px] justify-center gap-3 bg-foreground/10 hover:bg-foreground/20"
              >
                <span>GITHUB</span>
                <span className="opacity-50 transition-opacity group-hover:opacity-100">↗</span>
              </Button>
            </div>
          </div>

          {/* ---------- 右栏：实时仓库清单（前 3 条） ---------- */}
          <div className="mt-14 w-full max-w-sm lg:col-span-5 lg:mt-0 lg:max-w-none">
            <p className="eyebrow mb-4 text-center lg:text-left">LIVE REPOSITORIES</p>

            <ul className="border-t border-border">
              {topRepos.map((p, i) => (
                <li key={p.name}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-w-0 items-center gap-3 border-b border-border py-3.5 font-mono text-xs"
                  >
                    <span className="shrink-0 text-text-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* truncate：仓库名可能是长串（如 screeps-tools-nextjs），
                        不截断会撑破栏宽 */}
                    <span className="min-w-0 flex-1 truncate text-foreground transition-colors group-hover:text-primary">
                      {p.name}
                    </span>
                    <span className="shrink-0 text-primary">★ {p.stars}</span>
                    <span className="shrink-0 text-text-dim transition-colors group-hover:text-primary">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim lg:text-left">
              Synced from GitHub
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
