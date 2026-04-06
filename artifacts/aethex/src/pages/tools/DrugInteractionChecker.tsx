import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Pill, X, AlertTriangle, CheckCircle, Info, Plus, Crown, Download } from "lucide-react";
import { useUserAuth } from "@/hooks/use-user-auth";
import { UpgradeModal } from "@/components/UpgradeModal";
import { PayPerReport } from "@/components/PayPerReport";

interface Interaction {
  drug1: string;
  drug2: string;
  severity: "major" | "moderate" | "minor";
  description: string;
  mechanism: string;
  management: string;
}

const INTERACTIONS: Interaction[] = [
  { drug1: "warfarin", drug2: "aspirin", severity: "major", description: "Increased risk of bleeding", mechanism: "Additive anticoagulant and antiplatelet effects", management: "Avoid combination unless benefit outweighs risk. Monitor INR closely." },
  { drug1: "warfarin", drug2: "ibuprofen", severity: "major", description: "Increased bleeding risk and INR elevation", mechanism: "NSAIDs inhibit platelet function and may displace warfarin from protein binding", management: "Avoid NSAIDs with warfarin. Use paracetamol for analgesia." },
  { drug1: "metformin", drug2: "alcohol", severity: "major", description: "Increased risk of lactic acidosis", mechanism: "Alcohol inhibits hepatic lactate metabolism", management: "Advise patients to avoid alcohol. Monitor lactate levels." },
  { drug1: "simvastatin", drug2: "amlodipine", severity: "moderate", description: "Increased risk of myopathy/rhabdomyolysis", mechanism: "Amlodipine inhibits CYP3A4, raising simvastatin levels", management: "Limit simvastatin dose to 20mg/day when combined with amlodipine." },
  { drug1: "metoprolol", drug2: "verapamil", severity: "major", description: "Risk of heart block and severe bradycardia", mechanism: "Additive negative chronotropic and dromotropic effects", management: "Combination generally contraindicated. Use with extreme caution and ECG monitoring." },
  { drug1: "ssri", drug2: "tramadol", severity: "major", description: "Serotonin syndrome risk", mechanism: "Both increase serotonergic activity", management: "Avoid combination. Use alternative analgesics." },
  { drug1: "fluoxetine", drug2: "tramadol", severity: "major", description: "Serotonin syndrome and reduced tramadol efficacy", mechanism: "CYP2D6 inhibition and serotonergic potentiation", management: "Avoid. Consider alternative opioids." },
  { drug1: "clopidogrel", drug2: "omeprazole", severity: "moderate", description: "Reduced antiplatelet effect of clopidogrel", mechanism: "Omeprazole inhibits CYP2C19, reducing clopidogrel activation", management: "Use pantoprazole instead if PPI is needed." },
  { drug1: "ciprofloxacin", drug2: "antacids", severity: "moderate", description: "Reduced ciprofloxacin absorption", mechanism: "Divalent cations chelate fluoroquinolones", management: "Separate administration by at least 2 hours." },
  { drug1: "digoxin", drug2: "amiodarone", severity: "major", description: "Increased digoxin toxicity", mechanism: "Amiodarone inhibits digoxin renal and hepatic clearance", management: "Reduce digoxin dose by 50%. Monitor digoxin levels closely." },
  { drug1: "lithium", drug2: "ibuprofen", severity: "major", description: "Lithium toxicity due to raised lithium levels", mechanism: "NSAIDs reduce renal prostaglandin synthesis, decreasing lithium excretion", management: "Avoid NSAIDs. Use paracetamol. Monitor lithium levels." },
  { drug1: "sildenafil", drug2: "nitrates", severity: "major", description: "Severe hypotension, potentially fatal", mechanism: "Additive vasodilatory effects via cGMP pathway", management: "Absolutely contraindicated. Nitrates should not be given within 24h of sildenafil." },
  { drug1: "methotrexate", drug2: "nsaids", severity: "major", description: "Methotrexate toxicity", mechanism: "NSAIDs reduce renal clearance of methotrexate", management: "Avoid combination. If necessary, use with close monitoring and folinic acid rescue." },
  { drug1: "atorvastatin", drug2: "clarithromycin", severity: "major", description: "Increased statin levels and myopathy risk", mechanism: "Clarithromycin strongly inhibits CYP3A4", management: "Suspend statin therapy during clarithromycin course." },
  { drug1: "metronidazole", drug2: "alcohol", severity: "major", description: "Disulfiram-like reaction: flushing, vomiting, palpitations", mechanism: "Inhibition of aldehyde dehydrogenase", management: "Avoid alcohol during treatment and for 48 hours after completion." },
  { drug1: "phenytoin", drug2: "fluconazole", severity: "major", description: "Phenytoin toxicity", mechanism: "Fluconazole inhibits CYP2C9, reducing phenytoin metabolism", management: "Monitor phenytoin levels. May need dose reduction." },
  { drug1: "amlodipine", drug2: "clarithromycin", severity: "moderate", description: "Hypotension and ankle oedema", mechanism: "CYP3A4 inhibition increases amlodipine levels", management: "Monitor BP. Consider dose reduction of amlodipine." },
  { drug1: "spironolactone", drug2: "ace inhibitors", severity: "moderate", description: "Hyperkalaemia", mechanism: "Both agents increase potassium retention", management: "Monitor potassium levels. Avoid in patients with renal impairment." },
  { drug1: "sertraline", drug2: "maois", severity: "major", description: "Serotonin syndrome — potentially fatal", mechanism: "Excessive serotonergic stimulation", management: "Absolutely contraindicated. Allow 14-day washout between agents." },
  { drug1: "warfarin", drug2: "ciprofloxacin", severity: "major", description: "Significantly increased INR and bleeding risk", mechanism: "Ciprofloxacin inhibits warfarin metabolism via CYP1A2", management: "Monitor INR closely. Reduce warfarin dose as needed." },
];

const COMMON_DRUGS = ["Warfarin","Aspirin","Ibuprofen","Metformin","Simvastatin","Atorvastatin","Amlodipine","Metoprolol","Verapamil","Digoxin","Amiodarone","Clopidogrel","Omeprazole","Ciprofloxacin","Metronidazole","Fluconazole","Clarithromycin","Phenytoin","Lithium","Sildenafil","Tramadol","Fluoxetine","Sertraline","Spironolactone","Methotrexate","Nitrates","Alcohol","Antacids","NSAIDs","MAOIs"];

const severityConfig = {
  major: { color: "#EF4444", bg: "#FEF2F2", label: "Major", icon: <AlertTriangle className="w-4 h-4" /> },
  moderate: { color: "#F59E0B", bg: "#FFFBEB", label: "Moderate", icon: <Info className="w-4 h-4" /> },
  minor: { color: "#10B981", bg: "#F0FDF4", label: "Minor", icon: <CheckCircle className="w-4 h-4" /> },
};

export default function DrugInteractionChecker() {
  const { isPro, user } = useUserAuth();
  const [drugs, setDrugs] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const addDrug = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (drugs.length >= 8) return;
    if (drugs.some(d => d.toLowerCase() === trimmed.toLowerCase())) return;
    setDrugs(prev => [...prev, trimmed]);
    setInput("");
    setChecked(false);
  };

  const removeDrug = (i: number) => {
    setDrugs(prev => prev.filter((_, idx) => idx !== i));
    setChecked(false);
  };

  const check = () => {
    const normalized = drugs.map(d => d.toLowerCase());
    const found: Interaction[] = [];
    for (let i = 0; i < normalized.length; i++) {
      for (let j = i + 1; j < normalized.length; j++) {
        const a = normalized[i], b = normalized[j];
        const match = INTERACTIONS.find(x =>
          (x.drug1 === a && x.drug2 === b) ||
          (x.drug1 === b && x.drug2 === a) ||
          (normalized.some(d => d.includes(x.drug1)) && normalized.some(d => d.includes(x.drug2)))
        );
        if (match && !found.find(f => f.drug1 === match.drug1 && f.drug2 === match.drug2)) {
          found.push(match);
        }
      }
    }
    setInteractions(found);
    setChecked(true);
  };

  const majorCount = interactions.filter(i => i.severity === "major").length;
  const modCount = interactions.filter(i => i.severity === "moderate").length;

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(10,22,40,0.93) 0%, rgba(13,33,68,0.9) 50%, rgba(10,48,96,0.93) 100%)" }} />
        <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative z-10">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,194,168,0.2)" }}>
              <Pill className="w-5 h-5" style={{ color: "#00C2A8" }} />
            </div>
            <h1 className="text-3xl font-bold text-white">Drug Interaction Checker</h1>
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Check clinically significant interactions between multiple medications.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <h2 className="font-semibold mb-4" style={{ color: "#1C1C1E" }}>Enter Medications</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Type drug name and press Enter or +"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addDrug(input)}
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }}
            />
            <button onClick={() => addDrug(input)} className="px-4 py-3 rounded-xl text-white transition-all hover:opacity-90" style={{ background: "#007AFF" }}>
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-4">
            <p className="text-xs font-medium mb-2" style={{ color: "#AEAEB2" }}>Common medications</p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_DRUGS.slice(0, 15).map(d => (
                <button key={d} onClick={() => addDrug(d)}
                  disabled={drugs.some(x => x.toLowerCase() === d.toLowerCase())}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
                  style={{
                    background: drugs.some(x => x.toLowerCase() === d.toLowerCase()) ? "#F2F2F7" : "rgba(0,122,255,0.08)",
                    color: drugs.some(x => x.toLowerCase() === d.toLowerCase()) ? "#AEAEB2" : "#007AFF",
                    border: "1px solid rgba(0,122,255,0.15)",
                  }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          {drugs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {drugs.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(0,194,168,0.1)", border: "1px solid rgba(0,194,168,0.25)" }}>
                  <span className="text-sm font-medium" style={{ color: "#00C2A8" }}>{d}</span>
                  <button onClick={() => removeDrug(i)} className="hover:opacity-70">
                    <X className="w-3.5 h-3.5" style={{ color: "#00C2A8" }} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button onClick={check} disabled={drugs.length < 2}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
            {drugs.length < 2 ? `Add at least ${2 - drugs.length} more drug${drugs.length === 0 ? "s" : ""}` : `Check ${drugs.length} Medications`}
          </button>
        </div>

        {checked && (
          <div className="space-y-4">
            <div className="rounded-2xl p-5 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-semibold" style={{ color: "#1C1C1E" }}>Interaction Summary</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium px-3 py-1 rounded-full"
                    style={{ background: interactions.length === 0 ? "#F0FDF4" : "#FEF2F2", color: interactions.length === 0 ? "#10B981" : "#EF4444" }}>
                    {interactions.length === 0 ? "No interactions found" : `${interactions.length} interaction${interactions.length > 1 ? "s" : ""} found`}
                  </span>
                  {interactions.length > 0 && (
                    <button
                      onClick={() => setShowReport(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}
                    >
                      <Download className="w-3 h-3" /> PDF Report ₹29
                    </button>
                  )}
                </div>
              </div>
              {interactions.length > 0 && (
                <div className="flex gap-4 mt-3">
                  {majorCount > 0 && <span className="text-sm" style={{ color: "#EF4444" }}>{majorCount} Major</span>}
                  {modCount > 0 && <span className="text-sm" style={{ color: "#F59E0B" }}>{modCount} Moderate</span>}
                </div>
              )}
            </div>

            {interactions.length === 0 ? (
              <div className="rounded-2xl p-8 bg-white text-center" style={{ border: "1px solid rgba(60,60,67,0.1)" }}>
                <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "#10B981" }} />
                <p className="font-semibold mb-1" style={{ color: "#1C1C1E" }}>No known interactions detected</p>
                <p className="text-sm" style={{ color: "#636366" }}>No clinically significant interactions found among the checked medications. Always verify with a pharmacist.</p>
              </div>
            ) : (
              interactions.map((ix, i) => {
                const cfg = severityConfig[ix.severity];
                return (
                  <div key={i} className="rounded-2xl p-5 bg-white" style={{ border: `1.5px solid ${cfg.color}33`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold capitalize" style={{ color: "#1C1C1E" }}>{ix.drug1}</span>
                          <span style={{ color: "#AEAEB2" }}>+</span>
                          <span className="font-semibold capitalize" style={{ color: "#1C1C1E" }}>{ix.drug2}</span>
                        </div>
                        <p className="text-sm font-medium" style={{ color: cfg.color }}>{ix.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}33` }}>
                        {cfg.icon}
                        <span className="text-xs font-semibold">{cfg.label}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm" style={{ color: "#636366" }}>
                      {isPro ? (
                        <>
                          <div><span className="font-medium" style={{ color: "#1C1C1E" }}>Mechanism: </span>{ix.mechanism}</div>
                          <div><span className="font-medium" style={{ color: "#1C1C1E" }}>Management: </span>{ix.management}</div>
                        </>
                      ) : (
                        <div
                          className="relative cursor-pointer"
                          onClick={() => setShowUpgrade(true)}
                        >
                          <div className="blur-sm select-none space-y-1">
                            <div><span className="font-medium" style={{ color: "#1C1C1E" }}>Mechanism: </span>{ix.mechanism}</div>
                            <div><span className="font-medium" style={{ color: "#1C1C1E" }}>Management: </span>{ix.management}</div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center rounded-lg" style={{ background: "rgba(242,242,247,0.7)" }}>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                              style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" }}>
                              <Crown className="w-3 h-3" /> Cadus Magnus Only
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            <p className="text-xs text-center" style={{ color: "#AEAEB2" }}>
              This tool is for clinical reference only. Always consult a pharmacist for complex polypharmacy.
            </p>
          </div>
        )}
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} featureName="drug interaction details" />}
      {showReport && (
        <PayPerReport
          payload={{
            reportType: "drug-interaction",
            reportData: { drugs, interactions },
            description: `Drug interaction report for ${drugs.join(", ")}`,
          }}
          price={29}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
