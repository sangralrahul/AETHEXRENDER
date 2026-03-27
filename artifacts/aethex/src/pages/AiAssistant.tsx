import { useState, useRef, useEffect } from "react";
import { Send, BrainCircuit, Sparkles, User, Loader2, RefreshCcw } from "lucide-react";
import { useAiChat } from "@workspace/api-client-react";
import { type ChatMessage, ChatMessageRole } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: ChatMessageRole.assistant,
      content: "Hello! I am the AETHEX AI Medical Assistant. I can help you find products, compare equipment specifications, or provide quick reference information. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatMutation = useAiChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const userMsg = input.trim();
    setInput("");
    
    const newHistory = [...messages, { role: ChatMessageRole.user, content: userMsg }];
    setMessages(newHistory);

    chatMutation.mutate(
      { 
        data: { 
          message: userMsg,
          conversationHistory: messages
        } 
      },
      {
        onSuccess: (data) => {
          setMessages([
            ...newHistory,
            { role: ChatMessageRole.assistant, content: data.message }
          ]);
        }
      }
    );
  };

  const handleClear = () => {
    setMessages([
      {
        role: ChatMessageRole.assistant,
        content: "Chat cleared. How can I assist you?"
      }
    ]);
  };

  return (
    <div className="min-h-screen pt-[72px] bg-slate-50 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 py-6 flex-1 flex flex-col h-[calc(100vh-72px)]">
        
        {/* Header */}
        <div className="bg-white rounded-t-3xl shadow-sm border border-border/50 p-6 flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
              <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-full relative z-10 shadow-lg">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">AETHEX Assistant</h1>
              <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Online & Ready
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleClear} className="text-xs">
            <RefreshCcw className="w-3 h-3 mr-2" /> Clear Chat
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white border-x border-border/50 p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === ChatMessageRole.user ? "self-end flex-row-reverse" : "self-start"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                msg.role === ChatMessageRole.user 
                  ? "bg-slate-200" 
                  : "bg-primary/10"
              )}>
                {msg.role === ChatMessageRole.user ? (
                  <User className="w-4 h-4 text-slate-600" />
                ) : (
                  <Sparkles className="w-4 h-4 text-primary" />
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
            <div className="flex gap-4 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-slate-500 font-medium">Analyzing medical data...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.03)] border border-border/50 p-4 sm:p-6 z-10 relative">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a product or medical requirement..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-5 pr-14 py-4 text-base focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
              disabled={chatMutation.isPending}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || chatMutation.isPending}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl h-10 w-10 bg-primary hover:bg-primary/90 hover:scale-105 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            <button type="button" onClick={() => setInput("Which stethoscope is best for a cardiology student?")} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors">Best Cardiology Stethoscope?</button>
            <button type="button" onClick={() => setInput("Recommend standard scrubs for intensive care units.")} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors">ICU Scrubs?</button>
          </div>
        </div>

      </div>
    </div>
  );
}
