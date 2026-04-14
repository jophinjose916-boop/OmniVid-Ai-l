
'use server';
/**
 * @fileOverview A Genkit flow for generating high-quality videos from text prompts in multiple languages.
 *
 * - multilingualVideoGeneration - A function that handles the video generation process from a text prompt.
 * - MultilingualVideoGenerationInput - The input type for the multilingualVideoGeneration function.
 * - MultilingualVideoGenerationOutput - The return type for the multilingualVideoGeneration function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { MediaPart } from 'genkit';
import fetch from 'node-fetch';

// 1. Define Input Schema
const MultilingualVideoGenerationInputSchema = z.object({
  prompt: z.string().describe('The text prompt for video generation, in any language.'),
});
export type MultilingualVideoGenerationInput = z.infer<typeof MultilingualVideoGenerationInputSchema>;

// 2. Define Output Schema
const MultilingualVideoGenerationOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "The generated video as a data URI that must include a MIME type (video/mp4) and use Base64 encoding. Expected format: 'data:video/mp4;base64,<encoded_data>'."
    ),
});
export type MultilingualVideoGenerationOutput = z.infer<typeof MultilingualVideoGenerationOutputSchema>;

// Helper function to fetch and base64 encode the video
async function fetchAndEncodeVideo(videoMediaPart: MediaPart): Promise<string> {
  if (!videoMediaPart.media || !videoMediaPart.media.url) {
    throw new Error('Video media part missing URL.');
  }

  const videoDownloadUrl = `${videoMediaPart.media.url}&key=${process.env.GEMINI_API_KEY}`;
  if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY environment variable is not set. Video download might fail.");
  }

  const response = await fetch(videoDownloadUrl);

  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch video from URL: ${videoDownloadUrl}, status: ${response.status}`);
  }

  const chunks: Buffer[] = [];
  for await (const chunk of response.body as any) {
    chunks.push(chunk as Buffer);
  }
  const videoBuffer = Buffer.concat(chunks);

  return `data:video/mp4;base64,${videoBuffer.toString('base64')}`;
}


// Define the prompt for translating and optimizing the user's prompt
const optimizePromptForVideo = ai.definePrompt({
  name: 'optimizePromptForVideo',
  input: { schema: MultilingualVideoGenerationInputSchema },
  output: { schema: z.string().describe('An optimized English prompt suitable for video generation.') },
  prompt: `You are an AI assistant specialized in optimizing text prompts for video generation models.\nThe user will provide a text prompt in any language. Your task is to:\n1. Translate the prompt into clear, concise, and descriptive English.\n2. Optimize the English prompt to be "AI-friendly" for a video generation model. This means focusing on visual elements, actions, and key subjects, avoiding ambiguity, and suggesting artistic styles if appropriate.\n3. Ensure the optimized prompt is ready to be directly fed into a video generation API.\n\nOriginal Prompt: "{{{prompt}}}"\n\nOptimized English Prompt:`,
});


// Define the main Genkit flow
const multilingualVideoGenerationFlow = ai.defineFlow(
  {
    name: 'multilingualVideoGenerationFlow',
    inputSchema: MultilingualVideoGenerationInputSchema,
    outputSchema: MultilingualVideoGenerationOutputSchema,
  },
  async (input) => {
    // Step 1: Optimize and translate the user's prompt to English
    const { output: optimizedEnglishPrompt } = await optimizePromptForVideo(input);
    if (!optimizedEnglishPrompt) {
        throw new Error('Failed to optimize and translate the prompt.');
    }

    // Step 2: Generate video using Veo model
    let { operation } = await ai.generate({
      model: googleAI.model('veo-3.0-generate-preview'), 
      prompt: optimizedEnglishPrompt,
      config: {
      },
    });

    if (!operation) {
      throw new Error('Expected the video generation model to return an operation.');
    }

    // Wait until the operation completes
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error(`Failed to generate video: ${operation.error.message}`);
    }

    const videoMediaPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoMediaPart) {
      throw new Error('Failed to find the generated video in the operation output.');
    }

    // Step 3: Fetch the generated video and encode it as a data URI
    const videoDataUri = await fetchAndEncodeVideo(videoMediaPart);

    return { videoDataUri };
  }
);

// Exported wrapper function
export async function multilingualVideoGeneration(
  input: MultilingualVideoGenerationInput
): Promise<MultilingualVideoGenerationOutput> {
  return multilingualVideoGenerationFlow(input);
}
