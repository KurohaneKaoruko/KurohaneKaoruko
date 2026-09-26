"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRepos } from "@/components/ReposProvider";
import { SITE } from "@/lib/site";

/**
 * 粗野主题首页。
 *
 * 信息架构：非对称海报式版面 —— 超大标题占主栏，区块用 4px 粗黑规则线切分，
 * 内容以「编号索引」而非卡片罗列；精选项目走 12 栏双轴（左 7 栏 / 右 5 栏交替）。
 * 阅读路径是"先被标题砸到，再顺着编号往下扫"，与终端主题的顺序文本流相反。
 *
 * 仓库数据同样走实时层，所以这里的仓库数、星标数也是当下的。
 */

/**
 * 精选项目在 12 栏里的跨栏宽度。条目数由 GitHub 实时决定（featured 最多 6 条），
 * 所以按实际条数降级，不留半空的轴或空跨栏：
 * - 少于 4 条 → 全部跨满 12 栏（等价单列）；
 * - 条数为奇数 → 末条跨满 12 栏收尾。
 */
function axisSpan(i: number, total: number) {
  if (total < 4) return "lg:col-span-12";
  if (i === total - 1 && total % 2 === 1) return "lg:col-span-12";
  return i % 2 === 0 ? "lg:col-span-7" : "lg:col-span-5";
}

export default function BrutalistHome() {
  const { repos } = useRepos();

  const { featured, totalStars } = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    const stars = repos.reduce((sum, p) => sum + p.stars, 0);
    return { featured: sorted.slice(0, 6), totalStars: stars };
  }, [repos]);

  return (
    <div className="font-sans">
      {/* ============ HERO ============ */}
      <section className="border-b-4 border-foreground">
        <div className="container mx-auto grid gap-x-10 gap-y-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
          {/* 主栏：超大标题 */}
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-text-muted">
              {SITE.name}
            </p>
            <h1 className="mt-8 text-[clamp(3rem,9vw,7rem)] font-black uppercase leading-[0.98] tracking-[-0.045em] text-foreground">
              用技术
              <br />
              解决问题
            </h1>

            <div className="mt-12 flex flex-wrap items-center gap-5">
              <Link
                href="/projects/"
                className="group inline-flex items-center gap-3 border-2 border-foreground bg-foreground px-7 py-4 font-mono text-sm uppercase tracking-[0.2em] text-background shadow-[6px_6px_0_var(--primary)] transition-transform hover:-translate-y-1"
              >
                看项目
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/about/"
                className="inline-block border-2 border-foreground px-7 py-4 font-mono text-sm uppercase tracking-[0.2em] shadow-[6px_6px_0_var(--foreground)] transition-transform hover:-translate-y-1"
              >
                关于我
              </Link>
            </div>
          </div>

          {/* 副栏：贴纸 */}
          <div className="flex flex-col lg:col-span-5">
            <div className="-rotate-2 self-start border-2 border-foreground bg-primary px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-primary-foreground shadow-[5px_5px_0_var(--foreground)]">
              Open Source
            </div>
          </div>
        </div>

        {/* 数据条 */}
        <div className="border-t-2 border-foreground">
          <div className="container mx-auto flex flex-wrap gap-x-12 gap-y-2 px-6 py-5 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground">
            <span>{repos.length} Repos</span>
            <span>{totalStars} Stars</span>
            <span>AI · Tools · Games</span>
            <span className="text-text-muted">Rust / Python / TypeScript</span>
          </div>
        </div>
      </section>

      {/* ============ 01 精选项目 ============ */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="border-t-4 border-foreground pt-6 text-5xl font-black uppercase tracking-[-0.03em] sm:text-6xl">
          精选项目
        </h2>

        <ol className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-8">
          {featured.map((p, i) => (
            <li
              key={p.name}
              className={"border-b border-foreground/25 " + axisSpan(i, featured.length)}
            >
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
                  <span
                    className={
                      "block font-bold tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary " +
                      (i === 0 ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl")
                    }
                  >
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

        <Link
          href="/projects/"
          className="mt-10 inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.25em] text-primary underline-offset-8 hover:underline"
        >
          全部 {repos.length} 个仓库 →
        </Link>
      </section>

      {/* ============ 02 联系 ============ */}
      <section className="border-t-4 border-foreground">
        <div className="container mx-auto px-6 py-20">
          <h2 className="text-4xl font-black uppercase tracking-[-0.03em] sm:text-5xl">
            {SITE.tagline}
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between border-2 border-foreground px-6 py-6 shadow-[6px_6px_0_var(--foreground)] transition-transform hover:-translate-y-1"
            >
              <span className="font-mono text-sm uppercase tracking-[0.2em]">
                github.com/{SITE.handle}
              </span>
              <span className="text-xl transition-transform group-hover:translate-x-1">↗</span>
            </a>
            <a
              href={"mailto:" + SITE.email}
              className="group flex items-center justify-between border-2 border-foreground bg-foreground px-6 py-6 text-background shadow-[6px_6px_0_var(--primary)] transition-transform hover:-translate-y-1"
            >
              <span className="font-mono text-sm uppercase tracking-[0.2em]">{SITE.email}</span>
              <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
