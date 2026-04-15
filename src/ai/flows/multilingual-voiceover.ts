'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating multilingual AI voiceovers from text input.
 * Supports both single speaker and multi-speaker (Combo) scenarios.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const MultilingualVoiceoverInputSchema = z.object({
  text: z.string().describe('The text to be converted into speech. For multi-speaker, use format "Speaker1: text... Speaker2: text..."'),
  voiceName: z.string().describe('The name of the primary prebuilt voice to use.'),
  secondaryVoiceName: z.string().optional().describe('The name of the secondary voice for combo mode.'),
  isMultiSpeaker: z.boolean().optional().describe('Whether to use multi-speaker configuration.'),
});
export type MultilingualVoiceoverInput = z.infer<typeof MultilingualVoiceoverInputSchema>;

const MultilingualVoiceoverOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe('The generated audio as a base64 encoded data URI in WAV format.'),
});
export type MultilingualVoiceoverOutput = z.infer<typeof MultilingualVoiceoverOutputSchema>;

export async function multilingualVoiceover(
  input: MultilingualVoiceoverInput
): Promise<MultilingualVoiceoverOutput> {
  return multilingualVoiceoverFlow(input);
}

const multilingualVoiceoverFlow = ai.defineFlow(
  {
    name: 'multilingualVoiceoverFlow',
    inputSchema: MultilingualVoiceoverInputSchema,
    outputSchema: MultilingualVoiceoverOutputSchema,
  },
  async (input) => {
    const config: any = {
      responseModalities: ['AUDIO'],
    };

    if (input.isMultiSpeaker && input.secondaryVoiceName) {
      config.speechConfig = {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {
              speaker: 'Speaker1',
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: input.voiceName },
              },
            },
            {
              speaker: 'Speaker2',
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: input.secondaryVoiceName },
              },
            },
          ],
        },
      };
    } else {
      config.speechConfig = {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: input.voiceName },
        },
      };
    }

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config,
      prompt: input.text,
    });

    if (!media) {
      throw new Error('No audio media returned from the TTS model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavAudioBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavAudioBase64,
    };
  }
);

/**
 * Converts PCM audio data to WAV format using dynamic import for the 'wav' module.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  const wavModule = await import('wav');
  const wav = (wavModule.default || wavModule) as any;
  
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d: any) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
