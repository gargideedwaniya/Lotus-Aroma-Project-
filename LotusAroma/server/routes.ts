import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertReviewSchema, insertUserSchema } from "@shared/schema";
import { hash, compare } from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'lotus-aroma-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Passport local strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (err) {
      done(err);
    }
  });

  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      // Validate user data
      try {
        insertUserSchema.parse(req.body);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ 
            message: 'Invalid user data',
            errors: err.errors 
          });
        }
        throw err;
      }

      // Check if username is already taken
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await hash(req.body.password, 10);
      
      // Create user
      const user = await storage.createUser({
        username: req.body.username,
        password: hashedPassword
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // Log user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error during login' });
        }
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Failed to register user' });
    }
  });

  app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
    // If we get here, authentication was successful
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error during logout' });
      }
      res.json({ message: 'Successfully logged out' });
    });
  });

  app.get('/api/auth/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
  };
  // API routes for products
  app.get("/api/products", async (req, res) => {
    try {
      // Check if search query exists
      const searchQuery = req.query.search as string;
      if (searchQuery && searchQuery.trim() !== '') {
        const searchResults = await storage.searchProducts(searchQuery);
        return res.json(searchResults);
      }
      
      // If no search query, return all products
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/new-arrivals", async (req, res) => {
    try {
      const newArrivals = await storage.getNewArrivals();
      res.json(newArrivals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch new arrivals" });
    }
  });

  app.get("/api/products/bestsellers", async (req, res) => {
    try {
      const bestsellers = await storage.getBestsellers();
      res.json(bestsellers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bestsellers" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // API routes for reviews
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const reviews = await storage.getReviewsByProductId(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Validate review data
      const reviewData = { ...req.body, productId };
      try {
        insertReviewSchema.parse(reviewData);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({ 
            message: "Invalid review data", 
            errors: err.errors 
          });
        }
        throw err;
      }
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
