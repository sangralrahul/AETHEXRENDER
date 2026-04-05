import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Target, Brain, ChevronRight, CheckCircle, Circle, Loader2, Bell, RotateCcw, Trophy } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const STORAGE = "aethex_learning_path";

const SPECIALTIES = ["General Medicine", "Surgery", "Paediatrics", "Gynaecology", "Orthopaedics", "Psychiatry", "Radiology", "Anaesthesia", "Ophthalmology", "ENT"];
const EXAM_TARGETS = ["NEET-PG", "USMLE Step 1", "USMLE Step 2", "FMGE", "PG Diploma", "DNB CET", "No exam — general learning"];
const WEAK_TOPICS = ["Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology", "Microbiology", "Medicine", "Surgery", "Gynaecology & Obstetrics", "Paediatrics", "ENT", "Ophthalmology", "Orthopaedics", "Radiology", "Psychiatry"];

interface DayTask { task: string; subject: string; duration: string; done: boolean; }
interface Day { day: number; label: string; tasks: DayTask[]; }

interface LPState {
  specialty: string;
  exam: string;
  weakTopics: string[];
  plan: Day[];
  streakDays: number;
  lastActive: string;
  progress: Record<string, number>;
}

function loadState(): LPState | null {
  try { return JSON.parse(localStorage.getItem(STORAGE) || "null"); } catch { return null; }
}

export default function LearningPath() {
  const [step, setStep] = useState<"onboarding" | "plan">("onboarding");
  const [specialty, setSpecialty] = useState("");
  const [exam, setExam] = useState("");
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Day[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [nudges, setNudges] = useState<string[]>([]);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const saved = loadState();
    if (saved?.plan?.length) {
      setSpecialty(saved.specialty);
      setExam(saved.exam);
      setWeakTopics(saved.weakTopics);
      setPlan(saved.plan);
      setStreakDays(saved.streakDays);
      setProgress(saved.progress || {});
      setStep("plan");
      checkStreak(saved);
      generateNudges(saved);
    }
  }, []);

  function checkStreak(saved: LPState) {
    const today = new Date().toDateString();
    if (saved.lastActive === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (saved.lastActive === yesterday) {
      setStreakDays(saved.streakDays + 1);
    } else if (saved.lastActive !== today) {
      setStreakDays(0);
    }
  }

  function generateNudges(saved: LPState) {
    const ns: string[] = [];
    const weakSubjects = Object.entries(saved.progress || {}).filter(([, v]) => v < 40).map(([k]) => k);
    if (weakSubjects.length > 0) ns.push(`You're behind on ${weakSubjects[0]} — let's catch up today!`);
    if (saved.streakDays >= 3) ns.push(`🔥 ${saved.streakDays}-day streak! Keep the momentum going.`);
    setNudges(ns);
  }

  function toggleWeak(t: string) {
    setWeakTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : prev.length < 5 ? [...prev, t] : prev);
  }

  async function handleGenerate() {
    if (!specialty || !exam || weakTopics.length === 0) return;
    setLoading(true);

    const prompt = `Generate a 7-day study plan for a medical student/doctor with these details:
Specialty interest: ${specialty}
Exam target: ${exam}
Weak topics: ${weakTopics.join(", ")}

Respond ONLY as valid JSON (no markdown, no prose):
{
  "plan": [
    {
      "day": 1,
      "label": "Day 1 - Monday",
      "tasks": [
        { "task": "Specific study task description", "subject": "Subject name", "duration": "2 hrs", "done": false },
        { "task": "Another task", "subject": "Subject", "duration": "1 hr", "done": false }
      ]
    }
  ]
}
Provide exactly 7 days. Each day should have 3-4 tasks. Focus heavily on the weak topics. Make tasks specific and actionable for Indian medical education.`;

    try {
      const res = await fetch(`${BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, conversationHistory: [], agent: "cadus", mode: "normal" }),
      });
      const data = await res.json();
      const text: string = data.message || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const newPlan = parsed.plan || [];
        const initProgress: Record<string, number> = {};
        weakTopics.forEach(t => { initProgress[t] = Math.floor(Math.random() * 30) + 5; });
        const state: LPState = { specialty, exam, weakTopics, plan: newPlan, streakDays: 1, lastActive: new Date().toDateString(), progress: initProgress };
        localStorage.setItem(STORAGE, JSON.stringify(state));
        setPlan(newPlan);
        setStreakDays(1);
        setProgress(initProgress);
        setStep("plan");
      }
    } catch { /* silent */ } finally { setLoading(false); }
  }

  function toggleTaskDone(dayIdx: number, taskIdx: number) {
    const newPlan = plan.map((d, di) => di === dayIdx ? {
      ...d,
      tasks: d.tasks.map((t, ti) => ti === taskIdx ? { ...t, done: !t.done } : t)
    } : d);
    setPlan(newPlan);
    const state = loadState();
    if (state) { localStorage.setItem(STORAGE, JSON.stringify({ ...state, plan: newPlan, lastActive: new Date().toDateString() })); }

    const subj = plan[dayIdx].tasks[taskIdx].subject;
    if (!plan[dayIdx].tasks[taskIdx].done) {
      setProgress(prev => ({ ...prev, [subj]: Math.min(100, (prev[subj] || 0) + 8) }));
    }
  }

  function resetAll() {
    localStorage.removeItem(STORAGE);
    setStep("onboarding");
    setSpecialty(""); setExam(""); setWeakTopics([]); setPlan([]); setStreakDays(0); setProgress({});
  }

  const totalTasks = plan.flatMap(d => d.tasks).length;
  const doneTasks = plan.flatMap(d => d.tasks).filter(t => t.done).length;
  const overallPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "#0B0F1A", color: "#fff" }}>
      <div style={{ background: "linear-gradient(135deg,#0B0F1A 0%,#0d1a10 100%)", borderBottom: "1px solid rgba(34,197,94,0.15)", padding: "48px 0 32px" }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ background: "rgba(34,197,94,0.15)", borderRadius: 12, padding: 10 }}>
              <Target size={28} style={{ color: "#22c55e" }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Personalised Learning Path</h1>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>AI-generated 7-day study plan · Tracks your progress</p>
            </div>
            {step === "plan" && (
              <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "rgba(255,140,0,0.12)", border: "1px solid rgba(255,140,0,0.3)" }}>
                  <Flame size={18} style={{ color: "#ff8c00" }} />
                  <span className="font-bold text-lg" style={{ color: "#ff8c00" }}>{streakDays}</span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>day streak</span>
                </div>
                <button onClick={resetAll} className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                  <RotateCcw size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === "onboarding" && (
            <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Specialty */}
              <div className="rounded-2xl p-6" style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
                <label className="block font-semibold mb-4">1. Your Specialty / Area of Interest</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SPECIALTIES.map(s => (
                    <button key={s} onClick={() => setSpecialty(s)}
                      className="px-4 py-3 rounded-xl text-sm text-left transition-all"
                      style={specialty === s
                        ? { background: "#22c55e", color: "#0B0F1A", fontWeight: 600 }
                        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam */}
              <div className="rounded-2xl p-6" style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
                <label className="block font-semibold mb-4">2. Your Exam Target</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EXAM_TARGETS.map(e => (
                    <button key={e} onClick={() => setExam(e)}
                      className="px-4 py-3 rounded-xl text-sm text-left transition-all"
                      style={exam === e
                        ? { background: "#22c55e", color: "#0B0F1A", fontWeight: 600 }
                        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weak Topics */}
              <div className="rounded-2xl p-6" style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
                <label className="block font-semibold mb-1">3. Your Weak Topics <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>(select up to 5)</span></label>
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>The AI will focus your study plan on these subjects</p>
                <div className="flex flex-wrap gap-2">
                  {WEAK_TOPICS.map(t => (
                    <button key={t} onClick={() => toggleWeak(t)}
                      className="px-3 py-2 rounded-full text-sm transition-all"
                      style={weakTopics.includes(t)
                        ? { background: "#22c55e", color: "#0B0F1A", fontWeight: 600 }
                        : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {weakTopics.includes(t) ? "✓ " : ""}{t}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleGenerate} disabled={loading || !specialty || !exam || weakTopics.length === 0}
                className="w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all"
                style={{ background: loading || !specialty || !exam || weakTopics.length === 0 ? "rgba(34,197,94,0.3)" : "#22c55e", color: "#0B0F1A" }}>
                {loading ? <Loader2 size={22} className="animate-spin" /> : <Brain size={22} />}
                {loading ? "Generating your personalised plan..." : "Generate My 7-Day Plan"}
              </button>
            </motion.div>
          )}

          {step === "plan" && plan.length > 0 && (
            <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Nudges */}
              {nudges.map((n, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-4" style={{ background: "rgba(255,140,0,0.08)", border: "1px solid rgba(255,140,0,0.25)" }}>
                  <Bell size={16} style={{ color: "#ff8c00" }} />
                  <span className="text-sm" style={{ color: "#fcd34d" }}>{n}</span>
                </div>
              ))}

              {/* Overall Progress */}
              <div className="rounded-2xl p-6" style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold">Overall Plan Progress</div>
                  <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{overallPct}%</div>
                </div>
                <div className="h-3 rounded-full mb-6" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#22c55e,#00C2A8)", width: `${overallPct}%` }} />
                </div>

                {/* Subject progress rings */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(progress).map(([subj, pct]) => (
                    <div key={subj} className="rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-12 h-12 -rotate-90">
                          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                          <circle cx="24" cy="24" r="20" fill="none" stroke="#22c55e" strokeWidth="3"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
                            strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: "#22c55e" }}>{pct}%</div>
                      </div>
                      <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>{subj}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {plan.map((d, i) => {
                  const dayDone = d.tasks.filter(t => t.done).length;
                  return (
                    <button key={i} onClick={() => setActiveDay(i)}
                      className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={activeDay === i
                        ? { background: "#22c55e", color: "#0B0F1A" }
                        : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      Day {d.day} {dayDone === d.tasks.length && d.tasks.length > 0 ? "✓" : ""}
                    </button>
                  );
                })}
              </div>

              {/* Active Day Tasks */}
              {plan[activeDay] && (
                <div className="rounded-2xl p-6" style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="font-semibold text-lg mb-5">{plan[activeDay].label}</div>
                  <div className="space-y-3">
                    {plan[activeDay].tasks.map((task, ti) => (
                      <div key={ti} className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all"
                        style={{ background: task.done ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${task.done ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)"}` }}
                        onClick={() => toggleTaskDone(activeDay, ti)}>
                        {task.done
                          ? <CheckCircle size={22} style={{ color: "#22c55e", flexShrink: 0, marginTop: 2 }} />
                          : <Circle size={22} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0, marginTop: 2 }} />}
                        <div className="flex-1">
                          <div className={`font-medium ${task.done ? "line-through opacity-60" : ""}`}>{task.task}</div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,194,168,0.15)", color: "#00C2A8" }}>{task.subject}</span>
                            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>⏱ {task.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
