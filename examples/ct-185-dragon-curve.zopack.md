---
format: zopack
version: "1.0"
name: ct-185-dragon-curve
description: "Animated dragon curve fractal unfold (Coding Train #185)"
author: "etok.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-185-dragon-curve

Animated dragon curve (L-system). Inspired by [Coding Train #185](https://thecodingtrain.com/challenges/185-dragon-curve).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect, useState } from "react";

function buildDragon(n: number): string {
  let s = "FX";
  for (let i = 0; i < n; i++) {
    s = s.replace(/X/g, "X+YF+");
    s = s.replace(/Y/g, "-FX-Y");
  }
  return s.replace(/[XY]/g, "");
}

export default function DragonCurve() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iter, setIter] = useState(12);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const instructions = buildDragon(Math.min(iter, 14));
    const points: { x: number; y: number }[] = [];
    let x = 0;
    let y = 0;
    let angle = 0;
    const step = 4;
    points.push({ x, y });
    for (const c of instructions) {
      if (c === "F") {
        x += Math.cos(angle) * step;
        y += Math.sin(angle) * step;
        points.push({ x, y });
      } else if (c === "+") angle += Math.PI / 2;
      else if (c === "-") angle -= Math.PI / 2;
    }

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

    let hue = 0;
    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);

      const minX = Math.min(...points.map((p) => p.x));
      const maxX = Math.max(...points.map((p) => p.x));
      const minY = Math.min(...points.map((p) => p.y));
      const maxY = Math.max(...points.map((p) => p.y));
      const scale = (0.85 * Math.min(w, h)) / Math.max(maxX - minX, maxY - minY, 1);
      const cx = w / 2;
      const cy = h / 2;
      const mx = (minX + maxX) / 2;
      const my = (minY + maxY) / 2;

      const drawCount = Math.floor(points.length * progressRef.current);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 1; i < drawCount; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const x0 = cx + (p0.x - mx) * scale;
        const y0 = cy + (p0.y - my) * scale;
        const x1 = cx + (p1.x - mx) * scale;
        const y1 = cy + (p1.y - my) * scale;
        ctx.strokeStyle = `hsl(${(hue + i * 0.05) % 360}, 80%, 60%)`;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }
      ctx.stroke();

      hue += 0.3;
      progressRef.current = progressRef.current >= 1 ? 0 : progressRef.current + 0.002;
      raf = requestAnimationFrame(loop);
    };
    progressRef.current = 0;
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [iter]);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans space-y-2">
        <div className="font-semibold text-orange-300">Dragon Curve #185</div>
        <label className="flex items-center gap-2">
          Iterations
          <input type="range" min={8} max={14} value={iter} onChange={(e) => { setIter(+e.target.value); progressRef.current = 0; }} />
          <span>{iter}</span>
        </label>
        <a href="https://thecodingtrain.com/challenges/185-dragon-curve" className="text-blue-400 hover:underline text-xs block">
          Inspired by Coding Train #185
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
