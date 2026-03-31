import { cn } from "@/lib/utils";

interface CadusLogoProps {
  size?: "sm" | "md" | "lg";
  thinking?: boolean;
  className?: string;
  baseUrl?: string;
}

const SIZES = {
  sm: { box: 32,  stroke: 1.0 },
  md: { box: 80,  stroke: 1.8 },
  lg: { box: 112, stroke: 2.2 },
};

export default function CadusLogo({
  size = "md", thinking = false, className,
}: CadusLogoProps) {
  const { box } = SIZES[size];
  const uid = `cadus-${size}`;

  return (
    <div
      className={cn("relative flex items-center justify-center shrink-0", className)}
      style={{
        width: box, height: box,
        filter: thinking
          ? "drop-shadow(0 0 12px rgba(0,194,168,0.8)) drop-shadow(0 0 28px rgba(168,85,247,0.5))"
          : "drop-shadow(0 0 3px rgba(0,194,168,0.3))",
        transition: "filter 0.4s ease",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={box}
        height={box}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          overflow: "visible",
          animation: thinking ? "cadus-breathe 1.8s ease-in-out infinite" : undefined,
          transformOrigin: "50px 55px",
        }}
      >
        <defs>
          <linearGradient id={`${uid}-grad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#A855F7" />
            <stop offset="50%"  stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#00C2A8" />
          </linearGradient>

          <linearGradient id={`${uid}-wing`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#A855F7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.6" />
          </linearGradient>

          <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={thinking ? "2.8" : "1.2"} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={`${uid}-staff-glow`} x="-60%" y="-10%" width="220%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Staff (central rod) ───────────────────────────────── */}
        <g style={{
          animation: thinking ? "cadus-staff-pulse 1.2s ease-in-out infinite alternate" : undefined,
          transformOrigin: "50px 55px",
        }}>
          <line
            x1="50" y1="88" x2="50" y2="22"
            stroke={`url(#${uid}-grad)`}
            strokeWidth={thinking ? "3.4" : "2.6"}
            strokeLinecap="round"
            filter={`url(#${uid}-staff-glow)`}
            style={{ opacity: thinking ? 1 : 0.85 }}
          />
          {/* Staff top knob */}
          <circle cx="50" cy="21" r={thinking ? "4.5" : "3.2"}
            fill={`url(#${uid}-grad)`}
            filter={`url(#${uid}-glow)`}
            style={{
              opacity: thinking ? 1 : 0.9,
              animation: thinking ? "cadus-knob-pulse 0.6s ease-in-out infinite alternate" : undefined,
              transformOrigin: "50px 21px",
            }}
          />
          {/* Staff bottom knob */}
          <circle cx="50" cy="88" r={thinking ? "3.5" : "2.6"}
            fill={`url(#${uid}-grad)`}
            style={{
              opacity: thinking ? 0.9 : 0.7,
              animation: thinking ? "cadus-knob-pulse 0.6s ease-in-out 0.3s infinite alternate" : undefined,
              transformOrigin: "50px 88px",
            }}
          />
        </g>

        {/* ── Left Wing ────────────────────────────────────────────── */}
        <g style={{
          animation: thinking ? "cadus-wing-beat 0.65s ease-in-out infinite alternate" : undefined,
          transformOrigin: "50px 28px",
        }}>
          <path
            d="M50,26 C42,20 28,16 18,20 C24,24 34,28 42,30 C34,30 22,28 14,34 C20,36 32,34 42,34"
            fill="none"
            stroke={`url(#${uid}-wing)`}
            strokeWidth={thinking ? "2.4" : "1.8"}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${uid}-glow)`}
            style={{ opacity: thinking ? 1 : 0.75 }}
          />
          <path
            d="M50,28 C44,24 34,22 26,24 C31,27 40,29 46,30"
            fill="none"
            stroke={`url(#${uid}-wing)`}
            strokeWidth={thinking ? "1.5" : "1.1"}
            strokeLinecap="round"
            style={{ opacity: thinking ? 0.8 : 0.5 }}
          />
        </g>

        {/* ── Right Wing ───────────────────────────────────────────── */}
        <g style={{
          animation: thinking ? "cadus-wing-beat-r 0.65s ease-in-out infinite alternate" : undefined,
          transformOrigin: "50px 28px",
        }}>
          <path
            d="M50,26 C58,20 72,16 82,20 C76,24 66,28 58,30 C66,30 78,28 86,34 C80,36 68,34 58,34"
            fill="none"
            stroke={`url(#${uid}-wing)`}
            strokeWidth={thinking ? "2.4" : "1.8"}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${uid}-glow)`}
            style={{ opacity: thinking ? 1 : 0.75 }}
          />
          <path
            d="M50,28 C56,24 66,22 74,24 C69,27 60,29 54,30"
            fill="none"
            stroke={`url(#${uid}-wing)`}
            strokeWidth={thinking ? "1.5" : "1.1"}
            strokeLinecap="round"
            style={{ opacity: thinking ? 0.8 : 0.5 }}
          />
        </g>

        {/* ── Serpent 1 (left coil — teal) ─────────────────────── */}
        <g style={{ animation: thinking ? "cadus-snake-bob 0.38s ease-in-out infinite" : undefined }}>
          <path
            d="M44,34 C36,40 36,46 44,50 C52,54 52,60 44,64 C38,68 36,74 42,80 C44,82 47,84 50,85"
            fill="none"
            stroke="#22D3EE"
            strokeWidth={thinking ? "2.8" : "2.2"}
            strokeLinecap="round"
            filter={`url(#${uid}-glow)`}
            style={{ opacity: thinking ? 0.95 : 0.72 }}
          />
          <ellipse cx="43" cy="33" rx={thinking ? "3.5" : "2.8"} ry={thinking ? "2.2" : "1.8"}
            fill="#22D3EE" transform="rotate(-20 43 33)"
            filter={`url(#${uid}-glow)`}
            style={{ opacity: thinking ? 1 : 0.8 }}
          />
          {thinking && (
            <circle cx="42" cy="32" r="0.9" fill="white" opacity="0.95" />
          )}
          <path d="M40,34 L37,35 M40,34 L37,33"
            stroke="#22D3EE" strokeWidth="1" strokeLinecap="round"
            style={{ opacity: thinking ? 0.9 : 0 }} />
        </g>

        {/* ── Serpent 2 (right coil — purple) ──────────────────── */}
        <g style={{ animation: thinking ? "cadus-snake-bob 0.38s ease-in-out 0.19s infinite" : undefined }}>
          <path
            d="M56,34 C64,40 64,46 56,50 C48,54 48,60 56,64 C62,68 64,74 58,80 C56,82 53,84 50,85"
            fill="none"
            stroke="#A855F7"
            strokeWidth={thinking ? "2.8" : "2.2"}
            strokeLinecap="round"
            filter={`url(#${uid}-glow)`}
            style={{ opacity: thinking ? 0.95 : 0.72 }}
          />
          <ellipse cx="57" cy="33" rx={thinking ? "3.5" : "2.8"} ry={thinking ? "2.2" : "1.8"}
            fill="#A855F7" transform="rotate(20 57 33)"
            filter={`url(#${uid}-glow)`}
            style={{ opacity: thinking ? 1 : 0.8 }}
          />
          {thinking && (
            <circle cx="58" cy="32" r="0.9" fill="white" opacity="0.95" />
          )}
          <path d="M60,34 L63,35 M60,34 L63,33"
            stroke="#A855F7" strokeWidth="1" strokeLinecap="round"
            style={{ opacity: thinking ? 0.9 : 0 }} />
        </g>

        {/* ── Coil crossing diamonds ────────────────────────────── */}
        {[50, 64].map((y, i) => (
          <circle key={i} cx="50" cy={y} r={thinking ? "2.4" : "1.6"}
            fill={i === 0 ? "#22D3EE" : "#A855F7"}
            style={{
              opacity: thinking ? 0.85 : 0.45,
              animation: thinking
                ? `cadus-diamond-pop ${0.5 + i * 0.15}s ease-in-out ${i * 0.25}s infinite alternate`
                : undefined,
              transformOrigin: `50px ${y}px`,
            }}
          />
        ))}

        {/* ── Thinking-only: energy rings ───────────────────────── */}
        {thinking && (
          <>
            <circle cx="50" cy="55" r="43"
              fill="none" stroke="#22D3EE" strokeWidth="0.7"
              strokeDasharray="5 9"
              strokeLinecap="round"
              opacity="0.3"
            >
              <animateTransform attributeName="transform" type="rotate"
                from="0 50 55" to="360 50 55" dur="3.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="55" r="36"
              fill="none" stroke="#A855F7" strokeWidth="0.55"
              strokeDasharray="3 11"
              strokeLinecap="round"
              opacity="0.25"
            >
              <animateTransform attributeName="transform" type="rotate"
                from="0 50 55" to="-360 50 55" dur="5s" repeatCount="indefinite" />
            </circle>
            <circle r="2.8" fill="#00E5FF"
              style={{ filter: "drop-shadow(0 0 5px #00E5FF)", opacity: 0.9 }}>
              <animateMotion dur="3.5s" repeatCount="indefinite">
                <mpath href={`#${uid}-orbit1`} />
              </animateMotion>
            </circle>
            <circle r="2.2" fill="#C084FC"
              style={{ filter: "drop-shadow(0 0 5px #C084FC)", opacity: 0.85 }}>
              <animateMotion dur="5s" begin="2.5s" repeatCount="indefinite">
                <mpath href={`#${uid}-orbit2`} />
              </animateMotion>
            </circle>
            <defs>
              <path id={`${uid}-orbit1`} d="M50,12 A43,43 0 1,1 49.9,12 Z" fill="none" />
              <path id={`${uid}-orbit2`} d="M50,19 A36,36 0 1,0 49.9,19 Z" fill="none" />
            </defs>
          </>
        )}
      </svg>
    </div>
  );
}
