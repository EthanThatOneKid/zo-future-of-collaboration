---
format: zopack
version: "1.0"
name: ct-179-wolfram-ca
description: "Elementary cellular automaton — Wolfram rules (Coding Train #179)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-179-wolfram-ca

Elementary 1D cellular automaton with rule slider. Inspired by [Coding Train #179](https://thecodingtrain.com/challenges/179-wolfram-elementary-cellular-automaton).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect, useState } from "react";

const COLS = 201;
const ROWS = 120;

function ruleIndex(left: number, self: number, right: number) {
  return (left << 2) | (self << 1) | right;
}

export default function WolframCA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rule, setRule] = useState(30);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let row = 0;
    const grid = new Uint8Array(COLS * ROWS);
    grid[Math.floor(COLS / 2)] = 1;

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
      if (playing && row < ROWS - 1) {
        const y = row;
        const nextY = row + 1;
        for (let x = 0; x < COLS; x++) {
          const left = grid[y * COLS + ((x - 1 + COLS) % COLS)];
          const self = grid[y * COLS + x];
          const right = grid[y * COLS + ((x + 1) % COLS)];
          const ri = ruleIndex(left, self, right);
          grid[nextY * COLS + x] = (rule >> ri) & 1;
        }
        row++;
      }

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const cellW = cw / COLS;
      const cellH = ch / ROWS;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, cw, ch);
      for (let y = 0; y <= row && y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (grid[y * COLS + x]) {
            ctx.fillStyle = `hsl(${200 + rule * 0.4}, 70%, ${45 + (y / ROWS) * 25}%)`;
            ctx.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [rule, playing]);

  const reset = () => {
    setPlaying(false);
    setTimeout(() => setPlaying(true), 50);
  };

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans space-y-2 max-w-xs">
        <div className="font-semibold text-cyan-300">Wolfram CA #179</div>
        <label className="flex items-center gap-2">
          Rule
          <input type="range" min={0} max={255} value={rule} onChange={(e) => setRule(+e.target.value)} className="flex-1" />
          <span className="tabular-nums w-8">{rule}</span>
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPlaying((p) => !p)} className="px-2 py-1 rounded bg-white/10 text-xs">
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={reset} className="px-2 py-1 rounded bg-white/10 text-xs">Reset</button>
        </div>
        <a href="https://thecodingtrain.com/challenges/179-wolfram-elementary-cellular-automaton" className="text-blue-400 hover:underline text-xs block">
          Inspired by Coding Train #179
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
