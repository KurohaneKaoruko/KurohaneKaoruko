"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SNAPSHOT, fetchRepos, readCache, type Repo } from "@/lib/repos";

type Status = "snapshot" | "syncing" | "live" | "offline";

type ReposValue = {
  repos: Repo[];
  status: Status;
  syncedAt: number | null;
};

const ReposContext = createContext<ReposValue>({
  repos: SNAPSHOT,
  status: "snapshot",
  syncedAt: null,
});

/**
 * 仓库数据源。
 *
 * 初始值是构建内置的策展兜底清单（SSR 首屏有完整内容）；挂载后读
 * localStorage 缓存，再向 GitHub 实时同步一次，成功即覆盖（星标、描述、
 * 数量以实时为准），失败则停留在兜底数据上。纯实时获取，没有定时打包：
 * 站点只在代码变化时重新构建，仓库数据随每次访问刷新。
 */
export function ReposProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<ReposValue>({
    repos: SNAPSHOT,
    status: "snapshot",
    syncedAt: null,
  });

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setValue({ repos: cached.repos, status: "live", syncedAt: cached.syncedAt });
    }

    const controller = new AbortController();
    setValue((v) => ({ ...v, status: v.syncedAt ? "live" : "syncing" }));

    fetchRepos(controller.signal)
      .then((result) => {
        setValue({ repos: result.repos, status: "live", syncedAt: result.syncedAt });
      })
      .catch(() => {
        setValue((v) => ({ ...v, status: v.syncedAt ? "live" : "offline" }));
      });

    return () => controller.abort();
  }, []);

  return <ReposContext.Provider value={value}>{children}</ReposContext.Provider>;
}

export function useRepos() {
  return useContext(ReposContext);
}

/** 汇总数字：标本数、星标、语言数、科属数 */
export function useCollectionStats() {
  const { repos } = useRepos();
  const stars = repos.reduce((sum, r) => sum + r.stars, 0);
  const langs = new Set(repos.map((r) => r.lang).filter(Boolean));
  const families = new Set(repos.map((r) => r.family));
  return { total: repos.length, stars, langs: langs.size, families: families.size };
}
