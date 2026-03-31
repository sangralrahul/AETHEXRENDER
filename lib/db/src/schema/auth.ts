import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const otpRequestsTable = pgTable("otp_requests", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  hashedOtp: text("hashed_otp").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  attempts: integer("attempts").notNull().default(0),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const phoneOtpRequestsTable = pgTable("phone_otp_requests", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  hashedOtp: text("hashed_otp").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  attempts: integer("attempts").notNull().default(0),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const authUsersTable = pgTable("auth_users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  phone: text("phone").unique(),
  name: text("name"),
  plan: text("plan").notNull().default("free"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  aiResponse: text("ai_response"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
