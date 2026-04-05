export type Severity = "major" | "moderate" | "minor" | "none";

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: Severity;
  description: string;
  clinical_effect: string;
  management: string;
}

export const DRUG_INTERACTIONS: DrugInteraction[] = [
  // ── MAJOR ─────────────────────────────────────────────────────────────────
  {
    drug1: "warfarin", drug2: "aspirin", severity: "major",
    description: "Additive anticoagulant and antiplatelet effects",
    clinical_effect: "Significantly increased risk of serious or fatal bleeding (GI haemorrhage, intracranial bleed).",
    management: "Avoid combination unless benefit clearly outweighs risk (e.g., mechanical heart valve). If necessary, use lowest aspirin dose and monitor INR closely.",
  },
  {
    drug1: "warfarin", drug2: "ibuprofen", severity: "major",
    description: "NSAIDs inhibit platelet function and can displace warfarin from protein binding sites",
    clinical_effect: "Elevated INR, increased risk of GI bleeding, ulceration, and haemorrhage.",
    management: "Avoid NSAIDs with warfarin. Use paracetamol (acetaminophen) as the analgesic of choice in anticoagulated patients.",
  },
  {
    drug1: "ssri", drug2: "maoi", severity: "major",
    description: "Both drugs increase serotonergic neurotransmission via different mechanisms",
    clinical_effect: "Life-threatening serotonin syndrome: hyperthermia, agitation, clonus, hyperreflexia, diaphoresis, and death.",
    management: "Absolutely contraindicated. Allow a washout period of ≥14 days after stopping MAOI before starting SSRI; 5 weeks after fluoxetine before starting MAOI.",
  },
  {
    drug1: "metformin", drug2: "alcohol", severity: "major",
    description: "Alcohol inhibits hepatic gluconeogenesis and lactate metabolism",
    clinical_effect: "Increased risk of potentially fatal lactic acidosis, especially in chronic heavy drinkers.",
    management: "Advise patients to avoid excessive alcohol intake. Withhold metformin if patient is on an alcohol binge or has acute alcohol intoxication.",
  },
  {
    drug1: "metoprolol", drug2: "verapamil", severity: "major",
    description: "Additive negative chronotropic, inotropic, and dromotropic effects at AV node",
    clinical_effect: "Severe bradycardia, complete AV block, hypotension, and cardiac arrest.",
    management: "Combination generally contraindicated. If unavoidable, start at low doses with continuous ECG monitoring in a clinical setting.",
  },
  {
    drug1: "digoxin", drug2: "amiodarone", severity: "major",
    description: "Amiodarone inhibits renal tubular secretion and hepatic metabolism of digoxin (P-gp and CYP inhibition)",
    clinical_effect: "Digoxin toxicity: nausea, vomiting, visual disturbances (yellow halos), bradycardia, life-threatening arrhythmias.",
    management: "Reduce digoxin dose by 50% when amiodarone is initiated. Monitor digoxin levels every 5–7 days and adjust accordingly.",
  },
  {
    drug1: "sildenafil", drug2: "nitrates", severity: "major",
    description: "Both drugs enhance nitric oxide–cGMP pathway causing vasodilation",
    clinical_effect: "Severe, potentially fatal hypotension; syncope; myocardial infarction.",
    management: "Absolutely contraindicated. Nitrates must not be given within 24 hours of sildenafil or vardenafil (48 hours for tadalafil).",
  },
  {
    drug1: "ssri", drug2: "tramadol", severity: "major",
    description: "SSRIs potentiate serotonin release; tramadol also has serotonergic activity and is metabolised by CYP2D6",
    clinical_effect: "Serotonin syndrome risk; additionally, SSRIs lower seizure threshold and may reduce tramadol efficacy via CYP2D6 inhibition.",
    management: "Avoid combination. Use alternative analgesics (e.g., paracetamol, NSAIDs if safe) in patients on SSRIs.",
  },
  {
    drug1: "lithium", drug2: "ibuprofen", severity: "major",
    description: "NSAIDs reduce renal prostaglandin synthesis, decreasing lithium excretion",
    clinical_effect: "Lithium toxicity: tremor, ataxia, confusion, renal failure, cardiac arrhythmias, death.",
    management: "Avoid NSAIDs in patients on lithium. Use paracetamol. If NSAID is unavoidable, monitor lithium levels closely and reduce lithium dose.",
  },
  {
    drug1: "lithium", drug2: "diclofenac", severity: "major",
    description: "NSAIDs inhibit prostaglandin-mediated renal lithium clearance",
    clinical_effect: "Elevated serum lithium levels leading to toxicity: coarse tremor, confusion, seizures, renal injury.",
    management: "Avoid this combination. Use paracetamol for analgesia. Monitor lithium levels if NSAID is initiated or discontinued.",
  },
  {
    drug1: "atorvastatin", drug2: "clarithromycin", severity: "major",
    description: "Clarithromycin is a potent CYP3A4 inhibitor, markedly increasing statin plasma levels",
    clinical_effect: "Rhabdomyolysis, severe myopathy, acute kidney injury due to myoglobinuria.",
    management: "Suspend statin therapy during the clarithromycin course, or switch to a non-CYP3A4–metabolised statin (e.g., rosuvastatin, pravastatin).",
  },
  {
    drug1: "metronidazole", drug2: "alcohol", severity: "major",
    description: "Metronidazole inhibits aldehyde dehydrogenase",
    clinical_effect: "Disulfiram-like reaction: facial flushing, severe nausea, vomiting, palpitations, headache, hypotension.",
    management: "Advise strict avoidance of alcohol during metronidazole therapy and for at least 48 hours after the last dose.",
  },
  {
    drug1: "phenytoin", drug2: "fluconazole", severity: "major",
    description: "Fluconazole inhibits CYP2C9, the primary enzyme responsible for phenytoin metabolism",
    clinical_effect: "Phenytoin toxicity: nystagmus, ataxia, diplopia, dysarthria, confusion, seizures.",
    management: "Monitor phenytoin plasma levels closely. Anticipate dose reduction may be needed. Consider alternative antifungal.",
  },
  {
    drug1: "methotrexate", drug2: "nsaids", severity: "major",
    description: "NSAIDs reduce renal prostaglandin synthesis, impairing tubular secretion of methotrexate",
    clinical_effect: "Methotrexate toxicity: bone marrow suppression, mucositis, hepatotoxicity, pulmonary toxicity.",
    management: "Avoid combination, especially at high methotrexate doses. If low-dose MTX is used, monitor FBC and LFTs; use folinic acid rescue.",
  },
  {
    drug1: "ciprofloxacin", drug2: "tizanidine", severity: "major",
    description: "Ciprofloxacin strongly inhibits CYP1A2, the primary metabolic pathway for tizanidine",
    clinical_effect: "Dramatic increase in tizanidine plasma levels causing severe hypotension, bradycardia, sedation, and respiratory depression.",
    management: "Contraindicated. Use an alternative antibiotic (e.g., levofloxacin — but note it also inhibits CYP1A2 to a lesser extent). If unavoidable, avoid tizanidine during ciprofloxacin course.",
  },

  // ── MODERATE ──────────────────────────────────────────────────────────────
  {
    drug1: "clopidogrel", drug2: "omeprazole", severity: "moderate",
    description: "Omeprazole inhibits CYP2C19, the enzyme responsible for converting clopidogrel to its active metabolite",
    clinical_effect: "Reduced antiplatelet efficacy of clopidogrel; potentially increased cardiovascular events in high-risk patients.",
    management: "Use pantoprazole or rabeprazole instead, as they have minimal CYP2C19 inhibition. Avoid omeprazole and esomeprazole in patients on clopidogrel.",
  },
  {
    drug1: "ciprofloxacin", drug2: "antacids", severity: "moderate",
    description: "Divalent (Al³⁺, Mg²⁺) and trivalent (Fe³⁺) cations form insoluble chelation complexes with fluoroquinolones",
    clinical_effect: "Significantly reduced ciprofloxacin bioavailability (up to 50–90% reduction), leading to treatment failure.",
    management: "Administer ciprofloxacin at least 2 hours before or 6 hours after antacids, iron, or calcium supplements.",
  },
  {
    drug1: "simvastatin", drug2: "amlodipine", severity: "moderate",
    description: "Amlodipine moderately inhibits CYP3A4, reducing simvastatin clearance",
    clinical_effect: "Elevated simvastatin plasma levels increasing the risk of myopathy and rhabdomyolysis.",
    management: "Limit simvastatin dose to a maximum of 20 mg/day when co-administered with amlodipine. Consider switching to rosuvastatin or pravastatin.",
  },
  {
    drug1: "ace inhibitors", drug2: "nsaids", severity: "moderate",
    description: "NSAIDs attenuate prostaglandin-dependent renal vasodilation, counteracting the antihypertensive effects of ACE inhibitors",
    clinical_effect: "Loss of blood pressure control; acute kidney injury (triple whammy risk when combined with a diuretic); hyperkalaemia.",
    management: "Avoid combination where possible, especially in elderly or renally impaired patients. Monitor BP, renal function, and electrolytes closely if co-prescribed.",
  },
  {
    drug1: "warfarin", drug2: "fluconazole", severity: "moderate",
    description: "Fluconazole inhibits CYP2C9, the main enzyme responsible for warfarin (S-enantiomer) metabolism",
    clinical_effect: "Markedly elevated INR and significantly increased bleeding risk.",
    management: "Reduce warfarin dose prophylactically by 25–50%. Monitor INR every 2–3 days during and for 1 week after the fluconazole course.",
  },
  {
    drug1: "metformin", drug2: "contrast media", severity: "moderate",
    description: "Iodinated contrast agents can cause acute kidney injury, impairing metformin excretion",
    clinical_effect: "Risk of metformin accumulation and lactic acidosis following contrast-induced nephropathy.",
    management: "Withhold metformin 48 hours before and 48 hours after contrast administration. Restart only after confirming stable renal function.",
  },
  {
    drug1: "amoxicillin", drug2: "warfarin", severity: "moderate",
    description: "Antibiotics reduce gut flora that synthesise vitamin K; amoxicillin may also displace warfarin from protein binding",
    clinical_effect: "Unpredictable INR elevation and increased bleeding risk during antibiotic course.",
    management: "Monitor INR 2–3 days after starting antibiotic and again after completion. May require temporary warfarin dose adjustment.",
  },
  {
    drug1: "spironolactone", drug2: "ace inhibitors", severity: "moderate",
    description: "Both drugs reduce aldosterone effect, impairing urinary potassium excretion",
    clinical_effect: "Hyperkalaemia — potentially fatal cardiac arrhythmias (peaked T waves, wide QRS, ventricular fibrillation).",
    management: "Monitor serum potassium closely (at baseline, 1 week, 1 month, then periodically). Avoid if eGFR < 30 mL/min or baseline K⁺ > 5.0 mEq/L.",
  },
  {
    drug1: "ssri", drug2: "nsaids", severity: "moderate",
    description: "SSRIs deplete platelet serotonin (impairing platelet aggregation); NSAIDs add antiplatelet and GI mucosal effects",
    clinical_effect: "3–15x increased risk of upper GI bleeding compared to either drug alone.",
    management: "Co-prescribe a proton pump inhibitor. Consider switching SSRI to mirtazapine if GI bleeding risk is high. Avoid NSAIDs if possible; use paracetamol.",
  },
  {
    drug1: "carbamazepine", drug2: "oral contraceptives", severity: "moderate",
    description: "Carbamazepine induces CYP3A4 and CYP2C9, accelerating oestrogen and progestogen metabolism",
    clinical_effect: "Reduced contraceptive efficacy and risk of unintended pregnancy.",
    management: "Use alternative or additional contraception (e.g., copper IUD, barrier methods). High-oestrogen pills are not reliable. Advise the patient explicitly.",
  },
  {
    drug1: "rifampicin", drug2: "oral contraceptives", severity: "moderate",
    description: "Rifampicin is a potent CYP3A4 inducer that dramatically reduces oestrogen/progestogen plasma levels",
    clinical_effect: "Contraceptive failure. Rifampicin is the most potent enzyme inducer affecting OCP reliability.",
    management: "Use non-hormonal contraception (copper IUD preferred). This interaction persists for at least 28 days after rifampicin is stopped.",
  },
  {
    drug1: "amlodipine", drug2: "clarithromycin", severity: "moderate",
    description: "Clarithromycin inhibits CYP3A4, reducing amlodipine clearance",
    clinical_effect: "Enhanced antihypertensive effect; symptomatic hypotension, dizziness, and reflex tachycardia.",
    management: "Monitor BP closely during co-administration. Consider reducing amlodipine dose or switching to azithromycin.",
  },
  {
    drug1: "theophylline", drug2: "ciprofloxacin", severity: "moderate",
    description: "Ciprofloxacin inhibits CYP1A2, the main enzyme responsible for theophylline metabolism",
    clinical_effect: "Theophylline toxicity: nausea, vomiting, tachycardia, tremor, seizures, arrhythmias.",
    management: "Reduce theophylline dose by 30–50% when starting ciprofloxacin. Monitor theophylline plasma levels. Use levofloxacin with caution; prefer azithromycin or doxycycline.",
  },
  {
    drug1: "haloperidol", drug2: "lithium", severity: "moderate",
    description: "Mechanism uncertain; possibly increased CNS dopaminergic sensitivity and lithium-induced alteration of haloperidol metabolism",
    clinical_effect: "Neurotoxicity: irreversible tardive dyskinesia, encephalopathy, delirium, hyperthermia (at therapeutic or even normal lithium levels).",
    management: "Use with caution. Monitor for early signs of neurotoxicity. Maintain lithium in low therapeutic range. Consider alternative antipsychotic.",
  },
  {
    drug1: "tacrolimus", drug2: "fluconazole", severity: "moderate",
    description: "Fluconazole inhibits CYP3A4 and P-glycoprotein, reducing tacrolimus clearance",
    clinical_effect: "Significantly elevated tacrolimus levels causing nephrotoxicity, neurotoxicity, and opportunistic infections.",
    management: "Reduce tacrolimus dose empirically by 50%. Monitor trough levels every 2–3 days. Close renal function monitoring required.",
  },

  // ── MINOR ─────────────────────────────────────────────────────────────────
  {
    drug1: "antacids", drug2: "tetracycline", severity: "minor",
    description: "Divalent cations (Ca²⁺, Mg²⁺, Al³⁺) chelate tetracyclines, forming non-absorbable complexes",
    clinical_effect: "Reduced tetracycline absorption by up to 50–90%, potentially causing treatment failure.",
    management: "Administer tetracycline at least 2 hours before or 4–6 hours after antacids, iron, dairy products, or calcium supplements.",
  },
  {
    drug1: "paracetamol", drug2: "alcohol", severity: "minor",
    description: "Chronic alcohol use induces CYP2E1 (increasing toxic metabolite NAPQI) and depletes hepatic glutathione",
    clinical_effect: "Increased hepatotoxicity risk at standard paracetamol doses in chronic heavy drinkers.",
    management: "Occasional alcohol use with normal paracetamol doses is generally safe. In chronic heavy drinkers, limit paracetamol to ≤2 g/day or use alternatives.",
  },
  {
    drug1: "amlodipine", drug2: "grapefruit juice", severity: "minor",
    description: "Furanocoumarins in grapefruit inhibit intestinal CYP3A4, increasing amlodipine bioavailability",
    clinical_effect: "Mild to moderate enhancement of antihypertensive effect; dizziness, flushing, headache.",
    management: "Advise patients to avoid regular large amounts of grapefruit or grapefruit juice while on amlodipine. Single occasional servings are unlikely to be clinically significant.",
  },
  {
    drug1: "lisinopril", drug2: "potassium supplements", severity: "minor",
    description: "ACE inhibitors reduce aldosterone, decreasing renal potassium excretion",
    clinical_effect: "Hyperkalaemia risk, especially in patients with renal impairment or diabetes.",
    management: "Monitor serum potassium. Avoid potassium supplements unless documented hypokalaemia. Use salt substitutes (KCl) with caution.",
  },
  {
    drug1: "metformin", drug2: "furosemide", severity: "minor",
    description: "Furosemide may increase metformin plasma concentration by competing for renal tubular secretion",
    clinical_effect: "Mild increase in metformin exposure; theoretical increased lactic acidosis risk, though clinically rare with normal renal function.",
    management: "Monitor renal function periodically. Ensure adequate hydration. Consider reducing metformin dose if dehydration or acute illness supervenes.",
  },
];

export type DrugPair = { drug1: string; drug2: string; interaction: DrugInteraction };

export function checkInteractions(drugs: string[]): DrugPair[] {
  const lower = drugs.map((d) => d.toLowerCase().trim());
  const results: DrugPair[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < lower.length; i++) {
    for (let j = i + 1; j < lower.length; j++) {
      const a = lower[i];
      const b = lower[j];

      for (const interaction of DRUG_INTERACTIONS) {
        const d1 = interaction.drug1.toLowerCase();
        const d2 = interaction.drug2.toLowerCase();

        const matchAB =
          (a.includes(d1) || d1.includes(a)) && (b.includes(d2) || d2.includes(b));
        const matchBA =
          (b.includes(d1) || d1.includes(b)) && (a.includes(d2) || d2.includes(a));

        if (matchAB || matchBA) {
          const key = [d1, d2].sort().join("|");
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              drug1: drugs[i],
              drug2: drugs[j],
              interaction,
            });
          }
        }
      }
    }
  }

  results.sort((a, b) => {
    const order: Severity[] = ["major", "moderate", "minor", "none"];
    return order.indexOf(a.interaction.severity) - order.indexOf(b.interaction.severity);
  });

  return results;
}
