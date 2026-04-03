import { Router, type IRouter, type Request, type Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import rateLimit from "express-rate-limit";

const router: IRouter = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const medKnowledgeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Too many requests. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

function extractJSON(text: string): string {
  let s = text.trim();
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  const match = s.match(/(\[[\s\S]*\])/);
  if (match) return match[1];
  return s;
}

const HIGHLIGHT_RULE = `
Use exactly THREE levels of highlighting for important terms:
- Wrap CRITICAL/must-know terms (exam high-yield, life-threatening, gold standard) in **double asterisks** — these appear RED
- Wrap IMPORTANT terms (key pathophysiology, major drugs, typical findings) in *single asterisks* — these appear BLUE  
- Wrap NOTABLE terms (supporting facts, less-tested details) in ~~double tildes~~ — these appear GREEN
Apply these markers throughout your entire response. Every sentence should have at least 1–2 highlighted terms.`;

function buildPrompt(section: string, topic: string, subject: string, conditionName?: string, department?: string): string {
  const isCondition = !!conditionName;
  const entityName = isCondition ? conditionName! : topic;
  const entityContext = isCondition ? department! : subject;

  const prompts: Record<string, string> = {
    overview_topic: `You are a world-class medical professor writing for MBBS/MD students. Write an encyclopedic, clinically relevant, and exam-focused overview of **${topic}** in **${subject}**. Cover definition, importance, historical context, and a complete conceptual introduction. Write line by line — each sentence or point on its own line. Use section headings like ## Heading. Include key statistics and clinical pearls.
${HIGHLIGHT_RULE}`,

    overview_condition: `You are a world-class clinician and medical educator. Write a comprehensive, encyclopedia-level overview of **${conditionName}** for a medical student or junior doctor. Include definition, epidemiology (global + Indian context), historical background, and clinical importance. Write line by line — each sentence or point on its own line. Use section headings like ## Heading. Include relevant statistics.
${HIGHLIGHT_RULE}`,

    key_concepts: `List 8–12 key concepts a medical student must know about **${entityName}** in **${entityContext}**. Format as a numbered list. Each concept must have a bold title line, then 2–3 sentences of explanation on separate lines. Include mnemonics where applicable (label them as "Mnemonic:").
${HIGHLIGHT_RULE}
Make each point exam-relevant for NEET-PG/USMLE level.`,

    clinical_relevance: `Write a detailed Clinical Relevance section for **${entityName}** covering:
## Common Clinical Presentations
## Surgical/Clinical Applications
## Common Pathologies
## Diagnostic Significance
## Red Flags
Write line by line. Be specific with clinical examples.
${HIGHLIGHT_RULE}`,

    etiology: `List ALL causes and risk factors for **${conditionName}** organized by:
## Modifiable vs Non-modifiable Risk Factors
## Primary vs Secondary Causes
## Predisposing vs Precipitating Factors
For each factor, provide a brief mechanism explanation on a new line. Include Indian-specific epidemiology.
${HIGHLIGHT_RULE}`,

    pathophysiology: `Explain the complete pathophysiology of **${conditionName}** step by step, from initial trigger to final manifestation.
- Use numbered steps, each on its own line
- Include molecular mechanisms, cellular changes, and organ-level effects
- Use → to show progression
- End with a ## Summary section
${HIGHLIGHT_RULE}`,

    clinical_features: `List ALL clinical features of **${conditionName}** organized as:
## Symptoms (organized by system)
## Signs (General → Vitals → Systemic → Special clinical signs)
## Complications (Early, Late, Life-threatening)
Include classic exam findings and clinical significance. Each feature on its own line.
${HIGHLIGHT_RULE}`,

    investigations: `List all investigations for **${conditionName}** organized as:
## First-line Investigations
## Confirmatory Tests (Gold Standard)
## Monitoring Tests
For EACH investigation include what it shows, typical findings, clinical significance, and normal vs abnormal values. Each item on its own line.
${HIGHLIGHT_RULE}`,

    diagnosis: `Explain the diagnostic approach for **${conditionName}**:
## Diagnostic Criteria
## Gold Standard Diagnosis
## Differential Diagnosis (top 5 with distinguishing features)
## Stepwise Approach to the Patient
## How to Differentiate from Mimics
${HIGHLIGHT_RULE}`,

    treatment: `Write a complete, protocol-level treatment guide for **${conditionName}** covering:
## Emergency Management (if applicable)
## Medical Management (first-line, second-line, salvage therapy — specific drug names, doses, mechanisms)
## Surgical/Interventional Management
## Non-pharmacological Management
## Patient Education
## Follow-up Schedule
Write like a clinical protocol. Be specific with drug doses.
${HIGHLIGHT_RULE}`,

    prognosis: `Explain the prognosis of **${conditionName}** including:
## Survival/Outcome Statistics
## Prognostic Factors (favorable and unfavorable)
## Prognostic Scoring Systems (if applicable)
## Acute Complications
## Chronic Complications
## Life-threatening Complications
Include Indian data where available.
${HIGHLIGHT_RULE}`,

    prevention: `Explain prevention strategies for **${conditionName}**:
## Primary Prevention
## Secondary Prevention
## Tertiary Prevention
## Screening Guidelines
## Vaccination (if applicable)
## Lifestyle Modifications (evidence-based)
## Chemoprophylaxis (if applicable)
${HIGHLIGHT_RULE}`,

    special_populations: `How does **${conditionName}** differ in:
## Pregnant Women (risks, drug safety, management changes)
## Elderly Patients (atypical presentation, drug dosing)
## Pediatric Patients (age-specific considerations)
## Renal/Hepatic Failure (dose adjustments, contraindications)
## Immunocompromised Patients (altered presentation and risks)
${HIGHLIGHT_RULE}`,

    mcq: `Generate 8 high-yield MCQ-style exam questions about **${entityName}** for NEET-PG/USMLE Step 1 & 2 level. Include clinical vignettes where relevant.

Return ONLY a valid JSON array. No markdown, no code blocks, no explanation text. Start with [ and end with ].
[
  {
    "question": "Clinical scenario or direct question text here",
    "options": ["A. Option A", "B. Option B", "C. Option C", "D. Option D"],
    "correct": "A",
    "explanation": "Why A is correct and others are wrong"
  }
]`,

    flashcards: `Generate 10 high-yield flashcard pairs for rapid revision of **${entityName}** in **${entityContext}**. Cover: key facts, drug of choice, diagnostic gold standard, classic presentation, complications, mnemonics.

Return ONLY a valid JSON array. No markdown, no code blocks, no explanation text. Start with [ and end with ].
[
  {
    "front": "Question or incomplete statement",
    "back": "Complete concise answer with key facts"
  }
]`,
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

    const isJsonSection = section === "mcq" || section === "flashcards";
    const prompt = buildPrompt(section, topic || "", subject || "", conditionName, department);

    const modelName = isJsonSection ? "gemini-1.5-flash" : "gemini-1.5-pro";

    const systemInstruction = isJsonSection
      ? "You are a medical education JSON API. Output ONLY a valid JSON array starting with [ and ending with ]. Absolutely no markdown, no code fences, no explanation text before or after the JSON."
      : "You are a world-class medical educator. Respond with detailed, clinically accurate content suitable for MBBS/MD students and junior doctors.";

    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction,
      generationConfig: {
        maxOutputTokens: isJsonSection ? 2000 : 4096,
        temperature: isJsonSection ? 0.3 : 0.7,
      },
    });

    const result = await model.generateContent(prompt);
    let content = result.response.text();

    if (isJsonSection) {
      content = extractJSON(content);
    }

    res.json({ content });
  } catch (err: any) {
    req.log?.error?.({ err }, "Med knowledge content error");
    res.status(500).json({ error: "Failed to generate content. Please try again." });
  }
});

export default router;
