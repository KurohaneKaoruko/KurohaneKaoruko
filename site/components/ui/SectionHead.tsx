import type { ReactNode } from "react";

/**
 * 章节头。
 *
 * 一条横向的系统分隔：[ 01 ] · 中文标题 · 英文副标 ·———— 注解。
 * 全站所有章节都长这样，读者不用重新学习版面。
 */
export function SectionHead({
  index,
  en,
  cn,
  note,
  action,
  className = "",
}: {
  index: string;
  en: string;
  cn: string;
  note?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "section-head flex flex-wrap items-end gap-x-4 gap-y-2 border-b border-line pb-3 " + className
      }
    >
      <span className="num shrink-0 text-[10px] tracking-[0.1em] text-signal">[ {index} ]</span>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="cn-title text-[clamp(1.45rem,2.6vw,2.1rem)] text-fg">{cn}</h2>
        <span className="label hidden sm:inline">{en}</span>
      </div>
      <span className="section-rule mb-2 hidden h-px min-w-8 flex-1 bg-line sm:block" aria-hidden="true" />
      <div className="flex shrink-0 items-center gap-4">
        {note && <p className="label max-w-[34ch] text-right leading-relaxed">{note}</p>}
        {action}
      </div>
    </div>
  );
}
