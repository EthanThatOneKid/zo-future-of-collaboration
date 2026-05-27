---
format: zopack
version: "1.0"
name: ct-182-apollonian-gasket
description: "Apollonian circle gasket (Coding Train #182)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-182-apollonian-gasket

Nested circle packing via Descartes theorem. Inspired by [Coding Train #182](https://thecodingtrain.com/challenges/182-apollonian-gasket).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

type Circle = { x: number; y: number; r: number; hue: number };

function descartes(k1: number, k2: number, k3: number, s = 1) {
  const sum = k1 + k2 + k3;
  const prod = Math.sqrt(k1 * k2 + k2 * k3 + k3 * k1);
  return sum + 2 * s * Math.sqrt(prod);
}

function pack(
  c1: Circle,
  c2: Circle,
  c3: Circle,
  depth: number,
  out: Circle[]
) {
  if (depth <= 0) return;
  const k1 = 1 / c1.r;
  const k2 = 1 / c2.r;
  const k3 = 1 / c3.r;
  const k4a = descartes(k1, k2, k3, 1);
  const k4b = descartes(k1, k2, k3, -1);
  for (const k4 of [k4a, k4b]) {
    if (!isFinite(k4) || k4 <= 0) continue;
    const r4 = 1 / k4;
    const b1 = 2 * (c1.x * k1 + c2.x * k2 + c3.x * k3);
    const b2 = 2 * (c1.y * k1 + c2.y * k2 + c3.y * k3);
    const c = 2 * (k1 + k2 + k3);
    const x = (b1 - 2 * c3.x * k4) / (2 * k4);
    const y = (b2 - 2 * c3.y * k4) / (2 * k4);
    if (r4 < 1 || r4 > 200) continue;
    const nc: Circle = { x, y, r: r4, hue: (depth * 40 + r4) % 360 };
    out.push(nc);
    pack(c1, c2, nc, depth - 1, out);
    pack(c1, nc, c3, depth - 1, out);
    pack(nc, c2, c3, depth - 1, out);
  }
}

export default function Apollonian() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const circles: Circle[] = [
      { x: 400, y: 300, r: 150, hue: 200 },
      { x: 250, y: 300, r: 40, hue: 280 },
      { x: 550, y: 300, r: 40, hue: 40 },
    ];
    pack(circles[0], circles[1], circles[2], 4, circles);

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
      const sx = w / 800;
      const sy = h / 600;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.scale(sx, sy);
      const sorted = [...circles].sort((a, b) => b.r - a.r);
      for (const c of sorted) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r + Math.sin(t * 0.02 + c.hue) * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${c.hue}, 70%, 55%, 0.7)`;
        ctx.lineWidth = Math.max(0.5, c.r * 0.08);
        ctx.stroke();
        ctx.fillStyle = `hsla(${c.hue}, 60%, 20%, 0.35)`;
        ctx.fill();
      }
      ctx.restore();
      t++;
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
        <div className="font-semibold text-violet-300">Apollonian Gasket #182</div>
        <a href="https://thecodingtrain.com/challenges/182-apollonian-gasket" className="text-blue-400 hover:underline text-xs">
          Inspired by Coding Train #182
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
