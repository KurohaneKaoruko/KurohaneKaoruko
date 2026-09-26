import type { Metadata } from "next";
import ProjectsView from "@/components/themes/ProjectsView";

export const metadata: Metadata = {
  title: "项目库",
  description: "来自 GitHub 的开源仓库 —— 用技术解决问题的痕迹。",
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
