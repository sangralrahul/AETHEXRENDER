import DOMPurify from "dompurify";

interface RichContentProps {
  content: string;
  lineByLine?: boolean;
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function parseInlineMarkers(text: string): string {
  let result = escHtml(text);

  result = result.replace(/\*\*(.+?)\*\*/g, (_, w) => `<strong style="color:#F85149;font-weight:700">${w}</strong>`);
  result = result.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, (_, w) => `<span style="color:#58A6FF;font-weight:500">${w}</span>`);
  result = result.replace(/~~(.+?)~~/g, (_, w) => `<span style="color:#3FB950">${w}</span>`);
  return DOMPurify.sanitize(result, { ALLOWED_TAGS: ["strong", "span"], ALLOWED_ATTR: ["style"] });
}

function isHeading(line: string): boolean {
  const stripped = line.replace(/\*\*/g, "").trim();
  return (
    (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) ||
    /^\d+\.\s+\*\*/.test(line) ||
    /^#{1,3}\s/.test(line)
  );
}

function renderLine(line: string, i: number) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const parsed = parseInlineMarkers(trimmed);

  if (/^#{1,3}\s/.test(trimmed)) {
    const text = trimmed.replace(/^#{1,3}\s/, "");
    return (
      <div key={i} className="mt-4 mb-1 text-sm font-bold uppercase tracking-wider" style={{ color: "#00C2A8" }}
        dangerouslySetInnerHTML={{ __html: parseInlineMarkers(text) }} />
    );
  }

  if (/^\*\*[^*]+\*\*[:：]?\s*$/.test(trimmed)) {
    return (
      <div key={i} className="mt-3 mb-0.5 text-sm font-bold" style={{ color: "#00C2A8" }}
        dangerouslySetInnerHTML={{ __html: parseInlineMarkers(trimmed.replace(/\*\*/g, "")) }} />
    );
  }

  if (/^\d+\.\s+\*\*/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
    return (
      <div key={i} className="flex gap-2 py-0.5">
        <span className="shrink-0 text-xs font-bold mt-0.5" style={{ color: "#00C2A8" }}>
          {trimmed.match(/^(\d+)\./)?.[1]}.
        </span>
        <span className="text-sm leading-relaxed" style={{ color: "#E6EDF3" }}
          dangerouslySetInnerHTML={{ __html: parseInlineMarkers(trimmed.replace(/^\d+\.\s+/, "")) }} />
      </div>
    );
  }

  if (/^[-•–]\s/.test(trimmed)) {
    return (
      <div key={i} className="flex gap-2 py-0.5 pl-1">
        <span className="shrink-0 text-xs mt-1" style={{ color: "#00C2A8" }}>▸</span>
        <span className="text-sm leading-relaxed" style={{ color: "#E6EDF3" }}
          dangerouslySetInnerHTML={{ __html: parseInlineMarkers(trimmed.replace(/^[-•–]\s+/, "")) }} />
      </div>
    );
  }

  if (trimmed.startsWith("Mnemonic:") || trimmed.startsWith("Mnemonic —")) {
    return (
      <div key={i} className="mt-2 px-4 py-2 rounded-lg text-sm" style={{ background: "rgba(227,179,65,0.08)", border: "1px solid rgba(227,179,65,0.2)", color: "#E3B341" }}
        dangerouslySetInnerHTML={{ __html: parseInlineMarkers(trimmed) }} />
    );
  }

  return (
    <p key={i} className="text-sm leading-relaxed py-0.5" style={{ color: "#C9D1D9" }}
      dangerouslySetInnerHTML={{ __html: parsed }} />
  );
}

export function RichContent({ content, lineByLine = true }: RichContentProps) {
  const lines = content.split("\n");

  return (
    <div className="space-y-0.5">
      {lineByLine ? (
        lines.map((line, i) => renderLine(line, i)).filter(Boolean)
      ) : (
        <div className="text-sm leading-relaxed" style={{ color: "#C9D1D9" }}
          dangerouslySetInnerHTML={{ __html: parseInlineMarkers(content).replace(/\n/g, "<br/>") }} />
      )}
      <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: "1px solid #21262D" }}>
        <span className="flex items-center gap-1.5 text-xs" style={{ color: "#8B949E" }}>
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "#F85149" }} />
          Critical / Must-know
        </span>
        <span className="flex items-center gap-1.5 text-xs" style={{ color: "#8B949E" }}>
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "#58A6FF" }} />
          Important
        </span>
        <span className="flex items-center gap-1.5 text-xs" style={{ color: "#8B949E" }}>
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "#3FB950" }} />
          Notable
        </span>
      </div>
    </div>
  );
}
