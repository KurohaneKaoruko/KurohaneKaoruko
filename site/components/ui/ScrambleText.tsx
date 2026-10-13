"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrambleTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  duration?: number;
  delay?: number;
  hover?: boolean;
  className?: string;
  preserveSpace?: boolean;
  /** 乱码字符池；默认用剔除细长字形后的窄池，字距宽的场景可传 CHARS_FULL */
  chars?: string;
}

/* 默认池：字母数字打底 + 符号白名单。
   用户允许：[ ] ! ? / < > . : _ - ；厚实居中的 @ # $ % & * + = 保留。
   仅剔除 {} | （过于细长、明显突出）与 ( ) ^ ; , （用户未点头，先不放回，
   要加随时说）。 */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=[]!?/><.:_-";

/* 全量池：全部符号都在。适用场景是字距本身较宽（tracking 宽）的文本 ——
   符号的细长与贴边在宽间距下会被稀释，不会显得拥挤突出。 */
export const CHARS_FULL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export function ScrambleText({
  text,
  duration = 1000,
  delay = 0,
  hover = false,
  className,
  preserveSpace = true,
  chars = CHARS,
  ...props
}: ScrambleTextProps) {
  // 非 hover 模式下初始值不能是完整文本 —— 否则 delay 期间会先露出全文、
  // 再跳回乱码重新解码。初始留空，挂载后立即用乱码占位；随机值只能
  // 在客户端 effect 里生成，放初始值会造成 SSR 水合不一致。
  const [displayText, setDisplayText] = useState(hover ? text : "");
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    let iteration = 0;
    const totalIterations = text.length;
    const increment = totalIterations / (duration / 30);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (preserveSpace && char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsAnimating(false);
      }

      iteration += increment;
    }, 30);
  };

  useEffect(() => {
    if (!hover) {
      // delay 期间先用乱码占位，而不是完整文本（占位宽度由隐形副本撑住，不抖动）
      setDisplayText(
        text.replace(/[^\s]/g, () => chars[Math.floor(Math.random() * chars.length)])
      );
      const timer = setTimeout(startAnimation, delay);
      return () => clearTimeout(timer);
    }
  }, [text, delay, hover, chars]);

  return (
    <span
      className={cn("relative inline-block whitespace-pre", className)}
      aria-label={text}
      onMouseEnter={hover ? startAnimation : undefined}
      {...props}
    >
      {/* 隐形副本：用最终文本撑出稳定宽度，动画期间盒子不变 —— 乱码再宽再窄
          都只在这层绝对定位里发生，不会推挤周边布局（长度/位置抖动的根源） */}
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span className="absolute left-0 top-0" aria-hidden="true">
        {displayText}
      </span>
    </span>
  );
}
