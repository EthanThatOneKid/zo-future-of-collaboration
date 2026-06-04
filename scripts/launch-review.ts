/**
 * Start review hub (5300) + one zopack serve per pack (5301+).
 * Usage: bun scripts/launch-review.ts
 */
import { spawn } from "child_process";
import { readdirSync, mkdirSync, existsSync, openSync } from "fs";
import { join, resolve } from "path";

const REPO = resolve(import.meta.dir, "..");
const ZOPACK_CLI =
  process.env.ZOPACK_CLI ?? resolve("C:/Users/ethan/Documents/GitHub/zopack-cli/src/index.ts");
const HUB_PORT = Number(process.env.REVIEW_HUB_PORT ?? 5300);
const BASE_PORT = Number(process.env.REVIEW_BASE_PORT ?? 5301);
const LOG_DIR = join(REPO, "examples", ".review-logs");

const packs = readdirSync(join(REPO, "examples"))
  .filter((f) => f.endsWith(".zopack.md"))
  .sort();

if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });

async function portReady(port: number): Promise<boolean> {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(1000) });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

async function waitForPort(port: number, timeoutMs = 30000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await portReady(port)) return true;
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

console.log(`Spawning ${packs.length} zopack serve processes...`);

for (let i = 0; i < packs.length; i++) {
  const file = join(REPO, "examples", packs[i]!);
  const port = BASE_PORT + i;
  const log = join(LOG_DIR, `${packs[i]!.replace(".zopack.md", "")}-${port}.log`);
  const logFd = openSync(log, "w");
  const child = spawn(
    process.execPath,
    [ZOPACK_CLI, "serve", "--file", file, "--port", String(port)],
    { cwd: REPO, stdio: ["ignore", logFd, logFd], windowsHide: true, detached: true },
  );
  child.unref();
}

console.log("Waiting for servers to listen...");
let ready = 0;
for (let i = 0; i < packs.length; i++) {
  const port = BASE_PORT + i;
  const ok = await waitForPort(port, 45000);
  const status = ok ? "ok" : "FAILED";
  if (ok) ready++;
  console.log(`  :${port} ${packs[i]} — ${status}`);
}

console.log(`\n${ready}/${packs.length} demos ready.`);
console.log(`Review hub: http://localhost:${HUB_PORT}/review-index.html`);
console.log(`Example: http://localhost:${BASE_PORT + 1}/ (ct-145-raycasting is port ${BASE_PORT + 1})`);
console.log(`Logs: examples/.review-logs/\n`);

Bun.serve({
  port: HUB_PORT,
  fetch(req) {
    const path = new URL(req.url).pathname;
    if (path === "/" || path === "/review-index.html") {
      return new Response(Bun.file(join(REPO, "examples", "review-index.html")));
    }
    return new Response("Not found", { status: 404 });
  },
});
