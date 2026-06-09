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

Globe mode is **passive**: orbit controls only — no tile hover, click, or raycasting.

## Algorithm

### `findCuboidSubdivisions(target)`

Searches integer cuboid subdivisions `(nx, ny, nz)` up to 20 per axis. Among counts

`2(nx·ny + ny·nz + nz·nx) ≥ target`,

picks the **smallest padding** first, then the least dimensional skew `(nx−ny)² + (ny−nz)² + (nz−nx)²`.

Layouts with aspect ratio `max(nx,ny,nz) / min(nx,ny,nz) > 2` are rejected first so front/back faces do not collapse to a single quad column (which reads as axis-stretched on the sphere). If no layout passes the aspect filter, the search falls back without that constraint.

For **30 globe tiles**: `(2, 2, 3)` → **32** face quads — **2** structural padding slots wrap existing example thumbnails.

When padding is unavoidable (e.g. debug `tiles=10`), structural gap quads **wrap** an existing example thumbnail (`tiles[index % tiles.length]`) so cuboid topology never leaves pole faces blank.

### `generateSpherifiedCuboidQuads(nx, ny, nz, radius)`

Subdivides each face of the `[-1,1]³` cuboid into quads, then normalizes each corner onto the sphere. Each quad carries optional `flipU` / `flipV` flags so thumbnail orientation stays consistent across cuboid face windings.

```text
(x, y, z) → (x, y, z) / ‖(x,y,z)‖ × radius
```

### Rendering stack

1. **WebGL-only** — no 2D/SVG overlay (avoids rotation desync)
2. **Curved quads** — `buildCurvedTileGeometry(..., segments = 3)` with bilinear sphere projection
3. **Seam lines** — `buildQuadBorderGeometry` per quad (soft white perimeter, not mesh triangle edges)
4. **Atmosphere** — dual Fresnel `ShaderMaterial` shells via `addAtmosphereGlow` (inner rim + outer haze; outer shell has a slow intensity pulse)
5. **Background** — CSS radial gradient matched to the cyan atmosphere palette

### `GlobeStage` materials and textures

- Thumbnail tiles: `MeshBasicMaterial` + `TextureLoader` (true color, no brighten filter)
- Textures: sRGB color space, max anisotropy
- UVs: `uvs.push(u, v)` with per-face `flipU` / `flipV` so artwork matches grid orientation
- Non-thumbnail slots (debug only): `MeshStandardMaterial` with flat shading
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

## Verification (2026-06-05)

Automated check: Playwright headless @ 1280×800, plus manual review of screenshot.

| Check | Result |
|-------|--------|
| Page loads (HTTP 200) | Pass |
| Console errors | None |
| WebGL canvas fills stage container | Pass |
| Orbit drag + auto-rotate | Pass |
| Thumbnails upright and true-color on example tiles | Pass |
| Default globe (`gridSize=100`) shows 30 examples, not 70 empty faces | Pass |
| 30 examples → `(2,2,3)` → **30 examples · 32 faces** | Pass |
| Atmospheric rim glow visible at limb | Pass |
| Debug red rect only when `debug=1` | Pass |

Screenshot: [globe-quad-sphere-screenshot.png](./globe-quad-sphere-screenshot.png)

## Known limitations / follow-ups

- **Globe is capped at 30 examples** until more packs and thumbnails exist in `examples/`
- **Passive globe** — use grid view for hover preview and click-through to Zo spaces
- **Local serve without `--handle`** leaves `{{HANDLE}}` in example URLs
- **2 wrap-filled faces** at 30 examples duplicate two thumbnails structurally (badge still reports example count separately)
