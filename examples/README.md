# Zo Space Examples — Visual Coding Train Gallery

Starter [zopacks](https://www.zo.computer/skills/zopack) for the **Future of Collaboration** event. Each pack is a single Zo space route with a full-screen canvas demo—vanilla JavaScript + `CanvasRenderingContext2D`, inspired by [Coding Train](https://thecodingtrain.com/challenges) challenges.

Prior art: [Nature of Code](https://natureofcode.com/) (pedagogy) · [Coding Train challenges](https://thecodingtrain.com/challenges) (visual punch).

**30 packs** total.

## Prerequisites

1. [Bun](https://bun.sh)
2. [zopack-cli](https://github.com/EthanThatOneKid/zopack-cli) linked globally:

```bash
cd /path/to/zopack-cli
bun install
bun link
```

## Quick start

```bash
zopack import --file examples/ct-180-falling-sand.zopack.md --preview
zopack serve --file examples/ct-180-falling-sand.zopack.md
```

Validate all packs:

```powershell
Get-ChildItem examples/*.zopack.md | ForEach-Object {
  zopack import --file $_.FullName --preview
}
```

## Attendee workflow

1. Pick a pack from the tables below.
2. `zopack serve --file …` and remix the route code in the `.zopack.md` file.
3. Deploy to Zo via [zopack import](https://github.com/EthanThatOneKid/zopack-cli) or the Zo ↔ GitHub sync loop.

## Gallery

### Pixel physics & simulation

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-180-falling-sand.zopack.md](ct-180-falling-sand.zopack.md) | Falling sand, water, stone — paint with mouse | [#180](https://thecodingtrain.com/challenges/180-falling-sand) |
| [ct-184-elastic-collisions.zopack.md](ct-184-elastic-collisions.zopack.md) | Elastic circle collisions — click to add | [#184](https://thecodingtrain.com/challenges/184-elastic-collisions) |
| [ct-159-double-pendulum.zopack.md](ct-159-double-pendulum.zopack.md) | Chaotic double pendulum | [#159](https://thecodingtrain.com/challenges/159-simple-pendulum-simulation) |
| [ct-160-spring-mesh.zopack.md](ct-160-spring-mesh.zopack.md) | Spring mesh — drag to disturb | [#160](https://thecodingtrain.com/challenges/160-spring-forces) |

### Cellular & procedural

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-179-wolfram-ca.zopack.md](ct-179-wolfram-ca.zopack.md) | Elementary 1D cellular automaton, rule slider | [#179](https://thecodingtrain.com/challenges/179-wolfram-elementary-cellular-automaton) |
| [ct-171-wfc-tiled-lite.zopack.md](ct-171-wfc-tiled-lite.zopack.md) | 16×16 tiled Wave Function Collapse lite | [#171](https://thecodingtrain.com/challenges/171-wave-function-collapse) |
| [ct-162-self-avoiding-walk.zopack.md](ct-162-self-avoiding-walk.zopack.md) | Self-avoiding walk on a grid | [#162](https://thecodingtrain.com/challenges/162-self-avoiding-walk) |
| [ct-c5-marching-squares.zopack.md](ct-c5-marching-squares.zopack.md) | Animated noise contours | [C5](https://thecodingtrain.com/challenges/c5-marching-squares) |

### Organic fluids & curves

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-183-mathematical-marbling.zopack.md](ct-183-mathematical-marbling.zopack.md) | Ink marbling, click to add drops | [#183](https://thecodingtrain.com/challenges/183-mathematical-marbling) |
| [ct-185-dragon-curve.zopack.md](ct-185-dragon-curve.zopack.md) | Animated dragon curve unfold | [#185](https://thecodingtrain.com/challenges/185-dragon-curve) |
| [ct-163-bezier-curves.zopack.md](ct-163-bezier-curves.zopack.md) | Draggable cubic Bézier curve | [#163](https://thecodingtrain.com/challenges/163-bezier-curves) |
| [ct-174-fractal-tree.zopack.md](ct-174-fractal-tree.zopack.md) | Fractal tree with wind sway | [#174](https://thecodingtrain.com/challenges/174-applesoft-basic-fractal-tree) |

### Geometry

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-182-apollonian-gasket.zopack.md](ct-182-apollonian-gasket.zopack.md) | Apollonian circle gasket | [#182](https://thecodingtrain.com/challenges/182-apollonian-gasket) |
| [ct-181-voronoi-stipple.zopack.md](ct-181-voronoi-stipple.zopack.md) | Lloyd relaxation stipple-lite | [#181](https://thecodingtrain.com/challenges/181-weighted-voronoi-stippling) |
| [ct-c1-maurer-rose.zopack.md](ct-c1-maurer-rose.zopack.md) | Maurer rose, n and d sliders | [C1](https://thecodingtrain.com/challenges/c1-maurer-rose) |
| [ct-c3-hilbert-curve.zopack.md](ct-c3-hilbert-curve.zopack.md) | Animated Hilbert space-filling curve | [C3](https://thecodingtrain.com/challenges/c3-hilbert-curve) |

### Spirals, pi & data art

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-178-climate-spiral.zopack.md](ct-178-climate-spiral.zopack.md) | Hawkins-style climate spiral | [#178](https://thecodingtrain.com/challenges/178-climate-spiral) |
| [ct-167-prime-spiral.zopack.md](ct-167-prime-spiral.zopack.md) | Ulam prime spiral, scroll to zoom | [#167](https://thecodingtrain.com/challenges/167-the-prime-ulam-spiral) |
| [ct-161-estimating-pi.zopack.md](ct-161-estimating-pi.zopack.md) | Estimate π via coprime pairs | [#161](https://thecodingtrain.com/challenges/161-estimating-pi-from-random-numbers-with-euclids-algorithm) |
| [ct-176-buffons-needle.zopack.md](ct-176-buffons-needle.zopack.md) | Buffon's needle π experiment | [#176](https://thecodingtrain.com/challenges/176-buffons-needle) |
| [ct-c2-collatz.zopack.md](ct-c2-collatz.zopack.md) | Collatz sequence bar chart | [C2](https://thecodingtrain.com/challenges/c2-collatz-conjecture) |

### Space, light & fractals

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-145-raycasting.zopack.md](ct-145-raycasting.zopack.md) | 2D ray casting, WASD + mouse aim | [#145](https://thecodingtrain.com/challenges/145-ray-casting-2d) |
| [ct-146-raycasting-fps-lite.zopack.md](ct-146-raycasting-fps-lite.zopack.md) | First-person Wolfenstein-style walls | [#146](https://thecodingtrain.com/challenges/146-rendering-ray-casting) |
| [ct-144-black-hole.zopack.md](ct-144-black-hole.zopack.md) | Gravitational lensing + accretion disk | [#144](https://thecodingtrain.com/challenges/144-2d-black-hole-visualization) |
| [ct-168-julia-set.zopack.md](ct-168-julia-set.zopack.md) | Julia set pan/zoom | [#168](https://thecodingtrain.com/challenges/168-the-mandelbulb) |

### Interactive toys & effects

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-155-kaleidoscope.zopack.md](ct-155-kaleidoscope.zopack.md) | Kaleidoscope paint on drag | [#155](https://thecodingtrain.com/challenges/155-kaleidoscope-snowflake-supportp5) |
| [ct-c4-worley-noise.zopack.md](ct-c4-worley-noise.zopack.md) | Animated Worley cellular noise | [C4](https://thecodingtrain.com/challenges/c4-worley-noise) |
| [ct-164-slitscan.zopack.md](ct-164-slitscan.zopack.md) | Slit-scan time displacement | [#164](https://thecodingtrain.com/challenges/164-slitscan-time-displacement-effect) |
| [ct-166-ascii-art-lite.zopack.md](ct-166-ascii-art-lite.zopack.md) | Animated ASCII from procedural field | [#166](https://thecodingtrain.com/challenges/166-image-to-ascii) |
| [ct-169-pi-in-the-sky.zopack.md](ct-169-pi-in-the-sky.zopack.md) | Catch falling π digits | [#169](https://thecodingtrain.com/challenges/169-pi-in-the-sky-game) |

## Thumbnails

Grid and globe views in `future-of-collaboration.zopack.md` use prerendered WebP previews from `examples/thumbnails/` instead of loading every example iframe at once.

To regenerate after visual changes or when adding a pack:

```bash
node scripts/capture-example-thumbnails.mjs \
  --route-base https://etok.zo.space/examples \
  --public-base https://etok.zo.space/examples
```

Full pipeline, prerequisites, defaults, and troubleshooting: [`docs/thumbnail-workflow.md`](../docs/thumbnail-workflow.md).

After adding a pack you must also append its slug to `exampleProjects` in `future-of-collaboration.zopack.md`.

## Future additions

Optional [Nature of Code](https://natureofcode.com/) chapter packs and additional CT challenges (ML-heavy, 3D, or long builds deferred).

## Tooling

- [zopack-cli](https://github.com/EthanThatOneKid/zopack-cli)
- [Zo platform docs](https://docs.zocomputer.com/llms-full.txt)
