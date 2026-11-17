import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { normalizeSegments } from "./finalize-export.mjs";

test("Windows segment directories get the URL filename and retain the payload", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-export-"));
  try {
    const folder = path.join(root, "projects", "__next.projects");
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, "__PAGE__.txt"), "0:project-payload\n");
    await writeFile(path.join(root, "index.html"), "homepage");
    assert.equal(await normalizeSegments(root), 1);
    assert.equal(
      await readFile(
        path.join(root, "projects", "__next.projects.__PAGE__.txt"),
        "utf8",
      ),
      "0:project-payload\n",
    );
    assert.equal(
      await readFile(path.join(root, "index.html"), "utf8"),
      "homepage",
    );
    assert.equal(await normalizeSegments(root), 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("a different existing payload is never overwritten", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-export-"));
  try {
    const folder = path.join(root, "__next.projects");
    await mkdir(folder);
    await writeFile(path.join(folder, "__PAGE__.txt"), "new payload");
    await writeFile(
      path.join(root, "__next.projects.__PAGE__.txt"),
      "existing payload",
    );
    await assert.rejects(normalizeSegments(root), /Conflicting segment alias/);
    assert.equal(
      await readFile(path.join(root, "__next.projects.__PAGE__.txt"), "utf8"),
      "existing payload",
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
