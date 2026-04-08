import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, Sparkles, User, Star, MapPin, ShieldCheck, ChevronDown, Store, BookOpen, Newspaper, Crown, GraduationCap, LogOut, Settings, Package, X, Brain, Stethoscope, FlaskConical, Pill, Activity, Building2, GraduationCap as University, HeartPulse, Microscope, FileText, Syringe, Database, BadgeCheck, Calculator, Briefcase, MessageSquare, Smartphone, Bell, HeadphonesIcon, Megaphone, Download, Gift, ClipboardList, MoreHorizontal, Mic, MicOff, Sun, Moon, Globe } from "lucide-react";

const LANGS = ["EN", "HI", "TA", "TE", "KN"];

function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    try { return localStorage.getItem("aethex_theme") === "light" ? false : true; } catch { return true; }
  });
  const toggle = () => {
    setDark(d => {
      const next = !d;
      try { localStorage.setItem("aethex_theme", next ? "dark" : "light"); } catch {}
      document.documentElement.classList.toggle("aethex-light", !next);
      return next;
    });
  };
  return { dark, toggle };
}

function useVoiceSearch(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);
  const start = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.onresult = (e: any) => { onResult(e.results[0][0].transcript); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };
  const stop = () => { recRef.current?.stop(); setListening(false); };
  return { listening, start, stop };
}
import { useGetCart } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useUserAuth } from "@/hooks/use-user-auth";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/NotificationBell";
import { AuthModal } from "@/components/AuthModal";

export function BrandSwitcherBar() {
  const [location] = useLocation();
  const isCareers = location === "/jobs" || location.startsWith("/jobs");
  const isApp = location === "/app";
  const isColleges = location === "/colleges" || location.startsWith("/colleges/");
  const isHospitals = location === "/hospitals" || location.startsWith("/hospitals/");

  const tabs = [
    { href: "/jobs", label: "Careers", icon: Briefcase, active: isCareers },
    { href: "/app", label: "Mobile App", icon: Smartphone, active: isApp },
    { href: "/colleges", label: "Colleges", icon: GraduationCap, active: isColleges },
    { href: "/hospitals", label: "Hospitals", icon: Building2, active: isHospitals },
  ];

  return (
    <div data-brand-switcher className="no-print w-full" style={{ background: "linear-gradient(90deg, #020208 0%, #06060F 50%, #020208 100%)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8">
        {/* Left — sub-brand tabs */}
        <div className="flex items-center h-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link key={tab.href} href={tab.href}
                className="flex items-center gap-1.5 px-3.5 h-full text-[11px] font-semibold relative transition-colors select-none"
                style={{
                  color: tab.active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
                  borderBottom: tab.active ? "1.5px solid rgba(255,255,255,0.4)" : "1.5px solid transparent",
                  letterSpacing: "0.04em",
                }}>
                <Icon className="w-3 h-3" />
                {tab.label}
              </Link>
            );
          })}
        </div>
        {/* Right — trust badges */}
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.22)", letterSpacing: "0.1em" }}>
            🇮🇳 &nbsp;NMC · CDSCO · MCI Compliant
          </span>
        </div>
      </div>
    </div>
  );
}


const clinicalToolsMenu = [
  { href: "/tools/prescription", icon: FileText, label: "Prescription Writer", desc: "AI-powered Rx generator", color: "#007AFF" },
  { href: "/drug-interaction-checker", icon: Pill, label: "Drug Interactions", desc: "Check drug safety instantly", color: "#F59E0B" },
  { href: "/tools/dosage-calculator", icon: FlaskConical, label: "Dosage Calculator", desc: "Weight-based dose calculator", color: "#10B981" },
  { href: "/tools/differential-diagnosis", icon: Brain, label: "Differential Diagnosis", desc: "AI symptom analysis", color: "#8B5CF6" },
  { href: "/tools/lab-interpreter", icon: Microscope, label: "Lab Interpreter", desc: "Interpret investigation results", color: "#EF4444" },
  { href: "/tools/procedure-guide", icon: Syringe, label: "Procedure Guide", desc: "Step-by-step clinical procedures", color: "#06B6D4" },
];

const calculatorsMenu = [
  { id: "bmi", name: "Body Mass Index (BMI)" },
  { id: "egfr-ckd-epi", name: "eGFR (CKD-EPI 2021)" },
  { id: "curb65", name: "CURB-65 Pneumonia" },
  { id: "sofa", name: "SOFA Score (ICU)" },
  { id: "cha2ds2-vasc", name: "CHA₂DS₂-VASc Score" },
  { id: "child-pugh", name: "Child-Pugh Score" },
  { id: "wells-dvt", name: "Wells Score for DVT" },
  { id: "gcs", name: "Glasgow Coma Scale" },
  { id: "apgar", name: "APGAR Score" },
  { id: "qtc", name: "Corrected QT (QTc)" },
  { id: "anion-gap", name: "Anion Gap" },
  { id: "grace", name: "GRACE Score (ACS)" },
  { id: "heart-score", name: "HEART Score" },
  { id: "centor", name: "Centor Score" },
  { id: "parkland", name: "Parkland Formula (Burns)" },
  { id: "nihss", name: "NIH Stroke Scale" },
  { id: "bsa", name: "Body Surface Area (BSA)" },
  { id: "iv-fluid", name: "IV Fluid (Holliday-Segar)" },
  { id: "osmolality", name: "Serum Osmolality" },
  { id: "psi-port", name: "PSI / PORT Score" },
  { id: "wells-pe", name: "Wells Score for PE" },
];

const communityMenu = [
  { href: "/cases", icon: Stethoscope, label: "Clinical Case Library", desc: "10 cases with diagnosis reveal", color: "#EF4444" },
  { href: "/community", icon: MessageSquare, label: "Doctor Community", desc: "Peer forum — cases, NEET-PG, drugs", color: "#8B5CF6" },
  { href: "/jobs", icon: Briefcase, label: "Medical Jobs Board", desc: "20 hospital & clinic listings", color: "#10B981" },
];

function ToolsMegaMenu({ open, onToggle, onClose, dropdownRef, dark }: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  dark?: boolean;
}) {
  const [location] = useLocation();
  const active = location === "/tools" || location.startsWith("/tools/") || location === "/calculator";
  const [dropdownTop, setDropdownTop] = useState(140);

  const handleToggle = () => {
    if (!open) {
      const brandBar = document.querySelector("[data-brand-switcher]") as HTMLElement | null;
      const header = document.querySelector("header") as HTMLElement | null;
      const catBar = document.querySelector("[data-category-bar]") as HTMLElement | null;
      const bH = brandBar ? brandBar.getBoundingClientRect().height : 0;
      const hH = header ? header.getBoundingClientRect().height : 64;
      const cH = catBar ? catBar.getBoundingClientRect().height : 44;
      setDropdownTop(Math.round(bH + hH + cH));
    }
    onToggle();
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-3 h-full shrink-0 text-xs font-medium relative transition-all rounded-full"
        style={{
          color: active || open ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.45)",
          background: active || open ? "rgba(255,255,255,0.09)" : "transparent",
        }}
      >
        <Stethoscope className="w-3.5 h-3.5 shrink-0" />
        <span>Clinical Tools</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="fixed z-50 rounded-2xl overflow-hidden"
          style={{ top: dropdownTop + 6, right: 24, width: 740, background: "#0A0A14", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04) inset" }}>
          {/* top accent line */}
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
          <div className="flex divide-x" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="flex-shrink-0 w-72 p-3 flex flex-col gap-0.5">
              <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>Clinical Tools</p>
                <Link href="/tools" onClick={onClose} className="text-[10px] font-semibold transition-colors hover:text-white/70" style={{ color: "rgba(255,255,255,0.35)" }}>View all →</Link>
              </div>
              {clinicalToolsMenu.map(item => (
                <Link key={item.href} href={item.href} onClick={onClose}
                  className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `rgba(255,255,255,0.05)`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}28` }}>
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-tight" style={{ color: "rgba(255,255,255,0.9)" }}>{item.label}</p>
                    <p className="text-[10px] leading-tight mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.32)" }}>{item.desc}</p>
                  </div>
                </Link>
              ))}
              <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest px-2 py-1.5 mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>Community &amp; Careers</p>
                {communityMenu.map(item => (
                  <Link key={item.href} href={item.href} onClick={onClose}
                    className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all"
                    style={{ background: "transparent" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `rgba(255,255,255,0.05)`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}18`, border: `1px solid ${item.color}28` }}>
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight" style={{ color: "rgba(255,255,255,0.9)" }}>{item.label}</p>
                      <p className="text-[10px] leading-tight mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.32)" }}>{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex-1 p-3">
              <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>Medical Calculators</p>
                <Link href="/calculator" onClick={onClose} className="text-[10px] font-semibold transition-colors hover:text-white/70" style={{ color: "rgba(255,255,255,0.35)" }}>View all →</Link>
              </div>
              <div className="grid grid-cols-2 gap-px">
                {calculatorsMenu.map((calc) => {
                  const isActive = location === `/calculator` && new URLSearchParams(window.location.search).get("id") === calc.id;
                  return (
                    <Link key={calc.id} href={`/calculator?id=${calc.id}`} onClick={onClose}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all text-xs"
                      style={{ color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)", background: isActive ? "rgba(255,255,255,0.08)" : "transparent", fontWeight: isActive ? 600 : 400 }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                      <Calculator className="w-3 h-3 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
                      {calc.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const institutionsMenu = [
  { href: "/colleges", icon: University, label: "Medical Colleges", desc: "MBBS, MD, MS admissions", color: "#007AFF" },
  { href: "/hospitals", icon: Building2, label: "Hospitals", desc: "Top hospitals & networks", color: "#EF4444" },
  { href: "/institutions?type=pg-entrance", icon: GraduationCap, label: "PG Entrance", desc: "NEET PG, NEXT coaching", color: "#F59E0B" },
  { href: "/institutions?type=research", icon: Microscope, label: "Research Institutes", desc: "ICMR, AIIMS, CMC & more", color: "#8B5CF6" },
  { href: "/institutions?type=nursing", icon: HeartPulse, label: "Nursing Colleges", desc: "BSc, MSc Nursing programs", color: "#10B981" },
  { href: "/institutions?type=pharmacy", icon: Pill, label: "Pharmacy Colleges", desc: "B.Pharm, Pharm.D programs", color: "#06B6D4" },
];

function InstitutionsDropdown({ open, onToggle, onClose, dropdownRef }: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [location] = useLocation();
  const active = location === "/institutions" || location.startsWith("/institutions") || location === "/colleges" || location === "/hospitals";
  const [dropdownTop, setDropdownTop] = useState(140);

  const handleToggle = () => {
    if (!open) {
      const brandBar = document.querySelector("[data-brand-switcher]") as HTMLElement | null;
      const header = document.querySelector("header") as HTMLElement | null;
      const catBar = document.querySelector("[data-category-bar]") as HTMLElement | null;
      const bH = brandBar ? brandBar.getBoundingClientRect().height : 0;
      const hH = header ? header.getBoundingClientRect().height : 64;
      const cH = catBar ? catBar.getBoundingClientRect().height : 44;
      setDropdownTop(Math.round(bH + hH + cH));
    }
    onToggle();
  };

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 px-3 h-full shrink-0 text-xs font-medium relative transition-all rounded-full whitespace-nowrap"
        style={{
          color: active || open ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.45)",
          background: active || open ? "rgba(255,255,255,0.09)" : "transparent",
        }}
      >
        <Building2 className="w-3.5 h-3.5 shrink-0" />
        <span>Institutions</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="fixed z-50 rounded-2xl overflow-hidden"
          style={{
            top: dropdownTop + 6,
            right: 24,
            width: 480,
            background: "#0A0A14",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04) inset",
          }}
        >
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
          <div className="px-4 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>Colleges &amp; Hospitals</p>
          </div>
          <div className="p-3 grid grid-cols-2 gap-1">
            {institutionsMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{ background: "transparent" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `rgba(255,255,255,0.05)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}28` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "rgba(255,255,255,0.9)" }}>{item.label}</p>
                  <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.32)" }}>{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="px-4 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
            <Link href="/institutions" onClick={onClose} className="text-xs font-semibold transition-colors hover:text-white/60" style={{ color: "rgba(255,255,255,0.35)" }}>
              View all Colleges &amp; Hospitals →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

const loginMenuItems = [
  { href: "/account", icon: User, label: "My Profile" },
  { href: "/pricing", icon: Crown, label: "Cadus AI Pro" },
  { href: "/orders", icon: Package, label: "My Orders" },
  { href: "/cme-hub", icon: GraduationCap, label: "My CME Certificates" },
  { href: "/verification", icon: BadgeCheck, label: "Doctor Verification Badge" },
  { href: "/my-reviews", icon: Star, label: "My Reviews" },
  { href: "/orders/track", icon: MapPin, label: "Track Order" },
  { href: "/settings", icon: Bell, label: "Notification Preferences" },
  { href: "/contact", icon: HeadphonesIcon, label: "24x7 Customer Care" },
  { href: "/enterprise", icon: Megaphone, label: "Advertise on Aethex" },
  { href: "/app", icon: Download, label: "Download App" },
];

const categories = [
  { href: "/", icon: Star, label: "For You", exact: true, authOnly: false },
  { href: "/shop", icon: Store, label: "Shop", authOnly: false },
  { href: "/books", icon: BookOpen, label: "Books", authOnly: false },
  { href: "/study-hub", icon: GraduationCap, label: "Study Hub", authOnly: false },
  { href: "/cme-hub", icon: Crown, label: "CME Hub", authOnly: false },
  { href: "/neet-pg", icon: FileText, label: "NEET-PG", authOnly: false },
  { href: "/drug-reference", icon: Pill, label: "Drug Ref", authOnly: false },
  { href: "/ai-assistant", icon: Brain, label: "Cadus AI", authOnly: false },
  { href: "/pricing", icon: Crown, label: "Pricing", authOnly: false },
  { href: "/calculator", icon: Calculator, label: "Calculators", authOnly: true },
  { href: "/cases", icon: Activity, label: "Cases", authOnly: true },
  { href: "/community", icon: MessageSquare, label: "Community", authOnly: true },
  { href: "/jobs", icon: Briefcase, label: "Jobs", authOnly: true },
  { href: "/blog", icon: Newspaper, label: "Blog", authOnly: true },
  { href: "/news", icon: Megaphone, label: "News", authOnly: true },
];

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
  const [lang, setLang] = useState(() => { try { return localStorage.getItem("aethex_lang") || "EN"; } catch { return "EN"; } });
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { dark, toggle: toggleDark } = useDarkMode();
  const { listening: voiceListening, start: startVoice, stop: stopVoice } = useVoiceSearch((text) => {
    setSearchQuery(text);
    setLocation(`/shop?search=${encodeURIComponent(text)}`);
  });
  const accountRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const institutionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
      if (institutionsRef.current && !institutionsRef.current.contains(e.target as Node)) setInstitutionsOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
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

  const cartCount = cart?.itemCount ?? 0;

  return (
    <>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultMode={authMode} />

      {/* ── MAIN NAV HEADER ── */}
      <header
        className="no-print transition-all duration-500"
        style={{
          background: isScrolled ? "rgba(3,3,10,0.99)" : "rgba(4,4,12,0.97)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          height: 64,
          display: "flex",
          alignItems: "center",
          borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0.04)",
          boxShadow: isScrolled ? "0 4px 40px rgba(0,0,0,0.6)" : "none",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">

            {/* ── LOGO ── */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative">
                <img
                  src={`${import.meta.env.BASE_URL}aethex-logo.jpg`}
                  alt="Aethex"
                  className="w-8 h-8 rounded-lg object-contain transition-all group-hover:scale-105"
                  style={{ filter: "brightness(1.15) contrast(1.05) drop-shadow(0 0 8px rgba(255,255,255,0.12))" }}
                />
              </div>
              <div className="flex flex-col leading-none">
                <span style={{
                  fontFamily: "'Pinyon Script', 'Great Vibes', cursive",
                  fontWeight: 400,
                  fontSize: 32,
                  letterSpacing: "0.02em",
                  color: "#E8E8F4",
                  lineHeight: 1,
                }}>Aethex</span>
                <span className="hidden lg:block" style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginTop: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Medical Platform
                </span>
              </div>
            </Link>

            {/* Separator */}
            <div className="hidden lg:block h-7 w-px shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />

            {/* ── SEARCH BAR ── */}
            <form onSubmit={handleSearch} className="flex-1 relative max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4" style={{ color: "rgba(255,255,255,0.28)" }} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-10 py-2.5 text-sm focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.055)",
                  color: "#EEEEF8",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 999,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: "0 0 0 0 transparent",
                }}
                onFocus={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; }}
                onBlur={e => { e.currentTarget.style.background = "rgba(255,255,255,0.055)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
                placeholder="Search drugs, products, books…"
              />
              <button
                type="button"
                onClick={voiceListening ? stopVoice : startVoice}
                className="absolute inset-y-0 right-0 pr-4 flex items-center transition-all"
                title={voiceListening ? "Stop listening" : "Search by voice"}>
                {voiceListening
                  ? <Mic className="h-4 w-4 animate-pulse" style={{ color: "#ef4444" }} />
                  : <Mic className="h-4 w-4" style={{ color: "rgba(255,255,255,0.28)" }} />}
              </button>
            </form>

            {/* ── RIGHT ACTIONS ── */}
            <div className="flex items-center gap-1.5 shrink-0">

              {/* Try Cadus AI — primary teal CTA */}
              <Link
                href="/ai-assistant"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all hover:opacity-90 active:scale-95 shrink-0"
                style={{
                  background: "#00C2A8",
                  color: "#FFFFFF",
                  boxShadow: "0 0 20px rgba(0,194,168,0.28), 0 2px 8px rgba(0,194,168,0.15)",
                  letterSpacing: "0.01em",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Try Cadus AI
              </Link>

              {/* Language selector */}
              <div ref={langRef} className="relative hidden sm:block">
                <button
                  onClick={() => setLangOpen(o => !o)}
                  className="flex items-center gap-1 px-2.5 py-2 rounded-full text-xs font-semibold transition-all hover:bg-white/8"
                  style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Globe className="w-3.5 h-3.5" />{lang}
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-2 w-32 z-[70] rounded-xl shadow-2xl overflow-hidden py-1"
                    style={{ background: "#141420", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {LANGS.map(l => (
                      <button key={l} onClick={() => { setLang(l); try { localStorage.setItem("aethex_lang", l); } catch {} setLangOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs transition-all"
                        style={{ color: lang === l ? "#00C2A8" : "rgba(255,255,255,0.7)", background: lang === l ? "rgba(0,194,168,0.08)" : "transparent" }}>
                        {l === "EN" ? "🇬🇧 English" : l === "HI" ? "🇮🇳 हिन्दी" : l === "TA" ? "🇮🇳 தமிழ்" : l === "TE" ? "🇮🇳 తెలుగు" : "🇮🇳 ಕನ್ನಡ"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark/Light mode */}
              <button onClick={toggleDark} title={dark ? "Light mode" : "Dark mode"}
                className="p-2 rounded-full transition-all hidden sm:flex items-center justify-center hover:bg-white/8"
                style={{ color: "rgba(255,255,255,0.5)" }}>
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Notification bell */}
              <div className="hidden sm:block">
                <NotificationBell />
              </div>

              {/* Account */}
              <div ref={accountRef} className="relative">
                <button
                  onClick={() => setAccountOpen(o => !o)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-full transition-all hover:bg-white/8"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background: isLoggedIn ? "rgba(0,122,255,0.18)" : "rgba(255,255,255,0.07)",
                      border: `1px solid ${isLoggedIn ? "rgba(0,122,255,0.3)" : "rgba(255,255,255,0.12)"}`,
                    }}
                  >
                    <User className="w-3.5 h-3.5" style={{ color: isLoggedIn ? "#60A5FA" : "rgba(255,255,255,0.7)" }} />
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold" style={{ color: "rgba(255,255,255,0.82)" }}>
                    {isLoggedIn ? (user?.name?.split(" ")[0] || "Account") : "Sign In"}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${accountOpen ? "rotate-180" : ""}`} style={{ color: "rgba(255,255,255,0.4)" }} />
                </button>

                {accountOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 z-[70] rounded-2xl shadow-2xl overflow-hidden"
                    style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 64px rgba(0,0,0,0.8)" }}
                  >
                    <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
                    {!isLoggedIn ? (
                      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>New here?</span>
                        <button onClick={openSignup} className="text-sm font-bold" style={{ color: "#00C2A8" }}>Create Account</button>
                      </div>
                    ) : (
                      <div className="px-4 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                          {user?.verified && <BadgeCheck className="w-3.5 h-3.5 shrink-0" style={{ color: "#007AFF" }} />}
                        </div>
                        <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{user?.email}</p>
                        {isPro && (
                          <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(255,180,0,0.12)", color: "#FFB400", border: "1px solid rgba(255,180,0,0.2)" }}>
                            <Crown className="w-3 h-3" /> PRO Member
                          </span>
                        )}
                      </div>
                    )}

                    <div className="py-1">
                      {loginMenuItems.map(({ href, icon: Icon, label }) => (
                        <Link
                          key={href} href={href}
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: "rgba(255,255,255,0.78)" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                        >
                          <Icon className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
                          {label}
                        </Link>
                      ))}
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                      {isLoggedIn ? (
                        <button
                          onClick={() => { logout(); setAccountOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors"
                          style={{ color: "#FF453A" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,69,58,0.06)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      ) : (
                        <button
                          onClick={openLogin}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors"
                          style={{ color: "#60A5FA" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(96,165,250,0.06)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                        >
                          <User className="w-4 h-4" /> Sign In
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:bg-white/8 relative"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[17px] h-[17px] px-0.5 text-[9px] font-bold text-white rounded-full flex items-center justify-center leading-none" style={{ background: "#007AFF" }}>
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden lg:inline text-sm font-semibold">Cart</span>
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="sm:hidden p-2 rounded-full transition-all hover:bg-white/8"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Thin accent line below header */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 80%, transparent 100%)" }} />

      {/* ── CATEGORY PILL BAR ── */}
      <div
        data-category-bar
        className="no-print overflow-x-auto"
        style={{
          background: "rgba(3,3,10,0.98)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          scrollbarWidth: "none",
          height: 44,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-full gap-1">
          {categories.filter(cat => !cat.authOnly || isLoggedIn).map((cat) => {
            const active = cat.exact
              ? location === cat.href
              : location === cat.href || location.startsWith(cat.href + "/");
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 text-xs transition-all whitespace-nowrap"
                style={{
                  color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)",
                  background: active ? "rgba(255,255,255,0.1)" : "transparent",
                  fontWeight: active ? 600 : 450,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  letterSpacing: "0.02em",
                  border: active ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.72)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; }}}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.label}</span>
              </Link>
            );
          })}

          {/* Separator before dropdowns */}
          {isLoggedIn && <div className="h-5 w-px mx-1 shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />}

          {isLoggedIn && (
            <ToolsMegaMenu
              open={toolsOpen}
              onToggle={() => setToolsOpen(o => !o)}
              onClose={() => setToolsOpen(false)}
              dropdownRef={toolsRef}
              dark
            />
          )}

          {isLoggedIn && (
            <InstitutionsDropdown
              open={institutionsOpen}
              onToggle={() => setInstitutionsOpen(o => !o)}
              onClose={() => setInstitutionsOpen(false)}
              dropdownRef={institutionsRef}
            />
          )}
        </div>
      </div>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-x-0 bottom-0 z-50 overflow-y-auto"
          style={{ top: 140, background: "#0C0C18", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="max-w-7xl mx-auto px-4 py-5 space-y-1">
            {/* Mobile search */}
            <form onSubmit={e => { handleSearch(e); setMobileOpen(false); }} className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF" }}
                placeholder="Search drugs, products, books…" />
            </form>

            {/* Try Cadus AI — mobile CTA */}
            <Link href="/ai-assistant" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold mb-3"
              style={{ background: "#00C2A8", color: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,194,168,0.25)" }}>
              <Sparkles className="w-4 h-4" /> Try Cadus AI
            </Link>

            <p className="text-[10px] font-bold uppercase tracking-widest px-1 pt-1 pb-1.5" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em" }}>Navigation</p>
            {[
              { href: "/shop", label: "Shop All Products", icon: Store },
              { href: "/books", label: "Medical Books", icon: BookOpen },
              { href: "/study-hub", label: "Study Hub", icon: GraduationCap },
              { href: "/cme-hub", label: "CME Hub", icon: Crown },
              { href: "/neet-pg", label: "NEET-PG", icon: FileText },
              { href: "/drug-reference", label: "Drug Reference", icon: Pill },
              { href: "/drug-interaction-checker", label: "Drug Interactions", icon: FlaskConical },
              { href: "/calculator", label: "Medical Calculators", icon: Calculator },
              { href: "/cases", label: "Clinical Case Library", icon: Stethoscope },
              { href: "/community", label: "Doctor Community", icon: MessageSquare },
              { href: "/jobs", label: "Medical Jobs Board", icon: Briefcase },
              { href: "/news", label: "Medical News", icon: Newspaper },
              { href: "/pricing", label: "Pricing", icon: Crown },
              { href: "/institutions", label: "Colleges & Hospitals", icon: Building2 },
            ].map(item => {
              const active = location === item.href || location.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-3 text-sm font-medium rounded-xl transition-all"
                  style={{
                    color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)",
                    background: active ? "rgba(255,255,255,0.08)" : "transparent",
                    border: active ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                  }}>
                  <Icon className="w-4 h-4 shrink-0" style={{ color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)" }} />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-3 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {isLoggedIn ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-3.5 py-3 mb-1">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,122,255,0.15)", border: "1px solid rgba(0,122,255,0.25)" }}>
                      <User className="w-4 h-4" style={{ color: "#60A5FA" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{user?.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3.5 py-3 text-sm rounded-xl transition-colors"
                    style={{ color: "#FF453A" }}>
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { openLogin(); setMobileOpen(false); }}
                    className="flex-1 py-3 text-sm font-semibold rounded-xl transition-all"
                    style={{ color: "rgba(255,255,255,0.82)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    Sign In
                  </button>
                  <button onClick={() => { openSignup(); setMobileOpen(false); }}
                    className="flex-1 py-3 text-sm font-bold rounded-xl transition-all"
                    style={{ color: "#FFFFFF", background: "#007AFF" }}>
                    Sign Up Free
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
