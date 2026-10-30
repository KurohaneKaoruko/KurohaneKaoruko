"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCollectionStats, useRepos } from "@/components/ReposProvider";
import { Tilt } from "@/components/fx/Tilt";
import { BaseTime } from "@/components/layout/Clock";
import { ArchivePanel } from "@/components/home/ArchivePanel";
import { Counter } from "@/components/ui/Counter";
import { FAMILIES } from "@/lib/data";
import { CURATOR, SITE } from "@/lib/site";

/** 焦点词条：与 CURATOR.toolchain 的智能体条目同源 */
const FOCUS_ITEMS = (CURATOR.toolchain.find((t) => t.en === "Agents")?.items ?? []).map((w) =>
  w.toUpperCase(),
);

/** 语言行：取工具链里的前四种 */
const LANG_ITEMS = (CURATOR.toolchain.find((t) => t.en === "Languages")?.items ?? []).slice(0, 4);

/** 解码时随机翻出的字符 */
const GLYPHS = "ABCDEFGHKMNPRSTUVXYZ023456789";

/**
 * 焦点轮播。
 *
 * 每 3.4s 换一个词条：换词时字符从左到右逐个落定，未落定的位置翻乱码。
 * 首帧渲染完整词，不闪乱码；减动效偏好下直接整词替换。
 */
function useScramble(words: string[], hold = 3400) {
  const [state, setState] = useState({ text: words[0] ?? "", index: 0 });
  const booted = useRef(false);

  /* 到点换词 */
  useEffect(() => {
    if (words.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setState((v) => ({ ...v, index: (v.index + 1) % words.length }));
    }, hold);
    return () => window.clearInterval(timer);
  }, [hold, words]);

  /* 换词时解码 */
  useEffect(() => {
    if (words.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState({ text: words[state.index], index: state.index });
      return;
    }
    if (!booted.current) {
      booted.current = true;
      return;
    }
    const target = words[state.index];
    let frame = 0;
    const total = Math.max(10, Math.round(target.length * 0.85));
    let raf = 0;
    const tick = () => {
      frame += 1;
      const reveal = Math.floor((frame / total) * target.length);
      let next = "";
      for (let c = 0; c < target.length; c += 1) {
        const ch = target[c];
        next += ch === " " || c < reveal ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setState({ text: next, index: state.index });
      if (frame < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state.index, words]);

  return state;
}

/**
 * 首屏。
 *
 * 一条状态栏，一份操作员档案，右边一块系统图。档案卡取代了原先的
 * 大字标语：一句主张、四行规格（焦点 / 语言 / 坐标 / 产出），焦点一行
 * 会自己换词。数字来自仓库数据：服务端渲染 CI 每日刷新的真实快照，
 * 挂载后再与 GitHub 实时值合并。
 */
export function Hero() {
  const { repos } = useRepos();
  const stats = useCollectionStats();
  const focus = useScramble(FOCUS_ITEMS);
  const groups = FAMILIES.map((f) => ({
    code: f.code,
    count: repos.filter((r) => r.family === f.id).length,
  }))
    .filter((g) => g.count > 0)
    .slice(0, 5);

  return (
    <section id="hero" className="relative overflow-hidden border-b border-line">
      <div className="shell">
        {/* 状态栏 */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line py-3">
          <span className="label flex items-center gap-2.5">
            <span className="status-dot" aria-hidden="true" />
            SYSTEM ONLINE
          </span>
          <div className="label-sm flex items-center gap-5">
            <span>
              NODES{" "}
              <span className="text-fg">
                <Counter value={stats.total} pad={3} />
              </span>
            </span>
            <span className="hidden sm:inline">
              STARS{" "}
              <span className="text-fg">
                <Counter value={stats.stars} />
              </span>
            </span>
            <span>BUILD {SITE.build}</span>
          </div>
        </div>

        <div className="grid items-center gap-12 pb-12 pt-12 lg:grid-cols-12 lg:gap-0 lg:pb-16 lg:pt-16">
          {/* 操作员档案 */}
          <div className="lg:col-span-7 lg:pr-10">
            <p className="label hero-rise" style={{ "--d": "40ms" } as React.CSSProperties}>
              <span className="mr-2 text-signal">//</span>
              Operator file · K.K.
              <span className="ml-3 hidden text-faint md:inline">EST. {SITE.build}</span>
            </p>

            <h1 className="sr-only">
              {SITE.name} — {SITE.archive}
            </h1>

            <dl className="manifest mt-8">
              <span className="hero-scan" aria-hidden="true" />
              <div className="manifest-row hero-rise" style={{ "--d": "140ms" } as React.CSSProperties}>
                <dt className="manifest-key">
                  <span className="manifest-idx">01</span> Focus
                </dt>
                <dd className="manifest-val manifest-lead">
                  <span aria-hidden="true">{focus.text}</span>
                  <span className="sr-only">{FOCUS_ITEMS[focus.index]}</span>
                  <span className="cursor-blink ml-2 align-baseline" aria-hidden="true" />
                </dd>
              </div>
              <div className="manifest-row hero-rise" style={{ "--d": "190ms" } as React.CSSProperties}>
                <dt className="manifest-key">
                  <span className="manifest-idx">02</span> Stack
                </dt>
                <dd className="manifest-val">{LANG_ITEMS.join(" · ").toUpperCase()}</dd>
              </div>
              <div className="manifest-row hero-rise" style={{ "--d": "240ms" } as React.CSSProperties}>
                <dt className="manifest-key">
                  <span className="manifest-idx">03</span> Base
                </dt>
                <dd className="manifest-val">
                  CHINA · UTC+8 · <BaseTime />
                </dd>
              </div>
              <div className="manifest-row hero-rise" style={{ "--d": "290ms" } as React.CSSProperties}>
                <dt className="manifest-key">
                  <span className="manifest-idx">04</span> Output
                </dt>
                <dd className="manifest-val">
                  <Counter value={stats.total} pad={3} /> SPECIMENS ·{" "}
                  <Counter value={stats.families} pad={2} /> FAMILIES · ★{" "}
                  <Counter value={stats.stars} />
                </dd>
              </div>
            </dl>

            <div
              className="hero-rise mt-9 flex flex-wrap items-center gap-3"
              style={{ "--d": "400ms" } as React.CSSProperties}
            >
              <Link href="/projects/" className="btn btn-primary">
                浏览项目
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
              <a
                href="#selected"
                className="label-sm ml-auto hidden items-center gap-2 transition-colors hover:text-fg lg:inline-flex"
              >
                <span className="text-signal" aria-hidden="true">
                  ↓
                </span>
                01 Selected
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-line lg:pl-10">
            <div className="hero-rise" style={{ "--d": "260ms" } as React.CSSProperties}>
              <Tilt max={6}>
                <span className="hero-glow" aria-hidden="true" />
                <ArchivePanel
                  groups={groups}
                  total={stats.total}
                  stacks={stats.langs}
                  stars={stats.stars}
                />
              </Tilt>
              <div className="mt-3 flex items-center justify-between">
                <span className="label-sm">FIG. 00 — ARCHIVE MAP</span>
                <span className="label-sm">{stats.total} NODES</span>
              </div>
            </div>
          </div>
        </div>

        {/* 数字条 */}
        <dl className="grid grid-cols-2 border-t border-line sm:grid-cols-4">
          {[
            { label: "NODES / 项目", value: stats.total, pad: 2 },
            { label: "STARS / 星标", value: stats.stars, pad: 0 },
            { label: "STACKS / 语言", value: stats.langs, pad: 0 },
            { label: "GROUPS / 分类", value: stats.families, pad: 0 },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={[
                "border-line py-5",
                i < 2 ? "border-b" : "",
                i % 2 === 0 ? "border-r" : "",
                i % 2 === 1 ? "pl-5" : "",
                i > 0 ? "sm:pl-5" : "",
                "sm:border-b-0",
                i < 3 ? "sm:border-r" : "sm:border-r-0",
              ].join(" ")}
            >
              <dt className="label-sm">{stat.label}</dt>
              <dd className="mono-display mt-2 text-[clamp(1.6rem,2.6vw,2.1rem)] text-fg">
                <Counter value={stat.value} pad={stat.pad} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
