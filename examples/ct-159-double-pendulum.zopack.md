---
format: zopack
version: "1.0"
name: ct-159-double-pendulum
description: "Chaotic double pendulum (Coding Train #159)"
author: "etok.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-159-double-pendulum

Double pendulum chaos. Inspired by [Coding Train #159](https://thecodingtrain.com/challenges/159-simple-pendulum-simulation).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

const G = 1;
const L1 = 120, L2 = 120, M1 = 10, M2 = 10;

export default function DoublePendulum() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ a1: Math.PI / 2, a2: Math.PI / 2, a1v: 0, a2v: 0 });
  const trailRef = useRef<{ x: number; y: number }[]>([]);

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
      const ox = w / 2, oy = h / 3;
      const s = stateRef.current;
      const num1 = -G * (2 * M1 + M2) * Math.sin(s.a1);
      const num2 = -M2 * G * Math.sin(s.a1 - 2 * s.a2);
      const num3 = -2 * Math.sin(s.a1 - s.a2) * M2 * (s.a2v * s.a2v * L2 + s.a1v * s.a1v * L1 * Math.cos(s.a1 - s.a2));
      const den = L1 * (2 * M1 + M2 - M2 * Math.cos(2 * s.a1 - 2 * s.a2));
      const a1a = (num1 + num2 + num3) / den;
      const num4 = 2 * Math.sin(s.a1 - s.a2);
      const num5 = s.a1v * s.a1v * L1 * (M1 + M2);
      const num6 = G * (M1 + M2) * Math.cos(s.a1);
      const num7 = s.a2v * s.a2v * L2 * M2 * Math.cos(s.a1 - s.a2);
      const den2 = L2 * (2 * M1 + M2 - M2 * Math.cos(2 * s.a1 - 2 * s.a2));
      const a2a = (num4 * (num5 + num6 + num7)) / den2;
      s.a1v += a1a * 0.16; s.a2v += a2a * 0.16;
      s.a1v *= 0.999; s.a2v *= 0.999;
      s.a1 += s.a1v; s.a2 += s.a2v;

      const x1 = ox + L1 * Math.sin(s.a1);
      const y1 = oy + L1 * Math.cos(s.a1);
      const x2 = x1 + L2 * Math.sin(s.a2);
      const y2 = y1 + L2 * Math.cos(s.a2);

      trailRef.current.push({ x: x2, y: y2 });
      if (trailRef.current.length > 400) trailRef.current.shift();

      ctx.fillStyle = "rgba(10,10,18,0.15)";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(100,200,255,0.4)";
      ctx.beginPath();
      for (const p of trailRef.current) ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox, oy); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.fillStyle = "#4af";
      ctx.beginPath(); ctx.arc(x1, y1, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f4a";
      ctx.beginPath(); ctx.arc(x2, y2, 10, 0, Math.PI * 2); ctx.fill();

      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-sky-300">Double Pendulum #159</div>
        <a href="https://thecodingtrain.com/challenges/159-simple-pendulum-simulation" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train #159</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
