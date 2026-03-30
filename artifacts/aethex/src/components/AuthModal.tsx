import { useState, useEffect, useRef } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, ShieldCheck, RefreshCw } from "lucide-react";
import { useUserAuth } from "@/hooks/use-user-auth";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup" | "otp";
}

type Tab = "login" | "signup" | "otp";
type OtpStep = "email" | "verify";

export function AuthModal({ open, onClose, defaultMode = "login" }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, login, otpLogin } = useUserAuth();

  const [otpStep, setOtpStep] = useState<OtpStep>("email");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      setTab(defaultMode);
      reset();
      resetOtp();
    }
  }, [open, defaultMode]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  if (!open) return null;

  function reset() {
    setName(""); setEmail(""); setPassword(""); setError(""); setLoading(false);
  }

  function resetOtp() {
    setOtpStep("email"); setOtpEmail(""); setOtpCode("");
    setOtpTimer(0); setOtpSuccess(false); setError("");
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function switchTab(t: Tab) {
    setTab(t); reset(); resetOtp();
  }

  function startTimer() {
    setOtpTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (tab === "signup") {
        if (!name.trim()) { setError("Please enter your name."); return; }
        const res = signup(name.trim(), email, password);
        if (!res.success) { setError(res.error || "Signup failed."); return; }
      } else {
        const res = login(email, password);
        if (!res.success) { setError(res.error || "Login failed."); return; }
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send OTP."); return; }
      setOtpStep("verify");
      startTimer();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Verification failed."); return; }
      otpLogin(otpEmail, data.token);
      setOtpSuccess(true);
      setTimeout(() => onClose(), 1200);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to resend OTP."); return; }
      setOtpCode(""); startTimer();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#161B22] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        <div className="relative p-6 pb-0">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#00C2A8]/20 flex items-center justify-center">
              {tab === "otp" ? <ShieldCheck className="w-5 h-5 text-[#00C2A8]" /> : <Sparkles className="w-5 h-5 text-[#00C2A8]" />}
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                {tab === "login" ? "Welcome back" : tab === "signup" ? "Create account" : "Email OTP Login"}
              </h2>
              <p className="text-sm text-white/50">
                {tab === "login" ? "Sign in to your aethex account"
                  : tab === "signup" ? "Join 50,000+ medical professionals"
                  : "Passwordless · Secure · Instant"}
              </p>
            </div>
          </div>

          <div className="flex rounded-xl bg-white/5 p-1 mb-6">
            {(["login", "signup", "otp"] as const).map(t => (
              <button key={t} onClick={() => switchTab(t)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  tab === t ? "bg-[#00C2A8] text-[#0D1117]" : "text-white/50 hover:text-white"
                }`}>
                {t === "login" ? "Sign In" : t === "signup" ? "Sign Up" : "OTP"}
              </button>
            ))}
          </div>
        </div>

        {tab === "otp" ? (
          <div className="p-6 pt-2">
            {otpSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#00C2A8]/20 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-[#00C2A8]" />
                </div>
                <p className="text-white font-bold text-lg">Verified!</p>
                <p className="text-white/50 text-sm mt-1">Logging you in…</p>
              </div>
            ) : otpStep === "email" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input type="email" value={otpEmail} onChange={e => setOtpEmail(e.target.value)} required
                      placeholder="doctor@hospital.in"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8] focus:ring-1 focus:ring-[#00C2A8]/30 transition-all" />
                  </div>
                </div>
                {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">{error}</div>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-[#00C2A8] hover:bg-[#00D4B8] text-[#0D1117] font-bold rounded-xl transition-all disabled:opacity-60">
                  {loading ? "Sending OTP…" : "Send OTP"}
                </button>
                <p className="text-center text-xs text-white/30">A 6-digit code will be sent to your email</p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-[#00C2A8]/10 border border-[#00C2A8]/20 rounded-xl text-sm text-[#00C2A8] text-center">
                  OTP sent to <strong>{otpEmail}</strong>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Enter 6-digit OTP</label>
                  <input type="text" inputMode="numeric" pattern="\d{6}" maxLength={6}
                    value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ""))} required
                    placeholder="• • • • • •"
                    className="w-full text-center text-2xl font-mono tracking-[0.5em] py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#00C2A8] focus:ring-1 focus:ring-[#00C2A8]/30 transition-all" />
                </div>
                {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">{error}</div>}
                <button type="submit" disabled={loading || otpCode.length !== 6}
                  className="w-full py-3 bg-[#00C2A8] hover:bg-[#00D4B8] text-[#0D1117] font-bold rounded-xl transition-all disabled:opacity-60">
                  {loading ? "Verifying…" : "Verify & Login"}
                </button>
                <div className="flex items-center justify-between text-xs">
                  <button type="button" onClick={() => { resetOtp(); }} className="text-white/40 hover:text-white transition-colors">
                    ← Change email
                  </button>
                  <button type="button" onClick={handleResendOtp} disabled={otpTimer > 0 || loading}
                    className="flex items-center gap-1 text-white/40 hover:text-[#00C2A8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <RefreshCw className="w-3 h-3" />
                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="p-6 pt-2 space-y-4">
            {tab === "signup" && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    placeholder="Dr. Priya Sharma"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8] focus:ring-1 focus:ring-[#00C2A8]/30 transition-all" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="doctor@hospital.in"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8] focus:ring-1 focus:ring-[#00C2A8]/30 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder={tab === "signup" ? "Min. 6 characters" : "Your password"}
                  minLength={tab === "signup" ? 6 : 1}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8] focus:ring-1 focus:ring-[#00C2A8]/30 transition-all" />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#00C2A8] hover:bg-[#00D4B8] text-[#0D1117] font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs text-white/30">
                <span className="px-2 bg-[#161B22]">or</span>
              </div>
            </div>

            <button type="button" onClick={() => switchTab("otp")}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00C2A8]" />
              Login with Email OTP (Passwordless)
            </button>

            <p className="text-center text-xs text-white/30">
              {tab === "login" ? (
                <>Don't have an account? <button type="button" onClick={() => switchTab("signup")} className="text-[#00C2A8] hover:underline">Sign up free</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => switchTab("login")} className="text-[#00C2A8] hover:underline">Sign in</button></>
              )}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
