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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600&family=Plus+Jakarta+Sans:wght@300;400&display=swap');

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
      `}</style>

      {/* Subtle warm dot-grid background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        animation: phase >= 1 ? "sp-grid-in 1.4s ease both" : "none",
        opacity: phase >= 1 ? 1 : 0,
      }} />

      {/* Warm vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(228,222,214,0.45) 100%)",
      }} />

      {/* Teal soft bloom at center */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: 560, height: 560, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,194,168,0.04) 0%, transparent 65%)",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        transition: "opacity 1s ease",
        opacity: phase >= 2 ? 1 : 0,
      }} />

      {/* Main content */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", padding: "0 24px",
      }}>
        {/* Letter-by-letter headline */}
        <div style={{
          display: "flex", alignItems: "baseline",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 600,
          fontSize: "clamp(5rem, 16vw, 10rem)",
          lineHeight: 1,
          letterSpacing: "-0.01em",
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
          height: 2.5,
          width: 52,
          marginTop: 22,
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
          fontSize: "clamp(0.6rem, 1.6vw, 0.78rem)",
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.3)",
          marginTop: 22,
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
