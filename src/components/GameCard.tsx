import Link from 'next/link';
import Image from 'next/image';
import type { Game } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RatingStars } from '@/components/RatingStars';
import { cn } from '@/lib/utils';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const CategoryIcon = game.category.icon;

  return (
    <Link href={`/games/${game.id}`} className="block group">
      <Card className="h-full flex flex-col overflow-hidden bg-card hover:shadow-xl transition-shadow duration-300 ease-in-out transform group-hover:scale-[1.02]">
        <CardHeader className="p-0">
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={game.thumbnailUrl}
              alt={game.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
              data-ai-hint={game.dataAiHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg mb-2 leading-tight">{game.title}</CardTitle>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{game.description}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <CategoryIcon className="w-4 h-4 mr-1.5 text-accent" />
            {game.category.name}
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t bg-muted/30">
          <div className="flex justify-between items-center w-full">
            <RatingStars rating={game.averageRating} size={16} />
            <Badge variant="secondary" className="text-xs">
              {game.averageRating > 0 ? `${game.averageRating.toFixed(1)} / 5` : 'Not Rated'}
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
