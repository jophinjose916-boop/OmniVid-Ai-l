'use server';
/**
 * @fileOverview Universal 4K Video Generation Flow.
 * Supports any language input, image editing, and extended cinematic rendering.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const MultilingualVideoGenerationInputSchema = z.object({
  prompt: z.string().describe('The text prompt in any language for video generation.'),
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
  
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  const videoDownloadUrl = `${videoMediaUrl}&key=${apiKey}`;
  
  const response = await fetch(videoDownloadUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.buffer();
  return `data:video/mp4;base64,${buffer.toString('base64')}`;
}

/**
 * Visual Masterplan Prompt for any language input.
 */
const optimizePromptForVideo = ai.definePrompt({
  name: 'optimizePromptForVideoVisuals',
  input: { schema: MultilingualVideoGenerationInputSchema },
  output: { 
    schema: z.object({ 
      optimizedPrompt: z.string().describe('An optimized English cinematic prompt.') 
    }) 
  },
  prompt: `You are an expert AI Video Director.
Take this user input (in any language) and convert it into a detailed visual masterplan for a high-end AI video model.

Rules:
1. Expand the prompt with specific textures, cinematic lighting (e.g. volumetric, golden hour), and dynamic camera movement (e.g. slow zoom, drone sweep).
2. If the input is non-English, preserve the exact poetic sentiment and translate accurately to English.
3. Focus on high-fidelity visual elements suitable for a 4K render.
4. If an image is provided, describe how the static image transitions into a fluid cinematic scene.

User Prompt: "{{{prompt}}}"
{{#if photoDataUri}}Context: This is an AI Photo Editing session. The image must come to life.{{/if}}
{{#if is4K}}Mode: Ultra-High Definition 4K.{{/if}}`,
});

const multilingualVideoGenerationFlow = ai.defineFlow(
  {
    name: 'multilingualVideoGenerationFlow',
    inputSchema: MultilingualVideoGenerationInputSchema,
    outputSchema: MultilingualVideoGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await optimizePromptForVideo(input);
    const optimizedString = output?.optimizedPrompt;
    
    if (!optimizedString) {
        throw new Error('Failed to optimize prompt. Model returned no result.');
    }

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

    try {
      let { operation } = await ai.generate({
        model: googleAI.model('veo-3.0-generate-preview'), 
        prompt: promptParts,
        config: {
          aspectRatio: '16:9',
          safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          ]
        }
      });

      if (!operation) {
        throw new Error('Video generation failed to start.');
      }

      let attempts = 0;
      const maxAttempts = 24; 
      while (!operation.done && attempts < maxAttempts) {
        operation = await ai.checkOperation(operation);
        if (operation.done) break;
        await new Promise((resolve) => setTimeout(resolve, 5000));
        attempts++;
      }

      if (!operation.done) {
        throw new Error('Video generation timed out.');
      }

      if (operation.error) {
        throw new Error(`Generation error: ${operation.error.message}`);
      }

      const videoMediaPart = operation.output?.message?.content.find((p) => !!p.media);
      if (!videoMediaPart || !videoMediaPart.media?.url) {
        throw new Error('No video returned from the model.');
      }

      const videoDataUri = await fetchAndEncodeVideo(videoMediaPart.media.url);
      return { videoDataUri };
    } catch (error: any) {
      // Specialized error handling for billing issues
      if (error.message?.includes('billing enabled') || error.message?.includes('GCP billing')) {
        throw new Error('Billing Required: The 4K Video engine requires a Google Cloud billing account. Please enable billing in your Google Cloud Console to start your 30-min cinematic rendering session.');
      }
      throw error;
    }
  }
);

export async function multilingualVideoGeneration(
  input: MultilingualVideoGenerationInput
): Promise<MultilingualVideoGenerationOutput> {
  return multilingualVideoGenerationFlow(input);
}
