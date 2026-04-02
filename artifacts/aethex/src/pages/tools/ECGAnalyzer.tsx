import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Activity, CheckCircle, AlertTriangle } from "lucide-react";

interface ECGFeature {
  label: string;
  key: string;
  options: string[];
}

interface Interpretation {
  rhythm: string;
  findings: string[];
  impression: string;
  urgency: "Normal" | "Review" | "Urgent" | "Emergency";
  action: string;
}

const FEATURES: ECGFeature[] = [
  { label: "Rate (bpm)", key: "rate", options: ["<60 (Bradycardia)", "60–100 (Normal)", ">100 (Tachycardia)"] },
  { label: "Rhythm", key: "rhythm", options: ["Regular", "Irregularly irregular", "Regularly irregular"] },
  { label: "P waves", key: "p", options: ["Present and normal", "Absent", "Abnormal/varied"] },
  { label: "PR interval", key: "pr", options: ["Normal (120–200ms)", "Prolonged (>200ms)", "Short (<120ms)", "Variable"] },
  { label: "QRS duration", key: "qrs", options: ["Narrow (<120ms)", "Broad (>120ms)"] },
  { label: "QRS morphology", key: "qrsmorphology", options: ["Normal", "LBBB pattern", "RBBB pattern", "Delta wave (WPW)", "Pathological Q waves"] },
  { label: "ST segment", key: "st", options: ["Isoelectric (normal)", "ST elevation", "ST depression", "Saddle-shaped elevation"] },
  { label: "T waves", key: "t", options: ["Upright (normal)", "Inverted", "Peaked/tall", "Biphasic/flat"] },
  { label: "QTc interval", key: "qtc", options: ["Normal (<440ms male / <460ms female)", "Prolonged (>440ms male / >460ms female)"] },
  { label: "Axis", key: "axis", options: ["Normal (-30° to +90°)", "Left axis deviation", "Right axis deviation", "Extreme axis"] },
];

function interpret(answers: Record<string, string>): Interpretation {
  const findings: string[] = [];
  let urgency: Interpretation["urgency"] = "Normal";
  let rhythm = "Sinus rhythm";
  let impression = "Normal ECG.";
  let action = "No immediate action required. File for clinical records.";

  const rate = answers["rate"] || "";
  const rhythmA = answers["rhythm"] || "";
  const p = answers["p"] || "";
  const pr = answers["pr"] || "";
  const qrs = answers["qrs"] || "";
  const qrsmorphology = answers["qrsmorphology"] || "";
  const st = answers["st"] || "";
  const t = answers["t"] || "";
  const qtc = answers["qtc"] || "";
  const axis = answers["axis"] || "";

  if (rate.includes("<60")) { findings.push("Bradycardia"); urgency = "Review"; }
  if (rate.includes(">100")) { findings.push("Tachycardia"); urgency = "Review"; }

  if (rhythmA.includes("Irregularly")) {
    if (p.includes("Absent")) {
      rhythm = "Atrial fibrillation";
      findings.push("Absent P waves with irregularly irregular rhythm → Atrial fibrillation");
      urgency = "Urgent";
      action = "Calculate CHA₂DS₂-VASc. Consider anticoagulation. Rate control (bisoprolol/diltiazem). Refer to cardiology.";
    } else {
      rhythm = "Irregular rhythm"; findings.push("Irregular rhythm with P waves → consider atrial flutter with variable block or multifocal atrial tachycardia");
    }
  }

  if (p.includes("Abnormal")) findings.push("Abnormal P wave morphology — consider atrial enlargement or ectopic atrial pacemaker");

  if (pr.includes("Prolonged")) { findings.push("Prolonged PR (>200ms) → First degree AV block"); urgency = urgency === "Normal" ? "Review" : urgency; }
  if (pr.includes("Short")) { findings.push("Short PR → Consider WPW or Lown-Ganong-Levine syndrome"); }
  if (pr.includes("Variable")) { findings.push("Variable PR interval → Consider Mobitz type 1 (Wenckebach) or complete heart block"); urgency = "Urgent"; }

  if (qrs.includes("Broad")) {
    if (qrsmorphology.includes("LBBB")) { findings.push("Left Bundle Branch Block (LBBB) — if new, treat as STEMI equivalent"); urgency = "Emergency"; action = "New LBBB with chest pain = STEMI equivalent. Activate cath lab. Dual antiplatelet therapy."; }
    else if (qrsmorphology.includes("RBBB")) { findings.push("Right Bundle Branch Block (RBBB)"); urgency = urgency === "Normal" ? "Review" : urgency; }
    else if (qrsmorphology.includes("Delta")) { findings.push("Delta waves with broad QRS → Wolff-Parkinson-White (WPW). Avoid AV nodal blocking drugs if AF present"); urgency = "Urgent"; }
    else { findings.push("Broad QRS complex — consider VT, hyperkalaemia, or drug toxicity"); urgency = "Emergency"; }
  }

  if (qrsmorphology.includes("Pathological Q")) { findings.push("Pathological Q waves — consider prior myocardial infarction"); urgency = urgency === "Normal" ? "Review" : urgency; }

  if (st.includes("elevation")) {
    findings.push("ST elevation → STEMI until proven otherwise. Identify affected territory.");
    urgency = "Emergency";
    action = "STEMI protocol. Primary PCI within 90 minutes (door-to-balloon). Aspirin 300mg + ticagrelor 180mg. IV access, O2, analgesia.";
  }
  if (st.includes("depression")) { findings.push("ST depression → ischaemia (NSTEMI/unstable angina) or digoxin effect or LVH strain pattern"); urgency = urgency === "Emergency" ? "Emergency" : "Urgent"; }
  if (st.includes("Saddle")) { findings.push("Saddle-shaped (concave) ST elevation in multiple leads → Pericarditis"); urgency = urgency === "Normal" ? "Review" : urgency; }

  if (t.includes("Inverted")) { findings.push("T wave inversion — ischaemia, RVH (V1-V4), pulmonary embolism (V1-V4), or normal variant in women (V1-V3)"); urgency = urgency === "Normal" ? "Review" : urgency; }
  if (t.includes("Peaked")) { findings.push("Peaked/tall T waves → early ischaemia or hyperkalaemia"); urgency = urgency === "Normal" ? "Review" : urgency; }

  if (qtc.includes("Prolonged")) {
    findings.push("Prolonged QTc — risk of Torsades de Pointes. Check electrolytes, drugs (quinolones, amiodarone, haloperidol).");
    urgency = "Urgent";
    action = (action !== "No immediate action required. File for clinical records." ? action + " " : "") + "Check electrolytes, withdraw causative drugs. Continuous monitoring.";
  }

  if (axis.includes("Left axis")) { findings.push("Left axis deviation — consider LAFB, inferior MI, LBBB"); }
  if (axis.includes("Right axis")) { findings.push("Right axis deviation — consider RVH, PE, LPFB, lateral MI, normal in children"); }
  if (axis.includes("Extreme")) { findings.push("Extreme axis deviation — consider VT or lead reversal"); urgency = urgency === "Normal" ? "Review" : urgency; }

  if (findings.length === 0) { impression = "Normal ECG. No significant abnormality detected based on the parameters entered."; }
  else if (urgency === "Emergency") { impression = "Emergency findings present. Immediate clinical correlation required."; }
  else if (urgency === "Urgent") { impression = "Significant findings present requiring urgent review."; }
  else if (urgency === "Review") { impression = "Findings of clinical interest. Review in clinical context."; }

  if (urgency === "Normal") action = "No immediate action required. Correlate with clinical findings and file for records.";

  return { rhythm, findings, impression, urgency, action };
}

const urgencyConfig = {
  Normal: { color: "#10B981", bg: "#F0FDF4" },
  Review: { color: "#007AFF", bg: "rgba(0,122,255,0.07)" },
  Urgent: { color: "#F59E0B", bg: "#FFFBEB" },
  Emergency: { color: "#EF4444", bg: "#FEF2F2" },
};

export default function ECGAnalyzer() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Interpretation | null>(null);

  const setAnswer = (key: string, val: string) => { setAnswers(p => ({ ...p, [key]: val })); setResult(null); };
  const analyze = () => setResult(interpret(answers));
  const reset = () => { setAnswers({}); setResult(null); };

  const progress = Object.keys(answers).length;

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
      <div className="relative overflow-hidden" >
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(10,22,40,0.93) 0%, rgba(13,33,68,0.9) 50%, rgba(10,48,96,0.93) 100%)" }} />
        <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative z-10">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.2)" }}>
              <Activity className="w-5 h-5" style={{ color: "#7C3AED" }} />
            </div>
            <h1 className="text-3xl font-bold text-white">ECG Analyzer</h1>
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Systematic ECG interpretation using a structured approach.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="rounded-2xl p-5 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold" style={{ color: "#1C1C1E" }}>Enter ECG Parameters</h2>
            <span className="text-xs" style={{ color: "#AEAEB2" }}>{progress}/{FEATURES.length} entered</span>
          </div>
          <div className="h-1 rounded-full mb-5" style={{ background: "#F2F2F7" }}>
            <div className="h-1 rounded-full transition-all" style={{ width: `${(progress / FEATURES.length) * 100}%`, background: "linear-gradient(90deg,#007AFF,#00C2A8)" }} />
          </div>
          <div className="space-y-5">
            {FEATURES.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-2" style={{ color: "#1C1C1E" }}>{f.label}</label>
                <div className="flex flex-col gap-1.5">
                  {f.options.map(opt => (
                    <button key={opt} onClick={() => setAnswer(f.key, opt)}
                      className="px-4 py-2.5 rounded-xl text-sm text-left transition-all"
                      style={answers[f.key] === opt ? { background: "rgba(0,122,255,0.08)", border: "1.5px solid #007AFF", color: "#007AFF", fontWeight: 600 } :
                        { background: "#F2F2F7", border: "1px solid transparent", color: "#1C1C1E" }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={analyze} disabled={progress < 3}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#7C3AED,#007AFF)" }}>
              Interpret ECG
            </button>
            <button onClick={reset} className="px-4 py-3 rounded-xl text-sm font-medium"
              style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#636366" }}>
              Reset
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="rounded-2xl p-5 bg-white" style={{ border: `1.5px solid ${urgencyConfig[result.urgency].color}44`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold" style={{ color: "#1C1C1E" }}>ECG Interpretation</h3>
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: urgencyConfig[result.urgency].bg, color: urgencyConfig[result.urgency].color }}>
                  {result.urgency}
                </span>
              </div>
              <div className="text-sm font-medium mb-3" style={{ color: "#007AFF" }}>Rhythm: {result.rhythm}</div>
              {result.findings.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {result.findings.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#1C1C1E" }}>
                      {result.urgency === "Emergency" ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#EF4444" }} /> :
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#007AFF" }} />}
                      {f}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-2 mb-4"><CheckCircle className="w-4 h-4" style={{ color: "#10B981" }} /><span className="text-sm" style={{ color: "#10B981" }}>No abnormalities detected</span></div>
              )}
              <div className="rounded-xl p-4" style={{ background: urgencyConfig[result.urgency].bg }}>
                <div className="text-xs font-semibold mb-1" style={{ color: urgencyConfig[result.urgency].color }}>Impression</div>
                <div className="text-sm mb-2" style={{ color: "#1C1C1E" }}>{result.impression}</div>
                <div className="text-xs font-semibold mb-1" style={{ color: urgencyConfig[result.urgency].color }}>Recommended Action</div>
                <div className="text-sm" style={{ color: "#1C1C1E" }}>{result.action}</div>
              </div>
            </div>
            <p className="text-xs text-center" style={{ color: "#AEAEB2" }}>
              ECG interpretation must always be correlated with clinical presentation. This tool is for educational support only.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
