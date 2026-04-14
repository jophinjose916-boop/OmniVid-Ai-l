
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

/**
 * Helper to download a video from a URL and encode it as a data URI.
 */
async function fetchAndEncodeVideo(videoMediaPart: MediaPart): Promise<string> {
  if (!videoMediaPart.media || !videoMediaPart.media.url) {
    throw new Error('Video media part missing URL.');
  }

  const fetchModule = await import('node-fetch');
  const fetch = (fetchModule.default || fetchModule) as any;
  const videoDownloadUrl = `${videoMediaPart.media.url}&key=${process.env.GEMINI_API_KEY}`;
  
  const response = await fetch(videoDownloadUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }

  const buffer = await response.buffer();
  return `data:video/mp4;base64,${buffer.toString('base64')}`;
}

/**
 * Prompt to turn simple user descriptions into high-quality visual prompts.
 */
const optimizePromptForVideo = ai.definePrompt({
  name: 'optimizePromptForVideoVisuals',
  input: { schema: MultilingualVideoGenerationInputSchema },
  output: { 
    schema: z.object({ 
      optimizedPrompt: z.string().describe('An optimized English prompt.') 
    }) 
  },
  prompt: `You are an expert director specializing in AI cinematography.
Your task is to take a user's prompt (Malayalam or English) and expand it into a detailed visual description for Veo.

Expansion guidelines:
1. Describe textures, lighting, and atmosphere.
2. Define camera movement.

User Prompt: "{{{prompt}}}"
{{#if photoDataUri}}The user provided a photo. The video must start or evolve from this image.{{/if}}`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }
    ]
  }
});

const multilingualVideoGenerationFlow = ai.defineFlow(
  {
    name: 'multilingualVideoGenerationFlow',
    inputSchema: MultilingualVideoGenerationInputSchema,
    outputSchema: MultilingualVideoGenerationOutputSchema,
  },
  async (input) => {
    // 1. Optimize the prompt
    const { output } = await optimizePromptForVideo(input);
    const optimizedEnglishPrompt = output?.optimizedPrompt;
    
    if (!optimizedEnglishPrompt) {
        throw new Error('Failed to optimize prompt.');
    }

    // 2. Prepare content parts for Veo
    const promptParts: any[] = [{ text: optimizedEnglishPrompt }];
    if (input.photoDataUri) {
      promptParts.push({
        media: {
          url: input.photoDataUri,
          contentType: 'image/jpeg'
        }
      });
    }

    // 3. Generate Video using Veo
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'), 
      prompt: promptParts,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9'
      }
    });

    if (!operation) {
      throw new Error('Video generation failed to start.');
    }

    // 4. Wait for completion
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error(`Generation error: ${operation.error.message}`);
    }

    const videoMediaPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoMediaPart) {
      throw new Error('No video returned.');
    }

    // 5. Download and return as data URI
    const videoDataUri = await fetchAndEncodeVideo(videoMediaPart);
    return { videoDataUri };
  }
);

export async function multilingualVideoGeneration(
  input: MultilingualVideoGenerationInput
): Promise<MultilingualVideoGenerationOutput> {
  return multilingualVideoGenerationFlow(input);
}
