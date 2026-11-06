"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Reveal } from "@/components/ui/Reveal";

/**
 * 主题档案页。
 *
 * 这一页本身就是当前主题的一部分：选择器里的缩略卡展示各主题的底色与
 * 强调色，页面其余部分则用当前主题的令牌渲染。切换后不跳页，方便连续比较。
 */
export function ThemesView() {
  const { theme, meta, themes, mounted } = useTheme();

  return (
    <div className="pb-[clamp(56px,8vw,110px)] pt-[clamp(44px,7vw,92px)]">
      <div className="shell">
        <Reveal eager>
          <p className="eyebrow">
            <span className="text-signal">03</span> / THEMES
          </p>
          <h1 className="display mt-6 max-w-4xl text-[clamp(2.2rem,6.4vw,5.2rem)] text-fg">
            一套站点，
            <br />
            <span className="text-signal">{themes.length} 种排版</span>
          </h1>
          <p className="prose-cn mt-7 max-w-2xl">
            主题改变的不只是配色。每个主题都有独立的首页组件树、独立的版面结构与独立的
            CSS 作用域：终端是一台旧机器，瑞士是一张网格海报，卡带是一台机架设备。
            它们互不引用，删掉任何一个都不会影响其余主题。
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-8" delay={60}>
            <div className="flex items-baseline justify-between gap-4 border-b border-line-strong pb-3">
              <p className="label text-fg">SELECT A THEME / 选择主题</p>
              <p className="label-sm">{themes.length} DESIGNS</p>
            </div>
            <ThemeSwitcher variant="grid" className="mt-5" showManageLink={false} />
          </Reveal>

          <Reveal className="lg:col-span-4" delay={120}>
            <aside className="border border-line bg-bg-2/40 p-5">
              <p className="label-sm">CURRENT / 当前</p>
              <p className="mt-3 text-[clamp(1.5rem,3vw,2rem)] font-medium leading-tight tracking-[-0.03em] text-fg">
                {mounted ? meta.label : "档案"}
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.24em] text-signal">
                  {mounted ? meta.name : "ARCHIVE"}
                </span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {mounted ? meta.desc : "当前站点的原始设计，也是默认主题。"}
              </p>

              <dl className="mt-6 space-y-3 border-t border-line pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="label-sm">THEME ID</dt>
                  <dd className="font-mono text-[11px] text-fg-2">{mounted ? theme : "archive"}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="label-sm">HOME</dt>
                  <dd className="font-mono text-[11px] text-fg-2">独立组件树</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="label-sm">SCOPE</dt>
                  <dd className="font-mono text-[11px] text-fg-2">data-theme</dd>
                </div>
              </dl>

              <Link
                href="/"
                className="mt-6 flex items-center justify-between border border-line px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-signal hover:text-signal"
              >
                <span>在首页查看</span>
                <span aria-hidden="true">→</span>
              </Link>
            </aside>
          </Reveal>
        </div>

        <Reveal className="mt-16" delay={80}>
          <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
            {[
              {
                no: "01",
                title: "独立目录",
                body: "每个主题一个文件夹：index.ts 登记元数据，Home.tsx 是完整页面树，theme.css 只作用于自己的 data-theme。",
              },
              {
                no: "02",
                title: "独立版面",
                body: "不是同一套骨架换颜色。首页按主题选择器按需加载，默认档案首页保持服务端渲染。",
              },
              {
                no: "03",
                title: "互不影响",
                body: "新增主题只需建目录并在注册表加一行；删除主题只需删掉这两处，其余主题的代码与样式一行都不用改。",
              },
            ].map((item) => (
              <div key={item.no} className="bg-bg p-5">
                <p className="font-mono text-[10px] tracking-[0.2em] text-signal">{item.no}</p>
                <h2 className="mt-3 text-lg font-medium tracking-[-0.02em] text-fg">{item.title}</h2>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-10" delay={120}>
          <p className="label-sm flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="status-dot" aria-hidden="true" />
            主题偏好保存在本地
            <span className="text-faint">/</span>
            不跟随系统明暗
            <span className="text-faint">/</span>
            随时可以在顶栏切换
          </p>
        </Reveal>
      </div>
    </div>
  );
}
