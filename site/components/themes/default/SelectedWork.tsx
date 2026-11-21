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
  const iris = findRepo(repos, "Iris-Creation");

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
            <span className="folio-caption">概念演示 / SIGNAL ROUTING</span>
          </div>
          <div className="folio-exhibit folio-exhibit-exm">
            <ExMachinaArtwork name={exm.name} href={exm.url} />
          </div>
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
        {iris && (
          <article className="folio-project folio-project-iris" id="project-iris">
            <div className="folio-exhibit-head">
              <span className="folio-caption">03 / WRITING</span>
              <span className="folio-caption">TAURI / REACT</span>
            </div>
            <a
              className="folio-exhibit folio-exhibit-iris"
              href={iris.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`查看 ${iris.name} GitHub 仓库`}
              aria-describedby="iris-exhibit-metrics"
            >
              <span className="iris-art-title" lang="en">
                A WORKSPACE FOR
                <br />
                STORIES.
              </span>
              <span
                className="iris-art-metrics"
                id="iris-exhibit-metrics"
                lang="en"
              >
                <span>
                  <b>12</b>
                  <small>METHODOLOGY</small>
                </span>
                <span>
                  <b>06</b>
                  <small>WRITING STYLES</small>
                </span>
              </span>
              <span className="iris-art-bottom">
                <span lang="en">LOCAL MARKDOWN</span>
                <span className="iris-art-link">
                  GitHub <b aria-hidden="true">↗</b>
                </span>
              </span>
            </a>
            <div className="folio-project-bottom">
              <div>
                <h3>
                  {iris.name}
                  <span className="folio-project-dot">.</span>
                </h3>
                <p>小说与剧本创作工作台</p>
              </div>
              <SpecimenTrigger repo={iris} className="folio-round-link">
                <span className="sr-only">查看 {iris.name} 详情</span>
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
