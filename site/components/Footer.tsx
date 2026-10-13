"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";
import { NAV_ITEMS, SITE } from "@/lib/site";

export default function Footer() {
  const { theme } = useTheme();
  const brutalist = theme === "brutalist";
  const glacial = theme === "glacial";
  const maximal = theme === "maximal";
  const glitch = theme === "glitch";
  const minimal = theme === "minimal";

  if (maximal) {
    return (
      <footer className="border-t-[3px] border-foreground">
        <div className="pattern-diag h-3 border-b-2 border-foreground text-primary" />
        <div className="pattern-checker h-2 border-b-2 border-foreground text-accent/50" />
        <div className="container mx-auto px-6 py-12">
          <div className="frame-double relative border-[3px] border-foreground bg-card-bg px-6 py-10 text-center shadow-[8px_8px_0_var(--foreground)]">
            <div className="pattern-checker absolute inset-0 text-primary/15" />
            <span className="absolute -left-3 -top-4 -rotate-6 border-2 border-foreground bg-[var(--max-sun)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground shadow-[3px_3px_0_var(--foreground)]">
              The End
            </span>
            <p className="relative font-mono text-[10px] uppercase tracking-[0.4em] text-text-dim">
              ❖ End of Page ❖
            </p>
            <p className="relative mt-4 text-2xl font-black uppercase tracking-[-0.03em] text-foreground sm:text-4xl">
              <span className="marker-hl">{SITE.tagline}</span>
            </p>
            <div className="relative mt-8 flex flex-col items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
              <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
                {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="border-b-2 border-transparent pb-0.5 transition-colors hover:border-primary hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="border-b-2 border-transparent pb-0.5 transition-colors hover:border-primary hover:text-primary"
                >
                  GitHub ↗
                </a>
              </nav>
              <p className="text-text-dim">
                © {new Date().getFullYear()} {SITE.name}
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (glitch) {
    return (
      <footer className="relative overflow-hidden border-t border-border bg-card-bg">
        <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
        <div className="container relative mx-auto px-6 py-10">
          <div className="corrupt-bar mb-8 h-1.5 w-full" />
          <div className="flex flex-wrap items-center justify-between gap-5">
            <p className="rgb-split font-mono text-[11px] uppercase tracking-[0.3em] text-foreground">
              ▮ {SITE.tagline}
            </p>
            <nav className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
              {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                GitHub ↗
              </a>
            </nav>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
              © {new Date().getFullYear()} · <span className="text-secondary">{SITE.name}</span>
            </p>
          </div>
        </div>
      </footer>
    );
  }

  if (theme === "cyberpunk") {
    return (
      <footer className="relative overflow-hidden border-t border-border bg-card-bg">
        <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
        <div className="container relative mx-auto flex flex-wrap items-center justify-between gap-5 px-6 py-10">
          <p className="neon-text font-mono text-[11px] uppercase tracking-[0.3em]">
            ▮ {SITE.tagline}
          </p>
          <nav className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
            {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="neon-text-m transition-opacity hover:opacity-80"
            >
              GitHub ↗
            </a>
          </nav>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
            © {new Date().getFullYear()} · {SITE.name}
          </p>
        </div>
      </footer>
    );
  }

  if (theme === "vaporwave") {
    return (
      <footer className="border-t border-border">
        <div className="pointer-events-none relative h-16 overflow-hidden">
          <div className="vapor-floor absolute inset-x-[-30%] top-0 h-[220%]" />
        </div>
        <div className="container mx-auto px-6 pb-12 text-center">
          <p className="display-title text-xl">
            <span className="chrome-text">{SITE.tagline}</span>
          </p>
          <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
            {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-primary"
            >
              GitHub ↗
            </a>
          </nav>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
            © {new Date().getFullYear()} · {SITE.name}
          </p>
        </div>
      </footer>
    );
  }

  if (theme === "y2k") {
    return (
      <footer className="container mx-auto max-w-3xl px-6 pb-10">
        <div className="k2-panel flex flex-wrap items-center justify-between gap-x-8 gap-y-3 rounded-full px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
          <p>© {new Date().getFullYear()} {SITE.name}</p>
          <nav className="flex flex-wrap items-center gap-5">
            {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-primary"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
      </footer>
    );
  }

  if (theme === "cassette") {
    return (
      <footer className="border-t border-border">
        <div className="container mx-auto max-w-4xl px-6 py-8">
          <div className="rack-panel flex flex-wrap items-center justify-between gap-x-8 gap-y-3 rounded-md px-5 py-3.5">
            <p className="plate-label text-[10px]">© {new Date().getFullYear()} · {SITE.name}</p>
            <nav className="flex flex-wrap items-center gap-5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
              {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => (
                <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              ))}
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                GitHub ↗
              </a>
            </nav>
            <p className="plate-label text-[10px]">{SITE.tagline}</p>
          </div>
        </div>
      </footer>
    );
  }

  if (theme === "swiss") {
    return (
      <footer className="bg-foreground text-background">
        <div className="container mx-auto grid gap-8 px-6 py-12 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="display-title text-xl">
              <span className="text-primary">■</span> {SITE.tagline}
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">
              © {new Date().getFullYear()} · {SITE.name} · Set in Inter, aligned to a grid.
            </p>
          </div>
          <nav className="flex flex-wrap items-start gap-x-7 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em]">
            {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => (
              <Link key={item.href} href={item.href} className="opacity-80 transition-opacity hover:opacity-100">
                {item.label}
              </Link>
            ))}
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
      </footer>
    );
  }

  if (minimal) {
    return (
      <footer className="border-t border-border">
        <div className="mx-auto max-w-[42rem] px-6 py-16">
          <p className="text-xl font-light tracking-tight text-foreground">{SITE.tagline}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
            <p>© {new Date().getFullYear()} {SITE.name}</p>
            <nav className="flex items-center gap-6">
              {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                GitHub ↗
              </a>
            </nav>
          </div>
        </div>
      </footer>
    );
  }

  if (glacial) {
    return (
      <footer className="border-t border-border">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">
              <span className="text-primary">▮</span> {SITE.tagline}
            </p>
            <nav className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
              {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                GitHub ↗
              </a>
            </nav>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-dim">
              © {new Date().getFullYear()} · {SITE.name}
            </p>
          </div>
        </div>
      </footer>
    );
  }

  if (brutalist) {
    return (
      <footer className="border-t-4 border-foreground">
        <div className="container mx-auto px-6 py-14">
          <p className="text-3xl font-black uppercase tracking-[-0.03em] sm:text-5xl">
            {SITE.tagline}
          </p>

          <div className="mt-12 flex flex-col gap-4 border-t-2 border-foreground/20 pt-6 font-mono text-[11px] uppercase tracking-[0.25em] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {SITE.name}
            </p>
            <nav className="flex flex-wrap items-center gap-x-7 gap-y-2">
              {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              ))}
              <a href={SITE.github} target="_blank" rel="noreferrer" className="hover:text-primary">
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative z-10 border-t border-border bg-background/60">
      <div className="container mx-auto px-6 py-12">
        <p className="text-center font-mono text-xs tracking-[0.25em] text-text-dim">
          <span className="text-primary">$</span> echo{" "}
          <span className="text-foreground">{SITE.tagline}</span>
        </p>

        <div className="mt-8 flex flex-col items-center justify-between gap-5 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}
          </p>

          <nav className="flex items-center gap-5" aria-label="页脚导航">
            {NAV_ITEMS.filter((i) => i.href !== "/").map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-primary"
            >
              GitHub
            </a>
          </nav>

          <p className="text-text-dim">Powered by GitHub Pages</p>
        </div>
      </div>
    </footer>
  );
}
