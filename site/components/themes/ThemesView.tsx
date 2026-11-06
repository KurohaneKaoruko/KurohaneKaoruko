"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Reveal } from "@/components/ui/Reveal";

/**
 * 主题档案页。
 *
 * 这一页只做一件事：把各套首页摆出来。没有说明段、没有架构介绍，
 * 标题之后直接进入可点击的主题陈列；每张卡片本身就是该主题的色与字。
 */
export function ThemesView() {
  const { meta, mounted } = useTheme();

  return (
    <div className="pb-[clamp(56px,8vw,110px)] pt-[clamp(40px,6vw,84px)]">
      <div className="shell">
        <Reveal eager>
          <div className="flex flex-wrap items-end justify-between gap-8 border-b border-line-strong pb-6">
            <div>
              <p className="eyebrow">
                <span className="text-signal">03</span> / THEMES
              </p>
              <h1 className="sr-only">主题</h1>
            </div>

            <p className="label flex items-center gap-3 pb-1 text-fg">
              <span className="status-dot" aria-hidden="true" />
              点击切换 / 本地保存
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-8" delay={60}>
          <ThemeSwitcher variant="grid" showManageLink={false} />
        </Reveal>

        <Reveal className="mt-10" delay={100}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
            <p className="label-sm">
              当前 / CURRENT
              <span className="ml-3 text-signal">{mounted ? meta.label : "档案"}</span>
              <span className="ml-2 text-faint">{mounted ? meta.name : "ARCHIVE"}</span>
            </p>
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg transition-colors hover:text-signal"
            >
              在首页查看 →
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
