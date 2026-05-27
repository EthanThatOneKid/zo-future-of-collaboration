---
format: zopack
version: "1.0"
name: ct-166-ascii-art-lite
description: "ASCII art from procedural gradient (Coding Train #166)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-166-ascii-art-lite

ASCII art lite. Inspired by [Coding Train #166](https://thecodingtrain.com/challenges/166-image-to-ascii).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

const CHARS = " .:-=+*#%@";

export default function AsciiArt() {
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
      const cols = 80, rows = 40;
      const cellW = w / cols, cellH = h / rows;
      const t = tRef.current;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${cellH * 0.9}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = x / cols, ny = y / rows;
          const v = (Math.sin(nx * 10 + t * 0.05) + Math.cos(ny * 8 - t * 0.04) + 2) / 4;
          const ci = Math.min(CHARS.length - 1, (v * CHARS.length) | 0);
          const ch = CHARS[ci];
          ctx.fillStyle = `hsl(${180 + v * 120}, 70%, ${30 + v * 50}%)`;
          ctx.fillText(ch, x * cellW + cellW / 2, y * cellH + cellH / 2);
        }
      }
      tRef.current++;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-green-300">ASCII Art Lite #166</div>
        <a href="https://thecodingtrain.com/challenges/166-image-to-ascii" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train #166</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
