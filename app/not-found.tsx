"use client";

/* v45: 白团视口内垂直+水平双居中（修正蒙版偏下）+ 高度不超视口 + fs 回归 8.219px +
   光栅 146×129 竖幅窗（发顶贴窗顶、领口下裁除、零变形）+ 15 值字符集 +
   首帧布局与 resize 同源（computeLayout 纯函数单源） */

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { ASCII_COLS, ASCII_FPS, ASCII_FRAME0, ASCII_ROWS } from "./ascii-frames";

type MaskSpec = {
  hx: number; hy: number; // 初始/锚点位置
  w0: number; h0: number; // 基准尺寸（伸缩围绕该级别往复）
  move: number; // 单步位移幅度上限（容器点）
  sizeK: number; // 单步尺寸伸缩上限（占比）
  durBase: number; durJit: number; // 步进间隔（秒）＝ base + rand×jit
  clamp: number; // 离家上限（容器点）
  a1: number; // ≤1% 正弦微扰幅度
  s1: number; // 微扰速度
  p1: number; // 微扰相位
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smoothstep(x: number): number {
  const c = x < 0 ? 0 : x > 1 ? 1 : x;
  return c * c * (3 - 2 * c);
}

function clampTo(v: number, home: number, range: number): number {
  const min = Math.max(-5, home - range);
  const max = Math.min(105, home + range);
  return Math.min(max, Math.max(min, v));
}

function clampSize(v: number, base: number, k: number): number {
  return Math.min(base * (1 + k), Math.max(base * (1 - k), v));
}

const ROW_PX_EM = 0.933; // 行距系数（em），与 .nf-field line-height 一致
// 左侧 GIF 处理残留裁切：bin 数据 col 0 含 ~21% 散点噪声（"边缘线"），cols 1..5 全空白。
// 裁 2 列保险（.ts 首 11 列本就空白，无内容损失；裁后实际显示 144 列，仍由 ASCII_COLS 描述原始数据）。
const LEFT_TRIM = 2;
const trimLeftEdge = (s: string): string =>
  s.split("\n").map(l => l.length > LEFT_TRIM ? l.slice(LEFT_TRIM) : "").join("\n");

type NfLayout = {
  fs: number; // 字号（px）
  stageH: number; // 白团高（px）= vh（贴住窗口高度）
  rowEm: number; // 行距系数（em）= pitch × 0.933（保持原设计单元宽高比）
  letterEm: number; // 字距（em）= 0.3（半个字符）
};



// 布局单源（v44 修复 / v45 收敛）：首帧挂载与 resize 走同一纯函数——同视口输入必得同输出，
// 保证首次渲染与 resize 后 fs/网格维度/装饰带列数零差异。
// fs = min(容器宽/146, 视口高/(129×0.933))；白团高 = 129×0.933×fs ≤ 视口高（永不超视口）；
// 容器 CSS 定位视口内垂直+水平双居中（top:50% + translate(-50%,-50%)，禁止顶对齐）。
// 1080p：fs=8.219、白团 1200×989.2 居中（上下留白 45.4px）；矮视口 fs 由高度项压低（零出界优先）。
function computeLayout(): NfLayout {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const containerW = Math.min(vw * 0.92, 1200);
  // 半个字符字距（Roboto Mono 字步进 0.6em 的 1/2）→ 节距 0.9em
  const letterEm = 0.3;
  const pitch = 0.6 + letterEm;
  // 单元宽高比保持原设计 1.0/0.933（数据零变形）→ 行距 rowEm = pitch × 0.933
  const rowEm = pitch * 0.933;
  // fs 由 156×rowEm×fs=vh 反推，宽度为上限
  const fs = Math.min(vh / (ASCII_ROWS * rowEm), containerW / (ASCII_COLS * pitch));
  const stageH = ASCII_ROWS * rowEm * fs; // 画高本身（移动端 fs 受容器宽压制时蒙版同步收缩）
  return { fs, stageH, rowEm, letterEm };
}

const MASK_SPECS: MaskSpec[] = [
  { hx: 50, hy: 19, w0: 74, h0: 24, move: 3, durBase: 0.4, durJit: 0.4, sizeK: 0.12, clamp: 6, a1: 0.8, s1: 0.5, p1: 0.0 },
  { hx: 50, hy: 40, w0: 72, h0: 28, move: 3, durBase: 0.4, durJit: 0.4, sizeK: 0.12, clamp: 6, a1: 0.7, s1: 0.38, p1: 2.1 },
  { hx: 50, hy: 62, w0: 65, h0: 28, move: 3, durBase: 0.4, durJit: 0.4, sizeK: 0.12, clamp: 6, a1: 0.8, s1: 0.45, p1: 4.2 },
  { hx: 38, hy: 82, w0: 53, h0: 26, move: 4, durBase: 0.4, durJit: 0.4, sizeK: 0.12, clamp: 6, a1: 0.9, s1: 0.52, p1: 1.2 },
  { hx: 62, hy: 82, w0: 45, h0: 26, move: 4, durBase: 0.4, durJit: 0.4, sizeK: 0.12, clamp: 6, a1: 0.9, s1: 0.41, p1: 5.2 },
  { hx: 22, hy: 33, w0: 34, h0: 28, move: 9, durBase: 0.2, durJit: 0.3, sizeK: 0.55, clamp: 16, a1: 0.9, s1: 0.33, p1: 3.3 },
  { hx: 78, hy: 35, w0: 34, h0: 28, move: 9, durBase: 0.2, durJit: 0.3, sizeK: 0.55, clamp: 16, a1: 0.9, s1: 0.41, p1: 0.6 },
  { hx: 23, hy: 66, w0: 34, h0: 24, move: 10, durBase: 0.2, durJit: 0.3, sizeK: 0.55, clamp: 16, a1: 1.0, s1: 0.36, p1: 2.6 },
  { hx: 77, hy: 64, w0: 34, h0: 26, move: 10, durBase: 0.2, durJit: 0.3, sizeK: 0.55, clamp: 16, a1: 1.0, s1: 0.48, p1: 3.7 },
  { hx: 50, hy: 12, w0: 30, h0: 9, move: 7, durBase: 0.2, durJit: 0.3, sizeK: 0.55, clamp: 12, a1: 0.8, s1: 0.29, p1: 4.8 },
  { hx: 18, hy: 15, w0: 11, h0: 9, move: 13, durBase: 0.15, durJit: 0.25, sizeK: 0.55, clamp: 13, a1: 1.0, s1: 0.6, p1: 1.4 },
  { hx: 82, hy: 13, w0: 11, h0: 9, move: 13, durBase: 0.15, durJit: 0.25, sizeK: 0.55, clamp: 13, a1: 1.0, s1: 0.55, p1: 4.4 },
  { hx: 14, hy: 48, w0: 10, h0: 13, move: 14, durBase: 0.15, durJit: 0.25, sizeK: 0.55, clamp: 13, a1: 1.0, s1: 0.5, p1: 0.4 },
  { hx: 86, hy: 46, w0: 10, h0: 13, move: 14, durBase: 0.15, durJit: 0.25, sizeK: 0.55, clamp: 13, a1: 1.0, s1: 0.62, p1: 3.8 },
  { hx: 22, hy: 84, w0: 12, h0: 8, move: 15, durBase: 0.15, durJit: 0.25, sizeK: 0.55, clamp: 13, a1: 1.0, s1: 0.45, p1: 2.9 },
  { hx: 50, hy: 90, w0: 18, h0: 6, move: 16, durBase: 0.15, durJit: 0.25, sizeK: 0.55, clamp: 22, a1: 1.0, s1: 0.4, p1: 5.6 },
  { hx: 80, hy: 86, w0: 10, h0: 7, move: 16, durBase: 0.15, durJit: 0.25, sizeK: 0.55, clamp: 22, a1: 1.0, s1: 0.57, p1: 1.6 },
  { hx: 22, hy: 10, w0: 7, h0: 7, move: 16, durBase: 0.15, durJit: 0.25, sizeK: 0.55, clamp: 22, a1: 1.0, s1: 0.63, p1: 0.8 },
];

const MASK_LAYERS = new Array<string>(MASK_SPECS.length);
const MASK_SIZES = new Array<string>(MASK_SPECS.length);
const MASK_POSITIONS = new Array<string>(MASK_SPECS.length);
const MASK_BBOX = new Float64Array(MASK_SPECS.length * 4); // 呼吸变换前视觉 bbox（x0,y0,w,h）

function buildSliceClip(): string {
  const bands = 2 + Math.floor(Math.random() * 2);
  let p = "";
  for (let b = 0; b < bands; b++) {
    const y = Math.random() * 84;
    const h = 4 + Math.random() * 12;
    p += `0 ${y.toFixed(1)}%, 100% ${y.toFixed(1)}%, 100% ${(y + h).toFixed(1)}%, 0 ${(y + h).toFixed(1)}%`;
    if (b < bands - 1) p += ", ";
  }
  return `polygon(${p})`;
}

const CSS = `

/* 白团容器（v45 双居中 + 动态几何）：宽 min(1200px, 92vw)；
   高 = 129 行 × 0.933em × fs（内联样式由 computeLayout 定稿，CSS 仅回退占位），
   fs ≤ 视口高/(129×0.933) → 白团高 ≤ 视口高（永不超视口、零裁切）；
   top 50% + translate(-50%,-50%) → 视口内垂直+水平双居中（v45 修正蒙版偏下）；
   白底 #f2f2f2 仅在蒙版层（.nf-mask 填充 = 白团块本体，mask 外露黑）。
   三段式字符画（fs/装饰带列数由 computeLayout 单源计算）印在白团上横排居中。 */
.nf-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(1200px, 92vw);
  height: 989.2px; /* 回退占位（129×0.933×8.219）；实际以内联样式为准 */
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.nf-mask {
  position: absolute;
  inset: 0;
  background: #f2f2f2;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nf-field {
  font-family: var(--font-roboto-mono), ui-monospace, monospace;
  flex-shrink: 0;
  
  font-size: 8.219px; /* 回退占位；实际由内联样式按 computeLayout 定稿 */
  line-height: 0.933; /* 回退占位；实际由内联 lineHeight 按 computeLayout 定稿 */
  letter-spacing: 0.4em; /* 回退占位；实际由内联 letterSpacing 按 computeLayout 定稿 */
  color: #141414;
  white-space: pre;
  user-select: none;
}
.nf-404 {
  font-family: var(--font-roboto-mono), ui-monospace, monospace;
  font-weight: 900;
  font-size: clamp(4.5rem, 15vw, 10rem);
  letter-spacing: -0.02em;
  line-height: 0.9;
}
.nf-g-r, .nf-g-b { position: absolute; inset: 0; animation-timing-function: steps(1, end); animation-iteration-count: infinite; }
.nf-g-r { animation-name: nfGlitchR; animation-duration: 2.7s; }
.nf-g-b { animation-name: nfGlitchB; animation-duration: 3.4s; }
@keyframes nfGlitchR {
  0% { clip-path: inset(0 0 84% 0); transform: translate(-4px, -2px); }
  20% { clip-path: inset(26% 0 54% 0); transform: translate(4px, 1px); }
  40% { clip-path: inset(64% 0 6% 0); transform: translate(-3px, 2px); }
  60% { clip-path: inset(10% 0 68% 0); transform: translate(3px, -1px); }
  80% { clip-path: inset(46% 0 28% 0); transform: translate(-4px, 1px); }
  100% { clip-path: inset(0 0 92% 0); transform: translate(2px, -2px); }
}
@keyframes nfGlitchB {
  0% { clip-path: inset(70% 0 12% 0); transform: translate(4px, 2px); }
  22% { clip-path: inset(8% 0 74% 0); transform: translate(-4px, -1px); }
  44% { clip-path: inset(38% 0 40% 0); transform: translate(3px, 2px); }
  66% { clip-path: inset(82% 0 4% 0); transform: translate(-3px, -2px); }
  88% { clip-path: inset(16% 0 62% 0); transform: translate(2px, 1px); }
  100% { clip-path: inset(56% 0 22% 0); transform: translate(-2px, 1px); }
}
.nf-scan {
  background: repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px);
  animation: nfScanMove 9s linear infinite;
}
@keyframes nfScanMove { to { background-position: 0 9px; } }
.nf-btn { transition: background-color 0.15s ease, color 0.15s ease; }
.nf-btn:hover { background-color: #0b0b0b; color: #f2f2f2; }
@media (prefers-reduced-motion: reduce) {
  .nf-root, .nf-root * { animation: none !important; }
}
`;

export default function NotFound() {
  const field0 = trimLeftEdge(ASCII_FRAME0); // 人物带同步首帧（挂载前初始内容 / 数据未加载期）
  const maskRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLPreElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [layout, setLayout] = useState<NfLayout | null>(null);

  useEffect(() => {
    setMounted(true);
    // 首帧布局（v44 修复核心）：在 portal 渲染前经 state 定稿 fs/白团高/装饰带，
    // 首次提交的 DOM 即为目标尺寸。原缺陷：relayout 在 effect 时点执行，此时
    // mounted 尚为 false、portal 未挂载、全部 ref 为 null，DOM 写入被静默跳过，
    // 首帧回落到 CSS 默认 9.5px（偏大），直至 resize 才被修正。
    setLayout(computeLayout());
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let framesSrc: string[] = [ASCII_FRAME0];
    let alive = true;
    let resizeTimer = 0;

    const paintFrame = (fi: number) => {
      const fEl = fieldRef.current;
      const frame = framesSrc[fi];
      if (!fEl || !frame) return;
      fEl.textContent = frame; // 每帧恒为 ASCII_ROWS 行（生成器逐帧断言维度）
    };

    const states = MASK_SPECS.map((s, i) => {
      const rng = mulberry32(0x4d41534b + i * 0x9e3779b9);
      return {
        fx: s.hx, fy: s.hy, fw: s.w0, fh: s.h0, // 移动起点（当前就位位）
        tx: s.hx, ty: s.hy, tw: s.w0, th: s.h0, // 目标
        moveT0: 0, // 本次移动开始时刻
        nextStepT: 0, // 下次步进时刻
        rng,
      };
    });
    let lastMaskCss = ""; // 上次写入的蒙版 CSS 签名（热修：无变化帧跳过 style 写入，避免强制样式解析）
    const writeMaskStyles = (el: HTMLDivElement) => {
      const img = MASK_LAYERS.join(", ");
      const size = MASK_SIZES.join(", ");
      const pos = MASK_POSITIONS.join(", ");
      const sig = `${img}|${size}|${pos}`;
      if (sig === lastMaskCss) return;
      lastMaskCss = sig;
      el.style.webkitMaskImage = img;
      el.style.maskImage = img;
      el.style.webkitMaskSize = size;
      el.style.maskSize = size;
      el.style.webkitMaskPosition = pos;
      el.style.maskPosition = pos;
      el.style.webkitMaskRepeat = "no-repeat";
      el.style.maskRepeat = "no-repeat";
    };

    // 呼吸档位跳变状态（effect 作用域，跨帧持久；专用播种 RNG 保持确定性）
    const BREATH_STEPS = [0.92, 0.96, 1.0, 1.03];
    let breathIdx = 2;
    let breathNextT = 1.5;
    const breathRng = mulberry32(0xb2ea71);

    const paintMask = (t: number) => {
      const el = maskRef.current;
      if (!el) return;
      const driftX = 1.8 * Math.sin(t * 0.21 + 0.9) + 1.1 * Math.sin(t * 0.08 + 2.4);
      const driftY = 1.5 * Math.cos(t * 0.17 + 1.3) + 0.9 * Math.sin(t * 0.06 + 0.5);
      let areaSum = 0, wSumX = 0, wSumY = 0;
      for (let k = 0; k < MASK_SPECS.length; k++) {
        const s = MASK_SPECS[k];
        const r = states[k];
        // 步进点（glitch 跳变）：t ≥ 步进时刻 → 就位到目标 + 抽下一目标。
        // 移动用 0.055s 极速插值（「抖动就位」），之后保持静止至下次步进。
        if (t >= r.nextStepT) {
          r.fx = r.tx; r.fy = r.ty; r.fw = r.tw; r.fh = r.th;
          r.tx = clampTo(r.fx + (r.rng() * 2 - 1) * s.move, s.hx, s.clamp);
          r.ty = clampTo(r.fy + (r.rng() * 2 - 1) * s.move, s.hy, s.clamp);
          r.tw = clampSize(r.fw * (1 + (r.rng() * 2 - 1) * s.sizeK), s.w0, s.sizeK);
          r.th = clampSize(r.fh * (1 + (r.rng() * 2 - 1) * s.sizeK), s.h0, s.sizeK);
          r.moveT0 = t;
          r.nextStepT = t + s.durBase + r.rng() * s.durJit;
        }
        const u = Math.min(1, (t - r.moveT0) / 0.055);
        const e = smoothstep(u);
        const cx = r.fx + (r.tx - r.fx) * e + s.a1 * Math.sin(t * s.s1 + s.p1) + (k < 5 ? driftX : 0);
        const cy = r.fy + (r.ty - r.fy) * e + s.a1 * Math.cos(t * s.s1 * 0.9 + s.p1) + (k < 5 ? driftY : 0);
        const w = r.fw + (r.tw - r.fw) * e;
        const h = r.fh + (r.th - r.fh) * e;
        const x0 = (100 - w) * cx / 100; // CSS mask-position % 语义 → 视觉左上角
        const y0 = (100 - h) * cy / 100;
        const b = k * 4;
        MASK_BBOX[b] = x0; MASK_BBOX[b + 1] = y0; MASK_BBOX[b + 2] = w; MASK_BBOX[b + 3] = h;
        const a = w * h;
        areaSum += a; wSumX += a * (x0 + w / 2); wSumY += a * (y0 + h / 2);
      }
      const anchorX = areaSum > 0 ? wSumX / areaSum : 50;
      const anchorY = areaSum > 0 ? wSumY / areaSum : 50;
      // 呼吸档位随机跳变（glitch 化）：档位 {0.92,0.96,1.00,1.04}、每 1.5-3s
      // 随机跳一档（专用播种 RNG 保持确定性），替代连续正弦呼吸
      if (t >= breathNextT) {
        breathIdx = Math.floor(breathRng() * BREATH_STEPS.length);
        breathNextT = t + 1.5 + breathRng() * 1.5;
      }
      const br = BREATH_STEPS[breathIdx];
      for (let k = 0; k < MASK_SPECS.length; k++) {
        const b = k * 4;
        const x0 = MASK_BBOX[b], y0 = MASK_BBOX[b + 1], w = MASK_BBOX[b + 2], h = MASK_BBOX[b + 3];
        const nw = w * br, nh = h * br; // 峰值 w≈49×0.97≪100，(100−nw) 无除零
        const nx0 = anchorX + (x0 - anchorX) * br;
        const ny0 = anchorY + (y0 - anchorY) * br;
        MASK_LAYERS[k] = "linear-gradient(#000, #000)";
        MASK_SIZES[k] = `${nw.toFixed(2)}% ${nh.toFixed(2)}%`;
        MASK_POSITIONS[k] = `${((nx0 * 100) / (100 - nw)).toFixed(2)}% ${((ny0 * 100) / (100 - nh)).toFixed(2)}%`;
      }
      writeMaskStyles(el);
    };

    if (reduced) {
      // 静态蒙版：portal 提交后一帧绘制（v44：effect 时点 portal 未挂载，ref 为 null 会静默跳过）
      requestAnimationFrame(() => {
        const el = maskRef.current;
        if (!el) return;
        const br = 1.0;
        let areaSum = 0, wSumX = 0, wSumY = 0;
        for (let k = 0; k < MASK_SPECS.length; k++) {
          const s = MASK_SPECS[k];
          const a = s.w0 * s.h0;
          areaSum += a;
          wSumX += a * ((100 - s.w0) * s.hx / 100 + s.w0 / 2);
          wSumY += a * ((100 - s.h0) * s.hy / 100 + s.h0 / 2);
        }
        const anchorX = wSumX / areaSum, anchorY = wSumY / areaSum;
        for (let k = 0; k < MASK_SPECS.length; k++) {
          const s = MASK_SPECS[k];
          const x0 = (100 - s.w0) * s.hx / 100, y0 = (100 - s.h0) * s.hy / 100;
          const nw = s.w0 * br, nh = s.h0 * br;
          const nx0 = anchorX + (x0 - anchorX) * br, ny0 = anchorY + (y0 - anchorY) * br;
          MASK_LAYERS[k] = "linear-gradient(#000, #000)";
          MASK_SIZES[k] = `${nw.toFixed(2)}% ${nh.toFixed(2)}%`;
          MASK_POSITIONS[k] = `${((nx0 * 100) / (100 - nw)).toFixed(2)}% ${((ny0 * 100) / (100 - nh)).toFixed(2)}%`;
        }
        writeMaskStyles(el);
      });
      return;
    }

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setLayout(computeLayout()); // 与首帧同一布局单源（同视口输入 → 同输出）
        lastFrame = -1; // 强制下一轮重写当前帧
      }, 200);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let last = 0;
    let lastFrame = -1;
    let slowFrames = 0; // 帧耗时看门狗计数（连续慢帧 → 安全模式）
    let safeModeWarned = false;
    let pulseOn = false;
    let nextGlitch = 1.5 + Math.random() * 2; // 首个脉冲：1.5-3.5s 后
    let pulseEnd = 0;
    let tearAmp = 0;
    let invEnd = 0;
    let sliceEnd = 0;
    const start = performance.now();

    let framesCtrl: AbortController | null = null; // unmount 时同步 abort（v40 补 cleanup 缺口）
    const loadFrames = async () => {
      const ctrl = new AbortController();
      framesCtrl = ctrl;
      const timer = window.setTimeout(() => ctrl.abort(), 3000);
      try {
        const res = await fetch("/ascii-frames.bin.gz", { signal: ctrl.signal });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
        const text = await new Response(res.body.pipeThrough(new DecompressionStream("gzip"))).text();
        const lines = text.split("\n");
        const frames: string[] = [];
        for (let i = 0; i + ASCII_ROWS <= lines.length; i += ASCII_ROWS) {
          frames.push(lines.slice(i, i + ASCII_ROWS).join("\n"));
        }
        if (!alive || frames.length === 0) return;
        framesSrc = frames.map(trimLeftEdge);
        lastFrame = -1; // 强制重写当前帧
      } catch {
      } finally {
        window.clearTimeout(timer);
      }
    };
    void loadFrames();

    let lastMask = 0; // 蒙版独立 66ms（~15fps）节流（热修：18 层 mask 合成降载，运动均慢速视觉无损）
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const delta = now - last;
      if (delta > 200) {
        slowFrames++;
        if (slowFrames >= 10) {
          cancelAnimationFrame(raf);
          raf = 0;
          if (!safeModeWarned) {
            console.warn("[404] 主线程饱和：字符画动画已进入安全模式（冻结当前帧）");
            safeModeWarned = true;
          }
          return;
        }
      } else {
        slowFrames = 0;
      }
      if (delta < 33) return; // ~30fps
      last = now;
      const t = (now - start) / 1000;

      const fEl = fieldRef.current;
      const fi = Math.floor(t * ASCII_FPS) % framesSrc.length;
      if (fi !== lastFrame) {
        lastFrame = fi;
        paintFrame(fi);
      }

      if (now - lastMask >= 66) {
        lastMask = now;
        paintMask(t);
      }

      if (!pulseOn && t >= nextGlitch) {
        pulseOn = true;
        pulseEnd = t + 0.15 + Math.random() * 0.25; // 持续 150-400ms
        tearAmp = 5 + Math.random() * 15; // 撕裂幅度 5-20px
        invEnd = Math.min(pulseEnd, t + 0.05 + Math.random() * 0.2); // 反色子窗
        sliceEnd = Math.min(pulseEnd, t + 0.04 + Math.random() * 0.22); // 切片子窗
        nextGlitch = t + 1.5 + Math.random() * 2; // 下一次：1.5-3.5s 后
      }
      const mEl = maskRef.current;
      if (pulseOn && mEl) {
        if (t < pulseEnd) {
          if (fEl) fEl.style.transform = `translateX(${((Math.random() * 2 - 1) * tearAmp).toFixed(1)}px)`;
          if (fgRef.current) fgRef.current.style.transform = `translateX(${((Math.random() * 2 - 1) * 2).toFixed(1)}px)`;
          mEl.style.filter = t < invEnd ? "invert(1)" : "";
          mEl.style.clipPath = t < sliceEnd ? buildSliceClip() : "";
        } else {
          if (fEl) fEl.style.transform = "";
          if (fgRef.current) fgRef.current.style.transform = "";
          mEl.style.filter = "";
          mEl.style.clipPath = "";
          pulseOn = false;
        }
      }
    };
    raf = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        window.clearTimeout(resizeTimer);
      } else if (alive && !raf) {
        last = performance.now();
        slowFrames = 0; // 恢复时清零看门狗计数（last 已对齐，不会立刻误触发）
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      if (framesCtrl) framesCtrl.abort(); // v40：unmount 时同步终止进行中的数据请求
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  
  if (!mounted) {
    return <div className="fixed inset-0 z-[80] bg-black" />;
  }

  return createPortal(
    <div className="nf-root fixed inset-0 z-[200] overflow-hidden bg-black text-white">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      
      
      <div ref={stageRef} className="nf-stage" style={layout ? { height: `${layout.stageH.toFixed(2)}px` } : undefined}>
        <div ref={maskRef} className="nf-mask">
          <pre
            ref={fieldRef}
            aria-hidden
            className="nf-field"
            style={layout ? { fontSize: `${layout.fs.toFixed(3)}px`, lineHeight: layout.rowEm.toFixed(3), letterSpacing: `${layout.letterEm.toFixed(4)}em` } : undefined}
          >
            {field0}
          </pre>
        </div>
      </div>

      
      <div ref={fgRef} className="relative z-30 flex min-h-full flex-col items-center justify-center gap-6 px-6 py-12">
        <div className="bg-black/70 px-3 py-1.5">
          <div className="relative z-30 flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] tracking-[0.3em] text-neutral-300">
            <span className="bg-[#ff2a2a] px-1.5 py-0.5 font-bold tracking-[0.2em] text-white">
              ERR_0x194
            </span>
            <span>SIGNAL LOST</span>
            <span className="text-[#7fa5ff]">NODE:KUROHANEKAORUKO</span>
          </div>
        </div>

        
        <div className="nf-404 relative z-30 inline-block select-none">
          <span aria-hidden className="nf-g-b select-none text-[#2f6dff]">
            404
          </span>
          <span aria-hidden className="nf-g-r select-none text-[#ff2a2a]">
            404
          </span>
          <span className="relative select-none text-[#0b0b0b]">404</span>
        </div>

        
        <div className="relative z-30 bg-black px-3 py-1 font-mono text-[12px] font-bold tracking-[0.35em] text-white">
          RECONNECT
        </div>

        <div className="relative z-30 mt-3 flex flex-wrap items-center justify-center gap-4 font-mono text-xs uppercase tracking-[0.25em]">
          <Link
            href="/"
            className="nf-btn bg-[#f2f2f2] border border-black/60 px-5 py-2.5 text-black"
          >
            返回首页 / HOME
          </Link>
          <Link
            href="/projects/"
            className="nf-btn bg-[#f2f2f2] border border-black/60 px-5 py-2.5 text-black"
          >
            查看项目 / PROJECTS
          </Link>
        </div>

        <p className="relative z-30 bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">
          {"// 页面不存在 · PAGE NOT FOUND"}
        </p>
      </div>

      {/* 随机故障线池（v43）：位置/形态/颜色/生命周期全随机，200ms tick 状态转移 */}
      <div className="nf-scan pointer-events-none fixed inset-0 z-40" />
      <div
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>,
    document.body
  );
}
