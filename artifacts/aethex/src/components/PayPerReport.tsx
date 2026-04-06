import { useState } from "react";
import { FileText, Download, CreditCard, X, CheckCircle, Loader2 } from "lucide-react";
import { useUserAuth } from "@/hooks/use-user-auth";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void };
  }
}

export interface ReportPayload {
  reportType: "drug-interaction" | "clinical-summary";
  reportData: Record<string, unknown>;
  description: string;
}

interface PayPerReportProps {
  payload: ReportPayload;
  price?: number;
  onClose?: () => void;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (document.getElementById("razorpay-js")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = "razorpay-js";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

type Status = "idle" | "creating" | "paying" | "generating" | "done" | "error";

export function PayPerReport({ payload, price = 29, onClose }: PayPerReportProps) {
  const { user } = useUserAuth();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  const handlePay = async () => {
    setStatus("creating");
    setErrorMsg("");

    const scriptLoaded = await loadRazorpayScript();

    const orderRes = await fetch(`${API_BASE}/api/monetization/report/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: price, reportType: payload.reportType }),
    });
    const orderData = await orderRes.json() as { orderId?: string; keyId?: string; error?: string };

    if (!orderRes.ok || !orderData.orderId) {
      if (orderData.error === "Razorpay not configured") {
        setDemoMode(true);
        setStatus("idle");
      } else {
        setErrorMsg(orderData.error ?? "Failed to create payment order");
        setStatus("error");
      }
      return;
    }

    if (!scriptLoaded || !window.Razorpay) {
      setErrorMsg("Payment SDK failed to load. Please check your connection.");
      setStatus("error");
      return;
    }

    setStatus("paying");

    const options = {
      key: orderData.keyId,
      amount: price * 100,
      currency: "INR",
      name: "AETHEX Medical Platform",
      description: payload.description,
      order_id: orderData.orderId,
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        setStatus("generating");
        const pdfRes = await fetch(`${API_BASE}/api/monetization/report/verify-and-generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            reportType: payload.reportType,
            reportData: payload.reportData,
            userEmail: user?.email ?? "",
          }),
        });
        if (!pdfRes.ok) { setErrorMsg("PDF generation failed. Contact support."); setStatus("error"); return; }
        const blob = await pdfRes.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${payload.reportType}-report.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        setStatus("done");
      },
      prefill: { email: user?.email ?? "", name: user?.name ?? "" },
      theme: { color: "#00C2A8" },
      modal: { ondismiss: () => setStatus("idle") },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleDemo = async () => {
    setStatus("generating");
    const res = await fetch(`${API_BASE}/api/monetization/report/verify-and-generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpayOrderId: `demo_${Date.now()}`,
        razorpayPaymentId: `demo_pay_${Date.now()}`,
        razorpaySignature: "demo_sig",
        reportType: payload.reportType,
        reportData: payload.reportData,
        userEmail: user?.email ?? "demo@aethex.in",
      }),
    });
    if (!res.ok) { setErrorMsg("PDF generation failed."); setStatus("error"); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${payload.reportType}-report.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("done");
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg,#0a1223 0%,#0d2142 60%,#0a3060 100%)",
          border: "1px solid rgba(0,194,168,0.2)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(0,194,168,0.12) 0%,transparent 60%)" }} />
        {onClose && (
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="relative p-7">
          {status === "done" ? (
            <div className="text-center py-6">
              <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color: "#00C2A8" }} />
              <h3 className="text-xl font-bold text-white mb-2">Report Downloaded!</h3>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>Your PDF report has been saved to your device.</p>
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white" style={{ background: "#00C2A8" }}>Done</button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: "linear-gradient(135deg,rgba(0,194,168,0.3),rgba(0,122,255,0.3))", border: "1px solid rgba(0,194,168,0.3)" }}>
                  <FileText className="w-7 h-7" style={{ color: "#00C2A8" }} />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Generate PDF Report</h2>
                <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.5)" }}>{payload.description}</p>
              </div>

              <div className="rounded-2xl p-4 mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Report fee</span>
                  <span className="text-2xl font-bold text-white">₹{price}</span>
                </div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>One-time · No subscription required</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-4 h-4 rounded" style={{ background: "rgba(0,194,168,0.2)" }}>
                    <Download className="w-2.5 h-2.5 m-0.5" style={{ color: "#00C2A8" }} />
                  </div>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>PDF downloads instantly after payment</span>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-center mb-3 px-2" style={{ color: "#f87171" }}>{errorMsg}</p>
              )}

              {demoMode ? (
                <div className="space-y-3">
                  <div className="rounded-xl p-3 text-center" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <p className="text-xs" style={{ color: "#fbbf24" }}>Razorpay is not configured. Download demo report instead.</p>
                  </div>
                  <button
                    onClick={handleDemo}
                    disabled={status === "generating"}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 text-white transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg,#00C2A8,#007AFF)" }}
                  >
                    {status === "generating" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    {status === "generating" ? "Generating PDF…" : "Download Demo Report"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePay}
                  disabled={status === "creating" || status === "paying" || status === "generating"}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#00C2A8,#007AFF)" }}
                >
                  {(status === "creating" || status === "paying" || status === "generating") ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />
                      {status === "creating" ? "Creating order…" : status === "paying" ? "Awaiting payment…" : "Generating PDF…"}
                    </>
                  ) : (
                    <><CreditCard className="w-4 h-4" /> Pay ₹{price} & Download Report</>
                  )}
                </button>
              )}
              <p className="text-center text-[10px] mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>
                Secured by Razorpay · UPI · Cards · Net Banking
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
