import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Calculator, RefreshCw, AlertTriangle } from "lucide-react";

interface DrugConfig {
  name: string;
  standardDose: number;
  unit: string;
  frequency: string;
  maxDose: number;
  weightBased: boolean;
  renalAdjust?: boolean;
  notes?: string;
}

const DRUGS: DrugConfig[] = [
  { name: "Amoxicillin", standardDose: 25, unit: "mg/kg/day", frequency: "TDS", maxDose: 3000, weightBased: true, notes: "Divide into 3 doses. Max 1g per dose." },
  { name: "Paracetamol", standardDose: 15, unit: "mg/kg", frequency: "QID (max)", maxDose: 4000, weightBased: true, notes: "Max 15mg/kg per dose, no more than 4 doses in 24h." },
  { name: "Ibuprofen", standardDose: 10, unit: "mg/kg", frequency: "TDS", maxDose: 2400, weightBased: true, notes: "Give with food. Avoid in renal impairment." },
  { name: "Azithromycin", standardDose: 10, unit: "mg/kg/day", frequency: "OD", maxDose: 500, weightBased: true, notes: "Single daily dose for 3–5 days." },
  { name: "Gentamicin", standardDose: 5, unit: "mg/kg/day", frequency: "OD", maxDose: 320, weightBased: true, renalAdjust: true, notes: "Renal dose adjustment required. Monitor trough levels." },
  { name: "Metronidazole", standardDose: 7.5, unit: "mg/kg", frequency: "TDS", maxDose: 4000, weightBased: true, notes: "Avoid alcohol. Give with food." },
  { name: "Ceftriaxone", standardDose: 50, unit: "mg/kg/day", frequency: "OD", maxDose: 4000, weightBased: true, notes: "Can be given IM or IV. Dilute appropriately." },
  { name: "Vancomycin", standardDose: 15, unit: "mg/kg", frequency: "QID", maxDose: 4500, weightBased: true, renalAdjust: true, notes: "Monitor trough levels (10–20 mg/L). Infuse slowly over 1h." },
  { name: "Prednisolone", standardDose: 1, unit: "mg/kg/day", frequency: "OD", maxDose: 60, weightBased: true, notes: "Taper gradually after prolonged use." },
  { name: "Atorvastatin", standardDose: 10, unit: "mg", frequency: "OD", maxDose: 80, weightBased: false, notes: "Fixed dose. Taken at night." },
  { name: "Metformin", standardDose: 500, unit: "mg", frequency: "BD-TDS", maxDose: 3000, weightBased: false, renalAdjust: true, notes: "Hold if eGFR <30. Start low and titrate." },
  { name: "Lisinopril", standardDose: 5, unit: "mg", frequency: "OD", maxDose: 40, weightBased: false, renalAdjust: true, notes: "Monitor K+ and creatinine. Contraindicated in pregnancy." },
];

const GFR_ADJUST: Record<string, Record<string, string>> = {
  "Gentamicin": { ">60": "Normal", "30–60": "Reduce dose or extend interval (q36–48h)", "15–30": "0.5–1 mg/kg q48h, monitor levels closely", "<15": "Avoid unless haemodialysis" },
  "Vancomycin": { ">60": "Normal", "30–60": "15mg/kg q24h, trough monitoring", "15–30": "15mg/kg q48h", "<15": "Loading dose only, levels guide redosing" },
  "Metformin": { ">60": "Normal", "30–60": "Use with caution, reduce dose by 50%", "15–30": "Contraindicated", "<15": "Contraindicated" },
  "Lisinopril": { ">60": "Normal", "30–60": "Start 2.5–5mg OD", "15–30": "2.5mg OD max", "<15": "Not recommended" },
};

export default function DosageCalculator() {
  const [selectedDrug, setSelectedDrug] = useState<DrugConfig | null>(null);
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gfr, setGfr] = useState(">60");
  const [result, setResult] = useState<{ dose: number; dailyDose: number; warning?: string } | null>(null);

  const calculate = () => {
    if (!selectedDrug) return;
    const w = parseFloat(weight);
    if (selectedDrug.weightBased && (!w || w <= 0)) return;

    let dose: number;
    let dailyDose: number;
    let warning: string | undefined;

    if (selectedDrug.weightBased) {
      dose = selectedDrug.standardDose * w;
      dailyDose = dose;
      if (dailyDose > selectedDrug.maxDose) {
        dailyDose = selectedDrug.maxDose;
        dose = selectedDrug.maxDose;
        warning = `Daily dose capped at ${selectedDrug.maxDose}mg (maximum daily dose).`;
      }
    } else {
      dose = selectedDrug.standardDose;
      dailyDose = selectedDrug.standardDose;
    }

    if (selectedDrug.renalAdjust && gfr !== ">60") {
      warning = (warning ? warning + " " : "") + `Renal adjustment required for eGFR ${gfr}. See guidance below.`;
    }

    const ageNum = parseFloat(age);
    if (ageNum && ageNum < 12 && !selectedDrug.weightBased) {
      warning = (warning ? warning + " " : "") + "Paediatric dosing: consult BNFc for weight-based adjustment.";
    }

    setResult({ dose: Math.round(dose * 10) / 10, dailyDose: Math.round(dailyDose * 10) / 10, warning });
  };

  const reset = () => { setSelectedDrug(null); setWeight(""); setAge(""); setGfr(">60"); setResult(null); };

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
              <Calculator className="w-5 h-5" style={{ color: "#007AFF" }} />
            </div>
            <h1 className="text-3xl font-bold text-white">Dosage Calculator</h1>
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Weight-based, renal-adjusted, and paediatric drug doses.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <h2 className="font-semibold mb-4" style={{ color: "#1C1C1E" }}>Select Drug</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {DRUGS.map(d => (
              <button key={d.name} onClick={() => { setSelectedDrug(d); setResult(null); }}
                className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                style={selectedDrug?.name === d.name ? {
                  background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#fff",
                } : {
                  background: "#F2F2F7", color: "#1C1C1E", border: "1px solid rgba(60,60,67,0.1)"
                }}>
                {d.name}
              </button>
            ))}
          </div>

          {selectedDrug && (
            <div className="space-y-4">
              <div className="rounded-xl p-4" style={{ background: "#F2F2F7" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "#AEAEB2" }}>Standard dosing</p>
                <p className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>{selectedDrug.standardDose} {selectedDrug.unit} — {selectedDrug.frequency}</p>
                {selectedDrug.notes && <p className="text-xs mt-1" style={{ color: "#636366" }}>{selectedDrug.notes}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedDrug.weightBased && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#1C1C1E" }}>Patient Weight (kg)</label>
                    <input type="number" placeholder="e.g. 70" value={weight} onChange={e => setWeight(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "#1C1C1E" }}>Age (years)</label>
                  <input type="number" placeholder="e.g. 35" value={age} onChange={e => setAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
                </div>
                {selectedDrug.renalAdjust && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#1C1C1E" }}>eGFR (mL/min/1.73m²)</label>
                    <select value={gfr} onChange={e => setGfr(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E", background: "#fff" }}>
                      {[">60", "30–60", "15–30", "<15"].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={calculate}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
                  Calculate Dose
                </button>
                <button onClick={reset} className="px-4 py-3 rounded-xl transition-all hover:opacity-70"
                  style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#636366" }}>
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {result && selectedDrug && (
          <div className="space-y-4">
            <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <h2 className="font-semibold mb-4" style={{ color: "#1C1C1E" }}>Calculated Dose — {selectedDrug.name}</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-xl p-4 text-center" style={{ background: "rgba(0,122,255,0.05)", border: "1px solid rgba(0,122,255,0.15)" }}>
                  <div className="text-xs font-medium mb-1" style={{ color: "#007AFF" }}>Per Dose</div>
                  <div className="text-3xl font-extrabold" style={{ color: "#007AFF" }}>{result.dose}<span className="text-lg ml-1">mg</span></div>
                  <div className="text-xs mt-1" style={{ color: "#636366" }}>{selectedDrug.frequency}</div>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "rgba(0,194,168,0.05)", border: "1px solid rgba(0,194,168,0.15)" }}>
                  <div className="text-xs font-medium mb-1" style={{ color: "#00C2A8" }}>Daily Total</div>
                  <div className="text-3xl font-extrabold" style={{ color: "#00C2A8" }}>{result.dailyDose}<span className="text-lg ml-1">mg</span></div>
                  <div className="text-xs mt-1" style={{ color: "#636366" }}>per day</div>
                </div>
              </div>

              {result.warning && (
                <div className="flex items-start gap-2.5 p-4 rounded-xl" style={{ background: "#FFFBEB", border: "1px solid rgba(245,158,11,0.3)" }}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
                  <p className="text-sm" style={{ color: "#92400E" }}>{result.warning}</p>
                </div>
              )}
            </div>

            {selectedDrug.renalAdjust && GFR_ADJUST[selectedDrug.name] && (
              <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h3 className="font-semibold mb-4" style={{ color: "#1C1C1E" }}>Renal Dose Adjustment — {selectedDrug.name}</h3>
                <div className="space-y-2">
                  {Object.entries(GFR_ADJUST[selectedDrug.name]).map(([efr, adj]) => (
                    <div key={efr} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: efr === gfr ? "rgba(0,122,255,0.07)" : "#F2F2F7", border: efr === gfr ? "1px solid rgba(0,122,255,0.2)" : "none" }}>
                      <span className="text-xs font-mono font-semibold w-20 shrink-0" style={{ color: "#007AFF" }}>eGFR {efr}</span>
                      <span className="text-sm" style={{ color: "#1C1C1E" }}>{adj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-center" style={{ color: "#AEAEB2" }}>
              Doses are indicative. Always verify against current BNF/MIMS and local guidelines. Use actual body weight unless obesity applies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
