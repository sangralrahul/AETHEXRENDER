import { useState } from "react";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from "lucide-react";

interface MCQ {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

interface MCQQuizProps {
  questions: MCQ[];
  topic: string;
}

export function MCQQuiz({ questions, topic }: MCQQuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<{ selected: string; correct: boolean }[]>([]);

  const q = questions[current];

  const handleSelect = (opt: string) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    const isCorrect = opt.startsWith(q.correct);
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, { selected: opt, correct: isCorrect }]);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-2xl border p-8 text-center" style={{ background: "#161B22", borderColor: "#21262D" }}>
        <Trophy className="w-16 h-16 mx-auto mb-4" style={{ color: "#00C2A8" }} />
        <h3 className="text-2xl font-bold mb-2" style={{ color: "#E6EDF3" }}>Quiz Complete!</h3>
        <p className="text-lg mb-1" style={{ color: "#8B949E" }}>Your Score</p>
        <div className="text-5xl font-bold mb-2" style={{ color: pct >= 70 ? "#238636" : pct >= 50 ? "#E3B341" : "#F85149" }}>
          {score}/{questions.length}
        </div>
        <div className="text-2xl font-semibold mb-6" style={{ color: "#8B949E" }}>{pct}%</div>
        <p className="mb-6 text-sm" style={{ color: "#8B949E" }}>
          {pct >= 70 ? "Excellent! You have a strong grasp of this topic." : pct >= 50 ? "Good effort! Review the missed questions." : "Keep studying! Revise the topic and try again."}
        </p>
        <button onClick={handleReset} className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90" style={{ background: "#00C2A8", color: "#0D1117" }}>
          <RotateCcw className="w-4 h-4" /> Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border" style={{ background: "#161B22", borderColor: "#21262D" }}>
      {/* Progress */}
      <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: "#21262D" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: "#8B949E" }}>Question {current + 1} of {questions.length}</span>
          <span className="text-sm font-semibold" style={{ color: "#00C2A8" }}>Score: {score}/{current}</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: "#21262D" }}>
          <div className="h-full rounded-full transition-all" style={{ background: "#00C2A8", width: `${((current) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <p className="text-base font-medium mb-5 leading-relaxed" style={{ color: "#E6EDF3" }}>{q.question}</p>
        <div className="space-y-3 mb-6">
          {q.options.map((opt) => {
            const isCorrect = opt.startsWith(q.correct);
            const isSelected = selected === opt;
            let borderColor = "#21262D";
            let bg = "#0D1117";
            let textColor = "#E6EDF3";

            if (answered) {
              if (isCorrect) { borderColor = "#238636"; bg = "rgba(35,134,54,0.1)"; textColor = "#7EE787"; }
              else if (isSelected && !isCorrect) { borderColor = "#F85149"; bg = "rgba(248,81,73,0.1)"; textColor = "#F85149"; }
            } else if (isSelected) {
              borderColor = "#00C2A8"; bg = "rgba(0,194,168,0.1)";
            }

            return (
              <button key={opt} onClick={() => handleSelect(opt)}
                className="w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium"
                style={{ background: bg, borderColor, color: textColor, cursor: answered ? "default" : "pointer" }}>
                <span className="flex items-center gap-3">
                  {answered && isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#238636" }} />}
                  {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 shrink-0" style={{ color: "#F85149" }} />}
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="rounded-xl p-4 mb-4 text-sm leading-relaxed" style={{ background: "rgba(0,194,168,0.08)", border: "1px solid rgba(0,194,168,0.2)", color: "#E6EDF3" }}>
            <span className="font-bold" style={{ color: "#00C2A8" }}>Explanation: </span>{q.explanation}
          </div>
        )}

        {answered && (
          <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90" style={{ background: "#00C2A8", color: "#0D1117" }}>
            {current < questions.length - 1 ? "Next Question" : "See Results"} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
