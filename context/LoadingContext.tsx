"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type LoadingContextValue = {
  /** 客户端是否已接管（水合完成、资源就绪信号已发出） */
  isLoaded: boolean;
  setIsLoaded: (value: boolean) => void;
  /** 本次会话是否应该播放启动屏（仅首页） */
  shouldShowSplash: boolean;
};

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

/**
 * 启动屏的"就绪信号"中枢。
 *
 * 分工：LoadingTrigger 在水合后置位 isLoaded；SplashScreen 消费它来决定
 * 何时停止"芝诺式"逼近、冲刺到 100% 并收起快门。两者解耦，
 * 启动屏不需要知道页面里有什么，页面也不需要知道启动屏存在。
 */
export function LoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // 只在首页首次落地时播放；子页面直接进入内容
  const [shouldShowSplash] = useState(pathname === "/");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!shouldShowSplash) setIsLoaded(true);
  }, [shouldShowSplash]);

  return (
    <LoadingContext.Provider value={{ isLoaded, setIsLoaded, shouldShowSplash }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading 必须在 LoadingProvider 内使用");
  return context;
}
