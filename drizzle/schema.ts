import { pgTable, text, timestamp, integer, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    role: text("role").notNull().default("user"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_unique").on(t.email),
  }),
);

export const brands = pgTable("brands", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  language: text("language").notNull().default("de"),
  tonality: text("tonality").notNull(),
  dos: text("dos").notNull().default(""),
  donts: text("donts").notNull().default(""),
  usp: text("usp").notNull().default(""),
  ctaDefault: text("cta_default").notNull().default(""),
  examples: text("examples").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const drafts = pgTable("drafts", {
  id: text("id").primaryKey(),
  brandId: text("brand_id").notNull(),
  platform: text("platform").notNull().default("tiktok"),
  brief: text("brief").notNull(),
  style: text("style").notNull(),
  lengthSec: integer("length_sec").notNull(),
  goal: text("goal").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const generations = pgTable("generations", {
  id: text("id").primaryKey(),
  draftId: text("draft_id").notNull(),
  promptName: text("prompt_name").notNull(),
  promptVersion: text("prompt_version").notNull(),
  inputHash: text("input_hash").notNull(),
  outputJson: text("output_json").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const draftVersions = pgTable("draft_versions", {
  id: text("id").primaryKey(),
  draftId: text("draft_id").notNull(),
  version: integer("version").notNull(),
  contentJson: text("content_json").notNull(),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
