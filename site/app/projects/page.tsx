import type { Metadata } from "next";
import { ArchiveView } from "@/components/archive/ArchiveView";

export const metadata: Metadata = {
  title: "项目",
  description: "全部公开仓库：默认按星标排序，可按分类筛选、按名称检索或按更新时间排序。",
};

export default function ProjectsPage() {
  return <ArchiveView />;
}
