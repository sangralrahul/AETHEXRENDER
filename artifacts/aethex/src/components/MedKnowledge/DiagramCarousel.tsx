import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  BrachialPlexusDiagram, UpperLimbBonesDiagram,
  ActionPotentialDiagram, CardiacCycleDiagram
} from "./diagrams/AnatomyDiagrams";
import {
  MIBiomarkersDiagram, MIECGChangesDiagram,
  HeartFailureFrankStarlingDiagram, HypertensionRAASDiagram,
  CoagulationCascadeDiagram, DoseResponseCurveDiagram,
  GramStainTree
} from "./diagrams/ConditionDiagrams";

interface DiagramItem {
  title: string;
  component: React.ReactNode;
}

function getDiagrams(topicSlug: string, subjectSlug: string, conditionSlug: string, deptSlug: string): DiagramItem[] {
  const slug = topicSlug || conditionSlug || "";

  if (slug.includes("brachial-plexus") || slug.includes("upper-limb")) {
    return [
      { title: "Brachial Plexus — Complete Diagram", component: <BrachialPlexusDiagram /> },
      { title: "Bones of Upper Limb", component: <UpperLimbBonesDiagram /> },
    ];
  }
  if (slug.includes("action-potential") || slug.includes("nerve-physiology")) {
    return [{ title: "Nerve Action Potential", component: <ActionPotentialDiagram /> }];
  }
  if (slug.includes("cardiac-cycle") || slug.includes("cardiovascular-physiology")) {
    return [
      { title: "Cardiac Cycle (PV Loop)", component: <CardiacCycleDiagram /> },
      { title: "Action Potential", component: <ActionPotentialDiagram /> },
    ];
  }
  if (slug.includes("myocardial-infarction") || slug.includes("stemi") || slug.includes("nstemi")) {
    return [
      { title: "Cardiac Biomarkers Timeline", component: <MIBiomarkersDiagram /> },
      { title: "ECG Evolution After STEMI", component: <MIECGChangesDiagram /> },
      { title: "Frank-Starling Curve", component: <HeartFailureFrankStarlingDiagram /> },
    ];
  }
  if (slug.includes("heart-failure")) {
    return [
      { title: "Frank-Starling Curve (Normal vs HF)", component: <HeartFailureFrankStarlingDiagram /> },
      { title: "Cardiac Biomarkers", component: <MIBiomarkersDiagram /> },
    ];
  }
  if (slug.includes("hypertension") || slug.includes("raas")) {
    return [{ title: "RAAS — Renin-Angiotensin-Aldosterone System", component: <HypertensionRAASDiagram /> }];
  }
  if (slug.includes("coagulation") || slug.includes("thrombosis") || slug.includes("hemostasis")) {
    return [{ title: "Coagulation Cascade", component: <CoagulationCascadeDiagram /> }];
  }
  if (subjectSlug === "pharmacology" || slug.includes("dose-response") || slug.includes("pharmacodynamics")) {
    return [{ title: "Dose-Response Curves", component: <DoseResponseCurveDiagram /> }];
  }
  if (subjectSlug === "microbiology" || slug.includes("gram")) {
    return [{ title: "Gram Stain Classification Tree", component: <GramStainTree /> }];
  }
  if (subjectSlug === "physiology") {
    return [
      { title: "Action Potential", component: <ActionPotentialDiagram /> },
      { title: "Cardiac Cycle (PV Loop)", component: <CardiacCycleDiagram /> },
    ];
  }
  if (subjectSlug === "anatomy") {
    return [
      { title: "Bones of Upper Limb", component: <UpperLimbBonesDiagram /> },
      { title: "Brachial Plexus", component: <BrachialPlexusDiagram /> },
    ];
  }
  if (deptSlug === "cardiology" || deptSlug === "medicine") {
    return [
      { title: "Cardiac Biomarkers Timeline", component: <MIBiomarkersDiagram /> },
      { title: "ECG Changes (STEMI)", component: <MIECGChangesDiagram /> },
      { title: "Frank-Starling Curve", component: <HeartFailureFrankStarlingDiagram /> },
      { title: "RAAS System", component: <HypertensionRAASDiagram /> },
    ];
  }
  // Default — show a variety
  return [
    { title: "Action Potential", component: <ActionPotentialDiagram /> },
    { title: "Coagulation Cascade", component: <CoagulationCascadeDiagram /> },
    { title: "Dose-Response Curve", component: <DoseResponseCurveDiagram /> },
  ];
}

interface DiagramCarouselProps {
  topicSlug?: string;
  subjectSlug?: string;
  conditionSlug?: string;
  deptSlug?: string;
}

export function DiagramCarousel({ topicSlug = "", subjectSlug = "", conditionSlug = "", deptSlug = "" }: DiagramCarouselProps) {
  const diagrams = getDiagrams(topicSlug, subjectSlug, conditionSlug, deptSlug);
  const [active, setActive] = useState(0);

  if (diagrams.length === 0) return null;

  return (
    <div>
      {/* Diagram selector tabs */}
      {diagrams.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {diagrams.map((d, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: active === i ? "#00C2A8" : "#21262D",
                color: active === i ? "#0D1117" : "#8B949E",
                border: `1px solid ${active === i ? "#00C2A8" : "#21262D"}`,
              }}>
              {d.title}
            </button>
          ))}
        </div>
      )}

      {/* Active diagram */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#21262D" }}>
        <div className="px-4 py-2 border-b flex items-center justify-between" style={{ background: "#161B22", borderColor: "#21262D" }}>
          <span className="text-sm font-semibold" style={{ color: "#E6EDF3" }}>{diagrams[active].title}</span>
          {diagrams.length > 1 && (
            <div className="flex items-center gap-2">
              <button onClick={() => setActive(i => Math.max(0, i - 1))} disabled={active === 0}
                className="p-1 rounded-lg disabled:opacity-30 transition-all hover:bg-white/5"
                style={{ color: "#8B949E" }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs" style={{ color: "#8B949E" }}>{active + 1}/{diagrams.length}</span>
              <button onClick={() => setActive(i => Math.min(diagrams.length - 1, i + 1))} disabled={active === diagrams.length - 1}
                className="p-1 rounded-lg disabled:opacity-30 transition-all hover:bg-white/5"
                style={{ color: "#8B949E" }}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div className="p-4" style={{ background: "#0D1117" }}>
          {diagrams[active].component}
        </div>
      </div>
    </div>
  );
}
