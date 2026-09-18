export type Project = {
  name: string;
  desc: string;
  lang: string;
  stars: number;
  url: string;
  homepage?: string;
  topics: string[];
};

export const projects: Project[] = [
  { name: "Novel-IDE", desc: "一个使用 AI 大模型写小说的类 IDE 软件", lang: "TypeScript", stars: 8, url: "https://github.com/KurohaneKaoruko/Novel-IDE", topics: ["AI", "Novel"] },
  { name: "ScreepsDashboard", desc: "Screeps 的数据面板软件", lang: "TypeScript", stars: 8, url: "https://github.com/KurohaneKaoruko/ScreepsDashboard", topics: ["Screeps", "Dashboard"] },
  { name: "DSH-Novel", desc: "一个 Agent，让 DeepSeek Harness 变成 AI 写小说的工作区", lang: "JavaScript", stars: 7, url: "https://github.com/KurohaneKaoruko/DSH-Novel", topics: ["dsh-agent", "dsh-plugin"] },
  { name: "screeps-tools-nextjs", desc: "用 Next.js 编写的 Screeps 工具合集网站", lang: "TypeScript", stars: 6, url: "https://github.com/KurohaneKaoruko/screeps-tools-nextjs", homepage: "https://screeps-tools-rosemary.vercel.app", topics: ["Screeps", "Next.js"] },
  { name: "MiniTools-Rust", desc: "用 Rust 写的一些小工具", lang: "Rust", stars: 4, url: "https://github.com/KurohaneKaoruko/MiniTools-Rust", topics: ["CLI", "Tools"] },
  { name: "ExMachina", desc: "一个以集体智能与集群协作为核心的 AI Agent 系统", lang: "Rust", stars: 1, url: "https://github.com/KurohaneKaoruko/ExMachina", topics: ["AI Agents", "Swarm"] },
  { name: "ExMachina-Agents", desc: "基于绝对理性的 AI Agents，将 AI 打造成高度智能、强理性逻辑的系统", lang: "TypeScript", stars: 1, url: "https://github.com/KurohaneKaoruko/ExMachina-Agents", topics: ["AI Agents", "Rationality"] },
  { name: "Rosemary-Maidcafe", desc: "Tauri + Next.js 编写的女仆咖啡厅模拟经营单机游戏", lang: "TypeScript", stars: 2, url: "https://github.com/KurohaneKaoruko/Rosemary-Maidcafe", topics: ["Game", "Tauri"] },
  { name: "Girl-Ai-Agent", desc: "一款多功能、多模型、多平台的拟人智能体交互软件", lang: "Rust", stars: 2, url: "https://github.com/KurohaneKaoruko/Girl-Ai-Agent", topics: ["AI Agent", "Desktop"] },
  { name: "Project-Rosmarin", desc: "由一些前端小项目组成的 Next.js 网站", lang: "TypeScript", stars: 2, url: "https://github.com/KurohaneKaoruko/Project-Rosmarin", homepage: "https://rosmarin.vercel.app", topics: ["Next.js", "Frontend"] },
  { name: "alchemy-workshop", desc: "一款以炼金术为主题的文字冒险游戏", lang: "TypeScript", stars: 1, url: "https://github.com/KurohaneKaoruko/alchemy-workshop", homepage: "https://alchemy-workshop.vercel.app", topics: ["Game", "Text Adventure"] },
  { name: "DCGAN-WGAN", desc: "为了学习 GAN 而写的玩意", lang: "Jupyter Notebook", stars: 0, url: "https://github.com/KurohaneKaoruko/DCGAN-WGAN", topics: ["GAN", "Deep Learning"] },
];

export const langColor: Record<string, string> = {
  TypeScript: "#3178c6",
  Rust: "#dea584",
  JavaScript: "#f1e05a",
  "Jupyter Notebook": "#da5b0b",
};

export const typingLines = [
  "Artificial Intelligence",
  "Games and Tools",
  "Rust + Python + TypeScript",
];

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
