import { useState, useEffect, useRef, useCallback } from "react";

const SPLASH_KEY = "aethex_splash_seen";

const LETTERS = ["A", "E", "T", "H", "E", "X"];

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
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
    addTimer(() => setPhase(2), 1400);
    addTimer(() => setPhase(3), 2400);
    addTimer(() => setPhase(4), 3200);
    addTimer(() => triggerComplete(), 4200);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [triggerComplete]);

  const handleSkip = () => {
    setPhase(4);
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
        opacity: phase === 4 ? 0 : 1,
        transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <style>{`
        @keyframes splash-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }
        @keyframes splash-drift {
          0% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-30px) translateX(15px); }
          66% { transform: translateY(15px) translateX(-20px); }
          100% { transform: translateY(0) translateX(0); }
        }
        @keyframes splash-float-up {
          0% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-10vh); opacity: 0; }
        }
        @keyframes splash-line-grow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes splash-heartbeat {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
          30% { opacity: 0.08; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      `}</style>

      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 120% 80% at 50% 40%, #001a3a 0%, #000810 50%, #000 100%)",
      }} />

      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: 500, height: 500,
        borderRadius: "50%",
        border: "1px solid rgba(0,122,255,0.08)",
        animation: "splash-heartbeat 3s ease-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: 500, height: 500,
        borderRadius: "50%",
        border: "1px solid rgba(0,122,255,0.06)",
        animation: "splash-heartbeat 3s ease-out 1s infinite",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", left: "12%", top: "20%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "splash-drift 8s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: "10%", bottom: "15%",
        width: 250, height: 250, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(90,200,250,0.06) 0%, transparent 70%)",
        filter: "blur(50px)",
        animation: "splash-drift 10s ease-in-out 2s infinite",
        pointerEvents: "none",
      }} />

      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${12 + i * 11}%`,
          width: 1.5,
          height: 1.5,
          borderRadius: "50%",
          background: i % 2 === 0 ? "#007AFF" : "#5AC8FA",
          boxShadow: `0 0 4px ${i % 2 === 0 ? "rgba(0,122,255,0.6)" : "rgba(90,200,250,0.5)"}`,
          animation: `splash-float-up ${7 + i * 0.8}s linear ${i * 0.6}s infinite`,
          pointerEvents: "none",
          opacity: 0.5,
        }} />
      ))}

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 0 }}>
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(4rem, 15vw, 10rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "transparent",
                backgroundImage: phase >= 2
                  ? "linear-gradient(180deg, #FFFFFF 10%, #C8DEFF 50%, #007AFF 100%)"
                  : "linear-gradient(180deg, #FFFFFF 10%, rgba(255,255,255,0.9) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                opacity: phase >= 1 ? 1 : 0,
                transform: phase >= 1
                  ? "translateY(0) scale(1)"
                  : "translateY(60px) scale(0.7)",
                filter: phase >= 1 ? "blur(0px)" : "blur(6px)",
                transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`,
                textShadow: phase >= 2 ? "0 0 80px rgba(0,122,255,0.3)" : "none",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div style={{
          width: phase >= 2 ? 80 : 0,
          height: 1.5,
          background: "linear-gradient(90deg, transparent, rgba(0,122,255,0.5), transparent)",
          marginTop: 24,
          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          borderRadius: 2,
        }} />

        {phase >= 3 && (
          <div style={{
            marginTop: 40,
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.6s ease 0.1s",
          }}>
            <div style={{
              width: 120,
              height: 1.5,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, #007AFF, #5AC8FA)",
                borderRadius: 4,
                boxShadow: "0 0 12px rgba(0,122,255,0.4)",
                animation: "splash-line-grow 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                transformOrigin: "left center",
              }} />
            </div>
          </div>
        )}
      </div>

      <div style={{
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "rgba(255,255,255,0.08)",
        fontSize: 10,
        fontFamily: "'SF Pro Text', 'Inter', -apple-system, system-ui, sans-serif",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        zIndex: 10,
        opacity: phase >= 2 ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>
        Tap to skip
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
