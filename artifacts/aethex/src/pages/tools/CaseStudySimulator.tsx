import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, GraduationCap, ChevronRight, RefreshCw, CheckCircle, XCircle, Trophy } from "lucide-react";

interface Option {
  text: string;
  correct: boolean;
  explanation: string;
}

interface Step {
  question: string;
  context?: string;
  options: Option[];
}

interface Case {
  id: string;
  title: string;
  specialty: string;
  difficulty: "Easy" | "Medium" | "Hard";
  presenting: string;
  steps: Step[];
  teaching: string;
}

const CASES: Case[] = [
  {
    id: "c1",
    title: "A 55-year-old with central chest pain",
    specialty: "Cardiology",
    difficulty: "Medium",
    presenting: "A 55-year-old male smoker presents to A&E with 2 hours of central crushing chest pain radiating to his left arm, associated with nausea and diaphoresis. BP 140/90, HR 98, SpO2 97%.",
    steps: [
      {
        question: "What is your first immediate action?",
        options: [
          { text: "Obtain a 12-lead ECG", correct: true, explanation: "Correct! A 12-lead ECG must be performed within 10 minutes of presentation in all chest pain patients to identify STEMI. This is the most time-critical investigation." },
          { text: "Give IV morphine 5mg", correct: false, explanation: "Morphine in ACS has been associated with worse outcomes (CRUSADE registry). First confirm the diagnosis with ECG." },
          { text: "Order CT coronary angiography", correct: false, explanation: "CTCA is for stable chest pain/low-risk presentations. In acute chest pain with high ACS suspicion, ECG and troponins come first." },
          { text: "Start IV fluids at 1L/hr", correct: false, explanation: "IV fluids are not indicated initially. Obtain an ECG first to guide diagnosis and management." },
        ]
      },
      {
        question: "The ECG shows ST elevation in leads II, III, aVF. What is the diagnosis and next step?",
        context: "ECG: ST elevation 2mm in II, III, aVF. Reciprocal ST depression in I, aVL.",
        options: [
          { text: "Inferior STEMI — activate cath lab for primary PCI", correct: true, explanation: "Correct! Inferior STEMI (RCA territory) requires immediate primary PCI within 90 minutes (door-to-balloon time). Activate the cath lab immediately." },
          { text: "Pericarditis — start NSAIDs", correct: false, explanation: "Pericarditis causes saddle-shaped ST elevation in all leads without reciprocal changes. This pattern is classic for inferior STEMI." },
          { text: "NSTEMI — admit for observation", correct: false, explanation: "NSTEMI by definition has no ST elevation. The ST elevation here confirms STEMI, requiring immediate PCI." },
          { text: "Benign early repolarisation — reassure", correct: false, explanation: "Early repolarisation is a diagnosis of exclusion in young, healthy patients. This clinical picture is clearly pathological." },
        ]
      },
      {
        question: "While awaiting PCI, what dual antiplatelet therapy should you give?",
        options: [
          { text: "Aspirin 300mg + Ticagrelor 180mg loading dose", correct: true, explanation: "Correct! DAPT with aspirin 300mg (loading) and ticagrelor 180mg (preferred over clopidogrel for STEMI per PLATO trial) reduces mortality and reinfarction." },
          { text: "Warfarin + aspirin", correct: false, explanation: "Warfarin has no role in acute STEMI management. DAPT is the standard of care." },
          { text: "Aspirin alone 75mg", correct: false, explanation: "Low-dose aspirin is the maintenance dose. A 300mg loading dose is needed, plus a P2Y12 inhibitor (ticagrelor or clopidogrel)." },
          { text: "Clopidogrel 75mg alone", correct: false, explanation: "Clopidogrel alone is insufficient. DAPT is required, and the loading dose is 600mg (or 300mg if PCI planned). Ticagrelor is preferred." },
        ]
      }
    ],
    teaching: "Inferior STEMI (typically RCA occlusion) presents with ST elevation in II, III, aVF with reciprocal changes in I, aVL. Primary PCI is the gold standard reperfusion strategy. Always give DAPT loading prior to PCI. Remember to check for right ventricular involvement (ST elevation in V4R — avoid nitrates if RV infarct)."
  },
  {
    id: "c2",
    title: "A 28-year-old with severe headache",
    specialty: "Neurology",
    difficulty: "Hard",
    presenting: "A 28-year-old woman presents with the 'worst headache of her life' that started suddenly during exercise 3 hours ago. She has neck stiffness and photophobia. GCS 15. Temp 37.2°C, BP 130/80, HR 88.",
    steps: [
      {
        question: "What is the most likely diagnosis?",
        options: [
          { text: "Subarachnoid haemorrhage (SAH)", correct: true, explanation: "Correct! 'Thunderclap headache' — sudden onset, maximal severity headache — is SAH until proven otherwise. Neck stiffness and photophobia are classic meningeal irritation signs." },
          { text: "Tension headache", correct: false, explanation: "Tension headache is bilateral, band-like, and not of sudden onset or maximal severity. This presentation is far more sinister." },
          { text: "Cluster headache", correct: false, explanation: "Cluster headaches are unilateral with autonomic features (lacrimation, rhinorrhoea). They don't cause neck stiffness." },
          { text: "Migraine with aura", correct: false, explanation: "While migraines cause severe headache with photophobia, the thunderclap onset and neck stiffness make SAH the priority diagnosis." },
        ]
      },
      {
        question: "Which investigation should you perform immediately?",
        options: [
          { text: "Non-contrast CT head", correct: true, explanation: "Correct! Non-contrast CT head detects subarachnoid blood in ~95% within 6 hours. If negative but SAH remains suspected, LP for xanthochromia at 12 hours is essential." },
          { text: "Lumbar puncture immediately", correct: false, explanation: "LP is done AFTER CT head to exclude raised ICP (which could cause transtentorial herniation). LP at 12 hours detects xanthochromia if CT is negative." },
          { text: "MRI brain with gadolinium", correct: false, explanation: "MRI is less sensitive than CT for acute subarachnoid blood and takes longer. CT is the first-line emergency investigation." },
          { text: "EEG", correct: false, explanation: "EEG is not indicated in SAH diagnosis. It assesses electrical brain activity, not structural pathology or haemorrhage." },
        ]
      },
      {
        question: "CT confirms SAH. What is the definitive management?",
        options: [
          { text: "Urgent neurosurgical / interventional radiology referral for coil embolisation or clipping of the aneurysm", correct: true, explanation: "Correct! SAH is caused by ruptured intracranial aneurysm in 85% of cases. Endovascular coiling (preferred, ISAT trial) or surgical clipping prevents rebleeding. Give nimodipine 60mg q4h to prevent vasospasm." },
          { text: "IV dexamethasone", correct: false, explanation: "Steroids are used in bacterial meningitis and cerebral oedema, not SAH. They have no role in aneurysmal SAH." },
          { text: "Thrombolysis with alteplase", correct: false, explanation: "Thrombolysis is contraindicated in haemorrhagic conditions. This would dramatically worsen SAH." },
          { text: "Admit, analgesia, and observe", correct: false, explanation: "Conservative management risks catastrophic rebleeding (50% mortality). Urgent neurosurgical/endovascular intervention is required." },
        ]
      }
    ],
    teaching: "Subarachnoid haemorrhage classically presents with a sudden-onset 'thunderclap' headache ('worst headache of life') and meningism. Non-contrast CT has ~95% sensitivity within 6h; LP at 12h for xanthochromia if CT negative. Nimodipine reduces vasospasm. Endovascular coiling is preferred over surgical clipping (ISAT trial). Rebleeding within 24h carries 70% mortality."
  },
  {
    id: "c3",
    title: "A 7-year-old with wheeze and breathlessness",
    specialty: "Paediatrics",
    difficulty: "Easy",
    presenting: "A 7-year-old boy is brought in by his mother with wheeze and shortness of breath for 4 hours. He has a background of asthma. SpO2 90% on air, RR 36/min. He is able to speak in short sentences. There is bilateral wheeze on auscultation.",
    steps: [
      {
        question: "How would you classify the severity of this asthma attack?",
        options: [
          { text: "Moderate acute asthma", correct: false, explanation: "Moderate asthma: SpO2 ≥92%, can talk in sentences, RR modestly elevated. This patient has SpO2 90% — below threshold." },
          { text: "Severe acute asthma", correct: true, explanation: "Correct! Severe asthma in children: SpO2 <92%, too breathless to feed/speak in long sentences, RR >30 (age 5–12). This patient meets these criteria. Immediate bronchodilators required." },
          { text: "Life-threatening asthma", correct: false, explanation: "Life-threatening features include: SpO2 <92% with cyanosis, silent chest, poor respiratory effort, altered consciousness, hypotension. Not yet met here." },
          { text: "Mild acute asthma", correct: false, explanation: "Mild asthma: SpO2 ≥95%, no respiratory distress, speaks in full sentences. This patient is clearly more unwell." },
        ]
      },
      {
        question: "What is the immediate treatment?",
        options: [
          { text: "Oxygen + salbutamol 10 puffs via spacer + ipratropium 4 puffs + soluble prednisolone 40mg", correct: true, explanation: "Correct! BTS/SIGN guidelines: O2 to maintain SpO2 94–98%, bronchodilators (salbutamol ± ipratropium), and early oral prednisolone (reduces admission and relapses)." },
          { text: "IV aminophylline immediately", correct: false, explanation: "Aminophylline is second-line for severe/life-threatening asthma not responding to initial treatment. Bronchodilators via spacer are first." },
          { text: "Intubation and ventilation", correct: false, explanation: "Intubation is a last resort for respiratory failure. Initial management should be maximal medical therapy first." },
          { text: "Salbutamol nebuliser only, no steroids yet", correct: false, explanation: "Steroids should be given early in all acute asthma attacks requiring hospital treatment. They reduce duration of admission and risk of relapse." },
        ]
      }
    ],
    teaching: "Severity classification guides treatment in paediatric asthma. Severe asthma in children (5–12y): SpO2 <92%, too breathless for full sentences, RR >30, moderate-severe wheeze. Give O2, salbutamol (via spacer if able), ipratropium (for severe/life-threatening), and oral prednisolone early. Reassess frequently. If not improving, consider IV magnesium sulphate or ITU referral."
  }
];

const DIFFICULTY_COLORS = { Easy: "#10B981", Medium: "#F59E0B", Hard: "#EF4444" };

export default function CaseStudySimulator() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<{ correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  const startCase = (c: Case) => { setSelectedCase(c); setStep(0); setAnswered(null); setScore(0); setHistory([]); setFinished(false); };

  const selectAnswer = (i: number) => {
    if (answered !== null) return;
    setAnswered(i);
    const correct = selectedCase!.steps[step].options[i].correct;
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, { correct }]);
  };

  const nextStep = () => {
    if (step + 1 >= selectedCase!.steps.length) {
      setFinished(true);
    } else {
      setStep(s => s + 1);
      setAnswered(null);
    }
  };

  if (!selectedCase) {
    return (
      <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(160deg,#0A1628,#0D2144,#0A3060)" }}>
          <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative z-10">
            <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Tools
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.2)" }}>
                <GraduationCap className="w-5 h-5" style={{ color: "#3B82F6" }} />
              </div>
              <h1 className="text-3xl font-bold text-white">Case Study Simulator</h1>
            </div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Practice real-world clinical cases with branching decisions.</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          <h2 className="font-semibold" style={{ color: "#1C1C1E" }}>Select a Case</h2>
          {CASES.map(c => (
            <button key={c.id} onClick={() => startCase(c)} className="w-full text-left rounded-2xl p-5 bg-white transition-all hover:-translate-y-0.5"
              style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,122,255,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,122,255,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(60,60,67,0.1)"; }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: "#1C1C1E" }}>{c.title}</h3>
                  <p className="text-sm line-clamp-2" style={{ color: "#636366" }}>{c.presenting}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "rgba(0,122,255,0.1)", color: "#007AFF" }}>{c.specialty}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: `${DIFFICULTY_COLORS[c.difficulty]}18`, color: DIFFICULTY_COLORS[c.difficulty] }}>{c.difficulty}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "#F2F2F7", color: "#636366" }}>{c.steps.length} questions</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 shrink-0 mt-1" style={{ color: "#AEAEB2" }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / selectedCase.steps.length) * 100);
    return (
      <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(160deg,#0A1628,#0D2144,#0A3060)" }}>
          <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative z-10">
            <button onClick={() => setSelectedCase(null)} className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
              <ArrowLeft className="w-4 h-4" /> All Cases
            </button>
            <h1 className="text-3xl font-bold text-white">Case Complete</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <div className="rounded-2xl p-8 bg-white text-center" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Trophy className="w-14 h-14 mx-auto mb-4" style={{ color: pct >= 70 ? "#F59E0B" : "#AEAEB2" }} />
            <div className="text-5xl font-extrabold mb-1" style={{ color: pct >= 70 ? "#10B981" : "#EF4444" }}>{pct}%</div>
            <div className="text-lg font-semibold mb-1" style={{ color: "#1C1C1E" }}>{score}/{selectedCase.steps.length} Correct</div>
            <p className="text-sm mb-6" style={{ color: "#636366" }}>{pct >= 80 ? "Excellent clinical reasoning!" : pct >= 60 ? "Good attempt. Review the teaching points." : "Keep practising. Review the teaching points carefully."}</p>
            <div className="flex gap-2 justify-center mb-4">
              {history.map((h, i) => h.correct ? <CheckCircle key={i} className="w-6 h-6" style={{ color: "#10B981" }} /> : <XCircle key={i} className="w-6 h-6" style={{ color: "#EF4444" }} />)}
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(59,130,246,0.2)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h3 className="font-semibold mb-3" style={{ color: "#1C1C1E" }}>Teaching Points</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#636366" }}>{selectedCase.teaching}</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => startCase(selectedCase)} className="flex-1 py-3 rounded-xl font-semibold text-sm text-white" style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
              <RefreshCw className="w-4 h-4 inline mr-2" />Retry Case
            </button>
            <button onClick={() => setSelectedCase(null)} className="flex-1 py-3 rounded-xl font-semibold text-sm" style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#636366" }}>
              All Cases
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = selectedCase.steps[step];

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(160deg,#0A1628,#0D2144,#0A3060)" }}>
        <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative z-10">
          <button onClick={() => setSelectedCase(null)} className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
            <ArrowLeft className="w-4 h-4" /> All Cases
          </button>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-white">{selectedCase.title}</h1>
            <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
              Q{step + 1}/{selectedCase.steps.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Presenting complaint */}
        {step === 0 && (
          <div className="rounded-2xl p-5 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h3 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#007AFF" }}>Presenting Case</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#1C1C1E" }}>{selectedCase.presenting}</p>
          </div>
        )}

        {/* Question */}
        <div className="rounded-2xl p-5 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          {currentStep.context && (
            <div className="mb-3 p-3 rounded-xl text-sm" style={{ background: "#F2F2F7", color: "#636366", fontFamily: "monospace" }}>
              {currentStep.context}
            </div>
          )}
          <h2 className="font-semibold text-base mb-4" style={{ color: "#1C1C1E" }}>{currentStep.question}</h2>
          <div className="space-y-2.5">
            {currentStep.options.map((opt, i) => {
              const isSelected = answered === i;
              const showResult = answered !== null;
              const isCorrect = opt.correct;
              return (
                <button key={i} onClick={() => selectAnswer(i)} disabled={answered !== null}
                  className="w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all"
                  style={{
                    border: showResult ? (isCorrect ? "1.5px solid #10B981" : isSelected ? "1.5px solid #EF4444" : "1px solid rgba(60,60,67,0.12)") : "1.5px solid rgba(60,60,67,0.15)",
                    background: showResult ? (isCorrect ? "#F0FDF4" : isSelected ? "#FEF2F2" : "#fff") : "#fff",
                    color: "#1C1C1E",
                  }}>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
                      style={{ background: showResult && isCorrect ? "#10B981" : showResult && isSelected ? "#EF4444" : "#F2F2F7", color: showResult && (isCorrect || isSelected) ? "#fff" : "#636366" }}>
                      {showResult && isCorrect ? "✓" : showResult && isSelected ? "✗" : String.fromCharCode(65 + i)}
                    </div>
                    <span>{opt.text}</span>
                  </div>
                  {isSelected && showResult && (
                    <div className="mt-2 text-xs ml-9" style={{ color: isCorrect ? "#166534" : "#991B1B" }}>{opt.explanation}</div>
                  )}
                  {!isSelected && showResult && isCorrect && (
                    <div className="mt-2 text-xs ml-9" style={{ color: "#166534" }}>{opt.explanation}</div>
                  )}
                </button>
              );
            })}
          </div>

          {answered !== null && (
            <button onClick={nextStep} className="mt-5 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
              {step + 1 >= selectedCase.steps.length ? "View Results" : "Next Question"} <ChevronRight className="w-4 h-4 inline ml-1" />
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="flex gap-2">
          {selectedCase.steps.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full" style={{
              background: i < step ? (history[i]?.correct ? "#10B981" : "#EF4444") : i === step ? "#007AFF" : "rgba(60,60,67,0.1)"
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
