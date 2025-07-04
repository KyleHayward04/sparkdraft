import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  sparksUsed: integer("sparks_used").notNull().default(0),
  sparksLimit: integer("sparks_limit").notNull().default(10),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  topic: text("topic").notNull(),
  format: text("format").notNull(), // blog, video, newsletter, carousel
  voiceProfile: text("voice_profile").notNull().default("professional"),
  outlines: jsonb("outlines"),
  titles: jsonb("titles"),
  promos: jsonb("promos"),
  isFavorite: boolean("is_favorite").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  topic: true,
  format: true,
  voiceProfile: true,
});

export const updateProjectSchema = createInsertSchema(projects).pick({
  isFavorite: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
