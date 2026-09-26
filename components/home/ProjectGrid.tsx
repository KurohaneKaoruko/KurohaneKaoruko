"use client";

import { useRepos } from "@/components/ReposProvider";
import { SyncBadge } from "@/components/ui/SyncBadge";
import { langColor } from "@/lib/data";
import type { Repo } from "@/lib/repos";
import { cn } from "@/lib/utils";

/**
 * 项目展示网格。
 *
 * 版面沿用这一节既有的「连续网格」：相邻格子共用同一条线，整片读起来是一个密集的
 * 索引表，而不是一叠飘着的卡片。返回「主推 + 索引」的非等高栅格后，这条共线读法不变，
 * 变的是格子之间的**权重**：第 1 条占 7 栏 × 2 行做为主推，第 2、3 条各占 5 栏收口，
 * 其余按 4 栏流动 —— 15 个仓库不再是 5 行等权格子。
 *
 * 数据来自 useRepos()：首屏是站内快照，随后换成浏览器直连 GitHub 拉到的实时数据，
 * 所以星标、语言、新仓库都是当下的。
 */

/**
 * 尾部索引格的分栏宽度。
 *
 * 前 3 条固定占住行 1–2（7+5 / 5），剩下的按「每行 3 格」流动；末行若是 1 格或 2 格，
 * 就把最后那 1–2 格加宽到 12 / 6 栏铺满整行。
 *
 * 为什么必须这么做：栅格线是 `gap-px` 从容器 `bg-border` 里透出来的，
 * 空轨道会被容器背景透成一块实色矩形 —— 简报里说的「空跨栏」在这里是可见的色块。
 * 铺满对条数取模敏感（只有 3 的倍数才天然齐整），所以按余数补宽，而不是按固定条数分支。
 */
function tailSpan(tailIndex: number, tailCount: number): string {
  const remainder = tailCount % 3;
  if (remainder === 1 && tailIndex === tailCount - 1) return "lg:col-span-12";
  if (remainder === 2 && tailIndex >= tailCount - 2) return "lg:col-span-6";
  return "lg:col-span-4";
}

function RepoCard({
  repo,
  index,
  featured = false,
  className,
}: {
  repo: Repo;
  index: number;
  featured?: boolean;
  className?: string;
}) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group relative flex min-w-0 flex-col p-7 transition-colors",
        featured ? "bg-card-bg" : "bg-background hover:bg-card-bg",
        className
      )}
    >
      {/* 悬停时顶部亮起一条强调色 */}
      <div className="absolute left-0 top-0 h-px w-full bg-transparent transition-colors group-hover:bg-primary" />

      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
        <span className="text-text-dim">{String(index + 1).padStart(2, "0")}</span>
        <span className="flex items-center gap-3">
          {repo.homepage && (
            <span className="border border-secondary/40 px-1.5 py-0.5 text-secondary">LIVE</span>
          )}
          <span className="text-primary">★ {repo.stars}</span>
          <span className="text-text-muted/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary">
            ↗
          </span>
        </span>
      </div>

      {/* min-w-0 + break-words：仓库名可能很长（如 screeps-tools-nextjs），
          不允许它把所在轨道撑开 */}
      <h3
        className={cn(
          "mt-6 min-w-0 break-words font-bold tracking-wide text-foreground transition-colors group-hover:text-primary",
          featured ? "text-4xl sm:text-5xl" : "text-xl"
        )}
      >
        {repo.name}
      </h3>

      {/* flex-1：大砖块内容不足时把底部元信息行顶到底，避免中间留空洞 */}
      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-text-muted">
        {repo.desc}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-wider">
        <span className="flex items-center gap-2 text-text-muted">
          {repo.lang && (
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: langColor[repo.lang] ?? "var(--text-muted)" }}
            />
          )}
          {repo.lang}
        </span>
        <span className="truncate text-text-dim">{repo.topics.slice(0, 2).join(" · ")}</span>
      </div>
    </a>
  );
}

export default function ProjectGrid() {
  const { repos } = useRepos();

  /**
   * 降级分支：条数由 GitHub 实时决定（lib/repos.ts:42 的 per_page=100，剔除 fork 后
   * 数量不固定），不是站内快照的固定 15 条。少于 4 条时「主推 + 索引」拼不出骨架，
   * 退回等宽三栏。
   */
  const equalLayout = repos.length < 4;
  /** 尾部索引格的条数（前 3 条已被主推与两个 5 栏格占掉） */
  const tailCount = repos.length - 3;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <SyncBadge />
      </div>

      {equalLayout ? (
        /* 降级版：等宽三栏。这里刻意不用 gap-px + bg-border —— 能走到这个分支的
           条数（1~3）本来就填不满行，实色容器背景会把空轨道透成一块色块。
           边框画线得到的共线读法与主路径一致。 */
        <div className="mx-2 grid grid-cols-1 border-l border-t border-border md:mx-6 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((p, i) => (
            <RepoCard
              key={p.name}
              repo={p}
              index={i}
              className="min-h-[13rem] border-b border-r border-border bg-card-bg/50 hover:bg-card-bg"
            />
          ))}
        </div>
      ) : (
        /* 主路径：12 栏非等高。gap-px 让容器 bg-border 从缝隙里透出网格线，
           单元格自带不透明背景 —— 单元格必须不透明，半透明会把背景的边框色
           整片透上来。 */
        <div className="mx-2 grid grid-cols-1 gap-px border border-border bg-border md:mx-6 md:grid-cols-2 lg:auto-rows-[minmax(11rem,auto)] lg:grid-cols-12">
          {repos.map((p, i) => (
            <RepoCard
              key={p.name}
              repo={p}
              index={i}
              featured={i === 0}
              className={cn(
                /* md 是两栏：奇数条时让最后一格独占两栏。漏掉这一步，末行右侧那条
                   空轨道会被容器 bg-border 透成一块实色矩形（同上「空跨栏」问题） */
                i === repos.length - 1 && repos.length % 2 === 1 && "md:col-span-2",
                i === 0 && "lg:col-span-7 lg:row-span-2",
                i === 1 && "lg:col-span-5",
                i === 2 && "lg:col-span-5",
                i > 2 && tailSpan(i - 3, tailCount)
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
