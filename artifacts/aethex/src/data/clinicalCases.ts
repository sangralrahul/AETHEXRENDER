export interface ClinicalCase {
  id: number;
  date: string;
  title: string;
  patient_info: {
    age: number;
    gender: "Male" | "Female";
    occupation?: string;
    chief_complaint: string;
  };
  history: string;
  vitals: {
    bp?: string;
    hr?: string;
    rr?: string;
    temp?: string;
    spo2?: string;
    rbs?: string;
  };
  investigations: {
    label: string;
    value: string;
    note?: string;
  }[];
  options: {
    id: "A" | "B" | "C" | "D";
    text: string;
  }[];
  correct_answer: "A" | "B" | "C" | "D";
  explanation: string;
  specialty: string;
}

export const clinicalCases: ClinicalCase[] = [
  {
    id: 1,
    date: "2024-01-01",
    title: "Chest Pain with ST Elevation",
    specialty: "Cardiology",
    patient_info: {
      age: 58,
      gender: "Male",
      occupation: "Taxi driver",
      chief_complaint: "Severe crushing chest pain radiating to the left arm for 45 minutes",
    },
    history:
      "Patient is a known hypertensive and diabetic on irregular treatment. He developed sudden onset severe retrosternal chest pain radiating to the left arm and jaw while driving. Associated with profuse sweating, nausea, and breathlessness. No prior anginal episodes.",
    vitals: {
      bp: "90/60 mmHg",
      hr: "110 bpm (irregular)",
      rr: "24/min",
      temp: "37.2°C",
      spo2: "92% on room air",
    },
    investigations: [
      { label: "ECG", value: "ST elevation in leads II, III, aVF; reciprocal ST depression in I, aVL", note: "Inferior STEMI pattern" },
      { label: "Troponin I", value: "4.8 ng/mL", note: "Normal < 0.04 ng/mL" },
      { label: "CK-MB", value: "68 U/L", note: "Normal 5–25 U/L" },
      { label: "Blood glucose", value: "248 mg/dL" },
      { label: "Chest X-ray", value: "Mild pulmonary venous congestion" },
      { label: "Echo (bedside)", value: "Inferior wall hypokinesia, EF 38%" },
    ],
    options: [
      { id: "A", text: "Inferior STEMI due to right coronary artery occlusion" },
      { id: "B", text: "Aortic dissection with inferior wall involvement" },
      { id: "C", text: "Pulmonary embolism with right heart strain" },
      { id: "D", text: "Hypertensive emergency with demand ischemia" },
    ],
    correct_answer: "A",
    explanation:
      "This is a classic Inferior STEMI. ST elevation in leads II, III, and aVF with reciprocal changes in I and aVL is the hallmark of inferior MI, most commonly caused by occlusion of the Right Coronary Artery (RCA) in ~80% of cases. Elevated Troponin I and CK-MB confirm myocardial necrosis. Inferior wall hypokinesia on echo and cardiogenic shock (BP 90/60) further support the diagnosis. Immediate primary PCI within 90 minutes (door-to-balloon) is the treatment of choice. Aortic dissection would show a widened mediastinum; PE would show right heart strain on echo; Hypertensive emergency is unlikely given his current low BP.",
  },
  {
    id: 2,
    date: "2024-01-02",
    title: "Sudden Severe Headache",
    specialty: "Neurology",
    patient_info: {
      age: 42,
      gender: "Female",
      occupation: "Teacher",
      chief_complaint: "Sudden onset 'worst headache of my life' — 8/10 intensity, started while exercising",
    },
    history:
      "Patient was exercising at the gym when she suddenly developed the most severe headache of her life, reaching peak intensity within seconds. Associated with one episode of vomiting and mild photophobia. No prior history of migraines. No focal neurological deficits on examination. Neck stiffness present on examination (Kernig's and Brudzinski's signs positive).",
    vitals: {
      bp: "162/98 mmHg",
      hr: "92 bpm",
      rr: "18/min",
      temp: "37.4°C",
      spo2: "98% on room air",
    },
    investigations: [
      { label: "CT Brain (non-contrast)", value: "Hyperdensity in basal cisterns and sylvian fissures", note: "Fisher Grade 3" },
      { label: "CSF (LP)", value: "Xanthochromia present; RBC 15,000/μL; WBC 12/μL; Protein 68 mg/dL" },
      { label: "Serum Na⁺", value: "138 mEq/L" },
      { label: "CBC", value: "WBC 11,200/μL; Hb 13.2 g/dL; Platelets 2.1 lakh/μL" },
    ],
    options: [
      { id: "A", text: "Subarachnoid Haemorrhage (SAH) from ruptured intracranial aneurysm" },
      { id: "B", text: "Bacterial meningitis (Streptococcus pneumoniae)" },
      { id: "C", text: "Hypertensive encephalopathy" },
      { id: "D", text: "Migraine with aura and complicated presentation" },
    ],
    correct_answer: "A",
    explanation:
      "The 'thunderclap headache' — reaching peak intensity within seconds during exertion — is pathognomonic for Subarachnoid Haemorrhage (SAH). CT showing hyperdensity in basal cisterns (Fisher Grade 3) and CSF xanthochromia with frank blood confirm the diagnosis. The most common cause in this age group is a ruptured berry aneurysm, often at the Circle of Willis. Bacterial meningitis presents with fever, purulent CSF, and gradual headache onset. Hypertensive encephalopathy lacks the thunderclap pattern and CSF findings. CT angiography should follow immediately to identify and coil/clip the aneurysm. Nimodipine is started to prevent vasospasm.",
  },
  {
    id: 3,
    date: "2024-01-03",
    title: "Breathlessness with Bilateral Leg Swelling",
    specialty: "Medicine / Cardiology",
    patient_info: {
      age: 65,
      gender: "Female",
      occupation: "Retired homemaker",
      chief_complaint: "Progressive breathlessness for 3 weeks, worse on lying flat; bilateral ankle swelling",
    },
    history:
      "Known rheumatic heart disease since childhood, not on regular follow-up. Presents with 3 weeks of progressive dyspnoea (now NYHA Class III), orthopnoea (3 pillows), and paroxysmal nocturnal dyspnoea. Bilateral pitting pedal oedema up to knees. On examination: JVP raised to 8 cm, hepatomegaly 3 cm below costal margin, bilateral basal crepitations. Loud S1, opening snap, mid-diastolic rumble best heard at apex in left lateral position.",
    vitals: {
      bp: "110/70 mmHg",
      hr: "96 bpm (irregularly irregular)",
      rr: "22/min",
      temp: "36.9°C",
      spo2: "94% on room air",
    },
    investigations: [
      { label: "ECG", value: "Atrial fibrillation; P-mitrale features; RVH pattern" },
      { label: "Chest X-ray", value: "Cardiomegaly (CTR 0.58); double contour right heart border; upper lobe diversion; Kerley B lines" },
      { label: "Echo", value: "Mitral valve area 0.8 cm²; Wilkins score 10; severe MS; LA diameter 52 mm; PASP 55 mmHg; EF 60%" },
      { label: "BNP", value: "1248 pg/mL", note: "Normal < 100 pg/mL" },
    ],
    options: [
      { id: "A", text: "Severe Mitral Stenosis with decompensated heart failure and atrial fibrillation" },
      { id: "B", text: "Dilated Cardiomyopathy with systolic dysfunction" },
      { id: "C", text: "Cor Pulmonale secondary to COPD" },
      { id: "D", text: "Constrictive Pericarditis" },
    ],
    correct_answer: "A",
    explanation:
      "Classic presentation of severe rheumatic Mitral Stenosis. The loud S1 + opening snap + mid-diastolic rumble is the hallmark auscultatory triad. MVA of 0.8 cm² confirms severe MS (severe < 1.0 cm²). AF is a common complication due to LA enlargement (52 mm). Chest X-ray shows double contour (enlarged LA), upper lobe diversion (pulmonary hypertension), and Kerley B lines (interstitial oedema). PASP 55 mmHg indicates moderate pulmonary hypertension. Dilated cardiomyopathy would show reduced EF; Cor pulmonale would follow long-standing COPD/lung disease; Constrictive pericarditis shows pericardial calcification and a 'square root sign' on haemodynamics. Treatment: Rate control for AF, anticoagulation, and Balloon Mitral Valvotomy if suitable (Wilkins score ≤ 8 ideal, but can still be considered).",
  },
  {
    id: 4,
    date: "2024-01-04",
    title: "Young Man with Polyuria and Weight Loss",
    specialty: "Endocrinology",
    patient_info: {
      age: 19,
      gender: "Male",
      occupation: "College student",
      chief_complaint: "Excessive thirst, polyuria, and 6 kg weight loss over 3 weeks",
    },
    history:
      "No prior medical history. Presents with 3-week history of polyuria (voiding ~15 times/day), polydipsia, polyphagia, and significant weight loss. Brought to emergency in a drowsy state by friends. On examination: Kussmaul breathing (deep sighing respirations), fruity odour on breath, dry mucous membranes, and reduced skin turgor. GCS 13/15.",
    vitals: {
      bp: "98/66 mmHg",
      hr: "118 bpm",
      rr: "28/min (Kussmaul)",
      temp: "37.1°C",
      spo2: "97% on room air",
      rbs: "538 mg/dL",
    },
    investigations: [
      { label: "ABG", value: "pH 7.18; pCO₂ 22 mmHg; HCO₃⁻ 8 mEq/L; Anion Gap 26" },
      { label: "Serum Ketones", value: "4+ (strongly positive)" },
      { label: "Urine Ketones", value: "4+ (strongly positive)" },
      { label: "Serum K⁺", value: "5.8 mEq/L (before treatment)" },
      { label: "Serum Na⁺", value: "128 mEq/L" },
      { label: "Serum Creatinine", value: "2.1 mg/dL" },
    ],
    options: [
      { id: "A", text: "Diabetic Ketoacidosis (DKA) — new onset Type 1 Diabetes Mellitus" },
      { id: "B", text: "Hyperosmolar Hyperglycaemic State (HHS)" },
      { id: "C", text: "Lactic acidosis from sepsis" },
      { id: "D", text: "Alcoholic ketoacidosis" },
    ],
    correct_answer: "A",
    explanation:
      "This is a classic presentation of DKA in a young patient as the first manifestation of Type 1 DM. The diagnostic triad for DKA: Hyperglycaemia (>250 mg/dL) + Metabolic acidosis (pH < 7.3, HCO₃ < 18) + Ketonemia/Ketonuria. Kussmaul breathing is a compensatory response to metabolic acidosis. Anion gap of 26 confirms high anion gap metabolic acidosis. Pseudohyponatraemia is expected due to osmotic shift. Note: K⁺ appears high initially (transcellular shift due to acidosis) but total body K⁺ is depleted — must monitor closely as K⁺ drops with insulin therapy. HHS occurs in older Type 2 diabetics with very high glucose (>600) and minimal ketosis; Lactic acidosis would have normal ketones; Alcoholic ketoacidosis has history of heavy alcohol use and glucose is normal or low. Management: IV fluids → insulin infusion → potassium replacement.",
  },
  {
    id: 5,
    date: "2024-01-05",
    title: "Child with Fever and Petechial Rash",
    specialty: "Paediatrics / Infectious Disease",
    patient_info: {
      age: 7,
      gender: "Male",
      occupation: "School student",
      chief_complaint: "High-grade fever for 4 days with spreading non-blanching rash and altered sensorium",
    },
    history:
      "4-day history of high-grade fever (39.8°C), headache, and vomiting. Over the last 12 hours, parents noticed spreading rash starting on legs, now involving trunk and arms. Child is increasingly lethargic and confused. No prior vaccinations against Neisseria meningitidis. Recent upper respiratory infection 1 week ago. On examination: purpuric and petechial rash that does not blanch on pressure, photophobia, neck stiffness, positive Kernig's sign.",
    vitals: {
      bp: "80/50 mmHg",
      hr: "138 bpm",
      rr: "32/min",
      temp: "39.8°C",
      spo2: "95% on room air",
    },
    investigations: [
      { label: "CBC", value: "WBC 24,800/μL (84% neutrophils); Hb 10.2 g/dL; Platelets 42,000/μL" },
      { label: "CRP", value: "248 mg/L", note: "Normal < 6 mg/L" },
      { label: "Procalcitonin", value: "38 ng/mL", note: "Bacterial sepsis > 2 ng/mL" },
      { label: "PT/INR", value: "INR 2.4 (prolonged)" },
      { label: "APTT", value: "52 seconds (prolonged)" },
      { label: "D-Dimer", value: "Markedly elevated — 12.4 μg/mL" },
      { label: "CSF (if safe to LP)", value: "Cloudy; WBC 4200 (>90% neutrophils); Protein 280 mg/dL; Glucose 18 mg/dL (serum 92 mg/dL)" },
    ],
    options: [
      { id: "A", text: "Meningococcal Septicaemia with DIC and bacterial meningitis" },
      { id: "B", text: "Immune Thrombocytopenic Purpura (ITP) with CNS involvement" },
      { id: "C", text: "Dengue Haemorrhagic Fever with shock syndrome" },
      { id: "D", text: "Henoch-Schönlein Purpura (HSP) with renal involvement" },
    ],
    correct_answer: "A",
    explanation:
      "This is a life-threatening presentation of Meningococcal Septicaemia (Neisseria meningitidis). The non-blanching petechial/purpuric rash is the hallmark — it indicates extravasation of blood due to vasculitis and DIC (confirmed by low platelets, raised PT, prolonged APTT, and elevated D-dimer). Purulent CSF with a CSF:serum glucose ratio < 0.4 and neutrophilic pleocytosis confirms bacterial meningitis. Do NOT delay antibiotics for LP — give IV Ceftriaxone (100 mg/kg/day) immediately. Dexamethasone IV before or with first antibiotic dose reduces neurological sequelae. ITP has an isolated thrombocytopenia without fever/CSF changes; Dengue would have positive NS1 antigen and thrombocytopenia without meningism; HSP shows palpable purpura on lower limbs with arthritis and renal involvement but no sepsis/CSF changes. This is a MEDICAL EMERGENCY — early antibiotic administration within the first hour is critical for survival.",
  },
  {
    id: 6,
    date: "2024-01-06",
    title: "Recurrent Episodes of Fainting in a Young Athlete",
    specialty: "Cardiology",
    patient_info: {
      age: 22,
      gender: "Male",
      occupation: "State-level cricket player",
      chief_complaint: "Three episodes of transient loss of consciousness during intense exercise over 4 months",
      },
    history:
      "Athletic young male with no prior illnesses. Three episodes of sudden syncope during vigorous cricket practice, with rapid recovery. No prodromal symptoms. Family history: elder brother died suddenly at age 26 during exercise. On examination: prominent left ventricular impulse displaced laterally; harsh systolic ejection murmur at left sternal border increasing with Valsalva and decreasing on squatting.",
    vitals: {
      bp: "118/76 mmHg",
      hr: "62 bpm",
      rr: "14/min",
      temp: "36.8°C",
      spo2: "99% on room air",
    },
    investigations: [
      { label: "ECG", value: "LVH pattern; deep Q waves in I, aVL, V4–V6; T-wave inversions laterally" },
      { label: "Echo", value: "Asymmetric septal hypertrophy — IVS 22 mm; SAM of mitral valve; LVOT gradient 52 mmHg at rest; LA mildly dilated" },
      { label: "Holter (24-hr)", value: "3 runs of non-sustained VT (longest 7 beats at 180 bpm)" },
      { label: "Exercise stress test", value: "Exertional syncope reproduced at 85% MHR; LVOT gradient increased to 110 mmHg" },
    ],
    options: [
      { id: "A", text: "Hypertrophic Obstructive Cardiomyopathy (HOCM)" },
      { id: "B", text: "Aortic stenosis with LVH" },
      { id: "C", text: "Vasovagal syncope (neurocardiogenic syncope)" },
      { id: "D", text: "Arrhythmogenic Right Ventricular Cardiomyopathy (ARVC)" },
    ],
    correct_answer: "A",
    explanation:
      "This is a classic presentation of Hypertrophic Obstructive Cardiomyopathy (HOCM). Key features: (1) Young athlete with exertional syncope, (2) Family history of sudden cardiac death, (3) Murmur increasing with Valsalva (reduces preload → worsens obstruction) and decreasing on squatting (increases preload → relieves obstruction), (4) Echo confirming asymmetric septal hypertrophy (IVS 22 mm > 15 mm), SAM, and high LVOT gradient. NSRT on Holter indicates high risk for sudden cardiac death. Management: Beta-blockers (first line), ICD implantation (for SCD prevention given NSVT, family history, and exertional syncope — 3 risk factors), and disqualification from competitive sports. Alcohol septal ablation or surgical myomectomy for severe refractory cases. Aortic stenosis has a fixed outflow gradient, not dynamic. Vasovagal syncope is benign with prodromal symptoms. ARVC affects the right ventricle with epsilon waves on ECG.",
  },
  {
    id: 7,
    date: "2024-01-07",
    title: "Jaundice with Dark Urine in a Pregnant Woman",
    specialty: "Obstetrics & Hepatology",
    patient_info: {
      age: 28,
      gender: "Female",
      occupation: "Housewife",
      chief_complaint: "Progressive jaundice, dark urine, and right upper quadrant pain at 32 weeks gestation",
    },
    history:
      "G2P1 at 32 weeks gestation. Presents with 5-day history of progressive jaundice, dark urine, clay-coloured stools, and dull right upper quadrant pain. Associated with nausea and anorexia. No fever. Previous pregnancy was uneventful. On examination: icteric sclerae, tender hepatomegaly, no signs of chronic liver disease.",
    vitals: {
      bp: "138/88 mmHg",
      hr: "98 bpm",
      rr: "18/min",
      temp: "37.0°C",
      spo2: "98% on room air",
    },
    investigations: [
      { label: "Bilirubin (Total)", value: "9.4 mg/dL (Direct: 7.2; Indirect: 2.2)" },
      { label: "ALT/AST", value: "ALT 342 U/L; AST 298 U/L" },
      { label: "ALP", value: "780 U/L", note: "Significantly elevated" },
      { label: "PT/INR", value: "INR 1.8" },
      { label: "Serum bile acids", value: "88 μmol/L", note: "Normal < 10 μmol/L" },
      { label: "USG Abdomen", value: "No gallstones; no biliary dilatation; normal fetal biometry" },
      { label: "Viral hepatitis panel", value: "HBsAg negative; Anti-HCV negative; IgM Anti-HAV negative; IgM Anti-HEV negative" },
    ],
    options: [
      { id: "A", text: "Intrahepatic Cholestasis of Pregnancy (ICP)" },
      { id: "B", text: "Acute Fatty Liver of Pregnancy (AFLP)" },
      { id: "C", text: "HELLP Syndrome" },
      { id: "D", text: "Viral Hepatitis E in pregnancy" },
    ],
    correct_answer: "A",
    explanation:
      "Intrahepatic Cholestasis of Pregnancy (ICP) is the most common liver disorder specific to pregnancy, typically presenting in the 3rd trimester. Diagnostic criteria: (1) Pruritus (often the first symptom — can be intense, especially palms and soles), (2) Raised serum bile acids > 10 μmol/L (here 88 μmol/L), (3) Cholestatic LFTs (raised ALP, mild transaminitis, conjugated hyperbilirubinaemia), (4) No alternative diagnosis. The absence of gallstones on USG and negative viral markers rule out obstructive jaundice and viral hepatitis. AFLP presents with microvesicular steatosis, hypoglycaemia, and acute liver failure. HELLP would show haemolysis + elevated liver enzymes + low platelets. Hepatitis E in pregnancy causes severe hepatitis but viral serology would be positive. Management of ICP: Ursodeoxycholic acid (first-line), vitamin K supplementation, fetal surveillance (elevated bile acids > 40 μmol/L increases risk of stillbirth), and delivery at 37 weeks.",
  },
];

export function getTodaysCase(): ClinicalCase {
  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  return clinicalCases[dayIndex % clinicalCases.length];
}
