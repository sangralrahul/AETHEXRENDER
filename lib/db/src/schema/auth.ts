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
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

export const doctorVerificationsTable = pgTable("doctor_verifications", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  registrationNumber: text("registration_number").notNull(),
  councilName: text("council_name").notNull(),
  documentData: text("document_data"),
  documentName: text("document_name"),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
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
