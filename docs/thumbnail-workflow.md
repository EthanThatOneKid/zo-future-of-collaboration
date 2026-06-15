# Example Thumbnail Workflow

Prerendered WebP thumbnails let the Future of Collaboration grid and globe show cheap, static previews instead of mounting live iframe portals for every tile. This document describes how those files are produced, what they contain, and how the app consumes them.

**Script:** `scripts/capture-example-thumbnails.mjs`  
**Outputs:** `examples/thumbnails/*.webp` and `examples/thumbnails/manifest.json`  
**Related:** [example deployment manifest](./example-deployment-manifest.md) · [globe walkthrough](./globe-quad-sphere-walkthrough.md) · [`examples/README.md`](../examples/README.md)

## Why thumbnails exist

Each example Zo space is a full-screen canvas demo. Loading 30 live iframes at once is expensive. The prototype in `future-of-collaboration.zopack.md` uses:

- **Grid idle state** — CSS `background-image` from a WebP per tile
- **Grid hover** — optional live iframe portal (capped at `MAX_MOUNTED_PORTALS`)
- **Globe mode** — Three.js `TextureLoader` on curved quad materials

Thumbnails are static assets checked into `examples/thumbnails/` so they ship with the pack and work offline in local `zopack serve`.

## End-to-end flow

```text
examples/*.zopack.md
        │
        ▼  discover slugs + frontmatter (name, description)
scripts/capture-example-thumbnails.mjs
        │
        ├─► agent-browser (primary) or headless Chrome (fallback)
        │       open <route-base>/<slug>
        │       wait for canvas hydration
        │       screenshot → .cache/screenshots/<slug>.png
        │
        ├─► ImageMagick convert
        │       center-crop resize → examples/thumbnails/<slug>.webp
        │
        └─► write examples/thumbnails/manifest.json
                │
                ▼
future-of-collaboration.zopack.md
        thumbnailFor(slug) → /examples/thumbnails/<slug>.webp
```

The runtime **does not read `manifest.json` today**. It resolves thumbnails by slug convention only. The manifest is the batch-capture audit trail and a future hook for dynamic grids.

## Prerequisites

| Requirement | Used for | Notes |
|-------------|----------|-------|
| **Node.js** | Run the capture script | No npm install step; plain ESM script. |
| **`agent-browser` on `PATH`** | Primary screenshot capture | Opens route, sets viewport, waits, saves PNG. |
| **ImageMagick `convert` on `PATH`** | PNG → WebP | Center-crop resize and quality encoding. On Windows, install [ImageMagick](https://imagemagick.org/) and ensure `convert` is available (or aliased via `magick`). |
| **Reachable example routes** | Pages to screenshot | See [Route sources](#route-sources) below. |
| **Headless Chrome** (optional) | Fallback if `agent-browser` fails | Set `CHROME_PATH` or pass `--chrome-path`. Default in the script is a Linux Playwright Chromium path. |

`.cache/screenshots/` is gitignored. Only the WebP files and `manifest.json` are meant to be committed.

## Route sources

The script opens `{routeBase}/{slug}` for every `examples/*.zopack.md` file (slug = filename without `.zopack.md`).

### Recommended: capture from production

No local Zo server required. Example routes must already be deployed (see [example-deployment-manifest.md](./example-deployment-manifest.md)):

```bash
node scripts/capture-example-thumbnails.mjs \
  --route-base https://etok.zo.space/examples \
  --public-base https://etok.zo.space/examples
```

`--route-base` is where screenshots are taken. `--public-base` is what gets written into `manifest.json` as `routeBase` and per-entry `routeUrl`.

### Local capture (advanced)

The script default is `http://localhost:3099/examples`. That only works if you have a local Zo space serving the same `/examples/<slug>` route tree on that host and port. There is no repo script that starts that server; align your local port with `--route-base` when you run capture.

To preview thumbnails after generation, serve the main pack (thumbnails are static assets beside the examples):

```powershell
zopack serve --file future-of-collaboration.zopack.md --port 3000
```

Open `http://localhost:3000/future-of-collaboration?view=globe`.

## Capture pipeline (step by step)

1. **Discover** — List `examples/*.zopack.md`, sorted by slug. Extract `name:` and `description:` from each file's frontmatter (falls back to slug if `name` is missing).
2. **Open route** — `agent-browser --session <id> open <routeBase>/<slug>`.
3. **Set viewport** — Default `1200×800` (`--viewport`).
4. **Wait** — Default `1800ms` (`--wait-ms`) so canvas animations can render a representative frame.
5. **Screenshot** — PNG to `.cache/screenshots/<slug>.png`.
6. **Convert** — ImageMagick:

   ```text
   convert <slug>.png \
     -resize 640x400^ \
     -gravity center \
     -extent 640x400 \
     -quality 82 \
     examples/thumbnails/<slug>.webp
   ```

   `-resize WxH^` scales so the image **covers** the target box; `-extent` center-crops to exact dimensions. Wider viewports crop left/right; taller ones crop top/bottom.

7. **Manifest** — Write `manifest.json` with capture metadata, successes, and failures.

### Fallback capture path

If `agent-browser` throws, the script logs a warning and retries with headless Chrome:

```text
chrome --headless=new --screenshot=<png> <routeUrl>
```

Same viewport size flags. Conversion still uses ImageMagick. Entry `status` becomes `captured-with-chrome-fallback`.

## Default parameters

| Flag | Default | Purpose |
|------|---------|---------|
| `--route-base` | `http://localhost:3099/examples` | Base URL for screenshots |
| `--public-base` | `https://etok.zo.space/examples` | Public URLs written to manifest |
| `--width` / `--height` | `640` / `400` | Output WebP dimensions |
| `--viewport` | `1200x800` | Browser window before crop |
| `--wait-ms` | `1800` | Delay after navigation before screenshot |
| `--quality` | `82` | WebP quality (ImageMagick) |
| `--command-timeout-ms` | `20000` | Per subprocess timeout |
| `--chrome-path` | `$CHROME_PATH` or Linux Playwright Chromium | Fallback browser binary |

Run `node scripts/capture-example-thumbnails.mjs --help` for the full option list.

## Commands

Full batch (production):

```bash
node scripts/capture-example-thumbnails.mjs \
  --route-base https://etok.zo.space/examples \
  --public-base https://etok.zo.space/examples
```

Useful variants:

```bash
# Smoke test — first three slugs
node scripts/capture-example-thumbnails.mjs --limit 3 \
  --route-base https://etok.zo.space/examples

# Single family of packs
node scripts/capture-example-thumbnails.mjs --filter ct-18 \
  --route-base https://etok.zo.space/examples

# Skip packs that already have a .webp on disk
node scripts/capture-example-thumbnails.mjs --skip-existing \
  --route-base https://etok.zo.space/examples

# Stop on first failure
node scripts/capture-example-thumbnails.mjs --bail \
  --route-base https://etok.zo.space/examples

# Different output size / quality
node scripts/capture-example-thumbnails.mjs \
  --route-base https://etok.zo.space/examples \
  --width 960 --height 600 --quality 88

# Windows Chrome fallback
node scripts/capture-example-thumbnails.mjs \
  --route-base https://etok.zo.space/examples \
  --chrome-path "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

Exit code `1` if any route failed (`failureCount > 0`).

## Output contract

### Files on disk

| Path | Committed? | Description |
|------|------------|-------------|
| `examples/thumbnails/<slug>.webp` | Yes | One WebP per example pack |
| `examples/thumbnails/manifest.json` | Yes | Batch metadata |
| `.cache/screenshots/<slug>.png` | No (gitignored) | Intermediate full-viewport PNG |

### `manifest.json` schema

| Field | Type | Meaning |
|-------|------|---------|
| `generatedAt` | ISO timestamp | When the batch finished |
| `routeBase` | string | Public example base URL (`--public-base`) |
| `thumbnailSize` | `{ width, height }` | Output dimensions |
| `count` | number | Successful captures (including skipped) |
| `failureCount` | number | Failed routes |
| `examples[]` | array | Per-slug results |
| `failures[]` | array | Failed slugs with `error` message |

Each `examples[]` entry includes:

| Field | Meaning |
|-------|---------|
| `slug` | Pack id (matches filename) |
| `name` | From pack frontmatter |
| `description` | From pack frontmatter |
| `sourcePack` | Repo-relative path to `.zopack.md` |
| `routeUrl` | Public live URL |
| `thumbnail` | Repo-relative path to `.webp` |
| `status` | `captured`, `captured-with-chrome-fallback`, or `skipped` |
| `captureMs` | Wall time for that slug (when captured) |

## How the app consumes thumbnails

In `future-of-collaboration.zopack.md`:

```ts
function thumbnailFor(slug: string): string {
  return `/examples/thumbnails/${slug}.webp`;
}
```

`exampleProjects` lists 30 `[slug, title]` pairs. Tile index `i` uses `exampleProjects[i]` when present; indices beyond 30 have `thumbnailUrl: null`.

**Implication:** every slug in `exampleProjects` needs a matching `<slug>.webp` in `examples/thumbnails/`. Adding a pack requires:

1. Add `examples/<slug>.zopack.md`
2. Deploy the route (see deployment manifest)
3. Regenerate the thumbnail
4. Add the slug to `exampleProjects` in `future-of-collaboration.zopack.md`

See [globe-quad-sphere-walkthrough.md](./globe-quad-sphere-walkthrough.md) for how globe mode textures those URLs on curved quads.

## When to regenerate

Regenerate thumbnails when:

- A new `examples/*.zopack.md` pack is added
- Canvas visuals change materially (layout, colors, default animation state)
- Capture parameters change (`--width`, `--height`, `--viewport`, `--wait-ms`, `--quality`)
- `exampleProjects` gains a slug that has no `.webp` yet
- Production routes moved to a new base URL (update `--public-base` and redeploy assets)

Use `--skip-existing` for incremental updates; omit it for a full refresh.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `agent-browser` not found | CLI not installed or not on `PATH` | Install/configure `agent-browser`, or rely on `--chrome-path` fallback |
| `convert` not found | ImageMagick missing | Install ImageMagick; verify `convert -version` |
| Blank or white thumbnails | `--wait-ms` too short for slow canvas init | Increase `--wait-ms` (e.g. `3000`) |
| Cropped wrong region | Viewport aspect vs thumbnail aspect | Adjust `--viewport` or accept center-crop behavior |
| Connection refused on localhost | Nothing serving `--route-base` | Use production `--route-base` or start local routes on matching port |
| Chrome fallback fails on Windows | Default path is Linux-only | Pass `--chrome-path` to your Chrome binary |
| `failureCount > 0` in manifest | One or more routes unreachable or timed out | Check `failures[]` in manifest; retry with `--filter <slug>` |
| Globe shows gradient tiles | Missing `.webp` for that slug | Regenerate; confirm file exists and slug matches `exampleProjects` |

## Design note

Thumbnails are a **performance and UX optimization**, not the source of truth for example content. Live iframe portals and direct links to `/examples/<slug>` remain the authoritative interactive surface. The manifest is optional for the current prototype but documents batch provenance for future dynamic galleries.
