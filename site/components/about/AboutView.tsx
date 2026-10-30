import Link from "next/link";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { CURATOR, SITE } from "@/lib/site";
import { projects } from "@/lib/data";

/**
 * 关于。
 *
 * 一页纸的档案：左边一张灰度像，右边三段自述；再往下是工作方式、
 * 工具清单和通信地址。没有时间线 —— 项目本身的提交记录比编年史诚实。
 */
const METHOD = [
  {
    no: "01",
    cn: "本地优先",
    en: "Local-first",
    body: "能放在本地跑的，就不要经过服务器。Lilium 的图库、Lycoris 的钱包、Iris-I.C.E. 的稿子，都留在自己的硬盘上；联网只是可选功能。",
  },
  {
    no: "02",
    cn: "契约先行",
    en: "Contract-first",
    body: "多智能体协作的难点不在模型，而在接口。先把职责、输入输出写成文档，再写调度；文档是唯一事实源，代码跟着文档改。",
  },
  {
    no: "03",
    cn: "一套核心，多种形态",
    en: "One core, many shells",
    body: "Rust 写引擎，前端只负责呈现。同一套核心可以长出 GUI、TUI 和命令行——RoseZIP 与 Convallaria 都是这么拆的。",
  },
];

export function AboutView() {
  const langs = new Set(projects.map((p) => p.lang).filter(Boolean)).size;

  return (
    <article>
      <header className="shell">
        <div className="flex items-center justify-between border-b border-line py-3">
          <span className="eyebrow">03 — Operator</span>
          <span className="label-sm">{CURATOR.base}</span>
        </div>

        <div className="grid gap-8 pb-10 pt-10 lg:grid-cols-12 lg:pb-14">
          <div className="lg:col-span-8">
            <p className="label hero-rise">
              <span className="mr-2 text-signal">//</span> PROFILE
            </p>
            <h1
              className="display hero-rise mt-4 text-[clamp(2.6rem,6.4vw,5rem)] uppercase text-fg"
              style={{ "--d": "80ms" } as React.CSSProperties}
            >
              Kurohane
              <br />
              Kaoruko<span className="text-signal">.</span>
            </h1>
          </div>

          <div className="flex flex-col justify-end gap-1.5 lg:col-span-4 lg:items-end">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg">{CURATOR.role}</p>
            <p className="label-sm">
              {projects.length} PROJECTS · {langs} STACKS
            </p>
            <p className="label-sm">STATUS: ONLINE</p>
          </div>
        </div>
      </header>

      {/* 自述 */}
      <section className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-4" delay={40}>
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+28px)]">
              <figure className="portrait-frame relative border border-line p-2">
                <div className="relative overflow-hidden">
                  <img
                    src="/logo.jpg"
                    alt="Kurohane Kaoruko"
                    width={600}
                    height={600}
                    className="aspect-square w-full object-cover"
                  />
                  <span className="portrait-scan" aria-hidden="true" />
                  <span className="absolute left-2 top-2 h-1.5 w-1.5 bg-signal" aria-hidden="true" />
                </div>
                <figcaption className="mt-2 flex items-center justify-between border-t border-line px-1 pt-2">
                  <span className="label-sm">PORTRAIT // 2026</span>
                  <span className="label-sm">IMG_0001</span>
                </figcaption>
              </figure>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost !px-3.5 !py-2 !text-[9.5px]"
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={"mailto:" + SITE.email}
                  className="link font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg-2"
                >
                  SEND MAIL
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-8" delay={90}>
            <div className="border-t border-line pt-5">
              <div className="flex items-center justify-between">
                <p className="label">NOW</p>
                <span className="label-sm">2026</span>
              </div>
              <ul className="mt-3">
                {CURATOR.now.map((item, i) => (
                  <li
                    key={item.name}
                    className="grid gap-1 border-b border-line-soft py-4 sm:grid-cols-[26px_190px_minmax(0,1fr)] sm:gap-5"
                  >
                    <span className="num text-[9px] text-signal">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-fg">
                      {item.name}
                    </span>
                    <span className="text-[13px] leading-relaxed text-muted">{item.note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-8 border-t border-line">
              {[
                ["ROLE", "Independent dev."],
                ["BASE", "China / UTC+8"],
                ["MAIL", SITE.email],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-4 border-b border-line-soft py-2.5"
                >
                  <dt className="label-sm">{k}</dt>
                  <dd className="truncate font-mono text-[10px] text-fg-2">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* 工作方式 */}
      <section className="shell section">
        <Reveal>
          <SectionHead index="01" en="Method" cn="工作方式" note="03 PRINCIPLES" />
        </Reveal>

        <div className="mt-9 grid gap-9 md:grid-cols-3 md:gap-8">
          {METHOD.map((item, i) => (
            <Reveal key={item.no} delay={i * 60}>
              <div className="flex h-full flex-col border-t border-line-strong pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="mono-display text-[26px] text-signal">{item.no}</span>
                  <span className="label-sm">{item.en}</span>
                </div>
                <h3 className="cn-title mt-3 text-[17px] text-fg">{item.cn}</h3>
                <p className="mt-3 text-[13px] leading-[1.85] text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 工具 */}
      <section className="shell">
        <Reveal>
          <SectionHead index="02" en="Toolchain" cn="工具" note="DAILY USE, NOT A CHECKLIST" />
        </Reveal>

        <div className="mt-1">
          {CURATOR.toolchain.map((group, i) => (
            <Reveal key={group.title} delay={i * 40}>
              <div className="grid gap-2 border-b border-line-soft py-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-8">
                <div className="flex items-baseline gap-3">
                  <span className="label-sm">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-[13px] text-fg">{group.title}</p>
                    <p className="label-sm mt-0.5">{group.en}</p>
                  </div>
                </div>
                <p className="font-mono text-[11.5px] leading-[1.9] text-fg-2">
                  {group.items.map((item, k) => (
                    <span key={item}>
                      {k > 0 && <span className="mx-2 text-faint">/</span>}
                      {item}
                    </span>
                  ))}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 通信 */}
      <section className="shell mt-[clamp(56px,8vw,100px)]">
        <Reveal>
          <div className="border-t border-line-strong pt-10">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="label">
                  <span className="mr-2 text-signal">//</span> CONTACT
                </p>
                <a
                  href={"mailto:" + SITE.email}
                  className="mt-4 inline-block whitespace-nowrap font-sans text-[clamp(1.5rem,4.2vw,2.9rem)] font-medium leading-tight tracking-[-0.035em] text-fg transition-colors hover:text-signal"
                >
                  {SITE.email}
                </a>
              </div>

              <div className="flex items-end justify-start lg:col-span-4 lg:justify-end">
                <div className="text-right">
                  <p className="label-sm">SIGNAL</p>
                  <p className="mt-2 font-mono text-[13px] uppercase tracking-[0.1em] text-fg">
                    K.H.KAORUKO
                  </p>
                  <p className="label-sm mt-1">BUILD {SITE.build}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a className="btn" href={SITE.github} target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <Link className="btn btn-ghost" href="/projects/">
                查看全部项目
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
