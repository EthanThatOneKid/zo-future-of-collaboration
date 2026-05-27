---
format: zopack
version: "1.0"
name: ct-176-buffons-needle
description: "Buffon's needle pi estimation (Coding Train #176)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-176-buffons-needle

Buffon's needle. Inspired by [Coding Train #176](https://thecodingtrain.com/challenges/176-buffons-needle).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

type Needle = { x1: number; y1: number; x2: number; y2: number; hit: boolean };

export default function BuffonsNeedle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const needlesRef = useRef<Needle[]>([]);
  const statsRef = useRef({ total: 0, hits: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const lineSpacing = 50;

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
      for (let i = 0; i < 3; i++) {
        const len = 40;
        const x = Math.random() * w;
        const y = Math.random() * h;
        const angle = Math.random() * Math.PI;
        const x2 = x + Math.cos(angle) * len;
        const y2 = y + Math.sin(angle) * len;
        const lineY = Math.floor(y / lineSpacing) * lineSpacing;
        const hit = (y <= lineY && y2 >= lineY) || (y2 <= lineY && y >= lineY);
        if (hit) statsRef.current.hits++;
        statsRef.current.total++;
        needlesRef.current.push({ x1: x, y1: y, x2, y2, hit });
        if (needlesRef.current.length > 400) needlesRef.current.shift();
      }

      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#444";
      for (let y = 0; y < h; y += lineSpacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      for (const n of needlesRef.current) {
        ctx.strokeStyle = n.hit ? "#4af" : "rgba(255,100,100,0.5)";
        ctx.beginPath(); ctx.moveTo(n.x1, n.y1); ctx.lineTo(n.x2, n.y2); ctx.stroke();
      }
      const pi = (2 * statsRef.current.total) / (statsRef.current.hits || 1);
      ctx.fillStyle = "#fff";
      ctx.font = "16px sans-serif";
      ctx.fillText(`π ≈ ${pi.toFixed(4)} (${statsRef.current.hits}/${statsRef.current.total})`, 16, 28);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-amber-300">Buffon's Needle #176</div>
        <a href="https://thecodingtrain.com/challenges/176-buffons-needle" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train #176</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
