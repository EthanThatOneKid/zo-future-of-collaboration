---
format: zopack
version: "1.0"
name: ct-162-self-avoiding-walk
description: "Self-avoiding random walk (Coding Train #162)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-162-self-avoiding-walk

Self-avoiding walk with trail. Inspired by [Coding Train #162](https://thecodingtrain.com/challenges/162-self-avoiding-walk).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

const SIZE = 41;
const CELL = 14;

export default function SelfAvoidingWalk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Uint8Array>(new Uint8Array(SIZE * SIZE));
  const pathRef = useRef<{ x: number; y: number }[]>([{ x: (SIZE / 2) | 0, y: (SIZE / 2) | 0 }]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const idx = (x: number, y: number) => y * SIZE + x;
    const reset = () => {
      gridRef.current.fill(0);
      pathRef.current = [{ x: (SIZE / 2) | 0, y: (SIZE / 2) | 0 }];
      gridRef.current[idx(pathRef.current[0].x, pathRef.current[0].y)] = 1;
    };
    reset();

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
    canvas.addEventListener("click", reset);

    let frame = 0;
    let raf = 0;
    const loop = () => {
      if (frame % 3 === 0) {
        const path = pathRef.current;
        const head = path[path.length - 1];
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]].sort(() => Math.random() - 0.5);
        let moved = false;
        for (const [dx, dy] of dirs) {
          const nx = head.x + dx, ny = head.y + dy;
          if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) continue;
          if (gridRef.current[idx(nx, ny)]) continue;
          gridRef.current[idx(nx, ny)] = 1;
          path.push({ x: nx, y: ny });
          moved = true;
          break;
        }
        if (!moved && path.length > 1) reset();
      }

      const w = canvas.clientWidth, h = canvas.clientHeight;
      const ox = (w - SIZE * CELL) / 2, oy = (h - SIZE * CELL) / 2;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      const path = pathRef.current;
      ctx.strokeStyle = "#4af";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < path.length; i++) {
        const px = ox + path[i].x * CELL + CELL / 2;
        const py = oy + path[i].y * CELL + CELL / 2;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      const head = path[path.length - 1];
      ctx.fillStyle = "#f4a";
      ctx.beginPath();
      ctx.arc(ox + head.x * CELL + CELL / 2, oy + head.y * CELL + CELL / 2, 5, 0, Math.PI * 2);
      ctx.fill();
      frame++;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full cursor-pointer" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-indigo-300">Self-Avoiding Walk #162</div>
        <p className="text-xs text-white/60">Click to reset</p>
        <a href="https://thecodingtrain.com/challenges/162-self-avoiding-walk" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train #162</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
