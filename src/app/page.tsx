
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Video, VideoCategory } from '@/types';
// Removed imports from '@/data/mock' as they no longer exist: getVideosByCategoryId, getCategories, getFeaturedVideo
import { VideoCard } from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Helper for horizontal scrolling
const ScrollContainer: React.FC<{ children: React.ReactNode; categoryId: string }> = ({ children, categoryId }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8; // Scroll by 80% of visible width
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto py-4 scrollbar-hide space-x-3 md:space-x-4 pr-4 md:pr-0 pl-4 md:pl-0 -mx-4 md:mx-0" // pl/pr for edge cards visibility on mobile
      >
        {children}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-16 w-10 bg-black/30 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-none rounded-r-md hidden md:flex"
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-16 w-10 bg-black/30 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-none rounded-l-md hidden md:flex"
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </div>
  );
};


export default function HomePage() {
  const [allCategories, setAllCategories] = useState<VideoCategory[]>([]);
  const [categorizedVideos, setCategorizedVideos] = useState<Map<string, Video[]>>(new Map());
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Placeholder: In a real app, you would fetch this data from your backend API
        // For now, we'll set them to empty/null as mock functions are removed.
        setFeaturedVideo(null);
        setAllCategories([]);
        setCategorizedVideos(new Map());

      } catch (error) {
        console.error("Failed to fetch videos or categories:", error);
        // Handle error state if necessary
      } finally {
        // Simulate a delay if needed, or set to false directly
        // For now, setting a small timeout to ensure skeletons are visible initially
        setTimeout(() => setIsLoading(false), 500);
      }
    }
    fetchData();
  }, []);

  if (isLoading) { // Show skeleton if still loading
    return <HomePageSkeleton predefinedCategories={[{id: 'cat1', name: 'Loading...'}, {id: 'cat2', name: 'Loading...'}]} />;
  }
  
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      {!featuredVideo ? <HeroSkeleton /> : ( // Show skeleton if featured video is null and not loading
        <div className="relative h-[60vh] md:h-[80vh] w-full text-white">
          <Image
            src={featuredVideo.thumbnailUrl} // Use a higher res image for hero ideally
            alt={featuredVideo.title}
            fill
            className="object-cover object-center"
            priority
            data-ai-hint={`${featuredVideo.dataAiHint} cinematic`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 md:p-16 max-w-2xl space-y-4 z-10">
            <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">{featuredVideo.title}</h1>
            <p className="text-sm md:text-lg line-clamp-3 drop-shadow-md">{featuredVideo.description}</p>
            <div className="flex gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground">
                <Link href={`/videos/${featuredVideo.id}`}>
                  <PlayCircle className="mr-2 h-6 w-6" /> Play
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/20 hover:bg-white/30 border-white/30 text-white">
                More Info
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Video Categories Sections */}
      <div className="py-8 md:py-12 space-y-8 md:space-y-12 container mx-auto px-4">
        {allCategories.length === 0 && categorizedVideos.size === 0 && !isLoading ? ( // if no categories and no videos and not loading
            <div className="text-center py-10">
                <h2 className="text-xl font-semibold mb-2">No Content Available</h2>
                <p className="text-muted-foreground">Please check back later or add content via the admin panel.</p>
            </div>
        ) : (
            allCategories.map(category => {
              const videos = categorizedVideos.get(category.id) || [];
              if (videos.length === 0) return null; // Don't render empty category rows

              return (
                <section key={category.id} aria-labelledby={category.id}>
                  <h2 id={category.id} className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">{category.name}</h2>
                  <ScrollContainer categoryId={category.id}>
                    {videos.map(video => (
                      <div key={video.id} className="min-w-[200px] sm:min-w-[240px] md:min-w-[280px] flex-shrink-0">
                        <VideoCard video={video} />
                      </div>
                    ))}
                  </ScrollContainer>
                </section>
              );
            })
        )}
      </div>
    </div>
  );
}


function HeroSkeleton() {
  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full bg-muted/30">
      <div className="absolute bottom-0 left-0 p-4 md:p-16 max-w-2xl space-y-4 z-10">
        <Skeleton className="h-10 md:h-14 w-3/4" />
        <Skeleton className="h-4 md:h-5 w-full" />
        <Skeleton className="h-4 md:h-5 w-5/6" />
        <div className="flex gap-3">
          <Skeleton className="h-12 w-28" />
          <Skeleton className="h-12 w-28" />
        </div>
      </div>
    </div>
  );
}

function CategoryRowSkeleton({ categoryName }: { categoryName: string }) {
  return (
    <section>
      <Skeleton className="h-7 md:h-8 w-1/2 mb-3 md:mb-4" />
      <div className="flex space-x-3 md:space-x-4 overflow-hidden py-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="min-w-[200px] sm:min-w-[240px] md:min-w-[280px] flex-shrink-0">
            <Skeleton className="aspect-[16/9] w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 mt-2" />
            <Skeleton className="h-3 w-1/2 mt-1" />
          </div>
        ))}
      </div>
    </section>
  );
}

function HomePageSkeleton({ predefinedCategories }: { predefinedCategories: {id: string, name: string}[] }) {
  return (
     <div className="space-y-0">
      <HeroSkeleton />
      <div className="py-8 md:py-12 space-y-8 md:space-y-12 container mx-auto px-4">
        {predefinedCategories.slice(0,3).map(category => <CategoryRowSkeleton key={category.id} categoryName={category.name} />)}
      </div>
    </div>
  );
}

