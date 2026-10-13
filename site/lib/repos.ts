import { SITE } from "@/lib/site";
import type { Project } from "@/lib/data";

/**
 * 仓库数据的实时层（纯浏览器端）。
 *
 * 站点是静态导出的，没有服务端运行时，所以这里直接从前端调 GitHub 公开 API：
 * 星标、语言、介绍、topics、最近推送全部以 GitHub 原文为准，
 * 站内不做人工覆写（用户裁决：别自己写，全部获取）。
 *
 * 仍保留的一条原则：**永不空白** —— `lib/data.ts` 里的清单只作为「接口失败 /
 * 超限 / 离线」时的兜底快照，正常路径下页面展示的内容 100% 来自 GitHub。
 */

/** 站内清单没有记录最近推送时间，实时数据才有 */
export type Repo = Project & { pushedAt?: string };

/** GitHub /users/:user/repos 里我们真正用到的字段 */
type ApiRepo = {
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

/** 未认证的公开接口限额是 60 次/小时/IP，所以结果要缓存，别每次导航都打 */
export const REPOS_CACHE_KEY = "kk-repos";
export const REPOS_CACHE_TTL = 30 * 60 * 1000;

const API_URL =
  `https://api.github.com/users/${SITE.handle}/repos?per_page=100&sort=pushed`;

/** 请求超时：慢网络下别让"同步中"一直挂着 */
const REQUEST_TIMEOUT = 8000;

export type SyncResult = { repos: Repo[]; syncedAt: number };

/**
 * 把 API 原始数据整理成站点用的形状。
 * - 剔除 fork
 * - 全部字段以 GitHub 返回为准，站内不覆写
 * - 星标降序（同分按名称），保证顺序稳定
 */
export function normalizeRepos(api: ApiRepo[]): Repo[] {
  return api
    .filter((r) => !r.fork)
    .map<Repo>((r) => ({
      name: r.name,
      desc: (r.description ?? "").trim(),
      lang: r.language ?? "",
      stars: r.stargazers_count,
      url: r.html_url,
      homepage: r.homepage?.trim() || undefined,
      topics: r.topics ?? [],
      pushedAt: r.pushed_at,
    }))
    .sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
}

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
      // 缓存由我们自己按 TTL 管，交给浏览器反而不好控制
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`GitHub API ${res.status}`);
    }
    const api = (await res.json()) as ApiRepo[];
    const repos = normalizeRepos(api);
    if (!repos.length) throw new Error("GitHub API 返回空列表");

    const result: SyncResult = { repos, syncedAt: Date.now() };
    writeCache(result);
    return result;
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
