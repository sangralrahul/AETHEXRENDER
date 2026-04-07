import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "wouter";
import { Home, ChevronLeft } from "lucide-react";

interface PageHeroProps {
  tag?: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  right?: ReactNode;
}

export function PageHero({ tag, title, subtitle, icon, right }: PageHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;

    const particles: Array<{ x: number; y: number; r: number; vx: number; vy: number; a: number }> = [];

    function resize() {
      w = canvas!.offsetWidth;
      h = canvas!.offsetHeight;
      canvas!.width = w;
      canvas!.height = h;
      particles.length = 0;
      const count = Math.floor(w / 28);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.2 + 0.3,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.12,
          a: Math.random() * 0.4 + 0.1,
        });
      }
    }

    let t = 0;
    function draw() {
      if (!ctx || !canvas) return;
      t += 0.006;
      ctx.clearRect(0, 0, w, h);

      /* soft moving orbs — deep blue/indigo, no teal */
      const orbs = [
        { cx: w * 0.15 + Math.sin(t * 0.7) * 30, cy: h * 0.3 + Math.cos(t * 0.5) * 20, rx: w * 0.22, ry: h * 0.9, c1: "rgba(0,40,170,0.30)", c2: "rgba(0,40,170,0)" },
        { cx: w * 0.75 + Math.cos(t * 0.6) * 25, cy: h * 0.6 + Math.sin(t * 0.8) * 18, rx: w * 0.28, ry: h * 1.1, c1: "rgba(0,80,200,0.22)", c2: "rgba(0,80,200,0)" },
        { cx: w * 0.5 + Math.sin(t * 0.4) * 20, cy: h * (-0.1) + Math.cos(t * 0.35) * 15, rx: w * 0.18, ry: h * 0.8, c1: "rgba(18,18,106,0.25)", c2: "rgba(18,18,106,0)" },
      ];

      for (const o of orbs) {
        const grad = ctx.createRadialGradient(o.cx, o.cy, 0, o.cx, o.cy, Math.max(o.rx, o.ry));
        grad.addColorStop(0, o.c1);
        grad.addColorStop(1, o.c2);
        ctx.save();
        ctx.scale(o.rx / Math.max(o.rx, o.ry), o.ry / Math.max(o.rx, o.ry));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.cx / (o.rx / Math.max(o.rx, o.ry)), o.cy / (o.ry / Math.max(o.rx, o.ry)), Math.max(o.rx, o.ry), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      /* particles */
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,200,255,${p.a * (0.5 + 0.5 * Math.sin(t * 2 + p.x))})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: "#06060C", minHeight: 180 }}
    >
      {/* animated canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 1 }}
      />

      {/* very subtle horizontal rule at bottom */}
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

      {/* minimal top bar — AETHEX home link */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          style={{ textDecoration: "none" }}
        >
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all group-hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ChevronLeft className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />
          </div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: "1.05rem",
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.55)",
              transition: "color 0.2s",
            }}
            className="group-hover:text-white/80"
          >
            AETHEX
          </span>
        </Link>
        <Home className="w-3 h-3" style={{ color: "rgba(255,255,255,0.18)" }} />
      </div>

      {/* content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex items-center gap-5 flex-1 min-w-0">
          {icon && (
            <div
              className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-xl"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0">
            {tag && (
              <p
                className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em]"
                style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {tag}
              </p>
            )}
            <h1
              className="leading-tight tracking-tight"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                color: "rgba(255,255,255,0.92)",
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="mt-1.5 text-sm"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {right && (
          <div className="w-full sm:w-auto shrink-0">
            {right}
          </div>
        )}
      </div>
    </div>
  );
}
