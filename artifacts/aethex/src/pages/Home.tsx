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
  Gauge, Dumbbell, Pipette, Apple, HeartHandshake, Radiation, TestTube2
} from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { useSession } from "@/hooks/use-session";
import { useAddToCart } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

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
    quote: "Helped me revise faster for NEET PG — the AI explains concepts better than most textbooks.",
    name: "Rahul Mehta",
    title: "MBBS Final Year, AIIMS Delhi",
    initials: "RM",
  },
  {
    quote: "I use Cadus AI every morning for quick clinical queries. It's like having a consultant on speed dial.",
    name: "Dr. Priya Sharma",
    title: "Resident Doctor, KEM Mumbai",
    initials: "PS",
  },
  {
    quote: "Ordered my Littmann and Harrison's from aethex — genuine, fast, and the AI even helped me pick the right model.",
    name: "Dr. Ananya Krishnan",
    title: "MD Cardiology, PGI Chandigarh",
    initials: "AK",
  }
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
      <div className="rounded-2xl overflow-hidden shadow-xl flex flex-col"
        style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.12)", height: 420 }}>

        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between shrink-0" style={{ background: "#F9F9FB", borderBottom: "1px solid rgba(60,60,67,0.1)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none" style={{ color: "#1C1C1E" }}>Cadus AI</p>
              <p className="text-xs mt-0.5" style={{ color: "#00A893" }}>● Online · Clinical Mode</p>
            </div>
          </div>
          <Link href="/ai-assistant" className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ background: "rgba(0,122,255,0.1)", color: "#007AFF" }}>
            Full experience →
          </Link>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-sm" style={{ background: "#F9F9FB" }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl"
                style={msg.role === "user"
                  ? { background: "#007AFF", color: "#FFFFFF", borderBottomRightRadius: "6px" }
                  : { background: "#FFFFFF", color: "#1C1C1E", borderBottomLeftRadius: "6px", border: "1px solid rgba(60,60,67,0.1)" }}>
                {msg.role === "user" ? (
                  <span className="text-sm leading-relaxed">{msg.text}</span>
                ) : (
                  <div className="text-sm space-y-1">
                    {msg.text.split("\n").map((line, li) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;
                      const isBullet = /^[-•*]\s/.test(trimmed);
                      const isNumbered = /^\d+\.\s/.test(trimmed);
                      const boldified = trimmed.replace(/\*\*(.+?)\*\*/g, (_: string, t: string) => `<strong>${t}</strong>`);
                      if (isBullet) {
                        const content = trimmed.replace(/^[-•*]\s/, "");
                        const bld = content.replace(/\*\*(.+?)\*\*/g, (_: string, t: string) => `<strong>${t}</strong>`);
                        return (
                          <div key={li} className="flex items-start gap-1.5">
                            <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#007AFF" }} />
                            <span dangerouslySetInnerHTML={{ __html: bld }} />
                          </div>
                        );
                      }
                      if (isNumbered) {
                        const [num, ...rest] = trimmed.split(/\.\s+/);
                        const bld = rest.join(". ").replace(/\*\*(.+?)\*\*/g, (_: string, t: string) => `<strong>${t}</strong>`);
                        return (
                          <div key={li} className="flex items-start gap-1.5">
                            <span className="shrink-0 font-bold text-xs mt-0.5" style={{ color: "#007AFF", minWidth: "16px" }}>{num}.</span>
                            <span dangerouslySetInnerHTML={{ __html: bld }} />
                          </div>
                        );
                      }
                      return (
                        <div key={li} className="leading-snug" dangerouslySetInnerHTML={{ __html: boldified }} />
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
              <div className="px-4 py-3 rounded-2xl" style={{ background: "#FFFFFF", borderBottomLeftRadius: "6px", border: "1px solid rgba(60,60,67,0.1)" }}>
                <div className="flex gap-1.5 items-center h-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "#007AFF", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
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
                  className="text-left text-xs px-3 py-2 rounded-xl transition-all hover:shadow-sm"
                  style={{ background: "#FFFFFF", border: "1px solid rgba(0,122,255,0.2)", color: "#007AFF" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Input */}
        <div className="px-3 pb-3 pt-2 shrink-0" style={{ background: "#FFFFFF", borderTop: "1px solid rgba(60,60,67,0.08)" }}>
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a clinical question…"
              disabled={loading}
              className="flex-1 text-sm px-3 py-2.5 rounded-xl outline-none disabled:opacity-50"
              style={{ background: "#F2F2F7", border: "1px solid rgba(60,60,67,0.12)", color: "#1C1C1E" }}
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
    <section className="py-16" style={{ background: "#F2F2F7", borderTop: "1px solid rgba(60,60,67,0.08)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-5"
          style={{ background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", color: "#007AFF" }}>
          <Send className="w-3.5 h-3.5" />
          Newsletter
        </div>
        <h2 className="text-3xl font-display font-bold mb-3" style={{ color: "#1C1C1E" }}>
          Weekly Medical Insights + NEET-PG Tips
        </h2>
        <p className="mb-8 max-w-xl mx-auto" style={{ color: "#636366" }}>
          Get the latest clinical tips, medical news, exam updates, and exclusive deals — direct to your inbox. Join 12,000+ Indian doctors.
        </p>
        {done ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold"
            style={{ background: "rgba(0,194,168,0.1)", border: "1px solid rgba(0,194,168,0.25)", color: "#00A893" }}>
            <CheckCircle2 className="w-5 h-5" />
            You're subscribed! Weekly updates incoming.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="doctor@hospital.in"
              className="flex-1 px-5 py-3.5 rounded-xl text-sm focus:outline-none"
              style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.15)", color: "#1C1C1E", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }} />
            <button type="submit" disabled={loading}
              className="px-6 py-3.5 font-bold rounded-xl transition-all disabled:opacity-60 flex items-center gap-2 justify-center whitespace-nowrap hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF", boxShadow: "0 2px 12px rgba(0,122,255,0.25)" }}>
              <Send className="w-4 h-4" />
              {loading ? "Subscribing..." : "Subscribe Free"}
            </button>
          </form>
        )}
        <p className="mt-4 text-xs" style={{ color: "#AEAEB2" }}>No spam. Unsubscribe any time.</p>
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
    <div className="min-h-screen" style={{ background: "#F4F4F6" }}>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden"
        style={{ background: "#F4F4F6", minHeight: "calc(100vh - 104px)", display: "flex", alignItems: "center" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ background: "#e8f3ff", color: "#007AFF" }}>
                <Activity className="w-3.5 h-3.5" />
                India's #1 Medical Platform
              </div>

              <h1 className="font-display font-bold leading-[1.05] tracking-tight mb-5"
                style={{ color: "#1c1c1e", fontSize: "clamp(2.4rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}>
                Medicine Made{" "}
                <span style={{ color: "#007AFF" }}>Effortless.</span>
              </h1>

              <p className="mb-8 max-w-[480px] leading-relaxed" style={{ fontSize: 17, color: "#8e8e93" }}>
                Everything a doctor needs — supplies, AI research tools, and study resources — in one beautifully simple platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/shop"
                  className="inline-flex items-center justify-center text-base font-semibold text-center transition-all hover:opacity-90 active:scale-[0.97]"
                  style={{ background: "#007AFF", color: "#FFFFFF", borderRadius: 12, padding: "14px 28px", fontSize: 16, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,122,255,0.25)" }}>
                  Shop Essentials →
                </Link>
                <Link href="/ai-assistant"
                  className="inline-flex items-center justify-center text-base font-semibold text-center transition-all hover:border-[#007AFF] hover:text-[#007AFF] active:scale-[0.97]"
                  style={{ background: "#FFFFFF", color: "#1c1c1e", borderRadius: 12, padding: "14px 28px", fontSize: 16, fontWeight: 600, border: "1px solid #e8e8ed" }}>
                  <Sparkles className="mr-2 w-4 h-4" />
                  Try AI Chat
                </Link>
              </div>

              <p className="mt-5 text-sm" style={{ color: "#aeaeb2" }}>
                Free to start · No credit card required · 20 queries/day on free plan
              </p>
            </motion.div>

            {/* Right: Stat Tiles 2x2 */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {[
                { value: "50,000+", label: "Doctors & Students", icon: Users },
                { value: "1,000+", label: "Medical Products", icon: ShieldCheck },
                { value: "28+", label: "States Delivered", icon: Truck },
                { value: "98%", label: "Satisfaction Rate", icon: CheckCircle2 },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="flex flex-col items-center justify-center text-center p-6 rounded-2xl transition-all hover:-translate-y-1"
                    style={{ background: "#FFFFFF", border: "1px solid #e8e8ed", borderRadius: 16, padding: 20 }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "#e8f3ff" }}>
                      <Icon className="w-5 h-5" style={{ color: "#007AFF" }} />
                    </div>
                    <div className="font-display font-bold mb-1" style={{ fontSize: 24, color: "#1c1c1e" }}>{stat.value}</div>
                    <div style={{ fontSize: 13, color: "#8e8e93" }}>{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-8" style={{ background: "#FFFFFF", borderTop: "1px solid rgba(60,60,67,0.1)", borderBottom: "1px solid rgba(60,60,67,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "50,000+", label: "Medical Students & Doctors Across India" },
              { value: "1,000+", label: "Medical Products" },
              { value: "28+", label: "States Delivered" },
              { value: "98%", label: "Customer Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center px-4 py-2"
                style={i > 0 ? { borderLeft: "1px solid rgba(60,60,67,0.1)" } : {}}>
                <div className="text-2xl sm:text-3xl font-display font-bold mb-1" style={{ color: "#007AFF" }}>{stat.value}</div>
                <div className="text-xs sm:text-sm font-medium leading-snug" style={{ color: "#636366" }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-4 font-medium" style={{ color: "#AEAEB2" }}>
            Trusted by learners from top medical colleges
          </p>
        </div>
      </section>

      {/* ── Platform Breakdown ── */}
      <section className="py-20" style={{ background: "#F2F2F7" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3" style={{ color: "#1C1C1E" }}>
              Everything Medicine.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>One Platform.</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#636366" }}>
              Three powerful pillars — seamlessly connected for every medical professional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <BrainCircuit className="w-8 h-8" />,
                color: "#007AFF",
                tag: "Cadus AI",
                title: "AI Clinical Assistant",
                desc: "Get instant clinical insights, diagnoses, drug interactions, and explanations — powered by specialized medical AI.",
                href: "/ai-assistant",
                cta: "Start Consulting",
              },
              {
                icon: <GraduationCap className="w-8 h-8" />,
                color: "#8B5CF6",
                tag: "Study Hub",
                title: "NEET PG Study Hub",
                desc: "Structured notes, PYQs, MCQ banks, and smart revision tools tailored for NEET PG, NEXT, FMGE & USMLE.",
                href: "/study-hub",
                cta: "Explore Study Hub",
              },
              {
                icon: <ShoppingCart className="w-8 h-8" />,
                color: "#00C2A8",
                tag: "Medical Store",
                title: "Medical Supplies Store",
                desc: "Order stethoscopes, scrubs, surgical instruments, and essential equipment — 100% genuine, fast pan-India delivery.",
                href: "/shop",
                cta: "Shop Now",
              },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl p-7 flex flex-col transition-all hover:-translate-y-1"
                style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)")}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: card.color + "15", color: card.color }}>
                  {card.icon}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: card.color }}>{card.tag}</div>
                <h3 className="font-display font-bold text-xl mb-3" style={{ color: "#1C1C1E" }}>{card.title}</h3>
                <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "#636366" }}>{card.desc}</p>
                <Link href={card.href}
                  className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
                  style={{ color: card.color }}>
                  {card.cta} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="py-10" style={{ background: "#FFFFFF", borderTop: "1px solid rgba(60,60,67,0.08)", borderBottom: "1px solid rgba(60,60,67,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
                style={{ background: "#F2F2F7", border: "1px solid rgba(60,60,67,0.1)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,122,255,0.1)" }}>
                  <badge.icon className="w-5 h-5" style={{ color: "#007AFF" }} />
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "#1C1C1E" }}>{badge.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#AEAEB2" }}>{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why AETHEX ── */}
      <section className="py-20" style={{ background: "#F2F2F7" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-6"
                style={{ background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", color: "#007AFF" }}>
                <ShieldCheck className="w-4 h-4" />
                Why AETHEX?
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6" style={{ color: "#1C1C1E" }}>
                Built differently, for Indian doctors.
              </h2>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: "#636366" }}>
                We built AETHEX because nothing else combined AI-powered clinical assistance with a reliable medical store — in one place.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Users, text: "Built for Indian medical students and doctors from day one" },
                  { icon: BrainCircuit, text: "AI-powered clinical assistance with Cadus AI — available 24/7" },
                  { icon: CheckCheck, text: "All-in-one ecosystem — no juggling multiple apps or platforms" },
                  { icon: Smartphone, text: "Fast, mobile-first experience designed for busy clinical schedules" },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl"
                    style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.08)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,122,255,0.1)" }}>
                      <Icon className="w-4.5 h-4.5" style={{ color: "#007AFF" }} />
                    </div>
                    <p className="text-sm font-medium leading-relaxed pt-1.5" style={{ color: "#1C1C1E" }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats visual */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "20+", label: "Clinical AI Modes", color: "#007AFF" },
                { value: "Free", label: "To Start Using", color: "#34C759" },
                { value: "NEET PG", label: "Exam Focused", color: "#8B5CF6" },
                { value: "24/7", label: "AI Availability", color: "#00C2A8" },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl p-6 flex flex-col items-center text-center"
                  style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div className="text-4xl font-display font-extrabold mb-2" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-sm font-medium" style={{ color: "#636366" }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="py-16" style={{ background: "#FFFFFF", borderTop: "1px solid rgba(60,60,67,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold mb-3" style={{ color: "#1C1C1E" }}>Shop by Category</h2>
            <p style={{ color: "#636366" }}>Everything a modern doctor needs</p>
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
                    className="group flex flex-col items-center p-5 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-md"
                    style={{ background: "#F2F2F7", border: "1px solid rgba(60,60,67,0.1)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,122,255,0.2)"; (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(60,60,67,0.1)"; (e.currentTarget as HTMLElement).style.background = "#F2F2F7"; }}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 bg-gradient-to-br ${gradient}`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-center leading-tight" style={{ color: "#1C1C1E" }}>{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Trusted Brands ── */}
      <section className="py-10 overflow-hidden" style={{ background: "#F2F2F7", borderTop: "1px solid rgba(60,60,67,0.08)", borderBottom: "1px solid rgba(60,60,67,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-widest mb-6" style={{ color: "#AEAEB2" }}>Trusted brands on aethex</p>
          <div className="flex flex-wrap justify-center gap-3">
            {trustedBrands.map((brand, idx) => (
              <a key={idx} href={brand.url} target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl text-sm transition-all"
                style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.12)", color: "#636366", textDecoration: "none" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#007AFF";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#007AFF";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 12px rgba(0,122,255,0.12)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(60,60,67,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#636366";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                }}>
                {brand.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16" style={{ background: "#F2F2F7" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2" style={{ color: "#1C1C1E" }}>Featured Products</h2>
              <p style={{ color: "#636366" }}>Top picks for Indian doctors</p>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-2 font-semibold text-sm" style={{ color: "#007AFF" }}>
              View all <ArrowRight className="w-4 h-4" />
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

      {/* ── Testimonials ── */}
      <section className="py-20" style={{ background: "#FFFFFF", borderTop: "1px solid rgba(60,60,67,0.08)", borderBottom: "1px solid rgba(60,60,67,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-bold mb-3" style={{ color: "#1C1C1E" }}>What Doctors & Students Say</h2>
            <p className="max-w-2xl mx-auto" style={{ color: "#636366" }}>Trusted by medical professionals across India — from AIIMS to community hospitals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-7 rounded-2xl relative transition-all hover:-translate-y-1"
                style={{ background: "#F2F2F7", border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <Quote className="absolute top-5 right-5 w-10 h-10" style={{ color: "rgba(0,122,255,0.1)" }} />
                <div className="flex items-center gap-1 mb-5" style={{ color: "#FF9500" }}>
                  {[1,2,3,4,5].map(star => <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
                </div>
                <p className="italic mb-7 font-medium leading-relaxed" style={{ color: "#636366" }}>"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base"
                    style={{ background: "rgba(0,122,255,0.1)", border: "2px solid rgba(0,122,255,0.2)", color: "#007AFF" }}>
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: "#1C1C1E" }}>{t.name}</h4>
                    <p className="text-xs" style={{ color: "#007AFF" }}>{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Demo Preview Section ── */}
      <section className="py-20" style={{ background: "#F2F2F7" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 lg:p-14 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"
              style={{ background: "rgba(0,122,255,0.12)" }} />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-3xl"
              style={{ background: "rgba(0,194,168,0.08)" }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-6"
                  style={{ background: "rgba(0,194,168,0.15)", border: "1px solid rgba(0,194,168,0.25)", color: "#00C2A8" }}>
                  <BrainCircuit className="w-4 h-4" />
                  Cadus AI — Live Demo
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
                  See Cadus AI in Action
                </h2>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Ask clinical questions, get instant DDx, generate SOAP notes, check drug interactions, and prepare for exams — all in one chat interface.
                </p>
                <Link href="/ai-assistant"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,122,255,0.35)" }}>
                  Try Cadus AI Now
                  <Sparkles className="ml-2 w-5 h-5" />
                </Link>
                <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Free plan · 20 queries/day · No sign-up required to browse</p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <AIChatPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Payment Partners ── */}
      <section className="py-10" style={{ background: "#FFFFFF", borderTop: "1px solid rgba(60,60,67,0.08)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-7" style={{ color: "#aeaeb2" }}>Secure Payments via</p>
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
              <div key={logo.alt} className="flex items-center justify-center h-11 px-3 rounded-xl border border-black/[0.07] bg-white shadow-sm">
                <img src={logo.src} alt={logo.alt} className={`${logo.w} h-7 object-contain`} />
              </div>
            ))}
            {/* Net Banking */}
            <div className="flex items-center justify-center h-11 px-4 rounded-xl border border-black/[0.07] bg-white shadow-sm gap-2">
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

      {/* ── Newsletter ── */}
      <NewsletterSection />

      {/* ── Sticky Mobile CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden p-4"
        style={{ background: "rgba(242,242,247,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(60,60,67,0.12)" }}>
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
