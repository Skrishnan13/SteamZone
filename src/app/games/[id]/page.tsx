
"use client"; 

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import type { Game, Rating as RatingType } from '@/types';
import { getGameById, addRatingToGame } from '@/data/mock';
import { RatingStars } from '@/components/RatingStars';
import { GameRatingForm } from '@/components/game/GameRatingForm';
import PixelPlatformerGame from '@/components/game/PixelPlatformerGame'; // Import the new game component
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, CalendarDays, Users, Tag, Info, ListChecks, Star, MessageSquare, Play, EyeOff } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function GameDetailsPage() {
  const params = useParams();
  const gameId = params.id as string;
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showGameCanvas, setShowGameCanvas] = useState(false); // State for showing the playable game

  useEffect(() => {
    if (gameId) {
      setIsLoading(true);
      setShowGameCanvas(false); // Reset canvas visibility on game change
      getGameById(gameId)
        .then(data => {
          if (data) {
            setGame(data);
          } else {
            notFound(); 
          }
        })
        .catch(err => {
          console.error("Failed to fetch game details:", err);
          notFound(); 
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
    return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Game Not Found</h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">Sorry, we couldn’t find the game you’re looking for.</p>
      </div>
    );
  }
  
  const CategoryIcon = game.category.icon || Tag;
  const isPlayablePixelPlatformer = game.id === 'pixel-platformer-pro';

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
          <div className="flex items-center gap-2 mb-3">
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

          {isPlayablePixelPlatformer ? (
            <Button 
              size="lg" 
              className="w-full sm:w-auto" 
              onClick={() => setShowGameCanvas(!showGameCanvas)}
            >
              {showGameCanvas ? <EyeOff className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {showGameCanvas ? 'Hide Game' : 'Play Game'}
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto">
                  <Play className="mr-2 h-5 w-5" /> Play Game
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Gameplay Feature</AlertDialogTitle>
                  <AlertDialogDescription>
                    This game is not directly playable within Game Zone at the moment. 
                    This app currently serves as a directory for game information and ratings.
                    We are considering adding direct play features in the future!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Got it!</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {isPlayablePixelPlatformer && showGameCanvas && (
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="text-accent h-6 w-6" />
              Playing: {game.title}
            </CardTitle>
            <CardDescription>Use Arrow Keys: Left/Right to move, Up to Jump. Try to navigate the platforms!</CardDescription>
          </CardHeader>
          <CardContent>
            <PixelPlatformerGame />
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ListChecks className="text-accent"/> Play Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-foreground/90">{game.instructions}</p>
              {isPlayablePixelPlatformer && <p className="mt-2 text-sm text-accent-foreground/80">For the interactive version above: Use Arrow Left/Right to move, Arrow Up to jump.</p>}
            </CardContent>
          </Card>
          
          <GameRatingForm gameId={game.id} onRatingSubmitted={handleRatingSubmitted} />

          {game.ratings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star className="text-accent"/> User Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {game.ratings.slice(0, 5).map((r, index) => ( 
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
          <Skeleton className="h-12 w-1/3 mt-2" />
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
