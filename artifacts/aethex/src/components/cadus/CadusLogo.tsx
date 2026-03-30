import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface CadusLogoProps {
  size?: "sm" | "md" | "lg";
  thinking?: boolean;
  className?: string;
  baseUrl?: string;
}

const SIZES = {
  sm: { outer: 32,  inner: 26,  ring1: 30,  ring2: 27,  stroke1: 1.6, stroke2: 1.2, nodeR: 1.1, edgeW: 0.7 },
  md: { outer: 80,  inner: 64,  ring1: 78,  ring2: 72,  stroke1: 3,   stroke2: 2,   nodeR: 2.8, edgeW: 1.5 },
  lg: { outer: 112, inner: 92,  ring1: 110, ring2: 100, stroke1: 3.5, stroke2: 2.5, nodeR: 3.8, edgeW: 2   },
};

/* ── Neural brain node positions (in 0-100 coordinate space) ── */
const RAW_NODES = [
  { x: 30, y: 16 },  // 0 top-left crown
  { x: 50, y: 10 },  // 1 top crown peak
  { x: 66, y: 16 },  // 2 top-right crown
  { x: 78, y: 30 },  // 3 upper-right corner
  { x: 17, y: 34 },  // 4 left outer upper
  { x: 38, y: 28 },  // 5 inner upper-left
  { x: 57, y: 28 },  // 6 inner upper-right
  { x: 83, y: 48 },  // 7 right outer mid
  { x: 22, y: 52 },  // 8 left mid
  { x: 46, y: 47 },  // 9 center
  { x: 67, y: 48 },  // 10 inner right
  { x: 27, y: 66 },  // 11 left lower
  { x: 50, y: 64 },  // 12 center lower
  { x: 69, y: 62 },  // 13 right lower
  { x: 38, y: 79 },  // 14 bottom left
  { x: 60, y: 77 },  // 15 bottom right
  { x: 53, y: 91 },  // 16 brainstem
];

const EDGES = [
  [0, 1], [1, 2], [2, 3],          // top crown arc
  [0, 4], [4, 8], [8, 11], [11,14], // left outline
  [3, 7], [7, 10], [10,13], [13,15], // right outline
  [0, 5], [1, 5], [1, 6], [2, 6],   // upper inner triangle
  [4, 5], [5, 6], [3, 6],           // upper mesh
  [5, 9], [6, 10],                   // mid inner
  [8, 9], [9, 10],                   // center row
  [11, 12], [12, 13],                // lower row
  [9, 12], [10, 13],                 // center to lower
  [11, 14], [12, 14], [12, 15], [13, 15], // bottom mesh
  [14, 16], [15, 16],               // brainstem
];

/* Interpolate between cyan and purple based on x position */
function nodeColor(x: number): string {
  const t = Math.max(0, Math.min(1, (x - 15) / 70));
  const r = Math.round(34  + (168 - 34)  * t);
  const g = Math.round(211 + (85  - 211) * t);
  const b = Math.round(238 + (247 - 238) * t);
  return `rgb(${r},${g},${b})`;
}

export default function CadusLogo({
  size = "md", thinking = false, className, baseUrl = "",
}: CadusLogoProps) {
  const d = SIZES[size];
  const half = d.outer / 2;
  const canvasSize = d.inner;
  const scale = canvasSize / 100;

  const arc1R = d.ring1 / 2 - 1;
  const arc2R = d.ring2 / 2 - 1;
  const arc3R = (arc1R + arc2R) / 2;
  const dash1 = Math.PI * arc1R * 2;
  const dash2 = Math.PI * arc2R * 2;
  const dash3 = Math.PI * arc3R * 2;

  const speed1 = thinking ? "1.3s"  : "5s";
  const speed2 = thinking ? "2.0s"  : "8s";
  const speed3 = thinking ? "0.85s" : "3.5s";
  const glowSpeed = thinking ? "0.9s" : "2.5s";
  const breatheSpeed = thinking ? "0.8s" : "3s";

  return (
    <div
      className={cn("relative flex items-center justify-center shrink-0", className)}
      style={{ width: d.outer, height: d.outer }}
    >
      {/* Outer glow halo */}
      <div className="absolute inset-0 rounded-full"
        style={{ animation: `cadus-glow-ring ${glowSpeed} ease-in-out infinite`, opacity: thinking ? 1 : 0.4 }} />

      {/* ── Orbiting rings (SVG, overflow:visible so rings extend past boundary) ── */}
      <svg
        width={d.outer} height={d.outer}
        viewBox={`0 0 ${d.outer} ${d.outer}`}
        className="absolute inset-0"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id={`cadus-glow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={thinking ? "2.5" : "1.5"} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ring 1 — CW, teal */}
        <g style={{ transformOrigin: `${half}px ${half}px`, animation: `cadus-orbit-cw ${speed1} linear infinite` }}>
          <circle cx={half} cy={half} r={arc1R} fill="none" strokeWidth={d.stroke1}
            strokeDasharray={`${dash1 * 0.35} ${dash1 * 0.65}`} strokeLinecap="round"
            style={{
              stroke: "#00BCD4", opacity: thinking ? 0.92 : 0.55,
              animation: thinking ? "cadus-color-shift 2.5s linear infinite" : undefined,
            }} />
        </g>

        {/* Ring 2 — CCW, violet */}
        <g style={{ transformOrigin: `${half}px ${half}px`, animation: `cadus-orbit-ccw ${speed2} linear infinite` }}>
          <circle cx={half} cy={half} r={arc2R} fill="none" strokeWidth={d.stroke2}
            strokeDasharray={`${dash2 * 0.25} ${dash2 * 0.75}`} strokeLinecap="round"
            style={{ stroke: "#7C3AED", opacity: thinking ? 0.8 : 0.35 }} />
        </g>

        {/* Ring 3 — CW, emerald, only while thinking */}
        {thinking && (
          <g style={{ transformOrigin: `${half}px ${half}px`, animation: `cadus-orbit-cw ${speed3} linear infinite` }}>
            <circle cx={half} cy={half} r={arc3R} fill="none" strokeWidth={d.stroke2 * 0.7}
              strokeDasharray={`${dash3 * 0.18} ${dash3 * 0.82}`} strokeLinecap="round"
              style={{ stroke: "#10B981", opacity: 0.72 }} />
          </g>
        )}

        {/* Racing dot — ring 1 */}
        <g style={{ transformOrigin: `${half}px ${half}px`, animation: `cadus-orbit-cw ${speed1} linear infinite` }}>
          <circle cx={half} cy={half - arc1R} r={thinking ? d.stroke1 * 1.5 : d.stroke1}
            fill={thinking ? "#00E5FF" : "#00BCD480"}
            style={{ filter: thinking ? "drop-shadow(0 0 3px #00E5FF)" : undefined }} />
        </g>

        {/* Racing dot — ring 2 */}
        <g style={{ transformOrigin: `${half}px ${half}px`, animation: `cadus-orbit-ccw ${speed2} linear infinite` }}>
          <circle cx={half} cy={half - arc2R} r={thinking ? d.stroke1 : d.stroke1 * 0.7}
            fill={thinking ? "#A855F7" : "#7C3AED60"}
            style={{ filter: thinking ? "drop-shadow(0 0 3px #A855F7)" : undefined }} />
        </g>
      </svg>

      {/* ── Neural brain (center, behind rings visually but inside SVG container) ── */}
      <div
        className="z-10 flex items-center justify-center"
        style={{
          width: canvasSize, height: canvasSize,
          animation: `cadus-breathe ${breatheSpeed} ease-in-out infinite`,
          filter: thinking
            ? "drop-shadow(0 0 8px rgba(0,188,212,0.5)) drop-shadow(0 0 16px rgba(168,85,247,0.3))"
            : "drop-shadow(0 0 4px rgba(0,188,212,0.25))",
        }}
      >
        <svg
          width={canvasSize} height={canvasSize}
          viewBox="0 0 100 100"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Gradient for edges */}
            <linearGradient id={`brain-edge-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#22D3EE" stopOpacity={thinking ? 0.85 : 0.6} />
              <stop offset="50%"  stopColor="#818CF8" stopOpacity={thinking ? 0.75 : 0.5} />
              <stop offset="100%" stopColor="#A855F7" stopOpacity={thinking ? 0.85 : 0.6} />
            </linearGradient>

            {/* Glow filter for nodes */}
            <filter id={`node-glow-${size}`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation={thinking ? "2.5" : "1.5"} result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            {/* Edge glow */}
            <filter id={`edge-glow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={thinking ? "1.2" : "0.6"} result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Edges (connections between nodes) */}
          <g filter={`url(#edge-glow-${size})`}>
            {EDGES.map(([a, b], i) => {
              const na = RAW_NODES[a];
              const nb = RAW_NODES[b];
              return (
                <line
                  key={i}
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={`url(#brain-edge-grad-${size})`}
                  strokeWidth={d.edgeW}
                  strokeLinecap="round"
                  style={{
                    opacity: thinking ? 0.85 : 0.55,
                    animation: thinking
                      ? `cadus-breathe ${1.8 + (i % 5) * 0.25}s ease-in-out infinite alternate`
                      : undefined,
                  }}
                />
              );
            })}
          </g>

          {/* Nodes */}
          {RAW_NODES.map((n, i) => {
            const color = nodeColor(n.x);
            const pulseDelay = `${(i * 0.15) % 1.5}s`;
            return (
              <g key={i} filter={`url(#node-glow-${size})`}>
                {/* Glow halo behind node */}
                <circle
                  cx={n.x} cy={n.y}
                  r={d.nodeR * (thinking ? 2.8 : 2)}
                  fill={color}
                  opacity={thinking ? 0.25 : 0.12}
                  style={{
                    animation: thinking
                      ? `cadus-pulse-glow ${0.9 + (i % 3) * 0.2}s ease-in-out infinite alternate`
                      : undefined,
                    animationDelay: pulseDelay,
                  }}
                />
                {/* Main node */}
                <circle
                  cx={n.x} cy={n.y}
                  r={d.nodeR * (thinking ? 1.15 : 1)}
                  fill={color}
                  style={{
                    animation: thinking
                      ? `cadus-breathe ${0.85 + (i % 4) * 0.18}s ease-in-out infinite`
                      : undefined,
                    animationDelay: pulseDelay,
                  }}
                />
                {/* White sparkle center on brightest nodes when thinking */}
                {thinking && (n.x < 35 || (n.x > 45 && n.x < 55 && n.y < 30)) && (
                  <circle cx={n.x} cy={n.y} r={d.nodeR * 0.45} fill="white" opacity={0.85}
                    style={{ animation: `cadus-pulse-glow 1.1s ease-in-out infinite alternate`, animationDelay: pulseDelay }} />
                )}
              </g>
            );
          })}

          {/* Neural impulse — a bright dot traveling along edges when thinking */}
          {thinking && (
            <circle r={d.nodeR * 1.3} fill="#00E5FF" opacity={0.9}
              style={{ filter: "drop-shadow(0 0 4px #00E5FF)", animation: "cadus-neural-pulse 2s linear infinite" }}>
              <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#brain-path-travel" />
              </animateMotion>
            </circle>
          )}
          {/* Violet impulse on different path */}
          {thinking && (
            <circle r={d.nodeR * 1.1} fill="#A855F7" opacity={0.85}
              style={{ filter: "drop-shadow(0 0 4px #A855F7)" }}>
              <animateMotion dur="3s" begin="1s" repeatCount="indefinite" rotate="auto">
                <mpath href="#brain-path-travel-2" />
              </animateMotion>
            </circle>
          )}

          {/* Hidden paths for animateMotion */}
          <defs>
            <path id="brain-path-travel"
              d="M30,16 L50,10 L66,16 L78,30 L83,48 L67,48 L50,64 L38,79 L53,91 L60,77 L69,62 L50,64 L27,66 L22,52 L17,34 L30,16"
              fill="none" />
            <path id="brain-path-travel-2"
              d="M46,47 L38,28 L57,28 L67,48 L46,47 L22,52 L38,79 L46,47"
              fill="none" />
          </defs>
        </svg>
      </div>
    </div>
  );
}
