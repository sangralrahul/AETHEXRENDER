import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Building2, GraduationCap, HeartPulse, ShieldCheck, Truck, BadgePercent,
  Users, ClipboardList, Phone, Mail, ArrowRight, CheckCircle2,
  Package, Headphones, CreditCard, FileText, BookOpen, Stethoscope,
  Building, MapPin, Award, ChevronRight, Search, ChevronDown, SlidersHorizontal,
} from "lucide-react";
import { useState, useMemo } from "react";
import { medicalColleges, majorHospitals, ALL_STATES, type InstitutionTier } from "@/data/medicalColleges";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.5, ease: "easeOut" } }),
};

const plans = [
  {
    name: "College Basic",
    icon: GraduationCap,
    price: "Free",
    priceNote: "For student bodies & clubs",
    color: "#007AFF",
    features: [
      "Verified student pricing",
      "Batch order coordination",
      "Study material bulk discounts",
      "Dedicated student support",
      "Campus delivery option",
    ],
    cta: "Register College",
    highlight: false,
  },
  {
    name: "Institution Pro",
    icon: Building2,
    price: "Custom",
    priceNote: "For colleges & hospitals",
    color: "#00C2A8",
    features: [
      "Everything in College Basic",
      "Dedicated account manager",
      "Net-30 payment terms",
      "GST invoice & billing",
      "Priority dispatch & delivery",
      "Volume discount pricing",
      "Custom catalog curation",
    ],
    cta: "Get a Quote",
    highlight: true,
  },
  {
    name: "Hospital Enterprise",
    icon: HeartPulse,
    price: "Custom",
    priceNote: "For hospital chains & ICUs",
    color: "#FF3B30",
    features: [
      "Everything in Institution Pro",
      "Bulk procurement portal",
      "Auto-replenishment orders",
      "Biomedical team coordination",
      "SLA-backed delivery",
      "Multi-branch management",
      "API integration support",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

const benefits = [
  { icon: BadgePercent, title: "Verified Bulk Discounts", desc: "Up to 35% off on bulk orders for medical colleges and hospital procurement teams.", color: "#007AFF" },
  { icon: Truck, title: "Priority Delivery", desc: "SLA-backed same-day and next-day delivery for critical medical supplies and instruments.", color: "#00C2A8" },
  { icon: FileText, title: "GST Billing & Invoicing", desc: "Proper tax invoices, credit notes, and custom billing formats for institutional accounts.", color: "#FF9500" },
  { icon: Users, title: "Multi-User Accounts", desc: "Department-level access with approval workflows and centralized procurement control.", color: "#5856D6" },
  { icon: Headphones, title: "Dedicated Account Manager", desc: "A named AETHEX representative for your institution — reachable by phone and email.", color: "#FF3B30" },
  { icon: Package, title: "Custom Catalog", desc: "Curated product lists tailored to your specialty, formulary, or procurement policy.", color: "#34C759" },
];

const TIER_COLORS: Record<string, { bg: string; text: string }> = {
  Premier: { bg: "rgba(124,58,237,0.1)", text: "#7C3AED" },
  Govt:    { bg: "rgba(0,122,255,0.1)", text: "#007AFF" },
  Private: { bg: "rgba(0,194,168,0.1)", text: "#00A893" },
  Corporate: { bg: "rgba(255,149,0,0.1)", text: "#CC7A00" },
};

const PAGE_SIZE = 24;

export default function InstitutionHub() {
  const [formData, setFormData] = useState({
    institutionName: "",
    type: "medical_college",
    contactName: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"colleges" | "hospitals">("colleges");
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [stateOpen, setStateOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const filteredColleges = useMemo(() => {
    const q = search.toLowerCase();
    return medicalColleges.filter(c => {
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
      const matchState = selectedState === "All States" || c.state === selectedState;
      const matchTier = selectedTier === "All" || c.tier === selectedTier;
      return matchSearch && matchState && matchTier;
    });
  }, [search, selectedState, selectedTier]);

  const filteredHospitals = useMemo(() => {
    const q = search.toLowerCase();
    return majorHospitals.filter(h => {
      const matchSearch = !q || h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q);
      const matchState = selectedState === "All States" || h.state === selectedState;
      return matchSearch && matchState;
    });
  }, [search, selectedState]);

  const activeList = activeTab === "colleges" ? filteredColleges : filteredHospitals;
  const totalCount = activeList.length;
  const visibleItems = activeList.slice(0, page * PAGE_SIZE);
  const hasMore = visibleItems.length < totalCount;

  const resetFilters = () => {
    setSearch("");
    setSelectedState("All States");
    setSelectedTier("All");
    setPage(1);
  };

  const handleTabChange = (tab: "colleges" | "hospitals") => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F5F7" }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-24">
        {/* Background photo */}
        <div className="absolute inset-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(8,18,36,0.93) 0%, rgba(10,26,50,0.88) 50%, rgba(8,18,36,0.93) 100%)" }} />
        {/* Glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" style={{ background: "rgba(0,122,255,0.12)" }} />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-3xl translate-y-1/2" style={{ background: "rgba(0,194,168,0.1)" }} />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
              style={{ background: "rgba(0,122,255,0.15)", border: "1px solid rgba(0,122,255,0.25)", color: "#60A5FA" }}>
              <Building2 className="w-3.5 h-3.5" /> Institutional Partnerships
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight" style={{ letterSpacing: "-1px" }}>
              Medical Colleges &<br />Hospitals — Covered
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Special bulk pricing, GST invoicing, priority delivery, and dedicated account management for every NMC-recognized institution across India.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#inquiry"
                className="px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,122,255,0.3)" }}>
                Request Institutional Access
              </a>
              <a href="#institutions"
                className="px-7 py-3.5 rounded-full font-bold text-sm border transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}>
                Browse Institutions
              </a>
            </div>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
            {[
              { value: "757+", label: "NMC Colleges" },
              { value: "50+", label: "Major Hospitals" },
              { value: "34", label: "States & UTs" },
              { value: "35%", label: "Bulk Discount" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial="hidden" animate="visible" variants={fadeUp} custom={i + 1}
                className="text-center py-5 px-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Institution Browser ── */}
      <section id="institutions" className="py-20" style={{ background: "#F5F5F7" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#AEAEB2" }}>NMC Recognized</p>
            <h2 className="text-3xl font-black mb-3" style={{ color: "#1C1C1E", letterSpacing: "-0.5px" }}>
              All Institutions across India
            </h2>
            <p className="text-base" style={{ color: "#636366" }}>
              Browse {medicalColleges.length} NMC-recognized medical colleges and {majorHospitals.length} major hospitals
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 justify-center mb-6">
            {(["colleges", "hospitals"] as const).map((tab) => (
              <button key={tab} onClick={() => handleTabChange(tab)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize"
                style={activeTab === tab
                  ? { background: "#1C1C1E", color: "#FFFFFF" }
                  : { background: "#FFFFFF", color: "#636366", border: "1px solid rgba(60,60,67,0.12)" }}>
                {tab === "colleges" ? `Medical Colleges (${medicalColleges.length})` : `Hospitals (${majorHospitals.length})`}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px] px-4 py-2.5 rounded-xl"
              style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.12)" }}>
              <Search className="w-4 h-4 shrink-0" style={{ color: "#AEAEB2" }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder={activeTab === "colleges" ? "Search college name or city…" : "Search hospital name or city…"}
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: "#1C1C1E" }}
              />
            </div>

            {/* State filter */}
            <div className="relative">
              <button
                onClick={() => setStateOpen(v => !v)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.12)", color: "#1C1C1E", minWidth: 160 }}>
                <MapPin className="w-4 h-4" style={{ color: "#007AFF" }} />
                <span className="flex-1 text-left truncate">{selectedState}</span>
                <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "#AEAEB2" }} />
              </button>
              {stateOpen && (
                <div className="absolute top-full mt-1 left-0 z-50 rounded-xl overflow-auto shadow-xl"
                  style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.1)", width: 220, maxHeight: 300 }}>
                  {["All States", ...Array.from(ALL_STATES)].map(s => (
                    <button key={s} onClick={() => { setSelectedState(s); setStateOpen(false); setPage(1); }}
                      className="w-full text-left text-sm px-4 py-2.5 hover:bg-gray-50 transition-colors truncate"
                      style={{ color: selectedState === s ? "#007AFF" : "#1C1C1E", fontWeight: selectedState === s ? 600 : 400 }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tier filter — only for colleges */}
            {activeTab === "colleges" && (
              <div className="flex gap-2">
                {["All", "Premier", "Govt", "Private"].map(tier => (
                  <button key={tier} onClick={() => { setSelectedTier(tier); setPage(1); }}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={selectedTier === tier
                      ? { background: "#1C1C1E", color: "#FFFFFF" }
                      : { background: "#FFFFFF", color: "#636366", border: "1px solid rgba(60,60,67,0.12)" }}>
                    {tier}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: "#AEAEB2" }}>
              Showing <span className="font-semibold" style={{ color: "#1C1C1E" }}>{Math.min(visibleItems.length, totalCount)}</span> of{" "}
              <span className="font-semibold" style={{ color: "#1C1C1E" }}>{totalCount}</span>{" "}
              {activeTab === "colleges" ? "colleges" : "hospitals"}
              {search || selectedState !== "All States" || selectedTier !== "All" ? " (filtered)" : ""}
            </p>
            {(search || selectedState !== "All States" || selectedTier !== "All") && (
              <button onClick={resetFilters}
                className="text-xs font-semibold transition-colors hover:opacity-70"
                style={{ color: "#007AFF" }}>
                Clear filters
              </button>
            )}
          </div>

          {/* Grid */}
          {visibleItems.length === 0 ? (
            <div className="text-center py-16">
              <GraduationCap className="w-12 h-12 mx-auto mb-3" style={{ color: "#AEAEB2" }} />
              <p className="font-semibold mb-1" style={{ color: "#1C1C1E" }}>No results found</p>
              <p className="text-sm" style={{ color: "#AEAEB2" }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {visibleItems.map((inst, i) => {
                const tier = (inst as any).tier as string;
                const tc = TIER_COLORS[tier] ?? TIER_COLORS.Private;
                return (
                  <motion.div key={`${inst.name}-${inst.city}-${i}`}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 24} variants={fadeUp}
                    className="flex items-center gap-3 p-3.5 rounded-2xl"
                    style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.08)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: activeTab === "colleges" ? "rgba(0,122,255,0.08)" : "rgba(255,59,48,0.08)" }}>
                      {activeTab === "colleges"
                        ? <GraduationCap className="w-5 h-5" style={{ color: "#007AFF" }} />
                        : <HeartPulse className="w-5 h-5" style={{ color: "#FF3B30" }} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs leading-snug line-clamp-2" style={{ color: "#1C1C1E" }}>{inst.name}</div>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[10px]" style={{ color: "#AEAEB2" }}>{inst.city}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                          style={{ background: tc.bg, color: tc.text }}>{tier}</span>
                      </div>
                      {(inst as any).state && (
                        <div className="text-[9px] mt-0.5" style={{ color: "#C7C7CC" }}>{(inst as any).state}</div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Load more */}
          {hasMore && (
            <div className="text-center mt-8">
              <button onClick={() => setPage(p => p + 1)}
                className="px-8 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105"
                style={{ background: "#1C1C1E", color: "#FFFFFF" }}>
                Load more ({totalCount - visibleItems.length} remaining)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Plans ── */}
      <section id="plans" className="py-20" style={{ background: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#AEAEB2" }}>Institutional Plans</p>
            <h2 className="text-3xl font-black" style={{ color: "#1C1C1E", letterSpacing: "-0.5px" }}>
              Choose the right tier
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="relative rounded-2xl p-7 flex flex-col"
                style={plan.highlight
                  ? { background: "linear-gradient(135deg, #0A1628, #0D2137)", border: `2px solid ${plan.color}` }
                  : { background: "#FAFAFA", border: "1px solid rgba(60,60,67,0.08)" }}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ background: plan.color, color: "#FFFFFF" }}>Most Popular</div>
                )}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${plan.color}20` }}>
                  <plan.icon className="w-6 h-6" style={{ color: plan.color }} />
                </div>
                <div className="font-bold text-lg mb-1" style={{ color: plan.highlight ? "#FFFFFF" : "#1C1C1E" }}>{plan.name}</div>
                <div className="text-3xl font-black mb-1" style={{ color: plan.color }}>{plan.price}</div>
                <div className="text-xs mb-6" style={{ color: plan.highlight ? "rgba(255,255,255,0.4)" : "#AEAEB2" }}>{plan.priceNote}</div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: plan.color }} />
                      <span style={{ color: plan.highlight ? "rgba(255,255,255,0.75)" : "#636366" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a href="#inquiry"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={plan.highlight
                    ? { background: plan.color, color: "#FFFFFF" }
                    : { background: `${plan.color}12`, color: plan.color }}>
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20" style={{ background: "#F5F5F7" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#AEAEB2" }}>Onboarding</p>
            <h2 className="text-3xl font-black" style={{ color: "#1C1C1E", letterSpacing: "-0.5px" }}>
              Get started in 3 steps
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "01", icon: ClipboardList, title: "Submit Inquiry", desc: "Fill out the form below with your institution details and requirements.", color: "#007AFF" },
              { step: "02", icon: Headphones, title: "Meet your Manager", desc: "Your dedicated account manager contacts you within 24 hours to set up the account.", color: "#00C2A8" },
              { step: "03", icon: Package, title: "Start Ordering", desc: "Access your custom catalog, place bulk orders, and enjoy institutional pricing.", color: "#FF9500" },
            ].map((s, i) => (
              <motion.div key={s.step} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${s.color}15` }}>
                  <s.icon className="w-7 h-7" style={{ color: s.color }} />
                </div>
                <div className="text-xs font-black mb-2" style={{ color: s.color, letterSpacing: "0.1em" }}>{s.step}</div>
                <div className="font-bold text-base mb-2" style={{ color: "#1C1C1E" }}>{s.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: "#636366" }}>{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inquiry Form ── */}
      <section id="inquiry" className="py-20" style={{ background: "#FFFFFF" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#AEAEB2" }}>Get in touch</p>
            <h2 className="text-3xl font-black mb-3" style={{ color: "#1C1C1E", letterSpacing: "-0.5px" }}>
              Request Institutional Access
            </h2>
            <p className="text-base" style={{ color: "#636366" }}>We'll set up your account and connect you with a dedicated manager within 24 hours.</p>
          </div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-8 rounded-2xl"
              style={{ background: "rgba(0,194,168,0.06)", border: "2px solid rgba(0,194,168,0.2)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(0,194,168,0.15)" }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: "#00C2A8" }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#1C1C1E" }}>Request Submitted!</h3>
              <p className="text-sm" style={{ color: "#636366" }}>
                Thank you! Our institutional team will reach out to <strong>{formData.email}</strong> within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#636366" }}>Institution Name *</label>
                  <input required value={formData.institutionName}
                    onChange={e => setFormData(p => ({ ...p, institutionName: e.target.value }))}
                    placeholder="e.g. AIIMS New Delhi"
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                    style={{ background: "#F5F5F7", border: "1px solid rgba(60,60,67,0.12)", color: "#1C1C1E" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#636366" }}>Institution Type *</label>
                  <select required value={formData.type}
                    onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none appearance-none"
                    style={{ background: "#F5F5F7", border: "1px solid rgba(60,60,67,0.12)", color: "#1C1C1E" }}>
                    <option value="medical_college">Medical College</option>
                    <option value="hospital">Hospital</option>
                    <option value="nursing_college">Nursing College</option>
                    <option value="dental_college">Dental College</option>
                    <option value="pharmacy_college">Pharmacy College</option>
                    <option value="clinic_chain">Clinic Chain</option>
                    <option value="diagnostic_centre">Diagnostic Centre</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#636366" }}>Contact Person *</label>
                  <input required value={formData.contactName}
                    onChange={e => setFormData(p => ({ ...p, contactName: e.target.value }))}
                    placeholder="Dr. / Prof. / Mr."
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                    style={{ background: "#F5F5F7", border: "1px solid rgba(60,60,67,0.12)", color: "#1C1C1E" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#636366" }}>City *</label>
                  <input required value={formData.city}
                    onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                    placeholder="City, State"
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                    style={{ background: "#F5F5F7", border: "1px solid rgba(60,60,67,0.12)", color: "#1C1C1E" }} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#636366" }}>Official Email *</label>
                  <input required type="email" value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="procurement@hospital.in"
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                    style={{ background: "#F5F5F7", border: "1px solid rgba(60,60,67,0.12)", color: "#1C1C1E" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#636366" }}>Phone Number *</label>
                  <input required type="tel" value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                    style={{ background: "#F5F5F7", border: "1px solid rgba(60,60,67,0.12)", color: "#1C1C1E" }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#636366" }}>Requirements / Message</label>
                <textarea value={formData.message} rows={4}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us about your procurement needs, expected order volumes, and any specific products required..."
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
                  style={{ background: "#F5F5F7", border: "1px solid rgba(60,60,67,0.12)", color: "#1C1C1E" }} />
              </div>

              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: "#007AFF", color: "#FFFFFF" }}>
                Submit Inquiry <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs" style={{ color: "#AEAEB2" }}>
                By submitting, you agree to our{" "}
                <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
                We'll respond within 24 business hours.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Built for Institutions (dark) ── */}
      <section className="py-20" style={{ background: "#0D1117" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#AEAEB2" }}>Why Aethex</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: "#FFFFFF", letterSpacing: "-0.5px" }}>
              Built for Institutions
            </h2>
            <p className="text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
              Purpose-built features for medical colleges and hospitals across India
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="p-6 rounded-2xl"
                style={{ background: "#161B22", border: "1px solid #21262D" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${b.color}18`, border: `1px solid ${b.color}30` }}>
                  <b.icon className="w-5 h-5" style={{ color: b.color }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: "#FFFFFF" }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
