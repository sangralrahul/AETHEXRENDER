import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Building2, GraduationCap, HeartPulse, ShieldCheck, Truck, BadgePercent,
  Users, ClipboardList, Phone, Mail, ArrowRight, CheckCircle2, Star,
  Package, Headphones, CreditCard, FileText, BookOpen, Stethoscope,
  Building, MapPin, Award, ChevronRight
} from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const colleges = [
  { name: "AIIMS New Delhi", type: "Medical College", city: "New Delhi", tier: "Premier" },
  { name: "JIPMER Puducherry", type: "Medical College", city: "Puducherry", tier: "Premier" },
  { name: "CMC Vellore", type: "Medical College", city: "Vellore", tier: "Premier" },
  { name: "MAMC Delhi", type: "Medical College", city: "New Delhi", tier: "Govt" },
  { name: "KGMU Lucknow", type: "Medical College", city: "Lucknow", tier: "Govt" },
  { name: "Grant Medical College", type: "Medical College", city: "Mumbai", tier: "Govt" },
];

const hospitals = [
  { name: "Apollo Hospitals", type: "Hospital Chain", city: "Pan-India", tier: "Corporate" },
  { name: "Fortis Healthcare", type: "Hospital Chain", city: "Pan-India", tier: "Corporate" },
  { name: "Max Healthcare", type: "Hospital Chain", city: "North India", tier: "Corporate" },
  { name: "Manipal Hospitals", type: "Hospital Chain", city: "Pan-India", tier: "Corporate" },
  { name: "Kokilaben Hospital", type: "Hospital", city: "Mumbai", tier: "Corporate" },
  { name: "Medanta – The Medicity", type: "Hospital", city: "Gurugram", tier: "Corporate" },
];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F5F5F7" }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-24" style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D2137 50%, #0A1628 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(0,122,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0,194,168,0.12) 0%, transparent 45%)",
        }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(0,194,168,0.15)", border: "1px solid rgba(0,194,168,0.3)", color: "#00C2A8" }}>
            <Building2 className="w-3.5 h-3.5" />
            Institutional Partnerships
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6"
            style={{ color: "#FFFFFF", letterSpacing: "-1.5px" }}>
            Built for <span style={{ color: "#00C2A8" }}>Colleges</span>
            <br />& <span style={{ color: "#007AFF" }}>Hospitals</span>
          </motion.h1>

          <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp}
            className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)" }}>
            Trusted by AIIMS, Apollo, Fortis and 200+ institutions across India. Bulk pricing, GST billing, dedicated account managers — all in one platform.
          </motion.p>

          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}
            className="flex flex-wrap justify-center gap-4">
            <a href="#inquiry"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: "#00C2A8", color: "#FFFFFF" }}>
              Get Institutional Access <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#plans"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.08)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.15)" }}>
              View Plans
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "200+", label: "Partner Institutions" },
              { value: "50,000+", label: "Student Users" },
              { value: "35%", label: "Avg. Bulk Discount" },
              { value: "24h", label: "SLA Delivery" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black mb-1" style={{ color: "#FFFFFF" }}>{stat.value}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20" style={{ background: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#AEAEB2" }}>Why institutions choose us</p>
            <h2 className="text-3xl font-black" style={{ color: "#1C1C1E", letterSpacing: "-0.5px" }}>
              Everything your institution needs
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="p-6 rounded-2xl border" style={{ background: "#FAFAFA", border: "1px solid rgba(60,60,67,0.08)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${b.color}18` }}>
                  <b.icon className="w-5 h-5" style={{ color: b.color }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: "#1C1C1E" }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#636366" }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partner Institutions ── */}
      <section className="py-20" style={{ background: "#F5F5F7" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#AEAEB2" }}>Our Partners</p>
            <h2 className="text-3xl font-black mb-3" style={{ color: "#1C1C1E", letterSpacing: "-0.5px" }}>
              Trusted across India
            </h2>
            <p className="text-base" style={{ color: "#636366" }}>From premier medical colleges to leading hospital chains</p>
          </div>

          <div className="flex gap-2 justify-center mb-8">
            {(["colleges", "hospitals"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize"
                style={activeTab === tab
                  ? { background: "#1C1C1E", color: "#FFFFFF" }
                  : { background: "#FFFFFF", color: "#636366", border: "1px solid rgba(60,60,67,0.12)" }}>
                {tab === "colleges" ? "Medical Colleges" : "Hospitals"}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(activeTab === "colleges" ? colleges : hospitals).map((inst, i) => (
              <motion.div key={inst.name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.08)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: activeTab === "colleges" ? "rgba(0,122,255,0.08)" : "rgba(255,59,48,0.08)" }}>
                  {activeTab === "colleges"
                    ? <GraduationCap className="w-6 h-6" style={{ color: "#007AFF" }} />
                    : <HeartPulse className="w-6 h-6" style={{ color: "#FF3B30" }} />}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: "#1C1C1E" }}>{inst.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs" style={{ color: "#AEAEB2" }}>{inst.city}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: "rgba(0,194,168,0.1)", color: "#00A893" }}>{inst.tier}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm mt-6" style={{ color: "#AEAEB2" }}>
            + 190 more institutions across 22 states
          </p>
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

      {/* ── CTA Banner ── */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0A1628, #0D2137)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ color: "#FFFFFF", letterSpacing: "-0.5px" }}>
            Need immediate assistance?
          </h2>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
            Call our institutional sales desk directly — available Mon–Sat, 9 AM to 7 PM IST.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+918800000000"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ background: "rgba(255,255,255,0.08)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Phone className="w-4 h-4" /> +91 88000 00000
            </a>
            <a href="mailto:institutions@aethex.in"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ background: "#007AFF", color: "#FFFFFF" }}>
              <Mail className="w-4 h-4" /> institutions@aethex.in
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
