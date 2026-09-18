"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ScrambleText } from "@/components/ui/ScrambleText";

export default function NotFound() {
  const [traceId, setTraceId] = useState("GENERATING...");

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setTraceId(Math.random().toString(36).substring(7).toUpperCase());
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center p-4 text-center">
      <div className="relative mb-8">
        <div className="select-none font-mono text-[8rem] font-bold leading-none text-primary/20 sm:text-9xl">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glitch-text font-mono text-2xl font-bold text-primary sm:text-4xl">
            <ScrambleText text="SIGNAL LOST" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="tech-corners border border-border bg-card-bg p-6 text-left font-mono text-sm">
          <p className="mb-2 text-primary">&gt; ERROR_CODE: PAGE_NOT_FOUND</p>
          <p className="mb-4 text-xs leading-relaxed text-text-muted">
            请求的数据包未在档案索引中定位：它可能已被重定向、损坏，或转移到了更高的权限层级。
          </p>
          <p className="text-text-dim">&gt; TRACE_ID: {traceId}</p>
        </div>

        <Button href="/" variant="primary">
          Return to System Root
        </Button>
      </div>
    </div>
  );
}
