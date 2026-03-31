import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ClipboardList, Search, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface Guideline {
  id: string;
  condition: string;
  specialty: string;
  source: string;
  lastUpdated: string;
  sections: { title: string; content: string[] }[];
}

const GUIDELINES: Guideline[] = [
  {
    id: "htn",
    condition: "Hypertension",
    specialty: "Cardiology",
    source: "NICE NG136 / JNC-8",
    lastUpdated: "2023",
    sections: [
      { title: "Diagnostic Thresholds", content: ["Stage 1: Clinic BP ≥140/90 mmHg + ABPM daytime average ≥135/85 mmHg", "Stage 2: Clinic BP ≥160/100 mmHg + ABPM daytime average ≥150/95 mmHg", "Severe: Clinic BP ≥180/120 mmHg"] },
      { title: "First-Line Treatment", content: ["Age <55 and non-Black: ACE inhibitor or ARB (e.g. ramipril 5–10mg OD)", "Age ≥55 or Black ethnicity: CCB (e.g. amlodipine 5–10mg OD)", "If CCB not tolerated or oedema: thiazide-like diuretic (indapamide)"] },
      { title: "Second/Third Line", content: ["Add CCB + ACEi/ARB (Step 2)", "Add thiazide diuretic (Step 3)", "If K+ <4.5 mmol/L: spironolactone 25mg OD; If K+ ≥4.5 mmol/L: alpha/beta-blocker (Step 4)"] },
      { title: "Targets", content: ["Age <80: <140/90 mmHg (clinic)", "Age ≥80: <150/90 mmHg", "Clinic BP <140/90 mmHg with treatment = well-controlled"] },
      { title: "Monitoring", content: ["Review 1 month after starting/changing treatment", "Annual review once stable", "Renal function, electrolytes annually (ACEi, ARB, diuretics)"] },
    ]
  },
  {
    id: "t2dm",
    condition: "Type 2 Diabetes Mellitus",
    specialty: "Endocrinology",
    source: "NICE NG28 / ADA Standards 2024",
    lastUpdated: "2024",
    sections: [
      { title: "Diagnosis", content: ["HbA1c ≥48 mmol/mol (6.5%) on two occasions", "Fasting glucose ≥7.0 mmol/L", "2-hour glucose ≥11.1 mmol/L on OGTT", "Random glucose ≥11.1 mmol/L with symptoms"] },
      { title: "Glycaemic Targets", content: ["HbA1c target: 48 mmol/mol (6.5%) if on lifestyle/metformin alone", "HbA1c target: 53 mmol/mol (7.0%) if on additional glucose-lowering drugs", "Individualise target for elderly, frail, or significant comorbidities"] },
      { title: "Treatment Algorithm", content: ["Step 1: Lifestyle modification + Metformin (if eGFR ≥30)", "Step 2: Add SGLT2i (if CVD/renal disease) or GLP-1 RA (if overweight) or DPP4i or sulfonylurea", "Step 3: Triple therapy or insulin", "SGLT2i (empagliflozin, dapagliflozin) preferred if established CVD or CKD"] },
      { title: "Monitoring", content: ["HbA1c every 3–6 months until stable, then 6-monthly", "Annual: weight, BP, renal function, lipids, urine ACR, foot exam, eyes", "eGFR and electrolytes 2–4 weeks after RAAS or SGLT2i initiation"] },
      { title: "Complication Prevention", content: ["BP target: <130/80 mmHg (ADA) or <140/90 mmHg (NICE)", "ACEi/ARB for all with microalbuminuria/macroalbuminuria", "Statin for all with established CVD or age >40 with risk factors", "Aspirin 75mg only if established CVD (not primary prevention)"] },
    ]
  },
  {
    id: "cap",
    condition: "Community-Acquired Pneumonia",
    specialty: "Respiratory",
    source: "NICE NG138 / BTS 2009",
    lastUpdated: "2023",
    sections: [
      { title: "CURB-65 Scoring", content: ["C – Confusion (new disorientation)", "U – Urea >7 mmol/L", "R – Respiratory rate ≥30/min", "B – BP systolic <90 or diastolic ≤60 mmHg", "65 – Age ≥65 years"] },
      { title: "Severity & Management", content: ["Score 0–1: Low severity → Home treatment (amoxicillin 500mg TDS × 5 days)", "Score 2: Moderate → Hospital admission, IV or PO antibiotics", "Score 3–5: Severe → Hospital admission, consider ICU referral"] },
      { title: "Antibiotic Choice", content: ["Low severity: Amoxicillin 500mg TDS PO (add clarithromycin 500mg BD if atypical suspected)", "Moderate-Severe: IV co-amoxiclav 1.2g TDS + clarithromycin 500mg BD IV", "Penicillin allergy: doxycycline 200mg OD (low severity) or levofloxacin (severe)"] },
      { title: "Duration", content: ["Low severity: 5 days", "Moderate-Severe: 5–7 days, review at 48h", "Legionella/Mycoplasma: 10–14 days"] },
      { title: "Follow-Up", content: ["CXR at 4–6 weeks to confirm resolution (especially if >50y/smoking history)", "Blood cultures if admitted", "Urinary antigen for Legionella and Pneumococcus if moderate/severe"] },
    ]
  },
  {
    id: "af",
    condition: "Atrial Fibrillation",
    specialty: "Cardiology",
    source: "NICE NG196 / ESC 2020",
    lastUpdated: "2023",
    sections: [
      { title: "Rate vs Rhythm Control", content: ["Rate control first-line for most: target resting HR <110 bpm (lenient) or <80 bpm (if symptomatic)", "Rhythm control: if symptomatic, younger patients, first presentation, AF due to reversible cause", "Rate control drugs: beta-blocker or rate-limiting CCB (verapamil/diltiazem). Add digoxin if poor LV function."] },
      { title: "Stroke Prevention", content: ["Calculate CHA₂DS₂-VASc score for all non-valvular AF", "Men CHA₂DS₂-VASc ≥2 / Women ≥3: anticoagulate", "Men CHA₂DS₂-VASc 1 / Women 2: consider anticoagulation", "DOAC preferred over warfarin (apixaban, rivaroxaban, edoxaban, dabigatran)"] },
      { title: "Acute AF (<48h onset)", content: ["Cardioversion can be attempted without anticoagulation if onset <48h (transoesophageal echo if uncertain)", "If >48h onset or unclear: anticoagulate for ≥3 weeks before elective cardioversion", "Rate control in A&E: IV metoprolol 5mg or diltiazem; if haemodynamically unstable: DC cardioversion"] },
      { title: "Rhythm Control Options", content: ["Pharmacological: flecainide (if no structural disease), amiodarone (structural heart disease)", "DC cardioversion: synchronised shock 200J biphasic", "Catheter ablation: for paroxysmal AF unresponsive to antiarrhythmics"] },
    ]
  },
  {
    id: "aki",
    condition: "Acute Kidney Injury",
    specialty: "Nephrology",
    source: "NICE AKI Guidance / KDIGO 2012",
    lastUpdated: "2023",
    sections: [
      { title: "KDIGO Staging", content: ["Stage 1: Creatinine ×1.5–1.9 baseline or rise ≥26.5 μmol/L in 48h", "Stage 2: Creatinine ×2–2.9 baseline", "Stage 3: Creatinine ×3 baseline or ≥354 μmol/L or need for RRT"] },
      { title: "Causes (A-E-I-O-U Framework)", content: ["Pre-renal: dehydration, sepsis, haemorrhage, CCF, hepatorenal syndrome", "Intrinsic: ATN (most common), glomerulonephritis, interstitial nephritis, contrast nephropathy", "Post-renal: obstruction — BPH, stones, malignancy, retroperitoneal fibrosis"] },
      { title: "Immediate Management", content: ["Stop nephrotoxins: NSAIDs, aminoglycosides, contrast, ACEi/ARB temporarily", "Fluid resuscitation if pre-renal (250–500mL crystalloid bolus, reassess)", "Monitor urine output (target >0.5 mL/kg/hr)", "Treat hyperkalaemia: calcium gluconate (if ECG changes), insulin+dextrose, salbutamol nebuliser"] },
      { title: "Investigations", content: ["Bloods: U&E, FBC, LFT, coagulation, CRP, blood cultures if septic", "Urine: MC&S, urinary sodium/creatinine (FEna), Bence Jones protein if myeloma suspected", "Imaging: renal USS for obstruction (especially if bilateral or no clear cause)"] },
      { title: "Indications for RRT", content: ["Fluid overload refractory to diuretics", "Refractory hyperkalaemia (K+ >6.5 mmol/L)", "Metabolic acidosis (pH <7.1) refractory to treatment", "Uraemic encephalopathy or pericarditis", "Drug toxicity removable by dialysis"] },
    ]
  }
];

export default function ClinicalDecisionSupport() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Guideline | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = GUIDELINES.filter(g =>
    !query || g.condition.toLowerCase().includes(query.toLowerCase()) || g.specialty.toLowerCase().includes(query.toLowerCase())
  );

  const toggleSection = (id: string) => setExpanded(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const specialtyColors: Record<string, string> = { Cardiology: "#EF4444", Endocrinology: "#7C3AED", Respiratory: "#06B6D4", Nephrology: "#3B82F6" };

  if (selected) {
    return (
      <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
        <div className="relative overflow-hidden" style={{ background: "linear-gradient(160deg,#0A1628,#0D2144,#0A3060)" }}>
          <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative z-10">
            <button onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
              <ArrowLeft className="w-4 h-4" /> Guidelines
            </button>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-white">{selected.condition}</h1>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${specialtyColors[selected.specialty] || "#007AFF"}25`, color: specialtyColors[selected.specialty] || "#007AFF" }}>{selected.specialty}</span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>{selected.source}</span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>Updated {selected.lastUpdated}</span>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-3">
          {selected.sections.map((section, i) => {
            const sectionId = `${selected.id}-${i}`;
            const isOpen = expanded.has(sectionId);
            return (
              <div key={i} className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <button onClick={() => toggleSection(sectionId)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="font-semibold text-sm" style={{ color: "#1C1C1E" }}>{section.title}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4" style={{ color: "#636366" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "#636366" }} />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <ul className="space-y-2">
                      {section.content.map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color: "#1C1C1E" }}>
                          <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "#007AFF" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={() => selected.sections.forEach((_, i) => toggleSection(`${selected.id}-${i}`))}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all" style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#636366", background: "#fff" }}>
            {expanded.size > 0 ? "Collapse All" : "Expand All Sections"}
          </button>
          <p className="text-xs text-center" style={{ color: "#AEAEB2" }}>
            Based on {selected.source}. Always refer to current local guidelines and individualise care.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(160deg,#0A1628,#0D2144,#0A3060)" }}>
        <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative z-10">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.2)" }}>
              <ClipboardList className="w-5 h-5" style={{ color: "#F59E0B" }} />
            </div>
            <h1 className="text-3xl font-bold text-white">Clinical Decision Support</h1>
          </div>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>Evidence-based clinical guidelines for common conditions.</p>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
            <input type="text" placeholder="Search conditions..." value={query} onChange={e => setQuery(e.target.value)}
              className="w-full pl-11 py-3.5 rounded-2xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(12px)" }} />
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {filtered.map(g => (
          <button key={g.id} onClick={() => { setSelected(g); setExpanded(new Set()); }}
            className="w-full text-left rounded-2xl p-5 bg-white transition-all hover:-translate-y-0.5"
            style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1" style={{ color: "#1C1C1E" }}>{g.condition}</h3>
                <div className="flex gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: `${specialtyColors[g.specialty] || "#007AFF"}15`, color: specialtyColors[g.specialty] || "#007AFF" }}>{g.specialty}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: "#F2F2F7", color: "#636366" }}>{g.source}</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 shrink-0" style={{ color: "#AEAEB2" }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
