import Link from "next/link";
import type { ReactNode } from "react";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { useRepos } from "@/components/ReposProvider";
import { langColor } from "@/lib/theme-data";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Repo } from "@/lib/repos";

/* ==========================================================================
   终端主题的旧版组件。
   --------------------------------------------------------------------------
   这些组件来自 v1 的 components/home 与 components/ui，只服务于终端首页。
   颜色与字体全部走主题令牌，不引用其他主题的任何样式。
   ========================================================================== */

export function BracketCorner({
  position = "top-left",
  className,
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const styles = {
    "top-left": "top-0 left-0 border-t-2 border-l-2",
    "top-right": "top-0 right-0 border-t-2 border-r-2",
    "bottom-left": "bottom-0 left-0 border-b-2 border-l-2",
    "bottom-right": "bottom-0 right-0 border-b-2 border-r-2",
  };

  return (
    <div
      aria-hidden="true"
      className={cn("absolute h-4 w-4 border-primary/50", styles[position], className)}
    />
  );
}

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost" | "danger" | "tech";
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** v1 的矩形描边按钮：切角由调用方的 clip-diagonal-* 类补上。 */
export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
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

  const content = (
    <>
      {children}
      <span className="pointer-events-none absolute inset-0 translate-y-full bg-primary/15 transition-transform duration-300 group-hover:translate-y-0" />
      {variant === "tech" ? (
        <>
          <span className="pointer-events-none absolute left-0 top-0 h-full w-0.5 scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 scale-0 bg-primary transition-transform delay-100 duration-300 group-hover:scale-100" />
        </>
      ) : null}
    </>
  );

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    if (external) {
      return (
        <a
          href={href}
          className={combinedClassName}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  return <button className={combinedClassName}>{content}</button>;
}

/** 带标题栏的技术面板：标题 / 副标 / 两枚装饰点 / 悬停取景框角标。 */
export function TechPanel({
  title,
  subtitle,
  variant = "default",
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  variant?: "default" | "outline" | "ghost";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative",
        variant === "default" && "border border-border/50 bg-card-bg/50 backdrop-blur-sm",
        variant === "outline" && "border border-border bg-transparent",
        variant === "ghost" && "bg-transparent",
        className,
      )}
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

export type SectionRailProps = {
  index: string;
  label: string;
  cnLabel: string;
  meta: string;
  hint?: string;
};

/** 区块侧轴：lg 以上占据左侧 3 栏，移动端整块隐藏。 */
export function SectionRail({ index, label, cnLabel, meta, hint }: SectionRailProps) {
  return (
    <aside aria-hidden="true" className="hidden lg:col-span-3 lg:block">
      <div className="flex flex-col gap-3 border-l border-border pl-5 lg:sticky lg:top-[calc(var(--nav-h)+32px)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
          {index}
        </span>

        <span className="display-title text-3xl leading-none text-foreground">{label}</span>

        <span className="writing-vertical-rl self-start text-sm font-bold tracking-[0.25em] text-text-muted">
          {cnLabel}
        </span>

        <span className="mt-3 h-px w-10 bg-primary/40" />

        <span className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-text-dim">
          {meta}
        </span>

        {hint ? (
          <span className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-text-muted/60">
            {hint}
          </span>
        ) : null}
      </div>
    </aside>
  );
}

function ArrowDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative z-10 h-5 w-5"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}

/** 区块标题：背景大号编号 → 元信息行 → 红块箭头 + 英文主标题 → 中文副题。 */
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
      <div className="pointer-events-none absolute -left-8 -top-12 select-none font-mono text-[120px] font-black leading-none text-foreground/[0.02]">
        {id}
      </div>

      <div className="mb-6 flex items-center gap-2 border-b border-border pb-1.5 font-mono text-[10px] uppercase tracking-widest text-primary/80">
        <span className="rotate-90">▼</span>
        <span className="truncate">{subtitle}</span>
        <span className="hidden text-text-muted/50 md:inline">|</span>
        <span className="hidden truncate text-text-muted md:inline">{id}</span>
        <div className="flex-1" />
      </div>

      <div className="flex items-start gap-4">
        <div className="relative flex-1">
          <div className="mb-1 flex items-center gap-5">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden bg-primary text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-105 md:h-11 md:w-11">
              <div className="pointer-events-none absolute inset-0 translate-x-[calc(100%+0.625rem)] -skew-x-12 transform bg-black/20 transition-transform duration-500 group-hover:translate-x-0" />
              <ArrowDownIcon />
            </div>
            <div className="min-w-0">
              <h2 className="display-title relative z-10 text-4xl leading-none text-foreground md:text-6xl">
                {title}
              </h2>
              <div className="mt-2 h-px w-full bg-gradient-to-r from-primary/50 to-transparent" />
            </div>
          </div>

          <h3 className="ml-[3.75rem] flex items-center gap-4 text-2xl font-black leading-none tracking-wide text-text-muted transition-colors duration-300 group-hover:text-foreground md:text-3xl">
            {cnTitle}
          </h3>
        </div>
      </div>
    </div>
  );
}

function hhmm(ts: number) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** 仓库数据的同步状态，只展示，不提供手动同步。 */
function SyncBadge({ className }: { className?: string }) {
  const { repos, status, syncedAt } = useRepos();

  const label =
    status === "syncing"
      ? "同步中 / SYNCING"
      : status === "live"
        ? `LIVE · ${repos.length} 仓库${syncedAt ? " · " + hhmm(syncedAt) + " 同步" : ""}`
        : "快照 / SNAPSHOT";

  return (
    <span
      className={cn(
        "group inline-flex items-center gap-2 border border-border px-3 py-1.5",
        "font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          status === "syncing"
            ? "animate-pulse bg-text-dim"
            : status === "live"
              ? "bg-primary"
              : "bg-text-dim",
        )}
      />
      <span>{label}</span>
      <span className="opacity-50">↻</span>
    </span>
  );
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
        className,
      )}
    >
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

      <h3
        className={cn(
          "mt-6 min-w-0 break-words font-bold tracking-wide text-foreground transition-colors group-hover:text-primary",
          featured ? "text-4xl sm:text-5xl" : "text-xl",
        )}
      >
        {repo.name}
      </h3>

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

function tailSpan(tailIndex: number, tailCount: number): string {
  const remainder = tailCount % 3;
  if (remainder === 1 && tailIndex === tailCount - 1) return "lg:col-span-12";
  if (remainder === 2 && tailIndex >= tailCount - 2) return "lg:col-span-6";
  return "lg:col-span-4";
}

/** 项目展示网格：第 1 条主推，2、3 条收口，其余按 3 栏流动。 */
export function ProjectGrid({ repos }: { repos: Repo[] }) {
  const equalLayout = repos.length < 4;
  const tailCount = repos.length - 3;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <SyncBadge />
      </div>

      {equalLayout ? (
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
        <div className="mx-2 grid grid-cols-1 gap-px border border-border bg-border md:mx-6 md:grid-cols-2 lg:auto-rows-[minmax(11rem,auto)] lg:grid-cols-12">
          {repos.map((p, i) => (
            <RepoCard
              key={p.name}
              repo={p}
              index={i}
              featured={i === 0}
              className={cn(
                i === repos.length - 1 && repos.length % 2 === 1 && "md:col-span-2",
                i === 0 && "lg:col-span-7 lg:row-span-2",
                i === 1 && "lg:col-span-5",
                i === 2 && "lg:col-span-5",
                i > 2 && tailSpan(i - 3, tailCount),
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** 首页主视觉：左栏标题与动作，右栏前 3 条仓库的实时清单。 */
export function HomeHero({ repos }: { repos: Repo[] }) {
  const topRepos = repos.slice(0, 3);

  return (
    <section className="relative -mt-[var(--nav-h)] flex min-h-screen items-center justify-center overflow-hidden pt-20 lg:min-h-[min(100svh,760px)]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="tech-grid-bg absolute inset-0 opacity-30" />
      </div>

      <div className="container relative z-10 mx-auto overflow-visible px-4 py-4 text-center md:py-6 lg:text-left">
        <div className="fade-in-up flex flex-col items-center lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="flex w-full flex-col items-center lg:col-span-7 lg:items-start">
            <div className="group relative z-40 mb-8 flex justify-center lg:justify-start">
              <BracketCorner
                position="top-left"
                className="-left-3 -top-3 h-6 w-6 border-primary/20 transition-all group-hover:-left-4 group-hover:-top-4 group-hover:border-primary sm:-left-4 sm:-top-4 sm:h-8 sm:w-8 sm:group-hover:-left-6 sm:group-hover:-top-6"
              />
              <BracketCorner
                position="bottom-right"
                className="-bottom-3 -right-3 h-6 w-6 border-primary/20 transition-all group-hover:-bottom-4 group-hover:-right-4 group-hover:border-primary sm:-bottom-4 sm:-right-4 sm:h-8 sm:w-8 sm:group-hover:-bottom-6 sm:group-hover:-right-6"
              />
              <h1 className="display-title px-2 text-[clamp(2.75rem,11vw,7rem)] leading-[0.95] text-foreground lg:text-[clamp(2.5rem,6.5vw,5.5rem)]">
                KUROHANE
                <br />
                KAORUKO
              </h1>
            </div>

            <div className="relative mx-auto mb-10 max-w-2xl md:mb-12 lg:mx-0">
              <p className="mb-2 text-lg font-bold uppercase tracking-[0.2em] text-foreground md:text-xl">
                用技术解决问题
              </p>
              <div className="flex flex-col items-center font-mono text-xs uppercase text-text-dim lg:items-start">
                <div className="flex gap-4">
                  <span>Protocol v{SITE.build}</span>
                  <span>{"//"}</span>
                  <span className="sr-only">Connection Established</span>
                  <ScrambleText text="Connection Established" delay={2000} aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row lg:justify-start">
              <Button
                href="/projects/"
                size="lg"
                variant="primary"
                className="clip-diagonal-tr group min-w-[200px] justify-center gap-3"
              >
                <span>EXPLORE</span>
                <span className="opacity-50 transition-opacity group-hover:opacity-100">→</span>
              </Button>
              <Button
                href={SITE.github}
                size="lg"
                variant="ghost"
                className="clip-diagonal-bl group min-w-[200px] justify-center gap-3 bg-foreground/10 hover:bg-foreground/20"
              >
                <span>GITHUB</span>
                <span className="opacity-50 transition-opacity group-hover:opacity-100">↗</span>
              </Button>
            </div>
          </div>

          <div className="mt-14 w-full max-w-sm lg:col-span-5 lg:mt-0 lg:max-w-none">
            <p className="eyebrow mb-4 text-center lg:text-left">LIVE REPOSITORIES</p>

            <ul className="border-t border-border">
              {topRepos.map((p, i) => (
                <li key={p.name}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-w-0 items-center gap-3 border-b border-border py-3.5 font-mono text-xs"
                  >
                    <span className="shrink-0 text-text-dim">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-foreground transition-colors group-hover:text-primary">
                      {p.name}
                    </span>
                    <span className="shrink-0 text-primary">★ {p.stars}</span>
                    <span className="shrink-0 text-text-dim transition-colors group-hover:text-primary">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim lg:text-left">
              Synced from GitHub
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
