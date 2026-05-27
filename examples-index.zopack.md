---
format: zopack
version: "1.0"
name: examples-index
description: "Public index of deployed Future of Collaboration example packs with a link to the collaboration grid."
author: unknown.zo.computer
routes: 1
exported: 2026-05-27
---

# examples-index

Public index of deployed Future of Collaboration example packs with a link to the collaboration grid.

## Routes

### `/examples` (page, public)

```tsx
const examples = [
  ["ct-144-black-hole", "Black Hole"],
  ["ct-145-raycasting", "Raycasting"],
  ["ct-146-raycasting-fps-lite", "Raycasting FPS Lite"],
  ["ct-155-kaleidoscope", "Kaleidoscope"],
  ["ct-159-double-pendulum", "Double Pendulum"],
  ["ct-160-spring-mesh", "Spring Mesh"],
  ["ct-161-estimating-pi", "Estimating Pi"],
  ["ct-162-self-avoiding-walk", "Self-Avoiding Walk"],
  ["ct-163-bezier-curves", "Bezier Curves"],
  ["ct-164-slitscan", "Slit-Scan"],
  ["ct-166-ascii-art-lite", "ASCII Art Lite"],
  ["ct-167-prime-spiral", "Prime Spiral"],
  ["ct-168-julia-set", "Julia Set"],
  ["ct-169-pi-in-the-sky", "Pi in the Sky"],
  ["ct-171-wfc-tiled-lite", "WFC Tiled Lite"],
  ["ct-174-fractal-tree", "Fractal Tree"],
  ["ct-176-buffons-needle", "Buffon's Needle"],
  ["ct-178-climate-spiral", "Climate Spiral"],
  ["ct-179-wolfram-ca", "Wolfram CA"],
  ["ct-180-falling-sand", "Falling Sand"],
  ["ct-181-voronoi-stipple", "Voronoi Stipple"],
  ["ct-182-apollonian-gasket", "Apollonian Gasket"],
  ["ct-183-mathematical-marbling", "Mathematical Marbling"],
  ["ct-184-elastic-collisions", "Elastic Collisions"],
  ["ct-185-dragon-curve", "Dragon Curve"],
  ["ct-c1-maurer-rose", "Maurer Rose"],
  ["ct-c2-collatz", "Collatz"],
  ["ct-c3-hilbert-curve", "Hilbert Curve"],
  ["ct-c4-worley-noise", "Worley Noise"],
  ["ct-c5-marching-squares", "Marching Squares"],
] as const;

function colorFor(index: number) {
  const hue = 205 + index * 7;
  return `linear-gradient(135deg, hsl(${hue}, 78%, 54%), hsl(${hue + 45}, 82%, 38%))`;
}

export default function ExamplesIndex() {
  return (
    <main className="min-h-screen bg-[#090a0f] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-12">
        <div className="mb-8 grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/80">Zopack batch deploy</p>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Future of Collaboration examples</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-white/60 lg:justify-self-end">
            Thirty one-route Zo Space packs remapped from attendee homepages to public demo routes. This simulates onboarding: each participant brings a pack, Zo assigns it a stable route, and the wall can point to their deployed work.
          </p>
          <a
            href="/future-of-collaboration"
            className="inline-flex w-fit items-center rounded-full border border-sky-300/40 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:border-sky-200 hover:bg-sky-300 hover:text-slate-950 lg:col-start-2 lg:justify-self-end"
          >
            View as collaboration grid {"->"}
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {examples.map(([slug, title], index) => (
            <a
              key={slug}
              href={`/examples/${slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
            >
              <div className="mb-4 aspect-square rounded-xl opacity-85 ring-1 ring-white/10 transition duration-300 group-hover:opacity-100" style={{ background: colorFor(index) }} />
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-white/40">{String(index + 1).padStart(2, "0")}</div>
                  <h2 className="text-base font-semibold leading-tight">{title}</h2>
                </div>
                <span className="text-lg text-white/35 transition group-hover:translate-x-1 group-hover:text-white">→</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
```

