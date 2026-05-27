---
format: zopack
version: "1.0"
name: ct-168-julia-set
description: "Julia set pan and zoom — 2D fractal (Coding Train #168)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-168-julia-set

Interactive Julia set. Inspired by [Coding Train #168](https://thecodingtrain.com/challenges/168-the-mandelbulb).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

export default function JuliaSet() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef({ cx: 0, cy: 0, scale: 3 });
  const cRef = useRef({ re: -0.7, im: 0.27015 });

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

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      viewRef.current.scale *= e.deltaY > 0 ? 1.1 : 0.9;
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    let dragging = false;
    let lx = 0;
    let ly = 0;
    const onDown = (e: MouseEvent) => { dragging = true; lx = e.clientX; ly = e.clientY; };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      viewRef.current.cx -= (e.clientX - lx) * 0.001 * viewRef.current.scale;
      viewRef.current.cy -= (e.clientY - ly) * 0.001 * viewRef.current.scale;
      lx = e.clientX;
      ly = e.clientY;
    };
    const onUp = () => { dragging = false; };
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    let t = 0;
    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const img = ctx.createImageData(w, h);
      const d = img.data;
      const { cx, cy, scale } = viewRef.current;
      cRef.current.re = -0.7 + Math.sin(t * 0.005) * 0.15;
      cRef.current.im = 0.27015 + Math.cos(t * 0.007) * 0.1;
      const maxIter = 64;
      const aspect = w / h;
      const step = 2;

      for (let py = 0; py < h; py += step) {
        for (let px = 0; px < w; px += step) {
          const x0 = cx + ((px / w) * 2 - 1) * scale * aspect;
          const y0 = cy + ((py / h) * 2 - 1) * scale;
          let x = x0;
          let y = y0;
          let iter = 0;
          while (x * x + y * y < 4 && iter < maxIter) {
            const xt = x * x - y * y + cRef.current.re;
            y = 2 * x * y + cRef.current.im;
            x = xt;
            iter++;
          }
          const tNorm = iter / maxIter;
          const r = (tNorm * 180) | 0;
          const g = (tNorm * 80 + 40) | 0;
          const b = (255 - tNorm * 200) | 0;
          for (let dy = 0; dy < step && py + dy < h; dy++) {
            for (let dx = 0; dx < step && px + dx < w; dx++) {
              const p = ((py + dy) * w + (px + dx)) * 4;
              d[p] = r;
              d[p + 1] = g;
              d[p + 2] = b;
              d[p + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(img, 0, 0);
      t++;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full cursor-grab" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-purple-300">Julia Set #168</div>
        <p className="text-xs text-white/60">Drag pan · scroll zoom</p>
        <a href="https://thecodingtrain.com/challenges/168-the-mandelbulb" className="text-blue-400 hover:underline text-xs">
          Inspired by Coding Train #168
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
