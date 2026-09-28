"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

/**
 * 500 页面（服务器内部错误）。
 *
 * 【不跟随站点主题】——颜色全部写死，不引用任何主题令牌。
 * 理由：这类页面出现在「站点已经出问题」的时刻，不该再依赖可能一起坏掉的
 * 主题状态；同时它要脱离站点外壳，让用户明确意识到「这不是普通页面」。
 *
 * 【配色：黑白为底，红蓝只在故障瞬间】刻意避开「终端=磷光绿」的刻板印象。
 * 整个画面是黑底 + 白字 + 白灰框线的冷峻监控画面；红蓝只在**故障发生的那一瞬**
 * 出现 —— 500 数字的三层错版分离、标题重影、数字雨里零星的异常字符。
 *
 * 【与 404 刻意拉开】两页都是黑底故障风，但故障的载体不同：
 *   404 —— 人物字符画 + 蒙版 mask 漂移，红蓝霓虹铺满整屏（红蓝是主色）。
 *   500 —— canvas 画的 01 数字流，黑白为底，红蓝只做瞬时色差。
 *
 * 【v71 随机警报脉冲】红幕闪 + 巨号 500 撕裂 skew，每 2.6-5.2s 一次 —— 词汇与 404 的
 * 反色/切片刻意错开；只碰 opacity/transform（合成器友好），矮屏收起长说明保一屏。
 * 【/500 常驻路由】404 天生可访问（/404），500 只能等报错；app/500/page.tsx 让它可以
 * 主动访问（演示数据 + noindex）。因此 onRetry 改为可选 —— 演示路由不传，默认 router.refresh()。
 */

/**
 * 固定色板（不走主题令牌）。
 * 底色纯黑；**装饰以红蓝为主**，绿只在数字雨与错版层里零星出现；
 * 黑白只留给底色与说明性文字。
 */
const BG = "#000000";
const INK = "#f5f8f6"; // 说明文字：白
const MUTE = "#b4b8b5"; // 次要说明文字：灰（提亮，别在纯黑上发虚）
const RED = "#ff2f3a"; // 装饰主色
const BLUE = "#4a8cff"; // 装饰主色
const GREEN = "#39ff6a"; // 点缀，占比很低
const LINE = "rgba(74,140,255,0.62)"; // 框线走蓝

const CSS = `
/* 底色纯黑，不铺任何纹理层 —— 网格 / 静电噪点 / CRT 扫描线全部移除，
   画面只留 canvas 数字雨 + 几处红绿蓝装饰。 */

@keyframes erBeam {
  0%   { transform: translateY(-28vh); opacity: 0; }
  12%  { opacity: 1; }
  88%  { opacity: 1; }
  100% { transform: translateY(112vh); opacity: 0; }
}

/* ── 巨号 500：白主体 + 红蓝错版分离（故障瞬间才出现的色） ── */
.er-code {
  position: relative;
  display: inline-block;
  font-family: var(--font-roboto-mono), ui-monospace, monospace;
  font-weight: 900;
  letter-spacing: 0.06em;
  line-height: 0.86;
  color: ${RED};
  text-shadow: 0 0 30px rgba(255,47,58,0.42);
}
.er-code::before,
.er-code::after {
  position: absolute;
  left: 0; top: 0;
  pointer-events: none;
}
.er-code::before {
  content: "500";
  color: ${BLUE};
  animation: erMisB 6.1s steps(1, end) infinite;
}
.er-code::after {
  content: "500";
  color: ${GREEN};
  animation: erMisR 4.7s steps(1, end) infinite;
}
@keyframes erMisB {
  0%, 90%, 100% { transform: translate(-6px, -2px); opacity: .8; }
  91% { transform: translate(13px, 5px); opacity: 1; }
  93% { transform: translate(-15px, -6px); opacity: .6; }
}
@keyframes erMisR {
  0%, 86%, 100% { transform: translate(7px, 4px); opacity: .92; }
  87% { transform: translate(-19px, 10px); opacity: 1; }
  89% { transform: translate(21px, -9px); opacity: 1; }
  91% { transform: translate(7px, 4px); opacity: 0; }
  93% { transform: translate(7px, 4px); opacity: .92; }
  95% { transform: translate(-13px, -6px); opacity: 1; }
}

/* ── 电压波动：全屏 overlay 的 opacity，不再对根元素做 filter ──
   filter 挂在根上会强制整棵子树重绘（页面越大越贵）；opacity 直接交合成器。
   蓝光一闪 = 电压顶上去的那一下，一强一弱两次，周期 7.3s。 */
.er-flash {
  background: ${BLUE};
  opacity: 0;
  animation: erFlash 7.3s steps(1, end) infinite;
}
@keyframes erFlash {
  0%, 89%, 100% { opacity: 0; }
  90%  { opacity: 0.10; }
  91%  { opacity: 0; }
  92.5%{ opacity: 0.055; }
  93.5%{ opacity: 0; }
}

/* ── 画面撕裂：若干元素以不同周期跳位错开 ── */
.er-jit-a { animation: erJitA 5.3s steps(1, end) infinite; }
@keyframes erJitA {
  0%, 91%, 100% { transform: translate(0, 0); }
  92%   { transform: translate(-6px, 2px); }
  94%   { transform: translate(5px, -2px); }
  96%   { transform: translate(-2px, 0); }
}

/* ── 标题重影：故障瞬间的红蓝色差 ── */
.er-title {
  text-shadow: 2px 0 0 rgba(255,47,58,.6), -2px 0 0 rgba(74,140,255,.5);
}

/* ── 状态点呼吸 ── */
.er-live { animation: erLive 1.4s ease-in-out infinite; }
@keyframes erLive { 0%,100% { opacity: 1; } 50% { opacity: .25; } }

/* ── 事故日志跑马灯：底部向左滚、顶部向右滚，两端方向相反 ── */
.er-ticker { animation: erTicker 26s linear infinite; }
@keyframes erTicker { to { transform: translateX(-50%); } }
.er-ticker-rev { animation: erTickerRev 26s linear infinite; }
@keyframes erTickerRev {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}

/* ── 弹窗入场 ── */
.er-modal { animation: erModalIn .16s ease-out both; }
@keyframes erModalIn {
  from { opacity: 0; transform: translateY(8px) scale(.985); }
  to   { opacity: 1; transform: none; }
}

}

/* ── 全页随机警报脉冲（JS 驱动）：红幕 + 巨号 500 撕裂 skew ── */
.er-alarm {
  background: ${RED};
  opacity: 0;
  transition: opacity .12s linear;
}
.er-seiz { animation: erSeiz .18s steps(2, end) 1; }
@keyframes erSeiz {
  0%   { transform: translate(-8px, 2px) skewX(-3deg); }
  45%  { transform: translate(7px, -2px) skewX(2deg); }
  100% { transform: none; }
}

/* 矮屏收起长说明，保住「内容不超一屏」 */
@media (max-height: 700px) {
  .er-desc { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .er-root, .er-root * { animation: none !important; }
}
`;

/** 底部跑马灯里的「事故日志」片段（装饰用，两遍拼接以无缝循环） */
const LOG_LINES = [
  "SIGSEGV @ 0x00007f3a4c21",
  "render.component → unhandled",
  "retry 1/1 · backoff none",
  "runtime.state = HALTED",
  "awaiting operator input",
  "build 2026.09 · node 10000",
];

const HEX = "0123456789ABCDEF";
const GARBAGE = "01001101▓▒░#*+";

/**
 * 事故日志跑马灯。默认贴在视口底边向左滚；
 * 传 reverse 并指定 edge="top" 可放到顶边向右滚 —— 两条方向相反，形成对拉。
 */
function Ticker({ reverse = false, edge = "bottom" }: { reverse?: boolean; edge?: "top" | "bottom" }) {
  return (
    <div
      className={
        "pointer-events-none fixed left-0 z-20 w-full overflow-hidden py-1.5 " +
        (edge === "top" ? "top-0 border-b" : "bottom-0 border-t")
      }
      style={{ background: BG, borderColor: "rgba(74,140,255,0.34)" }}
    >
      <div
        className={
          (reverse ? "er-ticker-rev" : "er-ticker") +
          " flex w-max gap-8 whitespace-nowrap px-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em]"
        }
      >
        {[0, 1].map((copy) => (
          <span key={copy} className="flex gap-8">
            {LOG_LINES.map((l) => (
              <span key={l} style={{ color: copy === 0 ? RED : "rgba(74,140,255,0.6)" }}>
                ● {l}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 故障地址行：直接改 DOM 文本，不走 React state。
 * 原实现每 120ms 两次 setState，等于每秒 8 次组件重渲染；改成 ref + textContent
 * 后重渲染归零，间隔放宽到 160ms —— 视觉上几乎无差别。
 */
function FaultAddress() {
  const addrRef = useRef<HTMLSpanElement>(null);
  const noiseRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rand = (pool: string, n: number) =>
      Array.from({ length: n }, () => pool[Math.floor(Math.random() * pool.length)]).join("");

    const id = window.setInterval(() => {
      if (addrRef.current) addrRef.current.textContent = "0x" + rand(HEX, 12);
      if (noiseRef.current) noiseRef.current.textContent = rand(GARBAGE, 11);
    }, 160);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] font-bold tracking-[0.16em] sm:text-[11px]">
      <span style={{ color: RED }}>FAULT AT</span>
      <span ref={addrRef} style={{ color: RED }}>
        0x00007F3A4C21
      </span>
      <span ref={noiseRef} style={{ color: BLUE }}>
        010011010
      </span>
    </div>
  );
}

/** 背景：canvas 画的 01 数字流（黑白灰为主，零星红蓝异常列） */
function BinaryRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const FONT = 14;
    // 固定 1x 渲染：数字雨是背景装饰，dpr=2 时每帧要填 4 倍像素，
    // 换来的清晰度在这个位置基本看不出；低分辨率反而更接近老终端的质感。
    let w = 0;
    let h = 0;
    let cols = 0;
    let drops: number[] = [];
    let raf = 0;
    let last = 0;

    const setup = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w;
      cv.height = h;
      cv.style.width = w + "px";
      cv.style.height = h + "px";
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);
      // 字体与基线只设一次：canvas 状态在下次 resize 前一直有效，每帧重设是白费
      ctx.font = `${FONT}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";

      cols = Math.ceil(w / FONT);
      drops = Array.from({ length: cols }, () => (Math.random() * -h) / FONT);
    };
    setup();
    window.addEventListener("resize", setup);

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 83) return; // ~12fps：慢速背景，再高看不出差别
      last = now;

      // 半透明覆盖 → 形成拖尾
      ctx.fillStyle = "rgba(0,0,0,0.11)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < cols; i++) {
        const x = i * FONT;
        const y = drops[i] * FONT;
        const roll = Math.random();

        // 装饰以红蓝为主，绿只占很小比例
        if (roll < 0.42) {
          ctx.fillStyle = RED;
          ctx.globalAlpha = 0.68;
        } else if (roll < 0.84) {
          ctx.fillStyle = BLUE;
          ctx.globalAlpha = 0.66;
        } else if (roll < 0.92) {
          ctx.fillStyle = GREEN;
          ctx.globalAlpha = 0.5;
        } else {
          ctx.fillStyle = BLUE;
          ctx.globalAlpha = 0.28;
        }
        ctx.fillText(HEX[(Math.random() * 16) | 0], x, y);

        drops[i] += 0.35 + Math.random() * 0.55;
        if (y > h && Math.random() > 0.972) drops[i] = -2;
      }
      ctx.globalAlpha = 1;
    };
    // 切到后台就停：纯装饰循环没有理由在看不见的时候烧 CPU
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", setup);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.66 }}
    />
  );
}

type ServerErrorProps = {
  /** 已截断的错误信息 */
  message: string;
  digest?: string;
  /** 错误边界的重试入口；可选 —— /500 演示路由不传，默认 router.refresh() */
  onRetry?: () => void;
};

/** 错误详情弹窗：不占页面高度，Esc / 点遮罩 / 关闭按钮都能退 */
function ErrorModal({
  message,
  digest,
  stamp,
  onClose,
}: {
  message: string;
  digest?: string;
  /** 事故元信息（发生时间等）只在弹窗里给出，页面上不直接铺开 */
  stamp: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const body = message + (digest ? "\n\ndigest: " + digest : "");

  const report = [
    { label: "发生时间", value: stamp || "—" },
    { label: "影响模块", value: "render / component" },
    { label: "处理状态", value: "FAILED · 等待重试", alert: true },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* 剪贴板不可用就静默失败 */
    }
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="关闭错误详情"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: "rgba(0,0,0,0.85)" }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="错误详情"
        className="er-modal relative flex max-h-[80vh] w-full max-w-3xl flex-col border-2"
        style={{
          borderColor: BLUE,
          background: "#050505",
          boxShadow: "0 0 0 1px rgba(74,140,255,0.28), 0 24px 70px rgba(0,0,0,0.92)",
        }}
      >
        <div
          className="flex items-center justify-between gap-4 border-b-2 px-4 py-2.5"
          style={{ borderColor: BLUE }}
        >
          <span className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: RED }}>
            <span className="er-live inline-block h-2 w-2" style={{ background: RED }} />
            error trace
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-xs font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
            style={{ color: MUTE }}
          >
            esc / 关闭 ✕
          </button>
        </div>

        {/* 事故元信息放在弹窗里，页面上不直接展示 */}
        <dl className="border-b-2" style={{ borderColor: LINE }}>
          {report.map((r, i) => (
            <div
              key={r.label}
              className={
                "grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[8rem_minmax(0,1fr)]" +
                (i > 0 ? " border-t-2" : "")
              }
              style={{ borderColor: LINE }}
            >
              <dt
                className="whitespace-nowrap border-r-2 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] sm:px-4"
                style={{ borderColor: LINE, color: MUTE }}
              >
                {r.label}
              </dt>
              <dd
                className="px-3 py-2 font-mono text-[13px] font-medium sm:px-4 sm:text-sm"
                style={r.alert ? { color: RED, fontWeight: 700 } : { color: INK }}
              >
                {r.value}
              </dd>
            </div>
          ))}
        </dl>

        <pre
          className="flex-1 overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-[12px] font-medium leading-6"
          style={{ color: INK }}
        >
          {body}
        </pre>

        <div
          className="flex items-center justify-between gap-4 border-t-2 px-4 py-2.5"
          style={{ borderColor: "rgba(74,140,255,0.32)" }}
        >
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: MUTE }}>
            仅用于排查，不会上报
          </span>
          <button
            type="button"
            onClick={copy}
            className="border px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
            style={{ borderColor: BLUE, color: copied ? BG : BLUE, background: copied ? BLUE : "transparent" }}
          >
            {copied ? "已复制 ✓" : "复制"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServerError({ message, digest, onRetry }: ServerErrorProps) {
  // onRetry 未传（/500 演示路由）时退化为刷新当前路由
  const retry = onRetry ?? (() => router.refresh());
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stamp, setStamp] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    setStamp(
      `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(
        d.getMinutes()
      )}:${p(d.getSeconds())}`
    );

    // 全屏层自己滚，锁掉背后文档的滚动，避免双滚动条
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // v70：全页随机警报脉冲 —— 红幕闪 + 巨号 500 撕裂 skew（ref/class 直改，不触发渲染）
  const seizRef = useRef<HTMLHeadingElement>(null);
  const alarmRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let timer = 0;
    let off = 0;
    const pulse = () => {
      if (!alive) return;
      if (alarmRef.current) alarmRef.current.style.opacity = "0.08";
      if (seizRef.current) seizRef.current.classList.add("er-seiz");
      off = window.setTimeout(() => {
        if (alarmRef.current) alarmRef.current.style.opacity = "0";
        if (seizRef.current) seizRef.current.classList.remove("er-seiz");
      }, 150 + Math.random() * 110);
      timer = window.setTimeout(pulse, 2600 + Math.random() * 2600);
    };
    timer = window.setTimeout(pulse, 1900);
    return () => {
      alive = false;
      window.clearTimeout(timer);
      window.clearTimeout(off);
    };
  }, []);

  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else router.push("/");
  };

  if (!mounted) return <div className="fixed inset-0 z-[190]" style={{ background: BG }} />;

  return createPortal(
    <div
      className="er-root fixed inset-0 z-[190] overflow-y-auto font-sans antialiased"
      style={{ background: BG, color: INK }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* 背景：纯黑底 + canvas 01 数字雨 + 一道绿扫光，没有别的纹理层 */}
      <BinaryRain />
      <div className="er-beam pointer-events-none fixed inset-x-0 top-0 z-0" />
      {/* 电压波动层：最上面但不吃事件 */}
      <div className="er-flash pointer-events-none fixed inset-0 z-30" />
      {/* v70 随机警报层：红幕，opacity 由脉冲 effect 驱动 */}
      <div ref={alarmRef} className="er-alarm pointer-events-none fixed inset-0 z-30" />

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center px-6 pb-9 pt-9 sm:px-10 sm:pb-12 sm:pt-10">
        {/* 警示带：上下各一条滚动斜纹，中间是黑底白字的状态行 */}
        <div className="er-jit-c">
                    <div
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-x-2 px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] sm:text-[11px]"
            style={{ borderColor: LINE, color: BLUE }}
          >
            <span className="flex items-center gap-2.5">
              <span className="er-live inline-block h-2 w-2" style={{ background: RED }} />
              SYSTEM FAILURE · 系统内部错误
            </span>
            <span style={{ color: MUTE }}>{stamp || "—"}</span>
          </div>
                  </div>


        {/* 巨号 500（红蓝错版分离） + 竖排状态字 */}
        <div className="er-jit-a mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
          <h1
            ref={seizRef}
            className="er-code text-[clamp(3.5rem,min(12vw,16vh),11rem)]"
            aria-label="500 internal server error"
          >
            500
          </h1>
          <div className="mb-2 flex items-center gap-3">
            <span className="block h-8 w-1 sm:h-10" style={{ background: RED }} />
            <span
              className="font-mono text-[10px] font-bold uppercase leading-4 tracking-[0.3em] sm:text-[11px] sm:leading-5"
              style={{ color: MUTE }}
            >
              internal
              <br />
              server error
            </span>
          </div>
        </div>

        <p
          className="er-title mt-4 text-[clamp(1rem,min(2.4vw,3vh),1.6rem)] font-black leading-[1.2] tracking-[-0.03em]"
          style={{ color: INK }}
        >
          页面渲染时出错，这次请求已被中断。
        </p>

        <FaultAddress />

        <p className="er-desc mt-4 max-w-2xl text-sm font-medium leading-6 sm:text-[15px] sm:leading-7" style={{ color: MUTE }}>
          页面在渲染时抛出了未捕获的异常。可以先重试一次；如果反复出现，
          说明问题不在网络，而在代码本身 —— 这时重试没有意义，请改用下方入口离开本页。
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={retry}
            className="border-2 px-6 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors"
            style={{ borderColor: RED, background: RED, color: BG }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = RED;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = RED;
              e.currentTarget.style.color = BG;
            }}
          >
            重试
          </button>

          <Link
            href="/"
            className="border-2 px-6 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors"
            style={{ borderColor: BLUE, color: BLUE }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = BLUE;
              e.currentTarget.style.color = BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = BLUE;
            }}
          >
            返回首页
          </Link>

          <button
            type="button"
            onClick={goBack}
            className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] underline-offset-4 transition-opacity hover:underline"
            style={{ color: MUTE }}
          >
            返回上一页
          </button>
        </div>

        {/* 错误详情改为弹窗，不再把页面撑高 */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="border-b border-dashed font-mono text-[11px] font-bold tracking-[0.15em] transition-opacity hover:opacity-70"
            style={{ color: MUTE, borderColor: MUTE }}
          >
            展开错误详情 +
          </button>
        </div>
      </div>

      {/* 两条日志跑马灯：顶部向右滚、底部向左滚，方向相反 */}
      <Ticker reverse edge="top" />
      <Ticker />

      {modalOpen && (
        <ErrorModal
          message={message}
          digest={digest}
          stamp={stamp}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>,
    document.body
  );
}