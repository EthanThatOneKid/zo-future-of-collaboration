---
format: zopack
version: "1.0"
name: ct-c2-collatz
description: "Collatz conjecture visualization (Coding in the Cabana C2)"
author: "etok.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-c2-collatz

Collatz visualization. Inspired by [Coding Train C2](https://thecodingtrain.com/challenges/c2-collatz-conjecture).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect, useState } from "react";

function collatz(n: number): number[] {
  const seq = [n];
  while (n !== 1) {
    n = n % 2 === 0 ? n / 2 : 3 * n + 1;
    seq.push(n);
  }
  return seq;
}

export default function Collatz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [start, setStart] = useState(27);

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

    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      const seq = collatz(start);
      const maxVal = Math.max(...seq);
      const barW = w / seq.length;
      for (let i = 0; i < seq.length; i++) {
        const barH = (seq[i] / maxVal) * h * 0.85;
        ctx.fillStyle = `hsl(${(seq[i] * 3) % 360}, 70%, 55%)`;
        ctx.fillRect(i * barW, h - barH, barW - 1, barH);
      }
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(`n=${start} → ${seq.length} steps`, 16, 24);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [start]);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans space-y-2">
        <div className="font-semibold text-orange-300">Collatz C2</div>
        <label className="flex items-center gap-2">Start n <input type="range" min={3} max={99} value={start} onChange={(e) => setStart(+e.target.value)} /><span>{start}</span></label>
        <a href="https://thecodingtrain.com/challenges/c2-collatz-conjecture" className="text-blue-400 hover:underline text-xs block">Inspired by Coding Train C2</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
