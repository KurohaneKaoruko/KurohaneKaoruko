export type Project = {
  name: string;
  desc: string;
  lang: string;
  stars: number;
  url: string;
  homepage?: string;
  topics: string[];
  /** 最近推送时间（ISO）。只有实时数据才有，站内快照不写。 */
  pushedAt?: string;
};

/**
 * 仓库清单的**兜底层**。
 *
 * 页面上的数据实际来自浏览器直连 GitHub（见 lib/repos.ts）：接口返回什么就显示什么，
 * 星标、语言、链接、新仓库都跟着 GitHub 走，不必等一次重新构建。
 *
 * 这份清单有两个作用：
 *   1. 静态导出时渲染的服务端内容 —— 首屏不用等接口，也没有水合不一致
 *   2. 接口拉不到时的兜底（限额用尽、离线、超时）—— 页面照常可用
 *
 * 同时它还是**文案覆写层**：这里登记过 `desc` / `topics` 的仓库，实时数据会保留手写文案
 * （中英文之间留了空格，比 GitHub 原文好读），只把星标、链接这些会变的部分换成实时的；
 * 没在这里登记过的仓库则直接采用 GitHub 原文。
 *
 * 所以这份清单只在「想改文案」时手动维护，不必追着星标跑。
 */
export const projects: Project[] = [
  { name: "Novel-IDE", desc: "一个使用 AI 大模型写小说的类 IDE 软件", lang: "TypeScript", stars: 8, url: "https://github.com/KurohaneKaoruko/Novel-IDE", topics: ["AI", "Novel"] },
  { name: "DSH-Novelist", desc: "小说作家智能体预设，用于在 DeepSeek Harness 里让 AI 写小说", lang: "JavaScript", stars: 8, url: "https://github.com/KurohaneKaoruko/DSH-Novelist", topics: [] },
  { name: "ScreepsDashboard", desc: "Screeps 的数据面板软件", lang: "TypeScript", stars: 8, url: "https://github.com/KurohaneKaoruko/ScreepsDashboard", topics: ["Screeps", "Dashboard"] },
  { name: "screeps-tools-nextjs", desc: "用 Next.js 编写的 Screeps 工具合集网站", lang: "TypeScript", stars: 6, url: "https://github.com/KurohaneKaoruko/screeps-tools-nextjs", homepage: "https://screeps-tools-rosemary.vercel.app", topics: ["Screeps", "Next.js"] },
  { name: "MiniTools-Rust", desc: "用 Rust 写的一些小工具", lang: "Rust", stars: 4, url: "https://github.com/KurohaneKaoruko/MiniTools-Rust", topics: ["CLI", "Tools"] },
  { name: "ExMachina", desc: "一个以集体智能与集群协作为核心的 AI Agent 系统", lang: "Rust", stars: 2, url: "https://github.com/KurohaneKaoruko/ExMachina", topics: ["AI Agents", "Swarm"] },
  { name: "Rosemary-Maidcafe", desc: "Tauri + Next.js 编写的女仆咖啡厅模拟经营单机游戏", lang: "TypeScript", stars: 2, url: "https://github.com/KurohaneKaoruko/Rosemary-Maidcafe", topics: ["Game", "Tauri"] },
  { name: "Girl-Ai-Agent", desc: "一款多功能、多模型、多平台的拟人智能体交互软件", lang: "Rust", stars: 2, url: "https://github.com/KurohaneKaoruko/Girl-Ai-Agent", topics: ["AI Agent", "Desktop"] },
  { name: "Project-Rosmarin", desc: "由一些前端小项目组成的 Next.js 网站", lang: "TypeScript", stars: 2, url: "https://github.com/KurohaneKaoruko/Project-Rosmarin", homepage: "https://rosmarin.vercel.app", topics: ["Next.js", "Frontend"] },
  { name: "KurohaneKaoruko", desc: "这个站点本身 —— 用 Next.js 写的个人主页与作品集，也放在这里一起展示", lang: "TypeScript", stars: 1, url: "https://github.com/KurohaneKaoruko/KurohaneKaoruko", homepage: "https://kurohanekaoruko.vercel.app", topics: [] },
  { name: "ExMachina-Agents", desc: "基于绝对理性的 AI Agents，将 AI 打造成高度智能、强理性逻辑的系统", lang: "TypeScript", stars: 1, url: "https://github.com/KurohaneKaoruko/ExMachina-Agents", topics: ["AI Agents", "Rationality"] },
  { name: "alchemy-workshop", desc: "一款以炼金术为主题的文字冒险游戏", lang: "TypeScript", stars: 1, url: "https://github.com/KurohaneKaoruko/alchemy-workshop", homepage: "https://alchemy-workshop.vercel.app", topics: ["Game", "Text Adventure"] },
  { name: "DSH-Novel-App", desc: "基于 DSH 的 AI 小说工作台", lang: "JavaScript", stars: 0, url: "https://github.com/KurohaneKaoruko/DSH-Novel-App", topics: [] },
  { name: "DSH-ExMachina", desc: "以绝对理性为核心的智能体预设", lang: "", stars: 0, url: "https://github.com/KurohaneKaoruko/DSH-ExMachina", topics: [] },
  { name: "DCGAN-WGAN", desc: "为了学习 GAN 而写的玩意", lang: "Jupyter Notebook", stars: 0, url: "https://github.com/KurohaneKaoruko/DCGAN-WGAN", topics: ["GAN", "Deep Learning"] },
];

export const langColor: Record<string, string> = {
  TypeScript: "#3178c6",
  Rust: "#dea584",
  JavaScript: "#f1e05a",
  "Jupyter Notebook": "#da5b0b",
};

export const marqueeTech = [
  "TypeScript",
  "Rust",
  "Python",
  "Next.js",
  "Tauri",
  "LLM Agents",
  "Swarm Intelligence",
  "Deep Learning",
  "Node.js",
  "React",
];
