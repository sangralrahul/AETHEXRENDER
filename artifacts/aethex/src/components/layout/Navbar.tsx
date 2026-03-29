import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, Sparkles, User, Star, MapPin, ShieldCheck, ChevronDown, Store, BookOpen, Newspaper } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/NotificationBell";

export function Navbar() {
  const [location, setLocation] = useLocation();
  const sessionId = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
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
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-border shadow-sm py-3"
          : "bg-white border-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}aethex-logo.jpg`}
              alt="aethex logo"
              className="w-10 h-10 object-contain"
            />
            <span className="font-display font-bold text-2xl tracking-tight text-[#0F2A5C] leading-none">
              aethex
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border-2 border-border rounded-2xl leading-5 bg-muted/30 placeholder-muted-foreground focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all sm:text-sm"
              placeholder="Search scrubs, stethoscopes, books..."
            />
          </form>

          {/* Right Navigation */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href="/ai-assistant"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-secondary to-secondary/50 text-secondary-foreground font-semibold hover:shadow-md transition-all border border-secondary hover-lift"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>SYNAPSE</span>
            </Link>

            <Link
              href="/products"
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors hidden md:block"
            >
              Shop All
            </Link>

            <Link
              href="/blog"
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors hidden lg:block"
            >
              Blog
            </Link>

            <Link
              href="/news"
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors hidden lg:block"
            >
              News
            </Link>

            {/* Account Dropdown */}
            <div ref={accountRef} className="relative hidden md:block">
              <button onClick={() => setAccountOpen(o => !o)}
                className="flex items-center gap-1 p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-100 transition-all">
                <User className="w-5 h-5" />
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 py-2 z-50">
                  <Link href="/my-reviews" onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">
                    <Star className="w-4 h-4" /> My Reviews
                  </Link>
                  <Link href="/orders/track" onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">
                    <MapPin className="w-4 h-4" /> Track Order
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <Link href="/seller/dashboard" onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">
                    <Store className="w-4 h-4" /> Seller Hub
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <Link href="/admin/reviews" onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors">
                    <ShieldCheck className="w-4 h-4" /> Admin Reviews
                  </Link>
                  <Link href="/admin/sellers" onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors">
                    <ShieldCheck className="w-4 h-4" /> Admin Sellers
                  </Link>
                  <Link href="/admin/blog" onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors">
                    <BookOpen className="w-4 h-4" /> Admin Blog
                  </Link>
                </div>
              )}
            </div>

            <NotificationBell />

            <Link href="/cart" className="relative p-2 text-foreground hover:bg-muted rounded-full transition-colors hover-lift">
              <ShoppingCart className="w-6 h-6" />
              {cart && cart.itemCount > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-destructive rounded-full border-2 border-white">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
