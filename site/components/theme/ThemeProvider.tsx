"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME,
  isThemeId,
  THEMES,
  THEME_STORAGE_KEY,
  nextTheme,
  type ThemeId,
} from "@/components/theme/registry";
import type { ThemeMeta } from "@/components/theme/types";

type ThemeContextValue = {
  /** 当前主题 id */
  theme: ThemeId;
  /** 当前主题元数据 */
  meta: ThemeMeta;
  /** 注册表里的全部主题 */
  themes: readonly (ThemeMeta & { id: ThemeId })[];
  setTheme: (id: ThemeId) => void;
  /** 按注册表顺序轮换 */
  cycleTheme: () => void;
  /** 是否已完成客户端水合（避免选择器 SSR/CSR 不一致） */
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * 主题运行时。
 *
 * 首屏的 <html data-theme> 由 ThemeScript 在 HTML 解析阶段写好；
 * 这里只负责：读回真实值 → 切换时更新 DOM → 持久化 localStorage。
 *
 * 刻意不跟随系统明暗：主题是「设计风格」而不是「深浅模式」，
 * 把极境、瑞士这类亮色主题映射到系统偏好只会让用户困惑。
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initial: ThemeId = DEFAULT_THEME;
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemeId(stored)) {
        initial = stored;
      } else {
        const attr = document.documentElement.getAttribute("data-theme");
        if (isThemeId(attr)) initial = attr;
      }
    } catch {
      /* localStorage 不可用（隐私模式等）——沿用默认主题 */
    }

    document.documentElement.setAttribute("data-theme", initial);
    setThemeState(initial);
    setMounted(true);
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);

    const root = document.documentElement;
    root.setAttribute("data-theme", id);

    // 临时挂上全局过渡，让整站换色不显得生硬；结束后摘掉，
    // 避免这条 !important 过渡影响后续正常交互。
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 420);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      /* 存不上就只在本次会话生效 */
    }
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = nextTheme(prev);
      const root = document.documentElement;
      root.setAttribute("data-theme", next);
      root.classList.add("theme-anim");
      window.setTimeout(() => root.classList.remove("theme-anim"), 420);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const meta = THEMES.find((item) => item.meta.id === theme)?.meta ?? THEMES[0].meta;
    return {
      theme,
      meta,
      themes: THEMES.map((item) => item.meta),
      setTheme,
      cycleTheme,
      mounted,
    };
  }, [theme, setTheme, cycleTheme, mounted]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme 必须在 ThemeProvider 内使用");
  return context;
}
