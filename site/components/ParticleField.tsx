"use client";

import { useEffect, useRef } from "react";

export default function ParticleField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 性能预算：30fps 足够星座图观感；DPR 封顶 1.5
    const FRAME_MS = 1000 / 30;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const LINK_DIST = 100;
    const MOUSE_DIST = 140;

    let raf = 0;
    let running = false;
    let inView = true;
    let last = 0;
    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let pts: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(80, Math.floor((w * h) / 20000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.22;
            ctx.strokeStyle = "rgba(255, 51, 51, " + alpha + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        const p = pts[i];
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < MOUSE_DIST * MOUSE_DIST) {
          const alpha = (1 - Math.sqrt(md2) / MOUSE_DIST) * 0.45;
          ctx.strokeStyle = "rgba(59, 130, 246, " + alpha + ")";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (const p of pts) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (ts: number) => {
      if (!running) return;
      if (ts - last >= FRAME_MS) {
        last = ts;
        draw();
      }
      raf = requestAnimationFrame(step);
    };

    const update = () => {
      const should = inView && !document.hidden;
      if (should && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(step);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const io = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      update();
    });
    io.observe(canvas);

    const onVis = () => update();
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    update();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
