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
import { usePathname } from "next/navigation";
import {
  DEFAULT_THEME,
  isThemeId,
  THEMES,
  THEME_STORAGE_KEY,
  type ThemeId,
  type ThemeMeta,
} from "@/lib/themes";

type ThemeContextValue = {
  /** 当前主题 id */
  theme: ThemeId;
  /** 当前主题元数据 */
  meta: ThemeMeta;
  themes: ThemeMeta[];
  setTheme: (id: ThemeId) => void;
  /** 按注册表顺序轮换 */
  cycleTheme: () => void;
  /** 是否已完成客户端水合（用于避免切换器 SSR/CSR 不一致） */
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * 首屏的 data-theme 由 ThemeScript 在 HTML 解析阶段写好，
 * 这里只负责：读回真实值 → 切换时更新 DOM → 持久化到 localStorage。
 *
 * 刻意不做「跟随系统」：本站在暗色控制台与亮色纸面之间切换，
 * 两者都不是系统明暗模式的语义映射，跟随系统只会让用户困惑。
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // 背景装饰层（地形等高线 + 点阵）只在首页开启，
  // 与 ThemeScript 水合前的挂载保持一致，避免装饰层闪现/消失。
  useEffect(() => {
    document.documentElement.classList.toggle("bg-decor-on", pathname === "/");
  }, [pathname]);

  // 水合后与内联脚本对齐：脚本已经写好 DOM 属性，这里同步进 React 状态
  useEffect(() => {
    let initial: ThemeId = DEFAULT_THEME;
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemeId(stored)) initial = stored;
      else {
        const attr = document.documentElement.getAttribute("data-theme");
        if (isThemeId(attr)) initial = attr;
      }
    } catch {
      /* localStorage 不可用（隐私模式等）——沿用默认主题 */
    }
    setThemeState(initial);
    setMounted(true);
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    const root = document.documentElement;
    root.setAttribute("data-theme", id);

    // 临时挂上全局过渡，让整站换色不显得生硬；动画结束后摘掉，
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
      const index = THEMES.findIndex((t) => t.id === prev);
      const next = THEMES[(index + 1) % THEMES.length].id;
      document.documentElement.setAttribute("data-theme", next);
      document.documentElement.classList.add("theme-anim");
      window.setTimeout(
        () => document.documentElement.classList.remove("theme-anim"),
        420
      );
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      meta: THEMES.find((t) => t.id === theme) ?? THEMES[0],
      themes: THEMES,
      setTheme,
      cycleTheme,
      mounted,
    }),
    [theme, setTheme, cycleTheme, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme 必须在 ThemeProvider 内使用");
  return context;
}
