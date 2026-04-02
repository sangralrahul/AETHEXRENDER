import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  BrachialPlexusDiagram, UpperLimbBonesDiagram,
  ActionPotentialDiagram, CardiacCycleDiagram
} from "./diagrams/AnatomyDiagrams";
import {
  LowerLimbBonesDiagram, VertebralColumnDiagram, ThoraxSkeletonDiagram,
  SkullDiagram, BrainLateralDiagram, HeartAnatomyDiagram,
  AbdomenRegionsDiagram, CranialNervesDiagram
} from "./diagrams/AnatomyDiagrams2";
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

  /* ─────────────────────────────────────────────
     ANATOMY — topic-specific routing
     ───────────────────────────────────────────── */

  // Upper Limb
  if (slug === "upper-limb" || slug.includes("brachial-plexus")) {
    return [
      { title: "Bones of Upper Limb", component: <UpperLimbBonesDiagram /> },
      { title: "Brachial Plexus", component: <BrachialPlexusDiagram /> },
    ];
  }

  // Lower Limb
  if (slug === "lower-limb" || slug.includes("femur") || slug.includes("knee")) {
    return [
      { title: "Bones of Lower Limb", component: <LowerLimbBonesDiagram /> },
    ];
  }

  // Head & Neck / Skull
  if (slug === "head-neck" || slug.includes("head") || slug.includes("skull") ||
      slug === "nose-paranasal-sinuses" || slug === "pharynx-larynx" ||
      slug === "salivary-glands" || slug === "thyroid-parathyroid" ||
      slug === "eye-orbit" || slug === "ear-external-middle-inner") {
    return [
      { title: "Skull — Lateral View", component: <SkullDiagram /> },
      { title: "Cranial Nerves I–XII", component: <CranialNervesDiagram /> },
    ];
  }

  // Thorax
  if (slug === "thorax" || slug === "respiratory-anatomy" ||
      slug.includes("rib") || slug.includes("sternum")) {
    return [
      { title: "Thorax Skeleton", component: <ThoraxSkeletonDiagram /> },
    ];
  }

  // Back & Vertebral Column / Spine
  if (slug === "back-vertebral-column" || slug.includes("vertebral") ||
      slug.includes("spinal") || slug.includes("lumbar") || slug.includes("cervical")) {
    return [
      { title: "Vertebral Column", component: <VertebralColumnDiagram /> },
      { title: "Spinal Cord Anatomy", component: <ActionPotentialDiagram /> },
    ];
  }

  // Neuroanatomy / Brain
  if (slug === "neuroanatomy" || slug === "cerebral-cortex-lobes" ||
      slug === "brainstem-cerebellum" || slug === "basal-ganglia" ||
      slug === "thalamus-hypothalamus" || slug === "ventricular-system-csf") {
    return [
      { title: "Brain — Lateral View", component: <BrainLateralDiagram /> },
      { title: "Nerve Action Potential", component: <ActionPotentialDiagram /> },
    ];
  }

  // Cranial Nerves
  if (slug === "cranial-nerves" || slug === "autonomic-nervous-system" ||
      slug === "peripheral-nervous-system") {
    return [
      { title: "12 Cranial Nerves", component: <CranialNervesDiagram /> },
      { title: "Brachial Plexus (PNS)", component: <BrachialPlexusDiagram /> },
    ];
  }

  // Cardiovascular Anatomy / Heart
  if (slug === "cardiovascular-anatomy" || slug === "heart-pericardium" ||
      slug === "great-vessels" || slug === "fetal-circulation") {
    return [
      { title: "Heart Anatomy", component: <HeartAnatomyDiagram /> },
      { title: "Cardiac Cycle", component: <CardiacCycleDiagram /> },
    ];
  }

  // Abdomen
  if (slug === "abdomen" || slug === "digestive-system-anatomy" ||
      slug === "liver-biliary-system") {
    return [
      { title: "Abdominal Regions & Organs", component: <AbdomenRegionsDiagram /> },
    ];
  }

  // Pelvis & Perineum / Urogenital / Reproductive
  if (slug === "pelvis-perineum" || slug === "urogenital-anatomy" ||
      slug === "kidney-ureter" || slug === "bladder-urethra" ||
      slug === "male-reproductive-anatomy" || slug === "female-reproductive-anatomy") {
    return [
      { title: "Abdominal & Pelvic Regions", component: <AbdomenRegionsDiagram /> },
      { title: "Vertebral Column", component: <VertebralColumnDiagram /> },
    ];
  }

  // Osteology / Joints / Musculoskeletal
  if (slug === "osteology-bones" || slug === "joints-ligaments" ||
      slug === "musculoskeletal-system") {
    return [
      { title: "Upper Limb Bones", component: <UpperLimbBonesDiagram /> },
      { title: "Lower Limb Bones", component: <LowerLimbBonesDiagram /> },
      { title: "Vertebral Column", component: <VertebralColumnDiagram /> },
    ];
  }

  /* ─────────────────────────────────────────────
     PHYSIOLOGY — topic-specific routing
     ───────────────────────────────────────────── */
  if (slug.includes("action-potential") || slug.includes("nerve-physiology") ||
      slug === "nerve-physiology-action-potential" || slug.includes("cell-physiology")) {
    return [{ title: "Nerve Action Potential", component: <ActionPotentialDiagram /> }];
  }
  if (slug.includes("cardiac-cycle") || slug === "cardiac-cycle-ecg" ||
      slug.includes("cardiovascular-physiology")) {
    return [
      { title: "Cardiac Cycle (PV Loop)", component: <CardiacCycleDiagram /> },
      { title: "Action Potential", component: <ActionPotentialDiagram /> },
    ];
  }

  /* ─────────────────────────────────────────────
     CLINICAL — condition-specific routing
     ───────────────────────────────────────────── */
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

  /* ─────────────────────────────────────────────
     SUBJECT-LEVEL fallbacks
     ───────────────────────────────────────────── */
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
    // Generic anatomy fallback — show variety, NOT always upper limb
    return [
      { title: "Upper Limb Bones", component: <UpperLimbBonesDiagram /> },
      { title: "Lower Limb Bones", component: <LowerLimbBonesDiagram /> },
      { title: "Vertebral Column", component: <VertebralColumnDiagram /> },
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
  if (deptSlug === "neurology") {
    return [
      { title: "Brain — Lateral View", component: <BrainLateralDiagram /> },
      { title: "Cranial Nerves", component: <CranialNervesDiagram /> },
      { title: "Action Potential", component: <ActionPotentialDiagram /> },
    ];
  }
  if (deptSlug === "orthopedics" || deptSlug === "orthopedics-dept") {
    return [
      { title: "Upper Limb Bones", component: <UpperLimbBonesDiagram /> },
      { title: "Lower Limb Bones", component: <LowerLimbBonesDiagram /> },
      { title: "Vertebral Column", component: <VertebralColumnDiagram /> },
    ];
  }

  // Default — show a clinical variety
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
