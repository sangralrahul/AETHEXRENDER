import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { X, Send, BotMessageSquare, ChevronDown, Sparkles } from "lucide-react";
import CadusLogo from "./CadusLogo";

const STORAGE_KEY = "cadus_quick_chat_v1";
const HIDDEN_ROUTES = ["/ai-assistant"];

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

function loadHistory(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(msgs: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-60)));
  } catch {}
}

function AssistantBubble({ content }: { content: string }) {
  const paragraphs = content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  return (
    <div className="flex flex-col gap-1.5">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-sm leading-relaxed" style={{ color: "#1C1C1E", whiteSpace: "pre-wrap" }}>
          {p.split("\n").map((line, j) => (
            <span key={j}>{line}{j < p.split("\n").length - 1 && <br />}</span>
          ))}
        </p>
      ))}
    </div>
  );
}

export default function CadusQuickConsult() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => loadHistory());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  const isHidden = HIDDEN_ROUTES.some(r => location === r || location.startsWith(r + "/"));

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text, ts: Date.now() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const history = updated.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const resp = await fetch(`${apiBase}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: history.slice(0, -1),
          agent: "pulse45",
          mode: "normal",
        }),
      });
      const data = await resp.json();
      const reply = data.message ?? "Sorry, I couldn't process that. Please try again.";
      const assistantMsg: Message = { role: "assistant", content: reply, ts: Date.now() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Network error. Please check your connection and try again.",
        ts: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, apiBase]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isHidden) return null;

  return (
    <>
      {/* ── Backdrop (mobile only) ── */}
      {open && (
        <div
          className="fixed inset-0 z-[89] sm:hidden"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Chat Drawer ── */}
      <div
        className="fixed z-[90] transition-all duration-300 ease-out"
        style={{
          bottom: open ? 0 : "-520px",
          right: 0,
          width: "100%",
          maxWidth: "min(420px, 100vw)",
          height: "520px",
          borderRadius: "18px 18px 0 0",
          overflow: "hidden",
          background: "#FFFFFF",
          boxShadow: open
            ? "0 -8px 48px rgba(0,0,0,0.16), 0 0 0 1px rgba(60,60,67,0.1)"
            : "none",
          pointerEvents: open ? "auto" : "none",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{
            background: "linear-gradient(135deg, #007AFF 0%, #00C2A8 100%)",
            minHeight: 58,
          }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <CadusLogo size="sm" thinking={loading} className="scale-75" />
            </div>
            <div>
              <p className="font-bold text-sm text-white leading-tight">Cadus AI</p>
              <p className="text-xs text-white/70 leading-tight">Medical quick consult</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}>
              Powered by Cadus
            </span>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
              style={{ background: "rgba(255,255,255,0.15)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3"
          style={{ height: "calc(520px - 58px - 64px)", overflowY: "auto" }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.12) 0%, rgba(0,194,168,0.12) 100%)" }}>
                <BotMessageSquare className="w-6 h-6" style={{ color: "#007AFF" }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "#1C1C1E" }}>Ask Cadus AI anything</p>
                <p className="text-xs mt-1" style={{ color: "#8E8E93" }}>Drug info · Dosages · Clinical questions</p>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center mt-1">
                {["What is metformin used for?", "Signs of PE?", "Normal INR range?"].map(q => (
                  <button key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    className="text-xs px-3 py-1.5 rounded-full transition-all"
                    style={{ background: "rgba(0,122,255,0.08)", color: "#007AFF", border: "1px solid rgba(0,122,255,0.15)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,122,255,0.14)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,122,255,0.08)")}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
              {msg.role === "assistant" && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
              <div
                className="max-w-[80%] px-3 py-2.5 rounded-2xl text-sm"
                style={msg.role === "user"
                  ? { background: "linear-gradient(135deg,#007AFF,#0056CC)", color: "#FFFFFF", borderRadius: "18px 18px 4px 18px" }
                  : { background: "#F2F2F7", color: "#1C1C1E", borderRadius: "4px 18px 18px 18px" }}
              >
                {msg.role === "assistant"
                  ? <AssistantBubble content={msg.content} />
                  : <p className="text-sm leading-relaxed">{msg.content}</p>
                }
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="px-3 py-2.5 rounded-2xl flex items-center gap-1.5"
                style={{ background: "#F2F2F7", borderRadius: "4px 18px 18px 18px" }}>
                {[0, 1, 2].map(d => (
                  <span key={d} className="w-1.5 h-1.5 rounded-full block"
                    style={{
                      background: "#007AFF",
                      opacity: 0.6,
                      animation: `cadus-dot-bounce 1.2s ease-in-out ${d * 0.2}s infinite`,
                    }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="px-3 py-2.5 flex items-end gap-2 shrink-0"
          style={{ borderTop: "1px solid rgba(60,60,67,0.1)", background: "#FFFFFF" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a medical question…"
            rows={1}
            className="flex-1 text-sm resize-none outline-none rounded-xl px-3 py-2.5"
            style={{
              background: "#F2F2F7",
              border: "1.5px solid rgba(60,60,67,0.1)",
              color: "#1C1C1E",
              maxHeight: 80,
              minHeight: 40,
              transition: "border-color 0.15s",
            }}
            onFocus={e => (e.target.style.borderColor = "#007AFF")}
            onBlur={e => (e.target.style.borderColor = "rgba(60,60,67,0.1)")}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
            style={{
              background: input.trim() && !loading
                ? "linear-gradient(135deg,#007AFF,#00C2A8)"
                : "rgba(120,120,128,0.15)",
            }}
          >
            <Send className="w-4 h-4"
              style={{ color: input.trim() && !loading ? "#FFFFFF" : "#AEAEB2" }} />
          </button>
        </div>
      </div>

      {/* ── Floating Action Button ── */}
      <div
        className="fixed z-[88] flex items-center gap-2 transition-all duration-200"
        style={{
          bottom: 24,
          right: 24,
          pointerEvents: open ? "none" : "auto",
          opacity: open ? 0 : 1,
          transform: open ? "scale(0.85)" : "scale(1)",
        }}
      >
        {/* Hover label */}
        <div
          className="transition-all duration-200 overflow-hidden"
          style={{
            maxWidth: showLabel ? 110 : 0,
            opacity: showLabel ? 1 : 0,
          }}
        >
          <span className="whitespace-nowrap text-sm font-bold px-3 py-2 rounded-xl block"
            style={{
              background: "#1C1C1E",
              color: "#FFFFFF",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            }}>
            Ask Cadus
          </span>
        </div>

        <button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setShowLabel(true)}
          onMouseLeave={() => setShowLabel(false)}
          onFocus={() => setShowLabel(true)}
          onBlur={() => setShowLabel(false)}
          aria-label="Ask Cadus AI"
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: "linear-gradient(135deg,#007AFF 0%,#00C2A8 100%)",
            boxShadow: "0 6px 24px rgba(0,122,255,0.35), 0 2px 8px rgba(0,0,0,0.15)",
          }}
          onMouseEnter={e => {
            setShowLabel(true);
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(0,122,255,0.45), 0 2px 8px rgba(0,0,0,0.2)";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.06)";
          }}
          onMouseLeave={e => {
            setShowLabel(false);
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(0,122,255,0.35), 0 2px 8px rgba(0,0,0,0.15)";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          <CadusLogo size="sm" className="scale-[0.72]" />
        </button>
      </div>

      {/* Dot bounce keyframes */}
      <style>{`
        @keyframes cadus-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
