import { useState, useEffect, useRef, useCallback } from "react";

const SPLASH_KEY = "aethex_splash_seen";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [showHeadline, setShowHeadline] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const [showDots, setShowDots] = useState(false);
  const [exiting, setExiting] = useState(false);
  const completedRef = useRef(false);
  const timers = useRef<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const t = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  const triggerComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    cancelAnimationFrame(rafRef.current);
    sessionStorage.setItem(SPLASH_KEY, "1");
    onComplete();
  }, [onComplete]);

  // ── Neural web canvas animation ──────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 52;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number; pulse: number; pSpeed: number }[] = [];

    for (let i = 0; i < COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        r: 1.2 + Math.random() * 2.2,
        pulse: Math.random() * Math.PI * 2,
        pSpeed: 0.018 + Math.random() * 0.022,
      });
    }

    let frame = 0;
    const MAX_DIST = 165;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pSpeed;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      }

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.13;
            // Gradient edge: teal to lavender
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            grad.addColorStop(0, `rgba(0,194,168,${alpha})`);
            grad.addColorStop(1, `rgba(167,139,250,${alpha * 0.7})`);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const pulse = 0.7 + 0.3 * Math.sin(n.pulse);
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3.5 * pulse);
        grd.addColorStop(0, `rgba(0,194,168,${0.55 * pulse})`);
        grd.addColorStop(0.5, `rgba(0,194,168,${0.18 * pulse})`);
        grd.addColorStop(1, "rgba(0,194,168,0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 0.55 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,210,180,${0.75 * pulse})`;
        ctx.fill();
      }

      // Ripple rings (every 90 frames)
      if (frame % 90 === 0) {
        const rx = Math.random() * canvas.width;
        const ry = Math.random() * canvas.height;
        let rFrame = 0;
        const drawRipple = () => {
          rFrame++;
          if (rFrame > 55) return;
          const rAlpha = Math.max(0, 0.18 - rFrame * 0.0032);
          ctx.beginPath();
          ctx.arc(rx, ry, rFrame * 3.2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,194,168,${rAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          requestAnimationFrame(drawRipple);
        };
        drawRipple();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    t(() => setPhase(1), 60);
    t(() => setShowBadge(true), 280);
    t(() => setShowLogo(true), 580);
    t(() => setShowLine(true), 1220);
    t(() => setShowHeadline(true), 1480);
    t(() => setShowTag(true), 2200);
    t(() => setShowDots(true), 2800);
    t(() => setExiting(true), 5200);
    t(() => triggerComplete(), 6100);
    return () => timers.current.forEach(clearTimeout);
  }, [triggerComplete]);

  const handleSkip = () => {
    setExiting(true);
    t(triggerComplete, 700);
  };

  // Split headline for word-by-word animation
  const words = ["Where", "Medicine", "Meets", "Intelligence"];

  return (
    <div
      onClick={handleSkip}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#FAFAF8",
        cursor: "pointer", overflow: "hidden",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.014)" : "scale(1)",
        transition: exiting
          ? "opacity 0.95s cubic-bezier(0.4,0,0.2,1), transform 0.95s cubic-bezier(0.4,0,0.2,1)"
          : "none",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;600&display=swap');

        @keyframes sp-logo-rise {
          0%   { opacity:0; transform:translateY(22px) scale(0.97); filter:blur(8px); }
          100% { opacity:1; transform:translateY(0) scale(1);      filter:blur(0); }
        }
        @keyframes sp-logo-shimmer {
          0%   { background-position:-500% center; }
          100% { background-position:500% center; }
        }
        @keyframes sp-badge-in {
          0%   { opacity:0; transform:translateY(10px) scale(0.94); }
          100% { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes sp-word-rise {
          0%   { opacity:0; transform:translateY(44px); filter:blur(4px); }
          100% { opacity:1; transform:translateY(0);    filter:blur(0); }
        }
        @keyframes sp-tag-in {
          0%   { opacity:0; transform:translateY(14px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes sp-line-grow {
          0%   { transform:scaleX(0); opacity:0; }
          100% { transform:scaleX(1); opacity:1; }
        }
        @keyframes sp-dot-pulse {
          0%,100% { transform:scale(1);    opacity:0.28; }
          50%      { transform:scale(1.7); opacity:1; }
        }
        @keyframes sp-live-dot {
          0%,100% { opacity:1; }
          50%      { opacity:0.35; }
        }
        @keyframes sp-blob-tl {
          0%,100% { border-radius:68% 32% 55% 45%/55% 60% 40% 45%; transform:translate(0,0) scale(1); }
          33%      { border-radius:40% 60% 70% 30%/60% 35% 65% 40%; transform:translate(55px,-38px) scale(1.08); }
          66%      { border-radius:55% 45% 35% 65%/40% 65% 35% 60%; transform:translate(-28px,42px) scale(0.94); }
        }
        @keyframes sp-blob-br {
          0%,100% { border-radius:55% 45% 68% 32%/40% 55% 45% 60%; transform:translate(0,0) scale(1); }
          40%      { border-radius:35% 65% 40% 60%/65% 35% 60% 40%; transform:translate(-55px,42px) scale(1.07); }
          75%      { border-radius:65% 35% 55% 45%/45% 65% 35% 55%; transform:translate(32px,-26px) scale(0.92); }
        }
        @keyframes sp-blob-tr {
          0%,100% { border-radius:50% 50% 30% 70%/60% 40% 60% 40%; transform:translate(0,0) scale(1); }
          50%      { border-radius:70% 30% 60% 40%/40% 70% 40% 60%; transform:translate(35px,50px) scale(1.09); }
        }
        @keyframes sp-blob-bl {
          0%,100% { border-radius:40% 60% 45% 55%/55% 45% 55% 45%; transform:translate(0,0) scale(1); }
          45%      { border-radius:60% 40% 70% 30%/35% 65% 35% 65%; transform:translate(-38px,-50px) scale(0.94); }
        }
        @keyframes sp-grain {
          0%,100% { transform:translate(0,0); }
          25%      { transform:translate(-2%,-3%); }
          50%      { transform:translate(3%,-1%); }
          75%      { transform:translate(-1%,3%); }
        }
        @keyframes sp-top-rule {
          0%   { transform:scaleX(0); }
          100% { transform:scaleX(1); }
        }
        @keyframes sp-scan {
          0%   { top: -2px; opacity:0; }
          8%   { opacity:1; }
          92%  { opacity:1; }
          100% { top: 100%; opacity:0; }
        }
        @keyframes sp-halo {
          0%,100% { opacity:0.12; transform:scale(1); }
          50%      { opacity:0.22; transform:scale(1.04); }
        }
        .sp-word {
          display:inline-block;
          animation: sp-word-rise 0.82s cubic-bezier(0.16,1,0.3,1) both;
        }
      `}</style>

      {/* ── CANVAS: neural web ── */}
      <canvas ref={canvasRef} style={{
        position: "absolute", inset: 0, zIndex: 1,
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 1.8s ease",
        pointerEvents: "none",
      }} />

      {/* ── AURORA BLOBS ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 2.2s ease",
      }}>
        {/* Teal — top-left */}
        <div style={{
          position: "absolute", left: "4%", top: "4%",
          width: 700, height: 700,
          background: "radial-gradient(circle at 38% 38%, rgba(0,194,168,0.16) 0%, rgba(0,194,168,0.055) 48%, transparent 72%)",
          animation: "sp-blob-tl 20s ease-in-out infinite",
          borderRadius: "68% 32% 55% 45%/55% 60% 40% 45%",
          filter: "blur(1px)",
        }} />
        {/* Amber — bottom-right */}
        <div style={{
          position: "absolute", right: "3%", bottom: "5%",
          width: 620, height: 620,
          background: "radial-gradient(circle at 55% 55%, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.035) 50%, transparent 72%)",
          animation: "sp-blob-br 25s ease-in-out infinite",
          borderRadius: "55% 45% 68% 32%/40% 55% 45% 60%",
          filter: "blur(1px)",
        }} />
        {/* Rose — top-right */}
        <div style={{
          position: "absolute", right: "8%", top: "3%",
          width: 520, height: 520,
          background: "radial-gradient(circle at 50% 50%, rgba(244,114,182,0.09) 0%, rgba(244,114,182,0.025) 50%, transparent 70%)",
          animation: "sp-blob-tr 16s ease-in-out infinite",
          borderRadius: "50% 50% 30% 70%/60% 40% 60% 40%",
          filter: "blur(2px)",
        }} />
        {/* Lavender — bottom-left */}
        <div style={{
          position: "absolute", left: "3%", bottom: "8%",
          width: 560, height: 560,
          background: "radial-gradient(circle at 45% 55%, rgba(167,139,250,0.10) 0%, rgba(167,139,250,0.028) 50%, transparent 70%)",
          animation: "sp-blob-bl 29s ease-in-out infinite",
          borderRadius: "40% 60% 45% 55%/55% 45% 55% 45%",
          filter: "blur(2px)",
        }} />
        {/* Center teal halo behind logo */}
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: 480, height: 480,
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(0,194,168,0.07) 0%, transparent 65%)",
          animation: "sp-halo 5s ease-in-out infinite",
          borderRadius: "50%",
        }} />
      </div>

      {/* ── GRAIN TEXTURE ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        opacity: 0.022,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        animation: "sp-grain 0.65s steps(1) infinite",
      }} />

      {/* ── DOT GRID ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.048) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        opacity: phase >= 1 ? 0.85 : 0,
        transition: "opacity 2.4s ease",
      }} />

      {/* ── SCAN LINE ── */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 1.5, zIndex: 4,
        background: "linear-gradient(90deg, transparent 0%, rgba(0,194,168,0.22) 30%, rgba(0,194,168,0.28) 50%, rgba(0,194,168,0.22) 70%, transparent 100%)",
        pointerEvents: "none",
        opacity: showLine ? 1 : 0,
        animation: showLine ? "sp-scan 3.8s ease-in-out 0.3s infinite" : "none",
      }} />

      {/* ── VIGNETTE ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
        background: "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 40%, rgba(210,205,198,0.42) 100%)",
      }} />

      {/* ── TOP + BOTTOM RULES ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1, zIndex: 5,
        background: "linear-gradient(90deg, transparent, rgba(0,194,168,0.4) 30%, rgba(0,194,168,0.4) 70%, transparent)",
        transformOrigin: "left center",
        opacity: showLine ? 1 : 0,
        animation: showLine ? "sp-top-rule 0.9s cubic-bezier(0.16,1,0.3,1) both" : "none",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1, zIndex: 5,
        background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent)",
        opacity: showLine ? 1 : 0,
        transition: "opacity 1.2s ease",
        pointerEvents: "none",
      }} />

      {/* ── MAIN CONTENT ── */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", padding: "0 32px",
        maxWidth: 760, width: "100%",
      }}>

        {/* Badge */}
        <div style={{
          marginBottom: 30,
          opacity: showBadge ? 1 : 0,
          animation: showBadge ? "sp-badge-in 0.7s cubic-bezier(0.16,1,0.3,1) both" : "none",
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "6px 16px", borderRadius: 100,
            background: "rgba(0,194,168,0.09)",
            border: "1px solid rgba(0,194,168,0.24)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 11, fontWeight: 600,
            color: "#009E87", letterSpacing: "0.05em",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#00C2A8", display: "inline-block",
              animation: "sp-live-dot 2s ease-in-out infinite",
            }} />
            India's Clinical Platform
          </span>
        </div>

        {/* Logo — Pinyon Script with metallic shimmer */}
        <div style={{
          marginBottom: 18,
          fontFamily: "'Pinyon Script', 'Great Vibes', cursive",
          fontWeight: 400,
          fontSize: "clamp(3.4rem, 11vw, 6.4rem)",
          lineHeight: 1.35,
          letterSpacing: "0.01em",
          background: "linear-gradient(108deg, #1a1a2e 0%, #2d2d4e 18%, #5a5a7a 35%, #9898b8 44%, #c0c0d8 50%, #9898b8 56%, #5a5a7a 65%, #2d2d4e 82%, #1a1a2e 100%)",
          backgroundSize: "400% auto",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          userSelect: "none",
          opacity: showLogo ? 1 : 0,
          animation: showLogo
            ? "sp-logo-rise 0.95s cubic-bezier(0.16,1,0.3,1) both, sp-logo-shimmer 4.5s linear 1.2s infinite"
            : "none",
        }}>
          Aethex
        </div>

        {/* Teal divider */}
        <div style={{
          width: 52, height: 1,
          background: "linear-gradient(90deg, transparent, #00C2A8 20%, #00C2A8 80%, transparent)",
          borderRadius: 2,
          transformOrigin: "center",
          transform: showLine ? "scaleX(1)" : "scaleX(0)",
          opacity: showLine ? 1 : 0,
          transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease",
          marginBottom: 32,
        }} />

        {/* Headline: "Where Medicine Meets Intelligence" — word by word */}
        <div style={{
          overflow: "hidden",
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: "0 0.32em", marginBottom: 32,
        }}>
          {words.map((word, i) => (
            <div key={word} style={{ overflow: "hidden" }}>
              <span
                className="sp-word"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: i === 1 || i === 3 ? 600 : 300,
                  fontStyle: i === 1 || i === 3 ? "normal" : "italic",
                  fontSize: "clamp(2rem, 6.5vw, 4.6rem)",
                  lineHeight: 1.18,
                  letterSpacing: "-0.025em",
                  color: i === 1 || i === 3 ? "#0A0A0F" : "rgba(10,10,15,0.42)",
                  animationDelay: showHeadline ? `${i * 0.14}s` : "9999s",
                  animationPlayState: showHeadline ? "running" : "paused",
                  display: "inline-block",
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 300,
          fontSize: "clamp(11px, 1.5vw, 14px)",
          color: "rgba(0,0,0,0.36)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          opacity: showTag ? 1 : 0,
          transform: showTag ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 1s ease, transform 1s cubic-bezier(0.16,1,0.3,1)",
        }}>
          For Those Who Heal.
        </div>

        {/* Loader dots */}
        <div style={{
          marginTop: 44,
          display: "flex", gap: 9, alignItems: "center",
          opacity: showDots ? 1 : 0,
          transition: "opacity 0.7s ease",
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: i === 1 ? 5.5 : 3.5,
              height: i === 1 ? 5.5 : 3.5,
              borderRadius: "50%",
              background: i === 1 ? "#00C2A8" : "rgba(0,0,0,0.18)",
              animation: showDots ? `sp-dot-pulse 1.6s ease-in-out ${i * 0.28}s infinite` : "none",
            }} />
          ))}
        </div>
      </div>

      {/* Skip label */}
      <div style={{
        position: "absolute", bottom: 24, left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "center", gap: 10,
        zIndex: 20, pointerEvents: "none",
        opacity: showTag ? 0.65 : 0,
        transition: "opacity 0.9s ease",
      }}>
        <div style={{ width: 22, height: 0.8, background: "rgba(0,0,0,0.16)", borderRadius: 1 }} />
        <span style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 400, fontSize: 9,
          letterSpacing: "0.32em", textTransform: "uppercase",
          color: "rgba(0,0,0,0.2)",
        }}>Tap to skip</span>
        <div style={{ width: 22, height: 0.8, background: "rgba(0,0,0,0.16)", borderRadius: 1 }} />
      </div>
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
