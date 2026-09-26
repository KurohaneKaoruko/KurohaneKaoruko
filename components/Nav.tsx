"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Logo } from "@/components/ui/Logo";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  en: string;
  href: string;
  /** 首页上的锚点分段 id；在首页时改为平滑滚动 */
  sectionId?: string;
};

const NAV_LINKS: NavLink[] = [
  { label: "首页", en: "HOME", href: "/" },
  { label: "项目", en: "PROJECTS", href: "/projects" },
  { label: "关于", en: "ABOUT", href: "/about" },
];

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export default function Navigation() {
  const { theme } = useTheme();
  const brutalist = theme === "brutalist";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // passive + rAF 合帧：滚动风暴中一帧至多一次 setState
    let raf = 0;
    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setIsScrolled(window.scrollY > 20);
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSectionLinkClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (pathname !== "/") return;
    const element = document.getElementById(sectionId);
    if (!element) return;
    event.preventDefault();
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "/#" + sectionId);
  };

  const handleHomeLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    event.preventDefault();
    window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 粗野主题：粗底线 + 大字标 + 下划线链接，与终端主题的矮栏完全不同 */}
      {brutalist && (
        <header className="fixed inset-x-0 top-0 z-50 flex h-[var(--nav-h)] items-center border-b-2 border-foreground bg-background">
          <nav className="container mx-auto flex w-full items-center justify-between gap-6 px-4 md:px-6">
            <Link href="/" onClick={handleHomeLinkClick} className="flex items-center gap-3">
              <Logo className="h-9 w-9" />
              <span className="text-lg font-black uppercase tracking-[-0.03em] sm:text-xl">
                {SITE.name}
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <nav className="hidden items-center gap-7 sm:flex">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) =>
                      link.sectionId
                        ? handleSectionLinkClick(e, link.sectionId)
                        : handleHomeLinkClick(e)
                    }
                    className={cn(
                      "border-b-2 pb-0.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors",
                      (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                        ? "border-primary text-primary"
                        : "border-transparent text-foreground hover:border-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <ThemeSwitcher variant="dropdown" />
              <button
                type="button"
                className="p-1.5 sm:hidden"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </header>
      )}

      {!brutalist && (
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 border-b py-3 transition-all duration-300",
          isScrolled
            ? "border-border bg-background/90 backdrop-blur-md"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col">
            <div className="flex h-10 items-center justify-between">
              {/* 标识 */}
              <Link href="/" onClick={handleHomeLinkClick} className="flex items-center gap-2">
                <Logo className="h-8 w-8" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold leading-none tracking-widest text-foreground">
                    {SITE.short}
                  </span>
                  <span className="font-mono text-[10px] leading-none tracking-[0.2em] text-text-muted">
                    PORTFOLIO
                  </span>
                </div>
              </Link>

              {/* 主导航（居中） */}
              <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
                {NAV_LINKS.map((link) => {
                  const current =
                    link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) =>
                        link.sectionId
                          ? handleSectionLinkClick(e, link.sectionId)
                          : handleHomeLinkClick(e)
                      }
                      className={cn(
                        "group relative py-1 text-xs font-medium tracking-widest transition-colors",
                        current ? "text-primary" : "text-text-muted hover:text-primary"
                      )}
                    >
                      <span className="flex flex-col items-center">
                        <span className="text-sm font-bold">{link.label}</span>
                        <span className="font-mono text-[8px] opacity-50 transition-opacity group-hover:opacity-100">
                          {link.en}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "absolute bottom-0 left-0 h-[2px] w-full origin-left bg-primary transition-transform duration-300",
                          current ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        )}
                      />
                      <span className="absolute -left-2 top-1/2 -translate-y-1/2 font-mono text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        [
                      </span>
                      <span className="absolute -right-2 top-1/2 -translate-y-1/2 font-mono text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        ]
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* 右侧动作区 */}
              <div className="flex items-center gap-3">
                <ThemeSwitcher variant="dropdown" />
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="hidden p-1.5 text-text-muted transition-colors hover:text-primary sm:block"
                >
                  <GithubMark className="h-5 w-5" />
                </a>
                <button
                  type="button"
                  className="p-2 text-foreground transition-colors hover:text-primary md:hidden"
                  onClick={() => setIsMobileMenuOpen((v) => !v)}
                  aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      )}

      {/* 移动端抽屉 */}
      <div
        className={cn(
          "fixed inset-0 z-40 overflow-y-auto bg-background/95 px-6 pb-10 pt-24 backdrop-blur-xl transition-opacity duration-300 md:hidden",
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <nav className="flex flex-col">
          {NAV_LINKS.map((link, i) => {
            const current =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "group flex items-baseline justify-between border-b border-border py-5 transition-colors",
                  current ? "text-primary" : "text-foreground hover:text-primary"
                )}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-text-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-2xl font-bold tracking-wide">{link.label}</span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-text-dim">
                    {link.en}
                  </span>
                </span>
                <span className="font-mono text-sm text-text-dim opacity-0 transition-opacity group-hover:text-primary group-hover:opacity-100">
                  &gt;&gt;
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <p className="eyebrow mb-3">站点主题</p>
          <ThemeSwitcher variant="grid" />
        </div>

        <a
          href={SITE.github}
          target="_blank"
          rel="noreferrer"
          className="mt-8 block font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim"
        >
          github.com/{SITE.handle} ↗
        </a>
      </div>
    </>
  );
}
