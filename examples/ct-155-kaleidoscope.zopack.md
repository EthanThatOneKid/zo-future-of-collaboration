---
format: zopack
version: "1.0"
name: ct-155-kaleidoscope
description: "Kaleidoscope symmetric painting (Coding Train #155)"
author: "etok.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-155-kaleidoscope

Kaleidoscope paint on drag. Inspired by [Coding Train #155](https://thecodingtrain.com/challenges/155-kaleidoscope-snowflake-supportp5).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect, useState } from "react";

export default function Kaleidoscope() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [folds, setFolds] = useState(8);
  const hueRef = useRef(0);

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
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, rect.width, rect.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let painting = false;
    let lastX = 0;
    let lastY = 0;

    const drawStroke = (x0: number, y0: number, x1: number, y1: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const angle = (Math.PI * 2) / folds;
      hueRef.current = (hueRef.current + 2) % 360;
      ctx.strokeStyle = `hsla(${hueRef.current}, 90%, 60%, 0.85)`;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      for (let i = 0; i < folds; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(i * angle);
        if (i % 2 === 1) ctx.scale(1, -1);
        ctx.beginPath();
        ctx.moveTo(x0 - cx, y0 - cy);
        ctx.lineTo(x1 - cx, y1 - cy);
        ctx.stroke();
        ctx.restore();
      }
    };

    const onDown = (e: MouseEvent) => {
      painting = true;
      lastX = e.offsetX;
      lastY = e.offsetY;
    };
    const onMove = (e: MouseEvent) => {
      if (!painting) return;
      drawStroke(lastX, lastY, e.offsetX, e.offsetY);
      lastX = e.offsetX;
      lastY = e.offsetY;
    };
    const onUp = () => { painting = false; };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, [folds]);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  };

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans space-y-2">
        <div className="font-semibold text-pink-300">Kaleidoscope #155</div>
        <label className="flex items-center gap-2">
          Folds
          <input type="range" min={4} max={16} value={folds} onChange={(e) => setFolds(+e.target.value)} />
          <span>{folds}</span>
        </label>
        <button type="button" onClick={clear} className="px-2 py-1 rounded bg-white/10 text-xs">Clear</button>
        <a href="https://thecodingtrain.com/challenges/155-kaleidoscope-snowflake-supportp5" className="text-blue-400 hover:underline text-xs block">
          Inspired by Coding Train #155
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
