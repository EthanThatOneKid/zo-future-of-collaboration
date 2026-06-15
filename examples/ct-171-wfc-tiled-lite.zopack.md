---
format: zopack
version: "1.0"
name: ct-171-wfc-tiled-lite
description: "Wave Function Collapse tiled lite (Coding Train #171)"
author: "etok.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-171-wfc-tiled-lite

Small tiled WFC grid. Inspired by [Coding Train #171](https://thecodingtrain.com/challenges/171-wave-function-collapse).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect, useState } from "react";

const SIZE = 16;
const TILE = 4;
const COLORS = ["#1a1a2e", "#e94560", "#0f3460", "#16c79a", "#f9b208"];

const RULES: Record<number, number[][]> = {
  0: [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]],
  1: [[0, 1], [0, 2], [1, 3], [2, 3]],
  2: [[0, 3], [1, 2], [0, 4], [1, 4]],
  3: [[0, 1, 4], [2, 3, 4], [0, 2, 4], [1, 3, 4]],
  4: [[1, 4], [2, 4], [3, 4], [0, 4]],
};

function generate() {
  const grid: number[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => -1)
  );
  const options: number[][][] = grid.map((row) =>
    row.map(() => [0, 1, 2, 3, 4])
  );

  const collapse = (): boolean => {
    let minEntropy = Infinity;
    let cell: [number, number] | null = null;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        if (grid[y][x] !== -1) continue;
        const n = options[y][x].length;
        if (n === 0) return false;
        if (n < minEntropy) { minEntropy = n; cell = [x, y]; }
      }
    }
    if (!cell) return true;
    const [cx, cy] = cell;
    const pick = options[cy][cx][(Math.random() * options[cy][cx].length) | 0];
    grid[cy][cx] = pick;
    const stack: [number, number][] = [[cx, cy]];
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    while (stack.length) {
      const [x, y] = stack.pop()!;
      const cur = grid[y][x];
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) continue;
        if (grid[ny][nx] !== -1) continue;
        const allowed = new Set<number>();
        for (const opt of options[ny][nx]) {
          for (const rule of RULES[opt] || [[opt]]) {
            if (rule.includes(cur)) allowed.add(opt);
          }
        }
        if (allowed.size === 0) return false;
        const next = [...allowed];
        if (next.length < options[ny][nx].length) {
          options[ny][nx] = next;
          stack.push([nx, ny]);
        }
      }
    }
    return collapse();
  };

  while (!collapse()) {
    for (let y = 0; y < SIZE; y++)
      for (let x = 0; x < SIZE; x++) {
        grid[y][x] = -1;
        options[y][x] = [0, 1, 2, 3, 4];
      }
  }
  return grid;
}

export default function WFCLite() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grid = generate();

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

    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cell = Math.min(w, h) / SIZE;
      const ox = (w - cell * SIZE) / 2;
      const oy = (h - cell * SIZE) / 2;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          ctx.fillStyle = COLORS[grid[y][x] % COLORS.length];
          ctx.fillRect(ox + x * cell, oy + y * cell, cell - 1, cell - 1);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [seed]);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans space-y-2">
        <div className="font-semibold text-emerald-300">WFC Tiled Lite #171</div>
        <button type="button" onClick={() => setSeed((s) => s + 1)} className="px-2 py-1 rounded bg-white/10 text-xs">
          Regenerate
        </button>
        <a href="https://thecodingtrain.com/challenges/171-wave-function-collapse" className="text-blue-400 hover:underline text-xs block">
          Inspired by Coding Train #171
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
