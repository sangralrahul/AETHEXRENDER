import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Weight, RefreshCw } from "lucide-react";

type Unit = "metric" | "imperial";

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  idealMin: number;
  idealMax: number;
  description: string;
}

function calcBMI(weight: number, height: number): number {
  return weight / (height * height);
}

function classifyBMI(bmi: number): { category: string; color: string; description: string } {
  if (bmi < 18.5) return { category: "Underweight", color: "#3B82F6", description: "Below healthy weight range. Consider nutritional assessment." };
  if (bmi < 25) return { category: "Normal weight", color: "#10B981", description: "Healthy weight range. Maintain current lifestyle habits." };
  if (bmi < 30) return { category: "Overweight", color: "#F59E0B", description: "Slightly above healthy range. Lifestyle modifications recommended." };
  if (bmi < 35) return { category: "Obese Class I", color: "#EF4444", description: "Increased risk of comorbidities. Medical consultation advised." };
  if (bmi < 40) return { category: "Obese Class II", color: "#DC2626", description: "High risk. Medical intervention strongly recommended." };
  return { category: "Obese Class III", color: "#991B1B", description: "Very high risk. Immediate medical attention required." };
}

export default function BMICalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculate = () => {
    let weightInKg: number;
    let heightInM: number;

    if (unit === "metric") {
      weightInKg = parseFloat(weightKg);
      heightInM = parseFloat(heightCm) / 100;
    } else {
      weightInKg = parseFloat(weightLbs) * 0.453592;
      const totalInches = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
      heightInM = totalInches * 0.0254;
    }

    if (!weightInKg || !heightInM || weightInKg <= 0 || heightInM <= 0) return;

    const bmi = calcBMI(weightInKg, heightInM);
    const { category, color, description } = classifyBMI(bmi);
    const idealMin = +(18.5 * heightInM * heightInM).toFixed(1);
    const idealMax = +(24.9 * heightInM * heightInM).toFixed(1);

    setResult({ bmi: +bmi.toFixed(1), category, color, idealMin, idealMax, description });
  };

  const reset = () => {
    setWeightKg(""); setHeightCm(""); setWeightLbs(""); setHeightFt(""); setHeightIn("");
    setResult(null);
  };

  const bmiPercent = result ? Math.min(Math.max(((result.bmi - 10) / 40) * 100, 0), 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(160deg,#0A1628,#0D2144,#0A3060)" }}>
        <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative z-10">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,122,255,0.2)" }}>
              <Weight className="w-5 h-5" style={{ color: "#007AFF" }} />
            </div>
            <h1 className="text-3xl font-bold text-white">BMI Calculator</h1>
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Body Mass Index with WHO classification and ideal weight range.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Unit Toggle */}
        <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: "#F2F2F7" }}>
            {(["metric", "imperial"] as Unit[]).map(u => (
              <button key={u} onClick={() => { setUnit(u); reset(); }}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                style={unit === u ? { background: "#fff", color: "#007AFF", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" } : { color: "#636366" }}>
                {u}
              </button>
            ))}
          </div>

          {unit === "metric" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#1C1C1E" }}>Weight (kg)</label>
                <input type="number" placeholder="e.g. 70" value={weightKg} onChange={e => setWeightKg(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#1C1C1E" }}>Height (cm)</label>
                <input type="number" placeholder="e.g. 175" value={heightCm} onChange={e => setHeightCm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#1C1C1E" }}>Weight (lbs)</label>
                <input type="number" placeholder="e.g. 154" value={weightLbs} onChange={e => setWeightLbs(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#1C1C1E" }}>Height (ft)</label>
                <input type="number" placeholder="e.g. 5" value={heightFt} onChange={e => setHeightFt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#1C1C1E" }}>Height (in)</label>
                <input type="number" placeholder="e.g. 9" value={heightIn} onChange={e => setHeightIn(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={calculate}
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
              Calculate BMI
            </button>
            <button onClick={reset} className="px-4 py-3 rounded-xl transition-all hover:opacity-70"
              style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#636366" }}>
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {result && (
          <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div className="text-center mb-6">
              <div className="text-6xl font-extrabold mb-1" style={{ color: result.color }}>{result.bmi}</div>
              <div className="text-lg font-semibold mb-1" style={{ color: result.color }}>{result.category}</div>
              <p className="text-sm" style={{ color: "#636366" }}>{result.description}</p>
            </div>

            {/* BMI Scale */}
            <div className="mb-6">
              <div className="h-3 rounded-full mb-2 relative" style={{ background: "linear-gradient(to right, #3B82F6, #10B981, #F59E0B, #EF4444, #991B1B)" }}>
                <div className="absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-0.5 border-2 border-white"
                  style={{ left: `${bmiPercent}%`, background: result.color, boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }} />
              </div>
              <div className="flex justify-between text-[10px]" style={{ color: "#AEAEB2" }}>
                <span>10 (Under)</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: "#F2F2F7" }}>
                <div className="text-xs font-medium mb-1" style={{ color: "#AEAEB2" }}>Ideal Weight Min</div>
                <div className="text-xl font-bold" style={{ color: "#1C1C1E" }}>{result.idealMin} kg</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: "#F2F2F7" }}>
                <div className="text-xs font-medium mb-1" style={{ color: "#AEAEB2" }}>Ideal Weight Max</div>
                <div className="text-xl font-bold" style={{ color: "#1C1C1E" }}>{result.idealMax} kg</div>
              </div>
            </div>

            {/* WHO Table */}
            <div className="mt-5 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(60,60,67,0.1)" }}>
              {[
                { range: "< 18.5", label: "Underweight", color: "#3B82F6" },
                { range: "18.5 – 24.9", label: "Normal weight", color: "#10B981" },
                { range: "25.0 – 29.9", label: "Overweight", color: "#F59E0B" },
                { range: "30.0 – 34.9", label: "Obese Class I", color: "#EF4444" },
                { range: "35.0 – 39.9", label: "Obese Class II", color: "#DC2626" },
                { range: "≥ 40.0", label: "Obese Class III", color: "#991B1B" },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5"
                  style={{ background: result.category === row.label ? `${row.color}12` : "transparent", borderTop: i > 0 ? "1px solid rgba(60,60,67,0.08)" : "none" }}>
                  <span className="text-sm font-mono" style={{ color: "#636366" }}>{row.range}</span>
                  <span className="text-sm font-medium" style={{ color: row.color }}>{row.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
