import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function VerifiedBadge({ size = "sm", showLabel = false, className = "" }: VerifiedBadgeProps) {
  const iconSize = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  const textSize = size === "lg" ? "text-sm" : size === "md" ? "text-xs" : "text-[11px]";
  const px = size === "lg" ? "px-2.5 py-1" : size === "md" ? "px-2 py-0.5" : "px-1.5 py-0.5";

  if (!showLabel) {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        title="Verified Medical Professional"
      >
        <BadgeCheck
          className={iconSize}
          style={{ color: "#007AFF" }}
          strokeWidth={2.5}
        />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold ${px} ${textSize} ${className}`}
      style={{ background: "rgba(0,122,255,0.10)", border: "1px solid rgba(0,122,255,0.25)", color: "#007AFF" }}
      title="Verified Medical Professional"
    >
      <BadgeCheck className={iconSize} strokeWidth={2.5} />
      Verified
    </span>
  );
}
