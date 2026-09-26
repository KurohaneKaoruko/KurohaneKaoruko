import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 区块标题。整站所有一级区块共用同一套信息层级：
 * 背景大号编号 → 元信息行 → 红色箭头方块 + 英文大写主标题 → 中文副题。
 */
export function SectionHeader({
  id,
  title,
  subtitle,
  cnTitle,
  className,
}: {
  id: string;
  title: string;
  subtitle: string;
  cnTitle: string;
  className?: string;
}) {
  return (
    <div className={cn("group relative mb-16 select-none md:mb-20", className)}>
      {/* 背景大号编号 */}
      <div className="pointer-events-none absolute -left-8 -top-12 select-none font-mono text-[120px] font-black leading-none text-foreground/[0.02]">
        {id}
      </div>

      {/* 顶部元信息行 */}
      <div className="mb-6 flex items-center gap-2 border-b border-border pb-1.5 font-mono text-[10px] uppercase tracking-widest text-primary/80">
        <span className="rotate-90">▼</span>
        <span className="truncate">{subtitle}</span>
        <span className="hidden text-text-muted/50 md:inline">|</span>
        <span className="hidden truncate text-text-muted md:inline">{id}</span>
        <div className="flex-1" />
      </div>

      <div className="flex items-start gap-4">
        {/* 主标题块 */}
        <div className="relative flex-1">
          {/* 英文标题行与箭头方块 */}
          <div className="mb-1 flex items-center gap-5">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden bg-primary text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-105 md:h-11 md:w-11">
              <div className="pointer-events-none absolute inset-0 translate-x-[calc(100%+0.625rem)] -skew-x-12 transform bg-black/20 transition-transform duration-500 group-hover:translate-x-0" />
              <ArrowDown className="relative z-10 h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="display-title relative z-10 text-4xl leading-none text-foreground md:text-6xl">
                {title}
              </h2>
              <div className="mt-2 h-px w-full bg-gradient-to-r from-primary/50 to-transparent" />
            </div>
          </div>

          {/* 中文标题（更小更淡） */}
          <h3 className="ml-[3.75rem] flex items-center gap-4 text-2xl font-black leading-none tracking-wide text-text-muted transition-colors duration-300 group-hover:text-foreground md:text-3xl">
            {cnTitle}
          </h3>
        </div>
      </div>
    </div>
  );
}
