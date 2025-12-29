import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, updateTransactionSchema } from "@shared/schema";
import { isAuthenticated } from "./replit_integrations/auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all transactions for the logged-in user (real portfolio)
  app.get("/api/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getTransactionsByUser(userId, false);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // Get all arcade transactions for the logged-in user
  app.get("/api/arcade/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getTransactionsByUser(userId, true);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching arcade transactions:", error);
      res.status(500).json({ error: "Failed to fetch arcade transactions" });
    }
  });

  // Create a new transaction for the logged-in user
  app.post("/api/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertTransactionSchema.parse({ ...req.body, userId });
      const newTransaction = await storage.createTransaction({
        userId: validatedData.userId,
        type: validatedData.type,
        amount: validatedData.amount,
        priceAtPurchase: validatedData.priceAtPurchase,
        date: validatedData.date ? new Date(validatedData.date) : undefined,
        isArcade: false,
      });
      res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      } else {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Failed to create transaction" });
      }
    }
  });

  // Create a new arcade transaction for the logged-in user
  app.post("/api/arcade/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertTransactionSchema.parse({ ...req.body, userId });
      const newTransaction = await storage.createTransaction({
        userId: validatedData.userId,
        type: validatedData.type,
        amount: validatedData.amount,
        priceAtPurchase: validatedData.priceAtPurchase,
        date: validatedData.date ? new Date(validatedData.date) : undefined,
        isArcade: true,
      });
      res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      } else {
        console.error("Error creating arcade transaction:", error);
        res.status(500).json({ error: "Failed to create arcade transaction" });
      }
    }
  });

  // Update a transaction (only if owned by logged-in user)
  app.put("/api/transactions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateTransactionSchema.parse(req.body);
      const updated = await storage.updateTransaction(req.params.id, userId, {
        type: validatedData.type,
        amount: validatedData.amount,
        priceAtPurchase: validatedData.priceAtPurchase,
        date: new Date(validatedData.date),
      });
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      } else {
        console.error("Error updating transaction:", error);
        res.status(500).json({ error: "Failed to update transaction" });
      }
    }
  });

  // Update an arcade transaction (only if owned by logged-in user)
  app.put("/api/arcade/transactions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = updateTransactionSchema.parse(req.body);
      const updated = await storage.updateTransaction(req.params.id, userId, {
        type: validatedData.type,
        amount: validatedData.amount,
        priceAtPurchase: validatedData.priceAtPurchase,
        date: new Date(validatedData.date),
      });
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      } else {
        console.error("Error updating arcade transaction:", error);
        res.status(500).json({ error: "Failed to update arcade transaction" });
      }
    }
  });

  // Delete a transaction (only if owned by logged-in user)
  app.delete("/api/transactions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteTransaction(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  // Delete an arcade transaction (only if owned by logged-in user)
  app.delete("/api/arcade/transactions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteTransaction(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting arcade transaction:", error);
      res.status(500).json({ error: "Failed to delete arcade transaction" });
    }
  });

  return httpServer;
}
