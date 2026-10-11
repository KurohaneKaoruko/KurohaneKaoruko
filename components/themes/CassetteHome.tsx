"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRepos } from "@/components/ReposProvider";
import { langColor } from "@/lib/data";
import { SITE, TERMINAL_SESSION } from "@/lib/site";

/**
 * 卡带未来主义主题首页。
 *
 * 信息架构：「机架设备」—— 页面是一台 19 英寸机柜，自上而下堆叠设备单元：
 * 顶部是带琥珀显示屏的主机单元，项目是一格一格的磁带槽，
 * 数据是三路 VU 电平表，联系是面板上的通信模块。
 * 阅读路径 = 自上而下巡机。与终端的黑底 CRT 不同：
 * 这里是米色塑料机身 + 内嵌琥珀小屏，「被用过的未来」。
 *
 * 视觉：米色机身、琥珀橙、橄榄绿、钢蓝；面板螺丝、刻字铭牌。
 */
export default function CassetteHome() {
  const { repos } = useRepos();

  const { featured, totalStars, langCount } = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    const stars = repos.reduce((sum, p) => sum + p.stars, 0);
    const langs = new Set(repos.map((p) => p.lang).filter(Boolean));
    return { featured: sorted.slice(0, 6), totalStars: stars, langCount: langs.size };
  }, [repos]);

  const meters = [
    ["REPOS", repos.length, Math.max(repos.length, 1)],
    ["STARS", totalStars, Math.max(totalStars, 1)],
    ["LANGS", langCount, Math.max(langCount, 1)],
  ] as const;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl space-y-6 px-6 py-10">
        {/* ================= 主机单元：琥珀屏 ================= */}
        <section className="rack-panel rounded-md p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="plate-label text-[10px]">{SITE.name} — Personal Archive</span>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Power
            </span>
          </div>

          <div className="amber-screen mt-4 rounded-sm p-5 font-mono text-sm leading-relaxed sm:text-base">
            {TERMINAL_SESSION.map((line) => (
              <p key={line.cmd} className="truncate">
                <span className="opacity-60">&gt;</span> {line.out}
              </p>
            ))}
            <p className="mt-3 opacity-70">
              TAPE {repos.length} LOADED · {totalStars} STARS · READY
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/projects/"
              className="border border-border-strong bg-primary px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              ▶ 进入项目库
            </Link>
            <Link
              href="/about/"
              className="border border-border-strong px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              关于我
            </Link>
          </div>
        </section>

        {/* ================= 磁带槽（项目） ================= */}
        <section id="projects" className="rack-panel rounded-md p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="plate-label text-[10px]">Tape Deck — {featured.length} / {repos.length}</span>
            <span className="plate-label text-[10px]">Sorted by Stars</span>
          </div>

          <ol className="mt-2 divide-y divide-border">
            {featured.map((p, i) => (
              <li key={p.name}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-5 py-4 transition-colors hover:bg-primary/5"
                >
                  <span className="amber-screen rounded-sm px-2.5 py-1.5 font-mono text-[11px] font-bold">
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
                    <span
                      className="hidden h-2.5 w-2.5 rounded-sm sm:inline-block"
                      style={{ backgroundColor: langColor[p.lang] ?? "#9a917e" }}
                    />
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

          <div className="mt-3 border-t border-border pt-4">
            <Link
              href="/projects/"
              className="plate-label text-[10px] transition-colors hover:text-primary"
            >
              ▶▶ 全部 {repos.length} 盘磁带 →
            </Link>
          </div>
        </section>

        {/* ================= VU 电平表 ================= */}
        <section className="rack-panel rounded-md p-5 sm:p-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="plate-label text-[10px]">Level Meters</span>
            <span className="plate-label text-[10px]">CH-1/2/3</span>
          </div>
          <div className="mt-5 space-y-5">
            {meters.map(([label, value, max]) => (
              <div key={label}>
                <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
                  <span>{label}</span>
                  <span className="font-bold text-foreground">{value}</span>
                </div>
                <div className="mt-2 flex h-3 gap-1">
                  {Array.from({ length: 12 }).map((_, seg) => {
                    const on = seg < Math.round((value / max) * 12);
                    return (
                      <span
                        key={seg}
                        className={
                          "flex-1 rounded-[2px] " +
                          (on
                            ? seg >= 10
                              ? "bg-primary"
                              : seg >= 7
                                ? "bg-secondary"
                                : "bg-foreground/70"
                            : "bg-border")
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 通信模块 ================= */}
        <section className="rack-panel rounded-md p-5 text-center sm:p-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="plate-label text-[10px]">Comm Module</span>
            <span className="plate-label text-[10px]">CH-OPEN</span>
          </div>
          <p className="display-title mt-5 text-2xl text-foreground sm:text-3xl">
            {SITE.tagline}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
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
        </section>

        <p className="pb-4 text-center plate-label text-[10px]">
          © {new Date().getFullYear()} · {SITE.name} · Rack Mount System
        </p>
      </div>
    </div>
  );
}
