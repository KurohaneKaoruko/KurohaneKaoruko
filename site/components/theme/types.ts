import type { ComponentType } from "react";

/**
 * 一套主题的元数据。
 *
 * 这里只放「给人看的东西」——选择器色卡、名称、描述、状态语。
 * 颜色令牌不在这里，而是在主题自己的 theme.css 里；这样加主题
 * 不会让注册表变成第二个样式表。
 */
export type ThemeMeta = {
  id: string;
  /** 英文名 / 设计代号 */
  name: string;
  /** 中文名 */
  label: string;
  desc: string;
  /** [底色, 强调色]，主题选择器色卡 */
  swatch: [string, string];
  /** 切换时的一句话状态 */
  status: string;
};

/**
 * 首页按需加载器。
 *
 * 默认主题由 app/page.tsx 直接服务端渲染，其余主题只有在第一次
 * 被选中时才拉取自己的组件树 —— 13 套首页不应该都进首屏包。
 */
export type ThemeHomeLoader = () => Promise<{ default: ComponentType }>;

/**
 * 一个主题 = 一份元数据 + 一棵独立的首页组件树 + 一份作用域 CSS。
 *
 * 主题目录里的 index.ts 只负责登记，不引用其他主题的任何东西；
 * 新增或删除主题时，只需在 registry.ts 里增删一行导入。
 */
export type ThemeDefinition = {
  meta: ThemeMeta;
  loadHome: ThemeHomeLoader;
};

/**
 * 保留字面量 id 的辅助函数。
 * 注册表因此能从数组推导出 ThemeId 联合类型，而不必手写两遍。
 */
export function defineTheme<const T extends ThemeDefinition>(theme: T): T {
  return theme;
}
