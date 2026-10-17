"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRepos } from "@/components/ReposProvider";
import { langColor } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * Y2K 主题首页。
 *
 * 信息架构：「桌面」隐喻 —— 页面被组织成一台千禧年个人电脑：
 * 顶部是带标题栏的欢迎窗口，项目是一面桌面图标墙（图标+铭牌），
 * 数据收在系统托盘条里，联系是一个弹出的消息对话框。
 * 阅读路径是「开机 → 认图标 → 看托盘 → 点开对话框」，
 * 与钉板的 Z 字扫读、展廊的对称扫描都不同。
 *
 * 视觉：银蓝金属渐变面板、气泡高光按钮、深藏青文字、星点闪光。
 */
export default function Y2KHome() {
  const { repos } = useRepos();

  const { featured, totalStars, langCount } = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    const stars = repos.reduce((sum, p) => sum + p.stars, 0);
    const langs = new Set(repos.map((p) => p.lang).filter(Boolean));
    return { featured: sorted.slice(0, 6), totalStars: stars, langCount: langs.size };
  }, [repos]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 pb-16 pt-10">
        {/* ================= 欢迎窗口 ================= */}
        <section className="k2-panel mx-auto max-w-3xl overflow-hidden rounded-xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-primary to-[#6a9bff] px-4 py-2 text-white">
            <span className="text-xs font-bold tracking-widest">
              WELCOME — {SITE.short}
            </span>
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
            </span>
          </div>
          <div className="px-6 py-10 text-center sm:px-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-text-dim">
              System Ready · {new Date().getFullYear()}
            </p>
            <h1 className="display-title mt-5 text-[clamp(2.2rem,6vw,4rem)] text-foreground">
              COMPILE THIS <span className="text-primary">WORLD</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
              开源工具与 AI 智能体。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/projects/"
                className="bubble-btn rounded-full px-7 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5"
              >
                进入项目库
              </Link>
              <Link
                href="/about/"
                className="k2-panel rounded-full px-7 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-foreground transition-transform hover:-translate-y-0.5"
              >
                关于我
              </Link>
            </div>
          </div>
        </section>

        {/* ================= 桌面图标墙 ================= */}
        <section id="projects" className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="flex items-baseline gap-4">
              <span className="font-mono text-sm font-bold text-primary">01</span>
              <span className="display-title text-2xl text-foreground sm:text-3xl">桌面图标</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-dim">
                Desktop Icons
              </span>
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
              {featured.length} / {repos.length} Shortcuts
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
            {featured.map((p, i) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-3 rounded-xl p-4 text-center transition-transform hover:-translate-y-1"
              >
                <span className="k2-panel relative grid h-16 w-16 place-items-center rounded-2xl">
                  <span
                    className="h-6 w-6 rounded-lg border border-white/70 shadow-inner"
                    style={{ backgroundColor: langColor[p.lang] ?? "#90a0c0" }}
                  />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary font-mono text-[9px] font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                    {p.name}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-[0.15em] text-text-dim">
                    {p.lang || "—"} · ★ {p.stars}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/projects/"
              className="bubble-btn inline-block rounded-full px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5"
            >
              全部 {repos.length} 个快捷方式 →
            </Link>
          </div>
        </section>

        {/* ================= 系统托盘 ================= */}
        <section className="k2-panel mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 rounded-full px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" /> Live from GitHub
          </span>
          <span>
            REPOS <b className="text-foreground">{repos.length}</b>
          </span>
          <span>
            STARS <b className="text-foreground">{totalStars}</b>
          </span>
          <span>
            LANGS <b className="text-foreground">{langCount}</b>
          </span>
        </section>

        {/* ================= 消息对话框 ================= */}
        <section className="k2-panel mx-auto mt-14 max-w-xl overflow-hidden rounded-xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-secondary to-[#ffa8dd] px-4 py-2 text-white">
            <span className="text-xs font-bold tracking-widest">NEW MESSAGE</span>
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
            </span>
          </div>
          <div className="px-6 py-8 text-center">
            <p className="display-title text-xl text-foreground sm:text-2xl">{SITE.tagline}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href={"mailto:" + SITE.email}
                className="bubble-btn rounded-full px-6 py-2.5 font-mono text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                {SITE.email}
              </a>
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="k2-panel rounded-full px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-foreground transition-transform hover:-translate-y-0.5"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
