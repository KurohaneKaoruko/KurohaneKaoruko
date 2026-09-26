"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { projects as CURATED } from "@/lib/data";
import { fetchRepos, readCache, type Repo } from "@/lib/repos";

type ReposContextValue = {
  repos: Repo[];
  /** static = 站内手写快照；live = 这一份来自 GitHub 实时接口 */
  source: "static" | "live";
  /** 上次同步成功的时间戳（毫秒） */
  syncedAt: number | null;
  /** 正在同步 */
  pending: boolean;
  /** 最近一次同步失败（限额用尽 / 离线 / 超时都算） */
  failed: boolean;
  sync: () => void;
};

const ReposContext = createContext<ReposContextValue | undefined>(undefined);

/**
 * 仓库数据的实时来源。
 *
 * 首屏用站内手写快照渲染 —— 这既是服务端导出的内容，也是接口挂掉时的兜底，
 * 所以服务端与客户端首次渲染完全一致，不存在水合不一致。
 * 挂载后（以及在缓存过期时）再从浏览器直连 GitHub 换成实时数据。
 *
 * 缓存放在 localStorage，TTL 见 lib/repos.ts：未认证限额只有 60 次/小时/IP，
 * 不做缓存的话反复刷新很容易把自己限流。
 */
export function ReposProvider({ children }: { children: ReactNode }) {
  const [repos, setRepos] = useState<Repo[]>(CURATED);
  const [source, setSource] = useState<"static" | "live">("static");
  const [syncedAt, setSyncedAt] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  /** 同一时刻只允许一个请求在飞，避免连点刷新把限额打光 */
  const inFlightRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      inFlightRef.current?.abort();
    };
  }, []);

  const sync = useCallback(() => {
    if (inFlightRef.current) return;
    const controller = new AbortController();
    inFlightRef.current = controller;
    setPending(true);

    fetchRepos(controller.signal)
      .then((result) => {
        if (!mountedRef.current) return;
        setRepos(result.repos);
        setSyncedAt(result.syncedAt);
        setSource("live");
        setFailed(false);
      })
      .catch(() => {
        // 拉不到就继续用快照：星标可能不是最新的，但页面不能因此空掉或报错
        if (!mountedRef.current) return;
        setFailed(true);
      })
      .finally(() => {
        if (inFlightRef.current === controller) inFlightRef.current = null;
        if (mountedRef.current) setPending(false);
      });
  }, []);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setRepos(cached.repos);
      setSyncedAt(cached.syncedAt);
      setSource("live");
      return;
    }
    sync();
  }, [sync]);

  const value = useMemo(
    () => ({ repos, source, syncedAt, pending, failed, sync }),
    [repos, source, syncedAt, pending, failed, sync]
  );

  return <ReposContext.Provider value={value}>{children}</ReposContext.Provider>;
}

export function useRepos() {
  const context = useContext(ReposContext);
  if (!context) throw new Error("useRepos 必须在 ReposProvider 内使用");
  return context;
}
