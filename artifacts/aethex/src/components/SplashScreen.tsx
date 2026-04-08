import { useState, useEffect, useRef, useCallback } from "react";

const SPLASH_KEY = "aethex_splash_seen";
const LETTERS = ["A", "E", "T", "H", "E", "X"];

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [sweepActive, setSweepActive] = useState(false);
  const completedRef = useRef(false);
  const timers = useRef<number[]>([]);

  const t = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  const triggerComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    sessionStorage.setItem(SPLASH_KEY, "1");
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Blobs start immediately
    t(() => setPhase(1), 80);

    // Letters stagger in
    LETTERS.forEach((_, i) => t(() => setVisibleCount(i + 1), 500 + i * 110));

    // Light sweep across letters
    t(() => setSweepActive(true), 1400);
    t(() => setSweepActive(false), 2200);

    // Tagline + accent
    t(() => setPhase(2), 1700);

    // Loading indicator
    t(() => setPhase(3), 2600);

    // Fade out
    t(() => setPhase(4), 4200);
    t(() => triggerComplete(), 5100);

    return () => timers.current.forEach(clearTimeout);
  }, [triggerComplete]);

  const handleSkip = () => {
    setPhase(4);
    t(triggerComplete, 600);
  };

  return (
    <div
      onClick={handleSkip}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", overflow: "hidden",
        background: "#FAFAF8",
        opacity: phase === 4 ? 0 : 1,
        transform: phase === 4 ? "scale(1.015)" : "scale(1)",
        transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Plus+Jakarta+Sans:wght@300;400&display=swap');

        /* Morphing aurora blobs */
        @keyframes blob-tl {
          0%,100% { border-radius:68% 32% 55% 45%/55% 60% 40% 45%; transform:translate(-45%,-55%) scale(1) rotate(0deg); }
          25%      { border-radius:40% 60% 70% 30%/60% 35% 65% 40%; transform:translate(-48%,-52%) scale(1.08) rotate(12deg); }
          50%      { border-radius:55% 45% 35% 65%/40% 65% 35% 60%; transform:translate(-42%,-58%) scale(0.94) rotate(25deg); }
          75%      { border-radius:30% 70% 55% 45%/65% 35% 65% 35%; transform:translate(-46%,-50%) scale(1.04) rotate(15deg); }
        }
        @keyframes blob-br {
          0%,100% { border-radius:55% 45% 68% 32%/40% 55% 45% 60%; transform:translate(-55%,-45%) scale(1) rotate(0deg); }
          30%      { border-radius:35% 65% 40% 60%/65% 35% 60% 40%; transform:translate(-52%,-48%) scale(1.06) rotate(-15deg); }
          60%      { border-radius:65% 35% 55% 45%/45% 65% 35% 55%; transform:translate(-58%,-42%) scale(0.92) rotate(-28deg); }
        }
        @keyframes blob-tr {
          0%,100% { border-radius:50% 50% 30% 70%/60% 40% 60% 40%; transform:translate(-50%,-50%) scale(1); }
          40%      { border-radius:70% 30% 60% 40%/40% 70% 40% 60%; transform:translate(-52%,-48%) scale(1.1); }
          80%      { border-radius:35% 65% 50% 50%/55% 45% 55% 45%; transform:translate(-48%,-52%) scale(0.9); }
        }
        @keyframes blob-bl {
          0%,100% { border-radius:40% 60% 45% 55%/55% 45% 55% 45%; transform:translate(-50%,-50%) scale(1) rotate(0deg); }
          33%      { border-radius:60% 40% 70% 30%/35% 65% 35% 65%; transform:translate(-52%,-48%) scale(0.95) rotate(20deg); }
          66%      { border-radius:30% 70% 40% 60%/65% 35% 65% 35%; transform:translate(-48%,-52%) scale(1.08) rotate(10deg); }
        }

        /* Letter entrance — spring overshoot */
        @keyframes letter-in {
          0%   { opacity:0; transform:translateY(40px) scaleY(0.7) scaleX(0.95); filter:blur(12px); }
          55%  { opacity:1; transform:translateY(-6px) scaleY(1.04) scaleX(1.01); filter:blur(0); }
          75%  { transform:translateY(3px) scaleY(0.98) scaleX(1); }
          90%  { transform:translateY(-1px) scaleY(1.01) scaleX(1); }
          100% { opacity:1; transform:translateY(0) scaleY(1) scaleX(1); filter:blur(0); }
        }

        /* Accent line grow */
        @keyframes line-grow {
          0%   { transform:scaleX(0); opacity:0; }
          60%  { opacity:1; }
          100% { transform:scaleX(1); opacity:1; }
        }

        /* Tagline word-by-word */
        @keyframes word-in {
          0%   { opacity:0; transform:translateY(8px); }
          100% { opacity:1; transform:translateY(0); }
        }

        /* Pulsing dot (loader) */
        @keyframes pulse-dot {
          0%,100% { transform:scale(1); opacity:0.35; }
          50%     { transform:scale(1.5); opacity:1; }
        }

        /* Floating grain */
        @keyframes grain {
          0%,100% { transform:translate(0,0); }
          10%     { transform:translate(-2%,-3%); }
          30%     { transform:translate(3%,-1%); }
          50%     { transform:translate(-1%,3%); }
          70%     { transform:translate(2%,1%); }
          90%     { transform:translate(-3%,2%); }
        }

        /* Sweep line */
        @keyframes sweep {
          0%   { left:-20%; opacity:0; }
          5%   { opacity:1; }
          95%  { opacity:1; }
          100% { left:120%; opacity:0; }
        }

        /* Subtle halo pulse */
        @keyframes halo {
          0%,100% { transform:translate(-50%,-50%) scale(1); opacity:0.55; }
          50%     { transform:translate(-50%,-50%) scale(1.12); opacity:0.75; }
        }
      `}</style>

      {/* ── AURORA BLOBS ── */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        opacity: phase >= 1 ? 1 : 0, transition:"opacity 2.2s ease" }}>

        {/* Teal — top-left */}
        <div style={{
          position:"absolute", left:"12%", top:"8%",
          width:680, height:680,
          background:"radial-gradient(circle at 40% 40%, rgba(0,194,168,0.13) 0%, rgba(0,194,168,0.05) 45%, transparent 72%)",
          animation:"blob-tl 14s ease-in-out infinite",
        }} />

        {/* Amber — bottom-right */}
        <div style={{
          position:"absolute", left:"62%", top:"50%",
          width:600, height:600,
          background:"radial-gradient(circle at 55% 55%, rgba(245,158,11,0.11) 0%, rgba(245,158,11,0.04) 50%, transparent 72%)",
          animation:"blob-br 17s ease-in-out infinite",
        }} />

        {/* Rose — top-right */}
        <div style={{
          position:"absolute", left:"60%", top:"4%",
          width:500, height:500,
          background:"radial-gradient(circle at 50% 50%, rgba(244,114,182,0.08) 0%, rgba(244,114,182,0.03) 50%, transparent 70%)",
          animation:"blob-tr 11s ease-in-out infinite",
        }} />

        {/* Lavender — bottom-left */}
        <div style={{
          position:"absolute", left:"4%", top:"55%",
          width:540, height:540,
          background:"radial-gradient(circle at 45% 55%, rgba(167,139,250,0.09) 0%, rgba(167,139,250,0.03) 50%, transparent 70%)",
          animation:"blob-bl 15s ease-in-out infinite",
        }} />
      </div>

      {/* ── GRAIN TEXTURE ── */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", opacity:0.028, animation:"grain 0.8s steps(1) infinite" }}>
        <filter id="sp-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#sp-noise)" />
      </svg>

      {/* ── VIGNETTE ── */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 90% 85% at 50% 50%, transparent 40%, rgba(210,205,198,0.55) 100%)",
      }} />

      {/* ── DOT GRID ── */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"radial-gradient(circle, rgba(0,0,0,0.045) 1px, transparent 1px)",
        backgroundSize:"32px 32px",
        opacity: phase >= 1 ? 0.8 : 0,
        transition:"opacity 2s ease",
      }} />

      {/* ── CENTER HALO ── */}
      <div style={{
        position:"absolute", left:"50%", top:"50%",
        width:700, height:280, borderRadius:"50%",
        background:"radial-gradient(ellipse, rgba(0,194,168,0.06) 0%, transparent 70%)",
        animation: phase >= 1 ? "halo 4s ease-in-out infinite" : "none",
        pointerEvents:"none",
        opacity: phase >= 1 ? 1 : 0,
        transition:"opacity 1.8s ease",
      }} />

      {/* ── LIGHT SWEEP ── */}
      {sweepActive && (
        <div style={{
          position:"absolute", top:0, bottom:0,
          width:"12%",
          background:"linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.55) 60%, transparent 100%)",
          animation:"sweep 0.82s cubic-bezier(0.4,0,0.2,1) forwards",
          pointerEvents:"none",
          zIndex:20,
        }} />
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{
        position:"relative", zIndex:15,
        display:"flex", flexDirection:"column", alignItems:"center",
        textAlign:"center", padding:"0 24px",
      }}>

        {/* Word mark */}
        <div style={{
          display:"flex", alignItems:"center", gap: 2,
          fontFamily:"'Cinzel Decorative', Georgia, serif",
          fontWeight:700,
          fontSize:"clamp(3.6rem, 12vw, 8.5rem)",
          lineHeight:1,
          letterSpacing:"0.12em",
          userSelect:"none",
        }}>
          {LETTERS.map((letter, i) => (
            <span key={i} style={{
              display:"inline-block",
              backgroundImage: sweepActive || phase >= 2
                ? "linear-gradient(150deg, #111827 0%, #374151 20%, #6B7280 40%, #9CA3AF 50%, #6B7280 60%, #374151 80%, #111827 100%)"
                : "linear-gradient(170deg, #111827 0%, #1F2937 60%, #374151 100%)",
              backgroundSize: sweepActive ? "300% auto" : "100%",
              WebkitBackgroundClip:"text",
              backgroundClip:"text",
              WebkitTextFillColor:"transparent",
              animationName: i < visibleCount ? "letter-in" : "none",
              animationDuration: "0.72s",
              animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
              animationFillMode: "both",
              opacity: i < visibleCount ? 1 : 0,
            }}>
              {letter}
            </span>
          ))}
        </div>

        {/* Teal divider line */}
        <div style={{
          marginTop:18,
          height:1.5,
          width:56,
          borderRadius:2,
          background:"linear-gradient(90deg, transparent, #00C2A8 30%, #00C2A8 70%, transparent)",
          transformOrigin:"center",
          animation: phase >= 2 ? "line-grow 0.7s cubic-bezier(0.16,1,0.3,1) both" : "none",
          opacity: phase >= 2 ? 1 : 0,
        }} />

        {/* Tagline — word by word */}
        <div style={{
          marginTop:16,
          display:"flex", gap:"0.38em", flexWrap:"wrap", justifyContent:"center",
          fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight:300,
          fontSize:"clamp(0.52rem, 1.3vw, 0.68rem)",
          letterSpacing:"0.38em",
          textTransform:"uppercase",
          color:"rgba(0,0,0,0.26)",
          opacity: phase >= 2 ? 1 : 0,
        }}>
          {["Where","Medicine","Meets","Intelligence"].map((word, i) => (
            <span key={word} style={{
              display:"inline-block",
              animation: phase >= 2 ? `word-in 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s both` : "none",
            }}>
              {word}
            </span>
          ))}
        </div>

        {/* Elegant loader — three dots */}
        <div style={{
          marginTop:56,
          display:"flex", gap:8, alignItems:"center",
          opacity: phase >= 3 ? 1 : 0,
          transition:"opacity 0.5s ease",
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:4, height:4, borderRadius:"50%",
              background:"#00C2A8",
              animation: phase >= 3 ? `pulse-dot 1.4s ease-in-out ${i * 0.22}s infinite` : "none",
            }} />
          ))}
        </div>
      </div>

      {/* Skip hint */}
      <div style={{
        position:"absolute", bottom:24, left:0, right:0,
        display:"flex", justifyContent:"center", alignItems:"center", gap:8,
        zIndex:20,
        opacity: phase >= 2 ? 1 : 0,
        transition:"opacity 0.6s ease",
      }}>
        <div style={{ width:16, height:1, background:"rgba(0,0,0,0.18)", borderRadius:1 }} />
        <span style={{
          fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight:400, fontSize:9,
          letterSpacing:"0.28em", textTransform:"uppercase",
          color:"rgba(0,0,0,0.2)",
        }}>Tap to skip</span>
        <div style={{ width:16, height:1, background:"rgba(0,0,0,0.18)", borderRadius:1 }} />
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
