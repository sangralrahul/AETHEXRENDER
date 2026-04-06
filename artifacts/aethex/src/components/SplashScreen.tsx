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
    addTimer(() => setPhase(1), 300);
    addTimer(() => setPhase(2), 1500);
    addTimer(() => setPhase(3), 2800);
    addTimer(() => setPhase(4), 4000);
    addTimer(() => setPhase(5), 4800);
    addTimer(() => triggerComplete(), 5600);

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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; hue: number; life: number; maxLife: number;
    }
    const particles: Particle[] = [];

    const dnaStrands: { offset: number; speed: number; x: number }[] = [
      { offset: 0, speed: 0.015, x: 0.15 },
      { offset: Math.PI, speed: 0.012, x: 0.85 },
    ];

    const heartbeatData: number[] = [];
    const generateHeartbeat = () => {
      heartbeatData.length = 0;
      for (let i = 0; i < 300; i++) {
        const t = i / 300;
        let v = 0;
        const s = t * 12;
        if (s > 2.0 && s < 2.3) v = Math.sin((s - 2.0) * Math.PI / 0.3) * 0.3;
        else if (s > 3.5 && s < 3.8) v = -Math.sin((s - 3.5) * Math.PI / 0.3) * 0.15;
        else if (s > 3.8 && s < 4.2) v = Math.sin((s - 3.8) * Math.PI / 0.4) * 1.0;
        else if (s > 4.2 && s < 4.5) v = -Math.sin((s - 4.2) * Math.PI / 0.3) * 0.6;
        else if (s > 4.5 && s < 4.8) v = Math.sin((s - 4.5) * Math.PI / 0.3) * 0.25;
        else if (s > 7.0 && s < 7.3) v = Math.sin((s - 7.0) * Math.PI / 0.3) * 0.25;
        else if (s > 8.5 && s < 8.8) v = -Math.sin((s - 8.5) * Math.PI / 0.3) * 0.12;
        else if (s > 8.8 && s < 9.2) v = Math.sin((s - 8.8) * Math.PI / 0.4) * 0.85;
        else if (s > 9.2 && s < 9.5) v = -Math.sin((s - 9.2) * Math.PI / 0.3) * 0.5;
        else if (s > 9.5 && s < 9.8) v = Math.sin((s - 9.5) * Math.PI / 0.3) * 0.2;
        heartbeatData.push(v);
      }
    };
    generateHeartbeat();

    let frame = 0;
    let ecgProgress = 0;
    let dnaTime = 0;

    const draw = () => {
      frame++;
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      if (frame % 3 === 0 && particles.length < 50) {
        particles.push({
          x: Math.random() * w,
          y: h + 5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(Math.random() * 0.8 + 0.3),
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.5 + 0.15,
          hue: Math.random() > 0.6 ? 200 : (Math.random() > 0.5 ? 170 : 210),
          life: 0,
          maxLife: 400 + Math.random() * 300,
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx + Math.sin(frame * 0.01 + p.y * 0.01) * 0.15;
        p.y += p.vy;
        p.life++;
        const fade = Math.min(1, Math.min(p.life / 60, 1 - p.life / p.maxLife));
        if (fade <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.alpha * fade})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 65%, ${p.alpha * fade * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      dnaTime += 0.02;
      for (const strand of dnaStrands) {
        const cx = w * strand.x;
        const amplitude = 25;
        const segCount = 30;
        const segHeight = h / segCount;

        for (let i = 0; i < segCount; i++) {
          const t = dnaTime * strand.speed * 60 + i * 0.5 + strand.offset;
          const y = i * segHeight;
          const x1 = cx + Math.sin(t) * amplitude;
          const x2 = cx - Math.sin(t) * amplitude;
          const alpha = 0.04 + Math.sin(dnaTime + i * 0.2) * 0.02;

          ctx.beginPath();
          ctx.arc(x1, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,122,255,${alpha + 0.02})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x2, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(90,200,250,${alpha + 0.02})`;
          ctx.fill();

          if (i % 4 === 0) {
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.strokeStyle = `rgba(0,122,255,${alpha * 0.6})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ecgProgress = Math.min(ecgProgress + 0.003, 1);
      const ecgY = h * 0.5;
      const ecgH = h * 0.12;
      const drawLen = Math.floor(ecgProgress * heartbeatData.length);

      if (drawLen > 1) {
        ctx.beginPath();
        for (let i = 0; i < drawLen; i++) {
          const x = (i / heartbeatData.length) * w;
          const y = ecgY - heartbeatData[i] * ecgH;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, 0, w * ecgProgress, 0);
        grad.addColorStop(0, "rgba(0,180,255,0.0)");
        grad.addColorStop(Math.max(0, 1 - 0.3 / ecgProgress), "rgba(0,180,255,0.04)");
        grad.addColorStop(1, "rgba(0,220,255,0.1)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.lineJoin = "round";
        ctx.stroke();

        const tipIdx = drawLen - 1;
        const tipX = (tipIdx / heartbeatData.length) * w;
        const tipY = ecgY - heartbeatData[tipIdx] * ecgH;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,220,255,0.5)";
        ctx.shadowBlur = 18;
        ctx.shadowColor = "rgba(0,220,255,0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;

        if (Math.abs(heartbeatData[tipIdx]) > 0.3) {
          ctx.beginPath();
          ctx.arc(tipX, tipY, 8 + Math.abs(heartbeatData[tipIdx]) * 15, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,220,255,${0.03 + Math.abs(heartbeatData[tipIdx]) * 0.04})`;
          ctx.fill();
        }
      }

      const moleculeTime = frame * 0.008;
      const molCenters = [
        { x: w * 0.3, y: h * 0.25 },
        { x: w * 0.7, y: h * 0.75 },
      ];
      for (const mc of molCenters) {
        const nodes: { x: number; y: number }[] = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + moleculeTime;
          const r = 30;
          nodes.push({
            x: mc.x + Math.cos(angle) * r,
            y: mc.y + Math.sin(angle) * r,
          });
        }
        for (let i = 0; i < nodes.length; i++) {
          const next = nodes[(i + 1) % nodes.length];
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = "rgba(0,122,255,0.035)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
        for (const n of nodes) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0,180,255,0.05)";
          ctx.fill();
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@200;300;400&display=swap');
        @keyframes sp-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sp-pulse-ring {
          0% { transform: translate(-50%,-50%) scale(0.2); opacity: 0.08; }
          100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
        }
        @keyframes sp-glow {
          0%, 100% { opacity: 0.12; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 0.22; transform: translate(-50%,-50%) scale(1.15); }
        }
        @keyframes sp-underline {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          zIndex: 1, pointerEvents: "none",
        }}
      />

      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,100,255,0.06) 0%, transparent 65%)",
        filter: "blur(50px)",
        animation: "sp-glow 5s ease-in-out infinite",
        zIndex: 2, pointerEvents: "none",
      }} />

      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", left: "50%", top: "50%",
          width: 250, height: 250, borderRadius: "50%",
          border: "1px solid rgba(0,122,255,0.04)",
          animation: `sp-pulse-ring 5s ease-out ${i * 1.6}s infinite`,
          zIndex: 2, pointerEvents: "none",
        }} />
      ))}

      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", padding: "0 24px",
      }}>
        <div style={{ overflow: "hidden" }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: "clamp(4rem, 14vw, 9rem)",
            lineHeight: 1,
            letterSpacing: "0.02em",
            color: "transparent",
            backgroundImage: phase >= 2
              ? "linear-gradient(90deg, rgba(255,255,255,0.7) 0%, #FFFFFF 20%, #5AC8FA 50%, #FFFFFF 80%, rgba(255,255,255,0.7) 100%)"
              : "linear-gradient(180deg, #FFFFFF 30%, rgba(255,255,255,0.7) 100%)",
            backgroundSize: phase >= 2 ? "200% 100%" : "100% 100%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: phase >= 2 ? "sp-shimmer 3s ease-in-out infinite" : "none",
            transform: phase >= 1 ? "translateY(0)" : "translateY(110%)",
            opacity: phase >= 1 ? 1 : 0,
            transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease, background-image 1s ease",
            margin: 0, padding: 0,
            textShadow: phase >= 2 ? "0 0 60px rgba(0,122,255,0.15)" : "none",
          }}>
            Aethex
          </h1>
        </div>

        <div style={{
          width: phase >= 2 ? 60 : 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(0,122,255,0.35), transparent)",
          marginTop: 16,
          transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          borderRadius: 2,
        }} />

        <p style={{
          fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          fontWeight: 200,
          fontSize: "clamp(0.75rem, 2vw, 0.95rem)",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          marginTop: 18,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          Where Medicine Meets Intelligence
        </p>

        <div style={{
          marginTop: 48,
          width: 80,
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.6s ease",
        }}>
          <div style={{
            height: 1,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: phase >= 4 ? "100%" : "0%",
              background: "linear-gradient(90deg, #007AFF, #5AC8FA)",
              borderRadius: 4,
              boxShadow: "0 0 8px rgba(0,122,255,0.25)",
              transition: "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }} />
          </div>
        </div>
      </div>

      <p style={{
        position: "absolute", bottom: 24,
        left: 0, right: 0, textAlign: "center",
        fontFamily: "'Outfit', -apple-system, system-ui, sans-serif",
        fontWeight: 300, fontSize: 10,
        letterSpacing: "0.2em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.05)",
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
