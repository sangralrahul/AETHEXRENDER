import cadusImg from "@assets/2_1774983076859.png";
import { cn } from "@/lib/utils";

interface CadusLogoProps {
  size?: "sm" | "md" | "lg";
  thinking?: boolean;
  className?: string;
  baseUrl?: string;
}

const SIZES = {
  sm: { box: 38, orbit: 15, orb: 2.4 },
  md: { box: 96, orbit: 40, orb: 4 },
  lg: { box: 140, orbit: 58, orb: 5.2 },
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
      {/* Outer glow halo */}
      <div style={{
        position: "absolute",
        inset: -10,
        borderRadius: "50%",
        background: thinking
          ? "radial-gradient(circle, rgba(255,190,40,0.18) 0%, rgba(0,194,168,0.12) 50%, transparent 72%)"
          : "radial-gradient(circle, rgba(255,190,40,0.06) 0%, transparent 65%)",
        animation: thinking
          ? "cadus-glow-ring-pulse 1.6s ease-in-out infinite"
          : "cadus-logo-idle-glow 4s ease-in-out infinite",
        transition: "background 0.5s ease",
        pointerEvents: "none",
      }} />

      {/* Original caduceus image */}
      <img
        src={cadusImg}
        alt="Cadus AI"
        draggable={false}
        style={{
          width: box,
          height: box,
          objectFit: "contain",
          mixBlendMode: "screen",
          filter: thinking
            ? "brightness(1.6) contrast(8) saturate(1.4) drop-shadow(0 0 10px rgba(255,200,50,0.9)) drop-shadow(0 0 24px rgba(255,160,0,0.55))"
            : "brightness(1.3) contrast(8) saturate(1.1) drop-shadow(0 0 4px rgba(255,190,30,0.4))",
          animation: thinking
            ? "cadus-logo-think 1.8s ease-in-out infinite"
            : "cadus-logo-breathe 3.5s ease-in-out infinite",
          transition: "filter 0.5s ease",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Orbiting glow particles when thinking (md / lg only) */}
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
          <circle r={orb} fill="#FFD54F"
            style={{ filter: `drop-shadow(0 0 ${orb + 2}px rgba(255,210,60,0.9))`, opacity: 0.95 }}>
            <animateMotion dur="2.6s" repeatCount="indefinite">
              <mpath href={`#cadus-cw-${size}`} />
            </animateMotion>
          </circle>
          <circle r={orb * 0.7} fill="#00E5FF"
            style={{ filter: `drop-shadow(0 0 ${orb}px rgba(0,229,255,0.85))`, opacity: 0.88 }}>
            <animateMotion dur="4s" begin="1.3s" repeatCount="indefinite">
              <mpath href={`#cadus-ccw-${size}`} />
            </animateMotion>
          </circle>
          <defs>
            <path id={`cadus-cw-${size}`}
              d={`M${cx},${cy - orbit} A${orbit},${orbit} 0 1,1 ${cx - 0.01},${cy - orbit} Z`}
              fill="none" />
            <path id={`cadus-ccw-${size}`}
              d={`M${cx},${cy - orbit * 0.72} A${orbit * 0.72},${orbit * 0.72} 0 1,0 ${cx - 0.01},${cy - orbit * 0.72} Z`}
              fill="none" />
          </defs>
        </svg>
      )}
    </div>
  );
}
