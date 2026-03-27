import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Loader2, RefreshCcw, Activity, FlaskConical, Lock, Crown } from "lucide-react";
import { useAiChat } from "@workspace/api-client-react";
import { type ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AgentId = "synapse" | "pulse45" | "flux36" | "nova46";

interface Agent {
  id: AgentId;
  name: string;
  version: string;
  subtitle: string;
  specialty: string;
  iconType: "image" | "lucide";
  icon?: React.ElementType;
  imageSrc?: string;
  gradient: string;
  borderColor: string;
  greeting: string;
  placeholder: string;
  pro?: boolean;
}

const AGENTS: Agent[] = [
  {
    id: "synapse",
    name: "SYNAPSE",
    version: "",
    subtitle: "General Medical AI",
    specialty: "Products · NEET-PG · Clinical Queries",
    iconType: "image",
    imageSrc: "",
    gradient: "from-[#3B82F6] to-[#00C4B4]",
    borderColor: "border-[#3B82F6]",
    greeting:
      "Hello! I'm SYNAPSE — your primary aethex medical assistant. I can help you find products, compare equipment, answer NEET-PG queries, or provide clinical reference. How can I assist you today?",
    placeholder: "Ask about products, exams, or medical queries...",
  },
  {
    id: "pulse45",
    name: "PULSE",
    version: "4.5",
    subtitle: "Vitals & Emergency",
    specialty: "Critical Care · Vitals · Emergency Medicine",
    iconType: "lucide",
    icon: Activity,
    gradient: "from-emerald-500 to-teal-400",
    borderColor: "border-emerald-500",
    greeting:
      "Hello! I'm PULSE 4.5 — your emergency medicine and vitals specialist. I can help with vital sign interpretation, ACLS protocols, ICU management, monitoring equipment, and critical care guidelines. Ready to assist!",
    placeholder: "Ask about vitals, emergency protocols, or critical care...",
  },
  {
    id: "flux36",
    name: "FLUX",
    version: "3.6",
    subtitle: "Pharmacology & Labs",
    specialty: "Drugs · Biochemistry · Lab Values",
    iconType: "lucide",
    icon: FlaskConical,
    gradient: "from-orange-500 to-amber-400",
    borderColor: "border-orange-500",
    greeting:
      "Hello! I'm FLUX 3.6 — your pharmacology and laboratory medicine specialist. I can help with drug interactions, dosage calculations, antibiotic selection, lab value interpretation, and NEET-PG pharmacology prep. How can I help?",
    placeholder: "Ask about drugs, lab values, or pharmacology...",
  },
  {
    id: "nova46",
    name: "NOVA",
    version: "4.6",
    subtitle: "Advanced Research AI",
    specialty: "Diagnostics · Research · Multispecialty",
    iconType: "lucide",
    icon: Crown,
    gradient: "from-violet-600 to-purple-500",
    borderColor: "border-violet-500",
    greeting:
      "Hello! I'm NOVA 4.6 — aethex's most advanced research and diagnostic AI. Upgrade to Pro to access complex differential diagnosis, rare disease identification, deep literature synthesis, and expert multispecialty reasoning.",
    placeholder: "Upgrade to Pro to chat with NOVA 4.6...",
    pro: true,
  },
];

export default function AiAssistant() {
  const [activeAgentId, setActiveAgentId] = useState<AgentId>("synapse");
  const [showProModal, setShowProModal] = useState(false);
  const [conversations, setConversations] = useState<Record<AgentId, ChatMessage[]>>({
    synapse: [{ role: ChatMessageRole.assistant, content: AGENTS[0].greeting }],
    pulse45: [{ role: ChatMessageRole.assistant, content: AGENTS[1].greeting }],
    flux36: [{ role: ChatMessageRole.assistant, content: AGENTS[2].greeting }],
    nova46: [{ role: ChatMessageRole.assistant, content: AGENTS[3].greeting }],
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = useAiChat();
  const activeAgent = AGENTS.find((a) => a.id === activeAgentId)!;
  const messages = conversations[activeAgentId];
  const isProLocked = activeAgent.pro;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending, activeAgentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending || isProLocked) return;

    const userMsg = input.trim();
    setInput("");

    const currentHistory = conversations[activeAgentId];
    const newHistory: ChatMessage[] = [
      ...currentHistory,
      { role: ChatMessageRole.user, content: userMsg },
    ];
    setConversations((prev) => ({ ...prev, [activeAgentId]: newHistory }));

    chatMutation.mutate(
      {
        data: {
          message: userMsg,
          conversationHistory: currentHistory,
          // @ts-ignore
          agent: activeAgentId,
        },
      },
      {
        onSuccess: (data) => {
          setConversations((prev) => ({
            ...prev,
            [activeAgentId]: [
              ...newHistory,
              { role: ChatMessageRole.assistant, content: data.message },
            ],
          }));
        },
      }
    );
  };

  const handleClear = () => {
    setConversations((prev) => ({
      ...prev,
      [activeAgentId]: [
        { role: ChatMessageRole.assistant, content: activeAgent.greeting },
      ],
    }));
  };

  const handleAgentClick = (agent: Agent) => {
    if (agent.pro) {
      setShowProModal(true);
      return;
    }
    setActiveAgentId(agent.id);
    setInput("");
  };

  const quickSuggestions: Record<AgentId, string[]> = {
    synapse: ["Best stethoscope for students?", "NEET-PG 2025 books?", "BP machine for clinic?"],
    pulse45: ["Normal SpO2 range?", "ACLS for cardiac arrest?", "Best ICU pulse oximeter?"],
    flux36: ["Warfarin drug interactions?", "Normal LFT values?", "CAP antibiotic choice?"],
    nova46: ["Rare autoimmune mimicking SLE?", "Complex multimorbidity regimen?", "Latest ACC guidelines?"],
  };

  return (
    <div className="h-screen pt-[72px] bg-slate-50 flex flex-col overflow-hidden">
      <div className="max-w-4xl mx-auto w-full px-4 py-4 flex-1 flex flex-col min-h-0">

        {/* Agent Selector */}
        <div className="mb-3 grid grid-cols-4 gap-2.5 shrink-0">
          {AGENTS.map((agent) => {
            const isActive = agent.id === activeAgentId && !agent.pro;
            const Icon = agent.icon;
            return (
              <button
                key={agent.id}
                onClick={() => handleAgentClick(agent)}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all text-center",
                  agent.pro
                    ? "border-violet-200 bg-gradient-to-b from-violet-50 to-white hover:border-violet-400 cursor-pointer"
                    : isActive
                    ? `${agent.borderColor} bg-white shadow-md scale-[1.02]`
                    : "border-slate-200 bg-white/60 hover:bg-white hover:border-slate-300"
                )}
              >
                {/* Pro badge */}
                {agent.pro && (
                  <span className="absolute -top-2 -right-1 bg-violet-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5" /> PRO
                  </span>
                )}

                {/* Icon */}
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br text-white shadow-sm overflow-hidden",
                  agent.gradient
                )}>
                  {agent.iconType === "image" ? (
                    <img
                      src={`${import.meta.env.BASE_URL}synapse-logo.jpg`}
                      alt="SYNAPSE"
                      className="w-full h-full object-cover"
                    />
                  ) : agent.pro ? (
                    <Lock className="w-5 h-5 opacity-80" />
                  ) : (
                    Icon && <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Name */}
                <div className="min-w-0 w-full">
                  <p className={cn(
                    "font-display font-bold text-xs leading-tight",
                    isActive ? "text-foreground" : agent.pro ? "text-violet-700" : "text-slate-500"
                  )}>
                    {agent.name}
                    {agent.version && (
                      <span className="ml-0.5 text-[9px] font-semibold opacity-70">{agent.version}</span>
                    )}
                  </p>
                  <p className="text-[9px] text-muted-foreground leading-tight truncate hidden sm:block">
                    {agent.pro ? "Upgrade to unlock" : agent.subtitle}
                  </p>
                </div>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Chat Header */}
        <div className="bg-white rounded-t-3xl shadow-sm border border-border/50 p-4 sm:p-5 flex items-center justify-between z-10 relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={cn("absolute inset-0 rounded-full animate-ping opacity-20 bg-gradient-to-br", activeAgent.gradient)} />
              <div className={cn(
                "w-12 h-12 rounded-full relative z-10 shadow-lg bg-gradient-to-br text-white flex items-center justify-center overflow-hidden",
                activeAgent.gradient
              )}>
                {activeAgent.iconType === "image" ? (
                  <img
                    src={`${import.meta.env.BASE_URL}synapse-logo.jpg`}
                    alt="SYNAPSE"
                    className="w-full h-full object-cover"
                  />
                ) : activeAgent.pro ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  activeAgent.icon && <activeAgent.icon className="w-6 h-6" />
                )}
              </div>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                {activeAgent.name}
                {activeAgent.version && (
                  <span className="text-sm font-semibold text-muted-foreground">{activeAgent.version}</span>
                )}
                {activeAgent.pro && (
                  <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full font-semibold">PRO</span>
                )}
              </h1>
              <p className="text-xs text-muted-foreground">{activeAgent.specialty}</p>
              {!activeAgent.pro && (
                <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Online & Ready
                </p>
              )}
            </div>
          </div>
          {!activeAgent.pro && (
            <Button variant="outline" size="sm" onClick={handleClear} className="text-xs rounded-xl">
              <RefreshCcw className="w-3 h-3 mr-2" /> Clear Chat
            </Button>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-0 bg-white border-x border-border/50 p-4 sm:p-6 overflow-y-auto flex flex-col gap-5">
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
                  : cn("bg-gradient-to-br text-white", activeAgent.gradient)
              )}>
                {msg.role === ChatMessageRole.user ? (
                  <User className="w-4 h-4 text-slate-600" />
                ) : activeAgent.iconType === "image" ? (
                  <img src={`${import.meta.env.BASE_URL}synapse-logo.jpg`} alt="" className="w-full h-full object-cover" />
                ) : activeAgent.icon ? (
                  <activeAgent.icon className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>
              <div className={cn(
                "px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                msg.role === ChatMessageRole.user
                  ? "bg-primary text-white rounded-tr-sm"
                  : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-sm"
              )}>
                {msg.content}
              </div>
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex gap-3 max-w-[88%] self-start">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-gradient-to-br text-white", activeAgent.gradient)}>
                {activeAgent.icon && <activeAgent.icon className="w-4 h-4" />}
              </div>
              <div className="px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-slate-500 font-medium">{activeAgent.name} is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.04)] border border-border/50 p-4 sm:p-5 z-10 relative shrink-0">
          {isProLocked ? (
            /* Pro upgrade CTA instead of input */
            <div className="flex flex-col items-center gap-3 py-2">
              <p className="text-sm text-muted-foreground text-center">
                NOVA 4.6 is available exclusively on <span className="font-bold text-violet-700">aethex Pro</span>
              </p>
              <button
                onClick={() => setShowProModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 hover:scale-105 transition-all shadow-lg"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Pro — Unlock NOVA 4.6
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={activeAgent.placeholder}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-5 pr-14 py-4 text-base focus:outline-none focus:border-primary focus:bg-white transition-all"
                  disabled={chatMutation.isPending}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || chatMutation.isPending}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 rounded-xl h-10 w-10 bg-gradient-to-br text-white hover:scale-105 transition-all shadow-md border-0",
                    activeAgent.gradient
                  )}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickSuggestions[activeAgentId].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setInput(q)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pro Upgrade Modal */}
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
              Unlock <span className="font-bold text-violet-700">NOVA 4.6</span> — our most powerful AI agent for advanced diagnostics, rare disease identification, and deep clinical research.
            </p>
            <ul className="text-left space-y-3 mb-8 text-sm text-slate-700">
              {[
                "Full access to NOVA 4.6 advanced reasoning",
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
