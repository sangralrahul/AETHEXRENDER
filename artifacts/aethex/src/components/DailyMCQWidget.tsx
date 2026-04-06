import { useState, useEffect } from "react";
import { BookOpen, Lock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useUserAuth } from "@/hooks/use-user-auth";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface DailyMCQ {
  id: number;
  question: string;
  options: string[];
  subject: string;
  date: string;
}

interface MCQAnswer {
  correct: string;
  explanation: string;
  subject: string;
}

export function DailyMCQWidget() {
  const { user, getJwt } = useUserAuth();
  const [mcq, setMcq] = useState<DailyMCQ | null>(null);
  const [answer, setAnswer] = useState<MCQAnswer | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/monetization/daily-mcq`)
      .then(r => r.json())
      .then(data => { setMcq(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSelect = async (opt: string) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    const jwt = getJwt();
    const headers: Record<string, string> = {};
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
    const res = await fetch(`${API_BASE}/api/monetization/daily-mcq/answer`, { headers });
    if (res.ok) setAnswer(await res.json());
  };

  if (loading) return (
    <div className="rounded-2xl p-5 animate-pulse" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", height: 200 }} />
  );
  if (!mcq) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(160deg,rgba(10,22,50,0.95) 0%,rgba(13,33,68,0.95) 100%)",
        border: "1px solid rgba(0,194,168,0.2)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      <div className="px-5 pt-5 pb-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,194,168,0.15)" }}>
            <BookOpen className="w-3.5 h-3.5" style={{ color: "#00C2A8" }} />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: "#00C2A8" }}>FREE DAILY MCQ</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{mcq.subject} · {new Date(mcq.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
          </div>
        </div>
        <Link href="/study-hub">
          <button className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:opacity-80"
            style={{ background: "rgba(0,194,168,0.12)", color: "#00C2A8", border: "1px solid rgba(0,194,168,0.2)" }}>
            Study Hub
          </button>
        </Link>
      </div>

      <div className="p-5">
        <p className="text-sm font-medium leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.9)" }}>{mcq.question}</p>

        <div className="space-y-2.5 mb-4">
          {mcq.options.map((opt) => {
            const optLetter = opt.charAt(0);
            const isCorrect = answered && answer && optLetter === answer.correct;
            const isWrong = answered && selected === opt && answer && optLetter !== answer.correct;
            let bg = "rgba(255,255,255,0.04)";
            let border = "rgba(255,255,255,0.08)";
            let textColor = "rgba(255,255,255,0.75)";
            if (answered && selected === opt && !answered) { bg = "rgba(0,194,168,0.12)"; border = "rgba(0,194,168,0.35)"; }
            if (isCorrect) { bg = "rgba(34,197,94,0.12)"; border = "rgba(34,197,94,0.4)"; textColor = "rgba(134,239,172,0.95)"; }
            if (isWrong) { bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.35)"; textColor = "rgba(252,165,165,0.9)"; }

            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={answered}
                className="w-full text-left px-3.5 py-2.5 rounded-xl border text-sm flex items-center gap-2.5 transition-all"
                style={{ background: bg, borderColor: border, color: textColor, cursor: answered ? "default" : "pointer" }}
              >
                {answered && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "#4ade80" }} />}
                {answered && isWrong && <XCircle className="w-3.5 h-3.5 shrink-0" style={{ color: "#f87171" }} />}
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {answered && answer && (
          <div className="rounded-xl p-3.5 text-sm" style={{ background: "rgba(0,194,168,0.07)", border: "1px solid rgba(0,194,168,0.18)" }}>
            {user ? (
              <>
                <p className="font-semibold text-xs mb-1" style={{ color: "#00C2A8" }}>Explanation</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>{answer.explanation}</p>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: "#f59e0b" }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>
                    Sign up to reveal the explanation
                  </p>
                  <Link href="/signup">
                    <span className="text-xs underline" style={{ color: "#00C2A8" }}>Create free account →</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {!answered && (
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Select an option to reveal the answer</p>
        )}
      </div>
    </div>
  );
}
