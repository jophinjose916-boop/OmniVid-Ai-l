'use server';
/**
 * @fileOverview Optimizes user prompts into AI-friendly cinematic English descriptions.
 * Handles both Malayalam and English inputs, ensuring the core intent is preserved
 * while expanding on visual details for the video generation model.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PromptOptimizationInputSchema = z.object({
  userPrompt: z
    .string()
    .describe(
      'The user-provided prompt, in Malayalam or English, to be optimized for AI video generation.'
    ),
});
export type PromptOptimizationInput = z.infer<typeof PromptOptimizationInputSchema>;

const PromptOptimizationOutputSchema = z.object({
  optimizedPrompt: z
    .string()
    .describe('The AI-friendly English version of the user prompt.'),
});
export type PromptOptimizationOutput = z.infer<typeof PromptOptimizationOutputSchema>;

const optimizePromptForVideo = ai.definePrompt({
  name: 'optimizePromptForVideo',
  input: { schema: PromptOptimizationInputSchema },
  output: { schema: PromptOptimizationOutputSchema },
  prompt: `You are an expert director and prompt engineer for AI video models.
Your task is to take a user's prompt (which may be in Malayalam or English) and expand it into a detailed, cinematic English visual description for an AI video generator.

Guidelines:
1. If the input is in Malayalam (മലയാളം), translate the core concept accurately to English first.
2. Expand the prompt with specific visual details: textures, lighting (e.g., volumetric rays, golden hour), camera movement (e.g., slow drone sweep, cinematic pan), and atmospheric effects.
3. Keep the output in English, as it is the native language for the video model.
4. Ensure the visual style is cinematic and high-fidelity.

User Prompt: "{{{userPrompt}}}"`,
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
