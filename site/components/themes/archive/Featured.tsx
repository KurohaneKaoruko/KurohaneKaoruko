"use client";

import { useRepos } from "@/components/ReposProvider";
import { SpecimenTrigger } from "@/components/collection/SpecimenTrigger";
import { Tilt } from "@/components/fx/Tilt";
import { SchematicPlate } from "@/components/ui/SchematicPlate";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { familyOf } from "@/lib/data";
import { pickFeatured } from "@/lib/repos";

export function Featured() {
  const { repos } = useRepos();
  const featured = pickFeatured(repos, 3);
  if (!featured.length) return null;

  return (
    <section className="section" id="selected">
      <div className="shell">
        <Reveal>
          <SectionHead
            index="01"
            en="Selected works"
            cn="精选项目"
            action={
              <span className="label">
                {String(featured.length).padStart(2, "0")} /{" "}
                {String(repos.length).padStart(2, "0")}
              </span>
            }
          />
        </Reveal>
        <div>
          {featured.map((repo, index) => {
            const family = familyOf(repo.family);
            const flip = index % 2 === 1;
            return (
              <Reveal key={repo.name} delay={40}>
                <article className="featured-item grid gap-8 border-b border-line py-10 lg:grid-cols-12 lg:gap-10 lg:py-16">
                  <div
                    className={`lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : "lg:order-1 lg:col-start-1"}`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="featured-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="label text-fg">{family.code}</span>
                      <span className="label ml-auto">★ {repo.stars}</span>
                    </div>
                    <h3 className="featured-title">
                      <span className="decode" data-text={repo.name}>
                        {repo.name}
                      </span>
                    </h3>
                    <p className="featured-taxon">{repo.taxon}</p>
                    <p className="featured-desc">{repo.desc}</p>
                    <div className="featured-bottom">
                      <dl className="featured-meta">
                        {[
                          ["Stack", repo.lang || "—"],
                          [
                            "Updated",
                            repo.pushedAt
                              ? repo.pushedAt.slice(0, 7).replace("-", ".")
                              : "—",
                          ],
                        ].map(([key, value]) => (
                          <div key={key}>
                            <dt className="label">{key}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="featured-links">
                        <SpecimenTrigger
                          repo={repo}
                          plateNo={String(index + 1).padStart(2, "0")}
                          className="featured-link"
                        >
                          Details ↗
                        </SpecimenTrigger>
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="featured-link"
                        >
                          GitHub ↗
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`lg:col-span-4 ${flip ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-9"}`}
                  >
                    <Tilt max={3}>
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
