"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Wand2, Play, Download, Languages, Volume2, Loader2, Zap, ImagePlus, X, Mic2, Globe, ShieldCheck, Clock } from 'lucide-react';
import { optimizePrompt } from '@/ai/flows/prompt-optimization';
import { multilingualVideoGeneration } from '@/ai/flows/multilingual-video-generation';
import { multilingualVoiceover } from '@/ai/flows/multilingual-voiceover';
import { generateScript } from '@/ai/flows/voiceover-script-flow';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VOICES } from '@/lib/types';
import { useUser, useFirestore, useAuth, initiateAnonymousSignIn, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function VideoCreator() {
  const [userPrompt, setUserPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [voiceScript, setVoiceScript] = useState('');
  const [scriptLanguage, setScriptLanguage] = useState<'malayalam' | 'english' | 'german'>('malayalam');
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [is4K, setIs4K] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
        toast({ title: "Photo Reference Added", description: "AI will now use this photo for 30-minute cinematic editing." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptimize = async () => {
    if (!userPrompt.trim()) return;
    setIsOptimizing(true);
    setIsGeneratingScript(true);
    try {
      const result = await optimizePrompt({ userPrompt });
      setOptimizedPrompt(result.optimizedPrompt);
      
      const scriptRes = await generateScript({ 
        videoPrompt: userPrompt, 
        targetLanguage: scriptLanguage 
      });
      setVoiceScript(scriptRes.script);
      
      toast({ title: "30-Min Vision Optimized", description: "Cinematic direction and narration script updated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Optimization Failed", description: "Could not refine the prompt." });
    } finally {
      setIsOptimizing(false);
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateVoice = async () => {
    if (!voiceScript.trim()) {
      toast({ variant: "destructive", title: "No script", description: "Please enter a script for the voiceover." });
      return;
    }
    setIsGeneratingVoice(true);
    try {
      const result = await multilingualVoiceover({ text: voiceScript, voiceName: selectedVoice });
      setAudioUrl(result.audioDataUri);
      toast({ title: "Voice Ready", description: "Narration audio generated successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Voiceover Failed", description: "Could not generate audio." });
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const handleGenerate = async () => {
    const promptToUse = optimizedPrompt || userPrompt;
    if (!promptToUse.trim() || !user || !db) return;
    
    setIsGenerating(true);
    setVideoUrl('');

    try {
      const videoResult = await multilingualVideoGeneration({ 
        prompt: promptToUse,
        photoDataUri: photoDataUri || undefined,
        is4K
      });
      const finalVideoUrl = videoResult.videoDataUri;
      setVideoUrl(finalVideoUrl);
      
      const videoId = crypto.randomUUID();
      const videoRef = doc(db, 'users', user.uid, 'videos', videoId);
      
      setDocumentNonBlocking(videoRef, {
        id: videoId,
        userId: user.uid,
        originalPrompt: userPrompt,
        optimizedPrompt: optimizedPrompt || userPrompt,
        status: 'completed',
        storageUrl: finalVideoUrl,
        thumbnailUrl: `https://picsum.photos/seed/${videoId}/600/400`,
        createdAt: new Date().toISOString(),
      }, { merge: true });
      
      toast({ title: "30-Min Masterpiece Ready!", description: "Your extended 4K cinematic render is complete." });
    } catch (error) {
      toast({ variant: "destructive", title: "Generation Failed", description: "Please check your prompt and try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Languages className="w-4 h-4" />
                Prompt (മലയാളം / EN / DE)
              </label>
              <div className="flex items-center gap-3">
                 <div className="flex items-center space-x-2">
                  <Switch id="4k-mode" checked={is4K} onCheckedChange={setIs4K} />
                  <Label htmlFor="4k-mode" className="text-[10px] font-bold uppercase tracking-tighter cursor-pointer flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    30-Min 4K Mode
                  </Label>
                </div>
                {photoDataUri && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 animate-pulse">
                    AI PHOTO EDITING
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="relative">
              <Textarea
                placeholder="Describe your scene... e.g., ഒരു മനോഹരമായ സൂര്യാസ്തമയം / A beautiful sunset / Ein schöner Sonnenuntergang..."
                className="min-h-[140px] bg-card/50 border-white/10 focus:ring-primary text-lg resize-none pr-32"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              <div className="absolute right-3 bottom-3">
                 <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={handleOptimize} 
                  disabled={isOptimizing || !userPrompt}
                  className="gap-2 font-bold shadow-lg"
                >
                  {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  AI Refine
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!photoDataUri ? (
                <Button 
                  variant="outline" 
                  className="border-dashed h-24 w-full flex-col gap-2 hover:bg-primary/5 transition-colors group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="w-6 h-6 opacity-50 group-hover:scale-110 transition-transform" />
                  <span className="text-xs opacity-50 font-medium">Add Photo Reference (Optional)</span>
                </Button>
              ) : (
                <div className="relative h-24 w-40 rounded-lg overflow-hidden border-2 border-primary/50 group shadow-lg">
                  <img src={photoDataUri} alt="Reference" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => setPhotoDataUri(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>

            {optimizedPrompt && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 animate-in zoom-in-95 duration-300">
                <div className="text-xs font-bold text-primary flex items-center justify-between uppercase tracking-tight">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    AI Vision Masterplan (30-Min Session)
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-secondary" />
                    <span className="text-[10px] text-secondary">Extended Render Enabled</span>
                  </div>
                </div>
                <Textarea 
                  value={optimizedPrompt}
                  onChange={(e) => setOptimizedPrompt(e.target.value)}
                  className="text-sm bg-transparent border-none p-0 focus-visible:ring-0 min-h-[60px] resize-none text-foreground/80 italic leading-relaxed"
                />
              </div>
            )}
          </div>

          <Card className="aspect-video relative overflow-hidden bg-muted flex items-center justify-center group border-white/5 shadow-2xl rounded-2xl ring-1 ring-white/10">
            {videoUrl ? (
              <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
            ) : isGenerating ? (
              <div className="text-center space-y-4">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <div className="absolute inset-0 blur-xl gradient-bg opacity-30 animate-pulse"></div>
                </div>
                <p className="text-muted-foreground animate-pulse font-headline font-bold">Rendering Extended 30-Min 4K Video...</p>
                <p className="text-[10px] text-muted-foreground opacity-60">High-bitrate cinematic processing</p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground space-y-2 px-8">
                <Play className="w-12 h-12 mx-auto opacity-10" />
                <p className="font-headline text-lg opacity-40">30-Min Extended Preview</p>
              </div>
            )}
          </Card>
          
          <div className="flex gap-4">
            <Button 
              className="flex-1 gradient-bg text-white h-14 text-xl font-headline font-bold hover:opacity-90 transition-all shadow-xl"
              onClick={handleGenerate}
              disabled={isGenerating || !userPrompt || isUserLoading}
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Play className="w-5 h-5 mr-2 fill-white" />}
              {isGenerating ? "Processing..." : (photoDataUri ? "Edit Photo to 30-Min Video" : "Generate No-Limit 30-Min Video")}
            </Button>
            {videoUrl && (
               <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl" asChild>
                <a href={videoUrl} download="omni-vid-extended-4k.mp4">
                  <Download className="w-6 h-6" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border-white/10 overflow-hidden rounded-2xl ring-1 ring-white/5 shadow-xl">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-primary" />
                    Narration
                  </h3>
                  <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                    <Button 
                      variant={scriptLanguage === 'malayalam' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      className="h-7 px-2 text-[10px] rounded-full font-bold uppercase"
                      onClick={() => setScriptLanguage('malayalam')}
                    >
                      ML
                    </Button>
                    <Button 
                      variant={scriptLanguage === 'english' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      className="h-7 px-2 text-[10px] rounded-full font-bold uppercase"
                      onClick={() => setScriptLanguage('english')}
                    >
                      EN
                    </Button>
                    <Button 
                      variant={scriptLanguage === 'german' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      className="h-7 px-2 text-[10px] rounded-full font-bold uppercase"
                      onClick={() => setScriptLanguage('german')}
                    >
                      DE
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AI Voice</label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="w-full bg-background/50 border-white/5 h-12">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {VOICES.map(voice => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex flex-col text-left">
                            <span className="font-medium">{voice.name}</span>
                            <span className="text-[10px] opacity-60">{voice.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Script (Narration)</label>
                    {isGeneratingScript && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                  </div>
                  <Textarea 
                    placeholder="Poetic narration script..."
                    className="bg-background/50 border-white/5 min-h-[100px] text-sm leading-relaxed"
                    value={voiceScript}
                    onChange={(e) => setVoiceScript(e.target.value)}
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-11 border-primary/20 text-primary hover:bg-primary/5 font-bold gap-2"
                  onClick={handleGenerateVoice}
                  disabled={isGeneratingVoice || !voiceScript}
                >
                  {isGeneratingVoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic2 className="w-4 h-4" />}
                  {isGeneratingVoice ? "Synthesizing..." : "Generate AI Voice"}
                </Button>

                {audioUrl && (
                  <div className="pt-2 animate-in slide-in-from-top-2 duration-300">
                    <audio src={audioUrl} controls className="w-full h-10 filter invert opacity-80" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 rounded-2xl shadow-inner">
            <CardContent className="p-4 space-y-3">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-3 h-3" />
                Language Policy
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Enjoy **unlimited 30-minute generations** with no time caps. Support for Malayalam, English, and German cinematic storytelling.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
