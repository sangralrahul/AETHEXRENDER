import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, User, Loader2, Activity, FlaskConical,
  Lock, Crown, Paperclip, Image, FileText, Camera, Search,
  ImagePlus, X, Microscope, Download, Presentation, PlayCircle,
  Plus, PanelLeft, Settings, MessageSquare, Tag,
} from "lucide-react";
import { useAiChat } from "@workspace/api-client-react";
import { type ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
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

  /* dark + auto → same deep-space palette */
  return {
    "--sp-root-bg":                  "#040B1A",
    "--sp-sidebar-bg":               "rgba(2,8,22,0.92)",
    "--sp-sidebar-border":           "rgba(0,188,212,0.13)",
    "--sp-topbar-bg":                "rgba(2,8,22,0.8)",
    "--sp-topbar-border":            "rgba(0,188,212,0.1)",
    "--sp-divider":                  "rgba(0,188,212,0.1)",
    "--sp-label":                    "rgba(0,200,255,0.35)",
    "--sp-text-primary":             "rgba(200,235,255,0.95)",
    "--sp-text-muted":               "rgba(120,175,220,0.6)",
    "--sp-text-dim":                 "rgba(100,160,220,0.5)",
    "--sp-text-faint":               "rgba(100,160,220,0.35)",
    "--sp-text-footer":              "rgba(130,185,230,0.65)",
    "--sp-model-inactive-color":     "rgba(120,175,220,0.6)",
    "--sp-model-inactive-bg":        "rgba(255,255,255,0.02)",
    "--sp-model-inactive-border":    "rgba(255,255,255,0.05)",
    "--sp-model-icon-inactive":      "rgba(255,255,255,0.05)",
    "--sp-session-active-bg":        "rgba(0,188,212,0.12)",
    "--sp-session-active-border":    "rgba(0,188,212,0.2)",
    "--sp-session-active-text":      "rgba(200,240,255,0.95)",
    "--sp-session-inactive-text":    "rgba(130,180,220,0.65)",
    "--sp-session-meta":             "rgba(0,180,220,0.35)",
    "--sp-ai-bubble-bg":             "rgba(4,14,38,0.82)",
    "--sp-ai-bubble-border":         "rgba(0,188,212,0.18)",
    "--sp-ai-text":                  "rgba(190,225,255,0.9)",
    "--sp-user-bubble-bg":           "linear-gradient(135deg,rgba(0,188,212,0.35),rgba(0,150,200,0.25))",
    "--sp-user-bubble-border":       "rgba(0,229,255,0.3)",
    "--sp-user-text":                "rgba(220,245,255,0.95)",
    "--sp-input-bg":                 "rgba(4,14,38,0.88)",
    "--sp-input-border":             "rgba(0,188,212,0.28)",
    "--sp-textarea-color":           "rgba(200,235,255,0.95)",
    "--sp-placeholder-color":        "rgba(100,170,220,0.45)",
    "--sp-new-chat-bg":              "rgba(0,188,212,0.12)",
    "--sp-new-chat-border":          "rgba(0,188,212,0.28)",
    "--sp-new-chat-color":           "#00E5FF",
    "--sp-toggle-color":             "rgba(0,229,255,0.55)",
    "--sp-caret-color":              "#00E5FF",
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
    <div className="h-screen pt-[72px] flex overflow-hidden relative" style={{ background: "var(--sp-root-bg)", ...themeVars }}>
      {/* ── Live DNA Background (hidden in light mode) ── */}
      {settings.theme !== "light" && <DNABackground />}

      {/* Hidden inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileSelect(e, "image")} />
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.csv,.xlsx" multiple className="hidden" onChange={(e) => handleFileSelect(e, "file")} />

      {/* ═══════════════════════════════════════════════════════════
          LEFT SIDEBAR
      ══════════════════════════════════════════════════════════════ */}
      <aside
        className={cn(
          "relative z-20 flex flex-col shrink-0 transition-all duration-300 overflow-hidden",
          sidebarOpen ? "w-[260px]" : "w-0"
        )}
        style={{
          background: "var(--sp-sidebar-bg)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid var(--sp-sidebar-border)",
        }}
      >
        {/* Sidebar header */}
        <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
          <SynapseLogo size="sm" thinking={false} baseUrl={import.meta.env.BASE_URL} />
          <span
            className="font-bold text-base"
            style={{
              fontFamily: "'Orbitron', 'Exo 2', monospace",
              letterSpacing: "0.14em",
              color: "#00E5FF",
              textShadow: "0 0 12px rgba(0,229,255,0.45)",
            }}
          >SYNAPSE</span>
        </div>

        {/* New Chat button */}
        <div className="px-3 pb-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "var(--sp-new-chat-bg)",
              border: "1px solid var(--sp-new-chat-border)",
              color: "var(--sp-new-chat-color)",
            }}
          >
            <Plus className="w-4 h-4" />
            {tr.newChat}
          </button>
        </div>

        {/* Model selector */}
        <div className="px-3 mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: "var(--sp-label)" }}>
            {tr.aiAgents}
          </p>
          {MODELS.map((m) => {
            const MI = m.icon;
            const isActive = m.id === activeModel;
            return (
              <button
                key={m.id}
                onClick={() => handleModelSelect(m)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all mb-1.5"
                style={
                  isActive
                    ? {
                        ...m.activeStyle,
                        borderRadius: 12,
                        boxShadow: `0 0 16px ${m.activeStyle.borderColor ?? "rgba(0,188,212,0.2)"}`,
                      }
                    : {
                        color: "var(--sp-model-inactive-color)",
                        background: "var(--sp-model-inactive-bg)",
                        border: "1px solid var(--sp-model-inactive-border)",
                      }
                }
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={
                    isActive
                      ? { background: "rgba(255,255,255,0.15)" }
                      : { background: "var(--sp-model-icon-inactive)" }
                  }
                >
                  {m.pro && !isActive
                    ? <Lock className="w-4 h-4" style={{ color: "rgba(167,139,250,0.7)" }} />
                    : <MI className="w-4 h-4" />}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-[13px] font-semibold leading-tight">
                    {m.name} <span className="font-normal opacity-60">{m.version}</span>
                  </div>
                  <div className="text-[10px] mt-0.5 opacity-50 truncate">{m.description}</div>
                </div>
                {m.pro && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{ background: "rgba(109,40,217,0.4)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.3)" }}>
                    PRO
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-4 my-2" style={{ borderTop: "1px solid var(--sp-divider)" }} />

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-3 min-h-0">
          {[
            { label: tr.today, list: todaySessions },
            { label: tr.yesterday, list: yesterdaySessions },
            { label: tr.older, list: olderSessions },
          ].map(({ label, list }) =>
            list.length > 0 ? (
              <div key={label} className="mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1" style={{ color: "var(--sp-label)" }}>
                  {label}
                </p>
                {list.map((sess) => {
                  const sm = MODELS.find((m) => m.id === sess.modelId)!;
                  const SMIcon = sm.icon;
                  const isActive = sess.id === activeSessionId;
                  return (
                    <div
                      key={sess.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveSessionId(sess.id)}
                      onKeyDown={(e) => e.key === "Enter" && setActiveSessionId(sess.id)}
                      className="group w-full flex items-start gap-2 px-3 py-2 rounded-xl text-left transition-all mb-0.5 cursor-pointer"
                      style={
                        isActive
                          ? { background: "var(--sp-session-active-bg)", border: "1px solid var(--sp-session-active-border)" }
                          : { border: "1px solid transparent" }
                      }
                    >
                      <SMIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: isActive ? "#00E5FF" : "var(--sp-text-dim)" }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] truncate leading-tight"
                          style={{ color: isActive ? "var(--sp-session-active-text)" : "var(--sp-session-inactive-text)" }}>
                          {sess.title}
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: "var(--sp-session-meta)" }}>
                          {sm.name} {sm.version}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(sess.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-900/40"
                        style={{ color: "rgba(255,100,100,0.6)" }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null
          )}
          {todaySessions.length === 0 && yesterdaySessions.length === 0 && olderSessions.length === 0 && (
            <p className="text-xs text-center px-2 py-4" style={{ color: "var(--sp-text-faint)" }}>{tr.noChatsYet}</p>
          )}
        </div>

        {/* Sidebar footer — settings */}
        <div className="px-3 pb-4 pt-2" style={{ borderTop: "1px solid var(--sp-divider)" }}>
          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all"
            style={{ color: "var(--sp-text-footer)" }}
          >
            <Settings className="w-4 h-4" />
            {tr.settings}
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════
          MAIN AREA
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">

        {/* ── Top bar: sidebar toggle + active model + new chat ── */}
        <div
          className="shrink-0 flex items-center gap-2 px-3 py-2"
          style={{
            background: "var(--sp-topbar-bg)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--sp-topbar-border)",
          }}
        >
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--sp-toggle-color)" }}
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          <div className="w-px h-5 mx-1" style={{ background: "rgba(0,188,212,0.15)" }} />

          {/* Active model pill */}
          <div className="flex items-center gap-2 flex-1">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={model.activeStyle}
            >
              <ModelIcon className="w-3.5 h-3.5" />
              <span>{model.name}</span>
              <span className="opacity-70">{model.version}</span>
              {model.pro && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(109,40,217,0.4)", color: "#c4b5fd" }}>
                  PRO
                </span>
              )}
            </div>
          </div>

          {/* New chat (right side of top bar) */}
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ color: "var(--sp-new-chat-color)", border: "1px solid var(--sp-new-chat-border)" }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{tr.newChat}</span>
          </button>
        </div>

        {/* ── Messages / Empty state ── */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5 min-h-full">

            {/* Empty state */}
            {!hasMessages && (
              <div className="flex flex-col items-center justify-center flex-1 gap-6 py-8">
                <div className="flex flex-col items-center gap-3">
                  <div style={{ filter: "drop-shadow(0 0 24px rgba(0,229,255,0.4))" }}>
                    <SynapseLogo size="lg" thinking={false} baseUrl={import.meta.env.BASE_URL} />
                  </div>
                  <div className="text-center">
                    <h1
                      className="font-bold text-4xl"
                      style={{
                        fontFamily: "'Orbitron', 'Exo 2', monospace",
                        letterSpacing: "0.18em",
                        color: "#00E5FF",
                        textShadow: "0 0 24px rgba(0,229,255,0.6), 0 0 60px rgba(0,188,212,0.25)",
                      }}
                    >
                      SYNAPSE
                    </h1>
                  </div>
                </div>

                {/* Quick suggestions grid */}
                {!isProLocked && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-xl">
                    {quickSuggestions[activeModel].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setInput(q)}
                        className="text-sm px-4 py-3 rounded-2xl text-left transition-all"
                        style={{
                          background: "var(--sp-new-chat-bg)",
                          border: "1px solid var(--sp-input-border)",
                          color: "var(--sp-new-chat-color)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {isProLocked && (
                  <div className="max-w-md text-center px-4">
                    <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                      style={{ background: "rgba(109,40,217,0.3)", border: "1px solid rgba(167,139,250,0.3)" }}>
                      <Crown className="w-6 h-6" style={{ color: "#a78bfa" }} />
                    </div>
                    <p className="text-base leading-relaxed" style={{ color: "rgba(150,210,255,0.75)" }}>
                      {modelGreetings.nova46}
                    </p>
                    <button
                      onClick={() => setShowProModal(true)}
                      className="mt-4 flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
                      style={{ background: "linear-gradient(to right, #7c3aed, #9333ea)", color: "white" }}
                    >
                      <Crown className="w-4 h-4" /> {tr.upgradePro}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            {hasMessages && (
              <>
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
                        ? { background: "rgba(0,188,212,0.2)", border: "1px solid rgba(0,229,255,0.25)" }
                        : undefined}
                    >
                      {msg.role === ChatMessageRole.user
                        ? <User className="w-4 h-4" style={{ color: "#00E5FF" }} />
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
                      style={{ background: "rgba(4,14,38,0.82)", border: "1px solid rgba(0,188,212,0.18)", backdropFilter: "blur(12px)" }}>
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#00E5FF" }} />
                      <span className="text-sm" style={{ color: "rgba(140,200,255,0.7)" }}>
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
                      style={{ background: "rgba(5,18,48,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(0,188,212,0.2)" }}>
                      <div className="px-4 pt-3 pb-2 text-xs font-medium flex items-center gap-2" style={{ color: "rgba(100,200,255,0.8)" }}>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        {tr.buildingPresentation.replace("{n}", String(buildingSlideCount))}
                      </div>
                      <PresentationBuildingAnimation topic={buildingTopic} slideCount={buildingSlideCount} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* ── Input area ── */}
        <div className="shrink-0 px-4 pb-4 pt-2">
          <div className="max-w-3xl mx-auto">
            {isProLocked ? (
              <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{ background: "rgba(109,40,217,0.15)", border: "2px solid rgba(167,139,250,0.3)", backdropFilter: "blur(16px)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(109,40,217,0.4)" }}>
                    <Lock className="w-4 h-4" style={{ color: "#a78bfa" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "rgba(200,220,255,0.9)" }}>{tr.proRequired}</p>
                    <p className="text-xs" style={{ color: "rgba(150,180,240,0.6)" }}>{tr.proGatedMsg}</p>
                  </div>
                </div>
                <button onClick={() => setShowProModal(true)}
                  className="flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all"
                  style={{ background: "linear-gradient(to right, #7c3aed, #9333ea)", color: "white" }}>
                  <Crown className="w-4 h-4" /> {tr.upgradePro}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}
                className="rounded-2xl transition-all overflow-visible"
                style={{
                  background: "var(--sp-input-bg)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid var(--sp-input-border)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(0,229,255,0.06)",
                }}
              >
                {/* Active mode banner */}
                {chatMode !== "normal" && (
                  <div className="flex items-center gap-2 px-4 py-2 border-b text-xs font-semibold"
                    style={{
                      background: chatMode === "deep-research" ? "rgba(2,119,189,0.18)" : chatMode === "create-presentation" ? "rgba(180,120,0,0.15)" : "rgba(100,50,180,0.18)",
                      borderColor: chatMode === "deep-research" ? "rgba(2,119,189,0.35)" : chatMode === "create-presentation" ? "rgba(180,120,0,0.3)" : "rgba(100,50,180,0.35)",
                      color: chatMode === "deep-research" ? "#4FC3F7" : chatMode === "create-presentation" ? "#FFD54F" : "#CE93D8",
                    }}>
                    {chatMode === "deep-research"
                      ? <><Microscope className="w-3.5 h-3.5" /> {tr.deepResearchMode}</>
                      : chatMode === "create-presentation"
                      ? <><Presentation className="w-3.5 h-3.5" /> {presentationStage === "idle" ? tr.presentationMode : tr.selectSlideCountAbove}</>
                      : <><ImagePlus className="w-3.5 h-3.5" /> {imageStage === "waiting-type" ? tr.selectSlideCountAbove : tr.imageMode}</>}
                    <button type="button" onClick={() => toggleMode(chatMode)} className="ml-auto hover:opacity-70">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Attachment previews */}
                {attachments.length > 0 && (
                  <div className="flex gap-2 px-4 pt-3 flex-wrap">
                    {attachments.map((a) => (
                      <div key={a.id} className="relative group flex items-center gap-2 rounded-xl px-3 py-2 text-xs max-w-[160px]"
                        style={{ background: "rgba(0,188,212,0.1)", border: "1px solid rgba(0,188,212,0.2)", color: "rgba(180,225,255,0.8)" }}>
                        {a.type === "image" && a.previewUrl
                          ? <img src={a.previewUrl} alt={a.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          : <FileText className="w-5 h-5 shrink-0" style={{ color: "rgba(0,188,212,0.7)" }} />}
                        <div className="min-w-0">
                          <p className="truncate font-medium leading-tight">{a.name}</p>
                          <p style={{ color: "rgba(100,170,220,0.5)" }}>{a.size}</p>
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

                {/* Textarea */}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
                  placeholder={
                    chatMode === "create-image"
                      ? tr.describeImagePlaceholder
                      : chatMode === "deep-research"
                      ? tr.researchTopicPlaceholder
                      : chatMode === "create-presentation" && presentationStage === "idle"
                      ? tr.presentationTopicPlaceholder
                      : chatMode === "create-presentation" && presentationStage === "waiting-slide-count"
                      ? tr.selectSlidesPlaceholder
                      : `${tr.messagePlaceholder} · ${model.name} ${model.version}...`
                  }
                  rows={1}
                  className="w-full px-5 pt-4 pb-2 text-base bg-transparent focus:outline-none resize-none synapse-textarea"
                  style={{ color: "var(--sp-textarea-color)", caretColor: "var(--sp-caret-color)", minHeight: "52px", maxHeight: "160px" }}
                  disabled={chatMutation.isPending || isGeneratingPresentation || presentationStage === "waiting-slide-count"}
                />

                {/* Toolbar */}
                <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">
                  <div className="flex items-center gap-1">

                    {/* Attach */}
                    <div className="relative" ref={attachMenuRef}>
                      <button type="button" onClick={() => setShowAttachMenu((v) => !v)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{ color: showAttachMenu ? "#00E5FF" : "rgba(100,180,220,0.6)" }}>
                        <Paperclip className="w-4 h-4" />
                        <span className="hidden sm:inline">{tr.attach}</span>
                      </button>
                      {showAttachMenu && (
                        <div className="absolute bottom-full left-0 mb-2 rounded-2xl shadow-xl overflow-hidden w-52 z-30"
                          style={{ background: "rgba(4,12,35,0.97)", backdropFilter: "blur(20px)", border: "1px solid rgba(0,188,212,0.3)" }}>
                          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(0,229,255,0.45)" }}>{tr.attach}</div>
                          {[
                            { label: tr.uploadImage, sub: tr.uploadImageFormats, icon: Image, color: "rgba(30,58,138,0.7)", iconColor: "text-blue-300", action: () => imageInputRef.current?.click() },
                            { label: tr.uploadDocument, sub: tr.uploadDocumentFormats, icon: FileText, color: "rgba(120,50,20,0.5)", iconColor: "text-orange-300", action: () => fileInputRef.current?.click() },
                            { label: tr.takePhoto, sub: tr.useCamera, icon: Camera, color: "rgba(20,80,50,0.5)", iconColor: "text-emerald-300", action: () => { setShowAttachMenu(false); setShowCamera(true); } },
                          ].map(({ label, sub, icon: Icon, color, iconColor, action }) => (
                            <button key={label} type="button" onClick={action}
                              className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors hover:bg-white/5"
                              style={{ color: "rgba(180,225,255,0.9)" }}>
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center`} style={{ background: color }}>
                                <Icon className={`w-4 h-4 ${iconColor}`} />
                              </div>
                              <div className="text-left">
                                <p className="font-semibold leading-tight">{label}</p>
                                <p className="text-xs" style={{ color: "rgba(100,170,220,0.5)" }}>{sub}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Deep Research */}
                    <button type="button" onClick={() => toggleMode("deep-research")}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border"
                      style={chatMode === "deep-research"
                        ? { background: "rgba(2,119,189,0.35)", color: "#4FC3F7", borderColor: "rgba(2,119,189,0.55)" }
                        : { color: "rgba(100,180,220,0.6)", borderColor: "transparent" }}>
                      <Search className="w-4 h-4" />
                      <span className="hidden sm:inline">{tr.deepResearch}</span>
                    </button>

                    {/* Create Image */}
                    <button type="button" onClick={() => toggleMode("create-image")}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border"
                      style={chatMode === "create-image"
                        ? { background: "rgba(100,50,180,0.35)", color: "#CE93D8", borderColor: "rgba(100,50,180,0.55)" }
                        : { color: "rgba(100,180,220,0.6)", borderColor: "transparent" }}>
                      <ImagePlus className="w-4 h-4" />
                      <span className="hidden sm:inline">{tr.createImage}</span>
                    </button>

                    {/* Create Presentation */}
                    <button type="button" onClick={() => toggleMode("create-presentation")}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border"
                      style={chatMode === "create-presentation"
                        ? { background: "rgba(180,100,0,0.3)", color: "#FFD54F", borderColor: "rgba(180,100,0,0.5)" }
                        : { color: "rgba(100,180,220,0.6)", borderColor: "transparent" }}>
                      <Presentation className="w-4 h-4" />
                      <span className="hidden sm:inline">{tr.presentation}</span>
                    </button>
                  </div>

                  {/* Right: model badge + send */}
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={model.activeStyle}>
                      <ModelIcon className="w-3 h-3" />
                      {model.name} {model.version}
                    </div>
                    <button type="submit"
                      disabled={(!input.trim() && attachments.length === 0) || chatMutation.isPending || isGeneratingImage || isGeneratingPresentation || presentationStage === "waiting-slide-count" || imageStage === "waiting-type"}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                      style={{ background: "linear-gradient(135deg, #00BCD4, #0097A7)" }}>
                      <Send className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </form>
            )}

            <p className="text-center text-[11px] mt-2" style={{ color: "rgba(100,160,220,0.4)" }}>
              {tr.disclaimer}
            </p>
          </div>
        </div>
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
  const phases = [
    "Analyzing prompt…",
    "Composing scene…",
    "Rendering details…",
    "Adding highlights…",
    "Finalizing image…",
  ];
  useEffect(() => {
    const t = setInterval(() => setPhase(p => (p + 1) % phases.length), 2400);
    return () => clearInterval(t);
  }, []);

  // One ECG heartbeat cycle: flat → P wave → flat → Q dip → R spike → S dip → flat → T wave → flat
  // viewBox: 0 0 280 90  baseline at y=55
  const ecgCycle =
    "M 0,55 L 22,55 " +
    "Q 28,46 34,55 " +
    "L 50,55 " +
    "L 55,62 L 62,6 L 68,64 " +
    "L 80,55 " +
    "Q 95,36 106,55 " +
    "L 280,55";

  return (
    <div style={{
      background: "linear-gradient(160deg, rgba(2,8,28,0.95) 0%, rgba(4,14,40,0.95) 100%)",
      border: "1px solid rgba(0,188,212,0.2)",
      borderRadius: "16px",
      padding: "18px 20px",
      backdropFilter: "blur(16px)",
      minWidth: "270px",
    }}>
      {/* ECG monitor */}
      <div style={{
        position: "relative",
        height: "108px",
        marginBottom: "14px",
        overflow: "hidden",
        borderRadius: "10px",
        background: "rgba(0,8,18,0.85)",
      }}>
        {/* Graph-paper grid */}
        {[25, 50, 75].map(pct => (
          <div key={`h${pct}`} style={{
            position: "absolute", left: 0, right: 0,
            top: `${pct}%`, height: "1px",
            background: "rgba(0,200,180,0.07)",
            pointerEvents: "none",
          }} />
        ))}
        {[20, 40, 60, 80].map(pct => (
          <div key={`v${pct}`} style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${pct}%`, width: "1px",
            background: "rgba(0,200,180,0.07)",
            pointerEvents: "none",
          }} />
        ))}

        {/* Scrolling ECG strip — 3 tiled copies so the loop is seamless */}
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          display: "flex",
          animation: "img-gen-ecg-scroll 2s linear infinite",
          willChange: "transform",
        }}>
          {[0, 1, 2].map(idx => (
            <svg key={idx} width="280" height="90" viewBox="0 0 280 90" fill="none" style={{ display: "block", flexShrink: 0 }}>
              {/* Glow layer (wider, blurred) */}
              <path d={ecgCycle} stroke="#00E5FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                style={{ filter: "blur(4px)", opacity: 0.35 }} />
              {/* Main line */}
              <path d={ecgCycle} stroke="#00E5FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>

        {/* Fade masks on left and right edges */}
        <div style={{
          position: "absolute", top: 0, left: 0, bottom: 0, width: "28px",
          background: "linear-gradient(to right, rgba(0,8,18,1), transparent)",
          pointerEvents: "none", zIndex: 3,
        }} />
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: "28px",
          background: "linear-gradient(to left, rgba(0,8,18,1), transparent)",
          pointerEvents: "none", zIndex: 3,
        }} />

        {/* BPM readout */}
        <div style={{
          position: "absolute", top: "9px", right: "14px",
          color: "#00E5FF",
          fontSize: "12px", fontWeight: 700,
          fontFamily: "monospace",
          letterSpacing: "0.06em",
          animation: "img-gen-bpm-pulse 2s ease-in-out infinite",
          zIndex: 4,
        }}>
          72 BPM
        </div>

        {/* Bottom status dot */}
        <div style={{
          position: "absolute", bottom: "10px", left: "14px",
          display: "flex", alignItems: "center", gap: "5px",
          zIndex: 4,
        }}>
          <div style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "#00E5FF",
            boxShadow: "0 0 6px 3px rgba(0,229,255,0.6)",
            animation: "img-gen-bpm-pulse 2s ease-in-out infinite",
          }} />
          <span style={{ fontSize: "10px", color: "rgba(0,229,255,0.5)", fontFamily: "monospace", letterSpacing: "0.04em" }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Prompt preview */}
      <div style={{
        fontSize: "11px",
        color: "rgba(100,200,255,0.45)",
        marginBottom: "7px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        letterSpacing: "0.02em",
      }}>
        "{prompt.length > 40 ? prompt.substring(0, 40) + "…" : prompt}"
      </div>

      {/* Shimmer heading */}
      <div style={{
        fontSize: "13px",
        fontWeight: 700,
        background: "linear-gradient(90deg, #00BCD4, #7C3AED, #00E5FF, #0097A7, #7C3AED, #00BCD4)",
        backgroundSize: "300% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "img-gen-shimmer 2.4s linear infinite",
        marginBottom: "4px",
        letterSpacing: "0.04em",
      }}>
        Generating your image
      </div>

      {/* Phase text */}
      <div key={phase} style={{
        fontSize: "12px",
        color: "rgba(100,200,255,0.65)",
        animation: "img-gen-text-in 0.35s ease-out",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}>
        <div style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: "#00E5FF",
          boxShadow: "0 0 6px 2px rgba(0,229,255,0.5)",
          flexShrink: 0,
          animation: "img-gen-orb 1.2s ease-in-out infinite",
        }} />
        {phases[phase]}
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
