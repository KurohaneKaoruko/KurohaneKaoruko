export type FamilyId =
  "principium" | "arsenalia" | "animulae" | "ludi" | "incertae";

export type Project = {
  /** GitHub 仓库 ID：改名或转移后保持不变。 */
  repoId?: number;
  name: string;
  /** 仅用于识别历史引用，展示名始终使用当前 name。 */
  aliases?: string[];
  /** 拉丁学名式的标本名，图版与索引上的斜体行 */
  taxon: string;
  /** 中文俗名，两到三个字 */
  vernacular: string;
  desc: string;
  lang: string;
  stars: number;
  url: string;
  homepage?: string;
  topics: string[];
  family: FamilyId;
  /** 最近推送时间（ISO）。只有实时数据才有，站内快照不写。 */
  pushedAt?: string;
};

export type Family = {
  id: FamilyId;
  /** 分类代号，界面上的大写短标 */
  code: string;
  cn: string;
  en: string;
  note: string;
};

/**
 * 科属：项目的分类柜。
 *
 * 这不是按语言或时间分组，而是按"它是什么东西"分组 —— 读者找的是
 * 一件能用的器物、一个会自己干活的智能体，还是一局游戏。
 */
export const FAMILIES: Family[] = [
  {
    id: "principium",
    code: "FLAGSHIP",
    cn: "旗舰",
    en: "Flagship",
    note: "体量与完成度最高的三个项目",
  },
  {
    id: "arsenalia",
    code: "TOOLS",
    cn: "工具",
    en: "Instruments",
    note: "桌面工具与本地优先的应用",
  },
  {
    id: "animulae",
    code: "AGENTS",
    cn: "智能体",
    en: "Agents",
    note: "Agent 系统、预设与提示词工程",
  },
  {
    id: "ludi",
    code: "GAMES",
    cn: "游戏",
    en: "Play",
    note: "模拟经营、增量与实验性玩法",
  },
  {
    id: "incertae",
    code: "UNFILED",
    cn: "未归档",
    en: "Unfiled",
    note: "尚未归档的新仓库",
  },
];

/**
 * 仓库清单的**兜底层**。
 *
 * 页面上的数据实际来自浏览器直连 GitHub（见 lib/repos.ts）：接口返回什么就显示什么，
 * 星标、语言、链接、新仓库都跟着 GitHub 走，不必等一次重新构建。
 *
 * 这份清单有三个作用：
 *   1. 静态导出时渲染的服务端内容 —— 首屏不用等接口，也没有水合不一致
 *   2. 接口拉不到时的兜底（限额用尽、离线、超时）—— 页面照常可用
 *   3. **文案与归档的覆写层**：这里登记过的仓库，desc / topics / 科属 / 学名
 *      以手写版为准，星标、链接这些会变的部分换成实时的；没登记的仓库
 *      直接采用 GitHub 原文，并归入「待定」柜。
 *
 * 所以这份清单只在「想改文案」时手动维护，不必追着星标跑。
 *
 * 策展口径：只收有一定体量或独立价值的公开仓库；面向单一游戏的小工具、
 * 自用模板、几个单文件脚本合集这类内容不进入馆藏。
 */
export const projects: Project[] = [
  // ── 旗舰 ──
  {
    repoId: 1153495189,
    name: "Iris-Creation",
    aliases: ["Iris-I.C.E."],
    taxon: "Machina Scriptoria",
    vernacular: "写作台",
    desc: "小说与剧本的本地桌面创作工作台，支持作品资料管理、章节与分场写作、改稿审阅、AI 规划与长期记忆，以及人物关系和连续性维护。基于 Tauri 和 React 构建，文稿以 Markdown 保存。",
    lang: "TypeScript",
    stars: 8,
    url: "https://github.com/KurohaneKaoruko/Iris-Creation",
    topics: ["Novel", "Tauri", "Markdown"],
    family: "principium",
  },
  {
    repoId: 1427966136,
    name: "Lilium",
    taxon: "Lilium pensile",
    vernacular: "百合",
    desc: "本地优先的图片素材管理工具：无限画布视图、智能文件夹、标签评分、调色板提取、重复检测与 Eagle 库迁移，Rust 核心三形态交付",
    lang: "TypeScript",
    stars: 0,
    url: "https://github.com/KurohaneKaoruko/Lilium",
    topics: ["Tauri", "Rust", "Image"],
    family: "principium",
  },
  {
    repoId: 1368484171,
    name: "ExMachina",
    taxon: "Anima Collectiva",
    vernacular: "群智",
    desc: "以集体智能与集群协作为核心的智能体系统：多智能体契约以文档为唯一事实源，面向群体协作的调度与协同框架",
    lang: "Rust",
    stars: 4,
    url: "https://github.com/ExMachina-Project/ExMachina",
    topics: ["AI Agents", "Swarm"],
    family: "principium",
  },
  // ── 器物 ──
  {
    repoId: 1402094804,
    name: "Myosotis",
    aliases: ["Myosotis-Chat"],
    taxon: "Myosotis loquax",
    vernacular: "勿忘我",
    desc: "多端 AI 陪伴聊天系统：Hub 服务器承载记忆引擎、模型调用与聊天软件接入（OneBot），桌面 / 移动 / 浏览器多端实时同步",
    lang: "TypeScript",
    stars: 0,
    url: "https://github.com/KurohaneKaoruko/Myosotis",
    topics: ["AI", "Chat", "Tauri"],
    family: "arsenalia",
  },
  {
    repoId: 1403525985,
    name: "Convallaria-Input",
    taxon: "Convallaria typica",
    vernacular: "铃兰",
    desc: "轻量、干净、可扩展的输入法：Rust 核心引擎（音节切分、码表、n-gram、Viterbi 整句解码）+ 平台原生前端，首期交付 Windows 中文",
    lang: "Rust",
    stars: 0,
    url: "https://github.com/KurohaneKaoruko/Convallaria-Input",
    topics: ["Rust", "IME", "TSF"],
    family: "arsenalia",
  },
  {
    repoId: 1427277204,
    name: "LoniceraMograph",
    taxon: "Lonicera motiva",
    vernacular: "忍冬",
    desc: "AI Agent 驱动的 Motion Graphics 创作工具：自然语言描述动画，Agent 通过工具调用写场景脚本、加载实时预览、自查错误并迭代修复",
    lang: "Rust",
    stars: 0,
    url: "https://github.com/KurohaneKaoruko/LoniceraMograph",
    topics: ["AI", "Motion Graphics", "Tauri"],
    family: "arsenalia",
  },
  {
    repoId: 1403463748,
    name: "Taraxacum-Draw",
    taxon: "Taraxacum pingens",
    vernacular: "蒲公英",
    desc: "去中心化联机绘画：mDNS 局域网发现 + WebRTC DataChannel 直连，无需自建服务器即可多人实时协作，桌面与移动双端",
    lang: "Dart",
    stars: 0,
    url: "https://github.com/KurohaneKaoruko/Taraxacum-Draw",
    topics: ["Flutter", "WebRTC", "P2P"],
    family: "arsenalia",
  },
  {
    repoId: 1427277605,
    name: "RoseZIP",
    taxon: "Rosa compressa",
    vernacular: "蔷薇",
    desc: "Rust 高性能解压缩工具：ZIP / 7z / tar 全格式原生支持、ZipCrypto 与 AES 加密爆破、归档就地编辑，GUI / TUI / CLI 三种形态",
    lang: "Rust",
    stars: 0,
    url: "https://github.com/KurohaneKaoruko/RoseZIP",
    topics: ["Rust", "Tauri", "Archive"],
    family: "arsenalia",
  },
  {
    repoId: 1425592231,
    name: "LycorisWallet",
    taxon: "Lycoris custos",
    vernacular: "石蒜",
    desc: "本地优先的加密货币钱包",
    lang: "Rust",
    stars: 1,
    url: "https://github.com/KurohaneKaoruko/LycorisWallet",
    topics: ["Rust", "Wallet"],
    family: "arsenalia",
  },
  {
    repoId: 1411723578,
    name: "CodeView",
    taxon: "Codex visorius",
    vernacular: "阅码",
    desc: "轻量项目代码查看器：文件树、多标签阅读 / 编辑、语法高亮与编辑增强，一套界面 Web 与桌面（Tauri）两种形态",
    lang: "Rust",
    stars: 0,
    url: "https://github.com/KurohaneKaoruko/CodeView",
    topics: ["Rust", "Tauri", "Editor"],
    family: "arsenalia",
  },
  // ── 智能体 ──
  {
    repoId: 1333278181,
    name: "DSH-Creator",
    aliases: ["DSH-Novelist"],
    taxon: "Scriptor fabularum",
    vernacular: "说书人",
    desc: "小说作家智能体预设：面向中文网络小说长篇创作，1 个插件 7 个工具 + 12 个方法论 skill + 6 个文风 skill",
    lang: "JavaScript",
    stars: 12,
    url: "https://github.com/KurohaneKaoruko/DSH-Creator",
    topics: ["DSH", "Agent", "Novel"],
    family: "animulae",
  },
  {
    repoId: 1410682040,
    name: "Novelist-Skills",
    taxon: "Ars narrandi",
    vernacular: "叙事术",
    desc: "通用小说方法论 skill 集合：方法论按需加载、文风按作品加载，可跨项目复用",
    lang: "Markdown",
    stars: 2,
    url: "https://github.com/KurohaneKaoruko/Novelist-Skills",
    topics: ["Agent Skills", "Novel"],
    family: "animulae",
  },
  {
    repoId: 1188161351,
    name: "ExMachina-Prompts",
    taxon: "Verba imperii",
    vernacular: "言令",
    desc: "将 AI 调教成绝对理性的提示词工程：目标是把模型打造成高度智能、强理性逻辑的系统",
    lang: "Markdown",
    stars: 1,
    url: "https://github.com/ExMachina-Project/ExMachina-Prompts",
    topics: ["Prompt Engineering"],
    family: "animulae",
  },
  {
    repoId: 1419348908,
    name: "emotion-skill",
    taxon: "Animus affectus",
    vernacular: "情志",
    desc: "让任何 Agent 在干活时拥有自我情感的通用 Skill：不定义人设，让情感从情境中生成并承载信息，适用于任何支持 Agent Skills 的运行时",
    lang: "Markdown",
    stars: 0,
    url: "https://github.com/KurohaneKaoruko/emotion-skill",
    topics: ["Agent Skills"],
    family: "animulae",
  },
  {
    repoId: 1410454466,
    name: "ARTEX",
    taxon: "Ars penetrandi",
    vernacular: "攻防",
    desc: "AI 自主渗透测试系统 — 百度「agent+」攻防挑战赛冠军项目",
    lang: "",
    stars: 0,
    url: "https://github.com/KurohaneKaoruko/ARTEX",
    topics: ["Security", "AI"],
    family: "animulae",
  },
  {
    name: "AAAAI",
    taxon: "Fortuna automata",
    vernacular: "自动财",
    desc: "Ai-Agent-Auto-Asset-Investment：多智能体自动化资产投资",
    lang: "TypeScript",
    stars: 1,
    url: "https://github.com/KurohaneKaoruko/AAAAI",
    topics: ["AI Agents", "Finance"],
    family: "animulae",
  },
  {
    repoId: 1410553567,
    name: "Multi-Agent-RL",
    taxon: "Turba discens",
    vernacular: "群学",
    desc: "多智能体强化学习：对抗反馈强化学习与协作反馈强化学习",
    lang: "TypeScript",
    stars: 0,
    url: "https://github.com/KurohaneKaoruko/Multi-Agent-RL",
    topics: ["RL", "Multi-Agent"],
    family: "animulae",
  },
  {
    repoId: 1403565535,
    name: "AI-MusicVideo",
    taxon: "Musica machinalis",
    vernacular: "机乐",
    desc: "用代码合成音乐、再把整条时间轴渲染成终端风 MV 的实验场",
    lang: "Rust",
    stars: 0,
    url: "https://github.com/KurohaneKaoruko/AI-MusicVideo",
    topics: ["Audio", "Video", "Rust"],
    family: "animulae",
  },
  // ── 游戏 ──
  {
    repoId: 1168335883,
    name: "Rosemary-Maidcafe",
    taxon: "Rosmarinus tabernarius",
    vernacular: "迷迭香",
    desc: "女仆咖啡厅模拟经营单机游戏，Tauri + Next.js 构建",
    lang: "TypeScript",
    stars: 2,
    url: "https://github.com/KurohaneKaoruko/Rosemary-Maidcafe",
    topics: ["Game", "Tauri"],
    family: "ludi",
  },
  {
    repoId: 1394146385,
    name: "Alchemy-Workshop",
    taxon: "Alchemia officina",
    vernacular: "炼金",
    desc: "炼金术题材游戏",
    lang: "TypeScript",
    stars: 1,
    url: "https://github.com/KurohaneKaoruko/Alchemy-Workshop",
    topics: ["Game"],
    family: "ludi",
  },
  {
    repoId: 1416383918,
    name: "Infinity-Increment",
    taxon: "Numerus infinitus",
    vernacular: "增量",
    desc: "无限增量游戏",
    lang: "TypeScript",
    stars: 1,
    url: "https://github.com/KurohaneKaoruko/Infinity-Increment",
    topics: ["Game"],
    family: "ludi",
  },
  {
    repoId: 958734434,
    name: "Project-Space",
    taxon: "Spatium experimentorum",
    vernacular: "试验场",
    desc: "Next.js 互动实验与项目合集：游戏、可视化模拟、实用工具等多种类型的前端小项目集合",
    lang: "TypeScript",
    stars: 2,
    url: "https://github.com/KurohaneKaoruko/Project-Space",
    homepage: "https://rosmarin.vercel.app",
    topics: ["Next.js", "Experiments"],
    family: "ludi",
  },
  // ── Screeps 系列：单一游戏（ screeps.com ）的周边工具，照常入馆与排序 ──
  {
    repoId: 1161116775,
    name: "ScreepsDashboard",
    taxon: "Custode ludi",
    vernacular: "哨卫",
    desc: "Screeps 的数据面板软件",
    lang: "TypeScript",
    stars: 8,
    url: "https://github.com/KurohaneKaoruko/ScreepsDashboard",
    topics: ["screeps", "screeps-game"],
    family: "ludi",
  },
  {
    repoId: 1130407364,
    name: "Screeps-Tools",
    taxon: "Instruments ludi",
    vernacular: "棋具",
    desc: "用 Next.js 编写的 Screeps 工具合集网站",
    lang: "TypeScript",
    stars: 6,
    url: "https://github.com/KurohaneKaoruko/Screeps-Tools",
    topics: ["screeps", "Next.js"],
    family: "ludi",
  },
  {
    repoId: 1413819359,
    name: "Screeps-Simulation",
    taxon: "Speculum ludi",
    vernacular: "沙盘",
    desc: "Screeps 的本地模拟器",
    lang: "Rust",
    stars: 2,
    url: "https://github.com/KurohaneKaoruko/Screeps-Simulation",
    topics: ["screeps", "Rust"],
    family: "ludi",
  },
  {
    repoId: 1123698855,
    name: "MiniTools-Rust",
    taxon: "Instrumenta minora",
    vernacular: "什器",
    desc: "用 Rust 编写的命令行小工具集",
    lang: "Rust",
    stars: 4,
    url: "https://github.com/KurohaneKaoruko/MiniTools-Rust",
    topics: ["Rust", "CLI"],
    family: "arsenalia",
  },
];

/** 语言 → 徽标色。只在索引行里做一个 5px 的小圆点，不参与大面积上色。 */
export const langColor: Record<string, string> = {
  TypeScript: "#3178c6",
  Rust: "#b7582f",
  JavaScript: "#c9a227",
  Python: "#3572A5",
  Dart: "#00B4AB",
  Markdown: "#6b7280",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "Jupyter Notebook": "#da5b0b",
};

export type ProjectIdentity = Pick<Project, "name" | "repoId">;

/** 用不变的 ID 找回策展资料；历史名称只用于兼容没有 ID 的引用。 */
export function curatedProject(
  reference: string | ProjectIdentity,
): Project | undefined {
  const name = typeof reference === "string" ? reference : reference.name;
  const repoId = typeof reference === "string" ? undefined : reference.repoId;
  if (repoId !== undefined) {
    const match = projects.find((project) => project.repoId === repoId);
    if (match) return match;
  }
  const key = name.toLowerCase();
  return projects.find(
    (project) =>
      (repoId === undefined || project.repoId === undefined) &&
      [project.name, ...(project.aliases ?? [])].some(
        (alias) => alias.toLowerCase() === key,
      ),
  );
}

/** 采集号按策展顺序固定，仓库改名和实时排序均不改变编号。 */
export function accessionOf(reference: string | ProjectIdentity): string {
  const project = curatedProject(reference);
  const index = project ? projects.indexOf(project) : -1;
  if (index < 0) return "KK-—";
  return "KK-" + String(index + 1).padStart(4, "0");
}

/** 科属查询 */
export function familyOf(id: FamilyId): Family {
  return FAMILIES.find((f) => f.id === id) ?? FAMILIES[FAMILIES.length - 1];
}
