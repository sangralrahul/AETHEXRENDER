import { Router, type IRouter } from "express";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { jsonrepair } from "jsonrepair";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
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

// ── DEEP RESEARCH ────────────────────────────────────────────────────────────
router.post("/ai/deep-research", async (req, res) => {
  try {
    const { query, agent = "synapse" } = req.body;
    if (!query) { res.status(400).json({ error: "query is required" }); return; }

    const GOOGLE_API_KEY = process.env.GOOGLE_CSE_KEY;
    const GOOGLE_CSE_ID  = process.env.GOOGLE_CSE_ID;
    const hasGoogleSearch = !!(GOOGLE_API_KEY && GOOGLE_CSE_ID);

    // Step 1 — generate focused search sub-queries
    const queryGen = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content: `You are a medical research query generator. Generate 4 targeted Google search queries to comprehensively research the given medical topic from multiple angles (pathophysiology, clinical, guidelines, Indian context). Return ONLY a JSON array of strings, no other text. Example: ["query1","query2","query3","query4"]`,
        },
        { role: "user", content: query },
      ],
      max_completion_tokens: 300,
    });

    let searchQueries: string[] = [];
    try {
      const parsed = JSON.parse(jsonrepair(queryGen.choices[0]?.message?.content ?? "[]"));
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
    const agentKey    = String(agent).toLowerCase().replace(/[\s.]/g, "");
    const agentConfig = agentPrompts[agentKey] ?? agentPrompts.synapse;

    const sourceBlock = sources.length
      ? `\n\n---\nLIVE SEARCH RESULTS (from Google):\n${
          sources.map((s, i) => `[${i + 1}] ${s.title}\n${s.snippet}\nSource: ${s.url}`).join("\n\n")
        }\n---`
      : "";

    const synthesis = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content: `${agentConfig.systemPrompt}

You are now in DEEP RESEARCH mode. Produce a comprehensive, evidence-based medical research report for Indian doctors and medical students.${sources.length ? " Cite the provided Google search results using [1], [2], etc. where relevant." : ""}

Use these EXACT section headers (markdown ##):
## Executive Summary
## Epidemiology & Indian Burden
## Pathophysiology
## Clinical Presentation
## Diagnosis
## Management & Treatment
## Key Guidelines & Evidence
## Clinical Pearls

Be thorough, accurate, and practically useful. Use **bold** for key terms. End each section with a concise takeaway.`,
        },
        {
          role: "user",
          content: `Deep research request: ${query}${sourceBlock}`,
        },
      ],
      max_completion_tokens: 4096,
    });

    const report = synthesis.choices[0]?.message?.content ?? "Unable to generate research report.";

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

router.post("/ai/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [], agent = "synapse", language = "en" } = req.body;

    if (!message) {
      res.status(400).json({ error: "message is required" });
      return;
    }

    const agentKey = String(agent).toLowerCase().replace(/[\s.]/g, "");
    const agentConfig = agentPrompts[agentKey] ?? agentPrompts.synapse;

    const langName = LANG_NAMES[String(language)] ?? "English";
    const langInstruction = langName !== "English"
      ? `\n\nIMPORTANT: The user has set their language to ${langName}. You MUST respond entirely in ${langName} (${language}) for every reply. Do not switch to English unless the user explicitly writes in English.`
      : "";

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: agentConfig.systemPrompt + langInstruction },
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
    const { prompt, labeled } = req.body;
    if (!prompt) {
      res.status(400).json({ error: "prompt is required" });
      return;
    }

    const medicalPrompt = labeled
      ? `3D medical educational illustration, clinical textbook style, for healthcare professionals and medical students. Subject: ${prompt}. Render as a clean, detailed 3D anatomical model with clearly visible text labels and callout lines pointing to all key structures. Style: cross-section 3D render, no photorealism, pastel color-coded regions, white background, labeled annotations with arrows, like a Netter or Gray's Anatomy diagram. Educational, scientific, and professional.`
      : `3D anatomical medical illustration for clinical education. Subject: ${prompt}. Render as a detailed, color-coded 3D anatomical model, non-photographic, stylized like a medical textbook or interactive anatomy atlas. Clean background, scientifically accurate structures, professional medical illustration style. Educational use only.`;

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
  } catch (err: any) {
    req.log.error({ err }, "Error generating image");
    if (err?.code === "moderation_blocked" || err?.status === 400) {
      res.status(400).json({ error: "Your prompt was flagged by the content safety system. Please rephrase it and try again." });
      return;
    }
    res.status(500).json({ error: "Image generation failed. Please try again." });
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

    const claudeMsg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: "You are SYNAPSE, a medical education AI built on Claude. Return ONLY valid JSON — no markdown, no fences, no explanation. ASCII only (no Unicode, no Greek letters, spell them out: alpha, beta, etc.).",
      messages: [
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

DIAGRAM RULES — every content slide MUST have a real diagram:
- "overview" slides:   diag="concept",   nodes=6 key concepts, edges="0>1,0>2,0>3,0>4,0>5"
- "anatomy" slides:    diag="flowchart", nodes=6 anatomical components top-to-bottom, edges="0>1,1>2,2>3,3>4,4>5"
- "physiology" slides: diag="flowchart", nodes=6 physiological steps in sequence, edges="0>1,1>2,2>3,3>4,4>5"
- "pathways" slides:   diag="pathway",   nodes=6 pathway steps, edges="0>1,0>2,1>3,2>3,3>4,3>5"
- "clinical" slides:   diag="pathway",   nodes=6 clinical steps/signs, edges="0>1,1>2,2>3,2>4,3>5,4>5"
- "mindmap" slides:    diag="mindmap",   nodes=7 branch topics (first node = center topic), edges="0>1,0>2,0>3,0>4,0>5,0>6"
- "conditions" slide: conditions field has data. Also set diag="concept", nodes=6 condition names
- "redflags" slide: redflags field has data. Also set diag="flowchart", nodes=6 red flag keywords
- "faq" slide: faq field has data. diag="none"
- "glossary" slide: refs field has data. diag="none"
- "summary" slide: diag="mindmap", nodes=7 summary topics
- edges format: "src>dst" pairs comma-separated, zero-indexed
- Node labels: 2-5 words, specific to the medical topic — NO generic names like "Step1" or "Node1"
- All 6 bullets required on content slides
- ASCII only throughout`,
        },
      ],
    });

    const raw = claudeMsg.content[0]?.type === "text" ? claudeMsg.content[0].text : "";
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

    // ── Generate medical illustrations for content slides in parallel ─────
    const imageSlideTypes = new Set(["anatomy", "physiology", "pathways", "clinical", "overview", "mindmap"]);
    const imageTypePrompts: Record<string, string> = {
      anatomy: `Highly detailed 3D anatomical medical illustration of "$TITLE", cross-section labeled diagram, Netter's Gray's Anatomy style, dark navy background, teal accent highlights, clinical textbook quality, no text overlays`,
      physiology: `Medical physiology process illustration of "$TITLE", step-by-step biological mechanism, arrows showing flow, 3D scientific art style, clinical textbook quality, dark background, teal accents`,
      pathways: `Medical clinical pathway algorithm illustration for "$TITLE", branching decision tree diagram, professional medical education art, labeled steps, dark navy background, teal highlights`,
      clinical: `Clinical medicine examination and diagnosis illustration of "$TITLE", doctor examining patient, medical setting, professional medical art, textbook quality, realistic`,
      overview: `Medical education overview concept illustration of "$TITLE", comprehensive labeled medical diagram, professional clinical textbook art, dark background, multiple labeled components`,
      mindmap: `Medical mind map visualization of "$TITLE", radial concept diagram, labeled medical branches, professional clinical art, dark navy background, teal and white labels`,
    };
    const slidesNeedingImages = slides.filter(sl => imageSlideTypes.has(sl.type));
    const imageResults = await Promise.allSettled(
      slidesNeedingImages.map(async (sl) => {
        const promptTemplate = imageTypePrompts[sl.type] ?? `3D anatomical medical illustration of "$TITLE", clinical textbook quality, Netter style, dark background`;
        const imagePrompt = promptTemplate.replace(/\$TITLE/g, sl.t);
        const imageResp = await openai.images.generate({
          model: "dall-e-3",
          prompt: imagePrompt,
          n: 1,
          size: "1792x1024",
          quality: "standard",
        });
        return { slideN: sl.n, url: imageResp.data[0]?.url ?? null };
      })
    );
    const imageMap = new Map<number, string>();
    imageResults.forEach(r => {
      if (r.status === "fulfilled" && r.value?.url) {
        imageMap.set(r.value.slideN, r.value.url);
      }
    });
    const slidesWithImages = slides.map(sl => ({
      ...sl,
      imageUrl: imageMap.get(sl.n) ?? undefined,
    }));

    res.json({
      title: String(parsed.title ?? prompt),
      subtitle: String(parsed.subtitle ?? ""),
      slides: slidesWithImages,
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

    // ── AI call: FLAT JSON with diagram type + nodes + edges (Claude) ─────
    const claudePDFMsg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: "You are SYNAPSE, a medical education AI built on Claude, creating high-quality PDF presentations. Return ONLY valid JSON — no markdown, no fences, no explanation. ASCII only (no Unicode, no Greek letters, spell out: alpha, beta, etc.).",
      messages: [
        {
          role: "user",
          content: `Create a ${count}-slide medical PDF presentation on: "${prompt}".

IMPORTANT: Every slide MUST include a relevant diagram. Choose diag type per slide:
- "flowchart" for anatomy, physiology, mechanism, pathophysiology slides
- "concept"   for overview, clinical roles, classification slides
- "pathway"   for management, treatment pathways, algorithm slides
- "mindmap"   ONLY for the final summary/mind-map slide

Return ONLY this flat JSON (no nested arrays inside slide objects):
{
  "title": "Full topic title",
  "subtitle": "Brief subtitle",
  "slides": [
    {
      "n": 1,
      "t": "Slide title",
      "b1": "Clinical point 1 (10-15 words, specific values/data)",
      "b2": "Clinical point 2 (10-15 words)",
      "b3": "Clinical point 3 (10-15 words)",
      "b4": "Clinical point 4 (10-15 words)",
      "b5": "Clinical point 5 (10-15 words)",
      "b6": "Clinical point 6 (10-15 words)",
      "kf": "High-yield key fact (max 14 words)",
      "diag": "flowchart",
      "nodes": "Step1 Name|Step2 Name|Step3 Name|Step4 Name|Step5 Name|Step6 Name",
      "edges": "0>1,1>2,2>3,3>4,4>5"
    }
  ],
  "refs": "Term1::Definition max 15 words||Term2::Definition||Term3::Definition||Term4::Definition||Term5::Definition||Term6::Definition||Term7::Definition||Term8::Definition"
}

STRICT RULES for diagram fields:
- diag: MUST be one of: flowchart, concept, pathway, mindmap
- nodes: EXACTLY 6 node labels pipe-separated, 2-5 words each, topic-specific names
- edges: source>destination pairs comma-separated (0-indexed from nodes)
  - flowchart: "0>1,1>2,2>3,3>4,4>5" (linear chain)
  - concept: "0>1,0>2,0>3,0>4,0>5" (center hub to all)
  - pathway: "0>1,0>2,1>3,2>3,3>4,3>5" (branching then converging)
  - mindmap: "0>1,0>2,0>3,0>4,0>5" (center to all)
- ALL 6 bullets required, clinically specific to "${prompt}"
- First slide: Overview; Last slide: Summary
- ASCII only`,
        },
      ],
    });

    const raw = claudePDFMsg.content[0]?.type === "text" ? claudePDFMsg.content[0].text : "";

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

    // ── Convert flat schema → rich structure ─────────────────────────────
    const rawSlides = Array.isArray(parsed.slides) ? parsed.slides as Record<string, unknown>[] : [];

    const parseEdgesPDF = (edgeStr: string): [number, number][] =>
      String(edgeStr ?? "").split(",").map(e => {
        const [a, b] = e.trim().split(">").map(Number);
        return [isNaN(a) ? 0 : a, isNaN(b) ? 1 : b] as [number, number];
      }).filter(([a, b]) => !isNaN(a) && !isNaN(b));

    const pres = {
      title:    String(parsed.title    ?? prompt),
      subtitle: String(parsed.subtitle ?? ""),
      slides: rawSlides.map((sl, idx) => ({
        slideNumber: Number(sl.n ?? idx + 1),
        title:  String(sl.t  ?? `Slide ${idx + 1}`),
        bullets: ["b1","b2","b3","b4","b5","b6"]
          .map(k => String(sl[k] ?? "")).filter(Boolean),
        keyFact: String(sl.kf ?? ""),
        diag: String(sl.diag ?? "mindmap"),
        nodes: String(sl.nodes ?? sl.mn ?? "").split("|").map(n => n.trim()).filter(Boolean),
        edges: parseEdgesPDF(String(sl.edges ?? "")),
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

    // ── Single SYNAPSE theme (Gamma-style clean professional) ─────────────
    type Theme = {
      bg: ReturnType<typeof rgb>; header: ReturnType<typeof rgb>; headerText: ReturnType<typeof rgb>;
      accent: ReturnType<typeof rgb>; accentDim: ReturnType<typeof rgb>; accentBrt: ReturnType<typeof rgb>;
      bodyText: ReturnType<typeof rgb>; subText: ReturnType<typeof rgb>;
      colDivider: ReturnType<typeof rgb>; rightBg: ReturnType<typeof rgb>;
      nodeBg: ReturnType<typeof rgb>; nodeText: ReturnType<typeof rgb>;
      footerBg: ReturnType<typeof rgb>; footerText: ReturnType<typeof rgb>;
      sepLine: ReturnType<typeof rgb>;
    };
    const SYNAPSE_THEME: Theme = {
      bg: rgb(0.97, 0.98, 0.99),         header: rgb(0.04, 0.07, 0.18),
      headerText: WHITE,                  accent: rgb(0.04, 0.74, 0.60),
      accentDim: rgb(0.03, 0.40, 0.33),  accentBrt: rgb(0.15, 0.88, 0.72),
      bodyText: rgb(0.07, 0.10, 0.20),   subText: rgb(0.38, 0.44, 0.55),
      colDivider: rgb(0.86, 0.92, 0.90), rightBg: rgb(0.92, 0.96, 0.97),
      nodeBg: rgb(0.88, 0.96, 0.94),     nodeText: rgb(0.04, 0.28, 0.24),
      footerBg: rgb(0.04, 0.07, 0.18),   footerText: WHITE,
      sepLine: rgb(0.86, 0.92, 0.90),
    };
    const THEMES: Theme[] = Array(6).fill(SYNAPSE_THEME);

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

      // SYNAPSE label (top-left, small)
      p.drawText("MEDICAL EDUCATION  |  SYNAPSE", { x: 22, y: H - 18, size: 7, font: regFont, color: rgb(0.35, 0.65, 0.58) });

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
      p.drawText(`SYNAPSE - aethex  |  Medical Education Series  |  ${pres.slides.length} slides`, { x: 22, y: 16, size: 9, font: regFont, color: rgb(0.55, 0.78, 0.72) });
      p.drawText("SYNAPSE", { x: W - 72, y: 16, size: 9, font: boldFont, color: TEAL_B });
    }

    // ── CONTENT SLIDES (Gamma-style: white bg, bold header, bullet cards) ────
    const HEADER_H = 82;
    const FOOTER_H = 36;
    const LEFT_W   = 460;
    const RIGHT_X  = 474;
    const RIGHT_W  = W - RIGHT_X - 10;
    const MAP_CX   = RIGHT_X + RIGHT_W / 2;
    const KF_H     = 68;
    const DIAG_AREA_BOT = FOOTER_H + KF_H + 4;
    const DIAG_AREA_TOP = H - HEADER_H - 18;
    const totalSlides   = pres.slides.length;

    const DIAG_LABEL: Record<string, string> = {
      flowchart: "MECHANISM FLOWCHART", concept: "CONCEPT MAP",
      pathway: "CLINICAL PATHWAY",    mindmap: "MIND MAP",
    };

    for (let si = 0; si < pres.slides.length; si++) {
      const slide = pres.slides[si];
      const th = SYNAPSE_THEME;
      const p = pdfDoc.addPage([W, H]);

      // ── WHITE background ──
      p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: th.bg });

      // ── Left accent bar ──
      p.drawRectangle({ x: 0, y: 0, width: 6, height: H, color: th.accent });

      // ── HEADER (dark navy, full width) ──
      p.drawRectangle({ x: 6, y: H - HEADER_H, width: W - 6, height: HEADER_H, color: th.header });
      p.drawRectangle({ x: 6, y: H - HEADER_H - 3, width: W - 6, height: 3, color: th.accent });

      // Subtle diagonal pattern in header
      for (let d = 0; d < 5; d++) {
        p.drawRectangle({ x: W - 120 + d * 20, y: H - HEADER_H, width: 12, height: HEADER_H + 2,
          color: rgb(0.06 + d * 0.01, 0.10 + d * 0.01, 0.26 + d * 0.01),
          rotate: { type: "degrees", angle: -10 }, opacity: 0.3 });
      }

      // "MEDICAL EDUCATION | SYNAPSE" label
      p.drawText("MEDICAL EDUCATION  |  SYNAPSE", { x: 20, y: H - 15, size: 6.5, font: regFont, color: rgb(0.38, 0.68, 0.62) });

      // Slide title — LARGE
      const stLines = wrap(s(slide.title || `Slide ${slide.slideNumber}`), boldFont, 22, W - 110);
      stLines.slice(0, 2).forEach((ln, i) =>
        p.drawText(ln, { x: 20, y: H - 44 - i * 26, size: 22, font: boldFont, color: WHITE }));

      // Slide number badge (shadow + fill)
      p.drawRectangle({ x: W - 58, y: H - HEADER_H + 5, width: 46, height: 46, color: th.accentDim });
      p.drawRectangle({ x: W - 60, y: H - HEADER_H + 7, width: 46, height: 46, color: th.accent });
      const numStr = String(slide.slideNumber);
      const numW = boldFont.widthOfTextAtSize(numStr, 18);
      p.drawText(numStr, { x: W - 60 + (46 - numW) / 2, y: H - HEADER_H + 22, size: 18, font: boldFont, color: WHITE });

      // ── BODY setup ──
      const BODY_TOP = H - HEADER_H - 6;
      const BODY_BOT = FOOTER_H;
      const BODY_H   = BODY_TOP - BODY_BOT;

      // Right column background
      p.drawRectangle({ x: RIGHT_X - 6, y: BODY_BOT + 4, width: RIGHT_W + 8, height: BODY_H - 8, color: th.rightBg });

      // Column divider
      p.drawRectangle({ x: RIGHT_X - 8, y: BODY_BOT + 8, width: 1, height: BODY_H - 16, color: th.colDivider });

      // ── LEFT COLUMN — BULLET CARDS ──
      const bullets = (slide.bullets ?? []).slice(0, 6);
      const CARD_H_ROW = Math.floor(BODY_H / Math.max(bullets.length, 1));

      bullets.forEach((bullet, bi) => {
        const rowTop = BODY_TOP - bi * CARD_H_ROW;
        const rowBot = rowTop - CARD_H_ROW;
        const midY   = (rowTop + rowBot) / 2;

        // Alternate row shading (Gamma card style)
        if (bi % 2 === 0) {
          p.drawRectangle({ x: 8, y: rowBot + 2, width: LEFT_W - 4, height: CARD_H_ROW - 4, color: rgb(0.93, 0.97, 0.95) });
        }

        // Left teal accent border on each card
        p.drawRectangle({ x: 8, y: rowBot + 2, width: 3, height: CARD_H_ROW - 4, color: th.accent });

        // Number badge
        p.drawRectangle({ x: 14, y: midY - 10, width: 20, height: 20, color: th.accentDim });
        p.drawRectangle({ x: 15, y: midY - 11, width: 20, height: 20, color: th.accent });
        const biStr = String(bi + 1);
        p.drawText(biStr, { x: 15 + (20 - boldFont.widthOfTextAtSize(biStr, 8)) / 2, y: midY - 7, size: 8, font: boldFont, color: WHITE });

        // Bullet text (first line bold, rest regular)
        const bLines = wrap(s(bullet), regFont, 11.5, LEFT_W - 50);
        const textStartY = rowTop - 10;
        bLines.slice(0, 3).forEach((bl, li) => {
          const ty = textStartY - li * 14;
          if (ty > BODY_BOT + 2)
            p.drawText(bl, { x: 42, y: ty, size: 11.5, font: li === 0 ? boldFont : regFont, color: th.bodyText });
        });

        // Thin separator line
        if (bi < bullets.length - 1)
          p.drawRectangle({ x: 8, y: rowBot + 1, width: LEFT_W - 10, height: 0.5, color: th.sepLine });
      });

      // ── RIGHT COLUMN — Diagram label ──
      p.drawText(DIAG_LABEL[slide.diag ?? "concept"] ?? "DIAGRAM",
        { x: RIGHT_X, y: BODY_TOP - 13, size: 6.5, font: boldFont, color: th.accentDim });

      // Diagram nodes fallback
      const diagNodes = (slide.nodes ?? []).length
        ? slide.nodes!
        : [slide.title].filter(Boolean).slice(0, 6);
      drawDiagramPDF(p, slide.diag ?? "concept", MAP_CX,
        DIAG_AREA_TOP, DIAG_AREA_BOT, diagNodes, slide.edges ?? [], th);

      // ── KEY INSIGHT card (bottom of right column) ──
      p.drawRectangle({ x: RIGHT_X - 6, y: BODY_BOT + 2, width: RIGHT_W + 8, height: KF_H, color: th.header });
      p.drawRectangle({ x: RIGHT_X - 6, y: BODY_BOT + 2 + KF_H - 3, width: RIGHT_W + 8, height: 3, color: th.accent });
      p.drawText("KEY INSIGHT", { x: RIGHT_X, y: BODY_BOT + KF_H - 12, size: 6.5, font: boldFont, color: th.accentBrt });
      const kfLines = wrap(s(slide.keyFact ?? ""), regFont, 9.5, RIGHT_W - 12);
      kfLines.slice(0, 3).forEach((kfl, ki) =>
        p.drawText(kfl, { x: RIGHT_X, y: BODY_BOT + KF_H - 24 - ki * 12, size: 9.5, font: regFont, color: WHITE }));

      // ── FOOTER ──
      p.drawRectangle({ x: 0, y: 0, width: W, height: FOOTER_H, color: th.footerBg });
      p.drawRectangle({ x: 0, y: FOOTER_H - 2, width: W, height: 2, color: th.accent });

      // Progress bar (filled line)
      const prog = slide.slideNumber / totalSlides;
      p.drawRectangle({ x: 12, y: FOOTER_H / 2 - 1, width: W - 180, height: 3, color: rgb(0.12, 0.20, 0.38) });
      p.drawRectangle({ x: 12, y: FOOTER_H / 2 - 1, width: (W - 180) * prog, height: 3, color: th.accent });

      // Branding + page number
      p.drawText("SYNAPSE - aethex", { x: W / 2 - 44, y: FOOTER_H / 2 - 5, size: 8, font: boldFont, color: th.accentBrt });
      p.drawText(`${slide.slideNumber} / ${totalSlides}`, { x: W - 54, y: FOOTER_H / 2 - 5, size: 8, font: boldFont, color: rgb(0.50, 0.70, 0.65) });
    }

    // ── QUICK REFERENCE PAGE ──────────────────────────────────────────────
    if ((pres.quickReference ?? []).length) {
      const th = SYNAPSE_THEME;
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
