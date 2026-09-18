"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ScrambleText } from "@/components/ui/ScrambleText";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const message =
    (error && typeof error.message === "string" && error.message.slice(0, 200)) ||
    "Unexpected runtime error";

  const errorId = error.digest || "UNKNOWN";

  return (
    <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center p-4 text-center">
      <div className="relative mb-8">
        <div className="select-none font-mono text-[8rem] font-bold leading-none text-primary/20 sm:text-9xl">
          500
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glitch-text font-mono text-2xl font-bold text-primary sm:text-4xl">
            <ScrambleText text="SYSTEM ERROR" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="tech-corners border border-border bg-card-bg p-6 text-left font-mono text-sm">
          <p className="mb-2 text-primary">&gt; ERROR_CODE: INTERNAL_SERVER_ERROR</p>
          <p className="mb-4 text-xs leading-relaxed text-text-muted">
            请求的操作触发了系统内部故障。这可能是一次临时性失败，或者是一个格式错误的数据包。
          </p>
          <p className="mb-2 text-text-dim">&gt; ERROR_ID: {errorId}</p>
          <div className="mt-2 border border-dashed border-border/60 bg-background/40 px-3 py-2">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-widest text-text-dim transition-colors hover:text-primary"
            >
              <span>{showDetails ? "隐藏错误详情 / HIDE" : "显示错误详情 / SHOW"}</span>
              <span>{showDetails ? "−" : "+"}</span>
            </button>
            {showDetails && (
              <div className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-[10px] text-text-muted">
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" variant="primary" className="w-full font-mono text-xs tracking-widest sm:w-auto">
            Return to Root
          </Button>
          <button
            type="button"
            onClick={() => reset()}
            className="border border-border bg-card-bg/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted transition-colors hover:border-primary/60 hover:text-primary"
          >
            Retry Request
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back();
              } else {
                router.push("/");
              }
            }}
            className="border border-border bg-card-bg/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-text-muted transition-colors hover:border-primary/60 hover:text-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
