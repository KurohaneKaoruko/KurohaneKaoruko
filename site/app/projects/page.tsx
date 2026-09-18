import type { Metadata } from "next";
import ProjectsGrid from "@/components/ProjectsGrid";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = { title: "项目库 / PROJECTS" };

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-dim">
          {"// repositories"}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">项目库</h1>
        <p className="mt-3 text-text-muted">来自 GitHub 的真实仓库 —— 用技术解决问题的痕迹。</p>
      </Reveal>
      <div className="tech-ruler-h mt-8 opacity-40" />
      <div className="mt-10">
        <ProjectsGrid />
      </div>
    </section>
  );
}
