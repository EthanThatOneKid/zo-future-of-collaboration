# Zo Future of Collaboration

Planning docs, example packs, and the Zo Space prototype for the Future of Collaboration event: a 100-tile wall where Zo users claim tiles, publish their vision of collaboration, and collectively generate a live gradient artwork.

**Live prototype:** [etok.zo.space/future-of-collaboration](https://etok.zo.space/future-of-collaboration)  
**Example gallery:** [etok.zo.space/examples](https://etok.zo.space/examples) (30 Coding Train–inspired packs)

## Working Documents

| Document | What it covers |
|----------|----------------|
| [`docs/design-doc.md`](docs/design-doc.md) | Product goals, experience narrative, data model, moderation, event ops, milestones, and open decisions. |
| [`docs/example-deployment-manifest.md`](docs/example-deployment-manifest.md) | Record of the batch Zo Space deployment for all 30 example packs under `/examples/*`. |
| [`docs/thumbnail-workflow.md`](docs/thumbnail-workflow.md) | Screenshot-to-WebP pipeline: prerequisites, capture script, manifest schema, app consumption, troubleshooting. |
| [`docs/globe-quad-sphere-walkthrough.md`](docs/globe-quad-sphere-walkthrough.md) | Quad-sphere globe algorithm, rendering stack, tile-count behavior, and verification notes for globe mode. |
| [`examples/README.md`](examples/README.md) | Gallery of 30 attendee starter [zopacks](https://www.zo.computer/skills/zopack), grouped by theme, with `zopack serve` / import instructions. |
| [`examples/thumbnails/`](examples/thumbnails/) | Generated WebP previews and `manifest.json` consumed by the collaboration wall (grid idle + globe textures). |
| [`future-of-collaboration.zopack.md`](future-of-collaboration.zopack.md) | Source pack for the live wall: grid and globe views, thumbnail-backed idle tiles, hover portals, URL-driven tile count and view mode. |
| [`.zo-gh.yml`](.zo-gh.yml) | Repo-local `zo-gh` sync policy (branch, watched pack path, event rules, prior-state key). |

The public `/examples` index route is deployed on Zo Space but is **not** checked in as a separate pack file in this repo. Example routes are defined by the individual packs in [`examples/`](examples/) and listed in the deployment manifest.

## Scripts

| Script | Purpose |
|--------|---------|
| [`scripts/deploy-to-space.ps1`](scripts/deploy-to-space.ps1) | Deploy `future-of-collaboration.zopack.md` to `etok.zo.space` via the Zo API (`ZO_API_KEY`). Supports `-VerifyOnly` to check live bundle markers. |
| [`scripts/sync-space.ps1`](scripts/sync-space.ps1) / [`scripts/sync-space.sh`](scripts/sync-space.sh) | Pull latest `main`, extract the `/future-of-collaboration` route TSX from the pack for manual paste or CLI import. |
| [`scripts/capture-example-thumbnails.mjs`](scripts/capture-example-thumbnails.mjs) | Regenerate `examples/thumbnails/*.webp` and `manifest.json` after visual changes or new packs. See [`docs/thumbnail-workflow.md`](docs/thumbnail-workflow.md). |

## `.zo-gh.yml`

This file tells [`zo-gh`](https://github.com/EthanThatOneKid/zo-gh) how to reconcile GitHub changes into Zo: watched branch (`main`), deployable pack path, which GitHub events trigger sync, and the prior-state key used when checking for drift.

`zo-gh` reads it during webhook handling and scheduled reconciliation so Zo can stay aligned with GitHub even if a webhook is missed. For this repo, pushes to `main` that touch `future-of-collaboration.zopack.md` can sync the live wall automatically; `workflow_dispatch` can force a manual refresh.

A push does **not** mean “deploy everything.” It only becomes a sync candidate when the watched branch and `packPaths` entry match. Other commits are summarized, triaged, or ignored per the event rules. Example packs under `examples/` are **not** in `packPaths`—they were batch-deployed separately (see the deployment manifest). If Zo is asleep or a delivery is missed, the hourly reconciliation pass is the backfill path.

## Current Thesis

The experience should feel less like a corporate logo mosaic and more like a living collaboration artifact. Each Zo user owns one tile in a shared gradient field. Idle and populated tiles stay monochrome according to their grid position; hover or selection reveals the person and project behind the tile. The final grid becomes an exportable event artifact.

## Prototype Status

The Zo Space pack (`future-of-collaboration.zopack.md`) implements a substantial **Milestone 1** slice:

- **Grid view** — up to 100 tiles with deterministic gradient colors; first 30 slots seed from deployed example projects.
- **Globe view** — quad-sphere layout with orbit controls, click-to-select, and WebP textures on curved panels (capped at populated example count).
- **Thumbnails** — prerendered WebP idle previews; live iframe portals on hover (capped).
- **Debug controls** — tile-count slider and view toggle via URL params (`?tiles=`, `?view=grid|globe`).

Not yet built in the prototype: atomic tile claiming, central persistence, live multi-venue updates, AI moderation, admin tools, and high-res export.

## Next Focus

From [`docs/design-doc.md`](docs/design-doc.md), the highest-risk gaps before event readiness are:

1. Identity and tile assignment (Zo Skill → central allocator, no spoofing).
2. Live updates across Toronto and New York with a polling fallback.
3. Honesty-policy moderation with organizer cleanup.
4. Portal/browser fallback for arbitrary project URLs.
5. Export and demo-mode behavior under venue load.
