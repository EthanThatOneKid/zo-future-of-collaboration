---
format: zopack
version: "1.0"
name: ct-160-spring-mesh
description: "Spring force mesh (Coding Train #160)"
author: "{{HANDLE}}.zo.computer"
routes: 1
exported: 2026-05-27
---

# ct-160-spring-mesh

Spring mesh. Inspired by [Coding Train #160](https://thecodingtrain.com/challenges/160-spring-forces).

## Routes

### `/` (page, public)

```tsx
import React, { useRef, useEffect } from "react";

type Node = { x: number; y: number; vx: number; vy: number; pinned?: boolean };

export default function SpringMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, down: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = 14, rows = 10, spacing = 42;
    const init = () => {
      const nodes: Node[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          nodes.push({
            x: 80 + x * spacing, y: 80 + y * spacing,
            vx: 0, vy: 0, pinned: y === 0,
          });
        }
      }
      nodesRef.current = nodes;
    };
    init();

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

    const onMove = (e: MouseEvent) => { mouseRef.current.x = e.offsetX; mouseRef.current.y = e.offsetY; };
    const onDown = () => { mouseRef.current.down = true; };
    const onUp = () => { mouseRef.current.down = false; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    let raf = 0;
    const loop = () => {
      const nodes = nodesRef.current;
      const k = 0.08, damp = 0.92;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const n = nodes[i];
          if (n.pinned) continue;
          const neighbors = [
            x > 0 ? nodes[i - 1] : null,
            x < cols - 1 ? nodes[i + 1] : null,
            y > 0 ? nodes[i - cols] : null,
            y < rows - 1 ? nodes[i + cols] : null,
          ];
          for (const nb of neighbors) {
            if (!nb) continue;
            const dx = nb.x - n.x, dy = nb.y - n.y;
            const dist = Math.hypot(dx, dy) || 1;
            const force = (dist - spacing) * k;
            n.vx += (dx / dist) * force;
            n.vy += (dy / dist) * force;
          }
          if (mouseRef.current.down) {
            const dx = mouseRef.current.x - n.x, dy = mouseRef.current.y - n.y;
            const d = Math.hypot(dx, dy);
            if (d < 80) { n.vx += dx * 0.02; n.vy += dy * 0.02; }
          }
          n.vy += 0.15;
          n.vx *= damp; n.vy *= damp;
          n.x += n.vx; n.y += n.vy;
        }
      }

      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.fillStyle = "rgba(10,10,18,0.2)";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(100,220,255,0.5)";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const n = nodes[i];
          if (x < cols - 1) { const r = nodes[i + 1]; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(r.x, r.y); ctx.stroke(); }
          if (y < rows - 1) { const b = nodes[i + cols]; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = n.pinned ? "#f84" : "#4af";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.pinned ? 5 : 3, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a12]">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
      <div className="absolute top-3 left-3 text-white text-sm font-sans">
        <div className="font-semibold text-cyan-300">Spring Mesh #160</div>
        <p className="text-xs text-white/60">Drag to disturb</p>
        <a href="https://thecodingtrain.com/challenges/160-spring-forces" className="text-blue-400 hover:underline text-xs">Inspired by Coding Train #160</a>
      </div>
    </div>
  );
}
```

## Dependencies

**npm packages** (not in default zo.space):
- `react`
