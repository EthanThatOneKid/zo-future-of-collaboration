---
format: zopack
version: "1.0"
name: ct-145-raycasting
description: "2D ray casting with wall shadows and FOV (Coding Train #145)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-145-raycasting

Top-down 2D ray casting. Inspired by [Coding Train #145](https://thecodingtrain.com/challenges/145-ray-casting-2d).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

type Seg = { x1: number; y1: number; x2: number; y2: number };

const WALLS: Seg[] = [
  { x1: 50, y1: 50, x2: 750, y2: 50 },
  { x1: 750, y1: 50, x2: 750, y2: 550 },
  { x1: 750, y1: 550, x2: 50, y2: 550 },
  { x1: 50, y1: 550, x2: 50, y2: 50 },
  { x1: 200, y1: 150, x2: 600, y2: 150 },
  { x1: 600, y1: 150, x2: 600, y2: 400 },
  { x1: 200, y1: 400, x2: 600, y2: 400 },
  { x1: 200, y1: 150, x2: 200, y2: 400 },
  { x1: 350, y1: 250, x2: 450, y2: 250 },
  { x1: 450, y1: 250, x2: 450, y2: 350 },
  { x1: 350, y1: 350, x2: 450, y2: 350 },
  { x1: 350, y1: 250, x2: 350, y2: 350 },
];

function castRay(ox: number, oy: number, angle: number, walls: Seg[]) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  let closest = 800;
  for (const w of walls) {
    const x1 = w.x1 - ox;
    const y1 = w.y1 - oy;
    const x2 = w.x2 - ox;
    const y2 = w.y2 - oy;
    const den = (x2 - x1) * dy - (y2 - y1) * dx;
    if (Math.abs(den) < 1e-8) continue;
    const t = (x1 * dy - y1 * dx) / den;
    const u = (x1 * (y2 - y1) - y1 * (x2 - x1)) / den;
    if (t > 0 && t < closest && u >= 0 && u <= 1) closest = t;
  }
  return { x: ox + dx * closest, y: oy + dy * closest, dist: closest };
}

export default function Raycasting() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef({ x: 400, y: 300, angle: 0 });
  const keysRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onKey = (e: KeyboardEvent, down: boolean) => {
      keysRef.current[e.key.toLowerCase()] = down;
    };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 800;
      const my = ((e.clientY - rect.top) / rect.height) * 600;
      playerRef.current.angle = Math.atan2(my - playerRef.current.y, mx - playerRef.current.x);
    };
    canvas.addEventListener("mousemove", onMove);

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
      const p = playerRef.current;
      const k = keysRef.current;
      const spd = 2.5;
      if (k.w || k.arrowup) { p.x += Math.cos(p.angle) * spd; p.y += Math.sin(p.angle) * spd; }
      if (k.s || k.arrowdown) { p.x -= Math.cos(p.angle) * spd; p.y -= Math.sin(p.angle) * spd; }
      if (k.a || k.arrowleft) p.angle -= 0.04;
      if (k.d || k.arrowright) p.angle += 0.04;
      p.x = Math.max(60, Math.min(740, p.x));
      p.y = Math.max(60, Math.min(540, p.y));

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const sx = w / 800;
      const sy = h / 600;
      ctx.save();
      ctx.scale(sx, sy);
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, 800, 600);

      const rays: { x: number; y: number }[] = [];
      const nRays = 120;
      for (let i = 0; i < nRays; i++) {
        const a = p.angle - Math.PI / 6 + (i / nRays) * (Math.PI / 3);
        const hit = castRay(p.x, p.y, a, WALLS);
        rays.push({ x: hit.x, y: hit.y });
      }

      ctx.fillStyle = "rgba(100, 200, 255, 0.15)";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      for (const r of rays) ctx.lineTo(r.x, r.y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#4af";
      ctx.lineWidth = 1;
      for (const w of WALLS) {
        ctx.beginPath();
        ctx.moveTo(w.x1, w.y1);
        ctx.lineTo(w.x2, w.y2);
        ctx.stroke();
      }

      ctx.fillStyle = "#ff6";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans bg-black/50 rounded px-3 py-2">
        <div className="font-semibold text-sky-300">Ray Casting #145</div>
        <p className="text-xs mt-1">WASD move · mouse aim</p>
        <a href="https://thecodingtrain.com/challenges/145-ray-casting-2d" className="text-blue-400 hover:underline text-xs">
          Inspired by Coding Train #145
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
