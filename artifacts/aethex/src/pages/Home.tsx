import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, Activity, BrainCircuit, Sparkles, Shirt, FlaskConical, BookOpen,
  Stethoscope, Scissors, HeartPulse, Shield, Quote, GraduationCap, FileText,
  Microscope, PenLine, Trophy, ShieldCheck, Truck, RotateCcw, Receipt, Send,
  MessageSquare, Search, Image, Zap, Wrench, ClipboardList, CheckCircle2,
  Smartphone, Users, CheckCheck, Bot, ChevronRight, Pill, Plus, Syringe,
  Bone, Thermometer, Eye, Baby, Brain,
  Wind, Droplets, Waves, ScanLine, Heart, AlertTriangle, Scan, Dna,
  Gauge, Dumbbell, Pipette, Apple, HeartHandshake, Radiation, TestTube2,
  Rss, Globe, Clock, ExternalLink, CalendarCheck, BadgeCheck, Star
} from "lucide-react";
import { getTodaysCase } from "@/data/clinicalCases";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { useSession } from "@/hooks/use-session";
import { useAddToCart } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DailyMCQWidget } from "@/components/DailyMCQWidget";

const categoryIconMap: Record<string, React.ElementType> = {
  Shirt, FlaskConical, BookOpen, Stethoscope, Scissors, Activity, Shield, HeartPulse,
  Pill, Plus, Syringe, Bone, Thermometer, Eye, Baby, Brain, BrainCircuit, Microscope,
  Wind, Droplets, Waves, ScanLine, Heart, AlertTriangle, Scan, Dna,
  Gauge, Dumbbell, Pipette, Apple, HeartHandshake, Radiation, TestTube2, Trophy, Zap
};

const categoryGradients: Record<string, string> = {
  scrubs:           "from-sky-500 to-sky-700",
  aprons:           "from-slate-500 to-slate-700",
  books:            "from-amber-600 to-amber-800",
  stethoscopes:     "from-indigo-600 to-indigo-800",
  surgical:         "from-red-600 to-red-800",
  equipment:        "from-teal-500 to-teal-700",
  "cardiac-care":   "from-rose-600 to-rose-800",
  orthopaedic:      "from-stone-600 to-stone-800",
  neurology:        "from-violet-600 to-violet-800",
  gastroenterology: "from-orange-500 to-orange-800",
  nephrology:       "from-blue-500 to-blue-800",
  pulmonology:      "from-sky-500 to-blue-700",
  ophthalmology:    "from-cyan-600 to-cyan-800",
  paediatric:       "from-pink-600 to-pink-800",
  dermatology:      "from-fuchsia-500 to-fuchsia-800",
  ent:              "from-purple-600 to-purple-800",
  gynaecology:      "from-pink-500 to-rose-700",
  endocrinology:    "from-yellow-500 to-yellow-700",
  emergency:        "from-red-500 to-red-800",
  radiology:        "from-zinc-600 to-zinc-900",
  oncology:         "from-teal-700 to-teal-900",
  anaesthesia:      "from-slate-500 to-slate-700",
  physiotherapy:    "from-green-500 to-green-800",
  "sports-medicine":"from-lime-600 to-green-700",
  psychiatry:       "from-indigo-500 to-purple-700",
  urology:          "from-amber-500 to-orange-700",
  nutrition:        "from-green-400 to-teal-600",
};

const trustedBrands = [
  { name: "3M Littmann",      url: "https://www.littmann.com" },
  { name: "OMRON",            url: "https://www.omron-healthcare.com/in/" },
  { name: "Accu-Chek",        url: "https://www.accu-chek.in" },
  { name: "Grey's Anatomy",   url: "https://www.barco.com/en/greys-anatomy" },
  { name: "DAMS",             url: "https://www.damsdelhi.com" },
  { name: "MDF Instruments",  url: "https://mdfinstruments.com" },
  { name: "Dr. Trust",        url: "https://www.drtrust.in" },
  { name: "SurgiMed",         url: "https://surgimed.in" },
];

const testimonials = [
  {
    quote: "Aethex has completely changed how I manage patient care. Cadus AI gives me instant drug references mid-consultation — it's like having a pharmacologist in the room.",
    name: "Dr. Priya Sharma",
    role: "Cardiologist",
    city: "Mumbai",
    initials: "PS",
    stars: 5,
    gradient: "linear-gradient(135deg,#007AFF,#5AC8FA)",
  },
  {
    quote: "As a GP seeing 40+ patients daily, the Drug Interaction Checker has saved me from three potentially dangerous prescriptions in a single week. I can't imagine going back.",
    name: "Dr. Arjun Mehta",
    role: "General Physician",
    city: "Delhi",
    initials: "AM",
    stars: 5,
    gradient: "linear-gradient(135deg,#34C759,#00C2A8)",
  },
  {
    quote: "The paediatric dosage tools and CME modules keep me current without the textbook overhead. My Harrison's arrived in 2 days — genuinely impressed.",
    name: "Dr. Sneha Reddy",
    role: "Pediatrician",
    city: "Hyderabad",
    initials: "SR",
    stars: 5,
    gradient: "linear-gradient(135deg,#FF9500,#FF6B35)",
  },
  {
    quote: "I recommended Aethex to my entire ortho unit. The medical supply quality is top-tier and the NEET-PG MCQ engine has been a game-changer for my junior residents.",
    name: "Dr. Rohit Kapoor",
    role: "Orthopedic Surgeon",
    city: "Pune",
    initials: "RK",
    stars: 5,
    gradient: "linear-gradient(135deg,#5856D6,#AF52DE)",
  },
  {
    quote: "The Study Hub is well-structured and the AI explains dermatology cases with clinical precision. Fast delivery, authentic products, and zero hassle on returns.",
    name: "Dr. Ananya Singh",
    role: "Dermatologist",
    city: "Bangalore",
    initials: "AS",
    stars: 5,
    gradient: "linear-gradient(135deg,#FF2D55,#FF6B9E)",
  },
  {
    quote: "Cadus AI helped me cross-reference a rare neuro case at 11 PM — the depth of the response was remarkable. This platform is what Indian medicine has been waiting for.",
    name: "Dr. Vikram Nair",
    role: "Neurologist",
    city: "Chennai",
    initials: "VN",
    stars: 5,
    gradient: "linear-gradient(135deg,#00C2A8,#007AFF)",
  },
];

const trustBadges = [
  { icon: Receipt, label: "GST Invoice", desc: "Included with every order" },
  { icon: Truck, label: "Fast Delivery", desc: "Pan-India, 2–5 business days" },
  { icon: ShieldCheck, label: "Verified Brands", desc: "100% authentic products only" },
  { icon: RotateCcw, label: "Easy Returns", desc: "7-day hassle-free returns" },
];

interface ChatMsg { role: "user" | "assistant"; text: string; }

const STARTER_MESSAGES: ChatMsg[] = [
  { role: "assistant", text: "Hi! I'm Cadus AI — your clinical assistant. Ask me any medical question." },
];

const SUGGESTIONS = [
  "What are the STEMI criteria on ECG?",
  "Paediatric dose of amoxicillin",
  "Causes of elevated troponin",
];

function AIChatPreview() {
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
  const [messages, setMessages] = useState<ChatMsg[]>(STARTER_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    const next: ChatMsg[] = [...messages, { role: "user", text: q }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, agent: "pulse45", mode: "normal" }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", text: data.message ?? "Sorry, I couldn't respond. Please try again." }]);
    } catch {
      setMessages([...next, { role: "assistant", text: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      <div className="rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.09)", height: 420 }}>

        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between shrink-0" style={{ background: "#13131F", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none" style={{ color: "#EEEEF8" }}>Cadus AI</p>
              <p className="text-xs mt-0.5" style={{ color: "#00C2A8" }}>● Online · Clinical Mode</p>
            </div>
          </div>
          <Link href="/ai-assistant" className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ background: "rgba(0,194,168,0.1)", color: "#00C2A8" }}>
            Full experience →
          </Link>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-sm" style={{ background: "#0E0E1A" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl"
                style={msg.role === "user"
                  ? { background: "linear-gradient(135deg,#007AFF,#0060CC)", color: "#FFFFFF", borderBottomRightRadius: "6px" }
                  : { background: "#1A1A2E", color: "rgba(255,255,255,0.85)", borderBottomLeftRadius: "6px", border: "1px solid rgba(255,255,255,0.08)" }}>
                {msg.role === "user" ? (
                  <span className="text-sm leading-relaxed">{msg.text}</span>
                ) : (
                  <div className="text-sm space-y-1">
                    {msg.text.split("\n").map((line, li) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;
                      const isBullet = /^[-•*]\s/.test(trimmed);
                      const isNumbered = /^\d+\.\s/.test(trimmed);
                      const boldParts = (s: string) => {
                        const p: React.ReactNode[] = [];
                        const r = /\*\*(.+?)\*\*/g;
                        let last = 0;
                        let m;
                        let k = 0;
                        while ((m = r.exec(s)) !== null) {
                          if (m.index > last) p.push(s.slice(last, m.index));
                          p.push(<strong key={k++}>{m[1]}</strong>);
                          last = m.index + m[0].length;
                        }
                        if (last < s.length) p.push(s.slice(last));
                        return p.length ? p : [s];
                      };
                      if (isBullet) {
                        const content = trimmed.replace(/^[-•*]\s/, "");
                        return (
                          <div key={li} className="flex items-start gap-1.5">
                            <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#007AFF" }} />
                            <span>{boldParts(content)}</span>
                          </div>
                        );
                      }
                      if (isNumbered) {
                        const [num, ...rest] = trimmed.split(/\.\s+/);
                        return (
                          <div key={li} className="flex items-start gap-1.5">
                            <span className="shrink-0 font-bold text-xs mt-0.5" style={{ color: "#007AFF", minWidth: "16px" }}>{num}.</span>
                            <span>{boldParts(rest.join(". "))}</span>
                          </div>
                        );
                      }
                      return (
                        <div key={li} className="leading-snug">{boldParts(trimmed)}</div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl" style={{ background: "#1A1A2E", borderBottomLeftRadius: "6px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex gap-1.5 items-center h-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "#00C2A8", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Suggestion chips — shown only on fresh start */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-col gap-2 pt-1">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-left text-xs px-3 py-2 rounded-xl transition-all"
                  style={{ background: "rgba(0,194,168,0.06)", border: "1px solid rgba(0,194,168,0.2)", color: "#00C2A8" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Input */}
        <div className="px-3 pb-3 pt-2 shrink-0" style={{ background: "#13131F", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a clinical question…"
              disabled={loading}
              className="flex-1 text-sm px-3 py-2.5 rounded-xl outline-none disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#EEEEF8" }}
            />
            <button type="submit" disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-40 shrink-0"
              style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
        style={{ background: "#34C759", color: "#FFFFFF" }}>
        ✓ Free to try
      </div>
    </div>
  );
}

const BLOG_CAT_COLORS: Record<string, string> = {
  "Clinical Tips": "#007AFF", "NEET-PG Prep": "#5856D6", "Medical News": "#FF3B30",
  "Product Guides": "#34C759", "Doctor Life": "#FF9500", "Research & Studies": "#00C2A8",
};

function DrugInteractionBanner() {
  return (
    <section className="py-8" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/drug-interaction-checker"
          className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl transition-all"
          style={{ background: "#0E0E1A", border: "1px solid rgba(245,158,11,0.2)", boxShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.4)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(245,158,11,0.15)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.2)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 20px rgba(0,0,0,0.4)"; }}>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)" }}>
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: "#EEEEF8" }}>Drug Interaction Checker</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                Instantly check interactions for up to 5 drugs — with severity ratings and clinical management guidance.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shrink-0 transition-all group-hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)", color: "#FFFFFF" }}>
            Check Interactions
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </section>
  );
}

function CaseOfTheDaySection() {
  const todaysCase = getTodaysCase();
  const today = new Date();

  return (
    <section className="py-24 relative" style={{ background: "#080810", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          {/* Left: Text */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
              <div style={{ width: 24, height: 1, background: "rgba(0,194,168,0.5)" }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.25em", color: "#00C2A8", fontWeight: 600, textTransform: "uppercase" }}>Case of the Day</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4.5vw, 3.8rem)", lineHeight: 1.05, color: "#EEEEF8", marginBottom: "1.5rem" }}>
              Sharpen Your
              <br />
              <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>Clinical Thinking.</span>
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, maxWidth: 380, marginBottom: "2.5rem" }}>
              A new real-world clinical case every day — with patient history, investigations, and MCQ diagnosis. Discuss with Cadus AI.
            </p>
            <Link href="/case-of-the-day"
              className="inline-flex items-center gap-2.5 transition-all hover:opacity-90"
              style={{ background: "#00C2A8", color: "#000", borderRadius: 4, padding: "12px 24px", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Solve Today's Case
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Case Preview Card */}
          <div className="flex-1 w-full max-w-md">
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
              <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3"
                style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(0,194,168,0.08) 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(0,194,168,0.15)" }}>
                      <CalendarCheck className="w-3 h-3" style={{ color: "#00C2A8" }} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#00C2A8" }}>
                      {today.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base" style={{ color: "#EEEEF8" }}>{todaysCase.title}</h3>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{todaysCase.specialty}</p>
                </div>
              </div>

              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>Chief Complaint</p>
                <p className="text-sm leading-snug" style={{ color: "rgba(255,255,255,0.7)" }}>
                  "{todaysCase.patient_info.chief_complaint.length > 90
                    ? todaysCase.patient_info.chief_complaint.slice(0, 90) + "…"
                    : todaysCase.patient_info.chief_complaint}"
                </p>
              </div>

              <div className="px-5 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {todaysCase.patient_info.age}-yr {todaysCase.patient_info.gender}
                    {todaysCase.patient_info.occupation ? ` · ${todaysCase.patient_info.occupation}` : ""}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(0,194,168,0.1)", color: "#00C2A8" }}>
                    {todaysCase.options.length} options
                  </span>
                </div>
                <Link href="/case-of-the-day"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm transition-all"
                  style={{ background: "linear-gradient(135deg, #007AFF 0%, #00C2A8 100%)", color: "#FFFFFF" }}>
                  <Stethoscope className="w-3.5 h-3.5" />
                  Solve Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogNewsSection() {
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    fetch(`${apiBase}/api/blog/posts?limit=3`)
      .then(r => r.json())
      .then(d => setBlogPosts(d.posts ?? []))
      .catch(() => {})
      .finally(() => setLoadingBlog(false));
    fetch(`${apiBase}/api/news`)
      .then(r => r.json())
      .then(d => setNewsArticles((d.articles ?? []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingNews(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(h / 24);
    if (d >= 1) return `${d}d ago`;
    if (h >= 1) return `${h}h ago`;
    return "Just now";
  };

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#080810", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0,80,160,0.05)" }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(0,194,168,0.04)" }} />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-8">
            <div style={{ width: 24, height: 1, background: "rgba(0,194,168,0.5)" }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.25em", color: "#00C2A8", fontWeight: 600, textTransform: "uppercase" }}>Blog &amp; News</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4.5vw, 3.8rem)", lineHeight: 1.05, color: "#EEEEF8" }}>
            Latest from Aethex
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Blog Column ── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,122,255,0.2)", border: "1px solid rgba(0,122,255,0.3)" }}>
                  <Rss className="w-4 h-4" style={{ color: "#60A5FA" }} />
                </div>
                <span className="font-bold text-base" style={{ color: "rgba(255,255,255,0.9)" }}>From the Blog</span>
              </div>
              <Link href="/blog" className="flex items-center gap-1 text-xs font-semibold transition-all hover:opacity-80" style={{ color: "#60A5FA" }}>
                All articles <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {loadingBlog ? (
                [1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />)
              ) : blogPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 rounded-2xl text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Rss className="w-8 h-8 mb-3" style={{ color: "rgba(255,255,255,0.2)" }} />
                  <p className="font-semibold text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Blog posts coming soon</p>
                  <Link href="/blog" className="mt-3 text-sm font-semibold" style={{ color: "#60A5FA" }}>Visit the Blog →</Link>
                </div>
              ) : blogPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="flex gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5 group"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,122,255,0.1)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,122,255,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  {post.featuredImage && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {post.category && (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5"
                        style={{ background: `${BLOG_CAT_COLORS[post.category] ?? "#007AFF"}25`, color: BLOG_CAT_COLORS[post.category] ?? "#60A5FA", border: `1px solid ${BLOG_CAT_COLORS[post.category] ?? "#007AFF"}40` }}>
                        {post.category}
                      </span>
                    )}
                    <h3 className="font-bold text-sm leading-snug mb-1.5 line-clamp-2 transition-colors" style={{ color: "rgba(255,255,255,0.9)" }}>{post.title}</h3>
                    {post.excerpt && <p className="text-xs line-clamp-1 mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{post.excerpt}</p>}
                    <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime} min read</span>
                      <span>·</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span className="ml-auto text-xs font-semibold" style={{ color: "#60A5FA" }}>Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── News Column ── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,194,168,0.2)", border: "1px solid rgba(0,194,168,0.3)" }}>
                  <Globe className="w-4 h-4" style={{ color: "#2DD4BF" }} />
                </div>
                <span className="font-bold text-base" style={{ color: "rgba(255,255,255,0.9)" }}>Medical News</span>
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(52,199,89,0.15)", color: "#4ADE80", border: "1px solid rgba(52,199,89,0.3)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse inline-block" />
                  Live
                </span>
              </div>
              <Link href="/news" className="flex items-center gap-1 text-xs font-semibold transition-all hover:opacity-80" style={{ color: "#2DD4BF" }}>
                All news <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {loadingNews ? (
                [1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />)
              ) : newsArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 rounded-2xl text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Globe className="w-8 h-8 mb-3" style={{ color: "rgba(255,255,255,0.2)" }} />
                  <p className="font-semibold text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>News loading…</p>
                  <Link href="/news" className="mt-3 text-sm font-semibold" style={{ color: "#2DD4BF" }}>Visit News →</Link>
                </div>
              ) : newsArticles.map((article, i) => (
                <a key={i} href={article.url ?? "#"} target="_blank" rel="noopener noreferrer"
                  className="flex gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5 group"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,194,168,0.1)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,194,168,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  {article.urlToImage && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={article.urlToImage} alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {article.source?.name && (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5"
                        style={{ background: "rgba(0,194,168,0.2)", color: "#2DD4BF", border: "1px solid rgba(0,194,168,0.3)" }}>
                        {article.source.name}
                      </span>
                    )}
                    <h3 className="font-bold text-sm leading-snug mb-1.5 line-clamp-2 transition-colors" style={{ color: "rgba(255,255,255,0.9)" }}>{article.title}</h3>
                    {article.description && <p className="text-xs line-clamp-1 mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{article.description}</p>}
                    <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                      <Clock className="w-3 h-3" />
                      <span>{timeAgo(article.publishedAt ?? new Date().toISOString())}</span>
                      <span className="ml-auto flex items-center gap-1 font-semibold" style={{ color: "#2DD4BF" }}>
                        Read More <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#007AFF,#3B82F6)", color: "#FFFFFF", boxShadow: "0 2px 16px rgba(0,122,255,0.35)" }}>
            <Rss className="w-4 h-4" /> Read all blog articles
          </Link>
          <Link href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all"
            style={{ background: "rgba(0,194,168,0.15)", color: "#2DD4BF", border: "1px solid rgba(0,194,168,0.3)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,194,168,0.25)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,194,168,0.15)"; }}>
            <Globe className="w-4 h-4" /> Browse medical news
          </Link>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setDone(true);
    setLoading(false);
  };

  return (
    <section className="py-24 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "#06060C" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,194,168,0.04) 0%, transparent 70%)" }} />
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center relative z-10">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div style={{ width: 24, height: 1, background: "rgba(0,194,168,0.5)" }} />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.25em", color: "#00C2A8", fontWeight: 600, textTransform: "uppercase" }}>Newsletter</span>
          <div style={{ width: 24, height: 1, background: "rgba(0,194,168,0.5)" }} />
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.2rem, 4.5vw, 4rem)", lineHeight: 1.05, color: "#EEEEF8", marginBottom: "1rem" }}>
          Weekly Medical Insights
          <br />
          <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>+ NEET-PG Tips</span>
        </h2>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.35)", maxWidth: 420, margin: "0 auto 2.5rem", lineHeight: 1.8 }}>
          Clinical tips, medical news, exam updates, and exclusive deals — direct to your inbox. Join 12,000+ Indian doctors.
        </p>
        {done ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold"
            style={{ background: "rgba(0,194,168,0.1)", border: "1px solid rgba(0,194,168,0.25)", color: "#00C2A8" }}>
            <CheckCircle2 className="w-5 h-5" />
            You're subscribed! Weekly updates incoming.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="doctor@hospital.in"
              className="flex-1 px-5 py-3.5 rounded-xl text-sm focus:outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#EEEEF8" }} />
            <button type="submit" disabled={loading}
              className="px-6 py-3.5 font-bold rounded-xl transition-all disabled:opacity-60 flex items-center gap-2 justify-center whitespace-nowrap hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF", boxShadow: "0 2px 16px rgba(0,194,168,0.3)" }}>
              <Send className="w-4 h-4" />
              {loading ? "Subscribing..." : "Subscribe Free"}
            </button>
          </form>
        )}
        <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>No spam. Unsubscribe any time.</p>
      </div>
    </section>
  );
}

export default function Home() {
  const sessionId = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: productsData, isLoading: loadingProducts } = useListProducts({ limit: 8 });
  const { data: categories, isLoading: loadingCategories } = useListCategories();

  const addToCartMutation = useAddToCart();

  const handleAddToCart = (productId: number) => {
    if (!sessionId) return;
    addToCartMutation.mutate(
      { data: { productId, sessionId, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
          toast({ title: "Added to cart", description: "Item successfully added to your cart." });
        },
        onError: () => toast({ variant: "destructive", title: "Error", description: "Failed to add item to cart." }),
      }
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "#06060C" }}>

      {/* ── HERO — full-screen cinematic ── */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center"
        style={{ minHeight: "100vh", background: "#06060C" }}>

        {/* Atmospheric background glows */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,194,168,0.06) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 40% 60% at 15% 60%, rgba(0,80,180,0.05) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 40% 50% at 85% 40%, rgba(0,194,168,0.04) 0%, transparent 65%)" }} />

        {/* Horizontal rule — cinema feel */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,194,168,0.3) 50%, transparent 100%)" }} />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 text-center py-32">

          {/* Eyebrow — refined label */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <div style={{ width: 32, height: 1, background: "rgba(0,194,168,0.5)" }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: "0.2em", color: "#00C2A8", fontWeight: 600, textTransform: "uppercase" }}>
              India's Medical Platform
            </span>
            <div style={{ width: 32, height: 1, background: "rgba(0,194,168,0.5)" }} />
          </motion.div>

          {/* Main headline — dramatic serif */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(3.6rem, 9vw, 8rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
              color: "#EEEEF8",
              marginBottom: "0.5em",
            }}
          >
            Medicine,
            <br />
            <span style={{ fontStyle: "italic", background: "linear-gradient(135deg,#A8D8D0 0%,#00C2A8 40%,#A8D8D0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 400 }}>
              Redefined.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(255,255,255,0.45)", maxWidth: 520, margin: "0 auto 3rem", lineHeight: 1.7, fontWeight: 400 }}
          >
            AI clinical assistant · Drug reference · NEET-PG prep · Medical store —
            one platform built for Indian doctors.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/ai-assistant"
              className="inline-flex items-center gap-2.5 transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ background: "#00C2A8", color: "#000", borderRadius: 4, padding: "14px 32px", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 0 32px rgba(0,194,168,0.25)" }}>
              <Sparkles className="w-4 h-4" />
              Try Cadus AI
            </Link>
            <Link href="/shop"
              className="inline-flex items-center gap-2 transition-all active:scale-[0.97]"
              style={{ background: "transparent", color: "rgba(255,255,255,0.7)", borderRadius: 4, padding: "14px 32px", fontSize: 14, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif", border: "1px solid rgba(255,255,255,0.15)" }}>
              Shop Essentials <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex items-center justify-center gap-6 mt-14 flex-wrap"
          >
            {[
              { label: "Doctors Trust Us" },
              { label: "AI-Powered Clinical Tools" },
              { label: "Free to Start" },
              { label: "Pan-India Delivery" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#00C2A8" }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #06060C)" }} />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(0,194,168,0.5), transparent)" }} />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>Scroll</span>
        </motion.div>
      </section>


      {/* ── Platform Breakdown — editorial luxury layout ── */}
      <section className="relative py-32" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,80,160,0.05) 0%, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-20">
            <div style={{ width: 24, height: 1, background: "rgba(0,194,168,0.5)" }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.25em", color: "#00C2A8", fontWeight: 600, textTransform: "uppercase" }}>The Platform</span>
          </div>

          {/* Headline */}
          <div className="mb-20">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 1.0, color: "#EEEEF8", letterSpacing: "-0.01em" }}>
              Everything Medicine.
              <br />
              <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>One Platform.</span>
            </h2>
          </div>

          {/* Editorial pillars — horizontal stacked layout */}
          <div className="space-y-0">
            {[
              {
                num: "01",
                tag: "Cadus AI",
                title: "AI Clinical Assistant",
                desc: "Get instant clinical insights, diagnoses, drug interactions, and explanations — powered by specialized medical AI built for Indian physicians.",
                href: "/ai-assistant",
                cta: "Start Consulting",
                color: "#00C2A8",
              },
              {
                num: "02",
                tag: "Study Hub",
                title: "NEET PG Study Hub",
                desc: "Structured notes, PYQs, MCQ banks, and smart revision tools — tailored for NEET PG, NEXT, FMGE & USMLE aspirants.",
                href: "/study-hub",
                cta: "Explore Study Hub",
                color: "#00C2A8",
              },
              {
                num: "03",
                tag: "Medical Store",
                title: "Medical Supplies Store",
                desc: "Stethoscopes, scrubs, surgical instruments, and essential equipment — 100% genuine, fast pan-India delivery.",
                href: "/shop",
                cta: "Shop Now",
                color: "#00C2A8",
              },
            ].map((pillar, i) => (
              <Link key={i} href={pillar.href}
                className="group flex items-start lg:items-center gap-8 lg:gap-16 py-10 transition-all"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderTopColor = "rgba(0,194,168,0.2)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderTopColor = "rgba(255,255,255,0.06)"; }}
              >
                {/* Number */}
                <div className="shrink-0 hidden lg:block" style={{ width: 80 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "3.5rem", color: "rgba(255,255,255,0.07)", lineHeight: 1 }}>{pillar.num}</span>
                </div>

                {/* Tag + Title */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 items-center">
                  <div className="lg:col-span-1">
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.2em", color: pillar.color, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>{pillar.tag}</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "#EEEEF8", lineHeight: 1.15, letterSpacing: "0" }}>{pillar.title}</h3>
                  </div>
                  <p className="lg:col-span-1 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 360 }}>{pillar.desc}</p>
                  <div className="lg:col-span-1 lg:text-right">
                    <span className="inline-flex items-center gap-2 group-hover:gap-3 transition-all" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 600 }}>
                      {pillar.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:text-teal-400 transition-colors" style={{ color: "#00C2A8" }} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {/* Bottom border */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
          </div>
        </div>
      </section>

      {/* ── Trust Badges — minimal horizontal strip ── */}
      <section className="py-8" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-3">
                <badge.icon className="w-4 h-4 shrink-0" style={{ color: "#00C2A8" }} />
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500, letterSpacing: "0.05em" }}>{badge.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why AETHEX — editorial luxury layout ── */}
      <section className="relative py-32" style={{ background: "#080810" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 0% 60%, rgba(0,194,168,0.04) 0%, transparent 65%)" }} />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

            {/* Left — headline + manifesto */}
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div style={{ width: 24, height: 1, background: "rgba(0,194,168,0.5)" }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.25em", color: "#00C2A8", fontWeight: 600, textTransform: "uppercase" }}>Why AETHEX</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.05, color: "#EEEEF8", marginBottom: "1.5rem", letterSpacing: "-0.01em" }}>
                Built differently,
                <br />
                <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>for Indian doctors.</span>
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, maxWidth: 420, marginBottom: "3rem" }}>
                We built AETHEX because nothing else combined AI-powered clinical assistance with a reliable medical store — in one ecosystem.
              </p>

              {/* Minimalist feature list */}
              <div className="space-y-0">
                {[
                  { num: "—", text: "Built for Indian medical students and doctors from day one" },
                  { num: "—", text: "AI-powered clinical assistance with Cadus AI, available 24/7" },
                  { num: "—", text: "All-in-one ecosystem — no juggling multiple apps or platforms" },
                  { num: "—", text: "Fast, mobile-first experience for busy clinical schedules" },
                ].map(({ text }, i) => (
                  <div key={i} className="flex items-start gap-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ color: "#00C2A8", fontFamily: "'Cormorant Garamond', serif", fontSize: 18, lineHeight: 1.5, marginTop: 2 }}>—</span>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — large stat numbers */}
            <div className="grid grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
              {[
                { value: "20+", label: "Clinical AI Modes" },
                { value: "Free", label: "To Start Using" },
                { value: "NEET PG", label: "Exam Focused" },
                { value: "24/7", label: "AI Availability" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col justify-center p-8 lg:p-10" style={{ background: "#080810", aspectRatio: "1/1" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#EEEEF8", lineHeight: 1, marginBottom: 12 }}>{item.value}</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: "#00C2A8", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="py-24" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div style={{ width: 24, height: 1, background: "rgba(0,194,168,0.5)" }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.25em", color: "#00C2A8", fontWeight: 600, textTransform: "uppercase" }}>Medical Store</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4.5vw, 3.8rem)", lineHeight: 1.05, color: "#EEEEF8" }}>
                Shop by Category
              </h2>
            </div>
            <Link href="/shop" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontWeight: 600, whiteSpace: "nowrap" }}>
              View All →
            </Link>
          </div>
          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl" style={{ background: "rgba(120,120,128,0.1)" }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {(categories || []).map((cat: any) => {
                const Icon = categoryIconMap[cat.iconName as string] || Activity;
                const gradient = categoryGradients[cat.slug] ?? "from-blue-500 to-blue-700";
                return (
                  <Link
                    key={cat.slug}
                    href={`/shop?category=${cat.slug}`}
                    className="group flex flex-col items-center p-5 rounded-2xl transition-all hover:-translate-y-1"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,194,168,0.25)"; (e.currentTarget as HTMLElement).style.background = "rgba(0,194,168,0.05)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 bg-gradient-to-br ${gradient}`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-center leading-tight" style={{ color: "rgba(255,255,255,0.85)" }}>{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Trusted Brands ── */}
      <section className="py-10 overflow-hidden" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>Trusted brands on aethex</p>
          <div className="flex flex-wrap justify-center gap-3">
            {trustedBrands.map((brand, idx) => (
              <a key={idx} href={brand.url} target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-sm transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#00C2A8";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#00C2A8";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(0,194,168,0.15)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                }}>
                {brand.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-24 relative" style={{ background: "#080810" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,194,168,0.03) 0%, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div style={{ width: 24, height: 1, background: "rgba(0,194,168,0.5)" }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.25em", color: "#00C2A8", fontWeight: 600, textTransform: "uppercase" }}>Featured</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4.5vw, 3.8rem)", lineHeight: 1.05, color: "#EEEEF8" }}>
                Top Picks
              </h2>
            </div>
            <Link href="/shop" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontWeight: 600, whiteSpace: "nowrap" }}>
              View All →
            </Link>
          </div>
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl" style={{ background: "rgba(120,120,128,0.1)" }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(productsData?.products || []).slice(0, 8).map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product.id)}
                />
              ))}
            </div>
          )}
          <div className="mt-10 text-center sm:hidden">
            <Link href="/shop" className="text-sm font-semibold" style={{ color: "#007AFF" }}>View all products →</Link>
          </div>
        </div>
      </section>

      {/* ── Daily MCQ Widget ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "#080810", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(0,80,160,0.08) 0%, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div style={{ width: 24, height: 1, background: "rgba(0,194,168,0.5)" }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.25em", color: "#00C2A8", fontWeight: 600, textTransform: "uppercase" }}>Free Daily Practice</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05, color: "#EEEEF8", marginBottom: "3rem" }}>
            Question of the Day
          </h2>
          <div className="max-w-2xl">
            <DailyMCQWidget />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(0,122,255,0.04)", transform: "translate(-40%,-40%)" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(0,194,168,0.03)", transform: "translate(30%,30%)" }} />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          {/* Heading */}
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-8">
              <div style={{ width: 24, height: 1, background: "rgba(0,194,168,0.5)" }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.25em", color: "#00C2A8", fontWeight: 600, textTransform: "uppercase" }}>Verified Reviews</span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4.5vw, 3.8rem)", lineHeight: 1.05, color: "#EEEEF8" }}>
              What Doctors<br />
              <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>Are Saying</span>
            </h2>
          </div>

          {/* Desktop 3×2 grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-5">
            {testimonials.map((t, idx) => (
              <div key={idx}
                className="group flex flex-col p-6 rounded-2xl relative transition-all duration-200 hover:-translate-y-1.5"
                style={{
                  background: "#0E0E1A",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
                }}>
                {/* Hover accent border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ boxShadow: "0 0 0 1.5px rgba(0,194,168,0.2), 0 8px 32px rgba(0,194,168,0.06)" }} />

                {/* Quote mark */}
                <Quote className="absolute top-5 right-5 w-8 h-8 opacity-[0.07]" style={{ color: "#00C2A8" }} />

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#FF9500">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                  <span className="text-xs font-semibold ml-1.5" style={{ color: "#FF9500" }}>5.0</span>
                </div>

                {/* Quote text */}
                <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
                  "{t.quote}"
                </p>

                {/* Doctor info */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white"
                    style={{ background: t.gradient }}>
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm truncate" style={{ color: "#EEEEF8" }}>{t.name}</span>
                      <BadgeCheck className="w-3.5 h-3.5 shrink-0" style={{ color: "#00C2A8" }} />
                    </div>
                    <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {t.role} · {t.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile horizontal carousel */}
          <div className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {testimonials.map((t, idx) => (
              <div key={idx}
                className="flex flex-col p-5 rounded-2xl relative shrink-0 snap-start"
                style={{
                  width: "82vw",
                  maxWidth: 320,
                  background: "#0E0E1A",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
                }}>
                <Quote className="absolute top-4 right-4 w-7 h-7 opacity-[0.07]" style={{ color: "#00C2A8" }} />
                <div className="flex items-center gap-0.5 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#FF9500">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white"
                    style={{ background: t.gradient }}>
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm truncate" style={{ color: "#EEEEF8" }}>{t.name}</span>
                      <BadgeCheck className="w-3.5 h-3.5 shrink-0" style={{ color: "#00C2A8" }} />
                    </div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Swipe hint for mobile */}
          <p className="md:hidden text-center text-xs mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>Swipe to see more →</p>
        </div>
      </section>

      {/* ── AI Demo Preview Section — luxury editorial ── */}
      <section className="py-32 relative" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 100% 50%, rgba(0,194,168,0.04) 0%, transparent 65%)" }} />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div style={{ width: 24, height: 1, background: "rgba(0,194,168,0.5)" }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.25em", color: "#00C2A8", fontWeight: 600, textTransform: "uppercase" }}>Cadus AI</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.05, color: "#EEEEF8", marginBottom: "1.5rem", letterSpacing: "-0.01em" }}>
                See Cadus AI
                <br />
                <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>in Action</span>
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, maxWidth: 400, marginBottom: "2.5rem" }}>
                Ask clinical questions, get instant DDx, generate SOAP notes, check drug interactions, and prepare for exams — all in one conversation.
              </p>
              <Link href="/ai-assistant"
                className="inline-flex items-center gap-2.5 transition-all hover:opacity-90 active:scale-[0.97]"
                style={{ background: "#00C2A8", color: "#000", borderRadius: 4, padding: "13px 28px", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 0 24px rgba(0,194,168,0.2)" }}>
                <Sparkles className="w-4 h-4" />
                Try Cadus AI Free
              </Link>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 12 }}>20 queries/day free · No sign-up required</p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <AIChatPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ── Payment Partners ── */}
      <section className="py-10" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-7" style={{ color: "rgba(255,255,255,0.25)" }}>Secure Payments via</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {[
              { src: `${import.meta.env.BASE_URL}images/payments/upi.svg`, alt: "UPI", w: "w-16" },
              { src: `${import.meta.env.BASE_URL}images/payments/visa.svg`, alt: "Visa", w: "w-14" },
              { src: `${import.meta.env.BASE_URL}images/payments/mastercard.svg`, alt: "Mastercard", w: "w-14" },
              { src: `${import.meta.env.BASE_URL}images/payments/rupay.svg`, alt: "RuPay", w: "w-16" },
              { src: `${import.meta.env.BASE_URL}images/payments/phonepe.svg`, alt: "PhonePe", w: "w-20" },
              { src: `${import.meta.env.BASE_URL}images/payments/gpay.svg`, alt: "Google Pay", w: "w-20" },
              { src: `${import.meta.env.BASE_URL}images/payments/paytm.svg`, alt: "Paytm", w: "w-16" },
            ].map((logo) => (
              <div key={logo.alt} className="flex items-center justify-center h-11 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <img src={logo.src} alt={logo.alt} className={`${logo.w} h-7 object-contain`} style={{ filter: "brightness(0) invert(1) opacity(0.7)" }} />
              </div>
            ))}
            {/* Net Banking */}
            <div className="flex items-center justify-center h-11 px-4 rounded-xl gap-2" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="11" width="20" height="10" rx="1.5" fill="#1A1F71"/>
                <rect x="4" y="13" width="3" height="6" rx="0.5" fill="white" opacity="0.8"/>
                <rect x="10.5" y="13" width="3" height="6" rx="0.5" fill="white" opacity="0.8"/>
                <rect x="17" y="13" width="3" height="6" rx="0.5" fill="white" opacity="0.8"/>
                <polygon points="12,2 22,11 2,11" fill="#1A1F71"/>
              </svg>
              <span className="text-[12px] font-semibold text-[#1A1F71]">Net Banking</span>
            </div>
            {/* COD */}
            <div className="flex items-center justify-center h-11 px-4 rounded-xl border border-black/[0.07] bg-white shadow-sm gap-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="7" width="22" height="14" rx="2" fill="#2E7D32"/>
                <ellipse cx="12" cy="14" rx="4" ry="4" fill="#A5D6A7"/>
                <ellipse cx="12" cy="14" rx="2.2" ry="2.2" fill="#2E7D32"/>
                <circle cx="4" cy="14" r="1.5" fill="#A5D6A7"/>
                <circle cx="20" cy="14" r="1.5" fill="#A5D6A7"/>
                <rect x="6" y="4" width="12" height="4" rx="1" fill="#1B5E20"/>
              </svg>
              <span className="text-[12px] font-semibold text-[#2E7D32]">Cash on Delivery</span>
            </div>
          </div>
          <p className="text-center text-xs mt-6 flex items-center justify-center gap-1.5" style={{ color: "#aeaeb2" }}>
            <ShieldCheck className="w-3.5 h-3.5 text-[#00C2A8]" />
            256-bit SSL encrypted · PCI DSS compliant · Your data is always safe
          </p>
        </div>
      </section>

      {/* ── Case of the Day ── */}
      <CaseOfTheDaySection />

      {/* ── Drug Interaction Checker CTA ── */}
      <DrugInteractionBanner />

      {/* ── Blog & News ── */}
      <BlogNewsSection />

      {/* ── Newsletter ── */}
      <NewsletterSection />

      {/* ── Sticky Mobile CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden p-4"
        style={{ background: "rgba(6,6,12,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Link href="/ai-assistant"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-bold text-base"
          style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,122,255,0.3)" }}>
          <Sparkles className="w-4 h-4" />
          Start AI Consultation
        </Link>
      </div>
    </div>
  );
}

// Missing import used inline
function ShoppingCart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6h13M9 19.5a.5.5 0 11-1 0 .5.5 0 011 0zm11 0a.5.5 0 11-1 0 .5.5 0 011 0z" />
    </svg>
  );
}
