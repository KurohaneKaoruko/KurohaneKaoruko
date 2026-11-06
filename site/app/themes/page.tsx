import type { Metadata } from "next";
import { ThemesView } from "@/components/themes/ThemesView";

export const metadata: Metadata = {
  title: "主题",
  description:
    "同一座站点的十三套设计：终端、粗野、极境、极繁、故障、极简、赛博、蒸汽波、Y2K、卡带、瑞士、解构与默认档案。",
};

export default function ThemesPage() {
  return <ThemesView />;
}
