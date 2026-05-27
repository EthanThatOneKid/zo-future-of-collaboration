---
format: zopack
version: "1.0"
name: ct-181-voronoi-stipple
description: "Voronoi stippling lite — Lloyd relaxation dots (Coding Train #181)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-181-voronoi-stipple

Stipple-lite with Lloyd relaxation. Inspired by [Coding Train #181](https://thecodingtrain.com/challenges/181-weighted-voronoi-stippling).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

const N = 400;
const ITERS = 4;

function targetBrightness(x: number, y: number) {
  const cx = 0.5 + Math.sin(x * 8) * 0.1;
  const cy = 0.5 + Math.cos(y * 8) * 0.1;
  const d = Math.hypot(x - cx, y - cy);
  return 1 - Math.min(1, d * 1.8);
}

export default function Stipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pts = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
    }));

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      if (frame % 30 === 0) {
        for (let k = 0; k < ITERS; k++) {
          const sums = pts.map(() => ({ x: 0, y: 0, w: 0 }));
          const step = 12;
          for (let py = 0; py < h; py += step) {
            for (let px = 0; px < w; px += step) {
              const nx = px / w;
              const ny = py / h;
              let best = 0;
              let bestD = Infinity;
              for (let i = 0; i < pts.length; i++) {
                const d = (pts[i].x - nx) ** 2 + (pts[i].y - ny) ** 2;
                if (d < bestD) { bestD = d; best = i; }
              }
              const bright = targetBrightness(nx, ny);
              const weight = bright * bright + 0.05;
              sums[best].x += nx * weight;
              sums[best].y += ny * weight;
              sums[best].w += weight;
            }
          }
          for (let i = 0; i < pts.length; i++) {
            if (sums[i].w > 0) {
              pts[i].x = sums[i].x / sums[i].w;
              pts[i].y = sums[i].y / sums[i].w;
            }
          }
        }
      }

      ctx.fillStyle = "#f5f0e8";
      ctx.fillRect(0, 0, w, h);
      for (const p of pts) {
        const bright = targetBrightness(p.x, p.y);
        const r = 1.2 + bright * 2.5;
        ctx.fillStyle = `rgba(20, 20, 30, ${0.3 + bright * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame++;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#f5f0e8]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-stone-800 text-sm font-sans bg-white/80 rounded px-3 py-2">
        <div className="font-semibold">Voronoi Stipple Lite #181</div>
        <a href="https://thecodingtrain.com/challenges/181-weighted-voronoi-stippling" className="text-blue-600 hover:underline text-xs">
          Inspired by Coding Train #181
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
