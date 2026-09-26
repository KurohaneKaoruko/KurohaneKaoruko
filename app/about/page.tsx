import type { Metadata } from "next";
import AboutView from "@/components/themes/AboutView";

export const metadata: Metadata = {
  title: "关于",
  description: "事实格（专注方向 / 技术栈）、技术栈分组，以及 GitHub 统计卡片。",
};

export default function AboutPage() {
  return <AboutView />;
}
