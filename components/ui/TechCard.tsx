import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TechCardProps extends ComponentProps<"div"> {
  children: ReactNode;
  active?: boolean;
  hoverEffect?: boolean;
  /** 兼容保留：倾斜交给 TiltCard，这里不做实现（避免泄漏到 DOM） */
  tiltEffect?: boolean;
  shape?: "rect" | "chamfer";
  variant?: "solid" | "outline" | "ghost";
}

/**
 * 技术卡片 —— 纯 CSS 悬停效果（边框、角标过渡），不依赖 framer-motion，
 * 可作为服务端组件渲染。
 *
 * 形状与阴影交给主题：终端主题是直角 + 取景框角标，
 * 粗野主题是直角 + 偏移硬阴影（由 .surface 的 --hard-shadow 提供）。
 */
export function TechCard({
  children,
  className,
  active = false,
  hoverEffect = true,
  tiltEffect: _tiltEffect = false,
  shape = "rect",
  variant = "solid",
  ...props
}: TechCardProps) {
  const variantClasses = {
    solid: "bg-card-bg border border-border",
    outline: "bg-transparent border border-border hover:bg-foreground/5",
    ghost: "bg-transparent border-transparent hover:bg-foreground/5",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden p-6 group",
        variantClasses[variant],
        shape === "chamfer" && "clip-tech-card",
        hoverEffect && "transition-colors hover:border-primary/50",
        active && "border-primary",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children as ReactNode}</div>

      {/* 角标——左上 */}
      <div
        className={cn(
          "absolute left-0 top-0 z-20 h-2 w-2 border-l-2 border-t-2 border-transparent transition-all duration-300",
          (hoverEffect || active) && "group-hover:border-primary",
          active && "border-primary"
        )}
      />
      {/* 角标——右下 */}
      <div
        className={cn(
          "absolute bottom-0 right-0 z-20 h-2 w-2 border-b-2 border-r-2 border-transparent transition-all duration-300",
          (hoverEffect || active) && "group-hover:border-primary",
          active && "border-primary"
        )}
      />
    </div>
  );
}
