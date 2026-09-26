"use client";

import { useEffect, useRef, useState } from "react";
import { TechPanel } from "@/components/ui/TechPanel";
import { TERMINAL_SESSION } from "@/lib/site";

const PROMPT_CHAR_SPEED = 42;
const OUTPUT_DELAY = 260;
const NEXT_LINE_DELAY = 420;

type Line = { cmd: string; out?: string };

/**
 * 首页终端面板：进入视口后逐字敲出命令，再逐行打印输出。
 * 用 IntersectionObserver 触发，避免页面一加载就在屏幕外演完。
 */
export default function TerminalSession() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // 已经是「减少动态效果」偏好：直接呈现全部内容，不做逐步演出
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLines(TERMINAL_SESSION);
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, ms)));

    const run = async () => {
      for (const item of TERMINAL_SESSION) {
        for (let i = 1; i <= item.cmd.length; i++) {
          if (cancelled) return;
          setTyping(item.cmd.slice(0, i));
          await wait(PROMPT_CHAR_SPEED);
        }
        if (cancelled) return;

        setLines((prev) => [...prev, { cmd: item.cmd }]);
        setTyping("");
        await wait(OUTPUT_DELAY);
        if (cancelled) return;

        setLines((prev) =>
          prev.map((l, idx) => (idx === prev.length - 1 ? { ...l, out: item.out } : l))
        );
        await wait(NEXT_LINE_DELAY);
      }
      if (!cancelled) setStarted(false);
    };

    void run();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [started]);

  const busy = started || typing.length > 0;

  return (
    <div ref={rootRef} className="mx-2 md:mx-6">
      <TechPanel title="SESSION" subtitle="kurohane@portfolio:~ — bash 80×24">
        <div className="min-h-[10rem] space-y-0.5 font-mono text-xs leading-7 sm:text-sm">
          {lines.map((line, i) => (
            <div key={i}>
              <p>
                <span className="text-primary">❯</span>{" "}
                <span className="text-foreground">{line.cmd}</span>
              </p>
              {line.out ? <p className="text-text-muted">{line.out}</p> : null}
            </div>
          ))}

          {busy ? (
            <p>
              <span className="text-primary">❯</span>{" "}
              <span className="text-foreground">{typing}</span>
              <span className="caret ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-primary align-middle" />
            </p>
          ) : (
            <p>
              <span className="text-primary">❯</span>{" "}
              <span className="caret inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-primary align-middle" />
            </p>
          )}
        </div>
      </TechPanel>
    </div>
  );
}
