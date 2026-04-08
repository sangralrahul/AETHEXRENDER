import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, Activity, BrainCircuit, Sparkles, Shirt, FlaskConical, BookOpen,
  Stethoscope, Scissors, HeartPulse, Shield, Quote, GraduationCap, FileText,
  Microscope, PenLine, Trophy, ShieldCheck, Truck, RotateCcw, Receipt, Send,
  MessageSquare, Search, Image, Zap, Wrench, ClipboardList, CheckCircle2,
  Smartphone, Users, CheckCheck, Bot, ChevronRight, Pill, Plus, Syringe,
  Bone, Thermometer, Eye, Baby, Brain, Store, Calculator,
  Wind, Droplets, Waves, ScanLine, Heart, AlertTriangle, Scan, Dna,
  Gauge, Dumbbell, Pipette, Apple, HeartHandshake, Radiation, TestTube2,
  Rss, Globe, Clock, ExternalLink, CalendarCheck, BadgeCheck, Star, ArrowUpRight
} from "lucide-react";
import { getTodaysCase } from "@/data/clinicalCases";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { useSession } from "@/hooks/use-session";
import { useAddToCart } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DailyMCQWidget } from "@/components/DailyMCQWidget";

function HeroAIInput() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/ai-assistant?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative rounded-2xl transition-all duration-300 group"
        style={{
          background: "#FFFFFF",
          border: "1.5px solid rgba(0,0,0,0.1)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
        }}
        onFocus={() => {}}
      >
        <div className="flex items-center px-5 py-4 gap-4">
          <Sparkles className="w-5 h-5 shrink-0" style={{ color: "#00C2A8" }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask Cadus AI — symptom, drug, calculation, differential…"
            className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-gray-400"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 15,
              color: "#0A0A0F",
            }}
            onFocus={e => {
              const wrapper = e.currentTarget.closest("div[class*='rounded-2xl']") as HTMLElement | null;
              if (wrapper) {
                wrapper.style.borderColor = "rgba(0,194,168,0.45)";
                wrapper.style.boxShadow = "0 0 0 4px rgba(0,194,168,0.08), 0 4px 24px rgba(0,0,0,0.07)";
              }
            }}
            onBlur={e => {
              const wrapper = e.currentTarget.closest("div[class*='rounded-2xl']") as HTMLElement | null;
              if (wrapper) {
                wrapper.style.borderColor = "rgba(0,0,0,0.1)";
                wrapper.style.boxShadow = "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)";
              }
            }}
          />
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.97] shrink-0"
            style={{
              background: "#00C2A8",
              color: "#FFFFFF",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: "0 2px 12px rgba(0,194,168,0.3)",
            }}>
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>
      </div>
    </form>
  );
}

const categoryIconMap: Record<string, React.ElementType> = {
  Shirt, FlaskConical, BookOpen, Stethoscope, Scissors, Activity, Shield, HeartPulse,
  Pill, Plus, Syringe, Bone, Thermometer, Eye, Baby, Brain, BrainCircuit, Microscope,
  Wind, Droplets, Waves, ScanLine, Heart, AlertTriangle, Scan, Dna,
  Gauge, Dumbbell, Pipette, Apple, HeartHandshake, Radiation, TestTube2, Trophy, Zap
};

const trustedBrands = [
  "3M Littmann", "OMRON", "Accu-Chek", "MDF Instruments",
  "Dr. Trust", "SurgiMed", "Heine", "Elsevier", "DAMS", "Tynor",
];

const testimonials = [
  {
    quote: "Aethex has completely changed how I manage patient care. Cadus AI gives me instant drug references mid-consultation — it's like having a pharmacologist in the room.",
    name: "Dr. Priya Sharma",
    role: "Cardiologist, Mumbai",
    initials: "PS",
  },
  {
    quote: "As a GP seeing 40+ patients daily, the Drug Interaction Checker has saved me from three potentially dangerous prescriptions in a single week. I can't imagine going back.",
    name: "Dr. Arjun Mehta",
    role: "General Physician, Delhi",
    initials: "AM",
  },
  {
    quote: "Cadus AI helped me cross-reference a rare neuro case at 11 PM — the depth of the response was remarkable. This platform is what Indian medicine has been waiting for.",
    name: "Dr. Vikram Nair",
    role: "Neurologist, Chennai",
    initials: "VN",
  },
];

interface ChatMsg { role: "user" | "assistant"; text: string; }

const STARTER_MESSAGES: ChatMsg[] = [
  { role: "assistant", text: "Hi — I'm Cadus AI. Ask me any clinical question." },
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
    <div className="w-full" style={{ maxWidth: 520 }}>
      <div className="rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "#0A0A14", border: "1px solid rgba(255,255,255,0.08)", height: 440, boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>

        <div className="px-5 py-3.5 flex items-center justify-between shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#EEEEF8", lineHeight: 1 }}>Cadus AI</p>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>● Clinical Mode</p>
            </div>
          </div>
          <Link href="/ai-assistant"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"}>
            Full Experience →
          </Link>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3" style={{ background: "#0A0A14" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[88%] px-4 py-3 rounded-2xl"
                style={msg.role === "user"
                  ? { background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderBottomRightRadius: 4, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }
                  : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)", borderBottomLeftRadius: 4, border: "1px solid rgba(255,255,255,0.07)", fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6 }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", borderBottomLeftRadius: 4, border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.4)", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.length === 1 && !loading && (
            <div className="flex flex-col gap-2 pt-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-left px-3.5 py-2.5 rounded-xl transition-all hover:border-white/20"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 pb-4 pt-3 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a clinical question…"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#EEEEF8", fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            <button type="submit" disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-30 transition-all hover:opacity-90 shrink-0"
              style={{ background: "#00C2A8" }}>
              <Send className="w-3.5 h-3.5 text-black" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function CaseOfTheDaySection() {
  const todaysCase = getTodaysCase();
  const today = new Date();

  return (
    <section className="py-24 relative" style={{ background: "#040408", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          <div className="flex-1">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", lineHeight: 1.05, color: "#EEEEF8", marginBottom: "1.5rem" }}>
              Sharpen Your<br />
              <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}>Clinical Thinking.</span>
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.85, maxWidth: 360, marginBottom: "2.5rem" }}>
              A new real-world clinical case every day — patient history, investigations, and MCQ diagnosis. Discuss with Cadus AI.
            </p>
            <Link href="/case-of-the-day"
              className="inline-flex items-center gap-2.5 transition-all hover:opacity-90"
              style={{ background: "#00C2A8", color: "#000", borderRadius: 2, padding: "12px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Solve Today's Case <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex-1 w-full max-w-md">
            <div className="rounded-2xl overflow-hidden" style={{ background: "#0E0E1A", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <CalendarCheck className="w-4 h-4" style={{ color: "rgba(255,255,255,0.45)" }} />
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
                    {today.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: "1.25rem", color: "#EEEEF8", lineHeight: 1.3 }}>{todaysCase.title}</h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{todaysCase.specialty}</p>
              </div>
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Chief Complaint</p>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  "{todaysCase.patient_info.chief_complaint.length > 90
                    ? todaysCase.patient_info.chief_complaint.slice(0, 90) + "…"
                    : todaysCase.patient_info.chief_complaint}"
                </p>
              </div>
              <div className="px-5 py-4">
                <Link href="/case-of-the-day"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #007AFF, #00C2A8)", color: "#FFFFFF", fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <Stethoscope className="w-3.5 h-3.5" /> Solve Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const BLOG_CAT_COLORS: Record<string, string> = {
  "Clinical Tips": "#007AFF", "NEET-PG Prep": "#5856D6", "Medical News": "#FF3B30",
  "Product Guides": "#34C759", "Doctor Life": "#FF9500", "Research & Studies": "#8888A8",
};

function BlogNewsSection() {
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    fetch(`${apiBase}/api/blog/posts?limit=3`)
      .then(r => r.json()).then(d => setBlogPosts(d.posts ?? [])).catch(() => {}).finally(() => setLoadingBlog(false));
    fetch(`${apiBase}/api/news`)
      .then(r => r.json()).then(d => setNewsArticles((d.articles ?? []).slice(0, 3))).catch(() => {}).finally(() => setLoadingNews(false));
  }, []);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(h / 24);
    if (d >= 1) return `${d}d ago`;
    if (h >= 1) return `${h}h ago`;
    return "Just now";
  };

  return (
    <section className="py-24 relative" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-14 gap-4">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", lineHeight: 1.0, color: "#EEEEF8" }}>
            Latest from Aethex
          </h2>
          <Link href="/blog" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 600 }}>
            All articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Rss className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>From the Blog</span>
            </div>
            {loadingBlog ? (
              <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded" style={{ background: "rgba(255,255,255,0.04)" }} />)}</div>
            ) : blogPosts.length === 0 ? (
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.2)" }}>Articles coming soon.</p>
            ) : (
              <div className="space-y-0">
                {blogPosts.map((post, i) => (
                  <Link key={post.id || i} href={`/blog/${post.slug}`}
                    className="group flex items-start gap-5 py-5 transition-all"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "rgba(255,255,255,0.08)", lineHeight: 1, minWidth: 40 }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1">
                      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500, lineHeight: 1.5, marginBottom: 4 }} className="group-hover:text-white transition-colors">
                        {post.title}
                      </p>
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                        {post.category} · {new Date(post.publishedAt || post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "rgba(255,255,255,0.5)", marginTop: 2 }} />
                  </Link>
                ))}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>Medical News</span>
            </div>
            {loadingNews ? (
              <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded" style={{ background: "rgba(255,255,255,0.04)" }} />)}</div>
            ) : newsArticles.length === 0 ? (
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.2)" }}>News feed loading.</p>
            ) : (
              <div className="space-y-0">
                {newsArticles.map((article, i) => (
                  <a key={i} href={article.url} target="_blank" rel="noopener noreferrer"
                    className="group flex items-start gap-5 py-5 transition-all"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, color: "rgba(255,255,255,0.08)", lineHeight: 1, minWidth: 40 }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1">
                      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500, lineHeight: 1.5, marginBottom: 4 }} className="group-hover:text-white transition-colors">
                        {article.title?.length > 85 ? article.title.slice(0, 85) + "…" : article.title}
                      </p>
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                        {article.source?.name ?? "Medical News"} · {timeAgo(article.publishedAt)}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "rgba(255,255,255,0.5)", marginTop: 3 }} />
                  </a>
                ))}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />
              </div>
            )}
          </div>
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
    <section className="py-28 relative" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "#040408" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(0,40,140,0.06) 0%, transparent 70%)" }} />
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center relative z-10">
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.0, color: "#EEEEF8", marginBottom: "1rem", letterSpacing: "-0.01em" }}>
          Weekly insights<br />
          <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}>delivered free.</span>
        </h2>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)", maxWidth: 400, margin: "0 auto 2.5rem", lineHeight: 1.85 }}>
          Clinical tips, exam updates, and exclusive deals. Join 12,000+ Indian doctors.
        </p>
        {done ? (
          <div className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>
            <CheckCircle2 className="w-4 h-4" /> You're in. Weekly updates incoming.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="doctor@hospital.in"
              className="flex-1 px-5 py-3.5 rounded-xl focus:outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#EEEEF8", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14 }} />
            <button type="submit" disabled={loading}
              className="px-6 py-3.5 font-bold rounded-xl transition-all disabled:opacity-60 flex items-center gap-2 justify-center whitespace-nowrap hover:opacity-90"
              style={{ background: "#00C2A8", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              <Send className="w-3.5 h-3.5" />
              {loading ? "Subscribing…" : "Subscribe Free"}
            </button>
          </form>
        )}
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 16 }}>No spam. Unsubscribe any time.</p>
      </div>
    </section>
  );
}

export default function Home() {
  const sessionId = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: productsData, isLoading: loadingProducts } = useListProducts({ limit: 8, featured: true });
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

  const featuredCategories = [
    "stethoscopes", "books", "scrubs", "equipment", "surgical", "cardiac-care", "neurology", "orthopaedic"
  ];

  return (
    <div className="min-h-screen" style={{ background: "#06060C" }}>

      {/* ══ HERO — Replit-inspired centered layout ══ */}
      <section className="relative overflow-hidden" style={{ minHeight: "calc(100vh - 141px)", background: "#FAFAF8", display: "flex", alignItems: "center" }}>

        {/* Subtle grain texture */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.018, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }} />

        {/* Centered hero content */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-20 text-center">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: "rgba(0,194,168,0.1)", color: "#009E87", border: "1px solid rgba(0,194,168,0.22)", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.04em" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C2A8", display: "inline-block" }} />
              India's Clinical Platform
            </span>
          </motion.div>

          {/* Main headline */}
          <div style={{ overflow: "hidden", marginBottom: "0.2em" }}>
            <motion.h1
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: "clamp(3.5rem, 10vw, 7.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "#0A0A0F",
              }}
            >
              Everything
            </motion.h1>
          </div>
          <div style={{ overflow: "hidden", marginBottom: "1.5rem" }}>
            <motion.h1
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(3.5rem, 10vw, 7.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "rgba(10,10,15,0.28)",
              }}
            >
              Medicine.
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(0,0,0,0.45)", lineHeight: 1.65, marginBottom: "2.5rem", maxWidth: 520, margin: "0 auto 2.5rem" }}
          >
            AI clinical assistant · Drug reference · NEET‑PG prep · Medical supplies — one platform built for Indian physicians.
          </motion.p>

          {/* ── MAIN AI INPUT BOX — like Replit's prompt input ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <HeroAIInput />
          </motion.div>

          {/* ── CATEGORY QUICK LINKS ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-1 flex-wrap mb-5"
          >
            {[
              { href: "/ai-assistant", icon: Brain, label: "AI Consult" },
              { href: "/drug-reference", icon: Pill, label: "Drug Ref" },
              { href: "/neet-pg", icon: FileText, label: "NEET-PG" },
              { href: "/shop", icon: Store, label: "Shop" },
              { href: "/books", icon: BookOpen, label: "Books" },
              { href: "/calculator", icon: Calculator, label: "Calculators" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ color: "rgba(0,0,0,0.5)", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "#FFFFFF";
                    (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.8)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.04)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.5)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </motion.div>

          {/* ── EXAMPLE PROMPTS ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.72 }}
          >
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: "rgba(0,0,0,0.3)", marginRight: 8 }}>Try an example →</span>
            {[
              "Diabetic nephropathy DDx",
              "NEET PG 2025 schedule",
              "Drug interaction check",
            ].map((prompt) => (
              <Link key={prompt} href={`/ai-assistant?q=${encodeURIComponent(prompt)}`}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs transition-all mr-2 mb-2"
                style={{ background: "#FFFFFF", color: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,0,0,0.1)", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#00C2A8"; (e.currentTarget as HTMLElement).style.color = "#009E87"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(0,0,0,0.6)"; }}>
                {prompt}
              </Link>
            ))}
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex items-center justify-center gap-6 mt-10 pt-8"
            style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
          >
            {[
              { value: "40,000+", label: "Doctors" },
              { value: "20+", label: "AI Modes" },
              { value: "2-Day", label: "Delivery" },
              { value: "NMC", label: "Compliant" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", color: "#0A0A0F", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, letterSpacing: "0.18em", color: "rgba(0,0,0,0.3)", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradient bridge to dark sections below */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #06060C)" }} />
      </section>

      {/* ══ PLATFORM — table of contents, architectural ══ */}
      <section className="relative" style={{ background: "#06060C" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Section label */}
          <div className="flex items-center gap-4 pt-20 pb-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
              The Platform
            </span>
          </div>

          {/* Three platform pillars — full-width rows */}
          {[
            {
              index: "01",
              name: "Cadus AI",
              headline: "Clinical Intelligence",
              desc: "Instant DDx, drug interactions, SOAP notes, and evidence-based answers — powered by medical AI built for Indian physicians.",
              href: "/ai-assistant",
              cta: "Start Consulting",
            },
            {
              index: "02",
              name: "Study Hub",
              headline: "NEET PG Prep",
              desc: "Structured notes, previous year questions, MCQ banks, and smart revision tools for NEET PG, NEXT, FMGE and USMLE aspirants.",
              href: "/study-hub",
              cta: "Explore Hub",
            },
            {
              index: "03",
              name: "Medical Store",
              headline: "Genuine Supplies",
              desc: "Stethoscopes, scrubs, surgical instruments, and essential equipment — 100% authentic, delivered pan-India in 2 days.",
              href: "/shop",
              cta: "Shop Now",
            },
          ].map((pillar, i) => (
            <Link
              key={i}
              href={pillar.href}
              className="group block py-12 transition-all"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:items-center">
                {/* Index number */}
                <div className="lg:col-span-1">
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "1rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>{pillar.index}</span>
                </div>

                {/* Service name — large */}
                <div className="lg:col-span-3">
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#EEEEF8", lineHeight: 1, letterSpacing: "-0.01em" }}
                    className="group-hover:text-white transition-colors">
                    {pillar.name}
                  </div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", fontWeight: 600, marginTop: 8 }}>
                    {pillar.headline}
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-6">
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, maxWidth: 500 }}>
                    {pillar.desc}
                  </p>
                </div>

                {/* CTA arrow */}
                <div className="lg:col-span-2 lg:text-right">
                  <span className="inline-flex items-center gap-2 transition-all group-hover:gap-3"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
                    {pillar.cta}
                    <ArrowRight className="w-3.5 h-3.5 transition-colors group-hover:text-white/70" style={{ color: "rgba(255,255,255,0.2)" }} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ AI DEMO — the centerpiece ══ */}
      <section className="relative py-32 overflow-hidden" style={{ background: "#040408", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 100% 50%, rgba(0,50,150,0.07) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 50% at 0% 50%, rgba(0,40,160,0.07) 0%, transparent 60%)" }} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 0.95, color: "#EEEEF8", marginBottom: "2rem", letterSpacing: "-0.02em" }}>
                Your clinical<br />
                <em style={{ color: "rgba(242,242,248,0.3)", fontWeight: 300 }}>intelligence layer.</em>
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.35)", lineHeight: 1.85, maxWidth: 400, marginBottom: "2rem" }}>
                Ask clinical questions, generate differential diagnoses, check drug interactions, produce SOAP notes, and prepare for exams — all in one conversation.
              </p>

              {/* Feature list — minimal */}
              <div className="space-y-0 mb-10">
                {[
                  "Instant differential diagnosis",
                  "Drug interaction checks",
                  "SOAP note generation",
                  "NEET PG exam prep",
                  "Paediatric dose calculator",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link href="/ai-assistant"
                className="inline-flex items-center gap-2.5 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "#00C2A8", color: "#000", borderRadius: 2, padding: "13px 28px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Sparkles className="w-3.5 h-3.5" /> Try Free — 20 queries/day
              </Link>
            </div>

            {/* Right — live chat widget */}
            <div className="flex justify-center lg:justify-end">
              <AIChatPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES — curated editorial selection ══ */}
      <section className="py-24 relative" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-end justify-between mb-14">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.2rem, 4.5vw, 4rem)", lineHeight: 1.0, color: "#EEEEF8", letterSpacing: "-0.01em" }}>
              Shop by<br />
              <em style={{ color: "rgba(255,255,255,0.3)" }}>Specialty</em>
            </h2>
            <Link href="/shop"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 600 }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)"}>
              View All →
            </Link>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "rgba(255,255,255,0.04)" }}>
              {[...Array(8)].map((_, i) => <div key={i} className="h-28 animate-pulse" style={{ background: "#06060C" }} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
              {(categories || [])
                .filter((cat: any) => featuredCategories.includes(cat.slug))
                .sort((a: any, b: any) => featuredCategories.indexOf(a.slug) - featuredCategories.indexOf(b.slug))
                .slice(0, 8)
                .map((cat: any) => {
                  const Icon = categoryIconMap[cat.iconName as string] || Activity;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/shop?category=${cat.slug}`}
                      className="group flex flex-col justify-between p-7 transition-all"
                      style={{ background: "#06060C", aspectRatio: "1/1" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#0A0A14"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#06060C"; }}
                    >
                      <Icon className="w-6 h-6 transition-colors group-hover:text-white/80" style={{ color: "rgba(255,255,255,0.2)" }} />
                      <div>
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", lineHeight: 1.3, display: "block" }}>{cat.name}</span>
                        {cat.productCount > 0 && (
                          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.2)", display: "block", marginTop: 4 }}>
                            {cat.productCount} items
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
            </div>
          )}
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══ */}
      <section className="py-24 relative" style={{ background: "#040408", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-end justify-between mb-14">
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.2rem, 4.5vw, 4rem)", lineHeight: 1.0, color: "#EEEEF8", letterSpacing: "-0.01em" }}>
                Editor's Selection
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
                Trusted by Indian doctors nationwide
              </p>
            </div>
            <Link href="/shop"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontWeight: 600, whiteSpace: "nowrap" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)"}>
              View All →
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", borderRadius: 4 }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(productsData?.products || []).slice(0, 8).map((product: any) => (
                <ProductCard key={product.id} product={product} onAddToCart={() => handleAddToCart(product.id)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ TRUSTED BRANDS — marquee ══ */}
      <section className="overflow-hidden" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingTop: 24, paddingBottom: 24 }}>
        <p className="text-center mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, letterSpacing: "0.28em", color: "rgba(255,255,255,0.18)", textTransform: "uppercase" }}>
          Stocked &amp; sold on Aethex
        </p>
        <div style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)" }}>
          <div className="marquee-track" style={{ gap: 56, width: "max-content" }}>
            {[...trustedBrands, ...trustedBrands].map((brand, idx) => (
              <span key={idx} style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "1.1rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                {brand}
                {idx % trustedBrands.length < trustedBrands.length - 1 && (
                  <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 14px" }}>·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS — pull-quote editorial ══ */}
      <section className="py-28 relative" style={{ background: "#040408", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-end justify-between mb-20">
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(2.2rem, 4.5vw, 4rem)", lineHeight: 1.0, color: "#EEEEF8", letterSpacing: "-0.01em" }}>
              What doctors<br />
              <em style={{ color: "rgba(255,255,255,0.25)" }}>are saying</em>
            </h2>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>
              Verified reviews
            </div>
          </div>

          <div>
            {testimonials.map((t, i) => (
              <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-12"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {/* Quote — wide */}
                <div className={`lg:col-span-9 ${i % 2 !== 0 ? "lg:order-last" : ""}`}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontStyle: "italic",
                    fontSize: "clamp(1.4rem, 2.8vw, 2.1rem)",
                    lineHeight: 1.42,
                    color: "rgba(255,255,255,0.72)",
                  }}>
                    "{t.quote}"
                  </p>
                </div>

                {/* Attribution — narrow */}
                <div className={`lg:col-span-3 flex flex-col justify-center ${i % 2 !== 0 ? "lg:order-first" : ""}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, #001A6E, #0048C0)" }}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#EEEEF8" }}>{t.name}</span>
                        <BadgeCheck className="w-3 h-3" style={{ color: "rgba(255,255,255,0.4)" }} />
                      </div>
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{t.role}</span>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="w-3 h-3" viewBox="0 0 24 24" fill="#FF9500">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />
          </div>
        </div>
      </section>

      {/* ══ DAILY MCQ — minimal sidebar layout ══ */}
      <section className="py-24 relative" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-start gap-16">
            <div className="lg:w-72 shrink-0">
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 0.88, color: "rgba(255,255,255,0.05)", marginBottom: "0.75rem", letterSpacing: "-0.03em" }}>MCQ</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(1.8rem, 3vw, 2.5rem)", lineHeight: 1.1, color: "#EEEEF8", marginBottom: "1rem" }}>
                Question of<br />the Day
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.28)", lineHeight: 1.7 }}>
                One clinical question.<br />Every day. Free.
              </p>
            </div>
            <div className="flex-1">
              <DailyMCQWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ══ CASE OF THE DAY ══ */}
      <CaseOfTheDaySection />

      {/* ══ DRUG INTERACTION CTA — tight strip ══ */}
      <section className="py-8" style={{ background: "#06060C", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <Link href="/drug-interaction-checker"
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6"
            style={{ background: "#0A0A14", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 4 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.35)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.15)"; }}>
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(245,158,11,0.1)" }}>
                <Pill className="w-4.5 h-4.5" style={{ color: "#F59E0B" }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#EEEEF8" }}>Drug Interaction Checker</p>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                  Instantly check interactions for up to 5 drugs — with severity ratings and clinical guidance.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 transition-all group-hover:gap-3 shrink-0"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: "#F59E0B" }}>
              Check Now <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* ══ BLOG & NEWS ══ */}
      <BlogNewsSection />

      {/* ══ NEWSLETTER ══ */}
      <NewsletterSection />

      {/* ══ MOBILE STICKY CTA ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden p-4"
        style={{ background: "rgba(4,4,8,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <Link href="/ai-assistant"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-bold"
          style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, boxShadow: "0 4px 20px rgba(0,122,255,0.3)" }}>
          <Sparkles className="w-4 h-4" /> Start AI Consultation
        </Link>
      </div>
    </div>
  );
}
