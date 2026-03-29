import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, User, Loader2, Activity, FlaskConical,
  Lock, Crown, Paperclip, Image, FileText, Camera, Search,
  ImagePlus, X, Microscope, Download, Presentation, PlayCircle,
  Plus, PanelLeft, Settings, MessageSquare, Tag,
  ChevronDown, ChevronLeft, ChevronRight, RefreshCw,
  Home, BookOpen, Upload, Stethoscope,
} from "lucide-react";
import { useAiChat } from "@workspace/api-client-react";
import { type ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ringAnimImg from "@assets/photo_2026-03-29_15-00-52_1774776666332.jpg";
import neuralNetImg from "@assets/photo_2026-03-29_15-00-48_1774776666333.jpg";
import PresentationViewer, { type PresentationData } from "@/components/synapse/PresentationViewer";
import SynapseLogo from "@/components/synapse/SynapseLogo";
import DNABackground from "@/components/synapse/DNABackground";
import CameraModal from "@/components/synapse/CameraModal";
import SettingsModal, { loadSettings, saveSettings, DEFAULT_SETTINGS, type SynapseSettings } from "@/components/synapse/SettingsModal";
import { getTranslation } from "@/lib/translations";

/* ── Synapse theme CSS custom-property tokens ─────────────────────────── */
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
    "--sp-root-bg":                  "#111111",
    "--sp-sidebar-bg":               "#0C0C0C",
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
  researchReport?: string;
  researchSources?: ResearchSource[];
  researchQueries?: string[];
  hasGoogleSearch?: boolean;
}

type ModelId = "pulse45" | "flux36" | "nova46";
type ChatMode = "normal" | "deep-research" | "create-image" | "create-presentation";

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
    name: "Pulse",
    version: "4.5",
    description: "Vitals · Emergency · Critical Care",
    icon: Activity,
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    badgeBg: "bg-emerald-50 border-emerald-200",
    activeStyle: { background: "rgba(16,185,129,0.22)", color: "#34d399", border: "1px solid rgba(52,211,153,0.5)" },
  },
  {
    id: "flux36",
    name: "Flux",
    version: "3.6",
    description: "Pharmacology · Drug Interactions · Labs",
    icon: FlaskConical,
    color: "bg-orange-500",
    textColor: "text-orange-700",
    badgeBg: "bg-orange-50 border-orange-200",
    activeStyle: { background: "rgba(249,115,22,0.2)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.5)" },
  },
  {
    id: "nova46",
    name: "Nova",
    version: "4.6",
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
    "Hello! I'm SYNAPSE running Pulse 4.5 — your emergency medicine and vitals specialist. I can help with vital sign interpretation, ACLS protocols, ICU management, monitoring equipment, and critical care guidelines. Ready to assist!",
  flux36:
    "Hello! I'm SYNAPSE running Flux 3.6 — your pharmacology and laboratory medicine specialist. I can help with drug interactions, dosage calculations, antibiotic selection, lab value interpretation, and NEET-PG pharmacology prep. How can I help?",
  nova46:
    "SYNAPSE Nova 4.6 is available on Pro. Upgrade to unlock advanced diagnostics, rare disease identification, deep literature synthesis, and expert multispecialty reasoning.",
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
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0, 1]));
  const [showAllSources, setShowAllSources] = useState(false);

  const sections = report
    .split(/\n## /)
    .map((s) => s.replace(/^## /, ""))
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

  const visibleSources = showAllSources ? sources : sources.slice(0, 4);

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

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-t-2xl">
        <Microscope className="w-4 h-4 text-white shrink-0" />
        <span className="text-sm font-bold text-white">SYNAPSE Deep Research</span>
        {hasGoogleSearch && (
          <span className="ml-auto flex items-center gap-1 text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">
            <Search className="w-2.5 h-2.5" /> Google Search
          </span>
        )}
      </div>
      {queries.length > 0 && (
        <div className="px-4 py-2 border-x border-blue-900/60 flex flex-wrap gap-1.5"
          style={{ background: "rgba(30,58,138,0.3)" }}>
          {queries.map((q, i) => (
            <span key={i} className="text-[10px] border border-blue-700/50 text-blue-300 px-2 py-0.5 rounded-full truncate max-w-[200px]"
              style={{ background: "rgba(30,58,138,0.4)" }} title={q}>
              🔍 {q}
            </span>
          ))}
        </div>
      )}
      <div className="border-x border-b border-slate-700/50 rounded-b-2xl overflow-hidden divide-y divide-slate-700/30">
        {sections.map((sec, i) => (
          <div key={i} style={{ background: "rgba(5,15,40,0.7)" }}>
            <button type="button"
              className="w-full flex items-center gap-2 px-4 py-3 hover:bg-white/5 transition-colors text-left"
              onClick={() => toggleSection(i)}>
              <span className="text-base">{sectionIcons[sec.title] ?? "📌"}</span>
              <span className="text-[13px] font-semibold flex-1" style={{ color: "rgba(200,230,255,0.9)" }}>{sec.title}</span>
              <span className="text-xs" style={{ color: "rgba(0,200,255,0.5)" }}>{expandedSections.has(i) ? "▲" : "▼"}</span>
            </button>
            {expandedSections.has(i) && sec.body && (
              <div className="px-4 pb-4 text-[13px] leading-relaxed space-y-1.5" style={{ color: "rgba(170,210,250,0.85)" }}>
                {sec.body.split("\n").filter(Boolean).map((line, li) => {
                  const isBullet = line.startsWith("- ") || line.startsWith("* ");
                  const clean = isBullet ? line.slice(2) : line;
                  return isBullet ? (
                    <div key={li} className="flex gap-2">
                      <span className="text-cyan-400 mt-0.5 shrink-0">•</span>
                      <span>{renderMarkdownText(clean)}</span>
                    </div>
                  ) : <p key={li}>{renderMarkdownText(line)}</p>;
                })}
              </div>
            )}
          </div>
        ))}
        {sources.length > 0 && (
          <div className="px-4 py-3" style={{ background: "rgba(5,15,40,0.8)" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "rgba(0,200,255,0.5)" }}>
              Sources ({sources.length})
            </p>
            <div className="space-y-2">
              {visibleSources.map((src, i) => (
                <a key={i} href={src.url} target="_blank" rel="noreferrer" className="flex items-start gap-2 group">
                  <div className="w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(20,40,80,0.8)", borderColor: "rgba(0,188,212,0.3)" }}>
                    <img src={`https://www.google.com/s2/favicons?domain=${src.domain}&sz=16`} alt="" className="w-3 h-3"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-cyan-400 group-hover:underline truncate">{src.title}</p>
                    <p className="text-[10px]" style={{ color: "rgba(100,160,220,0.5)" }}>{src.domain}</p>
                  </div>
                </a>
              ))}
            </div>
            {sources.length > 4 && (
              <button type="button" onClick={() => setShowAllSources((v) => !v)}
                className="mt-2 text-[11px] text-cyan-500 hover:underline">
                {showAllSources ? "Show fewer" : `Show ${sources.length - 4} more sources`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function makeSession(modelId: ModelId): ChatSession {
  return { id: crypto.randomUUID(), modelId, messages: [], title: "New chat", createdAt: Date.now() };
}

export default function AiAssistant() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => [makeSession("pulse45")]);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => sessions[0]?.id ?? "");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatMode, setChatMode] = useState<ChatMode>("normal");
  const [showProModal, setShowProModal] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [settings, setSettings] = useState<SynapseSettings>(loadSettings);
  const tr = getTranslation(settings.language);
  const themeVars = getThemeVars(settings.theme);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingResearch, setIsGeneratingResearch] = useState(false);
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);
  const [presentationStage, setPresentationStage] = useState<"idle" | "waiting-slide-count">("idle");
  const [pendingPresentationPrompt, setPendingPresentationPrompt] = useState("");
  const [imageStage, setImageStage] = useState<"idle" | "waiting-type">("idle");
  const [pendingImagePrompt, setPendingImagePrompt] = useState("");
  const [buildingTopic, setBuildingTopic] = useState("");
  const [buildingSlideCount, setBuildingSlideCount] = useState(10);
  const [activePresentationData, setActivePresentationData] = useState<(PresentationData & { pdfBase64?: string; docxBase64?: string }) | null>(null);
  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatMutation.isPending]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
      if (modelPickerRef.current && !modelPickerRef.current.contains(e.target as Node)) {
        setShowModelPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
      setIsGeneratingResearch(true);
      try {
        const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
        const resp = await fetch(`${apiBase}/api/ai/deep-research`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: userMsg, agent: activeModel }),
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
      } catch {
        toast({ title: "Deep Research failed", description: "Please try again.", variant: "destructive" });
        updateSession(sessionId, currentMsgs);
      } finally { setIsGeneratingResearch(false); }
      return;
    }

    chatMutation.mutate(
      { data: { message: userMsg, conversationHistory: currentMsgs, agent: activeModel, language: settings.language } as any },
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

  const handleImageTypeSelect = async (labeled: boolean) => {
    if (isGeneratingImage) return;
    const currentMsgs = activeSession.messages;
    const sessionId = activeSession.id;
    const prompt = pendingImagePrompt;
    const typeLabel = labeled ? tr.labeledDiagram : tr.simpleImage;
    const userEntry: ExtendedMessage = { role: ChatMessageRole.user, content: typeLabel };
    const newMsgs = [...currentMsgs, userEntry];
    updateSession(sessionId, newMsgs);
    setImageStage("idle");
    setIsGeneratingImage(true);
    try {
      const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
      const resp = await fetch(`${apiBase}/api/ai/generate-image`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, labeled }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? "Image generation failed. Please try again.");
      if (data.imageUrl) {
        updateSession(sessionId, [...newMsgs, {
          role: ChatMessageRole.assistant,
          content: `Here is your generated ${labeled ? "labeled diagram" : "medical illustration"} for: "${prompt}"`,
          imageUrl: data.imageUrl, isImageGeneration: true,
        }]);
      } else throw new Error(data.error ?? "No image was returned.");
    } catch (err: any) {
      const description = err?.message ?? "Please try a different prompt.";
      toast({ title: "Image generation failed", description, variant: "destructive" });
      updateSession(sessionId, currentMsgs);
    } finally { setIsGeneratingImage(false); }
  };

  const removeAttachment = (id: string) => setAttachments((prev) => prev.filter((a) => a.id !== id));

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
    a.href = url; a.download = `synapse-chats-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const ModelIcon = model.icon;

  // Group sessions by today / yesterday / older
  const now = Date.now();
  const todaySessions = sessions.filter((s) => now - s.createdAt < 86400000);
  const yesterdaySessions = sessions.filter((s) => now - s.createdAt >= 86400000 && now - s.createdAt < 172800000);
  const olderSessions = sessions.filter((s) => now - s.createdAt >= 172800000);

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: "var(--sp-root-bg)", ...themeVars }}>

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
        {/* Top row: Logo + Search */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1 shrink-0">
          <div className="flex items-center gap-2">
            <SynapseLogo size="sm" thinking={false} baseUrl={import.meta.env.BASE_URL} />
          </div>
          <button className="p-1.5 rounded-lg transition-colors hover:bg-white/5" style={{ color: "rgba(255,255,255,0.4)" }}>
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace selector */}
        <div className="px-2 pb-2 shrink-0">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all hover:bg-white/5">
            <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #1a73e8, #0ea5e9)" }}>S</div>
            <span className="flex-1 text-left text-xs font-medium truncate" style={{ color: "rgba(255,255,255,0.75)" }}>
              SYNAPSE's Workspace
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
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            <Settings className="w-4 h-4" />
            Settings
          </button>
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
        <div className="mx-3 mb-2 mt-2 p-3 rounded-xl shrink-0"
          style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm">🎁</span>
            <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>SYNAPSE Pro</span>
          </div>
          <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            Upgrade to unlock Nova 4.6 advanced diagnostics and unlimited research.
          </p>
          <button onClick={() => setShowProModal(true)}
            className="mt-2 text-[10px] font-bold px-3 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ background: "rgba(59,130,246,0.25)", color: "rgba(147,197,253,0.9)", border: "1px solid rgba(59,130,246,0.3)" }}>
            Upgrade →
          </button>
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

        {/* ── Top Banner (like Replit's "Need more credits?" bar) ── */}
        {showBanner && !hasMessages && (
          <div className="shrink-0 flex items-center justify-center gap-3 px-4 py-2.5 text-sm relative"
            style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ color: "rgba(255,255,255,0.55)" }}>Need more context?</span>
            <button onClick={() => setShowProModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all hover:opacity-90"
              style={{ background: "#1a73e8", color: "white" }}>
              🎁 Upgrade to Pro
            </button>
            <button onClick={() => setShowBanner(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.4)" }}>
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
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>SYNAPSE's Workspace</span>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} />
            </button>

            {/* Main greeting */}
            <h1 className="text-[2rem] font-semibold text-center mb-7 leading-snug" style={{ color: "rgba(255,255,255,0.92)" }}>
              Hi @Synapse User, what do you want to diagnose?
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
                      {chatMode === "deep-research" ? <><Microscope className="w-3.5 h-3.5" /> {tr.deepResearchMode}</>
                        : chatMode === "create-presentation" ? <><Presentation className="w-3.5 h-3.5" /> {presentationStage === "idle" ? tr.presentationMode : tr.selectSlideCountAbove}</>
                        : <><ImagePlus className="w-3.5 h-3.5" /> {imageStage === "waiting-type" ? tr.selectSlideCountAbove : tr.imageMode}</>}
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
                      chatMode === "create-image" ? tr.describeImagePlaceholder
                        : chatMode === "deep-research" ? tr.researchTopicPlaceholder
                        : chatMode === "create-presentation" && presentationStage === "idle" ? tr.presentationTopicPlaceholder
                        : chatMode === "create-presentation" && presentationStage === "waiting-slide-count" ? tr.selectSlidesPlaceholder
                        : "Describe your clinical question, SYNAPSE will bring it to life..."
                    }
                    rows={2}
                    className="w-full px-5 pt-4 pb-2 text-[15px] bg-transparent focus:outline-none resize-none synapse-textarea"
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
            </div>

            {/* ── Category pills row (Replit's Website/Mobile/Design/Slides/Animation) ── */}
            {!isProLocked && (() => {
              const categories = [
                { icon: Stethoscope, label: "Diagnose", mode: "normal" as ChatMode, model: "pulse45" as ModelId },
                { icon: Search, label: "Research", mode: "deep-research" as ChatMode, model: "pulse45" as ModelId },
                { icon: ImagePlus, label: "Image", mode: "create-image" as ChatMode, model: "flux36" as ModelId },
                { icon: Presentation, label: "Slides", mode: "create-presentation" as ChatMode, model: "pulse45" as ModelId },
                { icon: FlaskConical, label: "Pharmacology", mode: "normal" as ChatMode, model: "flux36" as ModelId },
              ];
              const visible = categories.slice(categoryIndex, categoryIndex + 4);
              return (
                <div className="w-full max-w-2xl flex items-center gap-2 mb-5 justify-center">
                  <button onClick={() => setCategoryIndex(i => Math.max(0, i - 1))}
                    disabled={categoryIndex === 0}
                    className="p-1.5 rounded-lg transition-all disabled:opacity-20"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {visible.map(({ icon: Icon, label, mode, model: mId }) => (
                    <button key={label}
                      onClick={() => { toggleMode(mode); if (mId !== activeModel) { const m = MODELS.find(x => x.id === mId); if (m && !m.pro) handleModelSelect(m); } }}
                      className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-medium transition-all hover:bg-white/8"
                      style={{
                        background: chatMode === mode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                        border: chatMode === mode ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.07)",
                        color: chatMode === mode ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
                      }}>
                      <Icon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                  <button onClick={() => setCategoryIndex(i => Math.min(categories.length - 4, i + 1))}
                    disabled={categoryIndex >= categories.length - 4}
                    className="p-1.5 rounded-lg transition-all disabled:opacity-20"
                    style={{ color: "rgba(255,255,255,0.5)" }}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })()}

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
                    <button key={q} type="button" onClick={() => setInput(q)}
                      className="text-sm px-4 py-2 rounded-full transition-all hover:bg-white/8"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.55)" }}>
                      {q}
                    </button>
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
                        : <SynapseLogo size="sm" thinking={false} baseUrl={import.meta.env.BASE_URL} />
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
                        <div className="px-5 py-4 text-[15px] leading-relaxed">{msg.content}</div>
                      )}
                      {(msg as ExtendedMessage).isDeepResearch && (msg as ExtendedMessage).researchReport && (
                        <ResearchReportCard
                          report={(msg as ExtendedMessage).researchReport!}
                          sources={(msg as ExtendedMessage).researchSources ?? []}
                          queries={(msg as ExtendedMessage).researchQueries ?? []}
                          hasGoogleSearch={(msg as ExtendedMessage).hasGoogleSearch ?? false}
                        />
                      )}
                      {(msg as ExtendedMessage).imageUrl && (
                        <div className="px-4 pb-4 pt-2">
                          {msg.content && <div className="px-1 pb-3 text-[14px]">{msg.content}</div>}
                          <img src={(msg as ExtendedMessage).imageUrl} alt="SYNAPSE generated"
                            className="w-full rounded-xl object-contain max-h-[480px]"
                            style={{ border: "1px solid rgba(0,188,212,0.2)" }} />
                          <a href={(msg as ExtendedMessage).imageUrl} download="synapse-image.png" target="_blank" rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                            style={{ color: "#00E5FF" }}>
                            <Download className="w-3.5 h-3.5" /> {tr.downloadImage}
                          </a>
                        </div>
                      )}
                      {(msg as ExtendedMessage).isImageTypeSelection && (
                        <div className="px-4 pb-4 pt-2">
                          {msg.content && <div className="px-1 pb-3 text-[14px]">{msg.content}</div>}
                          <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => handleImageTypeSelect(false)}
                              disabled={isGeneratingImage}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                              style={{ background: "rgba(0,180,220,0.18)", border: "1px solid rgba(0,229,255,0.4)", color: "#00e5ff" }}>
                              <ImagePlus className="w-4 h-4" /> {tr.simpleImage}
                            </button>
                            <button type="button" onClick={() => handleImageTypeSelect(true)}
                              disabled={isGeneratingImage}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                              style={{ background: "rgba(130,0,220,0.18)", border: "1px solid rgba(168,85,247,0.5)", color: "#c084fc" }}>
                              <Tag className="w-4 h-4" /> {tr.labeledDiagram}
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
                      <SynapseLogo size="sm" thinking baseUrl={import.meta.env.BASE_URL} />
                    </div>
                    <ImageGeneratingAnimation prompt={pendingImagePrompt} />
                  </div>
                )}

                {/* Thinking indicator */}
                {(chatMutation.isPending || isGeneratingResearch) && (
                  <div className="flex gap-3 self-start max-w-[92%]">
                    <div className="w-8 h-8 shrink-0 mt-1">
                      <SynapseLogo size="sm" thinking baseUrl={import.meta.env.BASE_URL} />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-3"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: "rgba(255,255,255,0.5)" }} />
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {isGeneratingResearch ? tr.researching : tr.thinking}
                      </span>
                    </div>
                  </div>
                )}

                {/* Presentation building */}
                {isGeneratingPresentation && (
                  <div className="flex gap-3 self-start max-w-[95%] w-full">
                    <div className="w-8 h-8 shrink-0 mt-1">
                      <SynapseLogo size="sm" thinking baseUrl={import.meta.env.BASE_URL} />
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
                      className="w-full px-5 pt-4 pb-2 text-base bg-transparent focus:outline-none resize-none synapse-textarea"
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

      {/* ── Pro Modal ── */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowProModal(false)}>
          <div className="rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
            style={{ background: "rgba(5,15,40,0.97)", border: "1px solid rgba(167,139,250,0.3)", backdropFilter: "blur(20px)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)" }}>
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl mb-2" style={{ color: "rgba(220,235,255,0.95)" }}>{tr.upgradeTitle}</h2>
            <p className="mb-6 text-sm leading-relaxed" style={{ color: "rgba(150,190,250,0.7)" }}>
              Unlock <span className="font-bold" style={{ color: "#a78bfa" }}>SYNAPSE Nova 4.6</span> — our most powerful model for advanced diagnostics, rare disease identification, and deep clinical research.
            </p>
            <ul className="text-left space-y-3 mb-8 text-sm" style={{ color: "rgba(170,210,255,0.8)" }}>
              {[
                "Full access to Nova 4.6 advanced reasoning",
                "Complex differential diagnosis & rare diseases",
                "Deep literature synthesis & research summaries",
                "Multispecialty second opinion on demand",
                "Priority responses & no rate limits",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(109,40,217,0.4)" }}>
                    <span className="text-xs font-bold" style={{ color: "#a78bfa" }}>✓</span>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full font-bold py-4 rounded-2xl transition-all shadow-lg mb-3 flex items-center justify-center gap-2 text-base"
              style={{ background: "linear-gradient(to right, #7c3aed, #9333ea)", color: "white" }}>
              <Crown className="w-5 h-5" /> {tr.upgradePro}
            </button>
            <button onClick={() => setShowProModal(false)} className="text-sm" style={{ color: "rgba(150,180,240,0.5)" }}>
              {tr.maybeLater}
            </button>
          </div>
        </div>
      )}

      {/* ── Settings Modal ── */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSettingsChange={setSettings}
          onClearAllChats={() => {
            const fresh = makeSession("pulse45");
            setSessions([fresh]);
            setActiveSessionId(fresh.id);
          }}
          onClearCurrentChat={handleClearCurrentChat}
          onExportChats={handleExportChats}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* ── In-Browser Presentation Viewer ── */}
      {activePresentationData && (
        <PresentationViewer
          data={activePresentationData}
          pdfBase64={activePresentationData.pdfBase64}
          docxBase64={activePresentationData.docxBase64}
          onClose={() => setActivePresentationData(null)}
        />
      )}

      {/* ── Camera Modal ── */}
      {showCamera && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}

function ImageGeneratingAnimation({ prompt }: { prompt: string }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const phases = [
    "Initializing neural network…",
    "Processing visual tokens…",
    "Synthesizing anatomy…",
    "Rendering fine details…",
    "Applying clinical clarity…",
    "Finalizing medical image…",
  ];
  useEffect(() => {
    const t = setInterval(() => setPhase(p => (p + 1) % phases.length), 2200);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    setProgress(0);
    const t = setInterval(() => setProgress(p => {
      if (p >= 95) return p;
      return p + (Math.random() * 3.5);
    }), 180);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      background: "transparent",
      borderRadius: "18px",
      overflow: "hidden",
      minWidth: "280px",
      maxWidth: "340px",
    }}>
      {/* Main visual — neural net bg + rotating ring overlay */}
      <div style={{ position: "relative", height: "190px", overflow: "hidden" }}>
        {/* Neural network background */}
        <img src={neuralNetImg} alt=""
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            opacity: 0.55,
            animation: "synapse-img-bg-pulse 3s ease-in-out infinite",
          }} />
        {/* Dark vignette overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(2,6,20,0.75) 100%)",
          pointerEvents: "none",
        }} />
        {/* Blue ring — spinning */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img src={ringAnimImg} alt=""
            style={{
              width: "140px", height: "140px",
              objectFit: "contain",
              animation: "synapse-ring-spin 3.5s linear infinite",
              filter: "drop-shadow(0 0 18px rgba(0,180,255,0.7)) drop-shadow(0 0 36px rgba(0,120,220,0.4))",
            }} />
        </div>
        {/* Inner glow pulse */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <div style={{
            width: "72px", height: "72px",
            borderRadius: "50%",
            background: "rgba(0,180,255,0.08)",
            animation: "synapse-core-pulse 1.6s ease-in-out infinite",
            boxShadow: "0 0 30px 10px rgba(0,150,255,0.12)",
          }} />
        </div>
        {/* LIVE badge */}
        <div style={{
          position: "absolute", top: "10px", right: "12px",
          display: "flex", alignItems: "center", gap: "5px",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(0,220,255,0.2)",
          borderRadius: "20px",
          padding: "3px 8px",
        }}>
          <div style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "#00e5ff",
            boxShadow: "0 0 6px 3px rgba(0,229,255,0.6)",
            animation: "synapse-dot-blink 1s ease-in-out infinite",
          }} />
          <span style={{ fontSize: "9px", fontWeight: 700, color: "#00e5ff", letterSpacing: "0.08em", fontFamily: "monospace" }}>
            LIVE
          </span>
        </div>
        {/* Particle dots */}
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: `${3 + (i % 3)}px`, height: `${3 + (i % 3)}px`,
            borderRadius: "50%",
            background: "rgba(0,200,255,0.7)",
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 2) * 50}%`,
            animation: `synapse-particle 2s ease-in-out ${i * 0.35}s infinite`,
            boxShadow: "0 0 6px rgba(0,200,255,0.6)",
          }} />
        ))}
      </div>

      {/* Progress bar + info — glass backdrop */}
      <div style={{
        background: "rgba(2,6,20,0.72)",
        backdropFilter: "blur(12px)",
        borderBottomLeftRadius: "18px",
        borderBottomRightRadius: "18px",
        border: "1px solid rgba(0,150,212,0.18)",
        borderTop: "none",
      }}>
      <div style={{ padding: "10px 14px 0" }}>
        <div style={{ height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${Math.min(progress, 95)}%`,
            background: "linear-gradient(to right, #0070f3, #00e5ff)",
            borderRadius: "2px",
            transition: "width 0.18s ease-out",
            boxShadow: "0 0 8px rgba(0,180,255,0.6)",
          }} />
        </div>
      </div>

      {/* Info row */}
      <div style={{ padding: "8px 14px 12px" }}>
        {/* Prompt preview */}
        <div style={{
          fontSize: "10px", color: "rgba(100,180,255,0.4)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          marginBottom: "5px", letterSpacing: "0.02em",
        }}>
          "{prompt.length > 42 ? prompt.substring(0, 42) + "…" : prompt}"
        </div>
        {/* Shimmer heading */}
        <div style={{
          fontSize: "13px", fontWeight: 700,
          background: "linear-gradient(90deg, #00cfff, #7c5cfc, #00e5ff, #00cfff)",
          backgroundSize: "250% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "img-gen-shimmer 2.4s linear infinite",
          marginBottom: "5px",
        }}>
          Generating medical image
        </div>
        {/* Phase + progress % */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div key={phase} style={{
            fontSize: "11px", color: "rgba(100,200,255,0.65)",
            animation: "img-gen-text-in 0.3s ease-out",
            display: "flex", alignItems: "center", gap: "5px",
          }}>
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "#00cfff", boxShadow: "0 0 5px rgba(0,200,255,0.6)",
              animation: "synapse-dot-blink 1s ease-in-out infinite",
            }} />
            {phases[phase]}
          </div>
          <span style={{ fontSize: "11px", fontFamily: "monospace", color: "rgba(0,200,255,0.5)", fontWeight: 600 }}>
            {Math.round(Math.min(progress, 95))}%
          </span>
        </div>
      </div>
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
        <span className="ml-1.5 text-[10px] text-slate-400 font-sans">synapse_presentation_builder.json</span>
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
