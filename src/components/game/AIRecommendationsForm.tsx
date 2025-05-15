"use client";

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateGameRecommendations, type GenerateGameRecommendationsInput } from '@/ai/flows/generate-game-recommendations';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserRatingHistoryString } from '@/data/mock'; // For pre-filling

const recommendationsFormSchema = z.object({
  userRatingHistory: z.string().min(10, "Please provide some game ratings.").max(2000, "Input too long."),
});

type RecommendationsFormData = z.infer<typeof recommendationsFormSchema>;

export function AIRecommendationsForm() {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<RecommendationsFormData>({
    resolver: zodResolver(recommendationsFormSchema),
    defaultValues: {
      userRatingHistory: '',
    },
  });
  
  useEffect(() => {
    // Pre-fill with some mock user history for demonstration
    async function fetchMockHistory() {
      const mockHistory = await getUserRatingHistoryString('guest-user-for-ai'); // Use a consistent mock user ID
      form.setValue('userRatingHistory', mockHistory);
    }
    fetchMockHistory();
  }, [form]);


  const onSubmit: SubmitHandler<RecommendationsFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const input: GenerateGameRecommendationsInput = { userRatingHistory: data.userRatingHistory };
      const result = await generateGameRecommendations(input);
      setRecommendations(result.recommendations);
      toast({
        title: "Recommendations Generated!",
        description: "AI has found some games you might like.",
      });
    } catch (e) {
      console.error("AI Recommendation error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate recommendations: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Could not generate recommendations. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Wand2 className="h-6 w-6 text-accent" />
              AI Game Recommender
            </CardTitle>
            <CardDescription>
              Tell us about games you've liked or disliked, and our AI will suggest new ones for you!
              Provide each game on a new line, like: "Game Title - Rating (1-5)".
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="userRatingHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="userRatingHistory" className="font-semibold">Your Game Rating History</FormLabel>
                  <FormControl>
                    <Textarea
                      id="userRatingHistory"
                      placeholder="e.g.\nCyberpunk 2077 - 5\nThe Witcher 3 - 5\nStardew Valley - 4"
                      {...field}
                      rows={8}
                      className="resize-y min-h-[150px] bg-background/70"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Get Recommendations"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>

      {recommendations && !isLoading && (
        <Card className="mt-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Your AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed p-4 bg-background rounded-md shadow ring-1 ring-border">
              {recommendations}
            </pre>
          </CardContent>
        </Card>
      )}
    </Card>
  );
}
