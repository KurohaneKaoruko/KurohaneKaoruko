"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import BrutalistHome from "@/components/themes/BrutalistHome";
import CassetteHome from "@/components/themes/CassetteHome";
import CyberpunkHome from "@/components/themes/CyberpunkHome";
import GlacialHome from "@/components/themes/GlacialHome";
import GlitchHome from "@/components/themes/GlitchHome";
import MaximalHome from "@/components/themes/MaximalHome";
import MinimalHome from "@/components/themes/MinimalHome";
import SwissHome from "@/components/themes/SwissHome";
import TerminalHome from "@/components/themes/TerminalHome";
import VaporwaveHome from "@/components/themes/VaporwaveHome";
import Y2KHome from "@/components/themes/Y2KHome";

/**
 * 按当前主题选用首页设计。
 *
 * 各套设计的差异是**信息架构**层面的（轴方向、容器形态、分组方式、
 * 阅读路径、排版层级），不是同一套骨架换配色，所以没法只靠 CSS 变量切，
 * 必须换组件树。
 *
 * 服务端渲染时先出默认主题（终端）的结构，水合后按实际主题替换。
 * 这一次结构切换发生在启动屏黑幕后面，用户看不到 —— 启动屏最短展示
 * 1.5s，远长于水合耗时。
 */
export default function ThemedHome() {
  const { theme } = useTheme();
  if (theme === "brutalist") return <BrutalistHome />;
  if (theme === "glacial") return <GlacialHome />;
  if (theme === "maximal") return <MaximalHome />;
  if (theme === "glitch") return <GlitchHome />;
  if (theme === "minimal") return <MinimalHome />;
  if (theme === "cyberpunk") return <CyberpunkHome />;
  if (theme === "vaporwave") return <VaporwaveHome />;
  if (theme === "y2k") return <Y2KHome />;
  if (theme === "cassette") return <CassetteHome />;
  if (theme === "swiss") return <SwissHome />;
  return <TerminalHome />;
}
