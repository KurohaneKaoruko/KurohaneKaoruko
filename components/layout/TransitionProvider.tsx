"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

type Phase = "idle" | "cover" | "reveal" | "snap" | "snapReveal";

const EASE = [0.22, 1, 0.36, 1] as const;
const COVER_NAV_DELAY = 520;
const COVER_TOTAL = 740;
const REVEAL_MS = 600;
const SNAP_REVEAL_MS = 600;
const READY_TIMEOUT = 8000;

/**
 * 相位看门狗：任何非 idle 相位都必须在这个时间内强制回到 idle。
 *
 * 遮罩是三块 `fixed inset-0` 面板，颜色取自 body 的 --background，
 * 只有回到 idle 才会滑出屏幕。原先「揭开」只有一个触发条件——
 * 内容前 200 字符与快照不同。一旦该条件不成立（遮罩期间按返回、
 * 或短链与实路径互相跳导致内容完全相同），轮询会被超时清掉却从不揭开，
 * phase 永久停在 cover → 面板永久盖屏 → 表现为「切页卡在黑屏」。
 * 这里给出有界退出的兜底。
 */
const PHASE_WATCHDOG: Record<Phase, number> = {
  idle: 0,
  cover: COVER_TOTAL + READY_TIMEOUT + 400,
  snap: SNAP_REVEAL_MS + 800,
  reveal: REVEAL_MS + 400,
  snapReveal: SNAP_REVEAL_MS + 400,
};

let orchestrator: ((href: string) => void) | null = null;

export function navigateWithTransition(href: string) {
  if (orchestrator) orchestrator(href);
  else window.location.assign(href);
}

/**
 * 页面切换编排器。
 * 就绪信号：路由已提交（pathname 变化）且 children 容器里不再是 loading.tsx 空壳。
 * 二者都满足才揭幕，超时（READY_TIMEOUT）强制放行兜底。
 */
export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhaseState] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const pathnameRef = useRef(pathname);
  const startRef = useRef(0);
  const snapCycleRef = useRef(false);
  const childrenRef = useRef<HTMLDivElement>(null);
  const panelsColorRef = useRef<string | null>(null);
  const timersRef = useRef<number[]>([]);
  // 揭幕双信号：路由已提交 且 真实内容已上屏（而非 loading.tsx 空壳）。
  // 只看 pathname 会在 Suspense 吐 fallback 时提前揭幕 → 空白闪一下、内容再蹦出来。
  const navCommittedRef = useRef(false);
  const contentReadyRef = useRef(false);
  // 已预取过的 href（去重）
  const prefetchedRef = useRef<Set<string>>(new Set());

  const setPhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const addTimer = useCallback((id: number) => {
    timersRef.current.push(id);
    return id;
  }, []);

  const goToReveal = useCallback(() => {
    if (phaseRef.current !== "cover" && phaseRef.current !== "snap") return;
    if (snapCycleRef.current) {
      setPhase("snapReveal");
      addTimer(window.setTimeout(() => setPhase("idle"), SNAP_REVEAL_MS));
    } else {
      setPhase("reveal");
      addTimer(window.setTimeout(() => setPhase("idle"), REVEAL_MS));
    }
  }, [setPhase, addTimer]);

  const checkReady = useCallback(() => {
    if (phaseRef.current !== "cover" && phaseRef.current !== "snap") return;
    const waitCover = Math.max(0, COVER_TOTAL - (performance.now() - startRef.current));
    addTimer(
      window.setTimeout(() => {
        if (phaseRef.current !== "cover" && phaseRef.current !== "snap") return;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            goToReveal();
          });
        });
      }, waitCover)
    );
  }, [goToReveal, addTimer]);

  /**
   * 揭幕条件：路由已提交 且 容器里不再是 loading.tsx 空壳（.route-loading）。
   * 不能用 innerHTML 长度/前缀比对判断「内容变化」——页面跑着循环动画
   * （跑马灯/呼吸辉光/脉冲点），每帧都在改 inline style，innerHTML 每帧都不同，
   * 会把旧页自己的动画抖动误判成「新内容到了」→ 遮罩提前揭开（即闪烁）。
   */
  const maybeReveal = useCallback(() => {
    if (phaseRef.current !== "cover") return;
    if (!navCommittedRef.current) return;
    const w = childrenRef.current;
    if (!w || w.querySelector(".route-loading")) return;
    if (contentReadyRef.current) return;
    contentReadyRef.current = true;
    checkReady();
  }, [checkReady]);

  const startTransition = useCallback(
    (href: string) => {
      if (phaseRef.current !== "idle") {
        router.push(href);
        return;
      }
      let target: URL;
      try {
        target = new URL(href, window.location.origin);
      } catch {
        return;
      }
      // 目标就是当前地址就不要再走遮罩：短链与实路径互跳时内容不会变
      if (target.pathname === pathnameRef.current || target.pathname === window.location.pathname) {
        router.push(href);
        return;
      }

      panelsColorRef.current =
        getComputedStyle(document.body).getPropertyValue("--background").trim() || null;
      startRef.current = performance.now();
      snapCycleRef.current = false;
      // 复位双信号：本次导航必须等「路由提交 + 真实内容」都就绪才揭幕
      navCommittedRef.current = false;
      contentReadyRef.current = false;
      setPhase("cover");

      addTimer(
        window.setTimeout(() => {
          // 此刻 cover 动画（500ms）已结束、面板完全盖住屏幕，滚动归零不会被看见。
          // scrollRestoration 已是 manual，浏览器不会自己恢复；
          // 不归零的话新页面会从旧页的滚动高度起渲染，揭幕瞬间肉眼跳一下。
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          router.push(href);

          // 轮询：路由提交后，等 loading 空壳换成真内容就揭幕
          const poll = setInterval(() => {
            if (phaseRef.current !== "cover" || contentReadyRef.current) {
              clearInterval(poll);
              return;
            }
            maybeReveal();
          }, 50);
          // 超时兜底：强制放行（「任何非 idle 相位都有上界」的不变量不破）
          addTimer(
            window.setTimeout(() => {
              clearInterval(poll);
              navCommittedRef.current = true;
              contentReadyRef.current = true;
              checkReady();
            }, READY_TIMEOUT)
          );
        }, COVER_NAV_DELAY)
      );
    },
    [router, setPhase, addTimer, checkReady, maybeReveal]
  );

  useEffect(() => {
    orchestrator = startTransition;
    return () => {
      if (orchestrator === startTransition) orchestrator = null;
    };
  }, [startTransition]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.("a[href]");
      if (!anchor) return;
      if (anchor.getAttribute("target") === "_blank") return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (/^\/#/.test(href)) return;
      event.preventDefault();
      startTransition(href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [startTransition]);

  // pathname 仅处理 snap（返回/前进）
  useLayoutEffect(() => {
    if (pathname === pathnameRef.current) return;
    pathnameRef.current = pathname;
    if (phaseRef.current === "cover") {
      // 路由已提交。真实内容可能还在 Suspense 里 —— 等双信号齐再揭幕。
      navCommittedRef.current = true;
      maybeReveal();
      return;
    }
    if (phaseRef.current === "idle" || phaseRef.current === "snap") {
      panelsColorRef.current =
        getComputedStyle(document.body).getPropertyValue("--background").trim() || null;
      startRef.current = performance.now() - COVER_TOTAL;
      snapCycleRef.current = true;
      // 返回/前进不走上面的等待链，直接放行
      navCommittedRef.current = true;
      contentReadyRef.current = true;
      setPhase("snap");
      checkReady();
      addTimer(window.setTimeout(goToReveal, 1500));
    }
  }, [pathname, checkReady, setPhase, goToReveal, addTimer, maybeReveal]);

  // 预取：站点用原生 <a> + 点击拦截，Link 的预取机制不总是生效 ——
  // 悬停即预取，点击时数据已在手。
  useEffect(() => {
    const onOver = (event: PointerEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (/^\/#/.test(href)) return;
      if (prefetchedRef.current.has(href)) return;
      prefetchedRef.current.add(href);
      try {
        router.prefetch(href);
      } catch {
        /* 预取失败不影响点击跳转 */
      }
    };
    document.addEventListener("pointerover", onOver, true);
    return () => document.removeEventListener("pointerover", onOver, true);
  }, [router]);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  // 看门狗：无论动画 / 轮询 / 路由信号哪一环失效，都保证回到 idle，面板必定收起
  useEffect(() => {
    if (phase === "idle") return;
    const id = window.setTimeout(() => setPhase("idle"), PHASE_WATCHDOG[phase]);
    return () => window.clearTimeout(id);
  }, [phase, setPhase]);

  const panelStyle = panelsColorRef.current
    ? { backgroundColor: panelsColorRef.current }
    : undefined;

  const vBottom = {
    idle: { y: "100%", opacity: 1, transition: { duration: 0 } },
    cover: { y: "0%", transition: { duration: 0.5, ease: EASE } },
    snap: { y: "0%", transition: { duration: 0 } },
    reveal: { y: "100%", transition: { duration: 0.5, ease: EASE } },
    snapReveal: { y: "100%", transition: { duration: 0.5, ease: EASE } },
  };
  const vTopPrimary = {
    idle: { y: "-100%", opacity: 1, transition: { duration: 0 } },
    cover: { y: "0%", transition: { duration: 0.5, ease: EASE } },
    reveal: { y: "0%", opacity: 0, transition: { duration: 0 } },
    snapReveal: { y: "0%", opacity: 0, transition: { duration: 0 } },
    snap: { y: "0%", transition: { duration: 0 } },
  };
  const vTopBg = {
    idle: { y: "-100%", opacity: 1, transition: { duration: 0 } },
    cover: { y: "0%", transition: { duration: 0.5, ease: EASE, delay: 0.2 } },
    reveal: { y: "0%", opacity: 0, transition: { duration: 0 } },
    snapReveal: { y: "0%", opacity: 0, transition: { duration: 0 } },
    snap: { y: "0%", transition: { duration: 0 } },
  };

  return (
    <>
      <div ref={childrenRef}>{children}</div>
      <motion.div
        variants={vBottom}
        animate={phase}
        className="pointer-events-none fixed inset-0 z-[60] origin-top bg-background will-change-transform"
        style={panelStyle}
      />
      <motion.div
        variants={vTopPrimary}
        animate={phase}
        className="pointer-events-none fixed inset-0 z-[60] origin-bottom bg-primary will-change-transform"
      />
      <motion.div
        variants={vTopBg}
        animate={phase}
        className="pointer-events-none fixed inset-0 z-[61] origin-bottom bg-background will-change-transform"
        style={panelStyle}
      />
    </>
  );
}
