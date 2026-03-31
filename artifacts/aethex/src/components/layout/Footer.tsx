import { Link, useLocation } from "wouter";
import { Heart, ShieldCheck, Truck, Twitter, Linkedin, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const apiBase = () => import.meta.env.BASE_URL.replace(/\/$/, "");

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch(`${apiBase()}/api/newsletter/subscribe`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      setDone(true);
    } catch {} finally { setLoading(false); }
  };

  if (done) return (
    <div className="flex items-center gap-2 text-emerald-400 font-semibold"><CheckCircle2 className="w-5 h-5" /> You're subscribed! Weekly updates incoming.</div>
  );

  return (
    <form className="flex w-full md:w-auto gap-2" onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required
        className="rounded-xl px-4 py-3 flex-1 md:w-64 focus:outline-none"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)" }} />
      <button type="submit" disabled={loading}
        className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-60"
        style={{ background: "#007AFF", color: "#FFFFFF" }}>
        {loading ? "..." : <><Send className="w-4 h-4" /> Subscribe</>}
      </button>
    </form>
  );
}

export function Footer() {
  const [location] = useLocation();
  if (location === "/ai-assistant") return null;
  return (
    <footer style={{ background: "#1C1C1E", color: "rgba(255,255,255,0.9)" }} className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Newsletter Section */}
        <div className="rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="text-center md:text-left flex-1">
            <h3 className="text-2xl font-display font-bold text-white mb-2">Weekly Medical Insights + NEET-PG Tips</h3>
            <p style={{ color: "rgba(255,255,255,0.45)" }}>Subscribe for clinical tips, medical news, exam updates, and exclusive deals. 12,000+ subscribers.</p>
          </div>
          <FooterNewsletter />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src={`${import.meta.env.BASE_URL}aethex-logo.jpg`}
                alt="aethex logo"
                className="w-10 h-10 object-contain"
              />
              <span className="font-display font-bold text-2xl tracking-tight text-white leading-none">
                aethex
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              Medicine Made Effortless. India's #1 destination for medical professionals and students — top-tier equipment, books, scrubs, and AI assistance.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-90" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:opacity-90" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-6">Shop Categories</h3>
            <ul className="space-y-4 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              {[
                { href: "/category/stethoscopes", label: "Premium Stethoscopes" },
                { href: "/category/scrubs", label: "Medical Scrubs & Aprons" },
                { href: "/category/books", label: "Books & Study Material" },
                { href: "/category/surgical", label: "Surgical Instruments" },
                { href: "/category/equipment", label: "Medical Equipment" },
              ].map(({ href, label }) => (
                <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-6">Resources</h3>
            <ul className="space-y-4 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              <li><Link href="/ai-assistant" className="hover:text-white transition-colors">Cadus AI Assistant</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Medical Blog</Link></li>
              <li><Link href="/news" className="hover:text-white transition-colors">Medical News</Link></li>
              <li><Link href="/orders/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs for Doctors</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-display font-bold text-white text-lg mb-6">Why aethex?</h3>
            <ul className="space-y-4 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5" style={{ color: "#00C2A8" }} /><span>100% Genuine Products</span></li>
              <li className="flex items-center gap-3"><Truck className="w-5 h-5" style={{ color: "#00C2A8" }} /><span>Pan-India Fast Delivery</span></li>
              <li className="flex items-center gap-3"><Heart className="w-5 h-5" style={{ color: "#00C2A8" }} /><span>Trusted by 50k+ Doctors</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="text-sm flex flex-col sm:flex-row gap-2 sm:gap-6 text-center sm:text-left" style={{ color: "rgba(255,255,255,0.35)" }}>
            <span>© {new Date().getFullYear()} aethex. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>Medicine Made Effortless.</span>
            <span className="hidden sm:inline">•</span>
            <span>Registered in India</span>
          </div>
          <div className="flex gap-6 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          Accepted Payments: VisaCard • Mastercard • UPI • Net Banking • COD
        </div>

        {/* Parent company */}
        <div className="mt-8 pt-6 flex flex-col items-center gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>A product of</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,rgba(0,122,255,0.35),rgba(0,194,168,0.35))", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="text-[11px] font-bold tracking-tight" style={{ color: "rgba(255,255,255,0.6)" }}>CT</span>
            </div>
            <span className="text-sm font-semibold tracking-wide" style={{ color: "rgba(255,255,255,0.3)" }}>Clavix Technologies Pvt Ltd</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
