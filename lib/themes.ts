/**
 * 主题注册表。
 *
 * 一处登记，三处消费：
 *   1. ThemeScript —— 水合前把 localStorage 里的选择写进 <html data-theme>，避免闪烁
 *   2. ThemeProvider —— 运行时切换与持久化
 *   3. ThemeSwitcher —— 切换器 UI（色卡预览取自这里的 swatch）
 *
 * 真正的颜色令牌定义在 app/globals.css 的 [data-theme="..."] 里，
 * 这里只放元数据，新增主题时两边各加一段即可。
 */

export type ThemeId = "terminal" | "brutalist";

export type ThemeMeta = {
  id: ThemeId;
  /** 英文名，终端风排版用 */
  name: string;
  /** 中文名 */
  label: string;
  desc: string;
  /** [底色, 强调色]，用于切换器色卡 */
  swatch: [string, string];
  /** 切换时浮现的一句状态文案 */
  status: string;
};

export const THEMES: ThemeMeta[] = [
  {
    id: "terminal",
    name: "Terminal",
    label: "终端",
    desc: "磷光红黑控制台：等宽字、取景框、扫描线。",
    swatch: ["#080808", "#ff3333"],
    status: "PHOSPHOR ONLINE",
  },
  {
    id: "brutalist",
    name: "Brutalist",
    label: "粗野",
    desc: "奶油纸面、硬黑边框与偏移阴影，像一张印刷海报。",
    swatch: ["#f2efe9", "#ff2d2d"],
    status: "INK & PAPER",
  },
];

export const DEFAULT_THEME: ThemeId = "terminal";

/** 本地存储键 */
export const THEME_STORAGE_KEY = "kk-theme";

const THEME_IDS = THEMES.map((t) => t.id) as string[];

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && THEME_IDS.includes(value);
}

export function getTheme(id: string): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/** 循环取下一个主题，供快捷键 / 单按钮切换使用 */
export function nextTheme(id: ThemeId): ThemeId {
  const index = THEMES.findIndex((t) => t.id === id);
  return THEMES[(index + 1) % THEMES.length].id;
}
