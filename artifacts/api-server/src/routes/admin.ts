import { Router } from "express";
import rateLimit from "express-rate-limit";

const router = Router();

const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/admin/auth", adminAuthLimiter, (req, res) => {
  const { password } = req.body as { password?: string };
  if (!password) {
    res.status(400).json({ error: "Password required." });
    return;
  }
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin access is not configured on this server." });
    return;
  }
  if (password === adminPassword) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: "Incorrect admin password." });
  }
});

export default router;
