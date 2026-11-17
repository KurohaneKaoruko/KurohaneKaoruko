"use client";

import Link from "next/link";
import { useRepos } from "@/components/ReposProvider";
import { SpecimenTrigger } from "@/components/collection/SpecimenTrigger";
import { Experiment } from "./Experiment";
import { ExMachinaArtwork } from "./ExMachinaArtwork";
import { findRepo } from "@/lib/repos";

export function SelectedWork() {
  const { repos } = useRepos();
  const exm = findRepo(repos, "ExMachina");
  const space = findRepo(repos, "Project-Space");
  const novelist = findRepo(repos, "DSH-Creator");

  return (
    <section
      className="folio-work"
      id="selected"
      aria-labelledby="folio-work-title"
    >
      <div className="folio-section-top">
        <span className="folio-caption">
          <i /> SELECTED WORK
        </span>
        <span className="folio-caption">OPEN SOURCE / 01—03</span>
      </div>
      <h2 className="folio-work-title" id="folio-work-title">
        Selected <span>work.</span>
        <sup>(03)</sup>
      </h2>

      {exm && (
        <article
          className="folio-project folio-project-exm"
          id="project-exmachina"
        >
          <div className="folio-exhibit-head">
            <span className="folio-caption">01 / INTELLIGENCE</span>
            <span className="folio-caption">MULTI-AGENT SYSTEM</span>
          </div>
          <a
            className="folio-exhibit folio-exhibit-exm"
            href={exm.url}
            target="_blank"
            rel="noreferrer"
            title={`查看 ${exm.name} GitHub 仓库`}
          >
            <span className="sr-only">查看 {exm.name} GitHub 仓库 — </span>
            <ExMachinaArtwork name={exm.name} />
            <span className="folio-exhibit-open" aria-hidden="true">
              EXPLORE PROJECT <b>↗</b>
            </span>
          </a>
          <div className="folio-project-bottom">
            <div>
              <h3>
                {exm.name}
                <span className="folio-project-dot">.</span>
              </h3>
              <p>多智能体协作系统</p>
            </div>
            <div className="folio-project-stack">
              <span>Rust / AI Agents / Swarm</span>
              <SpecimenTrigger repo={exm} className="folio-inline-link">
                项目详情 <span aria-hidden="true">↗</span>
              </SpecimenTrigger>
            </div>
          </div>
        </article>
      )}

      <div className="folio-secondary-work">
        {space && (
          <article
            className="folio-project folio-project-space"
            id="project-space"
          >
            <div className="folio-exhibit-head">
              <span className="folio-caption">02 / COMPUTATION</span>
              <span className="folio-caption">LIVE EXPERIMENT</span>
            </div>
            <Experiment />
            <div className="folio-project-bottom">
              <div>
                <h3>
                  {space.name}
                  <span className="folio-project-dot">.</span>
                </h3>
                <p>游戏、算法与可视化实验</p>
              </div>
              <a
                className="folio-round-link"
                href={space.homepage || space.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`打开 ${space.name}`}
              >
                ↗
              </a>
            </div>
          </article>
        )}
        {novelist && (
          <article className="folio-project folio-project-novelist">
            <div className="folio-exhibit-head">
              <span className="folio-caption">03 / LANGUAGE</span>
              <span className="folio-caption">AGENT SKILLS</span>
            </div>
            <a
              className="folio-exhibit folio-exhibit-novelist"
              href={novelist.url}
              target="_blank"
              rel="noreferrer"
              title={`查看 ${novelist.name} GitHub 仓库`}
            >
              <span className="sr-only">{novelist.name} — </span>
              <span className="novelist-art-top">
                A SYSTEM FOR
                <br />
                STORIES.
              </span>
              <span className="novelist-art-grid">
                <span>
                  <b>12</b>
                  <small>METHODOLOGY</small>
                </span>
                <span>
                  <b>06</b>
                  <small>WRITING STYLES</small>
                </span>
              </span>
              <span className="novelist-art-bottom">
                <span>01 PLUGIN / 07 TOOLS</span>
                <b aria-hidden="true">↗</b>
              </span>
            </a>
            <div className="folio-project-bottom">
              <div>
                <h3>
                  {novelist.name}
                  <span className="folio-project-dot">.</span>
                </h3>
                <p>长篇写作智能体 / JavaScript</p>
              </div>
              <SpecimenTrigger repo={novelist} className="folio-round-link">
                <span className="sr-only">查看 {novelist.name} 详情</span>
                <span aria-hidden="true">↗</span>
              </SpecimenTrigger>
            </div>
          </article>
        )}
      </div>
      <Link href="/projects/" className="folio-all-work">
        <span>全部项目</span>
        <span>
          THE FULL COLLECTION <b aria-hidden="true">↗</b>
        </span>
      </Link>
    </section>
  );
}
