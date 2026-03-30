import { Router, type IRouter } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import OpenAI from "openai";
import { db } from "@workspace/db";
import { messagesTable } from "@workspace/db";
import { sendContactUserEmail, sendContactAdminEmail } from "../lib/zoho-mailer.js";

const router: IRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => ipKeyGenerator(req),
  validate: { xForwardedForHeader: false },
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const CADUS_SYSTEM_PROMPT = `You are Cadus AI, an advanced AI medical assistant inside AETHEX — India's premier medical store for doctors and medical students.
You help medical professionals and students with:
- NEET PG / USMLE preparation and medical exam guidance
- Medical product recommendations (stethoscopes, BP machines, surgical instruments, lab coats, scrubs)
- Clinical concepts, pharmacology, and general medical information
- Study material and book recommendations

Be structured, accurate, and concise. Use numbered or bulleted lists when helpful.
Do not provide direct clinical diagnoses or unsafe medical advice. Always recommend consulting a licensed specialist.
Keep responses helpful and professional. Your name is Cadus AI.`;

router.post("/contact", contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    res.status(400).json({ error: "All fields (name, email, subject, message) are required." });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }

  if (message.length > 2000) {
    res.status(400).json({ error: "Message must not exceed 2000 characters." });
    return;
  }

  const sanitizedName = name.trim().slice(0, 100);
  const sanitizedEmail = email.toLowerCase().trim();
  const sanitizedSubject = subject.trim().slice(0, 200);
  const sanitizedMessage = message.trim();

  let aiResponse = "Thank you for your query. Our team will review and respond shortly.";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: CADUS_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Subject: ${sanitizedSubject}\n\nQuery: ${sanitizedMessage}`,
        },
      ],
      max_tokens: 600,
      temperature: 0.6,
    });

    aiResponse = completion.choices[0]?.message?.content ?? aiResponse;
  } catch (aiErr) {
    console.error("Cadus AI error for contact:", aiErr);
  }

  try {
    await db.insert(messagesTable).values({
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      aiResponse,
    });
  } catch (dbErr) {
    console.error("DB insert error for message:", dbErr);
  }

  const emailErrors: string[] = [];

  try {
    await sendContactUserEmail(
      sanitizedEmail,
      sanitizedName,
      sanitizedSubject,
      sanitizedMessage,
      aiResponse
    );
  } catch (e) {
    console.error("Failed to send user email:", e);
    emailErrors.push("user");
  }

  try {
    await sendContactAdminEmail(
      sanitizedName,
      sanitizedEmail,
      sanitizedSubject,
      sanitizedMessage,
      aiResponse
    );
  } catch (e) {
    console.error("Failed to send admin email:", e);
    emailErrors.push("admin");
  }

  res.json({
    success: true,
    aiResponse,
    emailSent: emailErrors.length === 0,
    message: "Your query has been received. Check your email for Cadus AI's response.",
  });
});

export default router;
