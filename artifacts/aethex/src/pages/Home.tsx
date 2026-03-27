import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldPlus, BrainCircuit, Users, Package, MapPin, SmilePlus, Sparkles, Shirt, FlaskConical, BookOpen, Stethoscope, Scissors, HeartPulse, Shield, Quote } from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { useAddToCart } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const categoryIconMap: Record<string, React.ElementType> = {
  Shirt, FlaskConical, BookOpen, Stethoscope, Scissors, Activity, Shield, HeartPulse
};

const trustedBrands = [
  "3M Littmann", "OMRON", "Accu-Chek", "Grey's Anatomy", "DAMS", "MDF Instruments", "Dr. Trust", "SurgiMed"
];

const testimonials = [
  {
    quote: "AETHEX is the only place I buy my stethoscopes and books. Fast delivery, genuine products.",
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
    <div className="min-h-screen pt-[72px]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-medical-bg.png`}
            alt="Medical abstract background"
            className="w-full h-full object-cover opacity-30 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20 shadow-sm">
                <Activity className="w-4 h-4" />
                India's #1 Store for Medical Professionals
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                Equip your practice with <span className="text-gradient">excellence.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg font-medium">
                Premium medical supplies, tailored for Indian doctors and medical students. From Littmann stethoscopes to top-tier scrubs and standard textbooks.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-primary rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  Shop Essentials
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/ai-assistant" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-primary bg-white border-2 border-primary/20 rounded-xl hover:bg-primary/5 hover:border-primary/40 transition-all">
                  Try AI Assistant
                  <BrainCircuit className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0F2A5C] text-white py-10 relative z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            <div className="flex flex-col items-center justify-center text-center px-4">
              <Users className="w-8 h-8 text-[#00C4B4] mb-3" />
              <div className="text-3xl font-display font-bold mb-1">50,000+</div>
              <div className="text-sm text-slate-300 font-medium">Doctors Trust Us</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <Package className="w-8 h-8 text-[#00C4B4] mb-3" />
              <div className="text-3xl font-display font-bold mb-1">1,000+</div>
              <div className="text-sm text-slate-300 font-medium">Medical Products</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <MapPin className="w-8 h-8 text-[#00C4B4] mb-3" />
              <div className="text-3xl font-display font-bold mb-1">28+</div>
              <div className="text-sm text-slate-300 font-medium">States Delivered</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <SmilePlus className="w-8 h-8 text-[#00C4B4] mb-3" />
              <div className="text-3xl font-display font-bold mb-1">98%</div>
              <div className="text-sm text-slate-300 font-medium">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Find exactly what you need for your medical journey, rigorously sorted and quality-checked.</p>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-40 bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories?.map((cat, i) => {
                const IconComp = categoryIconMap[cat.iconName || ""] || Activity;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    key={cat.id}
                  >
                    <Link 
                      href={`/products?category=${cat.slug}`}
                      className="flex flex-col items-center justify-center p-6 text-center h-full rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg transition-all group"
                    >
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-foreground text-sm">{cat.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{cat.productCount} Items</p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-slate-50 border-t border-border/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted Brands We Carry</p>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8 opacity-70">
            {trustedBrands.map((brand, idx) => (
              <div key={idx} className="px-6 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default">
                <span className="font-display font-bold text-slate-700 text-lg">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Featured Essentials</h2>
              <p className="text-muted-foreground">Top-rated equipment trusted by doctors.</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center text-primary font-semibold hover:underline bg-primary/10 px-4 py-2 rounded-lg">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsData?.products.slice(0, 8).map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  isAdding={addToCartMutation.isPending}
                />
              ))}
            </div>
          )}
          
          <div className="mt-10 text-center sm:hidden">
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link href="/products">View all products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Doctor Recommended</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Hear what medical professionals across India have to say about AETHEX.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-[#0F2A5C]/10 shadow-xl shadow-slate-200/50 relative hover:-translate-y-1 transition-transform">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
                <div className="flex items-center gap-1 mb-6 text-amber-400">
                  {[1,2,3,4,5].map(star => <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
                </div>
                <p className="text-slate-700 italic mb-8 relative z-10 font-medium leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-[#0F2A5C] text-white flex items-center justify-center font-bold text-lg">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{t.name}</h4>
                    <p className="text-sm text-primary font-medium">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Banner */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 lg:p-16 relative overflow-hidden shadow-2xl">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent font-semibold text-sm mb-6 border border-accent/30">
                  <BrainCircuit className="w-4 h-4" />
                  AETHEX AI Assistant
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight">
                  Your smart companion for medical queries & product choices.
                </h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  Stuck between two stethoscopes? Need quick reference for a dosage guideline? Our specialized medical AI is trained to assist Indian doctors instantly.
                </p>
                <Link href="/ai-assistant" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-900 bg-white rounded-xl shadow-lg hover:bg-slate-100 hover:scale-105 transition-all">
                  Chat Now - It's Free
                  <Sparkles className="ml-2 w-5 h-5 text-accent" />
                </Link>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="relative w-80 h-80">
                  <div className="absolute inset-0 bg-accent/20 rounded-full animate-pulse blur-3xl" />
                  <img 
                    src={`${import.meta.env.BASE_URL}images/ai-doctor-avatar.png`}
                    alt="AI Doctor Assistant"
                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}