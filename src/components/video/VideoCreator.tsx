
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Wand2, Play, Download, Share2, Languages, Volume2, Loader2, Zap } from 'lucide-react';
import { optimizePrompt } from '@/ai/flows/prompt-optimization';
import { multilingualVideoGeneration } from '@/ai/flows/multilingual-video-generation';
import { multilingualVoiceover } from '@/ai/flows/multilingual-voiceover';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VOICES } from '@/lib/types';

export function VideoCreator() {
  const [userPrompt, setUserPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!userPrompt.trim()) return;
    setIsOptimizing(true);
    try {
      const result = await optimizePrompt({ userPrompt });
      setOptimizedPrompt(result.optimizedPrompt);
      toast({ title: "Prompt Optimized", description: "Your prompt is now ready for high-quality video generation." });
    } catch (error) {
      toast({ variant: "destructive", title: "Optimization Failed", description: "Please try again later." });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerate = async () => {
    const promptToUse = optimizedPrompt || userPrompt;
    if (!promptToUse.trim()) return;
    
    setIsGenerating(true);
    try {
      // Step 1: Video Generation
      const videoResult = await multilingualVideoGeneration({ prompt: promptToUse });
      setVideoUrl(videoResult.videoDataUri);
      
      // Step 2: Voiceover (Simulated as extra feature)
      // Only generate voiceover if there's enough descriptive text in user prompt
      if (userPrompt.length > 20) {
        try {
          const audioResult = await multilingualVoiceover({ text: userPrompt, voiceName: selectedVoice });
          setAudioUrl(audioResult.audioDataUri);
        } catch (e) {
          console.warn("Voiceover generation failed, continuing with video only.");
        }
      }
      
      toast({ title: "Generation Complete!", description: "Your AI video is ready." });
    } catch (error) {
      toast({ variant: "destructive", title: "Generation Failed", description: "High traffic detected. Please try the Fast Pass queue." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Describe your video in any language
          </label>
          <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3 fill-primary" />
            Unlimited Standard Mode Active
          </div>
        </div>
        
        <div className="relative">
          <Textarea
            placeholder="e.g., A flying tiger over the neon streets of Mumbai at sunset, cinematic lighting, 8k..."
            className="min-h-[120px] bg-card/50 border-white/10 focus:ring-primary text-lg resize-none pr-32"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
          />
          <div className="absolute right-3 bottom-3 flex gap-2">
             <Button 
              size="sm" 
              variant="secondary" 
              onClick={handleOptimize} 
              disabled={isOptimizing || !userPrompt}
              className="gap-2"
            >
              {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              Optimize
            </Button>
          </div>
        </div>

        {optimizedPrompt && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 animate-in zoom-in-95 duration-300">
            <div className="text-xs font-bold text-primary flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              AI-OPTIMIZED PROMPT (ENGLISH)
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed italic">
              "{optimizedPrompt}"
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="aspect-video relative overflow-hidden bg-muted flex items-center justify-center group">
            {videoUrl ? (
              <>
                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                {audioUrl && <audio src={audioUrl} autoPlay className="hidden" />}
              </>
            ) : isGenerating ? (
              <div className="text-center space-y-4">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <div className="absolute inset-0 blur-xl gradient-bg opacity-30 animate-pulse-subtle"></div>
                </div>
                <p className="text-muted-foreground animate-pulse">Generating your masterpiece...</p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground space-y-2 px-8">
                <Play className="w-12 h-12 mx-auto opacity-20" />
                <p>Your generated video will appear here</p>
              </div>
            )}
          </Card>
          
          <div className="flex gap-4">
            <Button 
              className="flex-1 gradient-bg text-white h-12 text-lg font-headline font-bold hover:opacity-90 transition-opacity"
              onClick={handleGenerate}
              disabled={isGenerating || !userPrompt}
            >
              {isGenerating ? "GENERATING..." : "GENERATE VIDEO"}
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12" disabled={!videoUrl}>
              <Download className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12" disabled={!videoUrl}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Voiceover Settings
            </h3>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="w-full bg-card/50 border-white/10">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                {VOICES.map(voice => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex flex-col">
                      <span>{voice.name}</span>
                      <span className="text-[10px] opacity-60">{voice.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-card/30 border-white/5">
            <CardContent className="p-4 space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Queue Status</h4>
              <div className="flex items-center justify-between text-sm">
                <span>Standard Queue</span>
                <span className="text-primary font-medium">~5 mins</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary w-2/3 h-full animate-pulse-subtle"></div>
              </div>
              <Button variant="link" className="text-xs p-0 h-auto text-secondary hover:text-secondary/80">
                Watch an ad for Instant Pass →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
