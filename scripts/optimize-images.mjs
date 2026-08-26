/**
 * Regenerates web-sized WebP versions of the photographic assets.
 *
 *   node scripts/optimize-images.mjs
 *
 * Originals stay untouched in public/assets; output lands in
 * public/assets/optimized and is what the site actually references.
 * Re-run after adding a new project cover.
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE_DIR = path.join("public", "assets");
const OUT_DIR = path.join(SOURCE_DIR, "optimized");

/** Widest CSS size each image is displayed at, doubled for retina. */
const TARGETS = [
  { file: "IMG-20240410-WA0023_Nero AI_Face_x2.jpeg", width: 960, quality: 78 },
  { file: "multi_agent_bg_1775804293319.png", width: 1200, quality: 72 },
  { file: "live_agent_bg_1775804274771.png", width: 1200, quality: 72 },
  { file: "corrective_rag_bg_1775804209725.png", width: 1200, quality: 72 },
  { file: "chess_agent_bg_1775804192303.png", width: 900, quality: 72 },
  { file: "yt_summarizer_bg_1775804307459.png", width: 900, quality: 72 },
  { file: "dl_mini_bg_1775804229050.png", width: 900, quality: 72 },
  { file: "powerBI.png", width: 900, quality: 74 },
  { file: "download.jpg", width: 900, quality: 78 },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

await mkdir(OUT_DIR, { recursive: true });

const existing = new Set(await readdir(SOURCE_DIR));
let before = 0;
let after = 0;

for (const target of TARGETS) {
  if (!existing.has(target.file)) {
    console.warn(`  skip     ${target.file} (not found)`);
    continue;
  }

  const input = path.join(SOURCE_DIR, target.file);
  const name = `${path.parse(target.file).name.replace(/[^a-zA-Z0-9-_]+/g, "-")}.webp`;
  const output = path.join(OUT_DIR, name);

  await sharp(input)
    .resize({ width: target.width, withoutEnlargement: true })
    .webp({ quality: target.quality, effort: 6 })
    .toFile(output);

  const inSize = (await stat(input)).size;
  const outSize = (await stat(output)).size;
  before += inSize;
  after += outSize;

  const saved = (100 * (1 - outSize / inSize)).toFixed(0);
  console.log(`  ${kb(inSize).padStart(8)} → ${kb(outSize).padStart(8)}  (-${saved}%)  ${name}`);
}

console.log(`\n  Total ${kb(before)} → ${kb(after)}  (-${(100 * (1 - after / before)).toFixed(0)}%)`);
