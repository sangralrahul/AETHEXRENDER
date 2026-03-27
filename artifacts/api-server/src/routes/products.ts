import { Router, type IRouter } from "express";
import { db, productsTable, categoriesTable } from "@workspace/db";
import { ilike, eq, and, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/products", async (req, res) => {
  try {
    const { category, search, page = "1", limit = "20" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];

    if (category) {
      conditions.push(eq(productsTable.categorySlug, category));
    }

    if (search) {
      conditions.push(
        ilike(productsTable.name, `%${search}%`)
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [products, countResult] = await Promise.all([
      db
        .select()
        .from(productsTable)
        .where(whereClause)
        .limit(limitNum)
        .offset(offset)
        .orderBy(productsTable.featured, productsTable.id),
      db
        .select({ count: sql<number>`count(*)` })
        .from(productsTable)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: parseFloat(String(p.price)),
      originalPrice: p.originalPrice ? parseFloat(String(p.originalPrice)) : undefined,
      category: p.category,
      categorySlug: p.categorySlug,
      brand: p.brand,
      imageUrl: p.imageUrl,
      rating: parseFloat(String(p.rating)),
      reviewCount: p.reviewCount,
      inStock: p.inStock,
      tags: Array.isArray(p.tags) ? p.tags : [],
      featured: p.featured,
    }));

    res.json({
      products: mapped,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    req.log.error({ err }, "Error listing products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid product ID" });
      return;
    }

    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(String(product.price)),
      originalPrice: product.originalPrice ? parseFloat(String(product.originalPrice)) : undefined,
      category: product.category,
      categorySlug: product.categorySlug,
      brand: product.brand,
      imageUrl: product.imageUrl,
      rating: parseFloat(String(product.rating)),
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      tags: Array.isArray(product.tags) ? product.tags : [],
      featured: product.featured,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.id);
    res.json(categories);
  } catch (err) {
    req.log.error({ err }, "Error listing categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
