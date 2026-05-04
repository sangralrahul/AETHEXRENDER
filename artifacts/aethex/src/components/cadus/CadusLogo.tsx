import { useId } from "react";
import { cn } from "@/lib/utils";

interface CadusLogoProps {
  size?: "sm" | "md" | "lg";
  thinking?: boolean;
  className?: string;
  baseUrl?: string;
}

/* Rendered icon size inside the dark container */
const SIZE_MAP = { sm: 20, md: 56, lg: 84 };

export default function CadusLogo({
  size = "md",
  thinking = false,
  className,
}: CadusLogoProps) {
  const rawId = useId();
  const uid   = rawId.replace(/[^a-z0-9]/gi, "");
  const s     = SIZE_MAP[size];
  const cx    = s / 2;
  const cy    = s / 2;

  /* ── Arc geometry (bold "C" opening to the right) ── */
  const r        = s * 0.375;                // arc radius
  const openDeg  = 48;                       // opening half-angle in degrees
  const openRad  = (openDeg * Math.PI) / 180;
  const endX     = cx + r * Math.cos(openRad);
  const topY     = cy - r * Math.sin(openRad);
  const botY     = cy + r * Math.sin(openRad);
  const sw       = Math.max(s * 0.165, 2.2); // arc stroke width

  /* Neural dot cluster in the gap (right side) */
  const gapX    = cx + r * Math.cos(openRad * 0.3) + sw * 0.55;
  const dotR    = Math.max(s * 0.052, 1.1);

  /* Cross-bar accent at the center of the C */
  const barLen  = r * 0.52;
  const barY    = cy;
  const barSW   = Math.max(s * 0.075, 1.2);

  /* IDs */
  const wGradId  = `wg-${uid}`;
  const tGradId  = `tg-${uid}`;
  const gGradId  = `gg-${uid}`;
  const glowId   = `glow-${uid}`;
  const nGlowId  = `ng-${uid}`;

  return (
    <div
      className={cn("relative flex items-center justify-center shrink-0", className)}
      style={{ width: s, height: s }}
    >
      <svg
        width={s} height={s}
        viewBox={`0 0 ${s} ${s}`}
        overflow="visible"
        aria-label="Cadus AI"
      >
        <defs>
          {/* White-to-teal gradient along the arc */}
          <linearGradient id={wGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFFFFF"  stopOpacity="0.96" />
            <stop offset="60%"  stopColor="#D0F5F0"  stopOpacity="0.90" />
            <stop offset="100%" stopColor="#00C2A8"  stopOpacity="0.85" />
          </linearGradient>

          {/* Teal for nodes */}
          <linearGradient id={tGradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#00E5CC" />
            <stop offset="100%" stopColor="#00AACC" />
          </linearGradient>

          {/* Gold for crossbar end dots */}
          <linearGradient id={gGradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#FFE082" />
            <stop offset="100%" stopColor="#FFB300" />
          </linearGradient>

          {/* Arc glow */}
          <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={thinking ? 1.2 : 0.6} result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Node glow */}
          <filter id={nGlowId} x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={thinking ? 2 : 0.9} result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Bold "C" arc ── */}
        <path
          d={`M ${endX} ${topY} A ${r} ${r} 0 1 0 ${endX} ${botY}`}
          fill="none"
          stroke={`url(#${wGradId})`}
          strokeWidth={sw}
          strokeLinecap="round"
          filter={`url(#${glowId})`}
        />

        {/* ── Horizontal cross-bar (the medical cross element) ── */}
        <line
          x1={cx - barLen * 0.6} y1={barY}
          x2={cx + barLen * 0.6} y2={barY}
          stroke={`url(#${tGradId})`}
          strokeWidth={barSW}
          strokeLinecap="round"
          opacity={0.75}
        />

        {/* ── Neural AI dots in the gap ── */}
        {/* Top dot */}
        <circle
          cx={gapX} cy={topY + (cy - topY) * 0.38}
          r={dotR * 1.15}
          fill={`url(#${tGradId})`}
          filter={`url(#${nGlowId})`}
        />
        {/* Center dot (larger — the primary node) */}
        <circle
          cx={gapX + dotR * 0.4} cy={cy}
          r={dotR * 1.5}
          fill={`url(#${tGradId})`}
          filter={`url(#${nGlowId})`}
        />
        {/* Bottom dot */}
        <circle
          cx={gapX} cy={botY - (botY - cy) * 0.38}
          r={dotR * 1.15}
          fill={`url(#${tGradId})`}
          filter={`url(#${nGlowId})`}
        />

        {/* ── Gold accent caps on the C arms ── */}
        <circle cx={endX} cy={topY} r={sw * 0.48}
          fill={`url(#${gGradId})`}
          style={{ filter: `drop-shadow(0 0 ${sw * 0.4}px rgba(255,190,30,0.8))` }}
        />
        <circle cx={endX} cy={botY} r={sw * 0.48}
          fill={`url(#${gGradId})`}
          style={{ filter: `drop-shadow(0 0 ${sw * 0.4}px rgba(255,190,30,0.8))` }}
        />

        {/* ── Thinking: rotating dashed outer ring ── */}
        {thinking && size !== "sm" && (
          <circle
            cx={cx} cy={cy}
            r={s * 0.47}
            fill="none"
            stroke="rgba(0,194,168,0.45)"
            strokeWidth={Math.max(s * 0.022, 0.7)}
            strokeDasharray={`${s * 0.18} ${s * 0.09}`}
            style={{ animation: "cadus-logo-think 2s linear infinite" }}
          />
        )}
      </svg>

      {/* ── Pulsing halo — thinking state only ── */}
      {thinking && (
        <div style={{
          position: "absolute",
          inset: -s * 0.22,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,194,168,0.30) 0%, rgba(0,194,168,0.07) 55%, transparent 72%)",
          animation: "cadus-glow-ring-pulse 1.6s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}

      {/* ── Idle breathe glow (md/lg only) ── */}
      {!thinking && size !== "sm" && (
        <div style={{
          position: "absolute",
          inset: -s * 0.1,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          animation: "cadus-logo-idle-glow 4s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}
    </div>
  );
}
