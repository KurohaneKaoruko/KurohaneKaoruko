"use client";

import { useEffect, useState } from "react";

export default function TypingText({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const full = lines[lineIndex % lines.length];
    let i = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!deleting) {
        i += 1;
        setText(full.slice(0, i));
        if (i >= full.length) {
          timer = setTimeout(() => {
            deleting = true;
            tick();
          }, 1800);
          return;
        }
        timer = setTimeout(tick, 75);
      } else {
        i -= 1;
        setText(full.slice(0, i));
        if (i <= 0) {
          setLineIndex((v) => v + 1);
          return;
        }
        timer = setTimeout(tick, 35);
      }
    };

    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [lineIndex, lines]);

  return (
    <span className={className}>
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse bg-primary" />
    </span>
  );
}
