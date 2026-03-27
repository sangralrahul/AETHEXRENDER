import { useState, useRef, useEffect } from "react";
import { Send, BrainCircuit, Sparkles, User, Loader2, RefreshCcw, Heart, Zap, Brain } from "lucide-react";
import { useAiChat } from "@workspace/api-client-react";
import { type ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AgentId = "synapse" | "brain100" | "heart143";

interface Agent {
  id: AgentId;
  name: string;
  subtitle: string;
  specialty: string;
  icon: React.ElementType;
  gradient: string;
  badgeColor: string;
  borderColor: string;
  greeting: string;
  placeholder: string;
}

const AGENTS: Agent[] = [
  {
    id: "synapse",
    name: "SYNAPSE",
    subtitle: "General Medical AI",
    specialty: "Products · NEET-PG · Clinical Queries",
    icon: Zap,
    gradient: "from-[#1E3A8A] to-[#00C4B4]",
    badgeColor: "bg-[#1E3A8A]",
    borderColor: "border-[#1E3A8A]",
    greeting:
      "Hello! I'm SYNAPSE — your primary AETHEX medical assistant. I can help you find products, compare equipment, answer NEET-PG queries, or provide clinical reference. How can I assist you today?",
    placeholder: "Ask about products, exams, or medical queries...",
  },
  {
    id: "brain100",
    name: "BRAIN 100",
    subtitle: "Neurology Specialist",
    specialty: "Neurology · Psychiatry · Cognition",
    icon: Brain,
    gradient: "from-purple-700 to-violet-500",
    badgeColor: "bg-purple-700",
    borderColor: "border-purple-600",
    greeting:
      "Hello! I'm BRAIN 100 — your neurology and cognitive health specialist. I can help with neurological clinical reference, neurology exam prep (NEET-PG / DM), brain anatomy, mental health guidance for doctors, and neuroscience questions. How can I help?",
    placeholder: "Ask about neurology, brain, or psychiatry...",
  },
  {
    id: "heart143",
    name: "HEART 143",
    subtitle: "Cardiology Specialist",
    specialty: "Cardiology · ECG · Cardiac Care",
    icon: Heart,
    gradient: "from-rose-600 to-pink-500",
    badgeColor: "bg-rose-600",
    borderColor: "border-rose-500",
    greeting:
      "Hello! I'm HEART 143 — your cardiology specialist. I can assist with ECG interpretation, cardiac drug protocols, hypertension guidelines, DM Cardiology exam prep, and recommending the best stethoscopes and BP monitors for cardiologists. Ready to help!",
    placeholder: "Ask about cardiology, ECG, or cardiac care...",
  },
];

export default function AiAssistant() {
  const [activeAgentId, setActiveAgentId] = useState<AgentId>("synapse");
  const [conversations, setConversations] = useState<Record<AgentId, ChatMessage[]>>({
    synapse: [{ role: ChatMessageRole.assistant, content: AGENTS[0].greeting }],
    brain100: [{ role: ChatMessageRole.assistant, content: AGENTS[1].greeting }],
    heart143: [{ role: ChatMessageRole.assistant, content: AGENTS[2].greeting }],
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = useAiChat();
  const activeAgent = AGENTS.find((a) => a.id === activeAgentId)!;
  const messages = conversations[activeAgentId];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending, activeAgentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

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
          // @ts-ignore – agent field is not in the generated type but handled by the server
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

  const handleSwitchAgent = (id: AgentId) => {
    setActiveAgentId(id);
    setInput("");
  };

  const AgentIcon = activeAgent.icon;

  return (
    <div className="h-screen pt-[72px] bg-slate-50 flex flex-col overflow-hidden">
      <div className="max-w-4xl mx-auto w-full px-4 py-4 flex-1 flex flex-col min-h-0">

        {/* Agent Selector */}
        <div className="mb-3 grid grid-cols-3 gap-3 shrink-0">
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            const isActive = agent.id === activeAgentId;
            return (
              <button
                key={agent.id}
                onClick={() => handleSwitchAgent(agent.id)}
                className={cn(
                  "flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 rounded-2xl border-2 transition-all text-left",
                  isActive
                    ? `${agent.borderColor} bg-white shadow-md scale-[1.02]`
                    : "border-slate-200 bg-white/60 hover:bg-white hover:border-slate-300"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br text-white shadow-sm",
                    agent.gradient
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className={cn("font-display font-bold text-sm leading-tight", isActive ? "text-foreground" : "text-slate-500")}>
                    {agent.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight hidden sm:block truncate">
                    {agent.subtitle}
                  </p>
                </div>
                {isActive && (
                  <span className="ml-auto hidden sm:flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Chat Header */}
        <div className="bg-white rounded-t-3xl shadow-sm border border-border/50 p-4 sm:p-6 flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={cn("absolute inset-0 rounded-full animate-ping opacity-30 bg-gradient-to-br", activeAgent.gradient)} />
              <div className={cn("p-3 rounded-full relative z-10 shadow-lg bg-gradient-to-br text-white", activeAgent.gradient)}>
                <AgentIcon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">{activeAgent.name}</h1>
              <p className="text-xs text-muted-foreground">{activeAgent.specialty}</p>
              <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Online & Ready
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleClear} className="text-xs rounded-xl">
            <RefreshCcw className="w-3 h-3 mr-2" /> Clear Chat
          </Button>
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
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                  msg.role === ChatMessageRole.user
                    ? "bg-slate-200"
                    : cn("bg-gradient-to-br text-white", activeAgent.gradient)
                )}
              >
                {msg.role === ChatMessageRole.user ? (
                  <User className="w-4 h-4 text-slate-600" />
                ) : (
                  <AgentIcon className="w-4 h-4" />
                )}
              </div>
              <div
                className={cn(
                  "px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                  msg.role === ChatMessageRole.user
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-sm"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex gap-3 max-w-[88%] self-start">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-gradient-to-br text-white", activeAgent.gradient)}>
                <AgentIcon className="w-4 h-4" />
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
        <div className="bg-white rounded-b-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.04)] border border-border/50 p-4 sm:p-6 z-10 relative">
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

          {/* Quick Suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {AGENTS.find((a) => a.id === activeAgentId)
              ? (activeAgentId === "synapse"
                  ? ["Best stethoscope for students?", "NEET-PG 2025 books?", "BP machine for clinic?"]
                  : activeAgentId === "brain100"
                  ? ["Cranial nerve exam?", "Top neurology books?", "Doctor burnout tips?"]
                  : ["Read a 12-lead ECG?", "Best cardiology stethoscope?", "DM Cardiology prep?"]
                ).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setInput(q)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))
              : null}
          </div>
        </div>

      </div>
    </div>
  );
}
