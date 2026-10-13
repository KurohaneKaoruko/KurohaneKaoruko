"use client";

import { useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";

/**
 * 空组件：挂载即代表客户端 bundle 已执行、水合已开始。
 * 在此把"就绪"信号交给启动屏，让它进入冲刺阶段。
 */
export function LoadingTrigger() {
  const { setIsLoaded } = useLoading();

  useEffect(() => {
    // 让出一帧，确保首次绘制已完成后再收幕，避免"闪一下就没了"
    const id = requestAnimationFrame(() => setIsLoaded(true));
    return () => cancelAnimationFrame(id);
  }, [setIsLoaded]);

  return null;
}
