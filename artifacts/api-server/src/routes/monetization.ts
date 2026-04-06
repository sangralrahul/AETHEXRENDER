import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  referralsTable,
  consultHistoryTable,
  mcqProgressTable,
  reportPaymentsTable,
  authUsersTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, optionalAuth } from "../middlewares/auth.js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import crypto from "crypto";

const router: IRouter = Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID ?? "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "";

const DAILY_MCQS = [
  {
    id: 1,
    question: "A 45-year-old man presents with chest pain radiating to the left arm, diaphoresis, and nausea. ECG shows ST elevation in leads II, III, and aVF. Which artery is most likely occluded?",
    options: ["A. Left anterior descending artery", "B. Right coronary artery", "C. Left circumflex artery", "D. Left main coronary artery"],
    correct: "B",
    explanation: "ST elevation in leads II, III, and aVF indicates an inferior MI, which is most commonly due to occlusion of the right coronary artery (RCA), which supplies the inferior wall of the left ventricle.",
    subject: "Cardiology",
  },
  {
    id: 2,
    question: "A pregnant woman at 32 weeks presents with painless vaginal bleeding. Ultrasound shows placenta previa. Which is the most appropriate next step?",
    options: ["A. Immediate Cesarean section", "B. Expectant management with bed rest", "C. Artificial rupture of membranes", "D. Oxytocin induction"],
    correct: "B",
    explanation: "In placenta previa before 36 weeks with stable bleeding, expectant management with bed rest, hospitalization, and close monitoring is appropriate. Immediate C-section is reserved for uncontrolled haemorrhage or fetal distress.",
    subject: "Obstetrics & Gynaecology",
  },
  {
    id: 3,
    question: "A 7-year-old boy presents with periorbital puffiness, frothy urine, and anasarca. Urine shows 4+ proteinuria. Serum albumin is 1.8 g/dL. The most likely diagnosis is:",
    options: ["A. Nephritic syndrome", "B. Nephrotic syndrome — minimal change disease", "C. Acute glomerulonephritis", "D. Renal tubular acidosis"],
    correct: "B",
    explanation: "The classic triad of nephrotic syndrome: massive proteinuria (>3.5g/day), hypoalbuminaemia, and oedema. In a child, minimal change disease is the most common cause and responds well to steroids.",
    subject: "Paediatrics",
  },
  {
    id: 4,
    question: "Which enzyme is deficient in Phenylketonuria (PKU)?",
    options: ["A. Tyrosinase", "B. Homogentisate oxidase", "C. Phenylalanine hydroxylase", "D. Fumarylacetoacetase"],
    correct: "C",
    explanation: "PKU is caused by deficiency of phenylalanine hydroxylase, which converts phenylalanine to tyrosine. Accumulation of phenylalanine leads to intellectual disability, seizures, and musty body odour.",
    subject: "Biochemistry",
  },
  {
    id: 5,
    question: "A 55-year-old smoker presents with haemoptysis and weight loss. CXR shows a hilar mass. Histology reveals large cells with abundant cytoplasm and prominent nucleoli without keratin or gland formation. Diagnosis:",
    options: ["A. Squamous cell carcinoma", "B. Small cell lung cancer", "C. Adenocarcinoma", "D. Large cell carcinoma"],
    correct: "D",
    explanation: "Large cell carcinoma is characterised by large cells without squamous (no keratin pearls) or glandular differentiation, poorly differentiated, and carries a poor prognosis.",
    subject: "Pathology",
  },
  {
    id: 6,
    question: "Warfarin acts by inhibiting which enzyme?",
    options: ["A. Thrombin", "B. Vitamin K epoxide reductase", "C. Cyclooxygenase", "D. Factor Xa"],
    correct: "B",
    explanation: "Warfarin inhibits Vitamin K epoxide reductase, blocking regeneration of reduced Vitamin K. This prevents gamma-carboxylation of factors II, VII, IX, X, protein C and S.",
    subject: "Pharmacology",
  },
  {
    id: 7,
    question: "A patient with type 2 DM has eGFR of 28 mL/min/1.73m². Which antidiabetic should be avoided?",
    options: ["A. Insulin glargine", "B. Sitagliptin", "C. Metformin", "D. Repaglinide"],
    correct: "C",
    explanation: "Metformin is contraindicated when eGFR <30 mL/min/1.73m² due to risk of lactic acidosis from reduced renal clearance. Insulin and dose-adjusted DPP-4 inhibitors can be used safely.",
    subject: "Medicine",
  },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

router.get("/monetization/daily-mcq", (req, res) => {
  const dayIndex = getDayOfYear() % DAILY_MCQS.length;
  const mcq = DAILY_MCQS[dayIndex];
  res.json({
    id: mcq.id,
    question: mcq.question,
    options: mcq.options,
    subject: mcq.subject,
    date: new Date().toISOString().split("T")[0],
  });
});

router.get("/monetization/daily-mcq/answer", optionalAuth, (req, res) => {
  const dayIndex = getDayOfYear() % DAILY_MCQS.length;
  const mcq = DAILY_MCQS[dayIndex];
  res.json({
    correct: mcq.correct,
    explanation: mcq.explanation,
    subject: mcq.subject,
  });
});

router.post("/monetization/referrals/create", requireAuth, async (req, res) => {
  const user = req.user!;
  try {
    const existing = await db
      .select()
      .from(referralsTable)
      .where(eq(referralsTable.referrerUserId, user.userId.toString()))
      .limit(1);

    if (existing.length > 0) {
      res.json({ code: existing[0].referralCode });
      return;
    }

    const code = `AETHEX-${user.userId}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    await db.insert(referralsTable).values({
      referrerUserId: user.userId.toString(),
      referrerEmail: user.email,
      referralCode: code,
    });
    res.json({ code });
  } catch (err) {
    res.status(500).json({ error: "Failed to create referral code" });
  }
});

router.get("/monetization/referrals/my", requireAuth, async (req, res) => {
  const user = req.user!;
  try {
    const referrals = await db
      .select()
      .from(referralsTable)
      .where(eq(referralsTable.referrerUserId, user.userId.toString()));
    res.json({ referrals });
  } catch {
    res.status(500).json({ error: "Failed to fetch referrals" });
  }
});

router.post("/monetization/referrals/apply", requireAuth, async (req, res) => {
  const { code } = req.body as { code?: string };
  const user = req.user!;
  if (!code) { res.status(400).json({ error: "Code required" }); return; }

  try {
    const referral = await db
      .select()
      .from(referralsTable)
      .where(eq(referralsTable.referralCode, code.toUpperCase()))
      .limit(1);

    if (!referral.length) {
      res.status(404).json({ error: "Invalid referral code" });
      return;
    }
    if (referral[0].referrerEmail === user.email) {
      res.status(400).json({ error: "You cannot use your own referral code" });
      return;
    }
    if (referral[0].rewardGranted) {
      res.status(400).json({ error: "This referral code has already been used" });
      return;
    }

    await db
      .update(referralsTable)
      .set({ referredEmail: user.email, status: "completed", rewardGranted: true, completedAt: new Date() })
      .where(eq(referralsTable.id, referral[0].id));

    res.json({ success: true, message: "Referral applied! The referrer gets 1 month free added to their account." });
  } catch {
    res.status(500).json({ error: "Failed to apply referral" });
  }
});

router.post("/monetization/consults", requireAuth, async (req, res) => {
  const user = req.user!;
  const { query, response, model } = req.body as { query?: string; response?: string; model?: string };
  if (!query || !response) { res.status(400).json({ error: "Query and response required" }); return; }

  try {
    await db.insert(consultHistoryTable).values({
      userId: user.userId.toString(),
      userEmail: user.email,
      query: query.slice(0, 2000),
      response: response.slice(0, 8000),
      model: model ?? "cadus",
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to save consult" });
  }
});

router.get("/monetization/consults", requireAuth, async (req, res) => {
  const user = req.user!;
  try {
    const consults = await db
      .select()
      .from(consultHistoryTable)
      .where(eq(consultHistoryTable.userId, user.userId.toString()))
      .orderBy(consultHistoryTable.createdAt);
    res.json({ consults: consults.reverse() });
  } catch {
    res.status(500).json({ error: "Failed to fetch consults" });
  }
});

router.delete("/monetization/consults/:id", requireAuth, async (req, res) => {
  const user = req.user!;
  const id = parseInt(req.params.id ?? "0");
  try {
    await db
      .delete(consultHistoryTable)
      .where(and(eq(consultHistoryTable.id, id), eq(consultHistoryTable.userId, user.userId.toString())));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete consult" });
  }
});

router.post("/monetization/progress", requireAuth, async (req, res) => {
  const user = req.user!;
  const { subject, attempted, correct } = req.body as { subject?: string; attempted?: number; correct?: number };
  if (!subject || attempted === undefined || correct === undefined) {
    res.status(400).json({ error: "subject, attempted, correct required" }); return;
  }
  try {
    const existing = await db
      .select()
      .from(mcqProgressTable)
      .where(and(eq(mcqProgressTable.userId, user.userId.toString()), eq(mcqProgressTable.subject, subject)))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(mcqProgressTable)
        .set({
          attempted: existing[0].attempted + attempted,
          correct: existing[0].correct + correct,
          updatedAt: new Date(),
        })
        .where(eq(mcqProgressTable.id, existing[0].id));
    } else {
      await db.insert(mcqProgressTable).values({
        userId: user.userId.toString(),
        userEmail: user.email,
        subject,
        attempted,
        correct,
      });
    }
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update progress" });
  }
});

router.get("/monetization/progress", requireAuth, async (req, res) => {
  const user = req.user!;
  try {
    const progress = await db
      .select()
      .from(mcqProgressTable)
      .where(eq(mcqProgressTable.userId, user.userId.toString()));
    res.json({ progress });
  } catch {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

router.post("/monetization/report/create-order", async (req, res) => {
  const { amount, reportType } = req.body as { amount?: number; reportType?: string };
  if (!amount || !reportType) { res.status(400).json({ error: "amount and reportType required" }); return; }
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    res.status(500).json({ error: "Razorpay not configured" }); return;
  }

  try {
    const authHeader = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
    const body = JSON.stringify({ amount: amount * 100, currency: "INR", receipt: `report_${Date.now()}` });

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Basic ${authHeader}` },
      body,
    });
    const data = await response.json() as { id?: string; error?: unknown };
    if (!response.ok || !data.id) {
      res.status(500).json({ error: "Failed to create Razorpay order" }); return;
    }
    res.json({ orderId: data.id, amount, reportType, keyId: RAZORPAY_KEY_ID });
  } catch {
    res.status(500).json({ error: "Payment service error" });
  }
});

router.post("/monetization/report/verify-and-generate", async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, reportType, reportData, userEmail } =
    req.body as {
      razorpayOrderId?: string; razorpayPaymentId?: string; razorpaySignature?: string;
      reportType?: string; reportData?: Record<string, unknown>; userEmail?: string;
    };

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    res.status(400).json({ error: "Payment verification data required" }); return;
  }

  if (RAZORPAY_KEY_SECRET) {
    const expectedSig = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    if (expectedSig !== razorpaySignature) {
      res.status(400).json({ error: "Payment signature verification failed" }); return;
    }
  }

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { height } = page.getSize();

    page.drawRectangle({ x: 0, y: height - 80, width: 595, height: 80, color: rgb(0.047, 0.38, 0.42) });
    page.drawText("AETHEX Medical Platform", { x: 40, y: height - 35, size: 20, font: boldFont, color: rgb(1, 1, 1) });
    page.drawText(reportType === "drug-interaction" ? "Drug Interaction Report" : "Clinical Summary Report", {
      x: 40, y: height - 60, size: 12, font: regularFont, color: rgb(0.8, 0.95, 0.95),
    });

    page.drawText(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, {
      x: 40, y: height - 105, size: 10, font: regularFont, color: rgb(0.4, 0.4, 0.4),
    });
    if (userEmail) {
      page.drawText(`Prepared for: ${userEmail}`, { x: 40, y: height - 120, size: 10, font: regularFont, color: rgb(0.4, 0.4, 0.4) });
    }

    page.drawLine({ start: { x: 40, y: height - 135 }, end: { x: 555, y: height - 135 }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });

    let yPos = height - 160;
    const lineHeight = 16;

    const wrapText = (text: string, maxWidth: number, fontSize: number, font: typeof regularFont): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    if (reportType === "drug-interaction" && reportData) {
      const { drugs, interactions } = reportData as {
        drugs?: string[];
        interactions?: Array<{ drug1: string; drug2: string; severity: string; description: string; mechanism: string; management: string }>;
      };

      page.drawText("Medications Analysed", { x: 40, y: yPos, size: 14, font: boldFont, color: rgb(0.047, 0.38, 0.42) });
      yPos -= 20;
      if (drugs?.length) {
        page.drawText(drugs.join(" · "), { x: 40, y: yPos, size: 11, font: regularFont, color: rgb(0.2, 0.2, 0.2) });
        yPos -= 30;
      }

      page.drawText("Identified Interactions", { x: 40, y: yPos, size: 14, font: boldFont, color: rgb(0.047, 0.38, 0.42) });
      yPos -= 20;

      if (!interactions?.length) {
        page.drawText("No clinically significant interactions detected.", { x: 40, y: yPos, size: 11, font: regularFont, color: rgb(0.1, 0.55, 0.36) });
      } else {
        for (const ix of interactions) {
          if (yPos < 80) break;
          const sevColor = ix.severity === "major" ? rgb(0.87, 0.13, 0.13) : ix.severity === "moderate" ? rgb(0.9, 0.6, 0) : rgb(0.1, 0.55, 0.36);
          page.drawText(`${ix.drug1.toUpperCase()} + ${ix.drug2.toUpperCase()}  [${ix.severity.toUpperCase()}]`, {
            x: 40, y: yPos, size: 11, font: boldFont, color: sevColor,
          });
          yPos -= lineHeight;
          const desc = wrapText(`Description: ${ix.description}`, 510, 10, regularFont);
          for (const l of desc) { page.drawText(l, { x: 40, y: yPos, size: 10, font: regularFont, color: rgb(0.3, 0.3, 0.3) }); yPos -= 13; }
          const mech = wrapText(`Mechanism: ${ix.mechanism}`, 510, 10, regularFont);
          for (const l of mech) { page.drawText(l, { x: 40, y: yPos, size: 10, font: regularFont, color: rgb(0.3, 0.3, 0.3) }); yPos -= 13; }
          const mgmt = wrapText(`Management: ${ix.management}`, 510, 10, regularFont);
          for (const l of mgmt) { page.drawText(l, { x: 40, y: yPos, size: 10, font: regularFont, color: rgb(0.2, 0.4, 0.2) }); yPos -= 13; }
          yPos -= 10;
        }
      }
    } else if (reportData?.summary) {
      page.drawText("Clinical Summary", { x: 40, y: yPos, size: 14, font: boldFont, color: rgb(0.047, 0.38, 0.42) });
      yPos -= 20;
      const summary = (reportData.summary as string) ?? "";
      const lines = wrapText(summary, 510, 10, regularFont);
      for (const l of lines) {
        if (yPos < 80) break;
        page.drawText(l, { x: 40, y: yPos, size: 10, font: regularFont, color: rgb(0.2, 0.2, 0.2) });
        yPos -= 13;
      }
    }

    page.drawLine({ start: { x: 40, y: 55 }, end: { x: 555, y: 55 }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
    page.drawText("This report is for clinical reference only. Always consult a qualified healthcare professional.", {
      x: 40, y: 40, size: 8, font: regularFont, color: rgb(0.6, 0.6, 0.6),
    });
    page.drawText("© AETHEX Medical Platform · Cadus Magnus Powered", {
      x: 40, y: 28, size: 8, font: regularFont, color: rgb(0.6, 0.6, 0.6),
    });

    const pdfBytes = await pdfDoc.save();

    await db.insert(reportPaymentsTable).values({
      razorpayOrderId,
      razorpayPaymentId,
      amount: 0,
      reportType: reportType ?? "clinical",
      reportData,
      userEmail: userEmail ?? null,
      status: "completed",
    }).catch(() => {});

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${reportType}-report-${Date.now()}.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

export default router;
