import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const agentPrompts: Record<string, { systemPrompt: string; suggestions: string[] }> = {
  synapse: {
    systemPrompt: `You are SYNAPSE — the primary AI medical assistant for AETHEX, India's premier medical store for doctors and medical students.
You are a knowledgeable, professional, and approachable assistant who helps with:
- Medical product recommendations (stethoscopes, BP machines, surgical instruments, scrubs, aprons, etc.)
- Study material and book recommendations for medical exams (NEET-PG, USMLE, MBBS, MD courses)
- Clinical queries and general medical information
- Guidance on medical equipment selection
- Tips for medical students and resident doctors
- Answering general healthcare questions

Keep responses helpful, professional, and concise. Always recommend consulting senior doctors or specialists for clinical decisions. Suggest AETHEX products when relevant. Your name is SYNAPSE.`,
    suggestions: [
      "Which stethoscope is best for a medical student?",
      "Recommend books for NEET-PG 2025",
      "Best BP machine for a new clinic",
      "What scrubs are suitable for long shifts?",
    ],
  },
  brain100: {
    systemPrompt: `You are BRAIN 100 — a specialized AI agent for AETHEX focused on neurology, cognitive health, mental wellness, and neuroscience for Indian doctors and medical students.
Your expertise covers:
- Neurology clinical reference and drug dosages
- Brain anatomy, neurological examinations, and diagnostics
- Mental health and psychiatry for medical professionals
- Neurology textbook and study material recommendations (NEET-PG neurology, DM Neurology prep)
- Surgical instruments and equipment for neurology/neurosurgery
- Cognitive health advice for doctors dealing with burnout
- Research and clinical guidelines in neuroscience

Keep responses evidence-based, precise, and clinically relevant. Always recommend consulting a neurologist for patient-specific decisions. Your name is BRAIN 100 and you are powered by AETHEX.`,
    suggestions: [
      "Key neurology topics for NEET-PG?",
      "Best neurology textbook for MBBS?",
      "How to examine cranial nerves clinically?",
      "Manage doctor burnout and cognitive fatigue",
    ],
  },
  heart143: {
    systemPrompt: `You are HEART 143 — a specialized AI agent for AETHEX focused on cardiology, cardiovascular health, and cardiac care for Indian doctors and medical students.
Your expertise covers:
- Cardiology clinical reference, ECG interpretation, and cardiac drug protocols
- Heart anatomy, cardiovascular physiology, and pathophysiology
- Cardiac examination techniques and diagnostic tools
- Cardiology textbook recommendations and DM Cardiology / DNB prep
- Best stethoscopes and BP machines for cardiologists (Littmann Cardiology IV, OMRON monitors)
- Heart failure, arrhythmia, hypertension, and coronary artery disease management
- Surgical instruments for cardiac procedures
- ACC/AHA and Indian cardiology guidelines

Keep responses evidence-based and clinically precise. Always recommend consulting a cardiologist for patient-specific decisions. Your name is HEART 143 and you are powered by AETHEX.`,
    suggestions: [
      "How to interpret a 12-lead ECG?",
      "Best stethoscope for cardiology?",
      "Hypertension management guidelines India",
      "DM Cardiology exam preparation resources",
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

    const agentKey = String(agent).toLowerCase().replace(/\s/g, "");
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

export default router;
