import { useState } from "react";
import { Smartphone, CheckCircle, Share2, Gift, Star, Bell, Brain, BookOpen, ShoppingBag } from "lucide-react";

const FEATURES = [
  { icon: Brain, title: "Cadus AI on the go", desc: "Ask clinical questions, get SOAP notes, and drug info — anytime, anywhere.", color: "#8B5CF6" },
  { icon: BookOpen, title: "Offline Study Mode", desc: "Download MCQ packs and study notes for use without internet connection.", color: "#007AFF" },
  { icon: Bell, title: "Smart Reminders", desc: "Daily study reminders, live class alerts, and streak notifications.", color: "#F59E0B" },
  { icon: ShoppingBag, title: "Quick Medical Supply Orders", desc: "Order stethoscopes, equipment, and scrubs with one tap.", color: "#00C2A8" },
  { icon: Star, title: "CME on Mobile", desc: "Attend live classes and earn CME credits from your phone.", color: "#EF4444" },
  { icon: Gift, title: "Exclusive App Launch Offer", desc: "First 10,000 users get 3 months Magnus free at launch.", color: "#10B981" },
];

export default function AppWaitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [referral] = useState(`AETHEX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(`Join the Aethex app waitlist and get 3 months Magnus free! Use my code: ${referral} — https://aethex.in/app`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: "#0A0E1A" }}>
      {/* Hero */}
      <div className="relative overflow-hidden pt-20 pb-24">
        {/* Background photo — mobile/smartphone lifestyle */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
        {/* Dark overlay */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, rgba(10,14,26,0.88) 0%, rgba(10,20,40,0.82) 50%, rgba(10,14,26,0.90) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,122,255,0.15) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/2" style={{ background: "rgba(0,194,168,0.08)" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Phone mockup */}
          <div className="w-20 h-36 rounded-3xl mx-auto mb-8 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", boxShadow: "0 30px 80px rgba(0,122,255,0.3)" }}>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.3)" }} />
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5" style={{ background: "rgba(0,122,255,0.15)", border: "1px solid rgba(0,122,255,0.25)", color: "#60A5FA" }}>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold">Coming Soon — iOS & Android</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4" style={{ letterSpacing: "-2px" }}>
            Aethex <span style={{ background: "linear-gradient(135deg,#00C2A8,#007AFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>App</span>
          </h1>
          <p className="text-lg max-w-lg mx-auto mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>India's medical platform — now in your pocket. Cadus AI, MCQs, live classes, and medical supplies. All in one app.</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} required
                  className="flex-1 px-4 py-3.5 rounded-2xl text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#FFFFFF" }} />
                <button type="submit" className="px-5 py-3.5 rounded-2xl font-bold text-sm" style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF" }}>
                  Join Waitlist
                </button>
              </div>
              <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.4)" }}>Join waitlist + refer 3 doctors = 3 months Magnus free at launch</p>
            </form>
          ) : (
            <div className="max-w-md mx-auto rounded-3xl p-6 text-center" style={{ background: "rgba(0,194,168,0.1)", border: "1px solid rgba(0,194,168,0.25)" }}>
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-1">You're on the list! 🎉</h3>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>Share your referral link to get 3 months Magnus free at launch.</p>
              <div className="rounded-xl p-3 mb-3 text-left" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Your referral code</p>
                <p className="font-mono font-bold text-white">{referral}</p>
              </div>
              <button onClick={copyReferral} className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2" style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}>
                <Share2 className="w-4 h-4" /> {copied ? "Copied! 🎉" : "Copy Referral Link"}
              </button>
            </div>
          )}

          {/* Official Store Badges */}
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            {/* Apple App Store Badge */}
            <a href="#" onClick={e => e.preventDefault()} className="transition-transform hover:scale-105 active:scale-95 inline-flex">
              <div style={{ background: "#000", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, padding: "9px 18px 9px 14px", height: 54 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 11, lineHeight: "1.3" }}>Download on the</div>
                  <div style={{ color: "#fff", fontSize: 20, fontWeight: 600, fontFamily: "system-ui,-apple-system,sans-serif", lineHeight: "1.2", letterSpacing: "-0.3px" }}>App Store</div>
                </div>
              </div>
            </a>

            {/* Google Play Badge */}
            <a href="#" onClick={e => e.preventDefault()} className="transition-transform hover:scale-105 active:scale-95 inline-flex">
              <div style={{ background: "#000", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, padding: "9px 18px 9px 14px", height: 54 }}>
                <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.22.51C.77.75.5 1.22.5 1.82v23.36c0 .6.27 1.07.72 1.31l.12.07L14.41 14v-.3L1.34.44 1.22.51z" fill="url(#gp_a)"/>
                  <path d="M18.27 17.83 14.41 14v-.3l3.86-3.83.09.05 4.57 2.6c1.3.74 1.3 1.95 0 2.69l-4.57 2.6-.09.02z" fill="url(#gp_b)"/>
                  <path d="M18.36 17.81 14.41 13.85 1.22 27.04c.43.46 1.13.51 1.92.06l15.22-9.29" fill="url(#gp_c)"/>
                  <path d="M18.36 9.89 3.14.6C2.35.15 1.65.2 1.22.66l13.19 13.19 3.95-3.96z" fill="url(#gp_d)"/>
                  <defs>
                    <linearGradient id="gp_a" x1="13.47" y1="1.57" x2="-5.53" y2="13.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00A0FF"/><stop offset=".007" stopColor="#00A1FF"/><stop offset=".26" stopColor="#00BEFF"/>
                      <stop offset=".512" stopColor="#00D2FF"/><stop offset=".76" stopColor="#00DFFF"/><stop offset="1" stopColor="#00E3FF"/>
                    </linearGradient>
                    <linearGradient id="gp_b" x1="23.89" y1="13.85" x2=".22" y2="13.85" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFE000"/><stop offset=".409" stopColor="#FFBD00"/><stop offset=".775" stopColor="#FFA500"/><stop offset="1" stopColor="#FF9C00"/>
                    </linearGradient>
                    <linearGradient id="gp_c" x1="15.99" y1="15.87" x2="-6.05" y2="42.25" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FF3A44"/><stop offset="1" stopColor="#C31162"/>
                    </linearGradient>
                    <linearGradient id="gp_d" x1="-2.07" y1="-8.48" x2="8.68" y2="5.15" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#32A071"/><stop offset=".069" stopColor="#2DA771"/><stop offset=".476" stopColor="#15CF74"/>
                      <stop offset=".801" stopColor="#06E775"/><stop offset="1" stopColor="#00F076"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 11, lineHeight: "1.3", letterSpacing: "0.4px" }}>GET IT ON</div>
                  <div style={{ color: "#fff", fontSize: 20, fontWeight: 600, fontFamily: "system-ui,-apple-system,sans-serif", lineHeight: "1.2", letterSpacing: "-0.3px" }}>Google Play</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-black text-white text-center mb-8">Everything you love about Aethex — on mobile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${f.color}20` }}>
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-sm mb-1 text-white">{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
