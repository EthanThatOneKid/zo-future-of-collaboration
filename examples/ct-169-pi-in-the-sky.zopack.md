---
format: zopack
version: "1.0"
name: ct-169-pi-in-the-sky
description: "Catch falling pi digits (Coding Train #169)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-169-pi-in-the-sky

Pi in the sky mini-game. Inspired by [Coding Train #169](https://thecodingtrain.com/challenges/169-pi-in-the-sky-game).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

const PI = "31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679";

type Digit = { char: string; x: number; y: number; vy: number };

export default function PiInTheSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef({ x: 400 });
  const digitsRef = useRef<Digit[]>([]);
  const scoreRef = useRef(0);
  const idxRef = useRef(0);

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
      playerRef.current.x = rect.width / 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => { playerRef.current.x = e.offsetX; };
    canvas.addEventListener("mousemove", onMove);

    let frame = 0;
    let raf = 0;
    const loop = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (frame % 20 === 0) {
        digitsRef.current.push({
          char: PI[idxRef.current % PI.length],
          x: Math.random() * w,
          y: -20,
          vy: 2 + Math.random() * 2,
        });
        idxRef.current++;
      }

      const px = playerRef.current.x;
      for (const d of digitsRef.current) {
        d.y += d.vy;
        if (d.y > h - 40 && d.y < h && Math.abs(d.x - px) < 40) {
          scoreRef.current++;
          d.y = h + 100;
        }
      }
      digitsRef.current = digitsRef.current.filter((d) => d.y < h + 50);

      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#4af";
      ctx.font = "bold 24px monospace";
      for (const d of digitsRef.current) {
        ctx.fillText(d.char, d.x, d.y);
      }
      ctx.fillStyle = "#f4a";
      ctx.fillRect(px - 35, h - 30, 70, 12);
      ctx.fillStyle = "#fff";
      ctx.font = "18px sans-serif";
      ctx.fillText(`Score: ${scoreRef.current}`, 16, 28);
      frame++;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-yellow-300">π in the Sky #169</div>
        <p className="text-xs text-white/60">Move mouse to catch digits</p>
        <a href="https://thecodingtrain.com/challenges/169-pi-in-the-sky-game" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train #169</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
