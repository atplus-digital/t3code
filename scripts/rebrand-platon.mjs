#!/usr/bin/env node
/**
 * Fork rebrand: user-facing "Platon Code" / "Platon Connect" → "Platon Code" / "Platon Connect".
 * Leaves package scopes (@t3tools), env vars (T3CODE_*), paths (.t3), and CLI binary names (t3) alone.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  ".t3",
  "dist",
  "dist-electron",
  "coverage",
  ".repos",
  "generated",
]);

const SKIP_FILE_GLOBS = [
  /tweets\.ts$/,
  /pnpm-lock\.yaml$/,
  /\.png$/,
  /\.ico$/,
  /\.webp$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.gif$/,
  /\.wasm$/,
  /\.mp4$/,
  /\.lock$/,
];

const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".html",
  ".css",
  ".svg",
  ".toml",
  ".yml",
  ".yaml",
  ".txt",
  ".rhai",
]);

const replacements = [
  // Longer phrases first
  ["Platon Code Mobile", "Platon Code Mobile"],
  ["Platon Code Desktop", "Platon Code Desktop"],
  ["Platon Code Web", "Platon Code Web"],
  ["Platon Code (Nightly)", "Platon Code (Nightly)"],
  ["Platon Code (Alpha)", "Platon Code (Alpha)"],
  ["Platon Code (Dev)", "Platon Code (Dev)"],
  ["Platon Code (Latest)", "Platon Code (Latest)"],
  ["Platon Connect", "Platon Connect"],
  ["Platon Code", "Platon Code"],
];

function shouldSkipFile(filePath) {
  const rel = path.relative(root, filePath).replaceAll("\\", "/");
  if (rel.startsWith("assets/platon/")) return false; // allow readme later
  for (const re of SKIP_FILE_GLOBS) {
    if (re.test(rel)) return true;
  }
  const ext = path.extname(filePath).toLowerCase();
  if (!TEXT_EXT.has(ext) && !filePath.endsWith("Dockerfile")) return true;
  return false;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".env.example") {
      if (entry.name === ".github") {
        // allow
      } else if (SKIP_DIR_NAMES.has(entry.name) || entry.name === ".git") {
        continue;
      }
    }
    if (SKIP_DIR_NAMES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (!shouldSkipFile(full)) out.push(full);
  }
  return out;
}

let changed = 0;
const files = walk(root);
for (const file of files) {
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (!text.includes("Platon Code") && !text.includes("Platon Connect")) continue;
  let next = text;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  if (next !== text) {
    fs.writeFileSync(file, next);
    changed += 1;
    console.log("updated", path.relative(root, file));
  }
}
console.log(`done: ${changed} files`);
