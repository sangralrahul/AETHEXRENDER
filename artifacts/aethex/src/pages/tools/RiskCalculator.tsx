import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Heart, RefreshCw } from "lucide-react";

type CalcId = "ascvd" | "chads2" | "wells-dvt" | "wells-pe" | "curb65" | "gcs";

interface CalcConfig {
  id: CalcId;
  name: string;
  description: string;
  color: string;
}

const CALCS: CalcConfig[] = [
  { id: "ascvd", name: "ASCVD Risk", description: "10-year cardiovascular risk (ACC/AHA)", color: "#EF4444" },
  { id: "chads2", name: "CHA₂DS₂-VASc", description: "Stroke risk in AF patients", color: "#7C3AED" },
  { id: "wells-dvt", name: "Wells DVT", description: "Pre-test probability of DVT", color: "#3B82F6" },
  { id: "wells-pe", name: "Wells PE", description: "Pre-test probability of PE", color: "#F59E0B" },
  { id: "curb65", name: "CURB-65", description: "Pneumonia severity and admission", color: "#10B981" },
  { id: "gcs", name: "Glasgow Coma Scale", description: "Level of consciousness assessment", color: "#06B6D4" },
];

function ResultBadge({ score, label, color, interpretation }: { score: number; label: string; color: string; interpretation: string }) {
  return (
    <div className="rounded-2xl p-6 bg-white text-center" style={{ border: `1.5px solid ${color}33`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <div className="text-5xl font-extrabold mb-1" style={{ color }}>{score}</div>
      <div className="text-lg font-semibold mb-2" style={{ color: "#1C1C1E" }}>{label}</div>
      <div className="text-sm" style={{ color: "#636366" }}>{interpretation}</div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-gray-50"
      style={{ border: `1.5px solid ${checked ? "#007AFF" : "rgba(60,60,67,0.15)"}`, background: checked ? "rgba(0,122,255,0.04)" : "#fff" }}>
      <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all"
        style={{ background: checked ? "#007AFF" : "transparent", border: checked ? "none" : "1.5px solid rgba(60,60,67,0.3)" }}>
        {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className="text-sm" style={{ color: "#1C1C1E" }}>{label}</span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
    </label>
  );
}

export default function RiskCalculator() {
  const [activeCalc, setActiveCalc] = useState<CalcId>("ascvd");

  // ASCVD
  const [age, setAge] = useState(""); const [sex, setSex] = useState("male"); const [race, setRace] = useState("white");
  const [tc, setTc] = useState(""); const [hdl, setHdl] = useState(""); const [sbp, setSbp] = useState("");
  const [treated, setTreated] = useState(false); const [diabetic, setDiabetic] = useState(false); const [smoker, setSmoker] = useState(false);

  // CHA2DS2
  const [cFields, setCFields] = useState({ ccf: false, htn: false, age75: false, dm: false, stroke: false, vascular: false, age65: false, female: false });

  // Wells DVT
  const [dvt, setDvt] = useState({ cancer: false, paralysis: false, bedRest: false, tenderness: false, swelling: false, calf3: false, pitting: false, collateral: false, altDx: false });

  // Wells PE
  const [pe, setPe] = useState({ dvtSigns: false, altLess: false, hr100: false, immobile: false, priorDvt: false, haemoptysis: false, malignancy: false });

  // CURB-65
  const [curb, setCurb] = useState({ confusion: false, urea8: false, rr30: false, bp90: false, age65: false });

  // GCS
  const [eye, setEye] = useState(4); const [verbal, setVerbal] = useState(5); const [motor, setMotor] = useState(6);

  const toggle = (setter: any, key: string) => setter((prev: any) => ({ ...prev, [key]: !prev[key] }));

  const calcASCVD = () => {
    const a = parseFloat(age), t = parseFloat(tc), h = parseFloat(hdl), s = parseFloat(sbp);
    if (!a || !t || !h || !s) return null;
    let base = 0;
    base += (sex === "male") ? a * 0.064 : a * 0.071;
    base += (t - h) * 0.014;
    base += s * 0.008;
    if (treated) base += 0.15;
    if (diabetic) base += sex === "male" ? 0.6 : 0.66;
    if (smoker) base += sex === "male" ? 0.84 : 0.87;
    if (race === "aa") base += sex === "male" ? 0.56 : 0.49;
    const risk = Math.min(Math.max((1 - Math.exp(-Math.exp(base - 10.79))) * 100, 0.5), 99);
    return +risk.toFixed(1);
  };

  const calcCHADS = () => Object.values(cFields).reduce((s, v, i) => s + (v ? (i === 2 || i === 4 ? 2 : 1) : 0), 0);

  const calcDVT = () => {
    let score = Object.values(dvt).reduce((s, v) => s + (v ? 1 : 0), 0);
    if (dvt.altDx) score -= 2;
    return score;
  };

  const calcPE = () => {
    let score = 0;
    if (pe.dvtSigns) score += 3; if (pe.altLess) score += 3; if (pe.hr100) score += 1.5;
    if (pe.immobile) score += 1.5; if (pe.priorDvt) score += 1.5; if (pe.haemoptysis) score += 1;
    if (pe.malignancy) score += 1;
    return score;
  };

  const calcCURB = () => Object.values(curb).filter(Boolean).length;
  const calcGCS = () => eye + verbal + motor;

  const col = CALCS.find(c => c.id === activeCalc)!.color;

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
      <div className="relative overflow-hidden" >
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(10,22,40,0.93) 0%, rgba(13,33,68,0.9) 50%, rgba(10,48,96,0.93) 100%)" }} />
        <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative z-10">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,122,255,0.2)" }}>
              <Heart className="w-5 h-5" style={{ color: "#007AFF" }} />
            </div>
            <h1 className="text-3xl font-bold text-white">Clinical Risk Calculators</h1>
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>ASCVD, CHA₂DS₂-VASc, Wells, CURB-65, GCS and more.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CALCS.map(c => (
            <button key={c.id} onClick={() => setActiveCalc(c.id)}
              className="rounded-2xl p-4 text-left transition-all"
              style={activeCalc === c.id ? {
                background: "#fff", border: `2px solid ${c.color}`, boxShadow: `0 4px 12px ${c.color}25`
              } : { background: "#fff", border: "1.5px solid rgba(60,60,67,0.1)" }}>
              <div className="text-sm font-semibold mb-0.5" style={{ color: activeCalc === c.id ? c.color : "#1C1C1E" }}>{c.name}</div>
              <div className="text-xs" style={{ color: "#AEAEB2" }}>{c.description}</div>
            </button>
          ))}
        </div>

        {/* ASCVD */}
        {activeCalc === "ascvd" && (() => {
          const risk = calcASCVD();
          return (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h2 className="font-semibold mb-4" style={{ color: "#1C1C1E" }}>ASCVD 10-Year Risk (ACC/AHA 2013)</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[{ label: "Age (years)", val: age, set: setAge, placeholder: "40–79" },
                    { label: "Total Cholesterol (mg/dL)", val: tc, set: setTc, placeholder: "e.g. 200" },
                    { label: "HDL Cholesterol (mg/dL)", val: hdl, set: setHdl, placeholder: "e.g. 50" },
                    { label: "Systolic BP (mmHg)", val: sbp, set: setSbp, placeholder: "e.g. 130" }
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#1C1C1E" }}>{f.label}</label>
                      <input type="number" placeholder={f.placeholder} value={f.val} onChange={e => f.set(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#1C1C1E" }}>Sex</label>
                    <select value={sex} onChange={e => setSex(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E", background: "#fff" }}>
                      <option value="male">Male</option><option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#1C1C1E" }}>Race</label>
                    <select value={race} onChange={e => setRace(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E", background: "#fff" }}>
                      <option value="white">White</option><option value="aa">African American</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2 mb-5">
                  {[{ label: "On BP treatment", val: treated, set: setTreated }, { label: "Diabetic", val: diabetic, set: setDiabetic }, { label: "Current smoker", val: smoker, set: setSmoker }].map(f => (
                    <Checkbox key={f.label} label={f.label} checked={f.val} onChange={() => f.set(!f.val)} />
                  ))}
                </div>
                {risk !== null && (
                  <ResultBadge score={risk} label={`${risk >= 20 ? "High" : risk >= 7.5 ? "Borderline High" : "Low-Intermediate"} Risk`}
                    color={risk >= 20 ? "#EF4444" : risk >= 7.5 ? "#F59E0B" : "#10B981"}
                    interpretation={`${risk}% 10-year ASCVD risk. ${risk >= 20 ? "High-intensity statin recommended." : risk >= 7.5 ? "Moderate-to-high intensity statin. Discuss lifestyle." : "Lifestyle modification. Statin may be considered."}`} />
                )}
              </div>
            </div>
          );
        })()}

        {/* CHA2DS2 */}
        {activeCalc === "chads2" && (() => {
          const score = calcCHADS();
          const fields = [
            { key: "ccf", label: "Congestive heart failure (+1)" },
            { key: "htn", label: "Hypertension (+1)" },
            { key: "age75", label: "Age ≥ 75 years (+2)" },
            { key: "dm", label: "Diabetes mellitus (+1)" },
            { key: "stroke", label: "Prior stroke/TIA/thromboembolism (+2)" },
            { key: "vascular", label: "Vascular disease (MI, PAD, aortic plaque) (+1)" },
            { key: "age65", label: "Age 65–74 years (+1)" },
            { key: "female", label: "Female sex (+1)" },
          ];
          return (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h2 className="font-semibold mb-4" style={{ color: "#1C1C1E" }}>CHA₂DS₂-VASc Score</h2>
                <div className="space-y-2 mb-5">
                  {fields.map(f => <Checkbox key={f.key} label={f.label} checked={(cFields as any)[f.key]} onChange={() => toggle(setCFields, f.key)} />)}
                </div>
                <ResultBadge score={score} label={score === 0 ? "Low" : score === 1 ? "Low-Moderate" : "Moderate-High"} color={score === 0 ? "#10B981" : score === 1 ? "#F59E0B" : "#EF4444"}
                  interpretation={score === 0 ? "No antithrombotic therapy recommended." : score === 1 ? "Anticoagulation may be considered (males). Anticoagulate females." : `Annual stroke risk ~${Math.min(score * 1.5, 15).toFixed(1)}%. OAC recommended (DOAC preferred).`} />
              </div>
            </div>
          );
        })()}

        {/* Wells DVT */}
        {activeCalc === "wells-dvt" && (() => {
          const score = calcDVT();
          const fields = [
            { key: "cancer", label: "Active cancer (treatment ongoing or within 6 months) (+1)" },
            { key: "paralysis", label: "Paralysis, paresis or recent plaster immobilisation of lower extremity (+1)" },
            { key: "bedRest", label: "Recently bedridden >3 days or major surgery within 12 weeks (+1)" },
            { key: "tenderness", label: "Localised tenderness along deep venous system (+1)" },
            { key: "swelling", label: "Entire leg swollen (+1)" },
            { key: "calf3", label: "Calf swelling ≥3cm compared to asymptomatic side (+1)" },
            { key: "pitting", label: "Pitting oedema confined to symptomatic leg (+1)" },
            { key: "collateral", label: "Collateral superficial veins (non-varicose) (+1)" },
            { key: "altDx", label: "Alternative diagnosis at least as likely (−2)" },
          ];
          return (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h2 className="font-semibold mb-4" style={{ color: "#1C1C1E" }}>Wells DVT Score</h2>
                <div className="space-y-2 mb-5">
                  {fields.map(f => <Checkbox key={f.key} label={f.label} checked={(dvt as any)[f.key]} onChange={() => toggle(setDvt, f.key)} />)}
                </div>
                <ResultBadge score={score} label={score <= 0 ? "Low Probability" : score <= 2 ? "Moderate Probability" : "High Probability"}
                  color={score <= 0 ? "#10B981" : score <= 2 ? "#F59E0B" : "#EF4444"}
                  interpretation={score <= 0 ? "DVT unlikely. D-dimer if needed. Sensitivity ~95%." : score <= 2 ? "Moderate risk. D-dimer if negative — DVT excluded. If positive — USS." : "High probability. Proceed to USS directly. Consider LMWH while awaiting."} />
              </div>
            </div>
          );
        })()}

        {/* Wells PE */}
        {activeCalc === "wells-pe" && (() => {
          const score = calcPE();
          const fields = [
            { key: "dvtSigns", label: "Clinical signs/symptoms of DVT (+3)" },
            { key: "altLess", label: "PE is #1 diagnosis or equally likely (+3)" },
            { key: "hr100", label: "Heart rate > 100 bpm (+1.5)" },
            { key: "immobile", label: "Immobilisation ≥3 days or surgery in previous 4 weeks (+1.5)" },
            { key: "priorDvt", label: "Previous DVT/PE (+1.5)" },
            { key: "haemoptysis", label: "Haemoptysis (+1)" },
            { key: "malignancy", label: "Malignancy (treatment within 6 months or palliative) (+1)" },
          ];
          return (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h2 className="font-semibold mb-4" style={{ color: "#1C1C1E" }}>Wells PE Score</h2>
                <div className="space-y-2 mb-5">
                  {fields.map(f => <Checkbox key={f.key} label={f.label} checked={(pe as any)[f.key]} onChange={() => toggle(setPe, f.key)} />)}
                </div>
                <ResultBadge score={score} label={score <= 1 ? "Low" : score <= 6 ? "Moderate" : "High"} color={score <= 1 ? "#10B981" : score <= 6 ? "#F59E0B" : "#EF4444"}
                  interpretation={score <= 1 ? "Low probability. D-dimer. If negative — PE excluded." : score <= 6 ? "Moderate probability. CTPA recommended." : "High probability. CTPA urgently. Anticoagulate immediately."} />
              </div>
            </div>
          );
        })()}

        {/* CURB-65 */}
        {activeCalc === "curb65" && (() => {
          const score = calcCURB();
          const fields = [
            { key: "confusion", label: "Confusion (new disorientation to person, place or time) (+1)" },
            { key: "urea8", label: "Urea > 7 mmol/L (BUN > 19 mg/dL) (+1)" },
            { key: "rr30", label: "Respiratory rate ≥ 30 breaths/min (+1)" },
            { key: "bp90", label: "BP systolic < 90 or diastolic ≤ 60 mmHg (+1)" },
            { key: "age65", label: "Age ≥ 65 years (+1)" },
          ];
          const rec = score <= 1 ? "Low severity — home treatment" : score === 2 ? "Moderate — short stay or supervised outpatient" : score <= 4 ? "Severe — hospital admission, consider ICU" : "Very severe — ICU admission";
          return (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h2 className="font-semibold mb-4" style={{ color: "#1C1C1E" }}>CURB-65 Pneumonia Score</h2>
                <div className="space-y-2 mb-5">
                  {fields.map(f => <Checkbox key={f.key} label={f.label} checked={(curb as any)[f.key]} onChange={() => toggle(setCurb, f.key)} />)}
                </div>
                <ResultBadge score={score} label={score <= 1 ? "Mild" : score === 2 ? "Moderate" : "Severe"} color={score <= 1 ? "#10B981" : score === 2 ? "#F59E0B" : "#EF4444"}
                  interpretation={rec} />
              </div>
            </div>
          );
        })()}

        {/* GCS */}
        {activeCalc === "gcs" && (() => {
          const score = calcGCS();
          const eyeOpts = ["1 – No eye opening", "2 – Opens to pain", "3 – Opens to voice", "4 – Spontaneous"];
          const verbalOpts = ["1 – No verbal response", "2 – Incomprehensible sounds", "3 – Inappropriate words", "4 – Confused speech", "5 – Oriented"];
          const motorOpts = ["1 – No motor response", "2 – Extension (decerebrate)", "3 – Flexion (decorticate)", "4 – Withdrawal from pain", "5 – Localises pain", "6 – Obeys commands"];
          return (
            <div className="space-y-4">
              <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h2 className="font-semibold mb-4" style={{ color: "#1C1C1E" }}>Glasgow Coma Scale</h2>
                {[{ label: "Eye Opening (E)", opts: eyeOpts, val: eye, set: setEye },
                  { label: "Verbal Response (V)", opts: verbalOpts, val: verbal, set: setVerbal },
                  { label: "Motor Response (M)", opts: motorOpts, val: motor, set: setMotor }].map(g => (
                    <div key={g.label} className="mb-5">
                      <label className="block text-sm font-semibold mb-2" style={{ color: "#1C1C1E" }}>{g.label}</label>
                      <div className="space-y-1.5">
                        {g.opts.map((o, i) => (
                          <button key={i} onClick={() => g.set(i + 1)}
                            className="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all"
                            style={g.val === i + 1 ? { background: "rgba(0,122,255,0.08)", border: "1.5px solid #007AFF", color: "#007AFF", fontWeight: 600 } :
                              { background: "#F2F2F7", border: "1px solid transparent", color: "#1C1C1E" }}>
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                <ResultBadge score={score} label={score <= 8 ? "Severe" : score <= 12 ? "Moderate" : "Mild"}
                  color={score <= 8 ? "#EF4444" : score <= 12 ? "#F59E0B" : "#10B981"}
                  interpretation={`E${eye}V${verbal}M${motor} = ${score}/15. ${score <= 8 ? "Airway protection required. Intubation likely." : score <= 12 ? "Closely monitor. CT head. Neurological review." : "Mild impairment. Serial assessment. CT head if indicated."}`} />
              </div>
            </div>
          );
        })()}

        <p className="text-xs text-center" style={{ color: "#AEAEB2" }}>
          Scores are clinical aids. Use alongside clinical judgement, history and investigations. Not a substitute for direct clinical assessment.
        </p>
      </div>
    </div>
  );
}
