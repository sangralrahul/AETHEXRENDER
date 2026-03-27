import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { jsonrepair } from "jsonrepair";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const agentPrompts: Record<string, { systemPrompt: string; suggestions: string[] }> = {
  synapse: {
    systemPrompt: `You are SYNAPSE — the primary AI medical assistant for aethex, India's premier medical store for doctors and medical students.
You are a knowledgeable, professional, and approachable assistant who helps with:
- Medical product recommendations (stethoscopes, BP machines, surgical instruments, scrubs, aprons, etc.)
- Study material and book recommendations for medical exams (NEET-PG, USMLE, MBBS, MD courses)
- Clinical queries and general medical information
- Guidance on medical equipment selection
- Tips for medical students and resident doctors
Keep responses helpful, professional, and concise. Always recommend consulting senior doctors or specialists for clinical decisions. Your name is SYNAPSE.`,
    suggestions: [
      "Which stethoscope is best for a medical student?",
      "Recommend books for NEET-PG 2025",
      "Best BP machine for a new clinic",
      "What scrubs are suitable for long shifts?",
    ],
  },
  pulse45: {
    systemPrompt: `You are PULSE 4.5 — a specialized AI agent for aethex focused on patient vitals, physiological monitoring, emergency medicine, and critical care for Indian doctors and medical students.
Your expertise covers:
- Vital signs interpretation (BP, HR, SpO2, temperature, respiratory rate)
- Emergency medicine protocols and ACLS/BLS guidelines
- Critical care and ICU management
- Physiological monitoring equipment recommendations (pulse oximeters, ECG monitors, BP machines)
- Triage and acute care decision support
- Resuscitation algorithms and drug dosages
- NEET-PG emergency medicine and critical care prep
Keep responses fast, clear, and clinically actionable. Always recommend senior supervision for critical decisions. Your name is PULSE 4.5.`,
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
Keep responses evidence-based, precise, and grounded in standard Indian formulary and guidelines. Your name is FLUX 3.6.`,
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
You provide expert-level, deeply reasoned responses that go far beyond standard AI assistants. Your name is NOVA 4.6, and you are a Pro-tier agent.`,
    suggestions: [
      "Differential for unexplained weight loss in young adults?",
      "Latest ACC/AHA heart failure guidelines 2024?",
      "Complex drug regimen optimisation for multimorbidity",
      "Rare autoimmune conditions mimicking SLE",
    ],
  },
};

router.post("/ai/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [], agent = "synapse" } = req.body;

    if (!message) {
      res.status(400).json({ error: "message is required" });
      return;
    }

    const agentKey = String(agent).toLowerCase().replace(/[\s.]/g, "");
    const agentConfig = agentPrompts[agentKey] ?? agentPrompts.synapse;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: agentConfig.systemPrompt },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages,
      max_completion_tokens: 8192,
    });

    const responseMessage =
      completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't process your request.";

    res.json({ message: responseMessage, suggestions: agentConfig.suggestions });
  } catch (err) {
    req.log.error({ err }, "Error calling AI chat");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

router.post("/ai/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "prompt is required" });
      return;
    }

    const medicalPrompt = `Medical illustration, professional clinical style: ${prompt}. High quality, accurate, educational medical artwork.`;

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: medicalPrompt,
      n: 1,
      size: "1024x1024",
    });

    const b64 = response.data[0]?.b64_json;
    if (!b64) {
      res.status(500).json({ error: "No image generated" });
      return;
    }

    res.json({ imageUrl: `data:image/png;base64,${b64}` });
  } catch (err) {
    req.log.error({ err }, "Error generating image");
    res.status(500).json({ error: "Image generation failed" });
  }
});

// ── /api/ai/generate-slides — returns JSON slide data for in-browser viewer ──
router.post("/ai/generate-slides", async (req, res) => {
  try {
    const { prompt, slideCount } = req.body;
    if (!prompt) { res.status(400).json({ error: "prompt is required" }); return; }

    const count = Math.max(5, Math.min(20, parseInt(String(slideCount ?? 12)) || 12));
    // For 12 slides, use the full structured template; otherwise adapt
    const useFullTemplate = count >= 10;

    const slideTypesInstructions = useFullTemplate
      ? `Generate EXACTLY ${count} slides with these types in order (adjust last few if count differs):
title, overview, anatomy, physiology, pathways, clinical, conditions, redflags, mindmap, faq, glossary, summary
Types: title|overview|anatomy|physiology|pathways|clinical|conditions|redflags|mindmap|faq|glossary|summary`
      : `Generate ${count} slides. First must be type "title", last must be type "summary". Middle slides should be: overview, anatomy, physiology, clinical, faq, glossary as appropriate.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: "You are SYNAPSE, a medical education AI. Return ONLY valid JSON — no markdown, no fences. ASCII only (no Unicode, no Greek letters, spell them out).",
        },
        {
          role: "user",
          content: `Create a ${count}-slide medical education presentation on: "${prompt}".

${slideTypesInstructions}

Return ONLY this flat JSON (no nested arrays inside slide objects):
{
  "title": "Full topic name",
  "subtitle": "Scope and audience",
  "slides": [
    {
      "n": 1,
      "type": "title",
      "t": "slide title (same as topic for slide 1)",
      "sub": "subtitle (title slide only)",
      "b1": "point 1 (10-15 words, omit for title/mindmap slides)",
      "b2": "point 2",
      "b3": "point 3",
      "b4": "point 4",
      "b5": "point 5",
      "b6": "point 6",
      "ki": "key insight max 15 words (omit for title/mindmap/faq/glossary slides)",
      "diag": "none|flowchart|concept|pathway",
      "nodes": "Node1|Node2|Node3|Node4|Node5|Node6",
      "edges": "0>1,1>2,2>3,0>3"
    }
  ],
  "faq": "Question1::Answer1 detailed||Question2::Answer2||Question3::Answer3||Question4::Answer4||Question5::Answer5||Question6::Answer6||Question7::Answer7||Question8::Answer8",
  "refs": "Term1::Definition1||Term2::Definition2||Term3::Definition3||Term4::Definition4||Term5::Definition5||Term6::Definition6||Term7::Definition7||Term8::Definition8",
  "conditions": "Name1::Features description::Clinical clue||Name2::Features::Clue||Name3::Features::Clue||Name4::Features::Clue||Name5::Features::Clue||Name6::Features::Clue",
  "redflags": "Warning 1 (urgent sign)||Warning 2||Warning 3||Warning 4||Warning 5||Warning 6"
}

RULES:
- "overview" slides: diag="concept", nodes = 6 clinical roles pipe-separated, edges = "0>1,0>2,0>3,0>4,0>5,0>6"
- "anatomy"/"physiology" slides: diag="flowchart", nodes = 6 step/component names
- "pathways"/"clinical" slides: diag="pathway", nodes = 6 pathway nodes
- "mindmap" slide: nodes = 8 branch topics (no bullets needed), diag="none"
- "conditions" slide: conditions field has the data (bullets can be empty)
- "redflags" slide: redflags field has the data
- "faq" slide: faq field has the data
- "glossary" slide: refs field has the data
- edges format: "src>dst" pairs comma-separated, zero-indexed from nodes array
- All 6 bullets required on content slides (overview/anatomy/physiology/pathways/clinical/summary)
- ASCII only throughout`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
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

    const slides = rawSlides.map((sl, idx) => ({
      n: Number(sl.n ?? idx + 1),
      type: String(sl.type ?? "content"),
      t: String(sl.t ?? `Slide ${idx + 1}`),
      sub: String(sl.sub ?? ""),
      bullets: ["b1","b2","b3","b4","b5","b6"]
        .map(k => String(sl[k] ?? "")).filter(Boolean),
      ki: String(sl.ki ?? ""),
      diag: String(sl.diag ?? "none"),
      nodes: String(sl.nodes ?? "").split("|").map(n => n.trim()).filter(Boolean),
      edges: parseEdges(String(sl.edges ?? "")),
    }));

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

router.post("/ai/generate-presentation", async (req, res) => {
  try {
    const { prompt, slideCount } = req.body;
    if (!prompt) { res.status(400).json({ error: "prompt is required" }); return; }

    const count = Math.max(3, Math.min(30, parseInt(String(slideCount ?? 10)) || 10));

    // ── AI call: FLAT JSON — no nested arrays, pipes as delimiters ────────
    // Flat structure avoids all array-inside-object JSON issues that the AI produces.
    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content:
            "You are an expert medical educator. Return ONLY valid JSON — no markdown, no extra text. Use ONLY plain ASCII characters (no Unicode, no curly quotes, no em-dashes, no Greek letters — spell them out). Every string value must be properly quoted.",
        },
        {
          role: "user",
          content: `Create a ${count}-slide medical presentation on: "${prompt}".

Return ONLY this exact JSON (no extra keys, no extra text, no arrays inside slide objects):
{
  "title": "Full topic title",
  "subtitle": "Brief subtitle",
  "slides": [
    {
      "n": 1,
      "t": "Slide title",
      "b1": "Detailed clinical point 1 (10-15 words)",
      "b2": "Detailed clinical point 2 (10-15 words)",
      "b3": "Detailed clinical point 3 (10-15 words)",
      "b4": "Detailed clinical point 4 (10-15 words)",
      "b5": "Detailed clinical point 5 (10-15 words)",
      "b6": "Detailed clinical point 6 (10-15 words)",
      "kf": "Single high-yield key fact (max 14 words)",
      "mc": "Map center 2-3 words",
      "mn": "Node1|Node2|Node3|Node4|Node5|Node6"
    }
  ],
  "refs": "Term1::Definition1 max 15 words||Term2::Definition2||Term3::Definition3||Term4::Definition4||Term5::Definition5||Term6::Definition6||Term7::Definition7||Term8::Definition8"
}

RULES:
- slides array: each slide MUST have ALL fields n,t,b1-b6,kf,mc,mn
- mn field: exactly 6 node labels separated by pipe | character, each 2-4 words
- refs field: 8 entries separated by double-pipe ||, each as Term::Definition
- First slide overview, last slide summary
- ASCII only, no nested arrays anywhere`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    // Parse with multiple fallback layers
    let parsed: Record<string, unknown> = {};
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      // Layer 1: native parse
      try { parsed = JSON.parse(jsonMatch[0]); }
      catch (_) {
        // Layer 2: manual comma cleanup then parse
        try {
          const cleaned = jsonMatch[0].replace(/,(\s*[}\]])/g, "$1");
          parsed = JSON.parse(cleaned);
        } catch (_) {
          // Layer 3: jsonrepair
          try { parsed = JSON.parse(jsonrepair(jsonMatch[0])); }
          catch (_) {
            // Layer 4: aggressive cleanup — strip everything after last valid }
            try {
              const stripped = jsonMatch[0]
                .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // control chars
                .replace(/,(\s*[}\]])/g, "$1");               // trailing commas
              parsed = JSON.parse(stripped);
            } catch (_) {
              throw new Error("Could not parse AI response after all repair attempts");
            }
          }
        }
      }
    } else {
      throw new Error("No JSON found in AI response");
    }

    // ── Convert flat schema → rich structure ─────────────────────────────
    const rawSlides = Array.isArray(parsed.slides) ? parsed.slides as Record<string, unknown>[] : [];

    const pres = {
      title:    String(parsed.title    ?? prompt),
      subtitle: String(parsed.subtitle ?? ""),
      slides: rawSlides.map((sl, idx) => ({
        slideNumber: Number(sl.n ?? idx + 1),
        title:  String(sl.t  ?? `Slide ${idx + 1}`),
        bullets: ["b1","b2","b3","b4","b5","b6"]
          .map(k => String(sl[k] ?? "")).filter(Boolean),
        keyFact: String(sl.kf ?? ""),
        mindMap: {
          center: String(sl.mc ?? ""),
          nodes:  String(sl.mn ?? "").split("|").map(n => n.trim()).filter(Boolean),
        },
      })),
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

    // ── 6 rotating slide themes ───────────────────────────────────────────
    type Theme = {
      bg: ReturnType<typeof rgb>; header: ReturnType<typeof rgb>; headerText: ReturnType<typeof rgb>;
      accent: ReturnType<typeof rgb>; accentDim: ReturnType<typeof rgb>; accentBrt: ReturnType<typeof rgb>;
      bodyText: ReturnType<typeof rgb>; subText: ReturnType<typeof rgb>;
      colDivider: ReturnType<typeof rgb>; rightBg: ReturnType<typeof rgb>;
      nodeBg: ReturnType<typeof rgb>; nodeText: ReturnType<typeof rgb>;
      footerBg: ReturnType<typeof rgb>; footerText: ReturnType<typeof rgb>;
      sepLine: ReturnType<typeof rgb>;
    };
    const THEMES: Theme[] = [
      { // 0 — Dark Navy + Teal
        bg: rgb(0.05, 0.08, 0.15),        header: rgb(0.03, 0.05, 0.10),
        headerText: WHITE,                 accent: rgb(0.08, 0.65, 0.52),
        accentDim: rgb(0.05, 0.38, 0.30), accentBrt: rgb(0.20, 0.82, 0.66),
        bodyText: rgb(0.82, 0.90, 0.88),  subText: rgb(0.55, 0.68, 0.65),
        colDivider: rgb(0.14, 0.22, 0.28),rightBg: rgb(0.04, 0.10, 0.18),
        nodeBg: rgb(0.08, 0.20, 0.18),    nodeText: rgb(0.75, 0.95, 0.88),
        footerBg: rgb(0.04, 0.38, 0.30),  footerText: WHITE,
        sepLine: rgb(0.12, 0.22, 0.22),
      },
      { // 1 — Clean White + Teal
        bg: rgb(0.97, 0.98, 0.99),        header: rgb(0.05, 0.08, 0.15),
        headerText: WHITE,                 accent: rgb(0.08, 0.62, 0.50),
        accentDim: rgb(0.05, 0.42, 0.34), accentBrt: rgb(0.08, 0.62, 0.50),
        bodyText: rgb(0.10, 0.13, 0.20),  subText: rgb(0.42, 0.46, 0.52),
        colDivider: rgb(0.82, 0.88, 0.86),rightBg: rgb(0.92, 0.97, 0.95),
        nodeBg: rgb(0.88, 0.97, 0.94),    nodeText: rgb(0.06, 0.30, 0.24),
        footerBg: rgb(0.05, 0.08, 0.15),  footerText: WHITE,
        sepLine: rgb(0.85, 0.88, 0.90),
      },
      { // 2 — Deep Blue + Gold
        bg: rgb(0.06, 0.10, 0.24),        header: rgb(0.04, 0.06, 0.16),
        headerText: WHITE,                 accent: rgb(0.94, 0.70, 0.10),
        accentDim: rgb(0.70, 0.50, 0.06), accentBrt: rgb(1.0, 0.85, 0.30),
        bodyText: rgb(0.85, 0.90, 0.97),  subText: rgb(0.60, 0.68, 0.82),
        colDivider: rgb(0.14, 0.22, 0.44),rightBg: rgb(0.05, 0.09, 0.20),
        nodeBg: rgb(0.10, 0.18, 0.38),    nodeText: rgb(1.0, 0.88, 0.40),
        footerBg: rgb(0.70, 0.50, 0.06),  footerText: WHITE,
        sepLine: rgb(0.12, 0.20, 0.40),
      },
      { // 3 — Forest Green + Lime
        bg: rgb(0.04, 0.16, 0.13),        header: rgb(0.02, 0.10, 0.08),
        headerText: WHITE,                 accent: rgb(0.22, 0.88, 0.62),
        accentDim: rgb(0.10, 0.55, 0.38), accentBrt: rgb(0.35, 0.98, 0.72),
        bodyText: rgb(0.80, 0.96, 0.88),  subText: rgb(0.50, 0.74, 0.64),
        colDivider: rgb(0.10, 0.28, 0.22),rightBg: rgb(0.05, 0.22, 0.17),
        nodeBg: rgb(0.06, 0.28, 0.22),    nodeText: rgb(0.70, 0.98, 0.82),
        footerBg: rgb(0.10, 0.55, 0.38),  footerText: WHITE,
        sepLine: rgb(0.10, 0.26, 0.20),
      },
      { // 4 — Charcoal + Violet
        bg: rgb(0.10, 0.10, 0.13),        header: rgb(0.06, 0.06, 0.09),
        headerText: WHITE,                 accent: rgb(0.60, 0.40, 0.96),
        accentDim: rgb(0.38, 0.24, 0.70), accentBrt: rgb(0.78, 0.60, 1.0),
        bodyText: rgb(0.86, 0.86, 0.92),  subText: rgb(0.58, 0.58, 0.68),
        colDivider: rgb(0.20, 0.20, 0.28),rightBg: rgb(0.08, 0.08, 0.14),
        nodeBg: rgb(0.16, 0.14, 0.26),    nodeText: rgb(0.82, 0.70, 1.0),
        footerBg: rgb(0.38, 0.24, 0.70),  footerText: WHITE,
        sepLine: rgb(0.20, 0.18, 0.28),
      },
      { // 5 — Slate Blue + Cyan
        bg: rgb(0.93, 0.95, 0.98),        header: rgb(0.10, 0.16, 0.44),
        headerText: WHITE,                 accent: rgb(0.10, 0.52, 0.90),
        accentDim: rgb(0.08, 0.38, 0.72), accentBrt: rgb(0.25, 0.65, 0.98),
        bodyText: rgb(0.08, 0.12, 0.26),  subText: rgb(0.36, 0.42, 0.58),
        colDivider: rgb(0.76, 0.82, 0.92),rightBg: rgb(0.86, 0.91, 0.97),
        nodeBg: rgb(0.78, 0.88, 0.98),    nodeText: rgb(0.06, 0.24, 0.58),
        footerBg: rgb(0.10, 0.16, 0.44),  footerText: WHITE,
        sepLine: rgb(0.80, 0.85, 0.92),
      },
    ];

    // ── Professional Mind-Map helper ──────────────────────────────────────
    const drawMindMap = (
      p: ReturnType<typeof pdfDoc.addPage>,
      cx: number, cy: number,
      center: string, nodes: string[],
      th: Theme,
    ) => {
      const safeNodes = (nodes ?? []).slice(0, 6);
      const n = safeNodes.length || 1;
      const RX = 105, RY = 72;

      // Draw connector lines with dots at endpoints
      safeNodes.forEach((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const nx = cx + Math.cos(angle) * RX, ny = cy + Math.sin(angle) * RY;
        p.drawLine({ start: { x: cx, y: cy }, end: { x: nx, y: ny }, thickness: 1.2, color: th.colDivider });
        p.drawCircle({ x: nx, y: ny, size: 3, color: th.accent });
      });

      // Center shadow + main box
      p.drawRectangle({ x: cx - 50, y: cy - 18, width: 104, height: 34, color: th.accentDim });
      p.drawRectangle({ x: cx - 52, y: cy - 16, width: 104, height: 34, color: th.accent });
      const cl = s(center).substring(0, 18);
      const clW = boldFont.widthOfTextAtSize(cl, 8.5);
      p.drawText(cl, { x: cx - Math.min(clW / 2, 46), y: cy - 3, size: 8.5, font: boldFont, color: WHITE });

      // Node shadow + boxes
      safeNodes.forEach((node, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const nx = cx + Math.cos(angle) * RX, ny = cy + Math.sin(angle) * RY;
        const label = s(node).substring(0, 20);
        const lW = regFont.widthOfTextAtSize(label, 7.5);
        const bw = Math.min(Math.max(lW + 16, 60), 85);
        // shadow
        p.drawRectangle({ x: nx - bw / 2 + 2, y: ny - 13, width: bw, height: 24, color: th.accentDim });
        // card
        p.drawRectangle({ x: nx - bw / 2, y: ny - 11, width: bw, height: 24, color: th.nodeBg });
        // top accent stripe
        p.drawRectangle({ x: nx - bw / 2, y: ny + 11, width: bw, height: 2, color: th.accent });
        p.drawText(label, { x: nx - lW / 2, y: ny - 3, size: 7.5, font: regFont, color: th.nodeText });
      });
    };

    // ── TITLE SLIDE ───────────────────────────────────────────────────────
    {
      const p = pdfDoc.addPage([W, H]);
      const NAVY = rgb(0.04, 0.06, 0.14);
      const TEAL = rgb(0.08, 0.65, 0.52);
      const TEAL_D = rgb(0.04, 0.38, 0.30);

      // Full dark background
      p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: NAVY });
      // Diagonal decorative band (top-right corner) — stacked rotated strips
      for (let i = 0; i < 5; i++) {
        p.drawRectangle({ x: W - 180 + i * 28, y: H - 5, width: 20, height: H + 20,
          color: rgb(0.07 + i * 0.01, 0.12 + i * 0.01, 0.24 + i * 0.01),
          rotate: { type: "degrees", angle: -18 } });
      }
      // Accent strips
      p.drawRectangle({ x: 0, y: 0, width: W, height: 6, color: TEAL });
      p.drawRectangle({ x: 0, y: H - 6, width: W, height: 6, color: TEAL });
      p.drawRectangle({ x: 0, y: 0, width: 8, height: H, color: TEAL });
      // Title panel
      p.drawRectangle({ x: 8, y: H / 2 - 100, width: W * 0.60, height: 200, color: rgb(0.07, 0.12, 0.22) });
      // L-bracket corner decoration (top-left of title box)
      p.drawRectangle({ x: 10, y: H / 2 + 88, width: 40, height: 4, color: TEAL });
      p.drawRectangle({ x: 10, y: H / 2 + 56, width: 4, height: 36, color: TEAL });
      // Title text
      const tLines = wrap(s(pres.title || prompt), boldFont, 30, W * 0.55 - 30);
      tLines.slice(0, 3).forEach((ln, i) =>
        p.drawText(ln, { x: 30, y: H / 2 + 50 - i * 38, size: 30, font: boldFont, color: WHITE }));
      // Subtitle
      if (pres.subtitle)
        p.drawText(s(pres.subtitle).substring(0, 75), { x: 30, y: H / 2 - 58, size: 12, font: oblFont, color: rgb(0.60, 0.88, 0.82) });
      // Badges
      const badge1 = `${pres.slides.length} Slides`;
      p.drawRectangle({ x: 30, y: H / 2 - 85, width: boldFont.widthOfTextAtSize(badge1, 9) + 18, height: 20, color: TEAL_D });
      p.drawText(badge1, { x: 39, y: H / 2 - 79, size: 9, font: boldFont, color: WHITE });
      p.drawRectangle({ x: 30 + boldFont.widthOfTextAtSize(badge1, 9) + 28, y: H / 2 - 85,
        width: boldFont.widthOfTextAtSize("Medical Education", 9) + 18, height: 20, color: rgb(0.08, 0.28, 0.24) });
      p.drawText("Medical Education", { x: 30 + boldFont.widthOfTextAtSize(badge1, 9) + 37, y: H / 2 - 79, size: 9, font: regFont, color: rgb(0.60, 0.90, 0.78) });
      // Topic mini-map on right
      const ovNodes = pres.slides.slice(0, 6).map(sl => s(sl.title).substring(0, 15));
      drawMindMap(p, W * 0.80, H / 2 + 5, s(pres.title).substring(0, 13), ovNodes, THEMES[0]);
      // Bottom bar
      p.drawRectangle({ x: 0, y: 0, width: W, height: 32, color: TEAL_D });
      p.drawText(`SYNAPSE - aethex  |  Medical Education Series  |  ${pres.slides.length} slides`, { x: 22, y: 10, size: 9, font: regFont, color: rgb(0.75, 0.94, 0.88) });
      p.drawText("SYNAPSE", { x: W - 80, y: 10, size: 9, font: boldFont, color: rgb(0.30, 0.88, 0.70) });
    }

    // ── CONTENT SLIDES ────────────────────────────────────────────────────
    const HEADER_H = 74;
    const FOOTER_H = 42;
    const LEFT_W   = 464;
    const RIGHT_X  = 480;
    const RIGHT_W  = W - RIGHT_X - 12;
    const MAP_CX   = RIGHT_X + RIGHT_W / 2;
    const MAP_CY   = FOOTER_H + (H - HEADER_H - FOOTER_H) / 2 + 6;
    const totalSlides = pres.slides.length;

    for (let si = 0; si < pres.slides.length; si++) {
      const slide = pres.slides[si];
      const th = THEMES[si % THEMES.length];
      const p = pdfDoc.addPage([W, H]);

      // ── Full background ──
      p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: th.bg });

      // ── Decorative diagonal stripe in top-right (unique per theme) ──
      for (let d = 0; d < 4; d++) {
        p.drawRectangle({
          x: W - 60 - d * 22, y: H - 8, width: 14, height: H + 10,
          color: th.accentDim,
          rotate: { type: "degrees", angle: -(12 + d * 2) },
          opacity: 0.18 + d * 0.04,
        });
      }

      // ── Right column background ──
      p.drawRectangle({ x: RIGHT_X - 6, y: FOOTER_H, width: RIGHT_W + 12, height: H - HEADER_H - FOOTER_H, color: th.rightBg });
      // Right column top accent bar
      p.drawRectangle({ x: RIGHT_X - 6, y: H - HEADER_H - 4, width: RIGHT_W + 12, height: 4, color: th.accent });

      // ── Header ──
      p.drawRectangle({ x: 0, y: H - HEADER_H, width: W, height: HEADER_H, color: th.header });
      p.drawRectangle({ x: 0, y: H - HEADER_H - 3, width: W, height: 3, color: th.accent });
      // Category label
      const catLabel = "MEDICAL EDUCATION  |  SYNAPSE";
      p.drawText(catLabel, { x: 18, y: H - 16, size: 7, font: regFont, color: th.subText });
      // Slide title
      const stLines = wrap(s(slide.title || `Slide ${slide.slideNumber}`), boldFont, 19, LEFT_W - 30);
      stLines.slice(0, 2).forEach((ln, i) =>
        p.drawText(ln, { x: 18, y: H - 40 - i * 22, size: 19, font: boldFont, color: th.headerText }));
      // Slide number badge (accent square with shadow)
      p.drawRectangle({ x: W - 58, y: H - HEADER_H + 6, width: 46, height: 46, color: th.accentDim });
      p.drawRectangle({ x: W - 60, y: H - HEADER_H + 8, width: 46, height: 46, color: th.accent });
      const numStr = String(slide.slideNumber);
      const numW = boldFont.widthOfTextAtSize(numStr, 18);
      p.drawText(numStr, { x: W - 60 + (46 - numW) / 2, y: H - HEADER_H + 22, size: 18, font: boldFont, color: WHITE });

      // ── Column divider ──
      p.drawRectangle({ x: RIGHT_X - 10, y: FOOTER_H + 8, width: 2, height: H - HEADER_H - FOOTER_H - 16, color: th.colDivider });

      // ── LEFT COLUMN — Bullets ──
      const bullets = (slide.bullets ?? []).slice(0, 6);
      const colH = H - HEADER_H - FOOTER_H - 16;
      const slotH = Math.floor(colH / Math.max(bullets.length, 1));

      bullets.forEach((bullet, bi) => {
        const slotTop = H - HEADER_H - 12 - bi * slotH;
        const midY = slotTop - slotH / 2;

        // Numbered circle badge (drawn as overlapping rects to approximate circle)
        p.drawRectangle({ x: 12, y: midY - 10, width: 20, height: 20, color: th.accentDim });
        p.drawRectangle({ x: 10, y: midY - 12, width: 20, height: 20, color: th.accent });
        const biStr = String(bi + 1);
        p.drawText(biStr, { x: 10 + (20 - boldFont.widthOfTextAtSize(biStr, 8.5)) / 2, y: midY - 7, size: 8.5, font: boldFont, color: WHITE });

        // Bullet text — larger than before
        const bLines = wrap(s(bullet), regFont, 11.5, LEFT_W - 46);
        bLines.slice(0, 3).forEach((bl, li) => {
          const ty = slotTop - 14 - li * 14;
          if (ty > FOOTER_H + 4)
            p.drawText(bl, { x: 38, y: ty, size: 11.5, font: li === 0 ? regFont : oblFont, color: th.bodyText });
        });

        // Separator between bullets
        if (bi < bullets.length - 1)
          p.drawRectangle({ x: 10, y: slotTop - slotH + 2, width: LEFT_W - 16, height: 0.5, color: th.sepLine });
      });

      // ── RIGHT COLUMN — Mind Map + Key Fact ──
      // "CONCEPT MAP" label
      p.drawText("CONCEPT MAP", { x: RIGHT_X + 4, y: H - HEADER_H - 14, size: 7, font: boldFont, color: th.accentBrt });

      if (slide.mindMap?.nodes?.length) {
        // Draw map in upper part of right column
        drawMindMap(p, MAP_CX, FOOTER_H + (H - HEADER_H - FOOTER_H) * 0.42, slide.mindMap.center, slide.mindMap.nodes, th);
      }

      // Key Fact card at bottom of right column
      const KF_Y = FOOTER_H + 4;
      const KF_H = 56;
      p.drawRectangle({ x: RIGHT_X - 4, y: KF_Y, width: RIGHT_W + 8, height: KF_H, color: th.accentDim });
      p.drawRectangle({ x: RIGHT_X - 6, y: KF_Y + 2, width: RIGHT_W + 8, height: KF_H, color: th.header });
      p.drawRectangle({ x: RIGHT_X - 6, y: KF_Y + KF_H - 2, width: RIGHT_W + 8, height: 3, color: th.accent });
      p.drawText("KEY INSIGHT", { x: RIGHT_X, y: KF_Y + KF_H - 12, size: 7, font: boldFont, color: th.accentBrt });
      const kfLines = wrap(s(slide.keyFact ?? ""), regFont, 9.5, RIGHT_W - 10);
      kfLines.slice(0, 3).forEach((kfl, i) =>
        p.drawText(kfl, { x: RIGHT_X, y: KF_Y + KF_H - 24 - i * 12, size: 9.5, font: regFont, color: th.footerText }));

      // ── FOOTER — Progress + branding ──
      p.drawRectangle({ x: 0, y: 0, width: W, height: FOOTER_H, color: th.footerBg });
      // Progress dots
      const DOT_R = 3.5, DOT_GAP = 12, DOT_START = 20;
      for (let d = 0; d < totalSlides; d++) {
        p.drawCircle({ x: DOT_START + d * DOT_GAP, y: FOOTER_H / 2, size: d === si ? DOT_R : 2,
          color: d === si ? th.accentBrt : th.accentDim });
      }
      // Branding
      p.drawText("SYNAPSE - aethex", { x: W / 2 - 40, y: FOOTER_H / 2 - 5, size: 8, font: boldFont, color: th.accentBrt });
      p.drawText(`${slide.slideNumber} / ${totalSlides}`, { x: W - 44, y: FOOTER_H / 2 - 5, size: 8, font: boldFont, color: th.accentBrt });
    }

    // ── QUICK REFERENCE PAGE ──────────────────────────────────────────────
    if ((pres.quickReference ?? []).length) {
      const th = THEMES[1]; // clean white for reference page
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
      p.drawText("Key clinical terminology  |  SYNAPSE - aethex", { x: 22, y: H - 60, size: 9, font: oblFont, color: rgb(0.60, 0.82, 0.78) });

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
      p.drawText("SYNAPSE - aethex  |  Medical Education Series  |  All rights reserved", { x: 20, y: 9, size: 9, font: regFont, color: rgb(0.75, 0.88, 0.92) });
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

    children.push(new Paragraph({ children: [new TextRun({ text: "Generated by SYNAPSE - aethex", italics: true, size: 18, color: "999999" })], alignment: AlignmentType.CENTER, spacing: { before: 400 } }));

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
