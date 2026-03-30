import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, RefreshCw, ShieldCheck } from "lucide-react";
import { useUserAuth } from "@/hooks/use-user-auth";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Mode = "password" | "otp-email" | "otp-verify";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, otpLogin, isLoggedIn } = useUserAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState<Mode>("password");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSuccess, setOtpSuccess] = useState(false);

  useEffect(() => {
    if (isLoggedIn) setLocation("/");
  }, [isLoggedIn]);

  useEffect(() => {
    if (otpTimer <= 0) return;
    const id = setInterval(() => setOtpTimer(t => (t <= 1 ? (clearInterval(id), 0) : t - 1)), 1000);
    return () => clearInterval(id);
  }, [otpTimer]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = login(email, password);
      if (!res.success) { setError(res.error || "Invalid email or password."); return; }
      setLocation("/");
    } finally { setLoading(false); }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send OTP."); return; }
      setMode("otp-verify"); setOtpTimer(60);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Verification failed."); return; }
      otpLogin(otpEmail, data.token);
      setOtpSuccess(true);
      setTimeout(() => setLocation("/"), 1000);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050505", display: "flex",
      fontFamily: "'Outfit', sans-serif", position: "relative", overflow: "hidden",
    }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", top: "8%", right: "10%", width: 280, height: 280, borderRadius: "50%", background: "#00C2A818", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "12%", left: "5%", width: 200, height: 200, borderRadius: "50%", background: "#00C2A810", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "45%", left: "22%", width: 120, height: 120, borderRadius: "50%", background: "#00C2A808", filter: "blur(40px)", pointerEvents: "none" }} />

      {/* ── Left panel ── */}
      <div style={{
        width: "45%", minHeight: "100vh", borderRight: "1px solid #111",
        display: "flex", flexDirection: "column", padding: "32px 40px",
        position: "relative",
      }} className="auth-left-panel">
        {/* Logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: "#00C2A8",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "#050505", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18 }}>A</span>
          </div>
          <span style={{ color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, letterSpacing: "-0.02em" }}>AETHEX</span>
        </div>

        {/* Hero headline */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", marginTop: -40 }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 38, fontWeight: 300, lineHeight: 1.15,
            color: "#fff", margin: 0,
          }}>
            Medicine meets<br />
            <em style={{ color: "#00C2A8", fontStyle: "italic" }}>intelligence</em>
          </h1>
          <p style={{ fontSize: 12, color: "#555", marginTop: 16, lineHeight: 1.65, maxWidth: 340 }}>
            India's only medical platform with an AI clinical assistant, medical shop, and study hub — all in one place.
          </p>

          {/* Feature list */}
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              "Cadus AI — Clinical Co-Pilot",
              "Medical Shop — 500+ products",
              "Study Hub — NEET-PG Prep",
              "GST Invoices & Fast Delivery",
            ].map(feat => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C2A8", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#444" }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{
        width: "55%", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "32px 24px",
      }} className="auth-right-panel">
        <div style={{
          background: "#0D0D0D", border: "1px solid #1a1a1a",
          borderRadius: 20, padding: 32, width: "100%", maxWidth: 300,
        }}>
          {otpSuccess ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#00C2A820", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <ShieldCheck size={28} color="#00C2A8" />
              </div>
              <p style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>Verified!</p>
              <p style={{ color: "#555", fontSize: 12, marginTop: 6 }}>Signing you in…</p>
            </div>
          ) : mode === "otp-verify" ? (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>Check your email</h2>
              <p style={{ fontSize: 11, color: "#444", margin: "0 0 24px" }}>Enter the 6-digit code sent to {otpEmail}</p>
              <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>OTP CODE</label>
                  <input
                    type="text" inputMode="numeric" pattern="\d{6}" maxLength={6}
                    value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    required placeholder="• • • • • •"
                    style={{ ...inputStyle, textAlign: "center", fontSize: 22, letterSpacing: "0.5em", fontFamily: "monospace" }}
                    onFocus={e => (e.target.style.borderColor = "#00C2A8")}
                    onBlur={e => (e.target.style.borderColor = "#1a1a1a")}
                  />
                </div>
                {error && <div style={errorStyle}>{error}</div>}
                <button type="submit" disabled={loading || otpCode.length !== 6} style={primaryBtnStyle}>
                  {loading ? "Verifying…" : "Verify & Sign In"}
                </button>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                  <button type="button" onClick={() => { setMode("otp-email"); setOtpCode(""); setError(""); }}
                    style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}>
                    ← Change email
                  </button>
                  <button type="button" disabled={otpTimer > 0 || loading}
                    onClick={async () => {
                      if (otpTimer > 0) return;
                      setLoading(true);
                      try {
                        const res = await fetch(`${API_BASE}/api/auth/send-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: otpEmail }) });
                        const data = await res.json();
                        if (res.ok) { setOtpCode(""); setOtpTimer(60); } else setError(data.error || "Failed.");
                      } catch { setError("Network error."); } finally { setLoading(false); }
                    }}
                    style={{ background: "none", border: "none", color: otpTimer > 0 ? "#333" : "#00C2A8", cursor: otpTimer > 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}>
                    <RefreshCw size={10} />
                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            </>
          ) : mode === "otp-email" ? (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>Passwordless login</h2>
              <p style={{ fontSize: 11, color: "#444", margin: "0 0 24px" }}>We'll send a code to your email</p>
              <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>EMAIL</label>
                  <input type="email" value={otpEmail} onChange={e => setOtpEmail(e.target.value)} required
                    placeholder="doctor@hospital.com" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "#00C2A8")}
                    onBlur={e => (e.target.style.borderColor = "#1a1a1a")} />
                </div>
                {error && <div style={errorStyle}>{error}</div>}
                <button type="submit" disabled={loading} style={primaryBtnStyle}>
                  {loading ? "Sending…" : "Send OTP"}
                </button>
                <button type="button" onClick={() => { setMode("password"); setError(""); }}
                  style={{ ...ghostBtnStyle, fontSize: 11, color: "#555" }}>
                  ← Back to password login
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>Welcome back</h2>
              <p style={{ fontSize: 11, color: "#444", margin: "0 0 24px" }}>Sign in to your Aethex account</p>

              <form onSubmit={handlePasswordLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>EMAIL</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="doctor@hospital.com" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "#00C2A8")}
                    onBlur={e => (e.target.style.borderColor = "#1a1a1a")} />
                </div>
                <div>
                  <label style={labelStyle}>PASSWORD</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password} onChange={e => setPassword(e.target.value)} required
                      placeholder="••••••••" style={{ ...inputStyle, paddingRight: 40 }}
                      onFocus={e => (e.target.style.borderColor = "#00C2A8")}
                      onBlur={e => (e.target.style.borderColor = "#1a1a1a")}
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#444", cursor: "pointer", display: "flex" }}>
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <div style={{ textAlign: "right", marginTop: 6 }}>
                    <button type="button" style={{ background: "none", border: "none", color: "#00C2A8", fontSize: 10, cursor: "pointer" }}>
                      Forgot password?
                    </button>
                  </div>
                </div>

                {error && <div style={errorStyle}>{error}</div>}

                <button type="submit" disabled={loading} style={primaryBtnStyle}>
                  {loading ? "Signing in…" : "Sign In to Aethex"}
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
                  <span style={{ fontSize: 10, color: "#333" }}>or continue with</span>
                  <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
                </div>

                <button type="button" onClick={() => { setMode("otp-email"); setOtpEmail(email); setError(""); }}
                  style={ghostBtnStyle}>
                  <ShieldCheck size={14} color="#00C2A8" />
                  <span>Email OTP (Passwordless)</span>
                </button>

                <p style={{ fontSize: 10, color: "#444", textAlign: "center", margin: 0 }}>
                  No account?{" "}
                  <Link href="/signup" style={{ color: "#00C2A8", textDecoration: "none" }}>
                    Create one free
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .auth-left-panel { width: 100% !important; min-height: auto !important; border-right: none !important; border-bottom: 1px solid #111; padding: 24px 20px !important; }
          .auth-right-panel { width: 100% !important; min-height: auto !important; }
          ${'' /* Stack vertically on mobile */}
          div[style*="display: flex"][style*="minHeight"] { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 9, fontWeight: 500,
  letterSpacing: "0.1em", textTransform: "uppercase",
  color: "#555", marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0a0a0a",
  border: "1px solid #1a1a1a", borderRadius: 10,
  padding: "12px 14px", color: "#e0e0e0",
  fontSize: 13, outline: "none",
  transition: "border-color 0.2s ease",
  boxSizing: "border-box",
  fontFamily: "'Outfit', sans-serif",
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%", background: "#00C2A8", color: "#050505",
  border: "none", borderRadius: 10, padding: "13px 0",
  fontSize: 13, fontWeight: 600, cursor: "pointer",
  transition: "opacity 0.2s ease",
  fontFamily: "'Outfit', sans-serif",
};

const ghostBtnStyle: React.CSSProperties = {
  width: "100%", background: "transparent",
  border: "1px solid #1a1a1a", borderRadius: 10,
  padding: "12px 0", fontSize: 12, color: "#e0e0e0",
  cursor: "pointer", display: "flex",
  alignItems: "center", justifyContent: "center", gap: 8,
  transition: "border-color 0.2s ease",
  fontFamily: "'Outfit', sans-serif",
};

const errorStyle: React.CSSProperties = {
  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
  borderRadius: 8, padding: "10px 12px",
  fontSize: 11, color: "#f87171",
};
