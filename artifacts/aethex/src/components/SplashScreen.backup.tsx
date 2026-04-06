import { useState, useEffect, useRef, useCallback } from "react";

const SPLASH_KEY = "aethex_splash_seen";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const completedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addTimer = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  };

  const triggerComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    sessionStorage.setItem(SPLASH_KEY, "1");
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    addTimer(() => setPhase(1), 200);
    addTimer(() => setPhase(2), 1200);
    addTimer(() => setPhase(3), 2500);
    addTimer(() => setPhase(4), 3800);
    addTimer(() => setPhase(5), 4600);
    addTimer(() => triggerComplete(), 5400);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [triggerComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const heartbeatPoints: { x: number; y: number }[] = [];
    const generateHeartbeat = () => {
      heartbeatPoints.length = 0;
      const w = W();
      const h = H();
      const cy = h * 0.5;
      const steps = 200;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = t * w;
        let y = cy;
        const seg = t * 10;
        if (seg > 3.5 && seg < 4.0) {
          y = cy - Math.sin((seg - 3.5) * Math.PI / 0.5) * 60;
        } else if (seg > 4.0 && seg < 4.3) {
          y = cy + Math.sin((seg - 4.0) * Math.PI / 0.3) * 100;
        } else if (seg > 4.3 && seg < 4.8) {
          y = cy - Math.sin((seg - 4.3) * Math.PI / 0.5) * 45;
        } else if (seg > 6.0 && seg < 6.5) {
          y = cy - Math.sin((seg - 6.0) * Math.PI / 0.5) * 50;
        } else if (seg > 6.5 && seg < 6.8) {
          y = cy + Math.sin((seg - 6.5) * Math.PI / 0.3) * 80;
        } else if (seg > 6.8 && seg < 7.3) {
          y = cy - Math.sin((seg - 6.8) * Math.PI / 0.5) * 35;
        }
        heartbeatPoints.push({ x, y });
      }
    };
    generateHeartbeat();

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; color: string; life: number; maxLife: number;
    }
    const particles: Particle[] = [];
    const spawnParticle = () => {
      const colors = ["rgba(0,122,255,", "rgba(90,200,250,", "rgba(0,200,150,", "rgba(255,255,255,"];
      particles.push({
        x: Math.random() * W(),
        y: H() + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 1.5 + 0.5),
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 300 + Math.random() * 200,
      });
    };

    const crossParticles: { x: number; y: number; alpha: number; rot: number; size: number; speed: number }[] = [];
    for (let i = 0; i < 6; i++) {
      crossParticles.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        alpha: Math.random() * 0.04 + 0.01,
        rot: Math.random() * Math.PI,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 0.3 + 0.1,
      });
    }

    let t = 0;
    let heartbeatProgress = 0;

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, W(), H());

      if (t % 4 === 0 && particles.length < 40) spawnParticle();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const fade = 1 - p.life / p.maxLife;
        if (fade <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (p.alpha * fade) + ")";
        ctx.fill();
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color + "0.3)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (const cp of crossParticles) {
        cp.y -= cp.speed;
        cp.rot += 0.003;
        if (cp.y < -30) { cp.y = H() + 30; cp.x = Math.random() * W(); }
        ctx.save();
        ctx.translate(cp.x, cp.y);
        ctx.rotate(cp.rot);
        ctx.strokeStyle = `rgba(0,122,255,${cp.alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-cp.size, 0); ctx.lineTo(cp.size, 0);
        ctx.moveTo(0, -cp.size); ctx.lineTo(0, cp.size);
        ctx.stroke();
        ctx.restore();
      }

      heartbeatProgress = Math.min(heartbeatProgress + 0.004, 1);
      const drawCount = Math.floor(heartbeatProgress * heartbeatPoints.length);
      if (drawCount > 1) {
        ctx.beginPath();
        ctx.moveTo(heartbeatPoints[0].x, heartbeatPoints[0].y);
        for (let i = 1; i < drawCount; i++) {
          ctx.lineTo(heartbeatPoints[i].x, heartbeatPoints[i].y);
        }
        const grad = ctx.createLinearGradient(0, 0, W(), 0);
        grad.addColorStop(0, "rgba(0,122,255,0)");
        grad.addColorStop(Math.max(0, heartbeatProgress - 0.15), "rgba(0,122,255,0.06)");
        grad.addColorStop(heartbeatProgress, "rgba(0,200,255,0.12)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (drawCount < heartbeatPoints.length) {
          const tip = heartbeatPoints[drawCount - 1];
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0,200,255,0.4)";
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(0,200,255,0.6)";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleSkip = () => {
    if (phase >= 5) return;
    setPhase(5);
    addTimer(triggerComplete, 600);
  };

  return (
    <div
      onClick={handleSkip}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "pointer",
        background: "#000",
        opacity: phase === 5 ? 0 : 1,
        transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Outfit:wght@300;400;500&display=swap');
        @keyframes sp-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sp-pulse-ring {
          0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.1; }
          100% { transform: translate(-50%,-50%) scale(2); opacity: 0; }
        }
        @keyframes sp-glow-breathe {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.1); }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div style={{
        position: "absolute",
        left: "50%", top: "50%",
        width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 60%)",
        filter: "blur(40px)",
        animation: "sp-glow-breathe 4s ease-in-out infinite",
        transform: "translate(-50%,-50%)",
        zIndex: 2,
        pointerEvents: "none",
      }} />

      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: 200, height: 200,
          borderRadius: "50%",
          border: "1px solid rgba(0,122,255,0.06)",
          animation: `sp-pulse-ring 4s ease-out ${i * 1.3}s infinite`,
          zIndex: 2,
          pointerEvents: "none",
        }} />
      ))}

      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "0 24px",
      }}>
        <div style={{
          overflow: "hidden",
          opacity: phase >= 1 ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
            fontWeight: 800,
            fontSize: "clamp(3.5rem, 13vw, 8.5rem)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "transparent",
            backgroundImage: phase >= 2
              ? "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 30%, #007AFF 50%, #5AC8FA 70%, #FFFFFF 100%)"
              : "#FFFFFF",
            backgroundSize: phase >= 2 ? "200% 100%" : "100% 100%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: phase >= 2 ? "sp-shimmer 4s linear infinite" : "none",
            transform: phase >= 1 ? "translateY(0)" : "translateY(100%)",
            transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), background-image 0.8s ease",
            margin: 0,
            padding: 0,
          }}>
            aethex
          </h1>
        </div>

        <div style={{
          width: phase >= 2 ? 50 : 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(0,122,255,0.4), transparent)",
          marginTop: 20,
          transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          borderRadius: 2,
        }} />

        <p style={{
          fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          fontWeight: 300,
          fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginTop: 18,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(15px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          Where Medicine Meets Intelligence
        </p>

        <div style={{
          marginTop: 50,
          width: 100,
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.6s ease",
        }}>
          <div style={{
            height: 1,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: phase >= 4 ? "100%" : "0%",
              background: "linear-gradient(90deg, #007AFF, #5AC8FA)",
              borderRadius: 4,
              boxShadow: "0 0 10px rgba(0,122,255,0.3)",
              transition: "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }} />
          </div>
        </div>
      </div>

      <p style={{
        position: "absolute",
        bottom: 24,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "'Outfit', -apple-system, system-ui, sans-serif",
        fontWeight: 400,
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.06)",
        zIndex: 10,
        opacity: phase >= 3 ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>
        Tap to skip
      </p>
    </div>
  );
}

export function useSplashScreen() {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(SPLASH_KEY);
  });
  const handleComplete = () => setShowSplash(false);
  return { showSplash, handleComplete };
}
