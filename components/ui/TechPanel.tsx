import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BracketCorner } from "./Decorators";

interface TechPanelProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  variant?: "default" | "outline" | "ghost";
  children: ReactNode;
}

/**
 * 带标题栏的技术面板：标题 / 副标 / 两枚装饰点 / 悬停时浮现的取景框角标。
 * 首页的终端会话与关于页的自述块都用它。
 */
export function TechPanel({
  title,
  subtitle,
  variant = "default",
  children,
  className,
  ...props
}: TechPanelProps) {
  return (
    <div
      className={cn(
        "relative group",
        variant === "default" && "bg-card-bg/50 backdrop-blur-sm border border-border/50",
        variant === "outline" && "border border-border bg-transparent",
        variant === "ghost" && "bg-transparent",
        className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className="flex items-center justify-between border-b border-border/30 bg-foreground/5 px-4 py-2">
          <div className="flex items-center gap-2">
            {title && (
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                {title}
              </h3>
            )}
            {subtitle && (
              <span className="ml-2 border-l border-border pl-2 font-mono text-[10px] uppercase text-text-dim">
                {subtitle}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <div className="h-1 w-1 rounded-full bg-primary/50" />
            <div className="h-1 w-1 rounded-full bg-primary/20" />
          </div>
        </div>
      )}

      <div className="relative z-10 p-4">{children}</div>

      <BracketCorner
        position="top-left"
        className="opacity-0 transition-opacity group-hover:opacity-100"
      />
      <BracketCorner
        position="bottom-right"
        className="opacity-0 transition-opacity group-hover:opacity-100"
      />

      <div className="pointer-events-none absolute inset-0 border border-primary/0 transition-colors group-hover:border-primary/30" />
    </div>
  );
}
