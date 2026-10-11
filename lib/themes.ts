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

export type ThemeId =
  | "terminal"
  | "brutalist"
  | "glacial"
  | "maximal"
  | "glitch"
  | "minimal"
  | "cyberpunk"
  | "vaporwave"
  | "y2k"
  | "cassette"
  | "swiss";

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
  {
    id: "glacial",
    name: "Glacial",
    label: "极境",
    desc: "冷白科幻界面：发丝细线、切角面板与冰蓝，像一台精密仪器。",
    swatch: ["#eef1f4", "#0891b2"],
    status: "GLACIAL // ONLINE",
  },
  {
    id: "maximal",
    name: "Maximal",
    label: "极繁",
    desc: "极繁主义：色块碰撞、纹样密度与拼贴徽章，拒绝留白。",
    swatch: ["#faf3e3", "#d4380d"],
    status: "MORE IS MORE",
  },
  {
    id: "glitch",
    name: "Glitch",
    label: "故障",
    desc: "满幅截获频段：红蓝错位、扫描线与撕裂边缘，像被恢复的信号。",
    swatch: ["#060607", "#ff2a2a"],
    status: "SIGNAL RECOVERED",
  },
  {
    id: "minimal",
    name: "Minimal",
    label: "极简",
    desc: "单列编辑部排版：细体大字、发丝线网格与留白，装饰全部删去。",
    swatch: ["#ffffff", "#141414"],
    status: "LESS IS MORE",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    label: "赛博",
    desc: "夜城霓虹与酸雨：霓虹描边、全息雨幕与错位悬赏钉板。",
    swatch: ["#0b0b16", "#00f0ff"],
    status: "NEON RAIN",
  },
  {
    id: "vaporwave",
    name: "Vaporwave",
    label: "蒸汽波",
    desc: "粉紫黄昏与无尽地平线：镭射渐变、网格海面与中轴展廊。",
    swatch: ["#2b0a3d", "#ff71ce"],
    status: "A E S T H E T I C",
  },
  {
    id: "y2k",
    name: "Y2K",
    label: "Y2K",
    desc: "千禧年银蓝梦：金属渐变、气泡高光与桌面图标墙。",
    swatch: ["#dfe9f8", "#2f6df6"],
    status: "HELLO WORLD 2000",
  },
  {
    id: "cassette",
    name: "Cassette Futurism",
    label: "卡带未来",
    desc: "被用过的未来：米色机身、琥珀屏幕与机架设备面板。",
    swatch: ["#e6e0d0", "#c2571a"],
    status: "TAPE DECK READY",
  },
  {
    id: "swiss",
    name: "Swiss",
    label: "瑞士",
    desc: "国际主义排版：外露模数网格、竖排贴边与瑞士红，像一张构成主义海报。",
    swatch: ["#ffffff", "#e30613"],
    status: "GRID & RED",
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
