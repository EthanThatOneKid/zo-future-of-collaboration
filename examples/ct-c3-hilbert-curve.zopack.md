---
format: zopack
version: "1.0"
name: ct-c3-hilbert-curve
description: "Animated Hilbert space-filling curve (Coding in the Cabana C3)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-c3-hilbert-curve

Hilbert curve animation. Inspired by [Coding Train C3](https://thecodingtrain.com/challenges/c3-hilbert-curve).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

function hilbert(order: number): [number, number][] {
  const pts: [number, number][] = [];
  const n = 1 << order;
  const total = n * n;
  for (let d = 0; d < total; d++) {
    let x = 0, y = 0, t = d;
    for (let s = 1; s < n; s *= 2) {
      const rx = 1 & (t / 2);
      const ry = 1 & (t ^ rx);
      if (ry === 0) {
        if (rx === 1) { x = s - 1 - x; y = s - 1 - y; }
        [x, y] = [y, x];
      }
      x += s * rx;
      y += s * ry;
      t = Math.floor(t / 4);
    }
    pts.push([x, y]);
  }
  return pts;
}

export default function HilbertCurve() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pts = hilbert(6);

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
      const size = Math.min(w, h) * 0.85;
      const ox = (w - size) / 2, oy = (h - size) / 2;
      const scale = size / (1 << 6);
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      const count = Math.floor(pts.length * progressRef.current);
      ctx.strokeStyle = "#4af";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const px = ox + pts[i][0] * scale + scale / 2;
        const py = oy + pts[i][1] * scale + scale / 2;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      progressRef.current = progressRef.current >= 1 ? 0 : progressRef.current + 0.003;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-blue-300">Hilbert Curve C3</div>
        <a href="https://thecodingtrain.com/challenges/c3-hilbert-curve" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train C3</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
