
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { videoCategories, getVideoById, updateVideo } from "@/data/mock";
import type { Video } from "@/types";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const videoEditFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  description: z.string().min(10, "Description must be at least 10 characters.").max(500),
  longDescription: z.string().min(20, "Detailed description is too short.").max(5000),
  genres: z.string().min(3, "Please enter at least one genre."), // comma-separated
  cast: z.string().min(3, "Please list at least one cast member."), // comma-separated
  director: z.string().min(3, "Director name is required."),
  releaseYear: z.coerce.number().min(1900).max(new Date().getFullYear() + 10),
  duration: z.string().regex(/^\d+[hm]$/, "Duration must be like '90m' or '2h' (e.g. 120m for 2 hours, 1h for 1 hour)."),
  maturityRating: z.string().min(2, "Maturity rating is required (e.g., PG, R, TV-MA)."),
  categories: z.array(z.string()).min(1, "Select at least one category."),
  thumbnailUrl: z.string().url("Must be a valid URL for thumbnail.").optional().or(z.literal('')), // Optional for edit
  dataAiHint: z.string().optional(),
  isFeatured: z.boolean().default(false).optional(),
  // Video file itself is not handled in this form, only metadata
});

type VideoEditFormData = z.infer<typeof videoEditFormSchema>;

export default function EditVideoPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const videoId = params.id as string;

  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VideoEditFormData>({
    resolver: zodResolver(videoEditFormSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      genres: "",
      cast: "",
      director: "",
      releaseYear: new Date().getFullYear(),
      duration: "90m",
      maturityRating: "PG-13",
      categories: [],
      thumbnailUrl: "",
      dataAiHint: "",
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (videoId) {
      setIsLoadingVideo(true);
      getVideoById(videoId)
        .then(videoData => {
          if (videoData) {
            form.reset({
              ...videoData,
              genres: videoData.genres.join(', '),
              cast: videoData.cast.join(', '),
              categories: videoData.categories.map(cat => cat.id),
            });
          } else {
            toast({ title: "Error", description: "Video not found.", variant: "destructive" });
            router.replace("/admin/manage-videos");
          }
        })
        .catch(err => {
          console.error("Failed to fetch video for editing:", err);
          toast({ title: "Error", description: "Could not load video data.", variant: "destructive" });
        })
        .finally(() => setIsLoadingVideo(false));
    }
  }, [videoId, form, router, toast]);

  async function onSubmit(data: VideoEditFormData) {
    setIsSubmitting(true);
    try {
      const updatedVideoData: Partial<Omit<Video, 'id' | 'categories'>> & { categories: string[] } = {
        ...data,
        genres: data.genres.split(',').map(g => g.trim()).filter(g => g),
        cast: data.cast.split(',').map(c => c.trim()).filter(c => c),
        // categories are already in the correct string[] format from the form
      };
      
      const result = await updateVideo(videoId, updatedVideoData as any); // Type assertion needed due to how categories are handled
      if (result) {
        toast({
          title: "Video Updated",
          description: `"${result.title}" has been successfully updated.`,
        });
        router.push("/admin/manage-videos");
      } else {
        toast({ title: "Error", description: "Failed to update video.", variant: "destructive" });
      }
    } catch (error) {
        console.error("Error updating video:", error);
        toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  if (isLoadingVideo) {
     return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
            <Skeleton className="h-12 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" asChild className="mb-6 gap-2">
        <Link href="/admin/manage-videos"><ArrowLeft className="h-4 w-4" /> Back to Manage Videos</Link>
      </Button>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Save className="h-7 w-7 text-primary" /> Edit Video
          </CardTitle>
          <CardDescription>
            Modify the details for "{form.getValues("title") || 'this video'}".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input placeholder="e.g., The Great Adventure" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description (for cards)</FormLabel>
                    <FormControl><Textarea placeholder="A brief summary of the video..." {...field} rows={3} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description (for video page)</FormLabel>
                    <FormControl><Textarea placeholder="Full synopsis, plot details, etc." {...field} rows={6} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="genres"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Genres (comma-separated)</FormLabel>
                        <FormControl><Input placeholder="Action, Sci-Fi, Drama" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="maturityRating"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Maturity Rating</FormLabel>
                        <FormControl><Input placeholder="PG-13, R, TV-MA" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="director"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Director</FormLabel>
                        <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="releaseYear"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Release Year</FormLabel>
                        <FormControl><Input type="number" placeholder="2024" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <FormField
                control={form.control}
                name="cast"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cast (comma-separated)</FormLabel>
                    <FormControl><Input placeholder="Actor One, Actress Two, Star Three" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
               <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl><Input placeholder="e.g., 120m or 2h" {...field} /></FormControl>
                    <FormDescription>Enter duration like '90m' for 90 minutes or '2h' for 2 hours.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl><Input placeholder="https://placehold.co/600x338.png" {...field} /></FormControl>
                     <FormDescription>Paste a URL for the thumbnail image.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataAiHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Hint (for Thumbnail search)</FormLabel>
                    <FormControl><Input placeholder="e.g., space galaxy" {...field} /></FormControl>
                     <FormDescription>Keywords for AI to find similar images if needed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categories"
                render={() => ( // No `field` needed directly, form.watch or form.getValues used internally
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                     <FormDescription>Select one or more categories for this video.</FormDescription>
                    {videoCategories.map((category) => (
                      <FormField
                        key={category.id}
                        control={form.control}
                        name="categories"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={category.id}
                              className="flex flex-row items-start space-x-3 space-y-0 mt-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(category.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    return checked
                                      ? field.onChange([...currentValue, category.id])
                                      : field.onChange(
                                          currentValue.filter(
                                            (value) => value !== category.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {category.name}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Feature this video?
                      </FormLabel>
                      <FormDescription>
                        If checked, this video may appear in the hero banner on the homepage.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || isLoadingVideo}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
