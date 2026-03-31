import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { db } from "@workspace/db";
import { otpRequestsTable, phoneOtpRequestsTable, authUsersTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { sendOtpEmail } from "../lib/zoho-mailer.js";
import { sendPhoneOtp } from "../lib/twilio-sms.js";
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

// ── Phone OTP routes ─────────────────────────────────────────────────────────

const phoneOtpSendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.body?.phone ?? ipKeyGenerator(req),
  validate: { xForwardedForHeader: false },
  message: { error: "Too many OTP requests. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

const phoneOtpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.body?.phone ?? ipKeyGenerator(req),
  validate: { xForwardedForHeader: false },
  message: { error: "Too many verification attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

function normalizeIndianPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (digits.length === 13 && digits.startsWith("+91")) return digits;
  return null;
}

router.post("/auth/send-phone-otp", phoneOtpSendLimiter, async (req, res) => {
  const { phone } = req.body as { phone?: string };

  if (!phone) {
    res.status(400).json({ error: "A phone number is required." });
    return;
  }

  const normalizedPhone = normalizeIndianPhone(phone);
  if (!normalizedPhone) {
    res.status(400).json({ error: "Please enter a valid 10-digit Indian mobile number." });
    return;
  }

  try {
    await db.delete(phoneOtpRequestsTable).where(eq(phoneOtpRequestsTable.phone, normalizedPhone));

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.insert(phoneOtpRequestsTable).values({ phone: normalizedPhone, hashedOtp, expiresAt });

    await sendPhoneOtp(normalizedPhone, otp);

    res.json({ success: true, message: "OTP sent to your mobile number." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("send-phone-otp error:", message);
    if (message.includes("credentials not configured") || message.includes("TWILIO")) {
      res.status(503).json({ error: "SMS service unavailable. Please try Email OTP instead." });
    } else {
      res.status(500).json({ error: "Failed to send OTP. Please try again." });
    }
  }
});

router.post("/auth/verify-phone-otp", phoneOtpVerifyLimiter, async (req, res) => {
  const { phone, otp } = req.body as { phone?: string; otp?: string };

  if (!phone || !otp) {
    res.status(400).json({ error: "Phone number and OTP are required." });
    return;
  }
  if (!/^\d{6}$/.test(otp)) {
    res.status(400).json({ error: "OTP must be a 6-digit number." });
    return;
  }

  const normalizedPhone = normalizeIndianPhone(phone);
  if (!normalizedPhone) {
    res.status(400).json({ error: "Invalid phone number format." });
    return;
  }

  try {
    const [record] = await db
      .select()
      .from(phoneOtpRequestsTable)
      .where(
        and(
          eq(phoneOtpRequestsTable.phone, normalizedPhone),
          eq(phoneOtpRequestsTable.used, false),
          gt(phoneOtpRequestsTable.expiresAt, new Date())
        )
      )
      .orderBy(phoneOtpRequestsTable.createdAt)
      .limit(1);

    if (!record) {
      res.status(400).json({ error: "OTP expired or not found. Please request a new one." });
      return;
    }

    if (record.attempts >= 3) {
      await db.delete(phoneOtpRequestsTable).where(eq(phoneOtpRequestsTable.id, record.id));
      res.status(400).json({ error: "Too many failed attempts. Please request a new OTP." });
      return;
    }

    const isValid = await bcrypt.compare(otp, record.hashedOtp);

    if (!isValid) {
      await db.update(phoneOtpRequestsTable).set({ attempts: record.attempts + 1 }).where(eq(phoneOtpRequestsTable.id, record.id));
      const remaining = 3 - (record.attempts + 1);
      res.status(400).json({ error: `Invalid OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` });
      return;
    }

    await db.update(phoneOtpRequestsTable).set({ used: true }).where(eq(phoneOtpRequestsTable.id, record.id));

    let [user] = await db.select().from(authUsersTable).where(eq(authUsersTable.phone, normalizedPhone)).limit(1);

    if (!user) {
      const [newUser] = await db.insert(authUsersTable).values({ phone: normalizedPhone }).returning();
      user = newUser;
    } else {
      await db.update(authUsersTable).set({ lastLoginAt: new Date() }).where(eq(authUsersTable.id, user.id));
    }

    const token = signToken({
      userId: user.id,
      email: user.email ?? normalizedPhone,
      plan: user.plan,
    });

    res.json({
      success: true,
      token,
      user: { id: user.id, phone: user.phone, email: user.email, plan: user.plan },
    });
  } catch (err) {
    console.error("verify-phone-otp error:", err);
    res.status(500).json({ error: "Verification failed. Please try again." });
  }
});

// ── Email /me route ───────────────────────────────────────────────────────────

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
