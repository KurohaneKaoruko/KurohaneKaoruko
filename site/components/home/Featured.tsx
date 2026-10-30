"use client";

import { useRepos } from "@/components/ReposProvider";
import { SpecimenTrigger } from "@/components/collection/SpecimenTrigger";
import { Tilt } from "@/components/fx/Tilt";
import { SchematicPlate } from "@/components/ui/SchematicPlate";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { familyOf } from "@/lib/data";
import { pickFeatured } from "@/lib/repos";

/**
 * 精选项目。
 *
 * 取星标最高的三个，不是按某个固定名单挑的 —— 排序即理由。
 * 三个项目一左一右铺开：文字在一边，系统图在另一边。这一节决定整站的
 * 尺度感，所以标题、留白和分隔线都按技术手册的排法来。
 */
export function Featured() {
  const { repos } = useRepos();
  const featured = pickFeatured(repos, 3);
  if (featured.length === 0) return null;

  return (
    <section className="section" id="selected">
      <div className="shell">
        <Reveal>
          <SectionHead
            index="01"
            en="Selected works"
            cn="精选项目"
            note={`★ RANKED · TOP ${String(featured.length).padStart(2, "0")}`}
          />
        </Reveal>

        <div className="mt-12 space-y-16 lg:space-y-24">
          {featured.map((repo, index) => {
            const family = familyOf(repo.family);
            const flip = index % 2 === 1;
            return (
              <Reveal key={repo.name} delay={50}>
                <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
                  <div
                    className={
                      "lg:col-span-6 " +
                      (flip ? "lg:order-2 lg:col-start-7" : "lg:order-1 lg:col-start-1")
                    }
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="num text-[10px] text-signal">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
                      <span className="label-sm">{family.code}</span>
                      <span className="label-sm">★ {repo.stars}</span>
                    </div>

                    <h3 className="display mt-4 text-[clamp(2rem,4.2vw,3.3rem)] uppercase text-fg">
                      <span className="decode" data-text={repo.name}>
                        {repo.name}
                      </span>
                    </h3>
                    <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint">
                      {repo.taxon}
                    </p>

                    <p className="mt-5 max-w-[46ch] text-[14px] leading-[1.9] text-fg-2">
                      {repo.desc}
                    </p>

                    <dl className="mt-7 grid max-w-[420px] grid-cols-3 border-y border-line py-3">
                      {[
                        ["STACK", repo.lang || "—"],
                        ["STARS", repo.stars > 0 ? "★ " + repo.stars : "—"],
                        ["UPDATED", repo.pushedAt ? repo.pushedAt.slice(0, 7).replace("-", ".") : "—"],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="label-sm">{k}</dt>
                          <dd className="mt-1 font-mono text-[11px] text-fg">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <a className="btn btn-ghost" href={repo.url} target="_blank" rel="noreferrer">
                        GitHub
                        <span className="btn-arrow" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                      <SpecimenTrigger
                        repo={repo}
                        plateNo={String(index + 1).padStart(2, "0")}
                        className="link font-mono text-[10px] uppercase tracking-[0.18em] text-fg-2 hover:text-fg"
                      >
                        DETAILS ↗
                      </SpecimenTrigger>
                    </div>
                  </div>

                  <div
                    className={
                      "lg:col-span-5 " + (flip ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-8")
                    }
                  >
                    <Tilt max={4} className="featured-plate">
                      <SchematicPlate
                        repo={repo}
                        plateNo={String(index + 1).padStart(2, "0")}
                        size="lg"
                      />
                    </Tilt>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
