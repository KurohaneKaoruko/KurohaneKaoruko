import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "关于",
  description: "Kurohane Kaoruko：独立开发者，写 Agent 系统、桌面工具与游戏。",
};

export default function AboutPage() {
  return <AboutView />;
}
