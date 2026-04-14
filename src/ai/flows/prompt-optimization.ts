'use server';
/**
 * @fileOverview This file defines a Genkit flow for optimizing user prompts into
 * AI-friendly English prompts suitable for video generation.
 *
 * - optimizePrompt - A function that handles the prompt optimization process.
 * - PromptOptimizationInput - The input type for the optimizePrompt function.
 * - PromptOptimizationOutput - The return type for the optimizePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PromptOptimizationInputSchema = z.object({
  userPrompt: z
    .string()
    .describe(
      'The user-provided prompt, which may be in any language, to be optimized for AI video generation.'
    ),
});
export type PromptOptimizationInput = z.infer<
  typeof PromptOptimizationInputSchema
>;

const PromptOptimizationOutputSchema = z.object({
  optimizedPrompt: z
    .string()
    .describe('The AI-friendly English version of the user prompt.'),
});
export type PromptOptimizationOutput = z.infer<
  typeof PromptOptimizationOutputSchema
>;

export async function optimizePrompt(
  input: PromptOptimizationInput
): Promise<PromptOptimizationOutput> {
  return promptOptimizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizePromptForVideo',
  input: {schema: PromptOptimizationInputSchema},
  output: {schema: PromptOptimizationOutputSchema},
  prompt: `You are an expert prompt engineer for AI video generation models. Your task is to take a user's raw prompt, which might be in any language, and transform it into a highly descriptive, AI-friendly English prompt.

The optimized prompt should be clear, concise, and contain specific details that would lead to a high-quality, visually rich video generation. Focus on visual elements, setting, mood, time of day, weather, and any specific subjects or actions.

If the input prompt is not in English, first translate it accurately, then proceed with optimization. Ensure the final output is in English and ready for a text-to-video AI model.

User Prompt: {{{userPrompt}}}`,
});

const promptOptimizationFlow = ai.defineFlow(
  {
    name: 'promptOptimizationFlow',
    inputSchema: PromptOptimizationInputSchema,
    outputSchema: PromptOptimizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to optimize prompt.');
    }
    return output;
  }
);
