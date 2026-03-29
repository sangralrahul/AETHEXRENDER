import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";

interface SellerLoginProps {
  onLogin: (seller: any) => void;
}

export default function SellerLogin({ onLogin }: SellerLoginProps) {
  const [, setLocation] = useLocation();
  const [sellerCode, setSellerCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerCode.trim()) { setError("Please enter your seller code"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/seller/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerCode: sellerCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed"); return; }
      localStorage.setItem("aethex_seller_code", data.seller.sellerCode);
      localStorage.setItem("aethex_seller_info", JSON.stringify(data.seller));
      onLogin(data.seller);
      setLocation("/seller/dashboard");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="bg-[#141821] rounded-2xl border border-white/5 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">A</div>
            <h1 className="text-xl font-bold text-white mb-1">Seller Sign In</h1>
            <p className="text-slate-400 text-sm">Enter your seller code to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Seller Code</label>
              <input
                value={sellerCode}
                onChange={e => setSellerCode(e.target.value.toUpperCase())}
                placeholder="SELL-0001"
                maxLength={10}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all text-center text-lg tracking-widest"
              />
            </div>

            {error && <p className="text-rose-400 text-sm font-medium">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center space-y-2">
            <p className="text-slate-500 text-xs">Demo seller code: <button onClick={() => setSellerCode("SELL-0001")} className="text-primary font-mono font-bold hover:underline">SELL-0001</button></p>
            <p className="text-slate-500 text-sm">New seller? <Link href="/seller/register" className="text-primary hover:underline">Apply here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
