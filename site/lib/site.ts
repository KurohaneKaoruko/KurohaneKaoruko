/**
 * 站点级配置与文案。
 *
 * 名称、导航、作者自述、联系方式只在这里定义一次，
 * 页面与页脚都从这里取，避免同一句话在四个文件里各写一版。
 */

export const SITE = {
  name: "Kurohane Kaoruko",
  handle: "KurohaneKaoruko",
  /** 启动屏主标题用的紧凑写法（SplashScreen） */
  short: "K.H.KAORUKO",
  /** 顶栏的方标 */
  mark: "◇",
  /** 站点副标 */
  archive: "Software Archive",
  tagline: "AI engineer & toolmaker.",
  description:
    "Kurohane Kaoruko — AI engineer & toolmaker。二十余个开源项目：Agent 系统、桌面工具与游戏。Rust、TypeScript、Python。",
  repo: "KurohaneKaoruko",
  url: "https://kurohanekaoruko.github.io/KurohaneKaoruko",
  github: "https://github.com/KurohaneKaoruko",
  email: "kurohanekaoruko@163.com",
  /** 版本号，页脚显示 */
  build: "2026.10",
} as const;

export type NavItem = {
  href: string;
  /** 中文主标 */
  cn: string;
  /** 英文副标 */
  en: string;
  /** 导航里的编号 */
  no: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", cn: "首页", en: "Index", no: "01" },
  { href: "/projects", cn: "项目", en: "Projects", no: "02" },
  { href: "/about", cn: "关于", en: "About", no: "03" },
];

/** 作者自述：关于页与首页共用 */
export const CURATOR = {
  role: "独立开发者 / AI 工程师",
  base: "China · UTC+8",
  now: [
    {
      name: "Iris-I.C.E.",
      note: "长篇小说的工作台：Lexical 编辑器、作品资料库与跨章节的长期记忆。",
    },
    {
      name: "ExMachina",
      note: "多智能体契约与调度：把协作规则写成文档，让 Agent 按文档办事。",
    },
    {
      name: "Convallaria-Input",
      note: "Rust 输入法引擎：音节切分、n-gram 与 Viterbi 整句解码。",
    },
  ],
  toolchain: [
    { title: "语言", en: "Languages", items: ["TypeScript", "Rust", "Python", "JavaScript", "Dart"] },
    {
      title: "智能体",
      en: "Agents",
      items: ["LLM Agents", "Swarm Intelligence", "RAG", "Multi-Agent RL", "Agent Skills"],
    },
    {
      title: "框架与系统",
      en: "Frameworks",
      items: ["Next.js", "React", "Tauri", "Node.js", "Lexical", "WebRTC"],
    },
  ],
} as const;

/** 页脚的版本信息 */
export const COLOPHON = {
  typefaces: "IBM Plex Sans · IBM Plex Mono · Noto Sans SC",
  build: "Next.js · 静态导出 · 无后端",
  source: "github.com/KurohaneKaoruko/KurohaneKaoruko",
} as const;
