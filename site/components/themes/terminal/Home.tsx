"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRepos } from "@/components/ReposProvider";
import { TERMINAL_SESSION } from "@/lib/theme-data";
import { SITE } from "@/lib/site";

/**
 * 终端主题首页。
 *
 * 信息架构：一台没关机的旧机器。屏幕顶部是状态栏，中部是 `whoami` 输出，
 * 下半部分是 `ls ~/projects` 的实时列表与会话回放。
 * 阅读路径是自上而下的命令行顺序流，与其他主题的卡片 / 网格 / 海报结构不同。
 */
export default function TerminalHome() {
  const { repos, status } = useRepos();

  const { featured, totalStars, langCount } = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
    const stars = repos.reduce((sum, p) => sum + p.stars, 0);
    const langs = new Set(repos.map((p) => p.lang).filter(Boolean));
    return { featured: sorted.slice(0, 8), totalStars: stars, langCount: langs.size };
  }, [repos]);

  return (
    <div className="crt min-h-screen font-mono">
      <div className="crt-scan" aria-hidden="true" />

      <div className="container relative px-4 pb-20 pt-10 sm:px-6">
        {/* ===== 状态栏 ===== */}
        <div className="crt-frame">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card-bg/60 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-text-muted">
            <span className="flex items-center gap-2">
              <span className="crt-led" aria-hidden="true" />
              PHOSPHOR TERMINAL // {SITE.build}
            </span>
            <span className="flex items-center gap-4">
              <span>TTY0</span>
              <span>{status === "live" ? "SYNC OK" : "SNAPSHOT"}</span>
              <span className="text-primary">80×24</span>
            </span>
          </div>

          {/* ===== whoami ===== */}
          <div className="px-4 py-10 sm:px-8 sm:py-14">
            <p className="text-[11px] tracking-[0.18em] text-text-dim">
              <span className="text-primary">kaoruko@archive</span>:~$ whoami
            </p>
            <h1 className="mt-4 text-[clamp(2.6rem,8vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.04em] text-foreground">
              KUROHANE
              <br />
              <span className="text-primary crt-glow">KAORUKO</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-text-muted">
              {SITE.tagline} 当前归档 <span className="text-foreground">{repos.length}</span> 个公开仓库，
              累计 <span className="text-foreground">{totalStars}</span> 颗星，
              覆盖 <span className="text-foreground">{langCount}</span> 种语言。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects/"
                className="crt-btn border border-primary bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-transparent hover:text-primary"
              >
                ./open_projects
              </Link>
              <Link
                href="/about/"
                className="crt-btn border border-border px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] text-text-muted transition hover:border-primary hover:text-primary"
              >
                cat about.txt
              </Link>
            </div>
          </div>

          {/* ===== 数据 ===== */}
          <div className="grid border-t border-border text-[10px] uppercase tracking-[0.16em] sm:grid-cols-4">
            {[
              ["REPOS", String(repos.length).padStart(2, "0")],
              ["STARS", String(totalStars)],
              ["LANGS", String(langCount)],
              ["STATUS", status === "live" ? "ONLINE" : "CACHED"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between border-b border-border px-4 py-3 sm:border-b-0 sm:border-r last:sm:border-r-0">
                <span className="text-text-dim">{k}</span>
                <span className="text-primary">{v}</span>
              </div>
            ))}
          </div>

          {/* ===== 项目列表 ===== */}
          <div className="border-t border-border px-4 py-10 sm:px-8">
            <p className="text-[11px] tracking-[0.18em] text-text-dim">
              <span className="text-primary">kaoruko@archive</span>:~$ ls -la ~/projects --sort=stars
            </p>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-[11px]">
                <thead>
                  <tr className="border-b border-border-strong text-[9px] uppercase tracking-[0.2em] text-text-dim">
                    <th className="py-2 pr-4 font-normal">IDX</th>
                    <th className="py-2 pr-4 font-normal">NAME</th>
                    <th className="py-2 pr-4 font-normal">LANG</th>
                    <th className="py-2 pr-4 text-right font-normal">STARS</th>
                    <th className="py-2 text-right font-normal">OPEN</th>
                  </tr>
                </thead>
                <tbody>
                  {featured.map((repo, i) => (
                    <tr key={repo.name} className="crt-row border-b border-border/60">
                      <td className="py-3 pr-4 text-text-dim">{String(i + 1).padStart(2, "0")}</td>
                      <td className="py-3 pr-4">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-foreground transition-colors hover:text-primary"
                        >
                          {repo.name}
                        </a>
                        <span className="mt-0.5 block max-w-md truncate text-[10px] normal-case tracking-normal text-text-dim">
                          {repo.desc}
                        </span>
                      </td>
                      <td className="py-3 pr-4 uppercase text-text-muted">{repo.lang || "—"}</td>
                      <td className="py-3 pr-4 text-right text-primary">★ {repo.stars}</td>
                      <td className="py-3 text-right">
                        <a href={repo.url} target="_blank" rel="noreferrer" className="text-text-dim hover:text-primary">
                          ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Link
              href="/projects/"
              className="mt-5 inline-block text-[10px] uppercase tracking-[0.18em] text-text-muted transition-colors hover:text-primary"
            >
              --more-- 查看全部 {repos.length} 个仓库 →
            </Link>
          </div>

          {/* ===== 会话回放 ===== */}
          <div className="border-t border-border px-4 py-10 sm:px-8">
            <p className="text-[11px] tracking-[0.18em] text-text-dim">
              <span className="text-primary">kaoruko@archive</span>:~$ history
            </p>
            <div className="mt-4 space-y-2 text-[12px] leading-relaxed">
              {TERMINAL_SESSION.map((line) => (
                <div key={line.cmd}>
                  <p className="text-foreground">
                    <span className="text-primary">$</span> {line.cmd}
                  </p>
                  <p className="pl-3 text-text-muted">{line.out}</p>
                </div>
              ))}
              <p className="text-foreground">
                <span className="text-primary">$</span> <span className="crt-caret" aria-hidden="true">▊</span>
              </p>
            </div>
          </div>

          {/* ===== 联系 ===== */}
          <div className="grid border-t border-border sm:grid-cols-2">
            <div className="border-b border-border px-4 py-8 sm:border-b-0 sm:border-r sm:px-8">
              <p className="text-[9px] uppercase tracking-[0.24em] text-text-dim">MAIL</p>
              <a href={"mailto:" + SITE.email} className="mt-2 block break-all text-sm text-foreground hover:text-primary">
                {SITE.email}
              </a>
            </div>
            <div className="px-4 py-8 sm:px-8">
              <p className="text-[9px] uppercase tracking-[0.24em] text-text-dim">REMOTE</p>
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block text-sm text-foreground hover:text-primary"
              >
                github.com/{SITE.handle}
              </a>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[9px] uppercase tracking-[0.3em] text-text-dim">
          END OF TRANSMISSION — {SITE.build}
        </p>
      </div>
    </div>
  );
}
