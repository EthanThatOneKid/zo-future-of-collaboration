---
format: zopack
version: "1.0"
name: ct-161-estimating-pi
description: "Estimate pi via coprime random pairs (Coding Train #161)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-161-estimating-pi

Pi estimation visualization. Inspired by [Coding Train #161](https://thecodingtrain.com/challenges/161-estimating-pi-from-random-numbers-with-euclids-algorithm).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

function gcd(a: number, b: number) {
  while (b) { const t = b; b = a % b; a = t; }
  return a;
}

export default function EstimatingPi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statsRef = useRef({ total: 0, coprime: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dots: { x: number; y: number; coprime: boolean }[] = [];

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
      const size = Math.min(w, h) * 0.75;
      const ox = (w - size) / 2, oy = (h - size) / 2;

      for (let i = 0; i < 8; i++) {
        const a = (Math.random() * 200 | 0) + 1;
        const b = (Math.random() * 200 | 0) + 1;
        const cp = gcd(a, b) === 1;
        statsRef.current.total++;
        if (cp) statsRef.current.coprime++;
        dots.push({ x: a / 200, y: b / 200, coprime: cp });
        if (dots.length > 2500) dots.shift();
      }

      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(ox, oy, size, size);
      for (const d of dots) {
        ctx.fillStyle = d.coprime ? "#4af" : "rgba(255,80,80,0.35)";
        ctx.fillRect(ox + d.x * size, oy + d.y * size, 3, 3);
      }
      const piEst = Math.sqrt(6 / (statsRef.current.coprime / statsRef.current.total || 1));
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(`π ≈ ${piEst.toFixed(4)} (${statsRef.current.coprime}/${statsRef.current.total} coprime)`, 16, 28);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 right-3 text-white text-sm font-sans text-right">
        <div className="font-semibold text-amber-300">Estimating π #161</div>
        <a href="https://thecodingtrain.com/challenges/161-estimating-pi-from-random-numbers-with-euclids-algorithm" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train #161</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
