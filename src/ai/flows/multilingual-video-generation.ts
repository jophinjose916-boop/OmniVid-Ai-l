
'use server';
/**
 * @fileOverview A Genkit flow for generating high-quality videos from text prompts and optional image references.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { MediaPart } from 'genkit';

const MultilingualVideoGenerationInputSchema = z.object({
  prompt: z.string().describe('The text prompt for video generation.'),
  photoDataUri: z.string().optional().describe('An optional photo reference as a data URI.'),
});
export type MultilingualVideoGenerationInput = z.infer<typeof MultilingualVideoGenerationInputSchema>;

const MultilingualVideoGenerationOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "The generated video as a data URI (video/mp4)."
    ),
});
export type MultilingualVideoGenerationOutput = z.infer<typeof MultilingualVideoGenerationOutputSchema>;

async function fetchAndEncodeVideo(videoMediaPart: MediaPart): Promise<string> {
  if (!videoMediaPart.media || !videoMediaPart.media.url) {
    throw new Error('Video media part missing URL.');
  }

  const fetch = (await import('node-fetch')).default;
  const videoDownloadUrl = `${videoMediaPart.media.url}&key=${process.env.GEMINI_API_KEY}`;
  
  const response = await fetch(videoDownloadUrl);

  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }

  const buffer = await response.buffer();
  return `data:video/mp4;base64,${buffer.toString('base64')}`;
}

const optimizePromptForVideo = ai.definePrompt({
  name: 'optimizePromptForVideo',
  input: { schema: MultilingualVideoGenerationInputSchema },
  output: { schema: z.string().describe('An optimized English prompt.') },
  prompt: `You are an AI assistant specialized in optimizing text prompts for video generation models.
Translate the following prompt to English if needed and expand it with visual details, mood, and lighting.
Original Prompt: "{{{prompt}}}"`,
});

const multilingualVideoGenerationFlow = ai.defineFlow(
  {
    name: 'multilingualVideoGenerationFlow',
    inputSchema: MultilingualVideoGenerationInputSchema,
    outputSchema: MultilingualVideoGenerationOutputSchema,
  },
  async (input) => {
    const { output: optimizedEnglishPrompt } = await optimizePromptForVideo(input);
    if (!optimizedEnglishPrompt) {
        throw new Error('Failed to optimize prompt.');
    }

    const promptParts: any[] = [{ text: optimizedEnglishPrompt }];
    if (input.photoDataUri) {
      promptParts.push({
        media: {
          url: input.photoDataUri,
          contentType: 'image/jpeg'
        }
      });
    }

    let { operation } = await ai.generate({
      // Using veo-2.0 for better image-to-video reliability
      model: googleAI.model('veo-2.0-generate-001'), 
      prompt: promptParts,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9'
      }
    });

    if (!operation) {
      throw new Error('Expected operation from model.');
    }

    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error(`Generation failed: ${operation.error.message}`);
    }

    const videoMediaPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoMediaPart) {
      throw new Error('No video in output.');
    }

    const videoDataUri = await fetchAndEncodeVideo(videoMediaPart);
    return { videoDataUri };
  }
);

export async function multilingualVideoGeneration(
  input: MultilingualVideoGenerationInput
): Promise<MultilingualVideoGenerationOutput> {
  return multilingualVideoGenerationFlow(input);
}
