"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";
import { NAV_ITEMS, SITE } from "@/lib/site";

export default function Footer() {
  const { theme } = useTheme();
  const brutalist = theme === "brutalist";

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
