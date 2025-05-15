// import type { LucideIcon } from 'lucide-react'; // Not used for now

export type VideoCategory = {
  id: string;
  name: string;
  description?: string;
};

export type VideoRating = {
  userId: string;
  isLike: boolean; // true for like, false for dislike
  createdAt: Date;
};

export type VideoComment = {
  id: string;
  userId: string;
  username: string; // For display
  avatarUrl?: string; // For display
  comment: string;
  createdAt: Date;
  replies?: VideoComment[];
  likes: number;
};

export type Video = {
  id: string;
  title: string;
  description: string; // Short description for cards
  longDescription: string; // Detailed description for video page
  thumbnailUrl: string;
  videoUrl?: string; // URL to the video file or stream manifest
  dataAiHint: string; // For AI-assisted thumbnail generation/search
  categories: VideoCategory[]; // Video can belong to multiple categories
  genres: string[]; // e.g., "Action", "Comedy", "Sci-Fi"
  duration: string; // e.g., "1h 30m" or "45m"
  releaseYear: number;
  maturityRating: string; // e.g., "PG-13", "TV-MA"
  cast: string[];
  director: string;
  // For interaction, to be implemented later
  // ratings?: VideoRating[];
  // comments?: VideoComment[];
  views?: number;
  isFeatured?: boolean; // For hero banner
  tags?: string[];
};
