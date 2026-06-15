---
format: zopack
version: "1.0"
name: ct-164-slitscan
description: "Slit-scan time displacement effect (Coding Train #164)"
author: "etok.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-164-slitscan

Slit-scan effect. Inspired by [Coding Train #164](https://thecodingtrain.com/challenges/164-slitscan-time-displacement-effect).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

export default function Slitscan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferRef = useRef<HTMLCanvasElement | null>(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const buf = document.createElement("canvas");
    bufferRef.current = buf;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      buf.width = rect.width;
      buf.height = rect.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const bctx = buf.getContext("2d")!;
      const t = tRef.current;

      bctx.fillStyle = "#0a0a12";
      bctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 12; i++) {
        const hue = (t * 2 + i * 30) % 360;
        bctx.fillStyle = `hsla(${hue}, 80%, 55%, 0.7)`;
        const x = w / 2 + Math.sin(t * 0.03 + i) * w * 0.35;
        const y = h / 2 + Math.cos(t * 0.04 + i * 0.7) * h * 0.35;
        bctx.beginPath();
        bctx.arc(x, y, 40 + i * 8, 0, Math.PI * 2);
        bctx.fill();
      }

      const slice = ((t * 3) % w) | 0;
      ctx.drawImage(buf, slice, 0, 4, h, 0, 0, w, h);
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
        <div className="font-semibold text-fuchsia-300">Slit-Scan #164</div>
        <a href="https://thecodingtrain.com/challenges/164-slitscan-time-displacement-effect" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train #164</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
