import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  baseR: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
  opacity: number;
}

const PALETTE = [
  "#00BCD4", "#00E5FF", "#22D3EE",   // cyan family
  "#7C3AED", "#A855F7",              // violet family
  "#3B82F6", "#60A5FA",              // blue family
  "#0EA5E9",                         // sky blue
];

function randPalette() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

function makeParticle(w: number, h: number): Particle {
  const speed = 0.15 + Math.random() * 0.35;
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    baseR: 1.2 + Math.random() * 2.2,
    r: 0,
    pulseSpeed: 0.6 + Math.random() * 1.4,
    pulsePhase: Math.random() * Math.PI * 2,
    color: randPalette(),
    opacity: 0.35 + Math.random() * 0.55,
  };
}

const MAX_DIST = 140;
const PARTICLE_COUNT = 130;

export default function DNABackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let particles: Particle[] = [];
    let W = 0, H = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      // Reinitialise particles on resize
      particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(W, H));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Slow moving "aurora" blobs ─────────────────────────────────────────
    const AURORA = [
      { cx: 0.15, cy: 0.25, rx: 0.38, ry: 0.32, col: "rgba(0,188,212,0.055)", phase: 0 },
      { cx: 0.80, cy: 0.65, rx: 0.40, ry: 0.35, col: "rgba(109,40,217,0.05)",  phase: 1.2 },
      { cx: 0.50, cy: 0.80, rx: 0.50, ry: 0.30, col: "rgba(59,130,246,0.04)",  phase: 2.4 },
      { cx: 0.70, cy: 0.20, rx: 0.35, ry: 0.28, col: "rgba(0,229,255,0.04)",   phase: 3.6 },
    ];

    const drawAuroras = () => {
      for (const a of AURORA) {
        const drift = Math.sin(t * 0.25 + a.phase) * 0.06;
        const driftY = Math.cos(t * 0.18 + a.phase) * 0.04;
        const cx = (a.cx + drift) * W;
        const cy = (a.cy + driftY) * H;
        const rx = a.rx * W;
        const ry = a.ry * H;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
        grad.addColorStop(0, a.col);
        grad.addColorStop(1, "transparent");
        ctx.save();
        ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx / (rx / Math.max(rx, ry)), cy / (ry / Math.max(rx, ry)), Math.max(rx, ry), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    // ── Scanline pulse (horizontal sweep every ~8s) ────────────────────────
    const drawScanline = () => {
      const cycle = 8;
      const progress = (t * 0.012) % cycle / cycle;  // 0→1
      const y = progress * H;
      const alpha = Math.sin(progress * Math.PI) * 0.03;
      if (alpha < 0.002) return;
      const g = ctx.createLinearGradient(0, y - 60, 0, y + 60);
      g.addColorStop(0, "transparent");
      g.addColorStop(0.5, `rgba(0,229,255,${alpha})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, y - 60, W, 120);
    };

    const animate = () => {
      if (W === 0 || H === 0) { raf = requestAnimationFrame(animate); return; }

      // ── Background ────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.6, W * 0.9);
      bg.addColorStop(0,   "#060E22");
      bg.addColorStop(0.5, "#040B1A");
      bg.addColorStop(1,   "#020710");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Aurora blobs ─────────────────────────────────────────────────────
      drawAuroras();

      // ── Scanline ─────────────────────────────────────────────────────────
      drawScanline();

      // ── Update + draw particles & connections ─────────────────────────────
      for (const p of particles) {
        // Move
        p.x += p.vx;
        p.y += p.vy;
        // Wrap
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        // Pulse radius
        p.r = p.baseR + Math.sin(t * p.pulseSpeed + p.pulsePhase) * (p.baseR * 0.4);
      }

      // Connections
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > MAX_DIST) continue;

          const alpha = (1 - dist / MAX_DIST) * 0.18;
          // Pick color blend between two particle colors
          ctx.beginPath();
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, a.color + Math.round(alpha * 255).toString(16).padStart(2, "0"));
          grad.addColorStop(1, b.color + Math.round(alpha * 255).toString(16).padStart(2, "0"));
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.6 + (1 - dist / MAX_DIST) * 0.6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Particles (draw on top of connections)
      for (const p of particles) {
        // Outer glow halo
        ctx.save();
        ctx.globalAlpha = p.opacity * 0.3;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.r * 10;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Core dot
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.r * 5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      t += 1;
      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: "block" }}
    />
  );
}
