import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, Clock, BarChart2, Bookmark, BookmarkCheck,
  ChevronDown, ChevronUp, AlertCircle, RefreshCw, Stethoscope
} from "lucide-react";
import { getTopicBySlug } from "@/data/medicalSubjects";
import { BreadcrumbNav } from "@/components/MedKnowledge/BreadcrumbNav";
import { SectionLoader } from "@/components/MedKnowledge/SectionLoader";
import { MCQQuiz } from "@/components/MedKnowledge/MCQQuiz";
import { FlashCard } from "@/components/MedKnowledge/FlashCard";
import { DiagramCarousel } from "@/components/MedKnowledge/DiagramCarousel";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API_BASE = BASE.replace(/\/[^/]*$/, "");

const diffColor: Record<string, string> = {
  Basic: "#238636", Intermediate: "#E3B341", Advanced: "#F85149",
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
    if (fetched.current) return;
    const cacheKey = `mk_${section}_${JSON.stringify(params)}`;
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

function AccordionSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#21262D" }}>
      <button className="w-full flex items-center justify-between px-6 py-4 text-left transition-all hover:bg-white/5"
        style={{ background: "#161B22" }} onClick={() => setOpen(o => !o)}>
        <span className="font-semibold" style={{ color: "#E6EDF3" }}>{title}</span>
        {open ? <ChevronUp className="w-4 h-4" style={{ color: "#8B949E" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "#8B949E" }} />}
      </button>
      {open && <div className="px-6 py-5" style={{ background: "#0D1117" }}>{children}</div>}
    </div>
  );
}

function LazySection({ section, params, title, icon, children }: {
  section: string; params: Record<string, string>; title: string;
  icon: React.ReactNode; children?: (content: string) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersection(ref as React.RefObject<HTMLElement>);
  const { content, loading, error, fetch: fetchContent } = useMedContent(section, params, false);

  useEffect(() => { if (visible && !content) fetchContent(); }, [visible]);

  return (
    <div ref={ref} className="rounded-xl border" style={{ background: "#161B22", borderColor: "#21262D" }}>
      <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "#21262D" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,194,168,0.1)" }}>
          {icon}
        </div>
        <h3 className="font-bold text-base" style={{ color: "#E6EDF3" }}>{title}</h3>
      </div>
      <div className="px-6 py-5">
        {loading && <SectionLoader lines={5} />}
        {error && (
          <div className="flex items-center gap-3 py-3">
            <AlertCircle className="w-5 h-5" style={{ color: "#F85149" }} />
            <span className="text-sm" style={{ color: "#8B949E" }}>Content temporarily unavailable.</span>
            <button onClick={fetchContent} className="flex items-center gap-1 text-sm transition-all hover:opacity-80" style={{ color: "#00C2A8" }}>
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}
        {content && !loading && (
          children ? children(content) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#E6EDF3" }}
              dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, "<strong style='color:#00C2A8'>$1</strong>") }} />
          )
        )}
      </div>
    </div>
  );
}

export default function TopicPage() {
  const params = useParams<{ subjectSlug: string; topicSlug: string }>();
  const result = getTopicBySlug(params.subjectSlug || "", params.topicSlug || "");
  const [saved, setSaved] = useState(() => {
    const list = JSON.parse(localStorage.getItem("aethex_study_list") || "[]");
    return list.includes(`${params.subjectSlug}/${params.topicSlug}`);
  });
  const [activeTab, setActiveTab] = useState<"overview"|"exam"|"flashcards">("overview");

  const apiParams = result ? { topic: result.topic.name, subject: result.subject.name } : {};
  const overview = useMedContent("overview", apiParams, !!result);
  const keyConcepts = useMedContent("key_concepts", apiParams, !!result);
  const clinicalRelevance = useMedContent("clinical_relevance", apiParams, false);
  const mcqData = useMedContent("mcq", apiParams, false);
  const flashData = useMedContent("flashcards", apiParams, false);

  const handleSave = () => {
    const list = JSON.parse(localStorage.getItem("aethex_study_list") || "[]");
    const key = `${params.subjectSlug}/${params.topicSlug}`;
    const updated = saved ? list.filter((x: string) => x !== key) : [...list, key];
    localStorage.setItem("aethex_study_list", JSON.stringify(updated));
    setSaved(!saved);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D1117" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#E6EDF3" }}>Topic not found</h1>
          <Link href={`${BASE}/study-hub/medical-knowledge-hub`} style={{ color: "#00C2A8" }}>← Back to Hub</Link>
        </div>
      </div>
    );
  }

  const { subject, topic } = result;

  const parseMCQs = (raw: string) => {
    try {
      const cleaned = raw.replace(/```json\n?|```\n?/g, "").trim();
      return JSON.parse(cleaned);
    } catch { return null; }
  };

  const parseFlashcards = (raw: string) => {
    try {
      const cleaned = raw.replace(/```json\n?|```\n?/g, "").trim();
      return JSON.parse(cleaned);
    } catch { return null; }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0D1117" }}>
      {/* Hero */}
      <div className="border-b" style={{ borderColor: "#21262D", background: "#161B22" }}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <BreadcrumbNav crumbs={[
            { label: "Study Hub", href: `${BASE}/study-hub` },
            { label: "Knowledge Hub", href: `${BASE}/study-hub/medical-knowledge-hub` },
            { label: subject.name, href: `${BASE}/study-hub/medical-knowledge-hub/subjects/${subject.slug}` },
            { label: topic.name },
          ]} />
          <Link href={`${BASE}/study-hub/medical-knowledge-hub/subjects/${subject.slug}`}
            className="flex items-center gap-2 text-sm mt-4 mb-5 transition-all hover:opacity-80" style={{ color: "#8B949E" }}>
            <ArrowLeft className="w-4 h-4" /> Back to {subject.name}
          </Link>

          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(0,194,168,0.1)", color: "#00C2A8" }}>{subject.icon} {subject.name}</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${diffColor[topic.difficulty]}18`, color: diffColor[topic.difficulty] }}>{topic.difficulty}</span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "#8B949E" }}><Clock className="w-3.5 h-3.5" /> {topic.readTime} min read</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#E6EDF3" }}>{topic.name}</h1>
            </div>
            <button onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: saved ? "rgba(0,194,168,0.1)" : "#21262D", color: saved ? "#00C2A8" : "#8B949E", border: `1px solid ${saved ? "#00C2A8" : "#21262D"}` }}>
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b" style={{ borderColor: "#21262D" }}>
            {[["overview", "Overview & Diagrams"], ["exam", "Exam Corner (MCQs)"], ["flashcards", "Flashcards"]].map(([t, label]) => (
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
            <div className="rounded-xl border" style={{ background: "#161B22", borderColor: "#21262D" }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: "#21262D" }}>
                <h2 className="font-bold text-lg" style={{ color: "#E6EDF3" }}>Overview</h2>
              </div>
              <div className="px-6 py-5">
                {overview.loading && <SectionLoader lines={6} />}
                {overview.error && (
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" style={{ color: "#F85149" }} />
                    <span className="text-sm" style={{ color: "#8B949E" }}>Could not load overview.</span>
                    <button onClick={overview.fetch} className="flex items-center gap-1 text-sm" style={{ color: "#00C2A8" }}>
                      <RefreshCw className="w-3.5 h-3.5" /> Retry
                    </button>
                  </div>
                )}
                {overview.content && (
                  <div className="text-sm leading-loose" style={{ color: "#E6EDF3" }}
                    dangerouslySetInnerHTML={{ __html: overview.content.replace(/\*\*(.*?)\*\*/g, "<strong style='color:#00C2A8'>$1</strong>") }} />
                )}
              </div>
            </div>

            {/* Diagrams */}
            <div className="rounded-xl border" style={{ background: "#161B22", borderColor: "#21262D" }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: "#21262D" }}>
                <h2 className="font-bold text-lg" style={{ color: "#E6EDF3" }}>Medical Diagrams</h2>
              </div>
              <div className="px-6 py-5">
                <DiagramCarousel topicSlug={topic.slug} subjectSlug={subject.slug} />
              </div>
            </div>

            {/* Key Concepts */}
            <div className="rounded-xl border" style={{ background: "#161B22", borderColor: "#21262D" }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: "#21262D" }}>
                <h2 className="font-bold text-lg" style={{ color: "#E6EDF3" }}>Key Concepts</h2>
                <p className="text-sm mt-1" style={{ color: "#8B949E" }}>Essential facts every student must know</p>
              </div>
              <div className="px-6 py-5">
                {keyConcepts.loading && <SectionLoader lines={8} />}
                {keyConcepts.error && (
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" style={{ color: "#F85149" }} />
                    <button onClick={keyConcepts.fetch} className="flex items-center gap-1 text-sm" style={{ color: "#00C2A8" }}><RefreshCw className="w-3.5 h-3.5" /> Retry</button>
                  </div>
                )}
                {keyConcepts.content && (
                  <div className="text-sm leading-relaxed" style={{ color: "#E6EDF3" }}
                    dangerouslySetInnerHTML={{ __html: keyConcepts.content.replace(/\*\*(.*?)\*\*/g, "<strong style='color:#00C2A8'>$1</strong>").replace(/\n/g, "<br/>") }} />
                )}
              </div>
            </div>

            {/* Clinical Relevance */}
            <LazySection section="clinical_relevance" params={apiParams} title="Clinical Relevance & Applied" icon={<Stethoscope className="w-4 h-4" style={{ color: "#00C2A8" }} />}>
              {(c) => (
                <div className="text-sm leading-relaxed p-4 rounded-xl border" style={{ borderColor: "rgba(0,194,168,0.25)", background: "rgba(0,194,168,0.04)", color: "#E6EDF3" }}
                  dangerouslySetInnerHTML={{ __html: c.replace(/\*\*(.*?)\*\*/g, "<strong style='color:#00C2A8'>$1</strong>").replace(/\n/g, "<br/>") }} />
              )}
            </LazySection>

            {/* Related Conditions */}
            {topic.relatedConditions && topic.relatedConditions.length > 0 && (
              <div className="rounded-xl border" style={{ background: "#161B22", borderColor: "#21262D" }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: "#21262D" }}>
                  <h2 className="font-bold text-lg" style={{ color: "#E6EDF3" }}>Related Conditions</h2>
                </div>
                <div className="px-6 py-5">
                  <div className="flex flex-wrap gap-3">
                    {topic.relatedConditions.map(c => (
                      <div key={c} className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer hover:border-teal-500"
                        style={{ background: "#21262D", color: "#E6EDF3", border: "1px solid #21262D" }}>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "exam" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "#E6EDF3" }}>Exam Corner — MCQ Practice</h2>
              <p className="text-sm mb-6" style={{ color: "#8B949E" }}>NEET-PG / USMLE style questions with explanations</p>
            </div>
            {!mcqData.content && !mcqData.loading && !mcqData.error && (
              <div className="text-center py-12 rounded-xl border" style={{ borderColor: "#21262D", background: "#161B22" }}>
                <p className="text-base mb-4" style={{ color: "#8B949E" }}>Ready to test your knowledge on {topic.name}?</p>
                <button onClick={mcqData.fetch}
                  className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={{ background: "#00C2A8", color: "#0D1117" }}>
                  Generate 8 MCQs with AI
                </button>
              </div>
            )}
            {mcqData.loading && (
              <div className="text-center py-12 rounded-xl border" style={{ borderColor: "#21262D", background: "#161B22" }}>
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "#00C2A8", borderTopColor: "transparent" }} />
                <p className="text-sm" style={{ color: "#8B949E" }}>Generating NEET-PG/USMLE questions...</p>
              </div>
            )}
            {mcqData.error && (
              <div className="text-center py-8 rounded-xl border" style={{ borderColor: "#21262D", background: "#161B22" }}>
                <AlertCircle className="w-8 h-8 mx-auto mb-3" style={{ color: "#F85149" }} />
                <p className="text-sm mb-3" style={{ color: "#8B949E" }}>Failed to generate questions.</p>
                <button onClick={mcqData.fetch} className="flex items-center gap-1 text-sm mx-auto" style={{ color: "#00C2A8" }}><RefreshCw className="w-4 h-4" /> Try Again</button>
              </div>
            )}
            {mcqData.content && (() => {
              const questions = parseMCQs(mcqData.content);
              return questions ? <MCQQuiz questions={questions} topic={topic.name} /> : (
                <div className="p-4 rounded-xl border text-sm" style={{ borderColor: "#21262D", color: "#8B949E" }}>
                  <pre className="whitespace-pre-wrap text-xs" style={{ color: "#E6EDF3" }}>{mcqData.content}</pre>
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === "flashcards" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "#E6EDF3" }}>Quick Revision Flashcards</h2>
              <p className="text-sm mb-6" style={{ color: "#8B949E" }}>Click each card to reveal the answer</p>
            </div>
            {!flashData.content && !flashData.loading && !flashData.error && (
              <div className="text-center py-12 rounded-xl border" style={{ borderColor: "#21262D", background: "#161B22" }}>
                <p className="text-base mb-4" style={{ color: "#8B949E" }}>Generate AI flashcards for {topic.name}</p>
                <button onClick={flashData.fetch}
                  className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={{ background: "#00C2A8", color: "#0D1117" }}>
                  Generate 10 Flashcards
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

      {/* Scroll to top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90 shadow-lg"
        style={{ background: "#00C2A8", color: "#0D1117" }}>
        ↑
      </button>
    </div>
  );
}
