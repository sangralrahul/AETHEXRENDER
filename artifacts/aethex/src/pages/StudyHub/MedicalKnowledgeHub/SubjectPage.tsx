import { useState } from "react";
import { Link, useParams } from "wouter";
import { Search, Clock, BarChart2, ChevronRight, ArrowLeft } from "lucide-react";
import { getSubjectBySlug } from "@/data/medicalSubjects";
import { BreadcrumbNav } from "@/components/MedKnowledge/BreadcrumbNav";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const diffColor: Record<string, string> = {
  Basic: "#238636",
  Intermediate: "#E3B341",
  Advanced: "#F85149",
};

export default function SubjectPage() {
  const params = useParams<{ subjectSlug: string }>();
  const subject = getSubjectBySlug(params.subjectSlug || "");
  const [search, setSearch] = useState("");

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D1117" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#E6EDF3" }}>Subject not found</h1>
          <Link href={`${BASE}/study-hub/medical-knowledge-hub`} style={{ color: "#00C2A8" }}>← Back to Hub</Link>
        </div>
      </div>
    );
  }

  const filtered = subject.topics.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen" style={{ background: "#0D1117" }}>
      {/* Hero */}
      <div className="relative border-b overflow-hidden" style={{ borderColor: "#21262D" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(13,17,23,0.96) 0%, rgba(22,27,34,0.94) 100%)" }} />
        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
          <BreadcrumbNav crumbs={[
            { label: "Study Hub", href: `${BASE}/study-hub` },
            { label: "Medical Knowledge Hub", href: `${BASE}/study-hub/medical-knowledge-hub` },
            { label: subject.name },
          ]} />
          <Link href={`${BASE}/study-hub/medical-knowledge-hub`}
            className="flex items-center gap-2 text-sm mt-4 mb-6 transition-all hover:opacity-80" style={{ color: "#8B949E" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </Link>
          <div className="flex items-start gap-5">
            <div className="text-5xl">{subject.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold" style={{ color: "#E6EDF3" }}>{subject.name}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(0,194,168,0.1)", border: "1px solid rgba(0,194,168,0.3)", color: "#00C2A8" }}>
                  {subject.category}
                </span>
              </div>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#8B949E", maxWidth: 700 }}>{subject.description}</p>
              <div className="flex flex-wrap gap-4 text-sm" style={{ color: "#8B949E" }}>
                <span className="flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5" style={{ color: "#00C2A8" }} />{subject.topics.length} Topics</span>
                <span className="flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5" style={{ color: "#00C2A8" }} />{subject.topics.filter(t => t.difficulty === "Basic").length} Basic</span>
                <span className="flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5" style={{ color: "#00C2A8" }} />{subject.topics.filter(t => t.difficulty === "Intermediate").length} Intermediate</span>
                <span className="flex items-center gap-1"><ChevronRight className="w-3.5 h-3.5" style={{ color: "#00C2A8" }} />{subject.topics.filter(t => t.difficulty === "Advanced").length} Advanced</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8B949E" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${subject.topics.length} topics...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "#161B22", border: "1px solid #21262D", color: "#E6EDF3" }} />
        </div>

        {/* Topic count */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: "#8B949E" }}>
            {filtered.length} topic{filtered.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(topic => (
            <Link key={topic.slug} href={`${BASE}/study-hub/medical-knowledge-hub/subjects/${subject.slug}/${topic.slug}`}
              className="group rounded-xl border p-5 transition-all duration-200 cursor-pointer"
              style={{ background: "#161B22", borderColor: "#21262D" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#00C2A8";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(0,194,168,0.12)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#21262D";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-sm leading-tight" style={{ color: "#E6EDF3" }}>{topic.name}</h3>
                <ChevronRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#00C2A8" }} />
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1" style={{ color: "#8B949E" }}>
                  <Clock className="w-3 h-3" /> {topic.readTime} min
                </span>
                <span className="flex items-center gap-1">
                  <BarChart2 className="w-3 h-3" style={{ color: diffColor[topic.difficulty] }} />
                  <span style={{ color: diffColor[topic.difficulty] }}>{topic.difficulty}</span>
                </span>
              </div>
              {topic.relatedConditions && topic.relatedConditions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {topic.relatedConditions.slice(0, 2).map(c => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#21262D", color: "#8B949E" }}>{c}</span>
                  ))}
                  {topic.relatedConditions.length > 2 && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#21262D", color: "#8B949E" }}>+{topic.relatedConditions.length - 2}</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: "#8B949E" }}>
            No topics found for "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
