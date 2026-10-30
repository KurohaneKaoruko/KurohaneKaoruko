"use client";

import { useEffect, useRef } from "react";
import { Portal } from "@/components/ui/Portal";
import { StackGraph } from "@/components/ui/StackGraph";
import { accessionOf, familyOf, type Project } from "@/lib/data";

/**
 * 项目详情：点开索引里的一行，像拉开一个抽屉。
 *
 * 左边是这块项目的系统图，右边是结构化记录 —— 分类、技术栈、星标、
 * 最近一次推送，最后是两个出口：GitHub 与项目主页。
 */
export function SpecimenDialog({
  repo,
  plateNo,
  position,
  onPrev,
  onNext,
  onClose,
}: {
  repo: Project & { pushedAt?: string };
  plateNo?: string;
  position?: string;
  onPrev?: () => void;
  onNext?: () => void;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onPrevRef = useRef(onPrev);
  onPrevRef.current = onPrev;
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === "ArrowLeft" && onPrevRef.current) {
        event.preventDefault();
        onPrevRef.current();
        return;
      }
      if (event.key === "ArrowRight" && onNextRef.current) {
        event.preventDefault();
        onNextRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const card = cardRef.current;
      if (!card) return;
      const focusables = card.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, []);

  const family = familyOf(repo.family);
  const updated = repo.pushedAt
    ? new Date(repo.pushedAt).toISOString().slice(0, 10).replace(/-/g, ".")
    : "—";

  return (
    <Portal>
      <div className="scrim" onClick={onClose} aria-hidden="true" />
      <div className="sheet-dialog" role="dialog" aria-modal="true" aria-labelledby="specimen-title">
        <div className="sheet-card" ref={cardRef}>
          <span className="sheet-scan" aria-hidden="true" />
          <div className="flex items-center justify-between border-b border-line px-5 py-3">
            <span className="label-sm flex items-center gap-2">
              <span className="status-dot" aria-hidden="true" />
              NODE {accessionOf(repo.name)} · {plateNo ? `FIG.${plateNo}` : "RECORD"}
            </span>
            <div className="flex items-center gap-2">
              {position && <span className="label-sm mr-1 tabular-nums">{position}</span>}
              {onPrev && (
                <button
                  type="button"
                  onClick={onPrev}
                  className="flex h-7 w-7 items-center justify-center border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
                  aria-label="上一个项目"
                >
                  <span aria-hidden="true">←</span>
                </button>
              )}
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="flex h-7 w-7 items-center justify-center border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
                  aria-label="下一个项目"
                >
                  <span aria-hidden="true">→</span>
                </button>
              )}
              <button
                ref={closeRef}
                type="button"
                autoFocus
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
                aria-label="关闭"
              >
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M3 3 L13 13 M13 3 L3 13" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            {/* 系统图 */}
            <div className="relative border-b border-line bg-bg p-5 md:border-b-0 md:border-r sm:p-6">
              <div className="schematic-grid flex h-[240px] items-center justify-center border border-line-soft sm:h-[320px]">
                <StackGraph
                  name={repo.name}
                  topics={repo.topics}
                  lang={repo.lang}
                  className="h-full w-full text-fg/70"
                  animate
                />
              </div>
              <div className="mt-3 flex items-end justify-between gap-4 border-t border-line pt-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-[11px] uppercase tracking-[0.1em] text-fg">
                    {repo.name}
                  </p>
                  <p className="label-sm mt-1 truncate">{repo.taxon}</p>
                </div>
                <span className="label-sm shrink-0">{family.code}</span>
              </div>
            </div>

            {/* 记录 */}
            <div className="flex flex-col p-6 sm:p-8">
              <span className="eyebrow">Project detail</span>

              <h2
                id="specimen-title"
                className="display mt-4 text-[clamp(1.9rem,4.2vw,2.9rem)] uppercase text-fg"
              >
                {repo.name}
              </h2>

              <p className="mt-5 text-[14px] leading-[1.9] text-fg-2">
                {repo.desc || "这个项目还没有写说明。"}
              </p>

              {repo.topics.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {repo.topics.map((t) => (
                    <span
                      key={t}
                      className="border border-line px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <dl className="mt-7 border-t border-line">
                {[
                  ["CATEGORY", `${family.code} / ${family.cn}`],
                  ["STACK", repo.lang || "—"],
                  ["STARS", String(repo.stars)],
                  ["UPDATED", updated],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-b border-line-soft py-2.5"
                  >
                    <dt className="label-sm">{k}</dt>
                    <dd className="font-mono text-[11px] text-fg">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
                <a className="btn btn-primary" href={repo.url} target="_blank" rel="noreferrer">
                  GitHub
                  <span className="btn-arrow">↗</span>
                </a>
                {repo.homepage && (
                  <a className="btn btn-ghost" href={repo.homepage} target="_blank" rel="noreferrer">
                    项目主页
                    <span className="btn-arrow">↗</span>
                  </a>
                )}
                <span className="label-sm ml-auto hidden sm:block">← → 切换 · ESC 关闭</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
