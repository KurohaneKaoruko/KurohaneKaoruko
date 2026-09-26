"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import BrutalistHome from "@/components/themes/BrutalistHome";
import TerminalHome from "@/components/themes/TerminalHome";

/**
 * 按当前主题选用首页设计。
 *
 * 两套设计的差异是**信息架构**层面的（轴方向、容器形态、分组方式、
 * 阅读路径、排版层级），不是同一套骨架换配色，所以没法只靠 CSS 变量切，
 * 必须换组件树。
 *
 * 服务端渲染时先出默认主题（终端）的结构，水合后按实际主题替换。
 * 这一次结构切换发生在启动屏黑幕后面，用户看不到 —— 启动屏最短展示
 * 1.5s，远长于水合耗时。
 */
export default function ThemedHome() {
  const { theme } = useTheme();
  return theme === "brutalist" ? <BrutalistHome /> : <TerminalHome />;
}
