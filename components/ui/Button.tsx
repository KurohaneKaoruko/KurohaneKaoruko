import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger" | "tech";
  size?: "sm" | "md" | "lg";
  href?: string;
}

/**
 * 全站按钮。所有颜色走主题令牌，因此同一个按钮在终端主题与粗野主题下
 * 自动呈现各自的气质（前者带辉光，后者带偏移硬阴影）。
 *
 * 造型一律是矩形描边块，不做斜切 —— 需要切角的地方直接在 className 上写
 * clip-diagonal-* 类。
 */
export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "group relative inline-flex items-center justify-center overflow-hidden border font-mono font-medium uppercase tracking-[0.15em] transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "border-transparent bg-foreground text-background hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_22px_-4px_var(--primary)]",
    outline:
      "border-border bg-transparent text-foreground hover:border-primary hover:text-primary",
    ghost: "border-transparent bg-transparent text-foreground hover:bg-foreground/5",
    danger: "border-primary bg-primary text-primary-foreground hover:bg-primary/85",
    tech: "border-border bg-card-bg text-text-muted hover:border-primary hover:bg-primary/10 hover:text-primary",
  };

  const sizes = {
    sm: "h-8 px-4 text-[11px]",
    md: "h-10 px-6 text-xs",
    lg: "h-12 px-8 text-sm",
  };

  const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

  const sweep = (
    <span className="pointer-events-none absolute inset-0 translate-y-full bg-primary/15 transition-transform duration-300 group-hover:translate-y-0" />
  );

  const corners =
    variant === "tech" ? (
      <>
        <span className="pointer-events-none absolute left-0 top-0 h-full w-0.5 scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 scale-0 bg-primary transition-transform delay-100 duration-300 group-hover:scale-100" />
      </>
    ) : null;

  if (href) {
    const external = href.startsWith("http");
    return (
      <Link
        href={href}
        className={combinedClassName}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
        {sweep}
        {corners}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
      {sweep}
      {corners}
    </button>
  );
}
