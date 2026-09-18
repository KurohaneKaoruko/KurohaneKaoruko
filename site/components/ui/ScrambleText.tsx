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
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export function ScrambleText({
  text,
  duration = 1000,
  delay = 0,
  hover = false,
  className,
  preserveSpace = true,
  ...props
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
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
            return CHARS[Math.floor(Math.random() * CHARS.length)];
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
      const timer = setTimeout(startAnimation, delay);
      return () => clearTimeout(timer);
    }
  }, [text, delay, hover]);

  return (
    <span
      className={cn("font-mono", className)}
      onMouseEnter={hover ? startAnimation : undefined}
      {...props}
    >
      {displayText}
    </span>
  );
}
