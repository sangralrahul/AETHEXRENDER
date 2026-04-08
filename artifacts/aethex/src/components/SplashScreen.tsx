import { useState, useEffect, useRef, useCallback } from "react";

const SPLASH_KEY = "aethex_splash_seen";
const LETTERS = ["A", "e", "t", "h", "e", "x"];

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>(LETTERS.map(() => false));
  const completedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

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
    addTimer(() => setPhase(1), 100);
    LETTERS.forEach((_, i) => {
      addTimer(() => {
        setRevealed(prev => { const n = [...prev]; n[i] = true; return n; });
      }, 420 + i * 130);
    });
    addTimer(() => setPhase(2), 1600);
    addTimer(() => setPhase(3), 2400);
    addTimer(() => setPhase(4), 3500);
    addTimer(() => setPhase(5), 4900);
    addTimer(() => triggerComplete(), 5700);

    return () => { timersRef.current.forEach(clearTimeout); };
  }, [triggerComplete]);

  const handleSkip = () => {
    setPhase(5);
    addTimer(triggerComplete, 500);
  };

  return (
    <div
      onClick={handleSkip}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", overflow: "hidden",
        background: "#FAFAF8",
        opacity: phase === 5 ? 0 : 1,
        transition: "opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400&display=swap');

        @keyframes sp-letter {
          0%   { opacity: 0; transform: translateY(28px) scale(0.96); filter: blur(14px); }
          60%  { filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes sp-shimmer {
          0%   { background-position: -400% center; }
          100% { background-position: 400% center; }
        }
        @keyframes sp-line-grow {
          0%   { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes sp-tag-in {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes sp-dot-float {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%       { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes sp-grid-in {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }

        /* Floating orbs */
        @keyframes sp-orb-1 {
          0%,100% { transform: translate(-50%,-50%) scale(1) rotate(0deg); }
          33%     { transform: translate(-46%,-54%) scale(1.08) rotate(8deg); }
          66%     { transform: translate(-54%,-46%) scale(0.94) rotate(-6deg); }
        }
        @keyframes sp-orb-2 {
          0%,100% { transform: translate(-50%,-50%) scale(1) rotate(0deg); }
          33%     { transform: translate(-54%,-48%) scale(0.92) rotate(-10deg); }
          66%     { transform: translate(-46%,-54%) scale(1.1) rotate(7deg); }
        }
        @keyframes sp-orb-3 {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%     { transform: translate(-50%,-45%) scale(1.12); }
        }

        /* Expanding rings */
        @keyframes sp-ring {
          0%   { transform: translate(-50%,-50%) scale(0.1); opacity: 0.18; }
          100% { transform: translate(-50%,-50%) scale(1);   opacity: 0; }
        }

        /* Floating particles */
        @keyframes sp-particle-1 {
          0%,100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.35; }
          25%     { transform: translateY(-22px) translateX(8px) scale(1.15); opacity: 0.6; }
          75%     { transform: translateY(10px) translateX(-6px) scale(0.88); opacity: 0.25; }
        }
        @keyframes sp-particle-2 {
          0%,100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.28; }
          40%     { transform: translateY(18px) translateX(-10px) scale(0.9); opacity: 0.5; }
          70%     { transform: translateY(-12px) translateX(5px) scale(1.1); opacity: 0.38; }
        }
        @keyframes sp-particle-3 {
          0%,100% { transform: translateY(0) scale(1); opacity: 0.22; }
          50%     { transform: translateY(-28px) scale(1.2); opacity: 0.48; }
        }
        @keyframes sp-particle-4 {
          0%,100% { transform: translateY(0) translateX(0); opacity: 0.18; }
          33%     { transform: translateY(14px) translateX(12px); opacity: 0.42; }
          66%     { transform: translateY(-8px) translateX(-8px); opacity: 0.28; }
        }
        @keyframes sp-particle-5 {
          0%,100% { transform: translateY(0) scale(1); opacity: 0.3; }
          60%     { transform: translateY(20px) scale(0.85); opacity: 0.15; }
        }

        /* Cross/plus marks */
        @keyframes sp-cross {
          0%,100% { opacity: 0.06; transform: rotate(0deg) scale(1); }
          50%     { opacity: 0.14; transform: rotate(45deg) scale(1.1); }
        }
      `}</style>

      {/* ── LAYER 1: Dot grid ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        animation: phase >= 1 ? "sp-grid-in 1.6s ease both" : "none",
        opacity: phase >= 1 ? 1 : 0,
      }} />

      {/* ── LAYER 2: Three floating gradient orbs ── */}
      {/* Teal orb — top-left */}
      <div style={{
        position: "absolute", left: "22%", top: "28%",
        width: 520, height: 520, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,194,168,0.09) 0%, rgba(0,194,168,0.03) 45%, transparent 70%)",
        animation: "sp-orb-1 9s ease-in-out infinite",
        pointerEvents: "none",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 2s ease",
      }} />
      {/* Warm peach orb — bottom-right */}
      <div style={{
        position: "absolute", left: "62%", top: "52%",
        width: 440, height: 440, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,177,122,0.11) 0%, rgba(232,177,122,0.04) 40%, transparent 68%)",
        animation: "sp-orb-2 11s ease-in-out infinite",
        pointerEvents: "none",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 2.4s ease",
      }} />
      {/* Lavender orb — center-top */}
      <div style={{
        position: "absolute", left: "48%", top: "18%",
        width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(150,130,220,0.07) 0%, rgba(150,130,220,0.02) 50%, transparent 70%)",
        animation: "sp-orb-3 13s ease-in-out infinite",
        pointerEvents: "none",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 2s ease",
      }} />

      {/* ── LAYER 3: Expanding concentric rings ── */}
      {phase >= 2 && [0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", left: "50%", top: "50%",
          width: Math.min(window.innerWidth, window.innerHeight) * 1.6,
          height: Math.min(window.innerWidth, window.innerHeight) * 1.6,
          borderRadius: "50%",
          border: "1px solid rgba(0,194,168,0.14)",
          animation: `sp-ring ${3.5 + i * 0.6}s cubic-bezier(0.1, 0, 0.9, 1) ${i * 1.1}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* ── LAYER 4: Floating soft particles / blobs ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        opacity: phase >= 1 ? 1 : 0, transition: "opacity 2s ease" }}>
        {/* Particle cluster */}
        {[
          { left: "8%",  top: "15%", size: 8,  anim: "sp-particle-1 7s ease-in-out infinite" },
          { left: "88%", top: "12%", size: 6,  anim: "sp-particle-2 9s ease-in-out 1.2s infinite" },
          { left: "6%",  top: "70%", size: 10, anim: "sp-particle-3 8s ease-in-out 0.4s infinite" },
          { left: "92%", top: "65%", size: 7,  anim: "sp-particle-4 10s ease-in-out 2s infinite" },
          { left: "50%", top: "8%",  size: 5,  anim: "sp-particle-5 6s ease-in-out 0.8s infinite" },
          { left: "18%", top: "88%", size: 9,  anim: "sp-particle-1 11s ease-in-out 1.5s infinite" },
          { left: "78%", top: "85%", size: 6,  anim: "sp-particle-3 8.5s ease-in-out 0.3s infinite" },
          { left: "32%", top: "5%",  size: 7,  anim: "sp-particle-2 7.5s ease-in-out 2.5s infinite" },
          { left: "65%", top: "6%",  size: 5,  anim: "sp-particle-4 9.5s ease-in-out 1.8s infinite" },
          { left: "95%", top: "40%", size: 8,  anim: "sp-particle-5 8s ease-in-out 0.6s infinite" },
          { left: "3%",  top: "42%", size: 6,  anim: "sp-particle-1 10s ease-in-out 3s infinite" },
        ].map((p, idx) => (
          <div key={idx} style={{
            position: "absolute",
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: idx % 3 === 0
              ? "rgba(0,194,168,0.35)"
              : idx % 3 === 1
                ? "rgba(232,177,122,0.4)"
                : "rgba(150,130,220,0.3)",
            animation: p.anim,
          }} />
        ))}
      </div>

      {/* ── LAYER 5: Subtle medical cross marks ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        opacity: phase >= 1 ? 1 : 0, transition: "opacity 2.5s ease" }}>
        {[
          { left: "14%", top: "22%", size: 16, delay: "0s" },
          { left: "82%", top: "18%", size: 12, delay: "1.4s" },
          { left: "10%", top: "60%", size: 14, delay: "2.1s" },
          { left: "86%", top: "72%", size: 18, delay: "0.7s" },
          { left: "48%", top: "92%", size: 12, delay: "1.8s" },
          { left: "72%", top: "30%", size: 10, delay: "3s" },
        ].map((c, i) => (
          <div key={i} style={{
            position: "absolute", left: c.left, top: c.top,
            width: c.size, height: c.size,
            animation: `sp-cross ${5 + i * 0.7}s ease-in-out ${c.delay} infinite`,
          }}>
            <div style={{
              position: "absolute", left: "50%", top: 0,
              width: 1.5, height: "100%",
              background: "rgba(0,194,168,0.5)",
              transform: "translateX(-50%)",
            }} />
            <div style={{
              position: "absolute", top: "50%", left: 0,
              height: 1.5, width: "100%",
              background: "rgba(0,194,168,0.5)",
              transform: "translateY(-50%)",
            }} />
          </div>
        ))}
      </div>

      {/* ── LAYER 6: Warm vignette ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, rgba(224,218,210,0.5) 100%)",
      }} />

      {/* ── MAIN CONTENT ── */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", padding: "0 24px",
      }}>
        {/* Letter-by-letter headline */}
        <div style={{
          display: "flex", alignItems: "baseline",
          fontFamily: "'Cinzel', Georgia, serif",
          fontWeight: 600,
          fontSize: "clamp(4rem, 14vw, 9rem)",
          lineHeight: 1,
          letterSpacing: "0.06em",
          userSelect: "none",
        }}>
          {LETTERS.map((letter, i) => (
            <span key={i} style={{
              display: "inline-block",
              backgroundImage: phase >= 2
                ? "linear-gradient(110deg, #1a1a2e 0%, #2d2d50 28%, #7878a8 44%, #b8b8d0 50%, #7878a8 56%, #2d2d50 72%, #1a1a2e 100%)"
                : "linear-gradient(180deg, #0A0A0F 0%, #2a2a3e 100%)",
              backgroundSize: phase >= 2 ? "300% auto" : "100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: revealed[i]
                ? `sp-letter 0.75s cubic-bezier(0.16,1,0.3,1) both${phase >= 2 ? `, sp-shimmer 4s linear ${i * 0.15 + 0.5}s infinite` : ""}`
                : "none",
              opacity: revealed[i] ? 1 : 0,
            }}>
              {letter}
            </span>
          ))}
        </div>

        {/* Teal accent line */}
        <div style={{
          height: 2,
          width: 48,
          marginTop: 20,
          borderRadius: 3,
          background: "linear-gradient(90deg, transparent, #00C2A8, transparent)",
          transformOrigin: "center",
          animation: phase >= 2 ? "sp-line-grow 0.65s cubic-bezier(0.16,1,0.3,1) both" : "none",
          opacity: phase >= 2 ? 1 : 0,
        }} />

        {/* Tagline */}
        <p style={{
          fontFamily: "'Plus Jakarta Sans', -apple-system, system-ui, sans-serif",
          fontWeight: 300,
          fontSize: "clamp(0.55rem, 1.4vw, 0.72rem)",
          letterSpacing: "0.36em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.28)",
          marginTop: 20,
          animation: phase >= 3 ? "sp-tag-in 0.8s cubic-bezier(0.16,1,0.3,1) both" : "none",
          opacity: phase >= 3 ? 1 : 0,
        }}>
          Where Medicine Meets Intelligence
        </p>

        {/* Animated loading dots */}
        <div style={{
          display: "flex", gap: 6, marginTop: 52,
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#00C2A8",
              animation: `sp-dot-float 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>

      {/* Skip hint */}
      <p style={{
        position: "absolute", bottom: 28,
        left: 0, right: 0, textAlign: "center",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontWeight: 400, fontSize: 10,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: "rgba(0,0,0,0.18)",
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
