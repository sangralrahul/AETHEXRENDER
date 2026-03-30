import { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";
import { useUserAuth } from "@/hooks/use-user-auth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

export function AuthModal({ open, onClose, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, login } = useUserAuth();

  if (!open) return null;

  const reset = () => {
    setName(""); setEmail(""); setPassword(""); setError(""); setLoading(false);
  };

  const switchMode = (m: "login" | "signup") => {
    setMode(m);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#161B22] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#00C2A8]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#00C2A8]" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-sm text-white/50">
                {mode === "login" ? "Sign in to your aethex account" : "Join 50,000+ medical professionals"}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6">
            {(["login", "signup"] as const).map(m => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${
                  mode === m ? "bg-[#00C2A8] text-[#0D1117]" : "text-white/50 hover:text-white"
                }`}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          {mode === "signup" && (
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
                placeholder={mode === "signup" ? "Min. 6 characters" : "Your password"}
                minLength={mode === "signup" ? 6 : 1}
                className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8] focus:ring-1 focus:ring-[#00C2A8]/30 transition-all" />
              <button type="button" onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#00C2A8] hover:bg-[#00D4B8] text-[#0D1117] font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {/* Google placeholder */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs text-white/30">
              <span className="px-2 bg-[#161B22]">or continue with</span>
            </div>
          </div>
          <button type="button"
            onClick={() => { setError("Google Sign-In coming soon. Please use email login."); }}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-white/30">
            {mode === "login" ? (
              <>Don't have an account? <button type="button" onClick={() => switchMode("signup")} className="text-[#00C2A8] hover:underline">Sign up free</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => switchMode("login")} className="text-[#00C2A8] hover:underline">Sign in</button></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
