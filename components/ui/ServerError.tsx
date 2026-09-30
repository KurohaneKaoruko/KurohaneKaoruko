"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

/**
 * 500 页面（服务器内部错误）—— v73.1「SIGNAL DISTURBED · 纯色海报」。
 *
 * 【形态】纯红告警色场 + 巨号 500 + 黑点光标，没有背景动效。
 * v72 各版（波浪线 / 纸带 / 隐场纸带）在低端设备上实测卡顿，应要求
 * 全部移除；保留的动效都是零 rAF 循环的 CSS 级：
 *   - 黑点光标：8px 墨点以 CSS transition 缓动跟随指针，
 *     悬停链接 / 按钮时 scale 2.4 放大做提示（原 pen 的 a-waves::before）；
 *   - 巨号 500 指针视差：mousemove 写归一化 --px/--py（-1..1），
 *     位移与缓动都在 .er-parallax 的 transform + transition 里。
 *
 * 【旧版元素回归】v71 的 01 噪声串复刻进 FaultAddress：
 * 十六进制故障地址后面跟一串从 GARBAGE 池（01001101▓▒░#*+-=）跳动的噪声字符，
 * 同一个 240ms 定时器一起翻，reduced-motion 下静止。
 * 另有三件 v71 词汇按新配色重制：500 故障闪烁（clip-path 切片撕裂 ——
 * PAPER/RED_HOT 两层切片副本各咬一条横带错位平移，6.1s/4.7s 互质周期
 * steps 跳变，包裹层 4.3s 微抖频闪）、事故日志跑马灯
 * （LOG_LINES 原样，对拉双带：底带向左、顶带向右）。全部 CSS 动画。
 * （标题重影试过又撤了 —— 2px 色差在 20px 中文上只会显脏，
 * 错版分离只留给展示级的巨号 500。）
 *
 * 【量子涨落】十六进制字符（0-9A-F）闪现衰减，分布跟指针走：
 * 黑点附近 10-70px 内成簇爆发（每拍 3-4 个、8-12px、寿命 0.3-0.55s，
 * 故障感的主要来源），全域另维持稀疏环境颗粒；避开小字文本块。
 * 纯 DOM + CSS 动画（70ms 一拍，自毁，并发封顶 80）；
 * reduced-motion / 后台标签不跑。
 *
 * 【配色】取参考的「结构」而非色值：一整片高饱和色场 + 近黑墨色。
 * 红对 500 是语义色（告警），黑即墨；暖白只出现在黑底弹窗里。
 * 仍然【不跟随站点主题】—— 这类页面出现在「站点已经出问题」的时刻，
 * 不该再依赖可能一起坏掉的主题状态。
 *
 * 【与 404 拉开】404 是黑底故障字符画 + 红蓝霓虹；500 是纯红海报，
 * 从载体到色彩彻底分家。
 *
 * 【排版】单屏海报：上下两条 mono 状态条 + 左对齐展示列
 * （眉题 / 巨号 500 / 标题 / 说明 / 动作）。字号跨度 ≈ 20×。
 * 错误详情仍在黑底弹窗里（Esc / 遮罩 / 复制）。
 */

/** 固定色板（不走主题令牌）：红场 + 黑墨 + 弹窗内的暖白 */
const GROUND = "#ee1233"; // 色场：告警红
const INK = "#170208"; // 墨：线条 / 展示字 / 按钮
const INK_SOFT = "rgba(23,2,8,0.7)"; // 次要文字
const HAIR = "rgba(23,2,8,0.28)"; // 发丝线
const PAPER = "#ffece6"; // 暖白（弹窗文字）
const RED_HOT = "#ff5464"; // 弹窗黑底上的红（GROUND 的提亮档）

const CSS = `
.er-root ::selection { background: ${INK}; color: ${GROUND}; }

/* 状态点呼吸 */
.er-dot { animation: erDot 1.6s ease-in-out infinite; }
@keyframes erDot {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.25; }
}

/* 弹窗入场 */
.er-modal { animation: erModalIn 0.16s ease-out both; }
@keyframes erModalIn {
  from { opacity: 0; transform: translateY(8px) scale(0.985); }
  to   { opacity: 1; transform: none; }
}

/* 光标点：原 pen 的 a-waves::before —— 8px 墨点，CSS transition 缓动跟随
   （无 rAF、无循环；自定义属性变化驱动 transform，过渡交给合成器）。
   悬停可交互元素时 scale(var(--s)) 放大做提示 */
.er-cursor::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: ${INK};
  transform: translate3d(calc(var(--x, -100px) - 50%), calc(var(--y, -100px) - 50%), 0)
    scale(var(--s, 1));
  transition: transform 0.15s ease-out;
  will-change: transform;
}

/* 量子涨落：随机闪现的十六进制字符，出现即衰减隐没 */
@keyframes erFoam {
  0%   { opacity: 0; }
  12%  { opacity: 1; }
  100% { opacity: 0; }
}
.er-foam {
  position: absolute;
  font-family: var(--font-roboto-mono), ui-monospace, monospace;
  font-weight: 700;
  color: ${INK};
  animation: erFoam var(--d, 0.7s) ease-out both;
  user-select: none;
}

/* 旧版 v71 词汇重制 · 500 故障闪烁：切片撕裂版。
   基座数字静止（视差照常），爆发瞬间两层切片副本各自咬住一条水平带
   错位平移 —— PAPER 咬上带、RED_HOT 咬下带 —— 加上包裹层的微抖频闪。
   三个周期（6.1s / 4.7s / 4.3s）互质，每次爆的几何都不同；
   steps(1) 让切片是「跳」不是「滑」。平时完全隐形。 */
.er-code { position: relative; }
.er-code::before,
.er-code::after {
  content: "500";
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  opacity: 0;
}
.er-code::before {
  color: ${PAPER};
  z-index: -1;
  clip-path: inset(0 0 100% 0);
  animation: erSliceA 6.1s steps(1, end) infinite;
}
.er-code::after {
  color: ${RED_HOT};
  clip-path: inset(100% 0 0 0);
  animation: erSliceB 4.7s steps(1, end) infinite;
}
@keyframes erSliceA {
  0%, 90.6%, 94%, 100% { opacity: 0; transform: translateX(0); clip-path: inset(0 0 100% 0); }
  91%   { opacity: 1; transform: translateX(-9px); clip-path: inset(8% 0 64% 0); }
  92.4% { opacity: 1; transform: translateX(6px);  clip-path: inset(34% 0 38% 0); }
  93.4% { opacity: 1; transform: translateX(-3px); clip-path: inset(58% 0 12% 0); }
}
@keyframes erSliceB {
  0%, 73.6%, 78.4%, 100% { opacity: 0; transform: translateX(0); clip-path: inset(100% 0 0 0); }
  74%   { opacity: 1; transform: translateX(8px);  clip-path: inset(60% 0 4% 0); }
  75.4% { opacity: 1; transform: translateX(-7px); clip-path: inset(28% 0 44% 0); }
  77%   { opacity: 1; transform: translateX(4px);  clip-path: inset(72% 0 10% 0); }
}

/* 故障爆发时基座的微抖 + 频闪（挂在 h1 包裹层，不碰视差 transform） */
.er-tear { animation: erTear 4.3s steps(1, end) infinite; }
@keyframes erTear {
  0%, 46.4%, 48.2%, 93.4%, 96.6%, 100% { transform: none; opacity: 1; }
  47%    { transform: translate(4px, 0); opacity: 0.96; }
  47.6%  { transform: translate(-2px, 1px); opacity: 1; }
  94%    { transform: translate(-6px, 1px) skewX(-3deg); opacity: 0.86; }
  95%    { transform: translate(6px, -1px) skewX(2deg); opacity: 1; }
  96%    { transform: translate(-2px, 0); opacity: 0.94; }
}

/* 旧版 v71 词汇 · 事故日志跑马灯（对拉双带：底带向左滚、顶带向右滚）。
   贴边距离由 JS 按状态条实际高度写入（ResizeObserver 跟随），
   贴合边不画自己的描线 —— 接缝只留状态条那一条线，不会出现双线 */
.er-tape {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 40px; /* JS 会按底栏实测高度覆写 */
  z-index: 20;
  overflow: hidden;
  pointer-events: none;
  border-top: 1px solid ${HAIR};
  background: ${GROUND};
}
.er-tape-top {
  top: 40px; /* JS 会按顶栏实测高度覆写 */
  bottom: auto;
  border-top: none;
  border-bottom: 1px solid ${HAIR};
}
.er-tape-row {
  display: flex;
  width: max-content;
  animation: erTicker 26s linear infinite;
}
@keyframes erTicker {
  to { transform: translateX(-50%); }
}
.er-tape-rev .er-tape-row {
  animation-name: erTickerRev;
}
@keyframes erTickerRev {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}

/* 巨号 500 的指针视差：--px/--py 由 mousemove 写入（-1..1），缓动交给 transition */
.er-parallax {
  transform: translate3d(calc(var(--px, 0) * 12px), calc(var(--py, 0) * 8px), 0);
  transition: transform 0.35s ease-out;
}

/* 按钮按下 */
.er-btn:active { transform: translateY(1px); }

/* 键盘焦点：红场上用墨色，黑弹窗里用暖白 */
.er-focus:focus-visible { outline: 2px solid ${INK}; outline-offset: 3px; }
.er-focus-inv:focus-visible { outline: 2px solid ${PAPER}; outline-offset: 3px; }

/* 矮屏收起长说明，保住「内容不超一屏」 */
@media (max-height: 620px) {
  .er-desc { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .er-root, .er-root * { animation: none !important; transition: none !important; }
  .er-cursor::after { display: none; }
}
`;

const HEX = "0123456789ABCDEF";
const GARBAGE = "01001101▓▒░#*+-="; // 旧版 v71 的噪声字符池，原样复刻（应要求补上 -=）

/** 旧版 v71 的事故日志片段，原样复刻（跑马灯内容） */
const LOG_LINES = [
  "SIGSEGV @ 0x00007f3a4c21",
  "render.component → unhandled",
  "retry 1/1 · backoff none",
  "runtime.state = HALTED",
  "awaiting operator input",
  "build 2026.09 · node 10000",
];

/**
 * 事故日志跑马灯（旧版对拉双带）：默认贴底栏上缘向左滚；
 * edge="top" 时贴顶栏下缘向右滚（reverse）。两遍拼接无缝循环。
 * 贴边距离按对应状态条的实测高度写入（ResizeObserver 跟随字体加载
 * 与视口变化），贴合边不画自己的描线，接缝只有一条线。
 */
function IncidentTape({ edge = "bottom" }: { edge?: "top" | "bottom" }) {
  const top = edge === "top";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bar = document.querySelector(top ? ".er-topbar" : ".er-bottombar");
    if (!bar) return;
    const apply = () => {
      const h = bar.getBoundingClientRect().height;
      if (top) el.style.top = `${h}px`;
      else el.style.bottom = `${h}px`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(bar);
    return () => ro.disconnect();
  }, [top]);

  return (
    <div
      ref={ref}
      className={"er-tape" + (top ? " er-tape-top er-tape-rev" : "")}
      aria-hidden="true"
    >
      <div className="er-tape-row font-mono text-[9px] font-bold uppercase tracking-[0.18em]">
        {[0, 1].map((copy) => (
          <span key={copy} className="flex shrink-0 gap-8 whitespace-nowrap px-4 py-1">
            {LOG_LINES.map((l, i) => (
              <span key={l} style={{ color: i % 2 === 0 ? INK_SOFT : "rgba(23,2,8,0.45)" }}>
                {"// " + l}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 黑点光标：原 pen 的 a-waves::before。监听指针写 CSS 变量，
 * 缓动交给 CSS transition —— 没有 rAF 循环，开销可以忽略。
 * 触屏时跟随手指；悬停在链接 / 按钮上时墨点放大（--s）；
 * reduced-motion 下整个隐藏。
 */
function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (x: number, y: number) => {
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    };
    const onMouseMove = (e: MouseEvent) => move(e.pageX, e.pageY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) move(t.pageX, t.pageY);
    };
    // 悬停可交互元素时墨点放大（事件委托，一次绑定）
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      el.style.setProperty("--s", t && t.closest("a,button") ? "2.4" : "1");
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("pointerover", over);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="er-cursor pointer-events-none fixed inset-0 z-0 overflow-hidden"
    />
  );
}

/**
 * 量子涨落：随机闪现的十六进制字符（0-9A-F），出现即衰减隐没。
 * 分布跟指针走 —— 黑点附近 20-150px 内成簇爆发（每拍 2-3 个、8-12px、
 * 短寿命 0.3-0.55s，营造故障感），其余区域维持稀疏的环境颗粒；
 * 只避开小字文本块（.er-quiet）。纯 DOM + CSS 动画（70ms 一拍，
 * 动画结束自毁，并发封顶 80）；reduced-motion / 后台标签不跑。
 */
function QuantumFoam() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    const quiet = layer.parentElement?.querySelector(".er-quiet") ?? null;
    const mouse = { x: 0, y: 0, set: false };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.pageX;
      mouse.y = e.pageY;
      mouse.set = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        mouse.x = t.pageX;
        mouse.y = t.pageY;
        mouse.set = true;
      }
    };

    /** 在 (x, y) 播一个字符；落进静区就放弃（调用方负责换点重试） */
    const spawnOne = (x: number, y: number, sMin: number, sMax: number, dMin: number, dMax: number) => {
      if (document.hidden || layer.childElementCount >= 80) return false;
      const rect = quiet?.getBoundingClientRect();
      if (rect && x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) return false;
      const s = document.createElement("span");
      s.className = "er-foam";
      s.textContent = HEX[(Math.random() * 16) | 0];
      s.style.left = `${x.toFixed(0)}px`;
      s.style.top = `${y.toFixed(0)}px`;
      s.style.fontSize = `${sMin + ((Math.random() * (sMax - sMin + 1)) | 0)}px`;
      s.style.animationDuration = `${(dMin + Math.random() * (dMax - dMin)).toFixed(2)}s`;
      s.addEventListener("animationend", () => s.remove(), { once: true });
      layer.appendChild(s);
      return true;
    };

    // 指针附近取样：10-70px 窄环，配合每拍 3-4 个，簇更密
    const nearCursor = () => {
      const a = Math.random() * Math.PI * 2;
      const r = 10 + Math.random() * 60;
      return [mouse.x + Math.cos(a) * r, mouse.y + Math.sin(a) * r] as const;
    };
    // 全域取样：顶底状态条以内
    const anywhere = () =>
      [16 + Math.random() * (window.innerWidth - 32), 56 + Math.random() * (window.innerHeight - 112)] as const;

    const tick = () => {
      // 指针簇：窄环内 3-4 个/拍，密集短促，故障感的主要来源
      if (mouse.set) {
        const n = 3 + ((Math.random() * 2) | 0);
        for (let i = 0; i < n; i++) {
          const [x, y] = nearCursor();
          if (!spawnOne(x, y, 8, 12, 0.3, 0.55)) {
            // 撞进静区：绕着指针换点补两枪
            for (let k = 0; k < 2; k++) {
              const [nx, ny] = nearCursor();
              if (spawnOne(nx, ny, 8, 12, 0.3, 0.55)) break;
            }
          }
        }
      }
      // 环境涨落：全域稀疏颗粒
      if (Math.random() < 0.45) {
        const [x, y] = anywhere();
        if (!spawnOne(x, y, 9, 13, 0.5, 0.95)) {
          const [nx, ny] = anywhere();
          spawnOne(nx, ny, 9, 13, 0.5, 0.95);
        }
      }
    };

    timer = window.setInterval(tick, 70);
    const onVisibility = () => {
      if (document.hidden) {
        window.clearInterval(timer);
        timer = 0;
      } else if (!timer) {
        timer = window.setInterval(tick, 70);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      layer.textContent = "";
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    />
  );
}

/**
 * 故障地址行：直接改 DOM 文本，不走 React state（与 v71 同一套纪律）。
 * reduced-motion 下完全静止。
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
    }, 240);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="hidden sm:inline">
      {" · FAULT "}
      <span ref={addrRef} style={{ color: INK }}>
        0x00007F3A4C21
      </span>
      {" · "}
      <span ref={noiseRef} style={{ color: INK_SOFT }}>
        01001101▓▒░
      </span>
    </span>
  );
}

type ServerErrorProps = {
  /** 已截断的错误信息 */
  message: string;
  digest?: string;
  /** 错误边界的重试入口；可选 —— /500 演示路由不传，默认 router.refresh() */
  onRetry?: () => void;
};

/** 错误详情弹窗：黑底红饰，不占页面高度；Esc / 点遮罩 / 关闭按钮都能退 */
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
        style={{ background: "rgba(23,2,8,0.88)" }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="错误详情"
        className="er-modal relative flex max-h-[80vh] w-full max-w-3xl flex-col border"
        style={{
          borderColor: "rgba(255,84,100,0.4)",
          background: INK,
          boxShadow: "0 0 0 1px rgba(255,84,100,0.18), 0 24px 70px rgba(0,0,0,0.92)",
        }}
      >
        <div
          className="flex items-center justify-between gap-4 border-b px-4 py-2.5"
          style={{ borderColor: "rgba(255,84,100,0.4)" }}
        >
          <span
            className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em]"
            style={{ color: RED_HOT }}
          >
            <span className="er-dot inline-block h-2 w-2" style={{ background: RED_HOT }} />
            error trace
          </span>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="er-focus-inv font-mono text-xs font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
            style={{ color: PAPER }}
          >
            esc / 关闭 ✕
          </button>
        </div>

        <dl className="border-b" style={{ borderColor: "rgba(255,84,100,0.22)" }}>
          {report.map((r, i) => (
            <div
              key={r.label}
              className={
                "grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[8rem_minmax(0,1fr)]" +
                (i > 0 ? " border-t" : "")
              }
              style={{ borderColor: "rgba(255,84,100,0.22)" }}
            >
              <dt
                className="whitespace-nowrap border-r px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] sm:px-4"
                style={{ borderColor: "rgba(255,84,100,0.22)", color: "rgba(255,236,230,0.5)" }}
              >
                {r.label}
              </dt>
              <dd
                className="px-3 py-2 font-mono text-[13px] font-medium sm:px-4 sm:text-sm"
                style={r.alert ? { color: RED_HOT, fontWeight: 700 } : { color: PAPER }}
              >
                {r.value}
              </dd>
            </div>
          ))}
        </dl>

        <pre
          className="flex-1 overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-[12px] font-medium leading-6"
          style={{ color: PAPER }}
        >
          {body}
        </pre>

        <div
          className="flex items-center justify-between gap-4 border-t px-4 py-2.5"
          style={{ borderColor: "rgba(255,84,100,0.22)" }}
        >
          <span
            className="font-mono text-[10px] font-bold uppercase tracking-[0.24em]"
            style={{ color: "rgba(255,236,230,0.5)" }}
          >
            仅用于排查，不会上报
          </span>
          <button
            type="button"
            onClick={copy}
            className="er-focus-inv border px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
            style={{
              borderColor: RED_HOT,
              color: copied ? INK : RED_HOT,
              background: copied ? RED_HOT : "transparent",
            }}
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
  const router = useRouter();
  const retry = onRetry ?? (() => router.refresh());
  const [mounted, setMounted] = useState(false);
  const [stamp, setStamp] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const codeRef = useRef<HTMLHeadingElement>(null);

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

  // 巨号 500 的指针视差：mousemove 只写两个归一化 CSS 变量（-1..1），
  // 缓动与位移都交给 CSS（.er-parallax），零 rAF 循环
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = codeRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      el.style.setProperty("--px", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      el.style.setProperty("--py", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const fireRetry = () => {
    retry();
  };

  const goBack = () => {
    if (window.history.length > 1) window.history.back();
    else router.push("/");
  };

  if (!mounted) return <div className="fixed inset-0 z-[190]" style={{ background: GROUND }} />;

  return createPortal(
    <div
      className="er-root fixed inset-0 z-[190] overflow-y-auto font-sans antialiased"
      style={{ background: GROUND, color: INK }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* 黑点光标 + 量子涨落：仅有的两个常驻动效，都是零 rAF 循环 */}
      <CursorDot />
      <QuantumFoam />

      {/* 旧版 v71 的事故日志跑马灯（对拉双带）：顶带向右、底带向左 */}
      <IncidentTape edge="top" />
      <IncidentTape />

      {/* 顶部状态条 */}
      <header
        className="er-topbar pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-4 border-b px-5 py-3 sm:px-8"
        style={{ borderColor: HAIR, background: GROUND }}
      >
        <span className="flex items-center gap-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em]">
          <span className="er-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: INK }} />
          signal disturbed · 信号异常
        </span>
        <span
          className="hidden font-mono text-[10px] font-medium tracking-[0.18em] sm:inline"
          style={{ color: INK_SOFT }}
        >
          {stamp || "--:--:--"}
        </span>
      </header>

      {/* 主列：左对齐非对称排版，纯红海报 + 巨号 500 */}
      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center px-6 pb-24 pt-24 sm:px-12">
        {/* 撕裂挂在包裹层：er-tear 的 animation transform 与 h1 的视差 transform 互不覆盖 */}
        <div className="er-tear">
          <h1
            ref={codeRef}
            className="er-code er-parallax select-none text-[clamp(8rem,min(26vw,34vh),22rem)] font-black leading-[0.8] tracking-[-0.045em]"
            aria-label="500 internal server error"
          >
            500
          </h1>
        </div>

        <div className="er-quiet mt-8 max-w-xl">
          <p
            className="font-mono text-[10px] font-bold uppercase tracking-[0.34em] sm:text-[11px]"
            style={{ color: INK_SOFT }}
          >
            HTTP 500 — INTERNAL SERVER ERROR
          </p>
          <p className="mt-4 text-[clamp(1.15rem,min(2.6vw,3.2vh),1.5rem)] font-bold leading-[1.45] tracking-[-0.01em]">
            信号在这里中断了。
          </p>
          <p
            className="er-desc mt-3 text-sm font-medium leading-[1.75] sm:text-[15px]"
            style={{ color: INK_SOFT }}
          >
            页面在渲染时抛出了未捕获的异常。如果反复出现，说明问题多半不在网络，
            而在代码本身。这时重试已经没有意义，请改用下方入口离开本页。
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <button
              type="button"
              onClick={fireRetry}
              className="er-btn er-focus border-2 border-[#170208] bg-[#170208] px-7 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#ee1233] transition-colors hover:bg-transparent hover:text-[#170208]"
            >
              重试
            </button>

            <Link
              href="/"
              className="er-btn er-focus border-2 border-[#170208] bg-transparent px-7 py-3 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#170208] transition-colors hover:bg-[#170208] hover:text-[#ee1233]"
            >
              返回首页
            </Link>

            <button
              type="button"
              onClick={goBack}
              className="er-focus px-1 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
              style={{ color: INK_SOFT }}
            >
              返回上一页 ↩
            </button>
          </div>
        </div>
      </div>

      {/* 底部信息条 */}
      <footer
        className="er-bottombar fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 border-t px-5 py-3 sm:px-8"
        style={{ borderColor: HAIR, background: GROUND }}
      >
        <span
          className="overflow-hidden font-mono text-[10px] font-medium tracking-[0.16em]"
          style={{ color: INK_SOFT }}
        >
          DIGEST <span style={{ color: INK }}>{digest ?? "—"}</span>
          <FaultAddress />
        </span>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="er-focus shrink-0 border-b pb-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-70 sm:text-[11px]"
          style={{ borderColor: "rgba(23,2,8,0.5)" }}
        >
          展开错误详情 +
        </button>
      </footer>

      {modalOpen && (
        <ErrorModal message={message} digest={digest} stamp={stamp} onClose={() => setModalOpen(false)} />
      )}
    </div>,
    document.body
  );
}
