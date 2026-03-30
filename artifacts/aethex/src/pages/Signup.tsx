import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import { useUserAuth } from "@/hooks/use-user-auth";

type Role = "Doctor" | "Medical Student" | "Patient";
const ROLES: Role[] = ["Doctor", "Medical Student", "Patient"];

export default function Signup() {
  const [, setLocation] = useLocation();
  const { signup, isLoggedIn } = useUserAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Doctor");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) setLocation("/");
  }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (!name.trim()) { setError("Please enter your full name."); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
      const res = signup(name.trim(), email, password);
      if (!res.success) { setError(res.error || "Signup failed. Please try again."); return; }
      localStorage.removeItem("aethex_onboarded");
      setLocation("/onboarding");
    } finally { setLoading(false); }
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
      }} className="auth-left-panel">
        {/* Logo mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: "#00C2A8",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
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
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>Create your account</h2>
          <p style={{ fontSize: 11, color: "#444", margin: "0 0 24px" }}>Join thousands of doctors on Aethex</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>NAME</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                placeholder="Dr. Priya Sharma" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "#00C2A8")}
                onBlur={e => (e.target.style.borderColor = "#1a1a1a")} />
            </div>

            {/* Role */}
            <div>
              <label style={labelStyle}>ROLE</label>
              <div style={{ display: "flex", gap: 6 }}>
                {ROLES.map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    style={{
                      flex: 1, padding: "9px 4px",
                      background: role === r ? "#00C2A820" : "#0a0a0a",
                      border: `1px solid ${role === r ? "#00C2A8" : "#1a1a1a"}`,
                      borderRadius: 8, color: role === r ? "#00C2A8" : "#555",
                      fontSize: 10, cursor: "pointer", transition: "all 0.2s",
                      fontFamily: "'Outfit', sans-serif", fontWeight: role === r ? 600 : 400,
                    }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="doctor@hospital.com" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "#00C2A8")}
                onBlur={e => (e.target.style.borderColor = "#1a1a1a")} />
            </div>

            {/* Password */}
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
            </div>

            {error && <div style={errorStyle}>{error}</div>}

            <button type="submit" disabled={loading} style={primaryBtnStyle}>
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
              <span style={{ fontSize: 10, color: "#333" }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
            </div>

            <button type="button" style={ghostBtnStyle}
              onClick={() => window.location.href = "/login"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Sign up with Google</span>
            </button>

            <p style={{ fontSize: 10, color: "#444", textAlign: "center", margin: 0 }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#00C2A8", textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .auth-left-panel { width: 100% !important; min-height: auto !important; border-right: none !important; border-bottom: 1px solid #111; padding: 24px 20px !important; }
          .auth-right-panel { width: 100% !important; min-height: auto !important; }
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
