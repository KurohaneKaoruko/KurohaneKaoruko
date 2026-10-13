"use client";

import { useRepos } from "@/components/ReposProvider";
import { cn } from "@/lib/utils";

function hhmm(ts: number) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * 仓库数据的同步状态，兼作手动刷新按钮。
 *
 * 实时数据是浏览器端拉的，用户需要能看出"这一份到底是刚同步的还是兜底快照"，
 * 以及在失败（限额用尽 / 离线）时手动重试一次。
 */
export function SyncBadge({ className }: { className?: string }) {
  const { repos, source, syncedAt, pending, failed, sync } = useRepos();

  const live = source === "live";
  // 已经有实时数据时，刷新失败不该把标签降级成"快照"（数据还是实时那份），
  // 但也不能装作没发生 —— 明确标出"刷新失败"，点一下就能重试。
  const label = pending
    ? "同步中 / SYNCING"
    : live
      ? `LIVE · ${repos.length} 仓库${syncedAt ? " · " + hhmm(syncedAt) + " 同步" : ""}${failed ? " · 刷新失败" : ""}`
      : failed
        ? "快照 · 点击重试"
        : "快照";

  return (
    <button
      type="button"
      onClick={sync}
      disabled={pending}
      title="从 GitHub 重新同步仓库数据"
      className={cn(
        "group inline-flex items-center gap-2 border border-border px-3 py-1.5",
        "font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim",
        "transition-colors hover:border-primary/50 hover:text-foreground disabled:cursor-wait",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          pending
            ? "animate-pulse bg-text-dim"
            : live && !failed
              ? "bg-primary"
              : "bg-text-dim"
        )}
      />
      <span>{label}</span>
      <span className="opacity-50 transition-opacity group-hover:opacity-100">↻</span>
    </button>
  );
}
