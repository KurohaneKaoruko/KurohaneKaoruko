import { projects as CURATED } from "@/lib/data";
import { SITE } from "@/lib/site";
import type { FamilyId, Project } from "@/lib/data";

/** GitHub API 返回的仓库原文（只声明站点消费的字段） */
export type ApiRepo = {
  /** GitHub 数字 ID：仓库改名后不变，是唯一可靠的主键（name 会变） */
  id?: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  homepage: string | null;
  topics?: string[];
  fork: boolean;
  pushed_at: string;
};

/**
 * 仓库数据的两层结构。
 *
 * **兜底层**（构建时）：lib/data.ts 的策展清单直接作为首屏数据 —— SSR HTML
 * 有完整内容，不发起任何 GitHub 请求。策展条目里的星标是手写的，允许与
 * 实时值有出入，只求首屏不空、排序接近真实。
 *
 * **实时层**（浏览器直连 GitHub）：页面打开后同步一次，按 GitHub 数字 ID
 * 合并覆盖兜底数据 —— 星标、描述、仓库数全部以实时为准。合并按仓库逐个
 * 进行而不是整表替换，列表接口偶尔漏仓库（实测 /users/:user/repos 丢过
 * 已转移走的项目）时，兜底条目不会凭空消失。
 *
 * 文案与归档的覆写：lib/data.ts 登记过的仓库，desc / topics / 科属 /
 * 学名以手写版为准；没登记的采用 GitHub 原文，归入「待定」柜。
 */

export type Repo = Project & {
  /** GitHub 数字 ID（改名不变的身份主键；旧快照数据可能缺失） */
  repoId?: number;
  /** 策展顺序：登记过的按清单次序，新仓库排在后面 */
  order: number;
};

/**
 * 不属于「展品」的仓库：站点仓库本身、自用模板与机器人。
 * 注意口径：这里只剔除**非作品**，不按题材挑拣 —— Screeps 系列虽然是
 * 单一游戏的工具，但它们是真实的公开作品，照常入馆、照常参与星标排序。
 */
export const EXCLUDED_REPOS = new Set([
  "KurohaneKaoruko",
  "Repo-Template",
  "Rosmarin-Bot",
  "Nexus-Bot",
]);

/** 未认证的公开接口限额是 60 次/小时/IP，结果要缓存 */
export const REPOS_CACHE_KEY = "kh-repos-v2";
export const REPOS_CACHE_TTL = 30 * 60 * 1000;

const API_URL = `https://api.github.com/users/${SITE.handle}/repos?per_page=100&sort=pushed`;

/** 请求超时：慢网络下别让"同步中"一直挂着 */
const REQUEST_TIMEOUT = 8000;

export type SyncResult = { repos: Repo[]; syncedAt: number };

/**
 * 排序口径：星标高的在前，同分按策展顺序。
 * 站点里所有「列表」都走这个次序，精选、首页、档案页三处不会各排各的。
 */
function byStars(a: Repo, b: Repo) {
  return b.stars - a.stars || a.order - b.order || a.name.localeCompare(b.name);
}

/** 精选：星标最高的几个，同分按策展顺序 */
export function pickFeatured<T extends { stars: number; order: number }>(
  repos: T[],
  count = 3,
): T[] {
  return [...repos]
    .sort((a, b) => b.stars - a.stars || a.order - b.order)
    .slice(0, count);
}

/** 把 API 形状的仓库整理成站点用的 Repo */
function toRepo(r: ApiRepo, order: number, curated?: Project): Repo {
  if (curated) {
    return {
      ...curated,
      repoId: r.id,
      lang: r.language ?? curated.lang,
      stars: r.stargazers_count,
      url: r.html_url,
      homepage: curated.homepage ?? (r.homepage?.trim() || undefined),
      pushedAt: r.pushed_at,
      order,
    };
  }
  return {
    repoId: r.id,
    name: r.name,
    taxon: r.name,
    vernacular: "",
    desc: (r.description ?? "").trim(),
    lang: r.language ?? "",
    stars: r.stargazers_count,
    url: r.html_url,
    homepage: r.homepage?.trim() || undefined,
    topics: r.topics ?? [],
    family: "incertae" as FamilyId,
    pushedAt: r.pushed_at,
    order,
  };
}

/**
 * 把一批 API 仓库合并进当前列表。合并主键是 **GitHub 数字 ID**（raw.id）：
 * 仓库名会变（改名后快照里的旧名与实时的新名是同一个仓库，按 name 合并
 * 会出现「一仓两名」），数字 ID 改名后不变。
 * 旧快照条目若无 id（旧版数据），退回按 name 匹配。
 * 列表里没有的旧条目保留原样 —— 覆盖语义是「补全」而非「替换」——
 * 列表接口漏仓库时（实测 /users/:user/repos 丢过已转移走的项目）不凭空消失。
 */
function mergeRepos(base: Repo[], incoming: ApiRepo[]): Repo[] {
  const curatedByName = new Map(CURATED.map((p, i) => [p.name, { project: p, order: i }]));
  const merged = new Map(base.map((r) => [r.name, r]));
  const baseById = new Map(base.filter((r) => r.repoId !== undefined).map((r) => [r.repoId, r]));

  for (const raw of incoming) {
    if (raw.fork || EXCLUDED_REPOS.has(raw.name)) continue;
    const curated = curatedByName.get(raw.name);
    const repo = toRepo(raw, curated?.order ?? 1000, curated?.project);
    const existing = baseById.get(raw.id) ?? merged.get(raw.name);
    if (existing) merged.delete(existing.name); // 改名场景：移除旧名条目，避免一仓两名
    merged.set(repo.name, repo);
  }

  return [...merged.values()].sort(byStars);
}

/**
 * 构建时兜底清单：纯策展数据（lib/data.ts），不依赖任何 GitHub 请求。
 * 角色是「首屏占位 + 离线兜底」：SSR HTML 用它渲染，实时数据到达后
 * mergeRepos 按 ID/名字合并覆盖（星标、描述、数量全部以实时为准）。
 * 以前这里是一份每日 Actions 固化的 API 快照；改为纯实时获取后不再
 * 打包任何 API 数据，策展条目里手写的 stars 只在实时请求成功前可见，
 * 允许略有出入。
 */
export const SNAPSHOT: Repo[] = CURATED.map((p, i) => ({
  ...p,
  pushedAt: "",
  order: i,
}));

/** 读缓存；过期或损坏都当作没有 */
export function readCache(): SyncResult | null {
  try {
    const raw = window.localStorage.getItem(REPOS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SyncResult;
    if (!Array.isArray(parsed?.repos) || typeof parsed.syncedAt !== "number") return null;
    if (Date.now() - parsed.syncedAt > REPOS_CACHE_TTL) return null;
    return parsed;
  } catch {
    /* 隐私模式 / 存储被禁用 / JSON 损坏 —— 当作没有缓存 */
    return null;
  }
}

function writeCache(result: SyncResult) {
  try {
    window.localStorage.setItem(REPOS_CACHE_KEY, JSON.stringify(result));
  } catch {
    /* 写不进去就算了，只是下次还得再拉一次 */
  }
}

/**
 * 拉取并整理。失败一律抛错，由调用方决定退回快照 —— 这里不做静默降级，
 * 否则调用方分不清"拿到了空列表"和"根本没拉到"。
 */
export async function fetchRepos(signal?: AbortSignal): Promise<SyncResult> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const res = await fetch(API_URL, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const api = (await res.json()) as ApiRepo[];
    if (!api.length) throw new Error("GitHub API 返回空列表");

    const repos = mergeRepos(SNAPSHOT, api);
    const result: SyncResult = { repos, syncedAt: Date.now() };
    writeCache(result);
    return result;
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
