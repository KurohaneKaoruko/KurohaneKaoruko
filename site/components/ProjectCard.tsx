import TiltCard from "@/components/TiltCard";
import { StatusStamp } from "@/components/ui/StatusStamp";
import { langColor, type Project } from "@/lib/data";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard className="flex h-full flex-col p-5">
      <StatusStamp text={project.stars > 5 ? "HOT" : "ACTIVE"} />
      <div className="pr-14">
        <h3 className="font-mono text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {project.name}
        </h3>
      </div>
      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-text-muted">
        {project.desc}
      </p>
      {project.topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.topics.slice(0, 3).map((t) => (
            <span
              key={t}
              className="border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-xs">
        <span className="flex items-center gap-2 text-text-muted">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: langColor[project.lang] ?? "#888888" }}
          />
          {project.lang}
        </span>
        <span className="flex items-center gap-3">
          <span className="text-primary">★ {project.stars}</span>
          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noreferrer"
              className="text-secondary transition-colors hover:text-foreground"
            >
              LIVE ↗
            </a>
          )}
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="text-text-muted transition-colors hover:text-primary"
          >
            SRC ↗
          </a>
        </span>
      </div>
    </TiltCard>
  );
}
