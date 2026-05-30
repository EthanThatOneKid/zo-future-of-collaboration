# Example Thumbnail Workflow

This workflow prerenders the deployed Coding Train-inspired example spaces into WebP thumbnails. It is the test bed for replacing eager iframe portals with a thumbnail-first grid.

## Pipeline

1. Discover `examples/*.zopack.md`.
2. Open each deployed route under `http://localhost:3099/examples/<slug>`.
3. Wait for canvas/animation hydration.
4. Capture a PNG screenshot to `.cache/screenshots/`.
5. Convert it to a `640x400` WebP in `examples/thumbnails/`.
6. Write `examples/thumbnails/manifest.json` for the future grid renderer.

## Run

```bash
node scripts/capture-example-thumbnails.mjs
```

Useful variants:

```bash
node scripts/capture-example-thumbnails.mjs --limit 3
node scripts/capture-example-thumbnails.mjs --filter ct-18
node scripts/capture-example-thumbnails.mjs --route-base https://etok.zo.space/examples
node scripts/capture-example-thumbnails.mjs --width 960 --height 600 --quality 88
```

## Output Contract

`examples/thumbnails/manifest.json` contains:

- `routeBase`: public URL base for links.
- `thumbnailSize`: generated thumbnail dimensions.
- `examples[]`: slug, name, description, source pack, public route URL, and thumbnail path.
- `failures[]`: any routes that failed capture.

The future grid can use `thumbnail` as the cheap idle/preview surface and mount the live iframe portal only on hover, focus, click, or selected state.
