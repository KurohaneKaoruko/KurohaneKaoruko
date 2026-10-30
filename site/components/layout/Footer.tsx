import Link from "next/link";
import { Clock } from "@/components/layout/Clock";
import { TickRule } from "@/components/ui/Schematic";
import { COLOPHON, NAV_ITEMS, SITE } from "@/lib/site";

/**
 * 页脚：系统信息。
 *
 * 一本技术手册的最后一页会写清楚：怎么联系、版本号、用什么排的版。
 * 这里照这个规矩来 —— 大号邮箱、索引、系统信息，一条底线收尾。
 */
export default function Footer() {
  return (
    <footer className="relative border-t border-line-strong">
      <div className="shell pb-8 pt-[clamp(44px,6vw,80px)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="label flex items-center gap-3">
              <span className="text-signal">//</span> END OF TRANSMISSION
            </p>
            <a
              href={"mailto:" + SITE.email}
              className="group mt-5 inline-block whitespace-nowrap font-sans text-[clamp(1.3rem,3.1vw,2.1rem)] font-medium leading-tight tracking-[-0.03em] text-fg transition-colors hover:text-signal"
            >
              {SITE.email}
              <span className="ml-2 inline-block font-mono text-[0.6em] text-signal transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
            <TickRule className="mt-8 h-2.5 w-40 text-faint" />
          </div>

          <nav className="lg:col-span-2" aria-label="页脚导航">
            <p className="label">INDEX</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className="flex items-baseline gap-2">
                  <span className="num text-[9px] text-faint">{item.no}</span>
                  <Link href={item.href} className="link text-[13px] text-fg-2 hover:text-fg">
                    {item.cn}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="label">LINKS</p>
            <ul className="mt-4 space-y-2.5">
              {[
                ["GitHub", SITE.github],
                ["Repositories", SITE.github + "?tab=repositories"],
                ["Mail", "mailto:" + SITE.email],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="link text-[13px] text-fg-2 hover:text-fg"
                  >
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="label">SYSTEM</p>
            <dl className="mt-4 space-y-3">
              {[
                ["BUILD", SITE.build],
                ["STACK", "Next.js / static"],
                ["TYPE", "Plex Sans / Mono"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="label-sm">{k}</dt>
                  <dd className="mt-0.5 font-mono text-[10.5px] text-fg-2">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-sm">
            © {new Date().getFullYear()} {SITE.name.toUpperCase()} · ALL SYSTEMS NOMINAL
          </p>
          <div className="label-sm flex items-center gap-6">
            <Clock />
            <a href="#top" className="link text-fg-2 hover:text-fg">
              TOP ↑
            </a>
          </div>
        </div>

        <p className="label-sm mt-4 opacity-70">{COLOPHON.typefaces}</p>
      </div>
    </footer>
  );
}
