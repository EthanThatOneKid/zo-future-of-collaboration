# Zo Space Example Batch Deployment Manifest

- Deployed: 2026-05-27 19:15:15 UTC
- Target: `https://etok.zo.space/examples`
- Source packs: `examples/*.zopack.md`
- Strategy: simulate attendee onboarding by remapping each one-route homepage pack from `/` to `/examples/<pack-slug>`.
- Visibility: all deployed example pages are public.
- Homepage safety: the live Zo Space homepage `/` was not modified.

## Verification

- Validated each pack with `zopack import --preview`.
- Security scan checked for high-risk route patterns: `fetch(`, `process.env`, `eval(`, `Function(`, dynamic `import(`, `atob(`, `Buffer.from`, filesystem access, and path traversal markers.
- Confirmed Zo Space route list includes all 30 `/examples/*` routes plus the `/examples` index.
- Confirmed `get_space_errors()` returned no route errors after deployment.

## Thumbnails

After deploying or visually changing example packs, regenerate WebP previews with the capture script documented in [`thumbnail-workflow.md`](./thumbnail-workflow.md). Outputs land in `examples/thumbnails/` and are referenced by slug from `future-of-collaboration.zopack.md`.

## Routes

| # | Pack | Live URL | Source |
|---:|---|---|---|
| 1 | `ct-144-black-hole` | https://etok.zo.space/examples/ct-144-black-hole | `examples/ct-144-black-hole.zopack.md` |
| 2 | `ct-145-raycasting` | https://etok.zo.space/examples/ct-145-raycasting | `examples/ct-145-raycasting.zopack.md` |
| 3 | `ct-146-raycasting-fps-lite` | https://etok.zo.space/examples/ct-146-raycasting-fps-lite | `examples/ct-146-raycasting-fps-lite.zopack.md` |
| 4 | `ct-155-kaleidoscope` | https://etok.zo.space/examples/ct-155-kaleidoscope | `examples/ct-155-kaleidoscope.zopack.md` |
| 5 | `ct-159-double-pendulum` | https://etok.zo.space/examples/ct-159-double-pendulum | `examples/ct-159-double-pendulum.zopack.md` |
| 6 | `ct-160-spring-mesh` | https://etok.zo.space/examples/ct-160-spring-mesh | `examples/ct-160-spring-mesh.zopack.md` |
| 7 | `ct-161-estimating-pi` | https://etok.zo.space/examples/ct-161-estimating-pi | `examples/ct-161-estimating-pi.zopack.md` |
| 8 | `ct-162-self-avoiding-walk` | https://etok.zo.space/examples/ct-162-self-avoiding-walk | `examples/ct-162-self-avoiding-walk.zopack.md` |
| 9 | `ct-163-bezier-curves` | https://etok.zo.space/examples/ct-163-bezier-curves | `examples/ct-163-bezier-curves.zopack.md` |
| 10 | `ct-164-slitscan` | https://etok.zo.space/examples/ct-164-slitscan | `examples/ct-164-slitscan.zopack.md` |
| 11 | `ct-166-ascii-art-lite` | https://etok.zo.space/examples/ct-166-ascii-art-lite | `examples/ct-166-ascii-art-lite.zopack.md` |
| 12 | `ct-167-prime-spiral` | https://etok.zo.space/examples/ct-167-prime-spiral | `examples/ct-167-prime-spiral.zopack.md` |
| 13 | `ct-168-julia-set` | https://etok.zo.space/examples/ct-168-julia-set | `examples/ct-168-julia-set.zopack.md` |
| 14 | `ct-169-pi-in-the-sky` | https://etok.zo.space/examples/ct-169-pi-in-the-sky | `examples/ct-169-pi-in-the-sky.zopack.md` |
| 15 | `ct-171-wfc-tiled-lite` | https://etok.zo.space/examples/ct-171-wfc-tiled-lite | `examples/ct-171-wfc-tiled-lite.zopack.md` |
| 16 | `ct-174-fractal-tree` | https://etok.zo.space/examples/ct-174-fractal-tree | `examples/ct-174-fractal-tree.zopack.md` |
| 17 | `ct-176-buffons-needle` | https://etok.zo.space/examples/ct-176-buffons-needle | `examples/ct-176-buffons-needle.zopack.md` |
| 18 | `ct-178-climate-spiral` | https://etok.zo.space/examples/ct-178-climate-spiral | `examples/ct-178-climate-spiral.zopack.md` |
| 19 | `ct-179-wolfram-ca` | https://etok.zo.space/examples/ct-179-wolfram-ca | `examples/ct-179-wolfram-ca.zopack.md` |
| 20 | `ct-180-falling-sand` | https://etok.zo.space/examples/ct-180-falling-sand | `examples/ct-180-falling-sand.zopack.md` |
| 21 | `ct-181-voronoi-stipple` | https://etok.zo.space/examples/ct-181-voronoi-stipple | `examples/ct-181-voronoi-stipple.zopack.md` |
| 22 | `ct-182-apollonian-gasket` | https://etok.zo.space/examples/ct-182-apollonian-gasket | `examples/ct-182-apollonian-gasket.zopack.md` |
| 23 | `ct-183-mathematical-marbling` | https://etok.zo.space/examples/ct-183-mathematical-marbling | `examples/ct-183-mathematical-marbling.zopack.md` |
| 24 | `ct-184-elastic-collisions` | https://etok.zo.space/examples/ct-184-elastic-collisions | `examples/ct-184-elastic-collisions.zopack.md` |
| 25 | `ct-185-dragon-curve` | https://etok.zo.space/examples/ct-185-dragon-curve | `examples/ct-185-dragon-curve.zopack.md` |
| 26 | `ct-c1-maurer-rose` | https://etok.zo.space/examples/ct-c1-maurer-rose | `examples/ct-c1-maurer-rose.zopack.md` |
| 27 | `ct-c2-collatz` | https://etok.zo.space/examples/ct-c2-collatz | `examples/ct-c2-collatz.zopack.md` |
| 28 | `ct-c3-hilbert-curve` | https://etok.zo.space/examples/ct-c3-hilbert-curve | `examples/ct-c3-hilbert-curve.zopack.md` |
| 29 | `ct-c4-worley-noise` | https://etok.zo.space/examples/ct-c4-worley-noise | `examples/ct-c4-worley-noise.zopack.md` |
| 30 | `ct-c5-marching-squares` | https://etok.zo.space/examples/ct-c5-marching-squares | `examples/ct-c5-marching-squares.zopack.md` |
