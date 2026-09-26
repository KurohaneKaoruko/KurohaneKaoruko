/**
 * 站点级配置：全站只在这里定义一次名称、版本、导航与外部链接，
 * 避免同一份信息散落在 layout / Nav / Footer / README 里各写一遍。
 */

export const SITE = {
  name: "Kurohane Kaoruko",
  handle: "KurohaneKaoruko",
  /** 终端风短名，用于导航与页脚 */
  short: "K.H.KAORUKO",
  version: "1.0.0",
  tagline: "COMPILE THIS WORLD.",
  description:
    "GitHub 开源项目索引：按语言筛选与排序，仓库数据实时拉取；终端与粗野两套主题，静态导出零后端。",
  /** 仓库名与 GitHub Pages 项目页前缀保持一致 */
  repo: "KurohaneKaoruko",
  url: "https://kurohanekaoruko.github.io/KurohaneKaoruko",
  github: "https://github.com/KurohaneKaoruko",
  email: "kurohanekaoruko@163.com",
} as const;

export type NavItem = {
  href: string;
  label: string;
  /** 英文副标，终端风排版里与中文同排 */
  en: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "首页", en: "HOME" },
  { href: "/projects", label: "项目", en: "PROJECTS" },
  { href: "/about", label: "关于", en: "ABOUT" },
];

/** 首页与关于页共用的技能分组 */
export const SKILL_GROUPS = [
  { title: "LANGUAGES", items: ["TypeScript", "Python", "Rust", "JavaScript"] },
  { title: "AI & AGENTS", items: ["LLM Agents", "Swarm Intelligence", "RAG", "GAN / DCGAN"] },
  { title: "FRAMEWORK & TOOLS", items: ["Next.js", "React", "Tauri", "Node.js", "Git"] },
];

/** 首页终端面板里逐行打出来的会话记录 */
export const TERMINAL_SESSION = [
  { cmd: "whoami", out: "kurohane-kaoruko — AI engineer & toolmaker" },
  { cmd: "cat focus.txt", out: "LLM Agents · Swarm Intelligence · Dev Tools · Games" },
  { cmd: "ls ~/stack", out: "rust  python  typescript  next.js  tauri" },
  { cmd: "sudo make world", out: "[ OK ] compiling the world..." },
];

/**
 * 启动屏的会话标记。放在这里而不是组件文件里，是因为水合前的内联脚本
 * （服务端组件）也要读它 —— 从 "use client" 模块导入的普通常量在服务端
 * 拿到的是客户端引用而不是值，两边必须共用同一个字面量。
 */
export const SPLASH_SESSION_KEY = "kk-splash";
