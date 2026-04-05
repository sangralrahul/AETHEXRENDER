import { Router } from "express";
import { db } from "@workspace/db";
import { authUsersTable, doctorVerificationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

const INDIAN_COUNCILS = [
  "National Medical Commission (NMC)",
  "Andhra Pradesh Medical Council",
  "Assam Medical Council",
  "Bihar Medical Council",
  "Delhi Medical Council",
  "Goa Medical Council",
  "Gujarat Medical Council",
  "Haryana Medical Council",
  "Himachal Pradesh Medical Council",
  "Jammu & Kashmir Medical Council",
  "Jharkhand Medical Council",
  "Karnataka Medical Council",
  "Kerala Medical Council",
  "Madhya Pradesh Medical Council",
  "Maharashtra Medical Council",
  "Manipur Medical Council",
  "Meghalaya Medical Council",
  "Mizoram Medical Council",
  "Nagaland Medical Council",
  "Odisha Medical Council",
  "Punjab Medical Council",
  "Rajasthan Medical Council",
  "Sikkim Medical Council",
  "Tamil Nadu Medical Council",
  "Telangana State Medical Council",
  "Tripura Medical Council",
  "Uttar Pradesh Medical Council",
  "Uttarakhand Medical Council",
  "West Bengal Medical Council",
];

function requireAdminPassword(req: Parameters<typeof requireAuth>[0], res: Parameters<typeof requireAuth>[1], next: Parameters<typeof requireAuth>[2]): void {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin not configured." });
    return;
  }
  const provided = req.headers["x-admin-password"] as string | undefined;
  if (!provided || provided !== adminPassword) {
    res.status(401).json({ error: "Admin authentication required." });
    return;
  }
  next();
}

router.get("/verify/councils", (_req, res) => {
  res.json({ councils: INDIAN_COUNCILS });
});

router.post("/verify/request", requireAuth, async (req, res) => {
  const email = req.user?.email;
  const name = req.user?.name;

  if (!email) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  const { registrationNumber, councilName, documentData, documentName } = req.body as {
    registrationNumber?: string;
    councilName?: string;
    documentData?: string;
    documentName?: string;
  };

  if (!registrationNumber?.trim()) {
    res.status(400).json({ error: "Medical registration number is required." });
    return;
  }
  if (!councilName?.trim()) {
    res.status(400).json({ error: "Council name is required." });
    return;
  }

  try {
    const existing = await db
      .select()
      .from(doctorVerificationsTable)
      .where(eq(doctorVerificationsTable.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0 && existing[0].status === "pending") {
      res.status(409).json({ error: "A verification request is already pending for this account." });
      return;
    }

    if (existing.length > 0) {
      await db
        .delete(doctorVerificationsTable)
        .where(eq(doctorVerificationsTable.email, email.toLowerCase()));
    }

    await db.insert(doctorVerificationsTable).values({
      email: email.toLowerCase(),
      name: name ?? null,
      registrationNumber: registrationNumber.trim().toUpperCase(),
      councilName: councilName.trim(),
      documentData: documentData ?? null,
      documentName: documentName ?? null,
      status: "pending",
    });

    res.json({ ok: true, message: "Verification request submitted. You will be notified within 2–3 business days." });
  } catch (err) {
    console.error("Verify request error:", err);
    res.status(500).json({ error: "Failed to submit verification request." });
  }
});

router.get("/verify/status", requireAuth, async (req, res) => {
  const email = req.user?.email;
  if (!email) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  try {
    const [verification] = await db
      .select({
        status: doctorVerificationsTable.status,
        registrationNumber: doctorVerificationsTable.registrationNumber,
        councilName: doctorVerificationsTable.councilName,
        rejectionReason: doctorVerificationsTable.rejectionReason,
        createdAt: doctorVerificationsTable.createdAt,
      })
      .from(doctorVerificationsTable)
      .where(eq(doctorVerificationsTable.email, email.toLowerCase()))
      .limit(1);

    const [userRow] = await db
      .select({ verified: authUsersTable.verified })
      .from(authUsersTable)
      .where(eq(authUsersTable.email, email.toLowerCase()))
      .limit(1);

    res.json({
      verified: userRow?.verified ?? false,
      verification: verification ?? null,
    });
  } catch (err) {
    console.error("Verify status error:", err);
    res.status(500).json({ error: "Failed to fetch verification status." });
  }
});

router.get("/admin/verifications", requireAdminPassword, async (_req, res) => {
  try {
    const verifications = await db
      .select()
      .from(doctorVerificationsTable)
      .orderBy(desc(doctorVerificationsTable.createdAt));

    res.json({ verifications });
  } catch (err) {
    console.error("Admin verifications error:", err);
    res.status(500).json({ error: "Failed to fetch verifications." });
  }
});

router.post("/admin/verifications/:id/approve", requireAdminPassword, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid verification ID." });
    return;
  }

  try {
    const [verification] = await db
      .select()
      .from(doctorVerificationsTable)
      .where(eq(doctorVerificationsTable.id, id))
      .limit(1);

    if (!verification) {
      res.status(404).json({ error: "Verification not found." });
      return;
    }

    await db
      .update(doctorVerificationsTable)
      .set({ status: "approved", reviewedAt: new Date() })
      .where(eq(doctorVerificationsTable.id, id));

    await db
      .update(authUsersTable)
      .set({ verified: true })
      .where(eq(authUsersTable.email, verification.email));

    res.json({ ok: true });
  } catch (err) {
    console.error("Approve verification error:", err);
    res.status(500).json({ error: "Failed to approve verification." });
  }
});

router.post("/admin/verifications/:id/reject", requireAdminPassword, async (req, res) => {
  const id = parseInt(req.params.id);
  const { reason } = req.body as { reason?: string };

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid verification ID." });
    return;
  }

  try {
    const [verification] = await db
      .select()
      .from(doctorVerificationsTable)
      .where(eq(doctorVerificationsTable.id, id))
      .limit(1);

    if (!verification) {
      res.status(404).json({ error: "Verification not found." });
      return;
    }

    await db
      .update(doctorVerificationsTable)
      .set({ status: "rejected", rejectionReason: reason ?? null, reviewedAt: new Date() })
      .where(eq(doctorVerificationsTable.id, id));

    await db
      .update(authUsersTable)
      .set({ verified: false })
      .where(eq(authUsersTable.email, verification.email));

    res.json({ ok: true });
  } catch (err) {
    console.error("Reject verification error:", err);
    res.status(500).json({ error: "Failed to reject verification." });
  }
});

export default router;
