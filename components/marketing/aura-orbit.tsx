"use client";

import { useEffect, useRef } from "react";

type Particle = {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
};

export function AuraOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let width = 1;
    let height = 1;
    let dpr = 1;

    const particles: Particle[] = Array.from({ length: 32 }, (_, index) => ({
      angle: (index / 32) * Math.PI * 2,
      radius: 74 + ((index * 37) % 160),
      speed: 0.000035 + (index % 5) * 0.000008,
      size: 1 + (index % 4) * 0.45,
      alpha: 0.24 + (index % 5) * 0.1,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (time = 0) => {
      context.clearRect(0, 0, width, height);

      const cx = width * 0.54;
      const cy = height * 0.38;
      const minSide = Math.min(width, height);

      const glow = context.createRadialGradient(cx, cy, 12, cx, cy, minSide * 0.48);
      glow.addColorStop(0, "rgba(249,115,22,0.18)");
      glow.addColorStop(0.45, "rgba(249,115,22,0.05)");
      glow.addColorStop(1, "rgba(249,115,22,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      [0.18, 0.29, 0.41].forEach((scale, index) => {
        context.beginPath();
        context.arc(cx, cy, minSide * scale, 0, Math.PI * 2);
        context.strokeStyle = `rgba(251,146,60,${0.18 - index * 0.035})`;
        context.lineWidth = 1;
        context.stroke();
      });

      particles.forEach((particle, index) => {
        const motion = reducedMotion.matches ? 0 : time * particle.speed * (index % 2 === 0 ? 1 : -1);
        const angle = particle.angle + motion;
        const radius = Math.min(particle.radius, minSide * 0.43);
        const x = cx + Math.cos(angle) * radius * 1.15;
        const y = cy + Math.sin(angle) * radius * 0.72;

        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(251,146,60,${particle.alpha})`;
        context.fill();
      });

      context.beginPath();
      context.arc(cx, cy, 7, 0, Math.PI * 2);
      context.fillStyle = "#F97316";
      context.fill();

      context.beginPath();
      context.arc(cx, cy, 17, 0, Math.PI * 2);
      context.strokeStyle = "rgba(249,115,22,0.34)";
      context.lineWidth = 1;
      context.stroke();

      if (!reducedMotion.matches) {
        frame = window.requestAnimationFrame(render);
      }
    };

    resize();
    render();

    const observer = new ResizeObserver(() => {
      resize();
      render();
    });
    observer.observe(canvas);

    const onMotionChange = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      render();
    };
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />;
}
