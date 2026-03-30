import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Pill, Calculator, Weight, BookOpen, Brain, Stethoscope,
  ClipboardList, FlaskConical, Activity, Scan, FileText,
  GraduationCap, Heart, MessageSquare, Search, X,
  ChevronRight, Zap, Lock, ArrowUpRight,
} from "lucide-react";

/* ── Tool data ────────────────────────────────────────────────────── */
interface Tool {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  category: "calculator" | "ai" | "diagnostic" | "reference";
  badge?: string;
  badgeColor?: string;
  pro?: boolean;
  href?: string;
  action?: "ai-chat";
}

const TOOLS: Tool[] = [
  {
    id: "drug-interaction",
    icon: <Pill className="w-6 h-6" />,
    title: "Drug Interaction Checker",
    desc: "Detect clinically significant interactions between multiple medications instantly.",
    category: "diagnostic",
    badge: "Essential",
    badgeColor: "#00C2A8",
  },
  {
    id: "dosage-calculator",
    icon: <Calculator className="w-6 h-6" />,
    title: "Dosage Calculator",
    desc: "Calculate weight-based, renal-adjusted, and pediatric drug doses with ease.",
    category: "calculator",
  },
  {
    id: "bmi-calculator",
    icon: <Weight className="w-6 h-6" />,
    title: "BMI Calculator",
    desc: "Body Mass Index with ideal weight ranges and WHO classification.",
    category: "calculator",
  },
  {
    id: "abbreviations",
    icon: <BookOpen className="w-6 h-6" />,
    title: "Medical Abbreviations",
    desc: "Searchable dictionary of 5,000+ clinical abbreviations, acronyms & mnemonics.",
    category: "reference",
  },
  {
    id: "ddx",
    icon: <Brain className="w-6 h-6" />,
    title: "Differential Diagnosis",
    desc: "AI-powered DDx generator based on symptoms, signs, and investigations.",
    category: "ai",
    badge: "AI",
    badgeColor: "#7C3AED",
    action: "ai-chat",
    href: "/ai-assistant",
  },
  {
    id: "symptom-checker",
    icon: <Stethoscope className="w-6 h-6" />,
    title: "Symptom Checker",
    desc: "Enter symptoms and get probable diagnoses with triage severity scoring.",
    category: "diagnostic",
  },
  {
    id: "clinical-decision",
    icon: <ClipboardList className="w-6 h-6" />,
    title: "Clinical Decision Support",
    desc: "Evidence-based clinical guidelines integrated into real-time decision trees.",
    category: "ai",
    badge: "⭐ Pro",
    badgeColor: "#F59E0B",
    pro: true,
  },
  {
    id: "lab-interpreter",
    icon: <FlaskConical className="w-6 h-6" />,
    title: "Lab Value Interpreter",
    desc: "Upload CBC, LFT, RFT results and get AI-interpreted clinical significance.",
    category: "ai",
    badge: "AI",
    badgeColor: "#7C3AED",
  },
  {
    id: "ecg-analyzer",
    icon: <Activity className="w-6 h-6" />,
    title: "ECG Analyzer",
    desc: "Upload your ECG strip for AI rhythm analysis, intervals, and arrhythmia detection.",
    category: "ai",
    badge: "AI",
    badgeColor: "#7C3AED",
    pro: true,
  },
  {
    id: "radiology",
    icon: <Scan className="w-6 h-6" />,
    title: "Radiology Assistant",
    desc: "AI reads X-ray, CT, and MRI reports — highlights findings and differentials.",
    category: "ai",
    badge: "AI",
    badgeColor: "#7C3AED",
    pro: true,
  },
  {
    id: "prescription",
    icon: <FileText className="w-6 h-6" />,
    title: "Prescription Generator",
    desc: "Create professional prescriptions with dosing, frequency, and patient instructions.",
    category: "reference",
    badge: "New",
    badgeColor: "#10B981",
  },
  {
    id: "case-simulator",
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Case Study Simulator",
    desc: "Practice real-world clinical cases with branching decisions for NEET PG prep.",
    category: "diagnostic",
    badge: "Students",
    badgeColor: "#3B82F6",
  },
  {
    id: "risk-calculator",
    icon: <Heart className="w-6 h-6" />,
    title: "Risk Calculator",
    desc: "ASCVD, CHADS2, Wells, CURB-65 and 20+ validated clinical risk scoring tools.",
    category: "calculator",
  },
  {
    id: "medical-chat",
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Medical Chat Assistant",
    desc: "Quick-access ZYRA AI for clinical queries, drug info, and patient education.",
    category: "ai",
    badge: "ZYRA",
    badgeColor: "#00C2A8",
    href: "/ai-assistant",
    action: "ai-chat",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Tools" },
  { id: "ai", label: "AI Powered" },
  { id: "calculator", label: "Calculators" },
  { id: "diagnostic", label: "Diagnostics" },
  { id: "reference", label: "Reference" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

/* ── ToolCard ─────────────────────────────────────────────────────── */
function ToolCard({ tool }: { tool: Tool }) {
  const iconColors: Record<Tool["category"], string> = {
    ai: "from-violet-600/30 to-violet-400/10 text-violet-400",
    calculator: "from-blue-600/30 to-blue-400/10 text-blue-400",
    diagnostic: "from-teal-600/30 to-teal-400/10 text-[#00C2A8]",
    reference: "from-amber-600/30 to-amber-400/10 text-amber-400",
  };

  const content = (
    <div
      className="group relative rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-300
        hover:-translate-y-1 hover:shadow-[0_0_28px_rgba(0,194,168,0.15)]"
      style={{
        background: "rgba(22,27,34,0.85)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top left, rgba(0,194,168,0.07) 0%, transparent 70%)" }} />

      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${iconColors[tool.category]} flex items-center justify-center shrink-0`}>
          {tool.icon}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {tool.badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${tool.badgeColor}22`, color: tool.badgeColor, border: `1px solid ${tool.badgeColor}44` }}>
              {tool.badge}
            </span>
          )}
          {tool.pro && (
            <Lock className="w-3.5 h-3.5 text-amber-400/70" />
          )}
        </div>
      </div>

      {/* Title + desc */}
      <div>
        <h3 className="font-semibold text-[15px] text-white/90 leading-snug mb-1">{tool.title}</h3>
        <p className="text-[13px] text-white/45 leading-relaxed">{tool.desc}</p>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-2 flex items-center justify-between">
        <span className="text-[11px] font-medium capitalize px-2 py-0.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" }}>
          {tool.category === "ai" ? "AI Tool" : tool.category === "calculator" ? "Calculator" : tool.category === "diagnostic" ? "Diagnostics" : "Reference"}
        </span>
        <span className="flex items-center gap-0.5 text-[12px] text-[#00C2A8] opacity-0 group-hover:opacity-100 transition-opacity font-medium">
          Open <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );

  if (tool.href) return <Link href={tool.href}>{content}</Link>;
  return content;
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function ClinicalTools() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return TOOLS.filter(t => {
      const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
      const matchesCat = activeCategory === "all" || t.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen" style={{ background: "#0D1117" }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(0,194,168,0.10) 0%, transparent 70%)" }} />
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 70%)" }} />

        <div className="max-w-5xl mx-auto px-4 pt-16 pb-10 text-center relative z-10">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(0,194,168,0.1)", border: "1px solid rgba(0,194,168,0.25)" }}>
            <Zap className="w-3.5 h-3.5 text-[#00C2A8]" />
            <span className="text-[12px] font-medium text-[#00C2A8]">14 clinical tools available</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight"
            style={{
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 0 60px rgba(0,194,168,0.25)",
            }}>
            Clinical Tools
          </h1>
          <p className="text-lg text-white/45 max-w-xl mx-auto mb-8">
            Essential tools for daily clinical practice — from drug checks to AI-powered diagnostics.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none placeholder-white/25"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.85)",
              }}
            />
            {query && (
              <button onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Tabs ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={activeCategory === cat.id ? {
                background: "rgba(0,194,168,0.18)",
                border: "1px solid rgba(0,194,168,0.45)",
                color: "#00C2A8",
              } : {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {cat.label}
            </button>
          ))}

          {/* Result count */}
          {(query || activeCategory !== "all") && (
            <span className="ml-auto self-center text-[12px] text-white/30">
              {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* ── Tools Grid ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-10 h-10 mx-auto mb-4 text-white/15" />
            <p className="text-white/40 text-sm">No tools match your search.</p>
            <button onClick={() => { setQuery(""); setActiveCategory("all"); }}
              className="mt-3 text-[#00C2A8] text-sm hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        {/* ZYRA CTA Banner */}
        <div className="mt-12 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(0,194,168,0.12) 0%, rgba(124,58,237,0.10) 100%)",
            border: "1px solid rgba(0,194,168,0.2)",
          }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-5 h-5 text-[#00C2A8]" />
              <span className="text-[13px] font-semibold text-[#00C2A8]">ZYRA AI Assistant</span>
            </div>
            <h3 className="text-xl font-bold text-white/90 mb-1">Need a deeper clinical answer?</h3>
            <p className="text-sm text-white/45">Ask ZYRA any medical question — diagnoses, drug info, study help and more.</p>
          </div>
          <Link href="/ai-assistant">
            <button className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{ background: "#00C2A8", color: "#0D1117" }}>
              Open ZYRA <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
