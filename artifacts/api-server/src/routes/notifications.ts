import { Router, type IRouter, type Request, type Response } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/notifications", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) { res.status(400).json({ error: "sessionId is required" }); return; }

    const notifications = await db.select().from(notificationsTable)
      .where(eq(notificationsTable.sessionId, String(sessionId)))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(30);

    const unreadCount = notifications.filter(n => !n.read).length;
    res.json({ notifications, unreadCount });
  } catch (err: any) {
    req.log.error({ err }, "Error fetching notifications");
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.post("/notifications/mark-read", async (req: Request, res: Response) => {
  try {
    const { sessionId, notificationId } = req.body;
    if (!sessionId) { res.status(400).json({ error: "sessionId is required" }); return; }

    if (notificationId) {
      await db.update(notificationsTable)
        .set({ read: true })
        .where(and(eq(notificationsTable.id, Number(notificationId)), eq(notificationsTable.sessionId, sessionId)));
    } else {
      await db.update(notificationsTable)
        .set({ read: true })
        .where(eq(notificationsTable.sessionId, sessionId));
    }

    res.json({ success: true });
  } catch (err: any) {
    req.log.error({ err }, "Error marking notifications read");
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

router.delete("/notifications/:id", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    await db.delete(notificationsTable)
      .where(and(eq(notificationsTable.id, Number(req.params.id)), eq(notificationsTable.sessionId, sessionId)));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

export default router;
