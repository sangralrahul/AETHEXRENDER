import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Pill, Calculator, Weight, BookOpen, Brain, Stethoscope,
  ClipboardList, FlaskConical, Activity, Scan, FileText,
  GraduationCap, Heart, Search, X,
  Zap, Lock, ArrowUpRight, Sparkles,
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
    icon: <Pill className="w-5 h-5" />,
    title: "Drug Interaction Checker",
    desc: "Detect clinically significant interactions between multiple medications instantly.",
    category: "diagnostic",
    badge: "Essential",
    badgeColor: "#00C2A8",
    href: "/tools/drug-interaction",
  },
  {
    id: "dosage-calculator",
    icon: <Calculator className="w-5 h-5" />,
    title: "Dosage Calculator",
    desc: "Calculate weight-based, renal-adjusted, and pediatric drug doses with ease.",
    category: "calculator",
    href: "/tools/dosage-calculator",
  },
  {
    id: "bmi-calculator",
    icon: <Weight className="w-5 h-5" />,
    title: "BMI Calculator",
    desc: "Body Mass Index with ideal weight ranges and WHO classification.",
    category: "calculator",
    href: "/tools/bmi-calculator",
  },
  {
    id: "abbreviations",
    icon: <BookOpen className="w-5 h-5" />,
    title: "Medical Abbreviations",
    desc: "Searchable dictionary of 5,000+ clinical abbreviations, acronyms & mnemonics.",
    category: "reference",
    href: "/tools/abbreviations",
  },
  {
    id: "ddx",
    icon: <Brain className="w-5 h-5" />,
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
    icon: <Stethoscope className="w-5 h-5" />,
    title: "Symptom Checker",
    desc: "Enter symptoms and get probable diagnoses with triage severity scoring.",
    category: "diagnostic",
    href: "/tools/symptom-checker",
  },
  {
    id: "clinical-decision",
    icon: <ClipboardList className="w-5 h-5" />,
    title: "Clinical Decision Support",
    desc: "Evidence-based clinical guidelines integrated into real-time decision trees.",
    category: "ai",
    badge: "Pro",
    badgeColor: "#F59E0B",
    href: "/tools/clinical-decision",
  },
  {
    id: "lab-interpreter",
    icon: <FlaskConical className="w-5 h-5" />,
    title: "Lab Value Interpreter",
    desc: "Enter CBC, LFT, RFT results and get clinically interpreted significance.",
    category: "ai",
    badge: "AI",
    badgeColor: "#7C3AED",
    href: "/tools/lab-interpreter",
  },
  {
    id: "ecg-analyzer",
    icon: <Activity className="w-5 h-5" />,
    title: "ECG Analyzer",
    desc: "Systematic ECG interpretation — rhythm, intervals, ST changes, and arrhythmia.",
    category: "ai",
    badge: "AI",
    badgeColor: "#7C3AED",
    href: "/tools/ecg-analyzer",
  },
  {
    id: "radiology",
    icon: <Scan className="w-5 h-5" />,
    title: "Radiology Assistant",
    desc: "X-ray, CT, and MRI findings with radiological descriptions and next steps.",
    category: "ai",
    badge: "AI",
    badgeColor: "#7C3AED",
    href: "/tools/radiology",
  },
  {
    id: "prescription",
    icon: <FileText className="w-5 h-5" />,
    title: "Prescription Generator",
    desc: "Create professional prescriptions with dosing, frequency, and patient instructions.",
    category: "reference",
    badge: "New",
    badgeColor: "#10B981",
    href: "/tools/prescription",
  },
  {
    id: "case-simulator",
    icon: <GraduationCap className="w-5 h-5" />,
    title: "Case Study Simulator",
    desc: "Practice real-world clinical cases with branching decisions for NEET PG prep.",
    category: "diagnostic",
    badge: "Students",
    badgeColor: "#3B82F6",
    href: "/tools/case-simulator",
  },
  {
    id: "risk-calculator",
    icon: <Heart className="w-5 h-5" />,
    title: "Risk Calculator",
    desc: "ASCVD, CHA₂DS₂-VASc, Wells DVT/PE, CURB-65, GCS and more.",
    category: "calculator",
    href: "/tools/risk-calculator",
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

/* ── Icon colour palette (light theme) ───────────────────────────── */
const iconBg: Record<Tool["category"], string> = {
  ai: "rgba(124,58,237,0.1)",
  calculator: "rgba(0,122,255,0.1)",
  diagnostic: "rgba(0,194,168,0.1)",
  reference: "rgba(245,158,11,0.1)",
};
const iconColor: Record<Tool["category"], string> = {
  ai: "#7C3AED",
  calculator: "#007AFF",
  diagnostic: "#00C2A8",
  reference: "#F59E0B",
};
const categoryLabel: Record<Tool["category"], string> = {
  ai: "AI Tool",
  calculator: "Calculator",
  diagnostic: "Diagnostics",
  reference: "Reference",
};

/* ── ToolCard ─────────────────────────────────────────────────────── */
function ToolCard({ tool }: { tool: Tool }) {
  const content = (
    <div
      className="group relative rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-300
        hover:-translate-y-1"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(60,60,67,0.1)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(0,122,255,0.12)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,122,255,0.2)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(60,60,67,0.1)";
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg[tool.category], color: iconColor[tool.category] }}>
          {tool.icon}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {tool.badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${tool.badgeColor}18`, color: tool.badgeColor, border: `1px solid ${tool.badgeColor}33` }}>
              {tool.badge}
            </span>
          )}
          {tool.pro && (
            <Lock className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
          )}
        </div>
      </div>

      {/* Title + desc */}
      <div>
        <h3 className="font-semibold text-[15px] leading-snug mb-1" style={{ color: "#1C1C1E" }}>{tool.title}</h3>
        <p className="text-[13px] leading-relaxed" style={{ color: "#636366" }}>{tool.desc}</p>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-1 flex items-center justify-between">
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full"
          style={{ background: iconBg[tool.category], color: iconColor[tool.category] }}>
          {categoryLabel[tool.category]}
        </span>
        <span className="flex items-center gap-0.5 text-[12px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "#007AFF" }}>
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
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #EBF4FF 0%, #F0F8FF 50%, #E8F5F3 100%)", borderBottom: "1px solid rgba(60,60,67,0.1)" }}>
        {/* Ambient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(0,122,255,0.1) 0%, transparent 70%)" }} />
        <div className="absolute top-10 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(0,194,168,0.08) 0%, transparent 70%)" }} />

        <div className="max-w-5xl mx-auto px-4 pt-20 pb-14 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(0,194,168,0.12)", border: "1px solid rgba(0,194,168,0.25)" }}>
            <Zap className="w-3.5 h-3.5" style={{ color: "#00A893" }} />
            <span className="text-[12px] font-semibold" style={{ color: "#00A893" }}>13 clinical tools available</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: "#1C1C1E", letterSpacing: "-0.02em" }}>
            Clinical{" "}
            <span style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Tools
            </span>
          </h1>
          <p className="text-base max-w-xl mx-auto mb-10" style={{ color: "#636366", lineHeight: 1.7 }}>
            Essential tools for daily clinical practice — from drug checks to AI-powered diagnostics.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#AEAEB2" }} />
            <input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-sm outline-none"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(60,60,67,0.15)",
                color: "#1C1C1E",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            />
            {query && (
              <button onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100 opacity-60">
                <X className="w-4 h-4" style={{ color: "#636366" }} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={activeCategory === cat.id ? {
                background: "linear-gradient(135deg,#007AFF,#00C2A8)",
                color: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(0,122,255,0.3)",
                border: "1px solid transparent",
              } : {
                background: "#FFFFFF",
                border: "1px solid rgba(60,60,67,0.15)",
                color: "#636366",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {cat.label}
            </button>
          ))}
          {(query || activeCategory !== "all") && (
            <span className="ml-auto self-center text-[12px]" style={{ color: "#AEAEB2" }}>
              {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Tools Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(0,122,255,0.08)" }}>
              <Search className="w-6 h-6" style={{ color: "#007AFF" }} />
            </div>
            <p className="font-medium mb-1" style={{ color: "#1C1C1E" }}>No tools found</p>
            <p className="text-sm mb-4" style={{ color: "#AEAEB2" }}>Try a different keyword or category.</p>
            <button onClick={() => { setQuery(""); setActiveCategory("all"); }}
              className="text-sm font-medium hover:underline" style={{ color: "#007AFF" }}>
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

        {/* Cadus AI CTA */}
        <div className="mt-14 rounded-2xl p-8 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top right, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}>
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-semibold text-white">Powered by Cadus AI</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Need a deeper clinical answer?</h2>
            <p className="text-white/75 text-sm mb-6 max-w-md mx-auto">
              Ask Cadus AI anything — diagnosis, drug dosing, patient education, SOAP notes and more.
            </p>
            <Link href="/ai-assistant"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "#FFFFFF", color: "#007AFF" }}>
              <Sparkles className="w-4 h-4" />
              Open Cadus AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
