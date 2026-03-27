import { Router, type IRouter } from "express";
import { db, cartItemsTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

async function buildCart(sessionId: string) {
  const items = await db
    .select({
      id: cartItemsTable.id,
      productId: cartItemsTable.productId,
      quantity: cartItemsTable.quantity,
      name: productsTable.name,
      price: productsTable.price,
      imageUrl: productsTable.imageUrl,
    })
    .from(cartItemsTable)
    .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.sessionId, sessionId));

  const cartItems = items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.name ?? "Unknown Product",
    price: parseFloat(String(item.price ?? 0)),
    imageUrl: item.imageUrl ?? "",
    quantity: item.quantity,
  }));

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return { items: cartItems, total, itemCount };
}

router.get("/cart", async (req, res) => {
  try {
    const { sessionId } = req.query as { sessionId: string };
    if (!sessionId) {
      res.status(400).json({ error: "sessionId is required" });
      return;
    }
    const cart = await buildCart(sessionId);
    res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Error fetching cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const { productId, quantity = 1, sessionId } = req.body;

    if (!sessionId || !productId) {
      res.status(400).json({ error: "sessionId and productId are required" });
      return;
    }

    const [existing] = await db
      .select()
      .from(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.sessionId, sessionId),
          eq(cartItemsTable.productId, productId)
        )
      )
      .limit(1);

    if (existing) {
      await db
        .update(cartItemsTable)
        .set({ quantity: existing.quantity + quantity })
        .where(eq(cartItemsTable.id, existing.id));
    } else {
      await db.insert(cartItemsTable).values({ sessionId, productId, quantity });
    }

    const cart = await buildCart(sessionId);
    res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Error adding to cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cart/:itemId", async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    const { sessionId } = req.query as { sessionId: string };

    if (!sessionId) {
      res.status(400).json({ error: "sessionId is required" });
      return;
    }

    await db
      .delete(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.id, itemId),
          eq(cartItemsTable.sessionId, sessionId)
        )
      );

    const cart = await buildCart(sessionId);
    res.json(cart);
  } catch (err) {
    req.log.error({ err }, "Error removing from cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
