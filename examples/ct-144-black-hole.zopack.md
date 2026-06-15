---
format: zopack
version: "1.0"
name: ct-144-black-hole
description: "Black hole gravitational lensing (Coding Train #144)"
author: "etok.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-144-black-hole

Gravitational lensing starfield. Inspired by [Coding Train #144](https://thecodingtrain.com/challenges/144-2d-black-hole-visualization).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

type Star = { x: number; y: number; z: number; hue: number };

export default function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars: Star[] = Array.from({ length: 800 }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random(),
      hue: Math.random() * 60 + 200,
    }));

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

    let t = 0;
    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const bhR = Math.min(w, h) * 0.12;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        let x = s.x * w * 0.5 + cx;
        let y = s.y * h * 0.5 + cy;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1;
        const bend = (bhR * bhR * 80) / (dist * dist);
        const angle = Math.atan2(dy, dx);
        x += Math.cos(angle) * bend;
        y += Math.sin(angle) * bend;
        const size = (1 - s.z) * 2.5;
        ctx.fillStyle = `hsla(${s.hue}, 80%, ${70 + s.z * 20}%, ${0.4 + (1 - s.z) * 0.6})`;
        ctx.fillRect(x, y, size, size);
      }

      const diskGrad = ctx.createRadialGradient(cx, cy, bhR * 0.5, cx, cy, bhR * 2.2);
      diskGrad.addColorStop(0, "rgba(255, 180, 80, 0.9)");
      diskGrad.addColorStop(0.4, "rgba(255, 100, 40, 0.5)");
      diskGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = diskGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, bhR * 2.5, bhR * 0.6, t * 0.01, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(cx, cy, bhR, 0, Math.PI * 2);
      ctx.fill();

      const ringGrad = ctx.createRadialGradient(cx, cy, bhR, cx, cy, bhR * 1.15);
      ringGrad.addColorStop(0, "rgba(255,255,255,0.8)");
      ringGrad.addColorStop(1, "rgba(255,200,100,0)");
      ctx.strokeStyle = ringGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, bhR * 1.05, 0, Math.PI * 2);
      ctx.stroke();

      t++;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-orange-300">Black Hole #144</div>
        <a href="https://thecodingtrain.com/challenges/144-2d-black-hole-visualization" className="text-blue-400 hover:underline text-xs">
          Inspired by Coding Train #144
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
