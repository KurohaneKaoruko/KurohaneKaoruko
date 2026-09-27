"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { ASCII_COLS, ASCII_FPS, ASCII_FRAME0, ASCII_ROWS } from "./ascii-frames";

type MaskSpec = {
  hx: number; hy: number; // 初始/锚点位置
  w0: number; h0: number; // 基准尺寸（伸缩围绕该级别往复）
  move: number; // 单步位移幅度上限（容器点）
  sizeK: number; // 单步尺寸伸缩上限（占比）
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

const MASK_SPECS: MaskSpec[] = [
  { hx: 50, hy: 19, w0: 76, h0: 24, move: 3, sizeK: 0.12, clamp: 6, a1: 0.8, s1: 0.5, p1: 0.0 },
  { hx: 50, hy: 40, w0: 74, h0: 28, move: 3, sizeK: 0.12, clamp: 6, a1: 0.7, s1: 0.38, p1: 2.1 },
  { hx: 50, hy: 62, w0: 67, h0: 28, move: 3, sizeK: 0.12, clamp: 6, a1: 0.8, s1: 0.45, p1: 4.2 },
  { hx: 38, hy: 82, w0: 55, h0: 26, move: 4, sizeK: 0.12, clamp: 6, a1: 0.9, s1: 0.52, p1: 1.2 },
  { hx: 62, hy: 82, w0: 47, h0: 26, move: 4, sizeK: 0.12, clamp: 6, a1: 0.9, s1: 0.41, p1: 5.2 },
  { hx: 22, hy: 33, w0: 34, h0: 28, move: 9, sizeK: 0.55, clamp: 16, a1: 0.9, s1: 0.33, p1: 3.3 },
  { hx: 78, hy: 35, w0: 34, h0: 28, move: 9, sizeK: 0.55, clamp: 16, a1: 0.9, s1: 0.41, p1: 0.6 },
  { hx: 23, hy: 66, w0: 34, h0: 24, move: 10, sizeK: 0.55, clamp: 16, a1: 1.0, s1: 0.36, p1: 2.6 },
  { hx: 77, hy: 64, w0: 34, h0: 26, move: 10, sizeK: 0.55, clamp: 16, a1: 1.0, s1: 0.48, p1: 3.7 },
  { hx: 50, hy: 12, w0: 30, h0: 9, move: 7, sizeK: 0.55, clamp: 12, a1: 0.8, s1: 0.29, p1: 4.8 },
  { hx: 18, hy: 15, w0: 11, h0: 9, move: 13, sizeK: 0.6, clamp: 13, a1: 1.0, s1: 0.6, p1: 1.4 },
  { hx: 82, hy: 13, w0: 11, h0: 9, move: 13, sizeK: 0.6, clamp: 13, a1: 1.0, s1: 0.55, p1: 4.4 },
  { hx: 14, hy: 48, w0: 10, h0: 13, move: 14, sizeK: 0.6, clamp: 13, a1: 1.0, s1: 0.5, p1: 0.4 },
  { hx: 86, hy: 46, w0: 10, h0: 13, move: 14, sizeK: 0.6, clamp: 13, a1: 1.0, s1: 0.62, p1: 3.8 },
  { hx: 22, hy: 84, w0: 12, h0: 8, move: 15, sizeK: 0.6, clamp: 13, a1: 1.0, s1: 0.45, p1: 2.9 },
  { hx: 50, hy: 90, w0: 18, h0: 6, move: 16, sizeK: 0.6, clamp: 22, a1: 1.0, s1: 0.4, p1: 5.6 },
  { hx: 80, hy: 86, w0: 10, h0: 7, move: 16, sizeK: 0.6, clamp: 22, a1: 1.0, s1: 0.57, p1: 1.6 },
  { hx: 22, hy: 10, w0: 7, h0: 7, move: 16, sizeK: 0.6, clamp: 22, a1: 1.0, s1: 0.63, p1: 0.8 },
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

.nf-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1200px;
  height: 700px;
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
  
  font-size: 9.5px;
  line-height: 0.933;
  letter-spacing: 0.4em;
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
.nf-blink { animation: nfBlink 1s steps(1, end) infinite; }
@keyframes nfBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.08; }
}
@media (prefers-reduced-motion: reduce) {
  .nf-root, .nf-root * { animation: none !important; }
}
`;

export default function NotFound() {
  const field0 = ASCII_FRAME0; // 人物带同步首帧（挂载前初始内容 / 数据未加载期）
  const maskRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLPreElement>(null);
  const decoLRef = useRef<HTMLPreElement>(null);
  const decoRRef = useRef<HTMLPreElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const FS = 9.5; // 修正字号（px）＝ 白团高 700 ÷ 79 行 ÷ 0.933
    const ROW_PX = FS * 0.933; // 每行高 8.8635px
    const DECO_DENSITY = 0.46; // 装饰带字符密度（≈参考疏朗度，与人物带墨迹一致）
    let framesSrc: string[] = [ASCII_FRAME0];
    let alive = true;
    let resizeTimer = 0;
    let showRows = ASCII_ROWS; // 人物带显示行数（50 全量）
    let colsL = 0, colsR = 0;

    const buildDecoText = (cols: number, rows: number, seed: number) => {
      const rng = mulberry32(seed);
      const lines: string[] = [];
      for (let r = 0; r < rows; r++) {
        let line = "";
        for (let i = 0; i < cols; i++) {
          line += rng() < DECO_DENSITY ? (rng() > 0.5 ? "1" : "0") : " ";
        }
        lines.push(line);
      }
      return lines.join("\n");
    };

    const relayout = () => {
      const vw = window.innerWidth;
      showRows = ASCII_ROWS;
      const containerW = Math.min(vw, 1200); // 白团容器实宽（锁死 1200，小视口收缩）
      const colsTotal = Math.max(ASCII_COLS, Math.round(containerW / FS));
      const deco = colsTotal - ASCII_COLS;
      colsL = Math.floor(deco / 2);
      colsR = deco - colsL;
      if (decoLRef.current) decoLRef.current.textContent = buildDecoText(colsL, showRows, 0x44654f);
      if (decoRRef.current) decoRRef.current.textContent = buildDecoText(colsR, showRows, 0x5fe11d);
    };
    const paintFrame = (fi: number) => {
      const fEl = fieldRef.current;
      const frame = framesSrc[fi];
      if (!fEl || !frame) return;
      if (showRows >= ASCII_ROWS) {
        fEl.textContent = frame;
      } else {
        const arr = frame.split("\n");
        fEl.textContent = arr.slice(0, showRows).join("\n");
      }
    };

    const states = MASK_SPECS.map((s, i) => {
      const rng = mulberry32(0x4d41534b + i * 0x9e3779b9);
      return {
        fx: s.hx, fy: s.hy, fw: s.w0, fh: s.h0, // 插值起点
        tx: s.hx, ty: s.hy, tw: s.w0, th: s.h0, // 插值目标
        t0: -1, dur: 1, rng, // t0<0 = 尚未起步
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

    const paintMask = (t: number) => {
      const el = maskRef.current;
      if (!el) return;
      const driftX = 1.8 * Math.sin(t * 0.21 + 0.9) + 1.1 * Math.sin(t * 0.08 + 2.4);
      const driftY = 1.5 * Math.cos(t * 0.17 + 1.3) + 0.9 * Math.sin(t * 0.06 + 0.5);
      let areaSum = 0, wSumX = 0, wSumY = 0;
      for (let k = 0; k < MASK_SPECS.length; k++) {
        const s = MASK_SPECS[k];
        const r = states[k];
        while (r.t0 < 0 || t >= r.t0 + r.dur) {
          r.fx = r.tx; r.fy = r.ty; r.fw = r.tw; r.fh = r.th;
          r.tx = clampTo(r.fx + (r.rng() * 2 - 1) * s.move, s.hx, s.clamp);
          r.ty = clampTo(r.fy + (r.rng() * 2 - 1) * s.move, s.hy, s.clamp);
          r.tw = clampSize(r.fw * (1 + (r.rng() * 2 - 1) * s.sizeK), s.w0, s.sizeK);
          r.th = clampSize(r.fh * (1 + (r.rng() * 2 - 1) * s.sizeK), s.h0, s.sizeK);
          r.t0 = r.t0 < 0 ? t : r.t0 + r.dur;
          r.dur = 0.4 + r.rng() * 0.7; // 插值步长 0.4-1.1s（v27 加速），各矩形独立
        }
        const u = Math.min(1, (t - r.t0) / r.dur);
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
      const br = 0.995 + 0.045 * Math.sin((t * 2 * Math.PI) / 13) + 0.02 * Math.sin((t * 2 * Math.PI) / 29 + 1.7);
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
      relayout();
      paintFrame(0);
      const el = maskRef.current;
      if (el) {
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
      }
      return;
    }

    relayout(); // 生成装饰带纹理 + 计算人物带显示行数（fs 固定，无字号缩放）
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        relayout();
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
        framesSrc = frames;
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

      
      
      <div ref={stageRef} className="nf-stage">
        <div ref={maskRef} className="nf-mask">
          <pre ref={decoLRef} aria-hidden className="nf-field" />
          <pre ref={fieldRef} aria-hidden className="nf-field">
            {field0}
          </pre>
          <pre ref={decoRRef} aria-hidden className="nf-field" />
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

      
      <div className="nf-blink pointer-events-none absolute left-[8%] top-[16%] z-40 h-[2px] w-28 bg-white/80" />
      <div className="nf-blink pointer-events-none absolute left-[66%] top-[30%] z-40 h-[2px] w-16 bg-[#ff2a2a]" style={{ animationDelay: "-0.6s" }} />
      <div className="nf-blink pointer-events-none absolute left-[22%] top-[72%] z-40 h-[2px] w-20 bg-[#2f6dff]" style={{ animationDelay: "-1.2s" }} />
      <div className="nf-blink pointer-events-none absolute left-[76%] top-[82%] z-40 h-[2px] w-12 bg-white/60" style={{ animationDelay: "-0.3s" }} />

      
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
