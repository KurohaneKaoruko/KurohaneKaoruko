import type { ComponentType } from "react";
import { archive } from "@/components/themes/archive";
import { brutalist } from "@/components/themes/brutalist";
import { cassette } from "@/components/themes/cassette";
import { cyberpunk } from "@/components/themes/cyberpunk";
import { deconstruct } from "@/components/themes/deconstruct";
import { glacial } from "@/components/themes/glacial";
import { glitch } from "@/components/themes/glitch";
import { maximal } from "@/components/themes/maximal";
import { minimal } from "@/components/themes/minimal";
import { swiss } from "@/components/themes/swiss";
import { terminal } from "@/components/themes/terminal";
import { vaporwave } from "@/components/themes/vaporwave";
import { y2k } from "@/components/themes/y2k";
import type { ThemeDefinition } from "@/components/theme/types";

/**
 * 主题注册表。
 *
 * 这里是全站唯一知道「有哪些主题」的地方。每个主题是一个目录：
 *   themes/<id>/index.ts   元数据 + 首页加载器
 *   themes/<id>/Home.tsx   完全独立的首页组件树
 *   themes/<id>/theme.css  只作用于 [data-theme="<id>"] 的令牌与装饰
 *
 * 新增主题 = 新建目录 + 在下面 import 一行、数组加一项。
 * 删除主题 = 删掉目录与对应的两行。其他主题的代码与样式不需要改动。
 * 数组顺序就是选择器里的展示顺序。
 */
export const THEMES = [
  archive,
  terminal,
  brutalist,
  glacial,
  maximal,
  glitch,
  minimal,
  cyberpunk,
  vaporwave,
  y2k,
  cassette,
  swiss,
  deconstruct,
] as const satisfies readonly ThemeDefinition[];

export type ThemeId = (typeof THEMES)[number]["meta"]["id"];

export const DEFAULT_THEME: ThemeId = "archive";

export const THEME_STORAGE_KEY = "kk-theme";

const THEME_IDS: readonly string[] = THEMES.map((theme) => theme.meta.id);

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && THEME_IDS.includes(value);
}

export function getTheme(id: string): ThemeDefinition {
  return (THEMES.find((theme) => theme.meta.id === id) ?? archive) as ThemeDefinition;
}

export function getThemeMeta(id: string) {
  return getTheme(id).meta;
}

export function nextTheme(id: ThemeId): ThemeId {
  const index = THEMES.findIndex((theme) => theme.meta.id === id);
  return THEMES[(index + 1) % THEMES.length].meta.id;
}

/**
 * 首页 chunk 的共享加载缓存。
 * 选择器 hover / focus 时会预取，点击时 React.lazy 复用同一个 Promise，
 * 不会为同一主题发两次请求。
 */
const homeChunks = new Map<string, Promise<{ default: ComponentType }>>();

export function loadThemeHome(id: ThemeId): Promise<{ default: ComponentType }> {
  const cached = homeChunks.get(id);
  if (cached) return cached;
  const promise = getTheme(id).loadHome();
  homeChunks.set(id, promise);
  return promise;
}

/** 预取（只对非默认主题有意义） */
export function preloadTheme(id: ThemeId) {
  if (id === DEFAULT_THEME) return;
  void loadThemeHome(id);
}
