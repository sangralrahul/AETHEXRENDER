import cadusGoldenImg from "@assets/2_1774982436152.webp";
import { cn } from "@/lib/utils";

interface CadusLogoProps {
  size?: "sm" | "md" | "lg";
  thinking?: boolean;
  className?: string;
  baseUrl?: string;
}

const SIZES = {
  sm: { box: 40, orbit: 16, orb: 2.5 },
  md: { box: 88, orbit: 36, orb: 3.5 },
  lg: { box: 120, orbit: 50, orb: 4.5 },
};

export default function CadusLogo({
  size = "md", thinking = false, className,
}: CadusLogoProps) {
  const { box, orbit, orb } = SIZES[size];
  const cx = box / 2;
  const cy = box / 2;

  return (
    <div
      className={cn("relative flex items-center justify-center shrink-0", className)}
      style={{ width: box, height: box }}
    >
      {/* Ambient glow ring when thinking */}
      {thinking && (
        <div style={{
          position: "absolute",
          inset: -8,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,194,168,0.2) 0%, transparent 68%)",
          animation: "cadus-glow-ring-pulse 2s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}

      {/* Golden caduceus — mix-blend-mode:screen removes the black background */}
      <img
        src={cadusGoldenImg}
        alt="Cadus AI"
        draggable={false}
        style={{
          width: box,
          height: box,
          objectFit: "contain",
          mixBlendMode: "screen",
          animation: thinking
            ? "cadus-golden-think 1.8s ease-in-out infinite"
            : "cadus-golden-idle 5s ease-in-out infinite",
          filter: thinking
            ? "drop-shadow(0 0 8px rgba(255,200,60,0.8)) drop-shadow(0 0 18px rgba(0,194,168,0.55)) brightness(1.3) saturate(1.2)"
            : "drop-shadow(0 0 3px rgba(255,200,60,0.5)) brightness(1.05)",
          transition: "filter 0.4s ease",
          userSelect: "none",
        }}
      />

      {/* Orbiting particles (thinking only, md/lg) */}
      {thinking && size !== "sm" && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: box,
            height: box,
            overflow: "visible",
            zIndex: 2,
            pointerEvents: "none",
          }}
          viewBox={`0 0 ${box} ${box}`}
        >
          <circle r={orb} fill="#00E5FF"
            style={{ filter: `drop-shadow(0 0 ${orb}px #00E5FF)`, opacity: 0.9 }}>
            <animateMotion dur="2.8s" repeatCount="indefinite">
              <mpath href={`#cadus-orbit-cw-${size}`} />
            </animateMotion>
          </circle>
          <circle r={orb * 0.7} fill="#C084FC"
            style={{ filter: `drop-shadow(0 0 ${orb * 0.8}px #C084FC)`, opacity: 0.85 }}>
            <animateMotion dur="4.2s" begin="1.4s" repeatCount="indefinite">
              <mpath href={`#cadus-orbit-ccw-${size}`} />
            </animateMotion>
          </circle>
          <defs>
            <path id={`cadus-orbit-cw-${size}`}
              d={`M${cx},${cy - orbit} A${orbit},${orbit} 0 1,1 ${cx - 0.01},${cy - orbit} Z`}
              fill="none" />
            <path id={`cadus-orbit-ccw-${size}`}
              d={`M${cx},${cy - orbit * 0.75} A${orbit * 0.75},${orbit * 0.75} 0 1,0 ${cx - 0.01},${cy - orbit * 0.75} Z`}
              fill="none" />
          </defs>
        </svg>
      )}
    </div>
  );
}
