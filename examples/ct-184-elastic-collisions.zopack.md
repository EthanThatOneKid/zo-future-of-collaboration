---
format: zopack
version: "1.0"
name: ct-184-elastic-collisions
description: "Elastic circle collisions (Coding Train #184)"
author: "etok.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-184-elastic-collisions

Elastic collisions. Inspired by [Coding Train #184](https://thecodingtrain.com/challenges/184-elastic-collisions).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

type Ball = { x: number; y: number; vx: number; vy: number; r: number; hue: number };

export default function ElasticCollisions() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const spawn = (n: number) => {
      ballsRef.current = Array.from({ length: n }, () => ({
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        r: 12 + Math.random() * 20,
        hue: Math.random() * 360,
      }));
    };
    spawn(18);

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

    canvas.addEventListener("click", (e) => {
      ballsRef.current.push({
        x: e.offsetX, y: e.offsetY,
        vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
        r: 16, hue: Math.random() * 360,
      });
    });

    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const balls = ballsRef.current;
      ctx.fillStyle = "rgba(10,10,18,0.25)";
      ctx.fillRect(0, 0, w, h);

      for (const b of balls) {
        b.x += b.vx; b.y += b.vy;
        if (b.x - b.r < 0) { b.x = b.r; b.vx *= -1; }
        if (b.x + b.r > w) { b.x = w - b.r; b.vx *= -1; }
        if (b.y - b.r < 0) { b.y = b.r; b.vy *= -1; }
        if (b.y + b.r > h) { b.y = h - b.r; b.vy *= -1; }
      }

      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i], b = balls[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.r + b.r;
          if (dist >= minDist || dist === 0) continue;
          const nx = dx / dist, ny = dy / dist;
          const overlap = minDist - dist;
          a.x -= nx * overlap * 0.5; a.y -= ny * overlap * 0.5;
          b.x += nx * overlap * 0.5; b.y += ny * overlap * 0.5;
          const dvx = b.vx - a.vx, dvy = b.vy - a.vy;
          const vn = dvx * nx + dvy * ny;
          if (vn > 0) continue;
          const impulse = -(1 + 1) * vn / 2;
          a.vx -= impulse * nx; a.vy -= impulse * ny;
          b.vx += impulse * nx; b.vy += impulse * ny;
        }
      }

      for (const b of balls) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${b.hue}, 75%, 55%, 0.85)`;
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full cursor-pointer" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-lime-300">Elastic Collisions #184</div>
        <p className="text-xs text-white/60">Click to add balls</p>
        <a href="https://thecodingtrain.com/challenges/184-elastic-collisions" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train #184</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
