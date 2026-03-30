import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { db } from "@workspace/db";
import { otpRequestsTable, authUsersTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { sendOtpEmail } from "../lib/zoho-mailer.js";
import { signToken } from "../lib/jwt.js";

const router: IRouter = Router();

const otpSendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.body?.email ?? ipKeyGenerator(req),
  validate: { xForwardedForHeader: false },
  message: { error: "Too many OTP requests. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.body?.email ?? ipKeyGenerator(req),
  validate: { xForwardedForHeader: false },
  message: { error: "Too many verification attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/auth/send-otp", otpSendLimiter, async (req, res) => {
  const { email } = req.body as { email?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    await db
      .delete(otpRequestsTable)
      .where(eq(otpRequestsTable.email, normalizedEmail));

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.insert(otpRequestsTable).values({
      email: normalizedEmail,
      hashedOtp,
      expiresAt,
    });

    await sendOtpEmail(normalizedEmail, otp);

    res.json({ success: true, message: "OTP sent to your email." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("send-otp error:", message);

    if (message.includes("SMTP") || message.includes("credentials")) {
      res.status(503).json({ error: "Email service unavailable. Please try again later." });
    } else {
      res.status(500).json({ error: "Failed to send OTP. Please try again." });
    }
  }
});

router.post("/auth/verify-otp", otpVerifyLimiter, async (req, res) => {
  const { email, otp } = req.body as { email?: string; otp?: string };

  if (!email || !otp) {
    res.status(400).json({ error: "Email and OTP are required." });
    return;
  }
  if (!/^\d{6}$/.test(otp)) {
    res.status(400).json({ error: "OTP must be a 6-digit number." });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const [record] = await db
      .select()
      .from(otpRequestsTable)
      .where(
        and(
          eq(otpRequestsTable.email, normalizedEmail),
          eq(otpRequestsTable.used, false),
          gt(otpRequestsTable.expiresAt, new Date())
        )
      )
      .orderBy(otpRequestsTable.createdAt)
      .limit(1);

    if (!record) {
      res.status(400).json({ error: "OTP expired or not found. Please request a new one." });
      return;
    }

    if (record.attempts >= 3) {
      await db
        .delete(otpRequestsTable)
        .where(eq(otpRequestsTable.id, record.id));
      res.status(400).json({ error: "Too many failed attempts. Please request a new OTP." });
      return;
    }

    const isValid = await bcrypt.compare(otp, record.hashedOtp);

    if (!isValid) {
      await db
        .update(otpRequestsTable)
        .set({ attempts: record.attempts + 1 })
        .where(eq(otpRequestsTable.id, record.id));
      const remaining = 3 - (record.attempts + 1);
      res.status(400).json({
        error: `Invalid OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
      });
      return;
    }

    await db
      .update(otpRequestsTable)
      .set({ used: true })
      .where(eq(otpRequestsTable.id, record.id));

    let [user] = await db
      .select()
      .from(authUsersTable)
      .where(eq(authUsersTable.email, normalizedEmail))
      .limit(1);

    if (!user) {
      const [newUser] = await db
        .insert(authUsersTable)
        .values({ email: normalizedEmail })
        .returning();
      user = newUser;
    } else {
      await db
        .update(authUsersTable)
        .set({ lastLoginAt: new Date() })
        .where(eq(authUsersTable.id, user.id));
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      plan: user.plan,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    res.status(500).json({ error: "Verification failed. Please try again." });
  }
});

router.get("/auth/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  try {
    const { verifyToken } = await import("../lib/jwt.js");
    const payload = verifyToken(token);
    const [user] = await db
      .select()
      .from(authUsersTable)
      .where(eq(authUsersTable.id, payload.userId))
      .limit(1);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    res.json({ id: user.id, email: user.email, plan: user.plan, createdAt: user.createdAt });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
