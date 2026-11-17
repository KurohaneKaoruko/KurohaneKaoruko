"use client";

import Link from "next/link";
import { useState } from "react";
import { useCollectionStats, useRepos } from "@/components/ReposProvider";
import { FAMILIES, type FamilyId } from "@/lib/data";
import { SpecimenTrigger } from "@/components/collection/SpecimenTrigger";

export function RepositoryIndex() {
  const { repos, status } = useRepos();
  const stats = useCollectionStats();
  const [family, setFamily] = useState<FamilyId | "all">("all");
  const visible = repos
    .filter((repo) => family === "all" || repo.family === family)
    .slice(0, 6);

  return (
    <section
      className="folio-source"
      id="collection"
      aria-labelledby="folio-source-title"
    >
      <div className="folio-source-head">
        <div>
          <span className="folio-caption">
            <i /> THE REPOSITORIES
          </span>
          <h2 id="folio-source-title">
            Open <span>source.</span>
          </h2>
        </div>
        <p className="folio-source-status">
          <i />{" "}
          {status === "live"
            ? "SYNCED WITH GITHUB"
            : status === "syncing"
              ? "SYNCING WITH GITHUB"
              : "SAVED COLLECTION"}
        </p>
      </div>
      <div className="folio-source-grid">
        <div className="folio-source-stats">
          <div>
            <strong>{String(stats.total).padStart(2, "0")}</strong>
            <span>PUBLIC PROJECTS</span>
          </div>
          <div>
            <strong>
              {stats.stars}
              <span>★</span>
            </strong>
            <span>GITHUB STARS</span>
          </div>
          <div>
            <strong>{String(stats.langs).padStart(2, "0")}</strong>
            <span>LANGUAGES</span>
          </div>
        </div>
        <div className="folio-source-list">
          <div
            className="folio-source-filters"
            role="group"
            aria-label="筛选首页项目"
          >
            <button
              type="button"
              aria-pressed={family === "all"}
              onClick={() => setFamily("all")}
            >
              全部
            </button>
            {FAMILIES.filter((f) =>
              repos.some((repo) => repo.family === f.id),
            ).map((f) => (
              <button
                type="button"
                key={f.id}
                aria-pressed={family === f.id}
                onClick={() => setFamily(f.id)}
              >
                {f.cn}
              </button>
            ))}
          </div>
          <div aria-live="polite">
            {visible.map((repo, i) => (
              <SpecimenTrigger
                key={repo.name}
                repo={repo}
                className="folio-source-row"
              >
                <span className="folio-row-no">0{i + 1}</span>
                <span className="folio-source-name">{repo.name}</span>
                <span className="folio-source-lang">{repo.lang || "—"}</span>
                <span aria-hidden="true">↗</span>
              </SpecimenTrigger>
            ))}
          </div>
          <Link href="/projects/" className="folio-source-all">
            查看完整索引 <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
