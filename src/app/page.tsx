"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Game, Category } from '@/types';
import { getGames, categories as allCategories } from '@/data/mock';
import { GameCard } from '@/components/GameCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function GameDirectoryPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [visibleGames, setVisibleGames] = useState(9); // For "Load More"

  useEffect(() => {
    async function fetchGames() {
      setIsLoading(true);
      try {
        const fetchedGames = await getGames();
        setGames(fetchedGames);
      } catch (error) {
        console.error("Failed to fetch games:", error);
        // Handle error state if needed
      } finally {
        setIsLoading(false);
      }
    }
    fetchGames();
  }, []);

  const filteredGames = useMemo(() => {
    return games
      .filter(game => 
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(game => 
        selectedCategory === 'all' || game.category.id === selectedCategory
      );
  }, [games, searchTerm, selectedCategory]);

  const handleLoadMore = () => {
    setVisibleGames(prev => prev + 9);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Skeleton className="h-10 w-full sm:w-1/2" />
          <Skeleton className="h-10 w-full sm:w-1/4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <Skeleton className="h-40 w-full rounded-t-lg" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="p-4 border-t">
                <Skeleton className="h-5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary">Game Zone Directory</h1>
        <p className="mt-3 text-lg leading-8 text-muted-foreground">
          Discover your next favorite game from our curated collection.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-card rounded-lg shadow">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search games by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 h-10"
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px] h-10">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <category.icon className="w-4 h-4 text-muted-foreground" />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredGames.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filteredGames.slice(0, visibleGames).map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          {visibleGames < filteredGames.length && (
            <div className="text-center mt-12">
              <Button onClick={handleLoadMore} size="lg" variant="outline">
                Load More Games
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground">No Games Found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
