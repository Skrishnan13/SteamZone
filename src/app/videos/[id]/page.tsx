
"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useParams, notFound, useRouter } from 'next/navigation';
import type { Video, VideoComment } from '@/types';
import { getVideoById, getCommentsForVideo, addCommentToVideo, addLikeToVideo, addDislikeToVideo, getInteractionCounts } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CalendarDays, Clock, Film, ThumbsUp, ThumbsDown, MessageCircle, Send, UserCircle, Users, Info, Tag, Share2, Bookmark } from 'lucide-react';
import { format, parseISO } from 'date-fns'; 
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils'; // For cn utility if needed in CommentSection or elsewhere
import { Badge } from '@/components/ui/badge';


// A very basic video player placeholder
const VideoPlayerPlaceholder: React.FC<{ video: Video }> = ({ video }) => {
  return (
    <div className="w-full aspect-video bg-black flex items-center justify-center text-white rounded-lg overflow-hidden shadow-2xl">
      <div className="relative w-full h-full">
        <Image
            src={video.thumbnailUrl} 
            alt={`Play ${video.title}`}
            fill
            className="object-cover"
            data-ai-hint={video.dataAiHint + " video play"}
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Film className="w-24 h-24 text-white/70" />
        </div>
        <div className="absolute bottom-4 left-4 p-2 bg-black/50 rounded">
            <p className="text-lg font-semibold">{video.title}</p>
            <p className="text-sm text-neutral-300">Video player coming soon!</p>
        </div>
      </div>
    </div>
  );
};

const CommentSection: React.FC<{ videoId: string, initialComments: VideoComment[] }> = ({ videoId, initialComments }) => {
  const [comments, setComments] = useState<VideoComment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // Mock user details, in a real app this would come from auth context
      const mockUser = { id: 'guestUser123', name: 'Guest Viewer', avatarUrl: `https://placehold.co/40x40.png?text=GV` };
      const postedComment = await addCommentToVideo(videoId, newComment, mockUser.id, mockUser.name, mockUser.avatarUrl);
      setComments(prevComments => [postedComment, ...prevComments]);
      setNewComment('');
      toast({ title: 'Comment posted!', description: 'Your wisdom has been shared.'});
    } catch (error) {
      toast({ title: 'Error posting comment', description: 'Please try again.', variant: 'destructive' });
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderComment = (comment: VideoComment, isReply = false) => (
    <div key={comment.id} className={cn("flex space-x-3 py-3", isReply ? "ml-8 pl-3 border-l border-border/30" : "")}>
      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
        <AvatarImage src={comment.avatarUrl} alt={comment.username} />
        <AvatarFallback>{comment.username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">{comment.username}</h4>
          <p className="text-xs text-muted-foreground">{format(parseISO(comment.createdAt), 'MMM d, yyyy')}</p>
        </div>
        <p className="text-sm text-foreground/90">{comment.comment}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Button variant="ghost" size="xs" className="gap-1 p-1 h-auto"><ThumbsUp className="w-3 h-3"/> {comment.likes}</Button>
            <Button variant="ghost" size="xs" className="p-1 h-auto">Reply</Button>
        </div>
        {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
      </div>
    </div>
  );


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageCircle className="text-primary" /> Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCommentSubmit} className="space-y-3 mb-6">
          <Textarea
            placeholder="Add a public comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="bg-input/50 focus:bg-input" // Slightly different background for textarea
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()} className="w-full sm:w-auto">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4"/>}
            {isSubmitting ? 'Submitting...' : 'Comment'}
          </Button>
        </form>
        <Separator className="my-4"/>
        <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
          {comments.length > 0 ? comments.map(comment => renderComment(comment)) : <p className="text-muted-foreground text-sm text-center py-4">No comments yet. Be the first to share your thoughts!</p>}
        </div>
      </CardContent>
    </Card>
  );
};


export default function VideoDetailsPage() {
  const params = useParams();
  const videoId = params.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [interactionCounts, setInteractionCounts] = useState({ likes: 0, dislikes: 0});

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      Promise.all([
        getVideoById(videoId),
        getCommentsForVideo(videoId),
        getInteractionCounts(videoId) 
      ]).then(([videoData, commentsData, initialInteractions]) => {
          if (videoData) {
            setVideo(videoData);
            setComments(commentsData);
            setInteractionCounts(initialInteractions);
          } else {
            notFound();
          }
        })
        .catch(err => {
          console.error("Failed to fetch video details:", err);
          toast({ title: "Error", description: "Could not load video data.", variant: "destructive"});
          // Potentially redirect or show a more specific error if notFound() isn't desired for all cases
          // For now, notFound() is fine.
          notFound(); 
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [videoId, toast]); // Added toast to dependency array

  const handleLike = async () => {
    if (!video) return;
    const newCounts = await addLikeToVideo(video.id, 'guestUser123'); // mock userId
    setInteractionCounts(newCounts);
    toast({ title: 'Liked!', description: 'Thanks for the feedback.'});
  };

  const handleDislike = async () => {
    if (!video) return;
    const newCounts = await addDislikeToVideo(video.id, 'guestUser123'); // mock userId
    setInteractionCounts(newCounts);
    toast({ title: 'Disliked.', description: 'We appreciate your input.'});
  };


  if (isLoading) {
    return <VideoDetailsSkeleton />;
  }

  if (!video) {
    // This state should ideally be caught by notFound() in useEffect, but as a fallback:
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Video Not Found</h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">Sorry, we couldn’t find the video you’re looking for.</p>
        <Button onClick={() => router.push('/')} className="mt-6">Go Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content: Video Player and Details */}
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayerPlaceholder video={video} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold">{video.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4"/> {video.views ? `${video.views.toLocaleString()} views` : 'Popular'}</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/> {video.releaseYear}</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {video.duration}</span>
                <span className="hidden sm:inline">•</span>
                <Badge variant="outline" className="text-xs">{video.maturityRating}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-3">
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleLike} className="gap-2">
                    <ThumbsUp className="h-5 w-5" /> {interactionCounts.likes > 0 && <span className="font-medium">{interactionCounts.likes.toLocaleString()}</span>}
                  </Button>
                  <Button variant="outline" onClick={handleDislike} className="gap-2">
                    <ThumbsDown className="h-5 w-5" /> {interactionCounts.dislikes > 0 && <span className="font-medium">{interactionCounts.dislikes.toLocaleString()}</span>}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                  <Button variant="outline"><Bookmark className="mr-2 h-4 w-4" /> Save</Button>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-foreground/90 whitespace-pre-line leading-relaxed">{video.longDescription}</p>
              <div className="mt-6 space-y-2 text-sm">
                <p><strong className="font-semibold text-muted-foreground">Director:</strong> {video.director}</p>
                <p><strong className="font-semibold text-muted-foreground">Starring:</strong> {video.cast.join(', ')}</p>
                <p><strong className="font-semibold text-muted-foreground">Genres:</strong> {video.genres.join(', ')}</p>
                {video.tags && video.tags.length > 0 && <p><strong className="font-semibold text-muted-foreground">Tags:</strong> {video.tags.join(', ')}</p>}
                 <div className="pt-2">
                    <strong className="font-semibold text-muted-foreground">Categories:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {video.categories.map(cat => <Badge key={cat.id} variant="secondary">{cat.name}</Badge>)}
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>

          <CommentSection videoId={video.id} initialComments={comments} />
        </div>

        {/* Sidebar: Related Videos or Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Info className="text-primary"/> More Like This</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors">
                  <Skeleton className="w-28 h-16 rounded bg-muted/70" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-1.5 bg-muted/70" />
                    <Skeleton className="h-3 w-1/2 bg-muted/70" />
                  </div>
                </div>
              ))}
               <Button variant="outline" className="w-full mt-2">Show More</Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Tag className="text-primary"/> Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong className="text-muted-foreground">Maturity Rating:</strong> {video.maturityRating}</p>
              <p><strong className="text-muted-foreground">Subtitles:</strong> English, Spanish, French (Mock)</p>
              <p><strong className="text-muted-foreground">Audio Languages:</strong> English [Original], Spanish (Mock)</p>
              <p><strong className="text-muted-foreground">Video Quality:</strong> Up to 4K UHD (Mock)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


function VideoDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="w-full aspect-video rounded-lg bg-muted/50" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2 bg-muted/50" />
              <Skeleton className="h-5 w-1/2 bg-muted/50" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center py-3">
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-20 bg-muted/50" />
                  <Skeleton className="h-10 w-20 bg-muted/50" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24 bg-muted/50" />
                  <Skeleton className="h-10 w-24 bg-muted/50" />
                </div>
              </div>
              <Separator className="my-4 bg-border/50" />
              <Skeleton className="h-4 w-full mb-2 bg-muted/50" />
              <Skeleton className="h-4 w-full mb-2 bg-muted/50" />
              <Skeleton className="h-4 w-5/6 mb-4 bg-muted/50" />
              <Skeleton className="h-4 w-1/3 mb-1 bg-muted/50" />
              <Skeleton className="h-4 w-2/3 mb-1 bg-muted/50" />
              <Skeleton className="h-4 w-1/2 bg-muted/50" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-7 w-1/3 bg-muted/50" /></CardHeader>
            <CardContent>
                <Skeleton className="h-20 w-full mb-4 bg-muted/50" /> {/* Textarea */}
                <Skeleton className="h-10 w-28 mb-6 bg-muted/50" /> {/* Button */}
                <Skeleton className="h-16 w-full mb-3 bg-muted/50" />
                <Skeleton className="h-16 w-full bg-muted/50" />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><Skeleton className="h-7 w-1/2 bg-muted/50" /></CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-24 h-14 rounded bg-muted/50" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-full bg-muted/50" />
                    <Skeleton className="h-3 w-2/3 bg-muted/50" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
           <Card>
            <CardHeader><Skeleton className="h-7 w-1/2 bg-muted/50" /></CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-3/4 mb-1.5 bg-muted/50" />
                <Skeleton className="h-4 w-full mb-1.5 bg-muted/50" />
                <Skeleton className="h-4 w-2/3 bg-muted/50" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
