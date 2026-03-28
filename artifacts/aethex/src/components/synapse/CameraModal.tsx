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
      const file = new File([blob], `synapse-photo-${Date.now()}.jpg`, { type: "image/jpeg" });
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
