import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { pgTable, serial, integer, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { eq, and, desc, ilike, or, sql } from "drizzle-orm";

const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image").notNull().default(""),
  category: text("category").notNull().default("Clinical Tips"),
  tags: jsonb("tags").notNull().default([]),
  authorName: text("author_name").notNull().default("Aethex Editorial"),
  authorRole: text("author_role").notNull().default("Medical Writer"),
  authorAvatar: text("author_avatar").notNull().default(""),
  published: boolean("published").notNull().default(false),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  views: integer("views").notNull().default(0),
  shares: integer("shares").notNull().default(0),
  seoTitle: text("seo_title").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  readTime: integer("read_time").notNull().default(5),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  sessionId: text("session_id").notNull(),
  authorName: text("author_name").notNull(),
  body: text("body").notNull(),
  approved: boolean("approved").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull().default(""),
  active: boolean("active").notNull().default(true),
  source: text("source").notNull().default("blog"),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true }).notNull().defaultNow(),
});

// In-memory news cache
let newsCache: { data: any[]; fetchedAt: number } = { data: [], fetchedAt: 0 };
const NEWS_TTL = 6 * 60 * 60 * 1000; // 6 hours

const MOCK_NEWS = [
  { id: "1", title: "ICMR Launches AI-Powered Disease Surveillance System for India", description: "The Indian Council of Medical Research has unveiled a new AI-powered surveillance platform to track and predict disease outbreaks across the country in real time.", source: { name: "The Hindu" }, publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), url: "#", urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80", category: "India Medical News" },
  { id: "2", title: "NBE Announces NEET-PG 2025 Exam Dates — Key Changes to Note", description: "The National Board of Examinations has released the official schedule for NEET-PG 2025 along with significant changes to the exam pattern including clinical case-based questions.", source: { name: "Medical Dialogues" }, publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), url: "#", urlToImage: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=400&q=80", category: "NEET-PG Updates" },
  { id: "3", title: "WHO Declares New Global Health Priority: Antimicrobial Resistance", description: "The World Health Organisation has elevated antimicrobial resistance (AMR) to a global health emergency, calling for immediate action from all member states including India.", source: { name: "WHO" }, publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), url: "#", urlToImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80", category: "Global Health" },
  { id: "4", title: "CDSCO Approves First Made-in-India mRNA Vaccine for Clinical Trials", description: "India's Central Drugs Standard Control Organisation has given the green light for clinical trials of a domestically developed mRNA vaccine, a milestone for Indian pharma.", source: { name: "Pharmabiz" }, publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), url: "#", urlToImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80", category: "Drug Approvals" },
  { id: "5", title: "New Study Links Ultra-Processed Foods to 32% Higher Cardiovascular Risk in India", description: "A landmark study published in the Indian Journal of Medical Research found that daily consumption of ultra-processed foods was associated with a 32% higher risk of cardiovascular events.", source: { name: "IJMR" }, publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), url: "#", urlToImage: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80", category: "Medical Research" },
  { id: "6", title: "Lancet Study: India's Diabetes Burden Reaches 101 Million — Action Needed Now", description: "A comprehensive Lancet study confirms India now has the world's highest absolute number of diabetes cases, calling for urgent policy intervention and primary care strengthening.", source: { name: "The Lancet" }, publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), url: "#", urlToImage: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&q=80", category: "Medical Research" },
  { id: "7", title: "PM-JAY Expands Coverage to 120 Million Additional Beneficiaries", description: "The Pradhan Mantri Jan Arogya Yojana scheme has been expanded to cover an additional 12 crore beneficiaries, extending free hospitalisation coverage to a wider segment of the population.", source: { name: "PIB India" }, publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), url: "#", urlToImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80", category: "India Medical News" },
  { id: "8", title: "IIT Bombay Researchers Develop Low-Cost Portable ECG Device for Rural India", description: "Researchers at IIT Bombay have created a ₹500 portable ECG monitor that can transmit data to cardiologists via mobile networks, potentially saving thousands of lives in rural areas.", source: { name: "Times of India" }, publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), url: "#", urlToImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80", category: "India Medical News" },
];

const router: IRouter = Router();

// ── BLOG POSTS ────────────────────────────────────────
router.get("/blog/posts", async (req: Request, res: Response) => {
  try {
    const { category, page = "1", limit = "10", search } = req.query;
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(20, parseInt(String(limit)));
    const offset = (pageNum - 1) * limitNum;

    let whereClause: any = eq(blogPosts.published, true);
    if (category && category !== "All") {
      whereClause = and(whereClause, eq(blogPosts.category, String(category)));
    }
    if (search) {
      whereClause = and(whereClause, or(
        ilike(blogPosts.title, `%${search}%`),
        ilike(blogPosts.excerpt, `%${search}%`)
      ));
    }

    const posts = await db.select({
      id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug,
      excerpt: blogPosts.excerpt, featuredImage: blogPosts.featuredImage,
      category: blogPosts.category, tags: blogPosts.tags,
      authorName: blogPosts.authorName, authorRole: blogPosts.authorRole,
      views: blogPosts.views, readTime: blogPosts.readTime, createdAt: blogPosts.createdAt,
    }).from(blogPosts).where(whereClause).orderBy(desc(blogPosts.views)).limit(limitNum).offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(blogPosts).where(whereClause);
    const popular = await db.select({
      id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug,
      featuredImage: blogPosts.featuredImage, views: blogPosts.views, readTime: blogPosts.readTime,
    }).from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.views)).limit(5);

    res.json({ posts, total: count, page: pageNum, pages: Math.ceil(count / limitNum), popular });
  } catch (err: any) {
    req.log.error({ err }); res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog/posts/:slug", async (req: Request, res: Response) => {
  try {
    const [post] = await db.select().from(blogPosts).where(and(eq(blogPosts.slug, req.params.slug), eq(blogPosts.published, true)));
    if (!post) { res.status(404).json({ error: "Post not found" }); return; }

    // Increment views
    await db.update(blogPosts).set({ views: post.views + 1, updatedAt: new Date() }).where(eq(blogPosts.id, post.id));

    // Related posts (same category, exclude current)
    const related = await db.select({
      id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug,
      excerpt: blogPosts.excerpt, featuredImage: blogPosts.featuredImage,
      category: blogPosts.category, readTime: blogPosts.readTime, createdAt: blogPosts.createdAt,
    }).from(blogPosts).where(and(eq(blogPosts.published, true), eq(blogPosts.category, post.category), sql`${blogPosts.id} != ${post.id}`)).limit(3);

    // Comments
    const comments = await db.select().from(blogComments)
      .where(and(eq(blogComments.postId, post.id), eq(blogComments.approved, true)))
      .orderBy(desc(blogComments.createdAt));

    res.json({ post: { ...post, views: post.views + 1 }, related, comments });
  } catch (err: any) {
    req.log.error({ err }); res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blog/posts/:slug/comments", async (req: Request, res: Response) => {
  try {
    const { authorName: rawName, body: rawBody, sessionId } = req.body;
    if (!rawName || !rawBody || !sessionId) { res.status(400).json({ error: "Name, comment and session required" }); return; }

    const authorName = String(rawName).trim().slice(0, 100);
    const body = String(rawBody).trim().slice(0, 2000);

    if (!authorName) { res.status(400).json({ error: "Author name cannot be empty" }); return; }
    if (body.length < 3) { res.status(400).json({ error: "Comment is too short" }); return; }
    if (typeof sessionId !== "string" || sessionId.length > 200) { res.status(400).json({ error: "Invalid session" }); return; }

    const [post] = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, req.params.slug));
    if (!post) { res.status(404).json({ error: "Post not found" }); return; }

    const [comment] = await db.insert(blogComments).values({ postId: post.id, sessionId, authorName, body }).returning();
    res.status(201).json({ comment });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// ── NEWS ────────────────────────────────────────
router.get("/news", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const apiKey = process.env.NEWS_API_KEY;
    const now = Date.now();

    if (apiKey && (now - newsCache.fetchedAt > NEWS_TTL || newsCache.data.length === 0)) {
      try {
        const q = encodeURIComponent("medical health doctor hospital India");
        const resp = await fetch(
          `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`,
          { headers: { "User-Agent": "AETHEX-Medical-Platform/1.0" } }
        );
        const json = await resp.json() as any;
        if (json.status === "error") {
          req.log.warn({ code: json.code, message: json.message }, "NewsAPI error");
        }
        if (json.articles && json.articles.length > 0) {
          newsCache = { data: json.articles, fetchedAt: now };
        }
      } catch (err) {
        req.log.warn({ err }, "NewsAPI fetch failed — using demo news");
      }
    }

    let items = newsCache.data.length > 0 ? newsCache.data : MOCK_NEWS;
    if (category && category !== "All") {
      items = items.filter((n: any) => (n.category ?? "India Medical News") === category);
    }

    res.json({ articles: items.slice(0, 20), source: newsCache.data.length > 0 ? "live" : "demo" });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// ── NEWSLETTER ────────────────────────────────────────
router.post("/newsletter/subscribe", async (req: Request, res: Response) => {
  try {
    const { email, name, source } = req.body;
    if (!email || !email.includes("@")) { res.status(400).json({ error: "Valid email required" }); return; }

    await db.insert(newsletterSubscribers).values({ email, name: name ?? "", source: source ?? "blog" }).onConflictDoUpdate({ target: newsletterSubscribers.email, set: { active: true } });
    res.status(201).json({ success: true, message: "Subscribed successfully! Welcome to Aethex Medical Insights." });
  } catch (err: any) {
    req.log.error({ err }); res.status(500).json({ error: "Internal server error" });
  }
});

// ── ADMIN BLOG ────────────────────────────────────────
router.get("/admin/blog/posts", async (req: Request, res: Response) => {
  try {
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    res.json({ posts });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/admin/blog/posts", async (req: Request, res: Response) => {
  try {
    const { title, slug, excerpt, content, featuredImage, category, tags, authorName, authorRole, published, scheduledAt, seoTitle, seoDescription, readTime } = req.body;
    if (!title || !slug || !content || !excerpt) { res.status(400).json({ error: "Title, slug, excerpt and content required" }); return; }

    const [post] = await db.insert(blogPosts).values({
      title, slug, excerpt, content, featuredImage: featuredImage ?? "",
      category: category ?? "Clinical Tips", tags: tags ?? [], authorName: authorName ?? "Aethex Editorial",
      authorRole: authorRole ?? "Medical Writer", published: published ?? false,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      seoTitle: seoTitle ?? title, seoDescription: seoDescription ?? excerpt,
      readTime: readTime ?? Math.ceil(content.split(" ").length / 200),
    }).returning();
    res.status(201).json({ post });
  } catch (err: any) {
    if (err.code === "23505") { res.status(409).json({ error: "A post with this slug already exists" }); return; }
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/blog/posts/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updates: any = { ...req.body, updatedAt: new Date() };
    delete updates.id;
    if (updates.scheduledAt) updates.scheduledAt = new Date(updates.scheduledAt);

    const [post] = await db.update(blogPosts).set(updates).where(eq(blogPosts.id, id)).returning();
    res.json({ post });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/admin/blog/posts/:id", async (req: Request, res: Response) => {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.get("/admin/newsletter/subscribers", async (req: Request, res: Response) => {
  try {
    const subscribers = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.active, true)).orderBy(desc(newsletterSubscribers.subscribedAt));
    const { format } = req.query;
    if (format === "csv") {
      const csv = ["Email,Name,Source,Date", ...subscribers.map(s => `${s.email},${s.name},${s.source},${s.subscribedAt}`)].join("\n");
      res.setHeader("Content-Type", "text/csv").setHeader("Content-Disposition", 'attachment; filename="subscribers.csv"').send(csv);
    } else {
      res.json({ subscribers, count: subscribers.length });
    }
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// ── SEO: Sitemap + Robots ────────────────────────────────────────
router.get("/sitemap.xml", async (_req: Request, res: Response) => {
  try {
    const posts = await db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt }).from(blogPosts).where(eq(blogPosts.published, true));
    const base = process.env.SITE_URL ?? "https://aethex.in";
    const staticPages = ["/", "/products", "/blog", "/news", "/ai-assistant", "/orders/track"];
    const escapeXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    const safeBase = escapeXml(base);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `  <url><loc>${safeBase}${escapeXml(p)}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join("\n")}
${posts.map(p => `  <url><loc>${safeBase}/blog/${escapeXml(p.slug)}</loc><lastmod>${new Date(p.updatedAt).toISOString().split("T")[0]}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join("\n")}
</urlset>`;
    res.setHeader("Content-Type", "application/xml").send(xml);
  } catch { res.status(500).send("Error generating sitemap"); }
});

router.get("/robots.txt", (_req: Request, res: Response) => {
  const base = process.env.SITE_URL ?? "https://aethex.in";
  res.setHeader("Content-Type", "text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /seller/dashboard\nDisallow: /seller/orders\nDisallow: /seller/products\nSitemap: ${base}/api/sitemap.xml\n`);
});

export default router;
