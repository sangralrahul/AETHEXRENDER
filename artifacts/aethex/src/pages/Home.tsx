import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldPlus, BrainCircuit, HeartPulse, Sparkles } from "lucide-react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { useAddToCart } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
                <Activity className="w-4 h-4" />
                India's #1 Store for Medical Professionals
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
                Equip your practice with <span className="text-gradient">excellence.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
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
              {categories?.map((cat, i) => (
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
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      {/* Using generic icon for categories dynamically */}
                      <ShieldPlus className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{cat.productCount} Items</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Featured Essentials</h2>
              <p className="text-muted-foreground">Top-rated equipment trusted by doctors.</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center text-primary font-semibold hover:underline">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
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
          
          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link href="/products">View all products</Link>
            </Button>
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent font-semibold text-sm mb-6">
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
                <div className="relative w-72 h-72">
                  <div className="absolute inset-0 bg-accent/20 rounded-full animate-pulse blur-2xl" />
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
