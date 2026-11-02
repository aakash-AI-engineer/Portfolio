import { copyFile, mkdir, readFile, rm } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputDirectory = resolve(projectRoot, "dist");
const assetsDirectory = resolve(projectRoot, "assets");

if (relative(projectRoot, outputDirectory).startsWith(`..${sep}`)) {
  throw new Error("Build output must stay inside the project directory.");
}

const html = await readFile(resolve(projectRoot, "index.html"), "utf8");
const referencedAssets = new Set(
  [...html.matchAll(/assets\/[A-Za-z0-9._/-]+/g)].map(([asset]) => asset),
);

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await copyFile(
  resolve(projectRoot, "index.html"),
  resolve(outputDirectory, "index.html"),
);
await copyFile(
  resolve(projectRoot, "public", "_redirects"),
  resolve(outputDirectory, "_redirects"),
);

for (const asset of referencedAssets) {
  const source = resolve(projectRoot, asset);
  const destination = resolve(outputDirectory, asset);
  const relativeAsset = relative(assetsDirectory, source);

  if (relativeAsset.startsWith(`..${sep}`)) {
    throw new Error(`Referenced asset is outside assets/: ${asset}`);
  }

  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}

console.log(`Built static portfolio with ${referencedAssets.size} assets in dist/.`);
