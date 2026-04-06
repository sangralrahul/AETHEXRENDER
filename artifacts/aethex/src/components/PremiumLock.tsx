import { Crown, Lock } from "lucide-react";
import { useState } from "react";
import { UpgradeModal } from "./UpgradeModal";

interface PremiumLockProps {
  children: React.ReactNode;
  isPro: boolean;
  featureName?: string;
  blurContent?: boolean;
}

export function PremiumLock({ children, isPro, featureName = "this feature", blurContent = true }: PremiumLockProps) {
  const [showModal, setShowModal] = useState(false);

  if (isPro) return <>{children}</>;

  return (
    <>
      <div className="relative" onClick={() => setShowModal(true)}>
        <div
          className={blurContent ? "pointer-events-none" : ""}
          style={{ filter: blurContent ? "blur(5px)" : "none", userSelect: "none" }}
        >
          {children}
        </div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer rounded-xl"
          style={{ background: "rgba(10,18,35,0.55)", backdropFilter: "blur(2px)" }}
        >
          <div
            className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,215,0,0.3)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
            >
              <Crown className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-white text-center">Cadus Magnus Only</p>
            <p className="text-[10px] text-center" style={{ color: "rgba(255,255,255,0.6)" }}>
              Upgrade to unlock {featureName}
            </p>
          </div>
        </div>
      </div>
      {showModal && <UpgradeModal onClose={() => setShowModal(false)} featureName={featureName} />}
    </>
  );
}

interface LockBadgeProps {
  onClick?: () => void;
}

export function LockBadge({ onClick }: LockBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{ background: "linear-gradient(135deg,#f59e0b22,#f9731622)", border: "1px solid rgba(245,158,11,0.4)", color: "#f59e0b" }}
    >
      <Crown className="w-2.5 h-2.5" />
      Cadus Magnus
    </button>
  );
}
