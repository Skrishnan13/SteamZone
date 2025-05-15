"use client"; // This page needs client interactivity for rating submission

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import type { Game, Rating as RatingType } from '@/types';
import { getGameById, addRatingToGame, categories as allCategories } from '@/data/mock';
import { RatingStars } from '@/components/RatingStars';
import { GameRatingForm } from '@/components/game/GameRatingForm';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CalendarDays, Users, Tag, Info, ListChecks, Star, MessageSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function GameDetailsPage() {
  const params = useParams();
  const gameId = params.id as string;
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (gameId) {
      setIsLoading(true);
      getGameById(gameId)
        .then(data => {
          if (data) {
            setGame(data);
          } else {
            notFound(); // Or set an error state
          }
        })
        .catch(err => {
          console.error("Failed to fetch game details:", err);
          notFound(); // Or set an error state
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [gameId]);

  const handleRatingSubmitted = async (newRating: RatingType) => {
    if (!game) return;
    const updatedGameData = await addRatingToGame(game.id, newRating);
    if (updatedGameData) {
      setGame(updatedGameData);
    }
  };

  if (isLoading) {
    return <GameDetailsSkeleton />;
  }

  if (!game) {
    // This case should ideally be handled by notFound() in useEffect,
    // but as a fallback:
    return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Game Not Found</h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">Sorry, we couldn’t find the game you’re looking for.</p>
      </div>
    );
  }
  
  const CategoryIcon = game.category.icon || Tag;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1">
          <Card className="overflow-hidden shadow-xl">
            <div className="relative aspect-square w-full">
              <Image
                src={game.thumbnailUrl}
                alt={game.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority
                data-ai-hint={game.dataAiHint}
              />
            </div>
          </Card>
        </div>
        <div className="md:col-span-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2 sm:text-5xl">{game.title}</h1>
          <div className="flex items-center gap-4 mb-4 text-muted-foreground">
            <div className="flex items-center">
              <CategoryIcon className="w-5 h-5 mr-2 text-accent" />
              <span>{game.category.name}</span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center">
               <CalendarDays className="w-5 h-5 mr-2 text-accent" />
               <span>Released: {format(parseISO(game.releaseDate), 'MMMM d, yyyy')}</span>
            </div>
          </div>
          <p className="text-lg text-foreground mb-6">{game.longDescription || game.description}</p>
          <div className="flex items-center gap-2 mb-6">
            <RatingStars rating={game.averageRating} size={24} />
            <span className="text-xl font-semibold text-foreground">
              {game.averageRating > 0 ? game.averageRating.toFixed(1) : 'N/A'}
            </span>
            <span className="text-sm text-muted-foreground">({game.ratings.length} ratings)</span>
          </div>
           <div className="flex flex-wrap gap-2 mb-6">
            {game.platforms.map(platform => (
              <Badge key={platform} variant="secondary">{platform}</Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ListChecks className="text-accent"/> Play Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-foreground/90">{game.instructions}</p>
            </CardContent>
          </Card>
          
          <GameRatingForm gameId={game.id} onRatingSubmitted={handleRatingSubmitted} />

          {game.ratings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star className="text-accent"/> User Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {game.ratings.slice(0, 5).map((r, index) => ( // Show latest 5 reviews
                  <div key={index} className="p-4 border rounded-lg bg-muted/20">
                    <div className="flex justify-between items-center mb-2">
                      <RatingStars rating={r.rating} size={18} />
                       <span className="text-xs text-muted-foreground">{format(r.createdAt, 'PP')}</span>
                    </div>
                    {r.comment && <p className="text-sm text-foreground/80 italic">"{r.comment}"</p>}
                  </div>
                ))}
                {game.ratings.length > 5 && <p className="text-sm text-center text-muted-foreground">More reviews available...</p>}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Info className="text-accent"/> Game Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Developer:</span>
                <span className="font-medium">{game.developer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Publisher:</span>
                <span className="font-medium">{game.publisher}</span>
              </div>
               <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{game.category.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Release Date:</span>
                <span className="font-medium">{format(parseISO(game.releaseDate), 'MMM d, yyyy')}</span>
              </div>
            </CardContent>
          </Card>
          {/* Placeholder for similar games or ads */}
        </div>
      </div>
    </div>
  );
}

function GameDetailsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1">
          <Card className="overflow-hidden shadow-xl">
            <Skeleton className="aspect-square w-full" />
          </Card>
        </div>
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-24 w-full" /></CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-40 w-full" /></CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

