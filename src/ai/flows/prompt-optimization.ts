'use server';
/**
 * @fileOverview This file defines a Genkit flow for optimizing user prompts into
 * AI-friendly English prompts suitable for video generation, with a focus on Malayalam and English.
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
      'The user-provided prompt, primarily in Malayalam or English, to be optimized for AI video generation.'
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
  prompt: `You are an expert prompt engineer for AI video generation models, specializing in translating and expanding prompts from Malayalam and English into high-quality, cinematic English video prompts.

Your task is to:
1. If the input is in Malayalam (മലയാളം), accurately translate the core concept to English.
2. Expand the prompt with specific visual details: camera angles, lighting (e.g., golden hour, cinematic shadows), textures, and atmospheric effects.
3. Ensure the tone is evocative and clear.
4. Keep the final output in English, as it's the native language for the video generation model.

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
