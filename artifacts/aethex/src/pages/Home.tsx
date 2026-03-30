import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Activity, BrainCircuit, Sparkles, Shirt, FlaskConical, BookOpen, Stethoscope, Scissors, HeartPulse, Shield, Quote, GraduationCap, FileText, Microscope, PenLine, Trophy, ShieldCheck, Truck, RotateCcw, Receipt, CheckCircle2, Send } from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { useSession } from "@/hooks/use-session";
import { useAddToCart } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const categoryIconMap: Record<string, React.ElementType> = {
  Shirt, FlaskConical, BookOpen, Stethoscope, Scissors, Activity, Shield, HeartPulse
};

const studyHubItems = [
  { icon: BookOpen, label: "Textbooks", desc: "MBBS & PG standard texts", color: "#3B82F6", href: "/shop?category=books" },
  { icon: FileText, label: "MCQ Banks", desc: "NEET PG, USMLE, FMGE prep", color: "#8B5CF6", href: "/shop?category=books&search=MCQ" },
  { icon: Microscope, label: "Lab Manuals", desc: "Pathology & physiology manuals", color: "#10B981", href: "/shop?category=books&search=manual" },
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
    <section className="py-16 bg-[#0D1117] border-t border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C2A8]/15 border border-[#00C2A8]/25 text-[#00C2A8] text-sm font-semibold mb-5">
          <Send className="w-3.5 h-3.5" />
          Newsletter
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-3">
          Weekly Medical Insights + NEET-PG Tips
        </h2>
        <p className="text-white/50 mb-8 max-w-xl mx-auto">
          Get the latest clinical tips, medical news, exam updates, and exclusive deals — direct to your inbox. Join 12,000+ Indian doctors.
        </p>
        {done ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#00C2A8]/15 border border-[#00C2A8]/30 rounded-2xl text-[#00C2A8] font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            You're subscribed! Weekly updates incoming.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="doctor@hospital.in"
              className="flex-1 px-5 py-3.5 bg-[#161B22] border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#00C2A8]/50 focus:ring-1 focus:ring-[#00C2A8]/20 text-sm" />
            <button type="submit" disabled={loading}
              className="px-6 py-3.5 bg-[#00C2A8] text-[#0D1117] font-bold rounded-xl hover:bg-[#00D4B8] transition-all disabled:opacity-60 flex items-center gap-2 justify-center whitespace-nowrap">
              <Send className="w-4 h-4" />
              {loading ? "Subscribing..." : "Subscribe Free"}
            </button>
          </form>
        )}
        <p className="mt-4 text-xs text-white/25">No spam. Unsubscribe any time.</p>
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
          toast({
            title: "Added to cart",
            description: "Item successfully added to your cart.",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to add item to cart.",
          });
        }
      }
    );
  };

  return (
    <div className="min-h-screen pt-[72px] bg-[#0D1117]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0D1117]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#00C2A8]/6 via-transparent to-blue-600/6" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00C2A8]/8 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 lg:py-32 max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C2A8]/15 text-[#00C2A8] font-semibold text-sm mb-6 border border-[#00C2A8]/25">
                <Activity className="w-4 h-4" />
                India's #1 Store for Medical Professionals
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-white leading-[1.05] tracking-tight mb-6">
                Everything a Doctor Needs,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00C2A8] to-[#00E5D0]">
                  Delivered.
                </span>
              </h1>
              <p className="text-lg text-white/60 mb-8 leading-relaxed max-w-xl">
                Premium medical supplies for Indian doctors and students. From Littmann stethoscopes to top-tier scrubs, surgical instruments, textbooks, and SYNAPSE AI — all in one place.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/shop" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#0D1117] bg-[#00C2A8] rounded-xl shadow-lg shadow-[#00C2A8]/20 hover:bg-[#00D4B8] hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Shop Essentials
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/ai-assistant" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-white/8 border border-white/15 rounded-xl hover:bg-white/15 hover:border-white/25 transition-all">
                  Try SYNAPSE AI
                  <BrainCircuit className="ml-2 w-5 h-5 text-[#00C2A8]" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#161B22] border-y border-white/8 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/8">
            {[
              { value: "50,000+", label: "Doctors Trust Us" },
              { value: "1,000+", label: "Medical Products" },
              { value: "28+", label: "States Delivered" },
              { value: "98%", label: "Customer Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                <div className="text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/40 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 bg-[#0D1117] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-[#161B22] border border-white/8 rounded-2xl hover:border-[#00C2A8]/20 transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#00C2A8]/15 flex items-center justify-center shrink-0">
                  <badge.icon className="w-5 h-5 text-[#00C2A8]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{badge.label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-[#0D1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-white mb-3">Shop by Category</h2>
            <p className="text-white/50">Everything a modern doctor needs</p>
          </div>
          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-36 bg-white/5 animate-pulse rounded-2xl" />
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
                    className="group flex flex-col items-center p-5 bg-[#161B22] border border-white/8 rounded-2xl hover:border-[#00C2A8]/30 hover:bg-[#00C2A8]/5 hover:-translate-y-1 transition-all"
                  >
                    <div className="w-14 h-14 bg-[#0D1117] rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:bg-[#00C2A8]/15 transition-all text-white/50 group-hover:text-[#00C2A8]">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-semibold text-white/80 group-hover:text-white text-center">{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Study Hub Teaser */}
      <section className="py-16 bg-gradient-to-br from-[#161B22] to-[#0D1117] border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#00C2A8]/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-violet-400/30 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2A8]/20 text-[#00C2A8] font-semibold text-sm mb-4 border border-[#00C2A8]/30">
                <GraduationCap className="w-4 h-4" />
                Study Hub
              </div>
              <h2 className="text-3xl font-display font-bold text-white">Medical Exam Prep</h2>
              <p className="text-white/50 mt-2">Books, coaching platforms, and study resources for NEET PG, NEXT, FMGE & USMLE</p>
            </div>
            <Link href="/study-hub" className="hidden sm:flex items-center gap-2 text-[#00C2A8] hover:underline font-semibold text-sm">
              Explore Study Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {studyHubItems.map((item, i) => (
              <Link key={i} href={item.href}
                className="group flex flex-col items-center p-5 bg-[#0D1117]/60 border border-white/8 rounded-2xl hover:border-white/20 hover:-translate-y-1 transition-all text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110"
                  style={{ background: item.color + "20" }}>
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div className="font-semibold text-sm text-white mb-1">{item.label}</div>
                <div className="text-xs text-white/40 leading-snug">{item.desc}</div>
              </Link>
            ))}
          </div>
          <div className="mt-6 sm:hidden text-center">
            <Link href="/study-hub" className="text-sm text-[#00C2A8] hover:underline font-semibold">View full Study Hub →</Link>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-10 bg-[#0D1117] border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-white/30 uppercase tracking-widest mb-6">Trusted brands on aethex</p>
          <div className="flex flex-wrap justify-center gap-3">
            {trustedBrands.map((brand, idx) => (
              <div key={idx} className="px-5 py-2.5 bg-[#161B22] border border-white/8 rounded-xl text-sm text-white/50 hover:text-white/80 hover:border-white/15 transition-all cursor-default">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#0D1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Featured Products</h2>
              <p className="text-white/50">Top picks for Indian doctors</p>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-2 text-[#00C2A8] hover:underline font-semibold text-sm">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-white/5 animate-pulse rounded-2xl" />
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
            <Link href="/shop" className="text-sm text-[#00C2A8] hover:underline font-semibold">View all products →</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#161B22] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-display font-bold text-white mb-3">Doctor Recommended</h2>
            <p className="text-white/50 max-w-2xl mx-auto">Hear what medical professionals across India have to say about aethex.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-[#0D1117] border border-white/8 p-7 rounded-2xl relative hover:-translate-y-1 transition-transform">
                <Quote className="absolute top-5 right-5 w-10 h-10 text-[#00C2A8]/10" />
                <div className="flex items-center gap-1 mb-5 text-amber-400">
                  {[1,2,3,4,5].map(star => <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
                </div>
                <p className="text-white/70 italic mb-7 font-medium leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#00C2A8]/20 border border-[#00C2A8]/30 text-[#00C2A8] flex items-center justify-center font-bold text-base">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <p className="text-xs text-[#00C2A8]">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYNAPSE AI Banner */}
      <section className="py-20 bg-[#0D1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#161B22] to-[#0D1117] border border-[#00C2A8]/15 rounded-3xl p-8 lg:p-14 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C2A8]/8 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2A8]/15 text-[#00C2A8] font-semibold text-sm mb-6 border border-[#00C2A8]/25">
                  <BrainCircuit className="w-4 h-4" />
                  SYNAPSE — aethex AI Suite
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
                  Your smart AI companion for medical queries.
                </h2>
                <p className="text-white/60 text-lg mb-8 leading-relaxed">
                  Diagnose, research, analyze labs, generate SOAP notes, check drug interactions — everything an Indian doctor needs, powered by specialized AI.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/ai-assistant" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#0D1117] bg-[#00C2A8] rounded-xl hover:bg-[#00D4B8] hover:scale-105 transition-all">
                    Try Now — It's Free
                    <Sparkles className="ml-2 w-5 h-5" />
                  </Link>
                  <Link href="/account" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/8 border border-white/15 rounded-xl hover:bg-white/15 transition-all">
                    View Pro Plans
                  </Link>
                </div>
                <p className="mt-4 text-xs text-white/30">Free: 10 queries/day · Pro: Unlimited from ₹299/month</p>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00C2A8]/10 rounded-full blur-3xl scale-150" />
                  <div className="relative grid grid-cols-2 gap-3">
                    {[
                      { label: "Diagnose", color: "#00C2A8" },
                      { label: "DDx Generator", color: "#6366F1" },
                      { label: "Drug Interactions", color: "#F59E0B" },
                      { label: "SOAP Notes", color: "#EC4899" },
                      { label: "Lab Values", color: "#10B981" },
                      { label: "MCQ Generator", color: "#3B82F6" },
                    ].map((mode, i) => (
                      <div key={i} className="px-4 py-3 bg-[#161B22] border border-white/10 rounded-xl text-sm font-semibold text-white hover:border-white/25 transition-all cursor-default"
                        style={{ borderLeftColor: mode.color, borderLeftWidth: "3px" }}>
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

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
