import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Search, X } from "lucide-react";

interface Abbrev {
  abbr: string;
  full: string;
  category: string;
  notes?: string;
}

const ABBREVIATIONS: Abbrev[] = [
  { abbr: "ABG", full: "Arterial Blood Gas", category: "Lab" },
  { abbr: "ACE", full: "Angiotensin-Converting Enzyme", category: "Pharmacology" },
  { abbr: "ACLS", full: "Advanced Cardiac Life Support", category: "Emergency" },
  { abbr: "ADL", full: "Activities of Daily Living", category: "General" },
  { abbr: "AF", full: "Atrial Fibrillation", category: "Cardiology" },
  { abbr: "AKI", full: "Acute Kidney Injury", category: "Nephrology" },
  { abbr: "ALS", full: "Amyotrophic Lateral Sclerosis / Advanced Life Support", category: "Neurology" },
  { abbr: "AMI", full: "Acute Myocardial Infarction", category: "Cardiology" },
  { abbr: "APH", full: "Antepartum Haemorrhage", category: "Obstetrics" },
  { abbr: "ARDS", full: "Acute Respiratory Distress Syndrome", category: "Pulmonology" },
  { abbr: "AST", full: "Aspartate Aminotransferase", category: "Lab" },
  { abbr: "AXR", full: "Abdominal X-Ray", category: "Radiology" },
  { abbr: "BBB", full: "Bundle Branch Block", category: "Cardiology" },
  { abbr: "BD", full: "Twice Daily (Bis Die)", category: "Prescribing", notes: "Also written BID" },
  { abbr: "BMI", full: "Body Mass Index", category: "General" },
  { abbr: "BNP", full: "Brain Natriuretic Peptide", category: "Lab" },
  { abbr: "BP", full: "Blood Pressure", category: "Vitals" },
  { abbr: "BPH", full: "Benign Prostatic Hyperplasia", category: "Urology" },
  { abbr: "BSL", full: "Blood Sugar Level", category: "Lab" },
  { abbr: "CABG", full: "Coronary Artery Bypass Graft", category: "Surgery" },
  { abbr: "CAD", full: "Coronary Artery Disease", category: "Cardiology" },
  { abbr: "CBC", full: "Complete Blood Count", category: "Lab" },
  { abbr: "CCB", full: "Calcium Channel Blocker", category: "Pharmacology" },
  { abbr: "CCF", full: "Congestive Cardiac Failure", category: "Cardiology" },
  { abbr: "CKD", full: "Chronic Kidney Disease", category: "Nephrology" },
  { abbr: "CMP", full: "Comprehensive Metabolic Panel", category: "Lab" },
  { abbr: "CNS", full: "Central Nervous System", category: "Anatomy" },
  { abbr: "CO", full: "Cardiac Output", category: "Cardiology" },
  { abbr: "COPD", full: "Chronic Obstructive Pulmonary Disease", category: "Pulmonology" },
  { abbr: "CPR", full: "Cardiopulmonary Resuscitation", category: "Emergency" },
  { abbr: "CRP", full: "C-Reactive Protein", category: "Lab" },
  { abbr: "CSF", full: "Cerebrospinal Fluid", category: "Lab" },
  { abbr: "CT", full: "Computed Tomography", category: "Radiology" },
  { abbr: "CVA", full: "Cerebrovascular Accident (Stroke)", category: "Neurology" },
  { abbr: "CVP", full: "Central Venous Pressure", category: "Cardiology" },
  { abbr: "CXR", full: "Chest X-Ray", category: "Radiology" },
  { abbr: "D&C", full: "Dilation and Curettage", category: "Obstetrics" },
  { abbr: "DIC", full: "Disseminated Intravascular Coagulation", category: "Haematology" },
  { abbr: "DKA", full: "Diabetic Ketoacidosis", category: "Endocrinology" },
  { abbr: "DVT", full: "Deep Vein Thrombosis", category: "Vascular" },
  { abbr: "ECG", full: "Electrocardiogram", category: "Cardiology" },
  { abbr: "Echo", full: "Echocardiogram", category: "Cardiology" },
  { abbr: "eGFR", full: "Estimated Glomerular Filtration Rate", category: "Lab" },
  { abbr: "EMG", full: "Electromyography", category: "Neurology" },
  { abbr: "EEG", full: "Electroencephalogram", category: "Neurology" },
  { abbr: "ESR", full: "Erythrocyte Sedimentation Rate", category: "Lab" },
  { abbr: "ETT", full: "Exercise Tolerance Test / Endotracheal Tube", category: "Cardiology" },
  { abbr: "FBC", full: "Full Blood Count", category: "Lab" },
  { abbr: "FEV1", full: "Forced Expiratory Volume in 1 second", category: "Pulmonology" },
  { abbr: "FNA", full: "Fine Needle Aspiration", category: "Pathology" },
  { abbr: "FVC", full: "Forced Vital Capacity", category: "Pulmonology" },
  { abbr: "GA", full: "General Anaesthesia", category: "Anaesthesia" },
  { abbr: "GCS", full: "Glasgow Coma Scale", category: "Neurology" },
  { abbr: "GERD", full: "Gastroesophageal Reflux Disease", category: "Gastroenterology" },
  { abbr: "GFR", full: "Glomerular Filtration Rate", category: "Nephrology" },
  { abbr: "GI", full: "Gastrointestinal", category: "Anatomy" },
  { abbr: "GTN", full: "Glyceryl Trinitrate", category: "Pharmacology" },
  { abbr: "Hb", full: "Haemoglobin", category: "Lab" },
  { abbr: "HbA1c", full: "Glycated Haemoglobin", category: "Lab" },
  { abbr: "HDL", full: "High-Density Lipoprotein", category: "Lab" },
  { abbr: "HHNS", full: "Hyperosmolar Hyperglycaemic Non-ketotic State", category: "Endocrinology" },
  { abbr: "HRT", full: "Hormone Replacement Therapy", category: "Endocrinology" },
  { abbr: "HTN", full: "Hypertension", category: "Cardiology" },
  { abbr: "IBD", full: "Inflammatory Bowel Disease", category: "Gastroenterology" },
  { abbr: "IBS", full: "Irritable Bowel Syndrome", category: "Gastroenterology" },
  { abbr: "ICU", full: "Intensive Care Unit", category: "General" },
  { abbr: "IM", full: "Intramuscular", category: "Prescribing" },
  { abbr: "IMV", full: "Intermittent Mandatory Ventilation", category: "Pulmonology" },
  { abbr: "INR", full: "International Normalised Ratio", category: "Lab" },
  { abbr: "IUD", full: "Intrauterine Device", category: "Gynaecology" },
  { abbr: "IV", full: "Intravenous", category: "Prescribing" },
  { abbr: "IVF", full: "Intravenous Fluids / In Vitro Fertilisation", category: "General" },
  { abbr: "JVP", full: "Jugular Venous Pressure", category: "Cardiology" },
  { abbr: "KFT", full: "Kidney Function Test", category: "Lab" },
  { abbr: "LA", full: "Local Anaesthesia", category: "Anaesthesia" },
  { abbr: "LBBB", full: "Left Bundle Branch Block", category: "Cardiology" },
  { abbr: "LDH", full: "Lactate Dehydrogenase", category: "Lab" },
  { abbr: "LDL", full: "Low-Density Lipoprotein", category: "Lab" },
  { abbr: "LFT", full: "Liver Function Test", category: "Lab" },
  { abbr: "LMP", full: "Last Menstrual Period", category: "Obstetrics" },
  { abbr: "LP", full: "Lumbar Puncture", category: "Neurology" },
  { abbr: "LVEF", full: "Left Ventricular Ejection Fraction", category: "Cardiology" },
  { abbr: "MAP", full: "Mean Arterial Pressure", category: "Vitals" },
  { abbr: "MCV", full: "Mean Corpuscular Volume", category: "Lab" },
  { abbr: "MDI", full: "Metered Dose Inhaler", category: "Pulmonology" },
  { abbr: "MI", full: "Myocardial Infarction", category: "Cardiology" },
  { abbr: "MRI", full: "Magnetic Resonance Imaging", category: "Radiology" },
  { abbr: "MRSA", full: "Methicillin-Resistant Staphylococcus aureus", category: "Microbiology" },
  { abbr: "MS", full: "Multiple Sclerosis / Mitral Stenosis", category: "Neurology" },
  { abbr: "MSU", full: "Midstream Urine", category: "Lab" },
  { abbr: "NBM", full: "Nil By Mouth", category: "General" },
  { abbr: "NGT", full: "Nasogastric Tube", category: "General" },
  { abbr: "NSTEMI", full: "Non-ST Elevation Myocardial Infarction", category: "Cardiology" },
  { abbr: "OD", full: "Once Daily (Omni Die)", category: "Prescribing" },
  { abbr: "OGD", full: "Oesophagogastroduodenoscopy", category: "Gastroenterology" },
  { abbr: "OGTT", full: "Oral Glucose Tolerance Test", category: "Lab" },
  { abbr: "OT", full: "Operating Theatre", category: "Surgery" },
  { abbr: "PCI", full: "Percutaneous Coronary Intervention", category: "Cardiology" },
  { abbr: "PCR", full: "Polymerase Chain Reaction", category: "Lab" },
  { abbr: "PE", full: "Pulmonary Embolism", category: "Pulmonology" },
  { abbr: "PEF", full: "Peak Expiratory Flow", category: "Pulmonology" },
  { abbr: "PID", full: "Pelvic Inflammatory Disease", category: "Gynaecology" },
  { abbr: "PKD", full: "Polycystic Kidney Disease", category: "Nephrology" },
  { abbr: "PO", full: "Oral (Per Os)", category: "Prescribing" },
  { abbr: "PR", full: "Per Rectum", category: "Prescribing" },
  { abbr: "PRN", full: "As Needed (Pro Re Nata)", category: "Prescribing" },
  { abbr: "PSA", full: "Prostate-Specific Antigen", category: "Lab" },
  { abbr: "PTE", full: "Pulmonary Thromboembolism", category: "Pulmonology" },
  { abbr: "PTH", full: "Parathyroid Hormone", category: "Lab" },
  { abbr: "QID", full: "Four Times Daily (Quater In Die)", category: "Prescribing" },
  { abbr: "RBC", full: "Red Blood Cell / Count", category: "Lab" },
  { abbr: "RBBB", full: "Right Bundle Branch Block", category: "Cardiology" },
  { abbr: "RFT", full: "Renal Function Test", category: "Lab" },
  { abbr: "RR", full: "Respiratory Rate", category: "Vitals" },
  { abbr: "RSI", full: "Rapid Sequence Intubation", category: "Emergency" },
  { abbr: "RTA", full: "Road Traffic Accident / Renal Tubular Acidosis", category: "General" },
  { abbr: "SC", full: "Subcutaneous", category: "Prescribing" },
  { abbr: "SL", full: "Sublingual", category: "Prescribing" },
  { abbr: "SOAP", full: "Subjective, Objective, Assessment, Plan", category: "General" },
  { abbr: "SpO2", full: "Peripheral Oxygen Saturation", category: "Vitals" },
  { abbr: "STEMI", full: "ST Elevation Myocardial Infarction", category: "Cardiology" },
  { abbr: "SVT", full: "Supraventricular Tachycardia", category: "Cardiology" },
  { abbr: "T2DM", full: "Type 2 Diabetes Mellitus", category: "Endocrinology" },
  { abbr: "TBI", full: "Traumatic Brain Injury", category: "Neurology" },
  { abbr: "TDS", full: "Three Times Daily (Ter Die Sumendus)", category: "Prescribing" },
  { abbr: "TIA", full: "Transient Ischaemic Attack", category: "Neurology" },
  { abbr: "TPN", full: "Total Parenteral Nutrition", category: "General" },
  { abbr: "TSH", full: "Thyroid Stimulating Hormone", category: "Lab" },
  { abbr: "TTE", full: "Transthoracic Echocardiography", category: "Cardiology" },
  { abbr: "U&E", full: "Urea and Electrolytes", category: "Lab" },
  { abbr: "UAO", full: "Upper Airway Obstruction", category: "Emergency" },
  { abbr: "UTI", full: "Urinary Tract Infection", category: "Microbiology" },
  { abbr: "VF", full: "Ventricular Fibrillation", category: "Cardiology" },
  { abbr: "VT", full: "Ventricular Tachycardia", category: "Cardiology" },
  { abbr: "WBC", full: "White Blood Cell / Count", category: "Lab" },
  { abbr: "WCC", full: "White Cell Count", category: "Lab" },
  { abbr: "XR", full: "X-Ray", category: "Radiology" },
];

const ALL_CATEGORIES = ["All", ...Array.from(new Set(ABBREVIATIONS.map(a => a.category))).sort()];

const categoryColors: Record<string, string> = {
  Lab: "#007AFF", Cardiology: "#EF4444", Pharmacology: "#7C3AED", Prescribing: "#10B981",
  Neurology: "#F59E0B", Pulmonology: "#06B6D4", Emergency: "#DC2626", General: "#6B7280",
  Radiology: "#8B5CF6", Anaesthesia: "#14B8A6", Obstetrics: "#EC4899", Surgery: "#64748B",
  Gastroenterology: "#F97316", Nephrology: "#3B82F6", Endocrinology: "#A855F7",
  Haematology: "#EF4444", Vitals: "#10B981", Microbiology: "#84CC16", Urology: "#0EA5E9",
  Vascular: "#F43F5E", Gynaecology: "#EC4899", Anatomy: "#94A3B8", Pathology: "#D97706",
};

export default function MedicalAbbreviations() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ABBREVIATIONS.filter(a => {
      const matchQ = !q || a.abbr.toLowerCase().includes(q) || a.full.toLowerCase().includes(q);
      const matchC = category === "All" || a.category === category;
      return matchQ && matchC;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
      <div className="relative overflow-hidden" >
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(10,22,40,0.93) 0%, rgba(13,33,68,0.9) 50%, rgba(10,48,96,0.93) 100%)" }} />
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-10 relative z-10">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.2)" }}>
              <BookOpen className="w-5 h-5" style={{ color: "#F59E0B" }} />
            </div>
            <h1 className="text-3xl font-bold text-white">Medical Abbreviations</h1>
          </div>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>Searchable dictionary of clinical abbreviations, acronyms and mnemonics.</p>

          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
            <input type="text" placeholder="Search abbreviations..." value={query} onChange={e => setQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(12px)" }} />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100">
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {ALL_CATEGORIES.slice(0, 12).map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={category === c ? { background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#fff" } :
                { background: "#fff", color: "#636366", border: "1px solid rgba(60,60,67,0.15)" }}>
              {c}
            </button>
          ))}
          <span className="ml-auto self-center text-xs" style={{ color: "#AEAEB2" }}>{filtered.length} results</span>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((a, i) => (
            <div key={i} className="rounded-2xl p-4 bg-white flex items-start gap-3"
              style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ background: `${categoryColors[a.category] || "#6B7280"}15`, color: categoryColors[a.category] || "#6B7280" }}>
                {a.abbr.length > 5 ? a.abbr.slice(0, 4) : a.abbr}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm" style={{ color: "#1C1C1E" }}>{a.abbr}</div>
                <div className="text-sm" style={{ color: "#636366" }}>{a.full}</div>
                {a.notes && <div className="text-xs mt-0.5" style={{ color: "#AEAEB2" }}>{a.notes}</div>}
                <div className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: `${categoryColors[a.category] || "#6B7280"}15`, color: categoryColors[a.category] || "#6B7280" }}>
                  {a.category}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: "#AEAEB2" }} />
            <p className="font-medium mb-1" style={{ color: "#1C1C1E" }}>No abbreviations found</p>
            <p className="text-sm mb-4" style={{ color: "#AEAEB2" }}>Try a different term or clear the filters.</p>
            <button onClick={() => { setQuery(""); setCategory("All"); }} className="text-sm font-medium" style={{ color: "#007AFF" }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
