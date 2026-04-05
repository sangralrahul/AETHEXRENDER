import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Settings, Play, CheckCircle, XCircle, Clock, Trophy, BarChart3, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface MCQ {
  id: string;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  timeLimit: number;
  passMarks: number;
  randomize: boolean;
  questions: MCQ[];
  created: number;
}

interface QuizResult {
  quizId: string;
  answers: (number | null)[];
  score: number;
  timeTaken: number;
  timestamp: number;
}

const STORAGE_QUIZZES = "aethex_quizzes";
const STORAGE_RESULTS = "aethex_quiz_results";

function loadQuizzes(): Quiz[] { try { return JSON.parse(localStorage.getItem(STORAGE_QUIZZES) || "[]"); } catch { return []; } }
function loadResults(): QuizResult[] { try { return JSON.parse(localStorage.getItem(STORAGE_RESULTS) || "[]"); } catch { return []; } }
function saveQuizzes(q: Quiz[]) { localStorage.setItem(STORAGE_QUIZZES, JSON.stringify(q)); }
function saveResults(r: QuizResult[]) { localStorage.setItem(STORAGE_RESULTS, JSON.stringify(r)); }

const BLANK_MCQ = (): MCQ => ({ id: Date.now().toString(), question: "", options: ["", "", "", ""], correct: 0, explanation: "" });

const SAMPLE_QUIZ: Quiz = {
  id: "sample-1", title: "Cardiac Pharmacology High-Yield", subject: "Pharmacology",
  timeLimit: 15, passMarks: 60, randomize: true, created: Date.now() - 86400000,
  questions: [
    { id: "q1", question: "Which beta-blocker has intrinsic sympathomimetic activity (ISA)?", options: ["Atenolol", "Pindolol", "Propranolol", "Metoprolol"], correct: 1, explanation: "Pindolol has ISA — it partially activates beta receptors while blocking catecholamine-induced stimulation. This means less resting bradycardia and less decrease in cardiac output." },
    { id: "q2", question: "Mechanism of action of Digoxin?", options: ["Beta-1 agonist", "K+ channel opener", "Na+/K+ ATPase inhibitor", "Ca2+ channel blocker"], correct: 2, explanation: "Digoxin inhibits Na+/K+ ATPase pump → intracellular Na+ rises → Na+/Ca2+ exchanger brings in more Ca2+ → increased contractility (positive inotropy)." },
    { id: "q3", question: "Drug of choice for acute supraventricular tachycardia?", options: ["Amiodarone", "Adenosine", "Verapamil", "Digoxin"], correct: 1, explanation: "Adenosine is the DOC for acute SVT. It transiently blocks AV node conduction. Very short half-life (10 seconds). Given as rapid IV push." },
  ],
};

export default function QuizBuilder() {
  const [mode, setMode] = useState<"faculty" | "student">("faculty");
  const [view, setView] = useState<"list" | "builder" | "settings" | "test" | "result">("list");
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const q = loadQuizzes();
    return q.length ? q : [SAMPLE_QUIZ];
  });
  const [results, setResults] = useState<QuizResult[]>(loadResults);
  const [editing, setEditing] = useState<Quiz | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showExplain, setShowExplain] = useState<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => { saveQuizzes(quizzes); }, [quizzes]);
  useEffect(() => { saveResults(results); }, [results]);

  function newQuiz() {
    const q: Quiz = { id: Date.now().toString(), title: "", subject: "General", timeLimit: 20, passMarks: 60, randomize: false, questions: [BLANK_MCQ()], created: Date.now() };
    setEditing(q);
    setView("builder");
  }

  function saveQuiz() {
    if (!editing) return;
    setQuizzes(prev => {
      const exists = prev.find(q => q.id === editing.id);
      return exists ? prev.map(q => q.id === editing.id ? editing : q) : [editing, ...prev];
    });
    setView("list");
  }

  function startQuiz(quiz: Quiz) {
    const qs = quiz.randomize ? [...quiz.questions].sort(() => Math.random() - 0.5) : quiz.questions;
    setActiveQuiz({ ...quiz, questions: qs });
    setAnswers(new Array(qs.length).fill(null));
    setCurrentQ(0);
    setSubmitted(false);
    setQuizResult(null);
    setShowExplain(new Set());
    setTimeLeft(quiz.timeLimit * 60);
    setView("test");
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); submitQuiz(qs, new Array(qs.length).fill(null)); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  function submitQuiz(questions?: MCQ[], ans?: (number | null)[]) {
    clearInterval(timerRef.current);
    const qs = questions || activeQuiz!.questions;
    const a = ans || answers;
    const correct = a.filter((ans, i) => ans === qs[i].correct).length;
    const score = Math.round((correct / qs.length) * 100);
    const res: QuizResult = {
      quizId: activeQuiz!.id,
      answers: a,
      score,
      timeTaken: activeQuiz!.timeLimit * 60 - timeLeft,
      timestamp: Date.now(),
    };
    setQuizResult(res);
    setResults(prev => [res, ...prev]);
    setSubmitted(true);
    setView("result");
  }

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen" style={{ background: "#0B0F1A", color: "#fff" }}>
      <div style={{ background: "linear-gradient(135deg,#0B0F1A,#0d0f1a)", borderBottom: "1px solid rgba(34,197,94,0.15)", padding: "48px 0 32px" }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ background: "rgba(34,197,94,0.15)", borderRadius: 12, padding: 10 }}>
              <Settings size={28} style={{ color: "#22c55e" }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Custom Quiz Builder</h1>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>Create · Assign · Grade · Analyse</p>
            </div>
          </div>
          <div className="flex gap-2 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.06)" }}>
            <button onClick={() => { setMode("faculty"); setView("list"); }}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              style={mode === "faculty" ? { background: "#22c55e", color: "#0B0F1A" } : { color: "rgba(255,255,255,0.6)" }}>
              👩‍🏫 Faculty View
            </button>
            <button onClick={() => { setMode("student"); setView("list"); }}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              style={mode === "student" ? { background: "#22c55e", color: "#0B0F1A" } : { color: "rgba(255,255,255,0.6)" }}>
              👨‍🎓 Student View
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* QUIZ LIST */}
        {view === "list" && (
          <div className="space-y-5">
            {mode === "faculty" && (
              <button onClick={newQuiz}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all"
                style={{ background: "#22c55e", color: "#0B0F1A" }}>
                <Plus size={18} /> Create New Quiz
              </button>
            )}

            {quizzes.map(quiz => {
              const myResults = results.filter(r => r.quizId === quiz.id);
              const lastResult = myResults[0];
              return (
                <div key={quiz.id} className="rounded-2xl p-5" style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{quiz.title || "Untitled Quiz"}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80" }}>{quiz.subject}</span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{quiz.questions.length} Qs · {quiz.timeLimit} min · Pass: {quiz.passMarks}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {mode === "faculty" && (
                        <button onClick={() => { setEditing(quiz); setView("builder"); }}
                          className="px-3 py-1.5 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}>
                          Edit
                        </button>
                      )}
                      <button onClick={() => startQuiz(quiz)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold"
                        style={{ background: "#22c55e", color: "#0B0F1A" }}>
                        <Play size={14} /> {mode === "student" ? "Start Quiz" : "Preview"}
                      </button>
                    </div>
                  </div>
                  {lastResult && (
                    <div className="mt-3 flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                      <span>Last attempt: <strong style={{ color: lastResult.score >= quiz.passMarks ? "#22c55e" : "#ef4444" }}>{lastResult.score}%</strong></span>
                      <span>·</span>
                      <span>{myResults.length} attempt{myResults.length > 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* QUIZ BUILDER */}
        {view === "builder" && editing && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <button onClick={() => setView("list")} className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>← Back</button>
              <h2 className="font-semibold text-lg">{editing.id ? "Edit Quiz" : "New Quiz"}</h2>
              <button onClick={saveQuiz} className="ml-auto px-5 py-2 rounded-xl font-semibold"
                style={{ background: "#22c55e", color: "#0B0F1A" }}>Save Quiz</button>
            </div>

            {/* Quiz Settings */}
            <div className="rounded-2xl p-5" style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>Quiz Title</label>
                  <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
                    placeholder="e.g. Pharmacology High-Yield Quiz"
                    className="w-full rounded-xl px-4 py-2.5 text-sm"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>Subject</label>
                  <select value={editing.subject} onChange={e => setEditing({ ...editing, subject: e.target.value })}
                    className="w-full rounded-xl px-4 py-2.5 text-sm"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }}>
                    {["General", "Anatomy", "Physiology", "Pharmacology", "Pathology", "Medicine", "Surgery"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>Time Limit (minutes): {editing.timeLimit}</label>
                  <input type="range" min={5} max={120} step={5} value={editing.timeLimit} onChange={e => setEditing({ ...editing, timeLimit: +e.target.value })}
                    className="w-full accent-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>Pass Mark (%): {editing.passMarks}</label>
                  <input type="range" min={40} max={90} step={5} value={editing.passMarks} onChange={e => setEditing({ ...editing, passMarks: +e.target.value })}
                    className="w-full accent-green-500" />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-3 cursor-pointer text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                <input type="checkbox" checked={editing.randomize} onChange={e => setEditing({ ...editing, randomize: e.target.checked })}
                  className="accent-green-500" />
                Randomise question order
              </label>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {editing.questions.map((q, qi) => (
                <div key={q.id} className="rounded-2xl p-5" style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Q{qi + 1}</span>
                    <button onClick={() => setEditing({ ...editing, questions: editing.questions.filter((_, i) => i !== qi) })}
                      style={{ color: "rgba(255,255,255,0.3)" }}><Trash2 size={14} /></button>
                  </div>
                  <textarea value={q.question}
                    onChange={e => setEditing({ ...editing, questions: editing.questions.map((x, i) => i === qi ? { ...x, question: e.target.value } : x) })}
                    placeholder="Enter your question..."
                    rows={2} className="w-full rounded-xl px-4 py-2.5 text-sm resize-none mb-3"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", outline: "none" }} />
                  <div className="grid sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <button onClick={() => setEditing({ ...editing, questions: editing.questions.map((x, i) => i === qi ? { ...x, correct: oi as 0 | 1 | 2 | 3 } : x) })}
                          className="w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all"
                          style={{ borderColor: q.correct === oi ? "#22c55e" : "rgba(255,255,255,0.2)", background: q.correct === oi ? "#22c55e" : "transparent" }} />
                        <input value={opt}
                          onChange={e => setEditing({ ...editing, questions: editing.questions.map((x, i) => i === qi ? { ...x, options: x.options.map((o, j) => j === oi ? e.target.value : o) as [string, string, string, string] } : x) })}
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                          className="flex-1 rounded-lg px-3 py-2 text-sm"
                          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${q.correct === oi ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`, color: "#fff", outline: "none" }} />
                      </div>
                    ))}
                  </div>
                  <input value={q.explanation}
                    onChange={e => setEditing({ ...editing, questions: editing.questions.map((x, i) => i === qi ? { ...x, explanation: e.target.value } : x) })}
                    placeholder="Explanation (shown after quiz)"
                    className="w-full rounded-xl px-4 py-2.5 text-sm"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", outline: "none" }} />
                </div>
              ))}
              <button onClick={() => setEditing({ ...editing, questions: [...editing.questions, BLANK_MCQ()] })}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
                style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px dashed rgba(34,197,94,0.3)" }}>
                <Plus size={16} /> Add Question
              </button>
            </div>
          </div>
        )}

        {/* QUIZ TEST */}
        {view === "test" && activeQuiz && (
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: "#161B2E" }}>
              <div>
                <div className="font-semibold">{activeQuiz.title}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Q {currentQ + 1} of {activeQuiz.questions.length}</div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: timeLeft < 60 ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)", color: timeLeft < 60 ? "#ef4444" : "#fff" }}>
                <Clock size={16} /><span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${((currentQ + 1) / activeQuiz.questions.length) * 100}%`, background: "#22c55e" }} />
            </div>

            {/* Question */}
            <div className="rounded-2xl p-6" style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-lg font-medium mb-6 leading-relaxed">{activeQuiz.questions[currentQ].question}</p>
              <div className="space-y-3">
                {activeQuiz.questions[currentQ].options.map((opt, oi) => (
                  <button key={oi} onClick={() => setAnswers(prev => prev.map((a, i) => i === currentQ ? oi : a))}
                    className="w-full text-left px-5 py-4 rounded-xl text-sm transition-all"
                    style={answers[currentQ] === oi
                      ? { background: "rgba(34,197,94,0.15)", border: "2px solid #22c55e", color: "#fff" }
                      : { background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }}>
                    <span className="font-semibold mr-3" style={{ color: answers[currentQ] === oi ? "#22c55e" : "rgba(255,255,255,0.4)" }}>
                      {String.fromCharCode(65 + oi)}.
                    </span>{opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              {currentQ > 0 && (
                <button onClick={() => setCurrentQ(q => q - 1)} className="px-5 py-3 rounded-xl text-sm"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}>← Previous</button>
              )}
              {currentQ < activeQuiz.questions.length - 1 ? (
                <button onClick={() => setCurrentQ(q => q + 1)} className="flex-1 py-3 rounded-xl font-semibold" style={{ background: "#22c55e", color: "#0B0F1A" }}>
                  Next →
                </button>
              ) : (
                <button onClick={() => submitQuiz()} className="flex-1 py-3 rounded-xl font-semibold" style={{ background: "#007AFF", color: "#fff" }}>
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        )}

        {/* QUIZ RESULT */}
        {view === "result" && quizResult && activeQuiz && (
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="rounded-2xl p-8 text-center" style={{ background: "#161B2E", border: `2px solid ${quizResult.score >= activeQuiz.passMarks ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}` }}>
              <div className="text-5xl font-bold mb-2" style={{ color: quizResult.score >= activeQuiz.passMarks ? "#22c55e" : "#ef4444" }}>
                {quizResult.score}%
              </div>
              <div className="text-xl font-semibold mb-1">{quizResult.score >= activeQuiz.passMarks ? "🎉 Passed!" : "Try Again"}</div>
              <div className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                {quizResult.answers.filter((a, i) => a === activeQuiz.questions[i].correct).length} / {activeQuiz.questions.length} correct · Time: {formatTime(quizResult.timeTaken)}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl p-3" style={{ background: "rgba(34,197,94,0.1)" }}>
                  <div className="text-xl font-bold" style={{ color: "#22c55e" }}>
                    {quizResult.answers.filter((a, i) => a === activeQuiz.questions[i].correct).length}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Correct</div>
                </div>
                <div className="rounded-xl p-3" style={{ background: "rgba(239,68,68,0.1)" }}>
                  <div className="text-xl font-bold" style={{ color: "#ef4444" }}>
                    {quizResult.answers.filter((a, i) => a !== null && a !== activeQuiz.questions[i].correct).length}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Wrong</div>
                </div>
                <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="text-xl font-bold" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {quizResult.answers.filter(a => a === null).length}
                  </div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Skipped</div>
                </div>
              </div>
            </div>

            {/* Answer Review */}
            <h3 className="font-semibold text-lg">Answer Review</h3>
            <div className="space-y-3">
              {activeQuiz.questions.map((q, i) => {
                const isCorrect = quizResult.answers[i] === q.correct;
                const showExp = showExplain.has(i);
                return (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "#161B2E", border: `1px solid ${isCorrect ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}` }}>
                    <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setShowExplain(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })}>
                      {isCorrect ? <CheckCircle size={18} style={{ color: "#22c55e", flexShrink: 0, marginTop: 2 }} /> : <XCircle size={18} style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }} />}
                      <div className="flex-1 text-sm">{q.question}</div>
                      {showExp ? <ChevronUp size={14} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} /> : <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />}
                    </div>
                    {showExp && (
                      <div className="px-4 pb-4 space-y-2 border-t text-sm" style={{ borderColor: "rgba(255,255,255,0.06)", paddingTop: 12 }}>
                        <div style={{ color: "rgba(255,255,255,0.6)" }}>Your answer: <strong style={{ color: quizResult.answers[i] !== null ? (isCorrect ? "#22c55e" : "#ef4444") : "rgba(255,255,255,0.4)" }}>{quizResult.answers[i] !== null ? q.options[quizResult.answers[i]!] : "Not answered"}</strong></div>
                        {!isCorrect && <div style={{ color: "rgba(255,255,255,0.6)" }}>Correct: <strong style={{ color: "#22c55e" }}>{q.options[q.correct]}</strong></div>}
                        {q.explanation && <div className="rounded-lg p-3 text-xs" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{q.explanation}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={() => { setView("list"); setActiveQuiz(null); }}
              className="w-full py-3 rounded-xl font-semibold" style={{ background: "#22c55e", color: "#0B0F1A" }}>
              Back to Quizzes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
