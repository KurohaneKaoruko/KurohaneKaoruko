"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrambleText, CHARS_FULL } from "@/components/ui/ScrambleText";
import { useLoading } from "@/context/LoadingContext";
import { SITE } from "@/lib/site";

/* ==========================================================================
   时序。节奏全部由这几个数决定，改这里就行。
   ========================================================================== */

/** 进度条从 0 爬到 100% 的时间。这一项直接决定「闪不闪」。 */
const SPLASH_DURATION = 1500;
/** 页面尚未就绪时进度最多停在这儿 —— 慢慢逼近但不给出"已完成"的假信号 */
const READY_CAP = 92;
/** 到达 100% 后的停顿，让"完成"这一帧被看见，不要一满就抽走 */
const SETTLE = 180;
/** 动画硬上限：无论 phase 卡在哪，超过这个时间一律放行 */
const SPLASH_MAX = 12000;

/** 快门揭幕时长 */
const SHUTTER_EXIT = 0.8;
const SHUTTER_EASE = [0.76, 0, 0.24, 1] as const;

/** finish() 到真正卸载之间留的一拍，用于点击跳过时的反馈 */
const DISMISS_BEAT = 140;

/** 状态文案，按进度阈值切换；显示过的会往下堆叠保留（终端日志式） */
const STATUS_MESSAGES = [
  "加载核心组件 / Loading Core Components...",
  "正在编译构建 / Compiling The Build...",
  "正在挂载视图 / Mounting Views...",
  "准备就绪 / Ready",
] as const;

const statusFor = (value: number) =>
  value < 35 ? STATUS_MESSAGES[0] : value < 75 ? STATUS_MESSAGES[1] : value < 100 ? STATUS_MESSAGES[2] : STATUS_MESSAGES[3];

export default function SplashScreen() {
  const { isLoaded, setIsLoaded, shouldShowSplash } = useLoading();
  const [isVisible, setIsVisible] = useState(shouldShowSplash);

  const percentageRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);

  /** 状态日志：[0] 是当前状态，其余是已显示过的（往下堆叠保留） */
  const [statusLog, setStatusLog] = useState<string[]>([STATUS_MESSAGES[0]]);
  const statusLogRef = useRef(statusLog);

  /**
   * 就绪状态用 ref 读，不进 effect 依赖。
   * 之前把它放进依赖数组，isLoaded 一变化整条时间线就重启、计时归零，
   * 进度会出现可见的倒退。
   */
  const isLoadedRef = useRef(isLoaded);

  useEffect(() => {
    isLoadedRef.current = isLoaded;
  }, [isLoaded]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    window.setTimeout(() => setIsVisible(false), DISMISS_BEAT);
  }, []);

  /** 点击任意处跳过 */
  const skip = useCallback(() => {
    setIsLoaded(true);
    finish();
  }, [finish, setIsLoaded]);

  useEffect(() => {
    if (!shouldShowSplash) return;

    // 每次整页加载都完整播放（用户裁决：启动屏不该只播一次）。
    // 进度用原生 rAF 驱动，不依赖动画库的命令式 API（对依赖升级免疫）
    const startTime = performance.now();
    let raf = 0;
    let settleStart: number | null = null;

    const setDisplay = (value: number) => {
      if (percentageRef.current) {
        percentageRef.current.textContent = `${Math.floor(value)}%`;
      }
      if (barRef.current) {
        barRef.current.style.width = `${value}%`;
      }
      // 状态切换时旧行往下堆叠，而不是原地替换
      const msg = statusFor(value);
      if (statusLogRef.current[0] !== msg) {
        const next = [msg, ...statusLogRef.current];
        statusLogRef.current = next;
        setStatusLog(next);
      }
    };

    /**
     * 单条连续时间线：一条 easeOutCubic 曲线从头走到尾，就绪与否只影响上限。
     * 未就绪时停在 READY_CAP，就绪后上限抬到 100 —— 两边都是 Min()，
     * 所以任何时刻进度都不会回头，也不会跳。
     */
    const step = () => {
      if (finishedRef.current) return;

      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / SPLASH_DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const ready = isLoadedRef.current;
      setDisplay(Math.min(eased * 100, ready ? 100 : READY_CAP));

      if (t >= 1 && ready) {
        // 停在 100% 上稍作停顿再收幕，避免"刚满就消失"
        if (settleStart === null) settleStart = elapsed;
        if (elapsed - settleStart >= SETTLE) {
          finish();
          return;
        }
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    // 硬超时兜底：就绪信号若因任何原因迟迟不到位，也必须在有限时间内收起，
    // 否则黑幕会一直盖着已送达的页面。
    // 注意水合之前 JS 完全没跑，这时只能靠 globals.css 的
    // .splash-root 纯 CSS 兜底（10s 自动退场）。
    const hardStop = window.setTimeout(() => finish(), SPLASH_MAX);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hardStop);
    };
  }, [shouldShowSplash, setIsLoaded, finish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="splash-root fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-transparent"
          onClick={skip}
          role="presentation"
        >
          {/* 上快门 */}
          <motion.div
            className="absolute left-0 top-0 z-0 h-1/2 w-full border-b border-primary/20"
            style={{ backgroundColor: "#0A0A0A" }}
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: SHUTTER_EXIT, ease: SHUTTER_EASE } }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                backgroundPosition: "center top",
              }}
            />
          </motion.div>

          {/* 下快门 */}
          <motion.div
            className="absolute bottom-0 left-0 z-0 h-1/2 w-full border-t border-primary/20"
            style={{ backgroundColor: "#0A0A0A" }}
            initial={{ y: 0 }}
            exit={{ y: "100%", transition: { duration: SHUTTER_EXIT, ease: SHUTTER_EASE } }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                backgroundPosition: "center bottom",
              }}
            />
          </motion.div>

          {/* 内容层——快门开启前淡出。translate-y 是光学居中的微调：
              底部预留了 4 行日志空间，数学居中会让上半部分显得偏高 */}
          <motion.div
            className="relative z-10 flex w-full max-w-xl translate-y-6 flex-col items-center gap-8 px-8"
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.55 } }}
          >
            {/* 主标题 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-black tracking-tighter text-white md:text-6xl"
            >
              <ScrambleText text={SITE.short} duration={600} className="font-sans" />
            </motion.div>

            {/* 副文本 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted"
            >
              <ScrambleText
                text="The World Initialization Sequence"
                duration={600}
                delay={400}
                chars={CHARS_FULL}
                className="font-sans"
              />
            </motion.div>

            {/* 进度条 */}
            <div className="mt-8 flex w-full items-center gap-2 font-mono text-primary">
              <span className="text-sm">[</span>
              <div className="relative h-1 flex-1 overflow-hidden">
                {/* 未加载段（虚线底） */}
                <div
                  className="absolute inset-0 h-full w-full opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, currentColor 0, currentColor 2px, transparent 2px, transparent 4px)",
                    backgroundSize: "4px 100%",
                  }}
                />
                {/* 已加载段（实心条） */}
                <div ref={barRef} className="relative z-10 h-full bg-primary" style={{ width: "0%" }}>
                  <div className="absolute bottom-0 right-0 top-0 w-2 bg-white shadow-[0_0_10px_#fff]" />
                </div>
              </div>
              <span className="text-sm">]</span>
            </div>

            {/* 状态日志：当前状态在上（带百分比），显示过的往下堆叠保留。
                固定预留 4 行高度 —— 不预留的话每长一行整列就重新居中一次，
                标题和进度条会被挤着往上跳。 */}
            <div className="h-[72px] w-full overflow-hidden font-mono text-[10px] uppercase leading-[18px] text-text-dim">
              <div className="flex w-full justify-between">
                <span>{statusLog[0]}</span>
                <span ref={percentageRef}>0%</span>
              </div>
              {statusLog.slice(1).map((msg) => (
                <div key={msg} className="opacity-50">
                  {msg}
                </div>
              ))}
            </div>
          </motion.div>

          {/* 角部装饰——挂在快门上随之移动 */}
          <motion.div
            className="absolute left-8 top-8 z-20 h-16 w-16 border-l border-t border-primary/50"
            exit={{ y: "-200%", opacity: 0, transition: { duration: SHUTTER_EXIT } }}
          />
          <motion.div
            className="absolute bottom-8 right-8 z-20 h-16 w-16 border-b border-r border-primary/50"
            exit={{ y: "200%", opacity: 0, transition: { duration: SHUTTER_EXIT } }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
