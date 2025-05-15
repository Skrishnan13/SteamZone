'use server';

/**
 * @fileOverview A game recommendation AI agent.
 *
 * - generateGameRecommendations - A function that generates game recommendations based on user history.
 * - GenerateGameRecommendationsInput - The input type for the generateGameRecommendations function.
 * - GenerateGameRecommendationsOutput - The return type for the generateGameRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGameRecommendationsInputSchema = z.object({
  userRatingHistory: z
    .string()
    .describe("A string containing the user's game rating history. Each game should be on a new line following the format: Game Title - Rating (1-5)."),
});
export type GenerateGameRecommendationsInput = z.infer<typeof GenerateGameRecommendationsInputSchema>;

const GenerateGameRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of game recommendations based on the user rating history.'),
});
export type GenerateGameRecommendationsOutput = z.infer<typeof GenerateGameRecommendationsOutputSchema>;

export async function generateGameRecommendations(input: GenerateGameRecommendationsInput): Promise<GenerateGameRecommendationsOutput> {
  return generateGameRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGameRecommendationsPrompt',
  input: {schema: GenerateGameRecommendationsInputSchema},
  output: {schema: GenerateGameRecommendationsOutputSchema},
  prompt: `You are an expert game recommender. Given a user's game rating history, you will provide a list of personalized game recommendations that the user might enjoy.\n\nUser Rating History:\n{{{userRatingHistory}}}\n\nRecommendations:`,
});

const generateGameRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateGameRecommendationsFlow',
    inputSchema: GenerateGameRecommendationsInputSchema,
    outputSchema: GenerateGameRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
