export function BrachialPlexusDiagram() {
  return (
    <svg viewBox="0 0 800 550" className="w-full" style={{ background: "#1C2128", borderRadius: 12 }}>
      <title>Brachial Plexus — Roots, Trunks, Divisions, Cords, Branches</title>
      {/* Grid */}
      {[0,1,2,3,4].map(i => <line key={`v${i}`} x1={160+i*140} y1="40" x2={160+i*140} y2="510" stroke="#21262D" strokeWidth="1" />)}
      {/* Header labels */}
      {[["Roots","160"],["Trunks","300"],["Divs","430"],["Cords","560"],["Branches","700"]].map(([l,x]) => (
        <text key={l} x={x} y="30" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#8B949E">{l}</text>
      ))}

      {/* Roots C5-T1 */}
      {[["C5","50"],["C6","120"],["C7","190"],["C8","290"],["T1","360"]].map(([r,y]) => (
        <g key={r}>
          <circle cx="100" cy={y} r="22" fill="#00C2A8" fillOpacity="0.2" stroke="#00C2A8" strokeWidth="2" />
          <text x="100" y={Number(y)+5} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#00C2A8">{r}</text>
        </g>
      ))}

      {/* Upper trunk (C5+C6) */}
      <line x1="122" y1="50" x2="250" y2="100" stroke="#3B82F6" strokeWidth="2.5" />
      <line x1="122" y1="120" x2="250" y2="100" stroke="#3B82F6" strokeWidth="2.5" />
      <rect x="220" y="82" width="80" height="36" rx="8" fill="#3B82F6" fillOpacity="0.2" stroke="#3B82F6" strokeWidth="1.5" />
      <text x="260" y="97" textAnchor="middle" fontSize="11" fill="#E6EDF3">Upper</text>
      <text x="260" y="110" textAnchor="middle" fontSize="11" fill="#E6EDF3">Trunk</text>

      {/* Middle trunk (C7) */}
      <line x1="122" y1="190" x2="250" y2="200" stroke="#8B5CF6" strokeWidth="2.5" />
      <rect x="220" y="182" width="80" height="36" rx="8" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="1.5" />
      <text x="260" y="197" textAnchor="middle" fontSize="11" fill="#E6EDF3">Middle</text>
      <text x="260" y="210" textAnchor="middle" fontSize="11" fill="#E6EDF3">Trunk</text>

      {/* Lower trunk (C8+T1) */}
      <line x1="122" y1="290" x2="250" y2="310" stroke="#F59E0B" strokeWidth="2.5" />
      <line x1="122" y1="360" x2="250" y2="310" stroke="#F59E0B" strokeWidth="2.5" />
      <rect x="220" y="292" width="80" height="36" rx="8" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="260" y="307" textAnchor="middle" fontSize="11" fill="#E6EDF3">Lower</text>
      <text x="260" y="320" textAnchor="middle" fontSize="11" fill="#E6EDF3">Trunk</text>

      {/* Divisions — Anterior/Posterior from each trunk */}
      {[[100,"A"],[218,"P"],[200,"A"],[218,"P"],[310,"A"],[318,"P"]].map(([y,type],i) => {
        const cx = 400;
        const color = type === "A" ? "#00C2A8" : "#EC4899";
        return (
          <g key={i}>
            <circle cx={cx} cy={Number(y)+40} r="12" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
            <text x={cx} y={Number(y)+45} textAnchor="middle" fontSize="10" fill={color}>{type}</text>
          </g>
        );
      })}

      {/* Posterior Cord */}
      <line x1="412" y1="258" x2="520" y2="180" stroke="#EC4899" strokeWidth="2" />
      <line x1="412" y1="258" x2="520" y2="180" stroke="#EC4899" strokeWidth="2" />
      <rect x="490" y="162" width="90" height="36" rx="8" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="1.5" />
      <text x="535" y="177" textAnchor="middle" fontSize="11" fill="#E6EDF3">Posterior</text>
      <text x="535" y="190" textAnchor="middle" fontSize="11" fill="#E6EDF3">Cord</text>

      {/* Lateral Cord */}
      <rect x="490" y="232" width="90" height="36" rx="8" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="1.5" />
      <text x="535" y="247" textAnchor="middle" fontSize="11" fill="#E6EDF3">Lateral</text>
      <text x="535" y="260" textAnchor="middle" fontSize="11" fill="#E6EDF3">Cord</text>

      {/* Medial Cord */}
      <rect x="490" y="302" width="90" height="36" rx="8" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="535" y="317" textAnchor="middle" fontSize="11" fill="#E6EDF3">Medial</text>
      <text x="535" y="330" textAnchor="middle" fontSize="11" fill="#E6EDF3">Cord</text>

      {/* Terminal Branches */}
      {[
        ["Axillary","#EC4899","80"],
        ["Radial","#EC4899","140"],
        ["Musculocutaneous","#3B82F6","200"],
        ["Median (Lat.)","#3B82F6","260"],
        ["Median (Med.)","#F59E0B","310"],
        ["Ulnar","#F59E0B","370"],
        ["Med. Cutaneous","#F59E0B","420"],
      ].map(([name, color, y]) => (
        <g key={name}>
          <line x1="580" y1="200" x2="650" y2={Number(y)+15} stroke={color as string} strokeWidth="1.5" strokeDasharray="4,2" />
          <rect x="650" y={y} width="130" height="30" rx="6" fill={color as string} fillOpacity="0.12" stroke={color as string} strokeWidth="1" />
          <text x="715" y={Number(y)+19} textAnchor="middle" fontSize="10" fill="#E6EDF3">{name}</text>
        </g>
      ))}

      {/* Legend */}
      <g transform="translate(30,430)">
        <text x="0" y="0" fontSize="12" fontWeight="bold" fill="#8B949E">Legend</text>
        {[["Upper Trunk / Lateral","#3B82F6"],["Lower Trunk / Medial","#F59E0B"],["Posterior Cord","#EC4899"]].map(([l,c],i) => (
          <g key={l} transform={`translate(0,${18+i*18})`}>
            <rect x="0" y="-12" width="20" height="12" rx="3" fill={c} fillOpacity="0.4" />
            <text x="26" y="0" fontSize="11" fill="#8B949E">{l}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function UpperLimbBonesDiagram() {
  return (
    <svg viewBox="0 0 500 620" className="w-full" style={{ background: "#1C2128", borderRadius: 12 }}>
      <title>Bones of the Upper Limb</title>
      {/* Clavicle */}
      <ellipse cx="250" cy="55" rx="90" ry="10" fill="none" stroke="#00C2A8" strokeWidth="3" />
      <text x="180" y="45" fontSize="11" fill="#8B949E">Clavicle</text>
      {/* Scapula */}
      <path d="M200,70 Q230,100 260,130 Q240,120 200,115 Z" fill="#00C2A8" fillOpacity="0.2" stroke="#00C2A8" strokeWidth="2" />
      <text x="195" y="90" fontSize="10" fill="#8B949E">Scapula</text>
      {/* Humerus */}
      <rect x="222" y="130" width="55" height="170" rx="28" fill="#00C2A8" fillOpacity="0.25" stroke="#00C2A8" strokeWidth="2.5" />
      <text x="290" y="215" fontSize="12" fill="#8B949E">Humerus</text>
      <text x="290" y="230" fontSize="10" fill="#8B949E">(arm)</text>
      {/* Radius */}
      <rect x="228" y="310" width="22" height="130" rx="11" fill="#3B82F6" fillOpacity="0.25" stroke="#3B82F6" strokeWidth="2" />
      <text x="200" y="350" fontSize="11" fill="#8B949E">Radius</text>
      {/* Ulna */}
      <rect x="256" y="305" width="22" height="135" rx="11" fill="#8B5CF6" fillOpacity="0.25" stroke="#8B5CF6" strokeWidth="2" />
      <text x="282" y="350" fontSize="11" fill="#8B949E">Ulna</text>
      {/* Olecranon label */}
      <circle cx="267" cy="305" r="12" fill="#8B5CF6" fillOpacity="0.3" stroke="#8B5CF6" strokeWidth="1.5" />
      <text x="267" y="295" fontSize="9" textAnchor="middle" fill="#8B5CF6">Olec.</text>
      {/* Carpals */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <rect key={i} x={210+i*13} y="448" width="12" height="12" rx="3" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="1" />
      ))}
      <text x="240" y="476" fontSize="10" textAnchor="middle" fill="#8B949E">8 Carpal Bones</text>
      <text x="240" y="488" fontSize="9" textAnchor="middle" fill="#8B949E">Scaphoid · Lunate · Triquetrum · Pisiform</text>
      <text x="240" y="500" fontSize="9" textAnchor="middle" fill="#8B949E">Trapezium · Trapezoid · Capitate · Hamate</text>
      {/* Metacarpals */}
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={213+i*17} y="508" width="11" height="40" rx="5" fill="#00C2A8" fillOpacity="0.2" stroke="#00C2A8" strokeWidth="1" />
      ))}
      <text x="240" y="560" fontSize="10" textAnchor="middle" fill="#8B949E">Metacarpals (I–V)</text>
      {/* Phalanges */}
      {[0,1,2,3,4].map(i => (
        <g key={i}>
          <rect x={213+i*17} y="552" width="11" height="18" rx="4" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="1" />
          <rect x={213+i*17} y="573" width="11" height="15" rx="3" fill="#EC4899" fillOpacity="0.15" stroke="#EC4899" strokeWidth="1" />
          {i > 0 && <rect x={213+i*17} y="591" width="11" height="13" rx="3" fill="#EC4899" fillOpacity="0.1" stroke="#EC4899" strokeWidth="1" />}
        </g>
      ))}
      <text x="240" y="612" fontSize="10" textAnchor="middle" fill="#8B949E">Proximal · Middle · Distal Phalanges</text>
      {/* Joint labels */}
      <text x="350" y="135" fontSize="10" fill="#8B949E">Shoulder Joint</text>
      <text x="350" y="310" fontSize="10" fill="#8B949E">Elbow Joint</text>
      <text x="350" y="450" fontSize="10" fill="#8B949E">Wrist Joint</text>
    </svg>
  );
}

export function ActionPotentialDiagram() {
  return (
    <svg viewBox="0 0 600 360" className="w-full" style={{ background: "#1C2128", borderRadius: 12 }}>
      <title>Nerve Action Potential — Phases</title>
      {/* Grid */}
      {[0,1,2,3,4,5].map(i => <line key={`h${i}`} x1="60" y1={60+i*50} x2="560" y2={60+i*50} stroke="#21262D" strokeWidth="1" />)}
      {/* Y-axis */}
      <line x1="80" y1="40" x2="80" y2="340" stroke="#8B949E" strokeWidth="2" />
      {/* X-axis */}
      <line x1="80" y1="220" x2="560" y2="220" stroke="#8B949E" strokeWidth="2" />
      {/* Y labels */}
      {[["+40","100"],["+20","140"],["0","180"],["-20","220"],["-40","260"],["-65","300"],["-90","340"]].map(([v,y]) => (
        <text key={v} x="68" y={Number(y)+5} fontSize="10" textAnchor="end" fill="#8B949E">{v}</text>
      ))}
      <text x="30" y="190" fontSize="11" fontWeight="bold" fill="#8B949E" transform="rotate(-90,30,190)">mV</text>
      <text x="320" y="355" fontSize="11" textAnchor="middle" fill="#8B949E">Time (ms)</text>

      {/* Resting potential line */}
      <line x1="80" y1="300" x2="560" y2="300" stroke="#3B82F6" strokeWidth="1" strokeDasharray="5,3" />

      {/* Action Potential curve */}
      <path d="M80,300 L150,300 L165,300 C170,300 175,260 180,180 C185,140 188,110 192,100 C196,110 200,180 205,240 C210,280 215,300 220,300 C225,300 235,310 240,310 C255,310 260,300 290,300 L560,300"
        fill="none" stroke="#00C2A8" strokeWidth="3" />

      {/* Phase labels */}
      <line x1="150" y1="40" x2="150" y2="300" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3,2" />
      <text x="150" y="38" textAnchor="middle" fontSize="10" fill="#F59E0B">Threshold</text>

      <line x1="192" y1="40" x2="192" y2="100" stroke="#EC4899" strokeWidth="1" strokeDasharray="3,2" />
      <text x="192" y="38" textAnchor="middle" fontSize="10" fill="#EC4899">Peak</text>
      <text x="192" y="50" textAnchor="middle" fontSize="9" fill="#8B949E">+40mV</text>

      {/* Annotations */}
      {[
        [130,250,"Depolarization","#00C2A8",0],
        [205,170,"Repolarization","#3B82F6",0],
        [240,320,"Hyperpolarization","#F59E0B",0],
        [320,290,"Resting (-65mV)","#8B949E",0],
      ].map(([x,y,label,color,_]) => (
        <text key={label as string} x={x} y={y} fontSize="10" fill={color as string}>{label as string}</text>
      ))}

      {/* Sodium channels */}
      <text x="170" y="130" fontSize="9" fill="#8B949E">Na⁺ influx</text>
      <text x="205" y="200" fontSize="9" fill="#8B949E">K⁺ efflux</text>

      {/* Refractory period */}
      <rect x="200" y="280" width="60" height="20" rx="4" fill="#F59E0B" fillOpacity="0.1" stroke="#F59E0B" strokeWidth="1" />
      <text x="230" y="294" textAnchor="middle" fontSize="9" fill="#F59E0B">Absolute Ref.</text>
      <rect x="260" y="280" width="50" height="20" rx="4" fill="#EC4899" fillOpacity="0.1" stroke="#EC4899" strokeWidth="1" />
      <text x="285" y="294" textAnchor="middle" fontSize="9" fill="#EC4899">Rel. Ref.</text>
    </svg>
  );
}

export function CardiacCycleDiagram() {
  return (
    <svg viewBox="0 0 650 380" className="w-full" style={{ background: "#1C2128", borderRadius: 12 }}>
      <title>Cardiac Cycle — Pressure Volume Relationships</title>
      {/* Axes */}
      <line x1="80" y1="40" x2="80" y2="340" stroke="#8B949E" strokeWidth="2" />
      <line x1="80" y1="340" x2="600" y2="340" stroke="#8B949E" strokeWidth="2" />
      {/* Labels */}
      <text x="30" y="200" fontSize="11" fill="#8B949E" transform="rotate(-90,30,200)">Pressure (mmHg)</text>
      <text x="340" y="365" fontSize="11" textAnchor="middle" fill="#8B949E">Volume (mL)</text>
      {/* Grid */}
      {[40,80,120,160,200].map(v => (
        <g key={v}>
          <line x1="80" y1={340-v*1.2} x2="600" y2={340-v*1.2} stroke="#21262D" strokeWidth="1" />
          <text x="72" y={344-v*1.2} textAnchor="end" fontSize="9" fill="#8B949E">{v}</text>
        </g>
      ))}
      {[50,100,150].map(v => (
        <g key={v}>
          <line x1={80+v*2.8} y1="40" x2={80+v*2.8} y2="340" stroke="#21262D" strokeWidth="1" />
          <text x={80+v*2.8} y="352" textAnchor="middle" fontSize="9" fill="#8B949E">{v}</text>
        </g>
      ))}

      {/* P-V Loop (normal) */}
      <path d="M220,330 L220,190 C220,180 240,180 260,180 C300,180 360,200 380,180 C400,175 420,170 420,100 C420,90 380,88 360,90 C300,95 240,160 220,180 Z"
        fill="none" stroke="#00C2A8" strokeWidth="2.5" />

      {/* Phase labels */}
      <text x="400" y="160" fontSize="10" fill="#00C2A8">Isovolumetric</text>
      <text x="400" y="173" fontSize="10" fill="#00C2A8">Contraction</text>
      <text x="300" y="90" fontSize="10" fill="#EC4899">Ejection Phase</text>
      <text x="235" y="270" fontSize="10" fill="#3B82F6">Isovolumetric</text>
      <text x="235" y="283" fontSize="10" fill="#3B82F6">Relaxation</text>
      <text x="290" y="200" fontSize="10" fill="#F59E0B">Filling</text>

      {/* EDV/ESV labels */}
      <text x="218" y="342" textAnchor="middle" fontSize="10" fill="#8B949E">ESV</text>
      <text x="420" y="342" textAnchor="middle" fontSize="10" fill="#8B949E">EDV</text>
      <line x1="218" y1="338" x2="218" y2="330" stroke="#8B949E" strokeWidth="1" />
      <line x1="420" y1="338" x2="420" y2="330" stroke="#8B949E" strokeWidth="1" />

      {/* SV arrow */}
      <line x1="218" y1="355" x2="420" y2="355" stroke="#00C2A8" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <text x="319" y="368" textAnchor="middle" fontSize="10" fill="#00C2A8">Stroke Volume ~70mL</text>
    </svg>
  );
}
