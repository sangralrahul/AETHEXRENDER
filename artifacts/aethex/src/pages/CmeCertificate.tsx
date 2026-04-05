import { useState } from "react";
import { Award, Download, Share2, FileText, CheckCircle, Plus, Eye } from "lucide-react";

const COMPLETED_MODULES = [
  { id: 1, name: "Cardiology Update 2026: New Guidelines in Heart Failure Management", credits: 3, date: "Mar 28, 2026", type: "Live Webinar", provider: "AETHEX / Clavix Technologies Pvt. Ltd." },
  { id: 2, name: "Pharmacovigilance & ADR Reporting for Indian Clinicians", credits: 2, date: "Mar 15, 2026", type: "Online Module", provider: "AETHEX / Clavix Technologies Pvt. Ltd." },
  { id: 3, name: "Clinical Nutrition in Critical Care — ICU Feeding Protocols", credits: 2, date: "Feb 28, 2026", type: "Recorded Lecture", provider: "AETHEX / Clavix Technologies Pvt. Ltd." },
  { id: 4, name: "Ethics in Medicine: Informed Consent & Patient Rights in India", credits: 1, date: "Feb 14, 2026", type: "Online Module", provider: "AETHEX / Clavix Technologies Pvt. Ltd." },
  { id: 5, name: "Antibiotic Stewardship — Rational Use of Antibiotics in India", credits: 2, date: "Jan 31, 2026", type: "Live Webinar", provider: "AETHEX / Clavix Technologies Pvt. Ltd." },
];

const CERT_COLORS = ["linear-gradient(135deg,#007AFF,#00C2A8)", "linear-gradient(135deg,#8B5CF6,#007AFF)", "linear-gradient(135deg,#F59E0B,#EF4444)", "linear-gradient(135deg,#10B981,#00C2A8)"];

export default function CmeCertificate() {
  const [selected, setSelected] = useState<number | null>(null);
  const [doctorName] = useState("Dr. Ravi Kumar");
  const [regNo] = useState("MH-12345-2018");
  const [preview, setPreview] = useState(false);

  const totalCredits = COMPLETED_MODULES.reduce((a, m) => a + m.credits, 0);
  const mod = selected !== null ? COMPLETED_MODULES[selected] : null;

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
      {/* Hero */}
      <div className="relative overflow-hidden pt-14 pb-16">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#0A0E1A 0%,#1a1f3a 100%)" }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" style={{ background: "rgba(0,122,255,0.12)" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#FCD34D" }}>
            <Award className="w-3.5 h-3.5" /><span className="text-xs font-semibold">CME Certificate Generator</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" style={{ letterSpacing: "-1px" }}>
            Your CME <span style={{ background: "linear-gradient(135deg,#F59E0B,#FCD34D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Certificates</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>Download PDF certificates for every completed module. Export your full CME log for NMC submission.</p>
          <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-2xl" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <Award className="w-6 h-6" style={{ color: "#F59E0B" }} />
            <div className="text-left">
              <div className="text-2xl font-black text-white">{totalCredits} CME Credits</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Earned this year · Target: 30</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="rounded-2xl p-5 mb-6" style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.1)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: "#1C1C1E" }}>NMC Annual CME Progress</span>
            <span className="text-sm font-bold" style={{ color: "#007AFF" }}>{totalCredits}/30 credits</span>
          </div>
          <div className="h-3 rounded-full" style={{ background: "#F2F2F7" }}>
            <div className="h-3 rounded-full transition-all" style={{ width: `${Math.min(100, (totalCredits / 30) * 100)}%`, background: "linear-gradient(90deg,#007AFF,#00C2A8)" }} />
          </div>
          <p className="text-xs mt-2" style={{ color: "#AEAEB2" }}>{30 - totalCredits} more credits needed to meet NMC annual requirement</p>
        </div>

        {/* Export all */}
        <div className="flex gap-3 mb-6">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF" }}>
            <Download className="w-4 h-4" /> Export Full CME Log (PDF)
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.12)", color: "#1C1C1E" }}>
            <Share2 className="w-4 h-4" /> Share on LinkedIn
          </button>
        </div>

        {/* Modules list */}
        <div className="space-y-3">
          {COMPLETED_MODULES.map((m, i) => (
            <div key={m.id} className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: CERT_COLORS[i % CERT_COLORS.length] }}>
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-snug mb-1.5" style={{ color: "#1C1C1E" }}>{m.name}</h3>
                  <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: "#AEAEB2" }}>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" style={{ color: "#00C2A8" }} />Completed {m.date}</span>
                    <span>{m.type}</span>
                    <span className="font-semibold" style={{ color: "#F59E0B" }}>+{m.credits} CME Credits</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setSelected(i); setPreview(true); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "rgba(0,122,255,0.08)", color: "#007AFF" }}>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "rgba(0,194,168,0.08)", color: "#00C2A8" }}>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Preview Modal */}
        {preview && mod && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} onClick={() => setPreview(false)}>
            <div className="max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              {/* Certificate */}
              <div className="p-10 text-center relative" style={{ background: CERT_COLORS[selected! % CERT_COLORS.length], minHeight: 380 }}>
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
                <div className="relative z-10">
                  <div className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">Certificate of Completion</div>
                  <div className="text-4xl font-black text-white mb-1">AETHEX</div>
                  <div className="text-white/70 text-xs mb-6">by Clavix Technologies Private Limited</div>
                  <div className="text-white/80 text-sm mb-2">This is to certify that</div>
                  <div className="text-3xl font-black text-white mb-1">{doctorName}</div>
                  <div className="text-white/70 text-xs mb-4">NMC Reg. No.: {regNo}</div>
                  <div className="text-white/80 text-sm mb-1">has successfully completed</div>
                  <div className="text-lg font-bold text-white mb-4 max-w-sm mx-auto leading-snug">{mod.name}</div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
                    <Award className="w-4 h-4 text-white" />
                    <span className="text-white font-bold">{mod.credits} CME Credit{mod.credits > 1 ? "s" : ""}</span>
                  </div>
                  <div className="mt-4 text-white/60 text-xs">{mod.date} · {mod.type}</div>
                </div>
              </div>
              <div className="p-4 flex gap-3 justify-center" style={{ background: "#FFFFFF" }}>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF" }}>
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "#F2F2F7", color: "#636366" }}>
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button onClick={() => setPreview(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: "#AEAEB2" }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
