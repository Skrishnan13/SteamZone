"use client";

import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showHalfStars?: boolean;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 20,
  className,
  interactive = false,
  onRatingChange,
  showHalfStars = true,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating]);

  const handleMouseEnter = (index: number) => {
    if (!interactive) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (!interactive) return;
    const newRating = index;
    setCurrentRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };
  
  if (!isClient) {
    // Render basic stars SSR to avoid hydration mismatch if rating is dynamic
    return (
      <div className={cn("flex items-center gap-0.5", className)}>
        {[...Array(maxRating)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={cn(
              "text-muted-foreground",
              i + 1 <= Math.round(rating) && "text-yellow-400 fill-yellow-400"
            )}
          />
        ))}
      </div>
    );
  }

  const displayRating = interactive && hoverRating > 0 ? hoverRating : currentRating;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        let starElement;

        if (showHalfStars && displayRating >= starValue - 0.5 && displayRating < starValue) {
          starElement = (
            <StarHalf
              size={size}
              className={cn(
                "text-yellow-400 fill-yellow-400",
                interactive && "cursor-pointer"
              )}
            />
          );
        } else {
          starElement = (
            <Star
              size={size}
              className={cn(
                "text-muted-foreground",
                displayRating >= starValue && "text-yellow-400 fill-yellow-400",
                interactive && "cursor-pointer"
              )}
            />
          );
        }
        
        return (
          <div
            key={i}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : -1}
            onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(starValue); } : undefined}
          >
            {starElement}
          </div>
        );
      })}
    </div>
  );
}
