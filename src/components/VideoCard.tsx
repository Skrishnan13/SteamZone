"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Video } from '@/types';
import { PlayCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/videos/${video.id}`} className="block group overflow-hidden rounded-md">
      <div className="relative aspect-[16/9] w-full bg-muted/30 cursor-pointer">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          data-ai-hint={video.dataAiHint}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <PlayCircle className="w-12 h-12 text-white/80" />
        </div>
         {/* Small overlay for title, visible on hover over text area */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-white text-sm font-semibold truncate">{video.title}</h3>
            <p className="text-xs text-neutral-400 truncate">{video.genres.slice(0,2).join(' • ')}</p>
        </div>
      </div>
      {/* Optionally, info below card if not using overlay title */}
      {/* 
      <div className="py-2 px-1">
        <h3 className="text-sm font-medium text-foreground truncate group-hover:text-primary">{video.title}</h3>
        <p className="text-xs text-muted-foreground">{video.genres.join(', ')}</p>
      </div>
      */}
    </Link>
  );
}
