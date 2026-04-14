
'use server';
/**
 * @fileOverview A flow to generate a voiceover script from a video prompt.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScriptGenerationInputSchema = z.object({
  videoPrompt: z.string().describe('The prompt for the video.'),
  language: z.enum(['malayalam', 'english']).default('malayalam').describe('Target language for the script.'),
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
  prompt: `You are an expert scriptwriter for short AI videos.
Create a short, poetic, and engaging voiceover script based on this video prompt: "{{{videoPrompt}}}".
The script should be in {{language}}. Keep it under 20 words.
If the language is Malayalam, use clear and evocative Malayalam (മലയാളം).`,
});

export async function generateScript(input: ScriptGenerationInput): Promise<ScriptGenerationOutput> {
  const { output } = await scriptPrompt(input);
  if (!output) throw new Error('Failed to generate script.');
  return output;
}
