import { useState, useEffect, useRef, useCallback } from "react";

const SPLASH_KEY = "aethex_splash_seen";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [showH1, setShowH1] = useState(false);
  const [showH2, setShowH2] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const [showDots, setShowDots] = useState(false);
  const [exiting, setExiting] = useState(false);
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
    t(() => setPhase(1), 60);
    t(() => setShowBadge(true), 300);
    t(() => setShowLogo(true), 620);
    t(() => setShowLine(true), 1280);
    t(() => setShowH1(true), 1540);
    t(() => setShowH2(true), 1820);
    t(() => setShowTag(true), 2300);
    t(() => setShowDots(true), 2900);
    t(() => setExiting(true), 5000);
    t(() => triggerComplete(), 5900);
    return () => timers.current.forEach(clearTimeout);
  }, [triggerComplete]);

  const handleSkip = () => {
    setExiting(true);
    t(triggerComplete, 700);
  };

  return (
    <div
      onClick={handleSkip}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#FAFAF8",
        cursor: "pointer", overflow: "hidden",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.012)" : "scale(1)",
        transition: exiting
          ? "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)"
          : "none",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;600&display=swap');

        /* ── AURORA BLOBS ── */
        @keyframes sp-blob-tl {
          0%,100% { border-radius:68% 32% 55% 45%/55% 60% 40% 45%; transform:translate(0,0) scale(1); }
          33%      { border-radius:40% 60% 70% 30%/60% 35% 65% 40%; transform:translate(40px,-28px) scale(1.07); }
          66%      { border-radius:55% 45% 35% 65%/40% 65% 35% 60%; transform:translate(-22px,35px) scale(0.95); }
        }
        @keyframes sp-blob-br {
          0%,100% { border-radius:55% 45% 68% 32%/40% 55% 45% 60%; transform:translate(0,0) scale(1); }
          40%      { border-radius:35% 65% 40% 60%/65% 35% 60% 40%; transform:translate(-50px,38px) scale(1.06); }
          75%      { border-radius:65% 35% 55% 45%/45% 65% 35% 55%; transform:translate(28px,-22px) scale(0.93); }
        }
        @keyframes sp-blob-tr {
          0%,100% { border-radius:50% 50% 30% 70%/60% 40% 60% 40%; transform:translate(0,0) scale(1); }
          50%      { border-radius:70% 30% 60% 40%/40% 70% 40% 60%; transform:translate(30px,45px) scale(1.08); }
        }
        @keyframes sp-blob-bl {
          0%,100% { border-radius:40% 60% 45% 55%/55% 45% 55% 45%; transform:translate(0,0) scale(1); }
          45%      { border-radius:60% 40% 70% 30%/35% 65% 35% 65%; transform:translate(-35px,-45px) scale(0.95); }
        }

        /* ── GRAIN ANIMATION ── */
        @keyframes sp-grain {
          0%,100% { transform: translate(0,0); }
          20%     { transform: translate(-2%,-3%); }
          40%     { transform: translate(3%,-1%); }
          60%     { transform: translate(-1%,3%); }
          80%     { transform: translate(2%,1%); }
        }

        /* ── LOGO RISE ── */
        @keyframes sp-logo-rise {
          0%   { opacity: 0; transform: translateY(20px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes sp-logo-shimmer {
          0%   { background-position: -400% center; }
          100% { background-position: 400% center; }
        }

        /* ── BADGE FADE ── */
        @keyframes sp-badge-in {
          0%   { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── HERO TEXT RISE (same as landing page motion) ── */
        @keyframes sp-h1-rise {
          0%   { transform: translateY(60px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes sp-h2-rise {
          0%   { transform: translateY(55px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* ── DIVIDER LINE ── */
        @keyframes sp-line-grow {
          0%   { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        /* ── TAGLINE ── */
        @keyframes sp-tag-in {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* ── DOTS ── */
        @keyframes sp-dot-pulse {
          0%,100% { transform: scale(1); opacity: 0.3; }
          50%      { transform: scale(1.65); opacity: 1; }
        }

        /* ── DOT BADGE PULSE ── */
        @keyframes sp-dot-live {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
      `}</style>

      {/* ── AURORA BLOBS (match landing page palette exactly) ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 2.4s ease",
      }}>
        {/* Teal — top-left (primary accent) */}
        <div style={{
          position: "absolute", left: "8%", top: "6%",
          width: 640, height: 640,
          background: "radial-gradient(circle at 40% 40%, rgba(0,194,168,0.14) 0%, rgba(0,194,168,0.05) 45%, transparent 72%)",
          animation: "sp-blob-tl 18s ease-in-out infinite",
          borderRadius: "68% 32% 55% 45%/55% 60% 40% 45%",
        }} />

        {/* Amber — bottom-right (warm accent) */}
        <div style={{
          position: "absolute", right: "6%", bottom: "8%",
          width: 560, height: 560,
          background: "radial-gradient(circle at 55% 55%, rgba(245,158,11,0.10) 0%, rgba(245,158,11,0.03) 50%, transparent 72%)",
          animation: "sp-blob-br 22s ease-in-out infinite",
          borderRadius: "55% 45% 68% 32%/40% 55% 45% 60%",
        }} />

        {/* Rose — top-right (subtle) */}
        <div style={{
          position: "absolute", right: "10%", top: "5%",
          width: 460, height: 460,
          background: "radial-gradient(circle at 50% 50%, rgba(244,114,182,0.07) 0%, rgba(244,114,182,0.02) 50%, transparent 70%)",
          animation: "sp-blob-tr 14s ease-in-out infinite",
          borderRadius: "50% 50% 30% 70%/60% 40% 60% 40%",
        }} />

        {/* Lavender — bottom-left (subtle) */}
        <div style={{
          position: "absolute", left: "5%", bottom: "10%",
          width: 500, height: 500,
          background: "radial-gradient(circle at 45% 55%, rgba(167,139,250,0.08) 0%, rgba(167,139,250,0.02) 50%, transparent 70%)",
          animation: "sp-blob-bl 26s ease-in-out infinite",
          borderRadius: "40% 60% 45% 55%/55% 45% 55% 45%",
        }} />
      </div>

      {/* ── GRAIN TEXTURE (same as home hero) ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: 0.018,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        animation: "sp-grain 0.6s steps(1) infinite",
      }} />

      {/* ── DOT GRID (subtle, like landing page feel) ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        opacity: phase >= 1 ? 0.7 : 0,
        transition: "opacity 2s ease",
      }} />

      {/* ── VIGNETTE (subtle, warm) ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 88% 82% at 50% 50%, transparent 42%, rgba(215,208,200,0.45) 100%)",
      }} />

      {/* ── MAIN CONTENT ── */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", padding: "0 32px",
        maxWidth: 720, width: "100%",
      }}>

        {/* ── EYEBROW BADGE (same as home hero) ── */}
        <div style={{
          marginBottom: 28,
          opacity: showBadge ? 1 : 0,
          transform: showBadge ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
          transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "6px 14px", borderRadius: 100,
            background: "rgba(0,194,168,0.09)",
            border: "1px solid rgba(0,194,168,0.22)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 11, fontWeight: 600,
            color: "#009E87", letterSpacing: "0.04em",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#00C2A8", display: "inline-block",
              animation: "sp-dot-live 2s ease-in-out infinite",
            }} />
            India's Clinical Platform
          </span>
        </div>

        {/* ── LOGO: "Aethex" in Pinyon Script (same as Navbar) ── */}
        <div style={{
          marginBottom: 20,
          fontFamily: "'Pinyon Script', 'Great Vibes', cursive",
          fontWeight: 400,
          fontSize: "clamp(3.2rem, 10vw, 6rem)",
          lineHeight: 1.4,
          letterSpacing: "0.01em",
          background: "linear-gradient(105deg, #1a1a2e 0%, #2d2d4e 20%, #4a4a6a 38%, #8585a8 45%, #b0b0cc 50%, #8585a8 55%, #4a4a6a 62%, #2d2d4e 80%, #1a1a2e 100%)",
          backgroundSize: "300% auto",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          userSelect: "none",
          opacity: showLogo ? 1 : 0,
          animation: showLogo
            ? "sp-logo-rise 0.9s cubic-bezier(0.16,1,0.3,1) both, sp-logo-shimmer 4s linear 1s infinite"
            : "none",
        }}>
          Aethex
        </div>

        {/* ── TEAL DIVIDER (same style as landing page rules) ── */}
        <div style={{
          width: 48, height: 1,
          background: "linear-gradient(90deg, transparent, #00C2A8 25%, #00C2A8 75%, transparent)",
          borderRadius: 2,
          transformOrigin: "center",
          transform: showLine ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.85s cubic-bezier(0.16,1,0.3,1)",
          opacity: showLine ? 1 : 0,
          marginBottom: 28,
        }} />

        {/* ── HERO TEXT: "Everything" (Cormorant Garamond 600, same as home hero) ── */}
        <div style={{ overflow: "hidden", marginBottom: "0.1em" }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: "clamp(3rem, 10vw, 7rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "#0A0A0F",
            transform: showH1 ? "translateY(0)" : "translateY(60px)",
            opacity: showH1 ? 1 : 0,
            transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1), opacity 1.1s cubic-bezier(0.16,1,0.3,1)",
            paddingBottom: "0.08em",
          }}>
            Everything
          </div>
        </div>

        {/* ── HERO TEXT: "Medicine." (Cormorant Garamond italic 300 faded, same as home hero) ── */}
        <div style={{ overflow: "hidden", marginBottom: 28 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(3rem, 10vw, 7rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "rgba(10,10,15,0.28)",
            transform: showH2 ? "translateY(0)" : "translateY(55px)",
            opacity: showH2 ? 1 : 0,
            transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1), opacity 1.1s cubic-bezier(0.16,1,0.3,1)",
            paddingBottom: "0.12em",
          }}>
            Medicine.
          </div>
        </div>

        {/* ── TAGLINE ── */}
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 300,
          fontSize: "clamp(12px, 1.6vw, 15px)",
          color: "rgba(0,0,0,0.4)",
          letterSpacing: "0.02em",
          lineHeight: 1.7,
          maxWidth: 420,
          opacity: showTag ? 1 : 0,
          transform: showTag ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}>
          For Those Who Heal.
        </div>

        {/* ── LOADER DOTS ── */}
        <div style={{
          marginTop: 44,
          display: "flex", gap: 8, alignItems: "center",
          opacity: showDots ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: i === 1 ? 5 : 3.5,
              height: i === 1 ? 5 : 3.5,
              borderRadius: "50%",
              background: i === 1 ? "#00C2A8" : "rgba(0,0,0,0.2)",
              animation: showDots ? `sp-dot-pulse 1.5s ease-in-out ${i * 0.26}s infinite` : "none",
            }} />
          ))}
        </div>
      </div>

      {/* ── TOP RULE (1px teal line, like home page horizontal rules) ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,194,168,0.35) 30%, rgba(0,194,168,0.35) 70%, transparent)",
        opacity: showLine ? 1 : 0,
        transition: "opacity 1s ease",
        pointerEvents: "none",
      }} />

      {/* ── BOTTOM RULE ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent)",
        opacity: showLine ? 1 : 0,
        transition: "opacity 1s ease",
        pointerEvents: "none",
      }} />

      {/* ── SKIP ── */}
      <div style={{
        position: "absolute", bottom: 24, left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "center", gap: 10,
        zIndex: 20,
        opacity: showTag ? 0.7 : 0,
        transition: "opacity 0.8s ease",
        pointerEvents: "none",
      }}>
        <div style={{ width: 20, height: 0.8, background: "rgba(0,0,0,0.18)", borderRadius: 1 }} />
        <span style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 400, fontSize: 9,
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: "rgba(0,0,0,0.22)",
        }}>Tap to skip</span>
        <div style={{ width: 20, height: 0.8, background: "rgba(0,0,0,0.18)", borderRadius: 1 }} />
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
