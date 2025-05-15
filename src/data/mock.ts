
import type { Video, VideoCategory, VideoComment } from '@/types';

// Helper for deep copying objects.
const deepCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj)); // Simple deep copy for plain objects
};

// --- Category Management ---
const initialVideoCategories: VideoCategory[] = [
  { id: 'trending', name: 'Trending Now', description: 'What everyone is watching.' },
  { id: 'new-releases', name: 'New Releases', description: 'Freshly added movies and shows.' },
  { id: 'action', name: 'Action Movies', description: 'Adrenaline-pumping blockbusters.' },
  { id: 'comedy', name: 'Comedy Shows', description: 'Laugh-out-loud series.' },
  { id: 'drama', name: 'Critically Acclaimed Dramas', description: 'Compelling stories and characters.' },
  { id: 'sci-fi', name: 'Sci-Fi & Fantasy', description: 'Explore otherworldly adventures.' },
  { id: 'documentaries', name: 'Documentaries', description: 'Real stories, real impact.' },
];

let videoCategoriesStore: VideoCategory[] = deepCopy(initialVideoCategories);

export const getCategories = async (): Promise<VideoCategory[]> => {
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
  return deepCopy(videoCategoriesStore);
};

export const getCategoryById = async (id: string): Promise<VideoCategory | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const category = videoCategoriesStore.find(c => c.id === id);
  return category ? deepCopy(category) : undefined;
};

export const addCategory = async (categoryData: Omit<VideoCategory, 'id'>): Promise<VideoCategory> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newCategory: VideoCategory = {
    ...categoryData,
    id: `cat-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  };
  videoCategoriesStore.push(newCategory);
  console.log("Added category:", newCategory);
  return deepCopy(newCategory);
};

export const updateCategory = async (id: string, updatedData: Partial<Omit<VideoCategory, 'id'>>): Promise<VideoCategory | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const categoryIndex = videoCategoriesStore.findIndex(c => c.id === id);
  if (categoryIndex === -1) {
    return undefined;
  }
  videoCategoriesStore[categoryIndex] = {
    ...videoCategoriesStore[categoryIndex],
    ...updatedData,
  };
  // Also update category details in all videos using this category
  videoStore = videoStore.map(video => ({
    ...video,
    categories: video.categories.map(cat => 
      cat.id === id ? { ...cat, ...videoCategoriesStore[categoryIndex] } : cat
    )
  }));
  console.log("Updated category:", videoCategoriesStore[categoryIndex]);
  return deepCopy(videoCategoriesStore[categoryIndex]);
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const initialLength = videoCategoriesStore.length;
  videoCategoriesStore = videoCategoriesStore.filter(c => c.id !== id);
  const success = videoCategoriesStore.length < initialLength;
  if (success) {
    // Remove this category from all videos
    videoStore = videoStore.map(video => ({
      ...video,
      categories: video.categories.filter(cat => cat.id !== id),
    }));
    console.log("Deleted category with id:", id);
  } else {
    console.log("Failed to delete category with id:", id, "- not found.");
  }
  return success;
};


// --- Video Management ---
const initialMockVideos: Video[] = [
  {
    id: 'cosmos-odyssey',
    title: 'Cosmos Odyssey',
    description: 'A journey to the edge of the universe.',
    longDescription: 'Embark on a breathtaking voyage across galaxies, exploring cosmic wonders and the mysteries of deep space. "Cosmos Odyssey" combines stunning visuals with cutting-edge science to bring the universe to your screen.',
    thumbnailUrl: 'https://placehold.co/600x338.png',
    dataAiHint: 'space galaxy',
    categories: [initialVideoCategories.find(c => c.id === 'trending')!, initialVideoCategories.find(c => c.id === 'sci-fi')!, initialVideoCategories.find(c => c.id === 'documentaries')!],
    genres: ['Sci-Fi', 'Documentary', 'Space'],
    duration: '1h 45m',
    releaseYear: 2023,
    maturityRating: 'PG',
    cast: ['Dr. Aris Thorne (Narrator)'],
    director: 'Elena Petrova',
    isFeatured: true,
  },
  {
    id: 'urban-legends-return',
    title: 'Urban Legends: Return',
    description: 'The terrifying myths are real.',
    longDescription: 'A group of college students discovers that the local urban legends are not just stories. As they delve deeper, they find themselves hunted by a chilling reality they cannot escape.',
    thumbnailUrl: 'https://placehold.co/600x338.png',
    dataAiHint: 'horror dark',
    categories: [initialVideoCategories.find(c => c.id === 'new-releases')!],
    genres: ['Horror', 'Thriller', 'Mystery'],
    duration: '1h 32m',
    releaseYear: 2024,
    maturityRating: 'R',
    cast: ['Jenna Miles', 'Kyle Brookes', 'Samira Khan'],
    director: 'Marcus Cole',
  },
  {
    id: 'chronicles-of-aetheria',
    title: 'Chronicles of Aetheria',
    description: 'A fantasy epic of magic and destiny.',
    longDescription: 'In the mystical land of Aetheria, an ancient prophecy reawakens, forcing a young sorceress and a disgraced knight to unite against a rising shadow that threatens to engulf their world.',
    thumbnailUrl: 'https://placehold.co/600x338.png',
    dataAiHint: 'fantasy magic',
    categories: [initialVideoCategories.find(c => c.id === 'sci-fi')!],
    genres: ['Fantasy', 'Adventure', 'Action'],
    duration: '2h 15m',
    releaseYear: 2023,
    maturityRating: 'PG-13',
    cast: ['Lyra Meadowlight', 'Sir Kaelen Stonehand', 'Lord Malakor'],
    director: 'Isabelle Moreau',
  },
  {
    id: 'city-lights-big-dreams',
    title: 'City Lights, Big Dreams',
    description: 'A heartwarming tale of ambition and friendship in the big city.',
    longDescription: 'Follow the journey of three aspiring artists as they navigate the challenges and triumphs of pursuing their dreams in a bustling metropolis. A story of resilience, creativity, and the bonds that tie us.',
    thumbnailUrl: 'https://placehold.co/600x338.png',
    dataAiHint: 'city people',
    categories: [initialVideoCategories.find(c => c.id === 'drama')!],
    genres: ['Drama', 'Comedy', 'Romance'],
    duration: '1h 50m',
    releaseYear: 2022,
    maturityRating: 'PG',
    cast: ['Mia Chen', 'Leo Maxwell', 'Chloe Dubois'],
    director: 'Rajiv Patel',
  },
  {
    id: 'the-last-code',
    title: 'The Last Code',
    description: 'In a world run by AI, one hacker holds the key.',
    longDescription: 'Decades after a global AI takeover, a reclusive hacker stumbles upon a legendary piece of code rumored to be able to restore human control. Pursued by relentless AI enforcers, she must decide if humanity is worth saving.',
    thumbnailUrl: 'https://placehold.co/600x338.png',
    dataAiHint: 'cyberpunk code',
    categories: [initialVideoCategories.find(c => c.id === 'action')!, initialVideoCategories.find(c => c.id === 'sci-fi')!],
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    duration: '2h 5m',
    releaseYear: 2024,
    maturityRating: 'R',
    cast: ['Nyx "Zero" Romanov', 'Agent Thorne', 'The Architect (voice)'],
    director: 'Kenji Tanaka',
  },
  {
    id: 'laugh-riot-live',
    title: 'Laugh Riot Live',
    description: 'Stand-up comedy special featuring today\'s hottest comedians.',
    longDescription: 'Get ready for an hour of non-stop laughter with "Laugh Riot Live." This comedy special brings together a lineup of hilarious comedians delivering their best material, recorded live in front of a roaring audience.',
    thumbnailUrl: 'https://placehold.co/600x338.png',
    dataAiHint: 'comedy stage',
    categories: [initialVideoCategories.find(c => c.id === 'comedy')!],
    genres: ['Comedy', 'Stand-Up'],
    duration: '1h 2m',
    releaseYear: 2023,
    maturityRating: 'TV-MA',
    cast: ['Ava Rodriguez', 'Kevin "K-Man" Lee', 'Priya Sharma'],
    director: 'Linda Goldstein',
  },
   {
    id: 'culinary-journeys',
    title: 'Culinary Journeys',
    description: 'Explore global cuisines and cultures.',
    longDescription: 'Travel the world from your kitchen with "Culinary Journeys." Each episode dives into the heart of a different culture, showcasing its unique ingredients, traditional recipes, and the stories behind the food.',
    thumbnailUrl: 'https://placehold.co/600x338.png',
    dataAiHint: 'food travel',
    categories: [initialVideoCategories.find(c => c.id === 'documentaries')!],
    genres: ['Documentary', 'Food', 'Travel'],
    duration: '8 episodes x 45m',
    releaseYear: 2023,
    maturityRating: 'G',
    cast: ['Chef Antoine Dubois (Host)'],
    director: 'Maria Gonzalez',
  },
  {
    id: 'deep-sea-mysteries',
    title: 'Deep Sea Mysteries',
    description: 'Uncover the secrets of the ocean\'s abyss.',
    longDescription: 'Venture into the darkest depths of the ocean where bizarre creatures and undiscovered ecosystems thrive. "Deep Sea Mysteries" uses cutting-edge technology to reveal a world few have ever seen.',
    thumbnailUrl: 'https://placehold.co/600x338.png',
    dataAiHint: 'ocean underwater',
    categories: [initialVideoCategories.find(c => c.id === 'documentaries')!, initialVideoCategories.find(c => c.id === 'trending')!],
    genres: ['Documentary', 'Nature', 'Science'],
    duration: '1h 30m',
    releaseYear: 2022,
    maturityRating: 'PG',
    cast: ['Dr. Evelyn Hayes (Narrator)'],
    director: 'James Cameron (Consultant)',
  },
   {
    id: 'silent-witnesses',
    title: 'Silent Witnesses',
    description: 'Solving crimes through forensic science.',
    longDescription: 'A gripping docu-series that follows real forensic investigators as they piece together clues from the most complex crime scenes. Witness the power of science in the pursuit of justice.',
    thumbnailUrl: 'https://placehold.co/600x338.png',
    dataAiHint: 'crime investigation',
    categories: [initialVideoCategories.find(c => c.id === 'documentaries')!, initialVideoCategories.find(c => c.id === 'new-releases')!],
    genres: ['Documentary', 'True Crime', 'Science'],
    duration: '10 episodes x 50m',
    releaseYear: 2024,
    maturityRating: 'TV-14',
    cast: ['Various real investigators'],
    director: 'Alex Johnson',
  },
].filter(video => video.categories.every(cat => cat !== undefined && cat !== null)); // Filter out videos with missing categories from initial setup


let videoStore: Video[] = deepCopy(initialMockVideos);

export const getVideos = async (category?: string): Promise<Video[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  if (category) {
    return deepCopy(videoStore.filter(v => v.categories.some(c => c.id === category)));
  }
  return deepCopy(videoStore);
};

export const getVideosByCategoryId = async (categoryId: string): Promise<Video[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  // Ensure videoCategoriesStore is used if needed here, or make sure categories on videos are complete objects
  const allCategories = await getCategories(); // Fetch current categories
  return deepCopy(videoStore.filter(video => 
    video.categories.some(catOnVideo => catOnVideo.id === categoryId)
  ));
};

export const getVideoById = async (id: string): Promise<Video | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const video = videoStore.find(v => v.id === id);
  return video ? deepCopy(video) : undefined;
};

export const getFeaturedVideo = async (): Promise<Video | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const video = videoStore.find(v => v.isFeatured);
  return video ? deepCopy(video) : undefined;
};

const mapCategoryIdsToObjects = async (categoryIds: string[]): Promise<VideoCategory[]> => {
  const allCategories = await getCategories();
  return categoryIds.map(catId => {
    const foundCategory = allCategories.find(c => c.id === catId);
    if (!foundCategory) throw new Error(`Category with id ${catId} not found`);
    return foundCategory;
  }).filter(cat => cat !== null) as VideoCategory[];
};

export const addVideo = async (videoData: Omit<Video, 'id' | 'categories'> & { categories: string[] }): Promise<Video> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const categoryObjects = await mapCategoryIdsToObjects(videoData.categories);
  const newVideo: Video = {
    ...videoData,
    id: `video-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    categories: categoryObjects,
  };
  videoStore.unshift(newVideo);
  console.log("Added video:", newVideo);
  return deepCopy(newVideo);
};

export const updateVideo = async (id: string, updatedData: Partial<Omit<Video, 'id' | 'categories'> & { categories?: string[] }>): Promise<Video | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const videoIndex = videoStore.findIndex(v => v.id === id);
  if (videoIndex === -1) {
    return undefined;
  }
  
  let categoryObjectsToUpdate: VideoCategory[] | undefined = undefined;
  if (updatedData.categories) {
    categoryObjectsToUpdate = await mapCategoryIdsToObjects(updatedData.categories);
  }

  videoStore[videoIndex] = { 
    ...videoStore[videoIndex], 
    ...updatedData,
    categories: categoryObjectsToUpdate || videoStore[videoIndex].categories,
  };
  console.log("Updated video:", videoStore[videoIndex]);
  return deepCopy(videoStore[videoIndex]);
};


export const deleteVideo = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const initialLength = videoStore.length;
  videoStore = videoStore.filter(v => v.id !== id);
  const success = videoStore.length < initialLength;
  if (success) {
    console.log("Deleted video with id:", id);
  } else {
    console.log("Failed to delete video with id:", id, "- not found.");
  }
  return success;
};


// Mock comments for a video
export const getCommentsForVideo = async (videoId: string): Promise<VideoComment[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  // For now, return static comments for any videoId, or empty if no match
  if (videoId === 'cosmos-odyssey' || videoId === 'urban-legends-return') { // Example
    return [
      { id: 'c1', userId: 'user123', username: 'SpaceFan', avatarUrl: 'https://placehold.co/40x40.png', comment: 'Absolutely stunning visuals! A must-watch.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), likes: 15 },
      { id: 'c2', userId: 'user456', username: 'MovieBuff_99', avatarUrl: 'https://placehold.co/40x40.png', comment: 'Great storytelling. Kept me on the edge of my seat.', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), likes: 8,
        replies: [
           { id: 'c2_r1', userId: 'user789', username: 'ReplyGuy', avatarUrl: 'https://placehold.co/40x40.png', comment: 'Totally agree!', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), likes: 2 }
        ]
      },
       { id: 'c3', userId: 'user789', username: 'CriticalThinker', avatarUrl: 'https://placehold.co/40x40.png', comment: 'Could have explored more on topic X, but overall good.', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), likes: 3 },
    ];
  }
  return [];
};

export const addCommentToVideo = async (videoId: string, commentText: string, userId: string, username: string, avatarUrl?: string): Promise<VideoComment> => {
  await new Promise(resolve => setTimeout(resolve, 500)); 
  const newComment: VideoComment = {
    id: `comment-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    userId,
    username,
    avatarUrl: avatarUrl || `https://placehold.co/40x40.png?text=${username.substring(0,2).toUpperCase()}`,
    comment: commentText,
    createdAt: new Date().toISOString(),
    likes: 0,
  };
  console.log(`New comment for video ${videoId}:`, newComment);
  return newComment;
};

let videoInteractions: Record<string, {likes: number, dislikes: number}> = {};

export const getInteractionCounts = async (videoId: string): Promise<{likes: number, dislikes: number}> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    if (!videoInteractions[videoId]) {
        // Initialize with random counts if not present
        videoInteractions[videoId] = {
            likes: Math.floor(Math.random() * 250) + 5,
            dislikes: Math.floor(Math.random() * 50) + 1
        };
    }
    return deepCopy(videoInteractions[videoId]);
}

export const addLikeToVideo = async (videoId: string, userId: string): Promise<{likes: number, dislikes: number}> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!videoInteractions[videoId]) {
      await getInteractionCounts(videoId); // ensure initialized
    }
    // For mock, just increment. A real system would check if user already liked/disliked.
    videoInteractions[videoId].likes++;
    console.log(`User ${userId} liked video ${videoId}. New counts: ${videoInteractions[videoId].likes} likes, ${videoInteractions[videoId].dislikes} dislikes.`);
    return deepCopy(videoInteractions[videoId]);
};

export const addDislikeToVideo = async (videoId: string, userId: string): Promise<{likes: number, dislikes: number}> => {
    await new Promise(resolve => setTimeout(resolve, 100));
     if (!videoInteractions[videoId]) {
      await getInteractionCounts(videoId); // ensure initialized
    }
    videoInteractions[videoId].dislikes++;
    console.log(`User ${userId} disliked video ${videoId}. New counts: ${videoInteractions[videoId].likes} likes, ${videoInteractions[videoId].dislikes} dislikes.`);
    return deepCopy(videoInteractions[videoId]);
};
