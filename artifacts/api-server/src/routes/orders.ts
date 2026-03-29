import { Router, type IRouter, type Request, type Response } from "express";
import { db, ordersTable, notificationsTable } from "@workspace/db";
import { eq, and, or, desc } from "drizzle-orm";
import {
  sendOrderConfirmationEmail, sendPaymentFailedEmail, sendOrderShippedEmail,
  sendOutForDeliveryEmail, sendOrderDeliveredEmail, sendOrderCancelledEmail,
} from "../lib/email";
import {
  sendOrderConfirmedSms, sendOrderShippedSms, sendOutForDeliverySms, sendOrderDeliveredSms,
} from "../lib/sms";

const router: IRouter = Router();

function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AX-${year}-${rand}`;
}

async function createNotification(sessionId: string, type: string, title: string, message: string, link?: string, orderId?: string, iconType = "info") {
  await db.insert(notificationsTable).values({ sessionId, type, title, message, link, orderId, iconType });
}

async function triggerOrderNotifications(order: typeof ordersTable.$inferSelect, newStatus: string) {
  const sessionId = order.sessionId;
  const orderId = order.id;
  const email = order.customerEmail;
  const phone = order.customerPhone;
  const name = order.customerName;

  switch (newStatus) {
    case "placed":
      await sendOrderConfirmationEmail({
        id: orderId, customerName: name, customerEmail: email,
        items: (order.items as any) ?? [],
        total: order.total, subtotal: order.subtotal,
        tax: order.tax, deliveryFee: order.deliveryFee,
        deliveryAddress: order.deliveryAddress as any,
        estimatedDelivery: order.estimatedDelivery,
      });
      if (phone) await sendOrderConfirmedSms(phone, orderId, order.estimatedDelivery);
      await createNotification(sessionId, "order_update", "Order Confirmed!", `Your order #${orderId} has been placed successfully.`, `/orders/track?orderId=${orderId}`, orderId, "check");
      break;

    case "payment_failed":
      await sendPaymentFailedEmail({ id: orderId, customerName: name, customerEmail: email, total: order.total });
      await createNotification(sessionId, "order_update", "Payment Failed", `Payment for order #${orderId} failed. Please retry.`, `/orders/track?orderId=${orderId}`, orderId, "alert");
      break;

    case "shipped":
      if (order.courierName && order.trackingNumber) {
        await sendOrderShippedEmail({
          id: orderId, customerName: name, customerEmail: email,
          courierName: order.courierName, trackingNumber: order.trackingNumber,
          courierUrl: order.courierUrl, estimatedDelivery: order.estimatedDelivery,
        });
        if (phone) await sendOrderShippedSms(phone, orderId, order.courierName, order.trackingNumber);
      }
      await createNotification(sessionId, "order_update", "Order Shipped!", `Order #${orderId} has been shipped. Track your package.`, `/orders/track?orderId=${orderId}`, orderId, "truck");
      break;

    case "out_for_delivery":
      await sendOutForDeliveryEmail({ id: orderId, customerName: name, customerEmail: email });
      if (phone) await sendOutForDeliverySms(phone, orderId);
      await createNotification(sessionId, "order_update", "Out for Delivery!", `Order #${orderId} is out for delivery today!`, `/orders/track?orderId=${orderId}`, orderId, "truck");
      break;

    case "delivered":
      await sendOrderDeliveredEmail({ id: orderId, customerName: name, customerEmail: email });
      if (phone) await sendOrderDeliveredSms(phone, orderId);
      await createNotification(sessionId, "order_update", "Order Delivered! ✅", `Order #${orderId} has been delivered successfully.`, `/orders/track?orderId=${orderId}`, orderId, "check");
      break;

    case "cancelled":
      await sendOrderCancelledEmail({
        id: orderId, customerName: name, customerEmail: email,
        cancellationReason: order.cancellationReason, refundStatus: order.refundStatus,
      });
      await createNotification(sessionId, "order_update", "Order Cancelled", `Order #${orderId} has been cancelled.`, `/orders/track?orderId=${orderId}`, orderId, "x");
      break;
  }
}

router.post("/orders", async (req: Request, res: Response) => {
  try {
    const {
      sessionId, customerName, customerEmail, customerPhone,
      items, subtotal, tax, deliveryFee, total, deliveryAddress,
    } = req.body;

    if (!sessionId || !customerName || !customerEmail || !items?.length || !total || !deliveryAddress) {
      res.status(400).json({ error: "Missing required order fields" });
      return;
    }

    let orderId = generateOrderId();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await db.select({ id: ordersTable.id }).from(ordersTable).where(eq(ordersTable.id, orderId));
      if (!existing.length) break;
      orderId = generateOrderId();
      attempts++;
    }

    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

    const [order] = await db.insert(ordersTable).values({
      id: orderId,
      sessionId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal: String(subtotal),
      tax: String(tax ?? 0),
      deliveryFee: String(deliveryFee ?? 0),
      total: String(total),
      deliveryAddress,
      status: "placed",
      estimatedDelivery,
      statusHistory: [{ status: "placed", timestamp: new Date().toISOString() }],
    }).returning();

    await triggerOrderNotifications(order, "placed");
    res.status(201).json({ order });
  } catch (err: any) {
    req.log.error({ err }, "Error creating order");
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get("/orders/track", async (req: Request, res: Response) => {
  try {
    const { orderId, email } = req.query;
    if (!orderId) { res.status(400).json({ error: "orderId is required" }); return; }

    const conditions = [eq(ordersTable.id, String(orderId))];
    if (email) conditions.push(eq(ordersTable.customerEmail, String(email)));

    const [order] = await db.select().from(ordersTable).where(and(...conditions));
    if (!order) { res.status(404).json({ error: "Order not found. Please check your Order ID and email." }); return; }

    res.json({ order });
  } catch (err: any) {
    req.log.error({ err }, "Error tracking order");
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

router.get("/orders/my", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) { res.status(400).json({ error: "sessionId is required" }); return; }

    const orders = await db.select().from(ordersTable)
      .where(eq(ordersTable.sessionId, String(sessionId)))
      .orderBy(desc(ordersTable.createdAt))
      .limit(20);

    res.json({ orders });
  } catch (err: any) {
    req.log.error({ err }, "Error fetching user orders");
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.put("/orders/:orderId/status", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status, courierName, trackingNumber, courierUrl, cancellationReason, refundStatus } = req.body;

    const [existing] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
    if (!existing) { res.status(404).json({ error: "Order not found" }); return; }

    const statusHistory = [...((existing.statusHistory as any[]) ?? []), { status, timestamp: new Date().toISOString() }];

    const [updated] = await db.update(ordersTable)
      .set({
        status,
        ...(courierName && { courierName }),
        ...(trackingNumber && { trackingNumber }),
        ...(courierUrl && { courierUrl }),
        ...(cancellationReason && { cancellationReason }),
        ...(refundStatus && { refundStatus }),
        statusHistory,
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.id, orderId))
      .returning();

    await triggerOrderNotifications(updated, status);
    res.json({ order: updated });
  } catch (err: any) {
    req.log.error({ err }, "Error updating order status");
    res.status(500).json({ error: "Failed to update order status" });
  }
});

export default router;
