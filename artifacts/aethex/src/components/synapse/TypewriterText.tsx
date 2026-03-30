import { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  text: string;
  isNew: boolean;
  onDone?: () => void;
  onScroll?: () => void;
}

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    const stripped = line.trimStart();
    if (stripped.startsWith("### "))
      return <p key={li} className="font-bold text-[13px] mt-3 mb-0.5" style={{ color: "rgba(150,220,255,0.95)" }}>{stripped.slice(4)}</p>;
    if (stripped.startsWith("## "))
      return <p key={li} className="font-bold text-[14px] mt-4 mb-1" style={{ color: "rgba(100,190,255,0.95)" }}>{stripped.slice(3)}</p>;
    if (stripped.startsWith("# "))
      return <p key={li} className="font-bold text-[15px] mt-4 mb-1" style={{ color: "rgba(150,210,255,1)" }}>{stripped.slice(2)}</p>;
    if (stripped.startsWith("- ") || stripped.startsWith("• "))
      return (
        <div key={li} className="flex gap-2">
          <span className="text-teal-400 mt-0.5 shrink-0">•</span>
          <span>{renderInline(stripped.slice(2))}</span>
        </div>
      );
    if (stripped === "---" || stripped === "***")
      return <hr key={li} style={{ borderColor: "rgba(255,255,255,0.1)", margin: "8px 0" }} />;
    if (stripped === "")
      return <div key={li} className="h-1" />;
    return <p key={li}>{renderInline(stripped)}</p>;
  });
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return (
    <>
      {parts.map((chunk, ci) =>
        chunk.startsWith("**") && chunk.endsWith("**")
          ? <strong key={ci} style={{ color: "rgba(200,230,255,0.95)" }}>{chunk.slice(2, -2)}</strong>
          : <span key={ci}>{chunk}</span>
      )}
    </>
  );
}

export function TypewriterText({ text, isNew, onDone, onScroll }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState(() => isNew ? "" : text);
  const [done, setDone] = useState(!isNew);
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!isNew) return;

    idxRef.current = 0;
    setDisplayed("");
    setDone(false);

    const type = () => {
      if (!mountedRef.current) return;
      if (idxRef.current >= text.length) {
        setDone(true);
        onDone?.();
        return;
      }

      const char = text[idxRef.current];
      const isPunct = /[.!?]/.test(char);
      const isSemiPunct = /[;:,]/.test(char);
      const isNewline = char === "\n";

      let delay: number;
      if (isPunct)      delay = 55 + Math.random() * 35;
      else if (isSemiPunct) delay = 28 + Math.random() * 15;
      else if (isNewline)   delay = 35 + Math.random() * 20;
      else                  delay = 11 + Math.random() * 7;

      setDisplayed(text.slice(0, ++idxRef.current));
      onScroll?.();

      timerRef.current = setTimeout(type, delay);
    };

    timerRef.current = setTimeout(type, 80);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [text, isNew]);

  return (
    <div
      className="space-y-1"
      style={{ animation: isNew ? "tw-fade-up 0.25s ease-out both" : undefined }}
    >
      {renderMarkdown(done ? text : displayed)}
      {isNew && !done && (
        <span
          className="inline-block w-[2px] h-[14px] rounded-sm align-middle ml-0.5"
          style={{
            background: "rgba(0,194,168,0.85)",
            animation: "tw-cursor-blink 0.9s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}
