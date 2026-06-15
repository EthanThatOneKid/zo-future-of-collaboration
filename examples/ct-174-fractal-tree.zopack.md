---
format: zopack
version: "1.0"
name: ct-174-fractal-tree
description: "Animated fractal tree with wind (Coding Train #174)"
author: "etok.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-174-fractal-tree

Fractal tree. Inspired by [Coding Train #174](https://thecodingtrain.com/challenges/174-applesoft-basic-fractal-tree).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

function branch(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, len: number, angle: number, depth: number,
  wind: number
) {
  if (depth <= 0) return;
  const x2 = x + Math.cos(angle) * len;
  const y2 = y + Math.sin(angle) * len;
  ctx.strokeStyle = `hsl(${100 + depth * 15}, 60%, ${25 + depth * 8}%)`;
  ctx.lineWidth = depth;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  branch(ctx, x2, y2, len * 0.72, angle - 0.35 + wind, depth - 1, wind);
  branch(ctx, x2, y2, len * 0.72, angle + 0.35 + wind, depth - 1, wind);
}

export default function FractalTree() {
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
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      const wind = Math.sin(t * 0.02) * 0.08;
      branch(ctx, w / 2, h - 40, Math.min(w, h) * 0.18, -Math.PI / 2, 10, wind);
      t++;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-green-400">Fractal Tree #174</div>
        <a href="https://thecodingtrain.com/challenges/174-applesoft-basic-fractal-tree" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train #174</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
