/**
 * 主题首页共用的数据。
 *
 * 这些内容只在「非默认主题」里出现 —— 默认档案首页有自己的数据源。
 * 放在单独文件里，避免主题组件反过来依赖 v2 首页专用的数据结构。
 */

export { langColor } from "@/lib/data";

/** 跑马灯词条：技术栈名单 */
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

/** 终端主题的会话回放（也用于卡带主题的琥珀屏） */
export const TERMINAL_SESSION = [
  { cmd: "whoami", out: "kurohane-kaoruko — AI engineer & toolmaker" },
  { cmd: "cat focus.txt", out: "LLM Agents / Swarm Intelligence / Dev Tools" },
  { cmd: "ls ~/stack", out: "rust  python  typescript  next.js  tauri" },
  { cmd: "sudo make world", out: "[ OK ] compiling the world..." },
];
