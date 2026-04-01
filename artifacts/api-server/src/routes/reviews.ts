import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { sql, eq, and, desc, asc } from "drizzle-orm";
import { pgTable, serial, integer, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

// Inline table refs (already created via SQL migration)
const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  sessionId: text("session_id").notNull(),
  orderId: text("order_id"),
  customerName: text("customer_name").notNull(),
  customerRole: text("customer_role").notNull().default("Doctor"),
  starRating: integer("star_rating").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  photos: jsonb("photos").notNull().default([]),
  verifiedPurchase: boolean("verified_purchase").notNull().default(false),
  helpfulCount: integer("helpful_count").notNull().default(0),
  status: text("status").notNull().default("approved"),
  adminReply: text("admin_reply"),
  adminReplyAt: timestamp("admin_reply_at", { withTimezone: true }),
  reported: boolean("reported").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const reviewVotes = pgTable("review_votes", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").notNull(),
  sessionId: text("session_id").notNull(),
  helpful: boolean("helpful").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const platformReviews = pgTable("platform_reviews", {
  id: serial("id").primaryKey(),
  platformName: text("platform_name").notNull(),
  sessionId: text("session_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerRole: text("customer_role").notNull().default("Student"),
  overallRating: integer("overall_rating").notNull(),
  valueForMoney: integer("value_for_money").notNull(),
  contentQuality: integer("content_quality").notNull(),
  facultyRating: integer("faculty_rating").notNull(),
  wouldRecommend: boolean("would_recommend").notNull().default(true),
  examPreparing: text("exam_preparing").notNull().default("NEET PG"),
  title: text("title").notNull(),
  body: text("body").notNull(),
  helpfulCount: integer("helpful_count").notNull().default(0),
  status: text("status").notNull().default("approved"),
  adminReply: text("admin_reply"),
  reported: boolean("reported").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const ordersTable = pgTable("orders", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  items: jsonb("items"),
  status: text("status").notNull(),
});

const bannedWords = pgTable("banned_words", {
  id: serial("id").primaryKey(),
  word: text("word").notNull(),
});

async function containsBannedWords(text: string): Promise<boolean> {
  const words = await db.select().from(bannedWords);
  const lower = text.toLowerCase();
  return words.some(w => lower.includes(w.word.toLowerCase()));
}

async function updateProductRating(productId: number) {
  await db.execute(sql`
    UPDATE products SET
      rating = COALESCE((SELECT ROUND(AVG(star_rating)::numeric, 2) FROM reviews WHERE product_id = ${productId} AND status = 'approved'), rating),
      review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ${productId} AND status = 'approved')
    WHERE id = ${productId}
  `);
}

const router: IRouter = Router();

// GET /api/reviews?productId=&sort=&starFilter=&page=
router.get("/reviews", async (req: Request, res: Response) => {
  try {
    const { productId, sort = "recent", starFilter, page = "1" } = req.query as Record<string, string>;
    if (!productId) { res.status(400).json({ error: "productId required" }); return; }

    const pid = parseInt(productId, 10);
    const pageNum = Math.max(1, parseInt(page, 10));
    const limit = 10;
    const offset = (pageNum - 1) * limit;

    let whereClause = and(eq(reviews.productId, pid), eq(reviews.status, "approved"));
    if (starFilter) {
      whereClause = and(whereClause, eq(reviews.starRating, parseInt(starFilter, 10)));
    }

    const orderClause =
      sort === "helpful" ? desc(reviews.helpfulCount) :
      sort === "highest" ? desc(reviews.starRating) :
      sort === "lowest" ? asc(reviews.starRating) :
      desc(reviews.createdAt);

    const [allReviews, countResult, breakdownResult] = await Promise.all([
      db.select().from(reviews).where(whereClause).orderBy(orderClause).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(reviews).where(and(eq(reviews.productId, pid), eq(reviews.status, "approved"))),
      db.execute(sql`
        SELECT star_rating, COUNT(*) as count FROM reviews
        WHERE product_id = ${pid} AND status = 'approved'
        GROUP BY star_rating
      `),
    ]);

    const total = Number(countResult[0]?.count ?? 0);
    const breakdown: Record<number, number> = {};
    for (const row of (breakdownResult as any).rows ?? []) {
      breakdown[parseInt(row.star_rating)] = parseInt(row.count);
    }
    const avgRating = total > 0
      ? Object.entries(breakdown).reduce((sum, [star, count]) => sum + parseInt(star) * count, 0) / total
      : 0;

    res.json({
      reviews: allReviews,
      total,
      totalPages: Math.ceil(total / limit),
      page: pageNum,
      avgRating: Math.round(avgRating * 10) / 10,
      breakdown,
    });
  } catch (err: any) {
    req.log.error({ err }, "Error listing reviews");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/reviews/my?sessionId=
router.get("/reviews/my", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) { res.status(400).json({ error: "sessionId required" }); return; }

    const myReviews = await db.select().from(reviews)
      .where(eq(reviews.sessionId, String(sessionId)))
      .orderBy(desc(reviews.createdAt));

    res.json({ reviews: myReviews });
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/reviews
router.post("/reviews", async (req: Request, res: Response) => {
  try {
    const { productId, sessionId, customerRole, starRating, photos } = req.body;
    const customerName = typeof req.body.customerName === "string" ? req.body.customerName.trim().slice(0, 100) : "";
    const title = typeof req.body.title === "string" ? req.body.title.trim().slice(0, 200) : "";
    const body = typeof req.body.body === "string" ? req.body.body.trim().slice(0, 5000) : "";

    if (!productId || !sessionId || !customerName || !starRating || !title || !body) {
      res.status(400).json({ error: "Missing required fields" }); return;
    }
    if (typeof sessionId !== "string" || sessionId.length > 200) { res.status(400).json({ error: "Invalid session" }); return; }
    if (body.length < 20) { res.status(400).json({ error: "Review must be at least 20 characters" }); return; }
    if (starRating < 1 || starRating > 5) { res.status(400).json({ error: "Invalid star rating" }); return; }

    // Check for existing review
    const existing = await db.select({ id: reviews.id }).from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.sessionId, sessionId)));
    if (existing.length > 0) { res.status(409).json({ error: "You have already reviewed this product" }); return; }

    // Check verified purchase
    let verifiedPurchase = false;
    let orderId: string | null = null;
    const orders = await db.select().from(ordersTable)
      .where(and(eq(ordersTable.sessionId, sessionId), eq(ordersTable.status, "delivered")));
    for (const order of orders) {
      const items = (order.items as any[]) ?? [];
      if (items.some((item: any) => item.productId === productId)) {
        verifiedPurchase = true;
        orderId = order.id;
        break;
      }
    }

    // Check banned words → pending, else approved
    const hasBanned = await containsBannedWords(body + " " + title);
    const status = hasBanned ? "pending" : "approved";

    const [review] = await db.insert(reviews).values({
      productId,
      sessionId,
      orderId,
      customerName,
      customerRole: customerRole ?? "Doctor",
      starRating,
      title,
      body,
      photos: photos ?? [],
      verifiedPurchase,
      status,
    }).returning();

    if (status === "approved") await updateProductRating(productId);
    res.status(201).json({ review });
  } catch (err: any) {
    if (err.code === "23505") { res.status(409).json({ error: "You have already reviewed this product" }); return; }
    req.log.error({ err }, "Error creating review");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/reviews/:id
router.put("/reviews/:id", async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const { sessionId, starRating, photos, customerRole } = req.body;
    const title = typeof req.body.title === "string" ? req.body.title.trim().slice(0, 200) : undefined;
    const body = typeof req.body.body === "string" ? req.body.body.trim().slice(0, 5000) : undefined;

    if (typeof sessionId !== "string" || sessionId.length > 200) { res.status(400).json({ error: "Invalid session" }); return; }

    const [existing] = await db.select().from(reviews)
      .where(and(eq(reviews.id, reviewId), eq(reviews.sessionId, sessionId)));
    if (!existing) { res.status(404).json({ error: "Review not found" }); return; }

    const daysSince = (Date.now() - new Date(existing.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 7) { res.status(403).json({ error: "Reviews can only be edited within 7 days" }); return; }

    const hasBanned = await containsBannedWords((body ?? existing.body) + " " + (title ?? existing.title));
    const [updated] = await db.update(reviews).set({
      starRating: starRating ?? existing.starRating,
      title: title ?? existing.title,
      body: body ?? existing.body,
      photos: photos ?? existing.photos,
      customerRole: customerRole ?? existing.customerRole,
      status: hasBanned ? "pending" : "approved",
      updatedAt: new Date(),
    }).where(eq(reviews.id, reviewId)).returning();

    await updateProductRating(existing.productId);
    res.json({ review: updated });
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/reviews/:id
router.delete("/reviews/:id", async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const { sessionId } = req.body;

    const [existing] = await db.select().from(reviews)
      .where(and(eq(reviews.id, reviewId), eq(reviews.sessionId, sessionId)));
    if (!existing) { res.status(404).json({ error: "Review not found or unauthorized" }); return; }

    await db.delete(reviews).where(eq(reviews.id, reviewId));
    await updateProductRating(existing.productId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/reviews/:id/helpful
router.post("/reviews/:id/helpful", async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const { sessionId } = req.body;
    if (!sessionId) { res.status(400).json({ error: "sessionId required" }); return; }

    const existing = await db.select().from(reviewVotes)
      .where(and(eq(reviewVotes.reviewId, reviewId), eq(reviewVotes.sessionId, sessionId)));

    if (existing.length > 0) {
      // Toggle off
      await db.delete(reviewVotes).where(and(eq(reviewVotes.reviewId, reviewId), eq(reviewVotes.sessionId, sessionId)));
      await db.execute(sql`UPDATE reviews SET helpful_count = GREATEST(0, helpful_count - 1) WHERE id = ${reviewId}`);
      res.json({ voted: false });
    } else {
      await db.insert(reviewVotes).values({ reviewId, sessionId, helpful: true });
      await db.execute(sql`UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ${reviewId}`);
      res.json({ voted: true });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/reviews/:id/report
router.post("/reviews/:id/report", async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    await db.execute(sql`UPDATE reviews SET reported = true, status = 'pending' WHERE id = ${reviewId}`);
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// PLATFORM REVIEWS
router.get("/platform-reviews", async (req: Request, res: Response) => {
  try {
    const { platform, sort = "recent", page = "1" } = req.query as Record<string, string>;
    if (!platform) { res.status(400).json({ error: "platform required" }); return; }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limit = 10;
    const offset = (pageNum - 1) * limit;

    const orderClause = sort === "helpful" ? desc(platformReviews.helpfulCount) :
      sort === "highest" ? desc(platformReviews.overallRating) : desc(platformReviews.createdAt);

    const [prList, countResult] = await Promise.all([
      db.select().from(platformReviews)
        .where(and(eq(platformReviews.platformName, platform), eq(platformReviews.status, "approved")))
        .orderBy(orderClause).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(platformReviews)
        .where(and(eq(platformReviews.platformName, platform), eq(platformReviews.status, "approved"))),
    ]);

    const total = Number(countResult[0]?.count ?? 0);
    const avgRatings = total > 0 ? prList.reduce((acc, r) => ({
      overall: acc.overall + r.overallRating,
      value: acc.value + r.valueForMoney,
      content: acc.content + r.contentQuality,
      faculty: acc.faculty + r.facultyRating,
    }), { overall: 0, value: 0, content: 0, faculty: 0 }) : { overall: 0, value: 0, content: 0, faculty: 0 };

    const count = prList.length || 1;
    res.json({
      reviews: prList, total, totalPages: Math.ceil(total / limit),
      avgRatings: {
        overall: Math.round((avgRatings.overall / count) * 10) / 10,
        value: Math.round((avgRatings.value / count) * 10) / 10,
        content: Math.round((avgRatings.content / count) * 10) / 10,
        faculty: Math.round((avgRatings.faculty / count) * 10) / 10,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/platform-reviews", async (req: Request, res: Response) => {
  try {
    const { platformName, sessionId, customerRole, overallRating, valueForMoney, contentQuality, facultyRating, wouldRecommend, examPreparing } = req.body;
    const customerName = typeof req.body.customerName === "string" ? req.body.customerName.trim().slice(0, 100) : "";
    const title = typeof req.body.title === "string" ? req.body.title.trim().slice(0, 200) : "";
    const body = typeof req.body.body === "string" ? req.body.body.trim().slice(0, 5000) : "";

    if (!platformName || !sessionId || !customerName || !overallRating || !title || !body) {
      res.status(400).json({ error: "Missing required fields" }); return;
    }
    if (typeof sessionId !== "string" || sessionId.length > 200) { res.status(400).json({ error: "Invalid session" }); return; }
    if (body.length < 20) { res.status(400).json({ error: "Review must be at least 20 characters" }); return; }

    const hasBanned = await containsBannedWords(body + " " + title);
    const [review] = await db.insert(platformReviews).values({
      platformName, sessionId, customerName, customerRole: customerRole ?? "Student",
      overallRating, valueForMoney: valueForMoney ?? 3, contentQuality: contentQuality ?? 3,
      facultyRating: facultyRating ?? 3, wouldRecommend: wouldRecommend ?? true,
      examPreparing: examPreparing ?? "NEET PG", title, body,
      status: hasBanned ? "pending" : "approved",
    }).returning();

    res.status(201).json({ review });
  } catch (err: any) {
    if (err.code === "23505") { res.status(409).json({ error: "You have already reviewed this platform" }); return; }
    res.status(500).json({ error: "Internal server error" });
  }
});

// ADMIN ROUTES
router.get("/admin/reviews", async (req: Request, res: Response) => {
  try {
    const { status = "pending" } = req.query as Record<string, string>;
    const [productReviews, platformRevs] = await Promise.all([
      db.select().from(reviews).where(eq(reviews.status, status)).orderBy(desc(reviews.createdAt)).limit(50),
      db.select().from(platformReviews).where(eq(platformReviews.status, status)).orderBy(desc(platformReviews.createdAt)).limit(50),
    ]);
    res.json({ productReviews, platformReviews: platformRevs });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.put("/admin/reviews/:id/moderate", async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const { status, type = "product" } = req.body;

    const allowed = ["approved", "pending", "rejected"];
    if (!allowed.includes(status)) { res.status(400).json({ error: "Invalid status value" }); return; }

    if (type === "platform") {
      await db.update(platformReviews).set({ status, updatedAt: new Date() }).where(eq(platformReviews.id, reviewId));
    } else {
      await db.update(reviews).set({ status, updatedAt: new Date() }).where(eq(reviews.id, reviewId));
      const [r] = await db.select({ productId: reviews.productId }).from(reviews).where(eq(reviews.id, reviewId));
      if (r) await updateProductRating(r.productId);
    }
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/admin/reviews/:id/reply", async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const { reply, type = "product" } = req.body;

    const adminReply = typeof reply === "string" ? reply.trim().slice(0, 2000) : "";
    if (!adminReply) { res.status(400).json({ error: "Reply text is required" }); return; }

    if (type === "platform") {
      await db.update(platformReviews).set({ adminReply, updatedAt: new Date() }).where(eq(platformReviews.id, reviewId));
    } else {
      await db.update(reviews).set({ adminReply, adminReplyAt: new Date(), updatedAt: new Date() }).where(eq(reviews.id, reviewId));
    }
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
