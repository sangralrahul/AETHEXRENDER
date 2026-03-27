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

router.post("/ai/generate-presentation", async (req, res) => {
  try {
    const { prompt, slideCount } = req.body;
    if (!prompt) { res.status(400).json({ error: "prompt is required" }); return; }

    const count = Math.max(3, Math.min(30, parseInt(String(slideCount ?? 10)) || 10));

    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content:
            "You are an expert medical educator creating comprehensive, standalone PDF presentations for Indian doctors and students. Responses must be information-dense so readers need no other source. Return ONLY valid JSON, zero markdown fences, zero extra text. CRITICAL: Use ONLY plain ASCII characters - no Unicode arrows (use ->), no em-dashes (use -), no curly quotes (use straight), no Greek letters (spell out: alpha, beta), no special symbols.",
        },
        {
          role: "user",
          content: `Create a comprehensive ${count}-slide medical presentation on: "${prompt}".

Return ONLY this JSON structure (no extra keys, no extra text):
{
  "title": "Full topic title",
  "subtitle": "Targeted audience and scope",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide Title",
      "bullets": [
        "Detailed clinical point 1 with specific values or mechanism",
        "Detailed clinical point 2 with classification or types",
        "Detailed clinical point 3 with practical application",
        "Detailed clinical point 4 with investigation or diagnosis",
        "Detailed clinical point 5 with management or treatment",
        "Detailed clinical point 6 with complications or prognosis"
      ],
      "keyFact": "Single high-yield fact or critical statistic (max 14 words)",
      "mindMap": {
        "center": "Core concept (2-3 words)",
        "nodes": ["Node1 (2-3w)", "Node2 (2-3w)", "Node3 (2-3w)", "Node4 (2-3w)", "Node5 (2-3w)", "Node6 (2-3w)"]
      }
    }
  ],
  "quickReference": [
    { "term": "Term", "definition": "Concise clinically accurate definition (max 18 words)" }
  ]
}

STRICT RULES:
- EXACTLY 6 bullet points per slide, each 10-18 words, clinically specific
- keyFact: one crisp high-yield statement
- mindMap.nodes: EXACTLY 6 items, each 2-3 words only
- quickReference: 8-12 entries covering key terminology
- First slide: Introduction/Overview; last slide: Summary/Key Takeaways
- ASCII only throughout`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response structure");

    // jsonrepair handles trailing commas, unescaped quotes, missing commas, etc.
    const pres = JSON.parse(jsonrepair(jsonMatch[0])) as {
      title: string;
      subtitle: string;
      slides: Array<{
        slideNumber: number;
        title: string;
        bullets: string[];
        keyFact: string;
        mindMap: { center: string; nodes: string[] };
      }>;
      quickReference: Array<{ term: string; definition: string }>;
    };

    // ── Sanitize for WinAnsi ──────────────────────────────────────────────
    const s = (str: string): string =>
      (str ?? "")
        .replace(/\u2192/g, "->").replace(/\u2190/g, "<-").replace(/\u2191/g, "^").replace(/\u2193/g, "v")
        .replace(/[\u2013\u2014]/g, "-").replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
        .replace(/\u2022/g, "-").replace(/\u00B7/g, "-").replace(/\u2026/g, "...").replace(/\u00D7/g, "x")
        .replace(/\u2265/g, ">=").replace(/\u2264/g, "<=").replace(/\u00B1/g, "+/-").replace(/\u2260/g, "!=")
        .replace(/\u00B0/g, " deg").replace(/\u00B5/g, "u")
        .replace(/\u03B1/g, "alpha").replace(/\u03B2/g, "beta").replace(/\u03B3/g, "gamma")
        .replace(/\u03B4/g, "delta").replace(/\u03BC/g, "mu").replace(/\u03C9/g, "omega")
        .replace(/[^\x00-\xFF]/g, "");

    // ── Colour palette ────────────────────────────────────────────────────
    const W = 842, H = 595;
    const DARK      = rgb(0.05, 0.08, 0.15);
    const TEAL      = rgb(0.08, 0.65, 0.52);
    const TEAL_DIM  = rgb(0.05, 0.42, 0.34);
    const TEAL_BRT  = rgb(0.15, 0.75, 0.62);
    const WHITE     = rgb(1, 1, 1);
    const GREY      = rgb(0.5,  0.52, 0.55);
    const BODY      = rgb(0.12, 0.15, 0.2);
    const LIGHT_BG  = rgb(0.96, 0.97, 0.98);
    const NODE_BG   = rgb(0.90, 0.97, 0.95);
    const DIVIDER   = rgb(0.80, 0.88, 0.86);

    // ── PDF setup ─────────────────────────────────────────────────────────
    const pdfDoc   = await PDFDocument.create();
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regFont  = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const oblFont  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const wrap = (text: string, font: typeof regFont, size: number, maxW: number): string[] => {
      const words = text.split(" ");
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

    // Mind-map helper ─────────────────────────────────────────────────────
    const drawMindMap = (page: ReturnType<typeof pdfDoc.addPage>, cx: number, cy: number, center: string, nodes: string[]) => {
      const safeNodes = (nodes ?? []).slice(0, 6);
      const n = safeNodes.length;
      const RX = 95, RY = 68;
      // Lines first (below boxes)
      safeNodes.forEach((_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        page.drawLine({ start: { x: cx, y: cy }, end: { x: cx + Math.cos(angle) * RX, y: cy + Math.sin(angle) * RY }, thickness: 1, color: DIVIDER });
      });
      // Center box
      const cl = s(center).substring(0, 20);
      const clW = boldFont.widthOfTextAtSize(cl, 8.5);
      page.drawRectangle({ x: cx - 52, y: cy - 16, width: 104, height: 32, color: TEAL });
      page.drawText(cl, { x: cx - Math.min(clW / 2, 46), y: cy - 4, size: 8.5, font: boldFont, color: WHITE });
      // Node boxes
      safeNodes.forEach((node, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
        const nx = cx + Math.cos(angle) * RX;
        const ny = cy + Math.sin(angle) * RY;
        const label = s(node).substring(0, 22);
        const lW = regFont.widthOfTextAtSize(label, 7.5);
        const boxW = Math.min(Math.max(lW + 14, 58), 82);
        page.drawRectangle({ x: nx - boxW / 2, y: ny - 12, width: boxW, height: 24, color: NODE_BG });
        page.drawRectangle({ x: nx - boxW / 2, y: ny + 10, width: boxW, height: 2, color: TEAL });
        page.drawText(label, { x: nx - lW / 2, y: ny - 4, size: 7.5, font: regFont, color: BODY });
      });
    };

    // ── TITLE SLIDE ───────────────────────────────────────────────────────
    {
      const p = pdfDoc.addPage([W, H]);
      // Full dark background
      p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: DARK });
      // Top & bottom teal strips
      p.drawRectangle({ x: 0, y: H - 5, width: W, height: 5, color: TEAL });
      p.drawRectangle({ x: 0, y: 0,     width: W, height: 5, color: TEAL });
      // Left accent bar
      p.drawRectangle({ x: 0, y: 0, width: 7, height: H, color: TEAL });
      // Semi-dark panel behind title
      p.drawRectangle({ x: 7, y: H / 2 - 90, width: W * 0.62, height: 180, color: rgb(0.08, 0.13, 0.22) });
      // Title
      const tLines = wrap(s(pres.title || prompt), boldFont, 32, W * 0.58 - 40);
      tLines.forEach((ln, i) => p.drawText(ln, { x: 30, y: H / 2 + 52 - i * 42, size: 32, font: boldFont, color: WHITE }));
      // Subtitle
      if (pres.subtitle) p.drawText(s(pres.subtitle).substring(0, 80), { x: 30, y: H / 2 - 48, size: 13, font: oblFont, color: rgb(0.60, 0.88, 0.82) });
      // Slide count badge
      const badge = `${pres.slides.length} slides`;
      p.drawRectangle({ x: 30, y: H / 2 - 80, width: boldFont.widthOfTextAtSize(badge, 10) + 16, height: 22, color: TEAL_DIM });
      p.drawText(badge, { x: 38, y: H / 2 - 73, size: 10, font: boldFont, color: WHITE });
      // Topic overview mini-mind-map on right
      const overviewNodes = pres.slides.slice(0, 6).map(sl => s(sl.title).substring(0, 16));
      const overviewCenter = s(pres.title || prompt).substring(0, 14);
      drawMindMap(p, W * 0.81, H / 2, overviewCenter, overviewNodes);
      // Bottom info bar
      p.drawRectangle({ x: 0, y: 0, width: W, height: 30, color: TEAL_DIM });
      p.drawText(`SYNAPSE - aethex  |  Medical Education Series  |  ${pres.slides.length} Slides`, { x: 20, y: 9, size: 9, font: regFont, color: rgb(0.78, 0.94, 0.90) });
    }

    // ── CONTENT SLIDES ────────────────────────────────────────────────────
    const HEADER_H = 70;
    const FOOTER_H = 46;
    const LEFT_W   = 482;
    const RIGHT_X  = LEFT_W + 16;
    const RIGHT_W  = W - RIGHT_X - 16;
    const MAP_CX   = RIGHT_X + RIGHT_W / 2;
    const MAP_CY   = FOOTER_H + (H - HEADER_H - FOOTER_H) / 2 + 8;

    for (const slide of pres.slides) {
      const p = pdfDoc.addPage([W, H]);

      // Background
      p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: LIGHT_BG });
      // Right-column background tint
      p.drawRectangle({ x: RIGHT_X - 4, y: FOOTER_H, width: RIGHT_W + 8, height: H - HEADER_H - FOOTER_H, color: rgb(0.93, 0.97, 0.96) });

      // ── Header ──
      p.drawRectangle({ x: 0, y: H - HEADER_H, width: W, height: HEADER_H, color: DARK });
      p.drawRectangle({ x: 0, y: H - HEADER_H - 3, width: W, height: 3, color: TEAL });
      // Slide number badge
      p.drawRectangle({ x: W - 54, y: H - HEADER_H + 10, width: 44, height: 44, color: TEAL });
      const numStr = String(slide.slideNumber);
      const numW = boldFont.widthOfTextAtSize(numStr, 17);
      p.drawText(numStr, { x: W - 54 + (44 - numW) / 2, y: H - HEADER_H + 23, size: 17, font: boldFont, color: WHITE });
      // Slide title
      const stLines = wrap(s(slide.title || `Slide ${slide.slideNumber}`), boldFont, 19, W - 110);
      stLines.slice(0, 2).forEach((ln, i) => p.drawText(ln, { x: 18, y: H - 42 - i * 23, size: 19, font: boldFont, color: WHITE }));

      // ── Divider ──
      p.drawRectangle({ x: LEFT_W + 6, y: FOOTER_H + 8, width: 1.5, height: H - HEADER_H - FOOTER_H - 16, color: DIVIDER });

      // ── Left column: Bullets ──
      const bullets = (slide.bullets ?? []).slice(0, 6);
      const colH = H - HEADER_H - FOOTER_H - 20;
      const slotH = Math.floor(colH / bullets.length);
      let yB = H - HEADER_H - 16;

      bullets.forEach((bullet, bi) => {
        const slotTop = H - HEADER_H - 16 - bi * slotH;
        // Number badge
        p.drawRectangle({ x: 14, y: slotTop - 20, width: 18, height: 18, color: TEAL });
        const biStr = String(bi + 1);
        p.drawText(biStr, { x: 14 + (18 - boldFont.widthOfTextAtSize(biStr, 8)) / 2, y: slotTop - 16, size: 8, font: boldFont, color: WHITE });
        // Bullet text
        const bLines = wrap(s(bullet), regFont, 11, LEFT_W - 44);
        bLines.slice(0, 4).forEach((bl, li) => {
          const ty = slotTop - 16 - li * 13;
          if (ty > FOOTER_H + 4) p.drawText(bl, { x: 38, y: ty, size: 11, font: regFont, color: BODY });
        });
        // Subtle separator line between bullets
        if (bi < bullets.length - 1) {
          p.drawRectangle({ x: 14, y: slotTop - slotH + 4, width: LEFT_W - 24, height: 0.5, color: rgb(0.88, 0.90, 0.92) });
        }
      });

      // ── Right column: Mind Map ──
      p.drawText("MIND MAP", { x: RIGHT_X + 6, y: H - HEADER_H - 13, size: 7, font: boldFont, color: GREY });
      if (slide.mindMap?.nodes?.length) {
        drawMindMap(p, MAP_CX, MAP_CY, slide.mindMap.center, slide.mindMap.nodes);
      }

      // ── Footer: Key Fact bar ──
      p.drawRectangle({ x: 0, y: 0, width: W, height: FOOTER_H, color: TEAL_DIM });
      p.drawText("KEY FACT", { x: 12, y: FOOTER_H - 15, size: 7.5, font: boldFont, color: TEAL_BRT });
      p.drawRectangle({ x: 12, y: FOOTER_H - 20, width: boldFont.widthOfTextAtSize("KEY FACT", 7.5), height: 1.5, color: TEAL_BRT });
      const kfLines = wrap(s(slide.keyFact ?? ""), regFont, 10, W - 96);
      kfLines.slice(0, 2).forEach((kfl, i) => p.drawText(kfl, { x: 70, y: FOOTER_H - 14 - i * 13, size: 10, font: regFont, color: WHITE }));
      p.drawText(`${slide.slideNumber} / ${pres.slides.length}`, { x: W - 46, y: 10, size: 8, font: boldFont, color: TEAL_BRT });
    }

    // ── QUICK REFERENCE PAGE ──────────────────────────────────────────────
    if ((pres.quickReference ?? []).length) {
      const p = pdfDoc.addPage([W, H]);
      p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: LIGHT_BG });
      p.drawRectangle({ x: 0, y: H - 62, width: W, height: 62, color: DARK });
      p.drawRectangle({ x: 0, y: H - 65, width: W, height: 3, color: TEAL });
      p.drawText("QUICK REFERENCE GUIDE", { x: 20, y: H - 42, size: 20, font: boldFont, color: WHITE });
      p.drawText("Key terminology for this presentation", { x: 20, y: H - 58, size: 9, font: oblFont, color: rgb(0.60, 0.82, 0.78) });

      const refs = (pres.quickReference ?? []).slice(0, 10);
      const COLS = 2;
      const colW = (W - 48) / COLS;
      const ROW_H = 64;

      refs.forEach((ref, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const rx = 16 + col * (colW + 16);
        const ry = H - 80 - row * ROW_H;
        // Card background
        p.drawRectangle({ x: rx, y: ry - ROW_H + 10, width: colW, height: ROW_H - 4, color: WHITE });
        // Teal top accent
        p.drawRectangle({ x: rx, y: ry + 8, width: colW, height: 3, color: TEAL });
        // Term
        p.drawText(s(ref.term), { x: rx + 10, y: ry - 6, size: 11, font: boldFont, color: DARK });
        // Definition (wrapped)
        const defLines = wrap(s(ref.definition), regFont, 9, colW - 20);
        defLines.slice(0, 3).forEach((dl, di) => {
          p.drawText(dl, { x: rx + 10, y: ry - 22 - di * 11, size: 9, font: regFont, color: GREY });
        });
      });

      // Footer branding
      p.drawRectangle({ x: 0, y: 0, width: W, height: 28, color: TEAL_DIM });
      p.drawText("SYNAPSE - aethex  |  Medical Education Series", { x: 20, y: 9, size: 9, font: regFont, color: rgb(0.78, 0.94, 0.90) });
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
