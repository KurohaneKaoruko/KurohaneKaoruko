"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: GlobalErrorProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const message =
    (error && typeof error.message === "string" && error.message.slice(0, 200)) ||
    "Unexpected runtime error";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 py-24 font-mono text-sm">
      <p className="text-text-dim">❯ ./run --error</p>

      <p className="mt-8 text-7xl font-bold leading-none text-primary sm:text-9xl">500</p>

      <p className="mt-8 text-lg text-foreground">出了点问题。</p>
      <p className="mt-3 leading-7 text-text-muted">
        页面渲染时发生了运行时错误。可以重试一次，或者回到首页重新开始。
      </p>

      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        className="mt-6 self-start border-b border-dashed border-border text-xs text-text-dim transition-colors hover:text-primary"
      >
        {showDetails ? "收起错误详情 −" : "展开错误详情 +"}
      </button>

      {showDetails && (
        <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-words border border-border bg-card-bg p-3 text-[11px] leading-6 text-text-muted">
          {message}
          {error.digest ? "\n\ndigest: " + error.digest : ""}
        </pre>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
        <button
          type="button"
          onClick={() => reset()}
          className="text-primary underline-offset-4 hover:underline"
        >
          重试
        </button>
        <Link href="/" className="text-primary underline-offset-4 hover:underline">
          返回首页
        </Link>
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) window.history.back();
            else router.push("/");
          }}
          className="text-text-dim underline-offset-4 hover:underline"
        >
          返回上一页
        </button>
      </div>
    </div>
  );
}
