---
format: zopack
version: "1.0"
name: ct-167-prime-spiral
description: "Ulam prime spiral with pan and zoom (Coding Train #167)"
author: "etok.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-167-prime-spiral

Ulam prime spiral. Inspired by [Coding Train #167](https://thecodingtrain.com/challenges/167-the-prime-ulam-spiral).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

function sieve(n: number) {
  const prime = new Uint8Array(n + 1);
  prime.fill(1);
  prime[0] = prime[1] = 0;
  for (let i = 2; i * i <= n; i++) {
    if (!prime[i]) continue;
    for (let j = i * i; j <= n; j += i) prime[j] = 0;
  }
  return prime;
}

export default function PrimeSpiral() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomRef = useRef(1);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const MAX = 50000;
    const isPrime = sieve(MAX);

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
      zoomRef.current = Math.max(0.3, Math.min(4, zoomRef.current - e.deltaY * 0.001));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const z = zoomRef.current;
      offsetRef.current = (offsetRef.current + 2) % MAX;

      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);

      const limit = Math.min(MAX, 12000);
      for (let n = 1; n < limit; n++) {
        const idx = n + offsetRef.current;
        if (idx >= MAX) break;
        const angle = idx * 0.17;
        const r = Math.sqrt(idx) * 2 * z;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (x < 0 || y < 0 || x > w || y > h) continue;
        if (isPrime[idx]) {
          ctx.fillStyle = `hsl(${(idx * 0.02) % 360}, 70%, 60%)`;
          ctx.fillRect(x, y, 2, 2);
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.04)";
          ctx.fillRect(x, y, 1, 1);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-yellow-300">Prime Spiral #167</div>
        <p className="text-xs text-white/60">Scroll to zoom</p>
        <a href="https://thecodingtrain.com/challenges/167-the-prime-ulam-spiral" className="text-blue-400 hover:underline text-xs">
          Inspired by Coding Train #167
        </a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
