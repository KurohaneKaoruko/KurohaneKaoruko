"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/data";

const langs = ["ALL", "TypeScript", "Rust", "JavaScript", "Jupyter Notebook"];

export default function ProjectsGrid() {
  const [active, setActive] = useState("ALL");
  const shown = active === "ALL" ? projects : projects.filter((p) => p.lang === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {langs.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setActive(l)}
            className={
              "border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] transition-all " +
              (active === l
                ? "border-active bg-primary/10 text-primary"
                : "border-border text-text-muted hover:border-primary/50 hover:text-foreground")
            }
          >
            {l}
          </button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </div>
      <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.3em] text-text-dim">
        {String(shown.length).padStart(2, "0")} / {projects.length} repositories
      </p>
    </div>
  );
}
