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
  const isMain = !isCareers && !isApp && !isColleges && !isHospitals;

  const tabs = [
    { href: "/jobs", label: "Careers", icon: Briefcase, useLogoImg: false, active: isCareers },
    { href: "/app", label: "Mobile App", icon: Smartphone, useLogoImg: false, active: isApp },
    { href: "/colleges", label: "Colleges", icon: GraduationCap, useLogoImg: false, active: isColleges },
    { href: "/hospitals", label: "Hospitals", icon: Building2, useLogoImg: false, active: isHospitals },
  ];

  return (
    <div data-brand-switcher className="no-print w-full" style={{ background: "linear-gradient(90deg,#060608 0%,#0D0D18 60%,#080812 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-9">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link key={tab.href} href={tab.href}
              className="flex items-center gap-1.5 px-3.5 h-full text-xs font-semibold relative transition-all select-none"
              style={{ color: tab.active ? "#00C2A8" : "rgba(255,255,255,0.45)", borderBottom: tab.active ? "2px solid #00C2A8" : "2px solid transparent", marginBottom: -1 }}>
              {tab.useLogoImg ? (
                <img src={`${import.meta.env.BASE_URL}aethex-logo.jpg`} alt="Aethex" className="w-4 h-4 rounded object-contain" style={{ filter: "brightness(1.1)" }} />
              ) : Icon ? <Icon className="w-3.5 h-3.5" /> : null}
              {tab.label}
            </Link>
          );
        })}
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
  dropdownRef: React.RefObject<HTMLDivElement>;
  dark?: boolean;
}) {
  const [location] = useLocation();
  const active = location === "/tools" || location.startsWith("/tools/") || location === "/calculator";
  const [dropdownTop, setDropdownTop] = useState(148);

  const handleToggle = () => {
    if (!open) {
      const brandBar = document.querySelector("[data-brand-switcher]") as HTMLElement | null;
      const announcement = document.querySelector("[data-navbar-announcement]") as HTMLElement | null;
      const header = document.querySelector("header") as HTMLElement | null;
      const catBar = document.querySelector("[data-category-bar]") as HTMLElement | null;
      const bH = brandBar ? brandBar.getBoundingClientRect().height : 0;
      const aH = announcement ? announcement.getBoundingClientRect().height : 0;
      const hH = header ? header.getBoundingClientRect().height : 56;
      const cH = catBar ? catBar.getBoundingClientRect().height : 48;
      setDropdownTop(Math.round(bH + aH + hH + cH));
    }
    onToggle();
  };

  const textColor = dark ? "rgba(255,255,255,0.8)" : "#636366";
  const activeColor = dark ? "#60A5FA" : "#007AFF";
  const activeBg = dark ? "rgba(96,165,250,0.12)" : "rgba(0,122,255,0.08)";
  const hoverBg = dark ? "rgba(255,255,255,0.06)" : "rgba(60,60,67,0.06)";

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={handleToggle}
        className="flex flex-col items-center justify-center px-4 h-12 shrink-0 text-xs relative transition-all"
        style={{ color: active ? activeColor : textColor, borderBottom: active ? `2px solid ${activeColor}` : "2px solid transparent" }}
      >
        <Stethoscope className="w-4 h-4 mb-0.5" />
        Tools
      </button>

      {open && (
        <div className="fixed z-50 rounded-b-2xl overflow-hidden"
          style={{ top: dropdownTop, right: 24, width: 740, background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.08)", borderTop: "2px solid #00C2A8", boxShadow: "0 16px 48px rgba(0,0,0,0.7)" }}>
          <div className="flex divide-x" style={{ divideColor: "rgba(255,255,255,0.05)" }}>
            <div className="flex-shrink-0 w-72 p-3 flex flex-col gap-0.5">
              <div className="flex items-center justify-between px-2 py-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Clinical Tools</p>
                <Link href="/tools" onClick={onClose} className="text-[10px] font-semibold" style={{ color: "#00C2A8" }}>View all →</Link>
              </div>
              {clinicalToolsMenu.map(item => (
                <Link key={item.href} href={item.href} onClick={onClose}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-xl transition-all"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `rgba(255,255,255,0.05)`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                    <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold leading-tight" style={{ color: "rgba(255,255,255,0.88)" }}>{item.label}</p>
                    <p className="text-[10px] leading-tight mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{item.desc}</p>
                  </div>
                </Link>
              ))}
              <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wider px-2 py-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>Community & Careers</p>
                {communityMenu.map(item => (
                  <Link key={item.href} href={item.href} onClick={onClose}
                    className="flex items-center gap-2.5 px-2 py-2 rounded-xl transition-all"
                    style={{ background: "transparent" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `rgba(255,255,255,0.05)`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                      <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight" style={{ color: "rgba(255,255,255,0.88)" }}>{item.label}</p>
                      <p className="text-[10px] leading-tight mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex-1 p-3">
              <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Medical Calculators</p>
                <Link href="/calculator" onClick={onClose} className="text-[10px] font-semibold" style={{ color: "#00C2A8" }}>View all →</Link>
              </div>
              <div className="grid grid-cols-2 gap-0.5">
                {calculatorsMenu.map((calc) => {
                  const isActive = location === `/calculator` && new URLSearchParams(window.location.search).get("id") === calc.id;
                  return (
                    <Link key={calc.id} href={`/calculator?id=${calc.id}`} onClick={onClose}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-xs"
                      style={{ color: isActive ? "#00C2A8" : "rgba(255,255,255,0.75)", background: isActive ? "rgba(0,194,168,0.1)" : "transparent", fontWeight: isActive ? 600 : 400 }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                      <Calculator className="w-3 h-3 shrink-0" style={{ color: "#00C2A8", opacity: 0.7 }} />
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
  dropdownRef: React.RefObject<HTMLDivElement>;
}) {
  const [location] = useLocation();
  const active = location === "/institutions" || location.startsWith("/institutions") || location === "/colleges" || location === "/hospitals";
  const [dropdownTop, setDropdownTop] = useState(148);

  const handleToggle = () => {
    if (!open) {
      const brandBar = document.querySelector("[data-brand-switcher]") as HTMLElement | null;
      const announcement = document.querySelector("[data-navbar-announcement]") as HTMLElement | null;
      const header = document.querySelector("header") as HTMLElement | null;
      const catBar = document.querySelector("[data-category-bar]") as HTMLElement | null;
      const bH = brandBar ? brandBar.getBoundingClientRect().height : 0;
      const aH = announcement ? announcement.getBoundingClientRect().height : 0;
      const hH = header ? header.getBoundingClientRect().height : 56;
      const cH = catBar ? catBar.getBoundingClientRect().height : 52;
      setDropdownTop(Math.round(bH + aH + hH + cH));
    }
    onToggle();
  };

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      <button
        onClick={handleToggle}
        className="flex flex-col items-center justify-center px-4 h-full text-xs font-medium relative transition-all whitespace-nowrap"
        style={{
          color: active || open ? "#60A5FA" : "rgba(255,255,255,0.65)",
          borderBottom: active || open ? "2px solid #60A5FA" : "2px solid transparent",
          minWidth: 72,
          height: 52,
        }}
      >
        <Building2 className="w-[18px] h-[18px] mb-0.5" />
        <span className="flex items-center gap-0.5">
          Colleges &amp; Hospitals <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open && (
        <div
          className="fixed z-50 rounded-b-2xl overflow-hidden"
          style={{
            top: dropdownTop,
            right: 24,
            width: 480,
            background: "#0E0E1A",
            border: "1px solid rgba(255,255,255,0.08)",
            borderTop: "2px solid #00C2A8",
            boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
          }}
        >
          <div className="px-4 pt-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Colleges &amp; Hospitals</p>
          </div>
          <div className="p-3 grid grid-cols-2 gap-1">
            {institutionsMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: "transparent" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `rgba(255,255,255,0.05)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "rgba(255,255,255,0.88)" }}>{item.label}</p>
                  <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="px-4 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <Link href="/institutions" onClick={onClose} className="text-xs font-semibold" style={{ color: "#00C2A8" }}>
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

const moreMenuItems = [
  { href: "/seller/register", icon: Store, label: "List Your Practice" },
  { href: "/settings", icon: Bell, label: "Notification Settings" },
  { href: "/contact", icon: HeadphonesIcon, label: "24x7 Customer Care" },
  { href: "/enterprise", icon: Megaphone, label: "Advertise on Aethex" },
];

export function Navbar() {
  const [location, setLocation] = useLocation();
  const sessionId = useSession();
  const { user, isLoggedIn, isPro, logout } = useUserAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
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
  const moreRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const institutionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
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

      {/* ── CATEGORY SCROLL BAR — moved above main nav ── */}
      <div data-category-bar className="no-print overflow-x-auto" style={{ background: "rgba(4,4,8,0.98)", borderBottom: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "none" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-stretch" style={{ height: 44 }}>
          {categories.filter(cat => !cat.authOnly || isLoggedIn).map((cat) => {
            const active = cat.exact
              ? location === cat.href
              : location === cat.href || location.startsWith(cat.href + "/");
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex items-center gap-1.5 px-3.5 shrink-0 text-xs font-medium relative transition-all whitespace-nowrap"
                style={{
                  color: active ? "#00C2A8" : "rgba(255,255,255,0.45)",
                  borderBottom: active ? "2px solid #00C2A8" : "2px solid transparent",
                  letterSpacing: "0.04em",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.8)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)"; }}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.label}</span>
              </Link>
            );
          })}

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

      {/* ── MAIN NAV BAR — luxury glassmorphic ── */}
      <header
        className="no-print transition-all duration-500"
        style={{
          background: isScrolled ? "rgba(4,4,8,0.98)" : "rgba(4,4,8,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          height: 60,
          display: "flex",
          alignItems: "center",
          borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(255,255,255,0.03)",
          boxShadow: isScrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">

            {/* Logo — wordmark style */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 lg:hidden">
              <img src={`${import.meta.env.BASE_URL}aethex-logo.jpg`} alt="Aethex" className="w-7 h-7 rounded object-contain" style={{ filter: "brightness(1.15) contrast(1.05)" }} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 20, letterSpacing: "0.08em", color: "#EEEEF8" }}>AETHEX</span>
            </Link>

            {/* Logo on desktop */}
            <Link href="/" className="items-center gap-2.5 shrink-0 hidden lg:flex">
              <img src={`${import.meta.env.BASE_URL}aethex-logo.jpg`} alt="Aethex" className="w-7 h-7 rounded object-contain" style={{ filter: "brightness(1.15) contrast(1.05)" }} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 20, letterSpacing: "0.08em", color: "#EEEEF8" }}>AETHEX</span>
            </Link>

            {/* Search Bar — refined */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-9 py-2 text-sm focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", color: "#EEEEF8", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                placeholder="Search drugs, products, books…"
              />
              <button type="button" onClick={voiceListening ? stopVoice : startVoice}
                className="absolute inset-y-0 right-0 pr-3 flex items-center transition-all"
                title={voiceListening ? "Stop listening" : "Search by voice"}>
                {voiceListening
                  ? <Mic className="h-3.5 w-3.5 animate-pulse" style={{ color: "#ef4444" }} />
                  : <Mic className="h-3.5 w-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />}
              </button>
            </form>

            {/* ── RIGHT ACTIONS ── */}
            <div className="flex items-center gap-1 shrink-0">

              {/* Dark/Light mode toggle */}
              <button onClick={toggleDark} title={dark ? "Switch to light mode" : "Switch to dark mode"}
                className="p-2 rounded transition-all hidden sm:flex items-center justify-center hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.7)" }}>
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Language selector */}
              <div ref={langRef} className="relative hidden sm:block">
                <button onClick={() => setLangOpen(o => !o)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded text-xs font-semibold transition-all hover:bg-white/10"
                  style={{ color: "rgba(255,255,255,0.7)" }}>
                  <Globe className="w-3.5 h-3.5" />{lang}
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-1 w-28 z-[70] rounded shadow-2xl overflow-hidden py-1"
                    style={{ background: "#212121", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {LANGS.map(l => (
                      <button key={l} onClick={() => { setLang(l); try { localStorage.setItem("aethex_lang", l); } catch {} setLangOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm transition-all"
                        style={{ color: lang === l ? "#007AFF" : "rgba(255,255,255,0.75)", background: lang === l ? "rgba(0,122,255,0.1)" : "transparent" }}>
                        {l === "EN" ? "🇬🇧 English" : l === "HI" ? "🇮🇳 हिन्दी" : l === "TA" ? "🇮🇳 தமிழ்" : l === "TE" ? "🇮🇳 తెలుగు" : "🇮🇳 ಕನ್ನಡ"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Login dropdown */}
              <div ref={accountRef} className="relative">
                <button
                  onClick={() => setAccountOpen(o => !o)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-semibold text-white hover:bg-white/10 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {isLoggedIn ? (user?.name?.split(" ")[0] || "Account") : "Login"}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>

                {accountOpen && (
                  <div
                    className="absolute right-0 mt-1 w-64 z-[70] rounded shadow-2xl overflow-hidden"
                    style={{ background: "#212121", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    {/* Header */}
                    {!isLoggedIn ? (
                      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>New customer?</span>
                        <button onClick={openSignup} className="text-sm font-bold" style={{ color: "#007AFF" }}>Sign Up</button>
                      </div>
                    ) : (
                      <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                          {user?.verified && <BadgeCheck className="w-3.5 h-3.5 shrink-0" style={{ color: "#007AFF" }} />}
                        </div>
                        <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.45)" }}>{user?.email}</p>
                        {isPro && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(0,194,168,0.15)", color: "#00C2A8" }}>
                            <Crown className="w-3 h-3" />PRO
                          </span>
                        )}
                      </div>
                    )}

                    {/* Menu items */}
                    {loginMenuItems.map(({ href, icon: Icon, label }) => (
                      <Link
                        key={href} href={href}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: "rgba(255,255,255,0.82)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                      >
                        <Icon className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.45)" }} />
                        {label}
                      </Link>
                    ))}

                    {/* Footer */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      {isLoggedIn ? (
                        <button
                          onClick={() => { logout(); setAccountOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: "#FF453A" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,69,58,0.08)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      ) : (
                        <button
                          onClick={openLogin}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors"
                          style={{ color: "#007AFF" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,122,255,0.08)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                        >
                          <User className="w-4 h-4" /> Sign In
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* More dropdown — logged-in only */}
              {isLoggedIn && <div ref={moreRef} className="relative hidden sm:block">
                <button
                  onClick={() => setMoreOpen(o => !o)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded text-sm font-semibold text-white hover:bg-white/10 transition-all"
                >
                  More <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                </button>

                {moreOpen && (
                  <div
                    className="absolute right-0 mt-1 w-56 z-[70] rounded shadow-2xl overflow-hidden"
                    style={{ background: "#212121", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <p className="px-4 py-2.5 text-sm font-bold text-white" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>More</p>
                    {moreMenuItems.map(({ href, icon: Icon, label }) => (
                      <Link
                        key={href} href={href}
                        onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm transition-colors"
                        style={{ color: "rgba(255,255,255,0.82)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                      >
                        <Icon className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.45)" }} />
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>}

              {/* Notification */}
              <div className="hidden sm:block">
                <NotificationBell />
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold text-white hover:bg-white/10 transition-all relative"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white rounded-full flex items-center justify-center" style={{ background: "#007AFF" }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="sm:hidden p-2 rounded text-white hover:bg-white/10 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-x-0 bottom-0 z-50 overflow-y-auto"
          style={{ top: 140, background: "#1C1C1E", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <form onSubmit={e => { handleSearch(e); setMobileOpen(false); }} className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#636366" }} />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none"
                style={{ background: "#2C2C2E", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF" }}
                placeholder="Search products..." />
            </form>

            <p className="text-[10px] font-bold uppercase tracking-wider px-3 pt-1 pb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Navigation</p>
            {[
              { href: "/shop", label: "Shop All Products" },
              { href: "/books", label: "Medical Books" },
              { href: "/ai-assistant", label: "Try Cadus AI" },
              { href: "/study-hub", label: "Study Hub" },
              { href: "/cme-hub", label: "CME Hub" },
              { href: "/neet-pg", label: "NEET-PG" },
              { href: "/drug-reference", label: "Drug Reference" },
              { href: "/drug-interaction-checker", label: "Drug Interactions" },
              { href: "/calculator", label: "Medical Calculators" },
              { href: "/cases", label: "Clinical Case Library" },
              { href: "/pricing", label: "Pricing" },
              { href: "/institutions", label: "Colleges & Hospitals" },
              { href: "/orders/track", label: "Track Order" },
            ].map(item => {
              const active = location === item.href || location.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all"
                  style={{ color: active ? "#60A5FA" : "rgba(255,255,255,0.75)", background: active ? "rgba(96,165,250,0.1)" : "transparent" }}>
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-3 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {isLoggedIn ? (
                <button onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl transition-colors"
                  style={{ color: "#FF453A" }}>
                  <LogOut className="w-4 h-4" /> Sign Out ({user?.name})
                </button>
              ) : (
                <>
                  <button onClick={() => { openLogin(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl transition-colors"
                    style={{ color: "rgba(255,255,255,0.75)" }}>
                    <User className="w-4 h-4" /> Sign In
                  </button>
                  <button onClick={() => { openSignup(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors"
                    style={{ color: "#007AFF" }}>
                    <Sparkles className="w-4 h-4" /> Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
