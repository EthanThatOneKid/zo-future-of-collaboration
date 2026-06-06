# Quad-Sphere Globe Walkthrough

Verification of the 3D globe view in `future-of-collaboration.zopack.md`, scoped to **30 tiles** (matching the 30 Coding Train example packs in `examples/`).

## Goal

Replace the previous icosahedron / latitude-band globe with a **quad-sphere** (spherified cuboid) layout so each collaboration tile is a flat quadrilateral panel that meets its neighbors edge-to-edge, without polar pinch.

## Algorithm

### `findCuboidSubdivisions(target)`

Searches integer cuboid subdivisions `(nx, ny, nz)` up to 20 per axis. Picks the smallest face count

`2(nx·ny + ny·nz + nz·nx) ≥ target`

with the least dimensional skew `(nx−ny)² + (ny−nz)² + (nz−nx)²`.

For **30 tiles**: `(1, 3, 3)` → exactly **30** face quads — no padding required.

### `generateSpherifiedCuboidQuads(nx, ny, nz, radius)`

Subdivides each face of the `[-1,1]³` cuboid into quads, then normalizes each corner onto the sphere:

```text
(x, y, z) → (x, y, z) / ‖(x,y,z)‖ × radius
```

### `GlobeStage` rendering

- Pads `tiles` with `"empty"` slots only when quad count exceeds input length
- Builds one `THREE.Mesh` per quad via `buildCurvedTileGeometry(..., segments = 1)`
- Uses `MeshStandardMaterial` with `flatShading: true` and directional lighting
- SVG + 2D canvas overlay draws crisp borders and clipped thumbnails projected from 3D corners

## Run locally

```powershell
cd zo-future-of-collaboration
zopack serve --file future-of-collaboration.zopack.md --port 3000 --handle etok
```

Open:

`http://localhost:3000/future-of-collaboration?view=globe&tiles=30&debug=1`

(`--handle` replaces `{{HANDLE}}` in example URLs. Without it, preview links show the literal placeholder.)

## Verification (2026-06-06)

Automated check: Playwright headless @ 1280×800, plus manual review of screenshot.

| Check | Result |
|-------|--------|
| Page loads (HTTP 200) | Pass |
| Console errors | None |
| WebGL + overlay same size as stage (980×720) | Pass (after layout hardening) |
| WebGL canvas mounted in `containerRef` (not overlay root) | Pass |
| Orbit drag | Pass |
| Hover updates sidebar preview | Pass (`#2 Raycasting` on sample hover) |
| Thumbnails visible on populated tiles | Pass |
| 30 input tiles → 30 quads, no empty padding | Pass `(1,3,3)` |
| Debug red rect only when `debug=1` | Pass |

Screenshot: [globe-quad-sphere-screenshot.png](./globe-quad-sphere-screenshot.png)

## Fixes applied during resume

Antigravity crashed before confirming overlay alignment. During Cursor resume:

1. **WebGL mount** — renderer canvas moved from `overlayRootRef` to `containerRef` so sizing and hit-testing share one box
2. **CSS fill** — `width/height: 100%` on WebGL and overlay canvases
3. **Projection** — `drawOverlay` uses `renderer.domElement.clientWidth/Height` for 2D projection
4. **Debug rect** — red SVG marker gated behind `debugMode` prop (only when `?debug=1`)

## Known limitations / follow-ups

- **`tiles=100`** not verified yet — defer until more example packs exist
- **`drawOverlay` runs every frame** for all panels; may need throttling at higher tile counts
- **Local serve without `--handle`** leaves `{{HANDLE}}` in example URLs
- **Click-to-open** not exercised in headless QA (requires raycast hit on a specific tile); manual spot-check recommended before event use
