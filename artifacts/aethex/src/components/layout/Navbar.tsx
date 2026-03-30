import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, Sparkles, User, Star, MapPin, ShieldCheck, ChevronDown, Store, BookOpen, Newspaper, Crown, GraduationCap, LogOut, Settings, Package, X, Brain } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useUserAuth } from "@/hooks/use-user-auth";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/NotificationBell";
import { AuthModal } from "@/components/AuthModal";
import SettingsModal, { loadSettings, saveSettings, type CadusSettings } from "@/components/cadus/SettingsModal";

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
  const accountRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [cadusSettings, setCadusSettings] = useState<CadusSettings>(loadSettings);

  const handleSettingsChange = (s: CadusSettings) => {
    setCadusSettings(s);
    saveSettings(s);
  };

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
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

  return (
    <>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultMode={authMode} />
      {showSettings && (
        <SettingsModal
          settings={cadusSettings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
          user={user}
          isFromWebsite
        />
      )}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          isScrolled
            ? "bg-[#0D1117]/95 backdrop-blur-xl border-white/8 shadow-lg shadow-black/30 py-3"
            : "bg-[#0D1117] border-white/5 py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <img
                src={`${import.meta.env.BASE_URL}aethex-logo.jpg`}
                alt="aethex logo"
                className="w-9 h-9 object-contain rounded-lg"
              />
              <span className="font-display font-bold text-xl tracking-tight text-white leading-none">
                aethex
              </span>
              {isPro && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-[#00C2A8]/20 border border-[#00C2A8]/40 rounded-full text-[#00C2A8] text-xs font-bold">
                  <Crown className="w-3 h-3" />PRO
                </span>
              )}
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs relative group">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-white/30 group-focus-within:text-[#00C2A8] transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-8 pr-3 py-2 border border-white/10 rounded-lg leading-5 bg-white/5 placeholder-white/25 text-white focus:outline-none focus:bg-white/8 focus:border-[#00C2A8]/50 focus:ring-1 focus:ring-[#00C2A8]/15 transition-all text-xs"
                placeholder="Search products..."
              />
            </form>

            {/* Right Navigation */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Link
                href="/ai-assistant"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-105"
                style={{ background: "#00C2A8", color: "#0D1117" }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Chat</span>
              </Link>

              <Link
                href="/shop"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors hidden md:block px-2 py-1"
              >
                Shop
              </Link>

              <Link
                href="/study-hub"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors hidden lg:block px-2 py-1"
              >
                Study Hub
              </Link>

              <Link
                href="/blog"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors hidden lg:block px-2 py-1"
              >
                Blog
              </Link>

              <Link
                href="/tools"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors hidden lg:block px-2 py-1"
              >
                Tools
              </Link>

              <Link
                href="/news"
                className="text-sm font-medium text-white/60 hover:text-white transition-colors hidden xl:block px-2 py-1"
              >
                News
              </Link>

              {/* Account Dropdown */}
              <div ref={accountRef} className="relative hidden md:block">
                <button onClick={() => setAccountOpen(o => !o)}
                  className="flex items-center gap-1.5 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all">
                  {isLoggedIn ? (
                    <div className="w-7 h-7 rounded-full bg-[#00C2A8]/20 border border-[#00C2A8]/40 flex items-center justify-center text-[#00C2A8] text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <ChevronDown className={`w-3 h-3 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#161B22] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 py-2 z-50">
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-white/8">
                          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                          <p className="text-xs text-white/40 truncate">{user?.email}</p>
                          {isPro && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[#00C2A8]/15 border border-[#00C2A8]/30 rounded-full text-[#00C2A8] text-xs font-bold">
                              <Crown className="w-3 h-3" />PRO
                            </span>
                          )}
                        </div>
                        <Link href="/account" onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                          <Settings className="w-4 h-4" /> My Account
                        </Link>
                        <button
                          type="button"
                          onClick={() => { setAccountOpen(false); setShowSettings(true); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <Brain className="w-4 h-4" /> Cadus AI Settings
                        </button>
                        <Link href="/orders" onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                        <Link href="/my-reviews" onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                          <Star className="w-4 h-4" /> My Reviews
                        </Link>
                        <Link href="/orders/track" onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                          <MapPin className="w-4 h-4" /> Track Order
                        </Link>
                        <div className="border-t border-white/8 my-1" />
                        <div className="flex items-center gap-2 px-4 py-1.5">
                          <Link href="/seller/dashboard" onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors">
                            <Store className="w-3 h-3" /> Seller
                          </Link>
                          <span className="text-white/15">·</span>
                          <Link href="/admin" onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors">
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </Link>
                        </div>
                        <div className="border-t border-white/8 my-1" />
                        <button onClick={() => { logout(); setAccountOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-white/8">
                          <p className="text-sm text-white/50">Sign in to access your account, orders, and Cadus AI.</p>
                        </div>
                        <button onClick={openLogin}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                          <User className="w-4 h-4" /> Sign In
                        </button>
                        <button onClick={openSignup}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#00C2A8] hover:bg-[#00C2A8]/10 transition-colors font-medium">
                          <Sparkles className="w-4 h-4" /> Create Account
                        </button>
                        <div className="border-t border-white/8 my-1" />
                        <div className="flex items-center gap-2 px-4 py-1.5">
                          <Link href="/seller/register" onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/55 transition-colors">
                            <Store className="w-3 h-3" /> Sell
                          </Link>
                          <span className="text-white/15">·</span>
                          <Link href="/admin" onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/55 transition-colors">
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <NotificationBell />

              <Link href="/cart" className="relative p-2 text-white/60 hover:text-white hover:bg-white/8 rounded-xl transition-all">
                <ShoppingCart className="w-5 h-5" />
                {cart && cart.itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-[#0D1117] bg-[#00C2A8] rounded-full">
                    {cart.itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button onClick={() => setMobileOpen(o => !o)} className="md:hidden p-2 text-white/60 hover:text-white hover:bg-white/8 rounded-xl transition-all">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden border-t border-white/8 mt-3 pt-3 pb-4 space-y-1">
              <form onSubmit={handleSearch} className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#00C2A8]/50"
                  placeholder="Search products..." />
              </form>
              {[
                { href: "/shop", label: "Shop All Products" },
                { href: "/ai-assistant", label: "Start Chat (Cadus AI)" },
                { href: "/tools", label: "Clinical Tools" },
                { href: "/study-hub", label: "Study Hub" },
                { href: "/blog", label: "Blog" },
                { href: "/news", label: "Medical News" },
                { href: "/orders/track", label: "Track Order" },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-white/8 pt-2 mt-2">
                {isLoggedIn ? (
                  <button onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out ({user?.name})
                  </button>
                ) : (
                  <button onClick={() => { openLogin(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 rounded-lg transition-colors">
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
