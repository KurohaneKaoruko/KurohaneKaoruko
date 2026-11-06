"use client";

import {
  Suspense,
  lazy,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { DEFAULT_THEME, loadThemeHome, type ThemeId } from "@/components/theme/registry";

const lazyHomes = new Map<ThemeId, LazyExoticComponent<ComponentType>>();

function lazyHomeFor(id: ThemeId) {
  let Home = lazyHomes.get(id);
  if (!Home) {
    Home = lazy(() => loadThemeHome(id));
    lazyHomes.set(id, Home);
  }
  return Home;
}

function ThemeLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-[70svh] items-center justify-center">
      <p className="label flex items-center gap-3">
        <span className="status-dot" aria-hidden="true" />
        正在装载主题 / {label}
      </p>
    </div>
  );
}

/**
 * 首页主题分派。
 *
 * fallback 是服务端渲染好的默认主题首页（archive）。首帧、未水合、
 * 以及默认主题下都直接用它 —— 默认访客的 LCP 路径完全不变。
 *
 * 只有切到其他主题时才按需拉取该主题的首页组件树；每个主题的
 * 布局是独立设计的，不存在「同一套骨架换配色」。
 */
export function ThemedHome({ fallback }: { fallback: ReactNode }) {
  const { theme, meta, mounted } = useTheme();

  if (!mounted || theme === DEFAULT_THEME) {
    return <>{fallback}</>;
  }

  const Home = lazyHomeFor(theme);
  return (
    <Suspense fallback={<ThemeLoading label={meta.label} />}>
      <Home />
    </Suspense>
  );
}
