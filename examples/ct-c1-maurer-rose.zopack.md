---
format: zopack
version: "1.0"
name: ct-c1-maurer-rose
description: "Maurer rose parametric curve (Coding in the Cabana C1)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-c1-maurer-rose

Maurer rose with n and d sliders. Inspired by [Coding Train C1](https://thecodingtrain.com/challenges/c1-maurer-rose).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect, useState } from "react";

export default function MaurerRose() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [n, setN] = useState(6);
  const [d, setD] = useState(71);

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

    let k = 0;
    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.38;

      ctx.fillStyle = "rgba(10, 10, 18, 0.12)";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = `hsl(${(k * 0.5 + n * 20) % 360}, 85%, 60%)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      const steps = 361;
      for (let i = 0; i <= steps; i++) {
        const theta = (i * d * Math.PI) / 180;
        const r = radius * Math.sin((n * i * Math.PI) / 180);
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      k++;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [n, d]);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans space-y-2">
        <div className="font-semibold text-rose-300">Maurer Rose C1</div>
        <label className="flex items-center gap-2">n <input type="range" min={1} max={12} value={n} onChange={(e) => setN(+e.target.value)} /><span>{n}</span></label>
        <label className="flex items-center gap-2">d <input type="range" min={1} max={180} value={d} onChange={(e) => setD(+e.target.value)} /><span>{d}</span></label>
        <a href="https://thecodingtrain.com/challenges/c1-maurer-rose" className="text-blue-400 hover:underline text-xs block">
          Inspired by Coding Train C1
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
