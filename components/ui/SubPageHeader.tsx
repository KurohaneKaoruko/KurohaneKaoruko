import { cn } from "@/lib/utils";

/**
 * 子页面页头。比 SectionHeader 更克制：
 * 一条装饰线 + 状态点 + 主标题，用于 /projects、/about 这类页面顶部。
 */
export function SubPageHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative select-none", className)}>
      {/* 装饰线：一段实心主色 + 一个方块端点 */}
      <div className="mb-6 flex h-px w-full items-center bg-border">
        <span className="h-[2px] w-16 bg-primary" />
        <span className="h-2 w-2 bg-primary" />
      </div>

      <div className="flex items-center gap-3">
        <span className="h-2 w-2 animate-pulse bg-primary" />
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary">
          {eyebrow}
        </span>
      </div>

      <h1 className="display-title relative mt-4 inline-block text-4xl text-foreground sm:text-5xl">
        {title}
        <span
          aria-hidden="true"
          className="absolute -right-3 -top-2 h-2 w-2 border-r border-t border-primary/60"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-2 -left-3 h-2 w-2 border-b border-l border-primary/60"
        />
      </h1>

      {description ? (
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
