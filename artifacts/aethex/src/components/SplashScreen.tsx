import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPLASH_KEY = "aethex_splash_seen";

const LETTERS = ["A", "E", "T", "H", "E", "X"];

const SCATTER_POSITIONS = [
  { x: -320, y: -180, rotate: -45, scale: 0.3 },
  { x: 280, y: -220, rotate: 30, scale: 0.2 },
  { x: -200, y: 200, rotate: -60, scale: 0.4 },
  { x: 350, y: 150, rotate: 45, scale: 0.25 },
  { x: -380, y: 50, rotate: -20, scale: 0.35 },
  { x: 400, y: -80, rotate: 55, scale: 0.3 },
];

function FloatingParticle({ delay, duration }: { delay: number; duration: number }) {
  const startX = Math.random() * 100;
  const startY = 100 + Math.random() * 20;
  return (
    <motion.div
      initial={{ opacity: 0, x: `${startX}vw`, y: `${startY}vh` }}
      animate={{
        opacity: [0, 0.4, 0.2, 0],
        x: `${startX + (Math.random() - 0.5) * 20}vw`,
        y: `${startY - 100 - Math.random() * 30}vh`,
      }}
      transition={{ delay, duration, repeat: Infinity, ease: "linear" }}
      style={{
        position: "absolute",
        width: 2,
        height: 2,
        borderRadius: "50%",
        background: "#5AC8FA",
        boxShadow: "0 0 6px rgba(90,200,250,0.5)",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"scattered" | "assembling" | "assembled" | "glowing" | "fading">("scattered");
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
    addTimer(() => setPhase("assembling"), 800);
    addTimer(() => setPhase("assembled"), 2200);
    addTimer(() => setPhase("glowing"), 2800);

    let progress = 0;
    const interval = window.setInterval(() => {
      progress += Math.random() * 12 + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setLoadProgress(100);
        addTimer(() => {
          setPhase("fading");
          addTimer(triggerComplete, 1000);
        }, 3500);
        return;
      }
      setLoadProgress(Math.min(progress, 95));
    }, 350);

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

  const isAssembled = phase === "assembled" || phase === "glowing" || phase === "fading";

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
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
            opacity: videoReady ? 0.55 : 0,
            transition: "opacity 1.5s ease",
          }}
          src={`${import.meta.env.BASE_URL}hero-video.mp4`}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0,15,50,0.4) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.92) 100%)",
            zIndex: 1,
          }}
        />

        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.4} duration={6 + Math.random() * 4} />
        ))}

        {isAssembled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.15, 0.08], scale: [0.5, 1.5, 2] }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,122,255,0.2) 0%, transparent 70%)",
              filter: "blur(60px)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
        )}

        <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "auto" }}>
            {LETTERS.map((letter, i) => {
              const scatter = SCATTER_POSITIONS[i];
              return (
                <motion.span
                  key={i}
                  initial={{
                    opacity: 0,
                    x: scatter.x,
                    y: scatter.y,
                    rotate: scatter.rotate,
                    scale: scatter.scale,
                    filter: "blur(8px)",
                  }}
                  animate={
                    phase === "scattered"
                      ? {
                          opacity: [0, 0.4, 0.2],
                          x: scatter.x,
                          y: scatter.y,
                          rotate: scatter.rotate,
                          scale: scatter.scale,
                          filter: "blur(8px)",
                        }
                      : {
                          opacity: 1,
                          x: 0,
                          y: 0,
                          rotate: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }
                  }
                  transition={{
                    delay: phase === "scattered" ? i * 0.08 : i * 0.06,
                    duration: phase === "scattered" ? 0.5 : 1.0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    display: "inline-block",
                    fontFamily: "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(4rem, 14vw, 9rem)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    color: "#FFFFFF",
                    textShadow: isAssembled
                      ? "0 0 80px rgba(0,122,255,0.4), 0 0 40px rgba(0,122,255,0.2)"
                      : "none",
                    background: isAssembled
                      ? "linear-gradient(180deg, #FFFFFF 20%, #B0D4FF 60%, #007AFF 100%)"
                      : "#FFFFFF",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    transition: "text-shadow 0.8s ease",
                  }}
                >
                  {letter}
                </motion.span>
              );
            })}
          </div>

          {isAssembled && (
            <>
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: 60,
                  height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(0,122,255,0.5), transparent)",
                  marginTop: 20,
                  borderRadius: 2,
                }}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-10"
                style={{ width: 140 }}
              >
                <div style={{
                  height: 1.5,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}>
                  <motion.div
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #007AFF, #5AC8FA)",
                      borderRadius: 4,
                      boxShadow: "0 0 12px rgba(0,122,255,0.4)",
                    }}
                    animate={{ width: `${loadProgress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  style={{
                    fontFamily: "'SF Pro Text', 'Inter', -apple-system, system-ui, sans-serif",
                    color: "rgba(255,255,255,0.18)",
                    fontSize: 10,
                    marginTop: 8,
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  {loadProgress >= 100 ? "Ready" : `${Math.round(loadProgress)}%`}
                </motion.p>
              </motion.div>
            </>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isAssembled ? 1 : 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-5 left-0 right-0 text-center"
          style={{
            color: "rgba(255,255,255,0.08)",
            fontSize: 10,
            fontFamily: "'SF Pro Text', 'Inter', -apple-system, system-ui, sans-serif",
            letterSpacing: "0.15em",
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
