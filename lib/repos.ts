import { SITE } from "@/lib/site";
import { projects as CURATED, type Project } from "@/lib/data";

/**
 * 仓库数据的实时层（纯浏览器端）。
 *
 * 站点是静态导出的，没有服务端运行时，所以这里直接从前端调 GitHub 公开 API：
 * 打开页面就能拿到当前星标、语言、最近推送，以及站内还没收录的新仓库，
 * 不必等一次重新构建。
 *
 * 两条原则：
 *   1. **永不空白**：`lib/data.ts` 里的手写清单先做为兜底快照渲染，
 *      拉取成功后再替换。拉取失败 / 超限 / 离线，页面照常显示快照。
 *   2. **手写文案是覆写层**：站内写的 `desc` / `topics` 是人工润色过的，
 *      命中同名仓库时保留；没写过的仓库（新仓库）才用 GitHub 的原文。
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

/** 人工覆写层：站内写过文案的仓库 */
const OVERRIDES = new Map(CURATED.map((p) => [p.name, p]));

/** 未认证的公开接口限额是 60 次/小时/IP，所以结果要缓存，别每次导航都打 */
export const REPOS_CACHE_KEY = "kk-repos";
export const REPOS_CACHE_TTL = 10 * 60 * 1000;

const API_URL =
  `https://api.github.com/users/${SITE.handle}/repos?per_page=100&sort=pushed`;

/** 请求超时：慢网络下别让"同步中"一直挂着 */
const REQUEST_TIMEOUT = 8000;

export type SyncResult = { repos: Repo[]; syncedAt: number };

/**
 * 把 API 原始数据整理成站点用的形状。
 * - 剔除 fork
 * - 站内手写文案优先，缺的字段用 GitHub 补
 * - 星标降序（同分按名称），保证顺序稳定
 */
export function normalizeRepos(api: ApiRepo[]): Repo[] {
  return api
    .filter((r) => !r.fork)
    .map<Repo>((r) => {
      const override = OVERRIDES.get(r.name);
      return {
        name: r.name,
        desc: override?.desc?.trim() || (r.description ?? "").trim(),
        lang: r.language ?? override?.lang ?? "",
        stars: r.stargazers_count,
        url: r.html_url,
        homepage: r.homepage?.trim() || undefined,
        topics: override?.topics?.length ? override.topics : (r.topics ?? []),
        pushedAt: r.pushed_at,
      };
    })
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
