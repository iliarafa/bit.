import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull().default("buy"),
  amount: real("amount").notNull(),
  priceAtPurchase: real("price_at_purchase").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
}).extend({
  date: z.string().optional(),
});

export const updateTransactionSchema = z.object({
  type: z.string(),
  amount: z.number(),
  priceAtPurchase: z.number(),
  date: z.string(),
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
