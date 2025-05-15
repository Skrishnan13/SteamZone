"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Rating } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RatingStars } from '@/components/RatingStars';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const ratingFormSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  comment: z.string().max(500, "Comment must be 500 characters or less.").optional(),
});

type RatingFormData = z.infer<typeof ratingFormSchema>;

interface GameRatingFormProps {
  gameId: string;
  onRatingSubmitted: (newRating: Rating) => void;
}

export function GameRatingForm({ gameId, onRatingSubmitted }: GameRatingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<RatingFormData>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit: SubmitHandler<RatingFormData> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newRating: Rating = {
      userId: `guest-${Math.random().toString(36).substring(7)}`, // Simple guest ID
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date(),
    };

    onRatingSubmitted(newRating); // Callback to update parent state
    
    toast({
      title: "Rating Submitted!",
      description: "Thank you for your feedback.",
      variant: "default",
    });
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle>Rate this Game</CardTitle>
        <CardDescription>Share your thoughts and help others discover great games.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Your Rating</FormLabel>
                  <FormControl>
                    <RatingStars
                      rating={field.value}
                      onRatingChange={(newRating) => field.onChange(newRating)}
                      interactive
                      size={32} // Larger stars for interaction
                      className="py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what you think about the game..."
                      {...field}
                      rows={4}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || form.getValues("rating") === 0} className="w-full sm:w-auto" size="lg">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Rating"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
