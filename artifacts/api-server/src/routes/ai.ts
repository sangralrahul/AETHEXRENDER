import { Router, type IRouter } from "express";
import OpenAI from "openai";

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
      model: "dall-e-3",
      prompt: medicalPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      res.status(500).json({ error: "No image generated" });
      return;
    }

    res.json({ imageUrl });
  } catch (err) {
    req.log.error({ err }, "Error generating image");
    res.status(500).json({ error: "Image generation failed" });
  }
});

export default router;
