import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Activity, BrainCircuit, Sparkles, Shirt, FlaskConical, BookOpen, Stethoscope, Scissors, HeartPulse, Shield, Quote, GraduationCap, FileText, Microscope, PenLine, Trophy, ShieldCheck, Truck, RotateCcw, Receipt, Send, MessageSquare, Search, Image, Zap, Wrench, ClipboardList, CheckCircle2 } from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { useSession } from "@/hooks/use-session";
import { useAddToCart } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const categoryIconMap: Record<string, React.ElementType> = {
  Shirt, FlaskConical, BookOpen, Stethoscope, Scissors, Activity, Shield, HeartPulse
};

const studyHubItems = [
  { icon: BookOpen, label: "Textbooks", desc: "MBBS & PG standard texts", color: "#007AFF", href: "/shop?category=books" },
  { icon: FileText, label: "MCQ Banks", desc: "NEET PG, USMLE, FMGE prep", color: "#8B5CF6", href: "/shop?category=books&search=MCQ" },
  { icon: Microscope, label: "Lab Manuals", desc: "Pathology & physiology manuals", color: "#00C2A8", href: "/shop?category=books&search=manual" },
  { icon: GraduationCap, label: "Exam Notes", desc: "High-yield short notes", color: "#F59E0B", href: "/shop?category=books&search=notes" },
  { icon: PenLine, label: "Case Studies", desc: "Clinical case books & vignettes", color: "#EF4444", href: "/shop?category=books&search=case" },
  { icon: Trophy, label: "Top Ranked", desc: "Best-sellers for PG entrance", color: "#EC4899", href: "/study-hub" },
];

const trustedBrands = [
  "3M Littmann", "OMRON", "Accu-Chek", "Grey's Anatomy", "DAMS", "MDF Instruments", "Dr. Trust", "SurgiMed"
];

const testimonials = [
  {
    quote: "aethex is the only place I buy my stethoscopes and books. Fast delivery, genuine products.",
    name: "Dr. Priya Sharma",
    title: "MBBS, AIIMS Delhi",
    initials: "PS",
  },
  {
    quote: "The AI assistant helped me choose the right BP monitor for my clinic. Saved me hours of research.",
    name: "Dr. Rohan Malhotra",
    title: "MD Cardiology, PGI Chandigarh",
    initials: "RM",
  },
  {
    quote: "Best prices on surgical instruments in India. The scrubs are incredibly comfortable for 24-hour shifts.",
    name: "Dr. Ananya Krishnan",
    title: "Resident Surgeon, KEM Mumbai",
    initials: "AK",
  }
];

const trustBadges = [
  { icon: Receipt, label: "GST Invoice", desc: "Included with every order" },
  { icon: Truck, label: "Fast Delivery", desc: "Pan-India, 2–5 business days" },
  { icon: ShieldCheck, label: "Verified Brands", desc: "100% authentic products only" },
  { icon: RotateCcw, label: "Easy Returns", desc: "7-day hassle-free returns" },
];

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
    <section className="py-16" style={{ background: "#1C1C1E", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-5"
          style={{ background: "rgba(0,194,168,0.15)", border: "1px solid rgba(0,194,168,0.25)", color: "#00C2A8" }}>
          <Send className="w-3.5 h-3.5" />
          Newsletter
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-3">
          Weekly Medical Insights + NEET-PG Tips
        </h2>
        <p className="mb-8 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
          Get the latest clinical tips, medical news, exam updates, and exclusive deals — direct to your inbox. Join 12,000+ Indian doctors.
        </p>
        {done ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold"
            style={{ background: "rgba(0,194,168,0.15)", border: "1px solid rgba(0,194,168,0.3)", color: "#00C2A8" }}>
            <CheckCircle2 className="w-5 h-5" />
            You're subscribed! Weekly updates incoming.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="doctor@hospital.in"
              className="flex-1 px-5 py-3.5 rounded-xl text-sm focus:outline-none"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#FFFFFF" }} />
            <button type="submit" disabled={loading}
              className="px-6 py-3.5 font-bold rounded-xl transition-all disabled:opacity-60 flex items-center gap-2 justify-center whitespace-nowrap"
              style={{ background: "#007AFF", color: "#FFFFFF" }}>
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
  
  const { data: productsData, isLoading: loadingProducts } = useListProducts({ limit: 8 });
  const { data: categories, isLoading: loadingCategories } = useListCategories();
  
  const addToCartMutation = useAddToCart();

  const handleAddToCart = (productId: number) => {
    if (!sessionId) return;
    addToCartMutation.mutate(
      { data: { productId, sessionId, quantity: 1 } },
      {
        onSuccess: () => {
          toast({ title: "Added to cart", description: "Item successfully added to your cart." });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to add item to cart." });
        }
      }
    );
  };

  return (
    <div className="min-h-screen pt-[72px]" style={{ background: "#F2F2F7" }}>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,122,255,0.07), transparent 65%), #F2F2F7" }}>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(0,122,255,0.06)" }} />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(0,194,168,0.07)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 lg:py-32 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-6"
                style={{ background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", color: "#007AFF" }}>
                <Activity className="w-4 h-4" />
                India's #1 Store for Medical Professionals
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-extrabold leading-[1.05] tracking-tight mb-4" style={{ color: "#1C1C1E" }}>
                Medicine Made{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
                  Effortless.
                </span>
              </h1>
              <p className="text-lg mb-8 leading-relaxed max-w-xl" style={{ color: "#636366" }}>
                From clinical queries to exam prep, AETHEX combines the AI tools, medical supplies, and study resources doctors and students need most.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/shop"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full shadow-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: "#007AFF", color: "#FFFFFF", boxShadow: "0 4px 16px rgba(0,122,255,0.3)" }}>
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/ai-assistant"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full transition-all hover:bg-black/8"
                  style={{ background: "rgba(120,120,128,0.16)", color: "#1C1C1E" }}>
                  Meet Cadus AI
                  <BrainCircuit className="ml-2 w-5 h-5" style={{ color: "#007AFF" }} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-8" style={{ background: "#FFFFFF", borderTop: "1px solid rgba(60,60,67,0.1)", borderBottom: "1px solid rgba(60,60,67,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8" style={{ borderRight: "none" }}>
            {[
              { value: "50,000+", label: "Doctors Trust Us" },
              { value: "1,000+", label: "Medical Products" },
              { value: "28+", label: "States Delivered" },
              { value: "98%", label: "Customer Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center px-4"
                style={i > 0 ? { borderLeft: "1px solid rgba(60,60,67,0.1)" } : {}}>
                <div className="text-3xl font-display font-bold mb-1" style={{ color: "#007AFF" }}>{stat.value}</div>
                <div className="text-sm font-medium" style={{ color: "#636366" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Features Grid ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: "#F2F2F7" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3" style={{ color: "#1C1C1E" }}>
              Everything Medicine,{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>One Platform</span>
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#636366" }}>
              From clinical queries to exam prep, AETHEX combines the tools doctors and students need most.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <MessageSquare className="w-6 h-6" />, title: "AI Medical Assistant", desc: "Ask any clinical question and get structured, textbook-quality answers with references.", href: "/ai-assistant", color: "#007AFF" },
              { icon: <Search className="w-6 h-6" />, title: "Disease Knowledge Engine", desc: "Searchable database of diseases with pathophysiology, diagnosis, treatment, and more.", href: "/tools", color: "#5856D6" },
              { icon: <Image className="w-6 h-6" />, title: "Medical Image Library", desc: "Browse radiology, pathology, dermatology images linked to diseases and conditions.", href: "/tools", color: "#AF52DE" },
              { icon: <Sparkles className="w-6 h-6" />, title: "AI Image Generator", desc: "Generate medical diagrams, anatomy visuals, and pathology illustrations on demand.", href: "/ai-assistant", color: "#FF2D55" },
              { icon: <Zap className="w-6 h-6" />, title: "Deep Research Engine", desc: "Search and summarize medical literature, analyze papers, and explain complex studies.", href: "/ai-assistant", color: "#FF9500" },
              { icon: <BookOpen className="w-6 h-6" />, title: "Study Materials", desc: "NEET PG, USMLE prep with flashcards, MCQs, clinical cases, and subject-wise notes.", href: "/study-hub", color: "#34C759" },
              { icon: <Wrench className="w-6 h-6" />, title: "Clinical Tools", desc: "Drug interactions, dosage calculators, BMI tools, and differential diagnosis generators.", href: "/tools", color: "#32ADE6" },
              { icon: <ClipboardList className="w-6 h-6" />, title: "Clinical Decision Support", desc: "Input symptoms and labs to get AI-powered differential diagnoses and treatment plans.", href: "/ai-assistant", color: "#00C2A8" },
            ].map((feature, i) => (
              <Link key={i} href={feature.href}>
                <div
                  className="group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 h-full"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(60,60,67,0.1)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)")}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: feature.color + "15", color: feature.color }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-[14px] mb-2 leading-snug" style={{ color: "#1C1C1E" }}>{feature.title}</h3>
                  <p className="text-[12px] leading-relaxed" style={{ color: "#AEAEB2" }}>{feature.desc}</p>
                </div>
              </Link>
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

      {/* ── Categories Section ── */}
      <section className="py-16" style={{ background: "#F2F2F7" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold mb-3" style={{ color: "#1C1C1E" }}>Shop by Category</h2>
            <p style={{ color: "#636366" }}>Everything a modern doctor needs</p>
          </div>
          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl" style={{ background: "rgba(120,120,128,0.12)" }} />
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
                    style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,122,255,0.3)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,122,255,0.1)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(60,60,67,0.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-4 transition-all group-hover:scale-110"
                      style={{ background: "#F2F2F7", color: "#007AFF" }}>
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

      {/* ── Study Hub Teaser ── */}
      <section className="py-16 relative overflow-hidden" style={{ background: "#FFFFFF", borderTop: "1px solid rgba(60,60,67,0.08)", borderBottom: "1px solid rgba(60,60,67,0.08)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(0,122,255,0.05)" }} />
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(0,194,168,0.05)" }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4"
                style={{ background: "rgba(0,122,255,0.1)", border: "1px solid rgba(0,122,255,0.2)", color: "#007AFF" }}>
                <GraduationCap className="w-4 h-4" />
                Study Hub
              </div>
              <h2 className="text-3xl font-display font-bold" style={{ color: "#1C1C1E" }}>Medical Exam Prep</h2>
              <p className="mt-2" style={{ color: "#636366" }}>Books, coaching platforms, and study resources for NEET PG, NEXT, FMGE & USMLE</p>
            </div>
            <Link href="/study-hub" className="hidden sm:flex items-center gap-2 font-semibold text-sm" style={{ color: "#007AFF" }}>
              Explore Study Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {studyHubItems.map((item, i) => (
              <Link key={i} href={item.href}
                className="group flex flex-col items-center p-5 rounded-2xl transition-all hover:-translate-y-1 text-center"
                style={{ background: "#F2F2F7", border: "1px solid rgba(60,60,67,0.1)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110"
                  style={{ background: item.color + "15" }}>
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div className="font-semibold text-sm mb-1" style={{ color: "#1C1C1E" }}>{item.label}</div>
                <div className="text-xs leading-snug" style={{ color: "#AEAEB2" }}>{item.desc}</div>
              </Link>
            ))}
          </div>
          <div className="mt-6 sm:hidden text-center">
            <Link href="/study-hub" className="text-sm font-semibold" style={{ color: "#007AFF" }}>View full Study Hub →</Link>
          </div>
        </div>
      </section>

      {/* ── Trusted Brands ── */}
      <section className="py-10 overflow-hidden" style={{ background: "#F2F2F7", borderBottom: "1px solid rgba(60,60,67,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-widest mb-6" style={{ color: "#AEAEB2" }}>Trusted brands on aethex</p>
          <div className="flex flex-wrap justify-center gap-3">
            {trustedBrands.map((brand, idx) => (
              <div key={idx} className="px-5 py-2.5 rounded-xl text-sm transition-all cursor-default"
                style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.12)", color: "#636366", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
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
            <h2 className="text-3xl font-display font-bold mb-3" style={{ color: "#1C1C1E" }}>Doctor Recommended</h2>
            <p className="max-w-2xl mx-auto" style={{ color: "#636366" }}>Hear what medical professionals across India have to say about aethex.</p>
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

      {/* ── Cadus AI Banner ── */}
      <section className="py-20" style={{ background: "#F2F2F7" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 lg:p-14 relative overflow-hidden shadow-2xl"
            style={{ background: "linear-gradient(135deg, #007AFF 0%, #00C2A8 100%)" }}>
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"
              style={{ background: "rgba(255,255,255,0.12)" }} />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-3xl"
              style={{ background: "rgba(0,0,0,0.08)" }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-6"
                  style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", color: "#FFFFFF" }}>
                  <BrainCircuit className="w-4 h-4" />
                  Cadus AI — aethex AI Suite
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
                  Your smart AI companion for medical queries.
                </h2>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Diagnose, research, analyze labs, generate SOAP notes, check drug interactions — everything an Indian doctor needs, powered by specialized AI.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/ai-assistant"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full transition-all hover:scale-105"
                    style={{ background: "#FFFFFF", color: "#007AFF" }}>
                    Start Chat — It's Free
                    <Sparkles className="ml-2 w-5 h-5" />
                  </Link>
                  <Link href="/account"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white rounded-full transition-all"
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}>
                    View Pro Plans
                  </Link>
                </div>
                <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Free: 20 queries/day · Pro: 200 queries/day from ₹299/month</p>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-3xl scale-150" style={{ background: "rgba(255,255,255,0.12)" }} />
                  <div className="relative grid grid-cols-2 gap-3">
                    {[
                      { label: "Diagnose", color: "#FFFFFF" },
                      { label: "DDx Generator", color: "#FFFFFF" },
                      { label: "Drug Interactions", color: "#FFFFFF" },
                      { label: "SOAP Notes", color: "#FFFFFF" },
                      { label: "Lab Values", color: "#FFFFFF" },
                      { label: "MCQ Generator", color: "#FFFFFF" },
                    ].map((mode, i) => (
                      <div key={i} className="px-4 py-3 rounded-xl text-sm font-semibold cursor-default transition-all"
                        style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", color: "#FFFFFF" }}>
                        {mode.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <NewsletterSection />
    </div>
  );
}
