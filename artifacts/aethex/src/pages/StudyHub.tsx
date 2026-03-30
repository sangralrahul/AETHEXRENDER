import { useState } from "react";
import { Link } from "wouter";
import { Star, ExternalLink, BookOpen, PlayCircle, CheckCircle2, Filter, Crown, GraduationCap, Award, Zap, Clock, Globe, Users } from "lucide-react";

const platforms = [
  {
    id: "prepladder",
    name: "PrepLadder",
    logo: "PL",
    color: "#FF6B35",
    tagline: "India's #1 NEET PG prep platform",
    monthlyPrice: 4999,
    annualPrice: 11999,
    rating: 4.7,
    reviews: 45200,
    exams: ["NEET PG", "NEXT", "FMGE", "INI-CET"],
    features: ["15,000+ HD video lectures", "50,000+ MCQs with explanations", "Live doubt sessions", "Revision notes & flashcards", "Grand tests & mocks", "Performance analytics"],
    pros: ["Best video quality", "Comprehensive coverage", "Strong faculty"],
    cons: ["Slightly expensive", "App can be slow"],
    link: "https://prepladder.com",
    badge: "Most Popular",
    badgeColor: "#FF6B35",
  },
  {
    id: "marrow",
    name: "Marrow",
    logo: "MA",
    color: "#6C63FF",
    tagline: "Smart learning for smarter doctors",
    monthlyPrice: 3999,
    annualPrice: 9999,
    rating: 4.6,
    reviews: 38700,
    exams: ["NEET PG", "INI-CET", "USMLE Step 1", "NEXT"],
    features: ["AI-powered adaptive learning", "12,000+ video lectures", "45,000+ MCQ bank", "Daily targets & streaks", "Peer comparison", "Image bank"],
    pros: ["Adaptive algorithm", "Great UI/UX", "Active community"],
    cons: ["Limited surgery content", "Costly annual plan"],
    link: "https://marrow.com",
    badge: "Best AI",
    badgeColor: "#6C63FF",
  },
  {
    id: "pwmed",
    name: "PW Med",
    logo: "PW",
    color: "#FF3F6C",
    tagline: "Physics Wallah enters medical with a bang",
    monthlyPrice: 1999,
    annualPrice: 5999,
    rating: 4.3,
    reviews: 21000,
    exams: ["NEET PG", "NEXT", "FMGE"],
    features: ["Affordable price plans", "Video lectures", "40,000+ MCQs", "PDF notes", "Live classes", "Batch courses"],
    pros: ["Very affordable", "Good for basics", "PW brand trust"],
    cons: ["Less comprehensive", "New platform", "Limited mock tests"],
    link: "https://physicswallah.live",
    badge: "Best Value",
    badgeColor: "#FF3F6C",
  },
  {
    id: "dams",
    name: "DAMS",
    logo: "DA",
    color: "#00B894",
    tagline: "Delhi Academy — trusted for decades",
    monthlyPrice: 3499,
    annualPrice: 8999,
    rating: 4.4,
    reviews: 29800,
    exams: ["NEET PG", "AIIMS PG", "PGI", "DNB CET"],
    features: ["Subject-wise modules", "Topic-wise tests", "Grand tests", "Previous year papers", "Printed material option", "Faculty support"],
    pros: ["Very experienced faculty", "Offline material", "PGI/AIIMS focus"],
    cons: ["Older UI", "Limited app features"],
    link: "https://damsdelhi.com",
    badge: "Most Trusted",
    badgeColor: "#00B894",
  },
  {
    id: "bhatia",
    name: "Bhatia Global",
    logo: "BG",
    color: "#FDCB6E",
    tagline: "Structured learning for aspirants",
    monthlyPrice: 2999,
    annualPrice: 7499,
    rating: 4.2,
    reviews: 14500,
    exams: ["NEET PG", "FMGE", "NEXT"],
    features: ["Video lectures", "MCQ bank", "Test series", "Revision notes", "Doubt clearing", "Mobile app"],
    pros: ["Good revision notes", "Affordable", "Consistent updates"],
    cons: ["Smaller faculty team", "Less mock tests"],
    link: "https://bhatiaglobal.com",
    badge: null,
    badgeColor: "",
  },
  {
    id: "amboss",
    name: "AMBOSS",
    logo: "AM",
    color: "#0984E3",
    tagline: "The gold standard for international exams",
    monthlyPrice: 3800,
    annualPrice: 12000,
    rating: 4.8,
    reviews: 67000,
    exams: ["USMLE Step 1", "USMLE Step 2", "NEXT", "FMGE"],
    features: ["Qbank: 5000+ vignettes", "Integrated knowledge library", "Self-assessment", "Anki deck integration", "Clinical case simulations", "Multi-language support"],
    pros: ["World-class quality", "Best for USMLE", "Detailed explanations"],
    cons: ["Expensive", "Less India-specific content", "Complex interface"],
    link: "https://amboss.com",
    badge: "Best for USMLE",
    badgeColor: "#0984E3",
  },
  {
    id: "lecturio",
    name: "Lecturio",
    logo: "LE",
    color: "#E17055",
    tagline: "Concept-based learning for global exams",
    monthlyPrice: 2500,
    annualPrice: 9500,
    rating: 4.4,
    reviews: 31200,
    exams: ["USMLE Step 1", "USMLE Step 2", "FMGE", "NEXT"],
    features: ["3000+ video lectures", "Qbank with 2500+ questions", "Spaced repetition system", "USMLE-style cases", "Mobile offline mode", "Progress tracking"],
    pros: ["Good video production", "Spaced repetition", "Global content"],
    cons: ["Less India-specific", "Limited live sessions"],
    link: "https://lecturio.com",
    badge: null,
    badgeColor: "",
  },
  {
    id: "osmosis",
    name: "Osmosis",
    logo: "OS",
    color: "#A29BFE",
    tagline: "Visual learning redefined",
    monthlyPrice: 2200,
    annualPrice: 8000,
    rating: 4.5,
    reviews: 48000,
    exams: ["USMLE Step 1", "USMLE Step 2", "FMGE"],
    features: ["Video + infographic style", "Flashcard system", "5000+ videos", "High-yield notes", "Integrated question bank", "Study planner"],
    pros: ["Beautiful visuals", "Excellent for basic sciences", "Great for visual learners"],
    cons: ["Less clinical focus", "Not NEET PG specific"],
    link: "https://osmosis.org",
    badge: null,
    badgeColor: "",
  },
  {
    id: "sketchy",
    name: "Sketchy Medical",
    logo: "SK",
    color: "#FD79A8",
    tagline: "Memory through storytelling & imagery",
    monthlyPrice: 2400,
    annualPrice: 8500,
    rating: 4.6,
    reviews: 27000,
    exams: ["USMLE Step 1", "USMLE Step 2"],
    features: ["Story-based video mnemonics", "Micro/Pharm/Path coverage", "800+ videos", "Active recall exercises", "Community notes", "Mobile app"],
    pros: ["Unforgettable retention", "Best for micro/pharm", "Unique approach"],
    cons: ["Not India-specific", "Only for USMLE", "Can feel gimmicky"],
    link: "https://sketchy.com",
    badge: null,
    badgeColor: "",
  },
  {
    id: "najeeb",
    name: "Dr. Najeeb",
    logo: "DN",
    color: "#00CEC9",
    tagline: "The professor everyone loves",
    monthlyPrice: 1200,
    annualPrice: 4500,
    rating: 4.7,
    reviews: 82000,
    exams: ["USMLE Step 1", "MBBS basics", "Basic sciences"],
    features: ["1800+ hours of video", "Basic sciences deep dives", "Anatomy, physiology, biochem", "Pathology lectures", "Lifetime access option", "Most detailed explanations"],
    pros: ["Best basic science explanations", "Very affordable", "Legendary teaching"],
    cons: ["No question bank", "Not updated frequently", "Not for clinical exams"],
    link: "https://drnajeeblectures.com",
    badge: "Best Basics",
    badgeColor: "#00CEC9",
  },
];

const examFilters = ["All", "NEET PG", "NEXT", "FMGE", "USMLE Step 1", "USMLE Step 2", "INI-CET", "AIIMS PG"];

const youtubeChannels = [
  { name: "Dr. Najeeb Lectures", subs: "1.8M", topic: "Basic Sciences", url: "https://youtube.com/@drnajeeb", badge: "Must Watch" },
  { name: "PrepLadder NEET PG", subs: "1.2M", topic: "NEET PG All Subjects", url: "https://youtube.com/@prepladder", badge: "" },
  { name: "Marrow NEET PG", subs: "890K", topic: "Clinical Sciences", url: "https://youtube.com/@marrow", badge: "" },
  { name: "Medicosis Perfectionalis", subs: "730K", topic: "Pathophysiology", url: "https://youtube.com", badge: "" },
  { name: "Armando Hasudungan", subs: "1.1M", topic: "Biology & Physiology", url: "https://youtube.com", badge: "" },
  { name: "Dirty Medicine", subs: "630K", topic: "USMLE Step 1", url: "https://youtube.com", badge: "" },
];

const medicalBooks = [
  { title: "Harrison's Principles of Internal Medicine", authors: "Fauci, Kasper, Longo", category: "Medicine", price: 4800, link: "/shop?search=harrison" },
  { title: "Gray's Anatomy for Students", authors: "Drake, Vogl, Mitchell", category: "Anatomy", price: 2200, link: "/shop?search=gray+anatomy" },
  { title: "Robbins & Cotran Pathological Basis of Disease", authors: "Kumar, Abbas, Aster", category: "Pathology", price: 3600, link: "/shop?search=robbins" },
  { title: "Goodman & Gilman's Pharmacology", authors: "Brunton, Hilal-Dandan", category: "Pharmacology", price: 3200, link: "/shop?search=goodman+pharmacology" },
  { title: "Bailey & Love's Surgery", authors: "Williams, O'Connell, McCaskie", category: "Surgery", price: 2900, link: "/shop?search=bailey+love" },
  { title: "Williams Obstetrics", authors: "Cunningham et al.", category: "OBG", price: 2600, link: "/shop?search=williams+obstetrics" },
];

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(s => (
          <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? "text-amber-400 fill-current" : "text-white/20"}`} viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-white">{rating}</span>
      <span className="text-xs text-white/30">({count.toLocaleString()})</span>
    </div>
  );
}

export default function StudyHub() {
  const [examFilter, setExamFilter] = useState("All");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const filtered = examFilter === "All"
    ? platforms
    : platforms.filter(p => p.exams.includes(examFilter));

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(prev => prev.filter(i => i !== id));
    } else if (compareIds.length < 3) {
      setCompareIds(prev => [...prev, id]);
    }
  };

  const comparePlatforms = platforms.filter(p => compareIds.includes(p.id));

  return (
    <div className="min-h-screen pt-[72px] bg-[#0D1117]">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00C2A8]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C2A8]/15 border border-[#00C2A8]/30 text-[#00C2A8] text-sm font-semibold mb-6">
            <GraduationCap className="w-4 h-4" />
            AETHEX STUDY HUB
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-5 leading-tight">
            Your Medical Exam<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00C2A8] to-[#00E5D0]">Prep Guide</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            Compare top coaching platforms, discover essential books, and access free YouTube resources — all in one place for NEET PG, NEXT, FMGE, and USMLE.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              { icon: Users, label: "10+ Platforms Compared" },
              { icon: Award, label: "Real Student Reviews" },
              { icon: Zap, label: "Updated 2026" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/50">
                <item.icon className="w-4 h-4 text-[#00C2A8]" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare Bar */}
      {compareIds.length > 0 && (
        <div className="sticky top-[72px] z-40 bg-[#161B22] border-b border-[#00C2A8]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <CheckCircle2 className="w-4 h-4 text-[#00C2A8]" />
              <span>{compareIds.length}/3 platforms selected</span>
              <span className="text-white/30">{comparePlatforms.map(p => p.name).join(", ")}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setCompareIds([])} className="text-sm text-white/40 hover:text-white transition-colors">Clear</button>
              <button onClick={() => setShowCompare(true)}
                className="px-4 py-2 bg-[#00C2A8] text-[#0D1117] text-sm font-bold rounded-lg hover:bg-[#00D4B8] transition-colors">
                Compare {compareIds.length} Platforms
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && comparePlatforms.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCompare(false)} />
          <div className="relative w-full max-w-5xl bg-[#161B22] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/8 flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-white">Platform Comparison</h3>
              <button onClick={() => setShowCompare(false)} className="p-2 text-white/40 hover:text-white hover:bg-white/8 rounded-lg transition-all">✕</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="p-4 text-left text-sm text-white/40 font-medium">Feature</th>
                    {comparePlatforms.map(p => (
                      <th key={p.id} className="p-4 text-center">
                        <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: p.color + "33", border: `1px solid ${p.color}55` }}>
                          {p.logo}
                        </div>
                        <span className="text-white font-semibold text-sm">{p.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Rating", key: "rating", render: (p: typeof platforms[0]) => <StarRating rating={p.rating} count={p.reviews} /> },
                    { label: "Monthly Price", key: "price", render: (p: typeof platforms[0]) => <span className="text-white font-semibold">₹{p.monthlyPrice.toLocaleString()}</span> },
                    { label: "Annual Price", key: "annual", render: (p: typeof platforms[0]) => <span className="text-[#00C2A8] font-semibold">₹{p.annualPrice.toLocaleString()}</span> },
                    { label: "Exams Covered", key: "exams", render: (p: typeof platforms[0]) => <div className="flex flex-wrap gap-1 justify-center">{p.exams.map(e => <span key={e} className="px-2 py-0.5 bg-white/8 rounded text-xs text-white/70">{e}</span>)}</div> },
                  ].map(row => (
                    <tr key={row.key} className="border-b border-white/5">
                      <td className="p-4 text-sm text-white/50">{row.label}</td>
                      {comparePlatforms.map(p => (
                        <td key={p.id} className="p-4 text-center">{row.render(p)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Platforms Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-1">Coaching Platforms</h2>
              <p className="text-white/50 text-sm">Compare India's top medical coaching platforms side by side</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Filter className="w-4 h-4" />
              <span>Filter by exam:</span>
            </div>
          </div>

          {/* Exam Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {examFilters.map(exam => (
              <button key={exam} onClick={() => setExamFilter(exam)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  examFilter === exam
                    ? "bg-[#00C2A8] text-[#0D1117]"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                }`}>
                {exam}
              </button>
            ))}
          </div>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map(platform => (
              <div key={platform.id} className={`bg-[#161B22] border rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 ${
                compareIds.includes(platform.id) ? "border-[#00C2A8]/50 shadow-[#00C2A8]/10" : "border-white/8"
              }`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                        style={{ background: platform.color + "25", border: `1.5px solid ${platform.color}45` }}>
                        <span style={{ color: platform.color }}>{platform.logo}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-display font-bold text-white">{platform.name}</h3>
                          {platform.badge && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                              style={{ background: platform.badgeColor + "30", border: `1px solid ${platform.badgeColor}50`, color: platform.badgeColor }}>
                              {platform.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/50">{platform.tagline}</p>
                        <StarRating rating={platform.rating} count={platform.reviews} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-white">₹{platform.monthlyPrice.toLocaleString()}<span className="text-xs text-white/40">/mo</span></div>
                      <div className="text-sm text-[#00C2A8]">₹{platform.annualPrice.toLocaleString()}<span className="text-xs text-white/40">/yr</span></div>
                    </div>
                  </div>

                  {/* Exams */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {platform.exams.map(exam => (
                      <span key={exam} className="px-2 py-0.5 bg-white/6 border border-white/8 rounded-lg text-xs text-white/60">{exam}</span>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-1.5 mb-5">
                    {platform.features.slice(0, 4).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                        <CheckCircle2 className="w-3 h-3 text-[#00C2A8] shrink-0" />
                        {feat}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <a href={platform.link} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#00C2A8]/15 border border-[#00C2A8]/30 text-[#00C2A8] text-sm font-semibold rounded-xl hover:bg-[#00C2A8]/25 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      Visit Platform
                    </a>
                    <button onClick={() => toggleCompare(platform.id)}
                      className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all border ${
                        compareIds.includes(platform.id)
                          ? "bg-[#00C2A8]/20 border-[#00C2A8]/50 text-[#00C2A8]"
                          : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10"
                      } ${compareIds.length >= 3 && !compareIds.includes(platform.id) ? "opacity-40 cursor-not-allowed" : ""}`}
                      disabled={compareIds.length >= 3 && !compareIds.includes(platform.id)}>
                      {compareIds.includes(platform.id) ? "✓ Selected" : "Compare"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-1">Essential Medical Books</h2>
              <p className="text-white/50 text-sm">Standard textbooks trusted by top medical institutions</p>
            </div>
            <Link href="/shop?category=books" className="text-sm text-[#00C2A8] hover:underline flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Browse all books
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {medicalBooks.map((book, i) => (
              <Link key={i} href={book.link}
                className="flex items-start gap-4 p-5 bg-[#161B22] border border-white/8 rounded-2xl hover:border-[#00C2A8]/30 hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-16 bg-gradient-to-br from-[#00C2A8]/20 to-blue-500/20 border border-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-[#00C2A8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm leading-snug mb-1 line-clamp-2">{book.title}</h4>
                  <p className="text-xs text-white/40 mb-2">{book.authors}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-white/6 rounded text-xs text-white/50">{book.category}</span>
                    <span className="text-sm font-bold text-[#00C2A8]">₹{book.price.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Resources */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-display font-bold text-white mb-1">Free YouTube Resources</h2>
            <p className="text-white/50 text-sm">Top medical YouTube channels for learning — completely free</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {youtubeChannels.map((channel, i) => (
              <a key={i} href={channel.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#161B22] border border-white/8 rounded-2xl hover:border-red-500/30 hover:-translate-y-0.5 transition-all group">
                <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center shrink-0">
                  <PlayCircle className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white text-sm truncate">{channel.name}</h4>
                    {channel.badge && (
                      <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400 text-xs font-bold shrink-0">{channel.badge}</span>
                    )}
                  </div>
                  <p className="text-xs text-white/40">{channel.topic}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="w-3 h-3 text-white/30" />
                    <span className="text-xs text-white/30">{channel.subs} subscribers</span>
                  </div>
                </div>
                <Globe className="w-4 h-4 text-white/20 group-hover:text-red-400 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Cadus AI CTA */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#161B22] to-[#0D1117] border border-[#00C2A8]/20 rounded-2xl p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#00C2A8]/15 border border-[#00C2A8]/30 flex items-center justify-center mx-auto mb-6">
              <Crown className="w-8 h-8 text-[#00C2A8]" />
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Supercharge your prep with Cadus AI
            </h3>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Generate MCQs, get DDx lists, analyze lab values, and get instant clinical references — all powered by AI specialized for Indian medical education.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/ai-assistant"
                className="px-8 py-3 bg-[#00C2A8] text-[#0D1117] font-bold rounded-xl hover:bg-[#00D4B8] transition-all">
                Try Cadus AI Free
              </Link>
              <Link href="/account"
                className="px-8 py-3 bg-white/5 border border-white/15 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                View Pro Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
