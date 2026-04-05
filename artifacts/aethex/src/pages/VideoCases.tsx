import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Bookmark, Share2, MessageCircle, Play, Filter, X, Eye, Clock, CheckCircle } from "lucide-react";

const SPECIALTIES = ["All", "Cardiology", "Neurology", "Pulmonology", "Gastroenterology", "Emergency", "Paediatrics", "Surgery", "Endocrinology"];

interface VideoCase {
  id: number;
  title: string;
  specialty: string;
  doctor: string;
  designation: string;
  duration: string;
  views: number;
  likes: number;
  thumbnail: string;
  synopsis: string;
  diagnosis: string;
  keyLearning: string[];
  verified: boolean;
}

const CASES: VideoCase[] = [
  {
    id: 1, title: "35M with sudden chest pain radiating to jaw", specialty: "Cardiology",
    doctor: "Dr. Priya Mehta", designation: "Cardiologist, AIIMS Delhi", duration: "4:22",
    views: 12400, likes: 847, thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=600&fit=crop",
    synopsis: "A 35-year-old male presents to the ED with sudden onset crushing chest pain radiating to the left jaw and arm. He is diaphoretic with BP 90/60 mmHg.",
    diagnosis: "Acute STEMI — Left Anterior Descending artery occlusion",
    keyLearning: ["Recognise STEMI on ECG within 10 minutes", "Door-to-balloon time < 90 min", "Aspirin + Clopidogrel immediately"],
    verified: true,
  },
  {
    id: 2, title: "Worst headache of her life — 28F", specialty: "Neurology",
    doctor: "Dr. Arjun Nair", designation: "Neurologist, CMC Vellore", duration: "3:45",
    views: 9200, likes: 634, thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=600&fit=crop",
    synopsis: "28-year-old woman presents with sudden 'thunderclap' headache reaching maximum intensity within 60 seconds. No fever but photophobia present.",
    diagnosis: "Subarachnoid Haemorrhage — Berry aneurysm rupture",
    keyLearning: ["Thunderclap headache = SAH until proven otherwise", "CT head first, then LP if CT negative", "Do not delay CT scan"],
    verified: true,
  },
  {
    id: 3, title: "Diabetic with 3-day breathlessness", specialty: "Pulmonology",
    doctor: "Dr. Sania Kapoor", designation: "Pulmonologist, PGI Chandigarh", duration: "5:10",
    views: 7800, likes: 512, thumbnail: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=600&fit=crop",
    synopsis: "55-year-old diabetic male with 3-day history of progressive dyspnoea, productive cough with rust-coloured sputum, fever 39°C. O2 sat 88% on room air.",
    diagnosis: "Community Acquired Pneumonia with type 1 respiratory failure",
    keyLearning: ["CURB-65 score for severity assessment", "Empirical antibiotics within 4 hours", "Target O2 sat 94-98%"],
    verified: true,
  },
  {
    id: 4, title: "Child with bilious vomiting and abdominal distension", specialty: "Paediatrics",
    doctor: "Dr. Ramesh Iyer", designation: "Paediatric Surgeon, KEM Mumbai", duration: "3:58",
    views: 5600, likes: 398, thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop",
    synopsis: "3-week-old neonate presents with bilious vomiting since birth and failure to pass meconium. Abdomen is distended. AXR shows 'double bubble' sign.",
    diagnosis: "Duodenal Atresia",
    keyLearning: ["'Double bubble' on AXR is pathognomonic", "Associated with Down syndrome in 30%", "Surgical correction — duodeno-duodenostomy"],
    verified: true,
  },
  {
    id: 5, title: "Acute abdomen with rigidity in 45M", specialty: "Surgery",
    doctor: "Dr. Kavitha Rajan", designation: "General Surgeon, JIPMER", duration: "4:35",
    views: 8900, likes: 721, thumbnail: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=600&fit=crop",
    synopsis: "45-year-old male with severe epigastric pain radiating to back, board-like abdomen rigidity, NSAID history. Erect CXR shows free air under diaphragm.",
    diagnosis: "Perforated peptic ulcer",
    keyLearning: ["'Free air' on erect CXR → immediate surgical consult", "Nasogastric tube, IV fluids, antibiotics", "Emergency laparotomy — Graham patch"],
    verified: false,
  },
  {
    id: 6, title: "Thyroid storm in post-surgical patient", specialty: "Endocrinology",
    doctor: "Dr. Nisha Pillai", designation: "Endocrinologist, Amrita Hospital", duration: "6:12",
    views: 11200, likes: 892, thumbnail: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=400&h=600&fit=crop",
    synopsis: "24-hour post-thyroidectomy patient develops high fever 41°C, tachycardia 160 bpm, altered sensorium. Burch-Wartofsky score = 70.",
    diagnosis: "Thyroid Storm (Thyrotoxic Crisis)",
    keyLearning: ["Burch-Wartofsky score > 45 = thyroid storm", "PTU > Methimazole (blocks peripheral conversion)", "Iodine given 1 hour AFTER thionamide"],
    verified: true,
  },
];

function formatNumber(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString(); }

export default function VideoCases() {
  const [filter, setFilter] = useState("All");
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<VideoCase | null>(null);

  const filtered = CASES.filter(c => filter === "All" || c.specialty === filter);

  function toggleLike(id: number) { setLiked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleSave(id: number) { setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  return (
    <div className="min-h-screen" style={{ background: "#0B0F1A", color: "#fff" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0B0F1A,#0d0f1a)", borderBottom: "1px solid rgba(239,68,68,0.15)", padding: "48px 0 32px" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ background: "rgba(239,68,68,0.15)", borderRadius: 12, padding: 10 }}>
              <Play size={28} style={{ color: "#ef4444" }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Video Case Discussions</h1>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>Short-form clinical cases · Learn from real presentations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Specialty Filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {SPECIALTIES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={filter === s
                ? { background: "#ef4444", color: "#fff" }
                : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {s}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden cursor-pointer group"
              style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* Thumbnail */}
              <div className="relative overflow-hidden" style={{ height: 200 }}>
                <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 60%)" }} />
                <button onClick={() => setActive(c)}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.9)" }}>
                    <Play size={22} fill="white" style={{ color: "white", marginLeft: 3 }} />
                  </div>
                </button>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-xs px-2 py-0.5 rounded-full mr-2" style={{ background: "rgba(239,68,68,0.85)", color: "#fff" }}>{c.specialty}</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <Clock size={10} className="inline mr-0.5" />{c.duration}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 leading-snug">{c.title}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{c.doctor}</span>
                  {c.verified && <CheckCircle size={12} style={{ color: "#007AFF" }} />}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleLike(c.id)} className="flex items-center gap-1 text-xs transition-all"
                      style={{ color: liked.has(c.id) ? "#ef4444" : "rgba(255,255,255,0.45)" }}>
                      <Heart size={14} fill={liked.has(c.id) ? "currentColor" : "none"} />
                      {formatNumber(c.likes + (liked.has(c.id) ? 1 : 0))}
                    </button>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                      <Eye size={12} />{formatNumber(c.views)}
                    </span>
                  </div>
                  <button onClick={() => toggleSave(c.id)} style={{ color: saved.has(c.id) ? "#007AFF" : "rgba(255,255,255,0.35)" }}>
                    <Bookmark size={16} fill={saved.has(c.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Modal */}
      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={e => e.target === e.currentTarget && setActive(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: "#161B2E" }}>
              <div className="relative" style={{ height: 220 }}>
                <img src={active.thumbnail} alt={active.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.9)" }}>
                    <Play size={26} fill="white" style={{ color: "white", marginLeft: 3 }} />
                  </div>
                </div>
                <button onClick={() => setActive(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)" }}>
                  <X size={16} />
                </button>
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.85)", color: "#fff" }}>{active.specialty}</span>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <h3 className="font-bold text-lg">{active.title}</h3>
                <div className="text-xs" style={{ color: "#007AFF" }}>{active.doctor} · {active.designation}</div>
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>CASE SYNOPSIS</div>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{active.synopsis}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <div className="text-xs font-semibold mb-1" style={{ color: "#22c55e" }}>FINAL DIAGNOSIS</div>
                  <p className="text-sm font-medium">{active.diagnosis}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>KEY LEARNING POINTS</div>
                  <ul className="space-y-1">
                    {active.keyLearning.map((k, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span style={{ color: "#00C2A8", flexShrink: 0 }}>✓</span>
                        <span style={{ color: "rgba(255,255,255,0.75)" }}>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
