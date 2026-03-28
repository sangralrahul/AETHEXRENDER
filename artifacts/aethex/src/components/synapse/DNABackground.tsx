import { useEffect, useRef } from "react";

interface HelixConfig {
  yFrac: number;
  amplitude: number;
  period: number;
  speed: number;
  opacity: number;
  strandW: number;
  glowBlur: number;
  color1: string;
  color2: string;
  glow: string;
  phaseOffset: number;
  nodeR: number;
}

const HELICES: HelixConfig[] = [
  // Far background — faint, slow, small
  {
    yFrac: 0.18, amplitude: 28, period: 220, speed: 0.18, opacity: 0.18,
    strandW: 1.2, glowBlur: 6, color1: "#1A3A7A", color2: "#0D2457",
    glow: "#2979FF", phaseOffset: 0, nodeR: 1.4,
  },
  // Mid-background right area
  {
    yFrac: 0.82, amplitude: 35, period: 240, speed: 0.22, opacity: 0.2,
    strandW: 1.4, glowBlur: 7, color1: "#1A3A7A", color2: "#0D2457",
    glow: "#2979FF", phaseOffset: Math.PI * 0.7, nodeR: 1.6,
  },
  // Mid layer
  {
    yFrac: 0.42, amplitude: 55, period: 270, speed: 0.38, opacity: 0.45,
    strandW: 2.2, glowBlur: 14, color1: "#1565C0", color2: "#0D47A1",
    glow: "#29B6F6", phaseOffset: Math.PI * 0.3, nodeR: 2.5,
  },
  // Second mid layer (bottom half)
  {
    yFrac: 0.68, amplitude: 62, period: 290, speed: 0.32, opacity: 0.38,
    strandW: 2, glowBlur: 12, color1: "#0277BD", color2: "#01579B",
    glow: "#40C4FF", phaseOffset: Math.PI * 1.1, nodeR: 2.2,
  },
  // Foreground primary — main glowing helix
  {
    yFrac: 0.56, amplitude: 105, period: 340, speed: 0.65, opacity: 1,
    strandW: 3.8, glowBlur: 22, color1: "#00BCD4", color2: "#0097A7",
    glow: "#00E5FF", phaseOffset: Math.PI, nodeR: 4.5,
  },
];

// Pre-build a circuit board tile (drawn once, tiled as static backdrop)
function buildCircuitTile(w: number, h: number): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const cx = cv.getContext("2d")!;
  cx.strokeStyle = "rgba(30,90,200,0.1)";
  cx.lineWidth = 0.7;

  const rng = (min: number, max: number) => min + Math.random() * (max - min);

  // Horizontal traces with T-junctions
  for (let y = 20; y < h; y += rng(30, 55)) {
    let x = 0;
    while (x < w) {
      const len = rng(25, 80);
      cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x + len, y); cx.stroke();
      // Occasional vertical branch
      if (Math.random() > 0.55) {
        const bLen = rng(12, 35) * (Math.random() > 0.5 ? 1 : -1);
        cx.beginPath(); cx.moveTo(x + len, y); cx.lineTo(x + len, y + bLen); cx.stroke();
      }
      // Junction dot
      if (Math.random() > 0.4) {
        cx.beginPath();
        cx.arc(x + len, y, 1.8, 0, Math.PI * 2);
        cx.fillStyle = "rgba(41,182,246,0.18)";
        cx.fill();
      }
      x += len + rng(8, 22);
    }
  }
  return cv;
}

function drawHelix(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cfg: HelixConfig,
  t: number,
  forkX: number,
) {
  const { yFrac, amplitude, period, speed, opacity, strandW, glowBlur, color1, color2, glow, phaseOffset, nodeR } = cfg;
  const cy = yFrac * h;
  const step = 2;
  const rungEvery = period / 8;   // ~8 base pairs per period

  const pts1: [number, number][] = [];
  const pts2: [number, number][] = [];

  for (let x = -period * 0.5; x <= w + period * 0.5; x += step) {
    const phase = (x / period) * Math.PI * 2 - t * speed + phaseOffset;

    // Replication fork: near forkX the strands gradually diverge by extra separation
    const dist = Math.abs(x - forkX);
    const forkEffect = Math.max(0, 1 - dist / (period * 0.6)); // 0..1 near fork
    const extraSep = forkEffect * amplitude * 0.7;             // extra separation at fork

    const y1 = cy + Math.sin(phase) * amplitude + extraSep * 0.5;
    const y2 = cy + Math.sin(phase + Math.PI) * amplitude - extraSep * 0.5;
    pts1.push([x, y1]);
    pts2.push([x, y2]);
  }

  ctx.save();
  ctx.globalAlpha = opacity;

  // ── Base pairs (rungs) ──────────────────────────────────────────────────
  const n = pts1.length;
  for (let i = 0; i < n; i++) {
    const [x, y1] = pts1[i];
    const [, y2]  = pts2[i];
    const xMod = ((x + period * 0.5) % rungEvery);
    if (xMod > step * 1.5) continue;

    const phase = (x / period) * Math.PI * 2 - t * speed + phaseOffset;
    const sinAbs = Math.abs(Math.sin(phase));
    if (sinAbs < 0.08) continue; // skip at crossing points (overlap area)

    const rungAlpha = (0.3 + sinAbs * 0.7);

    ctx.save();
    ctx.globalAlpha = opacity * rungAlpha * 0.8;
    ctx.shadowColor = glow; ctx.shadowBlur = glowBlur * 0.5;
    ctx.strokeStyle = color2; ctx.lineWidth = strandW * 0.55;
    ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke();
    ctx.restore();

    // Glowing nucleotide nodes at both ends of each rung
    for (const [nx, ny] of [[x, y1], [x, y2]] as [number, number][]) {
      ctx.save();
      ctx.globalAlpha = opacity * rungAlpha;
      ctx.shadowColor = glow; ctx.shadowBlur = glowBlur * 1.2;
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(nx, ny, nodeR, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  // Helper: draw a strand path
  const drawStrand = (pts: [number, number][], col: string) => {
    ctx.save();
    ctx.shadowColor = glow; ctx.shadowBlur = glowBlur;
    ctx.strokeStyle = col; ctx.lineWidth = strandW;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    pts.forEach(([x, y], i) => { i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.stroke();
    // Second pass: brighter core
    ctx.shadowBlur = glowBlur * 0.4;
    ctx.globalAlpha = opacity * 0.4;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = strandW * 0.3;
    ctx.beginPath();
    pts.forEach(([x, y], i) => { i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.stroke();
    ctx.restore();
  };

  drawStrand(pts1, color1);
  drawStrand(pts2, color2);

  ctx.restore();
}

export default function DNABackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let circuitTile: HTMLCanvasElement | null = null;
    let tileW = 0, tileH = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      tileW = 0; // force rebuild
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) { raf = requestAnimationFrame(animate); return; }

      // Rebuild circuit tile if needed
      if (!circuitTile || tileW !== w || tileH !== h) {
        tileW = w; tileH = h;
        circuitTile = buildCircuitTile(w, h);
      }

      // ── Background gradient ──────────────────────────────────────────────
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.38, 0, w * 0.5, h * 0.5, w * 0.8);
      grad.addColorStop(0, "#071028");
      grad.addColorStop(0.5, "#040B1A");
      grad.addColorStop(1, "#020710");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle secondary glow in the top-center (like the reference image)
      const glowGrad = ctx.createRadialGradient(w * 0.5, h * 0.1, 0, w * 0.5, h * 0.3, w * 0.45);
      glowGrad.addColorStop(0, "rgba(20,50,180,0.18)");
      glowGrad.addColorStop(1, "rgba(20,50,180,0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      // ── Circuit board overlay ─────────────────────────────────────────────
      ctx.drawImage(circuitTile, 0, 0);

      // ── Replication fork position (sweeps across every ~12 s) ────────────
      const forkSpeed = 0.012;
      const forkX = ((t * forkSpeed) % 1.5 - 0.25) * w;  // -0.25w → 1.25w

      // ── Draw helices back→front ──────────────────────────────────────────
      HELICES.forEach((cfg) => drawHelix(ctx, w, h, cfg, t, forkX));

      // ── Moving replication fork indicator ────────────────────────────────
      if (forkX > 0 && forkX < w) {
        const forkGrad = ctx.createLinearGradient(forkX - 30, 0, forkX + 30, 0);
        forkGrad.addColorStop(0, "rgba(0,229,255,0)");
        forkGrad.addColorStop(0.5, "rgba(0,229,255,0.12)");
        forkGrad.addColorStop(1, "rgba(0,229,255,0)");
        ctx.fillStyle = forkGrad;
        ctx.fillRect(forkX - 30, 0, 60, h);
      }

      t += 0.012;
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
