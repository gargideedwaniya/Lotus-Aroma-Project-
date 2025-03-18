import { pgTable, text, serial, integer, boolean, timestamp, json, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  price: integer("price").notNull(), // Stored in paisa (1/100 of Rupee)
  imageUrls: json("image_urls").$type<string[]>().notNull(),
  sizes: json("sizes").$type<string[]>().notNull(),
  category: text("category").notNull(),
  isNewArrival: boolean("is_new_arrival").default(false),
  isBestSeller: boolean("is_bestseller").default(false),
  averageRating: doublePrecision("average_rating").default(0),
  inStock: boolean("in_stock").default(true),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  username: text("username").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
