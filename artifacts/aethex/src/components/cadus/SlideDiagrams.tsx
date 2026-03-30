import React from "react";

function wrapLabel(text: string, maxLen = 16): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (test.length > maxLen && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

export function ConceptMapSVG({ nodes, edges }: { nodes: string[]; edges: [number, number][] }) {
  if (!nodes.length) return null;
  const W = 340, H = 220;
  const cx = W / 2, cy = H / 2;
  const RX = 130, RY = 80;
  const center = nodes[0];
  const satellites = nodes.slice(1, 7);
  const n = satellites.length || 1;
  const positions = [{ x: cx, y: cy }, ...satellites.map((_, i) => ({
    x: cx + Math.cos((i / n) * 2 * Math.PI - Math.PI / 2) * RX,
    y: cy + Math.sin((i / n) * 2 * Math.PI - Math.PI / 2) * RY,
  }))];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="mx-auto">
      {edges.map(([a, b], i) => {
        const pa = positions[a] ?? positions[0], pb = positions[b] ?? positions[1];
        return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#00BCD4" strokeWidth={1.5} strokeOpacity={0.5} />;
      })}
      {positions.map((pos, i) => {
        const label = i === 0 ? center : (satellites[i - 1] ?? "");
        const lines = wrapLabel(label, i === 0 ? 14 : 12);
        const bw = i === 0 ? 90 : 78, bh = i === 0 ? 28 : 24;
        return (
          <g key={i}>
            <rect x={pos.x - bw / 2 + 2} y={pos.y - bh / 2 + 2} width={bw} height={bh} rx={4} fill="#00BCD4" fillOpacity={0.25} />
            <rect x={pos.x - bw / 2} y={pos.y - bh / 2} width={bw} height={bh} rx={4}
              fill={i === 0 ? "#00BCD4" : "#0D2137"} stroke="#00BCD4" strokeWidth={i === 0 ? 0 : 1} />
            {lines.map((ln, li) => (
              <text key={li} x={pos.x} y={pos.y - (lines.length - 1) * 6 + li * 12 + 4}
                textAnchor="middle" fill="white" fontSize={i === 0 ? 8 : 7} fontWeight={i === 0 ? "bold" : "normal"}>
                {ln}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function FlowchartSVG({ nodes, edges }: { nodes: string[]; edges: [number, number][] }) {
  if (!nodes.length) return null;
  const boxW = 160, boxH = 32, gapY = 52, W = 260;
  const H = nodes.slice(0, 6).length * gapY + 20;
  const xs = nodes.slice(0, 6).map(() => W / 2);
  const ys = nodes.slice(0, 6).map((_, i) => 20 + i * gapY);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="mx-auto">
      {nodes.slice(0, 5).map((_, i) => (
        <g key={i}>
          <line x1={xs[i]} y1={ys[i] + boxH / 2} x2={xs[i + 1]} y2={ys[i + 1] - boxH / 2}
            stroke="#00BCD4" strokeWidth={1.5} strokeOpacity={0.7} markerEnd="url(#arr)" />
        </g>
      ))}
      <defs>
        <marker id="arr" markerWidth={6} markerHeight={6} refX={3} refY={3} orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#00BCD4" />
        </marker>
      </defs>
      {nodes.slice(0, 6).map((node, i) => {
        const lines = wrapLabel(node, 20);
        return (
          <g key={i}>
            <rect x={xs[i] - boxW / 2 + 2} y={ys[i] - boxH / 2 + 2} width={boxW} height={boxH} rx={6} fill="#00BCD4" fillOpacity={0.2} />
            <rect x={xs[i] - boxW / 2} y={ys[i] - boxH / 2} width={boxW} height={boxH} rx={6}
              fill={i === 0 || i === nodes.slice(0, 6).length - 1 ? "#00BCD4" : "#0D2137"}
              stroke="#00BCD4" strokeWidth={1} />
            {lines.map((ln, li) => (
              <text key={li} x={xs[i]} y={ys[i] + li * 11 - (lines.length - 1) * 5.5 + 4}
                textAnchor="middle" fill="white" fontSize={8} fontWeight={i === 0 ? "bold" : "normal"}>
                {ln}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function PathwaySVG({ nodes, edges }: { nodes: string[]; edges: [number, number][] }) {
  if (!nodes.length) return null;
  const W = 320, H = 200;
  const n = Math.min(nodes.length, 6);
  const positions: { x: number; y: number }[] = [];
  if (n === 1) { positions.push({ x: W / 2, y: H / 2 }); }
  else if (n === 2) { positions.push({ x: 80, y: H / 2 }, { x: W - 80, y: H / 2 }); }
  else if (n === 3) { positions.push({ x: W / 2, y: 35 }, { x: 70, y: H - 40 }, { x: W - 70, y: H - 40 }); }
  else if (n === 4) { positions.push({ x: W / 2, y: 35 }, { x: 60, y: H / 2 }, { x: W - 60, y: H / 2 }, { x: W / 2, y: H - 35 }); }
  else {
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
      positions.push({ x: W / 2 + Math.cos(angle) * 110, y: H / 2 + Math.sin(angle) * 72 });
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="mx-auto">
      <defs>
        <marker id="arrowP" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#00BCD4" />
        </marker>
      </defs>
      {edges.slice(0, 8).map(([a, b], i) => {
        const pa = positions[a], pb = positions[b];
        if (!pa || !pb) return null;
        return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
          stroke="#00BCD4" strokeWidth={1.5} strokeOpacity={0.6} markerEnd="url(#arrowP)" />;
      })}
      {positions.slice(0, n).map((pos, i) => {
        const lines = wrapLabel(nodes[i] ?? "", 13);
        const bw = 76, bh = 24;
        return (
          <g key={i}>
            <rect x={pos.x - bw / 2 + 2} y={pos.y - bh / 2 + 2} width={bw} height={bh} rx={5} fill="#00BCD4" fillOpacity={0.2} />
            <rect x={pos.x - bw / 2} y={pos.y - bh / 2} width={bw} height={bh} rx={5} fill="#0D2137" stroke="#00BCD4" strokeWidth={1} />
            {lines.map((ln, li) => (
              <text key={li} x={pos.x} y={pos.y - (lines.length - 1) * 5.5 + li * 11 + 4}
                textAnchor="middle" fill="white" fontSize={7} fontWeight="normal">
                {ln}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function MindMapFullSVG({ center, nodes }: { center: string; nodes: string[] }) {
  const W = 580, H = 340;
  const cx = W / 2, cy = H / 2;
  const n = Math.min(nodes.length, 8);
  const RX = 220, RY = 135;
  const positions = nodes.slice(0, n).map((_, i) => ({
    x: cx + Math.cos((i / n) * 2 * Math.PI - Math.PI / 2) * RX,
    y: cy + Math.sin((i / n) * 2 * Math.PI - Math.PI / 2) * RY,
  }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" className="max-h-full">
      {positions.map((pos, i) => (
        <g key={i}>
          <line x1={cx} y1={cy} x2={pos.x} y2={pos.y} stroke="#00BCD4" strokeWidth={2} strokeOpacity={0.4} strokeDasharray="4,3" />
          <circle cx={pos.x} cy={pos.y} r={5} fill="#00BCD4" />
        </g>
      ))}
      <rect x={cx - 68} y={cy - 22} width={136} height={44} rx={8} fill="#00BCD4" fillOpacity={0.2} />
      <rect x={cx - 70} y={cy - 24} width={140} height={48} rx={8} fill="#00BCD4" />
      {wrapLabel(center, 16).map((ln, i, arr) => (
        <text key={i} x={cx} y={cy - (arr.length - 1) * 8 + i * 16 + 5}
          textAnchor="middle" fill="white" fontSize={12} fontWeight="bold">{ln}</text>
      ))}
      {positions.slice(0, n).map((pos, i) => {
        const lines = wrapLabel(nodes[i] ?? "", 14);
        const bw = 108, bh = lines.length > 1 ? 36 : 26;
        return (
          <g key={i}>
            <rect x={pos.x - bw / 2 + 2} y={pos.y - bh / 2 + 2} width={bw} height={bh} rx={6} fill="#00BCD4" fillOpacity={0.22} />
            <rect x={pos.x - bw / 2} y={pos.y - bh / 2} width={bw} height={bh} rx={6} fill="#0A1A2F" stroke="#00BCD4" strokeWidth={1.5} />
            <rect x={pos.x - bw / 2} y={pos.y - bh / 2} width={bw} height={3} rx={2} fill="#00BCD4" />
            {lines.map((ln, li) => (
              <text key={li} x={pos.x} y={pos.y - (lines.length - 1) * 7 + li * 14 + 6}
                textAnchor="middle" fill="#E2F6FF" fontSize={9} fontWeight="500">{ln}</text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
