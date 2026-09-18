"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export const TechDecoration = () => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || pathname !== "/") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden">
      {/* 动态网格背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] opacity-10" />

      {/* 垂直标尺 */}
      <div className="absolute bottom-0 left-8 top-0 flex w-px flex-col items-center justify-center gap-32 bg-white/5 py-12">
        {[...Array(5)].map((_, i) => (
          <div key={`l-marker-${i}`} className="relative">
            <div className="h-px w-2 bg-primary/30" />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-left font-mono text-[8px] text-white/10">
              COORD_{i}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 right-8 top-0 flex w-px flex-col items-center justify-center gap-32 bg-white/5 py-12">
        {[...Array(5)].map((_, i) => (
          <div key={`r-marker-${i}`} className="relative">
            <div className="h-px w-2 bg-primary/30" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 origin-right font-mono text-[8px] text-white/10">
              SYS_{i}
            </div>
          </div>
        ))}
      </div>

      {/* 数据流线条 */}
      <div className="absolute left-0 top-32 h-px w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-50" />
      <div className="absolute bottom-32 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-50" />

      {/* 漂浮准星 */}
      <Crosshair x="15%" y="25%" delay={0} />
      <Crosshair x="85%" y="15%" delay={2} />
      <Crosshair x="75%" y="75%" delay={4} />
      <Crosshair x="10%" y="85%" delay={6} />

      {/* 雷达圆环 */}
      <div className="absolute bottom-12 left-12 flex h-64 w-64 animate-[spin_60s_linear_infinite] items-center justify-center rounded-full border border-white/5 opacity-20">
        <div className="h-[98%] w-[98%] rounded-full border border-dashed border-white/10" />
        <div className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom animate-[spin_4s_linear_infinite] bg-gradient-to-b from-transparent to-primary/20" />
      </div>
    </div>
  );
};

const Crosshair = ({ x, y, delay }: { x: string; y: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1, 0.8], rotate: [0, 90, 0] }}
    transition={{ duration: 8, repeat: Infinity, delay, ease: "linear" }}
    className="absolute flex h-8 w-8 items-center justify-center"
    style={{ left: x, top: y }}
  >
    <div className="absolute h-px w-full bg-primary/30" />
    <div className="absolute h-full w-px bg-primary/30" />
    <div className="h-2/3 w-2/3 rounded-full border border-primary/20" />
  </motion.div>
);
