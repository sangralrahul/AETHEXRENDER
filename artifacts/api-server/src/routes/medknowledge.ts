import { Router, type IRouter, type Request, type Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import rateLimit from "express-rate-limit";

const router: IRouter = Router();

const anthropic = new Anthropic({
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
});

const medKnowledgeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Too many requests. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

function buildPrompt(section: string, topic: string, subject: string, conditionName?: string, department?: string): string {
  const isCondition = !!conditionName;
  const entityName = isCondition ? conditionName! : topic;
  const entityContext = isCondition ? department! : subject;

  const prompts: Record<string, string> = {
    overview_topic: `You are a world-class medical professor writing for MBBS/MD students. Write an encyclopedic, clinically relevant, and exam-focused overview of **${topic}** in **${subject}**. Cover definition, importance, historical context, and a complete conceptual introduction. Write 4–6 well-structured paragraphs. Format paragraph headings in bold. Include key terminology in bold. Write in clear academic English.`,

    overview_condition: `You are a world-class clinician and medical educator. Write a comprehensive, encyclopedia-level overview of **${conditionName}** for a medical student or junior doctor. Include: definition, epidemiology (global + Indian context), historical background, and why this condition matters clinically. Write 4–6 flowing academic paragraphs. Bold key terms. Include relevant statistics.`,

    key_concepts: `List 8–12 key concepts a medical student must know about **${entityName}** in **${entityContext}**. Format as a numbered list where each concept has:
- A **bold title** 
- 2–3 sentence explanation
- Include mnemonics where applicable (label them as "Mnemonic:")
Make each point exam-relevant for NEET-PG/USMLE level.`,

    clinical_relevance: `Write a detailed Clinical Relevance section for **${entityName}** covering:
1. **Common Clinical Presentations** — how patients typically present
2. **Surgical/Clinical Applications** — practical clinical importance  
3. **Common Pathologies** — diseases arising from this topic
4. **Diagnostic Significance** — how knowledge of this topic aids diagnosis
5. **Red Flags** — dangerous presentations to recognize immediately
Write for MBBS/MD level. Be specific with clinical examples from Indian/global practice.`,

    etiology: `List ALL causes and risk factors for **${conditionName}** organized by:
**Modifiable vs Non-modifiable Risk Factors**
**Primary vs Secondary Causes**
**Predisposing vs Precipitating Factors**
For each factor, provide a brief explanation of the mechanism. Be exhaustive and clinically accurate. Include Indian-specific epidemiology where relevant.`,

    pathophysiology: `Explain the complete pathophysiology of **${conditionName}** step by step, from initial trigger to final manifestation. 
- Use numbered steps
- Include molecular mechanisms, cellular changes, and organ-level effects  
- Use arrows (→) to show progression
- End with a summary paragraph
Format clearly for exam revision. Bold key pathophysiological terms.`,

    clinical_features: `List ALL clinical features of **${conditionName}** organized as:

**SYMPTOMS** (organized by system)
**SIGNS** (General examination → Vital signs → Systemic examination → Special clinical signs/tests)
**COMPLICATIONS** (Early, Late, Life-threatening)

Include classic exam findings and their clinical significance. Note sensitivity/specificity where relevant.`,

    investigations: `List all investigations for **${conditionName}** organized as:

**First-line Investigations** — with expected findings
**Confirmatory Tests** — gold standard investigations
**Monitoring Tests** — for disease progression and treatment

For EACH investigation include:
- What it shows
- Typical findings in this condition
- Clinical significance
- Normal vs abnormal values where applicable`,

    diagnosis: `Explain the diagnostic approach for **${conditionName}**:

**Diagnostic Criteria** — list formal criteria (Jones, Duke, Framingham, WHO, DSM-5 etc. as applicable)
**Gold Standard Diagnosis**
**Differential Diagnosis** — top 5 differentials with distinguishing features
**Approach to the Patient** — stepwise clinical reasoning
**How to differentiate from mimics**

Format clearly for exam use.`,

    treatment: `Write a complete, protocol-level treatment guide for **${conditionName}** covering:

**Emergency Management** (if applicable) — immediate priorities
**Medical Management** — first-line, second-line, salvage therapy with specific drug names, doses, mechanisms and monitoring
**Surgical/Interventional Management** — indications and procedures
**Non-pharmacological Management** — lifestyle, diet, physiotherapy
**Patient Education** — key teaching points
**Follow-up Schedule** — monitoring parameters and frequency

Write like a clinical protocol. Be specific with drug doses in Indian/international context.`,

    prognosis: `Explain the prognosis of **${conditionName}** including:
**Survival/Outcome Statistics**
**Prognostic Factors** — favorable and unfavorable
**Prognostic Scoring Systems** (if applicable)
**Acute Complications** — immediate risks
**Chronic Complications** — long-term sequelae  
**Life-threatening Complications** — what kills the patient
Include Indian data where available.`,

    prevention: `Explain prevention strategies for **${conditionName}**:

**Primary Prevention** — before disease develops
**Secondary Prevention** — early detection and treatment
**Tertiary Prevention** — preventing complications and disability
**Screening Guidelines** — who, when, how
**Vaccination** (if applicable)
**Lifestyle Modifications** — evidence-based recommendations
**Chemoprophylaxis** (if applicable)`,

    special_populations: `How does **${conditionName}** differ in these special populations:
1. **Pregnant Women** — risks, drug safety, management changes
2. **Elderly Patients** — atypical presentation, drug dosing
3. **Pediatric Patients** — age-specific considerations
4. **Renal/Hepatic Failure** — dose adjustments, contraindications
5. **Immunocompromised Patients** — altered presentation and risks

For each population, provide specific management guidance.`,

    mcq: `Generate 8 high-yield MCQ-style exam questions about **${entityName}** for NEET-PG/USMLE Step 1 & 2 level. Include clinical vignettes. 

Return ONLY valid JSON in this exact format (no markdown, no explanation):
[
  {
    "question": "A 45-year-old presents with...",
    "options": ["A. Option A", "B. Option B", "C. Option C", "D. Option E"],
    "correct": "A",
    "explanation": "Detailed explanation of why A is correct and others are wrong..."
  }
]`,

    flashcards: `Generate 10 high-yield flashcard pairs for rapid revision of **${entityName}** in **${entityContext}**.

Return ONLY valid JSON in this exact format (no markdown, no explanation):
[
  {
    "front": "Question or incomplete statement...",
    "back": "Complete concise answer with key facts..."
  }
]

Cover: key facts, drug of choice, diagnostic gold standard, classic presentation, complications, mnemonics.`,
  };

  const key = isCondition
    ? (section === "overview" ? "overview_condition" : section)
    : (section === "overview" ? "overview_topic" : section);

  return prompts[key] || prompts[isCondition ? "overview_condition" : "overview_topic"];
}

router.post("/med-knowledge/content", medKnowledgeLimiter, async (req: Request, res: Response) => {
  try {
    const { section, topic, subject, conditionName, department } = req.body;

    if (!section) {
      res.status(400).json({ error: "section is required" });
      return;
    }
    if (!topic && !conditionName) {
      res.status(400).json({ error: "topic or conditionName is required" });
      return;
    }

    const cacheKey = `medknowledge_${section}_${topic || ""}_${conditionName || ""}`;
    const prompt = buildPrompt(section, topic || "", subject || "", conditionName, department);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0].type === "text" ? message.content[0].text : "";

    res.json({ content, cacheKey });
  } catch (err: any) {
    req.log?.error?.({ err }, "Med knowledge content error");
    res.status(500).json({ error: "Failed to generate content. Please try again." });
  }
});

export default router;
