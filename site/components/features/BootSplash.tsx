"use client";

import { useEffect, useState } from "react";

const LINES = [
  "> KUROHANE.SYS v1.0 — PORTFOLIO KERNEL",
  "> MOUNTING /dev/portfolio .......... OK",
  "> LOADING AGENTS [swarm.mode] ...... OK",
  "> LINKING rust + py + ts runtime ... OK",
  "> COMPILING WORLD ..................",
];

export default function BootSplash() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("kk-boot") === "1") {
        setGone(true);
        return;
      }
    } catch {
      /* ignore */
    }
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem("kk-boot", "1");
      } catch {
        /* ignore */
      }
      setGone(true);
    }, 2700);
    return () => clearTimeout(timer);
  }, []);

  if (gone) return null;

  return (
    <>
      <div
        id="kk-boot"
        className="boot-root fixed inset-0 z-[100] flex items-center justify-center bg-background font-mono"
        aria-hidden="true"
      >
        <div className="clip-tech-card w-[min(90vw,540px)] border border-border bg-card-bg p-6 text-left text-xs">
          <p className="text-primary">KUROHANE.SYS — BOOT SEQUENCE</p>
          <div className="mt-4 space-y-1.5 text-text-muted">
            {LINES.map((line, i) => (
              <p key={line} className="boot-line" style={{ animationDelay: `${0.2 + i * 0.42}s` }}>
                {line}
              </p>
            ))}
          </div>
          <div className="mt-5 h-1.5 w-full border border-border p-px">
            <div className="boot-bar h-full bg-primary" />
          </div>
          <p className="boot-line mt-2 text-right text-[10px] tracking-widest text-primary" style={{ animationDelay: "2.05s" }}>
            ACCESS GRANTED
          </p>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(sessionStorage.getItem('kk-boot')==='1'){var s=document.getElementById('kk-boot');s&&s.remove()}}catch(e){}",
        }}
      />
    </>
  );
}
