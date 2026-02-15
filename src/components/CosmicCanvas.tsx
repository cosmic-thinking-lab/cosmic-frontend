import React, { useEffect, useRef } from "react";
import clsx from "clsx";

type CosmicCanvasProps = {
  className?: string;
  maxStars?: number;
};

type Star = {
  x: number;
  y: number;
  z: number; // depth 0..1 (0 near, 1 far)
  size: number;
  twinkle: number;
  twinkleSpeed: number;
  hue: number;
  vx: number;
  vy: number;
};

export default function CosmicCanvas({
  className,
  maxStars,
}: CosmicCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let running = true;
    let width = 0;
    let height = 0;
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const pointer = {
      // smoothed normalized pointer in [0..1]
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5,
    };

    const stars: Star[] = [];
    const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = Math.max(320, Math.floor(rect.width));
      // Keep a pleasing aspect, especially when placed in a column
      height = Math.max(260, Math.floor(rect.height));
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Re-seed stars based on area
      const density = 0.00012; // stars per px^2
      const targetCount = Math.max(
        120,
        Math.min(typeof maxStars === "number" ? maxStars : 260, Math.floor(width * height * density))
      );

      stars.length = 0;
      for (let i = 0; i < targetCount; i++) {
        stars.push({
          x: rnd(0, width),
          y: rnd(0, height),
          z: rnd(0.15, 1.0),
          size: rnd(0.7, 1.8),
          twinkle: rnd(0, Math.PI * 2),
          twinkleSpeed: rnd(0.005, 0.02),
          hue: rnd(210, 280), // bluish to purple hues
          vx: rnd(-0.03, 0.03),
          vy: rnd(-0.02, 0.02),
        });
      }
    };

    const onPointerMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
      let clientX: number;
      let clientY: number;
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();

      if (e instanceof TouchEvent) {
        const t = e.touches[0];
        if (!t) return;
        clientX = t.clientX;
        clientY = t.clientY;
      } else {
        const m = e as MouseEvent;
        clientX = m.clientX;
        clientY = m.clientY;
      }

      pointer.tx = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      pointer.ty = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    };

    const onLeave = () => {
      // gently center when pointer leaves
      pointer.tx = 0.5;
      pointer.ty = 0.5;
    };

    const drawBackground = () => {
      // Subtle vignette
      const g = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.1,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      g.addColorStop(0, "rgba(7, 7, 12, 1)");
      g.addColorStop(1, "rgba(5, 5, 10, 1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    };

    const drawNebula = (t: number, px: number, py: number) => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const cx1 = width * (0.35 + px * 0.02);
      const cy1 = height * (0.35 + py * 0.02);
      const r1 = Math.min(width, height) * (0.45 + 0.03 * Math.sin(t * 0.0008));

      const grad1 = ctx.createRadialGradient(cx1, cy1, r1 * 0.1, cx1, cy1, r1);
      grad1.addColorStop(0, "rgba(147, 51, 234, 0.15)");
      grad1.addColorStop(1, "rgba(147, 51, 234, 0.0)");
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(cx1, cy1, r1, 0, Math.PI * 2);
      ctx.fill();

      const cx2 = width * (0.65 + px * -0.02);
      const cy2 = height * (0.55 + py * -0.02);
      const r2 = Math.min(width, height) * (0.4 + 0.04 * Math.cos(t * 0.0007));
      const grad2 = ctx.createRadialGradient(cx2, cy2, r2 * 0.1, cx2, cy2, r2);
      grad2.addColorStop(0, "rgba(59, 130, 246, 0.13)");
      grad2.addColorStop(1, "rgba(59, 130, 246, 0.0)");
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(cx2, cy2, r2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawStars = (t: number, px: number, py: number) => {
      // Parallax strength per depth layer
      const baseParallax = 20;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Drift
        s.x += s.vx * (1 - s.z * 0.7);
        s.y += s.vy * (1 - s.z * 0.7);

        // Wrap
        if (s.x < -5) s.x = width + 5;
        if (s.x > width + 5) s.x = -5;
        if (s.y < -5) s.y = height + 5;
        if (s.y > height + 5) s.y = -5;

        const parallaxX = px * baseParallax * (1 - s.z);
        const parallaxY = py * baseParallax * (1 - s.z);

        const twinkle = (Math.sin(t * s.twinkleSpeed + s.twinkle) + 1) * 0.5; // 0..1
        const alpha = 0.25 + twinkle * 0.6 * (1 - s.z);

        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 80%, ${70 - s.z * 30}%, ${alpha})`;
        const r = s.size * (1.0 + twinkle * 0.5) * (1 - s.z * 0.3);
        ctx.arc(s.x + parallaxX, s.y + parallaxY, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawPlanet = (t: number, px: number, py: number) => {
      // Slight parallax opposite to stars to feel depth
      const planetParallax = 28;
      const cx = width * 0.72 + px * planetParallax;
      const cy = height * 0.5 + py * planetParallax;
      const radius = Math.min(width, height) * 0.22;

      // Body gradient
      const body = ctx.createRadialGradient(
        cx - radius * 0.35,
        cy - radius * 0.4,
        radius * 0.2,
        cx,
        cy,
        radius
      );
      body.addColorStop(0, "rgba(199, 210, 254, 0.9)");
      body.addColorStop(0.4, "rgba(147, 197, 253, 0.7)");
      body.addColorStop(1, "rgba(23, 23, 34, 0.95)");

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      // Subtle bands
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 2;
      const bandCount = 4;
      for (let i = 0; i < bandCount; i++) {
        const a = (i / bandCount) * Math.PI + (t * 0.0003 + i * 0.6);
        const y = cy + Math.sin(a) * radius * 0.5;
        ctx.beginPath();
        ctx.ellipse(cx, y, radius * 0.9, radius * 0.15, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.45);
      glow.addColorStop(0, "rgba(147, 51, 234, 0.18)");
      glow.addColorStop(1, "rgba(147, 51, 234, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.45, 0, Math.PI * 2);
      ctx.fill();

      // Ring (tilted)
      ctx.translate(cx, cy);
      ctx.rotate(-0.5 + Math.sin(t * 0.0002) * 0.02);
      const ringGrad = ctx.createLinearGradient(-radius * 1.6, 0, radius * 1.6, 0);
      ringGrad.addColorStop(0, "rgba(59,130,246,0)");
      ringGrad.addColorStop(0.5, "rgba(147,51,234,0.45)");
      ringGrad.addColorStop(1, "rgba(59,130,246,0)");
      ctx.strokeStyle = ringGrad;
      ctx.lineWidth = Math.max(1.5, radius * 0.08);
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.ellipse(0, radius * 0.15, radius * 1.6, radius * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    let last = performance.now();

    const frame = (now: number) => {
      if (!running) return;

      const dt = Math.min(33, now - last);
      last = now;

      // Smooth pointer movement
      pointer.x += (pointer.tx - pointer.x) * 0.07;
      pointer.y += (pointer.ty - pointer.y) * 0.07;

      // Map normalized [0..1] to [-1..1]
      const px = (pointer.x - 0.5) * 2;
      const py = (pointer.y - 0.5) * 2;

      // Draw
      drawBackground();
      drawNebula(now, px, py);
      drawStars(now, px, py);
      drawPlanet(now, px * 0.8, py * 0.8);

      rafRef.current = requestAnimationFrame(frame);
    };

    resize();
    // Events
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onPointerMove as EventListener, { passive: true });
    window.addEventListener("touchmove", onPointerMove as EventListener, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onPointerMove as EventListener);
      window.removeEventListener("touchmove", onPointerMove as EventListener);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [maxStars]);

  return (
    <canvas
      ref={canvasRef}
      className={clsx(
        "block w-full h-[340px] md:h-[520px] rounded-2xl border border-white/10 bg-[#0b0b12]/80 backdrop-blur-sm will-change-transform",
        className
      )}
      aria-label="Interactive cosmic visualization"
      role="img"
    />
  );
}
