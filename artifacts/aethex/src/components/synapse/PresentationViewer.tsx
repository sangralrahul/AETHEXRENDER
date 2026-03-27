import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import MermaidDiagram from "./MermaidDiagram";

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
  pdfBase64?: string;
  docxBase64?: string;
}

interface Props {
  data: PresentationData;
  onClose: () => void;
  pdfBase64?: string;
  docxBase64?: string;
}

const TEAL = "#00BCD4";
const TEAL_DIM = "#007C91";
const TEAL_BRT = "#4DD0E1";
const NAVY = "#0A0F2C";
const NAVY2 = "#1a1f4e";

function nodesToMermaid(diag: string, nodes: string[], edges: [number, number][]): string {
  if (!nodes.length) return "";

  const cleanLabel = (s: string) =>
    s.replace(/"/g, "'").replace(/[<>{}|]/g, " ").replace(/\s+/g, " ").trim().substring(0, 28);

  if (diag === "mindmap") {
    let chart = `mindmap\n  root((${cleanLabel(nodes[0] ?? "Overview")}))\n`;
    nodes.slice(1, 8).forEach((n) => {
      chart += `    ${cleanLabel(n)}\n`;
    });
    return chart;
  }

  const dir = diag === "concept" ? "LR" : "TD";
  let chart = `flowchart ${dir}\n`;

  nodes.forEach((node, i) => {
    const label = cleanLabel(node);
    const isTerminal = diag === "flowchart" && (i === 0 || i === nodes.length - 1);
    chart += isTerminal
      ? `  N${i}([${label}])\n`
      : `  N${i}[${label}]\n`;
  });

  if (edges.length) {
    edges.forEach(([src, dst]) => {
      if (src < nodes.length && dst < nodes.length) {
        chart += `  N${src} --> N${dst}\n`;
      }
    });
  } else {
    if (diag === "concept") {
      for (let i = 1; i < nodes.length; i++) chart += `  N0 --> N${i}\n`;
    } else {
      for (let i = 0; i < nodes.length - 1; i++) chart += `  N${i} --> N${i + 1}\n`;
    }
  }

  chart += `  style N0 fill:#00BCD4,color:#fff,stroke:#007C91\n`;
  if (nodes.length > 1 && (diag === "flowchart" || diag === "pathway")) {
    chart += `  style N${nodes.length - 1} fill:#007C91,color:#fff,stroke:#004D61\n`;
  }
  return chart;
}

function DiagramLabel({ diag }: { diag: string }) {
  const labels: Record<string, string> = {
    flowchart: "MECHANISM FLOWCHART",
    anatomy: "ANATOMY DIAGRAM",
    mindmap: "MIND MAP",
    pathway: "CLINICAL PATHWAY",
    concept: "CONCEPT MAP",
  };
  return (
    <p style={{ color: TEAL, fontSize: 10, fontWeight: "bold", textTransform: "uppercase", margin: "0 0 10px", letterSpacing: "0.06em" }}>
      {labels[diag] ?? "DIAGRAM"}
    </p>
  );
}

function ConceptStrip({ nodes }: { nodes: string[] }) {
  if (!nodes.length) return null;
  return (
    <div style={{
      background: "rgba(0,0,0,0.38)",
      padding: "7px 28px",
      display: "flex",
      gap: 6,
      alignItems: "center",
      flexWrap: "nowrap",
      overflowX: "auto",
      flexShrink: 0,
    }}>
      {nodes.slice(0, 7).map((node, i) => (
        <React.Fragment key={i}>
          <div style={{
            background: "rgba(0,188,212,0.18)",
            border: `1px solid ${TEAL}`,
            borderRadius: 20,
            padding: "3px 11px",
            color: "white",
            fontSize: 10,
            whiteSpace: "nowrap",
            fontWeight: 500,
          }}>
            {node}
          </div>
          {i < Math.min(nodes.length, 7) - 1 && (
            <span style={{ color: TEAL, fontSize: 14, flexShrink: 0, lineHeight: 1 }}>→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function SpecSlide({ slide, current, total }: { slide: PresentationSlide; current: number; total: number }) {
  const diag = slide.diag ?? "none";
  const nodes = slide.nodes ?? [];
  const edges = slide.edges ?? [];
  const hasDiag = diag !== "none" && nodes.length > 0;
  const chart = hasDiag ? nodesToMermaid(diag, nodes, edges) : "";

  return (
    <div style={{
      background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', 'DM Sans', sans-serif",
      overflow: "hidden",
    }}>
      {/* ── TOP BAR (teal) ── */}
      <div style={{
        background: TEAL,
        padding: "8px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
      }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
          MEDICAL EDUCATION | SYNAPSE
        </span>
        <span style={{ color: "white", fontSize: 12 }}>
          Slide {current} / {total}
        </span>
      </div>

      {/* ── MAIN CONTENT: 1fr 1fr ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        flex: 1,
        gap: 20,
        padding: "20px 28px",
        minHeight: 0,
        overflow: "hidden",
      }}>
        {/* LEFT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, overflow: "hidden" }}>
          <h2 style={{
            color: TEAL,
            fontSize: 20,
            fontWeight: 800,
            margin: "0 0 12px",
            lineHeight: 1.2,
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          }}>
            {slide.t}
          </h2>

          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: 8 }}>
            {slide.bullets.slice(0, 6).map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: TEAL, fontWeight: "bold", fontSize: 14, flexShrink: 0, marginTop: 1 }}>&#9658;</span>
                <p style={{ color: "white", fontSize: 13, lineHeight: 1.55, margin: 0, opacity: 0.92 }}>{b}</p>
              </div>
            ))}
          </div>

          {/* KEY INSIGHT */}
          {slide.ki && (
            <div style={{
              borderLeft: `4px solid ${TEAL}`,
              background: "rgba(0,188,212,0.10)",
              padding: "10px 14px",
              marginTop: 12,
              borderRadius: "0 8px 8px 0",
              flexShrink: 0,
            }}>
              <div style={{ color: TEAL, fontWeight: "bold", fontSize: 10, letterSpacing: "0.06em", marginBottom: 4 }}>
                ⚡ KEY INSIGHT
              </div>
              <p style={{ color: "#e0f7fa", fontStyle: "italic", fontSize: 12, margin: 0, lineHeight: 1.55 }}>
                {slide.ki}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — DIAGRAM */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: 14,
          border: `1px solid rgba(0,188,212,0.28)`,
          padding: "14px 14px 10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: hasDiag ? "flex-start" : "center",
          overflow: "hidden",
        }}>
          {hasDiag ? (
            <>
              <DiagramLabel diag={diag} />
              <div style={{ width: "100%", overflow: "auto", flex: 1 }}>
                <MermaidDiagram chart={chart} />
              </div>
            </>
          ) : (
            <p style={{ color: "rgba(0,188,212,0.25)", fontSize: 12, margin: 0 }}>No diagram available</p>
          )}
        </div>
      </div>

      {/* ── BOTTOM CONCEPT STRIP ── */}
      <ConceptStrip nodes={nodes} />
    </div>
  );
}

function TitleSlide({ slide, current, total }: { slide: PresentationSlide; current: number; total: number }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${NAVY} 0%, #0D1F3C 50%, #061828 100%)`,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', 'DM Sans', sans-serif",
    }}>
      <div style={{ background: TEAL, padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>MEDICAL EDUCATION | SYNAPSE</span>
        <span style={{ color: "white", fontSize: 12 }}>Slide {current} / {total}</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 48px", textAlign: "center", gap: 16 }}>
        <div style={{ width: 64, height: 4, borderRadius: 2, background: TEAL }} />
        <h1 style={{ color: "white", fontSize: 40, fontWeight: 900, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>{slide.t}</h1>
        {slide.sub && <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, margin: 0, maxWidth: 520, lineHeight: 1.6 }}>{slide.sub}</p>}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <span style={{ padding: "8px 18px", borderRadius: 24, fontSize: 13, fontWeight: "bold", background: TEAL_DIM, color: "white" }}>{total} Slides</span>
          <span style={{ padding: "8px 18px", borderRadius: 24, fontSize: 13, fontWeight: 600, border: `1px solid ${TEAL_DIM}`, color: TEAL_BRT }}>SYNAPSE Medical Education</span>
        </div>
      </div>
      <div style={{ padding: "0 0 20px", display: "flex", justifyContent: "center", opacity: 0.18 }}>
        <div style={{ width: 120, height: 2, borderRadius: 1, background: TEAL }} />
      </div>
    </div>
  );
}

function ConditionsSlide({ slide, conditions, current, total }: { slide: PresentationSlide; conditions?: PresentationData["conditions"]; current: number; total: number }) {
  const items = conditions?.slice(0, 6) ?? [];
  return (
    <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: TEAL, padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>MEDICAL EDUCATION | SYNAPSE</span>
        <span style={{ color: "white", fontSize: 12 }}>Slide {current} / {total}</span>
      </div>
      <div style={{ padding: "14px 24px 8px", borderBottom: `2px solid ${TEAL}`, flexShrink: 0 }}>
        <h2 style={{ color: TEAL, fontSize: 20, fontWeight: 800, margin: 0 }}>{slide.t}</h2>
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "14px 24px", overflow: "auto" }}>
        {(items.length ? items : slide.bullets.slice(0, 6).map(b => ({ name: b, features: "", clue: "" }))).map((c, i) => (
          <div key={i} style={{ borderRadius: 12, padding: 12, background: "rgba(0,188,212,0.07)", border: `1px solid ${TEAL_DIM}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ width: 20, height: 20, borderRadius: 5, background: TEAL, color: "white", fontSize: 9, fontWeight: "black", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
              <span style={{ color: "white", fontSize: 11, fontWeight: "bold" }}>{c.name}</span>
            </div>
            {c.features && <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, lineHeight: 1.5, margin: "0 0 4px" }}>{c.features}</p>}
            {c.clue && <p style={{ color: TEAL_BRT, fontSize: 10, fontWeight: 600, margin: 0 }}>↗ {c.clue}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function RedFlagsSlide({ slide, redflags, current, total }: { slide: PresentationSlide; redflags?: string[]; current: number; total: number }) {
  const flags = redflags?.length ? redflags.slice(0, 8) : slide.bullets.slice(0, 8);
  return (
    <div style={{ background: "#140A0A", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#c62828", padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>MEDICAL EDUCATION | SYNAPSE — RED FLAGS</span>
        <span style={{ color: "white", fontSize: 12 }}>Slide {current} / {total}</span>
      </div>
      <div style={{ padding: "14px 24px 8px", borderBottom: "2px solid #EF4444", flexShrink: 0 }}>
        <h2 style={{ color: "white", fontSize: 20, fontWeight: 800, margin: 0 }}>{slide.t}</h2>
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "14px 24px", overflow: "auto" }}>
        {flags.map((f, i) => (
          <div key={i} style={{ borderRadius: 12, padding: 12, display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <p style={{ color: "white", fontSize: 13, lineHeight: 1.5, margin: 0, opacity: 0.9 }}>{f}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSlide({ slide, faq, current, total }: { slide: PresentationSlide; faq?: PresentationData["faq"]; current: number; total: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = faq?.length ? faq.slice(0, 10) : [];
  return (
    <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: TEAL, padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>MEDICAL EDUCATION | SYNAPSE</span>
        <span style={{ color: "white", fontSize: 12 }}>Slide {current} / {total}</span>
      </div>
      <div style={{ padding: "14px 24px 8px", borderBottom: `2px solid ${TEAL}`, flexShrink: 0 }}>
        <h2 style={{ color: TEAL, fontSize: 20, fontWeight: 800, margin: 0 }}>{slide.t}</h2>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "12px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
        {(items.length ? items : slide.bullets.map(b => ({ question: b, answer: "" }))).map((qa, i) => (
          <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${open === i ? TEAL : TEAL_DIM}` }}>
            <button
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", textAlign: "left", background: open === i ? "rgba(0,188,212,0.12)" : "rgba(0,188,212,0.04)", cursor: "pointer", border: "none" }}
              onClick={() => setOpen(open === i ? null : i)}>
              <span style={{ width: 24, height: 24, borderRadius: 6, background: TEAL, color: "white", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>Q{i + 1}</span>
              <span style={{ color: "white", fontSize: 12, fontWeight: 600, flex: 1, lineHeight: 1.4 }}>{qa.question}</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, lineHeight: 1, flexShrink: 0 }}>{open === i ? "−" : "+"}</span>
            </button>
            {open === i && qa.answer && (
              <div style={{ padding: "10px 14px", background: "rgba(0,0,0,0.3)", borderTop: `1px solid ${TEAL_DIM}` }}>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{qa.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GlossarySlide({ slide, refs, current, total }: { slide: PresentationSlide; refs?: PresentationData["refs"]; current: number; total: number }) {
  const items = refs?.length ? refs.slice(0, 10) : [];
  return (
    <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)`, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: TEAL, padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>MEDICAL EDUCATION | SYNAPSE</span>
        <span style={{ color: "white", fontSize: 12 }}>Slide {current} / {total}</span>
      </div>
      <div style={{ padding: "14px 24px 8px", borderBottom: `2px solid ${TEAL}`, flexShrink: 0 }}>
        <h2 style={{ color: TEAL, fontSize: 20, fontWeight: 800, margin: 0 }}>{slide.t}</h2>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "12px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {(items.length ? items : slide.bullets.map(b => ({ term: b, definition: "" }))).map((r, i) => (
            <div key={i} style={{ borderRadius: 12, padding: 12, background: "rgba(0,188,212,0.06)", border: `1px solid ${TEAL_DIM}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 20, height: 20, borderRadius: 5, background: TEAL, color: "white", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                <span style={{ color: TEAL_BRT, fontSize: 11, fontWeight: "bold" }}>{r.term}</span>
              </div>
              {r.definition && <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 10, lineHeight: 1.55, margin: 0 }}>{r.definition}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummarySlide({ slide, current, total }: { slide: PresentationSlide; current: number; total: number }) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0A1F3C 100%)`, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: TEAL, padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>MEDICAL EDUCATION | SYNAPSE</span>
        <span style={{ color: "white", fontSize: 12 }}>Slide {current} / {total}</span>
      </div>
      <div style={{ padding: "14px 24px 8px", borderBottom: `2px solid ${TEAL}`, flexShrink: 0 }}>
        <h2 style={{ color: TEAL, fontSize: 20, fontWeight: 800, margin: 0 }}>{slide.t}</h2>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 24px", gap: 10, overflow: "auto" }}>
        {slide.bullets.slice(0, 6).map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, borderRadius: 12, padding: "10px 14px", background: "rgba(0,188,212,0.07)", border: `1px solid ${TEAL_DIM}` }}>
            <span style={{ fontSize: 20, fontWeight: 900, flexShrink: 0, color: TEAL_DIM, opacity: 0.7 }}>0{i + 1}</span>
            <p style={{ color: "white", fontSize: 13, lineHeight: 1.55, margin: 0, opacity: 0.92 }}>{b}</p>
          </div>
        ))}
        {slide.ki && (
          <div style={{ borderLeft: `4px solid ${TEAL}`, background: "rgba(0,188,212,0.10)", padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
            <div style={{ color: TEAL, fontWeight: "bold", fontSize: 10, letterSpacing: "0.06em", marginBottom: 4 }}>⚡ KEY INSIGHT</div>
            <p style={{ color: "#e0f7fa", fontStyle: "italic", fontSize: 12, margin: 0, lineHeight: 1.55 }}>{slide.ki}</p>
          </div>
        )}
      </div>
      <div style={{ padding: "0 24px 16px", display: "flex", alignItems: "center", gap: 10, opacity: 0.3, flexShrink: 0 }}>
        <div style={{ flex: 1, height: 1, background: TEAL_DIM }} />
        <span style={{ color: TEAL, fontSize: 9, fontWeight: "bold", letterSpacing: "0.08em" }}>SYNAPSE · aethex Medical Education</span>
        <div style={{ flex: 1, height: 1, background: TEAL_DIM }} />
      </div>
    </div>
  );
}

function renderSlide(slide: PresentationSlide, data: PresentationData, current: number, total: number) {
  switch (slide.type) {
    case "title":     return <TitleSlide slide={slide} current={current} total={total} />;
    case "conditions": return <ConditionsSlide slide={slide} conditions={data.conditions} current={current} total={total} />;
    case "redflags":  return <RedFlagsSlide slide={slide} redflags={data.redflags} current={current} total={total} />;
    case "faq":       return <FAQSlide slide={slide} faq={data.faq} current={current} total={total} />;
    case "glossary":  return <GlossarySlide slide={slide} refs={data.refs} current={current} total={total} />;
    case "summary":   return <SummarySlide slide={slide} current={current} total={total} />;
    default:          return <SpecSlide slide={slide} current={current} total={total} />;
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

  const pdf64 = pdfBase64 ?? data.pdfBase64;
  const docx64 = docxBase64 ?? data.docxBase64;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", background: "#000" }}>
      {/* ── Outer top controls ── */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 14px",
        gap: 12,
        background: "#050C1A",
        borderBottom: `1px solid ${TEAL_DIM}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
          <span style={{ color: "white", fontSize: 12, fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {pdf64 && (
            <a href={`data:application/pdf;base64,${pdf64}`} download={`${data.title}.pdf`}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: "bold", color: "white", background: TEAL_DIM, textDecoration: "none" }}>
              <Download style={{ width: 12, height: 12 }} /> PDF
            </a>
          )}
          {docx64 && (
            <a href={`data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${docx64}`} download={`${data.title}.docx`}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: "bold", color: "white", background: "#1E3A5F", textDecoration: "none" }}>
              <Download style={{ width: 12, height: 12 }} /> DOCX
            </a>
          )}
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", color: "white", opacity: 0.6 }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* ── Slide area ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "stretch", minHeight: 0 }}>
        <button onClick={prev} disabled={idx === 0}
          style={{ flexShrink: 0, width: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", border: "none", cursor: idx === 0 ? "default" : "pointer", color: "white", opacity: idx === 0 ? 0.1 : 0.4 }}>
          <ChevronLeft style={{ width: 24, height: 24 }} />
        </button>
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden", position: "relative" }}>
          {slide && renderSlide(slide, data, idx + 1, total)}
        </div>
        <button onClick={next} disabled={idx === total - 1}
          style={{ flexShrink: 0, width: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", border: "none", cursor: idx === total - 1 ? "default" : "pointer", color: "white", opacity: idx === total - 1 ? 0.1 : 0.4 }}>
          <ChevronRight style={{ width: 24, height: 24 }} />
        </button>
      </div>

      {/* ── Dot nav ── */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "10px 12px",
        background: "#050C1A",
        borderTop: `1px solid ${TEAL_DIM}`,
        flexWrap: "wrap",
      }}>
        {data.slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            style={{
              borderRadius: 3,
              height: 6,
              width: i === idx ? 20 : 6,
              background: i === idx ? TEAL : TEAL_DIM,
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.2s, background 0.2s",
            }} />
        ))}
      </div>
    </div>
  );
}
