import { cn } from "@/lib/utils";

interface SynapseLogoProps {
  size?: "sm" | "md" | "lg";
  thinking?: boolean;
  className?: string;
  baseUrl?: string;
}

const SIZES = {
  sm: { outer: 32, inner: 26,  ring1: 30, ring2: 28, stroke1: 1.6, stroke2: 1.2 },
  md: { outer: 80, inner: 64,  ring1: 78, ring2: 72, stroke1: 3,   stroke2: 2   },
  lg: { outer: 96, inner: 78,  ring1: 94, ring2: 86, stroke1: 3.5, stroke2: 2.5 },
};

export default function SynapseLogo({
  size = "md",
  thinking = false,
  className,
  baseUrl = "",
}: SynapseLogoProps) {
  const d = SIZES[size];
  const half = d.outer / 2;

  const arc1R = d.ring1 / 2 - 1;
  const arc2R = d.ring2 / 2 - 1;
  const arc3R = (d.ring1 / 2 + d.ring2 / 2) / 2;

  const dashLen = Math.PI * arc1R * 2;
  const dashLen2 = Math.PI * arc2R * 2;
  const dashLen3 = Math.PI * arc3R * 2;

  const speed1 = thinking ? "1.4s" : "5s";
  const speed2 = thinking ? "2.1s" : "8s";
  const speed3 = thinking ? "0.9s" : "3.5s";
  const glowSpeed = thinking ? "0.9s" : "2.5s";
  const breatheSpeed = thinking ? "0.8s" : "3s";

  return (
    <div
      className={cn("relative flex items-center justify-center shrink-0", className)}
      style={{ width: d.outer, height: d.outer }}
    >
      {/* Outer glow pulse */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          animation: `synapse-glow-ring ${glowSpeed} ease-in-out infinite`,
          opacity: thinking ? 1 : 0.5,
        }}
      />

      {/* SVG rings */}
      <svg
        width={d.outer}
        height={d.outer}
        viewBox={`0 0 ${d.outer} ${d.outer}`}
        className="absolute inset-0"
        style={{ overflow: "visible" }}
      >
        {/* Ring 1 — clockwise fast, teal */}
        <g
          style={{
            transformOrigin: `${half}px ${half}px`,
            animation: `synapse-orbit-cw ${speed1} linear infinite`,
          }}
        >
          <circle
            cx={half}
            cy={half}
            r={arc1R}
            fill="none"
            strokeWidth={d.stroke1}
            strokeDasharray={`${dashLen * 0.35} ${dashLen * 0.65}`}
            strokeLinecap="round"
            style={{
              stroke: thinking ? "#00BCD4" : "#00BCD4",
              opacity: thinking ? 0.9 : 0.55,
              animation: thinking
                ? `synapse-color-shift 2.5s linear infinite`
                : undefined,
            }}
          />
        </g>

        {/* Ring 2 — counter-clockwise, indigo */}
        <g
          style={{
            transformOrigin: `${half}px ${half}px`,
            animation: `synapse-orbit-ccw ${speed2} linear infinite`,
          }}
        >
          <circle
            cx={half}
            cy={half}
            r={arc2R}
            fill="none"
            strokeWidth={d.stroke2}
            strokeDasharray={`${dashLen2 * 0.25} ${dashLen2 * 0.75}`}
            strokeLinecap="round"
            style={{
              stroke: "#7C3AED",
              opacity: thinking ? 0.75 : 0.35,
            }}
          />
        </g>

        {/* Ring 3 — clockwise slow, emerald, only when thinking */}
        {thinking && (
          <g
            style={{
              transformOrigin: `${half}px ${half}px`,
              animation: `synapse-orbit-cw ${speed3} linear infinite`,
            }}
          >
            <circle
              cx={half}
              cy={half}
              r={arc3R}
              fill="none"
              strokeWidth={d.stroke2 * 0.7}
              strokeDasharray={`${dashLen3 * 0.18} ${dashLen3 * 0.82}`}
              strokeLinecap="round"
              style={{ stroke: "#10B981", opacity: 0.7 }}
            />
          </g>
        )}

        {/* Moving dot on ring 1 */}
        <g
          style={{
            transformOrigin: `${half}px ${half}px`,
            animation: `synapse-orbit-cw ${speed1} linear infinite`,
          }}
        >
          <circle
            cx={half}
            cy={half - arc1R}
            r={thinking ? d.stroke1 * 1.4 : d.stroke1}
            fill={thinking ? "#00BCD4" : "#00BCD480"}
            style={{
              filter: thinking ? "drop-shadow(0 0 3px #00BCD4)" : undefined,
            }}
          />
        </g>

        {/* Moving dot on ring 2 */}
        <g
          style={{
            transformOrigin: `${half}px ${half}px`,
            animation: `synapse-orbit-ccw ${speed2} linear infinite`,
          }}
        >
          <circle
            cx={half}
            cy={half - arc2R}
            r={thinking ? d.stroke1 : d.stroke1 * 0.7}
            fill={thinking ? "#7C3AED" : "#7C3AED60"}
            style={{
              filter: thinking ? "drop-shadow(0 0 3px #7C3AED)" : undefined,
            }}
          />
        </g>
      </svg>

      {/* Central image */}
      <div
        className="rounded-full overflow-hidden z-10"
        style={{
          width: d.inner,
          height: d.inner,
          animation: `synapse-breathe ${breatheSpeed} ease-in-out infinite`,
          boxShadow: thinking
            ? "0 0 12px 2px rgba(0,188,212,0.25)"
            : "0 0 6px 1px rgba(0,188,212,0.1)",
        }}
      >
        <img
          src={`${baseUrl}synapse-logo.jpg`}
          alt="SYNAPSE"
          className="w-full h-full object-cover"
          style={{
            animation: thinking
              ? `synapse-pulse-glow ${glowSpeed} ease-in-out infinite`
              : undefined,
          }}
        />
      </div>
    </div>
  );
}
