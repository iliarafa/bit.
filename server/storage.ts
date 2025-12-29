import { type Transaction, transactions } from "@shared/schema";
import { db } from "./db";
import { and, desc, eq } from "drizzle-orm";

export interface CreateTransactionData {
  userId: string;
  type?: string;
  amount: number;
  priceAtPurchase: number;
  date?: Date;
}

export interface IStorage {
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: CreateTransactionData): Promise<Transaction>;
  updateTransaction(id: string, userId: string, data: { type: string; amount: number; priceAtPurchase: number; date: Date }): Promise<Transaction>;
  deleteTransaction(id: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date));
  }

  async createTransaction(transaction: CreateTransactionData): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  async updateTransaction(id: string, userId: string, data: { type: string; amount: number; priceAtPurchase: number; date: Date }): Promise<Transaction> {
    const [updated] = await db.update(transactions)
      .set(data)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();
    return updated;
  }

  async deleteTransaction(id: string, userId: string): Promise<void> {
    await db.delete(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
