---
format: zopack
version: "1.0"
name: ct-178-climate-spiral
description: "Hawkins climate spiral — temperature anomalies (Coding Train #178)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-178-climate-spiral

Climate spiral visualization. Inspired by [Coding Train #178](https://thecodingtrain.com/challenges/178-climate-spiral).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

const ANOMALIES = [
  -0.35, -0.28, -0.22, -0.18, -0.12, -0.08, -0.05, 0, 0.02, 0.05, 0.08, 0.1,
  0.12, 0.15, 0.18, 0.22, 0.25, 0.28, 0.32, 0.35, 0.38, 0.42, 0.45, 0.48,
  0.52, 0.55, 0.58, 0.62, 0.65, 0.68, 0.72, 0.75, 0.78, 0.82, 0.85, 0.88,
  0.92, 0.95, 0.98, 1.02, 1.05, 1.08, 1.12, 1.15, 1.18, 1.22, 1.25, 1.28,
  1.32, 1.35, 1.38, 1.42, 1.45, 1.48, 1.52, 1.55, 1.58, 1.62, 1.65, 1.68,
  1.72, 1.75, 1.78, 1.82, 1.85, 1.88, 1.92, 1.95, 1.98, 2.02, 2.05, 2.08,
  2.12, 2.15, 2.18, 2.22, 2.25, 2.28, 2.32, 2.35, 2.38, 2.42, 2.45, 2.48,
  2.52, 2.55, 2.58, 2.62, 2.65, 2.68, 2.72, 2.75, 2.78, 2.82, 2.85, 2.88,
  2.92, 2.95, 2.98, 3.02, 3.05, 3.08, 3.12, 3.15, 3.18, 3.22, 3.25, 3.28,
  3.32, 3.35, 3.38, 3.42, 3.45, 3.48, 3.52, 3.55, 3.58, 3.62, 3.65, 3.68,
  3.72, 3.75, 3.78, 3.82, 3.85, 3.88, 3.92, 3.95, 3.98, 4.02, 4.05, 4.08,
  4.12, 4.15, 4.18, 4.22, 4.25, 4.28, 4.32, 4.35, 4.38, 4.42, 4.45, 4.48,
  4.52, 4.55, 4.58, 4.62, 4.65, 4.68, 4.72, 4.75, 4.78, 4.82, 4.85, 4.88,
];

export default function ClimateSpiral() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    let frame = 0;
    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.42;
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);

      const show = Math.min(ANOMALIES.length, Math.floor(frame / 2) + 24);
      ctx.lineWidth = 2.5;
      for (let i = 1; i < show; i++) {
        const a0 = (i / 12) * Math.PI * 2;
        const a1 = ((i + 1) / 12) * Math.PI * 2;
        const r0 = (i / ANOMALIES.length) * maxR;
        const r1 = ((i + 1) / ANOMALIES.length) * maxR;
        const v = ANOMALIES[i];
        const hue = 220 - v * 35;
        ctx.strokeStyle = `hsl(${hue}, 80%, ${45 + v * 8}%)`;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0);
        ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
        ctx.stroke();
      }

      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      ctx.fillText(`Months shown: ${show} · anomaly °C`, 16, 24);
      frame++;
      if (frame > ANOMALIES.length * 2 + 60) frame = 0;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 right-3 text-white text-sm font-sans text-right">
        <div className="font-semibold text-red-300">Climate Spiral #178</div>
        <a href="https://thecodingtrain.com/challenges/178-climate-spiral" className="text-blue-400 hover:underline text-xs">
          Inspired by Coding Train #178
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
