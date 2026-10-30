"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 自定义指针。
 *
 * 一枚红点 + 一圈滞后的细环，右下角跟着一串坐标。指到链接上环会放大，
 * 指到输入框会收成一道竖线。触屏与减动效偏好下完全不启用。
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cx");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;
    let state = "";

    const setState = (next: string) => {
      if (next === state) return;
      state = next;
      rootRef.current?.setAttribute("data-state", next);
    };

    let running = false;
    let coordDirty = false;

    const loop = () => {
      const dx = x - rx;
      const dy = y - ry;
      rx += dx * 0.18;
      ry += dy * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx - x}px, ${ry - y}px, 0)`;
      }
      // 坐标读数合批到帧里再写：pointermove 一秒能来几百次，逐次改文本
      // 会让光标层不停失效——弹窗的遮罩开着时它叠在全屏 backdrop blur
      // 之上，每次失效都要把模糊重新采样一遍，卡顿就是这么来的。
      if (coordDirty && coordRef.current) {
        coordDirty = false;
        coordRef.current.textContent =
          String(Math.round(x)).padStart(4, "0") + ":" + String(Math.round(y)).padStart(4, "0");
      }
      // 环追上指针、坐标也写完，就停掉循环，空闲时不再占用主线程
      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2 && !coordDirty) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      show(); // 指针在动就一定在页内：离开后回来的事件可能只剩 move
      if (rootRef.current) rootRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const target = event.target as HTMLElement | null;
      if (target) {
        const field = target.closest("input, textarea, select");
        const link = target.closest("a, button, [role='button'], [data-cx='link']");
        setState(field ? "field" : link ? "link" : "idle");
        const labelled = target.closest<HTMLElement>("[data-cx-label]");
        const label = labelled?.getAttribute("data-cx-label") ?? "";
        if (labelRef.current && labelRef.current.textContent !== label) {
          labelRef.current.textContent = label;
        }
      }
      if (coordRef.current) {
        coordDirty = true; // 真正写入交给 rAF 帧合批
      }
      kick();
    };

    const show = () => rootRef.current?.setAttribute("data-visible", "true");
    const hide = () => rootRef.current?.setAttribute("data-visible", "false");
    const down = () => rootRef.current?.setAttribute("data-down", "true");
    const up = () => rootRef.current?.setAttribute("data-down", "false");

    /*
     * 可见性只由两类事件驱动：
     * - pointermove：指针确定在页面里，无条件恢复（离开后再回来的事件序列
     *   在部分浏览器上只发 move 不发 enter，只听 enter 会永久消失）
     * - pointerleave / pointerrawupdate：离开文档就藏起来
     * 另外标签页切回时浏览器可能不再补发 enter，visibilitychange 里也恢复一次。
     */
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    const onVisibility = () => {
      if (!document.hidden) show();
    };
    document.addEventListener("visibilitychange", onVisibility);
    show();
    kick();

    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cx");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="cx" data-state="idle" data-visible="false" aria-hidden="true">
      <span ref={ringRef} className="cx-ring" />
      <span className="cx-dot" />
      <span ref={labelRef} className="cx-label" />
      <span ref={coordRef} className="cx-coord">
        0000:0000
      </span>
    </div>
  );
}
