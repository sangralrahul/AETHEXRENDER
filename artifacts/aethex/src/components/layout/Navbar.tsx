import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, Sparkles, User, Star, MapPin, ShieldCheck, ChevronDown, Store, BookOpen, Newspaper, Crown, GraduationCap, LogOut, Settings, Package, X, Brain, Stethoscope, FlaskConical, Pill, Activity, Building2, GraduationCap as University, HeartPulse, Microscope, FileText, Syringe } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useUserAuth } from "@/hooks/use-user-auth";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/NotificationBell";
import { AuthModal } from "@/components/AuthModal";

export function AnnouncementBar() {
  return (
    <div className="w-full text-center py-2.5 px-4 text-xs font-medium" style={{ background: "#1c1c1e", color: "rgba(255,255,255,0.8)" }}>
      Free delivery on orders above ₹999 · Trusted by 50,000+ doctors · Use code{" "}
      <span className="font-bold" style={{ color: "#007AFF" }}>AETHEX10</span> for 10% off
    </div>
  );
}

const toolsMenu = [
  { href: "/tools/prescription", icon: FileText, label: "Prescription Writer", desc: "AI-powered Rx generator", color: "#007AFF" },
  { href: "/tools/drug-interactions", icon: Pill, label: "Drug Interactions", desc: "Check drug safety instantly", color: "#F59E0B" },
  { href: "/tools/dosage-calculator", icon: FlaskConical, label: "Dosage Calculator", desc: "Weight-based dose calculator", color: "#10B981" },
  { href: "/tools/differential-diagnosis", icon: Brain, label: "Differential Diagnosis", desc: "AI symptom analysis", color: "#8B5CF6" },
  { href: "/tools/lab-interpreter", icon: Microscope, label: "Lab Interpreter", desc: "Interpret investigation results", color: "#EF4444" },
  { href: "/tools/procedure-guide", icon: Syringe, label: "Procedure Guide", desc: "Step-by-step clinical procedures", color: "#06B6D4" },
];

const institutionsMenu = [
  { href: "/institutions?type=medical-college", icon: University, label: "Medical Colleges", desc: "MBBS, MD, MS admissions", color: "#007AFF" },
  { href: "/institutions?type=hospital", icon: Building2, label: "Hospitals", desc: "Top hospitals & networks", color: "#EF4444" },
  { href: "/institutions?type=pg-entrance", icon: GraduationCap, label: "PG Entrance", desc: "NEET PG, NEXT coaching", color: "#F59E0B" },
  { href: "/institutions?type=research", icon: Microscope, label: "Research Institutes", desc: "ICMR, AIIMS, CMC & more", color: "#8B5CF6" },
  { href: "/institutions?type=nursing", icon: HeartPulse, label: "Nursing Colleges", desc: "BSc, MSc Nursing programs", color: "#10B981" },
  { href: "/institutions?type=pharmacy", icon: Pill, label: "Pharmacy Colleges", desc: "B.Pharm, Pharm.D programs", color: "#06B6D4" },
];

function NavDropdown({ label, href, menu, open, onToggle, onClose, dropdownRef }: {
  label: string;
  href: string;
  menu: typeof toolsMenu;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}) {
  const [location] = useLocation();
  const active = location.startsWith(href);

  return (
    <div ref={dropdownRef} className="relative hidden lg:block">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
        style={{
          color: active ? "#007AFF" : "#636366",
          background: active ? "rgba(0,122,255,0.08)" : open ? "rgba(60,60,67,0.06)" : "transparent",
        }}
        onMouseEnter={e => { if (!active && !open) (e.currentTarget as HTMLButtonElement).style.background = "rgba(60,60,67,0.06)"; }}
        onMouseLeave={e => { if (!active && !open) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[440px] rounded-2xl z-50 overflow-hidden"
          style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 16px 48px rgba(0,0,0,0.14)" }}>
          <div className="px-4 pt-3 pb-2 border-b" style={{ borderColor: "rgba(60,60,67,0.08)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#AEAEB2" }}>{label}</p>
          </div>
          <div className="p-3 grid grid-cols-2 gap-1">
            {menu.map((item) => (
              <Link key={item.href} href={item.href} onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: "transparent" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${item.color}08`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}14`, border: `1px solid ${item.color}25` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "#1C1C1E" }}>{item.label}</p>
                  <p className="text-[10px] truncate" style={{ color: "#AEAEB2" }}>{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t" style={{ borderColor: "rgba(60,60,67,0.08)", background: "rgba(60,60,67,0.02)" }}>
            <Link href={href} onClick={onClose} className="text-xs font-semibold" style={{ color: "#007AFF" }}>
              View all {label} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [location, setLocation] = useLocation();
  const sessionId = useSession();
  const { user, isLoggedIn, isPro, logout } = useUserAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [institutionsOpen, setInstitutionsOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const institutionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
      if (institutionsRef.current && !institutionsRef.current.contains(e.target as Node)) setInstitutionsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const { data: cart } = useGetCart(
    { sessionId },
    { query: { enabled: !!sessionId, staleTime: 1000 * 60 } }
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const openLogin = () => { setAccountOpen(false); setMobileOpen(false); setLocation("/login"); };
  const openSignup = () => { setAccountOpen(false); setMobileOpen(false); setLocation("/signup"); };

  const simpleLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/study-hub", label: "Study Hub" },
    { href: "/blog", label: "Blog" },
    { href: "/news", label: "News" },
  ];

  return (
    <>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultMode={authMode} />
      <header
        className={cn("transition-all duration-300 border-b", isScrolled ? "backdrop-blur-xl shadow-sm py-3" : "py-4")}
        style={{
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid #e8e8ed",
          height: 64,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 md:gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <img
                src={`${import.meta.env.BASE_URL}aethex-logo.jpg`}
                alt="aethex logo"
                className="w-9 h-9 object-contain rounded-lg"
              />
              <span className="font-display font-bold text-xl tracking-tight leading-none" style={{ color: "#1C1C1E" }}>
                aethex
              </span>
              {isPro && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(0,194,168,0.12)", border: "1px solid rgba(0,194,168,0.3)", color: "#00A893" }}>
                  <Crown className="w-3 h-3" />PRO
                </span>
              )}
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs relative group">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 transition-colors" style={{ color: "#AEAEB2" }} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-8 pr-3 py-2 rounded-xl leading-5 text-xs transition-all focus:outline-none"
                style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.15)", color: "#1C1C1E", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                placeholder="Search products..."
              />
            </form>

            {/* Right Navigation */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Start Chat — unchanged */}
              <Link
                href="/ai-assistant"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-[10px] font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: "#007AFF", color: "#FFFFFF" }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Chat</span>
              </Link>

              {/* Simple nav links with hover background */}
              {simpleLinks.map((item) => {
                const active = location === item.href || location.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                      item.href === "/shop" ? "hidden md:block" : "hidden lg:block"
                    )}
                    style={{
                      color: active ? "#007AFF" : "#636366",
                      background: active ? "rgba(0,122,255,0.08)" : "transparent",
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(60,60,67,0.06)"; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Tools dropdown */}
              <NavDropdown
                label="Tools"
                href="/tools"
                menu={toolsMenu}
                open={toolsOpen}
                onToggle={() => { setToolsOpen(o => !o); setInstitutionsOpen(false); }}
                onClose={() => setToolsOpen(false)}
                dropdownRef={toolsRef as React.RefObject<HTMLDivElement>}
              />

              {/* Colleges & Hospitals dropdown */}
              <NavDropdown
                label="Colleges & Hospitals"
                href="/institutions"
                menu={institutionsMenu}
                open={institutionsOpen}
                onToggle={() => { setInstitutionsOpen(o => !o); setToolsOpen(false); }}
                onClose={() => setInstitutionsOpen(false)}
                dropdownRef={institutionsRef as React.RefObject<HTMLDivElement>}
              />

              {/* Account Dropdown */}
              <div ref={accountRef} className="relative hidden md:block">
                <button onClick={() => setAccountOpen(o => !o)}
                  className="flex items-center gap-1.5 p-2 rounded-xl transition-all hover:bg-black/5"
                  style={{ color: "#636366" }}>
                  {isLoggedIn ? (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(0,122,255,0.12)", border: "1px solid rgba(0,122,255,0.25)", color: "#007AFF" }}>
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <ChevronDown className={`w-3 h-3 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl py-2 z-50" style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.12)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(60,60,67,0.08)" }}>
                          <p className="text-sm font-semibold truncate" style={{ color: "#1C1C1E" }}>{user?.name}</p>
                          <p className="text-xs truncate" style={{ color: "#AEAEB2" }}>{user?.email}</p>
                          {isPro && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(0,194,168,0.1)", border: "1px solid rgba(0,194,168,0.25)", color: "#00A893" }}>
                              <Crown className="w-3 h-3" />PRO
                            </span>
                          )}
                        </div>
                        {[
                          { href: "/account", icon: Settings, label: "My Account" },
                          { href: "/settings", icon: Brain, label: "Cadus AI Settings" },
                          { href: "/orders", icon: Package, label: "My Orders" },
                          { href: "/my-reviews", icon: Star, label: "My Reviews" },
                          { href: "/orders/track", icon: MapPin, label: "Track Order" },
                        ].map(({ href, icon: Icon, label }) => (
                          <Link key={href} href={href} onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                            style={{ color: "#636366" }}>
                            <Icon className="w-4 h-4" /> {label}
                          </Link>
                        ))}
                        <div style={{ borderTop: "1px solid rgba(60,60,67,0.08)" }} className="my-1" />
                        <div className="flex items-center gap-2 px-4 py-1.5">
                          <Link href="/seller/dashboard" onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-1.5 text-xs transition-colors hover:text-gray-600"
                            style={{ color: "#AEAEB2" }}>
                            <Store className="w-3 h-3" /> Seller
                          </Link>
                          <span style={{ color: "#AEAEB2" }}>·</span>
                          <Link href="/admin" onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-1.5 text-xs transition-colors hover:text-gray-600"
                            style={{ color: "#AEAEB2" }}>
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </Link>
                        </div>
                        <div style={{ borderTop: "1px solid rgba(60,60,67,0.08)" }} className="my-1" />
                        <button onClick={() => { logout(); setAccountOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(60,60,67,0.08)" }}>
                          <p className="text-sm" style={{ color: "#636366" }}>Sign in to access your account, orders, and Cadus AI.</p>
                        </div>
                        <button onClick={openLogin}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                          style={{ color: "#636366" }}>
                          <User className="w-4 h-4" /> Sign In
                        </button>
                        <button onClick={openSignup}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium hover:bg-blue-50 transition-colors"
                          style={{ color: "#007AFF" }}>
                          <Sparkles className="w-4 h-4" /> Create Account
                        </button>
                        <div style={{ borderTop: "1px solid rgba(60,60,67,0.08)" }} className="my-1" />
                        <div className="flex items-center gap-2 px-4 py-1.5">
                          <Link href="/seller/register" onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-1.5 text-xs hover:text-gray-600 transition-colors"
                            style={{ color: "#AEAEB2" }}>
                            <Store className="w-3 h-3" /> Sell
                          </Link>
                          <span style={{ color: "#AEAEB2" }}>·</span>
                          <Link href="/admin" onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-1.5 text-xs hover:text-gray-600 transition-colors"
                            style={{ color: "#AEAEB2" }}>
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <NotificationBell />

              <Link href="/cart" className="relative p-2 rounded-xl transition-all hover:bg-black/5" style={{ color: "#636366" }}>
                <ShoppingCart className="w-5 h-5" />
                {cart && cart.itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white rounded-full" style={{ background: "#007AFF" }}>
                    {cart.itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button onClick={() => setMobileOpen(o => !o)} className="md:hidden p-2 rounded-xl transition-all hover:bg-black/5" style={{ color: "#636366" }}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden mt-3 pt-3 pb-4 space-y-1" style={{ borderTop: "1px solid rgba(60,60,67,0.1)" }}>
              <form onSubmit={handleSearch} className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#AEAEB2" }} />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.15)", color: "#1C1C1E" }}
                  placeholder="Search products..." />
              </form>
              {[
                { href: "/shop", label: "Shop All Products" },
                { href: "/ai-assistant", label: "Start Chat (Cadus AI)" },
                { href: "/tools", label: "Clinical Tools" },
                { href: "/study-hub", label: "Study Hub" },
                { href: "/institutions", label: "Colleges & Hospitals" },
                { href: "/blog", label: "Blog" },
                { href: "/news", label: "Medical News" },
                { href: "/orders/track", label: "Track Order" },
              ].map(item => {
                const active = location === item.href || location.startsWith(item.href + "/");
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all"
                    style={{ color: active ? "#007AFF" : "#636366", background: active ? "rgba(0,122,255,0.08)" : "transparent" }}>
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-2 mt-2" style={{ borderTop: "1px solid rgba(60,60,67,0.1)" }}>
                {isLoggedIn ? (
                  <button onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out ({user?.name})
                  </button>
                ) : (
                  <button onClick={() => { openLogin(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-colors hover:bg-black/5"
                    style={{ color: "#636366" }}>
                    <User className="w-4 h-4" /> Sign In / Sign Up
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
