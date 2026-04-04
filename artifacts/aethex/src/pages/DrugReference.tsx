import { useState, useMemo } from "react";
import { Search, X, ChevronDown, FlaskConical, Pill, Info, Shield, AlertTriangle, CheckCircle2, Package, Stethoscope } from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────────── */
type Schedule = "OTC" | "H" | "H1" | "X";
type DrugForm = "Tablet" | "Capsule" | "Syrup" | "Injection" | "Inhaler" | "Cream" | "Drops" | "Patch" | "Powder";

interface Drug {
  id: string;
  brandName: string;
  genericName: string;
  saltName: string;
  drugClass: string;
  category: string;
  forms: string[];
  dosages: string[];
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  interactions: string[];
  schedule: Schedule;
  manufacturer: string;
  mechanism: string;
  pregnancyCategory: string;
}

/* ── Sample Data ────────────────────────────────────────────────────── */
const DRUGS: Drug[] = [
  {
    id: "paracetamol",
    brandName: "Calpol / Dolo 650",
    genericName: "Paracetamol",
    saltName: "Acetaminophen",
    drugClass: "Analgesic / Antipyretic",
    category: "Analgesic",
    forms: ["Tablet", "Syrup", "Injection"],
    dosages: ["500 mg", "650 mg", "1000 mg", "125 mg/5 mL (Syrup)"],
    indications: ["Fever", "Mild to moderate pain", "Headache", "Toothache", "Musculoskeletal pain"],
    contraindications: ["Severe hepatic impairment", "Known hypersensitivity to paracetamol", "Chronic alcoholism"],
    sideEffects: ["Hepatotoxicity (overdose)", "Skin rash (rare)", "Thrombocytopenia (rare)"],
    interactions: ["Warfarin (enhanced anticoagulation)", "Alcohol (hepatotoxicity risk)", "Isoniazid (increased hepatotoxicity)"],
    schedule: "OTC",
    manufacturer: "GSK / Micro Labs",
    mechanism: "Inhibits prostaglandin synthesis centrally; acts on hypothalamic heat-regulation center",
    pregnancyCategory: "Category B",
  },
  {
    id: "amoxicillin",
    brandName: "Mox / Novamox",
    genericName: "Amoxicillin",
    saltName: "Amoxicillin Trihydrate",
    drugClass: "Antibiotic – Aminopenicillin",
    category: "Antibiotic",
    forms: ["Capsule", "Tablet", "Syrup", "Injection"],
    dosages: ["250 mg", "500 mg", "875 mg", "125 mg/5 mL (Syrup)"],
    indications: ["Respiratory tract infections", "Urinary tract infections", "Skin and soft tissue infections", "H. pylori eradication", "Otitis media"],
    contraindications: ["Penicillin hypersensitivity", "Infectious mononucleosis", "Severe renal impairment (dose adjustment needed)"],
    sideEffects: ["Diarrhoea", "Nausea", "Skin rash", "Anaphylaxis (rare)", "Pseudomembranous colitis"],
    interactions: ["Warfarin (INR increase)", "Methotrexate (increased toxicity)", "Oral contraceptives (reduced efficacy)"],
    schedule: "H",
    manufacturer: "Cipla / Sun Pharma",
    mechanism: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs)",
    pregnancyCategory: "Category B",
  },
  {
    id: "metformin",
    brandName: "Glycomet / Glucophage",
    genericName: "Metformin",
    saltName: "Metformin Hydrochloride",
    drugClass: "Biguanide – Antidiabetic",
    category: "Antidiabetic",
    forms: ["Tablet"],
    dosages: ["500 mg", "850 mg", "1000 mg", "500 mg SR", "1000 mg SR"],
    indications: ["Type 2 Diabetes Mellitus", "Polycystic Ovary Syndrome (PCOS)", "Prevention of T2DM in high-risk individuals"],
    contraindications: ["eGFR < 30 mL/min/1.73 m²", "Acute kidney injury", "Metabolic acidosis", "IV contrast procedures (hold 48 hrs)", "Liver failure", "Chronic alcoholism"],
    sideEffects: ["Nausea", "Diarrhoea", "Metallic taste", "Vitamin B12 deficiency (long-term)", "Lactic acidosis (rare, severe)"],
    interactions: ["Alcohol (lactic acidosis risk)", "Iodinated contrast dye (nephrotoxicity)", "Topiramate (lactic acidosis)", "Furosemide (metformin levels increase)"],
    schedule: "H",
    manufacturer: "USV / MSD",
    mechanism: "Decreases hepatic glucose production; improves insulin sensitivity; reduces intestinal glucose absorption",
    pregnancyCategory: "Category B",
  },
  {
    id: "atorvastatin",
    brandName: "Atorva / Lipitor",
    genericName: "Atorvastatin",
    saltName: "Atorvastatin Calcium",
    drugClass: "HMG-CoA Reductase Inhibitor (Statin)",
    category: "Lipid-lowering",
    forms: ["Tablet"],
    dosages: ["10 mg", "20 mg", "40 mg", "80 mg"],
    indications: ["Hypercholesterolaemia", "Mixed dyslipidaemia", "Prevention of cardiovascular events", "Familial hypercholesterolaemia"],
    contraindications: ["Active liver disease", "Unexplained persistent elevation of serum transaminases", "Pregnancy and breastfeeding", "Myopathy"],
    sideEffects: ["Myalgia", "Elevated transaminases", "Rhabdomyolysis (rare)", "Headache", "GI disturbances", "New-onset diabetes"],
    interactions: ["Cyclosporine (increased statin levels)", "Erythromycin / Clarithromycin (myopathy risk)", "Gemfibrozil (rhabdomyolysis)", "Warfarin (INR increase)"],
    schedule: "H",
    manufacturer: "Cipla / Pfizer",
    mechanism: "Competitive inhibition of HMG-CoA reductase, reducing hepatic cholesterol synthesis and upregulating LDL receptors",
    pregnancyCategory: "Category X",
  },
  {
    id: "pantoprazole",
    brandName: "Pan / Pantocid",
    genericName: "Pantoprazole",
    saltName: "Pantoprazole Sodium Sesquihydrate",
    drugClass: "Proton Pump Inhibitor (PPI)",
    category: "Gastroenterology",
    forms: ["Tablet", "Injection"],
    dosages: ["20 mg", "40 mg", "40 mg IV"],
    indications: ["GERD", "Peptic ulcer disease", "Zollinger-Ellison syndrome", "NSAID-associated gastropathy", "H. pylori eradication (as part of triple therapy)"],
    contraindications: ["Known hypersensitivity to pantoprazole or benzimidazoles", "Concomitant use with rilpivirine"],
    sideEffects: ["Headache", "Diarrhoea", "Nausea", "Hypomagnesaemia (long-term)", "C. difficile infection", "Vitamin B12 deficiency"],
    interactions: ["Clopidogrel (reduced antiplatelet effect)", "Methotrexate (increased toxicity)", "Atazanavir (reduced absorption)", "Ketoconazole (reduced absorption)"],
    schedule: "H",
    manufacturer: "Sun Pharma / Alkem",
    mechanism: "Irreversible inhibition of the H⁺/K⁺-ATPase proton pump in gastric parietal cells",
    pregnancyCategory: "Category B",
  },
  {
    id: "azithromycin",
    brandName: "Azithral / Zithromax",
    genericName: "Azithromycin",
    saltName: "Azithromycin Dihydrate",
    drugClass: "Macrolide Antibiotic",
    category: "Antibiotic",
    forms: ["Tablet", "Capsule", "Syrup", "Injection"],
    dosages: ["250 mg", "500 mg", "200 mg/5 mL (Syrup)", "500 mg IV"],
    indications: ["Community-acquired pneumonia", "Pharyngitis / Tonsillitis", "Skin and soft tissue infections", "Atypical pneumonia (Mycoplasma, Chlamydia)", "STIs (Chlamydia trachomatis)", "Typhoid fever (alternative)"],
    contraindications: ["History of cholestatic jaundice / hepatic dysfunction with azithromycin", "QT-prolongation risk", "Hypersensitivity to macrolides"],
    sideEffects: ["Nausea", "Diarrhoea", "Abdominal pain", "QT prolongation", "Hepatotoxicity (rare)", "Ototoxicity (high dose)"],
    interactions: ["Antacids (reduced absorption)", "Warfarin (increased INR)", "QT-prolonging drugs (arrhythmia risk)", "Digoxin (increased levels)"],
    schedule: "H",
    manufacturer: "Alembic / Pfizer",
    mechanism: "Binds to 50S ribosomal subunit; inhibits bacterial protein synthesis; bacteriostatic",
    pregnancyCategory: "Category B",
  },
  {
    id: "ciprofloxacin",
    brandName: "Ciplox / Cifran",
    genericName: "Ciprofloxacin",
    saltName: "Ciprofloxacin Hydrochloride",
    drugClass: "Fluoroquinolone Antibiotic",
    category: "Antibiotic",
    forms: ["Tablet", "Injection", "Drops", "Cream"],
    dosages: ["250 mg", "500 mg", "750 mg", "200 mg/100 mL IV", "0.3% Eye/Ear Drops"],
    indications: ["UTI / Pyelonephritis", "Gastroenteritis / Typhoid", "Respiratory tract infections", "Bone and joint infections", "Anthrax prophylaxis", "Gonorrhoea"],
    contraindications: ["Hypersensitivity to fluoroquinolones", "Children under 18 years (except anthrax / plague)", "Pregnancy", "Concurrent QT-prolonging drugs", "Tendinopathy history"],
    sideEffects: ["Nausea", "Diarrhoea", "Headache", "Tendinitis / Tendon rupture", "QT prolongation", "Photosensitivity", "C. difficile colitis"],
    interactions: ["Antacids / Iron (reduced absorption)", "Warfarin (increased INR)", "NSAIDs (seizure risk)", "Theophylline (toxicity)", "Tizanidine (contraindicated — profound hypotension)"],
    schedule: "H",
    manufacturer: "Cipla / Sun Pharma",
    mechanism: "Inhibits bacterial DNA gyrase (topoisomerase II) and topoisomerase IV; prevents DNA replication",
    pregnancyCategory: "Category C",
  },
  {
    id: "augmentin",
    brandName: "Augmentin / Clavam",
    genericName: "Amoxicillin + Clavulanate",
    saltName: "Amoxicillin Trihydrate + Potassium Clavulanate",
    drugClass: "Beta-lactam + Beta-lactamase Inhibitor",
    category: "Antibiotic",
    forms: ["Tablet", "Syrup", "Injection"],
    dosages: ["625 mg (500+125)", "1000 mg (875+125)", "457 mg/5 mL (Syrup)", "1.2 g IV"],
    indications: ["LRTI / Sinusitis", "UTI", "Skin and soft tissue infections", "Animal / Human bites", "Diabetic foot infections", "Otitis media"],
    contraindications: ["Penicillin hypersensitivity", "History of cholestatic jaundice with amoxicillin-clavulanate", "Severe renal failure"],
    sideEffects: ["Diarrhoea", "Nausea", "Vomiting", "Rash", "Cholestatic hepatitis (more than amoxicillin alone)", "Pseudomembranous colitis"],
    interactions: ["Warfarin (INR increase)", "Oral contraceptives (reduced efficacy)", "Probenecid (increases amoxicillin levels)", "Allopurinol (rash risk)"],
    schedule: "H",
    manufacturer: "GSK / Alkem",
    mechanism: "Clavulanate irreversibly inhibits beta-lactamases, protecting amoxicillin from enzymatic degradation",
    pregnancyCategory: "Category B",
  },
  {
    id: "insulin-glargine",
    brandName: "Lantus / Basalog",
    genericName: "Insulin Glargine",
    saltName: "Insulin Glargine (rDNA origin)",
    drugClass: "Long-acting Insulin Analogue",
    category: "Antidiabetic",
    forms: ["Injection"],
    dosages: ["100 U/mL (3 mL cartridge, 10 mL vial)", "300 U/mL (Toujeo)"],
    indications: ["Type 1 Diabetes Mellitus", "Type 2 Diabetes Mellitus requiring insulin", "Gestational diabetes (off-label)"],
    contraindications: ["Hypoglycaemia episodes", "Hypersensitivity to insulin glargine", "Do NOT dilute or mix with other insulins"],
    sideEffects: ["Hypoglycaemia", "Injection site reactions (lipodystrophy)", "Weight gain", "Peripheral oedema", "Hypokalaemia"],
    interactions: ["Beta-blockers (mask hypoglycaemia symptoms)", "Salicylates (enhanced hypoglycaemia)", "ACE inhibitors (hypoglycaemia)", "Corticosteroids (hyperglycaemia — insulin requirement increases)"],
    schedule: "H",
    manufacturer: "Sanofi / Biocon",
    mechanism: "Binds insulin receptors; promotes glucose uptake by peripheral tissues; inhibits hepatic glucose production; peakless action over 24 hours",
    pregnancyCategory: "Category C",
  },
  {
    id: "amlodipine",
    brandName: "Amlodac / Amlopres",
    genericName: "Amlodipine",
    saltName: "Amlodipine Besylate",
    drugClass: "Calcium Channel Blocker (Dihydropyridine)",
    category: "Cardiovascular",
    forms: ["Tablet"],
    dosages: ["2.5 mg", "5 mg", "10 mg"],
    indications: ["Hypertension", "Stable angina", "Vasospastic (Prinzmetal's) angina", "Coronary artery disease"],
    contraindications: ["Cardiogenic shock", "Severe aortic stenosis", "Hypersensitivity to dihydropyridines"],
    sideEffects: ["Peripheral oedema", "Flushing", "Headache", "Dizziness", "Palpitations", "Gingival hyperplasia"],
    interactions: ["Simvastatin (limit simvastatin to 20 mg/day)", "Cyclosporine (increased cyclosporine levels)", "Rifampicin (reduced amlodipine efficacy)", "CYP3A4 inhibitors (increased amlodipine levels)"],
    schedule: "H",
    manufacturer: "Cadila / Cipla",
    mechanism: "Blocks L-type voltage-gated calcium channels in vascular smooth muscle and cardiac muscle → vasodilation",
    pregnancyCategory: "Category C",
  },
  {
    id: "ondansetron",
    brandName: "Emeset / Zofran",
    genericName: "Ondansetron",
    saltName: "Ondansetron Hydrochloride",
    drugClass: "5-HT₃ Receptor Antagonist (Antiemetic)",
    category: "Gastroenterology",
    forms: ["Tablet", "Injection", "Syrup"],
    dosages: ["4 mg", "8 mg", "4 mg/5 mL (Syrup)", "4 mg/2 mL IV"],
    indications: ["Chemotherapy-induced nausea and vomiting (CINV)", "Post-operative nausea/vomiting (PONV)", "Radiation-induced nausea", "Hyperemesis gravidarum"],
    contraindications: ["Congenital long QT syndrome", "Hypersensitivity", "Apomorphine co-administration", "Phenylketonuria (ODT formulations contain phenylalanine)"],
    sideEffects: ["Headache", "Constipation", "QT prolongation", "Flushing", "Transient elevation of liver enzymes"],
    interactions: ["Apomorphine (profound hypotension — contraindicated)", "Tramadol (reduced analgesic effect)", "QT-prolonging drugs (arrhythmia)", "Serotonergic drugs (serotonin syndrome risk)"],
    schedule: "H",
    manufacturer: "Cipla / GSK",
    mechanism: "Selective antagonism of 5-HT₃ receptors in CNS chemoreceptor trigger zone and peripheral vagal nerve terminals",
    pregnancyCategory: "Category B",
  },
  {
    id: "alprazolam",
    brandName: "Alprax / Restyl",
    genericName: "Alprazolam",
    saltName: "Alprazolam",
    drugClass: "Benzodiazepine – Anxiolytic",
    category: "Psychiatry / CNS",
    forms: ["Tablet"],
    dosages: ["0.25 mg", "0.5 mg", "1 mg"],
    indications: ["Generalised anxiety disorder", "Panic disorder", "Short-term anxiety relief", "Phobia-related anxiety"],
    contraindications: ["Myasthenia gravis", "Severe respiratory insufficiency", "Sleep apnoea", "Acute narrow-angle glaucoma", "Severe hepatic impairment", "Pregnancy"],
    sideEffects: ["Sedation", "Dependence / Tolerance", "Memory impairment", "Ataxia", "Paradoxical excitement (rare)", "Respiratory depression (overdose)"],
    interactions: ["Alcohol / CNS depressants (fatal respiratory depression)", "CYP3A4 inhibitors — ketoconazole, erythromycin (increased levels)", "Opioids (MHRA black box: combined CNS depression)", "Antifungals (increased alprazolam effect)"],
    schedule: "X",
    manufacturer: "Torrent / Pfizer",
    mechanism: "Enhances GABA-A receptor activity → increased Cl⁻ influx → neuronal hyperpolarisation → CNS depression",
    pregnancyCategory: "Category D",
  },
];

/* ── Filter data ────────────────────────────────────────────────────── */
const DRUG_CLASSES = ["All Classes", "Analgesic", "Antibiotic", "Antidiabetic", "Lipid-lowering", "Gastroenterology", "Cardiovascular", "Psychiatry / CNS"];
const SCHEDULES: ("All" | Schedule)[] = ["All", "OTC", "H", "H1", "X"];
const FORMS: ("All" | DrugForm)[] = ["All", "Tablet", "Capsule", "Syrup", "Injection", "Inhaler", "Cream", "Drops", "Patch", "Powder"];

/* ── Schedule badge ─────────────────────────────────────────────────── */
const scheduleMeta: Record<Schedule, { label: string; bg: string; color: string; border: string }> = {
  OTC: { label: "OTC", bg: "rgba(16,185,129,0.1)", color: "#059669", border: "rgba(16,185,129,0.3)" },
  H: { label: "Schedule H", bg: "rgba(245,158,11,0.1)", color: "#D97706", border: "rgba(245,158,11,0.3)" },
  H1: { label: "Schedule H1", bg: "rgba(239,68,68,0.1)", color: "#DC2626", border: "rgba(239,68,68,0.3)" },
  X: { label: "Schedule X", bg: "rgba(124,58,237,0.1)", color: "#7C3AED", border: "rgba(124,58,237,0.3)" },
};

function ScheduleBadge({ schedule }: { schedule: Schedule }) {
  const m = scheduleMeta[schedule];
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      <Shield className="w-2.5 h-2.5" />
      {m.label}
    </span>
  );
}

/* ── Drug Card ──────────────────────────────────────────────────────── */
function DrugCard({ drug, onViewDetails }: { drug: Drug; onViewDetails: (d: Drug) => void }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(60,60,67,0.1)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(0,122,255,0.12)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,122,255,0.2)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(60,60,67,0.1)";
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(0,122,255,0.08)", border: "1px solid rgba(0,122,255,0.15)" }}>
            <Pill className="w-5 h-5" style={{ color: "#007AFF" }} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-[15px] leading-tight" style={{ color: "#1C1C1E" }}>
              {drug.brandName}
            </h3>
            <p className="text-[12px] mt-0.5" style={{ color: "#007AFF" }}>{drug.genericName}</p>
            <p className="text-[11px]" style={{ color: "#AEAEB2" }}>{drug.saltName}</p>
          </div>
        </div>
        <ScheduleBadge schedule={drug.schedule} />
      </div>

      {/* Class & Category */}
      <div className="flex flex-wrap gap-1.5">
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium"
          style={{ background: "rgba(0,194,168,0.08)", color: "#00A893", border: "1px solid rgba(0,194,168,0.2)" }}>
          {drug.drugClass}
        </span>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium"
          style={{ background: "rgba(60,60,67,0.05)", color: "#636366", border: "1px solid rgba(60,60,67,0.1)" }}>
          {drug.category}
        </span>
      </div>

      {/* Forms & Dosages */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#AEAEB2" }}>
          Forms & Dosages
        </p>
        <div className="flex flex-wrap gap-1">
          {drug.forms.map(f => (
            <span key={f} className="px-2 py-0.5 rounded-md text-[11px] font-medium"
              style={{ background: "rgba(0,122,255,0.06)", color: "#007AFF" }}>
              {f}
            </span>
          ))}
          <span className="px-2 py-0.5 rounded-md text-[11px]" style={{ color: "#636366" }}>
            {drug.dosages.slice(0, 2).join(", ")}{drug.dosages.length > 2 ? ` +${drug.dosages.length - 2}` : ""}
          </span>
        </div>
      </div>

      {/* Indications */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#AEAEB2" }}>
          Indications
        </p>
        <div className="flex flex-wrap gap-1">
          {drug.indications.slice(0, 3).map(ind => (
            <span key={ind} className="flex items-center gap-1 text-[11px]" style={{ color: "#636366" }}>
              <CheckCircle2 className="w-2.5 h-2.5 shrink-0" style={{ color: "#10B981" }} />
              {ind}
            </span>
          ))}
          {drug.indications.length > 3 && (
            <span className="text-[11px]" style={{ color: "#AEAEB2" }}>+{drug.indications.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Contraindications (top 2) */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#AEAEB2" }}>
          Key Contraindications
        </p>
        <div className="flex flex-col gap-0.5">
          {drug.contraindications.slice(0, 2).map(ci => (
            <span key={ci} className="flex items-start gap-1 text-[11px]" style={{ color: "#636366" }}>
              <AlertTriangle className="w-2.5 h-2.5 shrink-0 mt-0.5" style={{ color: "#EF4444" }} />
              {ci}
            </span>
          ))}
          {drug.contraindications.length > 2 && (
            <span className="text-[11px]" style={{ color: "#AEAEB2" }}>+{drug.contraindications.length - 2} more</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-2 flex items-center justify-between border-t" style={{ borderColor: "rgba(60,60,67,0.08)" }}>
        <span className="text-[11px]" style={{ color: "#AEAEB2" }}>{drug.manufacturer}</span>
        <button
          onClick={() => onViewDetails(drug)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-100"
          style={{ background: "linear-gradient(135deg, #007AFF, #00C2A8)", color: "#FFFFFF" }}
        >
          <Info className="w-3.5 h-3.5" />
          View Full Details
        </button>
      </div>
    </div>
  );
}

/* ── Detail Modal ───────────────────────────────────────────────────── */
function DrugModal({ drug, onClose }: { drug: Drug; onClose: () => void }) {
  const m = scheduleMeta[drug.schedule];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{ background: "#FFFFFF", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}
      >
        {/* Modal header */}
        <div className="sticky top-0 z-10 px-6 py-5 border-b flex items-start justify-between gap-4"
          style={{ background: "#FFFFFF", borderColor: "rgba(60,60,67,0.1)" }}>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.1), rgba(0,194,168,0.1))", border: "1px solid rgba(0,122,255,0.15)" }}>
              <Pill className="w-5 h-5" style={{ color: "#007AFF" }} />
            </div>
            <div>
              <h2 className="font-bold text-[18px] leading-tight" style={{ color: "#1C1C1E" }}>{drug.brandName}</h2>
              <p className="text-sm" style={{ color: "#007AFF" }}>{drug.genericName}</p>
              <p className="text-[11px]" style={{ color: "#AEAEB2" }}>{drug.saltName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ScheduleBadge schedule={drug.schedule} />
            <button onClick={onClose}
              className="p-2 rounded-xl transition-all hover:bg-black/5"
              style={{ color: "#636366" }}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="px-6 py-5 flex flex-col gap-6">

          {/* Overview */}
          <div className="p-4 rounded-2xl"
            style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.04), rgba(0,194,168,0.04))", border: "1px solid rgba(0,122,255,0.1)" }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: "Drug Class", value: drug.drugClass },
                { label: "Category", value: drug.category },
                { label: "Manufacturer", value: drug.manufacturer },
                { label: "Pregnancy", value: drug.pregnancyCategory },
                { label: "Schedule", value: drug.schedule === "OTC" ? "Over the Counter" : `Schedule ${drug.schedule} (Rx Required)` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#AEAEB2" }}>{label}</p>
                  <p className="text-[13px] font-medium" style={{ color: "#1C1C1E" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mechanism */}
          <Section icon={<FlaskConical className="w-4 h-4" />} title="Mechanism of Action" color="#7C3AED">
            <p className="text-[13px] leading-relaxed" style={{ color: "#3C3C43" }}>{drug.mechanism}</p>
          </Section>

          {/* Forms & Dosages */}
          <Section icon={<Package className="w-4 h-4" />} title="Available Forms & Dosages" color="#007AFF">
            <div className="flex flex-wrap gap-1.5">
              {drug.forms.map(f => (
                <span key={f} className="px-2.5 py-1 rounded-lg text-[12px] font-medium"
                  style={{ background: "rgba(0,122,255,0.08)", color: "#007AFF", border: "1px solid rgba(0,122,255,0.15)" }}>
                  {f}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {drug.dosages.map(d => (
                <span key={d} className="px-2.5 py-1 rounded-lg text-[12px]"
                  style={{ background: "rgba(60,60,67,0.05)", color: "#636366", border: "1px solid rgba(60,60,67,0.1)" }}>
                  {d}
                </span>
              ))}
            </div>
          </Section>

          {/* Indications */}
          <Section icon={<Stethoscope className="w-4 h-4" />} title="Indications" color="#10B981">
            <ul className="space-y-1">
              {drug.indications.map(ind => (
                <li key={ind} className="flex items-start gap-2 text-[13px]" style={{ color: "#3C3C43" }}>
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#10B981" }} />
                  {ind}
                </li>
              ))}
            </ul>
          </Section>

          {/* Contraindications */}
          <Section icon={<AlertTriangle className="w-4 h-4" />} title="Contraindications" color="#EF4444">
            <ul className="space-y-1">
              {drug.contraindications.map(ci => (
                <li key={ci} className="flex items-start gap-2 text-[13px]" style={{ color: "#3C3C43" }}>
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#EF4444" }} />
                  {ci}
                </li>
              ))}
            </ul>
          </Section>

          {/* Side Effects */}
          <Section icon={<Info className="w-4 h-4" />} title="Side Effects" color="#F59E0B">
            <div className="flex flex-wrap gap-1.5">
              {drug.sideEffects.map(se => (
                <span key={se} className="px-2.5 py-1 rounded-full text-[12px]"
                  style={{ background: "rgba(245,158,11,0.08)", color: "#D97706", border: "1px solid rgba(245,158,11,0.2)" }}>
                  {se}
                </span>
              ))}
            </div>
          </Section>

          {/* Drug Interactions */}
          <Section icon={<Shield className="w-4 h-4" />} title="Drug Interactions" color="#EF4444">
            <ul className="space-y-1">
              {drug.interactions.map(inter => (
                <li key={inter} className="flex items-start gap-2 text-[13px]" style={{ color: "#3C3C43" }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: "#EF4444" }} />
                  {inter}
                </li>
              ))}
            </ul>
          </Section>

          {/* Disclaimer */}
          <div className="p-4 rounded-2xl text-center"
            style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <p className="text-[11px] leading-relaxed" style={{ color: "#92400E" }}>
              <span className="font-bold">Disclaimer:</span> This information is for reference purposes only and is intended for qualified healthcare professionals. Always consult updated prescribing information and clinical judgement before prescribing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, color, children }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${color}14`, color }}>
          {icon}
        </div>
        <h3 className="text-[14px] font-bold" style={{ color: "#1C1C1E" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ── Filter Select ──────────────────────────────────────────────────── */
function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-medium outline-none cursor-pointer transition-all"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(60,60,67,0.15)",
          color: "#1C1C1E",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt === "All" || opt.startsWith("All") ? `${label}: ${opt}` : opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "#AEAEB2" }} />
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function DrugReference() {
  const [query, setQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSchedule, setSelectedSchedule] = useState<string>("All");
  const [selectedForm, setSelectedForm] = useState<string>("All");
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return DRUGS.filter(d => {
      const matchSearch = !q ||
        d.brandName.toLowerCase().includes(q) ||
        d.genericName.toLowerCase().includes(q) ||
        d.saltName.toLowerCase().includes(q) ||
        d.drugClass.toLowerCase().includes(q) ||
        d.indications.some(i => i.toLowerCase().includes(q));
      const matchClass = selectedClass === "All Classes" || d.category === selectedClass;
      const matchSchedule = selectedSchedule === "All" || d.schedule === selectedSchedule;
      const matchForm = selectedForm === "All" || d.forms.includes(selectedForm as DrugForm);
      return matchSearch && matchClass && matchSchedule && matchForm;
    });
  }, [query, selectedClass, selectedSchedule, selectedForm]);

  const hasFilters = query || selectedClass !== "All Classes" || selectedSchedule !== "All" || selectedForm !== "All";

  const clearAll = () => {
    setQuery("");
    setSelectedClass("All Classes");
    setSelectedSchedule("All");
    setSelectedForm("All");
  };

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-14 pb-18">
        <div className="absolute inset-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(8,18,36,0.94) 0%, rgba(10,26,50,0.9) 50%, rgba(8,18,36,0.94) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
            style={{ background: "rgba(0,194,168,0.10)" }} />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full blur-3xl translate-y-1/3"
            style={{ background: "rgba(0,122,255,0.08)" }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 py-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(0,194,168,0.15)", border: "1px solid rgba(0,194,168,0.25)", color: "#2DD4BF" }}>
            <FlaskConical className="w-3.5 h-3.5" />
            <span className="text-[12px] font-semibold">{DRUGS.length} drugs in database · CDSCO Schedules</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight" style={{ letterSpacing: "-1px" }}>
            Indian Drug{" "}
            <span style={{ background: "linear-gradient(135deg,#00C2A8,#007AFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Reference
            </span>
          </h1>
          <p className="text-sm max-w-lg mx-auto mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Search verified drug information for Indian physicians and medical students. Schedules, indications, contraindications and interactions — at a glance.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 w-5 h-5" style={{ color: "rgba(255,255,255,0.35)" }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by drug name, salt, or brand (e.g. Metformin, Dolo 650, Azithral)..."
              className="w-full pl-12 pr-10 py-4 rounded-2xl text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#FFFFFF",
                boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              }}
            />
            {query && (
              <button onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-xl mx-auto">
            {[
              { value: `${DRUGS.length}+`, label: "Drugs Listed" },
              { value: "CDSCO", label: "Schedules Tagged" },
              { value: "Free", label: "For Doctors" },
              { value: "India", label: "Brands & Salts" },
            ].map((stat, i) => (
              <div key={i} className="text-center py-3 px-2 rounded-xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-lg font-black text-white mb-0.5">{stat.value}</div>
                <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters + Results ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Schedule Legend */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(Object.entries(scheduleMeta) as [Schedule, typeof scheduleMeta[Schedule]][]).map(([key, val]) => (
            <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
              style={{ background: val.bg, color: val.color, border: `1px solid ${val.border}` }}>
              <Shield className="w-3 h-3" />
              {val.label}
            </span>
          ))}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <FilterSelect label="Class" value={selectedClass} options={DRUG_CLASSES} onChange={setSelectedClass} />
          <FilterSelect label="Schedule" value={selectedSchedule} options={SCHEDULES} onChange={setSelectedSchedule} />
          <FilterSelect label="Form" value={selectedForm} options={FORMS} onChange={setSelectedForm} />
          {hasFilters && (
            <button onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{ color: "#007AFF" }}>
              <X className="w-3.5 h-3.5" />
              Clear filters
            </button>
          )}
          <span className="ml-auto text-sm" style={{ color: "#AEAEB2" }}>
            {filtered.length} drug{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {/* Drug Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(0,122,255,0.08)" }}>
              <Search className="w-6 h-6" style={{ color: "#007AFF" }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: "#1C1C1E" }}>No drugs found</p>
            <p className="text-sm mb-4" style={{ color: "#AEAEB2" }}>Try a different name, salt, or brand.</p>
            <button onClick={clearAll}
              className="text-sm font-semibold hover:underline" style={{ color: "#007AFF" }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(drug => (
              <DrugCard key={drug.id} drug={drug} onViewDetails={d => setSelectedDrug(d)} />
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-5 rounded-2xl"
          style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)" }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#D97706" }} />
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: "#92400E" }}>Medical Disclaimer</p>
              <p className="text-[12px] leading-relaxed" style={{ color: "#B45309" }}>
                This database is intended for informational and educational purposes for qualified healthcare professionals only. Drug information may not be exhaustive or updated to the latest CDSCO guidelines. Always refer to the official prescribing information and consult clinical judgement before prescribing. Aethex is not liable for clinical decisions made based on this data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────── */}
      {selectedDrug && (
        <DrugModal drug={selectedDrug} onClose={() => setSelectedDrug(null)} />
      )}
    </div>
  );
}
