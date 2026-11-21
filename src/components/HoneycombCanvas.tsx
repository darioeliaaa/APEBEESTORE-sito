"use client";

import { useEffect, useRef } from "react";

export function HoneycombCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const draw = () => {
      const r = c.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      const x = c.getContext("2d");
      if (!x) return;
      x.scale(dpr, dpr);
      x.strokeStyle = "rgba(14,14,12,.13)";
      x.lineWidth = 2;
      const s = 26;
      const w = Math.sqrt(3) * s;
      const h = 1.5 * s;
      // griglia centrata: un esagono sta esattamente al centro, dietro l'ape
      const mx = r.width / 2;
      const my = r.height / 2;
      const righe = Math.ceil(my / h) + 1;
      const colonne = Math.ceil(mx / w) + 1;
      for (let row = -righe; row <= righe; row++) {
        for (let col = -colonne; col <= colonne; col++) {
          const cx = mx + col * w + (Math.abs(row) % 2 ? w / 2 : 0);
          const cy = my + row * h;
          x.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i + Math.PI / 6;
            const px = cx + s * Math.cos(a);
            const py = cy + s * Math.sin(a);
            if (i) x.lineTo(px, py);
            else x.moveTo(px, py);
          }
          x.closePath();
          x.stroke();
        }
      }
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
