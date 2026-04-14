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
  { id: 'Algenib', name: 'Algenib', description: 'Deep & Professional (Multi-lingual)' },
  { id: 'Achernar', name: 'Achernar', description: 'Soft & Narrative (Multi-lingual)' },
  { id: 'Castor', name: 'Castor', description: 'Energetic & Bright (Multi-lingual)' },
  { id: 'Deneb', name: 'Deneb', description: 'Calm & Friendly (Multi-lingual)' },
];
