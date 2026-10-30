"use client";

import { useEffect } from "react";

/**
 * 指针层的两件小事，全局只挂一次监听。
 *
 * 1. 磁吸：`.btn` 与 `[data-magnetic]` 在指针靠近时朝指针偏一点，
 *    用 CSS 变量写位移，松手回弹。
 * 2. 解码：`.decode` 上悬停时，文字先变成乱码再逐字锁定，
 *    像终端在解析一行记录。只改 textContent，不触发 React 重渲染。
 */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*+<>=_";

function decode(el: HTMLElement) {
  const final = el.dataset.text ?? el.textContent ?? "";
  if (!final || el.dataset.decoding === "true") return;
  el.dataset.decoding = "true";

  const DURATION = 420;
  const t0 = performance.now();
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    el.textContent = final;
    delete el.dataset.decoding;
  };

  const step = (now: number) => {
    if (done) return;
    const p = Math.min(1, (now - t0) / DURATION);
    const revealed = Math.floor(p * final.length);
    let out = "";
    for (let i = 0; i < final.length; i += 1) {
      if (i < revealed || final[i] === " ") out += final[i];
      else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(step);
    else finish();
  };

  requestAnimationFrame(step);
  /* 标签页切走时 rAF 会停，兜底把字还回去 */
  setTimeout(finish, DURATION + 400);
}

export function PointerFX() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let current: HTMLElement | null = null;
    let rect: DOMRect | null = null;
    let raf = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      raf = 0;
      if (!current) return;
      current.style.setProperty("--mx", `${tx.toFixed(1)}px`);
      current.style.setProperty("--my", `${ty.toFixed(1)}px`);
    };

    const release = (el: HTMLElement) => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
      el.removeAttribute("data-magnet");
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const node = event.target as HTMLElement | null;
      const target = node ? node.closest<HTMLElement>("[data-magnetic], .btn") : null;

      if (target !== current) {
        if (current) release(current);
        current = target;
        if (current) {
          current.setAttribute("data-magnet", "true");
          rect = current.getBoundingClientRect();
        }
      }
      if (!current || !rect) return;

      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      tx = Math.max(-9, Math.min(9, dx * 0.26));
      ty = Math.max(-6, Math.min(6, dy * 0.3));
      if (!raf) raf = requestAnimationFrame(apply);
    };

    /*
     * 解码：只在指针「进入」一个新 .decode 元素时播一次。
     *
     * pointerover 在跨过子元素边界时会连环触发，而且乱码字符宽度与原字
     * 不同，解码时文字抖动会把指针挤出去再回来，又触发一轮 —— 表现为
     * 「鼠标动一下就播一遍」。对策：
     *   1. 记住当前悬停的元素，还在同一个元素里就不重播（离开后重新武装）
     *   2. 每个元素设冷却时间，布局抖动引起的出入不重播
     */
    let decodeTarget: HTMLElement | null = null;
    const decodedAt = new WeakMap<HTMLElement, number>();
    const DECODE_COOLDOWN = 700;

    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const el = (event.target as HTMLElement | null)?.closest<HTMLElement>(".decode");
      if (!el || el === decodeTarget) return;
      decodeTarget = el;
      const now = performance.now();
      if (now - (decodedAt.get(el) ?? -Infinity) < DECODE_COOLDOWN) return;
      decodedAt.set(el, now);
      decode(el);
    };

    const onOut = (event: PointerEvent) => {
      const el = (event.target as HTMLElement | null)?.closest<HTMLElement>(".decode");
      const next = event.relatedTarget;
      if (el && decodeTarget === el && !(next instanceof Node && el.contains(next))) {
        decodeTarget = null; // 真正离开了这个元素，下次进入允许重播
      }
    };

    /* 滚动后按钮已经不在指针底下，磁吸位移要归零 */
    let scrollRaf = 0;
    const onScroll = () => {
      if (!current || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        if (current) {
          release(current);
          current = null;
          rect = null;
        }
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", onScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (raf) cancelAnimationFrame(raf);
      if (current) release(current);
    };
  }, []);

  return null;
}
