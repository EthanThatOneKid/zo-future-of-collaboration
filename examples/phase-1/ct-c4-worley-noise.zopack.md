---
format: zopack
version: "1.0"
name: ct-c4-worley-noise
description: "Worley noise F1-F2 cellular texture (Coding in the Cabana C4)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-c4-worley-noise

Animated Worley noise field. Inspired by [Coding Train C4](https://thecodingtrain.com/challenges/c4-worley-noise).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

function hash(ix: number, iy: number) {
  const n = ix * 374761 + iy * 668265;
  return ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 0x7fffffff;
}

export default function WorleyNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    let t = 0;
    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const img = ctx.createImageData(w, h);
      const d = img.data;
      const scale = 0.08;
      const step = 3;

      for (let py = 0; py < h; py += step) {
        for (let px = 0; px < w; px += step) {
          const fx = px * scale + t * 0.02;
          const fy = py * scale + t * 0.015;
          const cellX = Math.floor(fx);
          const cellY = Math.floor(fy);
          let f1 = Infinity;
          let f2 = Infinity;
          for (let oy = -1; oy <= 1; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
              const cx = cellX + ox;
              const cy = cellY + oy;
              const pxp = cx + hash(cx, cy) * 0.8 + 0.1;
              const pyp = cy + hash(cy, cx) * 0.8 + 0.1;
              const dist = Math.hypot(fx - pxp, fy - pyp);
              if (dist < f1) { f2 = f1; f1 = dist; }
              else if (dist < f2) f2 = dist;
            }
          }
          const edge = f2 - f1;
          const hue = (edge * 120 + t) % 360;
          const r = (Math.sin(edge * 15 + t * 0.05) * 0.5 + 0.5) * 200;
          const g = (Math.cos(edge * 12) * 0.5 + 0.5) * 180;
          const b = 80 + edge * 400;
          for (let dy = 0; dy < step && py + dy < h; dy++) {
            for (let dx = 0; dx < step && px + dx < w; dx++) {
              const p = ((py + dy) * w + (px + dx)) * 4;
              d[p] = r | 0;
              d[p + 1] = g | 0;
              d[p + 2] = Math.min(255, b) | 0;
              d[p + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(img, 0, 0);
      t += 0.5;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-teal-300">Worley Noise C4</div>
        <a href="https://thecodingtrain.com/challenges/c4-worley-noise" className="text-blue-400 hover:underline text-xs">
          Inspired by Coding Train C4
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
