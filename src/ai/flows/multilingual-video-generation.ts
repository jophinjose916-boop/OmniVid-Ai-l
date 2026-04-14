'use server';
/**
 * @fileOverview A Genkit flow for generating high-quality videos from text prompts and optional image references.
 * Optimized for extended cinematic duration and robust schema handling, supporting Malayalam, English, and German.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const MultilingualVideoGenerationInputSchema = z.object({
  prompt: z.string().describe('The text prompt for video generation.'),
  photoDataUri: z.string().optional().describe('An optional photo reference as a data URI.'),
  is4K: z.boolean().optional().describe('Whether to generate in high-fidelity 4K mode.'),
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
async function fetchAndEncodeVideo(videoMediaUrl: string): Promise<string> {
  const fetchModule = await import('node-fetch');
  const fetch = (fetchModule.default || fetchModule) as any;
  const videoDownloadUrl = `${videoMediaUrl}&key=${process.env.GEMINI_API_KEY}`;
  
  const response = await fetch(videoDownloadUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }

  const buffer = await response.buffer();
  return `data:video/mp4;base64,${buffer.toString('base64')}`;
}

/**
 * Prompt to turn simple user descriptions into high-quality visual prompts for extended cinematic sessions.
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
Your task is to take a user's prompt (Malayalam, German, or English) and expand it into a detailed visual description for a high-end AI video model.

Expansion guidelines:
1. Describe textures, lighting (cinematic, volumetric), and atmosphere in great detail.
2. Define camera movement (e.g., slow pan, drone sweep) suitable for an extended cinematic session.
3. If input is in Malayalam (മലയാളം) or German (Deutsch), translate the core intent to poetic English first.
4. Ensure the vision supports an extended, slow-paced cinematic sequence.

User Prompt: "{{{prompt}}}"
{{#if photoDataUri}}The user provided a photo. The video must start from or be heavily inspired by this image.{{/if}}
{{#if is4K}}Mode: Ultra High Fidelity 4K Cinematic mode.{{/if}}`,
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
    // 1. Optimize the prompt using the structured object result
    const { output } = await optimizePromptForVideo(input);
    const optimizedString = output?.optimizedPrompt;
    
    if (!optimizedString) {
        throw new Error('Failed to optimize prompt. Model returned no result.');
    }

    // 2. Prepare content parts for Veo
    const promptParts: any[] = [{ text: optimizedString }];
    if (input.photoDataUri) {
      const mimeType = input.photoDataUri.split(';')[0].split(':')[1] || 'image/jpeg';
      promptParts.push({
        media: {
          url: input.photoDataUri,
          contentType: mimeType
        }
      });
    }

    // 3. Generate Video using Veo with maximum allowed duration
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'), 
      prompt: promptParts,
      config: {
        durationSeconds: 8,
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
    if (!videoMediaPart || !videoMediaPart.media?.url) {
      throw new Error('No video returned from the model.');
    }

    // 5. Download and return as data URI
    const videoDataUri = await fetchAndEncodeVideo(videoMediaPart.media.url);
    return { videoDataUri };
  }
);

export async function multilingualVideoGeneration(
  input: MultilingualVideoGenerationInput
): Promise<MultilingualVideoGenerationOutput> {
  return multilingualVideoGenerationFlow(input);
}
