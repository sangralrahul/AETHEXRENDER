import { useState } from "react";
import { Link } from "wouter";
import {
  Video, Calendar, Clock, Star, Users, Bell, Play,
  Award, ChevronRight, BookOpen, Sparkles, MapPin, Mic,
} from "lucide-react";

const UPCOMING = [
  { id: 1, title: "Cardiology High-Yield: IHD, Heart Failure & Arrhythmias", faculty: "Dr. Ramesh Menon", qual: "MD Medicine, DM Cardiology · AIIMS Delhi", specialty: "Cardiology", date: "Apr 10, 2026", time: "7:00 PM IST", duration: "2 hrs", attendees: 1240, cme: 2, live: true, tag: "NEET-PG" },
  { id: 2, title: "Pharmacology Masterclass: Autonomic & CVS Drugs", faculty: "Dr. Sunita Arora", qual: "MD Pharmacology · PGI Chandigarh", specialty: "Pharmacology", date: "Apr 12, 2026", time: "8:00 PM IST", duration: "1.5 hrs", attendees: 890, cme: 1, live: false, tag: "High-Yield" },
  { id: 3, title: "Obstetrics: Normal & Abnormal Labour — NEET Pattern", faculty: "Dr. Kavita Sharma", qual: "MS OBG · JIPMER Puducherry", specialty: "OBG", date: "Apr 14, 2026", time: "6:30 PM IST", duration: "2 hrs", attendees: 675, cme: 2, live: false, tag: "NEET-PG" },
  { id: 4, title: "Pathology: Neoplasia & Tumour Markers — Complete Revision", faculty: "Dr. Anil Kumar", qual: "MD Pathology · KEM Mumbai", specialty: "Pathology", date: "Apr 17, 2026", time: "7:30 PM IST", duration: "1.5 hrs", attendees: 540, cme: 1, live: false, tag: "Revision" },
  { id: 5, title: "Radiology for Clinicians: X-Ray, CT & MRI Interpretation", faculty: "Dr. Priya Nair", qual: "MD Radiology · CMC Vellore", specialty: "Radiology", date: "Apr 19, 2026", time: "6:00 PM IST", duration: "2 hrs", attendees: 430, cme: 2, live: false, tag: "Clinical" },
];

const RECORDED = [
  { id: 1, title: "Anatomy: Brachial Plexus — Complete Guide with Clinical Correlations", faculty: "Dr. R. Menon", views: 12400, duration: "1h 48m", specialty: "Anatomy", cme: 1, date: "Mar 28, 2026", timestamps: ["0:00 Intro", "8:30 Root values", "22:00 Cords & Branches", "55:00 Clinical correlations"] },
  { id: 2, title: "Medicine: Respiratory System — COPD, Asthma, Interstitial Lung Disease", faculty: "Dr. S. Arora", views: 9800, duration: "2h 12m", specialty: "Medicine", cme: 2, date: "Mar 24, 2026", timestamps: ["0:00 Intro", "10:00 COPD", "45:00 Asthma", "1:20:00 ILD"] },
  { id: 3, title: "Surgery: Thyroid Disorders & Thyroid Surgery Complications", faculty: "Dr. A. Kumar", views: 7600, duration: "1h 22m", specialty: "Surgery", cme: 1, date: "Mar 20, 2026", timestamps: ["0:00 Intro", "5:30 Thyroid anatomy", "25:00 Goitre", "55:00 Surgery"] },
  { id: 4, title: "Paediatrics: Neonatology — NEC, RDS, Jaundice in Newborn", faculty: "Dr. K. Sharma", views: 5900, duration: "1h 55m", specialty: "Paediatrics", cme: 1, date: "Mar 15, 2026", timestamps: ["0:00 Intro", "12:00 RDS", "40:00 Neonatal Jaundice", "1:15:00 NEC"] },
  { id: 5, title: "Microbiology: Bacteriology — Staphylococcus, Streptococcus & MRSA", faculty: "Dr. P. Nair", views: 5200, duration: "1h 38m", specialty: "Microbiology", cme: 1, date: "Mar 10, 2026", timestamps: ["0:00 Intro", "8:00 Staph", "35:00 Strep", "1:05:00 MRSA"] },
  { id: 6, title: "ENT: Deafness, Otitis Media & CSOM — High-Yield for NEET-PG", faculty: "Dr. R. Menon", views: 4800, duration: "1h 15m", specialty: "ENT", cme: 1, date: "Mar 05, 2026", timestamps: ["0:00 Intro", "10:00 Deafness types", "32:00 Otitis Media", "55:00 CSOM"] },
  { id: 7, title: "Community Medicine: Epidemiology & Biostatistics Made Easy", faculty: "Dr. A. Kumar", views: 4100, duration: "2h 05m", specialty: "PSM", cme: 2, date: "Feb 28, 2026", timestamps: ["0:00 Intro", "15:00 Study designs", "50:00 Biostatistics", "1:30:00 Screening"] },
  { id: 8, title: "Dermatology: Skin Infections, Eczema & Psoriasis — Complete Review", faculty: "Dr. S. Arora", views: 3700, duration: "1h 28m", specialty: "Dermatology", cme: 1, date: "Feb 22, 2026", timestamps: ["0:00 Intro", "10:00 Bacterial infections", "35:00 Eczema", "58:00 Psoriasis"] },
  { id: 9, title: "Ophthalmology: Glaucoma, Cataract & Retinal Disorders", faculty: "Dr. P. Nair", views: 3200, duration: "1h 42m", specialty: "Ophthalmology", cme: 1, date: "Feb 15, 2026", timestamps: ["0:00 Intro", "8:00 Glaucoma", "32:00 Cataract", "1:05:00 Retinal"] },
  { id: 10, title: "Orthopaedics: Fractures, Dislocations & Bone Tumours", faculty: "Dr. K. Sharma", views: 2900, duration: "1h 58m", specialty: "Orthopaedics", cme: 2, date: "Feb 10, 2026", timestamps: ["0:00 Intro", "12:00 Fracture healing", "45:00 Dislocations", "1:25:00 Bone tumours"] },
];

const SPECIALTIES = ["All", "Anatomy", "Physiology", "Pharmacology", "Pathology", "Medicine", "Surgery", "OBG", "Paediatrics", "Microbiology", "Radiology", "ENT", "Ophthalmology", "Orthopaedics", "Dermatology", "PSM"];
const colors: Record<string, string> = { "NEET-PG": "#007AFF", "High-Yield": "#F59E0B", Revision: "#8B5CF6", Clinical: "#00C2A8" };

export default function LiveClasses() {
  const [tab, setTab] = useState<"upcoming" | "recorded">("upcoming");
  const [filter, setFilter] = useState("All");
  const [reminded, setReminded] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleRemind = (id: number) => setReminded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="min-h-screen" style={{ background: "#F2F2F7" }}>
      {/* Hero */}
      <div className="relative overflow-hidden pt-14 pb-16">
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(8,18,36,0.93) 0%,rgba(10,26,50,0.88) 100%)" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#F87171" }}>
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs font-semibold">Live & Recorded Classes</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" style={{ letterSpacing: "-1px" }}>
            Learn from India's <span style={{ background: "linear-gradient(135deg,#00C2A8,#007AFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Best Faculty</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>Live interactive sessions + 100+ recorded masterclasses. Earn CME credits for every class attended.</p>
          <div className="flex items-center justify-center gap-6 mt-6">
            {[{ v: "5+", l: "Upcoming Sessions" }, { v: "10+", l: "Recorded Classes" }, { v: "CME", l: "Credits Awarded" }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black text-white">{s.v}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["upcoming", "recorded"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize"
              style={tab === t ? { background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF" } : { background: "#FFFFFF", color: "#636366", border: "1px solid rgba(60,60,67,0.15)" }}>
              {t === "upcoming" ? "🔴 Upcoming Live" : "🎬 Recorded Classes"}
            </button>
          ))}
        </div>

        {/* Specialty filter */}
        <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-1">
          {SPECIALTIES.map(s => (
            <button key={s} onClick={() => setFilter(s)} className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={filter === s ? { background: "#007AFF", color: "#FFFFFF" } : { background: "#FFFFFF", color: "#636366", border: "1px solid rgba(60,60,67,0.12)" }}>
              {s}
            </button>
          ))}
        </div>

        {tab === "upcoming" ? (
          <div className="space-y-4">
            {UPCOMING.map(c => (
              <div key={c.id} className="rounded-2xl p-5" style={{ background: "#FFFFFF", border: `1px solid ${c.live ? "rgba(239,68,68,0.2)" : "rgba(60,60,67,0.1)"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: c.live ? "rgba(239,68,68,0.1)" : "rgba(0,122,255,0.08)" }}>
                    {c.live ? <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" /> : <Video className="w-5 h-5" style={{ color: "#007AFF" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${colors[c.tag] || "#007AFF"}18`, color: colors[c.tag] || "#007AFF" }}>{c.tag}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(0,194,168,0.1)", color: "#00C2A8" }}>+{c.cme} CME Credit{c.cme > 1 ? "s" : ""}</span>
                    </div>
                    <h3 className="font-bold text-base mb-1 leading-snug" style={{ color: "#1C1C1E" }}>{c.title}</h3>
                    <p className="text-sm mb-2" style={{ color: "#636366" }}>{c.faculty} <span className="text-xs" style={{ color: "#AEAEB2" }}>· {c.qual}</span></p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1 text-xs" style={{ color: "#AEAEB2" }}><Calendar className="w-3.5 h-3.5" />{c.date}</span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: "#AEAEB2" }}><Clock className="w-3.5 h-3.5" />{c.time} · {c.duration}</span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: "#AEAEB2" }}><Users className="w-3.5 h-3.5" />{c.attendees.toLocaleString()} registered</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  {c.live ? (
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "#EF4444", color: "#FFFFFF" }}>
                      <Play className="w-3.5 h-3.5" /> Join Live Now
                    </button>
                  ) : (
                    <button onClick={() => toggleRemind(c.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all" style={{ background: reminded.has(c.id) ? "rgba(0,194,168,0.1)" : "rgba(0,122,255,0.08)", color: reminded.has(c.id) ? "#00C2A8" : "#007AFF" }}>
                      <Bell className="w-3.5 h-3.5" /> {reminded.has(c.id) ? "Reminder Set ✓" : "Remind Me"}
                    </button>
                  )}
                  <span className="text-xs ml-auto" style={{ color: "#AEAEB2" }}>{c.specialty}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {RECORDED.map(c => (
              <div key={c.id} className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid rgba(60,60,67,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div className="p-4 flex items-start gap-4 cursor-pointer" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,122,255,0.08)" }}>
                    <Play className="w-5 h-5" style={{ color: "#007AFF" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-snug mb-1" style={{ color: "#1C1C1E" }}>{c.title}</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs" style={{ color: "#636366" }}>{c.faculty}</span>
                      <span className="text-xs" style={{ color: "#AEAEB2" }}>{c.duration}</span>
                      <span className="text-xs" style={{ color: "#AEAEB2" }}>{c.views.toLocaleString()} views</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,194,168,0.08)", color: "#00C2A8" }}>+{c.cme} CME</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${expanded === c.id ? "rotate-90" : ""}`} style={{ color: "#AEAEB2" }} />
                </div>
                {expanded === c.id && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="rounded-xl p-3" style={{ background: "#F2F2F7" }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: "#1C1C1E" }}>Timestamps</p>
                      <ul className="space-y-1">
                        {c.timestamps.map((t, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs cursor-pointer hover:opacity-70 transition-opacity" style={{ color: "#007AFF" }}>
                            <Play className="w-2.5 h-2.5" /> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#007AFF,#00C2A8)", color: "#FFFFFF" }}>
                      <Play className="w-3.5 h-3.5" /> Watch Now — Earn {c.cme} CME Credit{c.cme > 1 ? "s" : ""}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
