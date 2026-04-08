import { useState, useEffect, useRef, useCallback } from "react";

const SPLASH_KEY = "aethex_splash_seen";
const LETTERS = ["A", "E", "T", "H", "E", "X"];

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [showTagline, setShowTagline] = useState(false);
  const [showSubtag, setShowSubtag] = useState(false);
  const [showRing, setShowRing] = useState(false);
  const [exitPhase, setExitPhase] = useState(false);
  const completedRef = useRef(false);
  const timers = useRef<number[]>([]);

  const t = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  const triggerComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    sessionStorage.setItem(SPLASH_KEY, "1");
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Phase 0 → 1: background & particles fade in
    t(() => setPhase(1), 60);

    // Ring appears
    t(() => setShowRing(true), 400);

    // Letters stagger in one by one
    LETTERS.forEach((_, i) => t(() => setVisibleLetters(i + 1), 600 + i * 130));

    // Tagline appears
    t(() => setShowTagline(true), 2100);

    // Sub tagline
    t(() => setShowSubtag(true), 2700);

    // Phase 2 — full glow
    t(() => setPhase(2), 2800);

    // Exit
    t(() => setExitPhase(true), 5000);
    t(() => triggerComplete(), 5900);

    return () => timers.current.forEach(clearTimeout);
  }, [triggerComplete]);

  const handleSkip = () => {
    setExitPhase(true);
    t(triggerComplete, 700);
  };

  return (
    <div
      onClick={handleSkip}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", overflow: "hidden",
        background: "#050510",
        opacity: exitPhase ? 0 : 1,
        transform: exitPhase ? "scale(1.04)" : "scale(1)",
        transition: exitPhase
          ? "opacity 0.95s cubic-bezier(0.4,0,0.2,1), transform 0.95s cubic-bezier(0.4,0,0.2,1)"
          : "none",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Plus+Jakarta+Sans:wght@200;300;400&display=swap');

        /* ── PARTICLES ── */
        @keyframes particle-rise {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-110vh) translateX(var(--drift)) scale(0.4); opacity: 0; }
        }

        /* ── AMBIENT ORB PULSE ── */
        @keyframes orb-pulse {
          0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.55; }
          50%      { transform: translate(-50%,-50%) scale(1.18); opacity: 0.75; }
        }

        /* ── OUTER RING ROTATE ── */
        @keyframes ring-spin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes ring-in {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.6) rotate(0deg); }
          100% { opacity: 1; transform: translate(-50%,-50%) scale(1) rotate(0deg); }
        }

        /* ── RING GLOW ── */
        @keyframes ring-glow {
          0%,100% { filter: drop-shadow(0 0 6px rgba(0,194,168,0.4)); }
          50%      { filter: drop-shadow(0 0 18px rgba(0,194,168,0.85)); }
        }

        /* ── LETTER PILLAR ── */
        @keyframes letter-beam {
          0%   { opacity: 0; transform: translateY(-60px) scaleY(0.5); filter: blur(20px); }
          40%  { opacity: 1; transform: translateY(5px) scaleY(1.04); filter: blur(0); }
          65%  { transform: translateY(-3px) scaleY(0.98); }
          82%  { transform: translateY(1px); }
          100% { opacity: 1; transform: translateY(0) scaleY(1); filter: blur(0); }
        }

        /* ── LINE GROW ── */
        @keyframes line-grow {
          0%   { transform: scaleX(0); opacity: 0; }
          60%  { opacity: 1; }
          100% { transform: scaleX(1); opacity: 1; }
        }

        /* ── TAGLINE ── */
        @keyframes tag-in {
          0%   { opacity: 0; transform: translateY(14px) skewX(-2deg); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0) skewX(0); filter: blur(0); }
        }

        /* ── SUBTAG ── */
        @keyframes subtag-in {
          0%   { opacity: 0; letter-spacing: 0.55em; }
          100% { opacity: 1; letter-spacing: 0.38em; }
        }

        /* ── ECG PULSE ── */
        @keyframes ecg-draw {
          0%   { stroke-dashoffset: 800; opacity: 0; }
          5%   { opacity: 0.7; }
          80%  { opacity: 0.55; }
          100% { stroke-dashoffset: 0; opacity: 0.3; }
        }

        /* ── LIGHT SWEEP ── */
        @keyframes sweep-h {
          0%   { left: -30%; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 130%; opacity: 0; }
        }

        /* ── RADIAL BURST ── */
        @keyframes burst {
          0%   { transform: translate(-50%,-50%) scale(0.2); opacity: 0; }
          30%  { opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
        }

        /* ── SHIMMER GRADIENT on letters ── */
        @keyframes shimmer-move {
          0%   { background-position: -400% center; }
          100% { background-position: 400% center; }
        }

        /* ── GLOW PHASE ── */
        @keyframes text-glow {
          0%,100% { text-shadow: 0 0 30px rgba(0,194,168,0.12), 0 0 60px rgba(0,194,168,0.06); }
          50%      { text-shadow: 0 0 50px rgba(0,194,168,0.25), 0 0 100px rgba(0,194,168,0.12); }
        }

        /* ── BEAT DOT ── */
        @keyframes beat {
          0%,100% { transform: scale(1); opacity: 0.5; }
          50%      { transform: scale(1.7); opacity: 1; }
        }

        /* ── GRAIN ── */
        @keyframes grain {
          0%,100% { transform: translate(0,0); }
          20%     { transform: translate(-2%,-3%); }
          40%     { transform: translate(3%,-1%); }
          60%     { transform: translate(-1%,3%); }
          80%     { transform: translate(2%,1%); }
        }

        .splash-letter {
          display: inline-block;
          background: linear-gradient(
            130deg,
            #ffffff 0%,
            #a8f0e8 18%,
            #00C2A8 32%,
            #e0faf7 50%,
            #00C2A8 68%,
            #a8f0e8 82%,
            #ffffff 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-move 4s linear infinite;
        }
      `}</style>

      {/* ── DEEP BACKGROUND GRADIENT ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 140% 100% at 50% 60%, #07101A 0%, #050510 60%, #020208 100%)",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 1.2s ease",
      }} />

      {/* ── TEAL ORB (center) ── */}
      <div style={{
        position: "absolute", left: "50%", top: "48%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,194,168,0.12) 0%, rgba(0,194,168,0.04) 45%, transparent 70%)",
        animation: phase >= 1 ? "orb-pulse 3.8s ease-in-out infinite" : "none",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 1.5s ease",
        pointerEvents: "none",
      }} />

      {/* ── DEEP BLUE ORB (upper-right) ── */}
      <div style={{
        position: "absolute", left: "68%", top: "15%",
        width: 450, height: 450, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 65%)",
        animation: phase >= 1 ? "orb-pulse 5s ease-in-out 1s infinite" : "none",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 2s ease",
        pointerEvents: "none",
      }} />

      {/* ── ROSE ORB (bottom-left) ── */}
      <div style={{
        position: "absolute", left: "15%", top: "60%",
        width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 65%)",
        animation: phase >= 1 ? "orb-pulse 6s ease-in-out 2s infinite" : "none",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 2s ease",
        pointerEvents: "none",
      }} />

      {/* ── PARTICLES ── */}
      {phase >= 1 && Array.from({ length: 38 }).map((_, i) => {
        const x = (i * 37 + 13) % 100;
        const size = 1 + (i % 3) * 0.8;
        const dur = 5 + (i % 5) * 1.8;
        const delay = (i * 0.18) % 4.5;
        const drift = `${((i % 5) - 2) * 18}px`;
        const isGold = i % 7 === 0;
        const isBlue = i % 11 === 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              bottom: `${(i * 29 + 5) % 40}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: isGold ? "#F5A623" : isBlue ? "#007AFF" : "#00C2A8",
              opacity: 0,
              "--drift": drift,
              animation: `particle-rise ${dur}s ease-in-out ${delay}s infinite`,
              pointerEvents: "none",
            } as React.CSSProperties}
          />
        );
      })}

      {/* ── RADIAL BURST (on ring appear) ── */}
      {showRing && (
        <div style={{
          position: "absolute", left: "50%", top: "46%",
          width: 300, height: 300,
          borderRadius: "50%",
          border: "1px solid rgba(0,194,168,0.6)",
          animation: "burst 1.2s ease-out forwards",
          pointerEvents: "none",
        }} />
      )}

      {/* ── OUTER RING (svg arc) ── */}
      <svg
        style={{
          position: "absolute", left: "50%", top: "46%",
          width: 340, height: 340,
          opacity: showRing ? 1 : 0,
          transition: "opacity 0.7s ease",
          animation: showRing ? "ring-spin 12s linear infinite, ring-glow 3s ease-in-out infinite" : "none",
          pointerEvents: "none",
        }}
        viewBox="0 0 340 340"
      >
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C2A8" stopOpacity="0" />
            <stop offset="30%" stopColor="#00C2A8" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#007AFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00C2A8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          cx="170" cy="170" r="160"
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth="1.2"
          strokeDasharray="220 800"
          strokeLinecap="round"
        />
      </svg>

      {/* ── INNER RING ── */}
      <svg
        style={{
          position: "absolute", left: "50%", top: "46%",
          width: 240, height: 240,
          opacity: showRing ? 0.5 : 0,
          transition: "opacity 0.9s ease",
          animation: showRing ? "ring-spin 20s linear infinite reverse" : "none",
          pointerEvents: "none",
        }}
        viewBox="0 0 240 240"
      >
        <circle
          cx="120" cy="120" r="112"
          fill="none"
          stroke="rgba(0,194,168,0.35)"
          strokeWidth="0.8"
          strokeDasharray="80 500"
          strokeLinecap="round"
        />
      </svg>

      {/* ── ECG / HEARTBEAT LINE ── */}
      {phase >= 1 && (
        <svg
          style={{
            position: "absolute",
            left: "50%", top: "65%",
            transform: "translateX(-50%)",
            width: "min(560px, 80vw)", height: 50,
            overflow: "visible",
            opacity: showTagline ? 0 : 1,
            transition: "opacity 0.8s ease",
            pointerEvents: "none",
          }}
          viewBox="0 0 560 50"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ecg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00C2A8" stopOpacity="0" />
              <stop offset="20%" stopColor="#00C2A8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#007AFF" stopOpacity="1" />
              <stop offset="80%" stopColor="#00C2A8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00C2A8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,25 L60,25 L75,25 L85,5 L95,45 L105,10 L115,40 L125,25 L200,25 L215,25 L225,5 L235,45 L245,10 L255,40 L265,25 L340,25 L355,25 L365,5 L375,45 L385,10 L395,40 L405,25 L480,25 L495,25 L505,5 L515,45 L525,10 L535,40 L545,25 L560,25"
            fill="none"
            stroke="url(#ecg-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="800"
            strokeDashoffset="800"
            style={{ animation: "ecg-draw 2.2s cubic-bezier(0.4,0,0.2,1) 0.5s forwards" }}
          />
        </svg>
      )}

      {/* ── HORIZONTAL LIGHT SWEEP (once, at letter reveal) ── */}
      {visibleLetters >= 3 && visibleLetters < 6 && (
        <div style={{
          position: "absolute", top: 0, bottom: 0,
          width: "15%",
          background: "linear-gradient(90deg, transparent 0%, rgba(0,194,168,0.06) 30%, rgba(255,255,255,0.08) 50%, rgba(0,194,168,0.06) 70%, transparent 100%)",
          animation: "sweep-h 1.1s cubic-bezier(0.4,0,0.2,1) forwards",
          pointerEvents: "none",
          zIndex: 18,
        }} />
      )}

      {/* ── GRAIN TEXTURE ── */}
      <svg style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", opacity: 0.035,
        animation: "grain 0.6s steps(1) infinite",
      }}>
        <filter id="sp-dark-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sp-dark-noise)" />
      </svg>

      {/* ── VIGNETTE ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, rgba(2,2,8,0.75) 100%)",
      }} />

      {/* ── MAIN CONTENT ── */}
      <div style={{
        position: "relative", zIndex: 20,
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", padding: "0 24px",
        marginTop: "-20px",
      }}>

        {/* Medical cross / brand mark above */}
        <div style={{
          marginBottom: 24,
          opacity: showRing ? 1 : 0,
          transform: showRing ? "scale(1) translateY(0)" : "scale(0.5) translateY(-10px)",
          transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="10" y="2" width="8" height="24" rx="2" fill="url(#cross-grad)" />
            <rect x="2" y="10" width="24" height="8" rx="2" fill="url(#cross-grad)" />
            <defs>
              <linearGradient id="cross-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00C2A8" />
                <stop offset="100%" stopColor="#007AFF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ── WORDMARK ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 3,
          fontFamily: "'Cinzel Decorative', Georgia, serif",
          fontWeight: 700,
          fontSize: "clamp(3.8rem, 13vw, 9rem)",
          lineHeight: 1,
          letterSpacing: "0.15em",
          userSelect: "none",
          animation: phase >= 2 ? "text-glow 3.5s ease-in-out infinite" : "none",
        }}>
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              className="splash-letter"
              style={{
                animationName: i < visibleLetters
                  ? "letter-beam, shimmer-move"
                  : "none",
                animationDuration: i < visibleLetters ? "0.78s, 4s" : "0",
                animationTimingFunction: i < visibleLetters
                  ? "cubic-bezier(0.16,1,0.3,1), linear"
                  : "none",
                animationFillMode: "both, none",
                animationIterationCount: "1, infinite",
                opacity: i < visibleLetters ? 1 : 0,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* ── TEAL DIVIDER ── */}
        <div style={{
          marginTop: 20,
          height: 1,
          width: 80,
          borderRadius: 2,
          background: "linear-gradient(90deg, transparent, #00C2A8 25%, #007AFF 50%, #00C2A8 75%, transparent)",
          transformOrigin: "center",
          animation: showTagline ? "line-grow 0.8s cubic-bezier(0.16,1,0.3,1) both" : "none",
          opacity: showTagline ? 1 : 0,
        }} />

        {/* ── PRIMARY TAGLINE ── */}
        <div style={{
          marginTop: 22,
          fontFamily: "'Cinzel', Georgia, serif",
          fontWeight: 600,
          fontSize: "clamp(1rem, 2.8vw, 1.5rem)",
          letterSpacing: "0.22em",
          color: "#FFFFFF",
          opacity: showTagline ? 1 : 0,
          animation: showTagline ? "tag-in 0.9s cubic-bezier(0.16,1,0.3,1) both" : "none",
          textShadow: "0 0 40px rgba(0,194,168,0.5), 0 2px 20px rgba(0,0,0,0.8)",
        }}>
          PRECISION · INTELLIGENCE · CARE
        </div>

        {/* ── SUBTITLE ── */}
        <div style={{
          marginTop: 14,
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 200,
          fontSize: "clamp(0.5rem, 1.1vw, 0.65rem)",
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: "rgba(200,240,236,0.5)",
          opacity: showSubtag ? 1 : 0,
          animation: showSubtag ? "subtag-in 1.1s cubic-bezier(0.16,1,0.3,1) both" : "none",
        }}>
          Where Medicine Meets Intelligence
        </div>

        {/* ── BEAT DOTS ── */}
        <div style={{
          marginTop: 52,
          display: "flex", gap: 10, alignItems: "center",
          opacity: showSubtag ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 4, height: 4, borderRadius: "50%",
              background: i === 1 ? "#007AFF" : "#00C2A8",
              animation: showSubtag
                ? `beat 1.5s ease-in-out ${i * 0.28}s infinite`
                : "none",
            }} />
          ))}
        </div>
      </div>

      {/* ── BOTTOM DECORATIVE LINE ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,194,168,0.3) 30%, rgba(0,122,255,0.4) 50%, rgba(0,194,168,0.3) 70%, transparent)",
        opacity: showTagline ? 1 : 0,
        transition: "opacity 1s ease",
        pointerEvents: "none",
      }} />

      {/* ── SKIP HINT ── */}
      <div style={{
        position: "absolute", bottom: 28, left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "center", gap: 10,
        zIndex: 25,
        opacity: showSubtag ? 0.7 : 0,
        transition: "opacity 0.8s ease",
      }}>
        <div style={{ width: 20, height: 0.8, background: "rgba(0,194,168,0.4)", borderRadius: 1 }} />
        <span style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 300, fontSize: 9,
          letterSpacing: "0.32em", textTransform: "uppercase",
          color: "rgba(200,240,236,0.4)",
        }}>Tap to skip</span>
        <div style={{ width: 20, height: 0.8, background: "rgba(0,194,168,0.4)", borderRadius: 1 }} />
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
