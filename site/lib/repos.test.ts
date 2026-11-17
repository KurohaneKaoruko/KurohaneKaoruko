import assert from "node:assert/strict";
import test from "node:test";
import { accessionOf, curatedProject, projects } from "@/lib/data";
import {
  findRepo,
  mergeRepos,
  SNAPSHOT,
  type ApiRepo,
  type Repo,
} from "@/lib/repos";

const renamedRepos: ApiRepo[] = [
  {
    id: 1153495189,
    name: "Iris-Creation",
    description: "Novel writing workspace",
    language: "TypeScript",
    stargazers_count: 9,
    html_url: "https://github.com/KurohaneKaoruko/Iris-Creation",
    homepage: null,
    topics: ["novel"],
    fork: false,
    pushed_at: "2026-11-17T00:00:00Z",
  },
  {
    id: 1402094804,
    name: "Myosotis",
    description: "Multi-platform companion",
    language: "TypeScript",
    stargazers_count: 4,
    html_url: "https://github.com/KurohaneKaoruko/Myosotis",
    homepage: null,
    topics: ["chat"],
    fork: false,
    pushed_at: "2026-11-17T00:00:00Z",
  },
  {
    id: 1333278181,
    name: "DSH-Creator",
    description: "Novel-writing agent",
    language: "JavaScript",
    stargazers_count: 13,
    html_url: "https://github.com/KurohaneKaoruko/DSH-Creator",
    homepage: null,
    topics: ["agent"],
    fork: false,
    pushed_at: "2026-11-17T00:00:00Z",
  },
];

test("renamed repositories replace their snapshots by immutable GitHub ID", () => {
  const staleSnapshot: Repo[] = SNAPSHOT.map((repo) => ({ ...repo }));
  for (const repo of staleSnapshot) {
    if (repo.repoId === 1153495189) repo.name = "Iris-I.C.E.";
    if (repo.repoId === 1402094804) repo.name = "Myosotis-Chat";
    if (repo.repoId === 1333278181) repo.name = "DSH-Novelist";
  }
  staleSnapshot.push({
    ...staleSnapshot.find((repo) => repo.repoId === 1153495189)!,
    name: "Duplicate-Iris-Cache-Entry",
    url: "https://github.com/KurohaneKaoruko/Duplicate-Iris-Cache-Entry",
  });

  const merged = mergeRepos(staleSnapshot, renamedRepos);

  for (const [id, name] of [
    [1153495189, "Iris-Creation"],
    [1402094804, "Myosotis"],
    [1333278181, "DSH-Creator"],
  ] as const) {
    const matches = merged.filter((repo) => repo.repoId === id);
    assert.equal(matches.length, 1, `${name} should appear once`);
    assert.equal(matches[0].name, name);
    assert.equal(matches[0].url, `https://github.com/KurohaneKaoruko/${name}`);
    assert.ok(
      matches[0].family !== "incertae",
      `${name} keeps its curated family`,
    );
    assert.equal(findRepo(merged, name)?.repoId, id);
  }

  assert.equal(findRepo(merged, "Iris-I.C.E.")?.name, "Iris-Creation");
  assert.equal(findRepo(merged, "Myosotis-Chat")?.name, "Myosotis");
  assert.equal(findRepo(merged, "DSH-Novelist")?.name, "DSH-Creator");
  assert.equal(
    merged.some((repo) =>
      ["Iris-I.C.E.", "Myosotis-Chat", "DSH-Novelist"].includes(repo.name),
    ),
    false,
  );
});

test("a transferred organization repo is added from the cached/curated identity", () => {
  const exmachina = projects.find((repo) => repo.repoId === 1368484171);
  assert.ok(exmachina);

  const merged = mergeRepos(SNAPSHOT, [
    {
      id: exmachina.repoId,
      name: "ExMachina",
      description: "Collective intelligence",
      language: "Rust",
      stargazers_count: 5,
      html_url: "https://github.com/ExMachina-Project/ExMachina",
      homepage: null,
      topics: ["agents"],
      fork: false,
      pushed_at: "2026-11-17T00:00:00Z",
    },
  ]);

  assert.equal(
    merged.filter((repo) => repo.repoId === exmachina.repoId).length,
    1,
  );
  assert.equal(findRepo(merged, "ExMachina")?.family, "principium");
});

test("old curated aliases resolve to current names and accession numbers", () => {
  for (const [oldName, currentName, id] of [
    ["Iris-I.C.E.", "Iris-Creation", 1153495189],
    ["Myosotis-Chat", "Myosotis", 1402094804],
    ["DSH-Novelist", "DSH-Creator", 1333278181],
  ] as const) {
    assert.equal(curatedProject(oldName)?.name, currentName);
    assert.equal(
      accessionOf(oldName),
      accessionOf({ name: currentName, repoId: id }),
    );
  }
});

test("future names and owner transfers preserve metadata, selection and accession", () => {
  const renamed = {
    ...renamedRepos[0],
    name: "Iris-Next",
    html_url: "https://github.com/Writing-Tools/Iris-Next",
  };
  const merged = mergeRepos(SNAPSHOT, [renamed]);
  const current = findRepo(merged, "Iris-Creation");
  assert.ok(current);
  assert.equal(current.name, "Iris-Next");
  assert.equal(current.url, renamed.html_url);
  assert.equal(current.desc, curatedProject("Iris-Creation")?.desc);
  assert.equal(current.family, "principium");
  assert.equal(accessionOf(current), accessionOf("Iris-I.C.E."));
  assert.equal(findRepo(merged, SNAPSHOT[0]), current);
  assert.equal(merged.filter((repo) => repo.repoId === renamed.id).length, 1);
});

test("a new repo reusing an old name does not inherit the previous project's identity", () => {
  const reused = { ...renamedRepos[0], id: 999999, name: "Iris-I.C.E." };
  const merged = mergeRepos(SNAPSHOT, [reused, renamedRepos[0]]);
  const iris = findRepo(merged, "Iris-I.C.E.");
  assert.equal(iris?.repoId, renamedRepos[0].id);
  assert.equal(iris?.name, "Iris-Creation");
  assert.equal(
    merged.find((repo) => repo.repoId === reused.id)?.family,
    "incertae",
  );
});
