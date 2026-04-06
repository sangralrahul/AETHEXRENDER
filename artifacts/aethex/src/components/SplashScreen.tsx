import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPLASH_KEY = "aethex_splash_seen";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"video" | "fading">("video");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const completedRef = useRef(false);
  const timersRef = useRef<number[]>([]);

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
    addTimer(() => {
      setPhase("fading");
      addTimer(triggerComplete, 800);
    }, 6000);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [triggerComplete]);

  const handleSkip = () => {
    setPhase("fading");
    addTimer(triggerComplete, 600);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={handleSkip}
        style={{ background: "#000" }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onCanPlay={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: videoReady ? 1 : 0, transition: "opacity 0.5s" }}
          src={`${import.meta.env.BASE_URL}hero-video.mp4`}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.55) 100%)",
            zIndex: 1,
          }}
        />

        <div className="relative flex flex-col items-center text-center px-6" style={{ zIndex: 2 }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="font-bold tracking-tight"
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              letterSpacing: "-0.03em",
              textShadow: "0 2px 30px rgba(0,0,0,0.7)",
            }}
          >
            Welcome to{" "}
            <span style={{ color: "#007AFF" }}>AETHEX</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
            className="mt-4 max-w-md"
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
              textShadow: "0 1px 15px rgba(0,0,0,0.6)",
              lineHeight: 1.6,
            }}
          >
            India's Medical Platform for Doctors & Students
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.7, ease: "easeOut" }}
            className="mt-10"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
              className="group relative px-8 py-3.5 rounded-2xl font-semibold text-white overflow-hidden transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(0,122,255,0.9)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 30px rgba(0,122,255,0.4), 0 0 60px rgba(0,122,255,0.15)",
                fontSize: 16,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <span className="relative z-10">Enter AETHEX →</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: "linear-gradient(135deg, #007AFF, #5AC8FA)",
                }}
              />
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
            className="mt-6"
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 12,
            }}
          >
            Tap anywhere to skip
          </motion.p>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 h-1"
          style={{ background: "#007AFF", zIndex: 3 }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
        />
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
