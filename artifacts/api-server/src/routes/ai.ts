import { Router, type IRouter } from "express";
import Groq from "groq-sdk";
import https from "https";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { jsonrepair } from "jsonrepair";
import rateLimit from "express-rate-limit";

const router: IRouter = Router();

// Rate limiting for AI endpoints — prevents abuse and cost spikes
const aiChatLimiter = rateLimit({
  windowMs: 60 * 1000,      // 1-minute window
  max: 20,                  // 20 chat requests/min per IP
  message: { error: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});
const aiImageLimiter = rateLimit({
  windowMs: 60 * 1000,      // 1-minute window
  max: 5,                   // 5 image generations/min per IP
  message: { error: "Image generation rate limit reached. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});
const aiHeavyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,  // 5-minute window
  max: 3,                   // 3 deep-research/presentation/slides per 5 min
  message: { error: "Heavy AI task rate limit reached. Please wait before running another." },
  standardHeaders: true,
  legacyHeaders: false,
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];

interface AiCallOpts {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
  jsonMode?: boolean;
}

function isRateLimited(err: any): boolean {
  return err?.status === 429 || err?.statusCode === 429 || err?.error?.code === "rate_limit_exceeded";
}

async function aiGenerate(opts: AiCallOpts): Promise<string> {
  const { systemPrompt, userPrompt, maxTokens = 4096, temperature = 0.7, jsonMode = false } = opts;
  let lastErr: any;

  for (const model of GROQ_MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      });
      const text = completion.choices?.[0]?.message?.content || "";
      if (text) return text;
    } catch (err: any) {
      lastErr = err;
      if (isRateLimited(err)) continue;
      console.error(`Groq ${model} error:`, err?.message || err);
      break;
    }
  }

  throw lastErr || new Error("AI service temporarily unavailable. Please try again.");
}

async function aiChat(opts: AiCallOpts & { history?: Array<{ role: string; content: string }> }): Promise<string> {
  const { systemPrompt, userPrompt, maxTokens = 8192, temperature = 0.7, history = [] } = opts;
  let lastErr: any;

  for (const model of GROQ_MODELS) {
    try {
      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: systemPrompt },
        ...history.map(m => ({
          role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: userPrompt },
      ];
      const completion = await groq.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      });
      const text = completion.choices?.[0]?.message?.content || "";
      if (text) return text;
    } catch (err: any) {
      lastErr = err;
      if (isRateLimited(err)) continue;
      console.error(`Groq chat ${model} error:`, err?.message || err);
      break;
    }
  }

  throw lastErr || new Error("AI service temporarily unavailable. Please try again.");
}

async function aiVision(opts: { systemPrompt: string; userPrompt: string; imageBase64: string; imageType: string; maxTokens?: number }): Promise<string> {
  const { systemPrompt, userPrompt, imageBase64, imageType, maxTokens = 2048 } = opts;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.2-90b-vision-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: [
          { type: "image_url", image_url: { url: `data:${imageType};base64,${imageBase64}` } },
          { type: "text", text: userPrompt },
        ] as any },
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
    });
    const text = completion.choices?.[0]?.message?.content || "";
    if (text) return text;
  } catch (err: any) {
    console.error("Groq vision error:", err?.message || err);
    throw err;
  }

  throw new Error("AI vision service temporarily unavailable. Please try again.");
}

const agentPrompts: Record<string, { systemPrompt: string; suggestions: string[] }> = {
  cadus: {
    systemPrompt: `You are Cadus AI — the primary AI medical assistant for aethex, India's premier medical store for doctors and medical students.
You are a knowledgeable, professional, and approachable assistant who helps with:
- Medical product recommendations (stethoscopes, BP machines, surgical instruments, scrubs, aprons, etc.)
- Study material and book recommendations for medical exams (NEET-PG, USMLE, MBBS, MD courses)
- Clinical queries and general medical information
- Guidance on medical equipment selection
- Tips for medical students and resident doctors
Keep responses helpful, professional, and concise. Always recommend consulting senior doctors or specialists for clinical decisions. Your name is Cadus AI.

FORMATTING RULES (always follow):
- Never write long unbroken paragraphs.
- Break every answer into short, clear lines or bullet points.
- Use numbered steps for procedures or sequences.
- Use bullet points for lists of facts, options, or differentials.
- Each line should carry one clear idea.
- Use bold headings (e.g. **Diagnosis:**, **Management:**) to organise sections.`,
    suggestions: [
      "Which stethoscope is best for a medical student?",
      "Recommend books for NEET-PG 2025",
      "Best BP machine for a new clinic",
      "What scrubs are suitable for long shifts?",
    ],
  },
  pulse45: {
    systemPrompt: `You are Cadus AI — a specialized medical assistant for aethex focused on patient vitals, physiological monitoring, emergency medicine, and critical care for Indian doctors and medical students.
Your expertise covers:
- Vital signs interpretation (BP, HR, SpO2, temperature, respiratory rate)
- Emergency medicine protocols and ACLS/BLS guidelines
- Critical care and ICU management
- Physiological monitoring equipment recommendations (pulse oximeters, ECG monitors, BP machines)
- Triage and acute care decision support
- Resuscitation algorithms and drug dosages
- NEET-PG emergency medicine and critical care prep
Keep responses fast, clear, and clinically actionable. Always recommend senior supervision for critical decisions. Your name is Cadus AI.

FORMATTING RULES (always follow):
- Never write long unbroken paragraphs.
- Break every answer into short, clear lines or bullet points.
- Use numbered steps for procedures or sequences.
- Use bullet points for lists of facts, options, or differentials.
- Each line should carry one clear idea.
- Use bold headings (e.g. **Vitals:**, **Action:**) to organise sections.`,
    suggestions: [
      "Normal SpO2 range for adults?",
      "ACLS algorithm for cardiac arrest?",
      "Best pulse oximeter for ICU?",
      "Sepsis management protocol India",
    ],
  },
  flux36: {
    systemPrompt: `You are FLUX 3.6 — a specialized AI agent for aethex focused on pharmacology, drug interactions, clinical biochemistry, and laboratory medicine for Indian doctors and medical students.
Your expertise covers:
- Drug dosages, interactions, and contraindications
- Pharmacokinetics and pharmacodynamics
- Antibiotic stewardship and antimicrobial therapy
- Lab value interpretation (CBC, LFT, RFT, lipid panels, coagulation)
- Clinical biochemistry and pathology reference
- NEET-PG pharmacology and pathology prep
- Rational drug prescribing for common conditions
Keep responses evidence-based, precise, and grounded in standard Indian formulary and guidelines. Your name is FLUX 3.6.

FORMATTING RULES (always follow):
- Never write long unbroken paragraphs.
- Break every answer into short, clear lines or bullet points.
- Use numbered steps for procedures or sequences.
- Use bullet points for lists of drugs, interactions, or lab values.
- Each line should carry one clear idea.
- Use bold headings (e.g. **Drug:**, **Dose:**, **Caution:**) to organise sections.`,
    suggestions: [
      "Drug interactions with warfarin?",
      "Normal LFT values and interpretation?",
      "Antibiotic for community-acquired pneumonia?",
      "NEET-PG pharmacology high-yield topics",
    ],
  },
  nova46: {
    systemPrompt: `You are NOVA 4.6 — aethex's most advanced AI research and diagnostic assistant, powered by cutting-edge reasoning capabilities.
You specialise in:
- Complex diagnostic reasoning and differential diagnosis
- Rare disease identification and literature synthesis
- Advanced surgical planning and procedural guidance
- Personalised treatment protocol design
- Deep medical research summarisation
- Multispecialty second opinions
- Cutting-edge clinical trial and guideline updates
You provide expert-level, deeply reasoned responses that go far beyond standard AI assistants. Your name is NOVA 4.6, and you are a Pro-tier agent.

FORMATTING RULES (always follow):
- Never write long unbroken paragraphs.
- Break every answer into short, clear lines or bullet points.
- Use numbered steps for procedures, differentials, or reasoning chains.
- Use bullet points for lists of findings, diagnoses, or recommendations.
- Each line should carry one clear idea.
- Use bold headings (e.g. **Diagnosis:**, **Reasoning:**, **Plan:**) to organise sections.`,
    suggestions: [
      "Differential for unexplained weight loss in young adults?",
      "Latest ACC/AHA heart failure guidelines 2024?",
      "Complex drug regimen optimisation for multimorbidity",
      "Rare autoimmune conditions mimicking SLE",
    ],
  },
};

// ── DEEP RESEARCH ────────────────────────────────────────────────────────────
router.post("/ai/deep-research", aiHeavyLimiter, async (req, res) => {
  try {
    const { query, agent = "cadus" } = req.body;
    if (!query) { res.status(400).json({ error: "query is required" }); return; }

    const GOOGLE_API_KEY = process.env.GOOGLE_CSE_KEY;
    const GOOGLE_CSE_ID  = process.env.GOOGLE_CSE_ID;
    const hasGoogleSearch = !!(GOOGLE_API_KEY && GOOGLE_CSE_ID);

    // Step 1 — generate focused search sub-queries via AI
    let searchQueries: string[] = [];
    try {
      const raw = await aiGenerate({
        systemPrompt: "You are a medical research query generator. Generate 4 targeted Google search queries to comprehensively research the given medical topic from multiple angles (pathophysiology, clinical, guidelines, Indian context). Return ONLY a JSON array of strings, no other text. Example: [\"query1\",\"query2\",\"query3\",\"query4\"]",
        userPrompt: query,
        maxTokens: 300,
        temperature: 0.2,
      }) || "[]";
      const parsed = JSON.parse(jsonrepair(raw));
      searchQueries = Array.isArray(parsed) ? parsed.map(String) : [];
    } catch { /* fall through */ }
    if (!searchQueries.length) {
      searchQueries = [
        query,
        `${query} clinical guidelines India 2024`,
        `${query} pathophysiology mechanism`,
        `${query} management treatment protocol`,
      ];
    }

    // Step 2 — Google Custom Search (if keys are set)
    interface Src { title: string; url: string; snippet: string; domain: string; }
    const sources: Src[] = [];

    if (hasGoogleSearch) {
      await Promise.allSettled(
        searchQueries.slice(0, 4).map(async (q) => {
          try {
            const url = new URL("https://www.googleapis.com/customsearch/v1");
            url.searchParams.set("key", GOOGLE_API_KEY!);
            url.searchParams.set("cx",  GOOGLE_CSE_ID!);
            url.searchParams.set("q",   q);
            url.searchParams.set("num", "4");
            const resp = await fetch(url.toString());
            if (!resp.ok) return;
            const data: any = await resp.json();
            for (const item of (data.items ?? []).slice(0, 4)) {
              try {
                sources.push({
                  title:   String(item.title   ?? ""),
                  url:     String(item.link    ?? ""),
                  snippet: String(item.snippet ?? ""),
                  domain:  new URL(item.link).hostname.replace(/^www\./, ""),
                });
              } catch { /* skip malformed items */ }
            }
          } catch { /* skip failed queries */ }
        }),
      );
    }

    // Step 3 — AI synthesis with source grounding
    const sourceBlock = sources.length
      ? `\n\n---\nLIVE SEARCH RESULTS (from Google):\n${
          sources.map((s, i) => `[${i + 1}] ${s.title}\n${s.snippet}\nSource: ${s.url}`).join("\n\n")
        }\n---`
      : "";

    const systemPrompt = `You are Cadus AI — a world-class medical research assistant for Indian doctors and medical students. You are now operating in DEEP RESEARCH mode.

Your task is to produce an exceptionally comprehensive, evidence-based, and clinically practical medical research report.${sources.length ? " Cite the provided search results using [1], [2], etc. where relevant." : ""}

Structure your report using EXACTLY these section headers (markdown ##):
## Executive Summary
## Epidemiology & Indian Burden
## Pathophysiology
## Clinical Presentation
## Diagnosis
## Management & Treatment
## Key Guidelines & Evidence
## Clinical Pearls

Requirements:
- Write like a senior clinician explaining to a junior resident — practical and evidence-based
- Use **bold** for critical terms, drug names, key values, and red flags
- Include specific numbers, percentages, dosages, and timeframes wherever relevant
- Reference Indian epidemiology, ICMR/NMC guidelines, and local clinical context
- Each section should be thorough: 150-300 words minimum
- End each section with a "**Takeaway:**" summary line
- Use bullet points (- ) for lists within sections
- Be factually accurate — this is read by medical professionals`;

    const report = await aiGenerate({
      systemPrompt,
      userPrompt: `Deep research request: ${query}${sourceBlock}`,
      maxTokens: 8192,
      temperature: 0.6,
    }) || "Unable to generate research report.";

    res.json({ report, sources: sources.slice(0, 12), searchQueries, hasGoogleSearch });
  } catch (err) {
    req.log.error({ err }, "Deep research error");
    res.status(500).json({ error: "Deep research service failed" });
  }
});

const LANG_NAMES: Record<string, string> = {
  en: "English", hi: "Hindi", as: "Assamese", bn: "Bengali", brx: "Bodo",
  doi: "Dogri", gu: "Gujarati", kn: "Kannada", ks: "Kashmiri", kok: "Konkani",
  mai: "Maithili", ml: "Malayalam", mni: "Manipuri (Meitei)", mr: "Marathi",
  ne: "Nepali", or: "Odia", pa: "Punjabi", sa: "Sanskrit", sat: "Santali",
  sd: "Sindhi", ta: "Tamil", te: "Telugu", ur: "Urdu",
};

const MODE_PROMPTS: Record<string, string> = {
  "drug-interactions": `You are Cadus AI Drug Interaction Checker — an expert clinical pharmacologist for Indian doctors.
For any drug(s) the user provides, return a comprehensive interaction analysis:
1. 🔴 SEVERE interactions (avoid combination — explain why and provide alternatives)
2. 🟡 MODERATE interactions (use with caution — monitoring needed, dose adjustments)
3. 🟢 MILD interactions (generally safe — minor monitoring)
4. 🍎 Drug-Food interactions (grapefruit, dairy, alcohol, tyramine, etc.)
5. ⚕️ Clinical Alternatives for dangerous combinations
Format clearly with severity badges, mechanism of interaction, and clinical management.
Always cite mechanism (e.g. CYP3A4 inhibition, QT prolongation, serotonin syndrome).`,

  "dosage-calc": `You are Cadus AI Dosage Calculator — a clinical pharmacist specialised for Indian medical practice.
For any drug and patient parameters the user provides, calculate the appropriate dose with full workup:
1. Standard adult dose and route
2. Weight-based calculation (mg/kg) with step-by-step working
3. Renal dose adjustment (eGFR-based, Cockcroft-Gault equation if needed)
4. Hepatic dose adjustment (Child-Pugh score if relevant)
5. Paediatric dosing (by age/weight bracket)
6. Geriatric considerations (Beers criteria, reduced clearance)
7. ICU/critical care dosing if applicable
8. Maximum daily dose and duration
Show all calculations clearly. Reference standard formulary (BNFC, Micromedex, Indian National Formulary).`,

  "lab-values": `You are Cadus AI Lab Values Interpreter — a clinical pathologist and biochemist for Indian doctors.
For any lab results the user pastes, provide:
1. Reference ranges (with Indian lab context where different from Western)
2. ✅ Normal / ⚠️ Borderline / 🔴 Critical flags for each value
3. Clinical interpretation of the pattern (e.g. normocytic anaemia, cholestatic pattern)
4. Differential diagnoses suggested by the lab picture
5. Correlation with clinical symptoms if provided
6. Action points: repeat, urgent review, specialist referral, treatment initiation
7. Next investigations to consider
Format as a structured table where appropriate. Panels: CBC, LFT, RFT/KFT, lipid profile, ABG, TFT, coagulation, electrolytes, cardiac biomarkers, HbA1c.`,

  "soap-note": `You are Cadus AI SOAP Note Generator — a clinical documentation specialist.
Convert any clinical narrative into a perfectly structured SOAP note:

**S — Subjective**: Chief complaint, HPI (onset, duration, character, severity, associated symptoms, relieving/aggravating factors), past medical history, medications, allergies, social history, family history, review of systems.
**O — Objective**: Vital signs, physical examination findings (general appearance, systems exam), lab results, imaging, ECG findings.
**A — Assessment**: Primary diagnosis with ICD-10 code, differential diagnoses ranked by probability, clinical reasoning.
**P — Plan**: Investigations ordered, medications (name, dose, route, duration), procedures, referrals, patient education, follow-up schedule.

Be concise, professional, and use standard medical abbreviations. Format for easy EMR entry.`,

  "mcq-gen": `You are Cadus AI MCQ Generator — an expert medical educator for NEET-PG, USMLE, and MBBS exams.
Generate 5 high-quality clinical vignette-style MCQs on the given topic:
- Format: Clinical scenario → Question → 4 options (A, B, C, D) → ✅ Correct answer → 📝 Explanation (why correct and why others are wrong)
- Style: NEET-PG/USMLE Step 2 standard with realistic clinical vignettes
- Include: one-best-answer format, evidence-based answers, high-yield content
- Mix: 2 factual, 2 applied clinical, 1 tricky/exception question
- Tag each with: difficulty (Easy/Medium/Hard) and topic subtag
Always include a brief explanation that teaches the concept, not just the answer.`,

  "patient-edu": `You are Cadus AI Patient Educator — a compassionate medical communicator.
Translate complex medical information into simple, easy-to-understand language for patients and families:
1. Avoid jargon — use everyday words
2. Explain: What is this condition? What causes it? How is it treated?
3. What should the patient DO and AVOID?
4. Warning signs that need immediate attention
5. Lifestyle modifications (diet, exercise, habits)
6. Medication guidance in simple terms
7. Follow-up instructions
If the user requests Hindi or another Indian language, respond in that language with warm, respectful tone.
Keep responses reassuring, clear, and actionable. Use simple analogies.`,

  "procedure-guide": `You are Cadus AI Procedure Guide — a clinical skills trainer for doctors and residents.
Provide comprehensive step-by-step procedure walkthroughs:
1. 📋 Indications and Contraindications
2. 🩺 Equipment checklist
3. 💉 Patient preparation (consent, positioning, anaesthesia)
4. 🔢 Step-by-step procedure (numbered, detailed)
5. ✅ Confirmation of success / correct placement
6. ⚠️ Complications and how to manage them
7. 📝 Post-procedure care and documentation
8. 🎓 Key tips and common mistakes to avoid
Procedures covered: LP, central line, arterial line, chest drain, intubation, suturing, IV access, urinary catheterisation, paracentesis, thoracocentesis, cardioversion, pericardiocentesis, bone marrow biopsy, etc.`,

  "ddx": `You are Cadus AI Differential Diagnosis Engine — a senior clinical diagnostician.
For any symptoms/vitals/history the user provides, generate:
1. 🔢 Ranked Differential Diagnosis list (most likely → least likely)
2. For each DDx: ICD-10 code, key supporting features, distinguishing features
3. 🚨 Red flags that must be ruled out urgently
4. 🔬 Suggested workup plan: investigations (bloods, imaging, special tests)
5. 📊 Probability estimate for top 3 differentials
6. ⚡ Immediate management if emergency features present
Format as a structured clinical assessment. Always recommend senior review for complex cases.`,
};

router.post("/ai/chat", aiChatLimiter, async (req, res) => {
  try {
    const { message, conversationHistory = [], agent = "cadus", language = "en", mode = "normal", specialty = "General" } = req.body;

    if (!message) {
      res.status(400).json({ error: "message is required" });
      return;
    }

    const agentKey = String(agent).toLowerCase().replace(/[\s.]/g, "");
    const agentConfig = agentPrompts[agentKey] ?? agentPrompts.cadus;

    const langName = LANG_NAMES[String(language)] ?? "English";
    const langInstruction = langName !== "English"
      ? `\n\nIMPORTANT: The user has set their language to ${langName}. You MUST respond entirely in ${langName} (${language}) for every reply. Do not switch to English unless the user explicitly writes in English.`
      : "";

    const modeKey = String(mode).toLowerCase();
    const modeSystemPrompt = MODE_PROMPTS[modeKey] ?? agentConfig.systemPrompt;

    const specialtyInstruction = specialty && specialty !== "General"
      ? `\n\nSPECIALTY CONTEXT: The user is working in ${specialty}. Apply ${specialty}-specific guidelines, drug dosages, and clinical protocols where relevant.`
      : "";

    const finalSystemPrompt = modeKey !== "normal"
      ? modeSystemPrompt + specialtyInstruction + langInstruction
      : agentConfig.systemPrompt + specialtyInstruction + langInstruction;

    const responseMessage = await aiChat({
      systemPrompt: finalSystemPrompt,
      userPrompt: message,
      maxTokens: 8192,
      temperature: 0.7,
      history: conversationHistory,
    }) || "I'm sorry, I couldn't process your request.";

    res.json({ message: responseMessage, suggestions: agentConfig.suggestions });
  } catch (err) {
    req.log.error({ err }, "Error calling AI chat");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

router.post("/ai/export-pdf", async (req, res) => {
  try {
    const { content = "", title = "Cadus AI Clinical Report", mode = "" } = req.body;
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const addPage = () => {
      const p = pdfDoc.addPage([595, 842]);
      return p;
    };

    const MARGIN = 50; const LINE_H = 16; const BODY_W = 595 - MARGIN * 2;
    let page = addPage();
    let { height } = page.getSize();
    let y = height - MARGIN;

    const drawText = (text: string, opts: { bold?: boolean; size?: number; color?: [number,number,number]; x?: number } = {}) => {
      const { bold = false, size = 11, color = [0.9,0.95,1], x = MARGIN } = opts;
      const f = bold ? boldFont : font;
      const words = text.split(" ");
      let line = "";
      const lines: string[] = [];
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (f.widthOfTextAtSize(test, size) > BODY_W) { lines.push(line); line = w; }
        else line = test;
      }
      if (line) lines.push(line);
      for (const l of lines) {
        if (y < MARGIN + LINE_H * 2) { page = addPage(); ({ height } = page.getSize()); y = height - MARGIN; }
        page.drawText(l, { x, y, size, font: f, color: rgb(color[0], color[1], color[2]) });
        y -= LINE_H;
      }
    };

    // Header bar
    page.drawRectangle({ x: 0, y: height - 60, width: 595, height: 60, color: rgb(0.05, 0.1, 0.25) });
    page.drawText("Cadus AI", { x: MARGIN, y: height - 38, size: 22, font: boldFont, color: rgb(0.6, 0.85, 1) });
    const modeLabel = mode && mode !== "normal" ? ` | ${mode.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}` : "";
    page.drawText(`Clinical Report${modeLabel}`, { x: MARGIN + 96, y: height - 38, size: 11, font, color: rgb(0.7, 0.8, 0.95) });
    page.drawText(new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), { x: 595 - MARGIN - 100, y: height - 38, size: 9, font, color: rgb(0.5, 0.6, 0.8) });

    y = height - 80;
    drawText(title, { bold: true, size: 15, color: [0.95, 0.98, 1] });
    y -= 8;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: 595 - MARGIN, y }, thickness: 0.5, color: rgb(0.2, 0.4, 0.7) });
    y -= 14;

    const lines = (content as string).split("\n");
    for (const line of lines) {
      const stripped = line.trimStart();
      if (stripped.startsWith("### ")) {
        y -= 6;
        drawText(stripped.slice(4), { bold: true, size: 11, color: [0.6, 0.85, 1] });
        y -= 2;
      } else if (stripped.startsWith("## ")) {
        y -= 8;
        drawText(stripped.slice(3), { bold: true, size: 12, color: [0.4, 0.75, 1] });
        y -= 4;
      } else if (stripped.startsWith("# ")) {
        y -= 10;
        drawText(stripped.slice(2), { bold: true, size: 14, color: [0.7, 0.9, 1] });
        y -= 6;
      } else if (stripped.startsWith("- ") || stripped.startsWith("• ")) {
        drawText(`  • ${stripped.slice(2)}`, { size: 10 });
      } else if (stripped === "") {
        y -= LINE_H * 0.5;
      } else {
        const clean = stripped.replace(/\*\*(.*?)\*\*/g, "$1");
        drawText(clean, { size: 10 });
      }
    }

    // Footer
    const lastPage = pdfDoc.getPages().at(-1)!;
    lastPage.drawRectangle({ x: 0, y: 0, width: 595, height: 28, color: rgb(0.04, 0.08, 0.2) });
    lastPage.drawText("Generated by Cadus AI AI — aethex Medical Platform | For clinical use only — always verify with senior clinician", { x: MARGIN, y: 9, size: 7, font, color: rgb(0.4, 0.5, 0.7) });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
    res.json({ pdfBase64 });
  } catch (err) {
    req.log.error({ err }, "Error generating response PDF");
    res.status(500).json({ error: "PDF generation failed" });
  }
});

router.post("/ai/analyze-image", aiImageLimiter, async (req, res) => {
  try {
    const { imageBase64, imageType = "image/jpeg", query = "Please analyze this medical image.", specialty = "General" } = req.body;
    if (!imageBase64) { res.status(400).json({ error: "imageBase64 is required" }); return; }

    const specialtyCtx = specialty && specialty !== "General"
      ? `\n\nSPECIALTY CONTEXT: Apply ${specialty}-specific imaging interpretation guidelines.`
      : "";

    const visionSysPrompt = `You are Cadus AI Medical Imaging AI — an expert clinical radiologist, cardiologist (ECG), and ophthalmologist (fundus) for Indian doctors.

CRITICAL RULES:
- NEVER comment on the origin, source, or provenance of the image (e.g., never say "this looks like a web example", "this appears to be a stock image", "not a real patient film", etc.)
- NEVER question whether the image is real, diagnostic-quality, or from a patient
- If image quality is genuinely too low to interpret (blurry, unreadable pixels), simply state "Image resolution is too low to perform a reliable analysis — please upload a clearer version" and stop
- Otherwise, ALWAYS perform the full clinical analysis on whatever image is provided without any caveats about image origin

Analyze the uploaded medical image and provide:
1. 🖼️ Image Type & Quality Assessment (X-ray/CT/MRI/ECG/Fundus/Ultrasound/Other)
2. 📋 Key Findings — enumerate all significant observations systematically
3. 🔴 Critical/Urgent Findings (if any — highlight clearly)
4. 🩺 Likely Diagnosis / Differential Diagnoses with ICD-10 codes
5. ✅ Normal Structures — what is within normal limits
6. 🔬 Suggested Next Steps: additional imaging, clinical correlation, urgent interventions
7. 📝 Report Summary (1-2 sentences for clinical documentation)

Use systematic approach (e.g. for CXR: ABCDE — Airway, Breathing, Cardiac, Diaphragm, Everything else).
Caveat at the end: "This is AI-assisted analysis — always correlate clinically and seek radiology/specialist review."${specialtyCtx}`;

    const analysis = await aiVision({
      systemPrompt: visionSysPrompt,
      userPrompt: (query as string) || "Please provide a full clinical analysis of this medical image.",
      imageBase64: imageBase64 as string,
      imageType: imageType as string,
      maxTokens: 2048,
    }) || "Unable to analyze image.";
    res.json({ analysis });
  } catch (err: any) {
    req.log.error({ err }, "Error analyzing medical image");
    res.status(500).json({ error: "Image analysis failed. Please ensure a clear medical image was uploaded." });
  }
});

// ── Wikipedia image helper — free, no API key, medical-specific ───────────
const MEDICAL_PLACEHOLDER = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1024&q=80";

function httpsGet(url: string): Promise<{ status: number; location?: string; body: string }> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "AETHEX-Medical-Education/1.0 (educational platform)" } }, (res) => {
      let body = "";
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => resolve({ status: res.statusCode ?? 0, location: res.headers.location, body }));
    }).on("error", reject);
  });
}

async function fetchWikipediaImage(prompt: string, wantLabeled: boolean): Promise<string | null> {
  try {
    // Extract 1-3 meaningful medical words from the prompt
    const stopWords = new Set(["the","of","in","and","for","a","an","with","to","on","at","by","from","or","is","are","was","were","be","as","its","which","that","this","these","those","about","after","before","during"]);
    const words = prompt.replace(/[^\w\s]/g, " ").split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()));

    // FIX 1 — reproductive anatomy detection + smarter search terms
    const humanBodyParts = ["penis","vagina","uterus","ovary","testis","testes","breast","vulva","cervix","prostate","scrotum","foreskin","glans","clitoris","labia"];
    const isReproductive = humanBodyParts.some(part => prompt.toLowerCase().includes(part));
    const searchTerm = wantLabeled
      ? `human ${words.slice(0, 2).join(" ")} anatomy labeled diagram`
      : isReproductive
        ? `human ${words.slice(0, 2).join(" ")} anatomy`
        : words.slice(0, 3).join(" ");

    // FIX 2 — prefer "Human X" article for reproductive/labeled (Wikipedia has dedicated human anatomy articles)
    const humanFirst = isReproductive || wantLabeled;
    const primaryTerm = humanFirst ? `Human ${words.slice(0, 2).join(" ")}` : searchTerm;

    // 1. Try Wikipedia REST summary API (returns the main article image)
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(primaryTerm)}`;
    const summaryResp = await httpsGet(summaryUrl);
    if (summaryResp.status === 200) {
      const data = JSON.parse(summaryResp.body) as Record<string, any>;
      const imgUrl = (data.originalimage?.source ?? data.thumbnail?.source) as string | undefined;
      if (imgUrl) return imgUrl;
      // If "Human X" had no image, try the original searchTerm as fallback
      if (humanFirst) {
        const fallbackUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;
        const fallbackResp = await httpsGet(fallbackUrl);
        if (fallbackResp.status === 200) {
          const fallbackData = JSON.parse(fallbackResp.body) as Record<string, any>;
          const fbImg = (fallbackData.originalimage?.source ?? fallbackData.thumbnail?.source) as string | undefined;
          if (fbImg) return fbImg;
        }
      }
    }

    // 2. Fallback: search Wikipedia for the term and get image from first result
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=0&format=json&srlimit=3&srprop=snippet`;
    const searchResp = await httpsGet(searchUrl);
    if (searchResp.status === 200) {
      const searchData = JSON.parse(searchResp.body) as Record<string, any>;
      const hits = (searchData.query?.search ?? []) as any[];
      for (const hit of hits) {
        const title = hit.title as string;
        const pageUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        const pageResp = await httpsGet(pageUrl);
        if (pageResp.status === 200) {
          const pageData = JSON.parse(pageResp.body) as Record<string, any>;
          const imgUrl = (pageData.originalimage?.source ?? pageData.thumbnail?.source) as string | undefined;
          if (imgUrl) return imgUrl;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}


router.post("/ai/generate-image", aiImageLimiter, async (req, res) => {
  try {
    const { prompt, labeled, imageStyle } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "prompt is required" });
      return;
    }

    const style: string = imageStyle ?? (labeled ? "diagram" : "simple");
    const wantLabels = style === "real-labeled" || style === "diagram";

    // ── Step 1: Always try Wikipedia first (free, reliable, medically accurate) ──
    const wikiImg = await fetchWikipediaImage(String(prompt), wantLabels);

    if (wikiImg) {
      if (wantLabels) {
        let labels: string[] = [];
        try {
          const labelText = (await aiGenerate({
            systemPrompt: "You are an anatomy expert. Return ONLY a JSON array of strings.",
            userPrompt: `List 6-8 key anatomical structures of the human ${prompt} as a JSON array of strings. Example: ["Glans","Corpus cavernosum","Urethra"]. Return ONLY the JSON array.`,
            maxTokens: 500,
            temperature: 0.3,
          })).trim();
          labels = JSON.parse(labelText.replace(/```json|```/g, "").trim());
        } catch {
          const fallbackLabels: Record<string, string[]> = {
            heart: ["Left ventricle", "Right ventricle", "Left atrium", "Right atrium", "Aorta", "Pulmonary artery", "Mitral valve", "Tricuspid valve"],
            brain: ["Cerebrum", "Cerebellum", "Brainstem", "Frontal lobe", "Parietal lobe", "Temporal lobe", "Occipital lobe", "Thalamus"],
            lung: ["Upper lobe", "Middle lobe", "Lower lobe", "Bronchus", "Trachea", "Alveoli", "Pleura", "Diaphragm"],
            kidney: ["Cortex", "Medulla", "Renal pelvis", "Ureter", "Nephron", "Glomerulus", "Renal artery", "Renal vein"],
            liver: ["Right lobe", "Left lobe", "Hepatic artery", "Portal vein", "Bile duct", "Gallbladder", "Central vein", "Hepatocytes"],
            eye: ["Cornea", "Iris", "Pupil", "Lens", "Retina", "Optic nerve", "Vitreous humor", "Sclera"],
            ear: ["Pinna", "Tympanic membrane", "Cochlea", "Semicircular canals", "Ossicles", "Eustachian tube", "Auditory nerve", "Vestibule"],
            stomach: ["Fundus", "Body", "Antrum", "Pylorus", "Cardia", "Lesser curvature", "Greater curvature", "Rugae"],
            spine: ["Cervical vertebrae", "Thoracic vertebrae", "Lumbar vertebrae", "Sacrum", "Intervertebral disc", "Spinal cord", "Vertebral body", "Spinous process"],
            skull: ["Frontal bone", "Parietal bone", "Temporal bone", "Occipital bone", "Sphenoid", "Mandible", "Maxilla", "Zygomatic bone"],
            penis: ["Glans", "Corpus cavernosum", "Corpus spongiosum", "Urethra", "Foreskin", "Frenulum", "Bulb", "Crus"],
            uterus: ["Fundus", "Body", "Cervix", "Endometrium", "Myometrium", "Fallopian tube", "Ovary", "Broad ligament"],
            skin: ["Epidermis", "Dermis", "Hypodermis", "Hair follicle", "Sweat gland", "Sebaceous gland", "Nerve endings", "Blood vessels"],
          };
          const key = Object.keys(fallbackLabels).find(k => prompt.toLowerCase().includes(k));
          labels = key ? fallbackLabels[key] : [];
        }
        return res.json({ imageUrl: wikiImg, isPlaceholder: false, source: "wikipedia", labels });
      }
      return res.json({ imageUrl: wikiImg, isPlaceholder: false, source: "wikipedia" });
    }

    // ── Step 2: Final fallback — placeholder ──
    return res.json({ imageUrl: MEDICAL_PLACEHOLDER, isPlaceholder: true });
  } catch (err: any) {
    req.log.error({ err }, "Error generating image");
    res.json({ imageUrl: MEDICAL_PLACEHOLDER, isPlaceholder: true });
  }
});

// ── /api/ai/generate-slides — returns JSON slide data for in-browser viewer ──
router.post("/ai/generate-slides", aiHeavyLimiter, async (req, res) => {
  try {
    const rawPrompt = req.body.prompt;
    if (!rawPrompt) { res.status(400).json({ error: "prompt is required" }); return; }
    const prompt = String(rawPrompt).replace(/[^\w\s.,;:!?'"()\-\/+%#@&]/g, "").trim().slice(0, 500);
    if (!prompt) { res.status(400).json({ error: "prompt is required" }); return; }
    const { slideCount } = req.body;

    const count = Math.max(5, Math.min(20, parseInt(String(slideCount ?? 12)) || 12));
    const useFullTemplate = count >= 10;

    const slideTypesInstructions = useFullTemplate
      ? `Generate EXACTLY ${count} slides with these types in order:
title, overview, anatomy, physiology, pathways, clinical, conditions, redflags, mindmap, faq, glossary, summary`
      : `Generate ${count} slides. First slide type "title", last type "summary". Middle slides: overview, anatomy, physiology, clinical, faq, glossary.`;

    const slideSysPrompt = "You are Cadus AI, a medical education AI. Return ONLY valid JSON — no markdown, no fences, no explanation. ASCII only (no Unicode, no Greek letters, spell them out). EVERY content field must contain real text — never output an empty string for b1-b6, c1h, c1b, c2h, c2b, c3h, c3b, s1v, s1l, s2v, s2l, s3v, s3l, lh, lb, or r1-r4.";

    const slideUserPrompt = `Create a ${count}-slide medical education presentation on: "${prompt}".

${slideTypesInstructions}

LAYOUT SYSTEM — every content slide gets a "layout" field and matching data:
- layout "stats": 3 giant clinical numbers. Fields: s1v (value e.g. "86B"), s1l (label), s1d (description 8-12 words), s2v, s2l, s2d, s3v, s3l, s3d, caption (1 sentence summarizing the numbers)
- layout "cards": 3 topic columns. Fields: c1h (heading 3-5 words), c1b (body 50-60 words of complete sentences), c2h, c2b, c3h, c3b
- layout "twocol": paragraph left + bullets right. Fields: lh (subheading 4-6 words), lb (body paragraph 40-55 words), r1/r2/r3/r4 (bullet points 12-16 words each)
- layout "list": numbered bullets. Fields: b1/b2/b3/b4/b5 (12-18 words each), ki (key insight 12-18 words)

LAYOUT ASSIGNMENT per slide type (use these exactly):
- title: no layout needed. Fields: sub (subtitle)
- overview: layout "cards" — c1h/c1b/c2h/c2b/c3h/c3b covering main categories
- anatomy: layout "twocol" — lh=structure name, lb=anatomical description, r1-r4=labeled components
- physiology: layout "stats" — 3 key quantitative physiological facts (use real numbers)
- pathways: layout "list" — b1-b5 as sequential pathway steps with ki
- clinical: layout "twocol" — lh=clinical context, lb=presentation/diagnosis paragraph, r1-r4=key clinical points
- mindmap: layout "cards" — c1h/c1b/c2h/c2b/c3h/c3b covering 3 main branches
- summary: layout "cards" — c1h/c1b/c2h/c2b/c3h/c3b for 3 key takeaway themes
- conditions: no layout. b1-b6 = condition names
- redflags: no layout. b1-b6 = warning signs
- faq: no layout. faq field has data
- glossary: no layout. refs field has data

Return ONLY this flat JSON:
{
  "title": "Full topic name",
  "subtitle": "Scope and audience",
  "slides": [
    {
      "n": 1,
      "type": "title",
      "t": "slide title",
      "sub": "subtitle (title slide only)",
      "layout": "list",
      "b1": "", "b2": "", "b3": "", "b4": "", "b5": "", "b6": "", "ki": "",
      "s1v": "", "s1l": "", "s1d": "", "s2v": "", "s2l": "", "s2d": "", "s3v": "", "s3l": "", "s3d": "", "caption": "",
      "c1h": "", "c1b": "", "c2h": "", "c2b": "", "c3h": "", "c3b": "",
      "lh": "", "lb": "", "r1": "", "r2": "", "r3": "", "r4": ""
    }
  ],
  "faq": "Question1::Answer1 detailed||Question2::Answer2||Question3::Answer3||Question4::Answer4||Question5::Answer5||Question6::Answer6",
  "refs": "Term1::Definition1||Term2::Definition2||Term3::Definition3||Term4::Definition4||Term5::Definition5||Term6::Definition6",
  "conditions": "Name1::Features description::Clinical clue||Name2::Features::Clue||Name3::Features::Clue||Name4::Features::Clue||Name5::Features::Clue",
  "redflags": "Warning 1 (urgent sign)||Warning 2||Warning 3||Warning 4||Warning 5||Warning 6"
}

RULES:
- Stat values (s1v, s2v, s3v) must be real clinically accurate numbers/units (e.g. "120M", "43D", "0.5mm")
- Card body text (c1b, c2b, c3b): 50-60 words each, complete sentences
- Left body (lb): 40-55 words substantive paragraph
- Non-layout fields (e.g. b1-b6 on a stats slide) should be empty string ""
- CONTENT MANDATE: For the layout you choose, ALL matching content fields MUST have real text. A "list" slide MUST have b1-b5 with actual sentences. A "cards" slide MUST have c1h/c1b/c2h/c2b/c3h/c3b with actual text. A "stats" slide MUST have s1v/s1l/s1d/s2v/s2l/s2d/s3v/s3l/s3d with real values. A "twocol" slide MUST have lh/lb/r1/r2/r3/r4 with actual text. NEVER generate an empty string for these required fields.
- ASCII only throughout`;

    const raw = await aiGenerate({
      systemPrompt: slideSysPrompt,
      userPrompt: slideUserPrompt,
      maxTokens: 8192,
      temperature: 0.5,
      jsonMode: true,
    });
    let parsed: Record<string, unknown> = {};
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { parsed = JSON.parse(jsonMatch[0]); }
      catch (_) {
        try { parsed = JSON.parse(jsonMatch[0].replace(/,(\s*[}\]])/g, "$1")); }
        catch (_) {
          try { parsed = JSON.parse(jsonrepair(jsonMatch[0])); }
          catch (_) {
            try {
              const stripped = jsonMatch[0].replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").replace(/,(\s*[}\]])/g, "$1");
              parsed = JSON.parse(stripped);
            } catch (_) { throw new Error("Could not parse AI response"); }
          }
        }
      }
    } else {
      throw new Error("No JSON found in AI response");
    }

    // ── Parse flat fields → rich objects ─────────────────────────────────
    const rawSlides = Array.isArray(parsed.slides) ? (parsed.slides as Record<string, unknown>[]) : [];

    const parseEdges = (edgeStr: string): [number, number][] => {
      if (!edgeStr) return [];
      return edgeStr.split(",").map(e => {
        const [a, b] = e.trim().split(">").map(Number);
        return [isNaN(a) ? 0 : a, isNaN(b) ? 1 : b] as [number, number];
      });
    };

    const slides = rawSlides.map((sl, idx) => {
      const title = String(sl.t ?? `Slide ${idx + 1}`);
      const requestedLayout = String(sl.layout ?? "list");

      const bullets = ["b1","b2","b3","b4","b5","b6"]
        .map(k => String(sl[k] ?? "")).filter(Boolean);
      const stats = [
        { value: String(sl.s1v ?? ""), label: String(sl.s1l ?? ""), desc: String(sl.s1d ?? "") },
        { value: String(sl.s2v ?? ""), label: String(sl.s2l ?? ""), desc: String(sl.s2d ?? "") },
        { value: String(sl.s3v ?? ""), label: String(sl.s3l ?? ""), desc: String(sl.s3d ?? "") },
      ].filter(st => st.value);
      const cards = [
        { heading: String(sl.c1h ?? ""), body: String(sl.c1b ?? "") },
        { heading: String(sl.c2h ?? ""), body: String(sl.c2b ?? "") },
        { heading: String(sl.c3h ?? ""), body: String(sl.c3b ?? "") },
      ].filter(c => c.heading);
      const leftHeading = String(sl.lh ?? "");
      const leftBody = String(sl.lb ?? "");
      const rightPoints = ["r1","r2","r3","r4"].map(k => String(sl[k] ?? "")).filter(Boolean);

      // Determine effective layout — fall back when primary layout has no content
      let layout = requestedLayout;
      if (layout === "stats" && stats.length < 2) layout = cards.length >= 2 ? "cards" : "list";
      if (layout === "cards" && cards.length < 2) layout = bullets.length > 0 ? "list" : "twocol";
      if (layout === "twocol" && !leftBody && rightPoints.length === 0) layout = "list";
      if (layout === "list" && bullets.length === 0) {
        // Last-resort fallback: synthesise bullets from slide title and type
        const slType = String(sl.type ?? "content");
        bullets.push(
          `${title} is a key clinical concept in this medical topic.`,
          `Review the pathophysiology and mechanisms underlying ${slType}.`,
          `Clinical relevance: understand presentation, diagnosis, and management.`,
        );
      }

      return {
        n: Number(sl.n ?? idx + 1),
        type: String(sl.type ?? "content"),
        layout,
        t: title,
        sub: String(sl.sub ?? ""),
        bullets,
        ki: String(sl.ki ?? ""),
        caption: String(sl.caption ?? ""),
        stats,
        cards,
        leftHeading,
        leftBody,
        rightPoints,
        diag: String(sl.diag ?? "none"),
        nodes: String(sl.nodes ?? "").split("|").map(n => n.trim()).filter(Boolean),
        edges: parseEdges(String(sl.edges ?? "")),
      };
    });

    const parsePairs = (str: string, sep2: string) =>
      String(str ?? "").split("||").map(entry => {
        const parts = entry.split(sep2);
        return parts.length >= 2 ? parts : null;
      }).filter(Boolean) as string[][];

    const faq = parsePairs(String(parsed.faq ?? ""), "::").map(([q, ...a]) => ({
      question: q.trim(), answer: a.join("::").trim(),
    }));
    const refs = parsePairs(String(parsed.refs ?? ""), "::").map(([t, ...d]) => ({
      term: t.trim(), definition: d.join("::").trim(),
    }));
    const conditions = parsePairs(String(parsed.conditions ?? ""), "::").map(([n, f, c]) => ({
      name: (n ?? "").trim(), features: (f ?? "").trim(), clue: (c ?? "").trim(),
    }));
    const redflags = String(parsed.redflags ?? "").split("||").map(s => s.trim()).filter(Boolean);

    res.json({
      title: String(parsed.title ?? prompt),
      subtitle: String(parsed.subtitle ?? ""),
      slides,
      faq,
      refs,
      conditions,
      redflags,
    });
  } catch (err) {
    req.log.error({ err }, "Error generating slides");
    res.status(500).json({ error: "Slide generation failed" });
  }
});

router.post("/ai/generate-presentation", aiHeavyLimiter, async (req, res) => {
  try {
    const rawPrompt = req.body.prompt;
    if (!rawPrompt) { res.status(400).json({ error: "prompt is required" }); return; }
    const prompt = String(rawPrompt).replace(/[^\w\s.,;:!?'"()\-\/+%#@&]/g, "").trim().slice(0, 500);
    if (!prompt) { res.status(400).json({ error: "prompt is required" }); return; }
    const { slideCount } = req.body;

    const count = Math.max(3, Math.min(30, parseInt(String(slideCount ?? 10)) || 10));

    const presSysPrompt = `You are Cadus AI, a medical education AI creating Gamma.app-quality PDF presentations.
Return ONLY valid JSON — no markdown fences, no explanation.
ASCII only: no Unicode, no Greek letters (write: alpha, beta, gamma, delta, mu, etc.).
Every slide MUST have a layout field. Mix all 4 layouts throughout for visual variety.
CRITICAL: For the chosen layout, ALL matching fields MUST contain real text — never output an empty string for b1-b5, c1h/c1b/c2h/c2b/c3h/c3b, s1v/s1l/s2v/s2l/s3v/s3l, or lh/lb/r1-r4.`;

    const presUserPrompt = `Create a ${count}-slide medical PDF presentation on: "${prompt}".

Choose the best layout for each slide from these 4 types:
- "stats"  — when showing 3 key numeric/quantitative facts prominently (like Gamma stat slides)
- "cards"  — when comparing 3 parallel concepts or categories side by side
- "list"   — for sequential mechanisms, anatomy, clinical details (numbered list style)
- "twocol" — for one main concept explained in depth with supporting points

LAYOUT RULES (critical for variety):
- First slide: "list" (overview with 5-6 points)
- Use "stats" 2-3 times (whenever topic has measurable numbers/data)
- Use "cards" 2-3 times (for any comparisons, types, classifications)
- Use "twocol" 2-3 times (for pathophysiology, mechanisms, deep-dive topics)
- Use "list" 2-3 times (anatomy, steps, clinical details)
- NEVER use same layout more than twice in a row
- Last slide: "cards" (summary of key takeaways)

Return ONLY this flat JSON (no nesting beyond what is shown below):
{
  "title": "Full topic title",
  "subtitle": "One compelling subtitle line",
  "slides": [
    {
      "n": 1,
      "layout": "list",
      "t": "Overview Title",
      "b1": "Clinical point with specific value (10-14 words)",
      "b2": "Clinical point (10-14 words)",
      "b3": "Clinical point (10-14 words)",
      "b4": "Clinical point (10-14 words)",
      "b5": "Clinical point (10-14 words)",
      "kf": "High-yield key fact max 14 words"
    },
    {
      "n": 2,
      "layout": "stats",
      "t": "Statistics Slide Title",
      "caption": "One-sentence context for all three statistics.",
      "s1v": "86B", "s1l": "Neurons", "s1d": "Form the brain communication network",
      "s2v": "20%", "s2l": "Oxygen Use", "s2d": "Despite being 2 percent of body mass",
      "s3v": "100T", "s3l": "Caduss", "s3d": "Estimated synaptic connections total"
    },
    {
      "n": 3,
      "layout": "cards",
      "t": "Comparison Slide Title",
      "c1h": "First Concept Heading",
      "c1b": "Body text for first card, 3-4 sentences explaining this concept clearly.",
      "c2h": "Second Concept Heading",
      "c2b": "Body text for second card, 3-4 sentences explaining this concept clearly.",
      "c3h": "Third Concept Heading",
      "c3b": "Body text for third card, 3-4 sentences explaining this concept clearly."
    },
    {
      "n": 4,
      "layout": "twocol",
      "t": "Slide Title",
      "lh": "Main Section Heading",
      "lb": "Body paragraph 30-45 words explaining the core concept in clear clinical language with specific details and values.",
      "r1": "Supporting point 1 (8-12 words)",
      "r2": "Supporting point 2 (8-12 words)",
      "r3": "Supporting point 3 (8-12 words)",
      "r4": "Supporting point 4 (8-12 words)"
    }
  ],
  "refs": "Term1::Definition max 15 words||Term2::Definition||Term3::Definition||Term4::Definition||Term5::Definition||Term6::Definition||Term7::Definition||Term8::Definition"
}

STRICT RULES:
- ALL stat values (s1v, s2v, s3v) must be real, clinically accurate numbers/percentages/ratios
- Card body text (c1b, c2b, c3b): 3-4 complete sentences each
- Left body (lb): must be 30-45 words, substantive paragraph
- List points (b1-b5): specific clinical facts with numbers/values where possible
- Topic-specific content for: "${prompt}"
- ASCII only — no Unicode`;

    const raw = await aiGenerate({
      systemPrompt: presSysPrompt,
      userPrompt: presUserPrompt,
      maxTokens: 8192,
      temperature: 0.5,
      jsonMode: true,
    });

    // Parse with 4 fallback layers
    let parsed: Record<string, unknown> = {};
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { parsed = JSON.parse(jsonMatch[0]); }
      catch (_) {
        try { parsed = JSON.parse(jsonMatch[0].replace(/,(\s*[}\]])/g, "$1")); }
        catch (_) {
          try { parsed = JSON.parse(jsonrepair(jsonMatch[0])); }
          catch (_) {
            try {
              const stripped = jsonMatch[0].replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").replace(/,(\s*[}\]])/g, "$1");
              parsed = JSON.parse(stripped);
            } catch (_) { throw new Error("Could not parse AI response"); }
          }
        }
      }
    } else {
      throw new Error("No JSON found in AI response");
    }

    // ── Convert flat schema → rich multi-layout structure ────────────────
    const rawSlides = Array.isArray(parsed.slides) ? parsed.slides as Record<string, unknown>[] : [];

    const pres = {
      title:    String(parsed.title    ?? prompt),
      subtitle: String(parsed.subtitle ?? ""),
      slides: rawSlides.map((sl, idx) => {
        const slideTitle = String(sl.t ?? `Slide ${idx + 1}`);
        const requestedLayout = String(sl.layout ?? "list");

        const bullets = ["b1","b2","b3","b4","b5","b6"].map(k => String(sl[k] ?? "")).filter(Boolean);
        const stats = [
          { value: String(sl.s1v ?? ""), label: String(sl.s1l ?? ""), desc: String(sl.s1d ?? "") },
          { value: String(sl.s2v ?? ""), label: String(sl.s2l ?? ""), desc: String(sl.s2d ?? "") },
          { value: String(sl.s3v ?? ""), label: String(sl.s3l ?? ""), desc: String(sl.s3d ?? "") },
        ].filter(st => st.value);
        const cards = [
          { heading: String(sl.c1h ?? ""), body: String(sl.c1b ?? "") },
          { heading: String(sl.c2h ?? ""), body: String(sl.c2b ?? "") },
          { heading: String(sl.c3h ?? ""), body: String(sl.c3b ?? "") },
        ].filter(c => c.heading);
        const leftHeading = String(sl.lh ?? "");
        const leftBody    = String(sl.lb ?? "");
        const rightPoints = ["r1","r2","r3","r4"].map(k => String(sl[k] ?? "")).filter(Boolean);

        // Defensive layout fallback — ensures no slide is ever blank
        let layout = requestedLayout;
        if (layout === "stats" && stats.length < 2) layout = cards.length >= 2 ? "cards" : "list";
        if (layout === "cards" && cards.length < 2) layout = bullets.length > 0 ? "list" : "twocol";
        if (layout === "twocol" && !leftBody && rightPoints.length === 0) layout = "list";
        if (layout === "list" && bullets.length === 0) {
          bullets.push(
            `${slideTitle} is a key clinical concept in this medical topic.`,
            `Review the pathophysiology, clinical features, and management approach.`,
            `High-yield for NEET-PG, USMLE, and clinical practice.`,
          );
        }

        return {
          slideNumber: Number(sl.n ?? idx + 1),
          layout,
          title: slideTitle,
          bullets,
          keyFact: String(sl.kf ?? ""),
          caption: String(sl.caption ?? ""),
          stats,
          cards,
          leftHeading,
          leftBody,
          rightPoints,
        };
      }),
      quickReference: String(parsed.refs ?? "")
        .split("||")
        .map(entry => {
          const [term, ...rest] = entry.split("::");
          return { term: (term ?? "").trim(), definition: rest.join("::").trim() };
        })
        .filter(r => r.term),
    };

    // ── Sanitize for WinAnsi ──────────────────────────────────────────────
    const s = (str: string): string =>
      String(str ?? "")
        .replace(/\u2192/g, "->").replace(/\u2190/g, "<-").replace(/\u2191/g, "^").replace(/\u2193/g, "v")
        .replace(/[\u2013\u2014]/g, "-").replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
        .replace(/\u2022/g, "-").replace(/\u00B7/g, "-").replace(/\u2026/g, "...").replace(/\u00D7/g, "x")
        .replace(/\u2265/g, ">=").replace(/\u2264/g, "<=").replace(/\u00B1/g, "+/-").replace(/\u2260/g, "!=")
        .replace(/\u00B0/g, " deg").replace(/\u00B5/g, "u")
        .replace(/\u03B1/g, "alpha").replace(/\u03B2/g, "beta").replace(/\u03B3/g, "gamma")
        .replace(/\u03B4/g, "delta").replace(/\u03BC/g, "mu").replace(/\u03C9/g, "omega")
        .replace(/[^\x00-\xFF]/g, "");

    // ── Dimensions & shared constants ─────────────────────────────────────
    const W = 842, H = 595;
    const WHITE = rgb(1, 1, 1);

    // ── PDF setup ─────────────────────────────────────────────────────────
    const pdfDoc   = await PDFDocument.create();
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regFont  = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const oblFont  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // ── Text wrap ─────────────────────────────────────────────────────────
    const wrap = (text: string, font: typeof regFont, size: number, maxW: number): string[] => {
      const words = String(text ?? "").split(" ");
      const lines: string[] = [];
      let cur = "";
      for (const w of words) {
        const test = cur ? `${cur} ${w}` : w;
        if (font.widthOfTextAtSize(test, size) > maxW && cur) { lines.push(cur); cur = w; }
        else cur = test;
      }
      if (cur) lines.push(cur);
      return lines;
    };

    // ── Single Cadus AI theme (Gamma-style clean professional) ─────────────
    type Theme = {
      bg: ReturnType<typeof rgb>; header: ReturnType<typeof rgb>; headerText: ReturnType<typeof rgb>;
      accent: ReturnType<typeof rgb>; accentDim: ReturnType<typeof rgb>; accentBrt: ReturnType<typeof rgb>;
      bodyText: ReturnType<typeof rgb>; subText: ReturnType<typeof rgb>;
      colDivider: ReturnType<typeof rgb>; rightBg: ReturnType<typeof rgb>;
      nodeBg: ReturnType<typeof rgb>; nodeText: ReturnType<typeof rgb>;
      footerBg: ReturnType<typeof rgb>; footerText: ReturnType<typeof rgb>;
      sepLine: ReturnType<typeof rgb>;
    };
    const CADUS_AI_THEME: Theme = {
      bg: rgb(0.97, 0.98, 0.99),         header: rgb(0.04, 0.07, 0.18),
      headerText: WHITE,                  accent: rgb(0.04, 0.74, 0.60),
      accentDim: rgb(0.03, 0.40, 0.33),  accentBrt: rgb(0.15, 0.88, 0.72),
      bodyText: rgb(0.07, 0.10, 0.20),   subText: rgb(0.38, 0.44, 0.55),
      colDivider: rgb(0.86, 0.92, 0.90), rightBg: rgb(0.92, 0.96, 0.97),
      nodeBg: rgb(0.88, 0.96, 0.94),     nodeText: rgb(0.04, 0.28, 0.24),
      footerBg: rgb(0.04, 0.07, 0.18),   footerText: WHITE,
      sepLine: rgb(0.86, 0.92, 0.90),
    };
    const THEMES: Theme[] = Array(6).fill(CADUS_AI_THEME);

    // ── Diagram drawing helpers ───────────────────────────────────────────
    type Page = ReturnType<typeof pdfDoc.addPage>;

    // Draw a styled node box (shadow + fill + optional accent top stripe + label)
    const drawNodeBox = (
      p: Page, cx: number, cy: number, bw: number, bh: number,
      label: string, isAccent: boolean, th: Theme,
    ) => {
      const safeLabel = s(label).substring(0, Math.floor((bw - 10) / 5.2));
      const lw = (isAccent ? boldFont : regFont).widthOfTextAtSize(safeLabel, 7.5);
      p.drawRectangle({ x: cx - bw / 2 + 2, y: cy - bh / 2 - 2, width: bw, height: bh, color: th.accentDim });
      p.drawRectangle({ x: cx - bw / 2, y: cy - bh / 2, width: bw, height: bh, color: isAccent ? th.accent : th.nodeBg });
      if (!isAccent) p.drawRectangle({ x: cx - bw / 2, y: cy + bh / 2 - 2, width: bw, height: 2, color: th.accent });
      p.drawText(safeLabel, {
        x: cx - Math.min(lw / 2, bw / 2 - 5), y: cy - 4,
        size: 7.5, font: isAccent ? boldFont : regFont, color: isAccent ? WHITE : th.nodeText,
      });
    };

    // FLOWCHART — vertical linear chain with arrowheads
    const drawFlowchartPDF = (p: Page, cx: number, topY: number, nodes: string[], th: Theme) => {
      const BOX_W = 146, BOX_H = 26, STEP = 44;
      const n = Math.min(nodes.length, 6);
      for (let i = 0; i < n; i++) {
        const cy = topY - i * STEP;
        const isTerminal = i === 0 || i === n - 1;
        if (i > 0) {
          const lineBot = cy + BOX_H / 2 + 1, lineTop = cy + STEP - BOX_H / 2 - 1;
          p.drawLine({ start: { x: cx, y: lineBot }, end: { x: cx, y: lineTop }, thickness: 1.5, color: th.accentDim });
          // Arrowhead V at bottom (tip pointing down into this box)
          p.drawLine({ start: { x: cx - 5, y: lineBot + 7 }, end: { x: cx, y: lineBot }, thickness: 1.5, color: th.accent });
          p.drawLine({ start: { x: cx + 5, y: lineBot + 7 }, end: { x: cx, y: lineBot }, thickness: 1.5, color: th.accent });
        }
        drawNodeBox(p, cx, cy, BOX_W, BOX_H, nodes[i], isTerminal, th);
      }
    };

    // CONCEPT/MINDMAP — radial hub-and-spoke
    const drawConceptPDF = (p: Page, cx: number, cy: number, nodes: string[], th: Theme) => {
      const safeNodes = (nodes ?? []).slice(0, 6);
      const center = safeNodes[0] ?? "Core";
      const sats = safeNodes.slice(1);
      const n = sats.length || 1;
      const RX = 96, RY = 64;
      // Lines + endpoint dots
      sats.forEach((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const nx = cx + Math.cos(angle) * RX, ny = cy + Math.sin(angle) * RY;
        p.drawLine({ start: { x: cx, y: cy }, end: { x: nx, y: ny }, thickness: 1.2, color: th.colDivider });
        p.drawCircle({ x: nx, y: ny, size: 3.5, color: th.accent });
      });
      // Satellite nodes
      sats.forEach((node, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const nx = cx + Math.cos(angle) * RX, ny = cy + Math.sin(angle) * RY;
        drawNodeBox(p, nx, ny, 76, 22, node, false, th);
      });
      // Center hub
      const cl = s(center).substring(0, 17);
      const clW = boldFont.widthOfTextAtSize(cl, 9);
      p.drawRectangle({ x: cx - 52, y: cy - 16, width: 106, height: 32, color: th.accentDim });
      p.drawRectangle({ x: cx - 54, y: cy - 14, width: 106, height: 32, color: th.accent });
      p.drawText(cl, { x: cx - Math.min(clW / 2, 48), y: cy - 1, size: 9, font: boldFont, color: WHITE });
    };

    // PATHWAY — tier-based branching layout (FIXED level assignment)
    const drawPathwayPDF = (p: Page, cx: number, topY: number, availH: number, nodes: string[], edges: [number, number][], th: Theme) => {
      const n = Math.min(nodes.length, 6);
      if (n < 2) { drawConceptPDF(p, cx, topY - availH / 2, nodes, th); return; }
      // BFS level assignment — FIXED: use levels[src] not levels[dst]
      const levels = new Array(n).fill(0);
      let changed = true;
      while (changed) {
        changed = false;
        edges.forEach(([src, dst]) => {
          if (src < n && dst < n && levels[src] + 1 > levels[dst]) {
            levels[dst] = levels[src] + 1;
            changed = true;
          }
        });
      }
      const maxLevel = Math.max(...levels, 1);
      const levelCounts = new Array(maxLevel + 1).fill(0);
      const levelIdxs  = new Array(maxLevel + 1).fill(0);
      levels.forEach(l => levelCounts[l]++);
      const TIER_H = Math.min(60, availH / maxLevel);
      const positions: { x: number; y: number }[] = [];
      for (let i = 0; i < n; i++) {
        const lv = levels[i], cnt = levelCounts[lv], idx = levelIdxs[lv]++;
        const spacing = Math.min(120, 260 / Math.max(cnt, 1));
        positions.push({ x: cx + (-(cnt - 1) * spacing / 2 + idx * spacing), y: topY - lv * TIER_H });
      }
      // Edges first
      edges.forEach(([src, dst]) => {
        if (src >= n || dst >= n) return;
        const { x: sx, y: sy } = positions[src], { x: dx, y: dy } = positions[dst];
        p.drawLine({ start: { x: sx, y: sy }, end: { x: dx, y: dy }, thickness: 1.3, color: th.colDivider });
        const ang = Math.atan2(dy - sy, dx - sx);
        p.drawLine({ start: { x: dx - Math.cos(ang - 0.42) * 8, y: dy - Math.sin(ang - 0.42) * 8 }, end: { x: dx, y: dy }, thickness: 1.4, color: th.accent });
        p.drawLine({ start: { x: dx - Math.cos(ang + 0.42) * 8, y: dy - Math.sin(ang + 0.42) * 8 }, end: { x: dx, y: dy }, thickness: 1.4, color: th.accent });
      });
      for (let i = 0; i < n; i++) {
        const { x, y } = positions[i];
        const isRoot = levels[i] === 0;
        const isLeaf = !edges.some(([src]) => src === i);
        drawNodeBox(p, x, y, isRoot ? 116 : 86, 22, nodes[i], isRoot || isLeaf, th);
      }
    };

    // Master dispatcher — FIXED: compute safe Y positions within the diagram area
    const drawDiagramPDF = (
      p: Page, diag: string, cx: number,
      diagAreaTop: number, diagAreaBot: number,          // exact safe bounds
      nodes: string[], edges: [number, number][], th: Theme,
    ) => {
      if (!nodes.length) return;
      const availH = diagAreaTop - diagAreaBot;
      const centerY = diagAreaBot + availH / 2;
      const BOX_H = 26, STEP = 44;
      const n = Math.min(nodes.length, 6);
      switch (diag) {
        case "flowchart": {
          // topY chosen so 6 boxes fit vertically within the safe area
          const totalH = (n - 1) * STEP + BOX_H;
          const topY = diagAreaBot + totalH + (availH - totalH) / 2;
          drawFlowchartPDF(p, cx, topY, nodes, th);
          break;
        }
        case "pathway": {
          const topY = diagAreaTop - 16;
          drawPathwayPDF(p, cx, topY, availH - 32, nodes, edges, th);
          break;
        }
        default: {
          // concept / mindmap — radial centered in safe area
          drawConceptPDF(p, cx, centerY, nodes, th);
          break;
        }
      }
    };

    // ── TITLE SLIDE (Gamma-inspired: bold dark top half, clean white bottom) ─
    {
      const p = pdfDoc.addPage([W, H]);
      const NAVY = rgb(0.04, 0.07, 0.18);
      const TEAL_A = rgb(0.04, 0.74, 0.60);
      const TEAL_D = rgb(0.03, 0.40, 0.33);
      const TEAL_B = rgb(0.15, 0.88, 0.72);

      // White base
      p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0.97, 0.98, 0.99) });

      // Top dark panel (60% of height)
      const TOP_H = Math.round(H * 0.60);
      p.drawRectangle({ x: 0, y: H - TOP_H, width: W, height: TOP_H, color: NAVY });

      // Diagonal accent layers in top panel
      for (let i = 0; i < 6; i++) {
        p.drawRectangle({ x: W - 200 + i * 30, y: H - TOP_H - 4, width: 18, height: TOP_H + 8,
          color: rgb(0.06 + i * 0.008, 0.10 + i * 0.008, 0.26 + i * 0.008),
          rotate: { type: "degrees", angle: -14 }, opacity: 0.35 + i * 0.05 });
      }

      // Left accent bar (full height)
      p.drawRectangle({ x: 0, y: 0, width: 8, height: H, color: TEAL_A });

      // Teal separator between top and bottom panels
      p.drawRectangle({ x: 8, y: H - TOP_H - 4, width: W - 8, height: 4, color: TEAL_A });

      // Cadus AI label (top-left, small)
      p.drawText("MEDICAL EDUCATION  |  Cadus AI", { x: 22, y: H - 18, size: 7, font: regFont, color: rgb(0.35, 0.65, 0.58) });

      // Main title (large, white, in dark panel)
      const tLines = wrap(s(pres.title || prompt), boldFont, 32, W * 0.70 - 30);
      tLines.slice(0, 3).forEach((ln, i) =>
        p.drawText(ln, { x: 22, y: H - 62 - i * 40, size: 32, font: boldFont, color: WHITE }));

      // Subtitle
      if (pres.subtitle) {
        const subLines = wrap(s(pres.subtitle), oblFont, 12, W * 0.65);
        subLines.slice(0, 2).forEach((ln, i) =>
          p.drawText(ln, { x: 22, y: H - TOP_H + 34 - i * 16, size: 12, font: oblFont, color: rgb(0.55, 0.82, 0.75) }));
      }

      // Stat chips inside dark panel (bottom portion) — slide count + type
      const chip1 = `  ${pres.slides.length} Slides  `;
      const chip2 = "  Medical Education  ";
      const chip1W = boldFont.widthOfTextAtSize(chip1, 9);
      const chip2W = regFont.widthOfTextAtSize(chip2, 9);
      p.drawRectangle({ x: 22, y: H - TOP_H + 8, width: chip1W + 4, height: 18, color: TEAL_D });
      p.drawText(chip1, { x: 24, y: H - TOP_H + 14, size: 9, font: boldFont, color: WHITE });
      p.drawRectangle({ x: 32 + chip1W, y: H - TOP_H + 8, width: chip2W + 4, height: 18, color: rgb(0.06, 0.20, 0.18) });
      p.drawText(chip2, { x: 34 + chip1W, y: H - TOP_H + 14, size: 9, font: regFont, color: TEAL_B });

      // Bottom white panel — 3-column stat boxes (topic overview)
      const BOT_Y = 50;
      const BOT_H = H - TOP_H - 8;
      const COL_W = Math.floor((W - 32) / 3);

      pres.slides.slice(0, 3).forEach((sl, i) => {
        const bx = 12 + i * (COL_W + 4);
        const by = BOT_Y;
        // Card shadow
        p.drawRectangle({ x: bx + 3, y: by - 3, width: COL_W, height: BOT_H - 4, color: rgb(0.82, 0.88, 0.86) });
        // Card body
        p.drawRectangle({ x: bx, y: by, width: COL_W, height: BOT_H - 4, color: WHITE });
        // Top accent stripe
        p.drawRectangle({ x: bx, y: by + BOT_H - 8, width: COL_W, height: 4, color: TEAL_A });
        // Slide number (large, decorative)
        const nStr = String(i + 1).padStart(2, "0");
        p.drawText(nStr, { x: bx + 8, y: by + BOT_H - 30, size: 20, font: boldFont, color: rgb(0.88, 0.94, 0.92) });
        // Slide title
        const titleLines = wrap(s(sl.title), boldFont, 10, COL_W - 16);
        titleLines.slice(0, 2).forEach((ln, li) =>
          p.drawText(ln, { x: bx + 8, y: by + BOT_H - 44 - li * 13, size: 10, font: boldFont, color: rgb(0.07, 0.10, 0.20) }));
        // First bullet
        if (sl.bullets?.[0]) {
          const bLines = wrap(s(sl.bullets[0]), regFont, 8, COL_W - 16);
          bLines.slice(0, 2).forEach((bl, li) =>
            p.drawText(bl, { x: bx + 8, y: by + 28 - li * 11, size: 8, font: regFont, color: rgb(0.42, 0.50, 0.60) }));
        }
      });

      // Footer
      p.drawRectangle({ x: 0, y: 0, width: W, height: 46, color: NAVY });
      p.drawRectangle({ x: 0, y: 44, width: W, height: 2, color: TEAL_A });
      p.drawText(`Cadus AI - aethex  |  Medical Education Series  |  ${pres.slides.length} slides`, { x: 22, y: 16, size: 9, font: regFont, color: rgb(0.55, 0.78, 0.72) });
      p.drawText("Cadus AI", { x: W - 72, y: 16, size: 9, font: boldFont, color: TEAL_B });
    }

    // ── CONTENT SLIDES (Gamma multi-layout: stats / cards / list / twocol) ─
    const HEADER_H  = 84;
    const FOOTER_H  = 34;
    const BODY_TOP_Y = H - HEADER_H - 2;
    const totalSlides = pres.slides.length;

    // Colors
    const NAVY  = rgb(0.04, 0.07, 0.18);
    const TEAL  = rgb(0.04, 0.74, 0.60);
    const TEALB = rgb(0.15, 0.88, 0.72);
    const TEALD = rgb(0.03, 0.40, 0.33);
    const DKBG  = rgb(0.97, 0.98, 0.99);
    const DARK  = rgb(0.07, 0.10, 0.20);
    const GRAY  = rgb(0.42, 0.50, 0.60);
    const LGRAY = rgb(0.92, 0.96, 0.97);
    const SHADOW = rgb(0.80, 0.86, 0.90);
    const ROWS0 = rgb(0.93, 0.97, 0.95);

    // ── Shared header + footer drawer ──────────────────────────────────────
    const drawSlideFrame = (p: ReturnType<typeof pdfDoc.addPage>, title: string, slideNum: number) => {
      // BG
      p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: DKBG });
      // Left teal stripe
      p.drawRectangle({ x: 0, y: 0, width: 6, height: H, color: TEAL });
      // Header
      p.drawRectangle({ x: 6, y: H - HEADER_H, width: W - 6, height: HEADER_H, color: NAVY });
      p.drawRectangle({ x: 6, y: H - HEADER_H - 3, width: W - 6, height: 3, color: TEAL });
      // Diagonal decoration in header
      for (let d = 0; d < 5; d++) {
        p.drawRectangle({ x: W - 130 + d * 22, y: H - HEADER_H, width: 13, height: HEADER_H + 2,
          color: rgb(0.06 + d * 0.01, 0.10 + d * 0.01, 0.26 + d * 0.01),
          rotate: { type: "degrees", angle: -10 }, opacity: 0.28 });
      }
      // Category label
      p.drawText("MEDICAL EDUCATION  |  Cadus AI", { x: 20, y: H - 14, size: 6.5, font: regFont, color: rgb(0.38, 0.68, 0.62) });
      // Slide title — large
      const stL = wrap(s(title), boldFont, 22, W - 118);
      stL.slice(0, 2).forEach((ln, i) =>
        p.drawText(ln, { x: 20, y: H - 46 - i * 26, size: 22, font: boldFont, color: WHITE }));
      // Slide number badge
      p.drawRectangle({ x: W - 58, y: H - HEADER_H + 6, width: 46, height: 46, color: TEALD });
      p.drawRectangle({ x: W - 60, y: H - HEADER_H + 8, width: 46, height: 46, color: TEAL });
      const ns = String(slideNum);
      p.drawText(ns, { x: W - 60 + (46 - boldFont.widthOfTextAtSize(ns, 17)) / 2, y: H - HEADER_H + 23, size: 17, font: boldFont, color: WHITE });
      // Footer
      p.drawRectangle({ x: 0, y: 0, width: W, height: FOOTER_H, color: NAVY });
      p.drawRectangle({ x: 0, y: FOOTER_H - 2, width: W, height: 2, color: TEAL });
      // Progress bar
      const prog = slideNum / totalSlides;
      p.drawRectangle({ x: 12, y: FOOTER_H / 2 - 1, width: W - 190, height: 3, color: rgb(0.12, 0.20, 0.38) });
      p.drawRectangle({ x: 12, y: FOOTER_H / 2 - 1, width: (W - 190) * prog, height: 3, color: TEAL });
      p.drawText("Cadus AI - aethex", { x: W / 2 - 44, y: FOOTER_H / 2 - 5, size: 8, font: boldFont, color: TEALB });
      p.drawText(`${slideNum} / ${totalSlides}`, { x: W - 54, y: FOOTER_H / 2 - 5, size: 8, font: boldFont, color: rgb(0.45, 0.68, 0.65) });
    };

    for (const slide of pres.slides) {
      const p = pdfDoc.addPage([W, H]);
      drawSlideFrame(p, slide.title, slide.slideNumber);

      const BODY_H = BODY_TOP_Y - FOOTER_H;

      // ════════════════════════════════════════════════════════════════════
      // LAYOUT: STATS  — Gamma-scale huge numbers with dramatic typography
      // ════════════════════════════════════════════════════════════════════
      if (slide.layout === "stats" && slide.stats.length >= 2) {
        const stats = slide.stats.slice(0, 3);
        const nCols = stats.length;
        const COL_W = Math.floor((W - 16) / nCols);

        // Full-width light bottom band for context
        const BAND_H = 110;
        p.drawRectangle({ x: 0, y: FOOTER_H, width: W, height: BAND_H, color: LGRAY });
        p.drawRectangle({ x: 0, y: FOOTER_H + BAND_H, width: W, height: 1, color: rgb(0.82, 0.88, 0.86) });

        stats.forEach((st, ci) => {
          const colX = ci * COL_W;
          const colCX = colX + COL_W / 2;

          // Column divider (not after last)
          if (ci < nCols - 1)
            p.drawRectangle({ x: colX + COL_W - 1, y: FOOTER_H + 20, width: 1, height: BODY_H - 40, color: rgb(0.82, 0.88, 0.86) });

          // === BIG STAT VALUE — massive, visually dominant ===
          const valStr = s(st.value);
          const valSize = valStr.length <= 3 ? 96 : valStr.length <= 5 ? 80 : valStr.length <= 7 ? 66 : 54;
          const valW = boldFont.widthOfTextAtSize(valStr, valSize);
          // Vertical center of the white area above the band
          const whiteAreaMid = FOOTER_H + BAND_H + (BODY_H - BAND_H) / 2;
          p.drawText(valStr, {
            x: colCX - Math.min(valW / 2, COL_W / 2 - 8),
            y: whiteAreaMid - valSize * 0.35,
            size: valSize, font: boldFont, color: TEAL,
          });

          // Teal accent line under the value (sits at the band boundary)
          p.drawRectangle({ x: colCX - 36, y: FOOTER_H + BAND_H + 8, width: 72, height: 5, color: TEAL });

          // Label — large, bold, inside the band
          const labStr = s(st.label);
          const labSize = 15;
          const labW = boldFont.widthOfTextAtSize(labStr, labSize);
          p.drawText(labStr, { x: colCX - labW / 2, y: FOOTER_H + BAND_H - 24, size: labSize, font: boldFont, color: DARK });

          // Description — wrapped, below label, in band
          const descLines = wrap(s(st.desc), regFont, 10.5, COL_W - 24);
          descLines.slice(0, 3).forEach((dl, di) => {
            const descW = regFont.widthOfTextAtSize(dl, 10.5);
            p.drawText(dl, { x: colCX - descW / 2, y: FOOTER_H + BAND_H - 44 - di * 14, size: 10.5, font: regFont, color: GRAY });
          });
        });

        // Caption — centered, bottom of band
        if (slide.caption) {
          const capLines = wrap(s(slide.caption), oblFont, 10, W - 80);
          capLines.slice(0, 2).forEach((cl, ci2) => {
            const cw = oblFont.widthOfTextAtSize(cl, 10);
            p.drawText(cl, { x: W / 2 - cw / 2, y: FOOTER_H + 12 + (capLines.length - 1 - ci2) * 14, size: 10, font: oblFont, color: GRAY });
          });
        }
      }

      // ════════════════════════════════════════════════════════════════════
      // LAYOUT: CARDS  — Gamma "Debunking Myths" style 3-column cards
      // ════════════════════════════════════════════════════════════════════
      else if (slide.layout === "cards" && slide.cards.length >= 2) {
        const cards = slide.cards.slice(0, 3);
        const nCols = cards.length;
        const GAP = 10;
        const CARD_W = Math.floor((W - 16 - GAP * (nCols - 1)) / nCols);
        const CARD_TOP_Y = BODY_TOP_Y - 10;
        const CARD_BOT_Y = FOOTER_H + 10;
        const CARD_H_VAL = CARD_TOP_Y - CARD_BOT_Y;

        cards.forEach((card, ci) => {
          const cx = 8 + ci * (CARD_W + GAP);

          // Shadow
          p.drawRectangle({ x: cx + 5, y: CARD_BOT_Y - 5, width: CARD_W, height: CARD_H_VAL, color: SHADOW });
          // Card body — white
          p.drawRectangle({ x: cx, y: CARD_BOT_Y, width: CARD_W, height: CARD_H_VAL, color: WHITE });
          // Top accent — full-width teal stripe (8px — very prominent)
          p.drawRectangle({ x: cx, y: CARD_TOP_Y - 8, width: CARD_W, height: 8, color: TEAL });

          // Large decorative number (top left, light color for depth)
          const cNum = String(ci + 1).padStart(2, "0");
          p.drawText(cNum, { x: cx + 12, y: CARD_TOP_Y - 36, size: 22, font: boldFont, color: rgb(0.85, 0.93, 0.90) });

          // Card heading — bold, dark, prominent
          const HEADING_AREA_Y = CARD_TOP_Y - 60;
          const hLines = wrap(s(card.heading), boldFont, 14, CARD_W - 22);
          hLines.slice(0, 2).forEach((hl, hi) =>
            p.drawText(hl, { x: cx + 12, y: HEADING_AREA_Y - hi * 18, size: 14, font: boldFont, color: DARK }));

          // Separator line under heading
          p.drawRectangle({ x: cx + 12, y: CARD_TOP_Y - 88, width: CARD_W - 24, height: 1.5, color: rgb(0.82, 0.90, 0.88) });

          // Body text — readable size, generous line spacing
          const bLines = wrap(s(card.body), regFont, 11, CARD_W - 22);
          bLines.slice(0, 10).forEach((bl, bi) =>
            p.drawText(bl, { x: cx + 12, y: CARD_TOP_Y - 100 - bi * 15, size: 11, font: regFont, color: GRAY }));
        });
      }

      // ════════════════════════════════════════════════════════════════════
      // LAYOUT: TWOCOL  — Gamma "A Jell-O-Like Marvel" style
      // ════════════════════════════════════════════════════════════════════
      else if (slide.layout === "twocol") {
        const SPLIT_X = 450;
        const RIGHT_X2 = SPLIT_X + 18;
        const RIGHT_W2 = W - RIGHT_X2 - 10;

        // RIGHT column — light teal bg panel
        p.drawRectangle({ x: RIGHT_X2 - 4, y: FOOTER_H + 8, width: RIGHT_W2 + 6, height: BODY_H - 16, color: LGRAY });
        // Right panel top accent
        p.drawRectangle({ x: RIGHT_X2 - 4, y: FOOTER_H + BODY_H - 8, width: RIGHT_W2 + 6, height: 4, color: TEAL });

        // LEFT — bold subheading
        let leftY = BODY_TOP_Y - 22;
        if (slide.leftHeading) {
          const lhLines = wrap(s(slide.leftHeading), boldFont, 22, SPLIT_X - 36);
          lhLines.slice(0, 2).forEach((ln, i) => {
            p.drawText(ln, { x: 20, y: leftY - i * 28, size: 22, font: boldFont, color: DARK });
          });
          leftY -= (lhLines.slice(0, 2).length * 28) + 14;
        }
        // Teal accent underline
        p.drawRectangle({ x: 20, y: leftY + 8, width: 56, height: 4, color: TEAL });
        leftY -= 20;

        // LEFT — body paragraph
        const lbLines = wrap(s(slide.leftBody), regFont, 13, SPLIT_X - 36);
        lbLines.slice(0, 12).forEach((ln, i) =>
          p.drawText(ln, { x: 20, y: leftY - i * 17, size: 13, font: regFont, color: DARK }));

        // Decorative large quote — bottom left, very light
        p.drawText('"', { x: SPLIT_X - 64, y: FOOTER_H + 18, size: 110, font: boldFont, color: rgb(0.90, 0.95, 0.93) });

        // RIGHT — bullet points with large teal accent squares
        const rPoints = slide.rightPoints.slice(0, 4);
        const rSlotH = Math.floor((BODY_H - 28) / Math.max(rPoints.length, 1));
        rPoints.forEach((rp, ri) => {
          const ry = BODY_TOP_Y - 14 - ri * rSlotH;
          // Teal square bullet
          p.drawRectangle({ x: RIGHT_X2 + 4, y: ry - 8, width: 10, height: 10, color: TEAL });
          // Point text — larger, bold first line
          const rpLines = wrap(s(rp), regFont, 12, RIGHT_W2 - 24);
          rpLines.slice(0, 3).forEach((rl, rli) =>
            p.drawText(rl, { x: RIGHT_X2 + 20, y: ry - rli * 16, size: 12, font: rli === 0 ? boldFont : regFont, color: DARK }));
          // Row separator
          if (ri < rPoints.length - 1)
            p.drawRectangle({ x: RIGHT_X2, y: ry - rSlotH + 6, width: RIGHT_W2 + 2, height: 0.5, color: rgb(0.82, 0.88, 0.86) });
        });
      }

      // ════════════════════════════════════════════════════════════════════
      // LAYOUT: LIST  — Gamma "Cerebral Cortex" style spacious numbered list
      // ════════════════════════════════════════════════════════════════════
      else {
        const bullets = slide.bullets.slice(0, 5);
        const KI_H = slide.keyFact ? 72 : 0;
        const LIST_H = BODY_H - KI_H - 6;
        const SLOT_H = Math.floor(LIST_H / Math.max(bullets.length, 1));

        // Vertical accent line running full list height (connects all rows)
        p.drawRectangle({ x: 8, y: FOOTER_H + KI_H + 4, width: 5, height: LIST_H - 4, color: TEAL });

        bullets.forEach((bullet, bi) => {
          const rowTop = BODY_TOP_Y - 4 - bi * SLOT_H;
          const rowBot = rowTop - SLOT_H;
          const midY   = (rowTop + rowBot) / 2;

          // Alternate row fill (light)
          if (bi % 2 === 0)
            p.drawRectangle({ x: 13, y: rowBot + 2, width: W - 21, height: SLOT_H - 4, color: ROWS0 });

          // Number badge — larger, prominent
          p.drawRectangle({ x: 14, y: midY - 14, width: 28, height: 28, color: TEALD });
          p.drawRectangle({ x: 15, y: midY - 15, width: 28, height: 28, color: TEAL });
          const biStr = String(bi + 1);
          p.drawText(biStr, {
            x: 15 + (28 - boldFont.widthOfTextAtSize(biStr, 11)) / 2,
            y: midY - 10, size: 11, font: boldFont, color: WHITE,
          });

          // Bullet text — larger font
          const bLines = wrap(s(bullet), regFont, 13.5, W - 78);
          const textY = rowTop - 10;
          bLines.slice(0, 3).forEach((bl, li) => {
            const ty = textY - li * 17;
            if (ty > FOOTER_H + KI_H + 2)
              p.drawText(bl, { x: 52, y: ty, size: 13.5, font: li === 0 ? boldFont : regFont, color: DARK });
          });

          // Thin separator
          if (bi < bullets.length - 1)
            p.drawRectangle({ x: 13, y: rowBot + 1, width: W - 21, height: 0.5, color: rgb(0.82, 0.88, 0.86) });
        });

        // KEY INSIGHT band
        if (slide.keyFact) {
          const KI_Y = FOOTER_H + 2;
          p.drawRectangle({ x: 8, y: KI_Y, width: W - 16, height: KI_H - 2, color: NAVY });
          p.drawRectangle({ x: 8, y: KI_Y + KI_H - 5, width: W - 16, height: 5, color: TEAL });
          p.drawText("KEY INSIGHT", { x: 24, y: KI_Y + KI_H - 16, size: 7.5, font: boldFont, color: TEALB });
          const kiLines = wrap(s(slide.keyFact), regFont, 12, W - 60);
          kiLines.slice(0, 2).forEach((kl, ki) =>
            p.drawText(kl, { x: 24, y: KI_Y + KI_H - 30 - ki * 16, size: 12, font: regFont, color: WHITE }));
        }
      }
    }

    // ── QUICK REFERENCE PAGE ──────────────────────────────────────────────
    if ((pres.quickReference ?? []).length) {
      const th = CADUS_AI_THEME;
      const p = pdfDoc.addPage([W, H]);
      p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: th.bg });
      // Header
      p.drawRectangle({ x: 0, y: H - 68, width: W, height: 68, color: th.header });
      p.drawRectangle({ x: 0, y: H - 71, width: W, height: 3, color: th.accent });
      // Decorative diagonal on header right
      for (let d = 0; d < 4; d++) {
        p.drawRectangle({ x: W - 50 - d * 22, y: H - 5, width: 14, height: 80,
          color: th.accentDim, rotate: { type: "degrees", angle: -15 }, opacity: 0.2 + d * 0.05 });
      }
      p.drawText("QUICK REFERENCE GUIDE", { x: 22, y: H - 40, size: 22, font: boldFont, color: WHITE });
      p.drawText("Key clinical terminology  |  Cadus AI - aethex", { x: 22, y: H - 60, size: 9, font: oblFont, color: rgb(0.60, 0.82, 0.78) });

      const refs = (pres.quickReference ?? []).slice(0, 10);
      const COLS = 2, colW = (W - 52) / COLS, ROW_H = 62;
      refs.forEach((ref, i) => {
        const col = i % COLS, row = Math.floor(i / COLS);
        const rx = 16 + col * (colW + 20), ry = H - 84 - row * ROW_H;
        // shadow
        p.drawRectangle({ x: rx + 3, y: ry - ROW_H + 7, width: colW, height: ROW_H - 2, color: rgb(0.82, 0.86, 0.90) });
        // card
        p.drawRectangle({ x: rx, y: ry - ROW_H + 9, width: colW, height: ROW_H - 2, color: WHITE });
        // accent stripe
        p.drawRectangle({ x: rx, y: ry + 6, width: colW, height: 4, color: th.accent });
        // Number badge
        p.drawRectangle({ x: rx + colW - 24, y: ry - 6, width: 18, height: 18, color: th.accent });
        p.drawText(String(i + 1), { x: rx + colW - 20, y: ry - 1, size: 8, font: boldFont, color: WHITE });
        // Term + definition
        p.drawText(s(ref.term), { x: rx + 10, y: ry - 6, size: 11, font: boldFont, color: th.header });
        const defLines = wrap(s(ref.definition), regFont, 9, colW - 22);
        defLines.slice(0, 3).forEach((dl, di) =>
          p.drawText(dl, { x: rx + 10, y: ry - 22 - di * 11.5, size: 9, font: regFont, color: th.subText }));
      });

      // Footer
      p.drawRectangle({ x: 0, y: 0, width: W, height: 30, color: th.footerBg });
      p.drawText("Cadus AI - aethex  |  Medical Education Series  |  All rights reserved", { x: 20, y: 9, size: 9, font: regFont, color: rgb(0.75, 0.88, 0.92) });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    // ── DOCX ─────────────────────────────────────────────────────────────
    const children: Paragraph[] = [
      new Paragraph({ children: [new TextRun({ text: s(pres.title || prompt), bold: true, size: 56 })], heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 160 } }),
    ];
    if (pres.subtitle) children.push(new Paragraph({ children: [new TextRun({ text: s(pres.subtitle), italics: true, size: 26, color: "888888" })], alignment: AlignmentType.CENTER, spacing: { after: 400 } }));

    for (const slide of pres.slides) {
      children.push(new Paragraph({ children: [new TextRun({ text: `Slide ${slide.slideNumber}: ${s(slide.title)}`, bold: true, size: 30, color: "0D7A69" })], heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 100 } }));
      for (const bullet of slide.bullets ?? []) {
        children.push(new Paragraph({ children: [new TextRun({ text: s(bullet), size: 22 })], bullet: { level: 0 }, spacing: { after: 60 } }));
      }
      if (slide.keyFact) {
        children.push(new Paragraph({ children: [new TextRun({ text: "KEY FACT: ", bold: true, size: 21, color: "0D7A69" }), new TextRun({ text: s(slide.keyFact), size: 21, italics: true })], spacing: { before: 120, after: 80 } }));
      }
      if (slide.mindMap?.nodes?.length) {
        children.push(new Paragraph({ children: [new TextRun({ text: `Mind Map: ${s(slide.mindMap.center)}`, bold: true, size: 20, color: "155E4E" })], spacing: { before: 80, after: 40 } }));
        for (const node of slide.mindMap.nodes) {
          children.push(new Paragraph({ children: [new TextRun({ text: s(node), size: 20 })], bullet: { level: 1 }, spacing: { after: 30 } }));
        }
      }
      children.push(new Paragraph({ children: [new TextRun("")], spacing: { after: 200 } }));
    }

    if ((pres.quickReference ?? []).length) {
      children.push(new Paragraph({ children: [new TextRun({ text: "Quick Reference Guide", bold: true, size: 34, color: "0D7A69" })], heading: HeadingLevel.HEADING_1, spacing: { before: 600, after: 200 } }));
      for (const ref of pres.quickReference ?? []) {
        children.push(new Paragraph({ children: [new TextRun({ text: `${s(ref.term)}: `, bold: true, size: 22 }), new TextRun({ text: s(ref.definition), size: 22 })], spacing: { after: 80 } }));
      }
    }

    children.push(new Paragraph({ children: [new TextRun({ text: "Generated by Cadus AI - aethex", italics: true, size: 18, color: "999999" })], alignment: AlignmentType.CENTER, spacing: { before: 400 } }));

    const doc = new Document({ sections: [{ properties: {}, children }] });
    const docxBuffer = await Packer.toBuffer(doc);
    const docxBase64 = docxBuffer.toString("base64");

    res.json({ pdfBase64, docxBase64, title: pres.title || prompt, totalSlides: pres.slides.length });
  } catch (err) {
    req.log.error({ err }, "Error generating presentation");
    res.status(500).json({ error: "Presentation generation failed" });
  }
});

export default router;
