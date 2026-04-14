
export interface VideoMetadata {
  id: string;
  prompt: string;
  optimizedPrompt?: string;
  videoUrl: string;
  audioUrl?: string;
  createdAt: number;
  status: 'processing' | 'completed' | 'failed';
  language: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
}

export const VOICES: VoiceOption[] = [
  { id: 'Algenib', name: 'Algenib', description: 'Deep & Professional' },
  { id: 'Achernar', name: 'Achernar', description: 'Soft & Narrative' },
  { id: 'Castor', name: 'Castor', description: 'Energetic & Bright' },
  { id: 'Deneb', name: 'Deneb', description: 'Calm & Friendly' },
];
