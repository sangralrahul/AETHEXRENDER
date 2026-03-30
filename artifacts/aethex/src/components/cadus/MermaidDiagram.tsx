import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";

let initialized = false;
function initMermaid() {
  if (initialized) return;
  initialized = true;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
      primaryColor: "#00BCD4",
      primaryTextColor: "#ffffff",
      primaryBorderColor: "#007C91",
      lineColor: "#00BCD4",
      secondaryColor: "#1a1f4e",
      tertiaryColor: "#0A0F2C",
      background: "#0A0F2C",
      nodeBorder: "#00BCD4",
      clusterBkg: "#1a1f4e",
      titleColor: "#00E5FF",
      edgeLabelBackground: "#0A0F2C",
      fontFamily: "Inter, DM Sans, sans-serif",
    },
    flowchart: { curve: "basis", padding: 12, nodeSpacing: 40, rankSpacing: 48 },
    mindmap: { padding: 12 },
  });
}

let counter = 0;

export default function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useRef(`mm-${++counter}`);
  const [error, setError] = useState(false);

  useEffect(() => {
    initMermaid();
    if (!ref.current || !chart) return;
    setError(false);
    const target = ref.current;
    mermaid
      .render(id.current, chart)
      .then(({ svg }) => {
        if (target) {
          target.innerHTML = svg;
          const svgEl = target.querySelector("svg");
          if (svgEl) {
            svgEl.style.width = "100%";
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
          }
        }
      })
      .catch(() => setError(true));
  }, [chart]);

  if (error) {
    return (
      <div style={{ color: "rgba(0,188,212,0.4)", fontSize: 11, textAlign: "center", padding: 16 }}>
        Diagram rendering — check diagram syntax
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{ width: "100%", minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center" }}
    />
  );
}
