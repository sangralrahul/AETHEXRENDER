import { useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, FileText, Plus, X, Printer, RefreshCw } from "lucide-react";

interface Drug {
  id: number;
  name: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const ROUTES = ["Oral","IV","IM","SC","Topical","Sublingual","Inhaled","Rectal","Transdermal","Nasal"];
const FREQUENCIES = ["OD (Once daily)","BD (Twice daily)","TDS (Three times daily)","QID (Four times daily)","PRN (As needed)","Weekly","At night (ON)","In the morning","Alternate days","Stat (Single dose)"];
const DURATIONS = ["3 days","5 days","7 days","10 days","14 days","1 month","2 months","3 months","6 months","Ongoing","Until review","As directed"];

let nextId = 1;

export default function PrescriptionGenerator() {
  const [patient, setPatient] = useState({ name: "", age: "", sex: "Male", weight: "", allergies: "" });
  const [doctor, setDoctor] = useState({ name: "", reg: "", clinic: "", contact: "" });
  const [drugs, setDrugs] = useState<Drug[]>([{ id: nextId++, name: "", dose: "", route: "Oral", frequency: "OD (Once daily)", duration: "7 days", instructions: "" }]);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const addDrug = () => setDrugs(prev => [...prev, { id: nextId++, name: "", dose: "", route: "Oral", frequency: "OD (Once daily)", duration: "7 days", instructions: "" }]);
  const removeDrug = (id: number) => setDrugs(prev => prev.filter(d => d.id !== id));
  const updateDrug = (id: number, field: keyof Drug, value: string) => setDrugs(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  const updatePatient = (field: string, value: string) => setPatient(prev => ({ ...prev, [field]: value }));
  const updateDoctor = (field: string, value: string) => setDoctor(prev => ({ ...prev, [field]: value }));

  const handlePrint = () => window.print();

  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
      <style>{`@media print { .no-print { display: none !important; } .print-area { background: white !important; padding: 32px !important; } }`}</style>

      <div className="relative overflow-hidden no-print" >
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550831107-1553da8c8464?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(10,22,40,0.93) 0%, rgba(13,33,68,0.9) 50%, rgba(10,48,96,0.93) 100%)" }} />
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-10 relative z-10">
          <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.2)" }}>
              <FileText className="w-5 h-5" style={{ color: "#10B981" }} />
            </div>
            <h1 className="text-3xl font-bold text-white">Prescription Generator</h1>
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Create professional prescriptions with dosing, frequency, and patient instructions.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
          {/* Doctor Details */}
          <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h2 className="font-semibold mb-4" style={{ color: "#1C1C1E" }}>Prescriber Details</h2>
            <div className="space-y-3">
              {[{ label: "Doctor Name", field: "name", placeholder: "Dr. Ramesh Kumar" },
                { label: "Registration No.", field: "reg", placeholder: "MCI-12345" },
                { label: "Clinic / Hospital", field: "clinic", placeholder: "City Medical Centre" },
                { label: "Contact / Address", field: "contact", placeholder: "Phone / address" }
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>{f.label}</label>
                  <input type="text" placeholder={f.placeholder} value={(doctor as any)[f.field]} onChange={e => updateDoctor(f.field, e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h2 className="font-semibold mb-4" style={{ color: "#1C1C1E" }}>Patient Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Patient Name</label>
                <input type="text" placeholder="Full name" value={patient.name} onChange={e => updatePatient("name", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Age</label>
                  <input type="text" placeholder="e.g. 35" value={patient.age} onChange={e => updatePatient("age", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Sex</label>
                  <select value={patient.sex} onChange={e => updatePatient("sex", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E", background: "#fff" }}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Weight (kg)</label>
                  <input type="text" placeholder="e.g. 70" value={patient.weight} onChange={e => updatePatient("weight", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Known Allergies</label>
                <input type="text" placeholder="e.g. Penicillin, NSAIDs — or NKDA" value={patient.allergies} onChange={e => updatePatient("allergies", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Diagnosis</label>
                <input type="text" placeholder="e.g. Community-acquired pneumonia" value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Medications */}
        <div className="rounded-2xl p-6 bg-white no-print" style={{ border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: "#1C1C1E" }}>Medications</h2>
            <button onClick={addDrug} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-white" style={{ background: "#007AFF" }}>
              <Plus className="w-4 h-4" /> Add Drug
            </button>
          </div>
          <div className="space-y-4">
            {drugs.map((drug, i) => (
              <div key={drug.id} className="rounded-xl p-4" style={{ background: "#F2F2F7" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold" style={{ color: "#007AFF" }}>#{i + 1}</span>
                  {drugs.length > 1 && (
                    <button onClick={() => removeDrug(drug.id)} className="opacity-50 hover:opacity-100">
                      <X className="w-4 h-4" style={{ color: "#EF4444" }} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Drug Name</label>
                    <input type="text" placeholder="e.g. Amoxicillin 500mg caps" value={drug.name} onChange={e => updateDrug(drug.id, "name", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-white"
                      style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Dose</label>
                    <input type="text" placeholder="e.g. 500mg" value={drug.dose} onChange={e => updateDrug(drug.id, "dose", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-white"
                      style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Route</label>
                    <select value={drug.route} onChange={e => updateDrug(drug.id, "route", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-white"
                      style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }}>
                      {ROUTES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Frequency</label>
                    <select value={drug.frequency} onChange={e => updateDrug(drug.id, "frequency", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-white"
                      style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }}>
                      {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Duration</label>
                    <select value={drug.duration} onChange={e => updateDrug(drug.id, "duration", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-white"
                      style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }}>
                      {DURATIONS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Special Instructions</label>
                    <input type="text" placeholder="e.g. Take with food, avoid dairy" value={drug.instructions} onChange={e => updateDrug(drug.id, "instructions", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-white"
                      style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium mb-1" style={{ color: "#636366" }}>Additional Notes / Follow-up</label>
            <textarea placeholder="e.g. Review in 1 week. Return if worsening symptoms." value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ border: "1.5px solid rgba(60,60,67,0.2)", color: "#1C1C1E" }} />
          </div>
        </div>

        {/* Print Button */}
        <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm text-white transition-all hover:opacity-90 no-print"
          style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)" }}>
          <Printer className="w-4 h-4" /> Print / Download Prescription
        </button>

        {/* Prescription Preview */}
        <div ref={printRef} className="print-area rounded-2xl p-8 bg-white" style={{ border: "2px solid rgba(60,60,67,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontFamily: "Georgia, serif" }}>
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-5" style={{ borderBottom: "2px solid #1C1C1E" }}>
            <div>
              <div className="text-xl font-bold" style={{ color: "#1C1C1E" }}>{doctor.name || "Dr. _______"}</div>
              {doctor.reg && <div className="text-sm" style={{ color: "#636366" }}>Reg. No: {doctor.reg}</div>}
              {doctor.clinic && <div className="text-sm" style={{ color: "#636366" }}>{doctor.clinic}</div>}
              {doctor.contact && <div className="text-sm" style={{ color: "#636366" }}>{doctor.contact}</div>}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: "#007AFF", fontFamily: "sans-serif" }}>℞</div>
              <div className="text-xs" style={{ color: "#636366" }}>{today}</div>
            </div>
          </div>

          {/* Patient */}
          <div className="mb-5 p-4 rounded-xl" style={{ background: "#F2F2F7" }}>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span style={{ color: "#636366" }}>Patient: </span><strong>{patient.name || "_________________"}</strong></div>
              <div><span style={{ color: "#636366" }}>Age/Sex: </span><strong>{patient.age ? `${patient.age}Y` : "__"}  /  {patient.sex}</strong></div>
              {patient.weight && <div><span style={{ color: "#636366" }}>Weight: </span><strong>{patient.weight} kg</strong></div>}
              {patient.allergies && <div><span style={{ color: "#EF4444" }}>Allergies: </span><strong style={{ color: "#EF4444" }}>{patient.allergies}</strong></div>}
            </div>
            {diagnosis && <div className="mt-2 text-sm"><span style={{ color: "#636366" }}>Diagnosis: </span><strong>{diagnosis}</strong></div>}
          </div>

          {/* Drugs */}
          <div className="mb-5">
            {drugs.map((drug, i) => (
              <div key={drug.id} className="mb-4 pl-4" style={{ borderLeft: "3px solid #007AFF" }}>
                <div className="font-bold text-base" style={{ color: "#1C1C1E" }}>
                  {i + 1}. {drug.name || "_______________"} {drug.dose && `— ${drug.dose}`}
                </div>
                <div className="text-sm" style={{ color: "#636366" }}>
                  Route: {drug.route} | {drug.frequency.split(" (")[0]} | Duration: {drug.duration}
                </div>
                {drug.instructions && <div className="text-sm italic" style={{ color: "#636366" }}>*{drug.instructions}</div>}
              </div>
            ))}
          </div>

          {notes && <div className="mb-5 text-sm p-3 rounded-xl" style={{ background: "#FFFBEB", color: "#92400E" }}>Note: {notes}</div>}

          {/* Signature */}
          <div className="flex justify-end mt-10 pt-6" style={{ borderTop: "1px solid rgba(60,60,67,0.15)" }}>
            <div className="text-center">
              <div className="w-40 mb-1" style={{ borderBottom: "1.5px solid #1C1C1E" }} />
              <div className="text-sm" style={{ color: "#636366" }}>Signature &amp; Stamp</div>
              <div className="text-sm font-medium" style={{ color: "#1C1C1E" }}>{doctor.name || "Dr. _______"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
