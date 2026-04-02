import { useState } from "react";
import { Link, useParams } from "wouter";
import { Search, ArrowLeft, ChevronRight } from "lucide-react";
import { getDepartmentBySlug } from "@/data/medicalDepartments";
import { BreadcrumbNav } from "@/components/MedKnowledge/BreadcrumbNav";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const severityConfig: Record<string, { bg: string; color: string }> = {
  Mild: { bg: "rgba(35,134,54,0.12)", color: "#238636" },
  Moderate: { bg: "rgba(227,179,65,0.12)", color: "#E3B341" },
  Severe: { bg: "rgba(249,115,22,0.12)", color: "#F97316" },
  Critical: { bg: "rgba(248,81,73,0.12)", color: "#F85149" },
};

export default function DepartmentPage() {
  const params = useParams<{ deptSlug: string }>();
  const dept = getDepartmentBySlug(params.deptSlug || "");
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("All");

  if (!dept) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D1117" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#E6EDF3" }}>Department not found</h1>
          <Link href={`${BASE}/study-hub/medical-knowledge-hub`} style={{ color: "#00C2A8" }}>← Back to Hub</Link>
        </div>
      </div>
    );
  }

  const filtered = dept.conditions.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.icd10.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "All" || c.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  return (
    <div className="min-h-screen" style={{ background: "#0D1117" }}>
      {/* Hero */}
      <div className="border-b" style={{ borderColor: "#21262D", background: "#161B22" }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <BreadcrumbNav crumbs={[
            { label: "Study Hub", href: `${BASE}/study-hub` },
            { label: "Knowledge Hub", href: `${BASE}/study-hub/medical-knowledge-hub` },
            { label: "Departments", href: `${BASE}/study-hub/medical-knowledge-hub/departments` },
            { label: dept.name },
          ]} />
          <Link href={`${BASE}/study-hub/medical-knowledge-hub`}
            className="flex items-center gap-2 text-sm mt-4 mb-6 hover:opacity-80" style={{ color: "#8B949E" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </Link>
          <div className="flex items-start gap-5">
            <div className="text-5xl">{dept.icon}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#E6EDF3" }}>{dept.name}</h1>
              <p className="text-base mb-4 leading-relaxed" style={{ color: "#8B949E", maxWidth: 700 }}>{dept.description}</p>
              <div className="flex flex-wrap gap-4 text-sm" style={{ color: "#8B949E" }}>
                <span>{dept.conditions.length} conditions</span>
                <span style={{ color: "#238636" }}>{dept.conditions.filter(c => c.severity === "Mild").length} Mild</span>
                <span style={{ color: "#E3B341" }}>{dept.conditions.filter(c => c.severity === "Moderate").length} Moderate</span>
                <span style={{ color: "#F97316" }}>{dept.conditions.filter(c => c.severity === "Severe").length} Severe</span>
                <span style={{ color: "#F85149" }}>{dept.conditions.filter(c => c.severity === "Critical").length} Critical</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8B949E" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${dept.conditions.length} conditions...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "#161B22", border: "1px solid #21262D", color: "#E6EDF3" }} />
          </div>
          <div className="flex gap-2">
            {["All", "Mild", "Moderate", "Severe", "Critical"].map(s => (
              <button key={s} onClick={() => setSeverityFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: severityFilter === s ? (s === "All" ? "#00C2A8" : severityConfig[s]?.bg) : "#21262D",
                  color: severityFilter === s ? (s === "All" ? "#0D1117" : severityConfig[s]?.color) : "#8B949E",
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm mb-4" style={{ color: "#8B949E" }}>
          {filtered.length} condition{filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
          {severityFilter !== "All" && ` · ${severityFilter}`}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(condition => {
            const sev = severityConfig[condition.severity];
            return (
              <Link key={condition.slug} href={`${BASE}/study-hub/medical-knowledge-hub/departments/${dept.slug}/${condition.slug}`}
                className="group rounded-xl border p-4 transition-all duration-200 cursor-pointer"
                style={{ background: "#161B22", borderColor: "#21262D" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#00C2A8";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(0,194,168,0.12)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#21262D";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "#21262D", color: "#00C2A8" }}>{condition.icd10}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: sev.bg, color: sev.color }}>{condition.severity}</span>
                    </div>
                    <h3 className="font-semibold text-sm leading-tight" style={{ color: "#E6EDF3" }}>{condition.name}</h3>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" style={{ color: "#00C2A8" }} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#8B949E" }}>{condition.description}</p>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: "#8B949E" }}>
            No conditions found for "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
