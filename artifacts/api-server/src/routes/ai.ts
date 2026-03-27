import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

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
    if (!prompt) {
      res.status(400).json({ error: "prompt is required" });
      return;
    }

    const count = Math.max(3, Math.min(30, parseInt(String(slideCount ?? 10)) || 10));

    // 1 — Generate structured slide content via AI
    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content:
            "You are a medical presentation expert creating professional, clinically accurate presentations for Indian doctors and medical students. Return ONLY valid JSON, no markdown fences, no extra text.",
        },
        {
          role: "user",
          content: `Create a ${count}-slide presentation on: "${prompt}".
Return JSON in this exact format:
{
  "title": "Presentation title",
  "subtitle": "Brief subtitle or tagline",
  "slides": [
    { "slideNumber": 1, "title": "Slide title", "bullets": ["point 1", "point 2", "point 3"] }
  ]
}
Include an intro slide, detailed content slides, and a conclusion slide. Keep bullets concise and medically accurate.`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response structure");

    const pres = JSON.parse(jsonMatch[0]) as {
      title: string;
      subtitle: string;
      slides: Array<{ slideNumber: number; title: string; bullets: string[] }>;
    };

    const W = 842;
    const H = 595;
    const DARK = rgb(0.05, 0.08, 0.15);
    const TEAL = rgb(0.08, 0.65, 0.52);
    const WHITE = rgb(1, 1, 1);
    const GREY = rgb(0.35, 0.38, 0.42);
    const BODY = rgb(0.12, 0.15, 0.2);

    // 2 — Build PDF
    const pdfDoc = await PDFDocument.create();
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const wrapText = (text: string, font: typeof regFont, size: number, maxW: number): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let cur = "";
      for (const w of words) {
        const test = cur ? `${cur} ${w}` : w;
        if (font.widthOfTextAtSize(test, size) > maxW && cur) {
          lines.push(cur);
          cur = w;
        } else {
          cur = test;
        }
      }
      if (cur) lines.push(cur);
      return lines;
    };

    // Title slide
    const tp = pdfDoc.addPage([W, H]);
    tp.drawRectangle({ x: 0, y: 0, width: W, height: H, color: DARK });
    tp.drawRectangle({ x: 0, y: 0, width: W, height: 5, color: TEAL });
    tp.drawRectangle({ x: 60, y: H / 2 - 60, width: 4, height: 100, color: TEAL });
    const titleLines = wrapText(pres.title || prompt, boldFont, 32, W - 200);
    titleLines.forEach((line, i) => {
      tp.drawText(line, { x: 80, y: H / 2 + 30 - i * 40, size: 32, font: boldFont, color: WHITE });
    });
    if (pres.subtitle) {
      tp.drawText(pres.subtitle, { x: 80, y: H / 2 - 30, size: 16, font: regFont, color: rgb(0.6, 0.85, 0.78) });
    }
    tp.drawText("Generated by SYNAPSE · aethex", { x: 80, y: 22, size: 9, font: regFont, color: GREY });

    // Content slides
    for (const slide of pres.slides) {
      const p = pdfDoc.addPage([W, H]);
      p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0.97, 0.98, 0.99) });
      p.drawRectangle({ x: 0, y: H - 72, width: W, height: 72, color: DARK });
      p.drawRectangle({ x: 0, y: H - 75, width: W, height: 3, color: TEAL });

      const slideTitle = slide.title || `Slide ${slide.slideNumber}`;
      const stLines = wrapText(slideTitle, boldFont, 20, W - 120);
      stLines.forEach((line, i) => {
        p.drawText(line, { x: 40, y: H - 48 - i * 24, size: 20, font: boldFont, color: WHITE });
      });
      p.drawText(String(slide.slideNumber), { x: W - 48, y: H - 48, size: 18, font: boldFont, color: TEAL });

      let yPos = H - 105;
      for (const bullet of slide.bullets ?? []) {
        if (yPos < 40) break;
        p.drawCircle({ x: 52, y: yPos + 5, size: 4, color: TEAL });
        const bLines = wrapText(bullet, regFont, 13, W - 130);
        for (const bl of bLines) {
          if (yPos < 40) break;
          p.drawText(bl, { x: 66, y: yPos, size: 13, font: regFont, color: BODY });
          yPos -= 19;
        }
        yPos -= 10;
      }

      p.drawRectangle({ x: 0, y: 0, width: W, height: 26, color: DARK });
      p.drawText("SYNAPSE · aethex", { x: 40, y: 8, size: 8, font: regFont, color: GREY });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    // 3 — Build DOCX
    const children: Paragraph[] = [
      new Paragraph({
        children: [new TextRun({ text: pres.title || prompt, bold: true, size: 56 })],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
    ];

    if (pres.subtitle) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: pres.subtitle, italics: true, size: 28, color: "888888" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );
    }

    for (const slide of pres.slides) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `Slide ${slide.slideNumber}: ${slide.title}`, bold: true, size: 32, color: "0D7A69" })],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 120 },
        })
      );
      for (const bullet of slide.bullets ?? []) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: bullet, size: 24 })],
            bullet: { level: 0 },
            spacing: { after: 80 },
          })
        );
      }
      children.push(new Paragraph({ children: [new TextRun("")], spacing: { after: 200 } }));
    }

    children.push(
      new Paragraph({
        children: [new TextRun({ text: "Generated by SYNAPSE · aethex", italics: true, size: 18, color: "999999" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
      })
    );

    const doc = new Document({ sections: [{ properties: {}, children }] });
    const docxBuffer = await Packer.toBuffer(doc);
    const docxBase64 = docxBuffer.toString("base64");

    res.json({
      pdfBase64,
      docxBase64,
      title: pres.title || prompt,
      totalSlides: pres.slides.length,
    });
  } catch (err) {
    req.log.error({ err }, "Error generating presentation");
    res.status(500).json({ error: "Presentation generation failed" });
  }
});

export default router;
