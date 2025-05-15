
import type { Game, Category, Rating } from '@/types';
import { Gamepad2, MountainSnow, Swords, Puzzle, Brain, SquareTerminal, Trophy, Lightbulb, MoveUpRight } from 'lucide-react';

export const categories: Category[] = [
  { id: 'action', name: 'Action', icon: Gamepad2 },
  { id: 'adventure', name: 'Adventure', icon: MountainSnow },
  { id: 'rpg', name: 'RPG', icon: Swords },
  { id: 'puzzle', name: 'Puzzle', icon: Puzzle },
  { id: 'strategy', name: 'Strategy', icon: Brain },
  { id: 'simulation', name: 'Simulation', icon: SquareTerminal },
  { id: 'sports', name: 'Sports', icon: Trophy },
  { id: 'indie', name: 'Indie', icon: Lightbulb },
  { id: 'platformer', name: 'Platformer', icon: MoveUpRight },
];

const initialGames: Game[] = [
  {
    id: 'cyber-runner-x',
    title: 'Cyber Runner X',
    description: 'Fast-paced futuristic runner with stunning visuals.',
    longDescription: 'Dive into the neon-lit streets of Neo-Kyoto as a Cyber Runner. Dodge obstacles, fight corporate security, and uncover a city-wide conspiracy in this thrilling high-speed adventure. Upgrade your cybernetics and choose your path.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'cyberpunk future',
    category: categories.find(c => c.id === 'action')!,
    instructions: 'Use arrow keys to move, spacebar to jump. Collect power-ups to enhance abilities. Complete missions to progress.',
    ratings: [
      { userId: 'user1', rating: 5, comment: 'Amazing game!', createdAt: new Date('2024-01-01T10:00:00Z') },
      { userId: 'user2', rating: 4, createdAt: new Date('2024-01-02T12:00:00Z') },
    ],
    averageRating: 4.5,
    releaseDate: '2023-05-15',
    developer: 'Neon Dreams Inc.',
    publisher: 'Future Play',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X'],
  },
  {
    id: 'mystic-forest-quest',
    title: 'Mystic Forest Quest',
    description: 'Embark on an epic journey through an enchanted forest.',
    longDescription: 'The Mystic Forest is dying, and only you can save it. Solve ancient puzzles, befriend magical creatures, and battle dark forces in this captivating adventure RPG. Your choices will shape the fate of the forest.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'fantasy forest',
    category: categories.find(c => c.id === 'adventure')!,
    instructions: 'WASD to move, E to interact, Left-click to attack. Follow the main questline or explore hidden areas.',
    ratings: [
      { userId: 'user3', rating: 4, comment: 'Beautiful world.', createdAt: new Date('2023-12-15T14:30:00Z') },
    ],
    averageRating: 4,
    releaseDate: '2022-11-01',
    developer: 'Enchanted Games',
    publisher: 'Mythic Tales',
    platforms: ['PC', 'Nintendo Switch'],
  },
  {
    id: 'galaxy-commanders',
    title: 'Galaxy Commanders',
    description: 'Lead your fleet to victory in this epic space strategy game.',
    longDescription: 'Assume the role of a fleet commander in a galaxy torn by war. Build your armada, research new technologies, and outmaneuver your opponents in intense real-time strategy battles. Conquer planets and forge alliances to rule the cosmos.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'space battle',
    category: categories.find(c => c.id === 'strategy')!,
    instructions: 'Mouse to select units and issue commands. Manage resources and build structures. Complete campaign missions or play multiplayer.',
    ratings: [
      { userId: 'user4', rating: 5, comment: 'Deep strategy, love it!', createdAt: new Date('2024-02-01T09:00:00Z') },
      { userId: 'user5', rating: 5, createdAt: new Date('2024-02-05T11:00:00Z') },
      { userId: 'user6', rating: 4, createdAt: new Date('2024-02-10T16:00:00Z') },
    ],
    averageRating: 4.67,
    releaseDate: '2024-01-20',
    developer: 'Stellar Forge',
    publisher: 'Cosmic Interactive',
    platforms: ['PC'],
  },
  {
    id: 'puzzle-box-master',
    title: 'Puzzle Box Master',
    description: 'Challenge your mind with intricate 3D puzzle boxes.',
    longDescription: 'Unlock the secrets of ancient and futuristic puzzle boxes. Each box presents a unique set of challenges, requiring logic, observation, and dexterity. Hundreds of levels to test your wits.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'puzzle box',
    category: categories.find(c => c.id === 'puzzle')!,
    instructions: 'Click and drag to manipulate puzzle elements. Find hidden mechanisms and solve sequences to open the box.',
    ratings: [
      { userId: 'user7', rating: 3, comment: 'Some puzzles are too hard.', createdAt: new Date('2023-10-01T10:00:00Z') },
      { userId: 'user8', rating: 4, createdAt: new Date('2023-10-05T13:00:00Z') },
    ],
    averageRating: 3.5,
    releaseDate: '2023-09-10',
    developer: 'MindBenders Co.',
    publisher: 'Logic Leap',
    platforms: ['PC', 'Mobile'],
  },
  {
    id: 'pixel-platformer-pro',
    title: 'Pixel Platformer Pro',
    description: 'Classic platforming action with a modern twist.',
    longDescription: 'Jump, dash, and battle your way through vibrant pixel art worlds. Pixel Platformer Pro offers challenging levels, unique boss fights, and hidden secrets. Master precise controls to become a true pro.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'pixel art',
    category: categories.find(c => c.id === 'platformer')!,
    instructions: 'Arrow keys to move, Z to jump, X to dash. Defeat enemies and reach the end of each level.',
    ratings: [],
    averageRating: 0,
    releaseDate: '2024-03-01',
    developer: 'RetroRevive Studios',
    publisher: 'IndieBlast',
    platforms: ['PC', 'Nintendo Switch', 'Mobile'],
  },
  {
    id: 'dream-farm-sim',
    title: 'Dream Farm Sim',
    description: 'Build and manage your own idyllic farm.',
    longDescription: 'Escape to the countryside and create the farm of your dreams. Plant crops, raise animals, craft goods, and interact with a charming cast of local villagers. Expand your farm and become a pillar of the community.',
    thumbnailUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'farm simulation',
    category: categories.find(c => c.id === 'simulation')!,
    instructions: 'Mouse controls for farming actions. Manage time and resources effectively. Complete daily tasks and seasonal events.',
    ratings: [
       { userId: 'user9', rating: 5, comment: 'So relaxing!', createdAt: new Date('2023-08-01T18:00:00Z') }
    ],
    averageRating: 5,
    releaseDate: '2023-07-22',
    developer: 'Green Pastures Games',
    publisher: 'Harvest Moon Corp.',
    platforms: ['PC', 'Mobile'],
  },
];

// Helper for deep copying game objects while preserving functions (icons) and Date objects.
// This is a simplified deep copy tailored for the Game structure.
const deepCopyGame = (game: Game): Game => {
  return {
    ...game,
    // Shallow copy category; the icon property is a direct reference to the function component.
    category: { ...game.category }, 
    // Deep copy ratings array and ensure createdAt is a Date object.
    ratings: game.ratings.map(r => ({ ...r, createdAt: new Date(r.createdAt) })),
    // Deep copy platforms array.
    platforms: [...game.platforms],
  };
};

// Initialize gamesStore with deep copies of initialGames to preserve functions and allow mutation.
let gamesStore: Game[] = initialGames.map(deepCopyGame);

export const getGames = async (): Promise<Game[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  // Return deep copies of the games from the store to prevent consumer mutation of the store's objects.
  return gamesStore.map(deepCopyGame);
};

export const getGameById = async (id: string): Promise<Game | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const game = gamesStore.find(g => g.id === id);
  // Return a deep copy if found.
  return game ? deepCopyGame(game) : undefined;
};

export const addRatingToGame = async (gameId: string, rating: Rating): Promise<Game | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const gameIndex = gamesStore.findIndex(g => g.id === gameId);
  if (gameIndex !== -1) {
    const gameToUpdate = gamesStore[gameIndex];
    
    // Ensure the new rating's createdAt is a Date object.
    const newRating: Rating = {
        ...rating,
        createdAt: new Date(rating.createdAt), 
    };

    // Update ratings by creating a new array.
    gameToUpdate.ratings = [...gameToUpdate.ratings, newRating];
    
    const totalRating = gameToUpdate.ratings.reduce((sum, r) => sum + r.rating, 0);
    gameToUpdate.averageRating = parseFloat((totalRating / gameToUpdate.ratings.length).toFixed(2));
    
    // Return a deep copy of the updated game.
    return deepCopyGame(gameToUpdate);
  }
  return undefined;
};

export const getUserRatingHistoryString = async (userId: string): Promise<string> => {
  // This is a simplified version. In a real app, you'd query user-specific ratings.
  // For now, let's pick a few games and assign some ratings for a mock user.
  const ratedGames = gamesStore.filter(game => game.ratings.length > 0).slice(0, 3);
  if (ratedGames.length === 0) return "No game ratings available.";
  
  return ratedGames.map(game => {
    // Pick the first rating of the game as a sample, or a fixed rating if none for this specific 'user'
    const userRating = game.ratings.find(r => r.userId === userId) || game.ratings[0] || { rating: Math.floor(Math.random() * 3) + 3 };
    return `${game.title} - ${userRating.rating}`;
  }).join('\n');
};
