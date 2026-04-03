import { Router, type IRouter, type Request, type Response } from "express";
import Groq from "groq-sdk";
import { jsonrepair } from "jsonrepair";
import rateLimit from "express-rate-limit";

const router: IRouter = Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const medKnowledgeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Too many requests. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

function extractAndRepairJSON(raw: string): string {
  // 1. Strip AI thinking tags (e.g. <thinking>...</thinking>)
  let s = raw.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();

  // 2. Strip all markdown code fences (```json ... ``` or ``` ... ```)
  s = s.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();

  // 3. Find first '[' and last ']' — extract just the array
  const start = s.indexOf("[");
  const end = s.lastIndexOf("]");
  if (start !== -1 && end !== -1 && end > start) {
    s = s.slice(start, end + 1);
  }

  // 4. Use jsonrepair to fix any minor JSON syntax issues
  try {
    s = jsonrepair(s);
  } catch {
    // jsonrepair failed — return as-is and let JSON.parse surface the error
  }

  return s;
}

const HIGHLIGHT_RULE = `
Use exactly THREE levels of highlighting for important terms:
- Wrap CRITICAL/must-know terms (exam high-yield, life-threatening, gold standard) in **double asterisks** — these appear RED
- Wrap IMPORTANT terms (key pathophysiology, major drugs, typical findings) in *single asterisks* — these appear BLUE  
- Wrap NOTABLE terms (supporting facts, less-tested details) in ~~double tildes~~ — these appear GREEN
Apply these markers throughout your entire response. Every sentence should have at least 1–2 highlighted terms.`;

function buildPrompt(section: string, topic: string, subject: string, conditionName?: string, department?: string, mcqCount = 8): string {
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

    mcq: (count: number) => `Generate ${count} high-yield MCQ exam questions about ${entityName} for NEET-PG/USMLE Step 1 & 2 level. Include clinical vignettes where relevant.

CRITICAL OUTPUT RULES:
- Output RAW JSON ONLY — no markdown, no code fences, no backticks, no explanation text
- Start your response with [ and end with ]
- Do NOT write \`\`\`json or \`\`\` anywhere
- Do NOT write any text before [ or after ]

Output format (follow exactly):
[{"question":"Clinical scenario or direct question text here","options":["A. Option A","B. Option B","C. Option C","D. Option D"],"correct":"A","explanation":"Why A is correct and others are wrong"}]`,

    flashcards: `Generate 10 high-yield flashcard pairs for rapid revision of ${entityName} in ${entityContext}. Cover: key facts, drug of choice, diagnostic gold standard, classic presentation, complications, mnemonics.

CRITICAL OUTPUT RULES:
- Output RAW JSON ONLY — no markdown, no code fences, no backticks, no explanation text
- Start your response with [ and end with ]
- Do NOT write \`\`\`json or \`\`\` anywhere
- Do NOT write any text before [ or after ]

Output format (follow exactly):
[{"front":"Question or incomplete statement","back":"Complete concise answer with key facts"}]`,
  };

  const key = isCondition
    ? (section === "overview" ? "overview_condition" : section)
    : (section === "overview" ? "overview_topic" : section);

  const entry = prompts[key] ?? prompts[isCondition ? "overview_condition" : "overview_topic"];
  return typeof entry === "function" ? (entry as (n: number) => string)(mcqCount) : entry;
}

router.post("/med-knowledge/content", medKnowledgeLimiter, async (req: Request, res: Response) => {
  try {
    const { section, topic, subject, conditionName, department, mcqCount } = req.body;

    if (!section) {
      res.status(400).json({ error: "section is required" });
      return;
    }
    if (!topic && !conditionName) {
      res.status(400).json({ error: "topic or conditionName is required" });
      return;
    }

    const resolvedCount = Math.min(Math.max(parseInt(mcqCount) || 8, 1), 50);
    const isJsonSection = section === "mcq" || section === "flashcards";
    const prompt = buildPrompt(section, topic || "", subject || "", conditionName, department, resolvedCount);

    const systemInstruction = isJsonSection
      ? "You are a medical education JSON API. Your ONLY output must be a raw JSON array starting with [ and ending with ]. Never use markdown, code fences, backticks, or any explanatory text. Never wrap the JSON in ```json blocks."
      : "You are a world-class medical educator. Respond with detailed, clinically accurate content suitable for MBBS/MD students and junior doctors.";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
      max_tokens: isJsonSection ? Math.max(4096, resolvedCount * 200) : 8192,
      temperature: isJsonSection ? 0.2 : 0.7,
      ...(isJsonSection ? { response_format: { type: "json_object" } } : {}),
    });

    let content = completion.choices?.[0]?.message?.content || "";

    if (isJsonSection) {
      const raw = content;
      content = extractAndRepairJSON(raw);

      // Validate the JSON parses correctly — throw early with context if not
      try {
        JSON.parse(content);
      } catch (parseErr: any) {
        req.log?.error?.({ parseErr, rawSample: raw.slice(0, 300) }, "JSON parse failed after extraction");
        res.status(500).json({ error: "AI returned malformed data. Please try again." });
        return;
      }
    }

    res.json({ content });
  } catch (err: any) {
    req.log?.error?.({ err }, "Med knowledge content error");
    res.status(500).json({ error: "Failed to generate content. Please try again." });
  }
});

export default router;
