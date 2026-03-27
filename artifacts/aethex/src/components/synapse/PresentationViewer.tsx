import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Download, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { ConceptMapSVG, FlowchartSVG, PathwaySVG, MindMapFullSVG } from "./SlideDiagrams";

export interface PresentationSlide {
  n: number;
  type: string;
  t: string;
  sub?: string;
  bullets: string[];
  ki?: string;
  diag?: string;
  nodes?: string[];
  edges?: [number, number][];
}

export interface PresentationData {
  title: string;
  subtitle: string;
  slides: PresentationSlide[];
  faq?: { question: string; answer: string }[];
  refs?: { term: string; definition: string }[];
  conditions?: { name: string; features: string; clue: string }[];
  redflags?: string[];
}

interface Props {
  data: PresentationData;
  onClose: () => void;
  pdfBase64?: string;
  docxBase64?: string;
}

const NAVY = "#060D1F";
const NAVY2 = "#0A1628";
const TEAL = "#00BCD4";
const TEAL_DIM = "#006978";
const TEAL_BRT = "#4DD0E1";

function DiagramBox({ diag, nodes = [], edges = [] }: { diag?: string; nodes?: string[]; edges?: [number, number][] }) {
  if (!diag || diag === "none" || !nodes.length) return null;
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[9px] font-bold tracking-widest uppercase opacity-60" style={{ color: TEAL_BRT }}>
        {diag === "flowchart" ? "Mechanism Flowchart" : diag === "concept" ? "Concept Map" : diag === "pathway" ? "Pathway Map" : "Diagram"}
      </div>
      <div className="rounded-xl overflow-hidden flex items-center justify-center py-2"
        style={{ background: "rgba(0,188,212,0.04)", border: `1px solid ${TEAL_DIM}` }}>
        {diag === "flowchart" ? <FlowchartSVG nodes={nodes} edges={edges} />
          : diag === "concept" ? <ConceptMapSVG nodes={nodes} edges={edges} />
          : <PathwaySVG nodes={nodes} edges={edges} />}
      </div>
    </div>
  );
}

function KeyInsightBar({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="flex items-start gap-3 rounded-lg px-4 py-3 mt-auto"
      style={{ background: "rgba(0,188,212,0.10)", borderLeft: `3px solid ${TEAL}` }}>
      <span className="text-[9px] font-black tracking-widest uppercase whitespace-nowrap shrink-0 mt-0.5" style={{ color: TEAL }}>KEY INSIGHT</span>
      <span className="text-xs leading-relaxed italic opacity-90 text-white">{text}</span>
    </div>
  );
}

function SlideHeader({ title, current, total }: { title: string; current: number; total: number }) {
  return (
    <div className="flex items-center justify-between px-6 py-2 shrink-0"
      style={{ background: "rgba(0,0,0,0.4)", borderBottom: `1px solid ${TEAL_DIM}` }}>
      <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: TEAL }}>MEDICAL EDUCATION  |  SYNAPSE</span>
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-white opacity-50 truncate max-w-[200px] hidden sm:block">{title}</span>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: TEAL, color: "white" }}>
          {current} / {total}
        </span>
      </div>
    </div>
  );
}

function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      {bullets.slice(0, 6).map((b, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black"
            style={{ background: TEAL, color: "white" }}>{i + 1}</div>
          <p className="text-sm leading-snug text-white opacity-90 pt-0.5">{b}</p>
        </div>
      ))}
    </div>
  );
}

function TitleSlide({ slide, current, total }: { slide: PresentationSlide; current: number; total: number }) {
  return (
    <div className="flex flex-col h-full" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0D1F3C 50%, #061828 100%)` }}>
      <SlideHeader title={slide.t} current={current} total={total} />
      <div className="flex-1 flex flex-col items-center justify-center px-12 text-center gap-6">
        <div className="w-16 h-1 rounded-full" style={{ background: TEAL }} />
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">{slide.t}</h1>
        {slide.sub && <p className="text-base sm:text-lg opacity-60 text-white max-w-xl leading-relaxed">{slide.sub}</p>}
        <div className="flex items-center gap-3 mt-2">
          <span className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: TEAL_DIM, color: "white" }}>
            {total} Slides
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-semibold border" style={{ borderColor: TEAL_DIM, color: TEAL_BRT }}>
            SYNAPSE Medical Education
          </span>
        </div>
      </div>
      <div className="shrink-0 flex justify-center pb-6 opacity-20">
        <div className="w-32 h-0.5 rounded-full" style={{ background: TEAL }} />
      </div>
    </div>
  );
}

function ContentSlide({ slide, current, total }: { slide: PresentationSlide; current: number; total: number }) {
  const hasDiag = slide.diag && slide.diag !== "none" && (slide.nodes?.length ?? 0) > 0;
  return (
    <div className="flex flex-col h-full" style={{ background: NAVY2 }}>
      <SlideHeader title={slide.t} current={current} total={total} />
      <div className="px-5 py-3 shrink-0" style={{ borderBottom: `2px solid ${TEAL}` }}>
        <h2 className="text-xl font-black text-white">{slide.t}</h2>
      </div>
      <div className="flex-1 flex gap-4 px-5 py-4 min-h-0 overflow-hidden">
        <div className="flex flex-col gap-3 flex-1 min-w-0 overflow-hidden" style={{ flexBasis: hasDiag ? "55%" : "100%" }}>
          <BulletList bullets={slide.bullets} />
          <KeyInsightBar text={slide.ki ?? ""} />
        </div>
        {hasDiag && (
          <div className="shrink-0 flex flex-col gap-2 overflow-hidden" style={{ flexBasis: "42%", width: "42%" }}>
            <DiagramBox diag={slide.diag} nodes={slide.nodes} edges={slide.edges} />
          </div>
        )}
      </div>
    </div>
  );
}

function ConditionsSlide({ slide, conditions, current, total }: { slide: PresentationSlide; conditions?: PresentationData["conditions"]; current: number; total: number }) {
  const items = conditions?.slice(0, 6) ?? [];
  return (
    <div className="flex flex-col h-full" style={{ background: NAVY2 }}>
      <SlideHeader title={slide.t} current={current} total={total} />
      <div className="px-5 py-3 shrink-0" style={{ borderBottom: `2px solid ${TEAL}` }}>
        <h2 className="text-xl font-black text-white">{slide.t}</h2>
      </div>
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 px-5 py-4 content-start overflow-auto">
        {items.length ? items.map((c, i) => (
          <div key={i} className="rounded-xl p-3 flex flex-col gap-1"
            style={{ background: "rgba(0,188,212,0.07)", border: `1px solid ${TEAL_DIM}` }}>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-black shrink-0"
                style={{ background: TEAL, color: "white" }}>{i + 1}</span>
              <span className="text-xs font-bold text-white truncate">{c.name}</span>
            </div>
            <p className="text-[10px] leading-relaxed opacity-70 text-white">{c.features}</p>
            <p className="text-[10px] font-semibold mt-auto" style={{ color: TEAL_BRT }}>↗ {c.clue}</p>
          </div>
        )) : slide.bullets.slice(0, 6).map((b, i) => (
          <div key={i} className="rounded-xl p-3 flex flex-col gap-1"
            style={{ background: "rgba(0,188,212,0.07)", border: `1px solid ${TEAL_DIM}` }}>
            <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-black shrink-0 mb-1"
              style={{ background: TEAL, color: "white" }}>{i + 1}</span>
            <p className="text-xs leading-relaxed opacity-80 text-white">{b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RedFlagsSlide({ slide, redflags, current, total }: { slide: PresentationSlide; redflags?: string[]; current: number; total: number }) {
  const flags = redflags?.length ? redflags.slice(0, 8) : slide.bullets.slice(0, 8);
  return (
    <div className="flex flex-col h-full" style={{ background: "#140A0A" }}>
      <SlideHeader title={slide.t} current={current} total={total} />
      <div className="px-5 py-3 shrink-0" style={{ borderBottom: "2px solid #EF4444" }}>
        <h2 className="text-xl font-black text-white">{slide.t}</h2>
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 px-5 py-4 content-start overflow-auto">
        {flags.map((f, i) => (
          <div key={i} className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)" }}>
            <span className="text-base shrink-0">⚠️</span>
            <p className="text-sm leading-snug text-white opacity-90">{f}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MindMapSlide({ slide, current, total }: { slide: PresentationSlide; current: number; total: number }) {
  return (
    <div className="flex flex-col h-full" style={{ background: NAVY }}>
      <SlideHeader title={slide.t} current={current} total={total} />
      <div className="px-5 py-3 shrink-0" style={{ borderBottom: `2px solid ${TEAL}` }}>
        <h2 className="text-xl font-black text-white">{slide.t}</h2>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-3 min-h-0 overflow-hidden">
        <MindMapFullSVG center={slide.t.split(/\s+/).slice(0, 3).join(" ")} nodes={slide.nodes?.length ? slide.nodes : slide.bullets.slice(0, 8)} />
      </div>
    </div>
  );
}

function FAQSlide({ slide, faq, current, total }: { slide: PresentationSlide; faq?: PresentationData["faq"]; current: number; total: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = faq?.length ? faq.slice(0, 8) : [];
  return (
    <div className="flex flex-col h-full" style={{ background: NAVY2 }}>
      <SlideHeader title={slide.t} current={current} total={total} />
      <div className="px-5 py-3 shrink-0" style={{ borderBottom: `2px solid ${TEAL}` }}>
        <h2 className="text-xl font-black text-white">{slide.t}</h2>
      </div>
      <div className="flex-1 overflow-auto px-5 py-3 flex flex-col gap-2">
        {items.length ? items.map((qa, i) => (
          <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${open === i ? TEAL : TEAL_DIM}` }}>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-left"
              style={{ background: open === i ? "rgba(0,188,212,0.12)" : "rgba(0,188,212,0.04)" }}
              onClick={() => setOpen(open === i ? null : i)}>
              <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-black shrink-0"
                style={{ background: TEAL, color: "white" }}>Q{i + 1}</span>
              <span className="text-sm font-semibold text-white flex-1 leading-snug">{qa.question}</span>
              <span className="text-white opacity-50 text-lg leading-none">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-4 py-3" style={{ background: "rgba(0,0,0,0.3)", borderTop: `1px solid ${TEAL_DIM}` }}>
                <p className="text-xs leading-relaxed opacity-80 text-white">{qa.answer}</p>
              </div>
            )}
          </div>
        )) : slide.bullets.map((b, i) => (
          <div key={i} className="rounded-xl px-4 py-3 text-sm text-white opacity-80"
            style={{ background: "rgba(0,188,212,0.06)", border: `1px solid ${TEAL_DIM}` }}>{b}</div>
        ))}
      </div>
    </div>
  );
}

function GlossarySlide({ slide, refs, current, total }: { slide: PresentationSlide; refs?: PresentationData["refs"]; current: number; total: number }) {
  const items = refs?.length ? refs.slice(0, 10) : [];
  return (
    <div className="flex flex-col h-full" style={{ background: NAVY2 }}>
      <SlideHeader title={slide.t} current={current} total={total} />
      <div className="px-5 py-3 shrink-0" style={{ borderBottom: `2px solid ${TEAL}` }}>
        <h2 className="text-xl font-black text-white">{slide.t}</h2>
      </div>
      <div className="flex-1 overflow-auto px-5 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.length ? items.map((r, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: "rgba(0,188,212,0.06)", border: `1px solid ${TEAL_DIM}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-black shrink-0"
                  style={{ background: TEAL, color: "white" }}>{i + 1}</span>
                <span className="text-xs font-bold" style={{ color: TEAL_BRT }}>{r.term}</span>
              </div>
              <p className="text-[10px] leading-relaxed text-white opacity-70">{r.definition}</p>
            </div>
          )) : slide.bullets.map((b, i) => (
            <div key={i} className="rounded-xl p-3 text-xs text-white opacity-80"
              style={{ background: "rgba(0,188,212,0.06)", border: `1px solid ${TEAL_DIM}` }}>{b}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummarySlide({ slide, current, total }: { slide: PresentationSlide; current: number; total: number }) {
  return (
    <div className="flex flex-col h-full" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0A1F3C 100%)` }}>
      <SlideHeader title={slide.t} current={current} total={total} />
      <div className="px-5 py-3 shrink-0" style={{ borderBottom: `2px solid ${TEAL}` }}>
        <h2 className="text-xl font-black text-white">{slide.t}</h2>
      </div>
      <div className="flex-1 flex flex-col px-6 py-5 gap-3 overflow-auto">
        {slide.bullets.slice(0, 6).map((b, i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl px-4 py-3"
            style={{ background: "rgba(0,188,212,0.07)", border: `1px solid ${TEAL_DIM}` }}>
            <span className="text-2xl font-black shrink-0 leading-none" style={{ color: TEAL_DIM, opacity: 0.6 }}>
              0{i + 1}
            </span>
            <p className="text-sm text-white opacity-90 leading-relaxed">{b}</p>
          </div>
        ))}
        <KeyInsightBar text={slide.ki ?? ""} />
      </div>
      <div className="shrink-0 px-6 pb-4 flex items-center justify-center gap-3 opacity-40">
        <div className="h-px flex-1" style={{ background: TEAL_DIM }} />
        <span className="text-[9px] font-bold tracking-widest" style={{ color: TEAL }}>SYNAPSE · aethex Medical Education</span>
        <div className="h-px flex-1" style={{ background: TEAL_DIM }} />
      </div>
    </div>
  );
}

function renderSlide(slide: PresentationSlide, data: PresentationData, current: number, total: number) {
  switch (slide.type) {
    case "title": return <TitleSlide slide={slide} current={current} total={total} />;
    case "conditions": return <ConditionsSlide slide={slide} conditions={data.conditions} current={current} total={total} />;
    case "redflags": return <RedFlagsSlide slide={slide} redflags={data.redflags} current={current} total={total} />;
    case "mindmap": return <MindMapSlide slide={slide} current={current} total={total} />;
    case "faq": return <FAQSlide slide={slide} faq={data.faq} current={current} total={total} />;
    case "glossary": return <GlossarySlide slide={slide} refs={data.refs} current={current} total={total} />;
    case "summary": return <SummarySlide slide={slide} current={current} total={total} />;
    default: return <ContentSlide slide={slide} current={current} total={total} />;
  }
}

export default function PresentationViewer({ data, onClose, pdfBase64, docxBase64 }: Props) {
  const [idx, setIdx] = useState(0);
  const total = data.slides.length;
  const slide = data.slides[idx];

  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIdx((i) => Math.min(total - 1, i + 1)), [total]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#000" }}>
      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 gap-3"
        style={{ background: "#050C1A", borderBottom: `1px solid ${TEAL_DIM}` }}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: TEAL }} />
          <span className="text-xs font-bold text-white truncate">{data.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {pdfBase64 && (
            <a href={`data:application/pdf;base64,${pdfBase64}`}
              download={`${data.title}.pdf`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-colors"
              style={{ background: TEAL_DIM }}>
              <Download className="w-3 h-3" /> PDF
            </a>
          )}
          {docxBase64 && (
            <a href={`data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${docxBase64}`}
              download={`${data.title}.docx`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-colors"
              style={{ background: "#1E3A5F" }}>
              <Download className="w-3 h-3" /> DOCX
            </a>
          )}
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white opacity-60 hover:opacity-100 transition-opacity"
            style={{ background: "rgba(255,255,255,0.08)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 flex items-stretch min-h-0">
        <button onClick={prev} disabled={idx === 0}
          className="shrink-0 w-10 sm:w-14 flex items-center justify-center text-white opacity-30 hover:opacity-80 disabled:opacity-10 transition-opacity"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0 overflow-hidden relative" style={{ background: NAVY }}>
          {slide && renderSlide(slide, data, idx + 1, total)}
        </div>
        <button onClick={next} disabled={idx === total - 1}
          className="shrink-0 w-10 sm:w-14 flex items-center justify-center text-white opacity-30 hover:opacity-80 disabled:opacity-10 transition-opacity"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom dot nav */}
      <div className="shrink-0 flex items-center justify-center gap-1.5 py-3"
        style={{ background: "#050C1A", borderTop: `1px solid ${TEAL_DIM}` }}>
        {data.slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === idx ? 20 : 6, height: 6,
              background: i === idx ? TEAL : TEAL_DIM,
            }} />
        ))}
      </div>
    </div>
  );
}
