import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPLASH_KEY = "aethex_splash_seen";

function GlowOrb({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.6, 0.3, 0.6, 0], scale: [0.3, 1, 0.8, 1.1, 0.5] }}
      transition={{ delay, duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(40px)",
        pointerEvents: "none",
      }}
    />
  );
}

function DNAHelix() {
  return (
    <motion.svg
      viewBox="0 0 120 400"
      className="absolute right-[8%] top-1/2 -translate-y-1/2 opacity-[0.06]"
      style={{ height: "60vh", width: "auto" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.06 }}
      transition={{ delay: 0.5, duration: 2 }}
    >
      {Array.from({ length: 20 }).map((_, i) => {
        const y = i * 20;
        const x1 = 30 + Math.sin(i * 0.6) * 25;
        const x2 = 90 - Math.sin(i * 0.6) * 25;
        return (
          <g key={i}>
            <motion.circle
              cx={x1} cy={y} r={3}
              fill="#007AFF"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx={x2} cy={y} r={3}
              fill="#5AC8FA"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: i * 0.1 + 0.5, duration: 2, repeat: Infinity }}
            />
            {i % 3 === 0 && (
              <motion.line
                x1={x1} y1={y} x2={x2} y2={y}
                stroke="rgba(0,122,255,0.2)"
                strokeWidth={1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.08, duration: 1.5 }}
              />
            )}
          </g>
        );
      })}
    </motion.svg>
  );
}

function PulseRing({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: [0, 0.15, 0], scale: [0.2, 1.8, 2.5] }}
      transition={{ delay, duration: 3, repeat: Infinity, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 300,
        height: 300,
        marginLeft: -150,
        marginTop: -150,
        borderRadius: "50%",
        border: "1px solid rgba(0,122,255,0.3)",
        pointerEvents: "none",
      }}
    />
  );
}

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"loading" | "ready" | "fading">("loading");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const completedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);

  const addTimer = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  const triggerComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    sessionStorage.setItem(SPLASH_KEY, "1");
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    let progress = 0;
    const interval = window.setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setLoadProgress(100);
        addTimer(() => setPhase("ready"), 300);
        addTimer(() => {
          setPhase("fading");
          addTimer(triggerComplete, 900);
        }, 2800);
        return;
      }
      setLoadProgress(Math.min(progress, 95));
    }, 400);

    timersRef.current.push(interval as unknown as number);

    return () => {
      clearInterval(interval);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [triggerComplete]);

  const handleSkip = () => {
    if (phase === "fading") return;
    setPhase("fading");
    addTimer(triggerComplete, 700);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden cursor-pointer select-none"
        onClick={handleSkip}
        style={{ background: "#030308" }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: videoReady ? 0.35 : 0, transition: "opacity 1.5s ease", filter: "saturate(1.2) brightness(0.6)" }}
          src={`${import.meta.env.BASE_URL}hero-video.mp4`}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,40,120,0.25) 0%, transparent 60%), linear-gradient(180deg, rgba(3,3,8,0.4) 0%, rgba(3,3,8,0.8) 100%)",
            zIndex: 1,
          }}
        />

        <GlowOrb delay={0} x="15%" y="20%" size={200} color="rgba(0,122,255,0.15)" />
        <GlowOrb delay={1.5} x="75%" y="65%" size={160} color="rgba(90,200,250,0.12)" />
        <GlowOrb delay={0.8} x="60%" y="15%" size={120} color="rgba(0,122,255,0.1)" />

        <PulseRing delay={0} />
        <PulseRing delay={1} />
        <PulseRing delay={2} />

        <DNAHelix />

        <div className="relative flex flex-col items-center text-center px-6" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3"
          >
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 60px rgba(0,122,255,0.4), 0 0 120px rgba(0,122,255,0.15)",
              margin: "0 auto",
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: "#FFFFFF",
              textShadow: "0 0 80px rgba(0,122,255,0.3)",
              marginTop: 20,
            }}>
              <span style={{
                background: "linear-gradient(135deg, #FFFFFF 30%, #007AFF 70%, #5AC8FA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                AETHEX
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 60 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            style={{
              height: 2,
              background: "linear-gradient(90deg, transparent, #007AFF, transparent)",
              marginTop: 16,
              marginBottom: 16,
              borderRadius: 2,
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              color: "rgba(255,255,255,0.5)",
              fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
              fontWeight: 400,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              maxWidth: 400,
            }}
          >
            Medicine Made Effortless
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "ready" ? 1 : 0.7 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-10"
            style={{ width: 200 }}
          >
            <div style={{
              height: 2,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
            }}>
              <motion.div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #007AFF, #5AC8FA)",
                  borderRadius: 4,
                  boxShadow: "0 0 20px rgba(0,122,255,0.5)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.4 }}
              style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                color: "rgba(255,255,255,0.25)",
                fontSize: 11,
                marginTop: 10,
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              {phase === "ready" ? "Ready" : `Loading ${Math.round(loadProgress)}%`}
            </motion.p>
          </motion.div>

          {phase === "ready" && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
              className="mt-8 group"
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 100,
                padding: "10px 32px",
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                letterSpacing: "0.08em",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = "rgba(0,122,255,0.6)";
                (e.target as HTMLElement).style.color = "#FFFFFF";
                (e.target as HTMLElement).style.boxShadow = "0 0 30px rgba(0,122,255,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                (e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                (e.target as HTMLElement).style.boxShadow = "none";
              }}
            >
              Enter →
            </motion.button>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-6 left-0 right-0 text-center"
          style={{
            color: "rgba(255,255,255,0.15)",
            fontSize: 11,
            fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
            letterSpacing: "0.08em",
            zIndex: 10,
          }}
        >
          TAP TO SKIP
        </motion.p>
      </motion.div>
    </AnimatePresence>
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
