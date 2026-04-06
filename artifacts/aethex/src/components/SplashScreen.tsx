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

function PulseRing({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: [0, 0.12, 0], scale: [0.2, 1.8, 2.5] }}
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
        border: "1px solid rgba(0,122,255,0.25)",
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
        style={{ background: "#000" }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: videoReady ? 0.7 : 0,
            transition: "opacity 1.2s ease",
          }}
          src={`${import.meta.env.BASE_URL}hero-video.mp4`}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0,20,60,0.35) 0%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.85) 100%)",
            zIndex: 1,
          }}
        />

        <GlowOrb delay={0} x="10%" y="15%" size={250} color="rgba(0,122,255,0.12)" />
        <GlowOrb delay={1.5} x="78%" y="60%" size={200} color="rgba(90,200,250,0.1)" />
        <GlowOrb delay={0.8} x="55%" y="10%" size={150} color="rgba(0,122,255,0.08)" />

        <PulseRing delay={0} />
        <PulseRing delay={1} />
        <PulseRing delay={2} />

        <div className="relative flex flex-col items-center text-center px-6" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 style={{
              fontFamily: "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(3.5rem, 12vw, 8rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "#FFFFFF",
              textShadow: "0 0 120px rgba(0,122,255,0.25), 0 0 60px rgba(0,122,255,0.1)",
            }}>
              <span style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.85) 40%, #007AFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                AETHEX
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 80,
              height: 1.5,
              background: "linear-gradient(90deg, transparent, rgba(0,122,255,0.6), transparent)",
              marginTop: 24,
              borderRadius: 2,
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "ready" ? 1 : 0.6 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-12"
            style={{ width: 160 }}
          >
            <div style={{
              height: 1.5,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 4,
              overflow: "hidden",
            }}>
              <motion.div
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #007AFF, #5AC8FA)",
                  borderRadius: 4,
                  boxShadow: "0 0 15px rgba(0,122,255,0.4)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              style={{
                fontFamily: "'SF Pro Text', 'Inter', -apple-system, system-ui, sans-serif",
                color: "rgba(255,255,255,0.2)",
                fontSize: 10,
                marginTop: 10,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {phase === "ready" ? "Ready" : `${Math.round(loadProgress)}%`}
            </motion.p>
          </motion.div>

          {phase === "ready" && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
              className="mt-8"
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 100,
                padding: "9px 28px",
                color: "rgba(255,255,255,0.6)",
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "'SF Pro Text', 'Inter', -apple-system, system-ui, sans-serif",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = "rgba(0,122,255,0.5)";
                (e.target as HTMLElement).style.color = "#FFFFFF";
                (e.target as HTMLElement).style.boxShadow = "0 0 25px rgba(0,122,255,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                (e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                (e.target as HTMLElement).style.boxShadow = "none";
              }}
            >
              Enter
            </motion.button>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-5 left-0 right-0 text-center"
          style={{
            color: "rgba(255,255,255,0.1)",
            fontSize: 10,
            fontFamily: "'SF Pro Text', 'Inter', -apple-system, system-ui, sans-serif",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            zIndex: 10,
          }}
        >
          Tap to skip
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
