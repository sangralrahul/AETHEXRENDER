import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { sql, eq, and, desc, asc, sum, count } from "drizzle-orm";
import { pgTable, serial, integer, text, boolean, jsonb, timestamp, numeric } from "drizzle-orm/pg-core";

const sellers = pgTable("sellers", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  ownerName: text("owner_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  gstNumber: text("gst_number").notNull(),
  businessCategory: text("business_category").notNull(),
  address: text("address").notNull(),
  pincode: text("pincode").notNull(),
  bankAccount: text("bank_account").notNull(),
  bankIfsc: text("bank_ifsc").notNull(),
  accountHolder: text("account_holder").notNull(),
  gstCertificate: text("gst_certificate"),
  panCard: text("pan_card"),
  businessProof: text("business_proof"),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  sellerCode: text("seller_code"),
  rating: numeric("rating").notNull().default("5.0"),
  verified: boolean("verified").notNull().default(false),
  vacationMode: boolean("vacation_mode").notNull().default(false),
  deliveryPincodes: text("delivery_pincodes").array().notNull().default([]),
  deliveryDays: integer("delivery_days").notNull().default(5),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const sellerProducts = pgTable("seller_products", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categorySlug: text("category_slug").notNull(),
  category: text("category").notNull(),
  price: numeric("price").notNull(),
  mrp: numeric("mrp").notNull(),
  gstPercent: integer("gst_percent").notNull().default(12),
  stock: integer("stock").notNull().default(0),
  images: jsonb("images").notNull().default([]),
  specs: jsonb("specs").notNull().default({}),
  shippingWeight: numeric("shipping_weight").notNull().default("0.5"),
  status: text("status").notNull().default("pending"),
  views: integer("views").notNull().default(0),
  cartCount: integer("cart_count").notNull().default(0),
  sales: integer("sales").notNull().default(0),
  revenue: numeric("revenue").notNull().default("0"),
  rating: numeric("rating").notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  brand: text("brand").notNull().default(""),
  tags: jsonb("tags").notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  inStock: boolean("in_stock").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const sellerOrders = pgTable("seller_orders", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  orderId: text("order_id").notNull(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: numeric("unit_price").notNull(),
  totalPrice: numeric("total_price").notNull(),
  commissionAmount: numeric("commission_amount").notNull(),
  netAmount: numeric("net_amount").notNull(),
  customerName: text("customer_name").notNull(),
  customerAddress: text("customer_address").notNull(),
  customerPhone: text("customer_phone").notNull(),
  status: text("status").notNull().default("pending"),
  trackingNumber: text("tracking_number"),
  courierName: text("courier_name"),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  shippedAt: timestamp("shipped_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const sellerPayouts = pgTable("seller_payouts", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  amount: numeric("amount").notNull(),
  commissionDeducted: numeric("commission_deducted").notNull(),
  netAmount: numeric("net_amount").notNull(),
  status: text("status").notNull().default("pending"),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  transactionRef: text("transaction_ref"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

function genSellerCode(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SELL-${rand}`;
}

const router: IRouter = Router();

// ── PUBLIC ────────────────────────────────────────
router.post("/seller/register", async (req: Request, res: Response) => {
  try {
    const { businessName, ownerName, email, phone, gstNumber, businessCategory, address, pincode, bankAccount, bankIfsc, accountHolder, gstCertificate, panCard, businessProof } = req.body;

    if (!businessName || !ownerName || !email || !phone || !gstNumber || !businessCategory || !address || !pincode || !bankAccount || !bankIfsc || !accountHolder) {
      res.status(400).json({ error: "All required fields must be filled" }); return;
    }

    const [seller] = await db.insert(sellers).values({
      businessName, ownerName, email, phone, gstNumber, businessCategory, address, pincode, bankAccount, bankIfsc, accountHolder, gstCertificate, panCard, businessProof,
      status: "pending",
    }).returning();

    // Create admin notification
    const notifMessage = `${String(businessName).slice(0, 200)} has submitted a seller application`;
    await db.execute(sql`INSERT INTO notifications (session_id, type, title, message, link, icon_type) VALUES ('admin', 'seller_registration', 'New Seller Application', ${notifMessage}, '/admin/sellers', 'info') ON CONFLICT DO NOTHING`);

    res.status(201).json({ success: true, message: "Your application is under review. We will contact you within 48 hours.", seller: { id: seller.id, businessName: seller.businessName } });
  } catch (err: any) {
    if (err.code === "23505") { res.status(409).json({ error: "Email already registered as a seller" }); return; }
    req.log.error({ err }, "Seller registration error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/seller/login", async (req: Request, res: Response) => {
  try {
    const { sellerCode } = req.body;
    if (!sellerCode) { res.status(400).json({ error: "Seller code required" }); return; }

    const [seller] = await db.select().from(sellers).where(eq(sellers.sellerCode, sellerCode.toUpperCase()));
    if (!seller) { res.status(401).json({ error: "Invalid seller code" }); return; }
    if (seller.status !== "approved") { res.status(403).json({ error: "Your seller account is not yet approved" }); return; }

    res.json({ seller: { id: seller.id, businessName: seller.businessName, ownerName: seller.ownerName, sellerCode: seller.sellerCode, email: seller.email, verified: seller.verified, rating: seller.rating } });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// ── SELLER DASHBOARD ────────────────────────────────────────
router.get("/seller/dashboard", async (req: Request, res: Response) => {
  try {
    const sellerCode = req.headers["x-seller-code"] as string;
    if (!sellerCode) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [seller] = await db.select().from(sellers).where(eq(sellers.sellerCode, sellerCode));
    if (!seller || seller.status !== "approved") { res.status(403).json({ error: "Unauthorized" }); return; }

    const [productStats, orderStats, revenueResult] = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status='live') as live, COUNT(*) FILTER (WHERE status='pending') as pending, COUNT(*) FILTER (WHERE stock < 10 AND status='live') as low_stock FROM seller_products WHERE seller_id = ${seller.id}`),
      db.execute(sql`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status='pending') as pending, COUNT(*) FILTER (WHERE status='accepted') as accepted, COUNT(*) FILTER (WHERE status='shipped') as shipped, COUNT(*) FILTER (WHERE status='delivered') as delivered FROM seller_orders WHERE seller_id = ${seller.id}`),
      db.execute(sql`SELECT COALESCE(SUM(total_price), 0) as total_revenue, COALESCE(SUM(net_amount), 0) as net_revenue, COALESCE(SUM(commission_amount), 0) as commission_paid FROM seller_orders WHERE seller_id = ${seller.id} AND status = 'delivered'`),
    ]);

    const ps = (productStats as any).rows[0];
    const os = (orderStats as any).rows[0];
    const rs = (revenueResult as any).rows[0];

    // Pending payout
    const [pendingPayout] = await db.select().from(sellerPayouts)
      .where(and(eq(sellerPayouts.sellerId, seller.id), eq(sellerPayouts.status, "pending")));

    // Top product
    const topProducts = await db.select().from(sellerProducts)
      .where(and(eq(sellerProducts.sellerId, seller.id), eq(sellerProducts.status, "live")))
      .orderBy(desc(sellerProducts.revenue)).limit(3);

    // Monthly revenue (last 6 months)
    const monthlyRevenue = await db.execute(sql`
      SELECT TO_CHAR(created_at, 'Mon YYYY') as month, COALESCE(SUM(total_price), 0) as revenue, COUNT(*) as orders
      FROM seller_orders WHERE seller_id = ${seller.id} AND status = 'delivered'
      AND created_at > NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `);

    res.json({
      seller: { id: seller.id, businessName: seller.businessName, ownerName: seller.ownerName, sellerCode: seller.sellerCode, rating: seller.rating, verified: seller.verified, vacationMode: seller.vacationMode },
      stats: {
        totalProducts: parseInt(ps.total), liveProducts: parseInt(ps.live), pendingProducts: parseInt(ps.pending), lowStockProducts: parseInt(ps.low_stock),
        totalOrders: parseInt(os.total), pendingOrders: parseInt(os.pending), acceptedOrders: parseInt(os.accepted), shippedOrders: parseInt(os.shipped), deliveredOrders: parseInt(os.delivered),
        totalRevenue: parseFloat(rs.total_revenue), netRevenue: parseFloat(rs.net_revenue), commissionPaid: parseFloat(rs.commission_paid),
        pendingPayout: pendingPayout ? parseFloat(String(pendingPayout.netAmount)) : 0,
      },
      topProducts,
      monthlyRevenue: (monthlyRevenue as any).rows ?? [],
    });
  } catch (err: any) {
    req.log.error({ err }, "Seller dashboard error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── SELLER PRODUCTS ────────────────────────────────────────
router.get("/seller/products", async (req: Request, res: Response) => {
  try {
    const sellerCode = req.headers["x-seller-code"] as string;
    if (!sellerCode) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [seller] = await db.select().from(sellers).where(eq(sellers.sellerCode, sellerCode));
    if (!seller) { res.status(403).json({ error: "Unauthorized" }); return; }

    const products = await db.select().from(sellerProducts).where(eq(sellerProducts.sellerId, seller.id)).orderBy(desc(sellerProducts.createdAt));
    res.json({ products });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/seller/products", async (req: Request, res: Response) => {
  try {
    const sellerCode = req.headers["x-seller-code"] as string;
    if (!sellerCode) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [seller] = await db.select().from(sellers).where(eq(sellers.sellerCode, sellerCode));
    if (!seller) { res.status(403).json({ error: "Unauthorized" }); return; }

    const { name, description, categorySlug, category, price, mrp, gstPercent, stock, images, specs, shippingWeight, brand, tags } = req.body;
    if (!name || !description || !categorySlug || !price || !mrp) { res.status(400).json({ error: "Required fields missing" }); return; }

    const [product] = await db.insert(sellerProducts).values({
      sellerId: seller.id, name, description, categorySlug, category: category || categorySlug, price, mrp,
      gstPercent: gstPercent ?? 12, stock: stock ?? 0, images: images ?? [], specs: specs ?? {},
      shippingWeight: shippingWeight ?? 0.5, brand: brand || seller.businessName, tags: tags ?? [],
      inStock: (stock ?? 0) > 0, status: "pending",
    }).returning();

    res.status(201).json({ product });
  } catch (err: any) {
    req.log.error({ err }, "Add product error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/seller/products/:id", async (req: Request, res: Response) => {
  try {
    const sellerCode = req.headers["x-seller-code"] as string;
    if (!sellerCode) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [seller] = await db.select().from(sellers).where(eq(sellers.sellerCode, sellerCode));
    if (!seller) { res.status(403).json({ error: "Unauthorized" }); return; }

    const productId = parseInt(req.params.id, 10);
    const updates = { ...req.body, updatedAt: new Date() };
    delete updates.sellerId; delete updates.id; delete updates.sales; delete updates.revenue;

    if (updates.stock !== undefined) updates.inStock = updates.stock > 0;

    const [updated] = await db.update(sellerProducts).set(updates)
      .where(and(eq(sellerProducts.id, productId), eq(sellerProducts.sellerId, seller.id))).returning();

    if (!updated) { res.status(404).json({ error: "Product not found" }); return; }
    res.json({ product: updated });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/seller/products/:id", async (req: Request, res: Response) => {
  try {
    const sellerCode = req.headers["x-seller-code"] as string;
    if (!sellerCode) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [seller] = await db.select().from(sellers).where(eq(sellers.sellerCode, sellerCode));
    if (!seller) { res.status(403).json({ error: "Unauthorized" }); return; }

    const productId = parseInt(req.params.id, 10);
    await db.delete(sellerProducts).where(and(eq(sellerProducts.id, productId), eq(sellerProducts.sellerId, seller.id)));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// ── SELLER ORDERS ────────────────────────────────────────
router.get("/seller/orders", async (req: Request, res: Response) => {
  try {
    const sellerCode = req.headers["x-seller-code"] as string;
    if (!sellerCode) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [seller] = await db.select().from(sellers).where(eq(sellers.sellerCode, sellerCode));
    if (!seller) { res.status(403).json({ error: "Unauthorized" }); return; }

    const { status } = req.query;
    let whereClause = eq(sellerOrders.sellerId, seller.id) as any;
    if (status) whereClause = and(whereClause, eq(sellerOrders.status, String(status)));

    const orders = await db.select().from(sellerOrders).where(whereClause).orderBy(desc(sellerOrders.createdAt));
    res.json({ orders });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.put("/seller/orders/:id", async (req: Request, res: Response) => {
  try {
    const sellerCode = req.headers["x-seller-code"] as string;
    if (!sellerCode) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [seller] = await db.select().from(sellers).where(eq(sellers.sellerCode, sellerCode));
    if (!seller) { res.status(403).json({ error: "Unauthorized" }); return; }

    const orderId = parseInt(req.params.id, 10);
    const { action, trackingNumber, courierName } = req.body;

    const updates: any = { updatedAt: new Date() };
    if (action === "accept") { updates.status = "accepted"; updates.acceptedAt = new Date(); }
    else if (action === "reject") { updates.status = "rejected"; }
    else if (action === "ship") {
      updates.status = "shipped"; updates.shippedAt = new Date();
      if (trackingNumber) updates.trackingNumber = trackingNumber;
      if (courierName) updates.courierName = courierName;
    } else if (action === "deliver") { updates.status = "delivered"; updates.deliveredAt = new Date(); }

    const [updated] = await db.update(sellerOrders).set(updates)
      .where(and(eq(sellerOrders.id, orderId), eq(sellerOrders.sellerId, seller.id))).returning();

    res.json({ order: updated });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// ── SELLER PAYOUTS ────────────────────────────────────────
router.get("/seller/payouts", async (req: Request, res: Response) => {
  try {
    const sellerCode = req.headers["x-seller-code"] as string;
    if (!sellerCode) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [seller] = await db.select().from(sellers).where(eq(sellers.sellerCode, sellerCode));
    if (!seller) { res.status(403).json({ error: "Unauthorized" }); return; }

    const payouts = await db.select().from(sellerPayouts).where(eq(sellerPayouts.sellerId, seller.id)).orderBy(desc(sellerPayouts.createdAt));
    res.json({ payouts });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// ── SELLER ANALYTICS ────────────────────────────────────────
router.get("/seller/analytics", async (req: Request, res: Response) => {
  try {
    const sellerCode = req.headers["x-seller-code"] as string;
    if (!sellerCode) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [seller] = await db.select().from(sellers).where(eq(sellers.sellerCode, sellerCode));
    if (!seller) { res.status(403).json({ error: "Unauthorized" }); return; }

    const [topByRevenue, orderBreakdown, dailyRevenue, monthlyRevenue] = await Promise.all([
      db.select().from(sellerProducts).where(and(eq(sellerProducts.sellerId, seller.id), eq(sellerProducts.status, "live"))).orderBy(desc(sellerProducts.revenue)).limit(5),
      db.execute(sql`SELECT status, COUNT(*) as count FROM seller_orders WHERE seller_id = ${seller.id} GROUP BY status`),
      db.execute(sql`SELECT TO_CHAR(created_at, 'DD Mon') as day, COALESCE(SUM(total_price), 0) as revenue, COUNT(*) as orders FROM seller_orders WHERE seller_id = ${seller.id} AND created_at > NOW() - INTERVAL '30 days' GROUP BY TO_CHAR(created_at, 'DD Mon'), DATE_TRUNC('day', created_at) ORDER BY DATE_TRUNC('day', created_at)`),
      db.execute(sql`SELECT TO_CHAR(created_at, 'Mon YYYY') as month, COALESCE(SUM(total_price), 0) as revenue, COUNT(*) as orders FROM seller_orders WHERE seller_id = ${seller.id} GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at) ORDER BY DATE_TRUNC('month', created_at) DESC LIMIT 12`),
    ]);

    res.json({
      topByRevenue,
      orderBreakdown: (orderBreakdown as any).rows ?? [],
      dailyRevenue: (dailyRevenue as any).rows ?? [],
      monthlyRevenue: (monthlyRevenue as any).rows ?? [],
    });
  } catch (err: any) {
    req.log.error({ err }, "Analytics error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── SELLER SETTINGS ────────────────────────────────────────
router.get("/seller/settings", async (req: Request, res: Response) => {
  try {
    const sellerCode = req.headers["x-seller-code"] as string;
    if (!sellerCode) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [seller] = await db.select().from(sellers).where(eq(sellers.sellerCode, sellerCode));
    if (!seller) { res.status(403).json({ error: "Unauthorized" }); return; }
    const { gstCertificate, panCard, businessProof, bankAccount, bankIfsc, ...safe } = seller;
    res.json({ seller: { ...safe, bankAccount: "****" + String(bankAccount ?? "").slice(-4), bankIfsc } });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.put("/seller/settings", async (req: Request, res: Response) => {
  try {
    const sellerCode = req.headers["x-seller-code"] as string;
    if (!sellerCode) { res.status(401).json({ error: "Unauthorized" }); return; }
    const [seller] = await db.select().from(sellers).where(eq(sellers.sellerCode, sellerCode));
    if (!seller) { res.status(403).json({ error: "Unauthorized" }); return; }

    const { businessName, ownerName, phone, address, pincode, bankAccount, bankIfsc, accountHolder, deliveryPincodes, deliveryDays, vacationMode } = req.body;
    const updates: any = { updatedAt: new Date() };
    if (businessName !== undefined) updates.businessName = businessName;
    if (ownerName !== undefined) updates.ownerName = ownerName;
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    if (pincode !== undefined) updates.pincode = pincode;
    if (bankAccount !== undefined) updates.bankAccount = bankAccount;
    if (bankIfsc !== undefined) updates.bankIfsc = bankIfsc;
    if (accountHolder !== undefined) updates.accountHolder = accountHolder;
    if (deliveryPincodes !== undefined) updates.deliveryPincodes = deliveryPincodes;
    if (deliveryDays !== undefined) updates.deliveryDays = deliveryDays;
    if (vacationMode !== undefined) updates.vacationMode = vacationMode;

    const [updated] = await db.update(sellers).set(updates).where(eq(sellers.id, seller.id)).returning();
    res.json({ success: true, seller: updated });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// ── PUBLIC SELLER STOREFRONT ────────────────────────────────────────
router.get("/seller/:code/storefront", async (req: Request, res: Response) => {
  try {
    const [seller] = await db.select().from(sellers).where(and(eq(sellers.sellerCode, req.params.code.toUpperCase()), eq(sellers.status, "approved")));
    if (!seller) { res.status(404).json({ error: "Seller not found" }); return; }

    const products = await db.select().from(sellerProducts)
      .where(and(eq(sellerProducts.sellerId, seller.id), eq(sellerProducts.status, "live")))
      .orderBy(desc(sellerProducts.sales)).limit(20);

    res.json({ seller: { id: seller.id, businessName: seller.businessName, ownerName: seller.ownerName, sellerCode: seller.sellerCode, rating: seller.rating, verified: seller.verified, businessCategory: seller.businessCategory }, products });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

// ── ADMIN SELLER MANAGEMENT ────────────────────────────────────────
router.get("/admin/sellers", async (req: Request, res: Response) => {
  try {
    const { status = "pending" } = req.query;
    const sellerList = await db.select().from(sellers).where(eq(sellers.status, String(status))).orderBy(desc(sellers.createdAt));
    res.json({ sellers: sellerList });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.put("/admin/sellers/:id/moderate", async (req: Request, res: Response) => {
  try {
    const sellerId = parseInt(req.params.id, 10);
    const { action, rejectionReason } = req.body;

    if (action === "approve") {
      const sellerCode = genSellerCode();
      await db.update(sellers).set({ status: "approved", sellerCode, updatedAt: new Date() }).where(eq(sellers.id, sellerId));
      const [s] = await db.select({ email: sellers.email, name: sellers.businessName }).from(sellers).where(eq(sellers.id, sellerId));
      res.json({ success: true, message: `Seller approved. Code: ${sellerCode}`, sellerCode });
    } else if (action === "reject") {
      await db.update(sellers).set({ status: "rejected", rejectionReason: rejectionReason ?? "Does not meet requirements", updatedAt: new Date() }).where(eq(sellers.id, sellerId));
      res.json({ success: true });
    } else if (action === "request_docs") {
      await db.update(sellers).set({ status: "pending", rejectionReason: rejectionReason ?? "Additional documents required", updatedAt: new Date() }).where(eq(sellers.id, sellerId));
      res.json({ success: true });
    } else { res.status(400).json({ error: "Invalid action" }); }
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.get("/admin/seller-products", async (req: Request, res: Response) => {
  try {
    const { status = "pending" } = req.query;
    const products = await db.select({ product: sellerProducts, sellerName: sellers.businessName, sellerCode: sellers.sellerCode })
      .from(sellerProducts).innerJoin(sellers, eq(sellerProducts.sellerId, sellers.id))
      .where(eq(sellerProducts.status, String(status))).orderBy(desc(sellerProducts.createdAt)).limit(50);
    res.json({ products });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.put("/admin/seller-products/:id/moderate", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const { status } = req.body;
    await db.update(sellerProducts).set({ status, updatedAt: new Date() }).where(eq(sellerProducts.id, productId));
    res.json({ success: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
