export interface User {
  id: number;
  username: string;
  email: string;
  subscriptionTier: string;
  sparksUsed: number;
  sparksLimit: number;
}

export interface Project {
  id: number;
  userId: number;
  title: string;
  topic: string;
  format: string;
  voiceProfile: string;
  outlines?: Array<{
    title: string;
    wordCount: number;
    sections: string[];
  }>;
  titles?: string[];
  promos?: Array<{
    platform: string;
    content: string;
  }>;
  isFavorite: boolean;
  createdAt: Date;
}

export interface GenerateContentRequest {
  title: string;
  topic: string;
  format: string;
  voiceProfile: string;
}

export type ContentFormat = 'blog' | 'video' | 'newsletter' | 'carousel';
export type VoiceProfile = 'professional' | 'friendly' | 'witty';
