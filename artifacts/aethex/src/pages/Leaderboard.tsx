import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Star, Crown, Medal, Award, ChevronUp, ChevronDown, Minus } from "lucide-react";

type Scope = "college" | "state" | "india";

interface Student {
  rank: number;
  name: string;
  college: string;
  state: string;
  avatar: string;
  points: number;
  streak: number;
  change: number;
  badges: string[];
  breakdown: { cme: number; flashcards: number; quizzes: number; cases: number };
}

function makeStudents(scope: Scope): Student[] {
  const colleges = ["AIIMS Delhi", "JIPMER Puducherry", "CMC Vellore", "PGI Chandigarh", "KEM Mumbai", "NIMHANS Bangalore", "Madras Medical College", "Grant Medical College", "Maulana Azad", "BJ Medical College"];
  const states = ["Delhi", "Puducherry", "Tamil Nadu", "Punjab", "Maharashtra", "Karnataka", "Tamil Nadu", "Maharashtra", "Delhi", "Gujarat"];
  const names = ["Riya Sharma", "Arjun Nair", "Sneha Patel", "Karthik Menon", "Priya Reddy", "Aditya Singh", "Meera Iyer", "Rohan Gupta", "Anjali Kumar", "Vivek Pillai",
    "Deepa Raj", "Siddharth M", "Pooja Kapoor", "Nikhil Verma", "Lavanya S", "Rahul Desai", "Tanvi Joshi", "Manish Rao", "Shriya T", "Akash Pandey"];
  return Array.from({ length: 20 }, (_, i) => ({
    rank: i + 1,
    name: names[i],
    college: scope === "college" ? "AIIMS Delhi" : colleges[i % colleges.length],
    state: states[i % states.length],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${names[i]}&backgroundColor=${["b6e3f4", "c0aede", "ffd5dc", "d1f4d9"][i % 4]}`,
    points: Math.floor(9500 - i * 420 + Math.random() * 200),
    streak: Math.max(1, Math.floor(30 - i * 1.3 + Math.random() * 5)),
    change: Math.floor(Math.random() * 7) - 3,
    badges: [
      ...(i < 5 ? ["🔥"] : []),
      ...(i < 10 ? ["📚"] : []),
      ...((i + 1) % 3 === 0 ? ["⭐"] : []),
    ],
    breakdown: {
      cme: Math.floor(Math.random() * 3000 + 1000),
      flashcards: Math.floor(Math.random() * 2500 + 500),
      quizzes: Math.floor(Math.random() * 3000 + 800),
      cases: Math.floor(Math.random() * 1500 + 300),
    },
  }));
}

const ME: Student = {
  rank: 47, name: "You", college: "AIIMS Delhi", state: "Delhi",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me&backgroundColor=ffd5dc",
  points: 3840, streak: 7, change: 2, badges: ["🔥"],
  breakdown: { cme: 1200, flashcards: 900, quizzes: 1400, cases: 340 },
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={22} fill="#FFD700" style={{ color: "#FFD700" }} />;
  if (rank === 2) return <Crown size={22} fill="#C0C0C0" style={{ color: "#C0C0C0" }} />;
  if (rank === 3) return <Crown size={22} fill="#CD7F32" style={{ color: "#CD7F32" }} />;
  return <span className="text-sm font-bold tabular-nums" style={{ color: "rgba(255,255,255,0.5)", minWidth: 24, textAlign: "center" }}>#{rank}</span>;
}

function ChangeIcon({ change }: { change: number }) {
  if (change > 0) return <span className="flex items-center text-xs" style={{ color: "#22c55e" }}><ChevronUp size={14} />{change}</span>;
  if (change < 0) return <span className="flex items-center text-xs" style={{ color: "#ef4444" }}><ChevronDown size={14} />{Math.abs(change)}</span>;
  return <Minus size={12} style={{ color: "rgba(255,255,255,0.3)" }} />;
}

export default function Leaderboard() {
  const [scope, setScope] = useState<Scope>("india");
  const [expanded, setExpanded] = useState<number | null>(null);

  const students = makeStudents(scope);

  const scopeLabel = scope === "college" ? "My College" : scope === "state" ? "State" : "All India";

  return (
    <div className="min-h-screen" style={{ background: "#0B0F1A", color: "#fff" }}>
      <div style={{ background: "linear-gradient(135deg,#0B0F1A,#0d0f1a)", borderBottom: "1px solid rgba(255,215,0,0.15)", padding: "48px 0 32px" }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ background: "rgba(255,215,0,0.12)", borderRadius: 12, padding: 10 }}>
              <Trophy size={28} style={{ color: "#FFD700" }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">College Leaderboards</h1>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>Weekly rankings · Earn points by learning</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Scope Toggle */}
        <div className="flex gap-2 p-1 rounded-xl w-fit" style={{ background: "rgba(255,255,255,0.06)" }}>
          {(["college", "state", "india"] as Scope[]).map(s => (
            <button key={s} onClick={() => setScope(s)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize"
              style={scope === s ? { background: "#FFD700", color: "#0B0F1A" } : { color: "rgba(255,255,255,0.6)" }}>
              {s === "college" ? "🏛 My College" : s === "state" ? "🗺 State" : "🇮🇳 All India"}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-3">
          {[students[1], students[0], students[2]].map((s, i) => {
            const pos = i === 0 ? 2 : i === 1 ? 1 : 3;
            const heights = [180, 220, 160];
            const colors = ["#C0C0C0", "#FFD700", "#CD7F32"];
            return (
              <motion.div key={s.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center rounded-2xl p-4 relative"
                style={{ background: "#161B2E", border: `1px solid ${colors[i]}30`, minHeight: heights[i] }}>
                <div className="absolute -top-3">
                  <RankBadge rank={pos} />
                </div>
                <img src={s.avatar} alt={s.name} className="w-16 h-16 rounded-full mt-4 mb-2 bg-gray-700" />
                <div className="font-semibold text-sm text-center line-clamp-1">{s.name}</div>
                <div className="text-xs text-center mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{s.college.split(" ")[0]}</div>
                <div className="text-lg font-bold" style={{ color: colors[i] }}>{s.points.toLocaleString()}</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>points</div>
                {s.streak > 7 && (
                  <div className="flex items-center gap-1 text-xs mt-1" style={{ color: "#ff8c00" }}>
                    <Flame size={11} />{s.streak}d
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Points breakdown legend */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "CME", color: "#007AFF" },
            { label: "Flashcards", color: "#8B5CF6" },
            { label: "Quizzes", color: "#22c55e" },
            { label: "Cases", color: "#f59e0b" },
          ].map(({ label, color }) => (
            <div key={label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: color }} />
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* My Rank */}
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "rgba(0,122,255,0.08)", border: "2px solid rgba(0,122,255,0.3)" }}>
          <div className="text-2xl font-bold" style={{ color: "#007AFF" }}>#{ME.rank}</div>
          <img src={ME.avatar} alt="You" className="w-12 h-12 rounded-full bg-gray-700" />
          <div className="flex-1">
            <div className="font-semibold">Your Rank</div>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{ME.points.toLocaleString()} points · {ME.streak}-day streak 🔥</div>
          </div>
          <ChangeIcon change={ME.change} />
        </div>

        {/* Full List */}
        <div className="space-y-2">
          {students.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{ background: "#161B2E", border: "1px solid rgba(255,255,255,0.06)" }}
              onClick={() => setExpanded(expanded === i ? null : i)}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 flex justify-center flex-shrink-0"><RankBadge rank={s.rank} /></div>
                <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{s.name}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{scope === "india" ? `${s.college}` : s.state}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {s.badges.map((b, j) => <span key={j} className="text-base">{b}</span>)}
                  <div className="text-right">
                    <div className="text-sm font-bold">{s.points.toLocaleString()}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>pts</div>
                  </div>
                  <ChangeIcon change={s.change} />
                </div>
              </div>
              {expanded === i && (
                <div className="px-4 pb-4 grid grid-cols-4 gap-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", paddingTop: 12 }}>
                  {[
                    { label: "CME", val: s.breakdown.cme, color: "#007AFF" },
                    { label: "Flashcards", val: s.breakdown.flashcards, color: "#8B5CF6" },
                    { label: "Quizzes", val: s.breakdown.quizzes, color: "#22c55e" },
                    { label: "Cases", val: s.breakdown.cases, color: "#f59e0b" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="rounded-lg p-2 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="text-sm font-semibold" style={{ color }}>{val}</div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
