import { Product, InsertProduct, Review, InsertReview, User, InsertUser } from "@shared/schema";
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getNewArrivals(): Promise<Product[]>;
  getBestsellers(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Review operations
  getReviewsByProductId(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  private sampleProducts: InsertProduct[] = [
    {
      name: "Moonlit Jasmine",
      description: "An enchanting blend of jasmine, vanilla, and amber notes. This exquisite fragrance evokes the serene beauty of a moonlit garden, perfect for evening occasions.",
      shortDescription: "An enchanting blend of jasmine, vanilla, and amber notes.",
      price: 649900, // ₹6,499
      imageUrls: [
        "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg",
        "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=3"
      ],
      sizes: ["30ml", "50ml", "100ml"],
      category: "Floral",
      isNewArrival: true,
      isBestSeller: false,
      averageRating: 4.5,
      inStock: true
    },
    {
      name: "Royal Oud",
      description: "Rich, woody fragrance with notes of oud, cedarwood, and musk. This luxury perfume creates a sophisticated aura that lingers throughout the day and into the evening.",
      shortDescription: "Rich, woody fragrance with notes of oud, cedarwood, and musk.",
      price: 899900, // ₹8,999
      imageUrls: [
        "https://images.pexels.com/photos/3747250/pexels-photo-3747250.jpeg",
        "https://images.pexels.com/photos/3747250/pexels-photo-3747250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3747250/pexels-photo-3747250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/3747250/pexels-photo-3747250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=3"
      ],
      sizes: ["30ml", "50ml", "100ml"],
      category: "Woody",
      isNewArrival: false,
      isBestSeller: true,
      averageRating: 5.0,
      inStock: true
    },
    {
      name: "Velvet Rose",
      description: "Elegant and romantic with Damascus rose, peony, and sandalwood. This classic floral scent captures the essence of timeless femininity with a modern twist.",
      shortDescription: "Elegant and romantic with Damascus rose, peony, and sandalwood.",
      price: 529900, // ₹5,299
      imageUrls: [
        "https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg",
        "https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=3"
      ],
      sizes: ["30ml", "50ml", "100ml"],
      category: "Floral",
      isNewArrival: false,
      isBestSeller: true,
      averageRating: 4.0,
      inStock: true
    },
    {
      name: "Ocean Breeze",
      description: "Fresh aquatic scent with notes of sea salt, bergamot, and white musk. This refreshing fragrance is perfect for daily wear, evoking the freedom of coastal getaways.",
      shortDescription: "Fresh aquatic scent with notes of sea salt, bergamot, and white musk.",
      price: 479900, // ₹4,799
      imageUrls: [
        "https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg",
        "https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=3"
      ],
      sizes: ["30ml", "50ml", "100ml"],
      category: "Fresh",
      isNewArrival: false,
      isBestSeller: false,
      averageRating: 3.5,
      inStock: true
    },
    {
      name: "Enchanted Garden",
      description: "A floral masterpiece with rose, lily, and peony notes. This luxurious fragrance transports you to a secret garden in full bloom, perfect for special occasions.",
      shortDescription: "A floral masterpiece with rose, lily, and peony notes.",
      price: 789900, // ₹7,899
      imageUrls: [
        "https://images.pexels.com/photos/5527899/pexels-photo-5527899.jpeg",
        "https://images.pexels.com/photos/5527899/pexels-photo-5527899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/5527899/pexels-photo-5527899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/5527899/pexels-photo-5527899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=3"
      ],
      sizes: ["30ml", "50ml", "100ml"],
      category: "Floral",
      isNewArrival: false,
      isBestSeller: true,
      averageRating: 4.5,
      inStock: true
    },
    {
      name: "Amber Oud",
      description: "Rich amber and exotic oud creating a warm, mysterious aura. This deep, sensual fragrance is perfect for evening wear and special occasions that call for something unforgettable.",
      shortDescription: "Rich amber and exotic oud creating a warm, mysterious aura.",
      price: 949900, // ₹9,499
      imageUrls: [
        "https://images.pexels.com/photos/10215680/pexels-photo-10215680.jpeg",
        "https://images.pexels.com/photos/10215680/pexels-photo-10215680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/10215680/pexels-photo-10215680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/10215680/pexels-photo-10215680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=3"
      ],
      sizes: ["30ml", "50ml", "100ml"],
      category: "Woody",
      isNewArrival: false,
      isBestSeller: true,
      averageRating: 5.0,
      inStock: true
    },
    {
      name: "Midnight Orchid",
      description: "Seductive blend of black orchid, vanilla, and dark chocolate. This intoxicating fragrance is perfect for evenings when you want to make a lasting impression.",
      shortDescription: "Seductive blend of black orchid, vanilla, and dark chocolate.",
      price: 699900, // ₹6,999
      imageUrls: [
        "https://images.pexels.com/photos/6712098/pexels-photo-6712098.jpeg",
        "https://images.pexels.com/photos/6712098/pexels-photo-6712098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/6712098/pexels-photo-6712098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/6712098/pexels-photo-6712098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=3"
      ],
      sizes: ["30ml", "50ml", "100ml"],
      category: "Oriental",
      isNewArrival: false,
      isBestSeller: true,
      averageRating: 4.0,
      inStock: true
    },
    {
      name: "Royal Mystic Oud",
      description: "A captivating blend of rare oud, sandalwood, and exotic spices that creates an unforgettable sensory experience. This luxury fragrance is crafted for those who appreciate exclusivity and sophistication.",
      shortDescription: "A captivating blend of rare oud, sandalwood, and exotic spices.",
      price: 1249900, // ₹12,499
      imageUrls: [
        "https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg",
        "https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=3"
      ],
      sizes: ["30ml", "50ml", "100ml"],
      category: "Luxury",
      isNewArrival: true,
      isBestSeller: false,
      averageRating: 4.8,
      inStock: true
    }
  ];
  
  private sampleReviews: InsertReview[] = [
    {
      productId: 1,
      username: "Priya Singh",
      rating: 5,
      comment: "This perfume is absolutely amazing! The jasmine notes are so authentic and the fragrance lasts all day."
    },
    {
      productId: 1,
      username: "Raj Mehta",
      rating: 4,
      comment: "Beautiful scent, very elegant and sophisticated. The only downside is that it doesn't last as long as I hoped."
    },
    {
      productId: 2,
      username: "Aisha Khan",
      rating: 5,
      comment: "Royal Oud is the perfect name for this perfume. It's rich, luxurious and makes me feel like royalty every time I wear it."
    },
    {
      productId: 2,
      username: "Vikram Patel",
      rating: 5,
      comment: "This is my signature scent now. Everyone asks me what I'm wearing. Worth every rupee!"
    },
    {
      productId: 3,
      username: "Neha Sharma",
      rating: 4,
      comment: "The rose scent is beautiful but it's a bit lighter than I expected. Still love it though!"
    }
  ];
  
  constructor() {
    // This constructor is intentionally empty as we'll initialize data when needed
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return users[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
    return users[0];
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values(insertUser).returning();
    return user;
  }
  
  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(schema.products);
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    const products = await db.select().from(schema.products).where(eq(schema.products.id, id)).limit(1);
    return products[0];
  }
  
  async getNewArrivals(): Promise<Product[]> {
    return await db.select().from(schema.products).where(eq(schema.products.isNewArrival, true));
  }
  
  async getBestsellers(): Promise<Product[]> {
    return await db.select().from(schema.products).where(eq(schema.products.isBestSeller, true));
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    query = query.toLowerCase();
    const products = await db.select().from(schema.products);
    
    // Filter products that match the search query in name, description, or category
    return products.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query) || 
      product.category.toLowerCase().includes(query) ||
      product.shortDescription.toLowerCase().includes(query)
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    // Convert the object to match the exact schema format expected by Drizzle
    const productData = {
      name: insertProduct.name,
      description: insertProduct.description,
      shortDescription: insertProduct.shortDescription,
      price: insertProduct.price,
      imageUrls: insertProduct.imageUrls,
      sizes: insertProduct.sizes,
      category: insertProduct.category,
      isNewArrival: insertProduct.isNewArrival || false,
      isBestSeller: insertProduct.isBestSeller || false,
      averageRating: insertProduct.averageRating || 0,
      inStock: insertProduct.inStock !== false
    };
    
    // Use the productData object as an array element
    const [product] = await db.insert(schema.products).values([productData] as any).returning();
    return product;
  }
  
  // Review operations
  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return await db.select().from(schema.reviews).where(eq(schema.reviews.productId, productId));
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const reviewData = {
      productId: insertReview.productId,
      username: insertReview.username,
      rating: insertReview.rating,
      comment: insertReview.comment
    };
    
    const [review] = await db.insert(schema.reviews).values([reviewData] as any).returning();
    
    // Update product average rating
    const productReviews = await this.getReviewsByProductId(insertReview.productId);
    const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / productReviews.length;
    
    await db.update(schema.products)
      .set({ averageRating })
      .where(eq(schema.products.id, insertReview.productId));
    
    return review;
  }
  
  // Initialize the database with sample data if empty
  async initializeIfEmpty(): Promise<void> {
    // Check if products exist
    const products = await db.select().from(schema.products).limit(1);
    
    if (products.length === 0) {
      console.log("Initializing database with sample products and reviews...");
      
      // Add products - one by one to avoid type issues
      for (const product of this.sampleProducts) {
        const productData = {
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price,
          imageUrls: product.imageUrls,
          sizes: product.sizes,
          category: product.category,
          isNewArrival: product.isNewArrival,
          isBestSeller: product.isBestSeller,
          averageRating: product.averageRating,
          inStock: product.inStock
        };
        
        try {
          const [createdProduct] = await db.insert(schema.products).values([productData] as any).returning();
          console.log(`Created product: ${createdProduct.name}`);
          
          // Add reviews for this product
          const productReviews = this.sampleReviews.filter(r => r.productId === products.length + 1);
          for (const review of productReviews) {
            const reviewData = {
              productId: createdProduct.id,
              username: review.username,
              rating: review.rating,
              comment: review.comment
            };
            
            await db.insert(schema.reviews).values([reviewData] as any).returning();
          }
        } catch (err) {
          console.error(`Error creating product: ${product.name}`, err);
        }
      }
      
      console.log("Database initialization complete!");
    }
  }
}

export const storage = new DatabaseStorage();
