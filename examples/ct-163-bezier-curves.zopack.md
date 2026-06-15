---
format: zopack
version: "1.0"
name: ct-163-bezier-curves
description: "Interactive cubic Bezier curves (Coding Train #163)"
author: "etok.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-163-bezier-curves

Interactive Bezier curves. Inspired by [Coding Train #163](https://thecodingtrain.com/challenges/163-bezier-curves).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

type Pt = { x: number; y: number };

export default function BezierCurves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ptsRef = useRef<Pt[]>([
    { x: 100, y: 300 }, { x: 250, y: 100 }, { x: 450, y: 400 }, { x: 600, y: 200 },
  ]);
  const dragRef = useRef(-1);

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

    const hit = (mx: number, my: number) => {
      const pts = ptsRef.current;
      for (let i = 0; i < pts.length; i++) {
        if (Math.hypot(pts[i].x - mx, pts[i].y - my) < 12) return i;
      }
      return -1;
    };

    const onDown = (e: MouseEvent) => { dragRef.current = hit(e.offsetX, e.offsetY); };
    const onMove = (e: MouseEvent) => {
      if (dragRef.current >= 0) {
        ptsRef.current[dragRef.current] = { x: e.offsetX, y: e.offsetY };
      }
    };
    const onUp = () => { dragRef.current = -1; };
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const [p0, p1, p2, p3] = ptsRef.current;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#333";
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "#4af";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let t = 0; t <= 1; t += 0.02) {
        const x = (1 - t) ** 3 * p0.x + 3 * (1 - t) ** 2 * t * p1.x + 3 * (1 - t) * t ** 2 * p2.x + t ** 3 * p3.x;
        const y = (1 - t) ** 3 * p0.y + 3 * (1 - t) ** 2 * t * p1.y + 3 * (1 - t) * t ** 2 * p2.y + t ** 3 * p3.y;
        if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      for (const p of ptsRef.current) {
        ctx.fillStyle = "#f4a";
        ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full cursor-grab" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-pink-300">Bézier Curves #163</div>
        <p className="text-xs text-white/60">Drag control points</p>
        <a href="https://thecodingtrain.com/challenges/163-bezier-curves" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train #163</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
