"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { useCollectionStats, useRepos } from "@/components/ReposProvider";
import { FAMILIES, familyOf, type FamilyId } from "@/lib/data";
import type { Repo } from "@/lib/repos";
import { SpecimenTrigger } from "@/components/collection/SpecimenTrigger";

const repoKey = (repo: Repo) => repo.repoId ?? repo.url;

export function RepositoryIndex() {
  const { repos, status } = useRepos();
  const stats = useCollectionStats();
  const [family, setFamily] = useState<FamilyId | "all">("all");
  const [selected, setSelected] = useState<ReturnType<typeof repoKey> | null>(
    null,
  );
  const families = FAMILIES.filter((f) =>
    repos.some((repo) => repo.family === f.id),
  );
  const currentFamily = families.some((f) => f.id === family) ? family : "all";
  const visible = repos
    .filter((repo) => currentFamily === "all" || repo.family === currentFamily)
    .slice(0, 6);
  const active = Math.max(
    0,
    visible.findIndex((repo) => repoKey(repo) === selected),
  );
  const preview = visible[active];

  const filter = (next: FamilyId | "all") => {
    setFamily(next);
    setSelected(null);
  };

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
        <div className="folio-source-summary">
          <div className="folio-source-stats">
            <div>
              <strong>{String(stats.total).padStart(2, "0")}</strong>
              <span>PUBLIC PROJECTS</span>
            </div>
            <div>
              <strong>
                {stats.stars}
                <span aria-hidden="true">★</span>
              </strong>
              <span>GITHUB STARS</span>
            </div>
            <div>
              <strong>{String(stats.langs).padStart(2, "0")}</strong>
              <span>LANGUAGES</span>
            </div>
          </div>
          {preview && (
            <aside className="folio-source-preview" aria-label="仓库预览">
              <div className="folio-preview-head">
                <span>仓库预览</span>
                <span>{familyOf(preview.family).code}</span>
              </div>
              <div key={repoKey(preview)} className="folio-preview-content">
                <p className="folio-preview-name">{preview.name}</p>
                <p className="folio-preview-description">
                  {preview.desc || "这个仓库还没有说明。"}
                </p>
                <p className="folio-preview-meta">
                  {preview.lang || "—"}
                  <span aria-hidden="true">/</span>
                  {preview.stars} <span aria-hidden="true">★</span>
                  <span className="sr-only">个 GitHub 星标</span>
                </p>
              </div>
            </aside>
          )}
        </div>
        <div className="folio-source-list">
          <div
            className="folio-source-filters"
            role="group"
            aria-label="筛选首页项目"
          >
            <button
              type="button"
              aria-pressed={currentFamily === "all"}
              onClick={() => filter("all")}
            >
              全部
            </button>
            {families.map((f) => (
              <button
                type="button"
                key={f.id}
                aria-pressed={currentFamily === f.id}
                onClick={() => filter(f.id)}
              >
                {f.cn}
              </button>
            ))}
          </div>
          <span className="sr-only" role="status">
            当前展示 {visible.length} 个仓库。
          </span>
          {visible.length > 0 && (
            <ul
              className="folio-source-rows"
              style={
                {
                  "--active-row": active,
                } as CSSProperties
              }
            >
              {visible.map((repo, i) => (
                <li
                  key={`${repoKey(repo)}:${repo.url}`}
                  data-preview={i === active}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse")
                      setSelected(repoKey(repo));
                  }}
                  onFocus={() => setSelected(repoKey(repo))}
                  onClick={() => setSelected(repoKey(repo))}
                >
                  <SpecimenTrigger repo={repo} className="folio-source-row">
                    <span className="folio-row-no" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <span className="folio-source-name">{repo.name}</span>
                    <span className="folio-source-lang">
                      {repo.lang || "—"}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </SpecimenTrigger>
                </li>
              ))}
            </ul>
          )}
          <Link href="/projects/" className="folio-source-all">
            查看完整索引 <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
