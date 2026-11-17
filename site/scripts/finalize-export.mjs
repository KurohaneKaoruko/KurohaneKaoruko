import { copyFile, mkdir, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Next 16.3 emits nested segment paths on Windows, while its static router
 * requests dot-separated filenames. Add the expected aliases without changing
 * the generated payloads or the installed framework. Linux output needs none.
 */
export async function normalizeSegments(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "_next") continue;
    const source = path.join(directory, entry.name);
    if (entry.name.startsWith("__next.")) {
      const visit = async (folder, parts) => {
        for (const child of await readdir(folder, { withFileTypes: true })) {
          const childPath = path.join(folder, child.name);
          if (child.isDirectory())
            await visit(childPath, [...parts, child.name]);
          else if (child.isFile() && child.name.endsWith(".txt")) {
            const target = path.join(
              directory,
              [...parts, child.name].join("."),
            );
            const bytes = await readFile(childPath);
            try {
              const existing = await readFile(target);
              if (!existing.equals(bytes))
                throw new Error(`Conflicting segment alias: ${target}`);
            } catch (error) {
              if (error.code !== "ENOENT") throw error;
              await copyFile(childPath, target);
              count++;
            }
          }
        }
      };
      await visit(source, [entry.name]);
    } else count += await normalizeSegments(source);
  }
  return count;
}

async function finalize() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const count = await normalizeSegments(path.join(root, "out"));
  const notices = path.join(root, "out", "licenses", "fonts");
  await mkdir(notices, { recursive: true });
  for (const name of [
    "SPACE-GROTESK-OFL.txt",
    "IBM-PLEX-OFL.txt",
    "NOTO-SANS-SC-OFL.txt",
  ]) {
    await copyFile(
      path.join(root, "app", "fonts", name),
      path.join(notices, name),
    );
  }
  console.log(
    `Static export: ${count} segment aliases added; font licenses included.`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await finalize();
}
