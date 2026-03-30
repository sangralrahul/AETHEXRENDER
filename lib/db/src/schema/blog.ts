import { pgTable, serial, integer, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
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

export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  sessionId: text("session_id").notNull(),
  authorName: text("author_name").notNull(),
  body: text("body").notNull(),
  approved: boolean("approved").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  active: boolean("active").notNull().default(true),
  source: text("source").notNull().default("blog"),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true }).notNull().defaultNow(),
});
