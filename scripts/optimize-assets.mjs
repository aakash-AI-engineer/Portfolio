import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(projectRoot, "assets", "images", "engineering-platform.jpg");
const outputDirectory = path.join(projectRoot, "public", "assets", "images");

await mkdir(outputDirectory, { recursive: true });
await sharp(source)
  .resize({ width: 1400, withoutEnlargement: true })
  .webp({ quality: 78, effort: 5 })
  .toFile(path.join(outputDirectory, "engineering-platform.webp"));
