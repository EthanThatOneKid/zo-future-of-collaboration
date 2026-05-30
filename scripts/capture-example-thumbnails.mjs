#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);

const defaults = {
  routeBase: "http://localhost:3099/examples",
  publicBase: "https://etok.zo.space/examples",
  chromePath: process.env.CHROME_PATH || "/root/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome",
  examplesDir: join(repoRoot, "examples"),
  outDir: join(repoRoot, "examples", "thumbnails"),
  rawDir: join(repoRoot, ".cache", "screenshots"),
  width: 640,
  height: 400,
  waitMs: 1800,
  viewportWidth: 1200,
  viewportHeight: 800,
  quality: 82,
  commandTimeoutMs: 20000,
  limit: Number.POSITIVE_INFINITY,
  filter: "",
  skipExisting: false,
  bail: false,
};

function usage() {
  console.log(`Usage: node scripts/capture-example-thumbnails.mjs [options]

Captures Zo Space example routes and writes WebP thumbnails plus a manifest.

Options:
  --route-base <url>       Base URL for capture. Default: ${defaults.routeBase}
  --public-base <url>      Public URL base written to manifest. Default: ${defaults.publicBase}
  --chrome-path <path>     Chrome binary for native screenshot fallback.
  --out-dir <path>         WebP output directory. Default: examples/thumbnails
  --raw-dir <path>         Raw PNG screenshot directory. Default: .cache/screenshots
  --width <px>             Thumbnail width. Default: ${defaults.width}
  --height <px>            Thumbnail height. Default: ${defaults.height}
  --wait-ms <ms>           Delay after page open before screenshot. Default: ${defaults.waitMs}
  --viewport <w>x<h>       Browser viewport. Default: ${defaults.viewportWidth}x${defaults.viewportHeight}
  --quality <n>            WebP quality. Default: ${defaults.quality}
  --command-timeout-ms <ms> Per browser/conversion command timeout. Default: ${defaults.commandTimeoutMs}
  --filter <text>          Only capture slugs containing text.
  --limit <n>              Capture at most n routes.
  --skip-existing          Do not recapture thumbnails that already exist.
  --bail                   Stop on first failed route.
  --help                   Show this help.
`);
}

function parseArgs(argv) {
  const opts = { ...defaults };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      i += 1;
      return value;
    };
    if (arg === "--help") {
      usage();
      process.exit(0);
    } else if (arg === "--route-base") opts.routeBase = next().replace(/\/$/, "");
    else if (arg === "--public-base") opts.publicBase = next().replace(/\/$/, "");
    else if (arg === "--chrome-path") opts.chromePath = resolve(next());
    else if (arg === "--out-dir") opts.outDir = resolve(next());
    else if (arg === "--raw-dir") opts.rawDir = resolve(next());
    else if (arg === "--width") opts.width = Number(next());
    else if (arg === "--height") opts.height = Number(next());
    else if (arg === "--wait-ms") opts.waitMs = Number(next());
    else if (arg === "--quality") opts.quality = Number(next());
    else if (arg === "--command-timeout-ms") opts.commandTimeoutMs = Number(next());
    else if (arg === "--filter") opts.filter = next();
    else if (arg === "--limit") opts.limit = Number(next());
    else if (arg === "--viewport") {
      const match = next().match(/^(\d+)x(\d+)$/);
      if (!match) throw new Error("--viewport must look like 1200x800");
      opts.viewportWidth = Number(match[1]);
      opts.viewportHeight = Number(match[2]);
    } else if (arg === "--skip-existing") opts.skipExisting = true;
    else if (arg === "--bail") opts.bail = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  for (const key of ["width", "height", "waitMs", "viewportWidth", "viewportHeight", "quality", "commandTimeoutMs"]) {
    if (!Number.isFinite(opts[key]) || opts[key] <= 0) throw new Error(`${key} must be positive`);
  }
  return opts;
}

function run(cmd, args, options = {}) {
  execFileSync(cmd, args, {
    stdio: options.stdio ?? "pipe",
    cwd: repoRoot,
    timeout: options.timeoutMs ?? defaults.commandTimeoutMs,
    killSignal: "SIGKILL",
  });
}

function extractField(markdown, field) {
  const match = markdown.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim()?.replace(/^"|"$/g, "") ?? "";
}

function discoverExamples(opts) {
  return readdirSync(opts.examplesDir)
    .filter((file) => file.endsWith(".zopack.md"))
    .map((file) => {
      const source = join(opts.examplesDir, file);
      const markdown = readFileSync(source, "utf8");
      const slug = basename(file, ".zopack.md");
      return {
        slug,
        name: extractField(markdown, "name") || slug,
        description: extractField(markdown, "description"),
        sourcePack: relative(repoRoot, source),
      };
    })
    .filter((entry) => !opts.filter || entry.slug.includes(opts.filter))
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .slice(0, opts.limit);
}

function capture(entry, opts, index, total) {
  const pngPath = join(opts.rawDir, `${entry.slug}.png`);
  const webpPath = join(opts.outDir, `${entry.slug}.webp`);
  const routeUrl = `${opts.routeBase}/${entry.slug}`;
  const publicUrl = `${opts.publicBase}/${entry.slug}`;
  const started = Date.now();

  if (opts.skipExisting && existsSync(webpPath)) {
    console.log(`[${index}/${total}] skip ${entry.slug}`);
    return { ...entry, routeUrl: publicUrl, thumbnail: relative(repoRoot, webpPath), status: "skipped" };
  }

  console.log(`[${index}/${total}] capture ${entry.slug}`);
  const session = `zo-foc-thumbs-${process.pid}-${entry.slug}`;
  let agentBrowserCaptured = false;
  try {
    run("agent-browser", ["--session", session, "set", "viewport", String(opts.viewportWidth), String(opts.viewportHeight)], { stdio: "inherit", timeoutMs: opts.commandTimeoutMs });
    run("agent-browser", ["--session", session, "open", routeUrl], { stdio: "inherit", timeoutMs: opts.commandTimeoutMs });
    run("agent-browser", ["--session", session, "wait", String(opts.waitMs)], { stdio: "inherit", timeoutMs: opts.commandTimeoutMs });
    run("agent-browser", ["--session", session, "screenshot", pngPath], { stdio: "inherit", timeoutMs: opts.commandTimeoutMs });
    agentBrowserCaptured = true;
  } catch (error) {
    console.warn(`agent-browser capture failed for ${entry.slug}; trying native Chrome screenshot fallback`);
    if (!existsSync(opts.chromePath)) throw error;
    run(opts.chromePath, [
      "--headless=new",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      `--window-size=${opts.viewportWidth},${opts.viewportHeight}`,
      `--screenshot=${pngPath}`,
      routeUrl,
    ], { timeoutMs: opts.commandTimeoutMs });
  } finally {
    try {
      run("agent-browser", ["--session", session, "close", "--all"], { timeoutMs: 5000 });
    } catch {
      // Best effort: the next capture uses a fresh session.
    }
  }
  run("convert", [
    pngPath,
    "-resize",
    `${opts.width}x${opts.height}^`,
    "-gravity",
    "center",
    "-extent",
    `${opts.width}x${opts.height}`,
    "-quality",
    String(opts.quality),
    webpPath,
  ], { timeoutMs: opts.commandTimeoutMs });

  return {
    ...entry,
    routeUrl: publicUrl,
    thumbnail: relative(repoRoot, webpPath),
    status: agentBrowserCaptured ? "captured" : "captured-with-chrome-fallback",
    captureMs: Date.now() - started,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  mkdirSync(opts.outDir, { recursive: true });
  mkdirSync(opts.rawDir, { recursive: true });

  const examples = discoverExamples(opts);
  if (examples.length === 0) throw new Error("No example packs matched.");

  const results = [];
  const failures = [];
  for (let i = 0; i < examples.length; i += 1) {
    const entry = examples[i];
    try {
      results.push(capture(entry, opts, i + 1, examples.length));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ ...entry, status: "failed", error: message });
      console.error(`[${i + 1}/${examples.length}] failed ${entry.slug}: ${message}`);
      if (opts.bail) break;
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    routeBase: opts.publicBase,
    thumbnailSize: { width: opts.width, height: opts.height },
    count: results.length,
    failureCount: failures.length,
    examples: results,
    failures,
  };
  const manifestPath = join(opts.outDir, "manifest.json");
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`manifest: ${relative(repoRoot, manifestPath)}`);
  console.log(`captured: ${results.length}; failed: ${failures.length}`);
  if (failures.length) process.exit(1);
}

main();
