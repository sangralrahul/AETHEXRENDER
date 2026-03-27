import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

router.post("/ai/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      res.status(400).json({ error: "message is required" });
      return;
    }

    const systemPrompt = `You are an AI medical assistant for AETHEX, India's premier medical store for doctors and medical students. 
You help Indian doctors and medical students with:
- Medical product recommendations (stethoscopes, BP machines, surgical instruments, scrubs, aprons, etc.)
- Study material and book recommendations for medical exams (NEET-PG, USMLE, MBBS, MD courses)
- Clinical queries and medical information
- Guidance on medical equipment selection
- Tips for medical students and resident doctors

Keep responses helpful, professional, and concise. Always recommend consulting senior doctors or specialists for clinical decisions.
You can suggest products available on AETHEX when relevant.`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
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

    const responseMessage = completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't process your request.";

    const suggestions = [
      "What stethoscope is best for cardiology?",
      "Recommend books for NEET-PG preparation",
      "Best BP machine for home use",
      "Surgical instruments for a new clinic",
    ];

    res.json({ message: responseMessage, suggestions });
  } catch (err) {
    req.log.error({ err }, "Error calling AI chat");
    res.status(500).json({ error: "AI service unavailable" });
  }
});

export default router;
