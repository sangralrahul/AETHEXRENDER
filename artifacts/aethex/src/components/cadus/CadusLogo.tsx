import { useId } from "react";
import { cn } from "@/lib/utils";

interface CadusLogoProps {
  size?: "sm" | "md" | "lg";
  thinking?: boolean;
  className?: string;
  baseUrl?: string;
}

const SIZE_MAP = { sm: 30, md: 68, lg: 100 };

export default function CadusLogo({
  size = "md",
  thinking = false,
  className,
}: CadusLogoProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-z0-9]/gi, "");

  const s = SIZE_MAP[size];
  const cx = s / 2;

  /* ── Caduceus geometry (relative to viewbox s×s) ── */
  const staffTop  = s * 0.12;
  const staffBot  = s * 0.90;
  const wingY     = s * 0.24;
  const cross1Y   = s * 0.42;
  const cross2Y   = s * 0.62;
  const amp       = s * 0.17;           // serpent lateral amplitude
  const sw        = Math.max(s * 0.065, 1.8); // staff width
  const snw       = Math.max(s * 0.052, 1.4); // serpent width

  /* IDs for gradients / filters */
  const tealId   = `teal-${uid}`;
  const goldId   = `gold-${uid}`;
  const glowId   = `glow-${uid}`;
  const tealDkId = `teald-${uid}`;
  const bgId     = `bg-${uid}`;

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
          {/* Teal gradient — top to bottom */}
          <linearGradient id={tealId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#00E5CC" />
            <stop offset="55%"  stopColor="#00C2A8" />
            <stop offset="100%" stopColor="#0099BB" />
          </linearGradient>

          {/* Teal dark (second serpent / accent) */}
          <linearGradient id={tealDkId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#00D4B8" />
            <stop offset="100%" stopColor="#0088AA" />
          </linearGradient>

          {/* Gold gradient — wings + orb */}
          <linearGradient id={goldId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#FFE082" />
            <stop offset="60%"  stopColor="#FFB300" />
            <stop offset="100%" stopColor="#E65100" stopOpacity="0.85" />
          </linearGradient>

          {/* Subtle orb bg behind the caduceus (md/lg only) */}
          <radialGradient id={bgId} cx="50%" cy="45%" r="50%">
            <stop offset="0%"   stopColor="#00C2A8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#00C2A8" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter for thinking state */}
          <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={thinking ? 1.6 : 0.9} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle background glow orb (md/lg) */}
        {size !== "sm" && (
          <ellipse cx={cx} cy={s * 0.48} rx={s * 0.42} ry={s * 0.44}
            fill={`url(#${bgId})`} />
        )}

        {/* ── Staff ── */}
        <line
          x1={cx} y1={staffTop + s * 0.04} x2={cx} y2={staffBot}
          stroke={`url(#${tealId})`}
          strokeWidth={sw}
          strokeLinecap="round"
          filter={`url(#${glowId})`}
        />

        {/* ── Serpent 1 (starts left → right) ── */}
        <path
          d={[
            `M ${cx - amp} ${staffTop + s * 0.12}`,
            `C ${cx + amp * 1.9} ${cross1Y - s * 0.12}`,
            `  ${cx + amp * 1.9} ${cross1Y + s * 0.05}`,
            `  ${cx} ${(cross1Y + cross2Y) / 2}`,
            `C ${cx - amp * 1.9} ${cross2Y - s * 0.05}`,
            `  ${cx - amp * 1.9} ${cross2Y + s * 0.12}`,
            `  ${cx + amp} ${staffBot - s * 0.06}`,
          ].join(" ")}
          fill="none"
          stroke={`url(#${tealId})`}
          strokeWidth={snw}
          strokeLinecap="round"
          opacity={0.92}
          filter={`url(#${glowId})`}
        />

        {/* ── Serpent 2 (starts right → left) ── */}
        <path
          d={[
            `M ${cx + amp} ${staffTop + s * 0.12}`,
            `C ${cx - amp * 1.9} ${cross1Y - s * 0.12}`,
            `  ${cx - amp * 1.9} ${cross1Y + s * 0.05}`,
            `  ${cx} ${(cross1Y + cross2Y) / 2}`,
            `C ${cx + amp * 1.9} ${cross2Y - s * 0.05}`,
            `  ${cx + amp * 1.9} ${cross2Y + s * 0.12}`,
            `  ${cx - amp} ${staffBot - s * 0.06}`,
          ].join(" ")}
          fill="none"
          stroke={`url(#${tealDkId})`}
          strokeWidth={snw}
          strokeLinecap="round"
          opacity={0.72}
        />

        {/* ── Wings — left ── */}
        <path
          d={[
            `M ${cx - s * 0.01} ${wingY}`,
            `L ${cx - s * 0.38} ${wingY - s * 0.10}`,
            `L ${cx - s * 0.26} ${wingY + s * 0.08}`,
            `L ${cx - s * 0.06} ${wingY + s * 0.04}`,
            `Z`,
          ].join(" ")}
          fill={`url(#${goldId})`}
          opacity={0.96}
        />
        {/* Second left feather */}
        <path
          d={[
            `M ${cx - s * 0.07} ${wingY + s * 0.04}`,
            `L ${cx - s * 0.32} ${wingY + s * 0.0}`,
            `L ${cx - s * 0.2} ${wingY + s * 0.12}`,
            `L ${cx - s * 0.04} ${wingY + s * 0.09}`,
            `Z`,
          ].join(" ")}
          fill={`url(#${goldId})`}
          opacity={0.55}
        />

        {/* ── Wings — right ── */}
        <path
          d={[
            `M ${cx + s * 0.01} ${wingY}`,
            `L ${cx + s * 0.38} ${wingY - s * 0.10}`,
            `L ${cx + s * 0.26} ${wingY + s * 0.08}`,
            `L ${cx + s * 0.06} ${wingY + s * 0.04}`,
            `Z`,
          ].join(" ")}
          fill={`url(#${goldId})`}
          opacity={0.96}
        />
        {/* Second right feather */}
        <path
          d={[
            `M ${cx + s * 0.07} ${wingY + s * 0.04}`,
            `L ${cx + s * 0.32} ${wingY + s * 0.0}`,
            `L ${cx + s * 0.2} ${wingY + s * 0.12}`,
            `L ${cx + s * 0.04} ${wingY + s * 0.09}`,
            `Z`,
          ].join(" ")}
          fill={`url(#${goldId})`}
          opacity={0.55}
        />

        {/* ── Globe / orb at top of staff ── */}
        <circle
          cx={cx} cy={staffTop + s * 0.01}
          r={s * 0.068}
          fill={`url(#${goldId})`}
          style={{
            filter: thinking
              ? `drop-shadow(0 0 ${s * 0.05}px rgba(255,200,50,0.95))`
              : `drop-shadow(0 0 ${s * 0.025}px rgba(255,180,30,0.6))`,
          }}
        />

        {/* ── Crossing nodes (AI emphasis) ── */}
        {[cross1Y, cross2Y].map((ny, i) => (
          <g key={i}>
            {/* Outer ring */}
            <circle cx={cx} cy={ny} r={s * 0.065}
              fill="none"
              stroke="#00C2A8"
              strokeWidth={Math.max(s * 0.028, 0.8)}
              opacity={thinking ? 0.8 : 0.5}
              style={{ filter: thinking ? `drop-shadow(0 0 ${s * 0.04}px rgba(0,194,168,0.8))` : undefined }}
            />
            {/* Inner dot */}
            <circle cx={cx} cy={ny} r={s * 0.035}
              fill="#00C2A8"
              opacity={thinking ? 1 : 0.85}
              style={{ filter: thinking ? `drop-shadow(0 0 ${s * 0.05}px rgba(0,230,210,1))` : undefined }}
            />
          </g>
        ))}

        {/* ── Base circle ── */}
        <circle
          cx={cx} cy={staffBot}
          r={s * 0.052}
          fill={`url(#${tealId})`}
          opacity={0.9}
        />

        {/* ── Thinking: pulsing ring ── */}
        {thinking && (
          <circle cx={cx} cy={s * 0.48} r={s * 0.44}
            fill="none"
            stroke="#00C2A8"
            strokeWidth={Math.max(s * 0.025, 0.6)}
            strokeDasharray={`${s * 0.3} ${s * 0.15}`}
            opacity={0.35}
            style={{ animation: "cadus-logo-think 1.8s linear infinite" }}
          />
        )}
      </svg>

      {/* ── Outer pulsing halo (thinking only) ── */}
      {thinking && (
        <div style={{
          position: "absolute",
          inset: -s * 0.18,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,194,168,0.28) 0%, rgba(0,194,168,0.08) 50%, transparent 72%)",
          animation: "cadus-glow-ring-pulse 1.6s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}

      {/* ── Idle gentle breathe glow ── */}
      {!thinking && size !== "sm" && (
        <div style={{
          position: "absolute",
          inset: -s * 0.08,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,194,168,0.07) 0%, transparent 70%)",
          animation: "cadus-logo-idle-glow 4s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}
    </div>
  );
}
