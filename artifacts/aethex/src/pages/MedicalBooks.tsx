import { useState, useEffect, useRef } from "react";
import {
  BookOpen, Search, ShoppingCart, Star, ChevronRight,
  Heart, Brain, FlaskConical, Scissors, Stethoscope, Baby,
  Eye, Wind, Droplets, Waves, ScanLine, HeartPulse, Bone,
  AlertTriangle, Scan, Microscope, Pipette, Activity, Dumbbell,
  BrainCircuit, TestTube2, Dna, GraduationCap, Trophy,
  Sparkles, Tag, TrendingUp, BookMarked, Library,
} from "lucide-react";
import { useAddToCart } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ── Department definitions ─────────────────────────────────────────────────
interface BookDept {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  categorySlug: string;
}

const DEPARTMENTS: BookDept[] = [
  { id: "general",       label: "General Medicine",    icon: Stethoscope,  color: "#007AFF", gradient: "from-blue-600 to-blue-900",      categorySlug: "books" },
  { id: "surgery",       label: "Surgery",             icon: Scissors,     color: "#FF6B35", gradient: "from-orange-600 to-orange-900",   categorySlug: "surgical" },
  { id: "cardiology",    label: "Cardiology",          icon: HeartPulse,   color: "#FF3B30", gradient: "from-rose-600 to-rose-900",       categorySlug: "cardiac-care" },
  { id: "orthopaedics",  label: "Orthopaedics",        icon: Bone,         color: "#8E7355", gradient: "from-stone-600 to-stone-900",     categorySlug: "orthopaedic" },
  { id: "neurology",     label: "Neurology",           icon: Brain,        color: "#5856D6", gradient: "from-violet-600 to-violet-900",   categorySlug: "neurology" },
  { id: "gastro",        label: "Gastroenterology",    icon: FlaskConical, color: "#FF9500", gradient: "from-amber-500 to-orange-800",    categorySlug: "gastroenterology" },
  { id: "nephrology",    label: "Nephrology",          icon: Droplets,     color: "#007AFF", gradient: "from-blue-500 to-blue-800",       categorySlug: "nephrology" },
  { id: "pulmonology",   label: "Pulmonology",         icon: Wind,         color: "#5AC8FA", gradient: "from-sky-500 to-blue-800",        categorySlug: "pulmonology" },
  { id: "ophthalmology", label: "Ophthalmology",       icon: Eye,          color: "#32ADE6", gradient: "from-cyan-600 to-cyan-900",       categorySlug: "ophthalmology" },
  { id: "paediatrics",   label: "Paediatrics",         icon: Baby,         color: "#FF2D92", gradient: "from-pink-500 to-pink-800",       categorySlug: "paediatric" },
  { id: "dermatology",   label: "Dermatology",         icon: ScanLine,     color: "#BF5AF2", gradient: "from-fuchsia-600 to-purple-900",  categorySlug: "dermatology" },
  { id: "ent",           label: "ENT",                 icon: Waves,        color: "#AF52DE", gradient: "from-purple-600 to-purple-900",   categorySlug: "ent" },
  { id: "gynaecology",   label: "Gynaecology & Obs",   icon: Heart,        color: "#FF2D92", gradient: "from-pink-600 to-rose-900",       categorySlug: "gynaecology" },
  { id: "endocrinology", label: "Endocrinology",       icon: Dna,          color: "#FFD60A", gradient: "from-yellow-500 to-amber-800",    categorySlug: "endocrinology" },
  { id: "emergency",     label: "Emergency Medicine",  icon: AlertTriangle,color: "#FF3B30", gradient: "from-red-600 to-red-900",         categorySlug: "emergency" },
  { id: "radiology",     label: "Radiology",           icon: Scan,         color: "#636366", gradient: "from-zinc-600 to-zinc-900",       categorySlug: "radiology" },
  { id: "oncology",      label: "Oncology",            icon: Microscope,   color: "#00C2A8", gradient: "from-teal-600 to-teal-900",       categorySlug: "oncology" },
  { id: "anaesthesia",   label: "Anaesthesia",         icon: Pipette,      color: "#8E8E93", gradient: "from-slate-500 to-slate-800",     categorySlug: "anaesthesia" },
  { id: "psychiatry",    label: "Psychiatry",          icon: BrainCircuit, color: "#5856D6", gradient: "from-indigo-600 to-purple-900",   categorySlug: "psychiatry" },
  { id: "urology",       label: "Urology",             icon: TestTube2,    color: "#FF9500", gradient: "from-amber-500 to-orange-800",    categorySlug: "urology" },
  { id: "physiotherapy", label: "Physiotherapy",       icon: Dumbbell,     color: "#34C759", gradient: "from-green-500 to-green-800",     categorySlug: "physiotherapy" },
];

// ── Book card covers (gradient lookup by dept) ────────────────────────────
const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&q=80",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&q=80",
];

// ── Single book card ──────────────────────────────────────────────────────
interface BookCardProps {
  book: {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    brand: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    tags: string[];
    featured: boolean;
  };
  dept: BookDept;
  onAddToCart: (id: number) => void;
}

function BookCard({ book, dept, onAddToCart }: BookCardProps) {
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  // Extract edition from title if present
  const editionMatch = book.name.match(/(\d+(?:st|nd|rd|th)\s+Ed(?:ition)?)/i);
  const edition = editionMatch?.[0] ?? "";
  const titleWithoutEdition = book.name.replace(/[-–]\s*\d+(?:st|nd|rd|th)\s+Ed(?:ition)?(\s*\(.*?\))?/i, "").trim();

  // Cover image based on index
  const coverImg = COVER_IMAGES[book.id % COVER_IMAGES.length];

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
      style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

      {/* Book cover */}
      <div className="relative overflow-hidden" style={{ height: "180px" }}>
        <img src={coverImg} alt={book.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: "brightness(0.65)" }} />

        {/* Gradient overlay with dept colour */}
        <div className={`absolute inset-0 bg-gradient-to-br ${dept.gradient} opacity-70`} />

        {/* Book spine accent */}
        <div className="absolute left-0 top-0 bottom-0 w-3"
          style={{ background: "rgba(0,0,0,0.35)", borderRight: "1px solid rgba(255,255,255,0.15)" }} />

        {/* Edition badge */}
        {edition && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold"
            style={{ background: "rgba(0,0,0,0.5)", color: "#FFFFFF", backdropFilter: "blur(8px)" }}>
            {edition}
          </div>
        )}

        {/* Discount badge */}
        {discount >= 10 && (
          <div className="absolute top-3 left-5 px-2.5 py-1 rounded-lg text-[10px] font-bold"
            style={{ background: "#FF3B30", color: "#FFFFFF" }}>
            {discount}% OFF
          </div>
        )}

        {/* Featured star */}
        {book.featured && (
          <div className="absolute bottom-3 left-5">
            <Sparkles className="w-4 h-4" style={{ color: "#FFD60A" }} />
          </div>
        )}

        {/* Publisher */}
        <div className="absolute bottom-3 right-3 text-[10px] font-semibold"
          style={{ color: "rgba(255,255,255,0.7)" }}>
          {book.brand}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h3 className="text-sm font-bold leading-snug mb-2 line-clamp-2 group-hover:text-[#007AFF] transition-colors"
          style={{ color: "#1C1C1E", minHeight: "2.5rem" }}>
          {titleWithoutEdition}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {book.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
              style={{ background: `${dept.color}12`, color: dept.color }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          {[1,2,3,4,5].map(s => (
            <svg key={s} className="w-3 h-3" viewBox="0 0 24 24"
              fill={s <= Math.round(book.rating) ? "#FF9500" : "none"}
              stroke={s <= Math.round(book.rating) ? "#FF9500" : "#C7C7CC"} strokeWidth={2}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
          <span className="text-[11px] font-semibold" style={{ color: "#FF9500" }}>{book.rating}</span>
          <span className="text-[11px]" style={{ color: "#AEAEB2" }}>({book.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          <span className="text-lg font-display font-extrabold" style={{ color: "#1C1C1E" }}>
            ₹{book.price.toLocaleString("en-IN")}
          </span>
          {book.originalPrice && (
            <span className="text-xs line-through" style={{ color: "#AEAEB2" }}>
              ₹{book.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button onClick={() => onAddToCart(book.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95"
          style={{ background: book.inStock ? `linear-gradient(135deg,${dept.color},${dept.color}CC)` : "#C7C7CC", color: "#FFFFFF" }}
          disabled={!book.inStock}>
          <ShoppingCart className="w-3.5 h-3.5" />
          {book.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}

// ── Department Section ────────────────────────────────────────────────────
function DeptSection({
  dept,
  books,
  onAddToCart,
}: {
  dept: BookDept;
  books: any[];
  onAddToCart: (id: number) => void;
}) {
  const Icon = dept.icon;
  // Filter to only books (exclude equipment by checking for typical book keywords)
  const bookKeywords = ["ed", "edition", "textbook", "guide", "manual", "handbook", "principles", "practice", "series", "review", "essentials", "clinical", "comprehensive", "fundamentals"];
  const deptBooks = books.filter(b =>
    bookKeywords.some(kw => b.name.toLowerCase().includes(kw) || b.tags?.some((t: string) => t.toLowerCase() === "textbook"))
  );

  if (deptBooks.length === 0) return null;

  return (
    <section id={dept.id} className="scroll-mt-24">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${dept.color}18` }}>
          <Icon className="w-5 h-5" style={{ color: dept.color }} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-display font-bold" style={{ color: "#1C1C1E" }}>{dept.label}</h2>
          <p className="text-xs" style={{ color: "#AEAEB2" }}>{deptBooks.length} book{deptBooks.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="h-px flex-1 max-w-[120px]" style={{ background: `${dept.color}30` }} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {deptBooks.map(book => (
          <BookCard key={book.id} book={book} dept={dept} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function MedicalBooks() {
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [booksBySlug, setBooksBySlug] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sessionId = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const addToCartMutation = useAddToCart();

  // Fetch books for each department category
  useEffect(() => {
    const slugs = [...new Set(DEPARTMENTS.map(d => d.categorySlug))];
    let cancelled = false;
    setLoading(true);

    Promise.all(
      slugs.map(slug =>
        fetch(`${BASE}/api/products?category=${slug}&limit=100`)
          .then(r => r.json())
          .then(data => ({ slug, products: data.products ?? [] }))
          .catch(() => ({ slug, products: [] }))
      )
    ).then(results => {
      if (cancelled) return;
      const map: Record<string, any[]> = {};
      results.forEach(r => { map[r.slug] = r.products; });
      setBooksBySlug(map);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  const handleAddToCart = (productId: number) => {
    if (!sessionId) { toast({ title: "Session error", variant: "destructive" }); return; }
    addToCartMutation.mutate(
      { data: { productId, sessionId, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
          toast({ title: "Added to cart ✓", description: "Book added to your cart." });
        },
        onError: () => toast({ variant: "destructive", title: "Could not add to cart" }),
      }
    );
  };

  // All books flattened for search
  const allBooks = DEPARTMENTS.flatMap(d =>
    (booksBySlug[d.categorySlug] ?? []).map((b: any) => ({ ...b, _dept: d }))
  );

  const uniqueBooks = Array.from(new Map(allBooks.map(b => [b.id, b])).values());

  const filtered = search.trim().length > 1
    ? uniqueBooks.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.brand?.toLowerCase().includes(search.toLowerCase()) ||
        b.tags?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : null;

  const totalBooks = uniqueBooks.length;
  const totalDepts = DEPARTMENTS.filter(d => (booksBySlug[d.categorySlug]?.length ?? 0) > 0).length;

  // Scroll spy for sidebar
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveDept(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    DEPARTMENTS.forEach(d => {
      const el = document.getElementById(d.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loading]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveDept(id);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F4F4F6" }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-14"
        style={{ background: "linear-gradient(135deg,#0A0F1E 0%,#0D1B2A 60%,#0F2040 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "#007AFF", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-8" style={{ background: "#00C2A8", transform: "translate(-30%,30%)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
                style={{ background: "rgba(0,122,255,0.15)", border: "1px solid rgba(0,122,255,0.3)", color: "#60A5FA" }}>
                <Library className="w-3.5 h-3.5" />
                Aethex Medical Library
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight">
                Medical Books{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#60A5FA,#2DD4BF)" }}>
                  by Department
                </span>
              </h1>
              <p className="text-base mb-6" style={{ color: "rgba(255,255,255,0.6)", maxWidth: "34rem" }}>
                Curated catalogue of world-class medical textbooks and references, organised by specialty. From MBBS essentials to postgraduate references — all at the best prices in India.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                {[
                  { icon: BookMarked, text: `${totalBooks}+ Books` },
                  { icon: GraduationCap, text: `${totalDepts} Specialties` },
                  { icon: Tag, text: "Best INR Prices" },
                  { icon: TrendingUp, text: "Indian & International Editions" },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 font-semibold">
                    <Icon className="w-4 h-4" style={{ color: "#007AFF" }} />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Search box */}
            <div className="w-full lg:w-80">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#AEAEB2" }} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search books, authors, publishers…"
                  className="w-full pl-10 pr-4 py-4 rounded-2xl text-sm outline-none font-medium"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#FFFFFF", backdropFilter: "blur(8px)" }}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold"
                    style={{ color: "#AEAEB2" }}>✕</button>
                )}
              </div>
              {search && (
                <p className="text-xs mt-2 text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {filtered?.length ?? 0} result{filtered?.length !== 1 ? "s" : ""} for "{search}"
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid rgba(60,60,67,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {DEPARTMENTS.filter(d => (booksBySlug[d.categorySlug]?.length ?? 0) > 0).map(d => {
              const Icon = d.icon;
              const count = booksBySlug[d.categorySlug]?.length ?? 0;
              return (
                <button key={d.id} onClick={() => scrollTo(d.id)}
                  className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold transition-all hover:opacity-80 shrink-0"
                  style={{ color: activeDept === d.id ? d.color : "#636366" }}>
                  <Icon className="w-4 h-4" />
                  {d.label}
                  <span className="text-xs px-1.5 py-0.5 rounded-md font-bold"
                    style={{ background: activeDept === d.id ? `${d.color}15` : "rgba(60,60,67,0.08)", color: activeDept === d.id ? d.color : "#AEAEB2" }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">

          {/* ── Sticky Sidebar ── */}
          <aside ref={sidebarRef}
            className="hidden lg:block w-56 shrink-0 sticky self-start"
            style={{ top: "120px", maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#AEAEB2" }}>
              Jump to Department
            </p>
            <nav className="flex flex-col gap-0.5">
              {DEPARTMENTS.filter(d => (booksBySlug[d.categorySlug]?.length ?? 0) > 0).map(d => {
                const Icon = d.icon;
                const isActive = activeDept === d.id;
                return (
                  <button key={d.id} onClick={() => scrollTo(d.id)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all"
                    style={isActive
                      ? { background: `${d.color}14`, color: d.color }
                      : { color: "#636366" }}>
                    <Icon className="w-4 h-4 shrink-0" style={{ color: isActive ? d.color : "#AEAEB2" }} />
                    <span className="truncate">{d.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0" style={{ color: d.color }} />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">

            {/* Search Results */}
            {filtered !== null ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Search className="w-5 h-5" style={{ color: "#007AFF" }} />
                  <h2 className="text-xl font-display font-bold" style={{ color: "#1C1C1E" }}>
                    Search Results
                  </h2>
                  <span className="text-sm" style={{ color: "#636366" }}>
                    {filtered.length} book{filtered.length !== 1 ? "s" : ""} found
                  </span>
                </div>
                {filtered.length === 0 ? (
                  <div className="text-center py-20 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.1)" }}>
                    <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: "#AEAEB2" }} />
                    <p className="font-semibold" style={{ color: "#636366" }}>No books found for "{search}"</p>
                    <button onClick={() => setSearch("")} className="mt-3 text-sm font-bold" style={{ color: "#007AFF" }}>
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {filtered.map(book => (
                      <BookCard key={book.id} book={book} dept={book._dept} onAddToCart={handleAddToCart} />
                    ))}
                  </div>
                )}
              </div>
            ) : loading ? (
              // Loading skeleton
              <div className="flex flex-col gap-12">
                {[1,2,3].map(i => (
                  <div key={i}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl animate-pulse" style={{ background: "rgba(60,60,67,0.1)" }} />
                      <div className="h-6 w-40 rounded-lg animate-pulse" style={{ background: "rgba(60,60,67,0.1)" }} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.08)" }}>
                          <div className="h-44 animate-pulse" style={{ background: "rgba(60,60,67,0.07)" }} />
                          <div className="p-4 flex flex-col gap-2">
                            <div className="h-4 w-full rounded animate-pulse" style={{ background: "rgba(60,60,67,0.07)" }} />
                            <div className="h-4 w-2/3 rounded animate-pulse" style={{ background: "rgba(60,60,67,0.07)" }} />
                            <div className="h-6 w-1/3 rounded animate-pulse mt-2" style={{ background: "rgba(60,60,67,0.07)" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Department sections
              <div className="flex flex-col gap-16">
                {DEPARTMENTS.map(dept => (
                  <DeptSection
                    key={dept.id}
                    dept={dept}
                    books={booksBySlug[dept.categorySlug] ?? []}
                    onAddToCart={handleAddToCart}
                  />
                ))}

                {/* Bottom CTA */}
                <div className="rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg,#0F172A,#1E293B)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-10"
                    style={{ background: "#007AFF", transform: "translate(30%,-30%)" }} />
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-white opacity-20" />
                  <h3 className="text-2xl font-display font-bold text-white mb-3">
                    Can't find a book?
                  </h3>
                  <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    We source any medical textbook on request. Drop us a message and we'll arrange it for you with the best INR price.
                  </p>
                  <a href={`${BASE}/contact`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF" }}>
                    <Trophy className="w-4 h-4" />
                    Request a Book
                  </a>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
