import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, Calendar, Clock, Users, PlayCircle, Award, ChevronRight, Radio, Lock } from "lucide-react";

interface Webinar {
  id: number;
  title: string;
  speaker: string;
  designation: string;
  specialty: string;
  date: Date;
  duration: string;
  registered: number;
  maxSeats: number;
  isLive: boolean;
  isPast: boolean;
  cmeCredits: number;
  thumbnail: string;
  description: string;
}

const now = new Date();
const add = (h: number) => new Date(now.getTime() + h * 3600000);
const sub = (h: number) => new Date(now.getTime() - h * 3600000);

const WEBINARS: Webinar[] = [
  {
    id: 1, title: "New Guidelines in Heart Failure Management 2025", speaker: "Dr. Rajesh Gupta", designation: "Director of Cardiology, AIIMS",
    specialty: "Cardiology", date: add(2), duration: "90 mins", registered: 1842, maxSeats: 2000, isLive: false, isPast: false, cmeCredits: 2,
    thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=300&fit=crop",
    description: "Covering the latest ESC and ACC/AHA guidelines on heart failure with reduced ejection fraction, including new drug classes and device therapy.",
  },
  {
    id: 2, title: "LIVE: Approach to Undifferentiated Fever in India", speaker: "Dr. Meera Krishnan", designation: "Infectious Disease Specialist, CMC",
    specialty: "Infectious Disease", date: sub(0.25), duration: "60 mins", registered: 3201, maxSeats: 5000, isLive: true, isPast: false, cmeCredits: 1,
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=300&fit=crop",
    description: "Live session covering systematic approach to fever of unknown origin with India-specific differentials including dengue, malaria, typhoid, and leptospirosis.",
  },
  {
    id: 3, title: "NEET-PG High-Yield Pharmacology: Must-Know Drugs", speaker: "Dr. Anand Sharma", designation: "Pharmacology Faculty, JIPMER",
    specialty: "Pharmacology / NEET-PG", date: add(26), duration: "120 mins", registered: 5644, maxSeats: 10000, isLive: false, isPast: false, cmeCredits: 2,
    thumbnail: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=300&fit=crop",
    description: "Comprehensive review of 80% of the pharmacology questions that repeat in NEET-PG. Includes memory tricks, previous year Q analysis, and pattern recognition.",
  },
  {
    id: 4, title: "Diabetes Management in the Indian Patient", speaker: "Dr. Nisha Sharma", designation: "Endocrinologist, PGIMER Chandigarh",
    specialty: "Endocrinology", date: add(72), duration: "90 mins", registered: 2100, maxSeats: 3000, isLive: false, isPast: false, cmeCredits: 2,
    thumbnail: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=600&h=300&fit=crop",
    description: "GLP-1 agonists, SGLT2 inhibitors, and insulin regimens for T2DM with special focus on challenges in the Indian population including affordability and compliance.",
  },
  {
    id: 5, title: "Emergency Airway Management", speaker: "Dr. Vikram Patel", designation: "Emergency Medicine, KEM Mumbai",
    specialty: "Emergency Medicine", date: sub(48), duration: "75 mins", registered: 1200, maxSeats: 2000, isLive: false, isPast: true, cmeCredits: 1,
    thumbnail: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=300&fit=crop",
    description: "RSI protocol, video laryngoscopy, surgical airway — recorded session available with CME certificate.",
  },
  {
    id: 6, title: "Paediatric Emergencies: High Yield for NEET-PG", speaker: "Dr. Sudha Rao", designation: "Paediatrics Faculty, Manipal",
    specialty: "Paediatrics", date: sub(120), duration: "90 mins", registered: 3800, maxSeats: 5000, isLive: false, isPast: true, cmeCredits: 2,
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=300&fit=crop",
    description: "Neonatal emergencies, febrile seizures, anaphylaxis — complete recorded session with Q&A.",
  },
];

function Countdown({ target }: { target: Date }) {
  const [secs, setSecs] = useState(Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000)));
  useEffect(() => {
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return (
    <div className="flex gap-2">
      {[{ v: h, l: "H" }, { v: m, l: "M" }, { v: s, l: "S" }].map(({ v, l }) => (
        <div key={l} className="text-center">
          <div className="text-xl font-bold tabular-nums" style={{ color: "#007AFF" }}>{String(v).padStart(2, "0")}</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

export default function Webinars() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [registered, setRegistered] = useState<Set<number>>(new Set());

  const upcoming = WEBINARS.filter(w => !w.isPast);
  const past = WEBINARS.filter(w => w.isPast);
  const live = upcoming.filter(w => w.isLive);
  const scheduled = upcoming.filter(w => !w.isLive);

  return (
    <div className="min-h-screen" style={{ background: "#0B0F1A", color: "#fff" }}>
      <div style={{ background: "linear-gradient(135deg,#0B0F1A,#0d1020)", borderBottom: "1px solid rgba(0,122,255,0.2)", padding: "48px 0 32px" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ background: "rgba(0,122,255,0.15)", borderRadius: 12, padding: 10 }}>
              <Video size={28} style={{ color: "#007AFF" }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Live CME Webinars</h1>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>NMC-recognised CME credits · Expert faculty</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.06)" }}>
          <button onClick={() => setTab("upcoming")} className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={tab === "upcoming" ? { background: "#007AFF", color: "#fff" } : { color: "rgba(255,255,255,0.6)" }}>
            📅 Upcoming ({upcoming.length})
          </button>
          <button onClick={() => setTab("past")} className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={tab === "past" ? { background: "#007AFF", color: "#fff" } : { color: "rgba(255,255,255,0.6)" }}>
            🎬 Recordings ({past.length})
          </button>
        </div>

        {tab === "upcoming" && (
          <div className="space-y-6">
            {/* Live Now */}
            {live.map(w => (
              <motion.div key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-2xl overflow-hidden" style={{ border: "2px solid #ef4444" }}>
                <div className="relative" style={{ height: 200 }}>
                  <img src={w.thumbnail} alt={w.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} />
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "#ef4444" }}>
                    <Radio size={14} className="animate-pulse" />
                    <span className="text-sm font-bold">LIVE NOW</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold">{w.title}</h3>
                    <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{w.speaker} · {w.designation}</p>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between" style={{ background: "#161B2E" }}>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                      <Users size={15} />{w.registered.toLocaleString()} watching
                    </span>
                    <span className="flex items-center gap-1.5 text-sm" style={{ color: "#22c55e" }}>
                      <Award size={15} />{w.cmeCredits} CME credits
                    </span>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold" style={{ background: "#ef4444", color: "#fff" }}>
                    <PlayCircle size={18} /> Join Live
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Scheduled */}
            <div className="space-y-4">
              {scheduled.map((w, i) => (
                <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="rounded-2xl p-5 flex gap-5" style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <img src={w.thumbnail} alt={w.title} className="w-28 h-20 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs px-2 py-0.5 rounded-full mr-2" style={{ background: "rgba(0,122,255,0.15)", color: "#60a5fa" }}>{w.specialty}</span>
                        <span className="text-xs" style={{ color: "#22c55e" }}>+{w.cmeCredits} CME</span>
                      </div>
                    </div>
                    <h3 className="font-semibold mt-2 line-clamp-1">{w.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{w.speaker}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <Calendar size={11} />{w.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ·{" "}
                        {w.date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <Users size={11} />{w.registered.toLocaleString()} registered
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <Countdown target={w.date} />
                    <button onClick={() => setRegistered(s => { const n = new Set(s); n.has(w.id) ? n.delete(w.id) : n.add(w.id); return n; })}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={registered.has(w.id)
                        ? { background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }
                        : { background: "#007AFF", color: "#fff" }}>
                      {registered.has(w.id) ? "✓ Registered" : "Register Free"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "past" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {past.map((w, i) => (
              <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-2xl overflow-hidden group cursor-pointer" style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="relative" style={{ height: 160 }}>
                  <img src={w.thumbnail} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(0,122,255,0.85)" }}>
                      <PlayCircle size={22} style={{ color: "#fff" }} />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.8)" }}>
                      <Clock size={10} className="inline mr-0.5" />{w.duration}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{w.title}</h3>
                  <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>{w.speaker}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full flex items-center gap-1" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
                      <Award size={11} /> +{w.cmeCredits} CME Certificate
                    </span>
                    <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "rgba(0,122,255,0.15)", color: "#60a5fa" }}>
                      Watch Recording
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
