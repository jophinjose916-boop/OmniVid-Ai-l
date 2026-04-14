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
  { id: 'Algenib', name: 'Wise Old Man', description: 'Deep, resonant, and professional tone' },
  { id: 'Hadrit', name: 'Mature Old Woman', description: 'Sophisticated, authoritative, and warm' },
  { id: 'Achernar', name: 'Soft Narrative Female', description: 'Graceful, calm, and evocative' },
  { id: 'Castor', name: 'Professional Male', description: 'Clear, modern, and energetic' },
  { id: 'Deneb', name: 'Innocent Child', description: 'Light, bright, and playful' },
];
