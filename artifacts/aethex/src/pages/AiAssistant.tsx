import { useState, useRef, useEffect } from "react";
import {
  Send, User, Loader2, RefreshCcw, Activity, FlaskConical,
  Lock, Crown, Paperclip, Image, FileText, Camera, Search,
  ImagePlus, X, ChevronUp, Microscope, Download, Presentation, PlayCircle,
} from "lucide-react";
import { useAiChat } from "@workspace/api-client-react";
import { type ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import PresentationViewer, { type PresentationData } from "@/components/synapse/PresentationViewer";

interface ExtendedMessage extends ChatMessage {
  imageUrl?: string;
  isImageGeneration?: boolean;
  presentationData?: PresentationData;
  presentationPdfBase64?: string;
  presentationDocxBase64?: string;
  presentationTitle?: string;
  isPresentation?: boolean;
  slideCountOptions?: number[];
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
  pro?: boolean;
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
    badgeBg: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
  },
  {
    id: "flux36",
    name: "Flux",
    version: "3.6",
    description: "Pharmacology · Drug Interactions · Labs",
    icon: FlaskConical,
    color: "bg-orange-500",
    textColor: "text-orange-700",
    badgeBg: "bg-orange-50 border-orange-200 hover:border-orange-400",
  },
  {
    id: "nova46",
    name: "Nova",
    version: "4.6",
    description: "Advanced Diagnostics · Research · Multispecialty",
    icon: Crown,
    color: "bg-violet-600",
    textColor: "text-violet-700",
    badgeBg: "bg-violet-50 border-violet-200 hover:border-violet-400",
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

export default function AiAssistant() {
  const [activeModel, setActiveModel] = useState<ModelId>("pulse45");
  const [chatMode, setChatMode] = useState<ChatMode>("normal");
  const [showProModal, setShowProModal] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [conversations, setConversations] = useState<Record<ModelId, ExtendedMessage[]>>({
    pulse45: [],
    flux36: [],
    nova46: [],
  });
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);
  const [presentationStage, setPresentationStage] = useState<"idle" | "waiting-slide-count">("idle");
  const [pendingPresentationPrompt, setPendingPresentationPrompt] = useState("");
  const [buildingTopic, setBuildingTopic] = useState("");
  const [buildingSlideCount, setBuildingSlideCount] = useState(10);
  const [activePresentationData, setActivePresentationData] = useState<(PresentationData & { pdfBase64?: string; docxBase64?: string }) | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const chatMutation = useAiChat();
  const { toast } = useToast();

  const model = MODELS.find((m) => m.id === activeModel)!;
  const messages = conversations[activeModel];
  const hasMessages = messages.length > 0;
  const isProLocked = model.pro;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasContent = input.trim() || attachments.length > 0;
    if (!hasContent || chatMutation.isPending || isGeneratingImage || isProLocked) return;

    const userMsg = input.trim() || `[Attached: ${attachments.map((a) => a.name).join(", ")}]`;
    setInput("");
    setAttachments([]);

    const currentHistory = conversations[activeModel];
    const userEntry: ExtendedMessage = { role: ChatMessageRole.user, content: userMsg };
    const newHistory: ExtendedMessage[] = [...currentHistory, userEntry];
    setConversations((prev) => ({ ...prev, [activeModel]: newHistory }));

    if (chatMode === "create-image") {
      setIsGeneratingImage(true);
      try {
        const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
        const resp = await fetch(`${apiBase}/api/ai/generate-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userMsg }),
        });
        const data = await resp.json();
        if (data.imageUrl) {
          setConversations((prev) => ({
            ...prev,
            [activeModel]: [
              ...newHistory,
              {
                role: ChatMessageRole.assistant,
                content: `Here is your generated medical illustration for: "${userMsg}"`,
                imageUrl: data.imageUrl,
                isImageGeneration: true,
              },
            ],
          }));
        } else {
          throw new Error(data.error ?? "Generation failed");
        }
      } catch (err) {
        toast({ title: "Image generation failed", description: "Please try a different prompt.", variant: "destructive" });
        setConversations((prev) => ({ ...prev, [activeModel]: currentHistory }));
      } finally {
        setIsGeneratingImage(false);
      }
      return;
    }

    if (chatMode === "create-presentation") {
      // Show clickable slide-count buttons — no typing required
      setPendingPresentationPrompt(userMsg);
      setPresentationStage("waiting-slide-count");
      setConversations((prev) => ({
        ...prev,
        [activeModel]: [
          ...newHistory,
          {
            role: ChatMessageRole.assistant,
            content: `Great! I'll create a presentation on "${userMsg}". How many slides would you like?`,
            slideCountOptions: [5, 8, 10, 12, 15, 20],
          },
        ],
      }));
      return;
    }

    if (chatMode === "deep-research") {
      toast({
        title: "Deep Research initiated",
        description: "SYNAPSE is scanning medical literature. Full rollout coming soon.",
      });
    }

    chatMutation.mutate(
      { data: { message: userMsg, conversationHistory: currentHistory, agent: activeModel } as any },
      {
        onSuccess: (data) => {
          setConversations((prev) => ({
            ...prev,
            [activeModel]: [...newHistory, { role: ChatMessageRole.assistant, content: data.message }],
          }));
        },
      }
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const newAttachment: Attachment = {
        id: crypto.randomUUID(),
        name: file.name,
        type,
        size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
      };
      if (type === "image") {
        const reader = new FileReader();
        reader.onload = (ev) => {
          newAttachment.previewUrl = ev.target?.result as string;
          setAttachments((prev) => [...prev, { ...newAttachment }]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments((prev) => [...prev, newAttachment]);
      }
    });
    setShowAttachMenu(false);
    e.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const resetPresentationState = () => {
    setPresentationStage("idle");
    setPendingPresentationPrompt("");
  };

  const handleSlideCountSelect = async (count: number) => {
    if (isGeneratingPresentation) return;
    const currentHistory = conversations[activeModel];
    const topic = pendingPresentationPrompt;
    const userEntry: ExtendedMessage = { role: ChatMessageRole.user, content: `${count} slides` };
    const newHistory: ExtendedMessage[] = [...currentHistory, userEntry];
    setConversations((prev) => ({ ...prev, [activeModel]: newHistory }));
    setBuildingTopic(topic);
    setBuildingSlideCount(count);
    setIsGeneratingPresentation(true);
    try {
      const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
      // Run slides + PDF/DOCX in parallel for best UX
      const [slidesResp, pdfResp] = await Promise.allSettled([
        fetch(`${apiBase}/api/ai/generate-slides`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: topic, slideCount: count }),
        }).then(r => r.json()),
        fetch(`${apiBase}/api/ai/generate-presentation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: topic, slideCount: count }),
        }).then(r => r.json()),
      ]);

      const slidesData = slidesResp.status === "fulfilled" ? slidesResp.value : null;
      const pdfData = pdfResp.status === "fulfilled" ? pdfResp.value : null;

      if (slidesData?.slides?.length) {
        const merged: PresentationData & { pdfBase64?: string; docxBase64?: string } = {
          ...slidesData,
          pdfBase64: pdfData?.pdfBase64,
          docxBase64: pdfData?.docxBase64,
        };
        setActivePresentationData(merged);
        setConversations((prev) => ({
          ...prev,
          [activeModel]: [
            ...newHistory,
            {
              role: ChatMessageRole.assistant,
              content: `Your presentation "${slidesData.title}" (${count} slides) is ready!`,
              isPresentation: true,
              presentationData: merged,
              presentationTitle: slidesData.title,
              presentationPdfBase64: pdfData?.pdfBase64,
              presentationDocxBase64: pdfData?.docxBase64,
            },
          ],
        }));
        resetPresentationState();
      } else if (pdfData?.pdfBase64) {
        setConversations((prev) => ({
          ...prev,
          [activeModel]: [
            ...newHistory,
            {
              role: ChatMessageRole.assistant,
              content: `Your presentation "${pdfData.title}" (${pdfData.totalSlides} slides) is ready! Download it below:`,
              isPresentation: true,
              presentationTitle: pdfData.title,
              presentationPdfBase64: pdfData.pdfBase64,
              presentationDocxBase64: pdfData.docxBase64,
            },
          ],
        }));
        resetPresentationState();
      } else {
        throw new Error("Generation failed");
      }
    } catch {
      toast({ title: "Presentation generation failed", description: "Please try again.", variant: "destructive" });
      setConversations((prev) => ({ ...prev, [activeModel]: currentHistory }));
      resetPresentationState();
    } finally {
      setIsGeneratingPresentation(false);
    }
  };

  const handleModelSelect = (m: Model) => {
    if (m.pro) { setShowProModal(true); return; }
    setActiveModel(m.id);
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

  const ModelIcon = model.icon;

  return (
    <div className="h-screen pt-[72px] bg-slate-50 flex flex-col overflow-hidden">
      {/* Hidden file inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileSelect(e, "image")} />
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.csv,.xlsx" multiple className="hidden" onChange={(e) => handleFileSelect(e, "file")} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileSelect(e, "image")} />

      <div className="flex-1 flex flex-col min-h-0 max-w-3xl mx-auto w-full px-4">

        {/* ── Brand / Empty state ── */}
        {!hasMessages && (
          <div className="flex flex-col items-center justify-center flex-1 gap-5 pb-4">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-xl ring-4 ring-white">
                <img src={`${import.meta.env.BASE_URL}synapse-logo.jpg`} alt="SYNAPSE" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <h1 className="font-display font-bold text-3xl text-foreground tracking-tight">SYNAPSE</h1>
                <p className="text-muted-foreground text-sm mt-1">AI Medical Suite by aethex</p>
              </div>
            </div>
            <ModelPicker models={MODELS} active={activeModel} onSelect={handleModelSelect} />
            <p className="text-center text-muted-foreground text-base max-w-md leading-relaxed px-2">
              {modelGreetings[activeModel]}
            </p>
            {!isProLocked && (
              <div className="flex flex-wrap gap-2 justify-center">
                {quickSuggestions[activeModel].map((q) => (
                  <button key={q} type="button" onClick={() => setInput(q)}
                    className="text-sm bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 px-4 py-2 rounded-full transition-colors shadow-sm">
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Messages ── */}
        {hasMessages && (
          <div className="flex-1 min-h-0 overflow-y-auto py-4 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <ModelPicker models={MODELS} active={activeModel} onSelect={handleModelSelect} compact />
              <Button variant="ghost" size="sm" onClick={() => { setConversations((p) => ({ ...p, [activeModel]: [] })); setChatMode("normal"); setAttachments([]); resetPresentationState(); }}
                className="text-xs text-muted-foreground">
                <RefreshCcw className="w-3 h-3 mr-1.5" /> New chat
              </Button>
            </div>

            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-3", msg.role === ChatMessageRole.user ? "self-end flex-row-reverse max-w-[88%]" : "self-start max-w-[92%]")}>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 overflow-hidden",
                  msg.role === ChatMessageRole.user ? "bg-slate-200" : "ring-2 ring-white shadow-sm")}>
                  {msg.role === ChatMessageRole.user
                    ? <User className="w-4 h-4 text-slate-600" />
                    : <img src={`${import.meta.env.BASE_URL}synapse-logo.jpg`} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className={cn("rounded-2xl shadow-sm overflow-hidden",
                  msg.role === ChatMessageRole.user
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm")}>
                  <div className="px-5 py-4 text-[15px] leading-relaxed">{msg.content}</div>
                  {(msg as ExtendedMessage).imageUrl && (
                    <div className="px-4 pb-4">
                      <img
                        src={(msg as ExtendedMessage).imageUrl}
                        alt="SYNAPSE generated medical illustration"
                        className="w-full rounded-xl border border-slate-100 object-contain max-h-[480px]"
                      />
                      <a
                        href={(msg as ExtendedMessage).imageUrl}
                        download="synapse-image.png"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" /> Download image
                      </a>
                    </div>
                  )}
                  {(msg as ExtendedMessage).slideCountOptions && (
                    <div className="px-4 pb-4">
                      <div className="flex flex-wrap gap-2">
                        {(msg as ExtendedMessage).slideCountOptions!.map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => handleSlideCountSelect(n)}
                            disabled={isGeneratingPresentation}
                            className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-sm font-semibold hover:bg-amber-100 hover:border-amber-500 disabled:opacity-40 transition-all"
                          >
                            {n} slides
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {(msg as ExtendedMessage).isPresentation && (
                    <div className="px-4 pb-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                          <Presentation className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 truncate">
                          {(msg as ExtendedMessage).presentationTitle}
                        </span>
                      </div>
                      {(msg as ExtendedMessage).presentationData && (
                        <button
                          onClick={() => setActivePresentationData((msg as ExtendedMessage).presentationData ?? null)}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-all shadow-md"
                          style={{ background: "linear-gradient(135deg, #060D1F 0%, #0D2137 100%)", border: "1px solid #00BCD4" }}
                        >
                          <PlayCircle className="w-4 h-4" style={{ color: "#00BCD4" }} />
                          <span>View Presentation</span>
                          <span className="ml-auto text-[10px] opacity-60">
                            {(msg as ExtendedMessage).presentationData!.slides.length} slides
                          </span>
                        </button>
                      )}
                      {(msg as ExtendedMessage).presentationPdfBase64 && (
                        <a
                          href={`data:application/pdf;base64,${(msg as ExtendedMessage).presentationPdfBase64}`}
                          download={`${(msg as ExtendedMessage).presentationTitle ?? "presentation"}.pdf`}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Download PDF
                        </a>
                      )}
                      {(msg as ExtendedMessage).presentationDocxBase64 && (
                        <a
                          href={`data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${(msg as ExtendedMessage).presentationDocxBase64}`}
                          download={`${(msg as ExtendedMessage).presentationTitle ?? "presentation"}.docx`}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Download DOCX
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {(chatMutation.isPending || isGeneratingImage) && (
              <div className="flex gap-3 max-w-[92%] self-start">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0 mt-1">
                  <img src={`${import.meta.env.BASE_URL}synapse-logo.jpg`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white border border-slate-100 rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-slate-500">
                    {isGeneratingImage
                      ? "SYNAPSE is generating your medical illustration..."
                      : `SYNAPSE · ${model.name} ${model.version} is thinking...`}
                  </span>
                </div>
              </div>
            )}

            {isGeneratingPresentation && (
              <div className="flex gap-3 max-w-[95%] self-start w-full">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0 mt-1">
                  <img src={`${import.meta.env.BASE_URL}synapse-logo.jpg`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 rounded-2xl rounded-tl-sm overflow-hidden bg-white border border-slate-100 shadow-sm">
                  <div className="px-4 pt-3 pb-2 text-xs text-slate-500 font-medium flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                    SYNAPSE is composing your {buildingSlideCount}-slide presentation...
                  </div>
                  <PresentationBuildingAnimation topic={buildingTopic} slideCount={buildingSlideCount} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* ── Input area ── */}
        <div className="shrink-0 pb-4">
          {isProLocked ? (
            <div className="bg-white border-2 border-violet-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Nova 4.6 is a Pro model</p>
                  <p className="text-xs text-muted-foreground">Upgrade to unlock advanced diagnostics & research</p>
                </div>
              </div>
              <button onClick={() => setShowProModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md text-sm whitespace-nowrap">
                <Crown className="w-4 h-4" /> Upgrade to Pro
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}
              className="bg-white border-2 border-slate-200 focus-within:border-primary rounded-2xl shadow-sm transition-all overflow-hidden">

              {/* Active mode banner */}
              {chatMode !== "normal" && (
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 border-b text-xs font-semibold",
                  chatMode === "deep-research"
                    ? "bg-blue-50 border-blue-100 text-blue-700"
                    : chatMode === "create-presentation"
                    ? "bg-amber-50 border-amber-100 text-amber-700"
                    : "bg-purple-50 border-purple-100 text-purple-700"
                )}>
                  {chatMode === "deep-research"
                    ? <><Microscope className="w-3.5 h-3.5" /> Deep Research mode — SYNAPSE will scan medical literature</>
                    : chatMode === "create-presentation"
                    ? <><Presentation className="w-3.5 h-3.5" />
                        {presentationStage === "idle"
                          ? " Presentation mode — describe the topic for your presentation"
                          : " Presentation mode — select the number of slides from the options above"}
                      </>
                    : <><ImagePlus className="w-3.5 h-3.5" /> Image generation mode — describe the medical image you want</>
                  }
                  <button type="button" onClick={() => toggleMode(chatMode)} className="ml-auto hover:opacity-70">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Attachment previews */}
              {attachments.length > 0 && (
                <div className="flex gap-2 px-4 pt-3 flex-wrap">
                  {attachments.map((a) => (
                    <div key={a.id} className="relative group flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 text-xs text-slate-700 max-w-[160px]">
                      {a.type === "image" && a.previewUrl
                        ? <img src={a.previewUrl} alt={a.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        : <FileText className="w-5 h-5 text-slate-500 shrink-0" />
                      }
                      <div className="min-w-0">
                        <p className="truncate font-medium leading-tight">{a.name}</p>
                        <p className="text-slate-400">{a.size}</p>
                      </div>
                      <button type="button" onClick={() => removeAttachment(a.id)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-500 text-white rounded-full items-center justify-center hidden group-hover:flex">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Text area */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
                placeholder={
                  chatMode === "create-image"
                    ? "Describe the medical image or illustration you want to create..."
                    : chatMode === "deep-research"
                    ? "What topic should SYNAPSE research deeply?"
                    : chatMode === "create-presentation" && presentationStage === "idle"
                    ? "Enter the topic for your presentation (e.g. Human Brain, Cardiac Anatomy)..."
                    : chatMode === "create-presentation" && presentationStage === "waiting-slide-count"
                    ? "Select the number of slides using the buttons above..."
                    : `Message SYNAPSE · ${model.name} ${model.version}...`
                }
                rows={1}
                className="w-full px-5 pt-4 pb-2 text-base bg-transparent focus:outline-none resize-none text-foreground placeholder:text-muted-foreground"
                disabled={chatMutation.isPending || isGeneratingPresentation || presentationStage === "waiting-slide-count"}
                style={{ minHeight: "52px", maxHeight: "160px" }}
              />

              {/* Toolbar */}
              <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">
                {/* Left tools */}
                <div className="flex items-center gap-1">

                  {/* Attach button with dropdown */}
                  <div className="relative" ref={attachMenuRef}>
                    <button type="button"
                      onClick={() => setShowAttachMenu((v) => !v)}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                        showAttachMenu ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:bg-slate-100"
                      )}
                      title="Attach files"
                    >
                      <Paperclip className="w-4 h-4" />
                      <ChevronUp className={cn("w-3 h-3 transition-transform", showAttachMenu ? "" : "rotate-180")} />
                    </button>

                    {showAttachMenu && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden w-52 z-30">
                        <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Attach</div>
                        <button type="button" onClick={() => { imageInputRef.current?.click(); }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Image className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold leading-tight">Upload Image</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP</p>
                          </div>
                        </button>
                        <button type="button" onClick={() => { fileInputRef.current?.click(); }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold leading-tight">Upload Document</p>
                            <p className="text-xs text-muted-foreground">PDF, DOCX, TXT, CSV</p>
                          </div>
                        </button>
                        <button type="button" onClick={() => { cameraInputRef.current?.click(); }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <Camera className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold leading-tight">Take Photo</p>
                            <p className="text-xs text-muted-foreground">Use camera</p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Deep Research */}
                  <button type="button"
                    onClick={() => toggleMode("deep-research")}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      chatMode === "deep-research"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "text-slate-500 hover:bg-slate-100 border-transparent"
                    )}
                    title="Deep Research"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Deep Research</span>
                  </button>

                  {/* Create Image */}
                  <button type="button"
                    onClick={() => toggleMode("create-image")}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      chatMode === "create-image"
                        ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                        : "text-slate-500 hover:bg-slate-100 border-transparent"
                    )}
                    title="Create Image"
                  >
                    <ImagePlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Image</span>
                  </button>

                  {/* Create Presentation */}
                  <button type="button"
                    onClick={() => toggleMode("create-presentation")}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border",
                      chatMode === "create-presentation"
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                        : "text-slate-500 hover:bg-slate-100 border-transparent"
                    )}
                    title="Create Presentation"
                  >
                    <Presentation className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Presentation</span>
                  </button>
                </div>

                {/* Right: model badge + send */}
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
                    model.badgeBg, model.textColor
                  )}>
                    <ModelIcon className="w-3 h-3" />
                    {model.name} {model.version}
                  </div>
                  <Button type="submit"
                    size="icon"
                    disabled={(!input.trim() && attachments.length === 0) || chatMutation.isPending || isGeneratingImage || isGeneratingPresentation || presentationStage === "waiting-slide-count"}
                    className="h-8 w-8 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30 transition-all">
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </form>
          )}
          <p className="text-center text-[11px] text-muted-foreground mt-2">
            SYNAPSE can make mistakes. Verify important medical information with a qualified professional.
          </p>
        </div>
      </div>

      {/* ── Pro Modal ── */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowProModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">Upgrade to aethex Pro</h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Unlock <span className="font-bold text-violet-700">SYNAPSE Nova 4.6</span> — our most powerful model for advanced diagnostics, rare disease identification, and deep clinical research.
            </p>
            <ul className="text-left space-y-3 mb-8 text-sm text-slate-700">
              {[
                "Full access to Nova 4.6 advanced reasoning",
                "Complex differential diagnosis & rare diseases",
                "Deep literature synthesis & research summaries",
                "Multispecialty second opinion on demand",
                "Priority responses & no rate limits",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                    <span className="text-violet-600 text-xs font-bold">✓</span>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg mb-3 flex items-center justify-center gap-2 text-base">
              <Crown className="w-5 h-5" /> Upgrade to Pro
            </button>
            <button onClick={() => setShowProModal(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Maybe later
            </button>
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
        />
      )}
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
      `    {`,
      `      "slideNumber": 1, "title": "Introduction",`,
      `      "bullets": ["Definition and overview...", "Epidemiology...",`,
      `                  "Etiology and risk factors...", "Classification..."],`,
      `      "keyFact": "High-yield clinical statistic...",`,
      `      "mindMap": { "center": "${topic.substring(0, 14)}", "nodes": [...] }`,
      `    },`,
      `    {`,
      `      "slideNumber": 2, "title": "Anatomy & Physiology",`,
      `      "bullets": ["Gross anatomy...", "Histology...", "Blood supply...",`,
      `                  "Nerve supply...", "Lymphatics...", "Variations..."],`,
      `      "keyFact": "Anatomical landmark...",`,
      `    },`,
      `    {`,
      `      "slideNumber": 3, "title": "Pathophysiology",`,
      `      "bullets": ["Molecular mechanism...", "Cellular changes...",`,
      `                  "Cascade of events...", "Structural impact..."],`,
      `    },`,
      `    ... composing ${Math.max(slideCount - 3, 1)} more slides ...`,
      `  ],`,
      `  "quickReference": [`,
      `    { "term": "Pathology", "definition": "..." },`,
      `    { "term": "Etiology", "definition": "..." }`,
      `  ]`,
      `}`,
      `> drawing ${slideCount} mind-map diagrams...`,
      `> rendering slide layouts (${slideCount} pages)...`,
      `> embedding fonts: HelveticaBold, Helvetica...`,
      `> compiling PDF with pdf-lib...`,
      `> encoding DOCX document...`,
      `> finalizing download package...`,
    ];

    let i = 0;
    const interval = setInterval(() => {
      setLines((prev) => {
        const next = [...prev, phases[i % phases.length]];
        return next.slice(-16);
      });
      i++;
      if (i >= phases.length) i = Math.max(phases.length - 10, 6);
    }, 155);
    return () => clearInterval(interval);
  }, [topicShort, topic, slideCount]);

  return (
    <div className="font-mono text-xs overflow-hidden bg-[#0d1117] border-t border-slate-700">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161b22] border-b border-slate-700/60">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-1.5 text-[10px] text-slate-400 font-sans">synapse_presentation_builder.json</span>
      </div>
      <div className="px-4 py-3 space-y-0.5 min-h-[160px] max-h-[220px] overflow-hidden">
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "leading-[18px] whitespace-pre",
              line.startsWith(">")
                ? "text-emerald-400"
                : line.includes('"title"') || line.includes('"subtitle"')
                ? "text-amber-300"
                : line.includes('"bullets"') || line.includes('"mindMap"') || line.includes('"quickReference"')
                ? "text-sky-300"
                : line.includes('"keyFact"') || line.includes('"term"')
                ? "text-violet-300"
                : line.startsWith("    ...") || line.startsWith("  //")
                ? "text-slate-500 italic"
                : line === "{" || line === "}" || line === "  ],"
                ? "text-slate-400"
                : "text-slate-300"
            )}
          >
            {line}
            {i === lines.length - 1 && (
              <span className="animate-pulse text-emerald-400 ml-0.5">█</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ModelPicker({
  models, active, onSelect, compact = false,
}: {
  models: Model[];
  active: ModelId;
  onSelect: (m: Model) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2", compact ? "flex-row" : "flex-row flex-wrap justify-center")}>
      {models.map((m) => {
        const isActive = m.id === active && !m.pro;
        const Icon = m.icon;
        return (
          <button key={m.id} onClick={() => onSelect(m)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all",
              m.pro
                ? "border-violet-300 bg-violet-50 text-violet-700 hover:border-violet-500"
                : isActive
                ? `${m.color} text-white border-transparent shadow-md`
                : `${m.badgeBg} ${m.textColor}`
            )}>
            {m.pro && !isActive ? <Lock className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
            {m.name}
            <span className={cn("text-[10px] font-normal opacity-80", isActive ? "text-white" : "")}>
              {m.version}
            </span>
            {m.pro && (
              <span className="ml-0.5 bg-violet-600 text-white text-[9px] font-bold px-1 py-0.5 rounded-full">PRO</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
