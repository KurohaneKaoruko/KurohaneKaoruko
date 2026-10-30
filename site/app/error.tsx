"use client";

import { useEffect } from "react";
import { Schematic } from "@/components/ui/Schematic";

/**
 * 500：系统故障。
 *
 * 与 404 共用同一套图版语言，但把节点图换成一段断裂的波形。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="shell flex min-h-[calc(100vh-var(--nav-h))] flex-col justify-center py-[clamp(40px,7vw,88px)]">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="eyebrow">ERROR 500 — SYSTEM FAULT</span>
          <h1 className="display mt-6 text-[clamp(3.4rem,11vw,8rem)] uppercase text-fg">
            Fault
            <br />
            detected<span className="text-signal">.</span>
          </h1>
          <p className="mt-6 max-w-[42ch] text-[14px] leading-[1.9] text-fg-2">
            页面在渲染时出了问题。可以重试一次；如果它一直坏着，那就是我的问题。
          </p>
          {error?.message && (
            <p className="mt-4 max-w-[52ch] break-words border-l border-line-strong pl-3 font-mono text-[10px] leading-relaxed text-faint">
              {error.message.slice(0, 200)}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={reset} className="btn btn-primary">
              重试 <span aria-hidden="true">↻</span>
            </button>
            <a href="/" className="btn btn-ghost">
              返回首页
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="plate p-4">
            <div className="flex items-center justify-between">
              <span className="plate-index">FIG.500</span>
              <span className="plate-index">SIGNAL LOST</span>
            </div>
            <div className="schematic-grid mt-3 flex h-[240px] items-center justify-center border border-line-soft">
              <Schematic seed="system-fault" variant="wave" className="h-full w-full text-faint" />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-2">
              <span className="label-sm">ERR_RENDER</span>
              <span className="label-sm">0x1F4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
