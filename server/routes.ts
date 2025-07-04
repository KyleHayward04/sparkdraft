import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateContent } from "./services/openai";
import { insertUserSchema, insertProjectSchema, updateProjectSchema } from "@shared/schema";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Simple auth middleware for demo purposes
  const mockAuth = (req: any, res: any, next: any) => {
    // For demo, we'll use a mock user
    req.user = { id: 1, username: "Demo User", email: "demo@sparkdraft.com" };
    req.isAuthenticated = () => true;
    next();
  };
  
  app.use(mockAuth);
  
  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        sparksUsed: user.sparksUsed,
        sparksLimit: user.sparksLimit
      }});
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const userId = parseInt(req.headers["user-id"] as string);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const projects = await storage.getProjectsByUserId(userId);
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProjectById(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const userId = parseInt(req.headers["user-id"] as string);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check quota
      if (user.sparksUsed >= user.sparksLimit) {
        return res.status(403).json({ message: "Quota exceeded" });
      }
      
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({ ...projectData, userId });
      
      // Generate content
      const content = await generateContent(
        projectData.topic,
        projectData.format,
        projectData.voiceProfile
      );
      
      // Update project with generated content
      const updatedProject = await storage.updateProjectContent(project.id, content);
      
      // Increment user's sparks used
      await storage.incrementSparksUsed(userId);
      
      res.json(updatedProject);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const updates = updateProjectSchema.parse(req.body);
      
      const project = await storage.updateProject(projectId, updates);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const success = await storage.deleteProject(projectId);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/favorites", async (req, res) => {
    try {
      const userId = parseInt(req.headers["user-id"] as string);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const favorites = await storage.getFavoriteProjects(userId);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/user/quota", async (req, res) => {
    try {
      const userId = parseInt(req.headers["user-id"] as string);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        sparksUsed: user.sparksUsed,
        sparksLimit: user.sparksLimit,
        subscriptionTier: user.subscriptionTier
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe subscription routes
  app.post('/api/create-subscription', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user.id;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { priceId } = req.body;

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        res.json({
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
        });
        return;
      }

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(userId, customerId);
      }

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(userId, customerId, subscription.id);

      // Update user subscription tier based on price
      let tier = "free";
      let limit = 10;
      
      if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
        tier = "pro";
        limit = 50;
      } else if (priceId === process.env.STRIPE_CREATOR_PRICE_ID) {
        tier = "creator";
        limit = 200;
      } else if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) {
        tier = "agency";
        limit = 999999;
      }

      await storage.updateUserSubscription(userId, tier, limit);

      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
