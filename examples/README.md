# Zo Space Examples — Visual Coding Train Gallery

Starter [zopacks](https://www.zo.computer/skills/zopack) for the **Future of Collaboration** event. Each pack is a single Zo space route with a full-screen canvas demo—vanilla JavaScript + `CanvasRenderingContext2D`, inspired by [Coding Train](https://thecodingtrain.com/challenges) challenges.

Prior art: [Nature of Code](https://natureofcode.com/) (pedagogy) · [Coding Train challenges](https://thecodingtrain.com/challenges) (visual punch).

## Prerequisites

1. [Bun](https://bun.sh)
2. [zopack-cli](https://github.com/EthanThatOneKid/zopack-cli) linked globally:

```bash
cd /path/to/zopack-cli
bun install
bun link
```

## Quick start

Preview a pack (safe, no deploy):

```bash
zopack import --file examples/ct-180-falling-sand.zopack.md --preview
```

Run locally:

```bash
zopack serve --file examples/ct-180-falling-sand.zopack.md
```

Open `http://localhost:5173` (default port).

Validate all packs:

```powershell
Get-ChildItem examples/*.zopack.md | ForEach-Object {
  zopack import --file $_.FullName --preview
}
```

## Attendee workflow

1. Pick a pack from the table below.
2. `zopack serve --file …` and remix the route code in the `.zopack.md` file.
3. Deploy to Zo via [zopack import](https://github.com/EthanThatOneKid/zopack-cli) or the Zo ↔ GitHub sync loop.

## Gallery

### Pixel physics

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-180-falling-sand.zopack.md](ct-180-falling-sand.zopack.md) | Falling sand, water, stone — paint with mouse | [#180](https://thecodingtrain.com/challenges/180-falling-sand) |

### Cellular & procedural

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-179-wolfram-ca.zopack.md](ct-179-wolfram-ca.zopack.md) | Elementary 1D cellular automaton, rule slider | [#179](https://thecodingtrain.com/challenges/179-wolfram-elementary-cellular-automaton) |
| [ct-171-wfc-tiled-lite.zopack.md](ct-171-wfc-tiled-lite.zopack.md) | 16×16 tiled Wave Function Collapse lite | [#171](https://thecodingtrain.com/challenges/171-wave-function-collapse) |

### Organic fluids & curves

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-183-mathematical-marbling.zopack.md](ct-183-mathematical-marbling.zopack.md) | Ink marbling, click to add drops | [#183](https://thecodingtrain.com/challenges/183-mathematical-marbling) |
| [ct-185-dragon-curve.zopack.md](ct-185-dragon-curve.zopack.md) | Animated dragon curve unfold | [#185](https://thecodingtrain.com/challenges/185-dragon-curve) |

### Geometry

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-182-apollonian-gasket.zopack.md](ct-182-apollonian-gasket.zopack.md) | Apollonian circle gasket | [#182](https://thecodingtrain.com/challenges/182-apollonian-gasket) |
| [ct-181-voronoi-stipple.zopack.md](ct-181-voronoi-stipple.zopack.md) | Lloyd relaxation stipple-lite | [#181](https://thecodingtrain.com/challenges/181-weighted-voronoi-stippling) |
| [ct-c1-maurer-rose.zopack.md](ct-c1-maurer-rose.zopack.md) | Maurer rose, n and d sliders | [C1](https://thecodingtrain.com/challenges/c1-maurer-rose) |

### Spirals & data art

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-178-climate-spiral.zopack.md](ct-178-climate-spiral.zopack.md) | Hawkins-style climate spiral | [#178](https://thecodingtrain.com/challenges/178-climate-spiral) |
| [ct-167-prime-spiral.zopack.md](ct-167-prime-spiral.zopack.md) | Ulam prime spiral, scroll to zoom | [#167](https://thecodingtrain.com/challenges/167-the-prime-ulam-spiral) |

### Space, light & fractals

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-145-raycasting.zopack.md](ct-145-raycasting.zopack.md) | 2D ray casting, WASD + mouse aim | [#145](https://thecodingtrain.com/challenges/145-ray-casting-2d) |
| [ct-144-black-hole.zopack.md](ct-144-black-hole.zopack.md) | Gravitational lensing + accretion disk | [#144](https://thecodingtrain.com/challenges/144-2d-black-hole-visualization) |
| [ct-168-julia-set.zopack.md](ct-168-julia-set.zopack.md) | Julia set pan/zoom (2D stand-in for Mandelbulb) | [#168](https://thecodingtrain.com/challenges/168-the-mandelbulb) |

### Interactive toys

| Pack | Description | CT source |
|------|-------------|-----------|
| [ct-155-kaleidoscope.zopack.md](ct-155-kaleidoscope.zopack.md) | Kaleidoscope paint on drag | [#155](https://thecodingtrain.com/challenges/155-kaleidoscope-snowflake-supportp5) |
| [ct-c4-worley-noise.zopack.md](ct-c4-worley-noise.zopack.md) | Animated Worley cellular noise | [C4](https://thecodingtrain.com/challenges/c4-worley-noise) |

## Future additions

Optional [Nature of Code](https://natureofcode.com/) chapter packs and additional CT challenges (ML-heavy, 3D, or long builds deferred).

## Tooling

- [zopack-cli](https://github.com/EthanThatOneKid/zopack-cli)
- [Zo platform docs](https://docs.zocomputer.com/llms-full.txt)
