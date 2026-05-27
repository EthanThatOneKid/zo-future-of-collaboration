---
format: zopack
version: "1.0"
name: ct-c5-marching-squares
description: "Marching squares contour noise (Coding in the Cabana C5)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-c5-marching-squares

Marching squares on noise field. Inspired by [Coding Train C5](https://thecodingtrain.com/challenges/c5-marching-squares).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

function noise2(x: number, y: number) {
  return (Math.sin(x * 0.08) + Math.sin(y * 0.09) + Math.sin((x + y) * 0.05)) / 3;
}

export default function MarchingSquares() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);

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
      const res = 28;
      const cellW = w / res, cellH = h / res;
      const t = tRef.current;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(100,220,255,0.6)";
      ctx.lineWidth = 1.5;
      for (let y = 0; y < res; y++) {
        for (let x = 0; x < res; x++) {
          const v = noise2(x + t * 0.02, y + t * 0.015);
          if (v > 0) {
            ctx.strokeRect(x * cellW, y * cellH, cellW, cellH);
          }
        }
      }
      tRef.current += 1;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-cyan-300">Marching Squares C5</div>
        <a href="https://thecodingtrain.com/challenges/c5-marching-squares" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train C5</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
