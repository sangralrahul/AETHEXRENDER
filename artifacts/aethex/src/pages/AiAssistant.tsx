import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, User, Loader2, Activity, FlaskConical,
  Lock, Crown, Paperclip, Image, FileText, Camera, Search,
  ImagePlus, X, Microscope, Download, Presentation, PlayCircle,
  Plus, PanelLeft, MessageSquare, Tag,
  ChevronDown, ChevronLeft, ChevronRight, RefreshCw,
  Home, BookOpen, Upload, Stethoscope,
  Pill, Calculator, TestTube2, ClipboardList, HelpCircle,
  Brain, Languages, Mic, MicOff, SlidersHorizontal, Zap, ExternalLink,
} from "lucide-react";
import { useAiChat } from "@workspace/api-client-react";
import { type ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ringAnimImg from "@assets/photo_2026-03-29_15-00-52_1774776666332.jpg";
import neuralNetImg from "@assets/photo_2026-03-29_15-00-48_1774776666333.jpg";
import neuralNetBg from "@assets/photo_2026-03-29_15-00-48_1774779103993.jpg";
import PresentationViewer, { type PresentationData } from "@/components/cadus/PresentationViewer";
import CadusLogo from "@/components/cadus/CadusLogo";
import DNABackground from "@/components/cadus/DNABackground";
import CameraModal from "@/components/cadus/CameraModal";
import { loadSettings, type CadusSettings } from "@/components/cadus/SettingsModal";
import { TypewriterText } from "@/components/cadus/TypewriterText";
import { getTranslation } from "@/lib/translations";
import { useUserAuth } from "@/hooks/use-user-auth";

/* ── Cadus theme CSS custom-property tokens ─────────────────────────── */
function getThemeVars(theme: "dark" | "auto" | "light"): React.CSSProperties {
  if (theme === "light") return {
    "--sp-root-bg":                  "#edf4fb",
    "--sp-sidebar-bg":               "rgba(255,255,255,0.98)",
    "--sp-sidebar-border":           "rgba(0,150,190,0.22)",
    "--sp-topbar-bg":                "rgba(240,248,255,0.97)",
    "--sp-topbar-border":            "rgba(0,150,190,0.18)",
    "--sp-divider":                  "rgba(0,120,170,0.12)",
    "--sp-label":                    "rgba(0,120,170,0.65)",
    "--sp-text-primary":             "rgba(8,30,70,0.95)",
    "--sp-text-muted":               "rgba(25,65,130,0.7)",
    "--sp-text-dim":                 "rgba(25,80,145,0.55)",
    "--sp-text-faint":               "rgba(25,80,145,0.4)",
    "--sp-text-footer":              "rgba(25,80,145,0.72)",
    "--sp-model-inactive-color":     "rgba(25,65,130,0.65)",
    "--sp-model-inactive-bg":        "rgba(0,0,0,0.03)",
    "--sp-model-inactive-border":    "rgba(0,0,0,0.08)",
    "--sp-model-icon-inactive":      "rgba(0,0,0,0.06)",
    "--sp-session-active-bg":        "rgba(0,188,212,0.12)",
    "--sp-session-active-border":    "rgba(0,188,212,0.28)",
    "--sp-session-active-text":      "rgba(0,50,110,0.95)",
    "--sp-session-inactive-text":    "rgba(25,75,145,0.72)",
    "--sp-session-meta":             "rgba(0,110,170,0.5)",
    "--sp-ai-bubble-bg":             "rgba(255,255,255,0.98)",
    "--sp-ai-bubble-border":         "rgba(0,150,190,0.2)",
    "--sp-ai-text":                  "rgba(8,30,70,0.92)",
    "--sp-user-bubble-bg":           "linear-gradient(135deg,rgba(0,188,212,0.18),rgba(0,150,200,0.1))",
    "--sp-user-bubble-border":       "rgba(0,188,212,0.38)",
    "--sp-user-text":                "rgba(0,40,90,0.95)",
    "--sp-input-bg":                 "rgba(255,255,255,0.97)",
    "--sp-input-border":             "rgba(0,150,190,0.3)",
    "--sp-textarea-color":           "rgba(8,30,70,0.95)",
    "--sp-placeholder-color":        "rgba(0,120,170,0.38)",
    "--sp-new-chat-bg":              "rgba(0,188,212,0.1)",
    "--sp-new-chat-border":          "rgba(0,188,212,0.3)",
    "--sp-new-chat-color":           "#007fa3",
    "--sp-toggle-color":             "rgba(0,140,190,0.7)",
    "--sp-caret-color":              "#0099bb",
  } as React.CSSProperties;

  /* dark + auto → clean Replit-style monochrome */
  return {
    "--sp-root-bg":                  "#000000",
    "--sp-sidebar-bg":               "#050505",
    "--sp-sidebar-border":           "rgba(255,255,255,0.06)",
    "--sp-topbar-bg":                "rgba(17,17,17,0.97)",
    "--sp-topbar-border":            "rgba(255,255,255,0.07)",
    "--sp-divider":                  "rgba(255,255,255,0.07)",
    "--sp-label":                    "rgba(255,255,255,0.28)",
    "--sp-text-primary":             "rgba(255,255,255,0.9)",
    "--sp-text-muted":               "rgba(255,255,255,0.45)",
    "--sp-text-dim":                 "rgba(255,255,255,0.32)",
    "--sp-text-faint":               "rgba(255,255,255,0.2)",
    "--sp-text-footer":              "rgba(255,255,255,0.38)",
    "--sp-model-inactive-color":     "rgba(255,255,255,0.55)",
    "--sp-model-inactive-bg":        "rgba(255,255,255,0.03)",
    "--sp-model-inactive-border":    "rgba(255,255,255,0.07)",
    "--sp-model-icon-inactive":      "rgba(255,255,255,0.05)",
    "--sp-session-active-bg":        "rgba(255,255,255,0.07)",
    "--sp-session-active-border":    "rgba(255,255,255,0.1)",
    "--sp-session-active-text":      "rgba(255,255,255,0.92)",
    "--sp-session-inactive-text":    "rgba(255,255,255,0.45)",
    "--sp-session-meta":             "rgba(255,255,255,0.22)",
    "--sp-ai-bubble-bg":             "#1A1A1A",
    "--sp-ai-bubble-border":         "rgba(255,255,255,0.08)",
    "--sp-ai-text":                  "rgba(255,255,255,0.88)",
    "--sp-user-bubble-bg":           "#2A2A2A",
    "--sp-user-bubble-border":       "rgba(255,255,255,0.12)",
    "--sp-user-text":                "rgba(255,255,255,0.92)",
    "--sp-input-bg":                 "#1C1C1C",
    "--sp-input-border":             "rgba(255,255,255,0.12)",
    "--sp-textarea-color":           "rgba(255,255,255,0.88)",
    "--sp-placeholder-color":        "rgba(255,255,255,0.28)",
    "--sp-new-chat-bg":              "rgba(255,255,255,0.05)",
    "--sp-new-chat-border":          "rgba(255,255,255,0.1)",
    "--sp-new-chat-color":           "rgba(255,255,255,0.72)",
    "--sp-toggle-color":             "rgba(255,255,255,0.4)",
    "--sp-caret-color":              "#FFFFFF",
  } as React.CSSProperties;
}

interface ResearchSource {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

interface ExtendedMessage extends ChatMessage {
  imageUrl?: string;
  isImageGeneration?: boolean;
  isImageTypeSelection?: boolean;
  presentationData?: PresentationData;
  presentationPdfBase64?: string;
  presentationDocxBase64?: string;
  presentationTitle?: string;
  isPresentation?: boolean;
  slideCountOptions?: number[];
  isDeepResearch?: boolean;
  isResearchTypeSelection?: boolean;
  researchReport?: string;
  researchSources?: ResearchSource[];
  researchQueries?: string[];
  hasGoogleSearch?: boolean;
}

type ModelId = "pulse45" | "flux36" | "nova46";
type ChatMode = "normal" | "deep-research" | "create-image" | "create-presentation"
  | "drug-interactions" | "dosage-calc" | "lab-values" | "soap-note"
  | "mcq-gen" | "patient-edu" | "procedure-guide" | "ddx" | "image-analysis";

interface Model {
  id: ModelId;
  name: string;
  version: string;
  description: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
  badgeBg: string;
  activeStyle: { background: string; color: string; border: string };
  pro?: boolean;
}

interface ChatSession {
  id: string;
  modelId: ModelId;
  messages: ExtendedMessage[];
  title: string;
  createdAt: number;
}

const MODELS: Model[] = [
  {
    id: "pulse45",
    name: "Cadus Minor",
    version: "",
    description: "Vitals · Emergency · Critical Care",
    icon: Activity,
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    badgeBg: "bg-emerald-50 border-emerald-200",
    activeStyle: { background: "rgba(16,185,129,0.22)", color: "#34d399", border: "1px solid rgba(52,211,153,0.5)" },
  },
  {
    id: "flux36",
    name: "Cadus Medius",
    version: "",
    description: "Pharmacology · Drug Interactions · Labs",
    icon: FlaskConical,
    color: "bg-orange-500",
    textColor: "text-orange-700",
    badgeBg: "bg-orange-50 border-orange-200",
    activeStyle: { background: "rgba(249,115,22,0.2)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.5)" },
  },
  {
    id: "nova46",
    name: "Cadus Magnus",
    version: "",
    description: "Advanced Diagnostics · Research · Multispecialty",
    icon: Crown,
    color: "bg-violet-600",
    textColor: "text-violet-700",
    badgeBg: "bg-violet-50 border-violet-200",
    activeStyle: { background: "rgba(124,58,237,0.22)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.5)" },
    pro: true,
  },
];

const modelGreetings: Record<ModelId, string> = {
  pulse45:
    "Hello! I'm Cadus AI running Cadus Minor — your emergency medicine and vitals specialist. I can help with vital sign interpretation, ACLS protocols, ICU management, monitoring equipment, and critical care guidelines. Ready to assist!",
  flux36:
    "Hello! I'm Cadus AI running Cadus Medius — your pharmacology and laboratory medicine specialist. I can help with drug interactions, dosage calculations, antibiotic selection, lab value interpretation, and NEET-PG pharmacology prep. How can I help?",
  nova46:
    "Upgrade to unlock Cadus Magnus — advanced diagnosis, image analysis and unlimited queries.",
};

const quickSuggestions: Record<ModelId, string[]> = {
  pulse45: ["Normal SpO2 range?", "ACLS for cardiac arrest?", "Best ICU pulse oximeter?"],
  flux36: ["Warfarin drug interactions?", "Normal LFT values?", "CAP antibiotic choice?"],
  nova46: ["Rare autoimmune mimicking SLE?", "Complex multimorbidity regimen?", "Latest ACC guidelines?"],
};

interface Attachment {
  id: string;
  name: string;
  type: "image" | "file";
  previewUrl?: string;
  size: string;
}

function renderMarkdownText(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((chunk, i) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return <strong key={i} className="font-semibold" style={{ color: "rgba(220,240,255,0.95)" }}>{chunk.slice(2, -2)}</strong>;
    }
    return <span key={i}>{chunk}</span>;
  });
}

function ResearchReportCard({
  report, sources, queries, hasGoogleSearch,
}: {
  report: string; sources: ResearchSource[]; queries: string[]; hasGoogleSearch: boolean;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set(Array.from({ length: 10 }, (_, i) => i)));
  const [showAllSources, setShowAllSources] = useState(false);

  const sections = report
    .split(/\n(?=## )/)
    .map((s) => s.replace(/^## /, "").trim())
    .filter(Boolean)
    .map((s) => {
      const nlIdx = s.indexOf("\n");
      const title = nlIdx >= 0 ? s.slice(0, nlIdx).trim() : s.trim();
      const body  = nlIdx >= 0 ? s.slice(nlIdx + 1).trim() : "";
      return { title, body };
    });

  const toggleSection = (i: number) =>
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const visibleSources = showAllSources ? sources : sources.slice(0, 6);

  const sectionIcons: Record<string, string> = {
    "Executive Summary": "📋",
    "Epidemiology & Indian Burden": "🇮🇳",
    "Pathophysiology": "🔬",
    "Clinical Presentation": "🩺",
    "Diagnosis": "🧪",
    "Management & Treatment": "💊",
    "Key Guidelines & Evidence": "📚",
    "Clinical Pearls": "💡",
  };

  const renderBody = (body: string) =>
    body.split("\n").filter(Boolean).map((line, li) => {
      const isBullet = line.startsWith("- ") || line.startsWith("* ");
      const isTakeaway = line.startsWith("**Takeaway:");
      const clean = isBullet ? line.slice(2) : line;
      if (isTakeaway) {
        return (
          <div key={li} className="mt-3 pt-3 border-t border-blue-800/40 flex items-start gap-2">
            <span className="text-yellow-400 shrink-0 text-xs mt-0.5">★</span>
            <span className="text-[12px] font-medium" style={{ color: "rgba(250,220,100,0.9)" }}>{renderMarkdownText(clean)}</span>
          </div>
        );
      }
      return isBullet ? (
        <div key={li} className="flex gap-2">
          <span className="text-cyan-400 mt-1 shrink-0 text-[10px]">◆</span>
          <span className="text-[13px] leading-relaxed">{renderMarkdownText(clean)}</span>
        </div>
      ) : <p key={li} className="text-[13px] leading-relaxed">{renderMarkdownText(line)}</p>;
    });

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-t-2xl" style={{ background: "linear-gradient(135deg,#1e3a8a,#3730a3)" }}>
        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
          <Microscope className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold text-white block">Cadus AI Deep Research</span>
          <span className="text-[10px] text-blue-200/70">{sections.length} sections · {sources.length > 0 ? `${sources.length} sources` : "AI knowledge base"}</span>
        </div>
        {hasGoogleSearch && (
          <span className="flex items-center gap-1 text-[10px] bg-white/15 text-white px-2 py-1 rounded-full shrink-0">
            <Search className="w-2.5 h-2.5" /> Web Search
          </span>
        )}
      </div>

      {/* Search queries used */}
      {queries.length > 0 && (
        <div className="px-4 py-2.5 border-x border-blue-900/50 flex flex-wrap gap-1.5" style={{ background: "rgba(15,30,80,0.6)" }}>
          <span className="text-[10px] text-blue-400/60 mr-1 self-center">Searched:</span>
          {queries.map((q, i) => (
            <span key={i} className="text-[10px] border border-blue-700/40 text-blue-300/80 px-2 py-0.5 rounded-full truncate max-w-[180px]"
              style={{ background: "rgba(30,58,138,0.35)" }} title={q}>
              {q}
            </span>
          ))}
        </div>
      )}

      {/* Report sections */}
      <div className="border-x border-slate-700/50 divide-y divide-slate-700/25" style={{ background: "rgba(5,12,35,0.75)" }}>
        {sections.map((sec, i) => (
          <div key={i}>
            <button type="button"
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/4 transition-colors text-left"
              onClick={() => toggleSection(i)}>
              <span className="text-base shrink-0">{sectionIcons[sec.title] ?? "📌"}</span>
              <span className="text-[13px] font-semibold flex-1" style={{ color: "rgba(210,235,255,0.95)" }}>{sec.title}</span>
              <span className="text-[10px] shrink-0 transition-transform" style={{ color: "rgba(0,200,255,0.45)", transform: expandedSections.has(i) ? "rotate(0deg)" : "rotate(-90deg)" }}>▼</span>
            </button>
            {expandedSections.has(i) && sec.body && (
              <div className="px-5 pb-4 space-y-2" style={{ color: "rgba(175,215,255,0.85)" }}>
                {renderBody(sec.body)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sources — always visible at the bottom */}
      {sources.length > 0 && (
        <div className="border border-slate-700/50 rounded-b-2xl mt-0 overflow-hidden" style={{ background: "rgba(5,12,35,0.85)" }}>
          <div className="px-4 py-3 border-b border-slate-700/30 flex items-center gap-2" style={{ background: "rgba(10,20,60,0.6)" }}>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span className="text-[12px] font-semibold text-cyan-400">Sources</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-medium">{sources.length}</span>
          </div>
          <div className="p-3 grid grid-cols-1 gap-2">
            {visibleSources.map((src, i) => (
              <a key={i} href={src.url} target="_blank" rel="noreferrer"
                className="flex items-start gap-3 p-2.5 rounded-xl group transition-colors hover:bg-white/5"
                style={{ border: "1px solid rgba(0,188,212,0.12)" }}>
                <div className="flex items-center justify-center w-6 h-6 rounded-md shrink-0 mt-0.5 text-[10px] font-bold text-blue-300"
                  style={{ background: "rgba(30,58,138,0.5)", border: "1px solid rgba(59,130,246,0.3)" }}>
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-cyan-400 group-hover:text-cyan-300 group-hover:underline leading-snug mb-0.5 line-clamp-2">{src.title}</p>
                  <div className="flex items-center gap-1.5">
                    <img src={`https://www.google.com/s2/favicons?domain=${src.domain}&sz=16`} alt="" className="w-3 h-3 rounded-sm"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <span className="text-[10px]" style={{ color: "rgba(100,160,220,0.55)" }}>{src.domain}</span>
                  </div>
                  {src.snippet && (
                    <p className="text-[11px] mt-1 leading-snug line-clamp-2" style={{ color: "rgba(160,195,240,0.55)" }}>{src.snippet}</p>
                  )}
                </div>
                <ExternalLink className="w-3 h-3 shrink-0 mt-1 opacity-0 group-hover:opacity-40 text-cyan-400 transition-opacity" />
              </a>
            ))}
          </div>
          {sources.length > 6 && (
            <div className="px-4 pb-3">
              <button type="button" onClick={() => setShowAllSources((v) => !v)}
                className="text-[11px] text-cyan-500 hover:text-cyan-300 hover:underline transition-colors">
                {showAllSources ? "Show fewer" : `Show ${sources.length - 6} more sources ↓`}
              </button>
            </div>
          )}
        </div>
      )}
      {sources.length === 0 && (
        <div className="border border-t-0 border-slate-700/50 rounded-b-2xl px-4 py-3 flex items-center gap-2" style={{ background: "rgba(5,12,35,0.85)" }}>
          <span className="text-[10px] text-white/25">⚠ Based on AI training knowledge — add Google Search API keys for live web sources</span>
        </div>
      )}
    </div>
  );
}

function makeSession(modelId: ModelId): ChatSession {
  return { id: crypto.randomUUID(), modelId, messages: [], title: "New chat", createdAt: Date.now() };
}

const SESSIONS_LS_KEY = "cadus_sessions_v2";
const PINNED_LS_KEY = "cadus_pinned_v1";

function saveSessions(sessions: ChatSession[]): void {
  try { localStorage.setItem(SESSIONS_LS_KEY, JSON.stringify(sessions.slice(0, 30))); } catch {}
}
function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_LS_KEY);
    if (!raw) return [makeSession("pulse45")];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [makeSession("pulse45")];
  } catch { return [makeSession("pulse45")]; }
}
function loadPinned(): string[] {
  try { return JSON.parse(localStorage.getItem(PINNED_LS_KEY) ?? "[]"); } catch { return []; }
}
function savePinned(pins: string[]): void {
  try { localStorage.setItem(PINNED_LS_KEY, JSON.stringify(pins)); } catch {}
}

export default function AiAssistant() {
  const { user } = useUserAuth();
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => loadSessions()[0]?.id ?? "");
  const [pinnedPrompts, setPinnedPrompts] = useState<string[]>(loadPinned);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatMode, setChatMode] = useState<ChatMode>("normal");
  const [showProModal, setShowProModal] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [settings, setSettings] = useState<CadusSettings>(loadSettings);
  const tr = getTranslation(settings.language);
  const themeVars = getThemeVars(settings.theme);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingResearch, setIsGeneratingResearch] = useState(false);
  const [researchStage, setResearchStage] = useState<"idle" | "waiting-type">("idle");
  const [pendingResearchQuery, setPendingResearchQuery] = useState("");
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);
  const [presentationStage, setPresentationStage] = useState<"idle" | "waiting-slide-count">("idle");
  const [pendingPresentationPrompt, setPendingPresentationPrompt] = useState("");
  const [imageStage, setImageStage] = useState<"idle" | "waiting-type">("idle");
  const [pendingImagePrompt, setPendingImagePrompt] = useState("");
  const [buildingTopic, setBuildingTopic] = useState("");
  const [buildingSlideCount, setBuildingSlideCount] = useState(10);
  const [activePresentationData, setActivePresentationData] = useState<(PresentationData & { pdfBase64?: string; docxBase64?: string }) | null>(null);
  const [specialty, setSpecialty] = useState<string>("General");
  const [showSpecialtyPicker, setShowSpecialtyPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported] = useState(() => typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window));
  const recognitionRef = useRef<any>(null);
  const specialtyPickerRef = useRef<HTMLDivElement>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState<string | null>(null);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("demo") === "slides") {
      setActivePresentationData({
        title: "Human Heart — Demo Presentation",
        subtitle: "Medical Education | Cadus AI",
        slides: [
          { n: 1, type: "title", layout: "", t: "The Human Heart", sub: "Structure, Physiology & Clinical Significance", bullets: [] },
          { n: 2, type: "overview", layout: "cards", t: "Overview: Human Heart", sub: "", bullets: [], cards: [
            { heading: "Anatomy & Structure", body: "The heart is a hollow muscular organ in the mediastinum. Four chambers — two atria and two ventricles — pump blood through pulmonary and systemic circuits. Three tissue layers: epicardium, myocardium, and endocardium." },
            { heading: "Physiology & Function", body: "The heart acts as a dual pump circulating blood simultaneously. Cardiac output (CO = HR × SV), preload, afterload, and contractility are the four determinants of cardiac performance." },
            { heading: "Clinical Significance", body: "Cardiovascular disease is the #1 cause of death worldwide. Rapid recognition of MI, heart failure, and arrhythmias using ECG interpretation and biomarkers is essential for every clinician." },
          ]},
          { n: 3, type: "physiology", layout: "stats", t: "Cardiac Physiology by Numbers", sub: "", bullets: [], stats: [
            { value: "5 L/min", label: "Cardiac Output at Rest", desc: "Volume of blood pumped by the heart each minute" },
            { value: "100,000", label: "Heartbeats Per Day", desc: "Approximate number of cardiac contractions daily" },
            { value: "120/80", label: "Normal BP (mmHg)", desc: "Standard systolic / diastolic blood pressure reference" },
          ]},
          { n: 4, type: "clinical", layout: "twocol", t: "Acute Coronary Syndromes", sub: "", bullets: [], leftHeading: "Clinical Presentation", leftBody: "Acute coronary syndrome (ACS) encompasses STEMI, NSTEMI, and unstable angina. Patients present with chest pain, diaphoresis, and dyspnoea. Rapid troponin elevation and ECG changes guide diagnosis. Immediate revascularisation reduces mortality significantly in STEMI. Time is muscle — door-to-balloon under 90 minutes saves lives.", rightPoints: ["STEMI: Complete vessel occlusion — emergency PCI required", "NSTEMI: Partial occlusion — troponin positive, no ST elevation", "Unstable Angina: No troponin rise, high-risk — urgent workup", "Key: Dual antiplatelet therapy + anticoagulation within 10 minutes"] },
          { n: 5, type: "pathways", layout: "list", t: "Management Pathways", sub: "", bullets: ["Primary prevention: Lifestyle modification, statin therapy, BP control", "Secondary prevention: Dual antiplatelet, ACE inhibitors, cardiac rehab", "Acute management: Aspirin + heparin + PCI within 90 minutes", "Heart failure: GDMT including beta-blockers, ARNi, SGLT2 inhibitors", "Sudden death prevention: ICD implant in EF < 35% on optimal therapy"], ki: "Early revascularisation and guideline-directed therapy dramatically reduce cardiovascular mortality — time-sensitive intervention saves lives." },
        ],
      });
    }
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cadus-settings-v1" && e.newValue) {
        try {
          const next = JSON.parse(e.newValue);
          setSettings((prev) => ({ ...prev, ...next }));
        } catch {}
      }
      if (e.key === "cadus_sessions_v2" && !e.newValue) {
        const fresh = makeSession("pulse45");
        setSessions([fresh]);
        setActiveSessionId(fresh.id);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const [input, setInput] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const [sidebarView, setSidebarView] = useState<"home" | "chats" | "models">("home");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const modelPickerRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const chatMutation = useAiChat();
  const { toast } = useToast();

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? sessions[0];
  const activeModel: ModelId = activeSession?.modelId ?? "pulse45";
  const messages: ExtendedMessage[] = activeSession?.messages ?? [];
  const hasMessages = messages.length > 0;
  const model = MODELS.find((m) => m.id === activeModel)!;
  const isProLocked = model.pro ?? false;

  const seenMsgKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!activeSessionId) return;
    messages.forEach((_, idx) => {
      seenMsgKeys.current.add(`${activeSessionId}:${idx}`);
    });
  }, [activeSessionId]);

  const isMsgNew = (idx: number) =>
    !!activeSessionId && !seenMsgKeys.current.has(`${activeSessionId}:${idx}`);

  const markMsgSeen = (idx: number) => {
    if (activeSessionId) seenMsgKeys.current.add(`${activeSessionId}:${idx}`);
  };

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatMutation.isPending]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
      if (modelPickerRef.current && !modelPickerRef.current.contains(e.target as Node)) {
        setShowModelPicker(false);
      }
      if (specialtyPickerRef.current && !specialtyPickerRef.current.contains(e.target as Node)) {
        setShowSpecialtyPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleVoiceInput = useCallback(() => {
    if (!voiceSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as any[])
        .map((r: any) => r[0].transcript).join("");
      setInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [voiceSupported, isListening]);

  const updateSession = useCallback((sessionId: string, msgs: ExtendedMessage[]) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const firstUser = msgs.find((m) => m.role === ChatMessageRole.user);
        const title = firstUser ? firstUser.content.slice(0, 50) : "New chat";
        return { ...s, messages: msgs, title };
      })
    );
  }, []);

  const handleNewChat = () => {
    const sess = makeSession(activeModel);
    setSessions((prev) => [sess, ...prev]);
    setActiveSessionId(sess.id);
    setChatMode("normal");
    setAttachments([]);
    resetPresentationState();
    setInput("");
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (next.length === 0) {
        const fresh = makeSession("pulse45");
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (id === activeSessionId) {
        setActiveSessionId(next[0].id);
      }
      return next;
    });
  };

  const resetPresentationState = () => {
    setPresentationStage("idle");
    setPendingPresentationPrompt("");
    setImageStage("idle");
    setPendingImagePrompt("");
    setResearchStage("idle");
    setPendingResearchQuery("");
  };

  const handleModelSelect = (m: Model) => {
    if (m.pro) { setShowProModal(true); return; }
    const existingSession = [...sessions].reverse().find((s) => s.modelId === m.id);
    if (existingSession) {
      setActiveSessionId(existingSession.id);
    } else {
      const sess = makeSession(m.id);
      setSessions((prev) => [sess, ...prev]);
      setActiveSessionId(sess.id);
    }
    setInput("");
    setChatMode("normal");
    resetPresentationState();
  };

  const toggleMode = (mode: ChatMode) => {
    setChatMode((prev) => {
      if (prev === mode) { resetPresentationState(); return "normal"; }
      resetPresentationState();
      return mode;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasContent = input.trim() || attachments.length > 0;
    if (!hasContent || chatMutation.isPending || isGeneratingImage || isGeneratingResearch || isGeneratingPresentation || isProLocked) return;

    const userMsg = input.trim() || `[Attached: ${attachments.map((a) => a.name).join(", ")}]`;
    setInput("");
    setAttachments([]);

    const currentMsgs = activeSession.messages;
    const sessionId = activeSession.id;
    const userEntry: ExtendedMessage = { role: ChatMessageRole.user, content: userMsg };
    const newMsgs: ExtendedMessage[] = [...currentMsgs, userEntry];
    updateSession(sessionId, newMsgs);

    if (chatMode === "create-image") {
      setPendingImagePrompt(userMsg);
      setImageStage("waiting-type");
      updateSession(sessionId, [...newMsgs, {
        role: ChatMessageRole.assistant,
        content: tr.imageTypeQuestion,
        isImageTypeSelection: true,
      }]);
      return;
    }

    if (chatMode === "create-presentation") {
      setPendingPresentationPrompt(userMsg);
      setPresentationStage("waiting-slide-count");
      updateSession(sessionId, [...newMsgs, {
        role: ChatMessageRole.assistant,
        content: `Great! I'll create a presentation on "${userMsg}". How many slides would you like?`,
        slideCountOptions: [5, 8, 10, 12, 15, 20],
      }]);
      return;
    }

    if (chatMode === "deep-research") {
      setPendingResearchQuery(userMsg);
      setResearchStage("waiting-type");
      updateSession(sessionId, [...newMsgs, {
        role: ChatMessageRole.assistant,
        content: tr.researchTypeQuestion ?? "Would you like a quick summary or a full deep research report?",
        isResearchTypeSelection: true,
      }]);
      return;
    }

    if (chatMode === "image-analysis") {
      const imageAttachment = attachments.find(a => a.type === "image");
      if (!imageAttachment || !imageAttachment.previewUrl) {
        toast({ title: "No image attached", description: "Please attach an X-ray, ECG, or medical image first.", variant: "destructive" });
        updateSession(sessionId, currentMsgs);
        return;
      }
      setIsAnalyzingImage(true);
      try {
        const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
        const resp = await fetch(`${apiBase}/api/ai/analyze-image`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: imageAttachment.previewUrl.split(",")[1],
            imageType: imageAttachment.previewUrl.split(";")[0].split(":")[1] ?? "image/jpeg",
            query: userMsg || "Please provide a full clinical analysis of this medical image.",
            specialty,
          }),
        });
        const data = await resp.json();
        if (data.analysis) {
          updateSession(sessionId, [...newMsgs, { role: ChatMessageRole.assistant, content: data.analysis }]);
        } else throw new Error(data.error ?? "Analysis failed");
      } catch (err: any) {
        toast({ title: "Image analysis failed", description: err?.message ?? "Please try again.", variant: "destructive" });
        updateSession(sessionId, currentMsgs);
      } finally { setIsAnalyzingImage(false); }
      return;
    }

    const apiMode = chatMode === "normal" ? "normal" : chatMode;
    chatMutation.mutate(
      { data: { message: userMsg, conversationHistory: currentMsgs, agent: activeModel, language: settings.language, mode: apiMode, specialty } as any },
      {
        onSuccess: (data) => {
          updateSession(sessionId, [...newMsgs, { role: ChatMessageRole.assistant, content: data.message }]);
        },
      }
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const att: Attachment = {
        id: crypto.randomUUID(), name: file.name, type,
        size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
      };
      if (type === "image") {
        const reader = new FileReader();
        reader.onload = (ev) => { att.previewUrl = ev.target?.result as string; setAttachments((prev) => [...prev, { ...att }]); };
        reader.readAsDataURL(file);
      } else {
        setAttachments((prev) => [...prev, att]);
      }
    });
    setShowAttachMenu(false);
    e.target.value = "";
  };

  const handleSlideCountSelect = async (count: number) => {
    if (isGeneratingPresentation) return;
    const currentMsgs = activeSession.messages;
    const sessionId = activeSession.id;
    const topic = pendingPresentationPrompt;
    const userEntry: ExtendedMessage = { role: ChatMessageRole.user, content: `${count} slides` };
    const newMsgs = [...currentMsgs, userEntry];
    updateSession(sessionId, newMsgs);
    setBuildingTopic(topic);
    setBuildingSlideCount(count);
    setIsGeneratingPresentation(true);
    try {
      const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
      const [slidesResp, pdfResp] = await Promise.allSettled([
        fetch(`${apiBase}/api/ai/generate-slides`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: topic, slideCount: count }) }).then(r => r.json()),
        fetch(`${apiBase}/api/ai/generate-presentation`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: topic, slideCount: count }) }).then(r => r.json()),
      ]);
      const slidesData = slidesResp.status === "fulfilled" ? slidesResp.value : null;
      const pdfData = pdfResp.status === "fulfilled" ? pdfResp.value : null;

      if (slidesData?.slides?.length) {
        const merged: PresentationData & { pdfBase64?: string; docxBase64?: string } = {
          ...slidesData, pdfBase64: pdfData?.pdfBase64, docxBase64: pdfData?.docxBase64,
        };
        setActivePresentationData(merged);
        updateSession(sessionId, [...newMsgs, {
          role: ChatMessageRole.assistant,
          content: `Your presentation "${slidesData.title}" (${count} slides) is ready!`,
          isPresentation: true, presentationData: merged,
          presentationTitle: slidesData.title, presentationPdfBase64: pdfData?.pdfBase64,
          presentationDocxBase64: pdfData?.docxBase64,
        }]);
        resetPresentationState();
      } else if (pdfData?.pdfBase64) {
        updateSession(sessionId, [...newMsgs, {
          role: ChatMessageRole.assistant,
          content: `Your presentation "${pdfData.title}" (${pdfData.totalSlides} slides) is ready! Download it below:`,
          isPresentation: true, presentationTitle: pdfData.title,
          presentationPdfBase64: pdfData.pdfBase64, presentationDocxBase64: pdfData.docxBase64,
        }]);
        resetPresentationState();
      } else throw new Error("Generation failed");
    } catch {
      toast({ title: "Presentation generation failed", description: "Please try again.", variant: "destructive" });
      updateSession(sessionId, currentMsgs);
      resetPresentationState();
    } finally { setIsGeneratingPresentation(false); }
  };

  const handleImageTypeSelect = async (imageStyle: "simple" | "diagram" | "real" | "real-labeled") => {
    if (isGeneratingImage) return;
    const currentMsgs = activeSession.messages;
    const sessionId = activeSession.id;
    const prompt = pendingImagePrompt;
    const styleLabels: Record<string, string> = {
      simple: tr.simpleImage,
      diagram: tr.diagram ?? "Diagram",
      real: tr.realImage ?? "Real Image",
      "real-labeled": tr.realImageLabeled ?? "Real Image + Labels",
    };
    const contentLabels: Record<string, string> = {
      simple: "medical illustration",
      diagram: "anatomical diagram",
      real: "real medical image",
      "real-labeled": "labeled real medical image",
    };
    const typeLabel = styleLabels[imageStyle] ?? tr.simpleImage;
    const userEntry: ExtendedMessage = { role: ChatMessageRole.user, content: typeLabel };
    const newMsgs = [...currentMsgs, userEntry];
    updateSession(sessionId, newMsgs);
    setImageStage("idle");
    setIsGeneratingImage(true);
    try {
      const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
      const resp = await fetch(`${apiBase}/api/ai/generate-image`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageStyle }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? "Image generation failed. Please try again.");
      if (data.imageUrl) {
        updateSession(sessionId, [...newMsgs, {
          role: ChatMessageRole.assistant,
          content: `Here is your generated ${contentLabels[imageStyle] ?? "medical illustration"} for: "${prompt}"`,
          imageUrl: data.imageUrl, isImageGeneration: true,
        }]);
      } else throw new Error(data.error ?? "No image was returned.");
    } catch (err: any) {
      const description = err?.message ?? "Please try a different prompt.";
      toast({ title: "Image generation failed", description, variant: "destructive" });
      updateSession(sessionId, currentMsgs);
    } finally { setIsGeneratingImage(false); }
  };

  const handleResearchTypeSelect = async (mode: "quick" | "full") => {
    if (isGeneratingResearch) return;
    const currentMsgs = activeSession.messages;
    const sessionId = activeSession.id;
    const query = pendingResearchQuery;
    const typeLabel = mode === "quick"
      ? (tr.quickSummary ?? "Quick Summary")
      : (tr.fullDeepResearch ?? "Full Deep Research");
    const userEntry: ExtendedMessage = { role: ChatMessageRole.user, content: typeLabel };
    const newMsgs = [...currentMsgs, userEntry];
    updateSession(sessionId, newMsgs);
    setResearchStage("idle");
    setIsGeneratingResearch(true);
    try {
      const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
      if (mode === "quick") {
        const resp = await fetch(`${apiBase}/api/ai/chat`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Provide a concise clinical summary (3–5 paragraphs) on: ${query}. Cover key facts, clinical relevance, and management highlights.`,
            agent: activeModel, mode: "normal",
          }),
        });
        const data = await resp.json();
        if (data.message) {
          updateSession(sessionId, [...newMsgs, {
            role: ChatMessageRole.assistant, content: data.message,
          }]);
        } else throw new Error("No response returned.");
      } else {
        const resp = await fetch(`${apiBase}/api/ai/deep-research`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, agent: activeModel }),
        });
        const data = await resp.json();
        if (data.report) {
          updateSession(sessionId, [...newMsgs, {
            role: ChatMessageRole.assistant, content: "",
            isDeepResearch: true, researchReport: data.report,
            researchSources: data.sources ?? [], researchQueries: data.searchQueries ?? [],
            hasGoogleSearch: data.hasGoogleSearch ?? false,
          }]);
        } else throw new Error(data.error ?? "Research failed");
      }
    } catch {
      toast({ title: "Research failed", description: "Please try again.", variant: "destructive" });
      updateSession(sessionId, currentMsgs);
    } finally { setIsGeneratingResearch(false); }
  };

  const removeAttachment = (id: string) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  const handleDownloadPdf = async (content: string, msgId: string) => {
    setIsExportingPdf(msgId);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 16;
      const contentW = pageW - margin * 2;
      let y = 0;

      // White page background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageW, pageH, "F");

      // Header bar — dark navy with white text (readable on dark bg)
      doc.setFillColor(10, 24, 70);
      doc.rect(0, 0, pageW, 24, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("Cadus AI", margin, 15);
      const modeLabel = chatMode && chatMode !== "normal"
        ? chatMode.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        : "Clinical Report";
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(180, 210, 255);
      doc.text(`· AI ${modeLabel}`, margin + 28, 15);
      const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      doc.setTextColor(200, 220, 255);
      doc.text(dateStr, pageW - margin, 15, { align: "right" });

      // Teal accent stripe under header
      doc.setFillColor(0, 188, 168);
      doc.rect(0, 24, pageW, 1.5, "F");

      y = 34;
      const firstUserMsg = messages.find(m => m.role === ChatMessageRole.user)?.content?.slice(0, 90) ?? "Clinical Report";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(10, 24, 70);
      const titleLines = doc.splitTextToSize(firstUserMsg, contentW);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 6.5 + 2;

      doc.setDrawColor(0, 188, 168);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageW - margin, y);
      y += 7;

      const checkNewPage = (needed: number) => {
        if (y + needed > pageH - 18) {
          doc.addPage();
          // White background on new page
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, pageW, pageH, "F");
          // Thin header strip
          doc.setFillColor(10, 24, 70);
          doc.rect(0, 0, pageW, 8, "F");
          doc.setFillColor(0, 188, 168);
          doc.rect(0, 8, pageW, 1, "F");
          y = 16;
        }
      };

      const lines = content.split("\n");
      for (const line of lines) {
        const stripped = line.trimStart();
        if (stripped === "") { y += 3; continue; }

        if (stripped.startsWith("# ")) {
          checkNewPage(12);
          y += 4;
          doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(10, 24, 70);
          const wrapped = doc.splitTextToSize(stripped.slice(2), contentW);
          doc.text(wrapped, margin, y); y += wrapped.length * 6.5 + 2;
        } else if (stripped.startsWith("## ")) {
          checkNewPage(10);
          y += 3;
          doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0, 100, 130);
          const wrapped = doc.splitTextToSize(stripped.slice(3), contentW);
          doc.text(wrapped, margin, y); y += wrapped.length * 5.8 + 2;
        } else if (stripped.startsWith("### ")) {
          checkNewPage(9);
          y += 2;
          doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(30, 80, 140);
          const wrapped = doc.splitTextToSize(stripped.slice(4), contentW);
          doc.text(wrapped, margin, y); y += wrapped.length * 5.2 + 1;
        } else if (stripped.startsWith("- ") || stripped.startsWith("• ") || stripped.match(/^\d+\.\s/)) {
          checkNewPage(6);
          const bulletText = stripped.startsWith("- ") ? stripped.slice(2) : stripped.startsWith("• ") ? stripped.slice(2) : stripped.replace(/^\d+\.\s/, "");
          const clean = bulletText.replace(/\*\*(.*?)\*\*/g, "$1");
          doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(25, 35, 55);
          const wrapped = doc.splitTextToSize(`• ${clean}`, contentW - 5);
          doc.text(wrapped, margin + 3, y); y += wrapped.length * 5 + 0.8;
        } else {
          checkNewPage(6);
          const clean = stripped.replace(/\*\*(.*?)\*\*/g, "$1");
          doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(25, 35, 55);
          const wrapped = doc.splitTextToSize(clean, contentW);
          doc.text(wrapped, margin, y); y += wrapped.length * 5 + 0.8;
        }
      }

      // Footer on every page
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFillColor(240, 243, 250);
        doc.rect(0, pageH - 11, pageW, 11, "F");
        doc.setDrawColor(200, 210, 230);
        doc.setLineWidth(0.3);
        doc.line(0, pageH - 11, pageW, pageH - 11);
        doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); doc.setTextColor(60, 80, 120);
        doc.text("Generated by Cadus AI — AETHEX Medical Platform  |  For clinical reference only. Not a substitute for professional medical judgment.", margin, pageH - 4.5);
        doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 4.5, { align: "right" });
      }

      doc.save(`cadus-report-${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      toast({ title: "Export failed", description: "Could not generate PDF. Please try again.", variant: "destructive" });
    } finally { setIsExportingPdf(null); }
  };

  const handleTogglePin = (prompt: string) => {
    setPinnedPrompts(prev => {
      const next = prev.includes(prompt) ? prev.filter(p => p !== prompt) : [...prev, prompt];
      savePinned(next);
      return next;
    });
  };

  const handleCameraCapture = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const id = `cam-${Date.now()}`;
    setAttachments((prev) => [...prev, { id, type: "image", file, previewUrl, name: file.name }]);
  };

  const handleClearCurrentChat = () => {
    const fresh = makeSession(activeModel);
    setSessions((prev) => prev.map((s) => s.id === activeSessionId ? fresh : s));
    setActiveSessionId(fresh.id);
  };

  const handleExportChats = () => {
    const data = JSON.stringify(sessions, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `cadus-chats-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const ModelIcon = model.icon;

  // Group sessions by today / yesterday / older
  const now = Date.now();
  const todaySessions = sessions.filter((s) => now - s.createdAt < 86400000);
  const yesterdaySessions = sessions.filter((s) => now - s.createdAt >= 86400000 && now - s.createdAt < 172800000);
  const olderSessions = sessions.filter((s) => now - s.createdAt >= 172800000);

  return (
    <div className="h-screen flex overflow-hidden relative" style={{ background: "var(--sp-root-bg)", ...themeVars }}>

      {/* Blink-style spotlight background — 3 layers (fully inline) */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        background:"radial-gradient(ellipse 85% 65% at 50% -5%, rgba(28,70,200,0.55) 0%, rgba(10,30,90,0.35) 40%, transparent 68%)",
        animation:"cadus-spot-breathe 5s ease-in-out infinite" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        background:"radial-gradient(ellipse 42% 36% at 50% -2%, rgba(100,180,255,0.18) 0%, rgba(50,120,255,0.08) 45%, transparent 70%)",
        animation:"cadus-spot-pulse 3.5s ease-in-out infinite", animationDelay:"-1.5s" }} />
      <div style={{ position:"absolute", top:-40, left:"50%", transform:"translateX(-50%)", width:420, height:230,
        borderRadius:"50%", pointerEvents:"none", zIndex:1,
        background:"radial-gradient(ellipse at 50% 30%, rgba(60,140,255,0.14) 0%, transparent 65%)",
        animation:"cadus-spot-pulse 4s ease-in-out infinite", animationDelay:"-0.7s" }} />

      {/* Hidden inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileSelect(e, "image")} />
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.csv,.xlsx" multiple className="hidden" onChange={(e) => handleFileSelect(e, "file")} />

      {/* ═══════════════════════════════════════════════════════════
          LEFT SIDEBAR — Replit style
      ══════════════════════════════════════════════════════════════ */}
      <aside
        className={cn(
          "relative z-20 flex flex-col shrink-0 transition-all duration-300 overflow-hidden",
          sidebarOpen ? "w-[220px]" : "w-0"
        )}
        style={{
          background: "var(--sp-sidebar-bg)",
          borderRight: "1px solid var(--sp-sidebar-border)",
        }}
      >
        {/* Top row: Logo + centred Search bar */}
        <div className="flex flex-col items-center gap-2 px-3 pt-3 pb-1 shrink-0">
          <CadusLogo size="md" thinking={false} baseUrl={import.meta.env.BASE_URL} />
          <div className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Search chats…</span>
          </div>
        </div>

        {/* Workspace selector */}
        <div className="px-2 pb-2 shrink-0">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all hover:bg-white/5">
            <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #1a73e8, #0ea5e9)" }}>S</div>
            <span className="flex-1 text-left text-xs font-medium truncate" style={{ color: "rgba(255,255,255,0.75)" }}>
              Cadus AI's Workspace
            </span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
          </button>
        </div>

        {/* Primary actions */}
        <div className="px-3 pb-2 space-y-1 shrink-0">
          <button onClick={handleNewChat}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Plus className="w-4 h-4" />
            Create something new
          </button>
          <button onClick={() => imageInputRef.current?.click()}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.45)" }}>
            <Upload className="w-4 h-4" />
            Import files or images
          </button>
        </div>

        {/* Nav links */}
        <div className="px-2 pb-2 space-y-0.5 shrink-0">
          {[
            { id: "home" as const, icon: Home, label: "Home" },
            { id: "chats" as const, icon: MessageSquare, label: "Chats" },
            { id: "models" as const, icon: Activity, label: "Models" },
          ].map(({ id, icon: Icon, label }) => (
            <button key={id}
              onClick={() => setSidebarView(id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                background: sidebarView === id ? "rgba(255,255,255,0.07)" : "transparent",
                color: sidebarView === id ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
              }}>
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="mx-3 my-1 shrink-0" style={{ borderTop: "1px solid var(--sp-divider)" }} />

        {/* Session history (scrollable) */}
        <div className="flex-1 overflow-y-auto px-2 min-h-0">
          {sidebarView === "chats" && (
            <>
              {[
                { label: tr.today, list: todaySessions },
                { label: tr.yesterday, list: yesterdaySessions },
                { label: tr.older, list: olderSessions },
              ].map(({ label, list }) =>
                list.length > 0 ? (
                  <div key={label} className="mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1 pt-1" style={{ color: "rgba(255,255,255,0.28)" }}>
                      {label}
                    </p>
                    {list.map((sess) => {
                      const sm = MODELS.find((m) => m.id === sess.modelId)!;
                      const isActive = sess.id === activeSessionId;
                      return (
                        <div key={sess.id} role="button" tabIndex={0}
                          onClick={() => { setActiveSessionId(sess.id); setSidebarView("home"); }}
                          onKeyDown={(e) => e.key === "Enter" && setActiveSessionId(sess.id)}
                          className="group w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all mb-0.5 cursor-pointer"
                          style={{
                            background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                            color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                          }}>
                          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-[12px] truncate flex-1">{sess.title}</span>
                          <button onClick={(e) => handleDeleteSession(sess.id, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "rgba(255,100,100,0.6)" }}>
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : null
              )}
              {sessions.every(s => s.messages.length === 0) && (
                <p className="text-xs text-center px-2 py-4" style={{ color: "rgba(255,255,255,0.2)" }}>{tr.noChatsYet}</p>
              )}
            </>
          )}
          {sidebarView === "models" && (
            <div className="pt-1 space-y-1">
              {MODELS.map((m) => {
                const MI = m.icon;
                const isActive = m.id === activeModel;
                return (
                  <button key={m.id} onClick={() => handleModelSelect(m)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all"
                    style={isActive
                      ? { ...m.activeStyle, borderRadius: 8 }
                      : { color: "rgba(255,255,255,0.5)", border: "1px solid transparent" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)" }}>
                      {m.pro && !isActive ? <Lock className="w-3.5 h-3.5" style={{ color: "rgba(167,139,250,0.7)" }} /> : <MI className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs font-semibold">{m.name} <span className="opacity-60 font-normal">{m.version}</span></div>
                      <div className="text-[10px] opacity-40 truncate">{m.description}</div>
                    </div>
                    {m.pro && <span className="text-[9px] font-bold px-1 py-0.5 rounded-full" style={{ background: "rgba(109,40,217,0.4)", color: "#c4b5fd" }}>PRO</span>}
                  </button>
                );
              })}
            </div>
          )}
          {sidebarView === "home" && sessions.some(s => s.messages.length > 0) && (
            <div className="pt-1">
              <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1" style={{ color: "rgba(255,255,255,0.28)" }}>Recent</p>
              {sessions.filter(s => s.messages.length > 0).slice(0, 8).map(sess => {
                const isActive = sess.id === activeSessionId;
                return (
                  <button key={sess.id} onClick={() => setActiveSessionId(sess.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all mb-0.5"
                    style={{ background: isActive ? "rgba(255,255,255,0.07)" : "transparent", color: isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)" }}>
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sess.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pro referral card */}
        <div className="mx-3 mb-2 mt-2 rounded-xl shrink-0 overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.22) 0%, rgba(30,58,138,0.18) 100%)", border: "1px solid rgba(139,92,246,0.22)" }}>
          <div className="px-3 pt-3 pb-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
                <Crown className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-[11px] font-bold" style={{ color: "rgba(220,210,255,0.95)" }}>Cadus Magnus</span>
              <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.3)", color: "#c4b5fd" }}>PRO</span>
            </div>
            <p className="text-[10px] leading-relaxed mb-2.5" style={{ color: "rgba(180,170,220,0.65)" }}>
              Advanced diagnosis, deep research &amp; image analysis.
            </p>
            <button onClick={() => setShowProModal(true)}
              className="w-full text-[10px] font-bold py-1.5 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-1"
              style={{ background: "linear-gradient(to right,#7c3aed,#9333ea)", color: "white" }}>
              <Crown className="w-3 h-3" /> View Plans
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className="px-2 pb-3 space-y-0.5 shrink-0">
          {[
            { icon: BookOpen, label: "Learn" },
            { icon: FileText, label: "Documentation" },
          ].map(({ icon: Icon, label }) => (
            <button key={label}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
          <button onClick={() => setShowProModal(true)}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            <Crown className="w-3.5 h-3.5" />
            Refer & Earn
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════
          MAIN AREA
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-h-0 relative">

        {/* ── Top Banner ── */}
        {showBanner && !hasMessages && (
          <div className="shrink-0 flex items-center justify-center gap-3 px-4 py-2 text-sm relative"
            style={{ background: "linear-gradient(90deg, rgba(109,40,217,0.12) 0%, rgba(30,58,138,0.1) 50%, rgba(109,40,217,0.12) 100%)", borderBottom: "1px solid rgba(139,92,246,0.15)" }}>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
                <Crown className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-medium" style={{ color: "rgba(200,185,255,0.75)" }}>Unlock Cadus Magnus for advanced diagnosis &amp; unlimited queries</span>
            </div>
            <button onClick={() => setShowProModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all hover:opacity-90"
              style={{ background: "linear-gradient(to right,#7c3aed,#9333ea)", color: "white" }}>
              See plans
            </button>
            <button onClick={() => setShowBanner(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── HOME VIEW — Replit-style ── */}
        {!hasMessages && (
          <div className="flex-1 overflow-y-auto flex flex-col items-center pt-10 pb-8 px-4">

            {/* Workspace selector */}
            <button className="flex items-center gap-2 mb-7 px-3 py-1.5 rounded-xl transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #1a73e8, #0ea5e9)" }}>S</div>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>Cadus AI's Workspace</span>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} />
            </button>

            {/* Main greeting */}
            <h1 className="text-[2rem] font-semibold text-center mb-7 leading-snug" style={{ color: "rgba(255,255,255,0.92)" }}>
              Hi, what do you want to diagnose today? — Cadus AI is ready.
            </h1>

            {/* ── INPUT FORM (Replit-style) ── */}
            <div className="w-full max-w-2xl mb-5">
              {isProLocked ? (
                <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <Lock className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{tr.proRequired}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{tr.proGatedMsg}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowProModal(true)}
                    className="flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap"
                    style={{ background: "rgba(255,255,255,0.9)", color: "#111" }}>
                    <Crown className="w-4 h-4" /> {tr.upgradePro}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-2xl overflow-visible"
                  style={{ background: "var(--sp-input-bg)", border: "1px solid var(--sp-input-border)", boxShadow: "0 4px 32px rgba(0,0,0,0.3)" }}>
                  {chatMode !== "normal" && (
                    <div className="flex items-center gap-2 px-4 py-2 border-b text-xs font-semibold"
                      style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.03)" }}>
                      {chatMode === "deep-research"        ? <><Microscope    className="w-3.5 h-3.5" style={{color:"#34D399"}} /> Deep Research Mode</>
                      : chatMode === "create-presentation" ? <><Presentation  className="w-3.5 h-3.5" style={{color:"#FBBF24"}} /> {presentationStage === "idle" ? "Slides Mode" : tr.selectSlideCountAbove}</>
                      : chatMode === "create-image"        ? <><ImagePlus     className="w-3.5 h-3.5" style={{color:"#F472B6"}} /> {imageStage === "waiting-type" ? tr.selectSlideCountAbove : "Image Mode"}</>
                      : chatMode === "drug-interactions"   ? <><Pill          className="w-3.5 h-3.5" style={{color:"#F87171"}} /> Drug Interaction Checker</>
                      : chatMode === "dosage-calc"         ? <><Calculator    className="w-3.5 h-3.5" style={{color:"#FB923C"}} /> Dosage Calculator</>
                      : chatMode === "lab-values"          ? <><TestTube2     className="w-3.5 h-3.5" style={{color:"#4ADE80"}} /> Lab Values Interpreter</>
                      : chatMode === "soap-note"           ? <><ClipboardList className="w-3.5 h-3.5" style={{color:"#38BDF8"}} /> SOAP Note Generator</>
                      : chatMode === "mcq-gen"             ? <><HelpCircle   className="w-3.5 h-3.5" style={{color:"#C084FC"}} /> MCQ / Exam Prep Generator</>
                      : chatMode === "patient-edu"         ? <><Languages    className="w-3.5 h-3.5" style={{color:"#FB7185"}} /> Patient Education Mode</>
                      : chatMode === "procedure-guide"     ? <><Zap          className="w-3.5 h-3.5" style={{color:"#FDE047"}} /> Procedure Guide</>
                      : chatMode === "ddx"                 ? <><Brain        className="w-3.5 h-3.5" style={{color:"#A78BFA"}} /> Differential Diagnosis Generator</>
                      : chatMode === "image-analysis"      ? <><Microscope  className="w-3.5 h-3.5" style={{color:"#2DD4BF"}} /> Medical Scan Analysis (Pro)</>
                      : null}
                      {specialty !== "General" && (
                        <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: "rgba(100,180,255,0.15)", color: "rgba(100,180,255,0.9)" }}>
                          {specialty}
                        </span>
                      )}
                      <button type="button" onClick={() => toggleMode(chatMode)} className="ml-auto hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                  {attachments.length > 0 && (
                    <div className="flex gap-2 px-4 pt-3 flex-wrap">
                      {attachments.map((a) => (
                        <div key={a.id} className="relative group flex items-center gap-2 rounded-xl px-3 py-2 text-xs max-w-[160px]"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}>
                          {a.type === "image" && a.previewUrl
                            ? <img src={a.previewUrl} alt={a.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                            : <FileText className="w-5 h-5 shrink-0" style={{ color: "rgba(255,255,255,0.5)" }} />}
                          <div className="min-w-0">
                            <p className="truncate font-medium leading-tight">{a.name}</p>
                            <p style={{ color: "rgba(255,255,255,0.3)" }}>{a.size}</p>
                          </div>
                          <button type="button" onClick={() => removeAttachment(a.id)}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full items-center justify-center hidden group-hover:flex"
                            style={{ background: "rgba(200,50,50,0.8)", color: "white" }}>
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
                    placeholder={
                      chatMode === "create-image"        ? tr.describeImagePlaceholder
                      : chatMode === "deep-research"     ? tr.researchTopicPlaceholder
                      : chatMode === "create-presentation" && presentationStage === "idle" ? tr.presentationTopicPlaceholder
                      : chatMode === "create-presentation" && presentationStage === "waiting-slide-count" ? tr.selectSlidesPlaceholder
                      : chatMode === "drug-interactions" ? "Enter drug names, e.g. 'Warfarin + Aspirin + Metformin'..."
                      : chatMode === "dosage-calc"       ? "Enter drug + patient details, e.g. 'Gentamicin, 60kg male, eGFR 45'..."
                      : chatMode === "lab-values"        ? "Paste lab results, e.g. 'Hb 8.2, WBC 12000, Platelets 95000, ALT 120...'..."
                      : chatMode === "soap-note"         ? "Describe the clinical encounter in free text — Cadus AI will structure it as a SOAP note..."
                      : chatMode === "mcq-gen"           ? "Enter a topic for NEET-PG / USMLE questions, e.g. 'Myocardial Infarction'..."
                      : chatMode === "patient-edu"       ? "Enter the diagnosis/condition to explain to a patient in simple language..."
                      : chatMode === "procedure-guide"   ? "Enter a procedure name, e.g. 'Central venous catheter insertion'..."
                      : chatMode === "ddx"               ? "Describe symptoms, vitals, history — Cadus AI will generate a ranked DDx with ICD-10 codes..."
                      : chatMode === "image-analysis"    ? "Attach an X-ray, ECG, CT, MRI, or fundus image — then ask a question or just press Send to get a full report..."
                      : "Describe your clinical question, Cadus AI will bring it to life..."
                    }
                    rows={2}
                    className="w-full px-5 pt-4 pb-2 text-[15px] bg-transparent focus:outline-none resize-none cadus-textarea"
                    style={{ color: "var(--sp-textarea-color)", caretColor: "var(--sp-caret-color)", minHeight: "72px", maxHeight: "180px" }}
                    disabled={chatMutation.isPending || isGeneratingPresentation || presentationStage === "waiting-slide-count"}
                  />
                  <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">
                    <div className="flex items-center gap-1">
                      <div className="relative" ref={attachMenuRef}>
                        <button type="button" onClick={() => setShowAttachMenu((v) => !v)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={{ color: showAttachMenu ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}>
                          <Plus className="w-4 h-4" />
                        </button>
                        {showAttachMenu && (
                          <div className="absolute bottom-full left-0 mb-2 rounded-xl shadow-xl overflow-hidden w-52 z-30"
                            style={{ background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.28)" }}>{tr.attach}</div>
                            {[
                              { label: tr.uploadImage, sub: tr.uploadImageFormats, icon: Image, action: () => imageInputRef.current?.click() },
                              { label: tr.uploadDocument, sub: tr.uploadDocumentFormats, icon: FileText, action: () => fileInputRef.current?.click() },
                              { label: tr.takePhoto, sub: tr.useCamera, icon: Camera, action: () => { setShowAttachMenu(false); setShowCamera(true); } },
                            ].map(({ label, sub, icon: Icon, action }) => (
                              <button key={label} type="button" onClick={action}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors hover:bg-white/5"
                                style={{ color: "rgba(255,255,255,0.75)" }}>
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                                  <Icon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                                </div>
                                <div className="text-left">
                                  <p className="font-semibold leading-tight">{label}</p>
                                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Model picker dropdown */}
                      <div className="relative" ref={modelPickerRef}>
                        <button type="button"
                          onClick={() => setShowModelPicker(v => !v)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={{ background: "rgba(255,255,255,0.07)", color: model.activeStyle.color, border: `1px solid ${model.activeStyle.border.replace("1px solid ", "")}` }}>
                          <ModelIcon className="w-3.5 h-3.5" />
                          <span>{model.name}</span>
                          <ChevronDown className="w-3 h-3 opacity-60" />
                        </button>
                        {showModelPicker && (
                          <div className="absolute bottom-full right-0 mb-2 rounded-xl shadow-2xl overflow-hidden z-40 w-56"
                            style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <div className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: "rgba(255,255,255,0.28)" }}>AI Models</div>
                            {MODELS.map((m) => {
                              const MI = m.icon;
                              const isActive = m.id === activeModel;
                              return (
                                <button key={m.id} type="button"
                                  onClick={() => { setShowModelPicker(false); handleModelSelect(m); }}
                                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-all hover:bg-white/5"
                                  style={{ background: isActive ? "rgba(255,255,255,0.06)" : "transparent" }}>
                                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: isActive ? m.activeStyle.background : "rgba(255,255,255,0.05)", border: isActive ? m.activeStyle.border : "1px solid rgba(255,255,255,0.07)" }}>
                                    {m.pro && !isActive
                                      ? <Lock className="w-3.5 h-3.5" style={{ color: "rgba(167,139,250,0.7)" }} />
                                      : <MI className="w-3.5 h-3.5" style={{ color: isActive ? m.activeStyle.color : "rgba(255,255,255,0.4)" }} />}
                                  </div>
                                  <div className="flex-1 text-left">
                                    <div className="text-xs font-semibold flex items-center gap-1.5"
                                      style={{ color: isActive ? m.activeStyle.color : "rgba(255,255,255,0.75)" }}>
                                      {m.name}
                                      <span className="font-normal opacity-50 text-[10px]">{m.version}</span>
                                      {m.pro && (
                                        <span className="text-[8px] font-bold px-1 py-0.5 rounded-full ml-auto"
                                          style={{ background: "rgba(109,40,217,0.4)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.3)" }}>PRO</span>
                                      )}
                                    </div>
                                    <div className="text-[10px] opacity-40">{m.description.split(" · ")[0]}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {voiceSupported && (
                        <button type="button"
                          onClick={toggleVoiceInput}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                          title={isListening ? "Stop voice input" : "Voice input (en-IN)"}
                          style={{ background: isListening ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.07)", color: isListening ? "#F87171" : "rgba(255,255,255,0.5)", border: isListening ? "1px solid rgba(248,113,113,0.45)" : "1px solid transparent", animation: isListening ? "cadus-spot-breathe 1.2s ease-in-out infinite" : "none" }}>
                          {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      <button type="submit"
                        disabled={(!input.trim() && attachments.length === 0) || chatMutation.isPending || isGeneratingImage || isGeneratingPresentation || isAnalyzingImage || presentationStage === "waiting-slide-count" || imageStage === "waiting-type"}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                        style={{ background: "rgba(255,255,255,0.9)" }}>
                        {isAnalyzingImage ? <Loader2 className="w-3.5 h-3.5 text-black animate-spin" /> : <Send className="w-3.5 h-3.5 text-black" />}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* ── Specialty Filter ── */}
            {!isProLocked && (
              <div className="w-full max-w-2xl flex items-center justify-center gap-2 mb-3">
                <div className="relative" ref={specialtyPickerRef}>
                  <button onClick={() => setShowSpecialtyPicker(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {specialty}
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>
                  {showSpecialtyPicker && (
                    <div className="absolute top-full left-0 mt-1 z-30 rounded-xl shadow-2xl overflow-hidden w-44"
                      style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {["General","Cardiology","Neurology","Paediatrics","Obstetrics","Oncology","Emergency","Surgery","Psychiatry","Nephrology","Pulmonology","Gastroenterology"].map((sp) => (
                        <button key={sp} type="button"
                          onClick={() => { setSpecialty(sp); setShowSpecialtyPicker(false); }}
                          className="flex items-center w-full px-3 py-2 text-xs transition-all hover:bg-white/5 text-left"
                          style={{ color: specialty === sp ? "rgba(100,180,255,1)" : "rgba(255,255,255,0.65)", background: specialty === sp ? "rgba(100,180,255,0.08)" : "transparent" }}>
                          {sp}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>Filter by specialty</span>
              </div>
            )}

            {/* ── Mode pills row ── */}
            {!isProLocked && (() => {
              const categories: { icon: React.ElementType; label: string; mode: ChatMode; color?: string; pro?: boolean }[] = [
                { icon: Stethoscope,   label: "Diagnose",       mode: "normal",               color: "#60A5FA" },
                { icon: Brain,         label: "DDx Generator",  mode: "ddx",                  color: "#A78BFA" },
                { icon: Search,        label: "Research",       mode: "deep-research",        color: "#34D399" },
                { icon: ImagePlus,     label: "Image",          mode: "create-image",         color: "#F472B6" },
                { icon: Presentation,  label: "Slides",         mode: "create-presentation",  color: "#FBBF24" },
                { icon: Pill,          label: "Drug Inter.",    mode: "drug-interactions",    color: "#F87171" },
                { icon: Calculator,    label: "Dosage Calc",    mode: "dosage-calc",          color: "#FB923C" },
                { icon: TestTube2,     label: "Lab Values",     mode: "lab-values",           color: "#4ADE80" },
                { icon: ClipboardList, label: "SOAP Note",      mode: "soap-note",            color: "#38BDF8" },
                { icon: HelpCircle,    label: "MCQ / Exam",     mode: "mcq-gen",              color: "#C084FC" },
                { icon: Languages,     label: "Patient Edu",    mode: "patient-edu",          color: "#FB7185" },
                { icon: Zap,           label: "Procedure",      mode: "procedure-guide",      color: "#FDE047" },
                { icon: Microscope,    label: "Scan Analysis",  mode: "image-analysis",       color: "#2DD4BF", pro: true },
              ];
              const maxStart = Math.max(0, categories.length - 4);
              const visible = categories.slice(categoryIndex, categoryIndex + 4);
              return (
                <div className="w-full max-w-2xl flex items-center gap-2 mb-5 justify-center">
                  <button onClick={() => setCategoryIndex(i => Math.max(0, i - 1))}
                    disabled={categoryIndex === 0}
                    className="p-1.5 rounded-lg transition-all disabled:opacity-20"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {visible.map(({ icon: Icon, label, mode, color, pro: isPro }) => {
                    const isActive = chatMode === mode;
                    return (
                      <button key={label}
                        onClick={() => { if (isPro) { setShowProModal(true); return; } toggleMode(mode); }}
                        className="relative flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-medium transition-all hover:bg-white/8 min-w-[72px]"
                        style={{
                          background: isActive ? `${color}18` : "rgba(255,255,255,0.04)",
                          border: isActive ? `1px solid ${color}40` : "1px solid rgba(255,255,255,0.07)",
                          color: isActive ? color : "rgba(255,255,255,0.55)",
                        }}>
                        {isPro && <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold px-1 py-0.5 rounded-full" style={{ background: "rgba(109,40,217,0.85)", color: "#c4b5fd" }}>PRO</span>}
                        <Icon className="w-5 h-5" style={{ color: isActive ? color : undefined }} />
                        {label}
                      </button>
                    );
                  })}
                  <button onClick={() => setCategoryIndex(i => Math.min(maxStart, i + 1))}
                    disabled={categoryIndex >= maxStart}
                    className="p-1.5 rounded-lg transition-all disabled:opacity-20"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })()}

            {/* Pinned prompts */}
            {!isProLocked && pinnedPrompts.length > 0 && (
              <div className="w-full max-w-2xl mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5" style={{ color: "rgba(251,191,36,0.7)" }} />
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Pinned Prompts</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pinnedPrompts.map((q) => (
                    <div key={q} className="flex items-center gap-1">
                      <button type="button" onClick={() => setInput(q)}
                        className="text-xs px-3 py-1.5 rounded-full transition-all hover:bg-white/8"
                        style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "rgba(253,211,77,0.85)" }}>
                        {q}
                      </button>
                      <button type="button" onClick={() => handleTogglePin(q)}
                        className="p-0.5 rounded hover:bg-white/5"
                        style={{ color: "rgba(251,191,36,0.5)" }} title="Unpin">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Try an example prompt */}
            {!isProLocked && (
              <>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>Try an example prompt</span>
                  <button className="p-1 rounded transition-all hover:bg-white/5" style={{ color: "rgba(255,255,255,0.38)" }}>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {quickSuggestions[activeModel].map((q) => (
                    <div key={q} className="flex items-center group relative">
                      <button type="button" onClick={() => setInput(q)}
                        className="text-sm px-4 py-2 rounded-full transition-all hover:bg-white/8 pr-8"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.55)" }}>
                        {q}
                      </button>
                      <button type="button" onClick={() => handleTogglePin(q)}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        title={pinnedPrompts.includes(q) ? "Unpin" : "Pin prompt"}
                        style={{ color: pinnedPrompts.includes(q) ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.4)" }}>
                        <Tag className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Pro locked message */}
            {isProLocked && (
              <div className="max-w-md text-center px-4 mb-8">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Crown className="w-6 h-6" style={{ color: "rgba(255,255,255,0.6)" }} />
                </div>
                <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{modelGreetings.nova46}</p>
                <button onClick={() => setShowProModal(true)}
                  className="mt-4 flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl font-bold text-sm"
                  style={{ background: "rgba(255,255,255,0.9)", color: "#111" }}>
                  <Crown className="w-4 h-4" /> {tr.upgradePro}
                </button>
              </div>
            )}

            {/* Your recent chats */}
            {sessions.some(s => s.messages.length > 0) && (
              <div className="w-full max-w-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>Your recent chats</span>
                  <button onClick={() => setSidebarView("chats")}
                    className="text-sm flex items-center gap-1 transition-all hover:opacity-80"
                    style={{ color: "rgba(255,255,255,0.4)" }}>
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {sessions.filter(s => s.messages.length > 0).slice(0, 4).map((sess) => {
                    const sm = MODELS.find((m) => m.id === sess.modelId)!;
                    const SMIcon = sm?.icon ?? Activity;
                    return (
                      <div key={sess.id}
                        role="button" tabIndex={0}
                        onClick={() => setActiveSessionId(sess.id)}
                        onKeyDown={(e) => e.key === "Enter" && setActiveSessionId(sess.id)}
                        className="p-4 rounded-xl cursor-pointer transition-all hover:bg-white/6"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: "rgba(255,255,255,0.06)" }}>
                            <SMIcon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.5)" }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate" style={{ color: "rgba(255,255,255,0.75)" }}>{sess.title}</p>
                            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{sm?.name} {sm?.version}</p>
                          </div>
                        </div>
                        {sess.messages[0] && (
                          <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                            {sess.messages[0].content.slice(0, 60)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CHAT VIEW (has messages) ── */}
        {hasMessages && (
          <>
            {/* Chat topbar */}
            <div className="shrink-0 flex items-center gap-2 px-3 py-2"
              style={{ background: "var(--sp-topbar-bg)", borderBottom: "1px solid var(--sp-topbar-border)" }}>
              <button onClick={() => setSidebarOpen((v) => !v)}
                className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: "rgba(255,255,255,0.4)" }}>
                <PanelLeft className="w-5 h-5" />
              </button>
              <div className="w-px h-4 mx-0.5" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="flex items-center gap-1.5 flex-1">
                <ModelIcon className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} />
                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {model.name} {model.version}
                </span>
              </div>
              <button onClick={handleNewChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/5"
                style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <Plus className="w-3 h-3" />
                New chat
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5 min-h-full">

                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex gap-3",
                      msg.role === ChatMessageRole.user
                        ? "self-end flex-row-reverse max-w-[85%]"
                        : "self-start max-w-[92%] w-full"
                    )}
                    style={{ animation: "tw-bubble-in 0.28s ease-out both", animationDelay: `${isMsgNew(idx) ? 0 : 0}ms` }}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                      msg.role === ChatMessageRole.user
                        ? "overflow-hidden"
                        : "overflow-hidden"
                    )}
                      style={msg.role === ChatMessageRole.user
                        ? { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }
                        : undefined}
                    >
                      {msg.role === ChatMessageRole.user
                        ? <User className="w-4 h-4" style={{ color: "rgba(255,255,255,0.75)" }} />
                        : <CadusLogo size="sm" thinking={false} baseUrl={import.meta.env.BASE_URL} />
                      }
                    </div>

                    {/* Bubble */}
                    <div
                      className={cn("rounded-2xl shadow-sm overflow-hidden",
                        msg.role === ChatMessageRole.user ? "rounded-tr-sm" : "rounded-tl-sm"
                      )}
                      style={msg.role === ChatMessageRole.user
                        ? { background: "var(--sp-user-bubble-bg)", border: "1px solid var(--sp-user-bubble-border)", color: "var(--sp-user-text)", backdropFilter: "blur(12px)" }
                        : { background: "var(--sp-ai-bubble-bg)", border: "1px solid var(--sp-ai-bubble-border)", color: "var(--sp-ai-text)", backdropFilter: "blur(12px)" }
                      }
                    >
                      {!(msg as ExtendedMessage).isDeepResearch && !(msg as ExtendedMessage).isPresentation && !(msg as ExtendedMessage).slideCountOptions && !(msg as ExtendedMessage).imageUrl && msg.content && (
                        <div>
                          <div className="px-5 py-4 text-[14px] leading-relaxed">
                            <TypewriterText
                              text={msg.content}
                              isNew={isMsgNew(idx)}
                              onDone={() => markMsgSeen(idx)}
                              onScroll={scrollToBottom}
                            />
                          </div>
                          {msg.role === ChatMessageRole.assistant && (
                            <div className="flex items-center gap-2 px-4 pb-3">
                              <button type="button"
                                onClick={() => navigator.clipboard.writeText(msg.content)}
                                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-all hover:bg-white/8"
                                style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <RefreshCw className="w-3 h-3" /> Copy
                              </button>
                              <button type="button"
                                onClick={() => handleDownloadPdf(msg.content, String(idx))}
                                disabled={isExportingPdf === String(idx)}
                                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-all hover:bg-white/8"
                                style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                {isExportingPdf === String(idx) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                {isExportingPdf === String(idx) ? "Generating..." : "Export PDF"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {(msg as ExtendedMessage).isDeepResearch && (msg as ExtendedMessage).researchReport && (
                        <div>
                          <ResearchReportCard
                            report={(msg as ExtendedMessage).researchReport!}
                            sources={(msg as ExtendedMessage).researchSources ?? []}
                            queries={(msg as ExtendedMessage).researchQueries ?? []}
                            hasGoogleSearch={(msg as ExtendedMessage).hasGoogleSearch ?? false}
                          />
                          <div className="flex items-center gap-2 px-4 py-3">
                            <button type="button"
                              onClick={() => navigator.clipboard.writeText((msg as ExtendedMessage).researchReport!)}
                              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-all hover:bg-white/8"
                              style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
                              <RefreshCw className="w-3 h-3" /> Copy Report
                            </button>
                            <button type="button"
                              onClick={() => handleDownloadPdf((msg as ExtendedMessage).researchReport!, String(idx))}
                              disabled={isExportingPdf === String(idx)}
                              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-all hover:bg-white/8"
                              style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
                              {isExportingPdf === String(idx) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                              {isExportingPdf === String(idx) ? "Generating..." : "Export PDF"}
                            </button>
                          </div>
                        </div>
                      )}
                      {(msg as ExtendedMessage).imageUrl && (
                        <div className="px-4 pb-4 pt-2">
                          {msg.content && <div className="px-1 pb-3 text-[14px]">{msg.content}</div>}
                          <ImageMessageCard
                            imageUrl={(msg as ExtendedMessage).imageUrl!}
                            prompt={pendingImagePrompt || "anatomical illustration"}
                            onZoom={setZoomedImageUrl}
                            downloadLabel={tr.downloadImage}
                          />
                        </div>
                      )}
                      {(msg as ExtendedMessage).isImageTypeSelection && (
                        <div className="px-4 pb-4 pt-2">
                          {msg.content && <div className="px-1 pb-3 text-[14px]">{msg.content}</div>}
                          <div className="flex flex-wrap gap-2.5">
                            {/* Simple Image */}
                            <button type="button" onClick={() => handleImageTypeSelect("simple")}
                              disabled={isGeneratingImage}
                              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:scale-[1.03]"
                              style={{ background: "rgba(0,180,220,0.18)", border: "1px solid rgba(0,229,255,0.4)", color: "#00e5ff" }}>
                              <ImagePlus className="w-4 h-4" /> {tr.simpleImage}
                            </button>
                            {/* Diagram */}
                            <button type="button" onClick={() => handleImageTypeSelect("diagram")}
                              disabled={isGeneratingImage}
                              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:scale-[1.03]"
                              style={{ background: "rgba(130,0,220,0.18)", border: "1px solid rgba(168,85,247,0.5)", color: "#c084fc" }}>
                              <Tag className="w-4 h-4" /> {tr.diagram ?? "Diagram"}
                            </button>
                            {/* Real Image */}
                            <button type="button" onClick={() => handleImageTypeSelect("real")}
                              disabled={isGeneratingImage}
                              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:scale-[1.03]"
                              style={{ background: "rgba(20,160,80,0.18)", border: "1px solid rgba(52,211,153,0.45)", color: "#34d399" }}>
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"/><path d="M6.3 6.3A8 8 0 1 0 17.7 17.7"/><path d="M6 2v4h4"/><path d="M18 22v-4h-4"/>
                              </svg>
                              {tr.realImage ?? "Real Image"}
                            </button>
                            {/* Real Image + Labels */}
                            <button type="button" onClick={() => handleImageTypeSelect("real-labeled")}
                              disabled={isGeneratingImage}
                              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 hover:scale-[1.03]"
                              style={{ background: "rgba(220,120,0,0.18)", border: "1px solid rgba(251,146,60,0.45)", color: "#fb923c" }}>
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h4M7 11h2"/>
                              </svg>
                              {tr.realImageLabeled ?? "Real Image + Labels"}
                            </button>
                          </div>
                        </div>
                      )}
                      {(msg as ExtendedMessage).isResearchTypeSelection && (
                        <div className="px-4 pb-4 pt-2">
                          {msg.content && <div className="px-1 pb-3 text-[14px]">{msg.content}</div>}
                          <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => handleResearchTypeSelect("quick")}
                              disabled={isGeneratingResearch}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                              style={{ background: "rgba(0,180,100,0.18)", border: "1px solid rgba(52,211,153,0.45)", color: "#34D399" }}>
                              <Search className="w-4 h-4" /> {tr.quickSummary ?? "Quick Summary"}
                            </button>
                            <button type="button" onClick={() => handleResearchTypeSelect("full")}
                              disabled={isGeneratingResearch}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                              style={{ background: "rgba(130,0,220,0.18)", border: "1px solid rgba(168,85,247,0.5)", color: "#c084fc" }}>
                              <Microscope className="w-4 h-4" /> {tr.fullDeepResearch ?? "Full Deep Research"}
                            </button>
                          </div>
                        </div>
                      )}
                      {(msg as ExtendedMessage).slideCountOptions && (
                        <div className="px-4 pb-4 pt-2">
                          {msg.content && <div className="px-1 pb-3 text-[14px]">{msg.content}</div>}
                          <div className="flex flex-wrap gap-2">
                            {(msg as ExtendedMessage).slideCountOptions!.map((n) => (
                              <button key={n} type="button" onClick={() => handleSlideCountSelect(n)}
                                disabled={isGeneratingPresentation}
                                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                                style={{ background: "rgba(180,120,0,0.25)", border: "1px solid rgba(251,191,36,0.4)", color: "#fcd34d" }}>
                                {n} {tr.slides}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {(msg as ExtendedMessage).isPresentation && (
                        <div className="px-4 pb-4 pt-2">
                          {msg.content && <div className="px-1 pb-3 text-[14px]">{msg.content}</div>}
                          <div className="flex flex-wrap gap-2">
                            {(msg as ExtendedMessage).presentationData && (
                              <button type="button"
                                onClick={() => setActivePresentationData((msg as ExtendedMessage).presentationData as any)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                style={{ background: "rgba(16,185,129,0.25)", border: "1px solid rgba(52,211,153,0.4)", color: "#34d399" }}>
                                <PlayCircle className="w-4 h-4" /> {tr.openPresentation}
                              </button>
                            )}
                            {(msg as ExtendedMessage).presentationPdfBase64 && (
                              <a href={`data:application/pdf;base64,${(msg as ExtendedMessage).presentationPdfBase64}`}
                                download={`${(msg as ExtendedMessage).presentationTitle ?? "presentation"}.pdf`}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                style={{ background: "rgba(220,38,38,0.2)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
                                <Download className="w-4 h-4" /> PDF
                              </a>
                            )}
                            {(msg as ExtendedMessage).presentationDocxBase64 && (
                              <a href={`data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${(msg as ExtendedMessage).presentationDocxBase64}`}
                                download={`${(msg as ExtendedMessage).presentationTitle ?? "presentation"}.pptx`}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa" }}>
                                <Download className="w-4 h-4" /> PPTX
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Image generating animation */}
                {isGeneratingImage && (
                  <div className="flex gap-3 self-start max-w-[92%]">
                    <div className="w-8 h-8 shrink-0 mt-1">
                      <CadusLogo size="sm" thinking baseUrl={import.meta.env.BASE_URL} />
                    </div>
                    <ImageGeneratingAnimation prompt={pendingImagePrompt} />
                  </div>
                )}

                {/* Typing indicator */}
                {(chatMutation.isPending || isGeneratingResearch) && (
                  <div className="flex gap-3 self-start max-w-[92%]" style={{ animation: "tw-bubble-in 0.22s ease-out both" }}>
                    <div className="shrink-0 mt-0.5" style={{ width: 38, height: 38 }}>
                      <CadusLogo size="sm" thinking baseUrl={import.meta.env.BASE_URL} />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-3"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(0,194,168,0.18)",
                        boxShadow: "0 0 18px rgba(0,194,168,0.06), 0 0 32px rgba(168,85,247,0.04)",
                      }}>
                      {isGeneratingResearch ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" style={{ color: "rgba(0,194,168,0.7)" }} />
                          <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{tr.researching}</span>
                        </>
                      ) : (
                        <>
                          {[0, 1, 2].map(i => (
                            <span
                              key={i}
                              className="rounded-full"
                              style={{
                                width: 7, height: 7,
                                background: i === 0
                                  ? "rgba(0,194,168,0.85)"
                                  : i === 1 ? "rgba(100,160,240,0.75)" : "rgba(168,85,247,0.7)",
                                animation: "tw-dot-bounce 1.2s ease-in-out infinite",
                                animationDelay: `${i * 0.18}s`,
                                boxShadow: i === 0
                                  ? "0 0 6px rgba(0,194,168,0.5)"
                                  : i === 2 ? "0 0 6px rgba(168,85,247,0.4)" : undefined,
                              }}
                            />
                          ))}
                          <ThinkingTextRotator chatMode={chatMode} />
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Presentation building */}
                {isGeneratingPresentation && (
                  <div className="flex gap-3 self-start max-w-[95%] w-full">
                    <div className="w-8 h-8 shrink-0 mt-1">
                      <CadusLogo size="sm" thinking baseUrl={import.meta.env.BASE_URL} />
                    </div>
                    <div className="flex-1 min-w-0 rounded-2xl rounded-tl-sm overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="px-4 pt-3 pb-2 text-xs font-medium flex items-center gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "rgba(255,255,255,0.4)" }} />
                        {tr.buildingPresentation.replace("{n}", String(buildingSlideCount))}
                      </div>
                      <PresentationBuildingAnimation topic={buildingTopic} slideCount={buildingSlideCount} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ── Bottom input (chat view) ── */}
            <div className="shrink-0 px-4 pb-4 pt-2">
              <div className="max-w-3xl mx-auto">
                {isProLocked ? (
                  <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <Lock className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{tr.proRequired}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{tr.proGatedMsg}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowProModal(true)}
                      className="flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap"
                      style={{ background: "rgba(255,255,255,0.9)", color: "#111" }}>
                      <Crown className="w-4 h-4" /> {tr.upgradePro}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="rounded-2xl overflow-visible"
                    style={{ background: "var(--sp-input-bg)", border: "1px solid var(--sp-input-border)", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
                  >
                    {chatMode !== "normal" && (
                      <div className="flex items-center gap-2 px-4 py-2 border-b text-xs font-semibold"
                        style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.03)" }}>
                        {chatMode === "deep-research" ? <><Microscope className="w-3.5 h-3.5" /> {tr.deepResearchMode}</>
                          : chatMode === "create-presentation" ? <><Presentation className="w-3.5 h-3.5" /> {presentationStage === "idle" ? tr.presentationMode : tr.selectSlideCountAbove}</>
                          : <><ImagePlus className="w-3.5 h-3.5" /> {imageStage === "waiting-type" ? tr.selectSlideCountAbove : tr.imageMode}</>}
                        <button type="button" onClick={() => toggleMode(chatMode)} className="ml-auto hover:opacity-70">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {attachments.length > 0 && (
                      <div className="flex gap-2 px-4 pt-3 flex-wrap">
                        {attachments.map((a) => (
                          <div key={a.id} className="relative group flex items-center gap-2 rounded-xl px-3 py-2 text-xs max-w-[160px]"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}>
                            {a.type === "image" && a.previewUrl
                              ? <img src={a.previewUrl} alt={a.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                              : <FileText className="w-5 h-5 shrink-0" style={{ color: "rgba(255,255,255,0.5)" }} />}
                            <div className="min-w-0">
                              <p className="truncate font-medium leading-tight">{a.name}</p>
                              <p style={{ color: "rgba(255,255,255,0.3)" }}>{a.size}</p>
                            </div>
                            <button type="button" onClick={() => removeAttachment(a.id)}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full items-center justify-center hidden group-hover:flex"
                              style={{ background: "rgba(200,50,50,0.8)", color: "white" }}>
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
                      placeholder={
                        chatMode === "create-image" ? tr.describeImagePlaceholder
                          : chatMode === "deep-research" ? tr.researchTopicPlaceholder
                          : chatMode === "create-presentation" && presentationStage === "idle" ? tr.presentationTopicPlaceholder
                          : chatMode === "create-presentation" && presentationStage === "waiting-slide-count" ? tr.selectSlidesPlaceholder
                          : `${tr.messagePlaceholder} · ${model.name} ${model.version}...`
                      }
                      rows={1}
                      className="w-full px-5 pt-4 pb-2 text-base bg-transparent focus:outline-none resize-none cadus-textarea"
                      style={{ color: "var(--sp-textarea-color)", caretColor: "var(--sp-caret-color)", minHeight: "52px", maxHeight: "160px" }}
                      disabled={chatMutation.isPending || isGeneratingPresentation || presentationStage === "waiting-slide-count"}
                    />
                    <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">
                      <div className="flex items-center gap-1">
                        <div className="relative" ref={attachMenuRef}>
                          <button type="button" onClick={() => setShowAttachMenu((v) => !v)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={{ color: showAttachMenu ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}>
                            <Paperclip className="w-4 h-4" />
                            <span className="hidden sm:inline">{tr.attach}</span>
                          </button>
                          {showAttachMenu && (
                            <div className="absolute bottom-full left-0 mb-2 rounded-xl shadow-xl overflow-hidden w-52 z-30"
                              style={{ background: "#1E1E1E", border: "1px solid rgba(255,255,255,0.1)" }}>
                              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.28)" }}>{tr.attach}</div>
                              {[
                                { label: tr.uploadImage, sub: tr.uploadImageFormats, icon: Image, action: () => imageInputRef.current?.click() },
                                { label: tr.uploadDocument, sub: tr.uploadDocumentFormats, icon: FileText, action: () => fileInputRef.current?.click() },
                                { label: tr.takePhoto, sub: tr.useCamera, icon: Camera, action: () => { setShowAttachMenu(false); setShowCamera(true); } },
                              ].map(({ label, sub, icon: Icon, action }) => (
                                <button key={label} type="button" onClick={action}
                                  className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors hover:bg-white/5"
                                  style={{ color: "rgba(255,255,255,0.75)" }}>
                                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <Icon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-semibold leading-tight">{label}</p>
                                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <button type="button" onClick={() => toggleMode("deep-research")}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={chatMode === "deep-research"
                            ? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" }
                            : { color: "rgba(255,255,255,0.4)" }}>
                          <Search className="w-4 h-4" />
                          <span className="hidden sm:inline">{tr.deepResearch}</span>
                        </button>
                        <button type="button" onClick={() => toggleMode("create-image")}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={chatMode === "create-image"
                            ? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" }
                            : { color: "rgba(255,255,255,0.4)" }}>
                          <ImagePlus className="w-4 h-4" />
                          <span className="hidden sm:inline">{tr.createImage}</span>
                        </button>
                        <button type="button" onClick={() => toggleMode("create-presentation")}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={chatMode === "create-presentation"
                            ? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" }
                            : { color: "rgba(255,255,255,0.4)" }}>
                          <Presentation className="w-4 h-4" />
                          <span className="hidden sm:inline">{tr.presentation}</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {model.name}
                        </span>
                        <button type="submit"
                          disabled={(!input.trim() && attachments.length === 0) || chatMutation.isPending || isGeneratingImage || isGeneratingPresentation || presentationStage === "waiting-slide-count" || imageStage === "waiting-type"}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                          style={{ background: "rgba(255,255,255,0.9)" }}>
                          <Send className="w-3.5 h-3.5 text-black" />
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                <p className="text-center text-[11px] mt-2" style={{ color: "rgba(255,255,255,0.18)" }}>
                  {tr.disclaimer}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Pricing Modal ── */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          onClick={() => setShowProModal(false)}>
          <div className="rounded-2xl shadow-2xl w-full overflow-hidden"
            style={{ maxWidth: 860, background: "rgba(8,10,28,0.98)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(32px)" }}
            onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="relative px-8 pt-7 pb-5 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={() => setShowProModal(false)}
                className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-white/6"
                style={{ color: "rgba(255,255,255,0.28)" }}>
                <X className="w-4 h-4" />
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-3"
                style={{ background: "rgba(139,92,246,0.14)", border: "1px solid rgba(139,92,246,0.22)", color: "#a78bfa" }}>
                <Crown className="w-3 h-3" /> Cadus AI Plans
              </div>
              <h2 className="text-[22px] font-bold mb-1" style={{ color: "rgba(225,235,255,0.95)" }}>Choose your plan</h2>
              <p className="text-sm" style={{ color: "rgba(140,160,210,0.6)" }}>Elevate your clinical practice with the right tier</p>
              {/* Billing toggle */}
              <div className="inline-flex items-center gap-1 mt-4 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <button onClick={() => setBillingPeriod("monthly")}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={billingPeriod === "monthly"
                    ? { background: "rgba(255,255,255,0.1)", color: "rgba(220,235,255,0.9)" }
                    : { color: "rgba(140,160,210,0.5)" }}>
                  Monthly
                </button>
                <button onClick={() => setBillingPeriod("yearly")}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={billingPeriod === "yearly"
                    ? { background: "rgba(255,255,255,0.1)", color: "rgba(220,235,255,0.9)" }
                    : { color: "rgba(140,160,210,0.5)" }}>
                  Yearly
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(16,185,129,0.2)", color: "#34d399" }}>Save 44%</span>
                </button>
              </div>
            </div>

            {/* Plan cards */}
            <div className="grid grid-cols-3 divide-x" style={{ divideColor: "rgba(255,255,255,0.06)" }}>

              {/* ── Cadus Minor (Free) ── */}
              {([
                {
                  name: "Cadus Minor", badge: null, badgeBg: "", badgeColor: "",
                  price: "Free", priceNote: "Forever free",
                  highlight: false,
                  desc: "For individuals getting started with medical AI.",
                  features: [
                    "20 queries per day",
                    "Basic diagnosis support",
                    "General medical Q&A",
                    "Standard response speed",
                    "Community access",
                  ],
                  cta: "Your current plan", ctaDisabled: true,
                  ctaBg: "rgba(255,255,255,0.06)", ctaColor: "rgba(180,200,240,0.5)", ctaBorder: "1px solid rgba(255,255,255,0.08)",
                },
                {
                  name: "Cadus Medius", badge: "Standard", badgeBg: "rgba(59,130,246,0.18)", badgeColor: "#93c5fd",
                  price: "Free", priceNote: "Always free",
                  highlight: false,
                  desc: "For students and everyday clinical practice.",
                  features: [
                    "50 queries per day",
                    "DDx Generator",
                    "Research summaries",
                    "Study Hub access",
                    "Faster response speed",
                  ],
                  cta: "Get started free", ctaDisabled: false,
                  ctaBg: "rgba(59,130,246,0.18)", ctaColor: "#93c5fd", ctaBorder: "1px solid rgba(59,130,246,0.3)",
                },
                {
                  name: "Cadus Magnus", badge: "Most Popular", badgeBg: "linear-gradient(90deg,#7c3aed,#9333ea)", badgeColor: "white",
                  price: billingPeriod === "monthly" ? "₹299" : "₹166",
                  priceNote: billingPeriod === "monthly" ? "/month" : "/month · billed ₹1,999/yr",
                  highlight: true,
                  desc: "For advanced clinical work and complex cases.",
                  features: [
                    "200 queries per day (Pro) / Unlimited (Max)",
                    "Cadus Magnus advanced reasoning model",
                    "Complex DDx & rare disease analysis",
                    "Deep Research with web augmentation",
                    "Medical image analysis",
                    "Multispecialty second opinion",
                    "PDF export & presentations",
                    "Priority support",
                  ],
                  cta: "Upgrade to Magnus", ctaDisabled: false,
                  ctaBg: "linear-gradient(to right,#7c3aed,#9333ea)", ctaColor: "white", ctaBorder: "none",
                },
              ] as Array<{
                name: string; badge: string|null; badgeBg: string; badgeColor: string;
                price: string; priceNote: string; highlight: boolean; desc: string;
                features: string[]; cta: string; ctaDisabled: boolean;
                ctaBg: string; ctaColor: string; ctaBorder: string;
              }>).map((plan) => (
                <div key={plan.name} className="relative flex flex-col px-6 py-6"
                  style={plan.highlight ? { background: "rgba(109,40,217,0.08)" } : {}}>
                  {plan.badge && (
                    <div className="inline-flex self-start items-center px-2.5 py-1 rounded-full text-[10px] font-bold mb-3"
                      style={{ background: plan.badgeBg, color: plan.badgeColor }}>
                      {plan.badge}
                    </div>
                  )}
                  {!plan.badge && <div className="h-7 mb-3" />}
                  <h3 className="text-base font-bold mb-0.5" style={{ color: plan.highlight ? "#c4b5fd" : "rgba(210,225,255,0.9)" }}>{plan.name}</h3>
                  <p className="text-[11px] mb-4" style={{ color: "rgba(130,155,210,0.6)" }}>{plan.desc}</p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-3xl font-extrabold" style={{ color: plan.highlight ? "#c4b5fd" : "rgba(210,225,255,0.9)" }}>{plan.price}</span>
                    {plan.price !== "Free" && <span className="text-xs mb-1.5" style={{ color: "rgba(130,155,210,0.55)" }}>{plan.priceNote}</span>}
                  </div>
                  {plan.price === "Free" && <p className="text-xs mb-5" style={{ color: "rgba(130,155,210,0.5)" }}>{plan.priceNote}</p>}
                  {plan.price !== "Free" && <p className="text-[10px] mb-5" style={{ color: "rgba(130,155,210,0.45)" }}>{plan.priceNote}</p>}
                  <button disabled={plan.ctaDisabled}
                    className="w-full py-2.5 rounded-xl text-xs font-bold transition-all mb-5 disabled:cursor-not-allowed"
                    style={{ background: plan.ctaBg, color: plan.ctaColor, border: plan.ctaBorder }}>
                    {plan.cta}
                  </button>
                  <div className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: plan.highlight ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.07)" }}>
                          <span className="text-[9px] font-bold" style={{ color: plan.highlight ? "#a78bfa" : "rgba(120,150,210,0.7)" }}>✓</span>
                        </div>
                        <span className="text-[11px] leading-relaxed" style={{ color: plan.highlight ? "rgba(200,185,255,0.8)" : "rgba(130,155,210,0.65)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="px-8 py-3 text-center text-[11px]" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "rgba(100,120,170,0.5)" }}>
              All plans include HIPAA-aligned privacy. Cancel anytime. Prices in Indian Rupees (INR).
            </div>
          </div>
        </div>
      )}


      {/* ── In-Browser Presentation Viewer ── */}
      {activePresentationData && (
        <PresentationViewer
          data={activePresentationData}
          pdfBase64={activePresentationData.pdfBase64}
          docxBase64={activePresentationData.docxBase64}
          onClose={() => setActivePresentationData(null)}
          initialIdx={Number(new URLSearchParams(window.location.search).get("slide") ?? 0) || 0}
        />
      )}

      {/* ── Camera Modal ── */}
      {showCamera && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* ── Image Zoom Modal ── */}
      {zoomedImageUrl && (
        <div
          role="dialog"
          aria-label="Zoomed image"
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
            animation: "tw-fade-in 0.18s ease-out",
          }}
          onClick={() => setZoomedImageUrl(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setZoomedImageUrl(null)}
            style={{
              position: "absolute", top: 20, right: 20,
              width: 40, height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.8)",
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            ×
          </button>
          <img
            src={zoomedImageUrl}
            alt="Zoomed medical illustration"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "92vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 16,
              boxShadow: "0 8px 60px rgba(0,194,168,0.25), 0 0 0 1px rgba(0,188,212,0.15)",
              animation: "cadus-img-fade-in 0.22s ease-out",
              cursor: "default",
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ── Rotating thinking text component ─────────────────────────────────── */
const THINKING_MESSAGES: Record<string, string[]> = {
  "create-image": [
    "Generating clinical illustration…",
    "Rendering anatomical diagram…",
    "Composing medical visual…",
    "Applying textbook-style detail…",
    "Finalising medical artwork…",
  ],
  "deep-research": [
    "Searching medical literature…",
    "Analysing clinical data…",
    "Cross-referencing guidelines…",
    "Compiling research report…",
    "Verifying evidence base…",
  ],
  "create-presentation": [
    "Building slide structure…",
    "Composing medical content…",
    "Designing clinical slides…",
    "Formatting presentation…",
    "Assembling slide deck…",
  ],
  default: [
    "Analysing symptoms…",
    "Processing medical data…",
    "Reviewing clinical guidelines…",
    "Consulting medical knowledge…",
    "Preparing response…",
  ],
};

function ThinkingTextRotator({ chatMode }: { chatMode: ChatMode }) {
  const messages = THINKING_MESSAGES[chatMode] ?? THINKING_MESSAGES.default;
  const [idx, setIdx] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx(i => (i + 1) % messages.length);
      setKey(k => k + 1);
    }, 2800);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <span
      key={key}
      style={{
        fontSize: 11,
        color: "rgba(255,255,255,0.35)",
        letterSpacing: "0.04em",
        marginLeft: 4,
        display: "inline-block",
        animation: "cadus-think-text-fade 2.8s ease-in-out forwards",
        minWidth: 170,
      }}
    >
      {messages[idx]}
    </span>
  );
}

/* ── Image message card with skeleton + fade-in + zoom ─────────────────── */
function ImageMessageCard({
  imageUrl, prompt, onZoom, downloadLabel,
}: {
  imageUrl: string;
  prompt: string;
  onZoom: (url: string) => void;
  downloadLabel: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ maxWidth: 420 }}>
      {/* Medical Anatomy Reference badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        marginBottom: 8,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: "rgba(0,194,168,0.75)",
        textTransform: "uppercase",
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        Medical Anatomy Reference · Cadus AI
      </div>

      {/* Image wrapper */}
      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}>
        {/* Skeleton shown until image loads */}
        {!loaded && (
          <div style={{
            width: "100%",
            paddingBottom: "75%",
            background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(0,194,168,0.07) 50%, rgba(255,255,255,0.04) 100%)",
            backgroundSize: "800px 100%",
            animation: "cadus-skeleton-shimmer 1.5s linear infinite",
            borderRadius: 14,
          }} />
        )}

        {/* Actual image */}
        <img
          src={imageUrl}
          alt="Cadus AI medical illustration"
          onLoad={() => setLoaded(true)}
          style={{
            display: loaded ? "block" : "none",
            width: "100%",
            borderRadius: 14,
            objectFit: "contain",
            maxHeight: 480,
            border: "1px solid rgba(0,188,212,0.2)",
            animation: loaded ? "cadus-img-fade-in 0.35s ease-out" : undefined,
          }}
        />

        {/* Zoom button (top-right overlay) */}
        {loaded && (
          <button
            type="button"
            title="View full size"
            onClick={() => onZoom(imageUrl)}
            style={{
              position: "absolute", top: 10, right: 10,
              width: 32, height: 32,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(0,194,168,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "zoom-in",
              backdropFilter: "blur(6px)",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,194,168,0.25)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.55)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,194,168,0.9)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <path d="M11 8v6M8 11h6"/>
            </svg>
          </button>
        )}
      </div>

      {/* Caption / AI note */}
      {loaded && (
        <div style={{
          marginTop: 8,
          padding: "8px 10px",
          borderRadius: 8,
          background: "rgba(0,194,168,0.06)",
          border: "1px solid rgba(0,194,168,0.12)",
          fontSize: 11,
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.5,
        }}>
          <span style={{ color: "rgba(0,194,168,0.7)", fontWeight: 600 }}>Note: </span>
          This is an educational medical illustration. For any symptoms or clinical decisions, always consult a licensed doctor.
        </div>
      )}

      {/* Download link */}
      <a
        href={imageUrl}
        download="cadus-medical-illustration.png"
        target="_blank"
        rel="noreferrer"
        style={{
          marginTop: 8,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11,
          fontWeight: 600,
          color: "#00E5FF",
          textDecoration: "none",
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
      >
        <Download className="w-3 h-3" /> {downloadLabel}
      </a>
    </div>
  );
}

/* Deep-ocean particles config */
const OCEAN_PARTICLES = [
  { x: 12, y: 85, r: 2.2, delay: 0,    dur: 5.5, kind: 1 },
  { x: 28, y: 78, r: 1.5, delay: 0.8,  dur: 7.2, kind: 2 },
  { x: 42, y: 90, r: 3.0, delay: 1.6,  dur: 4.8, kind: 1 },
  { x: 58, y: 82, r: 1.8, delay: 0.4,  dur: 6.3, kind: 2 },
  { x: 70, y: 88, r: 2.5, delay: 2.1,  dur: 5.9, kind: 1 },
  { x: 84, y: 76, r: 1.4, delay: 1.2,  dur: 8.0, kind: 2 },
  { x: 20, y: 70, r: 2.0, delay: 3.0,  dur: 6.8, kind: 1 },
  { x: 50, y: 95, r: 1.6, delay: 0.2,  dur: 5.2, kind: 2 },
  { x: 65, y: 72, r: 2.8, delay: 1.9,  dur: 7.5, kind: 1 },
  { x: 88, y: 91, r: 1.3, delay: 2.5,  dur: 6.1, kind: 2 },
  { x: 35, y: 65, r: 1.9, delay: 0.7,  dur: 9.0, kind: 1 },
  { x: 75, y: 60, r: 2.3, delay: 3.5,  dur: 7.8, kind: 2 },
];

/* Sunlight rays config */
const OCEAN_RAYS = [
  { left: "8%",  width: 44, rot: -12, delay: 0,   dur: 6 },
  { left: "22%", width: 30, rot: -4,  delay: 1.2, dur: 8 },
  { left: "38%", width: 55, rot: 2,   delay: 0.5, dur: 7 },
  { left: "54%", width: 28, rot: 8,   delay: 2.1, dur: 9 },
  { left: "68%", width: 40, rot: -6,  delay: 0.9, dur: 6.5 },
  { left: "82%", width: 22, rot: 14,  delay: 1.7, dur: 7.5 },
];

function ImageGeneratingAnimation({ prompt }: { prompt: string }) {
  return (
    <div style={{ width: "320px" }}>
      {/* ── Ocean scene container ── */}
      <div style={{
        position: "relative",
        width: "100%",
        paddingBottom: "100%",
        borderRadius: "18px",
        overflow: "hidden",
        background: "linear-gradient(180deg, #020c1b 0%, #011528 30%, #010d1f 65%, #000a15 100%)",
      }}>

        {/* ── Sunlight rays from surface ── */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {OCEAN_RAYS.map((r, i) => (
            <div key={i} style={{
              position: "absolute",
              left: r.left,
              top: "-10%",
              width: r.width,
              height: "130%",
              background: "linear-gradient(180deg, rgba(100,200,255,0.22) 0%, rgba(50,150,220,0.08) 60%, transparent 100%)",
              transformOrigin: "top center",
              transform: `rotate(${r.rot}deg)`,
              animation: `${i % 2 === 0 ? "ocean-ray-sway" : "ocean-ray-sway2"} ${r.dur}s ease-in-out ${r.delay}s infinite`,
              filter: "blur(8px)",
            }} />
          ))}
        </div>

        {/* ── Subtle AI grid overlay ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(rgba(0,160,220,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,160,220,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
          pointerEvents: "none",
        }} />

        {/* ── Water caustics shimmer ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 120px 60px at 30% 20%, rgba(0,180,240,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 90px 45px  at 72% 15%, rgba(0,150,220,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 70px 35px  at 55% 35%, rgba(0,200,255,0.04) 0%, transparent 70%)
          `,
          animation: "ocean-depth-drift 5s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* ── Floating particles / plankton ── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {OCEAN_PARTICLES.map((p, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: "50%",
              background: p.kind === 1
                ? `radial-gradient(circle, rgba(0,220,255,0.95) 0%, rgba(0,160,220,0.4) 70%)`
                : `radial-gradient(circle, rgba(120,220,255,0.8) 0%, rgba(80,180,240,0.3) 70%)`,
              boxShadow: p.kind === 1
                ? `0 0 ${p.r * 3}px rgba(0,220,255,0.65)`
                : `0 0 ${p.r * 2.5}px rgba(100,200,255,0.5)`,
              animation: `${p.kind === 1 ? "ocean-bubble-rise" : "ocean-bubble-drift"} ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }} />
          ))}
        </div>

        {/* ── Depth vignette ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 40%, rgba(0,5,16,0.55) 100%)",
          pointerEvents: "none",
        }} />

        {/* ── Glassmorphism center card ── */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            width: "192px",
            padding: "22px 20px 20px",
            borderRadius: "18px",
            background: "rgba(2, 18, 38, 0.62)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(0, 180, 230, 0.18)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            animation: "ocean-card-glow 3s ease-in-out infinite",
          }}>

            {/* Circular progress loader */}
            <div style={{
              position: "relative",
              width: "68px",
              height: "68px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {/* Outer ring */}
              <div style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid rgba(0,180,230,0.12)",
                borderTop: "2.5px solid #00d4ff",
                borderRight: "2.5px solid rgba(0,200,255,0.4)",
                animation: "ocean-ring-rotate 1.4s linear infinite",
                boxShadow: "0 0 12px rgba(0,212,255,0.4)",
              }} />
              {/* Middle ring */}
              <div style={{
                position: "absolute",
                inset: "10px",
                borderRadius: "50%",
                border: "1.5px solid rgba(0,160,220,0.08)",
                borderBottom: "2px solid rgba(0,180,240,0.55)",
                borderLeft: "2px solid rgba(0,160,230,0.3)",
                animation: "ocean-ring-rotate 2.2s linear infinite reverse",
              }} />
              {/* Inner pulsing orb */}
              <div style={{
                position: "absolute",
                inset: "20px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,200,255,0.35) 0%, rgba(0,130,200,0.08) 100%)",
                animation: "ocean-ring-glow 2s ease-in-out infinite",
              }} />
              {/* Icon */}
              <div style={{ position: "relative", zIndex: 2, animation: "ocean-icon-pulse 2s ease-in-out infinite" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,210,255,0.85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2.5" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(0,210,255,0.5)" stroke="none" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
              <span style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "rgba(0,220,255,0.92)",
                animation: "ocean-text-breathe 2s ease-in-out infinite",
                textShadow: "0 0 10px rgba(0,200,255,0.4)",
              }}>
                GENERATING IMAGE
              </span>
              <span style={{
                fontSize: "9.5px",
                color: "rgba(140,210,255,0.5)",
                letterSpacing: "0.06em",
                animation: "ocean-text-breathe 2s ease-in-out 0.4s infinite",
              }}>
                Cadus AI  •  Processing…
              </span>

              {/* Progress dots */}
              <div style={{ display: "flex", gap: "5px", marginTop: "4px" }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: `rgba(0,${180 + i * 18},${220 + i * 10},0.9)`,
                    boxShadow: `0 0 6px rgba(0,200,255,0.6)`,
                    animation: `ocean-text-breathe 1s ease-in-out ${i * 0.22}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Surface highlight (top edge glow) ── */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "3px",
          background: "linear-gradient(90deg, transparent 0%, rgba(0,180,240,0.5) 40%, rgba(0,210,255,0.7) 50%, rgba(0,180,240,0.5) 60%, transparent 100%)",
          animation: "ocean-text-breathe 3s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* ── Bottom depth fade ── */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "70px",
          background: "linear-gradient(transparent, rgba(0,5,15,0.75))",
          pointerEvents: "none",
        }} />
      </div>

      {/* ── Prompt label below card ── */}
      <div style={{
        marginTop: "10px",
        fontSize: "10.5px",
        color: "rgba(0,190,230,0.4)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        letterSpacing: "0.03em",
        fontWeight: 500,
        paddingLeft: "2px",
      }}>
        {prompt.length > 55 ? prompt.substring(0, 55) + "…" : prompt}
      </div>
    </div>
  );
}

function PresentationBuildingAnimation({ topic, slideCount }: { topic: string; slideCount: number }) {
  const [lines, setLines] = useState<string[]>([]);
  const topicShort = topic.substring(0, 36);

  useEffect(() => {
    const phases = [
      `> analyzing topic: "${topicShort}"`,
      `> initializing ${slideCount}-slide structure...`,
      `{`,
      `  "title": "${topicShort}",`,
      `  "subtitle": "Comprehensive Medical Guide",`,
      `  "slides": [`,
      `    { "slideNumber": 1, "title": "Introduction",`,
      `      "bullets": ["Definition...", "Epidemiology...", "Etiology..."],`,
      `      "keyFact": "High-yield clinical statistic...", }`,
      `    { "slideNumber": 2, "title": "Anatomy & Physiology",`,
      `      "bullets": ["Gross anatomy...", "Histology...", "Blood supply..."], }`,
      `    { "slideNumber": 3, "title": "Pathophysiology",`,
      `      "bullets": ["Molecular mechanism...", "Cellular changes..."], }`,
      `    ... composing ${Math.max(slideCount - 3, 1)} more slides ...`,
      `  ]`,
      `}`,
      `> drawing ${slideCount} diagrams...`,
      `> rendering slide layouts...`,
      `> compiling PDF with pdf-lib...`,
      `> encoding DOCX document...`,
      `> finalizing download package...`,
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLines((prev) => { const next = [...prev, phases[i % phases.length]]; return next.slice(-16); });
      i++;
      if (i >= phases.length) i = Math.max(phases.length - 10, 6);
    }, 155);
    return () => clearInterval(interval);
  }, [topicShort, topic, slideCount]);

  return (
    <div className="font-mono text-xs overflow-hidden" style={{ background: "#0d1117", borderTop: "1px solid rgba(0,188,212,0.2)" }}>
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b" style={{ background: "#161b22", borderColor: "rgba(100,200,255,0.1)" }}>
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-1.5 text-[10px] text-slate-400 font-sans">cadus_presentation_builder.json</span>
      </div>
      <div className="px-4 py-3 space-y-0.5 min-h-[160px] max-h-[220px] overflow-hidden">
        {lines.map((line, i) => (
          <div key={i} className={cn("leading-[18px] whitespace-pre",
            line.startsWith(">") ? "text-emerald-400"
            : line.includes('"title"') || line.includes('"subtitle"') ? "text-amber-300"
            : line.includes('"bullets"') || line.includes('"mindMap"') ? "text-sky-300"
            : line.includes('"keyFact"') ? "text-violet-300"
            : line.startsWith("    ...") ? "text-slate-500 italic"
            : line === "{" || line === "}" || line === "  ]" ? "text-slate-400"
            : "text-slate-300")}>
            {line}{i === lines.length - 1 && <span className="animate-pulse text-emerald-400 ml-0.5">█</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
