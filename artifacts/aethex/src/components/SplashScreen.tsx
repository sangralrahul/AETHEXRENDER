import { useState, useEffect, useRef, useCallback } from "react";

const SPLASH_KEY = "aethex_splash_seen";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [showTagBig, setShowTagBig] = useState(false);
  const [showTagSub, setShowTagSub] = useState(false);
  const [showRings, setShowRings] = useState(false);
  const [exitPhase, setExitPhase] = useState(false);
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
    t(() => setShowRings(true), 300);
    t(() => setShowLogo(true), 700);
    t(() => setShowLine(true), 1600);
    t(() => setShowTagBig(true), 1900);
    t(() => setShowTagSub(true), 2500);
    t(() => setPhase(2), 2800);
    t(() => setExitPhase(true), 5100);
    t(() => triggerComplete(), 6000);
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
        background: "#03030A",
        opacity: exitPhase ? 0 : 1,
        transform: exitPhase ? "scale(1.035)" : "scale(1)",
        transition: exitPhase
          ? "opacity 0.92s cubic-bezier(0.4,0,0.2,1), transform 0.92s cubic-bezier(0.4,0,0.2,1)"
          : "none",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;600&display=swap');

        /* ── BACKGROUND RADIAL BURST ── */
        @keyframes burst-bg {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0); }
          40%  { opacity: 1; }
          100% { opacity: 0.6; transform: translate(-50%,-50%) scale(1); }
        }

        /* ── SCAN LINES DRIFT ── */
        @keyframes scan-drift {
          0%   { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }

        /* ── RING ROTATE ── */
        @keyframes ring-cw {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes ring-ccw {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(-360deg); }
        }
        @keyframes ring-fade-in {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes ring-pulse {
          0%,100% { filter: drop-shadow(0 0 4px rgba(0,194,168,0.3)); }
          50%      { filter: drop-shadow(0 0 16px rgba(0,194,168,0.7)); }
        }

        /* ── RIPPLE ── */
        @keyframes ripple {
          0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
        }

        /* ── LOGO WIPE LEFT→RIGHT ── */
        @keyframes logo-wipe {
          0%   { clip-path: inset(0 100% 0 0); opacity: 0.85; }
          100% { clip-path: inset(0 0% 0 0); opacity: 1; }
        }
        @keyframes logo-rise {
          0%   { transform: translateY(22px); }
          100% { transform: translateY(0); }
        }

        /* ── SHINE ON LOGO ── */
        @keyframes logo-shine {
          0%   { background-position: -300% center; }
          100% { background-position: 300% center; }
        }

        /* ── DIVIDER GROW ── */
        @keyframes divider-grow {
          0%   { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        /* ── TAG BIG ── */
        @keyframes tag-big-in {
          0%   { opacity: 0; transform: translateY(18px); filter: blur(8px); letter-spacing: 0.15em; }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); letter-spacing: 0.04em; }
        }

        /* ── TAG SUB ── */
        @keyframes tag-sub-in {
          0%   { opacity: 0; transform: translateY(10px); letter-spacing: 0.55em; }
          100% { opacity: 0.5; transform: translateY(0); letter-spacing: 0.4em; }
        }

        /* ── PARTICLES ── */
        @keyframes float-up {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 0.7; }
          100% { transform: translateY(-100vh) translateX(var(--drift)) scale(0.3); opacity: 0; }
        }

        /* ── CONSTELLATION PULSE ── */
        @keyframes node-pulse {
          0%,100% { r: 1.5; opacity: 0.3; }
          50%      { r: 3; opacity: 0.8; }
        }

        /* ── ECG DRAW ── */
        @keyframes ecg-draw {
          0%   { stroke-dashoffset: 900; opacity: 0; }
          6%   { opacity: 0.65; }
          85%  { opacity: 0.5; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        /* ── FLICKER ── */
        @keyframes flicker {
          0%,100% { opacity: 1; }
          92%     { opacity: 1; }
          93%     { opacity: 0.85; }
          94%     { opacity: 1; }
          97%     { opacity: 1; }
          98%     { opacity: 0.9; }
          99%     { opacity: 1; }
        }

        /* ── GLOW BREATHE ── */
        @keyframes glow-breathe {
          0%,100% { text-shadow: 0 0 40px rgba(255,255,255,0.06), 0 2px 30px rgba(0,0,0,0.9); }
          50%      { text-shadow: 0 0 80px rgba(255,255,255,0.12), 0 2px 30px rgba(0,0,0,0.9); }
        }

        /* ── GRAIN ── */
        @keyframes grain {
          0%,100% { transform: translate(0,0); }
          20%     { transform: translate(-2%,-3%); }
          40%     { transform: translate(3%,-1%); }
          60%     { transform: translate(-1%,3%); }
          80%     { transform: translate(2%,1%); }
        }

        /* ── BEAT DOT ── */
        @keyframes beat {
          0%,100% { transform: scale(1); opacity: 0.4; }
          50%      { transform: scale(1.8); opacity: 1; }
        }

        /* ── ORB DRIFT ── */
        @keyframes orb-drift {
          0%,100% { transform: translate(-50%,-50%) scale(1) rotate(0deg); }
          33%      { transform: translate(-50%,-50%) scale(1.12) rotate(8deg); }
          66%      { transform: translate(-50%,-50%) scale(0.9) rotate(-5deg); }
        }
      `}</style>

      {/* ── DEEP BACKGROUND ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 120% 90% at 50% 55%, #080B18 0%, #03030A 55%, #010106 100%)",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 1s ease",
      }} />

      {/* ── SCAN LINES ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px)",
        opacity: 0.35,
        animation: "scan-drift 0.12s linear infinite alternate",
      }} />

      {/* ── CENTRAL ORB (deep navy-teal) ── */}
      <div style={{
        position: "absolute", left: "50%", top: "48%",
        width: 700, height: 500, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,80,120,0.22) 0%, rgba(0,40,80,0.1) 45%, transparent 70%)",
        animation: phase >= 1 ? "orb-drift 9s ease-in-out infinite" : "none",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 2s ease",
        pointerEvents: "none",
      }} />

      {/* ── TEAL ACCENT ORB ── */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: 480, height: 320, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,194,168,0.07) 0%, rgba(0,194,168,0.02) 50%, transparent 72%)",
        animation: phase >= 1 ? "orb-drift 12s ease-in-out 3s infinite reverse" : "none",
        opacity: phase >= 1 ? 1 : 0,
        transition: "opacity 2s ease",
        pointerEvents: "none",
      }} />

      {/* ── BURST FLASH (initial) ── */}
      {showRings && (
        <div style={{
          position: "absolute", left: "50%", top: "47%",
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
          animation: "burst-bg 1.4s cubic-bezier(0.4,0,0.2,1) forwards",
          pointerEvents: "none",
        }} />
      )}

      {/* ── RIPPLE RINGS ── */}
      {showRings && [0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", left: "50%", top: "47%",
          width: 360, height: 360, borderRadius: "50%",
          border: "1px solid rgba(0,194,168,0.2)",
          transform: "translate(-50%, -50%)",
          animation: `ripple 3s ease-out ${i * 0.9}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* ── CONSTELLATION / NEURAL NETWORK (SVG) ── */}
      {phase >= 1 && (
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.55 }}
          viewBox="0 0 1280 720"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="node-fade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,194,168,1)" />
              <stop offset="100%" stopColor="rgba(0,194,168,0)" />
            </radialGradient>
          </defs>
          {/* Connection lines */}
          {[
            [120,80, 340,180], [340,180, 620,120], [620,120, 900,200],
            [900,200, 1140,90], [1140,90, 1220,240], [340,180, 480,380],
            [620,120, 720,340], [900,200, 820,400], [120,80, 60,280],
            [60,280, 200,480], [200,480, 480,380], [480,380, 720,340],
            [720,340, 820,400], [820,400, 1060,500], [1060,500, 1220,380],
            [1220,380, 1220,240], [200,480, 340,620], [480,380, 640,600],
            [820,400, 960,620], [1060,500, 1100,660],
          ].map(([x1,y1,x2,y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(0,194,168,0.12)" strokeWidth="0.8" />
          ))}
          {/* Nodes */}
          {[
            [120,80],[340,180],[620,120],[900,200],[1140,90],
            [1220,240],[60,280],[200,480],[480,380],[720,340],
            [820,400],[1060,500],[1220,380],[340,620],[640,600],[960,620],[1100,660],
          ].map(([cx,cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2"
              fill="rgba(0,194,168,0.7)"
              style={{ animation: `node-pulse 2.5s ease-in-out ${i * 0.22}s infinite` }}
            />
          ))}
        </svg>
      )}

      {/* ── ROTATING OUTER RING ── */}
      <svg style={{
        position: "absolute", left: "50%", top: "47%",
        width: 380, height: 380,
        transform: "translate(-50%, -50%)",
        opacity: showRings ? 1 : 0,
        transition: "opacity 0.9s ease",
        animation: showRings ? "ring-cw 16s linear infinite, ring-pulse 4s ease-in-out infinite" : "none",
        pointerEvents: "none",
      }} viewBox="0 0 380 380">
        <defs>
          <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C2A8" stopOpacity="0" />
            <stop offset="35%" stopColor="#00C2A8" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#007AFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00C2A8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="190" cy="190" r="182" fill="none"
          stroke="url(#rg1)" strokeWidth="1.2"
          strokeDasharray="260 900" strokeLinecap="round" />
      </svg>

      {/* ── ROTATING MIDDLE RING ── */}
      <svg style={{
        position: "absolute", left: "50%", top: "47%",
        width: 280, height: 280,
        transform: "translate(-50%, -50%)",
        opacity: showRings ? 0.55 : 0,
        transition: "opacity 1.1s ease",
        animation: showRings ? "ring-ccw 22s linear infinite" : "none",
        pointerEvents: "none",
      }} viewBox="0 0 280 280">
        <circle cx="140" cy="140" r="132" fill="none"
          stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"
          strokeDasharray="60 400" strokeLinecap="round" />
      </svg>

      {/* ── STATIC OUTER ACCENT RING ── */}
      <svg style={{
        position: "absolute", left: "50%", top: "47%",
        width: 480, height: 480,
        transform: "translate(-50%, -50%)",
        opacity: showRings ? 0.2 : 0,
        transition: "opacity 1.5s ease",
        animation: showRings ? "ring-cw 40s linear infinite" : "none",
        pointerEvents: "none",
      }} viewBox="0 0 480 480">
        <circle cx="240" cy="240" r="232" fill="none"
          stroke="rgba(0,194,168,0.35)" strokeWidth="0.5"
          strokeDasharray="30 100" strokeLinecap="round" />
      </svg>

      {/* ── ECG LINE ── */}
      {phase >= 1 && (
        <svg style={{
          position: "absolute", bottom: "22%", left: "50%",
          transform: "translateX(-50%)",
          width: "min(640px, 88vw)", height: 44,
          overflow: "visible", pointerEvents: "none",
          opacity: showTagBig ? 0 : 1,
          transition: "opacity 0.6s ease",
        }} viewBox="0 0 640 44" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ecg-g" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00C2A8" stopOpacity="0" />
              <stop offset="25%" stopColor="#00C2A8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#7C3AED" stopOpacity="1" />
              <stop offset="75%" stopColor="#00C2A8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00C2A8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,22 L70,22 L82,22 L90,4 L100,40 L110,8 L120,36 L130,22 L210,22 L222,22 L230,4 L240,40 L250,8 L260,36 L270,22 L350,22 L362,22 L370,4 L380,40 L390,8 L400,36 L410,22 L490,22 L502,22 L510,4 L520,40 L530,8 L540,36 L550,22 L640,22"
            fill="none"
            stroke="url(#ecg-g)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="900"
            strokeDashoffset="900"
            style={{ animation: "ecg-draw 2.5s cubic-bezier(0.4,0,0.2,1) 0.3s forwards" }}
          />
        </svg>
      )}

      {/* ── PARTICLES ── */}
      {phase >= 1 && Array.from({ length: 45 }).map((_, i) => {
        const x = (i * 43 + 7) % 100;
        const size = 0.8 + (i % 4) * 0.6;
        const dur = 5.5 + (i % 6) * 1.6;
        const delay = (i * 0.19) % 5;
        const drift = `${((i % 7) - 3) * 22}px`;
        const color = i % 9 === 0 ? "#F5A623" : i % 5 === 0 ? "#7C3AED" : i % 3 === 0 ? "#007AFF" : "#00C2A8";
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${x}%`,
            bottom: `${(i * 33 + 3) % 35}%`,
            width: size, height: size,
            borderRadius: "50%",
            background: color,
            opacity: 0,
            "--drift": drift,
            animation: `float-up ${dur}s ease-in-out ${delay}s infinite`,
            pointerEvents: "none",
          } as React.CSSProperties} />
        );
      })}

      {/* ── GRAIN TEXTURE ── */}
      <svg style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", opacity: 0.04,
        animation: "grain 0.5s steps(1) infinite",
      }}>
        <filter id="dark-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#dark-grain)" />
      </svg>

      {/* ── VIGNETTE ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(1,1,6,0.8) 100%)",
      }} />

      {/* ── BOTTOM GRADIENT FADE ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
        background: "linear-gradient(to top, rgba(1,1,6,0.9) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* ── MAIN CONTENT ── */}
      <div style={{
        position: "relative", zIndex: 20,
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", padding: "0 32px",
        marginTop: "-32px",
      }}>

        {/* ── LOGO WORDMARK — Pinyon Script, pure white ── */}
        <div
          style={{
            position: "relative",
            fontFamily: "'Pinyon Script', 'Great Vibes', cursive",
            fontWeight: 400,
            fontSize: "clamp(5rem, 18vw, 12rem)",
            lineHeight: 1.05,
            letterSpacing: "0.02em",
            userSelect: "none",
            color: "transparent",
            background: "linear-gradient(160deg, #FFFFFF 0%, #E8E8F0 25%, #F8F8FF 50%, #C8C8D8 75%, #FFFFFF 100%)",
            backgroundSize: "300% auto",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: showLogo ? 1 : 0,
            clipPath: showLogo ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            transform: showLogo ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.1s ease",
            animation: showLogo
              ? "logo-wipe 1.1s cubic-bezier(0.4,0,0.2,1) both, logo-shine 4s linear 2s infinite, logo-rise 1.1s cubic-bezier(0.16,1,0.3,1) both, glow-breathe 4s ease-in-out 2s infinite, flicker 8s ease-in-out 3s infinite"
              : "none",
          }}
        >
          Aethex
        </div>

        {/* ── ACCENT LINE ── */}
        <div style={{
          marginTop: 8,
          height: 1,
          width: 120,
          borderRadius: 2,
          background: "linear-gradient(90deg, transparent, rgba(0,194,168,0.6) 20%, rgba(255,255,255,0.5) 50%, rgba(0,122,255,0.6) 80%, transparent)",
          transformOrigin: "center",
          transform: showLine ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1)",
          opacity: showLine ? 1 : 0,
        }} />

        {/* ── PRIMARY TAGLINE ── */}
        <div style={{
          marginTop: 26,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "clamp(1.3rem, 3.5vw, 2.2rem)",
          letterSpacing: "0.04em",
          color: "#EEEEF8",
          opacity: showTagBig ? 1 : 0,
          transform: showTagBig ? "translateY(0)" : "translateY(18px)",
          filter: showTagBig ? "blur(0)" : "blur(8px)",
          transition: "opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1), filter 1s ease",
          textShadow: "0 2px 40px rgba(0,0,0,0.95), 0 0 60px rgba(255,255,255,0.06)",
        }}>
          For Those Who Heal.
        </div>

        {/* ── SUB TAGLINE ── */}
        <div style={{
          marginTop: 16,
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 200,
          fontSize: "clamp(0.5rem, 1.05vw, 0.62rem)",
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: "rgba(200,220,240,0.45)",
          opacity: showTagSub ? 0.45 : 0,
          transform: showTagSub ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 1.2s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)",
        }}>
          Where Medicine Meets Intelligence
        </div>

        {/* ── PULSING DOTS ── */}
        <div style={{
          marginTop: 48,
          display: "flex", gap: 10, alignItems: "center",
          opacity: showTagSub ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: i === 1 ? 5 : 3.5,
              height: i === 1 ? 5 : 3.5,
              borderRadius: "50%",
              background: i === 1 ? "#FFFFFF" : "rgba(0,194,168,0.8)",
              animation: showTagSub ? `beat 1.6s ease-in-out ${i * 0.3}s infinite` : "none",
            }} />
          ))}
        </div>
      </div>

      {/* ── TOP ACCENT LINE ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,194,168,0.4) 30%, rgba(255,255,255,0.3) 50%, rgba(0,122,255,0.4) 70%, transparent)",
        opacity: showLine ? 1 : 0,
        transition: "opacity 1s ease",
        pointerEvents: "none",
      }} />

      {/* ── BOTTOM ACCENT LINE ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,194,168,0.3) 30%, rgba(0,122,255,0.3) 70%, transparent)",
        opacity: showLine ? 1 : 0,
        transition: "opacity 1s ease",
        pointerEvents: "none",
      }} />

      {/* ── SKIP ── */}
      <div style={{
        position: "absolute", bottom: 28, left: 0, right: 0,
        display: "flex", justifyContent: "center", alignItems: "center", gap: 10,
        zIndex: 25,
        opacity: showTagSub ? 0.6 : 0,
        transition: "opacity 0.8s ease",
      }}>
        <div style={{ width: 22, height: 0.8, background: "rgba(0,194,168,0.35)", borderRadius: 1 }} />
        <span style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontWeight: 300, fontSize: 9,
          letterSpacing: "0.32em", textTransform: "uppercase",
          color: "rgba(180,220,240,0.4)",
        }}>Tap to skip</span>
        <div style={{ width: 22, height: 0.8, background: "rgba(0,194,168,0.35)", borderRadius: 1 }} />
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
