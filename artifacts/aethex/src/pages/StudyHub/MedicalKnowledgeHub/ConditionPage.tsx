import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, Bookmark, BookmarkCheck, AlertCircle, RefreshCw, Stethoscope, FlaskConical, Pill, Shield, Users, BookOpen, FileText } from "lucide-react";
import { getConditionBySlug } from "@/data/medicalDepartments";
import { BreadcrumbNav } from "@/components/MedKnowledge/BreadcrumbNav";
import { SectionLoader } from "@/components/MedKnowledge/SectionLoader";
import { MCQQuiz } from "@/components/MedKnowledge/MCQQuiz";
import { FlashCard } from "@/components/MedKnowledge/FlashCard";
import { DiagramCarousel } from "@/components/MedKnowledge/DiagramCarousel";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API_BASE = BASE.replace(/\/[^/]*$/, "");

const severityConfig: Record<string, { bg: string; color: string; label: string }> = {
  Mild: { bg: "rgba(35,134,54,0.12)", color: "#238636", label: "Mild" },
  Moderate: { bg: "rgba(227,179,65,0.12)", color: "#E3B341", label: "Moderate" },
  Severe: { bg: "rgba(249,115,22,0.12)", color: "#F97316", label: "Severe" },
  Critical: { bg: "rgba(248,81,73,0.12)", color: "#F85149", label: "Critical" },
};

function useIntersection(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function useMedContent(section: string, params: Record<string, string>, eager = false) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetched = useRef(false);

  const fetch_ = useCallback(async () => {
    if (fetched.current && content) return;
    const cacheKey = `mkc_${section}_${JSON.stringify(params)}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) { setContent(cached); return; }
    fetched.current = true;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${API_BASE}/api/med-knowledge/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, ...params }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      sessionStorage.setItem(cacheKey, data.content);
      setContent(data.content);
    } catch {
      setError(true);
      fetched.current = false;
    } finally {
      setLoading(false);
    }
  }, [section, JSON.stringify(params)]);

  useEffect(() => { if (eager) fetch_(); }, [eager]);

  return { content, loading, error, fetch: fetch_ };
}

function SectionBlock({ title, icon, content, loading, error, onRetry }: {
  title: string; icon: React.ReactNode; content: string | null;
  loading: boolean; error: boolean; onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border" style={{ background: "#161B22", borderColor: "#21262D" }}>
      <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "#21262D" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(0,194,168,0.1)", color: "#00C2A8" }}>
          {icon}
        </div>
        <h3 className="font-bold text-base" style={{ color: "#E6EDF3" }}>{title}</h3>
      </div>
      <div className="px-6 py-5">
        {loading && <SectionLoader lines={6} />}
        {error && (
          <div className="flex items-center gap-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "#F85149" }} />
            <span className="text-sm" style={{ color: "#8B949E" }}>Content unavailable.</span>
            <button onClick={onRetry} className="flex items-center gap-1 text-sm" style={{ color: "#00C2A8" }}>
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}
        {content && !loading && (
          <div className="text-sm leading-relaxed" style={{ color: "#E6EDF3" }}
            dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, "<strong style='color:#00C2A8'>$1</strong>").replace(/\n/g, "<br/>") }} />
        )}
      </div>
    </div>
  );
}

function LazyBlock({ section, params, title, icon }: {
  section: string; params: Record<string, string>; title: string; icon: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersection(ref as React.RefObject<HTMLElement>);
  const { content, loading, error, fetch: fetchContent } = useMedContent(section, params, false);

  useEffect(() => { if (visible && !content && !loading) fetchContent(); }, [visible]);

  return (
    <div ref={ref}>
      <SectionBlock title={title} icon={icon} content={content} loading={loading} error={error} onRetry={fetchContent} />
    </div>
  );
}

export default function ConditionPage() {
  const params = useParams<{ deptSlug: string; conditionSlug: string }>();
  const result = getConditionBySlug(params.deptSlug || "", params.conditionSlug || "");
  const [activeTab, setActiveTab] = useState<"overview"|"management"|"exam"|"flashcards">("overview");
  const [saved, setSaved] = useState(() => {
    const list = JSON.parse(localStorage.getItem("aethex_study_list") || "[]");
    return list.includes(`${params.deptSlug}/${params.conditionSlug}`);
  });

  const apiParams = result ? { conditionName: result.condition.name, department: result.dept.name } : {};
  const overview = useMedContent("overview", apiParams, !!result);
  const etiology = useMedContent("etiology", apiParams, !!result);
  const clinicalFeatures = useMedContent("clinical_features", apiParams, !!result);
  const pathophysiology = useMedContent("pathophysiology", apiParams, false);
  const investigations = useMedContent("investigations", apiParams, false);
  const diagnosis = useMedContent("diagnosis", apiParams, false);
  const treatment = useMedContent("treatment", apiParams, false);
  const prognosis = useMedContent("prognosis", apiParams, false);
  const prevention = useMedContent("prevention", apiParams, false);
  const specialPop = useMedContent("special_populations", apiParams, false);
  const mcqData = useMedContent("mcq", apiParams, false);
  const flashData = useMedContent("flashcards", apiParams, false);

  const handleSave = () => {
    const list = JSON.parse(localStorage.getItem("aethex_study_list") || "[]");
    const key = `${params.deptSlug}/${params.conditionSlug}`;
    const updated = saved ? list.filter((x: string) => x !== key) : [...list, key];
    localStorage.setItem("aethex_study_list", JSON.stringify(updated));
    setSaved(!saved);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D1117" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#E6EDF3" }}>Condition not found</h1>
          <Link href={`${BASE}/study-hub/medical-knowledge-hub`} style={{ color: "#00C2A8" }}>← Back to Hub</Link>
        </div>
      </div>
    );
  }

  const { dept, condition } = result;
  const sev = severityConfig[condition.severity];

  const parseMCQs = (raw: string) => {
    try { return JSON.parse(raw.replace(/```json\n?|```\n?/g, "").trim()); } catch { return null; }
  };
  const parseFlashcards = (raw: string) => {
    try { return JSON.parse(raw.replace(/```json\n?|```\n?/g, "").trim()); } catch { return null; }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0D1117" }}>
      {/* Hero */}
      <div className="border-b" style={{ borderColor: "#21262D", background: "#161B22" }}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <BreadcrumbNav crumbs={[
            { label: "Study Hub", href: `${BASE}/study-hub` },
            { label: "Knowledge Hub", href: `${BASE}/study-hub/medical-knowledge-hub` },
            { label: dept.name, href: `${BASE}/study-hub/medical-knowledge-hub/departments/${dept.slug}` },
            { label: condition.name },
          ]} />
          <Link href={`${BASE}/study-hub/medical-knowledge-hub/departments/${dept.slug}`}
            className="flex items-center gap-2 text-sm mt-4 mb-5 hover:opacity-80" style={{ color: "#8B949E" }}>
            <ArrowLeft className="w-4 h-4" /> Back to {dept.name}
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2.5 py-1 rounded font-bold" style={{ background: "#21262D", color: "#00C2A8" }}>{condition.icd10}</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(0,194,168,0.1)", color: "#00C2A8" }}>{dept.icon} {dept.name}</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: sev.bg, color: sev.color }}>{sev.label}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#E6EDF3" }}>{condition.name}</h1>
              <p className="text-sm leading-relaxed" style={{ color: "#8B949E", maxWidth: 600 }}>{condition.description}</p>
            </div>
            <button onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0"
              style={{ background: saved ? "rgba(0,194,168,0.1)" : "#21262D", color: saved ? "#00C2A8" : "#8B949E", border: `1px solid ${saved ? "#00C2A8" : "#21262D"}` }}>
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mt-6 border-b" style={{ borderColor: "#21262D" }}>
            {[
              ["overview", "Overview"],
              ["management", "Full Management"],
              ["exam", "MCQ Practice"],
              ["flashcards", "Flashcards"],
            ].map(([t, label]) => (
              <button key={t} onClick={() => setActiveTab(t as any)}
                className="px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px"
                style={{
                  color: activeTab === t ? "#00C2A8" : "#8B949E",
                  borderBottomColor: activeTab === t ? "#00C2A8" : "transparent",
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Overview */}
            <SectionBlock title="Overview & Epidemiology" icon={<BookOpen className="w-4 h-4" />}
              content={overview.content} loading={overview.loading} error={overview.error} onRetry={overview.fetch} />

            {/* Diagrams */}
            <div className="rounded-xl border" style={{ background: "#161B22", borderColor: "#21262D" }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: "#21262D" }}>
                <h3 className="font-bold text-base" style={{ color: "#E6EDF3" }}>Medical Diagrams</h3>
              </div>
              <div className="px-6 py-5">
                <DiagramCarousel conditionSlug={condition.slug} deptSlug={dept.slug} />
              </div>
            </div>

            {/* Etiology */}
            <SectionBlock title="Etiology & Risk Factors" icon={<AlertCircle className="w-4 h-4" />}
              content={etiology.content} loading={etiology.loading} error={etiology.error} onRetry={etiology.fetch} />

            {/* Clinical Features */}
            <SectionBlock title="Clinical Features" icon={<Stethoscope className="w-4 h-4" />}
              content={clinicalFeatures.content} loading={clinicalFeatures.loading} error={clinicalFeatures.error} onRetry={clinicalFeatures.fetch} />

            {/* Pathophysiology — lazy */}
            <LazyBlock section="pathophysiology" params={apiParams} title="Pathophysiology" icon={<FlaskConical className="w-4 h-4" />} />

            {/* Investigations — lazy */}
            <LazyBlock section="investigations" params={apiParams} title="Investigations" icon={<FileText className="w-4 h-4" />} />

            {/* Diagnosis — lazy */}
            <LazyBlock section="diagnosis" params={apiParams} title="Diagnosis & Diagnostic Criteria" icon={<BookOpen className="w-4 h-4" />} />
          </div>
        )}

        {activeTab === "management" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold" style={{ color: "#E6EDF3" }}>Complete Management Protocol</h2>
            <SectionBlock title="Treatment & Management" icon={<Pill className="w-4 h-4" />}
              content={treatment.content} loading={treatment.loading} error={treatment.error} onRetry={treatment.fetch} />
            <SectionBlock title="Prognosis & Complications" icon={<BarChart2Wrapper />}
              content={prognosis.content} loading={prognosis.loading} error={prognosis.error} onRetry={prognosis.fetch} />
            <SectionBlock title="Prevention" icon={<Shield className="w-4 h-4" />}
              content={prevention.content} loading={prevention.loading} error={prevention.error} onRetry={prevention.fetch} />
            <SectionBlock title="Special Populations" icon={<Users className="w-4 h-4" />}
              content={specialPop.content} loading={specialPop.loading} error={specialPop.error} onRetry={specialPop.fetch} />
          </div>
        )}

        {activeTab === "exam" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "#E6EDF3" }}>Exam Corner — MCQ Practice</h2>
              <p className="text-sm mb-6" style={{ color: "#8B949E" }}>NEET-PG / USMLE Style with Clinical Vignettes</p>
            </div>
            {!mcqData.content && !mcqData.loading && !mcqData.error && (
              <div className="text-center py-12 rounded-xl border" style={{ borderColor: "#21262D", background: "#161B22" }}>
                <p className="text-base mb-4" style={{ color: "#8B949E" }}>Test your knowledge on {condition.name}</p>
                <button onClick={mcqData.fetch} className="px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90" style={{ background: "#00C2A8", color: "#0D1117" }}>
                  Generate 8 MCQs with AI
                </button>
              </div>
            )}
            {mcqData.loading && (
              <div className="text-center py-12 rounded-xl border" style={{ borderColor: "#21262D", background: "#161B22" }}>
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "#00C2A8", borderTopColor: "transparent" }} />
                <p className="text-sm" style={{ color: "#8B949E" }}>Generating clinical MCQs...</p>
              </div>
            )}
            {mcqData.error && (
              <div className="text-center py-8 rounded-xl border" style={{ borderColor: "#21262D", background: "#161B22" }}>
                <button onClick={mcqData.fetch} className="text-sm" style={{ color: "#00C2A8" }}>Retry</button>
              </div>
            )}
            {mcqData.content && (() => {
              const questions = parseMCQs(mcqData.content);
              return questions ? <MCQQuiz questions={questions} topic={condition.name} /> : (
                <pre className="text-xs p-4 whitespace-pre-wrap" style={{ color: "#8B949E" }}>{mcqData.content}</pre>
              );
            })()}
          </div>
        )}

        {activeTab === "flashcards" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "#E6EDF3" }}>Quick Revision Flashcards</h2>
              <p className="text-sm mb-6" style={{ color: "#8B949E" }}>Key facts, DOC, gold standard, mnemonics</p>
            </div>
            {!flashData.content && !flashData.loading && !flashData.error && (
              <div className="text-center py-12 rounded-xl border" style={{ borderColor: "#21262D", background: "#161B22" }}>
                <p className="text-base mb-4" style={{ color: "#8B949E" }}>Generate flashcards for {condition.name}</p>
                <button onClick={flashData.fetch} className="px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90" style={{ background: "#00C2A8", color: "#0D1117" }}>
                  Generate 12 Flashcards
                </button>
              </div>
            )}
            {flashData.loading && (
              <div className="text-center py-12 rounded-xl border" style={{ borderColor: "#21262D", background: "#161B22" }}>
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "#00C2A8", borderTopColor: "transparent" }} />
                <p className="text-sm" style={{ color: "#8B949E" }}>Generating flashcards...</p>
              </div>
            )}
            {flashData.error && (
              <div className="text-center py-8">
                <button onClick={flashData.fetch} className="text-sm" style={{ color: "#00C2A8" }}>Retry</button>
              </div>
            )}
            {flashData.content && (() => {
              const cards = parseFlashcards(flashData.content);
              return cards ? <FlashCard cards={cards} /> : (
                <div className="text-xs p-4 rounded-xl border" style={{ borderColor: "#21262D", color: "#8B949E" }}>{flashData.content}</div>
              );
            })()}
          </div>
        )}
      </div>

      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90 shadow-lg"
        style={{ background: "#00C2A8", color: "#0D1117" }}>
        ↑
      </button>
    </div>
  );
}

function BarChart2Wrapper() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}
