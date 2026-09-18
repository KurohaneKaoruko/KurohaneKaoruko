import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger" | "tech";
  size?: "sm" | "md" | "lg";
  href?: string;
  shape?: "rect" | "chamfer";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  shape = "rect",
  href,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 uppercase tracking-wider focus:outline-none disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group";

  const variants = {
    primary: "bg-foreground text-background hover:bg-primary hover:text-white border border-transparent",
    outline: "bg-transparent border border-border text-foreground hover:border-primary hover:text-primary",
    ghost: "bg-transparent text-foreground hover:bg-foreground/5",
    danger: "bg-primary text-white hover:bg-red-600 border border-primary",
    tech: "bg-card-bg text-text-muted border border-border hover:border-primary hover:text-primary hover:bg-primary/10 relative",
  };

  const sizes = {
    sm: "h-8 px-4 text-xs",
    md: "h-10 px-6 text-sm",
    lg: "h-12 px-8 text-base",
  };

  const shapes = {
    rect: "",
    chamfer: "clip-diagonal-br",
  };

  const combinedClassName = cn(baseStyles, variants[variant], sizes[size], shapes[shape], className);

  const decoration =
    (variant === "primary" || variant === "outline" || variant === "danger") && (
      <span className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
    );

  const techDecoration =
    variant === "tech" && (
      <>
        <span className="absolute left-0 top-0 h-full w-1 scale-y-0 bg-primary/50 transition-transform duration-300 group-hover:scale-y-100" />
        <span className="absolute bottom-0 right-0 h-2 w-2 scale-0 bg-primary transition-transform delay-100 duration-300 group-hover:scale-100" />
      </>
    );

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
        {decoration}
        {techDecoration}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
      {decoration}
      {techDecoration}
    </button>
  );
}
