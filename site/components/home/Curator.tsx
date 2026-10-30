import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { CURATOR } from "@/lib/site";

/**
 * 作者。
 *
 * 一张像、三件正在做的事。像被裁成正方形、压上一条系统栏，
 * 和整站的图版用同一套装裱语言。
 */
export function Curator() {
  return (
    <section id="about" className="section border-t border-line">
      <div className="shell">
        <Reveal>
          <SectionHead
            index="03"
            en="Operator"
            cn="关于"
            note="独立开发者 / AI 工程师"
          />
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4" delay={40}>
            <figure className="portrait-frame relative border border-line p-2">
              <div className="relative overflow-hidden">
                <img
                  src="/logo.jpg"
                  alt="Kurohane Kaoruko"
                  width={600}
                  height={600}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
                <span className="portrait-scan" aria-hidden="true" />
                <span className="absolute left-2 top-2 h-1.5 w-1.5 bg-signal" aria-hidden="true" />
                <span className="absolute bottom-2 right-2 font-mono text-[8px] uppercase tracking-[0.2em] text-fg/70">
                  IMG_0001
                </span>
              </div>
              <figcaption className="mt-2 flex items-center justify-between border-t border-line px-1 pt-2">
                <span className="label-sm">PORTRAIT // 2026</span>
                <span className="label-sm">UTC+8</span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="lg:col-span-8" delay={80}>
            <div className="border-t border-line pt-4">
              <div className="flex items-center justify-between">
                <p className="label">NOW</p>
                <span className="label-sm">03 ACTIVE</span>
              </div>
              <ul className="mt-2">
                {CURATOR.now.map((item, i) => (
                  <li
                    key={item.name}
                    className="grid gap-1 border-b border-line-soft py-4 sm:grid-cols-[26px_200px_minmax(0,1fr)] sm:gap-5"
                  >
                    <span className="num text-[9px] text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-fg">
                      {item.name}
                    </span>
                    <span className="text-[13px] leading-relaxed text-muted">{item.note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/about/" className="btn btn-ghost mt-7">
              关于我
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
