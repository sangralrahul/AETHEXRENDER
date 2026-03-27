import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Loader2, RefreshCcw, Activity, FlaskConical, Lock, Crown, ChevronDown } from "lucide-react";
import { useAiChat } from "@workspace/api-client-react";
import { type ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModelId = "pulse45" | "flux36" | "nova46";

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
    "Hello! I'm SYNAPSE running Nova 4.6 — the most powerful model in the SYNAPSE suite. Upgrade to Pro to unlock complex differential diagnosis, rare disease identification, deep literature synthesis, and expert multispecialty reasoning.",
};

const quickSuggestions: Record<ModelId, string[]> = {
  pulse45: ["Normal SpO2 range?", "ACLS for cardiac arrest?", "Best ICU pulse oximeter?"],
  flux36: ["Warfarin drug interactions?", "Normal LFT values?", "CAP antibiotic choice?"],
  nova46: ["Rare autoimmune mimicking SLE?", "Complex multimorbidity regimen?", "Latest ACC guidelines?"],
};

export default function AiAssistant() {
  const [activeModel, setActiveModel] = useState<ModelId>("pulse45");
  const [showProModal, setShowProModal] = useState(false);
  const [conversations, setConversations] = useState<Record<ModelId, ChatMessage[]>>({
    pulse45: [],
    flux36: [],
    nova46: [],
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMutation = useAiChat();

  const model = MODELS.find((m) => m.id === activeModel)!;
  const messages = conversations[activeModel];
  const hasMessages = messages.length > 0;
  const isProLocked = model.pro;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending || isProLocked) return;

    const userMsg = input.trim();
    setInput("");

    const currentHistory = conversations[activeModel];
    const newHistory: ChatMessage[] = [
      ...currentHistory,
      { role: ChatMessageRole.user, content: userMsg },
    ];
    setConversations((prev) => ({ ...prev, [activeModel]: newHistory }));

    chatMutation.mutate(
      {
        data: {
          message: userMsg,
          conversationHistory: currentHistory,
          // @ts-ignore
          agent: activeModel,
        },
      },
      {
        onSuccess: (data) => {
          setConversations((prev) => ({
            ...prev,
            [activeModel]: [
              ...newHistory,
              { role: ChatMessageRole.assistant, content: data.message },
            ],
          }));
        },
      }
    );
  };

  const handleModelSelect = (m: Model) => {
    if (m.pro) {
      setShowProModal(true);
      return;
    }
    setActiveModel(m.id);
    setInput("");
  };

  const handleClear = () => {
    setConversations((prev) => ({ ...prev, [activeModel]: [] }));
  };

  const ModelIcon = model.icon;

  return (
    <div className="h-screen pt-[72px] bg-slate-50 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 max-w-3xl mx-auto w-full px-4">

        {/* ── Brand Header (shown when no messages) ── */}
        {!hasMessages && (
          <div className="flex flex-col items-center justify-center flex-1 gap-6 pb-4">
            {/* SYNAPSE logo */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-xl ring-4 ring-white">
                <img
                  src={`${import.meta.env.BASE_URL}synapse-logo.jpg`}
                  alt="SYNAPSE"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h1 className="font-display font-bold text-3xl text-foreground tracking-tight">SYNAPSE</h1>
                <p className="text-muted-foreground text-sm mt-1">AI Medical Suite by aethex</p>
              </div>
            </div>

            {/* Model picker */}
            <ModelPicker
              models={MODELS}
              active={activeModel}
              onSelect={handleModelSelect}
            />

            {/* Greeting */}
            <p className="text-center text-muted-foreground text-base max-w-md leading-relaxed px-2">
              {modelGreetings[activeModel]}
            </p>

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {quickSuggestions[activeModel].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => !isProLocked && setInput(q)}
                  disabled={isProLocked}
                  className="text-sm bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 px-4 py-2 rounded-full transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Chat messages (shown when conversation exists) ── */}
        {hasMessages && (
          <div className="flex-1 min-h-0 overflow-y-auto py-6 flex flex-col gap-5">
            {/* Model indicator row */}
            <div className="flex items-center justify-between">
              <ModelPicker models={MODELS} active={activeModel} onSelect={handleModelSelect} compact />
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs text-muted-foreground">
                <RefreshCcw className="w-3 h-3 mr-1.5" /> New chat
              </Button>
            </div>

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex gap-3 max-w-[88%]",
                  msg.role === ChatMessageRole.user ? "self-end flex-row-reverse" : "self-start"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 overflow-hidden",
                  msg.role === ChatMessageRole.user
                    ? "bg-slate-200"
                    : "ring-2 ring-white shadow-sm"
                )}>
                  {msg.role === ChatMessageRole.user ? (
                    <User className="w-4 h-4 text-slate-600" />
                  ) : (
                    <img
                      src={`${import.meta.env.BASE_URL}synapse-logo.jpg`}
                      alt="SYNAPSE"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className={cn(
                  "px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                  msg.role === ChatMessageRole.user
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}

            {chatMutation.isPending && (
              <div className="flex gap-3 max-w-[88%] self-start">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0 mt-1">
                  <img src={`${import.meta.env.BASE_URL}synapse-logo.jpg`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white border border-slate-100 rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-slate-500 font-medium">
                    SYNAPSE · {model.name} {model.version} is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* ── Input bar ── */}
        <div className={cn(
          "shrink-0 pb-4",
          !hasMessages && "pb-6"
        )}>
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
              <button
                onClick={() => setShowProModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md text-sm whitespace-nowrap"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white border-2 border-slate-200 focus-within:border-primary rounded-2xl shadow-sm transition-all overflow-hidden"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
                placeholder={`Message SYNAPSE · ${model.name} ${model.version}...`}
                rows={1}
                className="w-full px-5 pt-4 pb-2 text-base bg-transparent focus:outline-none resize-none text-foreground placeholder:text-muted-foreground"
                disabled={chatMutation.isPending}
                style={{ minHeight: "52px", maxHeight: "160px" }}
              />
              <div className="flex items-center justify-between px-4 pb-3 pt-1">
                {/* Active model badge */}
                <div className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
                  model.badgeBg, model.textColor
                )}>
                  <ModelIcon className="w-3 h-3" />
                  {model.name} {model.version}
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || chatMutation.isPending}
                  className="h-8 w-8 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowProModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
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
              <Crown className="w-5 h-5" />
              Upgrade to Pro
            </button>
            <button
              onClick={() => setShowProModal(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Model Picker Component ── */
function ModelPicker({
  models,
  active,
  onSelect,
  compact = false,
}: {
  models: Model[];
  active: ModelId;
  onSelect: (m: Model) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center gap-2",
      compact ? "flex-row" : "flex-row flex-wrap justify-center"
    )}>
      {models.map((m) => {
        const isActive = m.id === active && !m.pro;
        const Icon = m.icon;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all",
              m.pro
                ? "border-violet-300 bg-violet-50 text-violet-700 hover:border-violet-500"
                : isActive
                ? `${m.color} text-white border-transparent shadow-md`
                : `${m.badgeBg} ${m.textColor}`
            )}
          >
            {m.pro && !isActive ? (
              <Lock className="w-3 h-3" />
            ) : (
              <Icon className="w-3 h-3" />
            )}
            {m.name}
            <span className={cn(
              "text-[10px] font-normal opacity-80",
              isActive ? "text-white" : ""
            )}>
              {m.version}
            </span>
            {m.pro && (
              <span className="ml-0.5 bg-violet-600 text-white text-[9px] font-bold px-1 py-0.5 rounded-full">
                PRO
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
