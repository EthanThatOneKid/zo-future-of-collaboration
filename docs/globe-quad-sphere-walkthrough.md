# Quad-Sphere Globe Walkthrough

Verification of the 3D globe view in `future-of-collaboration.zopack.md`, scoped to the **30 Coding Train example packs** in `examples/`.

## Goal

Replace the previous icosahedron / latitude-band globe with a **quad-sphere** (spherified cuboid) layout so each collaboration tile is a curved quadrilateral panel that meets its neighbors edge-to-edge, without polar pinch.

## Globe vs grid tile counts

The grid can show up to **100** tiles (`DEFAULT_GRID_SIZE`), but only the first **30** indices map to `exampleProjects` with WebP thumbnails. Empty slots (31–100) stay solid gradient color in grid view.

**Globe mode caps input** to populated examples only:

```ts
globeTiles = tiles.slice(0, Math.min(gridSize, EXAMPLE_PROJECT_COUNT));
```

| `gridSize` | Grid view | Globe examples with webp |
|------------|-----------|--------------------------|
| 100 (default) | 100 tiles (30 live, 70 empty) | 30 |
| 30 | 30 live | 30 |
| 10 (debug) | 10 live | 10 |

The tile-count slider still controls the grid; the debug panel notes when globe is capped (`globe shows first 30 examples`).

## Algorithm

### `findCuboidSubdivisions(target)`

Searches integer cuboid subdivisions `(nx, ny, nz)` up to 20 per axis. Among counts

`2(nx·ny + ny·nz + nz·nx) ≥ target`,

picks the **smallest padding** first, then the least dimensional skew `(nx−ny)² + (ny−nz)² + (nz−nx)²`.

For **30 globe tiles**: `(1, 3, 3)` → exactly **30** face quads — no padding required.

When padding is unavoidable (e.g. debug `tiles=10`), structural gap quads **wrap** an existing example thumbnail (`tiles[index % tiles.length]`) so cuboid topology never leaves pole faces blank.

### `generateSpherifiedCuboidQuads(nx, ny, nz, radius)`

Subdivides each face of the `[-1,1]³` cuboid into quads, then normalizes each corner onto the sphere:

```text
(x, y, z) → (x, y, z) / ‖(x,y,z)‖ × radius
```

### `GlobeStage` rendering

- WebGL-only (no 2D/SVG overlay stack)
- Pads with wrapped example tiles when cuboid quad count exceeds input length (no blank pole faces)
- Builds one `THREE.Mesh` per quad via `buildCurvedTileGeometry(..., segments = 2)` with bilinear sphere projection
- `MeshStandardMaterial` with `flatShading: true`, `FrontSide`, and `EdgesGeometry` wire lines
- Thumbnails via `TextureLoader` on mesh materials
- Badge: `{exampleCount} examples · {faceCount} faces`

## Run locally

```powershell
cd zo-future-of-collaboration
zopack serve --file future-of-collaboration.zopack.md --port 3000 --handle etok
```

Open:

`http://localhost:3000/future-of-collaboration?view=globe`

Optional debug controls:

`http://localhost:3000/future-of-collaboration?view=globe&debug=1`

(`--handle` replaces `{{HANDLE}}` in example URLs. Without it, preview links show the literal placeholder.)

## Verification (2026-06-06)

Automated check: Playwright headless @ 1280×800, plus manual review of screenshot.

| Check | Result |
|-------|--------|
| Page loads (HTTP 200) | Pass |
| Console errors | None |
| WebGL canvas fills stage container | Pass |
| Orbit drag | Pass |
| Thumbnails on populated example tiles | Pass |
| Default globe (`gridSize=100`) shows 30 examples, not 70 empty faces | Pass (after globe cap) |
| 30 examples → `(1,3,3)` → 30 faces, no structural gaps | Pass |
| Debug red rect only when `debug=1` | Pass |

Screenshot: [globe-quad-sphere-screenshot.png](./globe-quad-sphere-screenshot.png)

## Known limitations / follow-ups

- **Exact-fit subdiv `(1,3,3)` at 30 examples** trades slightly wider front/back quads for full sphere coverage (no blank poles)
- **Local serve without `--handle`** leaves `{{HANDLE}}` in example URLs
- **Higher tile counts in globe** require more example packs and thumbnails before the cap can rise
