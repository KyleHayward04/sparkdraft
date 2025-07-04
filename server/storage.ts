import { users, projects, type User, type InsertUser, type Project, type InsertProject, type UpdateProject } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSubscription(userId: number, tier: string, limit: number): Promise<User>;
  updateUserStripeInfo(userId: number, customerId: string, subscriptionId?: string): Promise<User>;
  incrementSparksUsed(userId: number): Promise<User>;
  resetSparksUsed(userId: number): Promise<User>;
  
  // Project methods
  getProjectsByUserId(userId: number): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject & { userId: number }): Promise<Project>;
  updateProject(id: number, updates: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  getFavoriteProjects(userId: number): Promise<Project[]>;
  updateProjectContent(id: number, content: { outlines?: any; titles?: any; promos?: any }): Promise<Project | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private currentUserId: number;
  private currentProjectId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      subscriptionTier: "free",
      sparksUsed: 0,
      sparksLimit: 10,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserSubscription(userId: number, tier: string, limit: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, subscriptionTier: tier, sparksLimit: limit };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(userId: number, customerId: string, subscriptionId?: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId || user.stripeSubscriptionId
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async incrementSparksUsed(userId: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, sparksUsed: user.sparksUsed + 1 };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async resetSparksUsed(userId: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, sparksUsed: 0 };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId
    ).sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject & { userId: number }): Promise<Project> {
    const id = this.currentProjectId++;
    const newProject: Project = {
      ...project,
      id,
      outlines: null,
      titles: null,
      promos: null,
      isFavorite: false,
      createdAt: new Date(),
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, updates: UpdateProject): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getFavoriteProjects(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId && project.isFavorite
    ).sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async updateProjectContent(id: number, content: { outlines?: any; titles?: any; promos?: any }): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...content };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
}

export const storage = new MemStorage();
