=== Cadus AI - Full Source Code ===

## File Structure
```
artifacts/cadus-ai/components.json
artifacts/cadus-ai/package.json
artifacts/cadus-ai/src/App.tsx
artifacts/cadus-ai/src/components/cadus/CadusLogo.tsx
artifacts/cadus-ai/src/components/cadus/CameraModal.tsx
artifacts/cadus-ai/src/components/cadus/DNABackground.tsx
artifacts/cadus-ai/src/components/cadus/MermaidDiagram.tsx
artifacts/cadus-ai/src/components/cadus/PresentationViewer.tsx
artifacts/cadus-ai/src/components/cadus/SettingsModal.tsx
artifacts/cadus-ai/src/components/cadus/TypewriterText.tsx
artifacts/cadus-ai/src/components/ui/accordion.tsx
artifacts/cadus-ai/src/components/ui/alert-dialog.tsx
artifacts/cadus-ai/src/components/ui/alert.tsx
artifacts/cadus-ai/src/components/ui/aspect-ratio.tsx
artifacts/cadus-ai/src/components/ui/avatar.tsx
artifacts/cadus-ai/src/components/ui/badge.tsx
artifacts/cadus-ai/src/components/ui/breadcrumb.tsx
artifacts/cadus-ai/src/components/ui/button-group.tsx
artifacts/cadus-ai/src/components/ui/button.tsx
artifacts/cadus-ai/src/components/ui/calendar.tsx
artifacts/cadus-ai/src/components/ui/card.tsx
artifacts/cadus-ai/src/components/ui/carousel.tsx
artifacts/cadus-ai/src/components/ui/chart.tsx
artifacts/cadus-ai/src/components/ui/checkbox.tsx
artifacts/cadus-ai/src/components/ui/collapsible.tsx
artifacts/cadus-ai/src/components/ui/command.tsx
artifacts/cadus-ai/src/components/ui/context-menu.tsx
artifacts/cadus-ai/src/components/ui/dialog.tsx
artifacts/cadus-ai/src/components/ui/drawer.tsx
artifacts/cadus-ai/src/components/ui/dropdown-menu.tsx
artifacts/cadus-ai/src/components/ui/empty.tsx
artifacts/cadus-ai/src/components/ui/field.tsx
artifacts/cadus-ai/src/components/ui/form.tsx
artifacts/cadus-ai/src/components/ui/hover-card.tsx
artifacts/cadus-ai/src/components/ui/input-group.tsx
artifacts/cadus-ai/src/components/ui/input-otp.tsx
artifacts/cadus-ai/src/components/ui/input.tsx
artifacts/cadus-ai/src/components/ui/item.tsx
artifacts/cadus-ai/src/components/ui/kbd.tsx
artifacts/cadus-ai/src/components/ui/label.tsx
artifacts/cadus-ai/src/components/ui/menubar.tsx
artifacts/cadus-ai/src/components/ui/navigation-menu.tsx
artifacts/cadus-ai/src/components/ui/pagination.tsx
artifacts/cadus-ai/src/components/ui/popover.tsx
artifacts/cadus-ai/src/components/ui/progress.tsx
artifacts/cadus-ai/src/components/ui/radio-group.tsx
artifacts/cadus-ai/src/components/ui/resizable.tsx
artifacts/cadus-ai/src/components/ui/scroll-area.tsx
artifacts/cadus-ai/src/components/ui/select.tsx
artifacts/cadus-ai/src/components/ui/separator.tsx
artifacts/cadus-ai/src/components/ui/sheet.tsx
artifacts/cadus-ai/src/components/ui/sidebar.tsx
artifacts/cadus-ai/src/components/ui/skeleton.tsx
artifacts/cadus-ai/src/components/ui/slider.tsx
artifacts/cadus-ai/src/components/ui/sonner.tsx
artifacts/cadus-ai/src/components/ui/spinner.tsx
artifacts/cadus-ai/src/components/ui/switch.tsx
artifacts/cadus-ai/src/components/ui/table.tsx
artifacts/cadus-ai/src/components/ui/tabs.tsx
artifacts/cadus-ai/src/components/ui/textarea.tsx
artifacts/cadus-ai/src/components/ui/toaster.tsx
artifacts/cadus-ai/src/components/ui/toast.tsx
artifacts/cadus-ai/src/components/ui/toggle-group.tsx
artifacts/cadus-ai/src/components/ui/toggle.tsx
artifacts/cadus-ai/src/components/ui/tooltip.tsx
artifacts/cadus-ai/src/hooks/use-mobile.tsx
artifacts/cadus-ai/src/hooks/use-toast.ts
artifacts/cadus-ai/src/hooks/use-user-auth.ts
artifacts/cadus-ai/src/index.css
artifacts/cadus-ai/src/lib/translations.ts
artifacts/cadus-ai/src/lib/utils.ts
artifacts/cadus-ai/src/main.tsx
artifacts/cadus-ai/src/pages/AiAssistant.tsx
artifacts/cadus-ai/src/pages/not-found.tsx
artifacts/cadus-ai/tsconfig.json
artifacts/cadus-ai/vite.config.ts
```

Total source lines:  13400 total

---

## `artifacts/cadus-ai/components.json` (19 lines)
```json
{
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "new-york",
    "rsc": false,
    "tsx": true,
    "tailwind": {
      "config": "",
      "css": "src/index.css",
      "baseColor": "neutral",
      "cssVariables": true,
      "prefix": ""
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils",
      "ui": "@/components/ui",
      "lib": "@/lib",
      "hooks": "@/hooks"
    }
}
```

---

## `artifacts/cadus-ai/package.json` (82 lines)
```json
{
  "name": "@workspace/cadus-ai",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --config vite.config.ts --host 0.0.0.0",
    "build": "vite build --config vite.config.ts",
    "serve": "vite preview --config vite.config.ts --host 0.0.0.0",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "devDependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-aspect-ratio": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.4",
    "@radix-ui/react-checkbox": "^1.1.5",
    "@radix-ui/react-collapsible": "^1.1.4",
    "@radix-ui/react-context-menu": "^2.2.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-hover-card": "^1.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-menubar": "^1.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.6",
    "@radix-ui/react-popover": "^1.1.7",
    "@radix-ui/react-progress": "^1.1.3",
    "@radix-ui/react-radio-group": "^1.2.4",
    "@radix-ui/react-scroll-area": "^1.2.4",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slider": "^1.2.4",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-tabs": "^1.1.4",
    "@radix-ui/react-toast": "^1.2.7",
    "@radix-ui/react-toggle": "^1.1.3",
    "@radix-ui/react-toggle-group": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@replit/vite-plugin-cartographer": "catalog:",
    "@replit/vite-plugin-dev-banner": "catalog:",
    "@replit/vite-plugin-runtime-error-modal": "catalog:",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "catalog:",
    "@tanstack/react-query": "catalog:",
    "@types/node": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "@vitejs/plugin-react": "catalog:",
    "@workspace/api-client-react": "workspace:*",
    "class-variance-authority": "catalog:",
    "clsx": "catalog:",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "catalog:",
    "input-otp": "^1.4.2",
    "lucide-react": "catalog:",
    "next-themes": "^0.4.6",
    "react": "catalog:",
    "react-day-picker": "^9.11.1",
    "react-dom": "catalog:",
    "react-hook-form": "^7.55.0",
    "react-icons": "^5.4.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.15.2",
    "sonner": "^2.0.7",
    "tailwind-merge": "catalog:",
    "tailwindcss": "catalog:",
    "tw-animate-css": "^1.4.0",
    "vaul": "^1.1.2",
    "vite": "catalog:",
    "wouter": "^3.3.5",
    "zod": "catalog:",
    "mermaid": "^11.4.1",
    "jspdf": "^2.5.2",
    "marked": "^15.0.0",
    "react-markdown": "^9.0.3",
    "remark-gfm": "^4.0.0"
  }
}

```

---

## `artifacts/cadus-ai/src/App.tsx` (14 lines)
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AiAssistant from "@/pages/AiAssistant";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AiAssistant />
    </QueryClientProvider>
  );
}

export default App;

```

---

## `artifacts/cadus-ai/src/components/cadus/CadusLogo.tsx` (105 lines)
```tsx
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
      {/* Outer glow halo — pulses when thinking */}
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

      {/* The caduceus image — contrast+brightness pushes bg to pure black,
          then mix-blend-mode:screen makes pure black transparent */}
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

```

---

## `artifacts/cadus-ai/src/components/cadus/CameraModal.tsx` (358 lines)
```tsx
import { useEffect, useRef, useState } from "react";
import { X, Camera, RefreshCw, AlertTriangle, Aperture } from "lucide-react";

interface CameraModalProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

type Status = "requesting" | "live" | "denied" | "unsupported" | "captured";

export default function CameraModal({ onCapture, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<Status>("requesting");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  const startCamera = async (facing: "environment" | "user") => {
    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCapturedUrl(null);
    setCapturedFile(null);
    setStatus("requesting");

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStatus("live");
    } catch (err: any) {
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        setStatus("denied");
      } else if (err?.name === "NotFoundError" || err?.name === "DevicesNotFoundError") {
        setStatus("unsupported");
      } else {
        setStatus("denied");
      }
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleFlip = async () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    await startCamera(next);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `cadus-photo-${Date.now()}.jpg`, { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      setCapturedUrl(url);
      setCapturedFile(file);
      setStatus("captured");
      // Stop live stream
      streamRef.current?.getTracks().forEach((t) => t.stop());
    }, "image/jpeg", 0.92);
  };

  const handleRetake = () => {
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    setCapturedUrl(null);
    setCapturedFile(null);
    startCamera(facingMode);
  };

  const handleUse = () => {
    if (capturedFile) {
      onCapture(capturedFile);
      onClose();
    }
  };

  const handleClose = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (capturedUrl) URL.revokeObjectURL(capturedUrl);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: "min(92vw, 640px)",
          maxHeight: "90vh",
          background: "rgba(4,11,26,0.96)",
          border: "1px solid rgba(0,188,212,0.25)",
          borderRadius: 20,
          boxShadow: "0 0 60px rgba(0,188,212,0.12)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5 shrink-0"
          style={{ borderBottom: "1px solid rgba(0,188,212,0.12)" }}
        >
          <div className="flex items-center gap-2.5">
            <Camera className="w-4.5 h-4.5" style={{ color: "#00E5FF" }} />
            <span
              className="font-semibold text-sm"
              style={{ color: "rgba(200,240,255,0.9)", letterSpacing: "0.03em" }}
            >
              Take Photo
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "rgba(140,200,255,0.5)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center gap-0 flex-1 min-h-0">

          {/* ── Requesting permission ── */}
          {status === "requesting" && (
            <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,188,212,0.12)", border: "1px solid rgba(0,188,212,0.25)" }}
              >
                <Camera className="w-7 h-7" style={{ color: "#00E5FF" }} />
              </div>
              <div>
                <p className="text-base font-semibold mb-1" style={{ color: "rgba(200,240,255,0.9)" }}>
                  Requesting camera access…
                </p>
                <p className="text-sm" style={{ color: "rgba(140,200,255,0.5)" }}>
                  Please allow camera permission in the browser prompt.
                </p>
              </div>
              <div className="flex gap-1 mt-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "#00BCD4",
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Permission denied ── */}
          {(status === "denied" || status === "unsupported") && (
            <div className="flex flex-col items-center justify-center gap-4 py-12 px-8 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
              >
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <p className="text-base font-semibold mb-1" style={{ color: "rgba(255,200,200,0.9)" }}>
                  {status === "unsupported" ? "Camera not found" : "Camera access denied"}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(200,180,180,0.6)" }}>
                  {status === "unsupported"
                    ? "No camera was detected on this device."
                    : "To use the camera, click the camera icon in your browser's address bar and allow access, then try again."}
                </p>
              </div>
              <button
                onClick={() => startCamera(facingMode)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all mt-1"
                style={{
                  background: "rgba(0,188,212,0.12)",
                  border: "1px solid rgba(0,188,212,0.25)",
                  color: "#00E5FF",
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try again
              </button>
            </div>
          )}

          {/* ── Live preview ── */}
          {status === "live" && (
            <div className="relative w-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full"
                style={{ display: "block", maxHeight: "55vh", objectFit: "cover", background: "#000" }}
              />
              {/* Viewfinder corners */}
              {["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r",
                "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute w-6 h-6 ${cls}`}
                  style={{ borderColor: "rgba(0,229,255,0.6)", borderWidth: 2 }}
                />
              ))}
            </div>
          )}

          {/* ── Captured preview ── */}
          {status === "captured" && capturedUrl && (
            <div className="w-full relative">
              <img
                src={capturedUrl}
                alt="Captured"
                className="w-full"
                style={{ display: "block", maxHeight: "55vh", objectFit: "contain", background: "#000" }}
              />
              <div
                className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "rgba(0,188,212,0.2)", border: "1px solid rgba(0,188,212,0.35)", color: "#00E5FF" }}
              >
                Photo captured
              </div>
            </div>
          )}

          {/* Hidden canvas for snapshot */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        {/* Footer actions */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderTop: "1px solid rgba(0,188,212,0.1)" }}
        >
          {status === "live" && (
            <>
              {/* Flip camera */}
              <button
                onClick={handleFlip}
                className="p-2.5 rounded-xl transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(140,200,255,0.7)",
                }}
                title="Flip camera"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Shutter button */}
              <button
                onClick={handleCapture}
                className="flex items-center justify-center transition-all"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(0,188,212,0.15)",
                  border: "3px solid rgba(0,229,255,0.7)",
                  boxShadow: "0 0 20px rgba(0,229,255,0.3)",
                  color: "#00E5FF",
                }}
                title="Capture photo"
              >
                <Aperture className="w-8 h-8" />
              </button>

              {/* Spacer */}
              <div className="w-10" />
            </>
          )}

          {status === "captured" && (
            <>
              <button
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(200,220,255,0.7)",
                }}
              >
                Retake
              </button>

              <button
                onClick={handleUse}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "rgba(0,188,212,0.2)",
                  border: "1px solid rgba(0,229,255,0.4)",
                  color: "#00E5FF",
                  boxShadow: "0 0 16px rgba(0,188,212,0.2)",
                }}
              >
                Use Photo
              </button>
            </>
          )}

          {(status === "requesting" || status === "denied" || status === "unsupported") && (
            <div className="w-full flex justify-center">
              <button
                onClick={handleClose}
                className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  color: "rgba(140,200,255,0.6)",
                  border: "1px solid rgba(0,188,212,0.15)",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

```

---

## `artifacts/cadus-ai/src/components/cadus/DNABackground.tsx` (216 lines)
```tsx
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  baseR: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
  opacity: number;
}

const PALETTE = [
  "#00BCD4", "#00E5FF", "#22D3EE",   // cyan family
  "#7C3AED", "#A855F7",              // violet family
  "#3B82F6", "#60A5FA",              // blue family
  "#0EA5E9",                         // sky blue
];

function randPalette() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

function makeParticle(w: number, h: number): Particle {
  const speed = 0.15 + Math.random() * 0.35;
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    baseR: 1.2 + Math.random() * 2.2,
    r: 0,
    pulseSpeed: 0.6 + Math.random() * 1.4,
    pulsePhase: Math.random() * Math.PI * 2,
    color: randPalette(),
    opacity: 0.35 + Math.random() * 0.55,
  };
}

const MAX_DIST = 140;
const PARTICLE_COUNT = 130;

export default function DNABackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let particles: Particle[] = [];
    let W = 0, H = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      // Reinitialise particles on resize
      particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(W, H));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Slow moving "aurora" blobs ─────────────────────────────────────────
    const AURORA = [
      { cx: 0.15, cy: 0.25, rx: 0.38, ry: 0.32, col: "rgba(0,188,212,0.055)", phase: 0 },
      { cx: 0.80, cy: 0.65, rx: 0.40, ry: 0.35, col: "rgba(109,40,217,0.05)",  phase: 1.2 },
      { cx: 0.50, cy: 0.80, rx: 0.50, ry: 0.30, col: "rgba(59,130,246,0.04)",  phase: 2.4 },
      { cx: 0.70, cy: 0.20, rx: 0.35, ry: 0.28, col: "rgba(0,229,255,0.04)",   phase: 3.6 },
    ];

    const drawAuroras = () => {
      for (const a of AURORA) {
        const drift = Math.sin(t * 0.25 + a.phase) * 0.06;
        const driftY = Math.cos(t * 0.18 + a.phase) * 0.04;
        const cx = (a.cx + drift) * W;
        const cy = (a.cy + driftY) * H;
        const rx = a.rx * W;
        const ry = a.ry * H;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
        grad.addColorStop(0, a.col);
        grad.addColorStop(1, "transparent");
        ctx.save();
        ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx / (rx / Math.max(rx, ry)), cy / (ry / Math.max(rx, ry)), Math.max(rx, ry), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    // ── Scanline pulse (horizontal sweep every ~8s) ────────────────────────
    const drawScanline = () => {
      const cycle = 8;
      const progress = (t * 0.012) % cycle / cycle;  // 0→1
      const y = progress * H;
      const alpha = Math.sin(progress * Math.PI) * 0.03;
      if (alpha < 0.002) return;
      const g = ctx.createLinearGradient(0, y - 60, 0, y + 60);
      g.addColorStop(0, "transparent");
      g.addColorStop(0.5, `rgba(0,229,255,${alpha})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, y - 60, W, 120);
    };

    const animate = () => {
      if (W === 0 || H === 0) { raf = requestAnimationFrame(animate); return; }

      // ── Background ────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.6, W * 0.9);
      bg.addColorStop(0,   "#060E22");
      bg.addColorStop(0.5, "#040B1A");
      bg.addColorStop(1,   "#020710");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Aurora blobs ─────────────────────────────────────────────────────
      drawAuroras();

      // ── Scanline ─────────────────────────────────────────────────────────
      drawScanline();

      // ── Update + draw particles & connections ─────────────────────────────
      for (const p of particles) {
        // Move
        p.x += p.vx;
        p.y += p.vy;
        // Wrap
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        // Pulse radius
        p.r = p.baseR + Math.sin(t * p.pulseSpeed + p.pulsePhase) * (p.baseR * 0.4);
      }

      // Connections
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > MAX_DIST) continue;

          const alpha = (1 - dist / MAX_DIST) * 0.18;
          // Pick color blend between two particle colors
          ctx.beginPath();
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, a.color + Math.round(alpha * 255).toString(16).padStart(2, "0"));
          grad.addColorStop(1, b.color + Math.round(alpha * 255).toString(16).padStart(2, "0"));
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.6 + (1 - dist / MAX_DIST) * 0.6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Particles (draw on top of connections)
      for (const p of particles) {
        // Outer glow halo
        ctx.save();
        ctx.globalAlpha = p.opacity * 0.3;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.r * 10;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Core dot
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.r * 5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      t += 1;
      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: "block" }}
    />
  );
}

```

---

## `artifacts/cadus-ai/src/components/cadus/MermaidDiagram.tsx` (72 lines)
```tsx
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";

let initialized = false;
function initMermaid() {
  if (initialized) return;
  initialized = true;
  mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    themeVariables: {
      primaryColor: "#E8F4FF",
      primaryTextColor: "#1C1C1E",
      primaryBorderColor: "#007AFF",
      lineColor: "#007AFF",
      secondaryColor: "#F0F8FF",
      tertiaryColor: "#F2F2F7",
      background: "#FFFFFF",
      nodeBorder: "#007AFF",
      clusterBkg: "#EBF4FF",
      titleColor: "#1C1C1E",
      edgeLabelBackground: "#FFFFFF",
      fontFamily: "Inter, DM Sans, sans-serif",
    },
    flowchart: { curve: "basis", padding: 12, nodeSpacing: 40, rankSpacing: 48 },
    mindmap: { padding: 12 },
  });
}

let counter = 0;

export default function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useRef(`mm-${++counter}`);
  const [error, setError] = useState(false);

  useEffect(() => {
    initMermaid();
    if (!ref.current || !chart) return;
    setError(false);
    const target = ref.current;
    mermaid
      .render(id.current, chart)
      .then(({ svg }) => {
        if (target) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(svg, "image/svg+xml");
          const svgEl = doc.documentElement as unknown as SVGSVGElement;
          svgEl.style.width = "100%";
          svgEl.style.maxWidth = "100%";
          svgEl.style.height = "auto";
          target.replaceChildren(svgEl);
        }
      })
      .catch(() => setError(true));
  }, [chart]);

  if (error) {
    return (
      <div style={{ color: "rgba(0,188,212,0.4)", fontSize: 11, textAlign: "center", padding: 16 }}>
        Diagram rendering — check diagram syntax
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{ width: "100%", minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center" }}
    />
  );
}

```

---

## `artifacts/cadus-ai/src/components/cadus/PresentationViewer.tsx` (905 lines)
```tsx
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import MermaidDiagram from "./MermaidDiagram";

export interface PresentationSlide {
  n: number;
  type: string;
  layout?: string;
  t: string;
  sub?: string;
  bullets: string[];
  ki?: string;
  caption?: string;
  stats?: { value: string; label: string; desc: string }[];
  cards?: { heading: string; body: string }[];
  leftHeading?: string;
  leftBody?: string;
  rightPoints?: string[];
  diag?: string;
  nodes?: string[];
  edges?: [number, number][];
  imageUrl?: string;
}

export interface PresentationData {
  title: string;
  subtitle: string;
  slides: PresentationSlide[];
  faq?: { question: string; answer: string }[];
  refs?: { term: string; definition: string }[];
  conditions?: { name: string; features: string; clue: string }[];
  redflags?: string[];
  pdfBase64?: string;
  docxBase64?: string;
}

interface Props {
  data: PresentationData;
  onClose: () => void;
  pdfBase64?: string;
  docxBase64?: string;
  initialIdx?: number;
}

const TEAL = "#00BCD4";
const TEAL_DIM = "#007C91";
const TEAL_BRT = "#4DD0E1";
const NAVY = "#0A0F2C";
const NAVY2 = "#1a1f4e";

function nodesToMermaid(diag: string, nodes: string[], edges: [number, number][]): string {
  if (!nodes.length) return "";

  const cleanLabel = (s: string) =>
    s.replace(/"/g, "'").replace(/[<>{}|]/g, " ").replace(/\s+/g, " ").trim().substring(0, 28);

  if (diag === "mindmap") {
    let chart = `mindmap\n  root((${cleanLabel(nodes[0] ?? "Overview")}))\n`;
    nodes.slice(1, 8).forEach((n) => {
      chart += `    ${cleanLabel(n)}\n`;
    });
    return chart;
  }

  const dir = diag === "concept" ? "LR" : "TD";
  let chart = `flowchart ${dir}\n`;

  nodes.forEach((node, i) => {
    const label = cleanLabel(node);
    const isTerminal = diag === "flowchart" && (i === 0 || i === nodes.length - 1);
    chart += isTerminal
      ? `  N${i}([${label}])\n`
      : `  N${i}[${label}]\n`;
  });

  if (edges.length) {
    edges.forEach(([src, dst]) => {
      if (src < nodes.length && dst < nodes.length) {
        chart += `  N${src} --> N${dst}\n`;
      }
    });
  } else {
    if (diag === "concept") {
      for (let i = 1; i < nodes.length; i++) chart += `  N0 --> N${i}\n`;
    } else {
      for (let i = 0; i < nodes.length - 1; i++) chart += `  N${i} --> N${i + 1}\n`;
    }
  }

  chart += `  style N0 fill:#00BCD4,color:#fff,stroke:#007C91\n`;
  if (nodes.length > 1 && (diag === "flowchart" || diag === "pathway")) {
    chart += `  style N${nodes.length - 1} fill:#007C91,color:#fff,stroke:#004D61\n`;
  }
  return chart;
}

function DiagramLabel({ diag }: { diag: string }) {
  const labels: Record<string, string> = {
    flowchart: "MECHANISM FLOWCHART",
    anatomy: "ANATOMY DIAGRAM",
    mindmap: "MIND MAP",
    pathway: "CLINICAL PATHWAY",
    concept: "CONCEPT MAP",
  };
  return (
    <p style={{ color: TEAL, fontSize: 10, fontWeight: "bold", textTransform: "uppercase", margin: "0 0 10px", letterSpacing: "0.06em" }}>
      {labels[diag] ?? "DIAGRAM"}
    </p>
  );
}

function ConceptStrip({ nodes }: { nodes: string[] }) {
  if (!nodes.length) return null;
  return (
    <div style={{
      background: "rgba(0,0,0,0.38)",
      padding: "7px 28px",
      display: "flex",
      gap: 6,
      alignItems: "center",
      flexWrap: "nowrap",
      overflowX: "auto",
      flexShrink: 0,
    }}>
      {nodes.slice(0, 7).map((node, i) => (
        <React.Fragment key={i}>
          <div style={{
            background: "rgba(0,188,212,0.18)",
            border: `1px solid ${TEAL}`,
            borderRadius: 20,
            padding: "3px 11px",
            color: "white",
            fontSize: 10,
            whiteSpace: "nowrap",
            fontWeight: 500,
          }}>
            {node}
          </div>
          {i < Math.min(nodes.length, 7) - 1 && (
            <span style={{ color: TEAL, fontSize: 14, flexShrink: 0, lineHeight: 1 }}>→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function SlideImagePanel({ imageUrl, diag, nodes, edges }: {
  imageUrl?: string;
  diag: string;
  nodes: string[];
  edges: [number, number][];
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const hasDiag = diag !== "none" && nodes.length > 0;
  const chart = hasDiag ? nodesToMermaid(diag, nodes, edges) : "";

  if (imageUrl && !imgError) {
    return (
      <div style={{
        background: "rgba(0,0,0,0.6)",
        borderRadius: 14,
        border: `1px solid rgba(0,188,212,0.35)`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}>
        {!imgLoaded && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 10,
            background: "#0A0F2C",
          }}>
            <div style={{ width: 48, height: 48, border: `3px solid rgba(0,188,212,0.2)`, borderTop: `3px solid ${TEAL}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <span style={{ color: "rgba(0,188,212,0.5)", fontSize: 11 }}>Loading illustration…</span>
          </div>
        )}
        <img
          src={imageUrl}
          alt={`Medical illustration`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            display: imgLoaded ? "block" : "none",
          }}
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
          padding: "18px 12px 8px",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, fontWeight: "bold", letterSpacing: "0.07em", textTransform: "uppercase" }}>
            AI Medical Illustration · CADUS
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      borderRadius: 14,
      border: `1px solid rgba(0,188,212,0.28)`,
      padding: "14px 14px 10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: hasDiag ? "flex-start" : "center",
      overflow: "hidden",
    }}>
      {hasDiag ? (
        <>
          <DiagramLabel diag={diag} />
          <div style={{ width: "100%", overflow: "auto", flex: 1 }}>
            <MermaidDiagram chart={chart} />
          </div>
        </>
      ) : (
        <p style={{ color: "rgba(0,188,212,0.25)", fontSize: 12, margin: 0 }}>No diagram available</p>
      )}
    </div>
  );
}

// ── Shared slide frame — clean white Gamma-style ─────────────────────────
function ContentFrame({ slide, current, total, children }: {
  slide: PresentationSlide; current: number; total: number; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "white",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', 'DM Sans', sans-serif",
      overflow: "hidden",
    }}>
      {/* Top teal stripe */}
      <div style={{ height: 7, background: `linear-gradient(90deg, ${TEAL}, #3884FF)`, flexShrink: 0 }} />

      {/* Title row — inside the white slide */}
      <div style={{
        padding: "14px 28px 12px 24px",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        flexShrink: 0, gap: 16,
        borderBottom: "1.5px solid #E4EBF0",
        background: "white",
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ color: TEAL, fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>
            CADUS MEDICAL EDUCATION
          </div>
          <h2 style={{
            color: "#0A1F3C", fontSize: 24, fontWeight: 900,
            margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {slide.t}
          </h2>
        </div>
        <div style={{
          flexShrink: 0, width: 44, height: 44, background: TEAL,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 8, fontSize: 20, fontWeight: 900, color: "white",
        }}>
          {current}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        {children}
      </div>

      {/* Progress bar */}
      <div style={{ flexShrink: 0, height: 5, background: "#E4EBF0" }}>
        <div style={{ width: `${(current / total) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${TEAL}, #3884FF)`, transition: "width 0.35s ease" }} />
      </div>
    </div>
  );
}

// card accent colors per column index
const CARD_ACCENTS = [
  { bg: "linear-gradient(160deg, #ffffff 60%, #e8fdf8 100%)", border: "rgba(0,188,212,0.25)", num: "#00BCD4" },
  { bg: "linear-gradient(160deg, #ffffff 60%, #e8f4ff 100%)", border: "rgba(56,132,255,0.25)", num: "#3884FF" },
  { bg: "linear-gradient(160deg, #ffffff 60%, #f3eeff 100%)", border: "rgba(124,77,255,0.25)", num: "#7C4DFF" },
];

// ── STATS layout — giant numbers filling the slide ────────────────────────
function StatsLayout({ slide }: { slide: PresentationSlide }) {
  const stats = (slide.stats ?? []).slice(0, 3);
  if (!stats.length) return <ListLayout slide={slide} />;
  const nCols = stats.length;
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "white" }}>
      {/* Numbers zone — takes 65% height */}
      <div style={{ flex: "0 0 65%", display: "grid", gridTemplateColumns: `repeat(${nCols}, 1fr)`, minHeight: 0 }}>
        {stats.map((st, ci) => (
          <div key={ci} style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "0 16px", position: "relative",
            borderRight: ci < nCols - 1 ? "1px solid #e8f0f2" : "none",
          }}>
            {/* Subtle glow circle behind number */}
            <div style={{
              position: "absolute", width: 140, height: 140, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,188,212,0.08) 0%, transparent 70%)",
            }} />
            {/* Accent dash above */}
            <div style={{ width: 40, height: 5, background: TEAL, borderRadius: 3, marginBottom: 12 }} />
            {/* Giant number */}
            <span style={{
              fontSize: "clamp(48px, 8vw, 88px)",
              fontWeight: 900,
              color: TEAL,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
              whiteSpace: "nowrap",
            }}>{st.value}</span>
          </div>
        ))}
      </div>

      {/* Labels zone — 35% height, light teal bg */}
      <div style={{
        flex: "0 0 35%", display: "grid", gridTemplateColumns: `repeat(${nCols}, 1fr)`,
        background: "#EBF7F9", borderTop: "2px solid rgba(0,188,212,0.30)", minHeight: 0,
      }}>
        {stats.map((st, ci) => (
          <div key={ci} style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "8px 16px", gap: 4,
            borderRight: ci < nCols - 1 ? "1px solid rgba(0,188,212,0.20)" : "none",
          }}>
            <span style={{ color: "#0A1F3C", fontSize: 15, fontWeight: 800, textAlign: "center", letterSpacing: "-0.01em" }}>
              {st.label}
            </span>
            <span style={{ color: "#5A7080", fontSize: 11, lineHeight: 1.45, textAlign: "center" }}>
              {st.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Caption */}
      {slide.caption && (
        <div style={{ padding: "5px 28px", textAlign: "center", borderTop: "1px solid #e8f0f2", flexShrink: 0, background: "white" }}>
          <span style={{ color: "#8A9AAB", fontSize: 10, fontStyle: "italic" }}>{slide.caption}</span>
        </div>
      )}
    </div>
  );
}

// ── CARDS layout — rich 3-column cards ───────────────────────────────────
function CardsLayout({ slide }: { slide: PresentationSlide }) {
  const cards = (slide.cards ?? []).slice(0, 3);
  if (!cards.length) return <ListLayout slide={slide} />;
  return (
    <div style={{
      height: "100%", display: "grid",
      gridTemplateColumns: `repeat(${cards.length}, 1fr)`,
      gap: 14, padding: "14px 16px",
      background: "#F5F8FA",
    }}>
      {cards.map((card, ci) => {
        const accent = CARD_ACCENTS[ci] ?? CARD_ACCENTS[0];
        return (
          <div key={ci} style={{
            background: accent.bg,
            borderRadius: 10,
            border: `1.5px solid ${accent.border}`,
            boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}>
            {/* Top teal stripe — full width, 8px */}
            <div style={{ height: 8, background: TEAL, flexShrink: 0 }} />

            <div style={{ padding: "14px 18px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Large decorative number */}
              <span style={{
                fontSize: 32, fontWeight: 900, lineHeight: 1,
                color: accent.num, opacity: 0.35,
                letterSpacing: "-0.02em",
              }}>
                {String(ci + 1).padStart(2, "0")}
              </span>

              {/* Heading */}
              <h3 style={{
                color: "#0A1F3C", fontSize: 15, fontWeight: 800, margin: 0,
                lineHeight: 1.25, letterSpacing: "-0.01em",
              }}>
                {card.heading}
              </h3>

              {/* Teal separator */}
              <div style={{ height: 2, background: TEAL, borderRadius: 1, opacity: 0.6, flexShrink: 0 }} />

              {/* Body text */}
              <p style={{
                color: "#3A4A60", fontSize: 11.5, lineHeight: 1.7, margin: 0, flex: 1,
              }}>
                {card.body}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── TWOCOL layout — magazine spread ──────────────────────────────────────
function TwoColLayout({ slide }: { slide: PresentationSlide }) {
  const rightPoints = slide.rightPoints ?? [];
  return (
    <div style={{ height: "100%", display: "grid", gridTemplateColumns: "53% 47%", minHeight: 0, background: "white" }}>
      {/* LEFT — heading + paragraph */}
      <div style={{
        padding: "22px 28px 22px 24px",
        display: "flex", flexDirection: "column", gap: 0, overflow: "hidden",
        borderRight: "2px solid #EBF0F4",
      }}>
        {slide.leftHeading && (
          <h2 style={{
            color: "#0A1F3C", fontSize: 21, fontWeight: 900, margin: "0 0 10px",
            lineHeight: 1.15, letterSpacing: "-0.02em",
          }}>
            {slide.leftHeading}
          </h2>
        )}
        {/* Bold teal accent bar */}
        <div style={{ width: 60, height: 5, background: TEAL, borderRadius: 3, marginBottom: 16, flexShrink: 0 }} />

        <p style={{ color: "#2A3B52", fontSize: 13, lineHeight: 1.85, margin: 0, flex: 1 }}>
          {slide.leftBody}
        </p>

        {/* Decorative large quote mark — bottom right of left column */}
        <div style={{
          alignSelf: "flex-end", fontSize: 90, fontWeight: 900,
          color: "rgba(0,188,212,0.08)", lineHeight: 0.7, flexShrink: 0,
          userSelect: "none",
        }}>
          &rdquo;
        </div>
      </div>

      {/* RIGHT — bullet points on teal-tinted bg */}
      <div style={{ background: "#EBF7F9", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top accent */}
        <div style={{ height: 5, background: TEAL, flexShrink: 0 }} />
        <div style={{ flex: 1, padding: "14px 20px", display: "flex", flexDirection: "column", gap: 0, overflow: "hidden" }}>
          {rightPoints.map((rp, ri) => (
            <React.Fragment key={ri}>
              <div style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                padding: "11px 0", flex: 1, minHeight: 0,
              }}>
                {/* Teal square bullet */}
                <div style={{ width: 12, height: 12, background: TEAL, flexShrink: 0, marginTop: 2, borderRadius: 2 }} />
                <p style={{
                  color: "#1A2A40", fontSize: 12.5, lineHeight: 1.6, margin: 0,
                  fontWeight: ri === 0 ? 700 : 400,
                }}>
                  {rp}
                </p>
              </div>
              {ri < rightPoints.length - 1 && (
                <div style={{ height: 1, background: "rgba(0,188,212,0.22)", flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LIST layout — bold numbered rows ─────────────────────────────────────
function ListLayout({ slide }: { slide: PresentationSlide }) {
  const bullets = slide.bullets.slice(0, 5);
  const ki = slide.ki;
  const listBg = ["#F0FBFA", "white", "#F0FBFA", "white", "#F0FBFA"];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", background: "white" }}>
      {/* Left thick teal bar + rows */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div style={{ width: 7, background: TEAL, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {bullets.map((bullet, bi) => (
            <div key={bi} style={{
              display: "flex", alignItems: "center",
              flex: 1, minHeight: 0,
              background: listBg[bi] ?? "white",
              borderBottom: bi < bullets.length - 1 ? "1px solid #E2EDF2" : "none",
            }}>
              {/* Number badge — large teal circle */}
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: TEAL, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 18px 0 14px",
                boxShadow: "0 2px 8px rgba(0,188,212,0.30)",
              }}>
                <span style={{ color: "white", fontWeight: 900, fontSize: 16 }}>{bi + 1}</span>
              </div>
              <p style={{
                color: "#1A2A40", fontSize: 14, lineHeight: 1.5, margin: 0,
                flex: 1, paddingRight: 24,
                fontWeight: bi === 0 ? 700 : 500,
              }}>
                {bullet}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* KEY INSIGHT — dark band */}
      {ki && (
        <div style={{
          background: NAVY, flexShrink: 0,
          padding: "10px 22px 10px 18px",
          display: "flex", alignItems: "center", gap: 14,
          borderTop: `5px solid ${TEAL}`,
        }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ color: TEAL_BRT, fontSize: 8, fontWeight: 900, letterSpacing: "0.1em", marginBottom: 3 }}>
              ⚡ KEY INSIGHT
            </div>
            <p style={{ color: "white", fontSize: 12.5, lineHeight: 1.5, margin: 0 }}>{ki}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ContentSlide — dispatches to the correct layout ───────────────────────
function ContentSlide({ slide, current, total }: { slide: PresentationSlide; current: number; total: number }) {
  const layout = slide.layout ?? "list";
  let body: React.ReactNode;

  if (layout === "stats" && (slide.stats?.length ?? 0) >= 2) {
    body = <StatsLayout slide={slide} />;
  } else if (layout === "cards" && (slide.cards?.length ?? 0) >= 2) {
    body = <CardsLayout slide={slide} />;
  } else if (layout === "twocol" && slide.leftBody) {
    body = <TwoColLayout slide={slide} />;
  } else {
    body = <ListLayout slide={slide} />;
  }

  return (
    <ContentFrame slide={slide} current={current} total={total}>
      {body}
    </ContentFrame>
  );
}

function TitleSlide({ slide, current, total }: { slide: PresentationSlide; current: number; total: number }) {
  return (
    <div style={{
      background: `linear-gradient(145deg, #040B1A 0%, #071428 45%, #0A1F3C 100%)`,
      height: "100%", display: "flex", flexDirection: "column",
      fontFamily: "'Inter', 'DM Sans', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative large circle — top right */}
      <div style={{
        position: "absolute", top: -80, right: -80,
        width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle at center, rgba(0,188,212,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Decorative small circle — bottom left */}
      <div style={{
        position: "absolute", bottom: -40, left: 60,
        width: 200, height: 200, borderRadius: "50%",
        background: "radial-gradient(circle at center, rgba(56,132,255,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Teal top stripe */}
      <div style={{ height: 7, background: `linear-gradient(90deg, ${TEAL}, #3884FF)`, flexShrink: 0, position: "relative", zIndex: 1 }} />

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 56px", textAlign: "center", gap: 18, position: "relative", zIndex: 1 }}>
        {/* Teal pill label */}
        <div style={{ background: "rgba(0,188,212,0.15)", border: `1px solid rgba(0,188,212,0.35)`, borderRadius: 20, padding: "5px 16px", display: "inline-flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: TEAL }} />
          <span style={{ color: TEAL_BRT, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>CADUS MEDICAL EDUCATION</span>
        </div>

        {/* Main title */}
        <h1 style={{
          color: "white", fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 900, margin: 0, lineHeight: 1.08, letterSpacing: "-0.03em",
          textShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}>
          {slide.t}
        </h1>

        {/* Teal divider */}
        <div style={{ width: 80, height: 4, background: `linear-gradient(90deg, ${TEAL}, #3884FF)`, borderRadius: 2 }} />

        {/* Subtitle */}
        {slide.sub && (
          <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 15, margin: 0, maxWidth: 560, lineHeight: 1.65 }}>{slide.sub}</p>
        )}

        {/* Badges */}
        <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ padding: "8px 20px", borderRadius: 24, fontSize: 12, fontWeight: 700, background: TEAL, color: "white", letterSpacing: "0.02em" }}>
            {total} Slides
          </span>
          <span style={{ padding: "8px 20px", borderRadius: 24, fontSize: 12, fontWeight: 600, border: `1.5px solid rgba(0,188,212,0.4)`, color: TEAL_BRT }}>
            AETHEX · Medical AI
          </span>
        </div>
      </div>

      {/* Bottom branding */}
      <div style={{ padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Powered by CADUS AI</span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 9 }}>1 / {total}</span>
      </div>
    </div>
  );
}

function ConditionsSlide({ slide, conditions, current, total }: { slide: PresentationSlide; conditions?: PresentationData["conditions"]; current: number; total: number }) {
  const items = conditions?.slice(0, 6) ?? [];
  return (
    <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: TEAL, padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>MEDICAL EDUCATION | CADUS</span>
        <span style={{ color: "white", fontSize: 12 }}>Slide {current} / {total}</span>
      </div>
      <div style={{ padding: "14px 24px 8px", borderBottom: `2px solid ${TEAL}`, flexShrink: 0 }}>
        <h2 style={{ color: TEAL, fontSize: 20, fontWeight: 800, margin: 0 }}>{slide.t}</h2>
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "14px 24px", overflow: "auto" }}>
        {(items.length ? items : slide.bullets.slice(0, 6).map(b => ({ name: b, features: "", clue: "" }))).map((c, i) => (
          <div key={i} style={{ borderRadius: 12, padding: 12, background: "rgba(0,188,212,0.07)", border: `1px solid ${TEAL_DIM}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 20, height: 20, borderRadius: 5, background: TEAL, color: "white", fontSize: 9, fontWeight: "black", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
              <span style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{c.name}</span>
            </div>
            {c.features && <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, lineHeight: 1.5, margin: "0 0 4px" }}>{c.features}</p>}
            {c.clue && <p style={{ color: TEAL_BRT, fontSize: 10, fontWeight: 600, margin: 0 }}>↗ {c.clue}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function RedFlagsSlide({ slide, redflags, current, total }: { slide: PresentationSlide; redflags?: string[]; current: number; total: number }) {
  const flags = redflags?.length ? redflags.slice(0, 8) : slide.bullets.slice(0, 8);
  return (
    <div style={{ background: "#140A0A", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#c62828", padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>MEDICAL EDUCATION | CADUS — RED FLAGS</span>
        <span style={{ color: "white", fontSize: 12 }}>Slide {current} / {total}</span>
      </div>
      <div style={{ padding: "14px 24px 8px", borderBottom: "2px solid #EF4444", flexShrink: 0 }}>
        <h2 style={{ color: "white", fontSize: 20, fontWeight: 800, margin: 0 }}>{slide.t}</h2>
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "14px 24px", overflow: "auto" }}>
        {flags.map((f, i) => (
          <div key={i} style={{ borderRadius: 12, padding: 12, display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <p style={{ color: "white", fontSize: 13, lineHeight: 1.5, margin: 0, opacity: 0.9 }}>{f}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSlide({ slide, faq, current, total }: { slide: PresentationSlide; faq?: PresentationData["faq"]; current: number; total: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = faq?.length ? faq.slice(0, 10) : [];
  return (
    <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: TEAL, padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>MEDICAL EDUCATION | CADUS</span>
        <span style={{ color: "white", fontSize: 12 }}>Slide {current} / {total}</span>
      </div>
      <div style={{ padding: "14px 24px 8px", borderBottom: `2px solid ${TEAL}`, flexShrink: 0 }}>
        <h2 style={{ color: TEAL, fontSize: 20, fontWeight: 800, margin: 0 }}>{slide.t}</h2>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "12px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
        {(items.length ? items : slide.bullets.map(b => ({ question: b, answer: "" }))).map((qa, i) => (
          <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${open === i ? TEAL : TEAL_DIM}` }}>
            <button
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", textAlign: "left", background: open === i ? "rgba(0,188,212,0.12)" : "rgba(0,188,212,0.04)", cursor: "pointer", border: "none" }}
              onClick={() => setOpen(open === i ? null : i)}>
              <span style={{ width: 24, height: 24, borderRadius: 6, background: TEAL, color: "white", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>Q{i + 1}</span>
              <span style={{ color: "white", fontSize: 12, fontWeight: 600, flex: 1, lineHeight: 1.4 }}>{qa.question}</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, lineHeight: 1, flexShrink: 0 }}>{open === i ? "−" : "+"}</span>
            </button>
            {open === i && qa.answer && (
              <div style={{ padding: "10px 14px", background: "rgba(0,0,0,0.3)", borderTop: `1px solid ${TEAL_DIM}` }}>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{qa.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GlossarySlide({ slide, refs, current, total }: { slide: PresentationSlide; refs?: PresentationData["refs"]; current: number; total: number }) {
  const items = refs?.length ? refs.slice(0, 10) : [];
  return (
    <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: TEAL, padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>MEDICAL EDUCATION | CADUS</span>
        <span style={{ color: "white", fontSize: 12 }}>Slide {current} / {total}</span>
      </div>
      <div style={{ padding: "14px 24px 8px", borderBottom: `2px solid ${TEAL}`, flexShrink: 0 }}>
        <h2 style={{ color: TEAL, fontSize: 20, fontWeight: 800, margin: 0 }}>{slide.t}</h2>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "12px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {(items.length ? items : slide.bullets.map(b => ({ term: b, definition: "" }))).map((r, i) => (
            <div key={i} style={{ borderRadius: 12, padding: 12, background: "rgba(0,188,212,0.06)", border: `1px solid ${TEAL_DIM}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 20, height: 20, borderRadius: 5, background: TEAL, color: "white", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                <span style={{ color: TEAL_BRT, fontSize: 11, fontWeight: "bold" }}>{r.term}</span>
              </div>
              {r.definition && <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 10, lineHeight: 1.55, margin: 0 }}>{r.definition}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummarySlide({ slide, current, total }: { slide: PresentationSlide; current: number; total: number }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0A1F3C 100%)`, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: TEAL, padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>MEDICAL EDUCATION | CADUS</span>
        <span style={{ color: "white", fontSize: 12 }}>Slide {current} / {total}</span>
      </div>
      <div style={{ padding: "14px 24px 8px", borderBottom: `2px solid ${TEAL}`, flexShrink: 0 }}>
        <h2 style={{ color: TEAL, fontSize: 20, fontWeight: 800, margin: 0 }}>{slide.t}</h2>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 24px", gap: 10, overflow: "auto" }}>
        {slide.bullets.slice(0, 6).map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, borderRadius: 12, padding: "10px 14px", background: "rgba(0,188,212,0.07)", border: `1px solid ${TEAL_DIM}` }}>
            <span style={{ fontSize: 20, fontWeight: 900, flexShrink: 0, color: TEAL_DIM, opacity: 0.7 }}>0{i + 1}</span>
            <p style={{ color: "white", fontSize: 13, lineHeight: 1.55, margin: 0, opacity: 0.92 }}>{b}</p>
          </div>
        ))}
        {slide.ki && (
          <div style={{ borderLeft: `4px solid ${TEAL}`, background: "rgba(0,188,212,0.10)", padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
            <div style={{ color: TEAL, fontWeight: "bold", fontSize: 10, letterSpacing: "0.06em", marginBottom: 4 }}>⚡ KEY INSIGHT</div>
            <p style={{ color: "#e0f7fa", fontStyle: "italic", fontSize: 12, margin: 0, lineHeight: 1.55 }}>{slide.ki}</p>
          </div>
        )}
      </div>
      <div style={{ padding: "0 24px 16px", display: "flex", alignItems: "center", gap: 10, opacity: 0.3, flexShrink: 0 }}>
        <div style={{ flex: 1, height: 1, background: TEAL_DIM }} />
        <span style={{ color: TEAL, fontSize: 9, fontWeight: "bold", letterSpacing: "0.08em" }}>CADUS · aethex Medical Education</span>
        <div style={{ flex: 1, height: 1, background: TEAL_DIM }} />
      </div>
    </div>
  );
}

function renderSlide(slide: PresentationSlide, data: PresentationData, current: number, total: number) {
  switch (slide.type) {
    case "title":      return <TitleSlide slide={slide} current={current} total={total} />;
    case "conditions": return <ConditionsSlide slide={slide} conditions={data.conditions} current={current} total={total} />;
    case "redflags":   return <RedFlagsSlide slide={slide} redflags={data.redflags} current={current} total={total} />;
    case "faq":        return <FAQSlide slide={slide} faq={data.faq} current={current} total={total} />;
    case "glossary":   return <GlossarySlide slide={slide} refs={data.refs} current={current} total={total} />;
    case "summary":    return <ContentSlide slide={slide} current={current} total={total} />;
    default:           return <ContentSlide slide={slide} current={current} total={total} />;
  }
}

export default function PresentationViewer({ data, onClose, pdfBase64, docxBase64, initialIdx = 0 }: Props) {
  const [idx, setIdx] = useState(initialIdx);
  const total = data.slides.length;
  const slide = data.slides[idx];

  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIdx((i) => Math.min(total - 1, i + 1)), [total]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  const pdf64 = pdfBase64 ?? data.pdfBase64;
  const docx64 = docxBase64 ?? data.docxBase64;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", background: "#0B1221", fontFamily: "'Inter','DM Sans',sans-serif" }}>

      {/* ── Top bar: title + downloads + close ── */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "7px 16px", background: "#060D1E", borderBottom: `1px solid rgba(0,188,212,0.18)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ width: 26, height: 26, background: TEAL, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 11 }}>S</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {data.title}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {pdf64 && (
            <a href={`data:application/pdf;base64,${pdf64}`} download={`${data.title}.pdf`}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "white", background: TEAL_DIM, textDecoration: "none" }}>
              <Download style={{ width: 12, height: 12 }} /> PDF
            </a>
          )}
          {docx64 && (
            <a href={`data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${docx64}`} download={`${data.title}.docx`}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "white", background: "#1E3A5F", textDecoration: "none" }}>
              <Download style={{ width: 12, height: 12 }} /> DOCX
            </a>
          )}
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)" }}>
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>
      </div>

      {/* ── Stage — dark bg, slide centered ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "stretch", minHeight: 0, background: "#0B1221" }}>
        {/* Prev arrow */}
        <button onClick={prev} disabled={idx === 0} style={{
          flexShrink: 0, width: 52,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "transparent", border: "none", cursor: idx === 0 ? "default" : "pointer",
          color: "white", opacity: idx === 0 ? 0.1 : 0.55, transition: "opacity 0.2s",
        }}>
          <ChevronLeft style={{ width: 32, height: 32 }} />
        </button>

        {/* Slide with drop shadow — fills the stage vertically */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", padding: "18px 0" }}>
          <div style={{ flex: 1, minHeight: 0, boxShadow: "0 24px 60px rgba(0,0,0,0.65)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
            {slide && renderSlide(slide, data, idx + 1, total)}
          </div>
        </div>

        {/* Next arrow */}
        <button onClick={next} disabled={idx === total - 1} style={{
          flexShrink: 0, width: 52,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "transparent", border: "none", cursor: idx === total - 1 ? "default" : "pointer",
          color: "white", opacity: idx === total - 1 ? 0.1 : 0.55, transition: "opacity 0.2s",
        }}>
          <ChevronRight style={{ width: 32, height: 32 }} />
        </button>
      </div>

      {/* ── Dot nav ── */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        gap: 7, padding: "10px 16px", background: "#060D1E",
        borderTop: `1px solid rgba(0,188,212,0.15)`, flexWrap: "wrap",
      }}>
        {data.slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{
            borderRadius: 4, height: 7,
            width: i === idx ? 24 : 7,
            background: i === idx ? TEAL : "rgba(0,188,212,0.25)",
            border: "none", cursor: "pointer", padding: 0,
            transition: "width 0.25s, background 0.25s",
          }} />
        ))}
      </div>
    </div>
  );
}

```

---

## `artifacts/cadus-ai/src/components/cadus/SettingsModal.tsx` (805 lines)
```tsx
import { useState } from "react";
import {
  X, Settings, Monitor, Brain, MessageSquare, User, Info,
  Moon, Sun, ChevronDown, ChevronUp, ChevronRight,
  Download, Upload, Archive, Trash2, Lock,
  UserCheck, Pencil, Key, Cookie,
  Activity, CheckCircle, Zap, RotateCcw, Volume2, Crown,
  GraduationCap, Building2,
} from "lucide-react";
import { getTranslation } from "@/lib/translations";
import type { UserProfile } from "@/hooks/use-user-auth";

/* ── Types ──────────────────────────────────────────────────────────────── */
export interface CadusSettings {
  theme: "dark" | "auto" | "light";
  fontSize: "sm" | "md" | "lg";
  compactMode: boolean;
  showTimestamps: boolean;
  responseStyle: "concise" | "balanced" | "detailed";
  showThinking: boolean;
  autoTitleChats: boolean;
  streamResponses: boolean;
  researchSources: 5 | 10 | 15;
  defaultModel: "pulse45" | "flux36" | "nova46";
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
  autoCopyResponse: boolean;
  pasteLargeTextAsFile: boolean;
  referenceSavedMemories: boolean;
  referenceChatHistory: boolean;
}

export const DEFAULT_SETTINGS: CadusSettings = {
  theme: "dark",
  fontSize: "md",
  compactMode: false,
  showTimestamps: true,
  responseStyle: "balanced",
  showThinking: true,
  autoTitleChats: true,
  streamResponses: true,
  researchSources: 10,
  defaultModel: "pulse45",
  soundEnabled: false,
  notificationsEnabled: false,
  language: "en",
  autoCopyResponse: false,
  pasteLargeTextAsFile: true,
  referenceSavedMemories: true,
  referenceChatHistory: true,
};

const LS_KEY = "cadus-settings-v2";
const LS_KEY_OLD = "cadus-settings-v1";
export function loadSettings(): CadusSettings {
  try {
    localStorage.removeItem(LS_KEY_OLD);
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { return DEFAULT_SETTINGS; }
}
export function saveSettings(s: CadusSettings) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

/* ── Props ──────────────────────────────────────────────────────────────── */
interface SettingsModalProps {
  settings: CadusSettings;
  onSettingsChange: (s: CadusSettings) => void;
  onClearAllChats?: () => void;
  onClearCurrentChat?: () => void;
  onExportChats?: () => void;
  onClose: () => void;
  user?: UserProfile | null;
  /** When true, chat-destructive actions are hidden (opened from website, not AI page) */
  isFromWebsite?: boolean;
}

type SectionId = "general" | "interface" | "models" | "chats" | "personalization" | "account" | "about";

/* ── Shared sub-components ──────────────────────────────────────────────── */

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex shrink-0 cursor-pointer transition-colors duration-200"
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? "rgba(0,188,212,0.8)" : "rgba(255,255,255,0.1)",
        border: checked ? "1px solid rgba(0,229,255,0.5)" : "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <span
        className="absolute top-0.5 transition-transform duration-200"
        style={{
          width: 20, height: 20, borderRadius: "50%",
          background: checked ? "white" : "rgba(150,180,220,0.6)",
          transform: checked ? "translateX(22px)" : "translateX(2px)",
          boxShadow: checked ? "0 0 8px rgba(0,229,255,0.4)" : "none",
        }}
      />
    </button>
  );
}

function Row({ label, desc, children, last }: { label: string; desc?: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5"
      style={{ borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
      <div className="min-w-0">
        <p className="text-sm font-medium" style={{ color: "rgba(200,230,255,0.9)" }}>{label}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color: "rgba(120,170,220,0.45)" }}>{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(0,200,255,0.4)" }}>
      {children}
    </p>
  );
}

function DangerButton({ label, desc, icon: Icon, onClick }: {
  label: string; desc?: string; icon: React.ElementType; onClick: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(248,113,113,0.2)" }}>
      <button
        type="button"
        onClick={() => { if (confirming) { onClick(); setConfirming(false); } else setConfirming(true); }}
        onBlur={() => setTimeout(() => setConfirming(false), 300)}
        className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
        style={{ background: confirming ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.07)" }}
      >
        <Icon className="w-4 h-4 shrink-0 text-red-400" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-400">{label}</p>
          {desc && <p className="text-xs mt-0.5" style={{ color: "rgba(248,113,113,0.5)" }}>{desc}</p>}
        </div>
        {confirming
          ? <span className="text-xs font-bold text-red-400 shrink-0">Tap again to confirm</span>
          : <ChevronRight className="w-3.5 h-3.5 text-red-400/50 shrink-0" />}
      </button>
    </div>
  );
}

/* ── Section: General ───────────────────────────────────────────────────── */
function SectionGeneral({ s, set, tr }: { s: CadusSettings; set: (k: keyof CadusSettings, v: any) => void; tr: ReturnType<typeof getTranslation> }) {
  return (
    <div className="space-y-6">
      {/* Theme */}
      <Row label="Theme">
        <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid rgba(0,188,212,0.2)", background: "rgba(0,10,30,0.5)" }}>
          {([
            { value: "auto",  label: "System" },
            { value: "light", label: "Light" },
            { value: "dark",  label: "Dark" },
          ] as const).map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => set("theme", t.value)}
              className="px-3 py-1.5 text-xs font-medium transition-all"
              style={s.theme === t.value
                ? { background: "rgba(0,188,212,0.25)", color: "#00E5FF" }
                : { color: "rgba(120,170,220,0.55)" }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Row>

      {/* Language */}
      <Row label="Language">
        <select
          value={s.language}
          onChange={(e) => set("language", e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg outline-none cursor-pointer"
          style={{
            background: "rgba(0,188,212,0.08)",
            border: "1px solid rgba(0,188,212,0.2)",
            color: "rgba(180,225,255,0.9)",
            minWidth: 140,
          }}
        >
          {[
            { value: "en",  label: "English (US)" },
            { value: "hi",  label: "हिन्दी (Hindi)" },
            { value: "as",  label: "অসমীয়া (Assamese)" },
            { value: "bn",  label: "বাংলা (Bengali)" },
            { value: "brx", label: "बड़ो (Bodo)" },
            { value: "doi", label: "डोगरी (Dogri)" },
            { value: "gu",  label: "ગુજરાતી (Gujarati)" },
            { value: "kn",  label: "ಕನ್ನಡ (Kannada)" },
            { value: "ks",  label: "کٲشُر (Kashmiri)" },
            { value: "kok", label: "कोंकणी (Konkani)" },
            { value: "mai", label: "मैथिली (Maithili)" },
            { value: "ml",  label: "മലയാളം (Malayalam)" },
            { value: "mni", label: "মৈতৈলোন্ (Manipuri)" },
            { value: "mr",  label: "मराठी (Marathi)" },
            { value: "ne",  label: "नेपाली (Nepali)" },
            { value: "or",  label: "ଓଡ଼ିଆ (Odia)" },
            { value: "pa",  label: "ਪੰਜਾਬੀ (Punjabi)" },
            { value: "sa",  label: "संस्कृतम् (Sanskrit)" },
            { value: "sat", label: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)" },
            { value: "sd",  label: "سنڌي / सिन्धी (Sindhi)" },
            { value: "ta",  label: "தமிழ் (Tamil)" },
            { value: "te",  label: "తెలుగు (Telugu)" },
            { value: "ur",  label: "اردو (Urdu)" },
          ].map((o) => (
            <option key={o.value} value={o.value} style={{ background: "#071030" }}>{o.label}</option>
          ))}
        </select>
      </Row>

      {/* Voice */}
      <button
        type="button"
        className="w-full flex items-center gap-3 py-3.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <Volume2 className="w-4 h-4 shrink-0" style={{ color: "rgba(0,188,212,0.6)" }} />
        <span className="flex-1 text-sm text-left" style={{ color: "rgba(200,230,255,0.9)" }}>Voice</span>
        <ChevronRight className="w-4 h-4" style={{ color: "rgba(120,170,220,0.35)" }} />
      </button>
    </div>
  );
}

/* ── Section: Interface ─────────────────────────────────────────────────── */
function SectionInterface({ s, set }: { s: CadusSettings; set: (k: keyof CadusSettings, v: any) => void }) {
  return (
    <div>
      <SectionTitle>Chat</SectionTitle>
      <div>
        <Row label="Title Auto-Generation" desc="Generate chat title from first message">
          <Toggle checked={s.autoTitleChats} onChange={(v) => set("autoTitleChats", v)} />
        </Row>
        <Row label="Auto-Copy Response to Clipboard" desc="Automatically copy each reply">
          <Toggle checked={s.autoCopyResponse} onChange={(v) => set("autoCopyResponse", v)} />
        </Row>
        <Row label="Paste Large Text as File" desc="Treat pastes over 2 KB as file attachments" last>
          <Toggle checked={s.pasteLargeTextAsFile} onChange={(v) => set("pasteLargeTextAsFile", v)} />
        </Row>
      </div>

      <div className="mt-6">
        <SectionTitle>Display</SectionTitle>
        <Row label="Show timestamps" desc="Display time on each message">
          <Toggle checked={s.showTimestamps} onChange={(v) => set("showTimestamps", v)} />
        </Row>
        <Row label="Compact mode" desc="Reduce spacing between messages">
          <Toggle checked={s.compactMode} onChange={(v) => set("compactMode", v)} />
        </Row>
        <Row label="Sound effects" desc="Play subtle sounds for actions" last>
          <Toggle checked={s.soundEnabled} onChange={(v) => set("soundEnabled", v)} />
        </Row>
      </div>
    </div>
  );
}

/* ── Section: Models ────────────────────────────────────────────────────── */
const MODEL_DATA = [
  {
    id: "pulse45" as const,
    name: "Cadus Minor",
    color: "#10B981",
    desc: "Vitals, Emergency & Critical Care. Optimised for fast, accurate clinical triage.",
    context: "512,000 tokens",
    summary: "8,192 tokens",
    modality: "text, image",
  },
  {
    id: "flux36" as const,
    name: "Cadus Medius",
    color: "#F59E0B",
    desc: "Pharmacology, Drug Interactions & Lab Analysis. Deep biomedical knowledge base.",
    context: "256,000 tokens",
    summary: "4,096 tokens",
    modality: "text",
  },
  {
    id: "nova46" as const,
    name: "Cadus Magnus",
    color: "#A855F7",
    desc: "Advanced Diagnostics, Research & Multimodal. State-of-the-art reasoning for complex cases.",
    context: "1,000,000 tokens",
    summary: "65,536 tokens",
    modality: "text, image, video",
  },
];

function SectionModels({ s, set }: { s: CadusSettings; set: (k: keyof CadusSettings, v: any) => void }) {
  const [expanded, setExpanded] = useState<string | null>(s.defaultModel);
  return (
    <div className="space-y-2">
      {MODEL_DATA.map((m) => {
        const isOpen = expanded === m.id;
        const isSelected = s.defaultModel === m.id;
        return (
          <div key={m.id} className="rounded-xl overflow-hidden" style={{
            border: isSelected ? `1px solid ${m.color}44` : "1px solid rgba(255,255,255,0.07)",
            background: isSelected ? `${m.color}08` : "rgba(255,255,255,0.02)",
          }}>
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 text-left"
              onClick={() => { set("defaultModel", m.id); setExpanded(isOpen ? null : m.id); }}
            >
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}80` }} />
              <span className="flex-1 text-sm font-medium" style={{ color: isSelected ? "rgba(210,240,255,0.95)" : "rgba(160,205,245,0.7)" }}>
                {m.name}
              </span>
              {isSelected && <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: m.color }} />}
              {isOpen
                ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: "rgba(120,170,220,0.4)" }} />
                : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "rgba(120,170,220,0.4)" }} />}
            </button>
            {isOpen && (
              <div className="px-4 pb-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-xs mt-3 leading-relaxed" style={{ color: "rgba(130,180,230,0.6)" }}>{m.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(0,10,30,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(0,200,255,0.35)" }}>Max context length</p>
                    <p className="text-sm font-semibold" style={{ color: "rgba(200,235,255,0.9)" }}>{m.context}</p>
                  </div>
                  <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(0,10,30,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(0,200,255,0.35)" }}>Max summary length</p>
                    <p className="text-sm font-semibold" style={{ color: "rgba(200,235,255,0.9)" }}>{m.summary}</p>
                  </div>
                </div>
                <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(0,10,30,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(0,200,255,0.35)" }}>Modality</p>
                  <p className="text-sm font-semibold" style={{ color: "rgba(200,235,255,0.9)" }}>{m.modality}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Section: Chats ─────────────────────────────────────────────────────── */
function SectionChatsClean({ onClearAll, onClearCurrent, onExport, onClose, isFromWebsite }: {
  onClearAll?: () => void; onClearCurrent?: () => void; onExport?: () => void; onClose: () => void; isFromWebsite?: boolean;
}) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const rows: { label: string; icon: React.ElementType; right: React.ReactNode }[] = [
    {
      label: "Import Chats",
      icon: Upload,
      right: <span className="text-sm" style={{ color: "rgba(120,170,220,0.6)" }}>Import Chats</span>,
    },
    {
      label: "Export Chats",
      icon: Download,
      right: onExport ? (
        <button type="button" onClick={() => { onExport!(); onClose(); }}
          className="text-sm" style={{ color: "rgba(120,170,220,0.6)" }}>
          Export Chats
        </button>
      ) : (
        <span className="text-sm" style={{ color: "rgba(120,170,220,0.35)" }}>Open AI page first</span>
      ),
    },
    {
      label: "Archive All Chats",
      icon: Archive,
      right: <span className="text-sm" style={{ color: "rgba(120,170,220,0.6)" }}>Archive All Chats</span>,
    },
    {
      label: "Delete All Chats",
      icon: Trash2,
      right: onClearAll ? (deleteConfirm ? (
        <button type="button" onClick={() => { onClearAll!(); setDeleteConfirm(false); onClose(); }}
          className="text-xs font-bold px-2 py-1 rounded-lg"
          style={{ background: "rgba(239,68,68,0.15)", color: "#F87171", border: "1px solid rgba(248,113,113,0.3)" }}>
          Confirm
        </button>
      ) : (
        <button type="button" onClick={() => setDeleteConfirm(true)}
          className="text-sm px-2 py-1 rounded-lg"
          style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
          Delete Chat
        </button>
      )) : (
        <span className="text-sm" style={{ color: "rgba(120,170,220,0.35)" }}>Open AI page first</span>
      ),
    },
  ];

  return (
    <div>
      {isFromWebsite && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
          style={{ background: "rgba(0,188,212,0.07)", border: "1px solid rgba(0,188,212,0.15)", color: "rgba(0,200,255,0.6)" }}>
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          Chat actions are available inside the Cadus AI page.
        </div>
      )}
      {rows.map((r, i) => {
        const Icon = r.icon;
        const isLast = i === rows.length - 1;
        const isDanger = r.label === "Delete All Chats";
        return (
          <div key={r.label} className="flex items-center gap-3 py-3.5"
            style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
            <Icon className="w-4 h-4 shrink-0" style={{ color: isDanger ? "#F87171" : "rgba(0,188,212,0.6)" }} />
            <span className="flex-1 text-sm" style={{ color: isDanger ? "rgba(248,180,180,0.85)" : "rgba(200,230,255,0.85)" }}>
              {r.label}
            </span>
            {r.right}
          </div>
        );
      })}

      {!isFromWebsite && (
        <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <SectionTitle>Current Session</SectionTitle>
          <DangerButton label="Clear current chat" desc="Remove messages from active session"
            icon={RotateCcw} onClick={onClearCurrent ?? (() => {})} />
        </div>
      )}
    </div>
  );
}

/* ── Section: Personalization ───────────────────────────────────────────── */
function SectionPersonalization({ s, set }: { s: CadusSettings; set: (k: keyof CadusSettings, v: any) => void }) {
  return (
    <div className="space-y-6">
      {/* Memory */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>Memory</SectionTitle>
          <button type="button" className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(0,200,255,0.5)" }}>
            <Archive className="w-3 h-3" />
            Manage
          </button>
        </div>
        <Row label="Reference saved memories" desc="Cadus will save and reference memories when generating replies">
          <Toggle checked={s.referenceSavedMemories} onChange={(v) => set("referenceSavedMemories", v)} />
        </Row>
        <Row label="Reference the chat history" desc="Cadus will reference saved memory when generating responses" last>
          <Toggle checked={s.referenceChatHistory} onChange={(v) => set("referenceChatHistory", v)} />
        </Row>
      </div>

      {/* Customize */}
      <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <SectionTitle>Customize Cadus</SectionTitle>
        <button type="button" className="w-full flex items-center gap-3 py-3.5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Pencil className="w-4 h-4 shrink-0" style={{ color: "rgba(0,188,212,0.6)" }} />
          <span className="flex-1 text-sm text-left" style={{ color: "rgba(200,230,255,0.85)" }}>Customize Cadus</span>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(0,200,255,0.5)" }}>
            <Archive className="w-3 h-3" />
            Settings
          </div>
        </button>
      </div>

      {/* Cookies */}
      <div>
        <SectionTitle>Manage Cookies</SectionTitle>
        <button type="button" className="w-full flex items-center gap-3 py-3.5">
          <Cookie className="w-4 h-4 shrink-0" style={{ color: "rgba(0,188,212,0.6)" }} />
          <span className="flex-1 text-sm text-left" style={{ color: "rgba(200,230,255,0.85)" }}>Manage Cookies</span>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(0,200,255,0.5)" }}>
            <Archive className="w-3 h-3" />
            Manage
          </div>
        </button>
      </div>
    </div>
  );
}

/* ── Section: Account ───────────────────────────────────────────────────── */
function SectionAccount({ user }: { user?: UserProfile | null }) {
  const displayName = user?.name || "Cadus User";
  const displayEmail = user?.email || "user@aethex.in";
  const isPro = user?.isPro ?? false;
  const dailyCount = user?.cadusDailyCount ?? 0;
  const dailyLimit = isPro ? 200 : 20;
  const dailyPct = Math.min(100, Math.round((dailyCount / dailyLimit) * 100));
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-5">
      {/* Profile card */}
      <div className="flex items-center gap-4 px-4 py-4 rounded-xl"
        style={{ background: "rgba(0,188,212,0.05)", border: "1px solid rgba(0,188,212,0.12)" }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-base text-white"
          style={{ background: "linear-gradient(135deg, #00BCD4, #7C3AED)", boxShadow: "0 0 16px rgba(0,188,212,0.3)" }}>
          {initials || <User className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate" style={{ color: "rgba(210,240,255,0.95)" }}>{displayName}</p>
            {isPro && (
              <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: "rgba(0,194,168,0.15)", border: "1px solid rgba(0,194,168,0.35)", color: "#00C2A8" }}>
                <Crown className="w-2.5 h-2.5" />PRO
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(120,170,220,0.5)" }}>{displayEmail}</p>
        </div>
        <button type="button" className="text-sm px-3 py-1.5 rounded-lg"
          style={{ color: "rgba(0,200,255,0.7)", border: "1px solid rgba(0,188,212,0.2)" }}>
          Edit account
        </button>
      </div>

      {/* Role / College / Hospital info */}
      {(user?.role || user?.college || user?.hospital) && (
        <div className="rounded-xl px-4 py-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {user?.role && (
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(0,188,212,0.5)" }} />
              <span className="text-xs capitalize" style={{ color: "rgba(120,170,220,0.6)" }}>
                {user.role === "student" ? "Medical Student" : user.role === "doctor" ? "Doctor" : "General User"}
              </span>
            </div>
          )}
          {user?.college && (
            <div className="flex items-start gap-2">
              <GraduationCap className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "rgba(0,188,212,0.5)" }} />
              <span className="text-xs" style={{ color: "rgba(180,215,255,0.75)" }}>{user.college}</span>
            </div>
          )}
          {user?.hospital && (
            <div className="flex items-start gap-2">
              <Building2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "rgba(0,188,212,0.5)" }} />
              <span className="text-xs" style={{ color: "rgba(180,215,255,0.75)" }}>{user.hospital}</span>
            </div>
          )}
        </div>
      )}

      {/* Daily usage bar */}
      <div className="rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold" style={{ color: "rgba(180,215,255,0.75)" }}>Daily AI queries</p>
          <p className="text-xs font-bold" style={{ color: dailyCount >= dailyLimit ? "#F87171" : "rgba(0,200,255,0.7)" }}>
            {dailyCount} / {dailyLimit}
          </p>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${dailyPct}%`,
              background: dailyCount >= dailyLimit
                ? "linear-gradient(90deg,#F87171,#ef4444)"
                : "linear-gradient(90deg,#00BCD4,#00E5FF)",
            }} />
        </div>
        {!isPro && (
          <p className="text-[10px] mt-1.5" style={{ color: "rgba(120,170,220,0.4)" }}>
            Upgrade to Cadus Magnus for 200 daily queries
          </p>
        )}
      </div>

      {/* Password */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3 py-3.5">
          <Key className="w-4 h-4 shrink-0" style={{ color: "rgba(0,188,212,0.6)" }} />
          <span className="flex-1 text-sm" style={{ color: "rgba(200,230,255,0.85)" }}>Password management</span>
          <button type="button" className="text-sm" style={{ color: "rgba(120,170,220,0.55)" }}>
            Change password
          </button>
        </div>
      </div>

      {/* Account management */}
      <div>
        <div className="flex items-center gap-3 py-3.5">
          <Lock className="w-4 h-4 shrink-0 text-red-400" />
          <span className="flex-1 text-sm" style={{ color: "rgba(200,230,255,0.85)" }}>Account Management</span>
          <AccountDeleteButton />
        </div>
      </div>
    </div>
  );
}

function AccountDeleteButton() {
  const [confirming, setConfirming] = useState(false);
  return confirming ? (
    <button type="button"
      onBlur={() => setTimeout(() => setConfirming(false), 300)}
      className="text-xs font-bold px-2 py-1 rounded-lg"
      style={{ background: "rgba(239,68,68,0.15)", color: "#F87171", border: "1px solid rgba(248,113,113,0.3)" }}>
      Confirm?
    </button>
  ) : (
    <button type="button" onClick={() => setConfirming(true)}
      className="text-sm px-2 py-1 rounded-lg"
      style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)" }}>
      Delete Account
    </button>
  );
}

/* ── Section: About ─────────────────────────────────────────────────────── */
function SectionAbout() {
  return (
    <div className="space-y-5">
      {/* Version card */}
      <div className="rounded-2xl p-4" style={{ background: "rgba(0,188,212,0.06)", border: "1px solid rgba(0,188,212,0.15)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(0,188,212,0.12)", border: "1px solid rgba(0,229,255,0.2)" }}>
            <Zap className="w-5 h-5" style={{ color: "#00E5FF" }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "rgba(200,240,255,0.95)", fontFamily: "'Orbitron', monospace", letterSpacing: "0.06em" }}>Cadus AI</p>
            <p className="text-xs" style={{ color: "rgba(100,170,220,0.55)" }}>Medical AI Suite · v3.0.0</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(120,175,220,0.6)" }}>
          Cadus is dedicated to pursuing next-generation medical AI, focused on building specialist models for Indian doctors and medical students. Our mission is to create safe, responsible, and intelligent tools that make quality clinical decision support accessible to every healthcare professional.
        </p>
      </div>

      {/* About section */}
      <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-sm font-semibold mb-2" style={{ color: "rgba(200,235,255,0.9)" }}>About</p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(120,170,220,0.55)" }}>
          A product of Clavix Technologies Pvt Ltd. Cadus provides AI-powered clinical assistance including diagnostic support, drug interaction checking, and medical image generation. All outputs must be verified by qualified medical professionals before clinical use.
        </p>
      </div>

      {/* Feedback */}
      <div>
        <p className="text-xs font-semibold mb-1" style={{ color: "rgba(180,215,255,0.7)" }}>Feedback email</p>
        <p className="text-xs" style={{ color: "rgba(0,200,255,0.55)" }}>email@aethex.in</p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
        style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
        <Activity className="w-4 h-4 text-emerald-400" />
        <p className="text-sm" style={{ color: "rgba(110,231,183,0.85)" }}>All systems operational</p>
        <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" style={{ animation: "cadus-breathe 2s ease-in-out infinite" }} />
      </div>

      {/* Links */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Terms of Service", href: "#" },
          { label: "Privacy Policy", href: "#" },
          { label: "Cookie Notice", href: "#" },
          { label: "aethex Store", href: "/" },
        ].map((l) => (
          <a key={l.label} href={l.href}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors"
            style={{ color: "rgba(0,200,255,0.6)", border: "1px solid rgba(0,188,212,0.12)" }}>
            {l.label}
            <ChevronRight className="w-3 h-3 opacity-50" />
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Nav config ─────────────────────────────────────────────────────────── */
const NAV: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "general",         label: "General",         icon: Settings },
  { id: "interface",       label: "Interface",        icon: Monitor },
  { id: "models",          label: "Models",           icon: Brain },
  { id: "chats",           label: "Chats",            icon: MessageSquare },
  { id: "personalization", label: "Personalization",  icon: UserCheck },
  { id: "account",         label: "Account",          icon: User },
  { id: "about",           label: "About",            icon: Info },
];

/* ── Main Modal ─────────────────────────────────────────────────────────── */
export default function SettingsModal({
  settings, onSettingsChange, onClearAllChats, onClearCurrentChat, onExportChats, onClose, user, isFromWebsite,
}: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("general");
  const tr = getTranslation(settings.language);

  const set = (key: keyof CadusSettings, value: any) => {
    const next = { ...settings, [key]: value };
    onSettingsChange(next);
    saveSettings(next);
  };

  const activeNav = NAV.find((x) => x.id === activeSection)!;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex overflow-hidden w-full"
        style={{
          maxWidth: 800,
          height: "min(88vh, 620px)",
          background: "rgba(3,9,24,0.97)",
          border: "1px solid rgba(0,188,212,0.2)",
          borderRadius: 20,
          boxShadow: "0 0 80px rgba(0,188,212,0.1), 0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* ── Left nav ── */}
        <div
          className="flex flex-col shrink-0 py-5"
          style={{
            width: 200,
            background: "rgba(0,0,0,0.3)",
            borderRight: "1px solid rgba(0,188,212,0.1)",
          }}
        >
          <div className="px-5 pb-4 mb-1" style={{ borderBottom: "1px solid rgba(0,188,212,0.08)" }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(0,200,255,0.45)" }}>
              {tr.settings}
            </p>
          </div>

          <nav className="flex-1 px-2 pt-2 space-y-0.5 overflow-y-auto">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                style={
                  activeSection === id
                    ? { background: "rgba(0,188,212,0.12)", border: "1px solid rgba(0,229,255,0.2)", color: "#00E5FF" }
                    : { border: "1px solid transparent", color: "rgba(120,175,220,0.6)" }
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          <div className="px-4 pt-3 mt-2" style={{ borderTop: "1px solid rgba(0,188,212,0.08)" }}>
            <p className="text-[10px]" style={{ color: "rgba(0,200,255,0.25)" }}>Cadus AI · v3.0.0</p>
          </div>
        </div>

        {/* ── Right content ── */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Content header */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(0,188,212,0.1)" }}>
            <h2 className="font-semibold text-base" style={{ color: "rgba(200,235,255,0.95)" }}>
              {activeNav.label}
            </h2>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg transition-colors"
              style={{ color: "rgba(100,170,220,0.5)" }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {activeSection === "general" && <SectionGeneral s={settings} set={set} tr={tr} />}
            {activeSection === "interface" && <SectionInterface s={settings} set={set} />}
            {activeSection === "models" && <SectionModels s={settings} set={set} />}
            {activeSection === "chats" && (
              <SectionChatsClean
                onClearAll={onClearAllChats}
                onClearCurrent={onClearCurrentChat}
                onExport={onExportChats}
                onClose={onClose}
                isFromWebsite={isFromWebsite}
              />
            )}
            {activeSection === "personalization" && <SectionPersonalization s={settings} set={set} />}
            {activeSection === "account" && <SectionAccount user={user} />}
            {activeSection === "about" && <SectionAbout />}
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

## `artifacts/cadus-ai/src/components/cadus/TypewriterText.tsx` (113 lines)
```tsx
import { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  text: string;
  isNew: boolean;
  onDone?: () => void;
  onScroll?: () => void;
}

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    const stripped = line.trimStart();
    if (stripped.startsWith("### "))
      return <p key={li} className="font-bold text-[13px] mt-3 mb-0.5" style={{ color: "rgba(150,220,255,0.95)" }}>{stripped.slice(4)}</p>;
    if (stripped.startsWith("## "))
      return <p key={li} className="font-bold text-[14px] mt-4 mb-1" style={{ color: "rgba(100,190,255,0.95)" }}>{stripped.slice(3)}</p>;
    if (stripped.startsWith("# "))
      return <p key={li} className="font-bold text-[15px] mt-4 mb-1" style={{ color: "rgba(150,210,255,1)" }}>{stripped.slice(2)}</p>;
    if (stripped.startsWith("- ") || stripped.startsWith("• "))
      return (
        <div key={li} className="flex gap-2">
          <span className="text-teal-400 mt-0.5 shrink-0">•</span>
          <span>{renderInline(stripped.slice(2))}</span>
        </div>
      );
    if (stripped === "---" || stripped === "***")
      return <hr key={li} style={{ borderColor: "rgba(255,255,255,0.1)", margin: "8px 0" }} />;
    if (stripped === "")
      return <div key={li} className="h-1" />;
    return <p key={li}>{renderInline(stripped)}</p>;
  });
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return (
    <>
      {parts.map((chunk, ci) =>
        chunk.startsWith("**") && chunk.endsWith("**")
          ? <strong key={ci} style={{ color: "rgba(200,230,255,0.95)" }}>{chunk.slice(2, -2)}</strong>
          : <span key={ci}>{chunk}</span>
      )}
    </>
  );
}

export function TypewriterText({ text, isNew, onDone, onScroll }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState(() => isNew ? "" : text);
  const [done, setDone] = useState(!isNew);
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!isNew) return;

    idxRef.current = 0;
    setDisplayed("");
    setDone(false);

    const type = () => {
      if (!mountedRef.current) return;
      if (idxRef.current >= text.length) {
        setDone(true);
        onDone?.();
        return;
      }

      const char = text[idxRef.current];
      const isPunct = /[.!?]/.test(char);
      const isSemiPunct = /[;:,]/.test(char);
      const isNewline = char === "\n";

      let delay: number;
      if (isPunct)      delay = 55 + Math.random() * 35;
      else if (isSemiPunct) delay = 28 + Math.random() * 15;
      else if (isNewline)   delay = 35 + Math.random() * 20;
      else                  delay = 11 + Math.random() * 7;

      setDisplayed(text.slice(0, ++idxRef.current));
      onScroll?.();

      timerRef.current = setTimeout(type, delay);
    };

    timerRef.current = setTimeout(type, 80);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [text, isNew]);

  return (
    <div
      className="space-y-1"
      style={{ animation: isNew ? "tw-fade-up 0.25s ease-out both" : undefined }}
    >
      {renderMarkdown(done ? text : displayed)}
      {isNew && !done && (
        <span
          className="inline-block w-[2px] h-[14px] rounded-sm align-middle ml-0.5"
          style={{
            background: "rgba(0,194,168,0.85)",
            animation: "tw-cursor-blink 0.9s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}

```

---

## `artifacts/cadus-ai/src/components/ui/accordion.tsx` (55 lines)
```tsx
import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

```

---

## `artifacts/cadus-ai/src/components/ui/alert-dialog.tsx` (139 lines)
```tsx
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}

```

---

## `artifacts/cadus-ai/src/components/ui/alert.tsx` (59 lines)
```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

```

---

## `artifacts/cadus-ai/src/components/ui/aspect-ratio.tsx` (5 lines)
```tsx
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }

```

---

## `artifacts/cadus-ai/src/components/ui/avatar.tsx` (50 lines)
```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

```

---

## `artifacts/cadus-ai/src/components/ui/badge.tsx` (43 lines)
```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // @replit
  // Whitespace-nowrap: Badges should never wrap.
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" +
  " hover-elevate ",
  {
    variants: {
      variant: {
        default:
          // @replit shadow-xs instead of shadow, no hover because we use hover-elevate
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary:
          // @replit no hover because we use hover-elevate
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          // @replit shadow-xs instead of shadow, no hover because we use hover-elevate
          "border-transparent bg-destructive text-destructive-foreground shadow-xs",
          // @replit shadow-xs" - use badge outline variable
        outline: "text-foreground border [border-color:var(--badge-outline)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

```

---

## `artifacts/cadus-ai/src/components/ui/breadcrumb.tsx` (115 lines)
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}

```

---

## `artifacts/cadus-ai/src/components/ui/button-group.tsx` (83 lines)
```tsx
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const buttonGroupVariants = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      className={cn(
        "bg-muted shadow-xs flex items-center gap-2 rounded-md border px-4 text-sm font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}

```

---

## `artifacts/cadus-ai/src/components/ui/button.tsx` (65 lines)
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
" hover-elevate active-elevate-2",
  {
    variants: {
      variant: {
        default:
           // @replit: no hover, and add primary border
           "bg-primary text-primary-foreground border border-primary-border",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm border-destructive-border",
        outline:
          // @replit Shows the background color of whatever card / sidebar / accent background it is inside of.
          // Inherits the current text color. Uses shadow-xs. no shadow on active
          // No hover state
          " border [border-color:var(--button-outline)] shadow-xs active:shadow-none ",
        secondary:
          // @replit border, no hover, no shadow, secondary border.
          "border bg-secondary text-secondary-foreground border border-secondary-border ",
        // @replit no hover, transparent border
        ghost: "border border-transparent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // @replit changed sizes
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 rounded-md px-3 text-xs",
        lg: "min-h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

```

---

## `artifacts/cadus-ai/src/components/ui/calendar.tsx` (213 lines)
```tsx
"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-accent rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }

```

---

## `artifacts/cadus-ai/src/components/ui/card.tsx` (76 lines)
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```

---

## `artifacts/cadus-ai/src/components/ui/carousel.tsx` (260 lines)
```tsx
import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}

```

---

## `artifacts/cadus-ai/src/components/ui/chart.tsx` (367 lines)
```tsx
import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload
            .filter((item) => item.type !== "none")
            .map((item, index) => {
              const key = `${nameKey || item.name || item.dataKey || "value"}`
              const itemConfig = getPayloadConfigFromPayload(config, item, key)
              const indicatorColor = color || item.payload.fill || item.color

              return (
                <div
                  key={item.dataKey}
                  className={cn(
                    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                    indicator === "dot" && "items-center"
                  )}
                >
                  {formatter && item?.value !== undefined && item.name ? (
                    formatter(item.value, item.name, item, index, item.payload)
                  ) : (
                    <>
                      {itemConfig?.icon ? (
                        <itemConfig.icon />
                      ) : (
                        !hideIndicator && (
                          <div
                            className={cn(
                              "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                              {
                                "h-2.5 w-2.5": indicator === "dot",
                                "w-1": indicator === "line",
                                "w-0 border-[1.5px] border-dashed bg-transparent":
                                  indicator === "dashed",
                                "my-0.5": nestLabel && indicator === "dashed",
                              }
                            )}
                            style={
                              {
                                "--color-bg": indicatorColor,
                                "--color-border": indicatorColor,
                              } as React.CSSProperties
                            }
                          />
                        )
                      )}
                      <div
                        className={cn(
                          "flex flex-1 justify-between leading-none",
                          nestLabel ? "items-end" : "items-center"
                        )}
                      >
                        <div className="grid gap-1.5">
                          {nestLabel ? tooltipLabel : null}
                          <span className="text-muted-foreground">
                            {itemConfig?.label || item.name}
                          </span>
                        </div>
                        {item.value && (
                          <span className="font-mono font-medium tabular-nums text-foreground">
                            {item.value.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload
          .filter((item) => item.type !== "none")
          .map((item) => {
            const key = `${nameKey || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)

            return (
              <div
                key={item.value}
                className={cn(
                  "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
                )}
              >
                {itemConfig?.icon && !hideIcon ? (
                  <itemConfig.icon />
                ) : (
                  <div
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                )}
                {itemConfig?.label}
              </div>
            )
          })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}

```

---

## `artifacts/cadus-ai/src/components/ui/checkbox.tsx` (28 lines)
```tsx
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("grid place-content-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

```

---

## `artifacts/cadus-ai/src/components/ui/collapsible.tsx` (11 lines)
```tsx
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

```

---

## `artifacts/cadus-ai/src/components/ui/command.tsx` (153 lines)
```tsx
"use client"

import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}

```

---

## `artifacts/cadus-ai/src/components/ui/context-menu.tsx` (198 lines)
```tsx
import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 max-h-[--radix-context-menu-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-context-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-4 w-4 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}

```

---

## `artifacts/cadus-ai/src/components/ui/dialog.tsx` (120 lines)
```tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

```

---

## `artifacts/cadus-ai/src/components/ui/drawer.tsx` (116 lines)
```tsx
import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}

```

---

## `artifacts/cadus-ai/src/components/ui/dropdown-menu.tsx` (201 lines)
```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

```

---

## `artifacts/cadus-ai/src/components/ui/empty.tsx` (104 lines)
```tsx
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}

```

---

## `artifacts/cadus-ai/src/components/ui/field.tsx` (244 lines)
```tsx
"use client"

import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  "group/field data-[invalid=true]:text-destructive flex w-full gap-3",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px has-[>[data-slot=field-content]]:items-start",
        ],
        responsive: [
          "@md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto flex-col [&>*]:w-full [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>[data-slot=field]]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium leading-snug group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-muted-foreground text-sm font-normal leading-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors) {
      return null
    }

    if (errors?.length === 1 && errors[0]?.message) {
      return errors[0].message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {errors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}

```

---

## `artifacts/cadus-ai/src/components/ui/form.tsx` (176 lines)
```tsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>")
  }

  const fieldState = getFieldState(fieldContext.name, formState)

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}

```

---

## `artifacts/cadus-ai/src/components/ui/hover-card.tsx` (27 lines)
```tsx
import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-hover-card-content-transform-origin]",
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }

```

---

## `artifacts/cadus-ai/src/components/ui/input-group.tsx` (168 lines)
```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group border-input dark:bg-input/30 shadow-xs relative flex w-full items-center rounded-md border outline-none transition-[color,box-shadow]",
        "h-9 has-[>textarea]:h-auto",

        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-1",

        // Error state.
        "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[-0.4rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "[.border-b]:pb-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5",
        "block-end":
          "[.border-t]:pt-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-muted-foreground flex items-center gap-2 text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}

```

---

## `artifacts/cadus-ai/src/components/ui/input-otp.tsx` (69 lines)
```tsx
import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

```

---

## `artifacts/cadus-ai/src/components/ui/input.tsx` (22 lines)
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

```

---

## `artifacts/cadus-ai/src/components/ui/item.tsx` (193 lines)
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn("group/item-group flex flex-col", className)}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  "group/item [a]:hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 [a]:transition-colors flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-colors duration-100 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border",
        muted: "bg-muted/50",
      },
      size: {
        default: "gap-4 p-4 ",
        sm: "gap-2.5 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted size-8 rounded-sm border [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium leading-snug",
        className
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "text-muted-foreground line-clamp-2 text-balance text-sm font-normal leading-normal",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}

```

---

## `artifacts/cadus-ai/src/components/ui/kbd.tsx` (28 lines)
```tsx
import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium",
        "[&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }

```

---

## `artifacts/cadus-ai/src/components/ui/label.tsx` (26 lines)
```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

```

---

## `artifacts/cadus-ai/src/components/ui/menubar.tsx` (254 lines)
```tsx
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-4 w-4 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}

```

---

## `artifacts/cadus-ai/src/components/ui/navigation-menu.tsx` (128 lines)
```tsx
import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}

```

---

## `artifacts/cadus-ai/src/components/ui/pagination.tsx` (117 lines)
```tsx
import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

```

---

## `artifacts/cadus-ai/src/components/ui/popover.tsx` (31 lines)
```tsx
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }

```

---

## `artifacts/cadus-ai/src/components/ui/progress.tsx` (28 lines)
```tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

```

---

## `artifacts/cadus-ai/src/components/ui/radio-group.tsx` (42 lines)
```tsx
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-3.5 w-3.5 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }

```

---

## `artifacts/cadus-ai/src/components/ui/resizable.tsx` (45 lines)
```tsx
"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

```

---

## `artifacts/cadus-ai/src/components/ui/scroll-area.tsx` (46 lines)
```tsx
import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }

```

---

## `artifacts/cadus-ai/src/components/ui/select.tsx` (159 lines)
```tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

```

---

## `artifacts/cadus-ai/src/components/ui/separator.tsx` (29 lines)
```tsx
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

```

---

## `artifacts/cadus-ai/src/components/ui/sheet.tsx` (140 lines)
```tsx
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

```

---

## `artifacts/cadus-ai/src/components/ui/sidebar.tsx` (727 lines)
```tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"
import { PanelLeftIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-[var(--sidebar-width)] flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-[var(--sidebar-width)] p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+var(--spacing-4))]"
            : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+var(--spacing-4)+2px)]"
            : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()

  // Note: Tailwind v3.4 doesn't support "in-" selectors. So the rail won't work perfectly.
  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:w-8! group-data-[collapsible=icon]:h-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button"
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  showOnHover?: boolean
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-[var(--skeleton-width)] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  size?: "sm" | "md"
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline outline-2 outline-transparent outline-offset-2 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}

```

---

## `artifacts/cadus-ai/src/components/ui/skeleton.tsx` (15 lines)
```tsx
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }

```

---

## `artifacts/cadus-ai/src/components/ui/slider.tsx` (26 lines)
```tsx
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

```

---

## `artifacts/cadus-ai/src/components/ui/sonner.tsx` (31 lines)
```tsx
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

```

---

## `artifacts/cadus-ai/src/components/ui/spinner.tsx` (16 lines)
```tsx
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }

```

---

## `artifacts/cadus-ai/src/components/ui/switch.tsx` (27 lines)
```tsx
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

```

---

## `artifacts/cadus-ai/src/components/ui/table.tsx` (120 lines)
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

```

---

## `artifacts/cadus-ai/src/components/ui/tabs.tsx` (53 lines)
```tsx
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

```

---

## `artifacts/cadus-ai/src/components/ui/textarea.tsx` (22 lines)
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

```

---

## `artifacts/cadus-ai/src/components/ui/toaster.tsx` (33 lines)
```tsx
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

```

---

## `artifacts/cadus-ai/src/components/ui/toast.tsx` (127 lines)
```tsx
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

```

---

## `artifacts/cadus-ai/src/components/ui/toggle-group.tsx` (61 lines)
```tsx
"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }

```

---

## `artifacts/cadus-ai/src/components/ui/toggle.tsx` (43 lines)
```tsx
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }

```

---

## `artifacts/cadus-ai/src/components/ui/tooltip.tsx` (32 lines)
```tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

```

---

## `artifacts/cadus-ai/src/hooks/use-mobile.tsx` (19 lines)
```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

```

---

## `artifacts/cadus-ai/src/hooks/use-toast.ts` (191 lines)
```ts
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

```

---

## `artifacts/cadus-ai/src/hooks/use-user-auth.ts` (244 lines)
```ts
import { useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
  proExpiry?: string;
  avatar?: string;
  phone?: string;
  role?: "student" | "doctor" | "other";
  college?: string;
  hospital?: string;
  addresses: Address[];
  wishlist: number[];
  cadusDailyCount: number;
  cadusLastDate: string;
  verified?: boolean;
  verificationStatus?: "none" | "pending" | "approved" | "rejected";
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const STORAGE_KEY = "aethex_user";
const USERS_KEY = "aethex_users_db";
const JWT_KEY = "aethex_jwt";

function getUsers(): Record<string, UserProfile & { passwordHash: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, UserProfile & { passwordHash: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export function useUserAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const saveUser = (u: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };

  const signup = (
    name: string,
    email: string,
    password: string,
    role?: "student" | "doctor" | "other",
    college?: string,
    hospital?: string,
  ): { success: boolean; error?: string } => {
    const users = getUsers();
    const emailKey = email.toLowerCase();
    if (users[emailKey]) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser: UserProfile & { passwordHash: string } = {
      id: Date.now().toString(),
      name,
      email: emailKey,
      isPro: false,
      role,
      college,
      hospital,
      addresses: [],
      wishlist: [],
      cadusDailyCount: 0,
      cadusLastDate: "",
      passwordHash: simpleHash(password),
    };
    users[emailKey] = newUser;
    saveUsers(users);
    const { passwordHash: _ph, ...profile } = newUser;
    saveUser(profile);
    return { success: true };
  };

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const users = getUsers();
    const emailKey = email.toLowerCase();
    const stored = users[emailKey];
    if (!stored) {
      return { success: false, error: "No account found with this email." };
    }
    if (stored.passwordHash !== simpleHash(password)) {
      return { success: false, error: "Incorrect password." };
    }
    const { passwordHash: _ph, ...profile } = stored;
    saveUser(profile);
    return { success: true };
  };

  const otpLogin = (email: string, jwt: string): void => {
    localStorage.setItem(JWT_KEY, jwt);
    const users = getUsers();
    const emailKey = email.toLowerCase();
    let profile: UserProfile;
    if (users[emailKey]) {
      const { passwordHash: _ph, ...existing } = users[emailKey];
      profile = existing;
    } else {
      const namePart = email.split("@")[0] ?? "Doctor";
      const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      profile = {
        id: Date.now().toString(),
        name,
        email: emailKey,
        isPro: false,
        addresses: [],
        wishlist: [],
        cadusDailyCount: 0,
        cadusLastDate: "",
      };
      users[emailKey] = { ...profile, passwordHash: "" };
      saveUsers(users);
    }
    saveUser(profile);
  };

  const phoneLogin = (phone: string, jwt: string): void => {
    localStorage.setItem(JWT_KEY, jwt);
    const phoneKey = `phone:${phone}`;
    const users = getUsers();
    let profile: UserProfile;
    if (users[phoneKey]) {
      const { passwordHash: _ph, ...existing } = users[phoneKey];
      profile = existing;
    } else {
      profile = {
        id: Date.now().toString(),
        name: "Doctor",
        email: "",
        phone,
        isPro: false,
        addresses: [],
        wishlist: [],
        cadusDailyCount: 0,
        cadusLastDate: "",
      };
      users[phoneKey] = { ...profile, passwordHash: "" };
      saveUsers(users);
    }
    saveUser(profile);
  };

  const getJwt = (): string | null => localStorage.getItem(JWT_KEY);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(JWT_KEY);
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    const users = getUsers();
    const emailKey = user.email.toLowerCase();
    if (users[emailKey]) {
      users[emailKey] = { ...users[emailKey], ...updates };
      saveUsers(users);
    }
    saveUser(updated);
  };

  const toggleWishlist = (productId: number) => {
    if (!user) return;
    const wishlist = user.wishlist.includes(productId)
      ? user.wishlist.filter(id => id !== productId)
      : [...user.wishlist, productId];
    updateProfile({ wishlist });
  };

  const activatePro = () => {
    if (!user) return;
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    updateProfile({ isPro: true, proExpiry: expiry.toISOString() });
  };

  const activateProAnnual = () => {
    if (!user) return;
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    updateProfile({ isPro: true, proExpiry: expiry.toISOString() });
  };

  const incrementCadusCount = (): boolean => {
    if (!user) return false;
    if (user.isPro) return true;
    const today = new Date().toDateString();
    const count = user.cadusLastDate === today ? user.cadusDailyCount : 0;
    if (count >= 10) return false;
    updateProfile({ cadusDailyCount: count + 1, cadusLastDate: today });
    return true;
  };

  return {
    user,
    isLoggedIn: !!user,
    isPro: user?.isPro ?? false,
    signup,
    login,
    otpLogin,
    phoneLogin,
    getJwt,
    logout,
    updateProfile,
    toggleWishlist,
    activatePro,
    activateProAnnual,
    incrementCadusCount,
  };
}

```

---

## `artifacts/cadus-ai/src/index.css` (241 lines)
```css
@import "tailwindcss";
@import "tw-animate-css";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:is(.dark *));

:root {
  --background: 0 0% 0%;
  --foreground: 0 0% 90%;
  --border: 0 0% 12%;
  --card: 0 0% 6%;
  --card-foreground: 0 0% 90%;
  --card-border: 0 0% 12%;
  --sidebar: 0 0% 2%;
  --sidebar-foreground: 0 0% 85%;
  --sidebar-border: 0 0% 10%;
  --sidebar-primary: 186 100% 42%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 0 0% 10%;
  --sidebar-accent-foreground: 0 0% 85%;
  --sidebar-ring: 186 100% 42%;
  --popover: 0 0% 6%;
  --popover-foreground: 0 0% 90%;
  --popover-border: 0 0% 14%;
  --primary: 186 100% 42%;
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 10%;
  --secondary-foreground: 0 0% 85%;
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 55%;
  --accent: 186 100% 42%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;
  --input: 0 0% 15%;
  --ring: 186 100% 42%;
  --chart-1: 186 100% 42%;
  --chart-2: 270 60% 55%;
  --chart-3: 142 70% 45%;
  --chart-4: 38 92% 50%;
  --chart-5: 340 75% 55%;

  --app-font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --app-font-serif: Georgia, serif;
  --app-font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --radius: 0.5rem;

  --sp-input-bg: rgba(28,28,28,0.85);
  --sp-input-border: rgba(255,255,255,0.08);
  --sp-textarea-color: rgba(255,255,255,0.9);
  --sp-caret-color: #00C2A8;

  --shadow-2xs: 0px 2px 0px 0px hsl(0 0% 0% / 0);
  --shadow-xs: 0px 2px 0px 0px hsl(0 0% 0% / 0);
  --shadow-sm: 0px 2px 0px 0px hsl(0 0% 0% / 0), 0px 1px 2px -1px hsl(0 0% 0% / 0);
  --shadow: 0px 2px 0px 0px hsl(0 0% 0% / 0), 0px 1px 2px -1px hsl(0 0% 0% / 0);
  --shadow-md: 0px 2px 0px 0px hsl(0 0% 0% / 0), 0px 2px 4px -1px hsl(0 0% 0% / 0);
  --shadow-lg: 0px 2px 0px 0px hsl(0 0% 0% / 0), 0px 4px 6px -1px hsl(0 0% 0% / 0);
  --shadow-xl: 0px 2px 0px 0px hsl(0 0% 0% / 0), 0px 8px 10px -1px hsl(0 0% 0% / 0);
  --shadow-2xl: 0px 2px 0px 0px hsl(0 0% 0% / 0);
  --tracking-normal: 0em;
  --spacing: 0.25rem;

  --button-outline: rgba(255,255,255, .10);
  --badge-outline: rgba(255,255,255, .05);
  --opaque-button-border-intensity: 9;
  --elevate-1: rgba(255,255,255, .04);
  --elevate-2: rgba(255,255,255, .09);

  --primary-border: hsl(var(--primary));
  --secondary-border: hsl(var(--secondary));
  --muted-border: hsl(var(--muted));
  --accent-border: hsl(var(--accent));
  --destructive-border: hsl(var(--destructive));
  --sidebar-primary-border: hsl(var(--sidebar-primary));
  --sidebar-accent-border: hsl(var(--sidebar-accent));
}

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-chart-1: hsl(var(--chart-1));
  --color-chart-2: hsl(var(--chart-2));
  --color-chart-3: hsl(var(--chart-3));
  --color-chart-4: hsl(var(--chart-4));
  --color-chart-5: hsl(var(--chart-5));
  --color-sidebar: hsl(var(--sidebar));
  --color-sidebar-foreground: hsl(var(--sidebar-foreground));

  --font-sans: var(--app-font-sans);
  --font-serif: var(--app-font-serif);
  --font-mono: var(--app-font-mono);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply font-sans antialiased;
    background: #000000;
    color: hsl(var(--foreground));
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  html, body, #root {
    height: 100%;
    width: 100%;
  }
}

.cadus-textarea::placeholder {
  color: rgba(255,255,255,0.25);
}

.cadus-textarea::-webkit-scrollbar {
  width: 4px;
}
.cadus-textarea::-webkit-scrollbar-track {
  background: transparent;
}
.cadus-textarea::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
}

@keyframes tw-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes tw-bubble-in {
  from { opacity: 0; transform: translateY(8px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes tw-dot-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@keyframes cadus-think-text-fade {
  0% { opacity: 0; transform: translateY(4px); }
  15% { opacity: 1; transform: translateY(0); }
  85% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-4px); }
}
@keyframes cadus-img-fade-in {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes cadus-skeleton-shimmer {
  0% { background-position: -800px 0; }
  100% { background-position: 800px 0; }
}

@keyframes ocean-ray-sway {
  0%, 100% { transform: rotate(var(--tw-rotate, 0deg)) translateX(0); opacity: 0.6; }
  50% { transform: rotate(calc(var(--tw-rotate, 0deg) + 3deg)) translateX(5px); opacity: 0.9; }
}
@keyframes ocean-ray-sway2 {
  0%, 100% { transform: rotate(var(--tw-rotate, 0deg)) translateX(0); opacity: 0.5; }
  50% { transform: rotate(calc(var(--tw-rotate, 0deg) - 2deg)) translateX(-4px); opacity: 0.8; }
}
@keyframes ocean-depth-drift {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(8px) translateY(-5px); }
}
@keyframes ocean-bubble-rise {
  0% { transform: translateY(0) translateX(0); opacity: 0.7; }
  50% { transform: translateY(-20px) translateX(5px); opacity: 1; }
  100% { transform: translateY(-40px) translateX(-3px); opacity: 0.3; }
}
@keyframes ocean-bubble-drift {
  0% { transform: translateX(0) translateY(0); opacity: 0.5; }
  50% { transform: translateX(8px) translateY(-12px); opacity: 0.9; }
  100% { transform: translateX(-4px) translateY(-25px); opacity: 0.3; }
}
@keyframes ocean-card-glow {
  0%, 100% { box-shadow: 0 0 15px rgba(0,180,230,0.08), 0 0 30px rgba(0,140,200,0.04); }
  50% { box-shadow: 0 0 25px rgba(0,180,230,0.15), 0 0 50px rgba(0,140,200,0.08); }
}
@keyframes ocean-ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes ocean-ring-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}
@keyframes ocean-icon-pulse {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.08); opacity: 1; }
}
@keyframes ocean-text-breathe {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

@keyframes dna-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

.prose {
  --tw-prose-body: rgba(255,255,255,0.82);
  --tw-prose-headings: rgba(255,255,255,0.95);
  --tw-prose-links: #00C2A8;
  --tw-prose-bold: rgba(255,255,255,0.95);
  --tw-prose-counters: rgba(255,255,255,0.5);
  --tw-prose-bullets: rgba(255,255,255,0.3);
  --tw-prose-hr: rgba(255,255,255,0.08);
  --tw-prose-quotes: rgba(255,255,255,0.7);
  --tw-prose-quote-borders: rgba(0,194,168,0.3);
  --tw-prose-captions: rgba(255,255,255,0.5);
  --tw-prose-code: #00E5FF;
  --tw-prose-pre-code: rgba(255,255,255,0.85);
  --tw-prose-pre-bg: rgba(0,0,0,0.5);
  --tw-prose-th-borders: rgba(255,255,255,0.12);
  --tw-prose-td-borders: rgba(255,255,255,0.06);
}

```

---

## `artifacts/cadus-ai/src/lib/translations.ts` (1322 lines)
```ts
export interface CadusStrings {
  newChat: string;
  aiAgents: string;
  today: string;
  yesterday: string;
  older: string;
  settings: string;
  attach: string;
  deepResearch: string;
  createImage: string;
  presentation: string;
  disclaimer: string;
  messagePlaceholder: string;
  proRequired: string;
  proGatedMsg: string;
  upgradePro: string;
  deleteChat: string;
  thinking: string;
  sendMessage: string;
  noChatsYet: string;
  downloadImage: string;
  slides: string;
  openPresentation: string;
  generatingImage: string;
  researching: string;
  buildingPresentation: string;
  deepResearchMode: string;
  presentationMode: string;
  selectSlideCountAbove: string;
  imageMode: string;
  describeImagePlaceholder: string;
  researchTopicPlaceholder: string;
  presentationTopicPlaceholder: string;
  selectSlidesPlaceholder: string;
  uploadImage: string;
  uploadImageFormats: string;
  uploadDocument: string;
  uploadDocumentFormats: string;
  takePhoto: string;
  useCamera: string;
  upgradeTitle: string;
  maybeLater: string;
  simpleImage: string;
  labeledDiagram: string;
  diagram?: string;
  realImage?: string;
  realImageLabeled?: string;
  imageTypeQuestion: string;
  researchTypeQuestion?: string;
  quickSummary?: string;
  fullDeepResearch?: string;
  languageLabel: string;
  languageDesc: string;
  sectionGeneral: string;
  sectionAppearance: string;
  sectionAI: string;
  sectionData: string;
  sectionAbout: string;
}

type LangMap = Record<string, CadusStrings>;

const t: LangMap = {
  en: {
    newChat: "New chat",
    aiAgents: "AI Agents",
    today: "Today",
    yesterday: "Yesterday",
    older: "Older",
    settings: "Settings",
    attach: "Attach",
    deepResearch: "Deep Research",
    createImage: "Create Image",
    presentation: "Presentation",
    disclaimer: "Cadus AI can make mistakes. Verify important medical information with a qualified professional.",
    messagePlaceholder: "Message Cadus AI",
    proRequired: "Pro Required",
    proGatedMsg: "Cadus Magnus is available exclusively for Cadus AI Pro subscribers. Upgrade to unlock advanced diagnostic AI.",
    upgradePro: "Upgrade to Pro",
    deleteChat: "Delete chat",
    thinking: "Thinking…",
    sendMessage: "Send message",
    noChatsYet: "No chats yet",
    downloadImage: "Download image",
    slides: "slides",
    openPresentation: "Open Presentation",
    generatingImage: "Generating image...",
    researching: "Researching...",
    buildingPresentation: "Cadus AI is composing your {n}-slide presentation...",
    deepResearchMode: "Deep Research mode",
    presentationMode: "Presentation mode",
    selectSlideCountAbove: "Select slide count above",
    imageMode: "Image generation mode",
    describeImagePlaceholder: "Describe the medical image or illustration you want to create...",
    researchTopicPlaceholder: "What topic should Cadus AI research deeply?",
    presentationTopicPlaceholder: "Enter the topic for your presentation (e.g. Human Brain, Cardiac Anatomy)...",
    selectSlidesPlaceholder: "Select the number of slides using the buttons above...",
    uploadImage: "Upload Image",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "Upload Document",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "Take Photo",
    useCamera: "Use camera",
    upgradeTitle: "Upgrade to Cadus Magnus",
    maybeLater: "Maybe later",
    simpleImage: "Simple Image",
    labeledDiagram: "Labeled Diagram",
    diagram: "Diagram",
    realImage: "Real Image",
    realImageLabeled: "Real Image + Labels",
    imageTypeQuestion: "Choose the type of medical image you'd like Cadus AI to generate:",
    researchTypeQuestion: "Would you like a quick summary or a full deep research report?",
    quickSummary: "Quick Summary",
    fullDeepResearch: "Full Deep Research",
    languageLabel: "Language",
    languageDesc: "Interface language",
    sectionGeneral: "General",
    sectionAppearance: "Appearance",
    sectionAI: "AI Behavior",
    sectionData: "Data Controls",
    sectionAbout: "About",
  },
  hi: {
    newChat: "नई चैट",
    aiAgents: "AI एजेंट",
    today: "आज",
    yesterday: "कल",
    older: "पुराना",
    settings: "सेटिंग्स",
    attach: "संलग्न करें",
    deepResearch: "गहन शोध",
    createImage: "छवि बनाएं",
    presentation: "प्रस्तुति",
    disclaimer: "Cadus AI गलतियाँ कर सकता है। महत्वपूर्ण चिकित्सा जानकारी एक योग्य पेशेवर से सत्यापित करें।",
    messagePlaceholder: "Cadus AI को संदेश करें",
    proRequired: "Pro आवश्यक है",
    proGatedMsg: "Cadus Magnus केवल Cadus AI Pro सदस्यों के लिए उपलब्ध है। उन्नत AI अनलॉक करने के लिए अपग्रेड करें।",
    upgradePro: "Pro में अपग्रेड करें",
    deleteChat: "चैट हटाएं",
    thinking: "सोच रहा है…",
    sendMessage: "संदेश भेजें",
    noChatsYet: "अभी तक कोई चैट नहीं",
    downloadImage: "छवि डाउनलोड करें",
    slides: "स्लाइड",
    openPresentation: "प्रस्तुति खोलें",
    generatingImage: "छवि बना रहा है...",
    researching: "शोध कर रहा है...",
    buildingPresentation: "Cadus AI आपकी {n}-स्लाइड प्रस्तुति तैयार कर रहा है...",
    deepResearchMode: "गहन शोध मोड",
    presentationMode: "प्रस्तुति मोड",
    selectSlideCountAbove: "ऊपर स्लाइड संख्या चुनें",
    imageMode: "छवि निर्माण मोड",
    describeImagePlaceholder: "बनाने के लिए चिकित्सा छवि या चित्रण का विवरण दें...",
    researchTopicPlaceholder: "Cadus AI किस विषय पर गहराई से शोध करे?",
    presentationTopicPlaceholder: "अपनी प्रस्तुति का विषय दर्ज करें (जैसे मानव मस्तिष्क, हृदय रचना)...",
    selectSlidesPlaceholder: "ऊपर दिए बटनों से स्लाइड संख्या चुनें...",
    uploadImage: "छवि अपलोड करें",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "दस्तावेज़ अपलोड करें",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "फ़ोटो लें",
    useCamera: "कैमरा उपयोग करें",
    upgradeTitle: "Cadus Magnus में अपग्रेड करें",
    maybeLater: "शायद बाद में",
    simpleImage: "साधारण चित्र",
    labeledDiagram: "लेबल डायग्राम",
    imageTypeQuestion: "क्या आप साधारण चित्र या लेबल डायग्राम चाहते हैं?",
    researchTypeQuestion: "क्या आप त्वरित सारांश या पूर्ण गहन शोध रिपोर्ट चाहते हैं?",
    quickSummary: "त्वरित सारांश",
    fullDeepResearch: "पूर्ण गहन शोध",
    languageLabel: "भाषा",
    languageDesc: "इंटरफ़ेस भाषा",
    sectionGeneral: "सामान्य",
    sectionAppearance: "दिखावट",
    sectionAI: "AI व्यवहार",
    sectionData: "डेटा नियंत्रण",
    sectionAbout: "के बारे में",
  },
  as: {
    newChat: "নতুন চেট",
    aiAgents: "AI এজেন্ট",
    today: "আজি",
    yesterday: "কালি",
    older: "পুৰণি",
    settings: "ছেটিংছ",
    attach: "সংলগ্ন",
    deepResearch: "গভীৰ গৱেষণা",
    createImage: "ছবি তৈয়াৰ কৰক",
    presentation: "উপস্থাপন",
    disclaimer: "Cadus AI ভুল কৰিব পাৰে। গুৰুত্বপূৰ্ণ চিকিৎসা তথ্য এজন যোগ্য পেছাদাৰৰ পৰা নিশ্চিত কৰক।",
    messagePlaceholder: "Cadus AI লৈ বাৰ্তা পঠাওক",
    proRequired: "Pro প্ৰয়োজন",
    proGatedMsg: "Cadus Magnus কেৱল Cadus AI Pro সদস্যসকলৰ বাবে উপলব্ধ।",
    upgradePro: "Pro লৈ আপগ্ৰেড কৰক",
    deleteChat: "চেট মচক",
    thinking: "চিন্তা কৰিছে…",
    sendMessage: "বাৰ্তা পঠাওক",
    noChatsYet: "এতিয়ালৈকে কোনো চেট নাই",
    downloadImage: "ছবি ডাউনলোড কৰক",
    slides: "স্লাইড",
    openPresentation: "উপস্থাপন খোলক",
    generatingImage: "ছবি তৈয়াৰ হৈছে...",
    researching: "গৱেষণা কৰিছে...",
    buildingPresentation: "Cadus AI আপোনাৰ {n}-স্লাইড উপস্থাপন তৈয়াৰ কৰিছে...",
    deepResearchMode: "গভীৰ গৱেষণা মোড",
    presentationMode: "উপস্থাপন মোড",
    selectSlideCountAbove: "ওপৰত স্লাইড সংখ্যা বাছক",
    imageMode: "ছবি নিৰ্মাণ মোড",
    describeImagePlaceholder: "তৈয়াৰ কৰিবলৈ চিকিৎসা ছবিৰ বিৱৰণ দিয়ক...",
    researchTopicPlaceholder: "Cadus AI কোন বিষয়ত গভীৰভাৱে গৱেষণা কৰিব?",
    presentationTopicPlaceholder: "আপোনাৰ উপস্থাপনৰ বিষয় দিয়ক...",
    selectSlidesPlaceholder: "ওপৰৰ বুটামৰে স্লাইড সংখ্যা বাছক...",
    uploadImage: "ছবি আপলোড কৰক",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "নথিপত্ৰ আপলোড কৰক",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "ফটো লওক",
    useCamera: "কেমেৰা ব্যৱহাৰ কৰক",
    upgradeTitle: "Cadus Magnus লৈ আপগ্ৰেড কৰক",
    maybeLater: "হয়তো পিছত",
    simpleImage: "সহজ চিত্ৰ",
    labeledDiagram: "লেবেলযুক্ত ডায়াগ্ৰাম",
    imageTypeQuestion: "আপুনি সহজ চিত্ৰ নে লেবেলযুক্ত ডায়াগ্ৰাম বিচাৰিছে?",
    languageLabel: "ভাষা",
    languageDesc: "ইন্টাৰফেচ ভাষা",
    sectionGeneral: "সাধাৰণ",
    sectionAppearance: "দেখাশৈলী",
    sectionAI: "AI আচৰণ",
    sectionData: "ডেটা নিয়ন্ত্ৰণ",
    sectionAbout: "বিষয়ে",
  },
  bn: {
    newChat: "নতুন চ্যাট",
    aiAgents: "AI এজেন্ট",
    today: "আজ",
    yesterday: "গতকাল",
    older: "পুরানো",
    settings: "সেটিংস",
    attach: "সংযুক্ত করুন",
    deepResearch: "গভীর গবেষণা",
    createImage: "ছবি তৈরি করুন",
    presentation: "উপস্থাপনা",
    disclaimer: "Cadus AI ভুল করতে পারে। একজন যোগ্য পেশাদারের সাথে গুরুত্বপূর্ণ চিকিৎসা তথ্য যাচাই করুন।",
    messagePlaceholder: "Cadus AI-এ বার্তা পাঠান",
    proRequired: "Pro প্রয়োজন",
    proGatedMsg: "Cadus Magnus শুধুমাত্র Cadus AI Pro সদস্যদের জন্য উপলব্ধ।",
    upgradePro: "Pro-তে আপগ্রেড করুন",
    deleteChat: "চ্যাট মুছুন",
    thinking: "ভাবছে…",
    sendMessage: "বার্তা পাঠান",
    noChatsYet: "এখনও কোনো চ্যাট নেই",
    downloadImage: "ছবি ডাউনলোড করুন",
    slides: "স্লাইড",
    openPresentation: "উপস্থাপনা খুলুন",
    generatingImage: "ছবি তৈরি হচ্ছে...",
    researching: "গবেষণা করছে...",
    buildingPresentation: "Cadus AI আপনার {n}-স্লাইড উপস্থাপনা তৈরি করছে...",
    deepResearchMode: "গভীর গবেষণা মোড",
    presentationMode: "উপস্থাপনা মোড",
    selectSlideCountAbove: "উপরে স্লাইড সংখ্যা বেছে নিন",
    imageMode: "ছবি তৈরি মোড",
    describeImagePlaceholder: "তৈরি করতে চাওয়া চিকিৎসা ছবির বিবরণ দিন...",
    researchTopicPlaceholder: "Cadus AI কোন বিষয়ে গভীরভাবে গবেষণা করবে?",
    presentationTopicPlaceholder: "আপনার উপস্থাপনার বিষয় লিখুন...",
    selectSlidesPlaceholder: "উপরের বোতাম ব্যবহার করে স্লাইড সংখ্যা নির্বাচন করুন...",
    uploadImage: "ছবি আপলোড করুন",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "নথি আপলোড করুন",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "ছবি তুলুন",
    useCamera: "ক্যামেরা ব্যবহার করুন",
    upgradeTitle: "Cadus Magnus-তে আপগ্রেড করুন",
    maybeLater: "হয়তো পরে",
    simpleImage: "সহজ ছবি",
    labeledDiagram: "লেবেলযুক্ত ডায়াগ্রাম",
    imageTypeQuestion: "আপনি কি সহজ ছবি বা লেবেলযুক্ত ডায়াগ্রাম চান?",
    languageLabel: "ভাষা",
    languageDesc: "ইন্টারফেস ভাষা",
    sectionGeneral: "সাধারণ",
    sectionAppearance: "চেহারা",
    sectionAI: "AI আচরণ",
    sectionData: "ডেটা নিয়ন্ত্রণ",
    sectionAbout: "সম্পর্কে",
  },
  brx: {
    newChat: "नायि चैट",
    aiAgents: "AI एजेंट",
    today: "आजिनि",
    yesterday: "ग्रलायाव",
    older: "पुराना",
    settings: "सेटिंग्स",
    attach: "जोडो",
    deepResearch: "गहिर खोज",
    createImage: "गोबां आखाइ",
    presentation: "प्रेजेंटेशन",
    disclaimer: "Cadus AI गलती खालामो दान्। खालामदों मेडिकल ओनसोलारि खेबनो योग्य बिजाबनि सायाव सावराय।",
    messagePlaceholder: "Cadus AI लाइ नोजोर पठाव",
    proRequired: "Pro दरकार",
    proGatedMsg: "Cadus Magnus Cadus AI Pro सोदोमारिनि थाखाय उपलब्ध।",
    upgradePro: "Pro लाइ अपग्रेड",
    deleteChat: "चैट फालाय",
    thinking: "गोसो लानाय…",
    sendMessage: "नोजोर पठाव",
    noChatsYet: "अबुरै चैट नङा",
    downloadImage: "आखाइ डाउनलोड",
    slides: "स्लाइड",
    openPresentation: "प्रेजेंटेशन खोल",
    generatingImage: "आखाइ बानायो...",
    researching: "खोज लानाय...",
    buildingPresentation: "Cadus AI नों {n}-स्लाइड प्रेजेंटेशन थैयाव लानाय...",
    deepResearchMode: "गहिर खोज मोड",
    presentationMode: "प्रेजेंटेशन मोड",
    selectSlideCountAbove: "उफ्राव स्लाइड हिसाब सायखिनो",
    imageMode: "आखाइ बानाय मोड",
    describeImagePlaceholder: "बानायो मेडिकल आखाइ बिबरन दियो...",
    researchTopicPlaceholder: "Cadus AI मावफालिखौ गहिराव खोजो?",
    presentationTopicPlaceholder: "प्रेजेंटेशननि बिसाय दियो...",
    selectSlidesPlaceholder: "उफ्राव बुटामनि सायाव स्लाइड हिसाब सायखिनो...",
    uploadImage: "आखाइ अपलोड",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "कागज अपलोड",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "फोटो लो",
    useCamera: "कैमरा लाखिनो",
    upgradeTitle: "Cadus Magnus लाइ अपग्रेड",
    maybeLater: "थायोब्ला फिसाजोब",
    simpleImage: "सिम्पल फोटो",
    labeledDiagram: "लेबल डायग्राम",
    imageTypeQuestion: "नों दा सिम्पल फोटो गोनां लेबल डायग्राम?",
    languageLabel: "भाषा",
    languageDesc: "इंटरफेस भाषा",
    sectionGeneral: "साधारण",
    sectionAppearance: "दिखाव",
    sectionAI: "AI व्यवहार",
    sectionData: "डेटा नियंत्रण",
    sectionAbout: "बिमायनि",
  },
  doi: {
    newChat: "नवीं चैट",
    aiAgents: "AI एजेंट",
    today: "अज्ज",
    yesterday: "कल्ल",
    older: "पुराना",
    settings: "सेटिंग्स",
    attach: "जोड़ो",
    deepResearch: "गहरी खोज",
    createImage: "तस्वीर बनाओ",
    presentation: "प्रेजेंटेशन",
    disclaimer: "Cadus AI गल्तियां करी सकदा ऐ। जरूरी दवाई-संबंधी जानकारी इक योग्य माहर कोलों पक्की करो।",
    messagePlaceholder: "Cadus AI गी संदेश करो",
    proRequired: "Pro जरूरी ऐ",
    proGatedMsg: "Cadus Magnus सिर्फ Cadus AI Pro सदस्यें लेई उपलब्ध ऐ।",
    upgradePro: "Pro च अपग्रेड करो",
    deleteChat: "चैट मिटाओ",
    thinking: "सोच करा ऐ…",
    sendMessage: "संदेश भेजो",
    noChatsYet: "अजें तक कोई चैट नेईं",
    downloadImage: "तस्वीर डाउनलोड करो",
    slides: "स्लाइड",
    openPresentation: "प्रेजेंटेशन खोलो",
    generatingImage: "तस्वीर बनाई जाई गी ऐ...",
    researching: "खोज करी गी ऐ...",
    buildingPresentation: "Cadus AI तुआड़ी {n}-स्लाइड प्रेजेंटेशन बनाई गी ऐ...",
    deepResearchMode: "गहरी खोज मोड",
    presentationMode: "प्रेजेंटेशन मोड",
    selectSlideCountAbove: "उप्पर स्लाइड गिनती चुनो",
    imageMode: "तस्वीर बनाओ मोड",
    describeImagePlaceholder: "बनाने ते तस्वीर दा विवरण दो...",
    researchTopicPlaceholder: "Cadus AI कस्से विषय पर गहराई कन्नै खोज करे?",
    presentationTopicPlaceholder: "प्रेजेंटेशन दा विषय लिखो...",
    selectSlidesPlaceholder: "उप्पर दित्ते बटनें कन्नै स्लाइड गिनती चुनो...",
    uploadImage: "तस्वीर अपलोड करो",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "दस्तावेज़ अपलोड करो",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "फोटो लओ",
    useCamera: "कैमरा लाओ",
    upgradeTitle: "Cadus Magnus च अपग्रेड करो",
    maybeLater: "शायद बाद च",
    simpleImage: "साधारण तस्वीर",
    labeledDiagram: "लेबल डायग्राम",
    imageTypeQuestion: "की आप साधारण तस्वीर चाहते हो या लेबल डायग्राम?",
    languageLabel: "भाषा",
    languageDesc: "इंटरफेस भाषा",
    sectionGeneral: "आम",
    sectionAppearance: "दिखावट",
    sectionAI: "AI व्यवहार",
    sectionData: "डेटा नियंत्रण",
    sectionAbout: "बारे च",
  },
  gu: {
    newChat: "નવી વાતચીત",
    aiAgents: "AI એજન્ટ",
    today: "આજ",
    yesterday: "ગઈ કાલ",
    older: "જૂના",
    settings: "સેટિંગ્સ",
    attach: "જોડો",
    deepResearch: "ઊંડા સંશોધન",
    createImage: "છબી બનાવો",
    presentation: "પ્રેઝન્ટેશન",
    disclaimer: "Cadus AI ભૂલ કરી શકે છે. મહત્વની તબીબી માહિતી એક લાયક વ્યવસાયી પાસેથી ચકાસો.",
    messagePlaceholder: "Cadus AI ને સંદેશ મોકલો",
    proRequired: "Pro જરૂરી",
    proGatedMsg: "Cadus Magnus ફક્ત Cadus AI Pro સભ્યો માટે ઉપલબ્ધ છે.",
    upgradePro: "Pro માં અપગ્રેડ કરો",
    deleteChat: "ચેટ કાઢો",
    thinking: "વિચારી રહ્યું છે…",
    sendMessage: "સંદેશ મોકલો",
    noChatsYet: "હજી સુધી કોઈ ચેટ નથી",
    downloadImage: "છબી ડાઉનલોડ કરો",
    slides: "સ્લાઇડ",
    openPresentation: "પ્રેઝન્ટેશન ખોલો",
    generatingImage: "છબી બનાવવામાં આવી રહી છે...",
    researching: "સંશોધન કરી રહ્યું છે...",
    buildingPresentation: "Cadus AI તમારી {n}-સ્લાઇડ પ્રેઝન્ટેશન તૈયાર કરી રહ્યું છે...",
    deepResearchMode: "ઊંડા સંશોધન મોડ",
    presentationMode: "પ્રેઝન્ટેશન મોડ",
    selectSlideCountAbove: "ઉપર સ્લાઇડ સંખ્યા પસંદ કરો",
    imageMode: "છબી નિર્માણ મોડ",
    describeImagePlaceholder: "બનાવવા માટે તબીબી છબીનું વર્ણન કરો...",
    researchTopicPlaceholder: "Cadus AI કયા વિષય પર ઊંડું સંશોધન કરે?",
    presentationTopicPlaceholder: "તમારી પ્રેઝન્ટેશનનો વિષય દાખલ કરો...",
    selectSlidesPlaceholder: "ઉપરના બટનોથી સ્લાઇડ સંખ્યા પસંદ કરો...",
    uploadImage: "છબી અપલોડ કરો",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "દસ્તાવેજ અપલોડ કરો",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "ફોટો લો",
    useCamera: "કૅમેરા વાપરો",
    upgradeTitle: "Cadus Magnus માં અપગ્રેડ કરો",
    maybeLater: "કદાચ પછી",
    simpleImage: "સામાન્ય ચિત્ર",
    labeledDiagram: "લેબલ ડાયાગ્રામ",
    imageTypeQuestion: "શું આપ સામાન્ય ચિત્ર કે લેબલ ડાયાગ્રામ ઇચ્છો છો?",
    languageLabel: "ભાષા",
    languageDesc: "ઇન્ટરફેસ ભાષા",
    sectionGeneral: "સામાન્ય",
    sectionAppearance: "દેખાવ",
    sectionAI: "AI વ્યવહાર",
    sectionData: "ડેટા નિયંત્રણ",
    sectionAbout: "વિશે",
  },
  kn: {
    newChat: "ಹೊಸ ಚಾಟ್",
    aiAgents: "AI ಏಜೆಂಟ್‌ಗಳು",
    today: "ಇಂದು",
    yesterday: "ನಿನ್ನೆ",
    older: "ಹಳೆಯದು",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    attach: "ಲಗತ್ತಿಸಿ",
    deepResearch: "ಆಳ ಸಂಶೋಧನೆ",
    createImage: "ಚಿತ್ರ ರಚಿಸಿ",
    presentation: "ಪ್ರಸ್ತುತಿ",
    disclaimer: "Cadus AI ತಪ್ಪುಗಳನ್ನು ಮಾಡಬಹುದು. ಪ್ರಮುಖ ವೈದ್ಯಕೀಯ ಮಾಹಿತಿಯನ್ನು ಅರ್ಹ ವ್ಯಾವಸಾಯಿಕರೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ.",
    messagePlaceholder: "Cadus AI ಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ",
    proRequired: "Pro ಅಗತ್ಯ",
    proGatedMsg: "Cadus Magnus ಕೇವಲ Cadus AI Pro ಚಂದಾದಾರರಿಗೆ ಮಾತ್ರ ಲಭ್ಯ.",
    upgradePro: "Pro ಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ",
    deleteChat: "ಚಾಟ್ ಅಳಿಸಿ",
    thinking: "ಯೋಚಿಸುತ್ತಿದೆ…",
    sendMessage: "ಸಂದೇಶ ಕಳುಹಿಸಿ",
    noChatsYet: "ಇನ್ನೂ ಯಾವುದೇ ಚಾಟ್‌ಗಳಿಲ್ಲ",
    downloadImage: "ಚಿತ್ರ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    slides: "ಸ್ಲೈಡ್‌ಗಳು",
    openPresentation: "ಪ್ರಸ್ತುತಿ ತೆರೆಯಿರಿ",
    generatingImage: "ಚಿತ್ರ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    researching: "ಸಂಶೋಧಿಸಲಾಗುತ್ತಿದೆ...",
    buildingPresentation: "Cadus AI ನಿಮ್ಮ {n}-ಸ್ಲೈಡ್ ಪ್ರಸ್ತುತಿ ರಚಿಸುತ್ತಿದೆ...",
    deepResearchMode: "ಆಳ ಸಂಶೋಧನೆ ಮೋಡ್",
    presentationMode: "ಪ್ರಸ್ತುತಿ ಮೋಡ್",
    selectSlideCountAbove: "ಮೇಲೆ ಸ್ಲೈಡ್ ಸಂಖ್ಯೆ ಆಯ್ಕೆ ಮಾಡಿ",
    imageMode: "ಚಿತ್ರ ನಿರ್ಮಾಣ ಮೋಡ್",
    describeImagePlaceholder: "ರಚಿಸಲು ಬಯಸುವ ವೈದ್ಯಕೀಯ ಚಿತ್ರವನ್ನು ವಿವರಿಸಿ...",
    researchTopicPlaceholder: "Cadus AI ಯಾವ ವಿಷಯವನ್ನು ಆಳವಾಗಿ ಸಂಶೋಧಿಸಬೇಕು?",
    presentationTopicPlaceholder: "ನಿಮ್ಮ ಪ್ರಸ್ತುತಿಯ ವಿಷಯ ನಮೂದಿಸಿ...",
    selectSlidesPlaceholder: "ಮೇಲಿನ ಬಟನ್‌ಗಳ ಮೂಲಕ ಸ್ಲೈಡ್ ಸಂಖ್ಯೆ ಆಯ್ಕೆ ಮಾಡಿ...",
    uploadImage: "ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "ಫೋಟೋ ತೆಗೆಯಿರಿ",
    useCamera: "ಕ್ಯಾಮೆರಾ ಬಳಸಿ",
    upgradeTitle: "Cadus Magnus ಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ",
    maybeLater: "ಬಹುಶಃ ನಂತರ",
    simpleImage: "ಸರಳ ಚಿತ್ರ",
    labeledDiagram: "ಲೇಬಲ್ ಡಯಾಗ್ರಾಮ್",
    imageTypeQuestion: "ನಿಮಗೆ ಸರಳ ಚಿತ್ರ ಬೇಕೇ ಅಥವಾ ಲೇಬಲ್ ಡಯಾಗ್ರಾಮ್ ಬೇಕೇ?",
    languageLabel: "ಭಾಷೆ",
    languageDesc: "ಇಂಟರ್‌ಫೇಸ್ ಭಾಷೆ",
    sectionGeneral: "ಸಾಮಾನ್ಯ",
    sectionAppearance: "ನೋಟ",
    sectionAI: "AI ನಡವಳಿಕೆ",
    sectionData: "ಡೇಟಾ ನಿಯಂತ್ರಣ",
    sectionAbout: "ಬಗ್ಗೆ",
  },
  ks: {
    newChat: "نۆو چیٹ",
    aiAgents: "AI ایجنٹ",
    today: "آج",
    yesterday: "راتھ",
    older: "پرانہ",
    settings: "ترتیبات",
    attach: "لگاو",
    deepResearch: "گہری تحقیق",
    createImage: "تصویر بناوو",
    presentation: "پریزنٹیشن",
    disclaimer: "Cadus AI غلطی کری سکو۔ اہم طبی معلومات کِسے مستند ماہر کنہ تصدیق کرو۔",
    messagePlaceholder: "Cadus AI سند پیغام کرو",
    proRequired: "Pro ضروری چھُ",
    proGatedMsg: "Cadus Magnus Cadus AI Pro ممبران کھؤتہ ہے۔",
    upgradePro: "Pro پیٹھ اپگریڈ کرو",
    deleteChat: "چیٹ مٔٹاوو",
    thinking: "سوچان چھُ…",
    sendMessage: "پیغام پٲٹھاوو",
    noChatsYet: "ابھے کانہہ چیٹ نہ چھِ",
    downloadImage: "تصویر ڈاؤنلوڈ کرو",
    slides: "سلائیڈ",
    openPresentation: "پریزنٹیشن کھولو",
    generatingImage: "تصویر بنائی گژھان چھ...",
    researching: "تحقیق لگان چھ...",
    buildingPresentation: "Cadus AI تُہنُک {n}-سلائیڈ پریزنٹیشن بناوان چھ...",
    deepResearchMode: "گہری تحقیق موڈ",
    presentationMode: "پریزنٹیشن موڈ",
    selectSlideCountAbove: "پانے سلائیڈ گنتی چُنو",
    imageMode: "تصویر بناو موڈ",
    describeImagePlaceholder: "بناونے طبی تصویر دا بیان کرو...",
    researchTopicPlaceholder: "Cadus AI کِس موضوع پیٹھ گہری تحقیق کرے?",
    presentationTopicPlaceholder: "پریزنٹیشن دا موضوع لیکھو...",
    selectSlidesPlaceholder: "پانے بٹنس سیتی سلائیڈ گنتی چُنو...",
    uploadImage: "تصویر اپلوڈ کرو",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "دستاویز اپلوڈ کرو",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "فوٹو لو",
    useCamera: "کیمرہ لگاوو",
    upgradeTitle: "Cadus Magnus پیٹھ اپگریڈ کرو",
    maybeLater: "شاید بعد مَ",
    simpleImage: "سادہ تصویر",
    labeledDiagram: "لیبل ڈایاگرام",
    imageTypeQuestion: "کیا آپ سادہ تصویر یا لیبل ڈایاگرام چاہتے ہیں؟",
    languageLabel: "زبان",
    languageDesc: "انٹرفیس زبان",
    sectionGeneral: "عام",
    sectionAppearance: "نظر",
    sectionAI: "AI رویہ",
    sectionData: "ڈیٹا کنٹرول",
    sectionAbout: "بارہ",
  },
  kok: {
    newChat: "नवें चॅट",
    aiAgents: "AI एजेंट",
    today: "आयज",
    yesterday: "काल",
    older: "जुनें",
    settings: "सेटिंग्स",
    attach: "जोडात",
    deepResearch: "खोल संशोधन",
    createImage: "छायाचित्र काडात",
    presentation: "सादरीकरण",
    disclaimer: "Cadus AI चुकी करूंक शकता. म्हत्वाची वैद्यकीय म्हायती एका तज्ञाकडेन पडताळून घेयात.",
    messagePlaceholder: "Cadus AI क संदेश धाडात",
    proRequired: "Pro जाय",
    proGatedMsg: "Cadus Magnus फक्त Cadus AI Pro सदस्यांक उपलब्ध आसा.",
    upgradePro: "Pro क अपग्रेड करात",
    deleteChat: "चॅट काडात",
    thinking: "विचार करतां…",
    sendMessage: "संदेश धाडात",
    noChatsYet: "अजून कसलें चॅट ना",
    downloadImage: "छायाचित्र उतरयात",
    slides: "स्लाइड",
    openPresentation: "सादरीकरण उगडात",
    generatingImage: "छायाचित्र तयार जावन आसा...",
    researching: "संशोधन चलून आसा...",
    buildingPresentation: "Cadus AI तुमचें {n}-स्लाइड सादरीकरण तयार करतां...",
    deepResearchMode: "खोल संशोधन मोड",
    presentationMode: "सादरीकरण मोड",
    selectSlideCountAbove: "वयर स्लाइड संख्या निवडात",
    imageMode: "छायाचित्र निर्माण मोड",
    describeImagePlaceholder: "काडपाची वैद्यकीय प्रतिमा वर्णन करात...",
    researchTopicPlaceholder: "Cadus AI कसल्या विशयार खोल संशोधन करचें?",
    presentationTopicPlaceholder: "सादरीकरणाचो विशय घालात...",
    selectSlidesPlaceholder: "वयलें बटन वापरून स्लाइड संख्या निवडात...",
    uploadImage: "छायाचित्र अपलोड करात",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "दस्तावेज अपलोड करात",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "फोटो काडात",
    useCamera: "कॅमेरा वापरात",
    upgradeTitle: "Cadus Magnus क अपग्रेड करात",
    maybeLater: "कदाचित फुडें",
    simpleImage: "सादें चित्र",
    labeledDiagram: "लेबल डायग्राम",
    imageTypeQuestion: "तुमकाँ सादें चित्र जाय की लेबल डायग्राम?",
    languageLabel: "भास",
    languageDesc: "इंटरफेस भास",
    sectionGeneral: "साधारण",
    sectionAppearance: "दीसप",
    sectionAI: "AI वर्तन",
    sectionData: "डेटा नियंत्रण",
    sectionAbout: "विशीं",
  },
  mai: {
    newChat: "नव चैट",
    aiAgents: "AI एजेंट",
    today: "आय",
    yesterday: "काल्हि",
    older: "पुरान",
    settings: "सेटिंग्स",
    attach: "संलग्न",
    deepResearch: "गहन अनुसंधान",
    createImage: "छवि बनाउ",
    presentation: "प्रस्तुति",
    disclaimer: "Cadus AI गलती कऽ सकैत अछि। महत्त्वपूर्ण चिकित्सा जानकारी एक योग्य विशेषज्ञसँ पुष्टि करू।",
    messagePlaceholder: "Cadus AI के संदेश पठाउ",
    proRequired: "Pro जरूरी",
    proGatedMsg: "Cadus Magnus केवल Cadus AI Pro सदस्यक लेल उपलब्ध अछि।",
    upgradePro: "Pro में अपग्रेड करू",
    deleteChat: "चैट हटाउ",
    thinking: "सोचि रहल अछि…",
    sendMessage: "संदेश पठाउ",
    noChatsYet: "अखनि धरि कोनो चैट नहि",
    downloadImage: "छवि डाउनलोड करू",
    slides: "स्लाइड",
    openPresentation: "प्रस्तुति खोलू",
    generatingImage: "छवि बनैत अछि...",
    researching: "शोध होइत अछि...",
    buildingPresentation: "Cadus AI अपनेक {n}-स्लाइड प्रस्तुति बनबैत अछि...",
    deepResearchMode: "गहन अनुसंधान मोड",
    presentationMode: "प्रस्तुति मोड",
    selectSlideCountAbove: "उपर स्लाइड संख्या चुनू",
    imageMode: "छवि निर्माण मोड",
    describeImagePlaceholder: "बनेबाक लेल चिकित्सा छवि वर्णन करू...",
    researchTopicPlaceholder: "Cadus AI केहन विषय पर गहराई सँ शोध करए?",
    presentationTopicPlaceholder: "प्रस्तुतिक विषय लिखू...",
    selectSlidesPlaceholder: "उपरक बटन सँ स्लाइड संख्या चुनू...",
    uploadImage: "छवि अपलोड करू",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "दस्तावेज अपलोड करू",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "फोटो लिअ",
    useCamera: "कैमरा उपयोग करू",
    upgradeTitle: "Cadus Magnus में अपग्रेड करू",
    maybeLater: "शायद बाद में",
    simpleImage: "साधारण चित्र",
    labeledDiagram: "लेबल डायग्राम",
    imageTypeQuestion: "की आहाँ साधारण चित्र चाहैत छी वा लेबल डायग्राम?",
    languageLabel: "भाषा",
    languageDesc: "इंटरफेस भाषा",
    sectionGeneral: "साधारण",
    sectionAppearance: "देखावट",
    sectionAI: "AI व्यवहार",
    sectionData: "डेटा नियंत्रण",
    sectionAbout: "विषयमें",
  },
  ml: {
    newChat: "പുതിയ ചാറ്റ്",
    aiAgents: "AI ഏജന്റുകൾ",
    today: "ഇന്ന്",
    yesterday: "ഇന്നലെ",
    older: "പഴയത്",
    settings: "ക്രമീകരണങ്ങൾ",
    attach: "അറ്റാച്ച് ചെയ്യുക",
    deepResearch: "ആഴത്തിലുള്ള ഗവേഷണം",
    createImage: "ചിത്രം സൃഷ്ടിക്കുക",
    presentation: "അവതരണം",
    disclaimer: "Cadus AI തെറ്റുകൾ വരുത്തിയേക്കാം. പ്രധാനപ്പെട്ട വൈദ്യ വിവരങ്ങൾ ഒരു യോഗ്യ വിദഗ്ദ്ധനുമായി ഉറപ്പ് വരുത്തുക.",
    messagePlaceholder: "Cadus AI-ലേക്ക് സന്ദേശം അയക്കൂ",
    proRequired: "Pro ആവശ്യം",
    proGatedMsg: "Cadus Magnus Cadus AI Pro അംഗങ്ങൾക്ക് മാത്രം ലഭ്യമാണ്.",
    upgradePro: "Pro-ലേക്ക് അപ്‌ഗ്രേഡ് ചെയ്യൂ",
    deleteChat: "ചാറ്റ് ഇല്ലാതാക്കുക",
    thinking: "ചിന്തിക്കുന്നു…",
    sendMessage: "സന്ദേശം അയക്കുക",
    noChatsYet: "ഇതുവരെ ചാറ്റുകൾ ഇല്ല",
    downloadImage: "ചിത്രം ഡൗൺലോഡ് ചെയ്യുക",
    slides: "സ്ലൈഡുകൾ",
    openPresentation: "അവതരണം തുറക്കുക",
    generatingImage: "ചിത്രം സൃഷ്ടിക്കുന്നു...",
    researching: "ഗവേഷണം നടക്കുന്നു...",
    buildingPresentation: "Cadus AI നിങ്ങളുടെ {n}-സ്ലൈഡ് അവതരണം തയ്യാറാക്കുന്നു...",
    deepResearchMode: "ആഴത്തിലുള്ള ഗവേഷണ മോഡ്",
    presentationMode: "അവതരണ മോഡ്",
    selectSlideCountAbove: "മുകളിൽ സ്ലൈഡ് എണ്ണം തിരഞ്ഞെടുക്കൂ",
    imageMode: "ചിത്ര നിർമ്മാണ മോഡ്",
    describeImagePlaceholder: "നിർമ്മിക്കേണ്ട വൈദ്യ ചിത്രം വിവരിക്കുക...",
    researchTopicPlaceholder: "Cadus AI ഏത് വിഷയത്തിൽ ആഴത്തിൽ ഗവേഷണം നടത്തണം?",
    presentationTopicPlaceholder: "നിങ്ങളുടെ അവതരണ വിഷയം നൽകുക...",
    selectSlidesPlaceholder: "മുകളിലെ ബട്ടണുകൾ ഉപയോഗിച്ച് സ്ലൈഡ് എണ്ണം തിരഞ്ഞെടുക്കൂ...",
    uploadImage: "ചിത്രം അപ്‌ലോഡ് ചെയ്യുക",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "രേഖ അപ്‌ലോഡ് ചെയ്യുക",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "ഫോട്ടോ എടുക്കുക",
    useCamera: "ക്യാമറ ഉപയോഗിക്കുക",
    upgradeTitle: "Cadus Magnus-ലേക്ക് അപ്‌ഗ്രേഡ് ചെയ്യൂ",
    maybeLater: "ഒരുപക്ഷേ പിന്നീട്",
    simpleImage: "ലളിതമായ ചിത്രം",
    labeledDiagram: "ലേബൽ ഡയഗ്രം",
    imageTypeQuestion: "ലളിതമായ ചിത്രം വേണോ അതോ ലേബൽ ഡയഗ്രം വേണോ?",
    languageLabel: "ഭാഷ",
    languageDesc: "ഇന്റർഫേസ് ഭാഷ",
    sectionGeneral: "പൊതുവായ",
    sectionAppearance: "രൂപം",
    sectionAI: "AI സ്വഭാവം",
    sectionData: "ഡേറ്റ നിയന്ത്രണം",
    sectionAbout: "കുറിച്ച്",
  },
  mni: {
    newChat: "নতুন চেট",
    aiAgents: "AI এজেন্ট",
    today: "নুমিৎ",
    yesterday: "ঙসিগী মমাংদা",
    older: "মপুং",
    settings: "সেটিং",
    attach: "লাকখি",
    deepResearch: "অচুম্বা থাজিল্লবা",
    createImage: "মপুং ফাওবা",
    presentation: "প্রেজেন্টেশন",
    disclaimer: "Cadus AI না নুংঙাইবা তৌরক্কদবনি। অসিগুম্বা ꯃꯦꯗꯤꯀꯦꯜ তম্বিবা মতম ꯑꯣꯏখিবা মীঙ়ৈদা উজুমোনবা।",
    messagePlaceholder: "Cadus AI দা মসেজ থোনবিয়ু",
    proRequired: "Pro থোকনবা",
    proGatedMsg: "Cadus Magnus Cadus AI Pro মেম্বরশিং শরুক পাইবসিংনা ওন্লি পাওথোকপা ঙমগনি।",
    upgradePro: "Pro দা আপগ্রেড তৌবিয়ু",
    deleteChat: "চেট থাউরুবিয়ু",
    thinking: "তিন্থনবা…",
    sendMessage: "মসেজ থোনবিয়ু",
    noChatsYet: "ঙসিদি চেট অমগুম্বা অমদা অমদা অমনো অকায়বা",
    downloadImage: "ইমেজ ডাউনলোড তৌবিয়ু",
    slides: "স্লাইড",
    openPresentation: "প্রেজেন্টেশন উদ্রক্লবিয়ু",
    generatingImage: "ইমেজ ফাওহনবা...",
    researching: "থাজিল্লবা লৈবা...",
    buildingPresentation: "Cadus AI না নংগী {n}-স্লাইড প্রেজেন্টেশন ফাওহনবা...",
    deepResearchMode: "অচুম্বা থাজিল্লবা মোড",
    presentationMode: "প্রেজেন্টেশন মোড",
    selectSlideCountAbove: "ওইরক্লিবা স্লাইড হোল্লক্লবিয়ু",
    imageMode: "ইমেজ ফাওহনবা মোড",
    describeImagePlaceholder: "ফাওহনবা মেডিকেল ইমেজ ওইরবা ওইনা ফংহল্লবিয়ু...",
    researchTopicPlaceholder: "Cadus AI না কদায়দা অচুম্বা থাজিল্লগে?",
    presentationTopicPlaceholder: "প্রেজেন্টেশনগী টোপিক পুথোক্লবিয়ু...",
    selectSlidesPlaceholder: "ওইরক্লিবা বটন থেংজিনবদা স্লাইড হোল্লক্লবিয়ু...",
    uploadImage: "ইমেজ আপলোড তৌবিয়ু",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "ডকুমেন্ট আপলোড তৌবিয়ু",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "ফোটো লৌবিয়ু",
    useCamera: "কেমেরা থেংজিনবিয়ু",
    upgradeTitle: "Cadus Magnus দা আপগ্রেড তৌবিয়ু",
    maybeLater: "নত্তনা মতমদা",
    simpleImage: "ꯁꯤꯝꯄꯜ ꯏꯃেꯖ",
    labeledDiagram: "ꯂেবেল ꯗাইয়াগ্ৰাম",
    imageTypeQuestion: "ꯁꯤꯝꯄꯜ ꯏꯃেꯖ ꯅꯠꯇ্রꯄা ꯂেবেল ꯗাইয়াগ্ৰাম?",
    languageLabel: "লোন্",
    languageDesc: "ইন্টারফেস লোন্",
    sectionGeneral: "সাধারণ",
    sectionAppearance: "নুংথিল",
    sectionAI: "AI চাল",
    sectionData: "ডেটা কন্ট্রোল",
    sectionAbout: "বিষয়ে",
  },
  mr: {
    newChat: "नवीन चॅट",
    aiAgents: "AI एजंट",
    today: "आज",
    yesterday: "काल",
    older: "जुने",
    settings: "सेटिंग्ज",
    attach: "जोडा",
    deepResearch: "सखोल संशोधन",
    createImage: "प्रतिमा तयार करा",
    presentation: "सादरीकरण",
    disclaimer: "Cadus AI चुका करू शकतो. महत्त्वाची वैद्यकीय माहिती एका पात्र व्यावसायिकाकडून सत्यापित करा.",
    messagePlaceholder: "Cadus AI ला संदेश पाठवा",
    proRequired: "Pro आवश्यक",
    proGatedMsg: "Cadus Magnus फक्त Cadus AI Pro सदस्यांसाठी उपलब्ध आहे.",
    upgradePro: "Pro वर अपग्रेड करा",
    deleteChat: "चॅट हटवा",
    thinking: "विचार करत आहे…",
    sendMessage: "संदेश पाठवा",
    noChatsYet: "अद्याप कोणतेही चॅट नाही",
    downloadImage: "प्रतिमा डाउनलोड करा",
    slides: "स्लाइड",
    openPresentation: "सादरीकरण उघडा",
    generatingImage: "प्रतिमा तयार होत आहे...",
    researching: "संशोधन चालू आहे...",
    buildingPresentation: "Cadus AI तुमचे {n}-स्लाइड सादरीकरण तयार करत आहे...",
    deepResearchMode: "सखोल संशोधन मोड",
    presentationMode: "सादरीकरण मोड",
    selectSlideCountAbove: "वरील स्लाइड संख्या निवडा",
    imageMode: "प्रतिमा निर्मिती मोड",
    describeImagePlaceholder: "तयार करायच्या वैद्यकीय प्रतिमेचे वर्णन करा...",
    researchTopicPlaceholder: "Cadus AI कोणत्या विषयावर सखोल संशोधन करावे?",
    presentationTopicPlaceholder: "तुमच्या सादरीकरणाचा विषय प्रविष्ट करा...",
    selectSlidesPlaceholder: "वरील बटणे वापरून स्लाइड संख्या निवडा...",
    uploadImage: "प्रतिमा अपलोड करा",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "दस्तावेज अपलोड करा",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "फोटो घ्या",
    useCamera: "कॅमेरा वापरा",
    upgradeTitle: "Cadus Magnus वर अपग्रेड करा",
    maybeLater: "कदाचित नंतर",
    simpleImage: "साधे चित्र",
    labeledDiagram: "लेबल डायग्राम",
    imageTypeQuestion: "तुम्हाला साधे चित्र हवे की लेबल डायग्राम?",
    languageLabel: "भाषा",
    languageDesc: "इंटरफेस भाषा",
    sectionGeneral: "सामान्य",
    sectionAppearance: "दिसणे",
    sectionAI: "AI वर्तन",
    sectionData: "डेटा नियंत्रण",
    sectionAbout: "बद्दल",
  },
  ne: {
    newChat: "नयाँ च्याट",
    aiAgents: "AI एजेन्ट",
    today: "आज",
    yesterday: "हिजो",
    older: "पुरानो",
    settings: "सेटिङ्गहरू",
    attach: "संलग्न गर्नुहोस्",
    deepResearch: "गहिरो अनुसन्धान",
    createImage: "छवि सिर्जना गर्नुस्",
    presentation: "प्रस्तुति",
    disclaimer: "Cadus AI ले गल्ती गर्न सक्छ। महत्त्वपूर्ण चिकित्सा जानकारी एक योग्य पेशेवरसँग प्रमाणित गर्नुहोस्।",
    messagePlaceholder: "Cadus AI लाई सन्देश पठाउनुस्",
    proRequired: "Pro आवश्यक",
    proGatedMsg: "Cadus Magnus केवल Cadus AI Pro सदस्यहरूका लागि उपलब्ध छ।",
    upgradePro: "Pro मा अपग्रेड गर्नुस्",
    deleteChat: "च्याट मेट्नुस्",
    thinking: "सोच्दैछ…",
    sendMessage: "सन्देश पठाउनुस्",
    noChatsYet: "अहिलेसम्म कुनै च्याट छैन",
    downloadImage: "छवि डाउनलोड गर्नुस्",
    slides: "स्लाइड",
    openPresentation: "प्रस्तुति खोल्नुस्",
    generatingImage: "छवि बनाउँदैछ...",
    researching: "अनुसन्धान गर्दैछ...",
    buildingPresentation: "Cadus AI ले तपाईंको {n}-स्लाइड प्रस्तुति बनाउँदैछ...",
    deepResearchMode: "गहिरो अनुसन्धान मोड",
    presentationMode: "प्रस्तुति मोड",
    selectSlideCountAbove: "माथि स्लाइड संख्या चुन्नुस्",
    imageMode: "छवि निर्माण मोड",
    describeImagePlaceholder: "बनाउन चाहिएको चिकित्सा छविको वर्णन गर्नुस्...",
    researchTopicPlaceholder: "Cadus AI ले कुन विषयमा गहिरो अनुसन्धान गरोस्?",
    presentationTopicPlaceholder: "प्रस्तुतिको विषय लेख्नुस्...",
    selectSlidesPlaceholder: "माथिका बटनहरू प्रयोग गरेर स्लाइड संख्या चुन्नुस्...",
    uploadImage: "छवि अपलोड गर्नुस्",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "कागजात अपलोड गर्नुस्",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "फोटो लिनुस्",
    useCamera: "क्यामेरा प्रयोग गर्नुस्",
    upgradeTitle: "Cadus Magnus मा अपग्रेड गर्नुस्",
    maybeLater: "सायद पछि",
    simpleImage: "साधारण चित्र",
    labeledDiagram: "लेबल डायग्राम",
    imageTypeQuestion: "के तपाईं साधारण चित्र वा लेबल डायग्राम चाहनुहुन्छ?",
    languageLabel: "भाषा",
    languageDesc: "इन्टरफेस भाषा",
    sectionGeneral: "सामान्य",
    sectionAppearance: "देखावट",
    sectionAI: "AI व्यवहार",
    sectionData: "डेटा नियन्त्रण",
    sectionAbout: "बारेमा",
  },
  or: {
    newChat: "ନୂଆ ଚ୍ୟାଟ",
    aiAgents: "AI ଏଜେଣ୍ଟ",
    today: "ଆଜି",
    yesterday: "ଗତକାଲି",
    older: "ପୁରୁଣା",
    settings: "ସେଟିଂ",
    attach: "ସଂଲଗ୍ନ",
    deepResearch: "ଗଭୀର ଅନୁସନ୍ଧାନ",
    createImage: "ଚିତ୍ର ତିଆରି",
    presentation: "ଉପସ୍ଥାପନା",
    disclaimer: "Cadus AI ଭୁଲ କରିପାରେ। ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଚିକିତ୍ସା ତଥ୍ୟ ଏକ ଯୋଗ୍ୟ ବୃତ୍ତିଧାରୀଙ୍କ ସହ ଯାଞ୍ଚ କରନ୍ତୁ।",
    messagePlaceholder: "Cadus AI କୁ ବାର୍ତ୍ତା ପଠାନ୍ତୁ",
    proRequired: "Pro ଆବଶ୍ୟକ",
    proGatedMsg: "Cadus Magnus କେବଳ Cadus AI Pro ସଦସ୍ୟଙ୍କ ପାଇଁ ଉପଲବ୍ଧ।",
    upgradePro: "Pro କୁ ଅପଗ୍ରେଡ୍ କରନ୍ତୁ",
    deleteChat: "ଚ୍ୟାଟ ଡିଲିଟ କରନ୍ତୁ",
    thinking: "ଭାବୁଛି…",
    sendMessage: "ବାର୍ତ୍ତା ପଠାନ୍ତୁ",
    noChatsYet: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଚ୍ୟାଟ ନାହିଁ",
    downloadImage: "ଚିତ୍ର ଡାଉନଲୋଡ କରନ୍ତୁ",
    slides: "ସ୍ଲାଇଡ",
    openPresentation: "ଉପସ୍ଥାପନା ଖୋଲନ୍ତୁ",
    generatingImage: "ଚିତ୍ର ତିଆରି ହୋଇଛି...",
    researching: "ଅନୁସନ୍ଧାନ ଚାଲୁ...",
    buildingPresentation: "Cadus AI ଆପଣଙ୍କ {n}-ସ୍ଲାଇଡ ଉପସ୍ଥାପନା ପ୍ରସ୍ତୁତ କରୁଛି...",
    deepResearchMode: "ଗଭୀର ଅନୁସନ୍ଧାନ ମୋଡ",
    presentationMode: "ଉପସ୍ଥାପନା ମୋଡ",
    selectSlideCountAbove: "ଉପରେ ସ୍ଲାଇଡ ସଂଖ୍ୟା ଚୟନ କରନ୍ତୁ",
    imageMode: "ଚିତ୍ର ନିର୍ମାଣ ମୋଡ",
    describeImagePlaceholder: "ତିଆରି କରିବାକୁ ଚାହୁଁଥିବା ଚିକିତ୍ସା ଚିତ୍ର ବର୍ଣ୍ଣନା କରନ୍ତୁ...",
    researchTopicPlaceholder: "Cadus AI କେଉଁ ବିଷୟ ଉପରେ ଗଭୀର ଅନୁସନ୍ଧାନ କରିବ?",
    presentationTopicPlaceholder: "ଆପଣଙ୍କ ଉପସ୍ଥାପନା ବିଷୟ ଲେଖନ୍ତୁ...",
    selectSlidesPlaceholder: "ଉପରର ବୋତାମ ଦ୍ୱାରା ସ୍ଲାଇଡ ସଂଖ୍ୟା ଚୟନ କରନ୍ତୁ...",
    uploadImage: "ଚିତ୍ର ଅପଲୋଡ କରନ୍ତୁ",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "ଦଲିଲ ଅପଲୋଡ କରନ୍ତୁ",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "ଫୋଟୋ ଉଠାନ୍ତୁ",
    useCamera: "କ୍ୟାମେରା ବ୍ୟବହାର କରନ୍ତୁ",
    upgradeTitle: "Cadus Magnus କୁ ଅପଗ୍ରେଡ କରନ୍ତୁ",
    maybeLater: "ଭବିଷ୍ୟତ୍ ରେ ହୁଏ",
    simpleImage: "ସାଧାରଣ ଚିତ୍ର",
    labeledDiagram: "ଲେବଲ ଡାୟାଗ୍ରାମ",
    imageTypeQuestion: "ଆପଣ ସାଧାରଣ ଚିତ୍ର ବା ଲେବଲ ଡାୟାଗ୍ରାମ ଚାହୁଁଛନ୍ତି?",
    languageLabel: "ଭାଷା",
    languageDesc: "ଇଣ୍ଟରଫେସ ଭାଷା",
    sectionGeneral: "ସାଧାରଣ",
    sectionAppearance: "ଦୃଶ୍ୟ",
    sectionAI: "AI ଆଚରଣ",
    sectionData: "ଡେଟା ନିୟନ୍ତ୍ରଣ",
    sectionAbout: "ବିଷୟରେ",
  },
  pa: {
    newChat: "ਨਵੀਂ ਚੈਟ",
    aiAgents: "AI ਏਜੰਟ",
    today: "ਅੱਜ",
    yesterday: "ਕੱਲ੍ਹ",
    older: "ਪੁਰਾਣਾ",
    settings: "ਸੈਟਿੰਗਾਂ",
    attach: "ਜੋੜੋ",
    deepResearch: "ਡੂੰਘੀ ਖੋਜ",
    createImage: "ਚਿੱਤਰ ਬਣਾਓ",
    presentation: "ਪੇਸ਼ਕਾਰੀ",
    disclaimer: "Cadus AI ਗਲਤੀਆਂ ਕਰ ਸਕਦਾ ਹੈ। ਮਹੱਤਵਪੂਰਨ ਡਾਕਟਰੀ ਜਾਣਕਾਰੀ ਕਿਸੇ ਯੋਗ ਮਾਹਰ ਤੋਂ ਜਾਂਚੋ।",
    messagePlaceholder: "Cadus AI ਨੂੰ ਸੁਨੇਹਾ ਦੇਵੋ",
    proRequired: "Pro ਲਾਜ਼ਮੀ",
    proGatedMsg: "Cadus Magnus ਸਿਰਫ਼ Cadus AI Pro ਮੈਂਬਰਾਂ ਲਈ ਉਪਲਬਧ ਹੈ।",
    upgradePro: "Pro ਵਿੱਚ ਅਪਗ੍ਰੇਡ ਕਰੋ",
    deleteChat: "ਚੈਟ ਮਿਟਾਓ",
    thinking: "ਸੋਚ ਰਿਹਾ ਹੈ…",
    sendMessage: "ਸੁਨੇਹਾ ਭੇਜੋ",
    noChatsYet: "ਹਾਲੇ ਕੋਈ ਚੈਟ ਨਹੀਂ",
    downloadImage: "ਚਿੱਤਰ ਡਾਊਨਲੋਡ ਕਰੋ",
    slides: "ਸਲਾਈਡਾਂ",
    openPresentation: "ਪੇਸ਼ਕਾਰੀ ਖੋਲ੍ਹੋ",
    generatingImage: "ਚਿੱਤਰ ਬਣ ਰਿਹਾ ਹੈ...",
    researching: "ਖੋਜ ਹੋ ਰਹੀ ਹੈ...",
    buildingPresentation: "Cadus AI ਤੁਹਾਡੀ {n}-ਸਲਾਈਡ ਪੇਸ਼ਕਾਰੀ ਤਿਆਰ ਕਰ ਰਿਹਾ ਹੈ...",
    deepResearchMode: "ਡੂੰਘੀ ਖੋਜ ਮੋਡ",
    presentationMode: "ਪੇਸ਼ਕਾਰੀ ਮੋਡ",
    selectSlideCountAbove: "ਉੱਪਰ ਸਲਾਈਡ ਗਿਣਤੀ ਚੁਣੋ",
    imageMode: "ਚਿੱਤਰ ਨਿਰਮਾਣ ਮੋਡ",
    describeImagePlaceholder: "ਬਣਾਉਣ ਵਾਲੀ ਡਾਕਟਰੀ ਤਸਵੀਰ ਦਾ ਵਿਵਰਣ ਦੇਵੋ...",
    researchTopicPlaceholder: "Cadus AI ਕਿਸ ਵਿਸ਼ੇ ਤੇ ਡੂੰਘੀ ਖੋਜ ਕਰੇ?",
    presentationTopicPlaceholder: "ਆਪਣੀ ਪੇਸ਼ਕਾਰੀ ਦਾ ਵਿਸ਼ਾ ਦਾਖਲ ਕਰੋ...",
    selectSlidesPlaceholder: "ਉੱਪਰਲੇ ਬਟਨਾਂ ਨਾਲ ਸਲਾਈਡ ਗਿਣਤੀ ਚੁਣੋ...",
    uploadImage: "ਚਿੱਤਰ ਅਪਲੋਡ ਕਰੋ",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ ਕਰੋ",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "ਫੋਟੋ ਲਓ",
    useCamera: "ਕੈਮਰਾ ਵਰਤੋ",
    upgradeTitle: "Cadus Magnus ਵਿੱਚ ਅਪਗ੍ਰੇਡ ਕਰੋ",
    maybeLater: "ਸ਼ਾਇਦ ਬਾਅਦ ਵਿੱਚ",
    simpleImage: "ਸਾਦਾ ਚਿੱਤਰ",
    labeledDiagram: "ਲੇਬਲ ਡਾਇਆਗ੍ਰਾਮ",
    imageTypeQuestion: "ਕੀ ਤੁਸੀਂ ਸਾਦਾ ਚਿੱਤਰ ਜਾਂ ਲੇਬਲ ਡਾਇਆਗ੍ਰਾਮ ਚਾਹੁੰਦੇ ਹੋ?",
    languageLabel: "ਭਾਸ਼ਾ",
    languageDesc: "ਇੰਟਰਫੇਸ ਭਾਸ਼ਾ",
    sectionGeneral: "ਆਮ",
    sectionAppearance: "ਦਿੱਖ",
    sectionAI: "AI ਵਿਵਹਾਰ",
    sectionData: "ਡੇਟਾ ਨਿਯੰਤਰਣ",
    sectionAbout: "ਬਾਰੇ",
  },
  sa: {
    newChat: "नूतन संलापः",
    aiAgents: "AI दूताः",
    today: "अद्य",
    yesterday: "ह्यः",
    older: "पुरातन",
    settings: "व्यवस्थाः",
    attach: "संलग्नम्",
    deepResearch: "गहन अन्वेषणम्",
    createImage: "चित्रं रचयतु",
    presentation: "प्रस्तुतिः",
    disclaimer: "Cadus AI दोषान् कर्तुं शक्नोति। महत्त्वपूर्णं चिकित्सा-ज्ञानं योग्यात् विशेषज्ञात् पुष्टयतु।",
    messagePlaceholder: "Cadus AI प्रति संदेशं प्रेषयतु",
    proRequired: "Pro आवश्यकम्",
    proGatedMsg: "Cadus Magnus केवलं Cadus AI Pro सदस्येभ्यः उपलब्धम् अस्ति।",
    upgradePro: "Pro प्रति उन्नतिः",
    deleteChat: "संलापं विलोपयतु",
    thinking: "विचारयति…",
    sendMessage: "संदेशं प्रेषयतु",
    noChatsYet: "अद्यावधि कोऽपि संलापः नास्ति",
    downloadImage: "चित्रं अवतारयतु",
    slides: "स्लाइड",
    openPresentation: "प्रस्तुतिं उद्घाटयतु",
    generatingImage: "चित्रं रच्यते...",
    researching: "अन्वेषणं भवति...",
    buildingPresentation: "Cadus AI भवतः {n}-स्लाइड प्रस्तुतिं रचयति...",
    deepResearchMode: "गहन अन्वेषण विधा",
    presentationMode: "प्रस्तुति विधा",
    selectSlideCountAbove: "उपरि स्लाइड संख्यां वरयतु",
    imageMode: "चित्र निर्माण विधा",
    describeImagePlaceholder: "निर्मातव्यस्य चिकित्सा-चित्रस्य वर्णनं कुरुतु...",
    researchTopicPlaceholder: "Cadus AI कं विषयं गहनतया अन्वेषयतु?",
    presentationTopicPlaceholder: "प्रस्तुतेः विषयं लिखतु...",
    selectSlidesPlaceholder: "उपरितनैः बटनैः स्लाइड संख्यां वरयतु...",
    uploadImage: "चित्रम् अपलोड करोतु",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "दस्तावेजं अपलोड करोतु",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "छायाचित्रं गृह्णातु",
    useCamera: "कैमरां उपयुञ्जतु",
    upgradeTitle: "Cadus Magnus प्रति उन्नतिः",
    maybeLater: "कदाचित् पश्चात्",
    simpleImage: "सरलं चित्रम्",
    labeledDiagram: "लेबलयुक्तं आरेखम्",
    imageTypeQuestion: "किं त्वं सरलं चित्रम् इच्छसि उत लेबलयुक्तम् आरेखम्?",
    languageLabel: "भाषा",
    languageDesc: "संवादतलस्य भाषा",
    sectionGeneral: "सामान्य",
    sectionAppearance: "दृश्य",
    sectionAI: "AI आचरण",
    sectionData: "दत्तांशनियन्त्रण",
    sectionAbout: "विषये",
  },
  sat: {
    newChat: "ᱱᱟᱶᱟ ᱪᱮᱴ",
    aiAgents: "AI ᱮᱡᱮᱱᱴ",
    today: "ᱫᱚ",
    yesterday: "ᱦᱟᱸᱛᱮ",
    older: "ᱢᱮᱱᱟᱜ",
    settings: "ᱥᱮᱴᱤᱝ",
    attach: "ᱡᱩᱰᱟᱣ",
    deepResearch: "ᱜᱷᱤᱨ ᱧᱮᱞ",
    createImage: "ᱪᱤᱛᱟᱹᱨ ᱢᱮ",
    presentation: "ᱯᱨᱮᱡᱮᱱᱴᱮᱥᱚᱱ",
    disclaimer: "Cadus AI ᱵᱷᱩᱞ ᱟᱠᱟᱱ ᱟᱠᱟᱱᱟ। ᱢᱩᱬᱩᱛ ᱫᱟᱠᱛᱟᱨᱤ ᱠᱷᱚᱵᱚᱨ ᱮᱠ ᱡᱟᱣᱜᱟ ᱢᱟᱨᱟᱝ ᱡᱷᱟᱸᱪᱷ ᱢᱮ।",
    messagePlaceholder: "Cadus AI ᱠᱚ ᱢᱮᱥᱮᱡ ᱢᱮ",
    proRequired: "Pro ᱫᱚᱨᱠᱟᱨ",
    proGatedMsg: "Cadus Magnus ᱫᱚ Cadus AI Pro ᱥᱟᱫᱚᱢ ᱠᱚ ᱟᱹᱭᱩᱭ।",
    upgradePro: "Pro ᱨᱮ ᱟᱯᱜᱨᱮᱰ",
    deleteChat: "ᱪᱮᱴ ᱦᱟᱹᱴᱤᱡ",
    thinking: "ᱥᱚᱪᱚᱜ…",
    sendMessage: "ᱢᱮᱥᱮᱡ ᱩᱥᱟᱹᱨ ᱢᱮ",
    noChatsYet: "ᱱᱤᱛᱚᱜ ᱪᱮᱴ ᱵᱟᱝ ᱠᱟᱱᱟ",
    downloadImage: "ᱪᱤᱛᱟᱹᱨ ᱰᱟᱣᱱᱞᱚᱰ ᱢᱮ",
    slides: "ᱥᱞᱟᱭᱰ",
    openPresentation: "ᱯᱨᱮᱡᱮᱱᱴᱮᱥᱚᱱ ᱩᱫᱩᱜ ᱢᱮ",
    generatingImage: "ᱪᱤᱛᱟᱹᱨ ᱵᱟᱱᱟᱣ ᱞᱟᱹᱜᱤᱫ...",
    researching: "ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ...",
    buildingPresentation: "Cadus AI ᱟᱢ ᱟᱠᱟᱱ {n}-ᱥᱞᱟᱭᱰ ᱯᱨᱮᱡᱮᱱᱴᱮᱥᱚᱱ ᱵᱟᱱᱟᱣ ᱞᱟᱹᱜᱤᱫ...",
    deepResearchMode: "ᱜᱷᱤᱨ ᱧᱮᱞ ᱢᱳᱰ",
    presentationMode: "ᱯᱨᱮᱡᱮᱱᱴᱮᱥᱚᱱ ᱢᱳᱰ",
    selectSlideCountAbove: "ᱡᱟᱦᱟᱸ ᱥᱞᱟᱭᱰ ᱜᱤᱱᱛᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ",
    imageMode: "ᱪᱤᱛᱟᱹᱨ ᱵᱟᱱᱟᱣ ᱢᱳᱰ",
    describeImagePlaceholder: "ᱵᱟᱱᱟᱣ ᱫᱟᱠᱛᱟᱨᱤ ᱪᱤᱛᱟᱹᱨ ᱵᱩᱡᱷᱟᱹᱣ ᱢᱮ...",
    researchTopicPlaceholder: "Cadus AI ᱠᱷᱚᱱ ᱵᱤᱥᱚᱭ ᱨᱮ ᱜᱷᱤᱨ ᱧᱮᱞ ᱢᱮ?",
    presentationTopicPlaceholder: "ᱯᱨᱮᱡᱮᱱᱴᱮᱥᱚᱱ ᱵᱤᱥᱚᱭ ᱞᱤᱠᱷᱟᱹ ᱢᱮ...",
    selectSlidesPlaceholder: "ᱞᱟᱦᱟ ᱵᱩᱛᱟᱹᱢ ᱨᱮ ᱥᱞᱟᱭᱰ ᱜᱤᱱᱛᱤ ᱵᱟᱪᱷᱟᱣ ᱢᱮ...",
    uploadImage: "ᱪᱤᱛᱟᱹᱨ ᱟᱯᱞᱚᱰ ᱢᱮ",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "ᱫᱚᱞᱤᱞ ᱟᱯᱞᱚᱰ ᱢᱮ",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "ᱯᱷᱚᱴᱚ ᱞᱮᱱ ᱢᱮ",
    useCamera: "ᱠᱮᱢᱮᱨᱟ ᱵᱮᱵᱷᱟᱨ ᱢᱮ",
    upgradeTitle: "Cadus Magnus ᱨᱮ ᱟᱯᱜᱨᱮᱰ ᱢᱮ",
    maybeLater: "ᱦᱟᱯᱟᱣ ᱢᱮᱱᱮᱛ",
    simpleImage: "ᱮᱠᱟ ᱪᱤᱛᱟᱹᱨ",
    labeledDiagram: "ᱞᱮᱵᱮᱞ ᱰᱟᱭᱟᱜᱨᱟᱢ",
    imageTypeQuestion: "ᱮᱠᱟ ᱪᱤᱛᱟᱹᱨ ᱵᱟ ᱞᱮᱵᱮᱞ ᱰᱟᱭᱟᱜᱨᱟᱢ?",
    languageLabel: "ᱨᱮᱱᱟᱜ",
    languageDesc: "ᱤᱱᱴᱟᱨᱯᱷᱮᱥ ᱨᱮᱱᱟᱜ",
    sectionGeneral: "ᱥᱟᱫᱷᱟᱨᱚᱱ",
    sectionAppearance: "ᱫᱤᱥᱟ",
    sectionAI: "AI ᱫᱚᱦᱚ",
    sectionData: "ᱫᱟᱴᱟ ᱱᱤᱭᱚᱸᱛᱨᱚᱱ",
    sectionAbout: "ᱵᱤᱥᱚᱭᱮ",
  },
  sd: {
    newChat: "نئين چيٽ",
    aiAgents: "AI ايجنٽ",
    today: "اڄ",
    yesterday: "سڀاڻي",
    older: "پراڻو",
    settings: "سيٽنگون",
    attach: "جوڙيو",
    deepResearch: "گہري ڳولا",
    createImage: "تصوير ٺاھيو",
    presentation: "پريزنٽيشن",
    disclaimer: "Cadus AI غلطيون ڪري سگهي ٿو. اهم طبي معلومات هڪ اهل ماهر کان تصديق ڪريو.",
    messagePlaceholder: "Cadus AI کي پيغام ڪريو",
    proRequired: "Pro ضروري",
    proGatedMsg: "Cadus Magnus صرف Cadus AI Pro ميمبرن لاءِ دستياب آهي.",
    upgradePro: "Pro تي اپگريڊ ڪريو",
    deleteChat: "چيٽ ميٽيو",
    thinking: "سوچي رهيو آهي…",
    sendMessage: "پيغام موڪليو",
    noChatsYet: "في الحال ڪا چيٽ ناهي",
    downloadImage: "تصوير ڊائونلوڊ ڪريو",
    slides: "سلائيڊ",
    openPresentation: "پريزنٽيشن کوليو",
    generatingImage: "تصوير ٺهي رهي آهي...",
    researching: "ڳولا ٿي رهي آهي...",
    buildingPresentation: "Cadus AI توهان جي {n}-سلائيڊ پريزنٽيشن ٺاهي رهيو آهي...",
    deepResearchMode: "گہري ڳولا موڊ",
    presentationMode: "پريزنٽيشن موڊ",
    selectSlideCountAbove: "مٿي سلائيڊ تعداد چونڊيو",
    imageMode: "تصوير ٺاهڻ موڊ",
    describeImagePlaceholder: "ٺاهڻ لاءِ طبي تصوير جو وضاحت ڏيو...",
    researchTopicPlaceholder: "Cadus AI ڪهڙي موضوع تي گہري ڳولا ڪري?",
    presentationTopicPlaceholder: "پنهنجي پريزنٽيشن جو موضوع لکيو...",
    selectSlidesPlaceholder: "مٿيان بٽنن سان سلائيڊ تعداد چونڊيو...",
    uploadImage: "تصوير اپلوڊ ڪريو",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "دستاويز اپلوڊ ڪريو",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "فوٽو وٺو",
    useCamera: "ڪيمرو استعمال ڪريو",
    upgradeTitle: "Cadus Magnus تي اپگريڊ ڪريو",
    maybeLater: "شايد پوءِ",
    simpleImage: "سادو تصوير",
    labeledDiagram: "ليبل ڊاءاگرام",
    imageTypeQuestion: "ڇا توهان سادو تصوير يا ليبل ڊاءاگرام گهرين ٿا؟",
    languageLabel: "ٻولي",
    languageDesc: "انٽرفيس ٻولي",
    sectionGeneral: "عام",
    sectionAppearance: "ظاهر",
    sectionAI: "AI رويو",
    sectionData: "ڊيٽا ڪنٽرول",
    sectionAbout: "باري ۾",
  },
  ta: {
    newChat: "புதிய அரட்டை",
    aiAgents: "AI முகவர்கள்",
    today: "இன்று",
    yesterday: "நேற்று",
    older: "பழையது",
    settings: "அமைப்புகள்",
    attach: "இணைக்கவும்",
    deepResearch: "ஆழ்ந்த ஆராய்ச்சி",
    createImage: "படம் உருவாக்கு",
    presentation: "விளக்கக்காட்சி",
    disclaimer: "Cadus AI தவறுகள் செய்யலாம். முக்கியமான மருத்துவ தகவல்களை தகுதிவாய்ந்த நிபுணரிடம் சரிபார்க்கவும்.",
    messagePlaceholder: "Cadus AI-க்கு செய்தி அனுப்பவும்",
    proRequired: "Pro தேவை",
    proGatedMsg: "Cadus Magnus Cadus AI Pro உறுப்பினர்களுக்கு மட்டுமே கிடைக்கும்.",
    upgradePro: "Pro-க்கு மேம்படுத்தவும்",
    deleteChat: "அரட்டையை நீக்கு",
    thinking: "யோசிக்கிறது…",
    sendMessage: "செய்தி அனுப்பவும்",
    noChatsYet: "இதுவரை அரட்டைகள் இல்லை",
    downloadImage: "படம் பதிவிறக்கவும்",
    slides: "சுருக்கங்கள்",
    openPresentation: "விளக்கக்காட்சி திறக்கவும்",
    generatingImage: "படம் உருவாகிறது...",
    researching: "ஆராய்ச்சி நடக்கிறது...",
    buildingPresentation: "Cadus AI உங்கள் {n}-சுருக்கம் விளக்கக்காட்சி தயாரிக்கிறது...",
    deepResearchMode: "ஆழ்ந்த ஆராய்ச்சி பயன்முறை",
    presentationMode: "விளக்கக்காட்சி பயன்முறை",
    selectSlideCountAbove: "மேலே சுருக்க எண்ணை தேர்ந்தெடுக்கவும்",
    imageMode: "படம் உருவாக்கும் பயன்முறை",
    describeImagePlaceholder: "உருவாக்க விரும்பும் மருத்துவ படத்தை விவரிக்கவும்...",
    researchTopicPlaceholder: "Cadus AI எந்த தலைப்பில் ஆழமாக ஆராய்ச்சி செய்யட்டும்?",
    presentationTopicPlaceholder: "உங்கள் விளக்கக்காட்சியின் தலைப்பை உள்ளிடவும்...",
    selectSlidesPlaceholder: "மேலுள்ள பொத்தான்களைப் பயன்படுத்தி சுருக்க எண்ணை தேர்ந்தெடுக்கவும்...",
    uploadImage: "படம் பதிவேற்றவும்",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "ஆவணம் பதிவேற்றவும்",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "புகைப்படம் எடுக்கவும்",
    useCamera: "கேமரா பயன்படுத்தவும்",
    upgradeTitle: "Cadus Magnus-க்கு மேம்படுத்தவும்",
    maybeLater: "ஒருவேளை பின்னர்",
    simpleImage: "எளிய படம்",
    labeledDiagram: "லேபிள் வரைபடம்",
    imageTypeQuestion: "நீங்கள் எளிய படம் அல்லது லேபிள் வரைபடம் விரும்புகிறீர்களா?",
    languageLabel: "மொழி",
    languageDesc: "இடைமுகம் மொழி",
    sectionGeneral: "பொதுவான",
    sectionAppearance: "தோற்றம்",
    sectionAI: "AI நடத்தை",
    sectionData: "தரவு கட்டுப்பாடு",
    sectionAbout: "பற்றி",
  },
  te: {
    newChat: "కొత్త చాట్",
    aiAgents: "AI ఏజెంట్లు",
    today: "ఈరోజు",
    yesterday: "నిన్న",
    older: "పాత",
    settings: "సెట్టింగులు",
    attach: "జోడించు",
    deepResearch: "లోతైన పరిశోధన",
    createImage: "చిత్రం సృష్టించు",
    presentation: "ప్రెజెంటేషన్",
    disclaimer: "Cadus AI తప్పులు చేయవచ్చు. ముఖ్యమైన వైద్య సమాచారాన్ని అర్హత కలిగిన నిపుణుడితో ధృవీకరించండి.",
    messagePlaceholder: "Cadus AI కి సందేశం పంపండి",
    proRequired: "Pro అవసరం",
    proGatedMsg: "Cadus Magnus కేవలం Cadus AI Pro సభ్యులకు మాత్రమే అందుబాటులో ఉంది.",
    upgradePro: "Pro కి అప్‌గ్రేడ్ చేయండి",
    deleteChat: "చాట్ తొలగించు",
    thinking: "ఆలోచిస్తోంది…",
    sendMessage: "సందేశం పంపండి",
    noChatsYet: "ఇంతవరకు చాట్‌లు లేవు",
    downloadImage: "చిత్రం డౌన్‌లోడ్ చేయండి",
    slides: "స్లైడ్‌లు",
    openPresentation: "ప్రెజెంటేషన్ తెరవండి",
    generatingImage: "చిత్రం సృష్టించబడుతోంది...",
    researching: "పరిశోధన జరుగుతోంది...",
    buildingPresentation: "Cadus AI మీ {n}-స్లైడ్ ప్రెజెంటేషన్ తయారు చేస్తోంది...",
    deepResearchMode: "లోతైన పరిశోధన మోడ్",
    presentationMode: "ప్రెజెంటేషన్ మోడ్",
    selectSlideCountAbove: "పైన స్లైడ్ సంఖ్య ఎంచుకోండి",
    imageMode: "చిత్రం నిర్మాణ మోడ్",
    describeImagePlaceholder: "సృష్టించాల్సిన వైద్య చిత్రాన్ని వివరించండి...",
    researchTopicPlaceholder: "Cadus AI ఏ విషయంపై లోతుగా పరిశోధన చేయాలి?",
    presentationTopicPlaceholder: "మీ ప్రెజెంటేషన్ అంశాన్ని నమోదు చేయండి...",
    selectSlidesPlaceholder: "పైన ఉన్న బటన్లు ఉపయోగించి స్లైడ్ సంఖ్య ఎంచుకోండి...",
    uploadImage: "చిత్రం అప్‌లోడ్ చేయండి",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "పత్రం అప్‌లోడ్ చేయండి",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "ఫోటో తీయండి",
    useCamera: "కెమెరా వాడండి",
    upgradeTitle: "Cadus Magnus కి అప్‌గ్రేడ్ చేయండి",
    maybeLater: "బహుశా తర్వాత",
    simpleImage: "సాధారణ చిత్రం",
    labeledDiagram: "లేబుల్ డయాగ్రమ్",
    imageTypeQuestion: "మీకు సాధారణ చిత్రం కావాలా లేదా లేబుల్ డయాగ్రమ్ కావాలా?",
    languageLabel: "భాష",
    languageDesc: "ఇంటర్‌ఫేస్ భాష",
    sectionGeneral: "సాధారణ",
    sectionAppearance: "రూపం",
    sectionAI: "AI ప్రవర్తన",
    sectionData: "డేటా నియంత్రణ",
    sectionAbout: "గురించి",
  },
  ur: {
    newChat: "نئی چیٹ",
    aiAgents: "AI ایجنٹ",
    today: "آج",
    yesterday: "کل",
    older: "پرانا",
    settings: "ترتیبات",
    attach: "منسلک",
    deepResearch: "گہری تحقیق",
    createImage: "تصویر بنائیں",
    presentation: "پریزنٹیشن",
    disclaimer: "Cadus AI غلطیاں کر سکتا ہے۔ اہم طبی معلومات کو ایک مستند پیشہ ور سے تصدیق کریں۔",
    messagePlaceholder: "Cadus AI کو پیغام کریں",
    proRequired: "Pro ضروری ہے",
    proGatedMsg: "Cadus Magnus صرف Cadus AI Pro ممبران کے لیے دستیاب ہے۔",
    upgradePro: "Pro میں اپ گریڈ کریں",
    deleteChat: "چیٹ حذف کریں",
    thinking: "سوچ رہا ہے…",
    sendMessage: "پیغام بھیجیں",
    noChatsYet: "ابھی تک کوئی چیٹ نہیں",
    downloadImage: "تصویر ڈاؤنلوڈ کریں",
    slides: "سلائیڈ",
    openPresentation: "پریزنٹیشن کھولیں",
    generatingImage: "تصویر بنائی جا رہی ہے...",
    researching: "تحقیق جاری ہے...",
    buildingPresentation: "Cadus AI آپ کی {n}-سلائیڈ پریزنٹیشن تیار کر رہا ہے...",
    deepResearchMode: "گہری تحقیق موڈ",
    presentationMode: "پریزنٹیشن موڈ",
    selectSlideCountAbove: "اوپر سلائیڈ تعداد منتخب کریں",
    imageMode: "تصویر بنانے کا موڈ",
    describeImagePlaceholder: "بنانے کے لیے طبی تصویر کی وضاحت کریں...",
    researchTopicPlaceholder: "Cadus AI کس موضوع پر گہری تحقیق کرے؟",
    presentationTopicPlaceholder: "اپنی پریزنٹیشن کا موضوع درج کریں...",
    selectSlidesPlaceholder: "اوپر کے بٹنوں سے سلائیڈ تعداد منتخب کریں...",
    uploadImage: "تصویر اپلوڈ کریں",
    uploadImageFormats: "JPG, PNG, WEBP",
    uploadDocument: "دستاویز اپلوڈ کریں",
    uploadDocumentFormats: "PDF, DOCX, TXT, CSV",
    takePhoto: "فوٹو لیں",
    useCamera: "کیمرہ استعمال کریں",
    upgradeTitle: "Cadus Magnus میں اپ گریڈ کریں",
    maybeLater: "شاید بعد میں",
    simpleImage: "سادہ تصویر",
    labeledDiagram: "لیبل ڈایاگرام",
    imageTypeQuestion: "کیا آپ سادہ تصویر یا لیبل ڈایاگرام چاہتے ہیں؟",
    languageLabel: "زبان",
    languageDesc: "انٹرفیس زبان",
    sectionGeneral: "عام",
    sectionAppearance: "ظاہری شکل",
    sectionAI: "AI رویہ",
    sectionData: "ڈیٹا کنٹرول",
    sectionAbout: "کے بارے میں",
  },
};

export function getTranslation(lang: string): CadusStrings {
  return t[lang] ?? t["en"];
}

export const LANG_NAMES: Record<string, string> = {
  en:  "English",
  hi:  "Hindi",
  as:  "Assamese",
  bn:  "Bengali",
  brx: "Bodo",
  doi: "Dogri",
  gu:  "Gujarati",
  kn:  "Kannada",
  ks:  "Kashmiri",
  kok: "Konkani",
  mai: "Maithili",
  ml:  "Malayalam",
  mni: "Manipuri",
  mr:  "Marathi",
  ne:  "Nepali",
  or:  "Odia",
  pa:  "Punjabi",
  sa:  "Sanskrit",
  sat: "Santali",
  sd:  "Sindhi",
  ta:  "Tamil",
  te:  "Telugu",
  ur:  "Urdu",
};

```

---

## `artifacts/cadus-ai/src/lib/utils.ts` (6 lines)
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

---

## `artifacts/cadus-ai/src/main.tsx` (5 lines)
```tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

```

---

## `artifacts/cadus-ai/src/pages/AiAssistant.tsx` (2997 lines)
```tsx
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, User, Loader2, Activity, FlaskConical,
  Lock, Crown, Paperclip, Image, FileText, Camera, Search,
  ImagePlus, X, Microscope, Download, Presentation, PlayCircle,
  Plus, PanelLeft, MessageSquare, Tag,
  ChevronDown, ChevronLeft, ChevronRight, RefreshCw,
  Home, BookOpen, Upload, Stethoscope,
  Pill, Calculator, TestTube2, ClipboardList, HelpCircle,
  Brain, Languages, Mic, MicOff, SlidersHorizontal, Zap, ExternalLink,
} from "lucide-react";
import { useAiChat } from "@workspace/api-client-react";
import { type ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ringAnimImg from "@assets/photo_2026-03-29_15-00-52_1774776666332.jpg";
import neuralNetImg from "@assets/photo_2026-03-29_15-00-48_1774776666333.jpg";
import neuralNetBg from "@assets/photo_2026-03-29_15-00-48_1774779103993.jpg";
import PresentationViewer, { type PresentationData } from "@/components/cadus/PresentationViewer";
import CadusLogo from "@/components/cadus/CadusLogo";
import DNABackground from "@/components/cadus/DNABackground";
import CameraModal from "@/components/cadus/CameraModal";
import { loadSettings, type CadusSettings } from "@/components/cadus/SettingsModal";
import { TypewriterText } from "@/components/cadus/TypewriterText";
import { getTranslation } from "@/lib/translations";
import { useUserAuth } from "@/hooks/use-user-auth";

/* ── Cadus theme CSS custom-property tokens ─────────────────────────── */
function getThemeVars(theme: "dark" | "auto" | "light"): React.CSSProperties {
  if (theme === "light") return {
    "--sp-root-bg":                  "#edf4fb",
    "--sp-sidebar-bg":               "rgba(255,255,255,0.98)",
    "--sp-sidebar-border":           "rgba(0,150,190,0.22)",
    "--sp-topbar-bg":                "rgba(240,248,255,0.97)",
    "--sp-topbar-border":            "rgba(0,150,190,0.18)",
    "--sp-divider":                  "rgba(0,120,170,0.12)",
    "--sp-label":                    "rgba(0,120,170,0.65)",
    "--sp-text-primary":             "rgba(8,30,70,0.95)",
    "--sp-text-muted":               "rgba(25,65,130,0.7)",
    "--sp-text-dim":                 "rgba(25,80,145,0.55)",
    "--sp-text-faint":               "rgba(25,80,145,0.4)",
    "--sp-text-footer":              "rgba(25,80,145,0.72)",
    "--sp-model-inactive-color":     "rgba(25,65,130,0.65)",
    "--sp-model-inactive-bg":        "rgba(0,0,0,0.03)",
    "--sp-model-inactive-border":    "rgba(0,0,0,0.08)",
    "--sp-model-icon-inactive":      "rgba(0,0,0,0.06)",
    "--sp-session-active-bg":        "rgba(0,188,212,0.12)",
    "--sp-session-active-border":    "rgba(0,188,212,0.28)",
    "--sp-session-active-text":      "rgba(0,50,110,0.95)",
    "--sp-session-inactive-text":    "rgba(25,75,145,0.72)",
    "--sp-session-meta":             "rgba(0,110,170,0.5)",
    "--sp-ai-bubble-bg":             "rgba(255,255,255,0.98)",
    "--sp-ai-bubble-border":         "rgba(0,150,190,0.2)",
    "--sp-ai-text":                  "rgba(8,30,70,0.92)",
    "--sp-user-bubble-bg":           "linear-gradient(135deg,rgba(0,188,212,0.18),rgba(0,150,200,0.1))",
    "--sp-user-bubble-border":       "rgba(0,188,212,0.38)",
    "--sp-user-text":                "rgba(0,40,90,0.95)",
    "--sp-input-bg":                 "rgba(255,255,255,0.97)",
    "--sp-input-border":             "rgba(0,150,190,0.3)",
    "--sp-textarea-color":           "rgba(8,30,70,0.95)",
    "--sp-placeholder-color":        "rgba(0,120,170,0.38)",
    "--sp-new-chat-bg":              "rgba(0,188,212,0.1)",
    "--sp-new-chat-border":          "rgba(0,188,212,0.3)",
    "--sp-new-chat-color":           "#007fa3",
    "--sp-toggle-color":             "rgba(0,140,190,0.7)",
    "--sp-caret-color":              "#0099bb",
  } as React.CSSProperties;

  /* dark + auto → clean Replit-style monochrome */
  return {
    "--sp-root-bg":                  "#000000",
    "--sp-sidebar-bg":               "#050505",
    "--sp-sidebar-border":           "rgba(255,255,255,0.06)",
    "--sp-topbar-bg":                "rgba(17,17,17,0.97)",
    "--sp-topbar-border":            "rgba(255,255,255,0.07)",
    "--sp-divider":                  "rgba(255,255,255,0.07)",
    "--sp-label":                    "rgba(255,255,255,0.28)",
    "--sp-text-primary":             "rgba(255,255,255,0.9)",
    "--sp-text-muted":               "rgba(255,255,255,0.45)",
    "--sp-text-dim":                 "rgba(255,255,255,0.32)",
    "--sp-text-faint":               "rgba(255,255,255,0.2)",
    "--sp-text-footer":              "rgba(255,255,255,0.38)",
    "--sp-model-inactive-color":     "rgba(255,255,255,0.55)",
    "--sp-model-inactive-bg":        "rgba(255,255,255,0.03)",
    "--sp-model-inactive-border":    "rgba(255,255,255,0.07)",
    "--sp-model-icon-inactive":      "rgba(255,255,255,0.05)",
    "--sp-session-active-bg":        "rgba(255,255,255,0.07)",
    "--sp-session-active-border":    "rgba(255,255,255,0.1)",
    "--sp-session-active-text":      "rgba(255,255,255,0.92)",
    "--sp-session-inactive-text":    "rgba(255,255,255,0.45)",
    "--sp-session-meta":             "rgba(255,255,255,0.22)",
    "--sp-ai-bubble-bg":             "#1A1A1A",
    "--sp-ai-bubble-border":         "rgba(255,255,255,0.08)",
    "--sp-ai-text":                  "rgba(255,255,255,0.88)",
    "--sp-user-bubble-bg":           "#2A2A2A",
    "--sp-user-bubble-border":       "rgba(255,255,255,0.12)",
    "--sp-user-text":                "rgba(255,255,255,0.92)",
    "--sp-input-bg":                 "#1C1C1C",
    "--sp-input-border":             "rgba(255,255,255,0.12)",
    "--sp-textarea-color":           "rgba(255,255,255,0.88)",
    "--sp-placeholder-color":        "rgba(255,255,255,0.28)",
    "--sp-new-chat-bg":              "rgba(255,255,255,0.05)",
    "--sp-new-chat-border":          "rgba(255,255,255,0.1)",
    "--sp-new-chat-color":           "rgba(255,255,255,0.72)",
    "--sp-toggle-color":             "rgba(255,255,255,0.4)",
    "--sp-caret-color":              "#FFFFFF",
  } as React.CSSProperties;
}

interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

interface ExtendedMessage extends ChatMessage {
  imageUrl?: string;
  isImageGeneration?: boolean;
  isImageTypeSelection?: boolean;
  presentationData?: PresentationData;
  presentationPdfBase64?: string;
  presentationDocxBase64?: string;
  presentationTitle?: string;
  isPresentation?: boolean;
  slideCountOptions?: number[];
  isDeepResearch?: boolean;
  isResearchTypeSelection?: boolean;
  researchReport?: string;
  researchSources?: ResearchSource[];
  researchQueries?: string[];
  hasGoogleSearch?: boolean;
}

type ModelId = "pulse45" | "flux36" | "nova46";
type ChatMode = "normal" | "deep-research" | "create-image" | "create-presentation"
  | "drug-interactions" | "dosage-calc" | "lab-values" | "soap-note"
  | "mcq-gen" | "patient-edu" | "procedure-guide" | "ddx" | "image-analysis";

interface Model {
  id: ModelId;
  name: string;
  version: string;
  description: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
  badgeBg: string;
  activeStyle: { background: string; color: string; border: string };
  pro?: boolean;
}

interface ChatSession {
  id: string;
  modelId: ModelId;
  messages: ExtendedMessage[];
  title: string;
  createdAt: number;
}

const MODELS: Model[] = [
  {
    id: "pulse45",
    name: "Cadus Minor",
    version: "",
    description: "Vitals · Emergency · Critical Care",
    icon: Activity,
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    badgeBg: "bg-emerald-50 border-emerald-200",
    activeStyle: { background: "rgba(16,185,129,0.22)", color: "#34d399", border: "1px solid rgba(52,211,153,0.5)" },
  },
  {
    id: "flux36",
    name: "Cadus Medius",
    version: "",
    description: "Pharmacology · Drug Interactions · Labs",
    icon: FlaskConical,
    color: "bg-orange-500",
    textColor: "text-orange-700",
    badgeBg: "bg-orange-50 border-orange-200",
    activeStyle: { background: "rgba(249,115,22,0.2)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.5)" },
  },
  {
    id: "nova46",
    name: "Cadus Magnus",
    version: "",
    description: "Advanced Diagnostics · Research · Multispecialty",
    icon: Crown,
    color: "bg-violet-600",
    textColor: "text-violet-700",
    badgeBg: "bg-violet-50 border-violet-200",
    activeStyle: { background: "rgba(124,58,237,0.22)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.5)" },
    pro: true,
  },
];

const modelGreetings: Record<ModelId, string> = {
  pulse45:
    "Hello! I'm Cadus AI running Cadus Minor — your emergency medicine and vitals specialist. I can help with vital sign interpretation, ACLS protocols, ICU management, monitoring equipment, and critical care guidelines. Ready to assist!",
  flux36:
    "Hello! I'm Cadus AI running Cadus Medius — your pharmacology and laboratory medicine specialist. I can help with drug interactions, dosage calculations, antibiotic selection, lab value interpretation, and NEET-PG pharmacology prep. How can I help?",
  nova46:
    "Upgrade to unlock Cadus Magnus — advanced diagnosis, image analysis and unlimited queries.",
};

const quickSuggestions: Record<ModelId, string[]> = {
  pulse45: [
    "What is the dosage of Amoxicillin for adults?",
    "Explain Type 2 Diabetes management guidelines",
    "Give me a NEET-PG question on cardiology",
  ],
  flux36: ["Warfarin drug interactions?", "Normal LFT values?", "CAP antibiotic choice?"],
  nova46: ["Rare autoimmune mimicking SLE?", "Complex multimorbidity regimen?", "Latest ACC guidelines?"],
};

interface Attachment {
  id: string;
  name: string;
  type: "image" | "file";
  previewUrl?: string;
  size: string;
}

function renderMarkdownText(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((chunk, i) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return <strong key={i} className="font-semibold" style={{ color: "rgba(220,240,255,0.95)" }}>{chunk.slice(2, -2)}</strong>;
    }
    return <span key={i}>{chunk}</span>;
  });
}

function ResearchReportCard({
  report, sources, queries, hasGoogleSearch,
}: {
  report: string; sources: ResearchSource[]; queries: string[]; hasGoogleSearch: boolean;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set(Array.from({ length: 10 }, (_, i) => i)));
  const [showAllSources, setShowAllSources] = useState(false);

  const sections = report
    .split(/\n(?=## )/)
    .map((s) => s.replace(/^## /, "").trim())
    .filter(Boolean)
    .map((s) => {
      const nlIdx = s.indexOf("\n");
      const title = nlIdx >= 0 ? s.slice(0, nlIdx).trim() : s.trim();
      const body  = nlIdx >= 0 ? s.slice(nlIdx + 1).trim() : "";
      return { title, body };
    });

  const toggleSection = (i: number) =>
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const visibleSources = showAllSources ? sources : sources.slice(0, 6);

  const sectionIcons: Record<string, string> = {
    "Executive Summary": "📋",
    "Epidemiology & Indian Burden": "🇮🇳",
    "Pathophysiology": "🔬",
    "Clinical Presentation": "🩺",
    "Diagnosis": "🧪",
    "Management & Treatment": "💊",
    "Key Guidelines & Evidence": "📚",
    "Clinical Pearls": "💡",
  };

  const renderBody = (body: string) =>
    body.split("\n").filter(Boolean).map((line, li) => {
      const isBullet = line.startsWith("- ") || line.startsWith("* ");
      const isTakeaway = line.startsWith("**Takeaway:");
      const clean = isBullet ? line.slice(2) : line;
      if (isTakeaway) {
        return (
          <div key={li} className="mt-3 pt-3 border-t border-blue-800/40 flex items-start gap-2">
            <span className="text-yellow-400 shrink-0 text-xs mt-0.5">★</span>
            <span className="text-[12px] font-medium" style={{ color: "rgba(250,220,100,0.9)" }}>{renderMarkdownText(clean)}</span>
          </div>
        );
      }
      return isBullet ? (
        <div key={li} className="flex gap-2">
          <span className="text-cyan-400 mt-1 shrink-0 text-[10px]">◆</span>
          <span className="text-[13px] leading-relaxed">{renderMarkdownText(clean)}</span>
        </div>
      ) : <p key={li} className="text-[13px] leading-relaxed">{renderMarkdownText(line)}</p>;
    });

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-t-2xl" style={{ background: "linear-gradient(135deg,#1e3a8a,#3730a3)" }}>
        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
          <Microscope className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold text-white block">Cadus AI Deep Research</span>
          <span className="text-[10px] text-blue-200/70">{sections.length} sections · {sources.length > 0 ? `${sources.length} sources` : "AI knowledge base"}</span>
        </div>
        {hasGoogleSearch && (
          <span className="flex items-center gap-1 text-[10px] bg-white/15 text-white px-2 py-1 rounded-full shrink-0">
            <Search className="w-2.5 h-2.5" /> Web Search
          </span>
        )}
      </div>

      {/* Search queries used */}
      {queries.length > 0 && (
        <div className="px-4 py-2.5 border-x border-blue-900/50 flex flex-wrap gap-1.5" style={{ background: "rgba(15,30,80,0.6)" }}>
          <span className="text-[10px] text-blue-400/60 mr-1 self-center">Searched:</span>
          {queries.map((q, i) => (
            <span key={i} className="text-[10px] border border-blue-700/40 text-blue-300/80 px-2 py-0.5 rounded-full truncate max-w-[180px]"
              style={{ background: "rgba(30,58,138,0.35)" }} title={q}>
              {q}
            </span>
          ))}
        </div>
      )}

      {/* Report sections */}
      <div className="border-x border-slate-700/50 divide-y divide-slate-700/25" style={{ background: "rgba(5,12,35,0.75)" }}>
        {sections.map((sec, i) => (
          <div key={i}>
            <button type="button"
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/4 transition-colors text-left"
              onClick={() => toggleSection(i)}>
              <span className="text-base shrink-0">{sectionIcons[sec.title] ?? "📌"}</span>
              <span className="text-[13px] font-semibold flex-1" style={{ color: "rgba(210,235,255,0.95)" }}>{sec.title}</span>
              <span className="text-[10px] shrink-0 transition-transform" style={{ color: "rgba(0,200,255,0.45)", transform: expandedSections.has(i) ? "rotate(0deg)" : "rotate(-90deg)" }}>▼</span>
            </button>
            {expandedSections.has(i) && sec.body && (
              <div className="px-5 pb-4 space-y-2" style={{ color: "rgba(175,215,255,0.85)" }}>
                {renderBody(sec.body)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sources — always visible at the bottom */}
      {sources.length > 0 && (
        <div className="border border-slate-700/50 rounded-b-2xl mt-0 overflow-hidden" style={{ background: "rgba(5,12,35,0.85)" }}>
          <div className="px-4 py-3 border-b border-slate-700/30 flex items-center gap-2" style={{ background: "rgba(10,20,60,0.6)" }}>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span className="text-[12px] font-semibold text-cyan-400">Sources</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-medium">{sources.length}</span>
          </div>
          <div className="p-3 grid grid-cols-1 gap-2">
            {visibleSources.map((src, i) => (
              <a key={i} href={src.url} target="_blank" rel="noreferrer"
                className="flex items-start gap-3 p-2.5 rounded-xl group transition-colors hover:bg-white/5"
                style={{ border: "1px solid rgba(0,188,212,0.12)" }}>
                <div className="flex items-center justify-center w-6 h-6 rounded-md shrink-0 mt-0.5 text-[10px] font-bold text-blue-300"
                  style={{ background: "rgba(30,58,138,0.5)", border: "1px solid rgba(59,130,246,0.3)" }}>
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-cyan-400 group-hover:text-cyan-300 group-hover:underline leading-snug mb-0.5 line-clamp-2">{src.title}</p>
                  <div className="flex items-center gap-1.5">
                    <img src={`https://www.google.com/s2/favicons?domain=${src.domain}&sz=16`} alt="" className="w-3 h-3 rounded-sm"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <span className="text-[10px]" style={{ color: "rgba(100,160,220,0.55)" }}>{src.domain}</span>
                  </div>
                  {src.snippet && (
                    <p className="text-[11px] mt-1 leading-snug line-clamp-2" style={{ color: "rgba(160,195,240,0.55)" }}>{src.snippet}</p>
                  )}
                </div>
                <ExternalLink className="w-3 h-3 shrink-0 mt-1 opacity-0 group-hover:opacity-40 text-cyan-400 transition-opacity" />
              </a>
            ))}
          </div>
          {sources.length > 6 && (
            <div className="px-4 pb-3">
              <button type="button" onClick={() => setShowAllSources((v) => !v)}
                className="text-[11px] text-cyan-500 hover:text-cyan-300 hover:underline transition-colors">
                {showAllSources ? "Show fewer" : `Show ${sources.length - 6} more sources ↓`}
              </button>
            </div>
          )}
        </div>
      )}
      {sources.length === 0 && (
        <div className="border border-t-0 border-slate-700/50 rounded-b-2xl px-4 py-3 flex items-center gap-2" style={{ background: "rgba(5,12,35,0.85)" }}>
          <span className="text-[10px] text-white/25">⚠ Based on AI training knowledge — add Google Search API keys for live web sources</span>
        </div>
      )}
    </div>
  );
}

function makeSession(modelId: ModelId): ChatSession {
  return { id: crypto.randomUUID(), modelId, messages: [], title: "New chat", createdAt: Date.now() };
}

const SESSIONS_LS_KEY = "cadus_sessions_v2";
const PINNED_LS_KEY = "cadus_pinned_v1";

function saveSessions(sessions: ChatSession[]): void {
  try { localStorage.setItem(SESSIONS_LS_KEY, JSON.stringify(sessions.slice(0, 30))); } catch {}
}
function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_LS_KEY);
    if (!raw) return [makeSession("pulse45")];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [makeSession("pulse45")];
  } catch { return [makeSession("pulse45")]; }
}
function loadPinned(): string[] {
  try { return JSON.parse(localStorage.getItem(PINNED_LS_KEY) ?? "[]"); } catch { return []; }
}
function savePinned(pins: string[]): void {
  try { localStorage.setItem(PINNED_LS_KEY, JSON.stringify(pins)); } catch {}
}

export default function AiAssistant() {
  const { user } = useUserAuth();
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => loadSessions()[0]?.id ?? "");
  const [pinnedPrompts, setPinnedPrompts] = useState<string[]>(loadPinned);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatMode, setChatMode] = useState<ChatMode>("normal");
  const [showProModal, setShowProModal] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [settings, setSettings] = useState<CadusSettings>(loadSettings);
  const tr = getTranslation(settings.language);
  const themeVars = getThemeVars(settings.theme);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingResearch, setIsGeneratingResearch] = useState(false);
  const [researchStage, setResearchStage] = useState<"idle" | "waiting-type">("idle");
  const [pendingResearchQuery, setPendingResearchQuery] = useState("");
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);
  const [presentationStage, setPresentationStage] = useState<"idle" | "waiting-slide-count">("idle");
  const [pendingPresentationPrompt, setPendingPresentationPrompt] = useState("");
  const [imageStage, setImageStage] = useState<"idle" | "waiting-type">("idle");
  const [pendingImagePrompt, setPendingImagePrompt] = useState("");
  const [buildingTopic, setBuildingTopic] = useState("");
  const [buildingSlideCount, setBuildingSlideCount] = useState(10);
  const [activePresentationData, setActivePresentationData] = useState<(PresentationData & { pdfBase64?: string; docxBase64?: string }) | null>(null);
  const [specialty, setSpecialty] = useState<string>("General");
  const [showSpecialtyPicker, setShowSpecialtyPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported] = useState(() => typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window));
  const recognitionRef = useRef<any>(null);
  const specialtyPickerRef = useRef<HTMLDivElement>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState<string | null>(null);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const contextParam = params.get("context");
    if (contextParam) {
      try {
        const decoded = decodeURIComponent(contextParam);
        setInput(decoded);
      } catch {
        /* ignore malformed URI */
      }
    }
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("demo") === "slides") {
      setActivePresentationData({
        title: "Human Heart — Demo Presentation",
        subtitle: "Medical Education | Cadus AI",
        slides: [
          { n: 1, type: "title", layout: "", t: "The Human Heart", sub: "Structure, Physiology & Clinical Significance", bullets: [] },
          { n: 2, type: "overview", layout: "cards", t: "Overview: Human Heart", sub: "", bullets: [], cards: [
            { heading: "Anatomy & Structure", body: "The heart is a hollow muscular organ in the mediastinum. Four chambers — two atria and two ventricles — pump blood through pulmonary and systemic circuits. Three tissue layers: epicardium, myocardium, and endocardium." },
            { heading: "Physiology & Function", body: "The heart acts as a dual pump circulating blood simultaneously. Cardiac output (CO = HR × SV), preload, afterload, and contractility are the four determinants of cardiac performance." },
            { heading: "Clinical Significance", body: "Cardiovascular disease is the #1 cause of death worldwide. Rapid recognition of MI, heart failure, and arrhythmias using ECG interpretation and biomarkers is essential for every clinician." },
          ]},
          { n: 3, type: "physiology", layout: "stats", t: "Cardiac Physiology by Numbers", sub: "", bullets: [], stats: [
            { value: "5 L/min", label: "Cardiac Output at Rest", desc: "Volume of blood pumped by the heart each minute" },
            { value: "100,000", label: "Heartbeats Per Day", desc: "Approximate number of cardiac contractions daily" },
            { value: "120/80", label: "Normal BP (mmHg)", desc: "Standard systolic / diastolic blood pressure reference" },
          ]},
          { n: 4, type: "clinical", layout: "twocol", t: "Acute Coronary Syndromes", sub: "", bullets: [], leftHeading: "Clinical Presentation", leftBody: "Acute coronary syndrome (ACS) encompasses STEMI, NSTEMI, and unstable angina. Patients present with chest pain, diaphoresis, and dyspnoea. Rapid troponin elevation and ECG changes guide diagnosis. Immediate revascularisation reduces mortality significantly in STEMI. Time is muscle — door-to-balloon under 90 minutes saves lives.", rightPoints: ["STEMI: Complete vessel occlusion — emergency PCI required", "NSTEMI: Partial occlusion — troponin positive, no ST elevation", "Unstable Angina: No troponin rise, high-risk — urgent workup", "Key: Dual antiplatelet therapy + anticoagulation within 10 minutes"] },
          { n: 5, type: "pathways", layout: "list", t: "Management Pathways", sub: "", bullets: ["Primary prevention: Lifestyle modification, statin therapy, BP control", "Secondary prevention: Dual antiplatelet, ACE inhibitors, cardiac rehab", "Acute management: Aspirin + heparin + PCI within 90 minutes", "Heart failure: GDMT including beta-blockers, ARNi, SGLT2 inhibitors", "Sudden death prevention: ICD implant in EF < 35% on optimal therapy"], ki: "Early revascularisation and guideline-directed therapy dramatically reduce cardiovascular mortality — time-sensitive intervention saves lives." },
        ],
      });
    }
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cadus-settings-v1" && e.newValue) {
        try {
          const next = JSON.parse(e.newValue);
          setSettings((prev) => ({ ...prev, ...next }));
        } catch {}
      }
      if (e.key === "cadus_sessions_v2" && !e.newValue) {
        const fresh = makeSession("pulse45");
        setSessions([fresh]);
        setActiveSessionId(fresh.id);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const [input, setInput] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const [sidebarView, setSidebarView] = useState<"home" | "chats" | "models">("home");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const modelPickerRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const chatMutation = useAiChat();
  const { toast } = useToast();

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? sessions[0];
  const activeModel: ModelId = activeSession?.modelId ?? "pulse45";
  const messages: ExtendedMessage[] = activeSession?.messages ?? [];
  const hasMessages = messages.length > 0;
  const model = MODELS.find((m) => m.id === activeModel)!;
  const isProLocked = model.pro ?? false;

  const seenMsgKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!activeSessionId) return;
    messages.forEach((_, idx) => {
      seenMsgKeys.current.add(`${activeSessionId}:${idx}`);
    });
  }, [activeSessionId]);

  const isMsgNew = (idx: number) =>
    !!activeSessionId && !seenMsgKeys.current.has(`${activeSessionId}:${idx}`);

  const markMsgSeen = (idx: number) => {
    if (activeSessionId) seenMsgKeys.current.add(`${activeSessionId}:${idx}`);
  };

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatMutation.isPending]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
      if (modelPickerRef.current && !modelPickerRef.current.contains(e.target as Node)) {
        setShowModelPicker(false);
      }
      if (specialtyPickerRef.current && !specialtyPickerRef.current.contains(e.target as Node)) {
        setShowSpecialtyPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleVoiceInput = useCallback(() => {
    if (!voiceSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as any[])
        .map((r: any) => r[0].transcript).join("");
      setInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [voiceSupported, isListening]);

  const updateSession = useCallback((sessionId: string, msgs: ExtendedMessage[]) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const firstUser = msgs.find((m) => m.role === ChatMessageRole.user);
        const title = firstUser ? firstUser.content.slice(0, 50) : "New chat";
        return { ...s, messages: msgs, title };
      })
    );
  }, []);

  const handleNewChat = () => {
    const sess = makeSession(activeModel);
    setSessions((prev) => [sess, ...prev]);
    setActiveSessionId(sess.id);
    setChatMode("normal");
    setAttachments([]);
    resetPresentationState();
    setInput("");
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (next.length === 0) {
        const fresh = makeSession("pulse45");
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (id === activeSessionId) {
        setActiveSessionId(next[0].id);
      }
      return next;
    });
  };

  const resetPresentationState = () => {
    setPresentationStage("idle");
    setPendingPresentationPrompt("");
    setImageStage("idle");
    setPendingImagePrompt("");
    setResearchStage("idle");
    setPendingResearchQuery("");
  };

  const handleModelSelect = (m: Model) => {
    if (m.pro) { setShowProModal(true); return; }
    const existingSession = [...sessions].reverse().find((s) => s.modelId === m.id);
    if (existingSession) {
      setActiveSessionId(existingSession.id);
    } else {
      const sess = makeSession(m.id);
      setSessions((prev) => [sess, ...prev]);
      setActiveSessionId(sess.id);
    }
    setInput("");
    setChatMode("normal");
    resetPresentationState();
  };

  const toggleMode = (mode: ChatMode) => {
    setChatMode((prev) => {
      if (prev === mode) { resetPresentationState(); return "normal"; }
      resetPresentationState();
      return mode;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasContent = input.trim() || attachments.length > 0;
    if (!hasContent || chatMutation.isPending || isGeneratingImage || isGeneratingResearch || isGeneratingPresentation || isProLocked) return;

    const userMsg = input.trim() || `[Attached: ${attachments.map((a) => a.name).join(", ")}]`;
    setInput("");
    setAttachments([]);

    const currentMsgs = activeSession.messages;
    const sessionId = activeSession.id;
    const userEntry: ExtendedMessage = { role: ChatMessageRole.user, content: userMsg };
    const newMsgs: ExtendedMessage[] = [...currentMsgs, userEntry];
    updateSession(sessionId, newMsgs);

    if (chatMode === "create-image") {
      setPendingImagePrompt(userMsg);
      setImageStage("waiting-type");
      updateSession(sessionId, [...newMsgs, {
        role: ChatMessageRole.assistant,
        content: tr.imageTypeQuestion,
        isImageTypeSelection: true,
      }]);
      return;
    }

    if (chatMode === "create-presentation") {
      setPendingPresentationPrompt(userMsg);
      setPresentationStage("waiting-slide-count");
      updateSession(sessionId, [...newMsgs, {
        role: ChatMessageRole.assistant,
        content: `Great! I'll create a presentation on "${userMsg}". How many slides would you like?`,
        slideCountOptions: [5, 8, 10, 12, 15, 20],
      }]);
      return;
    }

    if (chatMode === "deep-research") {
      setPendingResearchQuery(userMsg);
      setResearchStage("waiting-type");
      updateSession(sessionId, [...newMsgs, {
        role: ChatMessageRole.assistant,
        content: tr.researchTypeQuestion ?? "Would you like a quick summary or a full deep research report?",
        isResearchTypeSelection: true,
      }]);
      return;
    }

    if (chatMode === "image-analysis") {
      const imageAttachment = attachments.find(a => a.type === "image");
      if (!imageAttachment || !imageAttachment.previewUrl) {
        toast({ title: "No image attached", description: "Please attach an X-ray, ECG, or medical image first.", variant: "destructive" });
        updateSession(sessionId, currentMsgs);
        return;
      }
      setIsAnalyzingImage(true);
      try {
        const apiBase = "";
        const resp = await fetch(`${apiBase}/api/ai/analyze-image`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: imageAttachment.previewUrl.split(",")[1],
            imageType: imageAttachment.previewUrl.split(";")[0].split(":")[1] ?? "image/jpeg",
            query: userMsg || "Please provide a full clinical analysis of this medical image.",
            specialty,
          }),
        });
        const data = await resp.json();
        if (data.analysis) {
          updateSession(sessionId, [...newMsgs, { role: ChatMessageRole.assistant, content: data.analysis }]);
        } else throw new Error(data.error ?? "Analysis failed");
      } catch (err: any) {
        toast({ title: "Image analysis failed", description: err?.message ?? "Please try again.", variant: "destructive" });
        updateSession(sessionId, currentMsgs);
      } finally { setIsAnalyzingImage(false); }
      return;
    }

    const apiMode = chatMode === "normal" ? "normal" : chatMode;
    chatMutation.mutate(
      { data: { message: userMsg, conversationHistory: currentMsgs, agent: activeModel, language: settings.language, mode: apiMode, specialty } as any },
      {
        onSuccess: (data) => {
          updateSession(sessionId, [...newMsgs, { role: ChatMessageRole.assistant, content: data.message }]);
          const jwt = user ? localStorage.getItem("aethex_jwt") : null;
          if (jwt && user && data.message) {
            const apiBase = "";
            fetch(`${apiBase}/api/monetization/consults`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
              body: JSON.stringify({ query: userMsg.slice(0, 2000), response: data.message.slice(0, 8000), model: activeModel }),
            }).catch(() => {});
          }
        },
      }
    );
  };

  const sendDirect = (text: string) => {
    if (!text.trim() || chatMutation.isPending || isProLocked) return;
    setInput("");
    setAttachments([]);
    const currentMsgs = activeSession.messages;
    const sessionId = activeSession.id;
    const userEntry: ExtendedMessage = { role: ChatMessageRole.user, content: text };
    const newMsgs: ExtendedMessage[] = [...currentMsgs, userEntry];
    updateSession(sessionId, newMsgs);
    chatMutation.mutate(
      { data: { message: text, conversationHistory: currentMsgs, agent: activeModel, language: settings.language, mode: "normal", specialty } as any },
      {
        onSuccess: (data) => {
          updateSession(sessionId, [...newMsgs, { role: ChatMessageRole.assistant, content: data.message }]);
          const jwt = user ? localStorage.getItem("aethex_jwt") : null;
          if (jwt && user && data.message) {
            const apiBase = "";
            fetch(`${apiBase}/api/monetization/consults`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
              body: JSON.stringify({ query: text.slice(0, 2000), response: data.message.slice(0, 8000), model: activeModel }),
            }).catch(() => {});
          }
        },
      }
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const att: Attachment = {
        id: crypto.randomUUID(), name: file.name, type,
        size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
      };
      if (type === "image") {
        const reader = new FileReader();
        reader.onload = (ev) => { att.previewUrl = ev.target?.result as string; setAttachments((prev) => [...prev, { ...att }]); };
        reader.readAsDataURL(file);
      } else {
        setAttachments((prev) => [...prev, att]);
      }
    });
    setShowAttachMenu(false);
    e.target.value = "";
  };

  const handleSlideCountSelect = async (count: number) => {
    if (isGeneratingPresentation) return;
    const currentMsgs = activeSession.messages;
    const sessionId = activeSession.id;
    const topic = pendingPresentationPrompt;
    const userEntry: ExtendedMessage = { role: ChatMessageRole.user, content: `${count} slides` };
    const newMsgs = [...currentMsgs, userEntry];
    updateSession(sessionId, newMsgs);
    setBuildingTopic(topic);
    setBuildingSlideCount(count);
    setIsGeneratingPresentation(true);
    try {
      const apiBase = "";
      const [slidesResp, pdfResp] = await Promise.allSettled([
        fetch(`${apiBase}/api/ai/generate-slides`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: topic, slideCount: count }) }).then(r => r.json()),
        fetch(`${apiBase}/api/ai/generate-presentation`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: topic, slideCount: count }) }).then(r => r.json()),
      ]);
      const slidesData = slidesResp.status === "fulfilled" ? slidesResp.value : null;
      const pdfData = pdfResp.status === "fulfilled" ? pdfResp.value : null;

      if (slidesData?.slides?.length) {
        const merged: PresentationData & { pdfBase64?: string; docxBase64?: string } = {
          ...slidesData, pdfBase64: pdfData?.pdfBase64, docxBase64: pdfData?.docxBase64,
        };
        setActivePresentationData(merged);
        updateSession(sessionId, [...newMsgs, {
          role: ChatMessageRole.assistant,
          content: `Your presentation "${slidesData.title}" (${count} slides) is ready!`,
          isPresentation: true, presentationData: merged,
          presentationTitle: slidesData.title, presentationPdfBase64: pdfData?.pdfBase64,
          presentationDocxBase64: pdfData?.docxBase64,
        }]);
        resetPresentationState();
      } else if (pdfData?.pdfBase64) {
        updateSession(sessionId, [...newMsgs, {
          role: ChatMessageRole.assistant,
          content: `Your presentation "${pdfData.title}" (${pdfData.totalSlides} slides) is ready! Download it below:`,
          isPresentation: true, presentationTitle: pdfData.title,
          presentationPdfBase64: pdfData.pdfBase64, presentationDocxBase64: pdfData.docxBase64,
        }]);
        resetPresentationState();
      } else throw new Error("Generation failed");
    } catch {
      toast({ title: "Presentation generation failed", description: "Please try again.", variant: "destructive" });
      updateSession(sessionId, currentMsgs);
      resetPresentationState();
    } finally { setIsGeneratingPresentation(false); }
  };

  const handleImageTypeSelect = async (imageStyle: "simple" | "diagram" | "real" | "real-labeled") => {
    if (isGeneratingImage) return;
    const currentMsgs = activeSession.messages;
    const sessionId = activeSession.id;
    const prompt = pendingImagePrompt;
    const styleLabels: Record<string, string> = {
      simple: tr.simpleImage,
      diagram: tr.diagram ?? "Diagram",
      real: tr.realImage ?? "Real Image",
      "real-labeled": tr.realImageLabeled ?? "Real Image + Labels",
    };
    const contentLabels: Record<string, string> = {
      simple: "medical illustration",
      diagram: "anatomical diagram",
      real: "real medical image",
      "real-labeled": "labeled real medical image",
    };
    const typeLabel = styleLabels[imageStyle] ?? tr.simpleImage;
    const userEntry: ExtendedMessage = { role: ChatMessageRole.user, content: typeLabel };
    const newMsgs = [...currentMsgs, userEntry];
    updateSession(sessionId, newMsgs);
    setImageStage("idle");
    setIsGeneratingImage(true);
    try {
      const apiBase = "";
      const resp = await fetch(`${apiBase}/api/ai/generate-image`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageStyle }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? "Image generation failed. Please try again.");
      if (data.imageUrl) {
        let caption: string;
        if (data.isPlaceholder) {
          caption = `Image generation is temporarily unavailable — showing a medical reference image for: "${prompt}"`;
        } else if (data.source === "wikipedia") {
          caption = `Wikipedia medical image for: "${prompt}" — sourced from Wikipedia Commons for clinical accuracy.`;
        } else {
          caption = `Here is your generated ${contentLabels[imageStyle] ?? "medical illustration"} for: "${prompt}"`;
        }
        updateSession(sessionId, [...newMsgs, {
          role: ChatMessageRole.assistant,
          content: caption,
          imageUrl: data.imageUrl, isImageGeneration: true,
        }]);
      } else throw new Error(data.error ?? "No image was returned.");
    } catch (err: any) {
      const description = err?.message ?? "Please try a different prompt.";
      toast({ title: "Image generation failed", description, variant: "destructive" });
      updateSession(sessionId, currentMsgs);
    } finally { setIsGeneratingImage(false); }
  };

  const handleResearchTypeSelect = async (mode: "quick" | "full") => {
    if (isGeneratingResearch) return;
    const currentMsgs = activeSession.messages;
    const sessionId = activeSession.id;
    const query = pendingResearchQuery;
    const typeLabel = mode === "quick"
      ? (tr.quickSummary ?? "Quick Summary")
      : (tr.fullDeepResearch ?? "Full Deep Research");
    const userEntry: ExtendedMessage = { role: ChatMessageRole.user, content: typeLabel };
    const newMsgs = [...currentMsgs, userEntry];
    updateSession(sessionId, newMsgs);
    setResearchStage("idle");
    setIsGeneratingResearch(true);
    try {
      const apiBase = "";
      if (mode === "quick") {
        const resp = await fetch(`${apiBase}/api/ai/chat`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Provide a concise clinical summary (3–5 paragraphs) on: ${query}. Cover key facts, clinical relevance, and management highlights.`,
            agent: activeModel, mode: "normal",
          }),
        });
        const data = await resp.json();
        if (data.message) {
          updateSession(sessionId, [...newMsgs, {
            role: ChatMessageRole.assistant, content: data.message,
          }]);
        } else throw new Error("No response returned.");
      } else {
        const resp = await fetch(`${apiBase}/api/ai/deep-research`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, agent: activeModel }),
        });
        const data = await resp.json();
        if (data.report) {
          updateSession(sessionId, [...newMsgs, {
            role: ChatMessageRole.assistant, content: "",
            isDeepResearch: true, researchReport: data.report,
            researchSources: data.sources ?? [], researchQueries: data.searchQueries ?? [],
            hasGoogleSearch: data.hasGoogleSearch ?? false,
          }]);
        } else throw new Error(data.error ?? "Research failed");
      }
    } catch {
      toast({ title: "Research failed", description: "Please try again.", variant: "destructive" });
      updateSession(sessionId, currentMsgs);
    } finally { setIsGeneratingResearch(false); }
  };

  const removeAttachment = (id: string) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  const handleDownloadPdf = async (content: string, msgId: string) => {
    setIsExportingPdf(msgId);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 16;
      const contentW = pageW - margin * 2;
      let y = 0;

      // White page background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageW, pageH, "F");

      // Header bar — dark navy with white text (readable on dark bg)
      doc.setFillColor(10, 24, 70);
      doc.rect(0, 0, pageW, 24, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("Cadus AI", margin, 15);
      const modeLabel = chatMode && chatMode !== "normal"
        ? chatMode.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        : "Clinical Report";
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(180, 210, 255);
      doc.text(`· AI ${modeLabel}`, margin + 28, 15);
      const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      doc.setTextColor(200, 220, 255);
      doc.text(dateStr, pageW - margin, 15, { align: "right" });

      // Teal accent stripe under header
      doc.setFillColor(0, 188, 168);
      doc.rect(0, 24, pageW, 1.5, "F");

      y = 34;
      const firstUserMsg = messages.find(m => m.role === ChatMessageRole.user)?.content?.slice(0, 90) ?? "Clinical Report";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(10, 24, 70);
      const titleLines = doc.splitTextToSize(firstUserMsg, contentW);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 6.5 + 2;

      doc.setDrawColor(0, 188, 168);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageW - margin, y);
      y += 7;

      const checkNewPage = (needed: number) => {
        if (y + needed > pageH - 18) {
          doc.addPage();
          // White background on new page
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, pageW, pageH, "F");
          // Thin header strip
          doc.setFillColor(10, 24, 70);
          doc.rect(0, 0, pageW, 8, "F");
          doc.setFillColor(0, 188, 168);
          doc.rect(0, 8, pageW, 1, "F");
          y = 16;
        }
      };

      const lines = content.split("\n");
      for (const line of lines) {
        const stripped = line.trimStart();
        if (stripped === "") { y += 3; continue; }

        if (stripped.startsWith("# ")) {
          checkNewPage(12);
          y += 4;
          doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(10, 24, 70);
          const wrapped = doc.splitTextToSize(stripped.slice(2), contentW);
          doc.text(wrapped, margin, y); y += wrapped.length * 6.5 + 2;
        } else if (stripped.startsWith("## ")) {
          checkNewPage(10);
          y += 3;
          doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0, 100, 130);
          const wrapped = doc.splitTextToSize(stripped.slice(3), contentW);
          doc.text(wrapped, margin, y); y += wrapped.length * 5.8 + 2;
        } else if (stripped.startsWith("### ")) {
          checkNewPage(9);
          y += 2;
          doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(30, 80, 140);
          const wrapped = doc.splitTextToSize(stripped.slice(4), contentW);
          doc.text(wrapped, margin, y); y += wrapped.length * 5.2 + 1;
        } else if (stripped.startsWith("- ") || stripped.startsWith("• ") || stripped.match(/^\d+\.\s/)) {
          checkNewPage(6);
          const bulletText = stripped.startsWith("- ") ? stripped.slice(2) : stripped.startsWith("• ") ? stripped.slice(2) : stripped.replace(/^\d+\.\s/, "");
          const clean = bulletText.replace(/\*\*(.*?)\*\*/g, "$1");
          doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(25, 35, 55);
          const wrapped = doc.splitTextToSize(`• ${clean}`, contentW - 5);
          doc.text(wrapped, margin + 3, y); y += wrapped.length * 5 + 0.8;
        } else {
          checkNewPage(6);
          const clean = stripped.replace(/\*\*(.*?)\*\*/g, "$1");
          doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(25, 35, 55);
          const wrapped = doc.splitTextToSize(clean, contentW);
          doc.text(wrapped, margin, y); y += wrapped.length * 5 + 0.8;
        }
      }

      // Footer on every page
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFillColor(240, 243, 250);
        doc.rect(0, pageH - 11, pageW, 11, "F");
        doc.setDrawColor(200, 210, 230);
        doc.setLineWidth(0.3);
        doc.line(0, pageH - 11, pageW, pageH - 11);
        doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); doc.setTextColor(60, 80, 120);
        doc.text("Generated by Cadus AI  |  For clinical reference only. Not a substitute for professional medical judgment.", margin, pageH - 4.5);
        doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 4.5, { align: "right" });
      }

      doc.save(`cadus-report-${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      toast({ title: "Export failed", description: "Could not generate PDF. Please try again.", variant: "destructive" });
    } finally { setIsExportingPdf(null); }
  };

  const handleTogglePin = (prompt: string) => {
    setPinnedPrompts(prev => {
      const next = prev.includes(prompt) ? prev.filter(p => p !== prompt) : [...prev, prompt];
      savePinned(next);
      return next;
    });
  };

  const handleCameraCapture = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const id = `cam-${Date.now()}`;
    setAttachments((prev) => [...prev, { id, type: "image", file, previewUrl, name: file.name }]);
  };

  const handleClearCurrentChat = () => {
    const fresh = makeSession(activeModel);
    setSessions((prev) => prev.map((s) => s.id === activeSessionId ? fresh : s));
    setActiveSessionId(fresh.id);
  };

  const handleExportChats = () => {
    const data = JSON.stringify(sessions, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `cadus-chats-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const ModelIcon = model.icon;

  // Group sessions by today / yesterday / older
  const now = Date.now();
  const todaySessions = sessions.filter((s) => now - s.createdAt < 86400000);
  const yesterdaySessions = sessions.filter((s) => now - s.createdAt >= 86400000 && now - s.createdAt < 172800000);
  const olderSessions = sessions.filter((s) => now - s.createdAt >= 172800000);

  return (
    <div className="h-screen flex overflow-hidden relative" style={{ background: "var(--sp-root-bg)", ...themeVars }}>

      {/* Blink-style spotlight background — 3 layers (fully inline) */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        background:"radial-gradient(ellipse 85% 65% at 50% -5%, rgba(28,70,200,0.55) 0%, rgba(10,30,90,0.35) 40%, transparent 68%)",
        animation:"cadus-spot-breathe 5s ease-in-out infinite" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        background:"radial-gradient(ellipse 42% 36% at 50% -2%, rgba(100,180,255,0.18) 0%, rgba(50,120,255,0.08) 45%, transparent 70%)",
        animation:"cadus-spot-pulse 3.5s ease-in-out infinite", animationDelay:"-1.5s" }} />
      <div style={{ position:"absolute", top:-40, left:"50%", transform:"translateX(-50%)", width:420, height:230,
        borderRadius:"50%", pointerEvents:"none", zIndex:1,
        background:"radial-gradient(ellipse at 50% 30%, rgba(60,140,255,0.14) 0%, transparent 65%)",
        animation:"cadus-spot-pulse 4s ease-in-out infinite", animationDelay:"-0.7s" }} />

      {/* Hidden inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileSelect(e, "image")} />
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.csv,.xlsx" multiple className="hidden" onChange={(e) => handleFileSelect(e, "file")} />

      {/* ═══════════════════════════════════════════════════════════
          LEFT SIDEBAR — Replit style
      ══════════════════════════════════════════════════════════════ */}
      <aside
        className={cn(
          "relative z-20 flex flex-col shrink-0 transition-all duration-300 overflow-hidden",
          sidebarOpen ? "w-[220px]" : "w-0"
        )}
        style={{
          background: "var(--sp-sidebar-bg)",
          borderRight: "1px solid var(--sp-sidebar-border)",
        }}
      >
        {/* Top row: Logo + centred Search bar */}
        <div className="flex flex-col items-center gap-2 px-3 pt-3 pb-1 shrink-0">
          <CadusLogo size="md" thinking={false} baseUrl={import.meta.env.BASE_URL} />
          <div className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Search chats…</span>
          </div>
        </div>

        {/* Workspace selector */}
        <div className="px-2 pb-2 shrink-0">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all hover:bg-white/5">
            <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #1a73e8, #0ea5e9)" }}>S</div>
            <span className="flex-1 text-left text-xs font-medium truncate" style={{ color: "rgba(255,255,255,0.75)" }}>
              Cadus AI's Workspace
            </span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
          </button>
        </div>

        {/* Primary actions */}
        <div className="px-3 pb-2 space-y-1 shrink-0">
          <button onClick={handleNewChat}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Plus className="w-4 h-4" />
            Create something new
          </button>
          <button onClick={() => imageInputRef.current?.click()}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.45)" }}>
            <Upload className="w-4 h-4" />
            Import files or images
          </button>
        </div>

        {/* Nav links */}
        <div className="px-2 pb-2 space-y-0.5 shrink-0">
          {[
            { id: "home" as const, icon: Home, label: "Home" },
            { id: "chats" as const, icon: MessageSquare, label: "Chats" },
            { id: "models" as const, icon: Activity, label: "Models" },
          ].map(({ id, icon: Icon, label }) => (
            <button key={id}
              onClick={() => setSidebarView(id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: sidebarView === id ? "rgba(255,255,255,0.07)" : "transparent",
                color: sidebarView === id ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
              }}>
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="mx-3 my-1 shrink-0" style={{ borderTop: "1px solid var(--sp-divider)" }} />

        {/* Session history (scrollable) */}
        <div className="flex-1 overflow-y-auto px-2 min-h-0">
          {sidebarView === "chats" && (
            <>
              {[
                { label: tr.today, list: todaySessions },
                { label: tr.yesterday, list: yesterdaySessions },
                { label: tr.older, list: olderSessions },
              ].map(({ label, list }) =>
                list.length > 0 ? (
                  <div key={label} className="mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1 pt-1" style={{ color: "rgba(255,255,255,0.28)" }}>
                      {label}
                    </p>
                    {list.map((sess) => {
                      const sm = MODELS.find((m) => m.id === sess.modelId)!;
                      const isActive = sess.id === activeSessionId;
                      return (
                        <div key={sess.id} role="button" tabIndex={0}
                          onClick={() => { setActiveSessionId(sess.id); setSidebarView("home"); }}
                          onKeyDown={(e) => e.key === "Enter" && setActiveSessionId(sess.id)}
                          className="group w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all mb-0.5 cursor-pointer"
                          style={{
                            background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                            color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                          }}>
                          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[12px] truncate flex-1">{sess.title}</span>
                          <button onClick={(e) => handleDeleteSession(sess.id, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "rgba(255,100,100,0.6)" }}>
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : null
              )}
              {sessions.every(s => s.messages.length === 0) && (
                <p className="text-xs text-center px-2 py-4" style={{ color: "rgba(255,255,255,0.2)" }}>{tr.noChatsYet}</p>
              )}
            </>
          )}
          {sidebarView === "models" && (
            <div className="pt-1 space-y-1">
              {MODELS.map((m) => {
                const MI = m.icon;
                const isActive = m.id === activeModel;
                return (
                  <button key={m.id} onClick={() => handleModelSelect(m)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all"
                    style={isActive
                      ? { ...m.activeStyle, borderRadius: 8 }
                      : { color: "rgba(255,255,255,0.5)", border: "1px solid transparent" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)" }}>
                      {m.pro && !isActive ? <Lock className="w-3.5 h-3.5" style={{ color: "rgba(167,139,250,0.7)" }} /> : <MI className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs font-semibold">{m.name} <span className="opacity-60 font-normal">{m.version}</span></div>
                      <div className="text-[10px] opacity-40 truncate">{m.description}</div>
                    </div>
                    {m.pro && <span className="text-[9px] font-bold px-1 py-0.5 rounded-full" style={{ background: "rgba(109,40,217,0.4)", color: "#c4b5fd" }}>PRO</span>}
                  </button>
                );
              })}
            </div>
          )}
          {sidebarView === "home" && sessions.some(s => s.messages.length > 0) && (
            <div className="pt-1">
              <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1" style={{ color: "rgba(255,255,255,0.28)" }}>Recent</p>
              {sessions.filter(s => s.messages.length > 0).slice(0, 8).map(sess => {
                const isActive = sess.id === activeSessionId;
                return (
                  <button key={sess.id} onClick={() => setActiveSessionId(sess.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all mb-0.5"
                    style={{ background: isActive ? "rgba(255,255,255,0.07)" : "transparent", color: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)" }}>
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sess.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pro referral card */}
        <div className="mx-3 mb-2 mt-2 rounded-xl shrink-0 overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.22) 0%, rgba(30,58,138,0.18) 100%)", border: "1px solid rgba(139,92,246,0.22)" }}>
          <div className="px-3 pt-3 pb-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
                <Crown className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-[11px] font-bold" style={{ color: "rgba(220,210,255,0.95)" }}>Cadus Magnus</span>
              <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.3)", color: "#c4b5fd" }}>PRO</span>
            </div>
            <p className="text-[10px] leading-relaxed mb-2.5" style={{ color: "rgba(180,170,220,0.65)" }}>
              Advanced diagnosis, deep research &amp; image analysis.
            </p>
            <button onClick={() => setShowProModal(true)}
              className="w-full text-[10px] font-bold py-1.5 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-1"
              style={{ background: "linear-gradient(to right,#7c3aed,#9333ea)", color: "white" }}>
              <Crown className="w-3 h-3" /> View Plans
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className="px-2 pb-3 space-y-0.5 shrink-0">
          {[
            { icon: BookOpen, label: "Learn" },
            { icon: FileText, label: "Documentation" },
          ].map(({ icon: Icon, label }) => (
            <button key={label}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
          <button onClick={() => setShowProModal(true)}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            <Crown className="w-3.5 h-3.5" />
            Refer & Earn
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════
          MAIN AREA
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-h-0 relative">

        {/* ── Top Banner ── */}
        {showBanner && !hasMessages && (
          <div className="shrink-0 flex items-center justify-center gap-3 px-4 py-2 text-sm relative"
            style={{ background: "linear-gradient(90deg, rgba(109,40,217,0.12) 0%, rgba(30,58,138,0.1) 50%, rgba(109,40,217,0.12) 100%)", borderBottom: "1px solid rgba(139,92,246,0.15)" }}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
                <Crown className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-medium" style={{ color: "rgba(200,185,255,0.75)" }}>Unlock Cadus Magnus for advanced diagnosis &amp; unlimited queries</span>
            </div>
            <button onClick={() => setShowProModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all hover:opacity-90"
              style={{ background: "linear-gradient(to right,#7c3aed,#9333ea)", color: "white" }}>
              See plans
            </button>
            <button onClick={() => setShowBanner(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── HOME VIEW — Replit-style ── */}
        {!hasMessages && (
          <div className="flex-1 overflow-y-auto flex flex-col items-center pt-10 pb-8 px-4">

            {/* Workspace selector */}
            <button className="flex items-center gap-2 mb-7 px-3 py-1.5 rounded-xl transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #1a73e8, #0ea5e9)" }}>S</div>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>Cadus AI's Workspace</span>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} />
            </button>

            {/* Main greeting */}
            <h1 className="text-[2rem] font-semibold text-center mb-7 leading-snug" style={{ color: "rgba(255,255,255,0.92)" }}>
              Hi, what do you want to diagnose today? — Cadus AI is ready.
            </h1>

            {/* ── INPUT FORM (Replit-style) ── */}
            <div className="w-full max-w-2xl mb-5">
              {isProLocked ? (
                <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <Lock className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{tr.proRequired}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{tr.proGatedMsg}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowProModal(true)}
                    className="flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap"
                    style={{ background: "rgba(255,255,255,0.9)", color: "#111" }}>
                    <Crown className="w-4 h-4" /> {tr.upgradePro}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-2xl overflow-visible"
                  style={{ background: "var(--sp-input-bg)", border: "1px solid var(--sp-input-border)", boxShadow: "0 4px 32px rgba(0,0,0,0.3)" }}>
                  {chatMode !== "normal" && (
                    <div className="flex items-center gap-2 px-4 py-2 border-b text-xs font-semibold"
                      style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.03)" }}>
                      {chatMode === "deep-research"        ? <><Microscope    className="w-3.5 h-3.5" style={{color:"#34D399"}} /> Deep Research Mode</>
                      : chatMode === "create-presentation" ? <><Presentation  className="w-3.5 h-3.5" style={{color:"#FBBF24"}} /> {presentationStage === "idle" ? "Slides Mode" : tr.selectSlideCountAbove}</>
                      : chatMode === "create-image"        ? <><ImagePlus     className="w-3.5 h-3.5" style={{color:"#F472B6"}} /> {imageStage === "waiting-type" ? tr.selectSlideCountAbove : "Image Mode"}</>
                      : chatMode === "drug-interactions"   ? <><Pill          className="w-3.5 h-3.5" style={{color:"#F87171"}} /> Drug Interaction Checker</>
                      : chatMode === "dosage-calc"         ? <><Calculator    className="w-3.5 h-3.5" style={{color:"#FB923C"}} /> Dosage Calculator</>
                      : chatMode === "lab-values"          ? <><TestTube2     className="w-3.5 h-3.5" style={{color:"#4ADE80"}} /> Lab Values Interpreter</>
                      : chatMode === "soap-note"           ? <><ClipboardList className="w-3.5 h-3.5" style={{color:"#38BDF8"}} /> SOAP Note Generator</>
                      : chatMode === "mcq-gen"             ? <><HelpCircle   className="w-3.5 h-3.5" style={{color:"#C084FC"}} /> MCQ / Exam Prep Generator</>
                      : chatMode === "patient-edu"         ? <><Languages    className="w-3.5 h-3.5" style={{color:"#FB7185"}} /> Patient Education Mode</>
                      : chatMode === "procedure-guide"     ? <><Zap          className="w-3.5 h-3.5" style={{color:"#FDE047"}} /> Procedure Guide</>
                      : chatMode === "ddx"                 ? <><Brain        className="w-3.5 h-3.5" style={{color:"#A78BFA"}} /> Differential Diagnosis Generator</>
                      : chatMode === "image-analysis"      ? <><Microscope  className="w-3.5 h-3.5" style={{color:"#2DD4BF"}} /> Medical Scan Analysis (Pro)</>
                      : null}
                      {specialty !== "General" && (
                        <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: "rgba(100,180,255,0.15)", color: "rgba(100,180,255,0.9)" }}>
                          {specialty}
                        </span>
                      )}
                      <button type="button" onClick={() => toggleMode(chatMode)} className="ml-auto hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                  {attachments.length > 0 && (
                    <div className="flex gap-2 px-4 pt-3 flex-wrap">
                      {attachments.map((a) => (
                        <div key={a.id} className="relative group flex items-center gap-2 rounded-xl px-3 py-2 text-xs max-w-[160px]"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}>
                          {a.type === "image" && a.previewUrl
                            ? <img src={a.previewUrl} alt={a.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                            : <FileText className="w-5 h-5 shrink-0" style={{ color: "rgba(255,255,255,0.5)" }} />}
                          <div className="min-w-0">
                            <p className="truncate font-medium leading-tight">{a.name}</p>
                            <p style={{ color: "rgba(255,255,255,0.3)" }}>{a.size}</p>
                          </div>
                          <button type="button" onClick={() => removeAttachment(a.id)}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full items-center justify-center hidden group-hover:flex"
                            style={{ background: "rgba(200,50,50,0.8)", color: "white" }}>
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
                    placeholder={
                      chatMode === "create-image"        ? tr.describeImagePlaceholder
                      : chatMode === "deep-research"     ? tr.researchTopicPlaceholder
                      : chatMode === "create-presentation" && presentationStage === "idle" ? tr.presentationTopicPlaceholder
                      : chatMode === "create-presentation" && presentationStage === "waiting-slide-count" ? tr.selectSlidesPlaceholder
                      : chatMode === "drug-interactions" ? "Enter drug names, e.g. 'Warfarin + Aspirin + Metformin'..."
                      : chatMode === "dosage-calc"       ? "Enter drug + patient details, e.g. 'Gentamicin, 60kg male, eGFR 45'..."
                      : chatMode === "lab-values"        ? "Paste lab results, e.g. 'Hb 8.2, WBC 12000, Platelets 95000, ALT 120...'..."
                      : chatMode === "soap-note"         ? "Describe the clinical encounter in free text — Cadus AI will structure it as a SOAP note..."
                      : chatMode === "mcq-gen"           ? "Enter a topic for NEET-PG / USMLE questions, e.g. 'Myocardial Infarction'..."
                      : chatMode === "patient-edu"       ? "Enter the diagnosis/condition to explain to a patient in simple language..."
                      : chatMode === "procedure-guide"   ? "Enter a procedure name, e.g. 'Central venous catheter insertion'..."
                      : chatMode === "ddx"               ? "Describe symptoms, vitals, history — Cadus AI will generate a ranked DDx with ICD-10 codes..."
                      : chatMode === "image-analysis"    ? "Attach an X-ray, ECG, CT, MRI, or fundus image — then ask a question or just press Send to get a full report..."
                      : "Describe your clinical question, Cadus AI will bring it to life..."
                    }
                    rows={2}
                    className="w-full px-5 pt-4 pb-2 text-[15px] bg-transparent focus:outline-none resize-none cadus-textarea"
                    style={{ color: "var(--sp-textarea-color)", caretColor: "var(--sp-caret-color)", minHeight: "72px", maxHeight: "180px" }}
                    disabled={chatMutation.isPending || isGeneratingPresentation || presentationStage === "waiting-slide-count"}
                  />
                  <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">
                    <div className="flex items-center gap-1">
                      <div className="relative" ref={attachMenuRef}>
                        <button type="button" onClick={() => setShowAttachMenu((v) => !v)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={{ color: showAttachMenu ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}>
                          <Plus className="w-4 h-4" />
                        </button>
                        {showAttachMenu && (
                          <div className="absolute bottom-full left-0 mb-2 rounded-xl shadow-xl overflow-hidden w-52 z-30"
                            style={{ background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.28)" }}>{tr.attach}</div>
                            {[
                              { label: tr.uploadImage, sub: tr.uploadImageFormats, icon: Image, action: () => imageInputRef.current?.click() },
                              { label: tr.uploadDocument, sub: tr.uploadDocumentFormats, icon: FileText, action: () => fileInputRef.current?.click() },
                              { label: tr.takePhoto, sub: tr.useCamera, icon: Camera, action: () => { setShowAttachMenu(false); setShowCamera(true); } },
                            ].map(({ label, sub, icon: Icon, action }) => (
                              <button key={label} type="button" onClick={action}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors hover:bg-white/5"
                                style={{ color: "rgba(255,255,255,0.75)" }}>
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                                  <Icon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                                </div>
                                <div className="text-left">
                                  <p className="font-semibold leading-tight">{label}</p>
                                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Model picker dropdown */}
                      <div className="relative" ref={modelPickerRef}>
                        <button type="button"
                          onClick={() => setShowModelPicker(v => !v)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={{ background: "rgba(255,255,255,0.07)", color: model.activeStyle.color, border: `1px solid ${model.activeStyle.border.replace("1px solid ", "")}` }}>
                          <ModelIcon className="w-3.5 h-3.5" />
                          <span>{model.name}</span>
                          <ChevronDown className="w-3 h-3 opacity-60" />
                        </button>
                        {showModelPicker && (
                          <div className="absolute bottom-full right-0 mb-2 rounded-xl shadow-2xl overflow-hidden z-40 w-56"
                            style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <div className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: "rgba(255,255,255,0.28)" }}>AI Models</div>
                            {MODELS.map((m) => {
                              const MI = m.icon;
                              const isActive = m.id === activeModel;
                              return (
                                <button key={m.id} type="button"
                                  onClick={() => { setShowModelPicker(false); handleModelSelect(m); }}
                                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-all hover:bg-white/5"
                                  style={{ background: isActive ? "rgba(255,255,255,0.06)" : "transparent" }}>
                                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: isActive ? m.activeStyle.background : "rgba(255,255,255,0.05)", border: isActive ? m.activeStyle.border : "1px solid rgba(255,255,255,0.07)" }}>
                                    {m.pro && !isActive
                                      ? <Lock className="w-3.5 h-3.5" style={{ color: "rgba(167,139,250,0.7)" }} />
                                      : <MI className="w-3.5 h-3.5" style={{ color: isActive ? m.activeStyle.color : "rgba(255,255,255,0.4)" }} />}
                                  </div>
                                  <div className="flex-1 text-left">
                                    <div className="text-xs font-semibold flex items-center gap-1.5"
                                      style={{ color: isActive ? m.activeStyle.color : "rgba(255,255,255,0.75)" }}>
                                      {m.name}
                                      <span className="font-normal opacity-50 text-[10px]">{m.version}</span>
                                      {m.pro && (
                                        <span className="text-[8px] font-bold px-1 py-0.5 rounded-full ml-auto"
                                          style={{ background: "rgba(109,40,217,0.4)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.3)" }}>PRO</span>
                                      )}
                                    </div>
                                    <div className="text-[10px] opacity-40">{m.description.split(" · ")[0]}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {voiceSupported && (
                        <button type="button"
                          onClick={toggleVoiceInput}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                          title={isListening ? "Stop voice input" : "Voice input (en-IN)"}
                          style={{ background: isListening ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.07)", color: isListening ? "#F87171" : "rgba(255,255,255,0.5)", border: isListening ? "1px solid rgba(248,113,113,0.45)" : "1px solid transparent", animation: isListening ? "cadus-spot-breathe 1.2s ease-in-out infinite" : "none" }}>
                          {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      <button type="submit"
                        disabled={(!input.trim() && attachments.length === 0) || chatMutation.isPending || isGeneratingImage || isGeneratingPresentation || isAnalyzingImage || presentationStage === "waiting-slide-count" || imageStage === "waiting-type"}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                        style={{ background: "rgba(255,255,255,0.9)" }}>
                        {isAnalyzingImage ? <Loader2 className="w-3.5 h-3.5 text-black animate-spin" /> : <Send className="w-3.5 h-3.5 text-black" />}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* ── Specialty Filter ── */}
            {!isProLocked && (
              <div className="w-full max-w-2xl flex items-center justify-center gap-2 mb-3">
                <div className="relative" ref={specialtyPickerRef}>
                  <button onClick={() => setShowSpecialtyPicker(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {specialty}
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>
                  {showSpecialtyPicker && (
                    <div className="absolute top-full left-0 mt-1 z-30 rounded-xl shadow-2xl overflow-hidden w-44"
                      style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {["General","Cardiology","Neurology","Paediatrics","Obstetrics","Oncology","Emergency","Surgery","Psychiatry","Nephrology","Pulmonology","Gastroenterology"].map((sp) => (
                        <button key={sp} type="button"
                          onClick={() => { setSpecialty(sp); setShowSpecialtyPicker(false); }}
                          className="flex items-center w-full px-3 py-2 text-xs transition-all hover:bg-white/5 text-left"
                          style={{ color: specialty === sp ? "rgba(100,180,255,1)" : "rgba(255,255,255,0.65)", background: specialty === sp ? "rgba(100,180,255,0.08)" : "transparent" }}>
                          {sp}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>Filter by specialty</span>
              </div>
            )}

            {/* ── Mode pills row ── */}
            {!isProLocked && (() => {
              const categories: { icon: React.ElementType; label: string; mode: ChatMode; color?: string; pro?: boolean }[] = [
                { icon: Stethoscope,   label: "Diagnose",       mode: "normal",               color: "#60A5FA" },
                { icon: Brain,         label: "DDx Generator",  mode: "ddx",                  color: "#A78BFA" },
                { icon: Search,        label: "Research",       mode: "deep-research",        color: "#34D399" },
                { icon: ImagePlus,     label: "Image",          mode: "create-image",         color: "#F472B6" },
                { icon: Presentation,  label: "Slides",         mode: "create-presentation",  color: "#FBBF24" },
                { icon: Pill,          label: "Drug Inter.",    mode: "drug-interactions",    color: "#F87171" },
                { icon: Calculator,    label: "Dosage Calc",    mode: "dosage-calc",          color: "#FB923C" },
                { icon: TestTube2,     label: "Lab Values",     mode: "lab-values",           color: "#4ADE80" },
                { icon: ClipboardList, label: "SOAP Note",      mode: "soap-note",            color: "#38BDF8" },
                { icon: HelpCircle,    label: "MCQ / Exam",     mode: "mcq-gen",              color: "#C084FC" },
                { icon: Languages,     label: "Patient Edu",    mode: "patient-edu",          color: "#FB7185" },
                { icon: Zap,           label: "Procedure",      mode: "procedure-guide",      color: "#FDE047" },
                { icon: Microscope,    label: "Scan Analysis",  mode: "image-analysis",       color: "#2DD4BF", pro: true },
              ];
              const maxStart = Math.max(0, categories.length - 4);
              const visible = categories.slice(categoryIndex, categoryIndex + 4);
              return (
                <div className="w-full max-w-2xl flex items-center gap-2 mb-5 justify-center">
                  <button onClick={() => setCategoryIndex(i => Math.max(0, i - 1))}
                    disabled={categoryIndex === 0}
                    className="p-1.5 rounded-lg transition-all disabled:opacity-20"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {visible.map(({ icon: Icon, label, mode, color, pro: isPro }) => {
                    const isActive = chatMode === mode;
                    return (
                      <button key={label}
                        onClick={() => { if (isPro) { setShowProModal(true); return; } toggleMode(mode); }}
                        className="relative flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-medium transition-all hover:bg-white/8 min-w-[72px]"
                        style={{
                          background: isActive ? `${color}18` : "rgba(255,255,255,0.04)",
                          border: isActive ? `1px solid ${color}40` : "1px solid rgba(255,255,255,0.07)",
                          color: isActive ? color : "rgba(255,255,255,0.55)",
                        }}>
                        {isPro && <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold px-1 py-0.5 rounded-full" style={{ background: "rgba(109,40,217,0.85)", color: "#c4b5fd" }}>PRO</span>}
                        <Icon className="w-5 h-5" style={{ color: isActive ? color : undefined }} />
                        {label}
                      </button>
                    );
                  })}
                  <button onClick={() => setCategoryIndex(i => Math.min(maxStart, i + 1))}
                    disabled={categoryIndex >= maxStart}
                    className="p-1.5 rounded-lg transition-all disabled:opacity-20"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })()}

            {/* Pinned prompts */}
            {!isProLocked && pinnedPrompts.length > 0 && (
              <div className="w-full max-w-2xl mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5" style={{ color: "rgba(251,191,36,0.7)" }} />
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Pinned Prompts</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pinnedPrompts.map((q) => (
                    <div key={q} className="flex items-center gap-1">
                      <button type="button" onClick={() => setInput(q)}
                        className="text-xs px-3 py-1.5 rounded-full transition-all hover:bg-white/8"
                        style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "rgba(253,211,77,0.85)" }}>
                        {q}
                      </button>
                      <button type="button" onClick={() => handleTogglePin(q)}
                        className="p-0.5 rounded hover:bg-white/5"
                        style={{ color: "rgba(251,191,36,0.5)" }} title="Unpin">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Try an example prompt */}
            {!isProLocked && (
              <>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>Try an example prompt</span>
                  <button className="p-1 rounded transition-all hover:bg-white/5" style={{ color: "rgba(255,255,255,0.38)" }}>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {quickSuggestions[activeModel].map((q) => (
                    <div key={q} className="flex items-center group relative">
                      <button type="button" onClick={() => sendDirect(q)}
                        className="text-sm px-4 py-2 rounded-full transition-all hover:bg-white/8 pr-8"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.55)" }}>
                        {q}
                      </button>
                      <button type="button" onClick={() => handleTogglePin(q)}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        title={pinnedPrompts.includes(q) ? "Unpin" : "Pin prompt"}
                        style={{ color: pinnedPrompts.includes(q) ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.4)" }}>
                        <Tag className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Pro locked message */}
            {isProLocked && (
              <div className="max-w-md text-center px-4 mb-8">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Crown className="w-6 h-6" style={{ color: "rgba(255,255,255,0.6)" }} />
                </div>
                <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{modelGreetings.nova46}</p>
                <button onClick={() => setShowProModal(true)}
                  className="mt-4 flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl font-bold text-sm"
                  style={{ background: "rgba(255,255,255,0.9)", color: "#111" }}>
                  <Crown className="w-4 h-4" /> {tr.upgradePro}
                </button>
              </div>
            )}

            {/* Your recent chats */}
            {sessions.some(s => s.messages.length > 0) && (
              <div className="w-full max-w-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>Your recent chats</span>
                  <button onClick={() => setSidebarView("chats")}
                    className="text-sm flex items-center gap-1 transition-all hover:opacity-80"
                    style={{ color: "rgba(255,255,255,0.4)" }}>
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {sessions.filter(s => s.messages.length > 0).slice(0, 4).map((sess) => {
                    const sm = MODELS.find((m) => m.id === sess.modelId)!;
                    const SMIcon = sm?.icon ?? Activity;
                    return (
                      <div key={sess.id}
                        role="button" tabIndex={0}
                        onClick={() => setActiveSessionId(sess.id)}
                        onKeyDown={(e) => e.key === "Enter" && setActiveSessionId(sess.id)}
                        className="p-4 rounded-xl cursor-pointer transition-all hover:bg-white/6"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: "rgba(255,255,255,0.06)" }}>
                            <SMIcon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate" style={{ color: "rgba(255,255,255,0.75)" }}>{sess.title}</p>
                            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{sm?.name} {sm?.version}</p>
                          </div>
                        </div>
                        {sess.messages[0] && (
                          <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                            {sess.messages[0].content.slice(0, 60)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CHAT VIEW (has messages) ── */}
        {hasMessages && (
          <>
            {/* Chat topbar */}
            <div className="shrink-0 flex items-center gap-2 px-3 py-2"
              style={{ background: "var(--sp-topbar-bg)", borderBottom: "1px solid var(--sp-topbar-border)" }}>
              <button onClick={() => setSidebarOpen((v) => !v)}
                className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: "rgba(255,255,255,0.4)" }}>
                <PanelLeft className="w-5 h-5" />
              </button>
              <div className="w-px h-4 mx-0.5" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="flex items-center gap-1.5 flex-1">
                <ModelIcon className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} />
                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {model.name} {model.version}
                </span>
              </div>
              <button onClick={handleNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/5"
                style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <Plus className="w-3 h-3" />
                New chat
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5 min-h-full">

                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex gap-3",
                      msg.role === ChatMessageRole.user
                        ? "self-end flex-row-reverse max-w-[85%]"
                        : "self-start max-w-[92%] w-full"
                    )}
                    style={{ animation: "tw-bubble-in 0.28s ease-out both", animationDelay: `${isMsgNew(idx) ? 0 : 0}ms` }}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                      msg.role === ChatMessageRole.user
                        ? "overflow-hidden"
                        : "overflow-hidden"
                    )}
                      style={msg.role === ChatMessageRole.user
                        ? { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }
                        : undefined}
                    >
                      {msg.role === ChatMessageRole.user
                        ? <User className="w-4 h-4" style={{ color: "rgba(255,255,255,0.75)" }} />
                        : <CadusLogo size="sm" thinking={false} baseUrl={import.meta.env.BASE_URL} />
                      }
                    </div>

                    {/* Bubble */}
                    <div
                      className={cn("rounded-2xl shadow-sm overflow-hidden",
                        msg.role === ChatMessageRole.user ? "rounded-tr-sm" : "rounded-tl-sm"
                      )}
                      style={msg.role === ChatMessageRole.user
                        ? { background: "var(--sp-user-bubble-bg)", border: "1px solid var(--sp-user-bubble-border)", color: "var(--sp-user-text)", backdropFilter: "blur(12px)" }
                        : { background: "var(--sp-ai-bubble-bg)", border: "1px solid var(--sp-ai-bubble-border)", color: "var(--sp-ai-text)", backdropFilter: "blur(12px)" }
                      }
                    >
                      {!(msg as ExtendedMessage).isDeepResearch && !(msg as ExtendedMessage).isPresentation && !(msg as ExtendedMessage).slideCountOptions && !(msg as ExtendedMessage).imageUrl && !(msg as ExtendedMessage).isImageTypeSelection && msg.content && (
                        <div>
                          <div className="px-5 py-4 text-[14px] leading-relaxed">
                            <TypewriterText
                              text={msg.content}
                              isNew={isMsgNew(idx)}
                              onDone={() => markMsgSeen(idx)}
                              onScroll={scrollToBottom}
                            />
                          </div>
                          {msg.role === ChatMessageRole.assistant && (
                            <div className="flex items-center gap-2 px-4 pb-3">
                              <button type="button"
                                onClick={() => navigator.clipboard.writeText(msg.content)}
                                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-all hover:bg-white/8"
                                style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <RefreshCw className="w-3 h-3" /> Copy
                              </button>
                              <button type="button"
                                onClick={() => handleDownloadPdf(msg.content, String(idx))}
                                disabled={isExportingPdf === String(idx)}
                                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-all hover:bg-white/8"
                                style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                {isExportingPdf === String(idx) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                {isExportingPdf === String(idx) ? "Generating..." : "Export PDF"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {(msg as ExtendedMessage).isDeepResearch && (msg as ExtendedMessage).researchReport && (
                        <div>
                          <ResearchReportCard
                            report={(msg as ExtendedMessage).researchReport!}
                            sources={(msg as ExtendedMessage).researchSources ?? []}
                            queries={(msg as ExtendedMessage).researchQueries ?? []}
                            hasGoogleSearch={(msg as ExtendedMessage).hasGoogleSearch ?? false}
                          />
                          <div className="flex items-center gap-2 px-4 py-3">
                            <button type="button"
                              onClick={() => navigator.clipboard.writeText((msg as ExtendedMessage).researchReport!)}
                              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-all hover:bg-white/8"
                              style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
                              <RefreshCw className="w-3 h-3" /> Copy Report
                            </button>
                            <button type="button"
                              onClick={() => handleDownloadPdf((msg as ExtendedMessage).researchReport!, String(idx))}
                              disabled={isExportingPdf === String(idx)}
                              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-all hover:bg-white/8"
                              style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
                              {isExportingPdf === String(idx) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                              {isExportingPdf === String(idx) ? "Generating..." : "Export PDF"}
                            </button>
                          </div>
                        </div>
                      )}
                      {(msg as ExtendedMessage).imageUrl && (
                        <div className="px-4 pb-4 pt-2">
                          {msg.content && <div className="px-1 pb-3 text-[14px]">{msg.content}</div>}
                          <ImageMessageCard
                            imageUrl={(msg as ExtendedMessage).imageUrl!}
                            prompt={pendingImagePrompt || "anatomical illustration"}
                            onZoom={setZoomedImageUrl}
                            downloadLabel={tr.downloadImage}
                          />
                        </div>
                      )}
                      {(msg as ExtendedMessage).isImageTypeSelection && (
                        <div className="px-4 pb-4 pt-2">
                          {msg.content && <div className="px-1 pb-3 text-[14px]">{msg.content}</div>}
                          <div className="flex flex-wrap gap-2.5">
                            {/* Simple Image */}
                            <button type="button" onClick={() => handleImageTypeSelect("simple")}
                              disabled={isGeneratingImage}
                              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:scale-[1.03]"
                              style={{ background: "rgba(0,180,220,0.18)", border: "1px solid rgba(0,229,255,0.4)", color: "#00e5ff" }}>
                              <ImagePlus className="w-4 h-4" /> {tr.simpleImage}
                            </button>
                            {/* Diagram */}
                            <button type="button" onClick={() => handleImageTypeSelect("diagram")}
                              disabled={isGeneratingImage}
                              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:scale-[1.03]"
                              style={{ background: "rgba(130,0,220,0.18)", border: "1px solid rgba(168,85,247,0.5)", color: "#c084fc" }}>
                              <Tag className="w-4 h-4" /> {tr.diagram ?? "Diagram"}
                            </button>
                            {/* Real Image */}
                            <button type="button" onClick={() => handleImageTypeSelect("real")}
                              disabled={isGeneratingImage}
                              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:scale-[1.03]"
                              style={{ background: "rgba(20,160,80,0.18)", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399" }}>
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"/><path d="M6.3 6.3A8 8 0 1 0 17.7 17.7"/><path d="M6 2v4h4"/><path d="M18 22v-4h-4"/>
                              </svg>
                              {tr.realImage ?? "Real Image"}
                            </button>
                            {/* Real Image + Labels */}
                            <button type="button" onClick={() => handleImageTypeSelect("real-labeled")}
                              disabled={isGeneratingImage}
                              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:scale-[1.03]"
                              style={{ background: "rgba(220,120,0,0.18)", border: "1px solid rgba(251,146,60,0.45)", color: "#fb923c" }}>
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h4M7 11h2"/>
                              </svg>
                              {tr.realImageLabeled ?? "Real Image + Labels"}
                            </button>
                          </div>
                        </div>
                      )}
                      {(msg as ExtendedMessage).isResearchTypeSelection && (
                        <div className="px-4 pb-4 pt-2">
                          {msg.content && <div className="px-1 pb-3 text-[14px]">{msg.content}</div>}
                          <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => handleResearchTypeSelect("quick")}
                              disabled={isGeneratingResearch}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                              style={{ background: "rgba(0,180,100,0.18)", border: "1px solid rgba(52,211,153,0.45)", color: "#34D399" }}>
                              <Search className="w-4 h-4" /> {tr.quickSummary ?? "Quick Summary"}
                            </button>
                            <button type="button" onClick={() => handleResearchTypeSelect("full")}
                              disabled={isGeneratingResearch}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                              style={{ background: "rgba(130,0,220,0.18)", border: "1px solid rgba(168,85,247,0.5)", color: "#c084fc" }}>
                              <Microscope className="w-4 h-4" /> {tr.fullDeepResearch ?? "Full Deep Research"}
                            </button>
                          </div>
                        </div>
                      )}
                      {(msg as ExtendedMessage).slideCountOptions && (
                        <div className="px-4 pb-4 pt-2">
                          {msg.content && <div className="px-1 pb-3 text-[14px]">{msg.content}</div>}
                          <div className="flex flex-wrap gap-2">
                            {(msg as ExtendedMessage).slideCountOptions!.map((n) => (
                              <button key={n} type="button" onClick={() => handleSlideCountSelect(n)}
                                disabled={isGeneratingPresentation}
                                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                                style={{ background: "rgba(180,120,0,0.25)", border: "1px solid rgba(251,191,36,0.4)", color: "#fcd34d" }}>
                                {n} {tr.slides}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {(msg as ExtendedMessage).isPresentation && (
                        <div className="px-4 pb-4 pt-2">
                          {msg.content && <div className="px-1 pb-3 text-[14px]">{msg.content}</div>}
                          <div className="flex flex-wrap gap-2">
                            {(msg as ExtendedMessage).presentationData && (
                              <button type="button"
                                onClick={() => setActivePresentationData((msg as ExtendedMessage).presentationData as any)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                style={{ background: "rgba(16,185,129,0.25)", border: "1px solid rgba(52,211,153,0.4)", color: "#34d399" }}>
                                <PlayCircle className="w-4 h-4" /> {tr.openPresentation}
                              </button>
                            )}
                            {(msg as ExtendedMessage).presentationPdfBase64 && (
                              <a href={`data:application/pdf;base64,${(msg as ExtendedMessage).presentationPdfBase64}`}
                                download={`${(msg as ExtendedMessage).presentationTitle ?? "presentation"}.pdf`}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                style={{ background: "rgba(220,38,38,0.2)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
                                <Download className="w-4 h-4" /> PDF
                              </a>
                            )}
                            {(msg as ExtendedMessage).presentationDocxBase64 && (
                              <a href={`data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${(msg as ExtendedMessage).presentationDocxBase64}`}
                                download={`${(msg as ExtendedMessage).presentationTitle ?? "presentation"}.pptx`}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa" }}>
                                <Download className="w-4 h-4" /> PPTX
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Image generating animation */}
                {isGeneratingImage && (
                  <div className="flex gap-3 self-start max-w-[92%]">
                    <div className="w-8 h-8 shrink-0 mt-1">
                      <CadusLogo size="sm" thinking baseUrl={import.meta.env.BASE_URL} />
                    </div>
                    <ImageGeneratingAnimation prompt={pendingImagePrompt} />
                  </div>
                )}

                {/* Typing indicator */}
                {(chatMutation.isPending || isGeneratingResearch) && (
                  <div className="flex gap-3 self-start max-w-[92%]" style={{ animation: "tw-bubble-in 0.22s ease-out both" }}>
                    <div className="shrink-0 mt-0.5" style={{ width: 38, height: 38 }}>
                      <CadusLogo size="sm" thinking baseUrl={import.meta.env.BASE_URL} />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-3"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(0,194,168,0.18)",
                        boxShadow: "0 0 18px rgba(0,194,168,0.06), 0 0 32px rgba(168,85,247,0.04)",
                      }}>
                      {isGeneratingResearch ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" style={{ color: "rgba(0,194,168,0.7)" }} />
                          <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{tr.researching}</span>
                        </>
                      ) : (
                        <>
                          {[0, 1, 2].map(i => (
                            <span
                              key={i}
                              className="rounded-full"
                              style={{
                                width: 7, height: 7,
                                background: i === 0
                                  ? "rgba(0,194,168,0.85)"
                                  : i === 1 ? "rgba(100,160,240,0.75)" : "rgba(168,85,247,0.7)",
                                animation: "tw-dot-bounce 1.2s ease-in-out infinite",
                                animationDelay: `${i * 0.18}s`,
                                boxShadow: i === 0
                                  ? "0 0 6px rgba(0,194,168,0.5)"
                                  : i === 2 ? "0 0 6px rgba(168,85,247,0.4)" : undefined,
                              }}
                            />
                          ))}
                          <ThinkingTextRotator chatMode={chatMode} />
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Presentation building */}
                {isGeneratingPresentation && (
                  <div className="flex gap-3 self-start max-w-[95%] w-full">
                    <div className="w-8 h-8 shrink-0 mt-1">
                      <CadusLogo size="sm" thinking baseUrl={import.meta.env.BASE_URL} />
                    </div>
                    <div className="flex-1 min-w-0 rounded-2xl rounded-tl-sm overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="px-4 pt-3 pb-2 text-xs font-medium flex items-center gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "rgba(255,255,255,0.4)" }} />
                        {tr.buildingPresentation.replace("{n}", String(buildingSlideCount))}
                      </div>
                      <PresentationBuildingAnimation topic={buildingTopic} slideCount={buildingSlideCount} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ── Bottom input (chat view) ── */}
            <div className="shrink-0 px-4 pb-4 pt-2">
              <div className="max-w-3xl mx-auto">
                {isProLocked ? (
                  <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <Lock className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{tr.proRequired}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{tr.proGatedMsg}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowProModal(true)}
                      className="flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap"
                      style={{ background: "rgba(255,255,255,0.9)", color: "#111" }}>
                      <Crown className="w-4 h-4" /> {tr.upgradePro}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="rounded-2xl overflow-visible"
                    style={{ background: "var(--sp-input-bg)", border: "1px solid var(--sp-input-border)", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
                  >
                    {chatMode !== "normal" && (
                      <div className="flex items-center gap-2 px-4 py-2 border-b text-xs font-semibold"
                        style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.03)" }}>
                        {chatMode === "deep-research" ? <><Microscope className="w-3.5 h-3.5" /> {tr.deepResearchMode}</>
                          : chatMode === "create-presentation" ? <><Presentation className="w-3.5 h-3.5" /> {presentationStage === "idle" ? tr.presentationMode : tr.selectSlideCountAbove}</>
                          : <><ImagePlus className="w-3.5 h-3.5" /> {imageStage === "waiting-type" ? tr.selectSlideCountAbove : tr.imageMode}</>}
                        <button type="button" onClick={() => toggleMode(chatMode)} className="ml-auto hover:opacity-70">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {attachments.length > 0 && (
                      <div className="flex gap-2 px-4 pt-3 flex-wrap">
                        {attachments.map((a) => (
                          <div key={a.id} className="relative group flex items-center gap-2 rounded-xl px-3 py-2 text-xs max-w-[160px]"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}>
                            {a.type === "image" && a.previewUrl
                              ? <img src={a.previewUrl} alt={a.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                              : <FileText className="w-5 h-5 shrink-0" style={{ color: "rgba(255,255,255,0.5)" }} />}
                            <div className="min-w-0">
                              <p className="truncate font-medium leading-tight">{a.name}</p>
                              <p style={{ color: "rgba(255,255,255,0.3)" }}>{a.size}</p>
                            </div>
                            <button type="button" onClick={() => removeAttachment(a.id)}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full items-center justify-center hidden group-hover:flex"
                              style={{ background: "rgba(200,50,50,0.8)", color: "white" }}>
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
                      placeholder={
                        chatMode === "create-image" ? tr.describeImagePlaceholder
                          : chatMode === "deep-research" ? tr.researchTopicPlaceholder
                          : chatMode === "create-presentation" && presentationStage === "idle" ? tr.presentationTopicPlaceholder
                          : chatMode === "create-presentation" && presentationStage === "waiting-slide-count" ? tr.selectSlidesPlaceholder
                          : `${tr.messagePlaceholder} · ${model.name} ${model.version}...`
                      }
                      rows={1}
                      className="w-full px-5 pt-4 pb-2 text-base bg-transparent focus:outline-none resize-none cadus-textarea"
                      style={{ color: "var(--sp-textarea-color)", caretColor: "var(--sp-caret-color)", minHeight: "52px", maxHeight: "160px" }}
                      disabled={chatMutation.isPending || isGeneratingPresentation || presentationStage === "waiting-slide-count"}
                    />
                    <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">
                      <div className="flex items-center gap-1">
                        <div className="relative" ref={attachMenuRef}>
                          <button type="button" onClick={() => setShowAttachMenu((v) => !v)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={{ color: showAttachMenu ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}>
                            <Paperclip className="w-4 h-4" />
                            <span className="hidden sm:inline">{tr.attach}</span>
                          </button>
                          {showAttachMenu && (
                            <div className="absolute bottom-full left-0 mb-2 rounded-xl shadow-xl overflow-hidden w-52 z-30"
                              style={{ background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.1)" }}>
                              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.28)" }}>{tr.attach}</div>
                              {[
                                { label: tr.uploadImage, sub: tr.uploadImageFormats, icon: Image, action: () => imageInputRef.current?.click() },
                                { label: tr.uploadDocument, sub: tr.uploadDocumentFormats, icon: FileText, action: () => fileInputRef.current?.click() },
                                { label: tr.takePhoto, sub: tr.useCamera, icon: Camera, action: () => { setShowAttachMenu(false); setShowCamera(true); } },
                              ].map(({ label, sub, icon: Icon, action }) => (
                                <button key={label} type="button" onClick={action}
                                  className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors hover:bg-white/5"
                                  style={{ color: "rgba(255,255,255,0.75)" }}>
                                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <Icon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-semibold leading-tight">{label}</p>
                                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <button type="button" onClick={() => toggleMode("deep-research")}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={chatMode === "deep-research"
                            ? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" }
                            : { color: "rgba(255,255,255,0.4)" }}>
                          <Search className="w-4 h-4" />
                          <span className="hidden sm:inline">{tr.deepResearch}</span>
                        </button>
                        <button type="button" onClick={() => toggleMode("create-image")}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={chatMode === "create-image"
                            ? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" }
                            : { color: "rgba(255,255,255,0.4)" }}>
                          <ImagePlus className="w-4 h-4" />
                          <span className="hidden sm:inline">{tr.createImage}</span>
                        </button>
                        <button type="button" onClick={() => toggleMode("create-presentation")}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={chatMode === "create-presentation"
                            ? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" }
                            : { color: "rgba(255,255,255,0.4)" }}>
                          <Presentation className="w-4 h-4" />
                          <span className="hidden sm:inline">{tr.presentation}</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {model.name}
                        </span>
                        <button type="submit"
                          disabled={(!input.trim() && attachments.length === 0) || chatMutation.isPending || isGeneratingImage || isGeneratingPresentation || presentationStage === "waiting-slide-count" || imageStage === "waiting-type"}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                          style={{ background: "rgba(255,255,255,0.9)" }}>
                          <Send className="w-3.5 h-3.5 text-black" />
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                <p className="text-center text-[11px] mt-2" style={{ color: "rgba(255,255,255,0.18)" }}>
                  {tr.disclaimer}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Pricing Modal ── */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          onClick={() => setShowProModal(false)}>
          <div className="rounded-2xl shadow-2xl w-full overflow-hidden"
            style={{ maxWidth: 860, background: "rgba(8,10,28,0.98)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(32px)" }}
            onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="relative px-8 pt-7 pb-5 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={() => setShowProModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-white/6"
                style={{ color: "rgba(255,255,255,0.28)" }}>
                <X className="w-4 h-4" />
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-3"
                style={{ background: "rgba(139,92,246,0.14)", border: "1px solid rgba(139,92,246,0.22)", color: "#a78bfa" }}>
                <Crown className="w-3 h-3" /> Cadus AI Plans
              </div>
              <h2 className="text-[22px] font-bold mb-1" style={{ color: "rgba(225,235,255,0.95)" }}>Choose your plan</h2>
              <p className="text-sm" style={{ color: "rgba(140,160,210,0.6)" }}>Elevate your clinical practice with the right tier</p>
              {/* Billing toggle */}
              <div className="inline-flex items-center gap-1 mt-4 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <button onClick={() => setBillingPeriod("monthly")}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={billingPeriod === "monthly"
                    ? { background: "rgba(255,255,255,0.1)", color: "rgba(220,235,255,0.9)" }
                    : { color: "rgba(140,160,210,0.5)" }}>
                  Monthly
                </button>
                <button onClick={() => setBillingPeriod("yearly")}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={billingPeriod === "yearly"
                    ? { background: "rgba(255,255,255,0.1)", color: "rgba(220,235,255,0.9)" }
                    : { color: "rgba(140,160,210,0.5)" }}>
                  Yearly
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(16,185,129,0.2)", color: "#34d399" }}>Save 44%</span>
                </button>
              </div>
            </div>

            {/* Plan cards */}
            <div className="grid grid-cols-3 divide-x" style={{ divideColor: "rgba(255,255,255,0.06)" }}>

              {/* ── Cadus Minor (Free) ── */}
              {([
                {
                  name: "Cadus Minor", badge: null, badgeBg: "", badgeColor: "",
                  price: "Free", priceNote: "Forever free",
                  highlight: false,
                  desc: "For individuals getting started with medical AI.",
                  features: [
                    "20 queries per day",
                    "Basic diagnosis support",
                    "General medical Q&A",
                    "Standard response speed",
                    "Community access",
                  ],
                  cta: "Your current plan", ctaDisabled: true,
                  ctaBg: "rgba(255,255,255,0.06)", ctaColor: "rgba(180,200,240,0.5)", ctaBorder: "1px solid rgba(255,255,255,0.08)",
                },
                {
                  name: "Cadus Medius", badge: "Standard", badgeBg: "rgba(59,130,246,0.18)", badgeColor: "#93c5fd",
                  price: "Free", priceNote: "Always free",
                  highlight: false,
                  desc: "For students and everyday clinical practice.",
                  features: [
                    "50 queries per day",
                    "DDx Generator",
                    "Research summaries",
                    "Study Hub access",
                    "Faster response speed",
                  ],
                  cta: "Get started free", ctaDisabled: false,
                  ctaBg: "rgba(59,130,246,0.18)", ctaColor: "#93c5fd", ctaBorder: "1px solid rgba(59,130,246,0.3)",
                },
                {
                  name: "Cadus Magnus", badge: "Most Popular", badgeBg: "linear-gradient(90deg,#7c3aed,#9333ea)", badgeColor: "white",
                  price: billingPeriod === "monthly" ? "₹299" : "₹166",
                  priceNote: billingPeriod === "monthly" ? "/month" : "/month · billed ₹1,999/yr",
                  highlight: true,
                  desc: "For advanced clinical work and complex cases.",
                  features: [
                    "200 queries per day (Pro) / Unlimited (Max)",
                    "Cadus Magnus advanced reasoning model",
                    "Complex DDx & rare disease analysis",
                    "Deep Research with web augmentation",
                    "Medical image analysis",
                    "Multispecialty second opinion",
                    "PDF export & presentations",
                    "Priority support",
                  ],
                  cta: "Upgrade to Magnus", ctaDisabled: false,
                  ctaBg: "linear-gradient(to right,#7c3aed,#9333ea)", ctaColor: "white", ctaBorder: "none",
                },
              ] as Array<{
                name: string; badge: string|null; badgeBg: string; badgeColor: string;
                price: string; priceNote: string; highlight: boolean; desc: string;
                features: string[]; cta: string; ctaDisabled: boolean;
                ctaBg: string; ctaColor: string; ctaBorder: string;
              }>).map((plan) => (
                <div key={plan.name} className="relative flex flex-col px-6 py-6"
                  style={plan.highlight ? { background: "rgba(109,40,217,0.08)" } : {}}>
                  {plan.badge && (
                    <div className="inline-flex self-start items-center px-2.5 py-1 rounded-full text-[10px] font-bold mb-3"
                      style={{ background: plan.badgeBg, color: plan.badgeColor }}>
                      {plan.badge}
                    </div>
                  )}
                  {!plan.badge && <div className="h-7 mb-3" />}
                  <h3 className="text-base font-bold mb-0.5" style={{ color: plan.highlight ? "#c4b5fd" : "rgba(210,225,255,0.9)" }}>{plan.name}</h3>
                  <p className="text-[11px] mb-4" style={{ color: "rgba(130,155,210,0.6)" }}>{plan.desc}</p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-3xl font-extrabold" style={{ color: plan.highlight ? "#c4b5fd" : "rgba(210,225,255,0.9)" }}>{plan.price}</span>
                    {plan.price !== "Free" && <span className="text-xs mb-1.5" style={{ color: "rgba(130,155,210,0.55)" }}>{plan.priceNote}</span>}
                  </div>
                  {plan.price === "Free" && <p className="text-xs mb-5" style={{ color: "rgba(130,155,210,0.5)" }}>{plan.priceNote}</p>}
                  {plan.price !== "Free" && <p className="text-[10px] mb-5" style={{ color: "rgba(130,155,210,0.45)" }}>{plan.priceNote}</p>}
                  <button disabled={plan.ctaDisabled}
                    className="w-full py-2.5 rounded-xl text-xs font-bold transition-all mb-5 disabled:cursor-not-allowed"
                    style={{ background: plan.ctaBg, color: plan.ctaColor, border: plan.ctaBorder }}>
                    {plan.cta}
                  </button>
                  <div className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: plan.highlight ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.07)" }}>
                          <span className="text-[9px] font-bold" style={{ color: plan.highlight ? "#a78bfa" : "rgba(120,150,210,0.7)" }}>✓</span>
                        </div>
                        <span className="text-[11px] leading-relaxed" style={{ color: plan.highlight ? "rgba(200,185,255,0.8)" : "rgba(130,155,210,0.65)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="px-8 py-3 text-center text-[11px]" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "rgba(100,120,170,0.5)" }}>
              All plans include HIPAA-aligned privacy. Cancel anytime. Prices in Indian Rupees (INR).
            </div>
          </div>
        </div>
      )}


      {/* ── In-Browser Presentation Viewer ── */}
      {activePresentationData && (
        <PresentationViewer
          data={activePresentationData}
          pdfBase64={activePresentationData.pdfBase64}
          docxBase64={activePresentationData.docxBase64}
          onClose={() => setActivePresentationData(null)}
          initialIdx={Number(new URLSearchParams(window.location.search).get("slide") ?? 0) || 0}
        />
      )}

      {/* ── Camera Modal ── */}
      {showCamera && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* ── Image Zoom Modal ── */}
      {zoomedImageUrl && (
        <div
          role="dialog"
          aria-label="Zoomed image"
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
            animation: "tw-fade-in 0.18s ease-out",
          }}
          onClick={() => setZoomedImageUrl(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setZoomedImageUrl(null)}
            style={{
              position: "absolute", top: 20, right: 20,
              width: 40, height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.8)",
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            ×
          </button>
          <img
            src={zoomedImageUrl}
            alt="Zoomed medical illustration"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "92vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 16,
              boxShadow: "0 8px 60px rgba(0,194,168,0.25), 0 0 0 1px rgba(0,188,212,0.15)",
              animation: "cadus-img-fade-in 0.22s ease-out",
              cursor: "default",
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ── Rotating thinking text component ─────────────────────────────────── */
const THINKING_MESSAGES: Record<string, string[]> = {
  "create-image": [
    "Generating clinical illustration…",
    "Rendering anatomical diagram…",
    "Composing medical visual…",
    "Applying textbook-style detail…",
    "Finalising medical artwork…",
  ],
  "deep-research": [
    "Searching medical literature…",
    "Analysing clinical data…",
    "Cross-referencing guidelines…",
    "Compiling research report…",
    "Verifying evidence base…",
  ],
  "create-presentation": [
    "Building slide structure…",
    "Composing medical content…",
    "Designing clinical slides…",
    "Formatting presentation…",
    "Assembling slide deck…",
  ],
  default: [
    "Analysing symptoms…",
    "Processing medical data…",
    "Reviewing clinical guidelines…",
    "Consulting medical knowledge…",
    "Preparing response…",
  ],
};

function ThinkingTextRotator({ chatMode }: { chatMode: ChatMode }) {
  const messages = THINKING_MESSAGES[chatMode] ?? THINKING_MESSAGES.default;
  const [idx, setIdx] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx(i => (i + 1) % messages.length);
      setKey(k => k + 1);
    }, 2800);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <span
      key={key}
      style={{
        fontSize: 11,
        color: "rgba(255,255,255,0.35)",
        letterSpacing: "0.04em",
        marginLeft: 4,
        display: "inline-block",
        animation: "cadus-think-text-fade 2.8s ease-in-out forwards",
        minWidth: 170,
      }}
    >
      {messages[idx]}
    </span>
  );
}

/* ── Image message card with skeleton + fade-in + zoom ─────────────────── */
function ImageMessageCard({
  imageUrl, prompt, onZoom, downloadLabel,
}: {
  imageUrl: string;
  prompt: string;
  onZoom: (url: string) => void;
  downloadLabel: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ maxWidth: 420 }}>
      {/* Medical Anatomy Reference badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        marginBottom: 8,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "rgba(0,194,168,0.75)",
        textTransform: "uppercase",
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        Medical Anatomy Reference · Cadus AI
      </div>

      {/* Image wrapper */}
      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}>
        {/* Skeleton shown until image loads */}
        {!loaded && (
          <div style={{
            width: "100%",
            paddingBottom: "75%",
            background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(0,194,168,0.07) 50%, rgba(255,255,255,0.04) 100%)",
            backgroundSize: "800px 100%",
            animation: "cadus-skeleton-shimmer 1.5s linear infinite",
            borderRadius: 14,
          }} />
        )}

        {/* Actual image */}
        <img
          src={imageUrl}
          alt="Cadus AI medical illustration"
          onLoad={() => setLoaded(true)}
          style={{
            display: loaded ? "block" : "none",
            width: "100%",
            borderRadius: 14,
            objectFit: "contain",
            maxHeight: 480,
            border: "1px solid rgba(0,188,212,0.2)",
            animation: loaded ? "cadus-img-fade-in 0.35s ease-out" : undefined,
          }}
        />

        {/* Zoom button (top-right overlay) */}
        {loaded && (
          <button
            type="button"
            title="View full size"
            onClick={() => onZoom(imageUrl)}
            style={{
              position: "absolute", top: 10, right: 10,
              width: 32, height: 32,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(0,194,168,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "zoom-in",
              backdropFilter: "blur(6px)",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,194,168,0.25)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.55)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,194,168,0.9)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <path d="M11 8v6M8 11h6"/>
            </svg>
          </button>
        )}
      </div>

      {/* Caption / AI note */}
      {loaded && (
        <div style={{
          marginTop: 8,
          padding: "8px 10px",
          borderRadius: 8,
          background: "rgba(0,194,168,0.06)",
          border: "1px solid rgba(0,194,168,0.12)",
          fontSize: 11,
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.5,
        }}>
          <span style={{ color: "rgba(0,194,168,0.7)", fontWeight: 600 }}>Note: </span>
          This is an educational medical illustration. For any symptoms or clinical decisions, always consult a licensed doctor.
        </div>
      )}

      {/* Download link */}
      <a
        href={imageUrl}
        download="cadus-medical-illustration.png"
        target="_blank"
        rel="noreferrer"
        style={{
          marginTop: 8,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11,
          fontWeight: 600,
          color: "#00E5FF",
          textDecoration: "none",
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
      >
        <Download className="w-3 h-3" /> {downloadLabel}
      </a>
    </div>
  );
}

/* Deep-ocean particles config */
const OCEAN_PARTICLES = [
  { x: 12, y: 85, r: 2.2, delay: 0,    dur: 5.5, kind: 1 },
  { x: 28, y: 78, r: 1.5, delay: 0.8,  dur: 7.2, kind: 2 },
  { x: 42, y: 90, r: 3.0, delay: 1.6,  dur: 4.8, kind: 1 },
  { x: 58, y: 82, r: 1.8, delay: 0.4,  dur: 6.3, kind: 2 },
  { x: 70, y: 88, r: 2.5, delay: 2.1,  dur: 5.9, kind: 1 },
  { x: 84, y: 76, r: 1.4, delay: 1.2,  dur: 8.0, kind: 2 },
  { x: 20, y: 70, r: 2.0, delay: 3.0,  dur: 6.8, kind: 1 },
  { x: 50, y: 95, r: 1.6, delay: 0.2,  dur: 5.2, kind: 2 },
  { x: 65, y: 72, r: 2.8, delay: 1.9,  dur: 7.5, kind: 1 },
  { x: 88, y: 91, r: 1.3, delay: 2.5,  dur: 6.1, kind: 2 },
  { x: 35, y: 65, r: 1.9, delay: 0.7,  dur: 9.0, kind: 1 },
  { x: 75, y: 60, r: 2.3, delay: 3.5,  dur: 7.8, kind: 2 },
];

/* Sunlight rays config */
const OCEAN_RAYS = [
  { left: "8%",  width: 44, rot: -12, delay: 0,   dur: 6 },
  { left: "22%", width: 30, rot: -4,  delay: 1.2, dur: 8 },
  { left: "38%", width: 55, rot: 2,   delay: 0.5, dur: 7 },
  { left: "54%", width: 28, rot: 8,   delay: 2.1, dur: 9 },
  { left: "68%", width: 40, rot: -6,  delay: 0.9, dur: 6.5 },
  { left: "82%", width: 22, rot: 14,  delay: 1.7, dur: 7.5 },
];

function ImageGeneratingAnimation({ prompt }: { prompt: string }) {
  return (
    <div style={{ width: "320px" }}>
      {/* ── Ocean scene container ── */}
      <div style={{
        position: "relative",
        width: "100%",
        paddingBottom: "100%",
        borderRadius: "18px",
        overflow: "hidden",
        background: "linear-gradient(180deg, #020c1b 0%, #011528 30%, #010d1f 65%, #000a15 100%)",
      }}>

        {/* ── Sunlight rays from surface ── */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {OCEAN_RAYS.map((r, i) => (
            <div key={i} style={{
              position: "absolute",
              left: r.left,
              top: "-10%",
              width: r.width,
              height: "130%",
              background: "linear-gradient(180deg, rgba(100,200,255,0.22) 0%, rgba(50,150,220,0.08) 60%, transparent 100%)",
              transformOrigin: "top center",
              transform: `rotate(${r.rot}deg)`,
              animation: `${i % 2 === 0 ? "ocean-ray-sway" : "ocean-ray-sway2"} ${r.dur}s ease-in-out ${r.delay}s infinite`,
              filter: "blur(8px)",
            }} />
          ))}
        </div>

        {/* ── Subtle AI grid overlay ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(rgba(0,160,220,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,160,220,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
          pointerEvents: "none",
        }} />

        {/* ── Water caustics shimmer ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 120px 60px at 30% 20%, rgba(0,180,240,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 90px 45px  at 72% 15%, rgba(0,150,220,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 70px 35px  at 55% 35%, rgba(0,200,255,0.04) 0%, transparent 70%)
          `,
          animation: "ocean-depth-drift 5s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* ── Floating particles / plankton ── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {OCEAN_PARTICLES.map((p, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: "50%",
              background: p.kind === 1
                ? `radial-gradient(circle, rgba(0,220,255,0.95) 0%, rgba(0,160,220,0.4) 70%)`
                : `radial-gradient(circle, rgba(120,220,255,0.8) 0%, rgba(80,180,240,0.3) 70%)`,
              boxShadow: p.kind === 1
                ? `0 0 ${p.r * 3}px rgba(0,220,255,0.65)`
                : `0 0 ${p.r * 2.5}px rgba(100,200,255,0.5)`,
              animation: `${p.kind === 1 ? "ocean-bubble-rise" : "ocean-bubble-drift"} ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }} />
          ))}
        </div>

        {/* ── Depth vignette ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 40%, rgba(0,5,16,0.55) 100%)",
          pointerEvents: "none",
        }} />

        {/* ── Glassmorphism center card ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            width: "192px",
            padding: "22px 20px 20px",
            borderRadius: "18px",
            background: "rgba(2, 18, 38, 0.62)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(0, 180, 230, 0.18)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            animation: "ocean-card-glow 3s ease-in-out infinite",
          }}>

            {/* Circular progress loader */}
            <div style={{
              position: "relative",
              width: "68px",
              height: "68px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {/* Outer ring */}
              <div style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid rgba(0,180,230,0.12)",
                borderTop: "2.5px solid #00d4ff",
                borderRight: "2.5px solid rgba(0,200,255,0.4)",
                animation: "ocean-ring-rotate 1.4s linear infinite",
                boxShadow: "0 0 12px rgba(0,212,255,0.4)",
              }} />
              {/* Middle ring */}
              <div style={{
                position: "absolute",
                inset: "10px",
                borderRadius: "50%",
                border: "1.5px solid rgba(0,160,220,0.08)",
                borderBottom: "2px solid rgba(0,180,240,0.55)",
                borderLeft: "2px solid rgba(0,160,230,0.3)",
                animation: "ocean-ring-rotate 2.2s linear infinite reverse",
              }} />
              {/* Inner pulsing orb */}
              <div style={{
                position: "absolute",
                inset: "20px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,200,255,0.35) 0%, rgba(0,130,200,0.08) 100%)",
                animation: "ocean-ring-glow 2s ease-in-out infinite",
              }} />
              {/* Icon */}
              <div style={{ position: "relative", zIndex: 2, animation: "ocean-icon-pulse 2s ease-in-out infinite" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,210,255,0.85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2.5" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(0,210,255,0.5)" stroke="none" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
              <span style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "rgba(0,220,255,0.92)",
                animation: "ocean-text-breathe 2s ease-in-out infinite",
                textShadow: "0 0 10px rgba(0,200,255,0.4)",
              }}>
                GENERATING IMAGE
              </span>
              <span style={{
                fontSize: "9.5px",
                color: "rgba(140,210,255,0.5)",
                letterSpacing: "0.06em",
                animation: "ocean-text-breathe 2s ease-in-out 0.4s infinite",
              }}>
                Cadus AI  •  Processing…
              </span>

              {/* Progress dots */}
              <div style={{ display: "flex", gap: "5px", marginTop: "4px" }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: `rgba(0,${180 + i * 18},${220 + i * 10},0.9)`,
                    boxShadow: `0 0 6px rgba(0,200,255,0.6)`,
                    animation: `ocean-text-breathe 1s ease-in-out ${i * 0.22}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Surface highlight (top edge glow) ── */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "3px",
          background: "linear-gradient(90deg, transparent 0%, rgba(0,180,240,0.5) 40%, rgba(0,210,255,0.7) 50%, rgba(0,180,240,0.5) 60%, transparent 100%)",
          animation: "ocean-text-breathe 3s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* ── Bottom depth fade ── */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "70px",
          background: "linear-gradient(transparent, rgba(0,5,15,0.75))",
          pointerEvents: "none",
        }} />
      </div>

      {/* ── Prompt label below card ── */}
      <div style={{
        marginTop: "10px",
        fontSize: "10.5px",
        color: "rgba(0,190,230,0.4)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        letterSpacing: "0.03em",
        fontWeight: 500,
        paddingLeft: "2px",
      }}>
        {prompt.length > 55 ? prompt.substring(0, 55) + "…" : prompt}
      </div>
    </div>
  );
}

function PresentationBuildingAnimation({ topic, slideCount }: { topic: string; slideCount: number }) {
  const [lines, setLines] = useState<string[]>([]);
  const topicShort = topic.substring(0, 36);

  useEffect(() => {
    const phases = [
      `> analyzing topic: "${topicShort}"`,
      `> initializing ${slideCount}-slide structure...`,
      `{`,
      `  "title": "${topicShort}",`,
      `  "subtitle": "Comprehensive Medical Guide",`,
      `  "slides": [`,
      `    { "slideNumber": 1, "title": "Introduction",`,
      `      "bullets": ["Definition...", "Epidemiology...", "Etiology..."],`,
      `      "keyFact": "High-yield clinical statistic...", }`,
      `    { "slideNumber": 2, "title": "Anatomy & Physiology",`,
      `      "bullets": ["Gross anatomy...", "Histology...", "Blood supply..."], }`,
      `    { "slideNumber": 3, "title": "Pathophysiology",`,
      `      "bullets": ["Molecular mechanism...", "Cellular changes..."], }`,
      `    ... composing ${Math.max(slideCount - 3, 1)} more slides ...`,
      `  ]`,
      `}`,
      `> drawing ${slideCount} diagrams...`,
      `> rendering slide layouts...`,
      `> compiling PDF with pdf-lib...`,
      `> encoding DOCX document...`,
      `> finalizing download package...`,
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLines((prev) => { const next = [...prev, phases[i % phases.length]]; return next.slice(-16); });
      i++;
      if (i >= phases.length) i = Math.max(phases.length - 10, 6);
    }, 155);
    return () => clearInterval(interval);
  }, [topicShort, topic, slideCount]);

  return (
    <div className="font-mono text-xs overflow-hidden" style={{ background: "#0d1117", borderTop: "1px solid rgba(0,188,212,0.2)" }}>
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b" style={{ background: "#161b22", borderColor: "rgba(100,200,255,0.1)" }}>
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-1.5 text-[10px] text-slate-400 font-sans">cadus_presentation_builder.json</span>
      </div>
      <div className="px-4 py-3 space-y-0.5 min-h-[160px] max-h-[220px] overflow-hidden">
        {lines.map((line, i) => (
          <div key={i} className={cn("leading-[18px] whitespace-pre",
            line.startsWith(">") ? "text-emerald-400"
            : line.includes('"title"') || line.includes('"subtitle"') ? "text-amber-300"
            : line.includes('"bullets"') || line.includes('"mindMap"') ? "text-sky-300"
            : line.includes('"keyFact"') ? "text-violet-300"
            : line.startsWith("    ...") ? "text-slate-500 italic"
            : line === "{" || line === "}" || line === "  ]" ? "text-slate-400"
            : "text-slate-300")}>
            {line}{i === lines.length - 1 && <span className="animate-pulse text-emerald-400 ml-0.5">█</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

## `artifacts/cadus-ai/src/pages/not-found.tsx` (21 lines)
```tsx
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

```

---

## `artifacts/cadus-ai/tsconfig.json` (22 lines)
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build", "dist", "**/*.test.ts"],
  "compilerOptions": {
    "noEmit": true,
    "jsx": "preserve",
    "lib": ["esnext", "dom", "dom.iterable"],
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "moduleResolution": "bundler",
    "types": ["node", "vite/client"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "references": [
    {
      "path": "../../lib/api-client-react"
    }
  ]
}

```

---

## `artifacts/cadus-ai/vite.config.ts` (75 lines)
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});

```

---

