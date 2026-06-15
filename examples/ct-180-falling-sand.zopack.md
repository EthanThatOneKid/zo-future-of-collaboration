---
format: zopack
version: "1.0"
name: ct-180-falling-sand
description: "Falling sand pixel physics — sand, water, stone (Coding Train #180)"
author: "etok.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-180-falling-sand

Falling sand simulation with mouse painting. Inspired by [Coding Train #180](https://thecodingtrain.com/challenges/180-falling-sand).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect, useState } from "react";

const W = 120;
const H = 80;
const EMPTY = 0;
const SAND = 1;
const WATER = 2;
const STONE = 3;
const COLORS = ["#0a0a12", "#e8c547", "#4a9eff", "#888899"];

export default function FallingSand() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brush, setBrush] = useState(SAND);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grid = new Uint8Array(W * H);
    const img = ctx.createImageData(W, H);

    const idx = (x: number, y: number) => y * W + x;
    const inBounds = (x: number, y: number) => x >= 0 && x < W && y >= 0 && y < H;

    const paint = (mx: number, my: number, r = 3) => {
      const gx = Math.floor((mx / canvas.clientWidth) * W);
      const gy = Math.floor((my / canvas.clientHeight) * H);
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const x = gx + dx;
          const y = gy + dy;
          if (inBounds(x, y) && dx * dx + dy * dy <= r * r) grid[idx(x, y)] = brush;
        }
      }
    };

    let painting = false;
    const onDown = (e: MouseEvent) => { painting = true; paint(e.offsetX, e.offsetY); };
    const onMove = (e: MouseEvent) => { if (painting) paint(e.offsetX, e.offsetY); };
    const onUp = () => { painting = false; };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    const step = () => {
      for (let y = H - 2; y >= 0; y--) {
        for (let x = 0; x < W; x++) {
          const i = idx(x, y);
          const cell = grid[i];
          if (cell === SAND) {
            const below = idx(x, y + 1);
            if (grid[below] === EMPTY) {
              grid[i] = EMPTY;
              grid[below] = SAND;
            } else {
              const dir = Math.random() < 0.5 ? -1 : 1;
              const nx = x + dir;
              if (inBounds(nx, y + 1) && grid[idx(nx, y + 1)] === EMPTY && grid[idx(nx, y)] === EMPTY) {
                grid[i] = EMPTY;
                grid[idx(nx, y + 1)] = SAND;
              }
            }
          } else if (cell === WATER) {
            const down = y + 1;
            if (inBounds(x, down) && grid[idx(x, down)] === EMPTY) {
              grid[i] = EMPTY;
              grid[idx(x, down)] = WATER;
            } else {
              const dir = Math.random() < 0.5 ? -1 : 1;
              const nx = x + dir;
              if (inBounds(nx, y) && grid[idx(nx, y)] === EMPTY) {
                grid[i] = EMPTY;
                grid[idx(nx, y)] = WATER;
              }
            }
          }
        }
      }
    };

    const draw = () => {
      const d = img.data;
      for (let i = 0; i < grid.length; i++) {
        const c = COLORS[grid[i]];
        const p = i * 4;
        d[p] = parseInt(c.slice(1, 3), 16);
        d[p + 1] = parseInt(c.slice(3, 5), 16);
        d[p + 2] = parseInt(c.slice(5, 7), 16);
        d[p + 3] = 255;
      }
      ctx.imageSmoothingEnabled = false;
      ctx.putImageData(img, 0, 0);
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let raf = 0;
    const loop = () => {
      if (frame % 2 === 0) step();
      ctx.save();
      ctx.scale(canvas.clientWidth / W, canvas.clientHeight / H);
      draw();
      ctx.restore();
      frame++;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, [brush]);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12] overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
      <div className="absolute top-3 left-3 flex flex-col gap-2 text-white text-sm font-sans">
        <span className="font-semibold text-amber-300">Falling Sand #180</span>
        <div className="flex gap-1">
          {[
            { id: SAND, label: "Sand", color: "#e8c547" },
            { id: WATER, label: "Water", color: "#4a9eff" },
            { id: STONE, label: "Stone", color: "#888899" },
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBrush(b.id)}
              className={`px-2 py-1 rounded text-xs border ${brush === b.id ? "border-white" : "border-white/30"}`}
              style={{ background: b.color, color: b.id === SAND ? "#000" : "#fff" }}
            >
              {b.label}
            </button>
          ))}
        </div>
        <a href="https://thecodingtrain.com/challenges/180-falling-sand" className="text-blue-400 hover:underline text-xs">
          Inspired by Coding Train #180
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
