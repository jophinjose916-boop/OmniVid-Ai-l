'use server';
/**
 * @fileOverview A flow to generate an engaging voiceover script from a video prompt, supporting Malayalam and English.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScriptGenerationInputSchema = z.object({
  videoPrompt: z.string().describe('The prompt for the video.'),
  targetLanguage: z.enum(['malayalam', 'english']).describe('Target language for the script.'),
});
export type ScriptGenerationInput = z.infer<typeof ScriptGenerationInputSchema>;

const ScriptGenerationOutputSchema = z.object({
  script: z.string().describe('A short, engaging voiceover script (max 20 words).'),
});
export type ScriptGenerationOutput = z.infer<typeof ScriptGenerationOutputSchema>;

const scriptPrompt = ai.definePrompt({
  name: 'generateScriptPrompt',
  input: { schema: ScriptGenerationInputSchema },
  output: { schema: ScriptGenerationOutputSchema },
  prompt: `You are a poetic scriptwriter for short AI videos.
Based on this video vision: "{{{videoPrompt}}}", create a short, evocative narration script.

Target Language: {{targetLanguage}}

Guidelines:
1. Keep the script under 20 words.
2. If the language is Malayalam, use beautiful, cinematic Malayalam (മലയാളം) that sounds natural and poetic.
3. If the language is English, use atmospheric and engaging English.
4. Ensure the script matches the visual intent of the prompt.
5. If the input was in English but the target is Malayalam, translate the sentiment poetically.`,
});

export async function generateScript(input: ScriptGenerationInput): Promise<ScriptGenerationOutput> {
  const { output } = await scriptPrompt(input);
  if (!output) throw new Error('Failed to generate script.');
  return output;
}
