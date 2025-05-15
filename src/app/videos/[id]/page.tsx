"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useParams, notFound, useRouter } from 'next/navigation';
import type { Video, VideoComment } from '@/types';
import { getVideoById, getCommentsForVideo, addCommentToVideo, addLikeToVideo, addDislikeToVideo } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CalendarDays, Clock, Film, ThumbsUp, ThumbsDown, MessageCircle, Send, UserCircle, Users, Info, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns'; // Assuming releaseDate might become a full date string
import { useToast } from '@/hooks/use-toast';

// A very basic video player placeholder
const VideoPlayerPlaceholder: React.FC<{ video: Video }> = ({ video }) => {
  return (
    <div className="w-full aspect-video bg-black flex items-center justify-center text-white rounded-lg overflow-hidden shadow-2xl">
      {/* In a real app, this would be <video src={video.videoUrl} controls /> or a YouTube/Vimeo embed */}
      <div className="relative w-full h-full">
        <Image
            src={video.thumbnailUrl} // Show thumbnail as placeholder
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
      const mockUser = { id: 'guestUser123', name: 'Guest Viewer', avatar: 'https://placehold.co/40x40.png?text=GV' };
      const postedComment = await addCommentToVideo(videoId, newComment, mockUser.id, mockUser.name, mockUser.avatar);
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
    <div key={comment.id} className={cn("flex space-x-3 py-3", isReply ? "ml-8 pl-3 border-l border-muted/50" : "")}>
      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
        <AvatarImage src={comment.avatarUrl} alt={comment.username} />
        <AvatarFallback>{comment.username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">{comment.username}</h4>
          <p className="text-xs text-muted-foreground">{format(new Date(comment.createdAt), 'MMM d, yyyy')}</p>
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
            className="bg-input/50 focus:bg-input"
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()} className="w-full sm:w-auto">
            {isSubmitting ? 'Submitting...' : 'Comment'} <Send className="ml-2 h-4 w-4"/>
          </Button>
        </form>
        <Separator className="my-4"/>
        <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
          {comments.length > 0 ? comments.map(comment => renderComment(comment)) : <p className="text-muted-foreground text-sm">No comments yet. Be the first to share your thoughts!</p>}
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
        addLikeToVideo(videoId, 'initial-load') // Mock initial counts
      ]).then(([videoData, commentsData, initialInteractions]) => {
          if (videoData) {
            setVideo(videoData);
            setComments(commentsData);
            setInteractionCounts({ likes: initialInteractions.likes, dislikes: initialInteractions.dislikes });
          } else {
            notFound();
          }
        })
        .catch(err => {
          console.error("Failed to fetch video details:", err);
          notFound();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [videoId]);

  const handleLike = async () => {
    if (!video) return;
    const newCounts = await addLikeToVideo(video.id, 'guestUser123');
    setInteractionCounts(newCounts);
    toast({ title: 'Liked!', description: 'Thanks for the feedback.'});
  };

  const handleDislike = async () => {
    if (!video) return;
    const newCounts = await addDislikeToVideo(video.id, 'guestUser123');
    setInteractionCounts(newCounts);
    toast({ title: 'Disliked.', description: 'We appreciate your input.'});
  };


  if (isLoading) {
    return <VideoDetailsSkeleton />;
  }

  if (!video) {
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
                <span>{video.views ? `${video.views.toLocaleString()} views` : 'Popular'}</span>
                <span className="hidden sm:inline">•</span>
                <span>{video.releaseYear}</span>
                <span className="hidden sm:inline">•</span>
                <span>{video.duration}</span>
                <span className="hidden sm:inline">•</span>
                <Badge variant="outline" className="text-xs">{video.maturityRating}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-3">
                {/* Like/Dislike Buttons */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleLike} className="gap-2">
                    <ThumbsUp className="h-5 w-5" /> {interactionCounts.likes > 0 && <span>{interactionCounts.likes}</span>}
                  </Button>
                  <Button variant="outline" onClick={handleDislike} className="gap-2">
                    <ThumbsDown className="h-5 w-5" /> {interactionCounts.dislikes > 0 && <span>{interactionCounts.dislikes}</span>}
                  </Button>
                </div>
                 {/* Other actions (Share, Save) - placeholders */}
                <div className="flex items-center gap-2">
                  <Button variant="outline"><MessageCircle className="mr-2 h-4 w-4" /> Share</Button>
                  <Button variant="outline">Save</Button>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-foreground/90 whitespace-pre-line leading-relaxed">{video.longDescription}</p>
              <div className="mt-4 space-y-1 text-sm">
                <p><strong className="text-muted-foreground">Director:</strong> {video.director}</p>
                <p><strong className="text-muted-foreground">Starring:</strong> {video.cast.join(', ')}</p>
                <p><strong className="text-muted-foreground">Genres:</strong> {video.genres.join(', ')}</p>
                {video.tags && video.tags.length > 0 && <p><strong className="text-muted-foreground">Tags:</strong> {video.tags.join(', ')}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <CommentSection videoId={video.id} initialComments={comments} />
        </div>

        {/* Sidebar: Related Videos or Info (Placeholder) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Info className="text-primary"/> More Like This</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                  <Skeleton className="w-28 h-16 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-1.5" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Tag className="text-primary"/> Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong className="text-muted-foreground">Maturity:</strong> {video.maturityRating}</p>
              <p><strong className="text-muted-foreground">Subtitles:</strong> English, Spanish, French</p>
              <p><strong className="text-muted-foreground">Audio:</strong> English [Original], Spanish</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


function VideoDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="w-full aspect-video rounded-lg" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-5 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center py-3">
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
              <Separator className="my-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <Skeleton className="h-4 w-1/3 mb-1" />
              <Skeleton className="h-4 w-2/3 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-7 w-1/3" /></CardHeader>
            <CardContent>
                <Skeleton className="h-20 w-full mb-4" /> {/* Textarea */}
                <Skeleton className="h-10 w-28 mb-6" /> {/* Button */}
                <Skeleton className="h-16 w-full mb-3" />
                <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><Skeleton className="h-7 w-1/2" /></CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-24 h-14 rounded" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
