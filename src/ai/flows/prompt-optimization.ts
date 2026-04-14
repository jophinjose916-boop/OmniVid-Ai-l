'use server';
/**
 * @fileOverview Universal prompt optimizer. 
 * Detects and translates any input language into high-fidelity cinematic English for the video model.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PromptOptimizationInputSchema = z.object({
  userPrompt: z
    .string()
    .describe(
      'The user-provided prompt in any language (Malayalam, English, German, or any other) to be optimized for AI video generation.'
    ),
});
export type PromptOptimizationInput = z.infer<typeof PromptOptimizationInputSchema>;

const PromptOptimizationOutputSchema = z.object({
  optimizedPrompt: z
    .string()
    .describe('The AI-friendly English version of the user prompt, expanded with cinematic details.'),
});
export type PromptOptimizationOutput = z.infer<typeof PromptOptimizationOutputSchema>;

const optimizePromptForVideo = ai.definePrompt({
  name: 'optimizePromptForVideo',
  input: { schema: PromptOptimizationInputSchema },
  output: { schema: PromptOptimizationOutputSchema },
  prompt: `You are a world-class AI Cinematographer.
Your task is to take a user's prompt (provided in any language—Malayalam, German, English, Hindi, etc.) and expand it into a detailed, cinematic English visual masterplan for an AI video generator.

Expansion Guidelines:
1. Universal Translation: If the input is not in English, accurately translate the core poetic intent to English first.
2. Cinematic Detail: Add specific visual instructions for textures, volumetric lighting, atmospheric conditions, and camera techniques (e.g., anamorphic flares, 65mm drone sweep).
3. 30-Minute Context: Describe the scene in a way that supports an extended, immersive cinematic sequence.
4. Output: Always provide the final optimized prompt in English.

User Input: "{{{userPrompt}}}"`,
});

export async function optimizePrompt(
  input: PromptOptimizationInput
): Promise<PromptOptimizationOutput> {
  const { output } = await optimizePromptForVideo(input);
  if (!output) {
    throw new Error('Failed to optimize prompt.');
  }
  return output;
}
