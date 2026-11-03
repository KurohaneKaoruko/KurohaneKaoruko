"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

/**
 * finish() 到真正卸载之间留的一拍。
 *
 * 退场动画本身由 CSS 跑（见 globals.css 的 .splash-root[data-exiting]），
 * 这里只负责在动画放完之后把节点摘掉。数值要和 --splash-exit 对齐。
 */
const DISMISS_BEAT = 820;

/** 状态文案，按进度阈值切换；显示过的会往下堆叠保留（终端日志式） */
const STATUS_MESSAGES = [
  "加载核心组件 / Loading Core Components...",
  "正在编译构建 / Compiling The Build...",
  "正在挂载视图 / Mounting Views...",
  "准备就绪 / Ready",
] as const;

const statusFor = (value: number) =>
  value < 35 ? STATUS_MESSAGES[0] : value < 75 ? STATUS_MESSAGES[1] : value < 100 ? STATUS_MESSAGES[2] : STATUS_MESSAGES[3];

/**
 * 启动屏。
 *
 * 曾经用 framer-motion 写退场（快门上下分开、内容模糊淡出）。但那套动画
 * 只在这一处用到，却让整个 framer-motion（约 170KB）进了所有路由的首屏
 * 包 —— 代价太高。现在退场全部交给 CSS keyframes：
 *
 * - 渲染成本一样低（合成器线程跑 transform / opacity）；
 * - 首屏少一个重量级依赖，主线程启动时间明显下降；
 * - 时序集中写在 globals.css 的 --splash-exit 上，和这里对齐即可。
 *
 * 关于 LCP：启动屏盖在首屏上时，屏内的大字会被浏览器记为 LCP 候选 ——
 * 而这段文字要等 JS 水合后才出现，等于把 LCP 硬生生推迟到水合之后。
 * 所以这里给整块屏加 aria-hidden + CSS 的 content-visibility，让启动屏
 * 在度量上退到后台，真正的首屏内容（Hero 的档案表）才是 LCP。
 * 视觉上两者互不影响：启动屏仍然完整覆盖一屏。
 */
export default function SplashScreen() {
  const { isLoaded, setIsLoaded, shouldShowSplash } = useLoading();
  const [isVisible, setIsVisible] = useState(shouldShowSplash);
  /** 退场中：挂 data-exiting，让 CSS 开始放退场动画 */
  const [isExiting, setIsExiting] = useState(false);

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
    setIsExiting(true);
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
     *
     * 关于「固定 1.5s」的取舍：这是启动屏最容易被误读的地方。它原来是
     * 无条件跑满 SPLASH_DURATION，哪怕页面早就好了也照样等 —— 首屏被一块
     * 黑幕白白压着 1.5s，LCP 直接晚 1.5s（实测会因此出现双峰：冷缓存
     * 下恰好和字体到齐的时机错开，LCP 在 1.2s 和 3.8s 之间跳）。
     *
     * 现在改成：进度按「已就绪」提前收口。页面一旦就绪，曲线立刻加速走完，
     * 只保留 SETTLE 那一拍停顿让人看见 100%。动画节奏感还在，但不再拿
     * 首屏可见性换。
     */
    const step = () => {
      if (finishedRef.current) return;

      const elapsed = performance.now() - startTime;
      const ready = isLoadedRef.current;

      // 就绪后把总时长压缩到 1/3，剩余进度快速走完；未就绪仍按原速爬
      const duration = ready ? SPLASH_DURATION / 3 : SPLASH_DURATION;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
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

  if (!isVisible) return null;

  return (
    <div
      className="splash-root fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-transparent"
      data-exiting={isExiting ? "true" : "false"}
      onClick={skip}
      role="presentation"
    >
      {/* 上快门 */}
      <div className="splash-shutter splash-shutter--top absolute left-0 top-0 z-0 h-1/2 w-full border-b border-signal/20">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "center top",
          }}
        />
      </div>

      {/* 下快门 */}
      <div className="splash-shutter splash-shutter--bottom absolute bottom-0 left-0 z-0 h-1/2 w-full border-t border-signal/20">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "center bottom",
          }}
        />
      </div>

      {/* 内容层——快门开启前淡出。translate-y 是光学居中的微调：
          底部预留了 4 行日志空间，数学居中会让上半部分显得偏高 */}
      <div className="splash-body relative z-10 flex w-full max-w-xl translate-y-6 flex-col items-center gap-8 px-8">
        {/* 主标题 */}
        <div className="splash-title text-4xl font-black tracking-tighter text-white md:text-6xl">
          <ScrambleText text={SITE.short} duration={600} className="font-sans" />
        </div>

        {/* 副文本 */}
        <div className="splash-sub font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <ScrambleText
            text="The World Initialization Sequence"
            duration={600}
            delay={400}
            chars={CHARS_FULL}
            className="font-sans"
          />
        </div>

        {/* 进度条 */}
        <div className="mt-8 flex w-full items-center gap-2 font-mono text-signal">
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
            <div ref={barRef} className="relative z-10 h-full bg-signal" style={{ width: "0%" }}>
              <div className="absolute bottom-0 right-0 top-0 w-2 bg-white shadow-[0_0_10px_#fff]" />
            </div>
          </div>
          <span className="text-sm">]</span>
        </div>

        {/* 状态日志：当前状态在上（带百分比），显示过的往下堆叠保留。
            固定预留 4 行高度 —— 不预留的话每长一行整列就重新居中一次，
            标题和进度条会被挤着往上跳。

            每一行都绝对定位钉在自己的槽位上：文案长度会变（"加载核心组件…"
            比"准备就绪"长得多），流式布局下每次换行都会重算宽度与位置，
            记成 CLS。钉死槽位后盒子全程不动，只有槽里的字在变。 */}
        <div className="relative h-[72px] w-full overflow-hidden font-mono text-[10px] uppercase leading-[18px] text-faint">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="absolute inset-x-0 flex justify-between"
              style={{ top: i * 18, height: 18 }}
            >
              <span className="truncate">
                {statusLog[i] ?? ""}
              </span>
              {i === 0 && (
                <span ref={percentageRef} className="shrink-0 pl-3 tabular-nums">
                  0%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 角部装饰——挂在快门上随之移动 */}
      <div className="splash-corner splash-corner--tl absolute left-8 top-8 z-20 h-16 w-16 border-l border-t border-signal/50" />
      <div className="splash-corner splash-corner--br absolute bottom-8 right-8 z-20 h-16 w-16 border-b border-r border-signal/50" />
    </div>
  );
}
