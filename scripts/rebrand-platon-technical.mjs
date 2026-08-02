#!/usr/bin/env node
/**
 * Technical rebrand pass for Platon Code fork.
 *
 * Mapping:
 *   @platon/*           → @platon/*
 *   PLATON_CODE_* / PLATON_CODE    → PLATON_CODE_* / PLATON_CODE
 *   platon-code / platon-code     → platon-code
 *   oxlint-plugin-platon-code → oxlint-plugin-platon-code
 *   package name "t3"    → "platon"
 *   data dir .t3         → .platon
 *   com.platon          → com.platon
 *   schemes platon-code*      → platon-code*
 *
 * Leaves: pure numeric "t3" in unrelated tokens where unsafe; npx package
 * references are updated via explicit phrases.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".platon",
  ".platon",
  "dist",
  "dist-electron",
  "coverage",
  ".repos",
  "target",
]);

const BINARY_EXT = new Set([
  ".png",
  ".ico",
  ".webp",
  ".jpg",
  ".jpeg",
  ".gif",
  ".wasm",
  ".mp4",
  ".lock",
  ".bin",
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".zip",
  ".pdf",
]);

/** Ordered replacements — longer / more specific first. */
const REPLACEMENTS = [
  // Package / plugin names
  ["@platon/", "@platon/"],
  ["@platon", "@platon"],
  ["oxlint-plugin-platon-code", "oxlint-plugin-platon-code"],
  ["platon-code-relay", "platon-code-relay"],

  // Env / config identifiers
  ["PLATON_CODE_", "PLATON_CODE_"],
  ["PLATON_CODE", "PLATON_CODE"],
  ["platon-code-dev", "platon-code-dev"],
  ["platon-code-alpha", "platon-code-alpha"],

  // URL schemes / bundle-ish tokens
  ["platon-code-dev", "platon-code-dev"],
  ["platon-code-nightly", "platon-code-nightly"],
  ["platon-code://", "platon-code://"],
  ["platon-code", "platon-code"],
  ["platon-code", "platon-code"],

  // Java package / android style
  ["com.platon.platon-code", "com.platon.platoncode"],
  ["com.platon", "com.platon"],

  // Data directory (careful patterns)
  ["~/.platon", "~/.platon"],
  ["$HOME/.platon", "$HOME/.platon"],
  ["${HOME}/.platon", "${HOME}/.platon"],
  ["process.env.HOME + '/.platon", "process.env.HOME + '/.platon"],
  ['process.env.HOME + "/.platon', 'process.env.HOME + "/.platon'],
  ["/.platon/", "/.platon/"],
  ['/.t3"', '/.platon"'],
  ["/.platon'", "/.platon'"],
  ["/.platon`", "/.platon`"],
  ["'/.platon'", "'/.platon'"],
  ['"/.platon"', '"/.platon"'],
  ["`.platon`", "`.platon`"],
  ["'.platon'", "'.platon'"],
  ['".platon"', '".platon"'],
  [" .platon/", " .platon/"],
  ["\t.t3/", "\t.platon/"],
  ["(.platon)", "(.platon)"],
  ["`.platon/", "`.platon/"],
  ['join(homeDirectory, ".t3")', 'join(homeDirectory, ".platon")'],
  ["join(homeDirectory, '.platon')", "join(homeDirectory, '.platon')"],
  ['"platon.json"', '"platon.json"'],
  ["'platon.json'", "'platon.json'"],
  ["platon.json", "platon.json"],

  // CLI / product package name (phrase-level)
  ['"name": "platon"', '"name": "platon"'],
  ["'name': 'platon'", "'name': 'platon'"],
  ["npx platon@", "npx platon@"],
  ["npx platon ", "npx platon "],
  ["`npx platon", "`npx platon"],
  ["`platon ", "`platon "],
  ["`platon`", "`platon`"],
  [" platon@", " platon@"],
  ["filter platon ", "filter platon "],
  ['filter "./apps/server"', 'filter "./apps/server"'], // no-op guard
  ["--filter platon ", "--filter platon "],
  ["'t3'", (ctx) => null], // handled specially below
];

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    if (entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip nested node_modules already
      walk(full, out);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (BINARY_EXT.has(ext)) continue;
      if (entry.name === "pnpm-lock.yaml") continue;
      out.push(full);
    }
  }
  return out;
}

function transform(text) {
  let next = text;
  for (const item of REPLACEMENTS) {
    const [from, to] = item;
    if (typeof to === "function") continue;
    if (next.includes(from)) next = next.split(from).join(to);
  }

  // Package filter / workspace name `"t3"` as standalone JSON name already done.
  // CLI help strings:  `platon service` etc after backtick patterns.
  next = next.replace(/\bt3 service\b/g, "platon service");
  next = next.replace(/\bt3 pair\b/g, "platon pair");
  next = next.replace(/\bt3 connect\b/g, "platon connect");
  next = next.replace(/\bt3 start\b/g, "platon start");
  next = next.replace(/\brun `t3\b/g, "run `platon");
  next = next.replace(/\bInstall `t3\b/g, "Install `platon");
  next = next.replace(/\bwith platon@/g, "with platon@");
  next = next.replace(/\bt3@latest\b/g, "platon@latest");
  next = next.replace(/\bvp run --filter t3\b/g, "vp run --filter platon");
  next = next.replace(/\b--filter platon\b/g, "--filter platon");

  // Remaining bare package root name in monorepo package.json was "t3"
  // MCP server name
  next = next.replace(/name:\s*"platon-code"/g, 'name: "platon-code"');
  next = next.replace(/"platon-code"/g, '"platon-code"');
  next = next.replace(/'platon-code'/g, "'platon-code'");

  // Storage keys like platon-code:theme already became platon-code:theme via platon-code replace

  return next;
}

// Rename directories/files that contain old tokens in their path names.
const PATH_RENAMES = [
  ["oxlint-plugin-platon-code", "oxlint-plugin-platon-code"],
  ["apps/mobile/modules/t3-markdown-text", "apps/mobile/modules/platon-markdown-text"],
  ["platon.json", "platon.json"],
];

function renamePaths() {
  for (const [from, to] of PATH_RENAMES) {
    const src = path.join(root, from);
    const dest = path.join(root, to);
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.renameSync(src, dest);
      console.log("renamed path", from, "->", to);
    }
  }
}

renamePaths();

const files = walk(root);
let changed = 0;
for (const file of files) {
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  // Skip files without candidates for speed
  if (
    !text.includes("t3tools") &&
    !text.includes("PLATON_CODE") &&
    !text.includes("platon-code") &&
    !text.includes("platon-code") &&
    !text.includes(".platon") &&
    !text.includes('"t3"') &&
    !text.includes("'t3'") &&
    !text.includes("t3 ") &&
    !text.includes("t3@") &&
    !text.includes("`t3") &&
    !text.includes("com.platon") &&
    !text.includes("platon.json")
  ) {
    continue;
  }
  const next = transform(text);
  if (next !== text) {
    fs.writeFileSync(file, next);
    changed += 1;
    console.log("updated", path.relative(root, file));
  }
}
console.log(`content files updated: ${changed}`);
