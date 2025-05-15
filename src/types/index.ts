import type { LucideIcon } from 'lucide-react';

export type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
};

export type Rating = {
  userId: string; // For simplicity, could be a session ID or generated ID
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
};

export type Game = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  thumbnailUrl: string;
  dataAiHint: string;
  category: Category;
  instructions: string;
  ratings: Rating[];
  averageRating: number;
  releaseDate: string;
  developer: string;
  publisher: string;
  platforms: string[];
};
