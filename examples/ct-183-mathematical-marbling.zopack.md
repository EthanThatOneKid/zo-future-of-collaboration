---
format: zopack
version: "1.0"
name: ct-183-mathematical-marbling
description: "Mathematical paper marbling — ink drops and swirl (Coding Train #183)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-183-mathematical-marbling

Ink marbling with swirl transforms. Inspired by [Coding Train #183](https://thecodingtrain.com/challenges/183-mathematical-marbling).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

type Drop = { x: number; y: number; hue: number; r: number; phase: number };

export default function Marbling() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<Drop[]>([]);

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
      ctx.fillStyle = "#f5f0e8";
      ctx.fillRect(0, 0, rect.width, rect.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const addDrop = (x: number, y: number) => {
      dropsRef.current.push({
        x: x / canvas.clientWidth,
        y: y / canvas.clientHeight,
        hue: Math.random() * 360,
        r: 0.06 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
      });
    };

    canvas.addEventListener("click", (e) => addDrop(e.offsetX, e.offsetY));
    for (let i = 0; i < 6; i++) addDrop(Math.random() * 400 + 100, Math.random() * 300 + 100);

    let t = 0;
    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "rgba(245, 240, 232, 0.03)";
      ctx.fillRect(0, 0, w, h);

      for (const d of dropsRef.current) {
        const cx = d.x * w;
        const cy = d.y * h;
        const rad = d.r * Math.min(w, h);
        const swirl = Math.sin(t * 0.03 + d.phase) * 0.4;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(swirl + t * 0.01);
        ctx.scale(1 + Math.sin(t * 0.02 + d.phase) * 0.15, 1 - Math.sin(t * 0.02 + d.phase) * 0.1);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
        grad.addColorStop(0, `hsla(${d.hue}, 85%, 45%, 0.75)`);
        grad.addColorStop(0.5, `hsla(${d.hue + 30}, 70%, 50%, 0.4)`);
        grad.addColorStop(1, `hsla(${d.hue}, 60%, 55%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, rad, rad * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "multiply";
        ctx.restore();
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.globalCompositeOperation = "soft-light";
      ctx.strokeStyle = "rgba(80, 60, 40, 0.08)";
      for (let i = 0; i < 8; i++) {
        const y = ((t * 2 + i * 70) % h);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 20) {
          const wave = Math.sin(x * 0.02 + t * 0.05 + i) * 12;
          if (x === 0) ctx.moveTo(x, y + wave);
          else ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";

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
    <div className="relative w-full h-screen bg-[#f5f0e8]">
      <canvas ref={canvasRef} className="block w-full h-full cursor-pointer" />
      <div className="absolute top-3 left-3 text-stone-800 text-sm font-sans bg-white/70 rounded px-3 py-2">
        <div className="font-semibold">Mathematical Marbling #183</div>
        <p className="text-xs mt-1">Click to add ink drops</p>
        <a href="https://thecodingtrain.com/challenges/183-mathematical-marbling" className="text-blue-600 hover:underline text-xs">
          Inspired by Coding Train #183
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
