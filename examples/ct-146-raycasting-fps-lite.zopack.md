---
format: zopack
version: "1.0"
name: ct-146-raycasting-fps-lite
description: "First-person raycasting lite (Coding Train #146)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-146-raycasting-fps-lite

First-person raycasting lite. Inspired by [Coding Train #146](https://thecodingtrain.com/challenges/146-rendering-ray-casting).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

const MAP = [
  "1111111111111111111",
  "1000000000000000001",
  "1000111000001110001",
  "1000100000000010001",
  "1000100000000010001",
  "1000000000000000001",
  "1000000000000000001",
  "1000000000000000001",
  "1111111111111111111",
];
const MAP_W = MAP[0].length, MAP_H = MAP.length;

export default function RaycastingFPS() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef({ x: 3.5, y: 3.5, angle: 0 });
  const keysRef = useRef<Record<string, boolean>>({});

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
    const onKey = (e: KeyboardEvent, d: boolean) => { keysRef.current[e.key.toLowerCase()] = d; };
    window.addEventListener("keydown", (e) => onKey(e, true));
    window.addEventListener("keyup", (e) => onKey(e, false));

    let raf = 0;
    const loop = () => {
      const p = playerRef.current;
      const k = keysRef.current;
      const spd = 0.06, rot = 0.05;
      if (k.a || k.arrowleft) p.angle -= rot;
      if (k.d || k.arrowright) p.angle += rot;
      const nx = p.x + Math.cos(p.angle) * spd * (k.w || k.arrowup ? 1 : 0) - Math.cos(p.angle) * spd * (k.s || k.arrowdown ? 1 : 0);
      const ny = p.y + Math.sin(p.angle) * spd * (k.w || k.arrowup ? 1 : 0) - Math.sin(p.angle) * spd * (k.s || k.arrowdown ? 1 : 0);
      if (MAP[ny | 0]?.[(nx | 0)] === "0") { p.x = nx; p.y = ny; }

      const w = canvas.clientWidth, h = canvas.clientHeight;
      const halfH = h / 2;
      const fov = Math.PI / 3;
      const rays = 120;
      for (let i = 0; i < rays; i++) {
        const rayAngle = p.angle - fov / 2 + (i / rays) * fov;
        const dx = Math.cos(rayAngle), dy = Math.sin(rayAngle);
        let dist = 0;
        while (dist < 20) {
          dist += 0.05;
          const mx = (p.x + dx * dist) | 0, my = (p.y + dy * dist) | 0;
          if (mx < 0 || my < 0 || mx >= MAP_W || my >= MAP_H || MAP[my][mx] === "1") break;
        }
        const wallH = (h / dist) * 0.8;
        const shade = Math.max(0, 255 - dist * 25);
        ctx.fillStyle = `rgb(${shade * 0.5},${shade * 0.3},${shade})`;
        const colW = w / rays;
        ctx.fillRect(i * colW, halfH - wallH / 2, colW + 1, wallH);
      }
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, w, halfH);
      ctx.fillStyle = "#333";
      ctx.fillRect(0, halfH, w, halfH);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-red-300">Raycasting FPS Lite #146</div>
        <p className="text-xs text-white/60">WASD + arrows to move/turn</p>
        <a href="https://thecodingtrain.com/challenges/146-rendering-ray-casting" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train #146</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
