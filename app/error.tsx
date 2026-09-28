"use client";

import { useEffect } from "react";
import ServerError from "@/components/ui/ServerError";

/**
 * 路由级错误边界（500）。
 *
 * 视图在 components/ui/ServerError.tsx —— 那一层刻意不跟随主题、
 * 也不复用 404 的字符画系统，具体取舍见该文件顶部注释。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const message =
    (error && typeof error.message === "string" && error.message.slice(0, 200)) ||
    "Unexpected runtime error";

  return <ServerError message={message} digest={error?.digest} onRetry={reset} />;
}
