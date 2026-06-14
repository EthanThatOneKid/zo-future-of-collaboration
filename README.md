# Zo Future of Collaboration

Planning and design-doc repo for the Zo event experience: a standalone app where Zo users claim tiles, publish their vision of the future of collaboration, and collectively generate a live gradient artwork.

## Working Documents

- `docs/design-doc.md` - current product, design, engineering, event-ops, and open-question plan.
- `docs/example-deployment-manifest.md` - record of the batch Zo Space deployment for the example packs.
- `docs/thumbnail-workflow.md` - full screenshot-to-WebP pipeline (prerequisites, capture script, manifest schema, app consumption, troubleshooting).
- `docs/globe-quad-sphere-walkthrough.md` - quad-sphere globe algorithm, rendering stack, and verification notes for globe mode.
- `examples/` - visual [Coding Train](https://thecodingtrain.com/challenges)-inspired [zopack](https://www.zo.computer/skills/zopack) starters for attendee Zo spaces (see `examples/README.md`).
- `examples/thumbnails/` - generated WebP thumbnails and manifest for the deployed example spaces.
- `examples-index.zopack.md` - public index route for the deployed example gallery at `https://etok.zo.space/examples`.
- `future-of-collaboration.zopack.md` - current Zo Space prototype pack for `https://etok.zo.space/future-of-collaboration`.
- `.zo-gh.yml` - repo-local sync policy used by `zo-gh` to keep this repo and the live Zo space eventually consistent.

## `.zo-gh.yml`

This repo-local file tells `zo-gh` how to reconcile GitHub changes into Zo.
It is the policy layer for this repository: which branch to watch, which pack
paths to treat as deployable sources, which GitHub events should trigger sync,
and what prior state key the agent should use when checking for drift.

In practice, `zo-gh` reads this file during webhook handling and scheduled
reconciliation so Zo can stay aligned with GitHub even if a webhook is missed.
For this repo, that means pushes to `main` that touch `future-of-collaboration.zopack.md`
can sync the live Zo Space automatically, while `workflow_dispatch` can force a
manual refresh.

Important: a push does **not** mean “deploy everything.” It only becomes a sync
candidate when the watched branch and watched pack path match the policy above.
Other commits are summarized, triaged, or ignored according to the event rules.
If Zo is asleep or a delivery is missed, the hourly reconciliation pass is the
backfill path that rechecks the same policy and catches drift later.

## Current Thesis

The experience should feel less like a corporate logo mosaic and more like a living collaboration artifact. Each Zo user owns one tile in a shared gradient field. Idle and populated tiles stay monochrome according to their grid position; hovering reveals the person/project behind it. The final grid becomes an exportable event artifact.

## Near-Term Goal

Turn the rough concept into an implementation-ready design doc before building. The highest-risk decisions are identity/assignment, live updates, AI moderation, visual treatment, and how Toronto/New York stay synchronized under real event load.
