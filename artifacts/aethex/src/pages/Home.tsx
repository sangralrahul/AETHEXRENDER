import { useState } from "react";
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
  Pill, Plus, Syringe, Bone, Thermometer, Eye, Baby, Brain, Microscope,
  Wind, Droplets, Waves, ScanLine, Heart, AlertTriangle, Scan, Dna,
  Gauge, Dumbbell, Pipette, Apple, HeartHandshake, Radiation, TestTube2, Trophy, Zap
};

const trustedBrands = [
  "3M Littmann", "OMRON", "Accu-Chek", "Grey's Anatomy", "DAMS", "MDF Instruments", "Dr. Trust", "SurgiMed"
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

const mockChatMessages = [
  { role: "user", text: "Patient with chest pain — what are possible diagnoses?" },
  { role: "assistant", text: "Key differentials to consider: ACS (STEMI/NSTEMI), Unstable Angina, Aortic Dissection, PE, Pericarditis, GERD. Start with 12-lead ECG, troponins, and CXR immediately." },
  { role: "user", text: "ECG shows ST elevation in V1–V4. Next steps?" },
  { role: "assistant", text: "This indicates anterior STEMI. Activate cath lab immediately — door-to-balloon time <90 min is critical. Give aspirin 325mg, heparin, and prepare for primary PCI." },
];

function AIChatPreview() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      <div className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#16213E", border: "1px solid rgba(255,255,255,0.1)" }}>
        {/* Chat Header */}
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: "#0F172A", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">Cadus AI</p>
            <p className="text-xs mt-0.5" style={{ color: "#00C2A8" }}>● Online · Clinical Mode</p>
          </div>
        </div>
        {/* Messages */}
        <div className="p-4 space-y-3 text-sm">
          {mockChatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[82%] px-3.5 py-2.5 rounded-2xl leading-relaxed"
                style={
                  msg.role === "user"
                    ? { background: "#007AFF", color: "#FFFFFF", borderBottomRightRadius: "6px" }
                    : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.88)", borderBottomLeftRadius: "6px" }
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
          {/* Typing indicator */}
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.07)", borderBottomLeftRadius: "6px" }}>
              <div className="flex gap-1.5 items-center h-3">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "#00C2A8", animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Input bar */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="text-sm flex-1" style={{ color: "rgba(255,255,255,0.3)" }}>Ask a clinical question…</span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#007AFF" }}>
              <Send className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
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
    <div className="min-h-screen pt-[72px]" style={{ background: "#F2F2F7" }}>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at 60% 0%, rgba(0,122,255,0.07), transparent 60%), #F2F2F7", minHeight: "88vh", display: "flex", alignItems: "center" }}>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(0,122,255,0.05)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(0,194,168,0.06)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-6"
                style={{ background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", color: "#007AFF" }}>
                <Activity className="w-4 h-4" />
                India's #1 Medical Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-display font-extrabold leading-[1.1] tracking-tight mb-5" style={{ color: "#1C1C1E" }}>
                Study, Diagnose, and Source —{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
                  All in One Medical Platform
                </span>
              </h1>

              <p className="text-lg mb-8 leading-relaxed max-w-xl" style={{ color: "#636366" }}>
                AI-powered clinical tools, exam prep, and medical supplies — built for Indian medical students and doctors.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/ai-assistant"
                  className="inline-flex items-center justify-center px-7 py-4 text-base font-bold rounded-full shadow-lg transition-all hover:opacity-90 hover:-translate-y-0.5 text-center"
                  style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,122,255,0.3)" }}>
                  <Sparkles className="mr-2 w-4 h-4" />
                  Start Free AI Consultation
                </Link>
                <Link href="/tools"
                  className="inline-flex items-center justify-center px-7 py-4 text-base font-bold rounded-full transition-all hover:bg-black/8 text-center"
                  style={{ background: "rgba(120,120,128,0.16)", color: "#1C1C1E" }}>
                  Explore Tools
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              <p className="mt-5 text-sm" style={{ color: "#AEAEB2" }}>
                Free to start · No credit card required · 20 queries/day on free plan
              </p>
            </motion.div>

            {/* Right: AI Chat Preview */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="hidden lg:block"
            >
              <AIChatPreview />
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
                const Icon = categoryIconMap[cat.icon as string] || Activity;
                return (
                  <Link
                    key={cat.slug}
                    href={`/shop?category=${cat.slug}`}
                    className="group flex flex-col items-center p-5 rounded-2xl transition-all hover:-translate-y-1"
                    style={{ background: "#F2F2F7", border: "1px solid rgba(60,60,67,0.1)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,122,255,0.3)"; (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(60,60,67,0.1)"; (e.currentTarget as HTMLElement).style.background = "#F2F2F7"; }}
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                      style={{ background: "#FFFFFF", color: "#007AFF" }}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-semibold text-center" style={{ color: "#1C1C1E" }}>{cat.name}</span>
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
              <div key={idx} className="px-5 py-2.5 rounded-xl text-sm transition-all cursor-default"
                style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.12)", color: "#636366" }}>
                {brand}
              </div>
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
