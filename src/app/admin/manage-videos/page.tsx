
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Video } from '@/types';
import { getVideos, deleteVideo } from '@/data/mock';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManageVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Holds ID of video being deleted
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchVideos() {
      setIsLoading(true);
      try {
        const fetchedVideos = await getVideos();
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        toast({
          title: "Error",
          description: "Could not load videos. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchVideos();
  }, [toast]);

  const handleDeleteVideo = async (videoId: string) => {
    setIsDeleting(videoId);
    try {
      const success = await deleteVideo(videoId);
      if (success) {
        setVideos(prevVideos => prevVideos.filter(video => video.id !== videoId));
        toast({
          title: "Video Deleted",
          description: "The video has been successfully removed.",
        });
      } else {
        toast({
          title: "Error",
          description: "Could not delete the video. It might have already been removed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete video:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the video.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" asChild className="mb-6 gap-2">
             <Link href="/admin"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Link>
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-3 border-b last:border-b-0">
                <Skeleton className="h-6 flex-1" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-10" />
                <Skeleton className="h-8 w-10" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/admin"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Link>
          </Button>
        </div>
        <Button asChild>
          <Link href="/admin/upload"><PlusCircle className="mr-2 h-5 w-5" /> Add New Video</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Videos</CardTitle>
          <CardDescription>View, edit, or delete existing videos from your catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          {videos.length === 0 && !isLoading ? (
            <div className="text-center py-10">
              <Video className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No Videos Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by adding a new video.
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/upload"><PlusCircle className="mr-2 h-4 w-4" />Add Video</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Year</TableHead>
                  <TableHead className="hidden lg:table-cell">Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{video.releaseYear}</TableCell>
                    <TableCell className="hidden lg:table-cell">{video.duration}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild className="mr-2">
                        <Link href={`/admin/manage-videos/${video.id}/edit`} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Delete" disabled={isDeleting === video.id}>
                            {isDeleting === video.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              video "{video.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting === video.id}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteVideo(video.id)}
                              disabled={isDeleting === video.id}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {isDeleting === video.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for Video icon
const Video = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 6.42857C4 5.08741 5.08741 4 6.42857 4H17.5714C18.9126 4 20 5.08741 20 6.42857V17.5714C20 18.9126 18.9126 20 17.5714 20H6.42857C5.08741 20 4 18.9126 4 17.5714V6.42857ZM6 6V18H18V6H6ZM9.5 8L15.5 12L9.5 16V8Z" />
  </svg>
);
