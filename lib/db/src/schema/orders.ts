import { pgTable, serial, text, numeric, integer, boolean, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const orderStatusEnum = pgEnum("order_status", [
  "placed",
  "payment_failed",
  "payment_confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

export const ordersTable = pgTable("orders", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  items: jsonb("items").$type<Array<{
    productId: number;
    name: string;
    price: string;
    quantity: number;
    imageUrl: string;
  }>>().notNull().default([]),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 10, scale: 2 }).notNull().default("0"),
  deliveryFee: numeric("delivery_fee", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  deliveryAddress: jsonb("delivery_address").$type<{
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  }>().notNull(),
  status: orderStatusEnum("status").notNull().default("placed"),
  estimatedDelivery: timestamp("estimated_delivery", { withTimezone: true }),
  courierName: text("courier_name"),
  trackingNumber: text("tracking_number"),
  courierUrl: text("courier_url"),
  cancellationReason: text("cancellation_reason"),
  refundStatus: text("refund_status"),
  statusHistory: jsonb("status_history").$type<Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type Order = typeof ordersTable.$inferSelect;
export type InsertOrder = typeof ordersTable.$inferInsert;
export const insertOrderSchema = createInsertSchema(ordersTable).omit({ createdAt: true, updatedAt: true });

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  read: boolean("read").notNull().default(false),
  orderId: text("order_id"),
  iconType: text("icon_type").notNull().default("info"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Notification = typeof notificationsTable.$inferSelect;
export type InsertNotification = typeof notificationsTable.$inferInsert;

export const emailLogsTable = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  toEmail: text("to_email").notNull(),
  type: text("type").notNull(),
  orderId: text("order_id"),
  status: text("status").notNull().default("pending"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type EmailLog = typeof emailLogsTable.$inferSelect;

export const smsLogsTable = pgTable("sms_logs", {
  id: serial("id").primaryKey(),
  toPhone: text("to_phone").notNull(),
  type: text("type").notNull(),
  orderId: text("order_id"),
  status: text("status").notNull().default("pending"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
