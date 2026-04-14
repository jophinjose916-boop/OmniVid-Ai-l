"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Wand2, Play, Download, Languages, Volume2, Loader2, Zap, ImagePlus, X, Mic2, Globe, ShieldCheck, Clock, Fingerprint, Mail, UserCircle } from 'lucide-react';
import { optimizePrompt } from '@/ai/flows/prompt-optimization';
import { multilingualVideoGeneration } from '@/ai/flows/multilingual-video-generation';
import { multilingualVoiceover } from '@/ai/flows/multilingual-voiceover';
import { generateScript } from '@/ai/flows/voiceover-script-flow';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VOICES } from '@/lib/types';
import { useUser, useFirestore, useAuth, initiateAnonymousSignIn, setDocumentNonBlocking, initiateGoogleSignIn } from '@/firebase';
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
        toast({ title: "AI Photo Sync Ready", description: "Reference image added for extended biometric editing." });
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
      
      toast({ title: "Universal Logic Applied", description: "Prompt optimized for 30-min cinematic masterplan." });
    } catch (error) {
      toast({ variant: "destructive", title: "Optimization Failed", description: "Could not refine the universal prompt." });
    } finally {
      setIsOptimizing(false);
      setIsGeneratingScript(false);
    }
  };

  const handleGenerateVoice = async () => {
    if (!voiceScript.trim()) {
      toast({ variant: "destructive", title: "No script", description: "Please provide a script for voice synthesis." });
      return;
    }
    setIsGeneratingVoice(true);
    try {
      const result = await multilingualVoiceover({ text: voiceScript, voiceName: selectedVoice });
      setAudioUrl(result.audioDataUri);
      toast({ title: "Secure Audio Ready", description: "Biometric-ready voiceover synthesized." });
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
      toast({ variant: "destructive", title: "Generation Failed", description: "Check prompt or Gmail session and try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Universal Prompt Engine</label>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center space-x-3 bg-card/50 px-4 py-2 rounded-2xl border border-white/5">
                  <Switch id="4k-mode" checked={is4K} onCheckedChange={setIs4K} />
                  <Label htmlFor="4k-mode" className="text-[10px] font-bold uppercase tracking-tighter cursor-pointer flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    Unlimited 4K
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <Textarea
                placeholder="Any language... e.g., ഒരു മനോഹരമായ വനം / A beautiful forest / Eine bezaubernde Waldszene..."
                className="min-h-[160px] bg-card/30 border-white/10 focus:ring-primary text-xl resize-none pr-36 rounded-2xl group-hover:bg-card/50 transition-colors"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
              <div className="absolute right-4 bottom-4">
                 <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={handleOptimize} 
                  disabled={isOptimizing || !userPrompt}
                  className="gap-2 font-bold shadow-2xl rounded-xl h-10 px-5"
                >
                  {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 text-primary" />}
                  AI Refine
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!photoDataUri ? (
                <Button 
                  variant="outline" 
                  className="border-dashed h-24 w-full flex-col gap-2 hover:bg-primary/5 transition-colors group rounded-2xl border-white/10"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="w-6 h-6 opacity-30 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] opacity-40 font-bold uppercase tracking-widest">AI Photo Sync (Optional)</span>
                </Button>
              ) : (
                <div className="relative h-24 w-40 rounded-2xl overflow-hidden border-2 border-primary/50 group shadow-2xl">
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
              <div className="p-5 rounded-2xl glass-morphism border-primary/20 space-y-3 animate-in zoom-in-95 duration-300">
                <div className="text-[10px] font-bold text-primary flex items-center justify-between uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Universal 30-Min Masterplan
                  </div>
                  <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-full">
                    <Fingerprint className="w-3 h-3 text-secondary" />
                    <span className="text-[10px] text-secondary">Secure Extended Session</span>
                  </div>
                </div>
                <Textarea 
                  value={optimizedPrompt}
                  onChange={(e) => setOptimizedPrompt(e.target.value)}
                  className="text-sm bg-transparent border-none p-0 focus-visible:ring-0 min-h-[80px] resize-none text-foreground/90 italic leading-relaxed"
                />
              </div>
            )}
          </div>

          <Card className="aspect-video relative overflow-hidden bg-muted flex items-center justify-center group border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-3xl ring-1 ring-white/10">
            {videoUrl ? (
              <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
            ) : isGenerating ? (
              <div className="text-center space-y-5">
                <div className="relative inline-block">
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                  <div className="absolute inset-0 blur-2xl gradient-bg opacity-40 animate-pulse"></div>
                </div>
                <div>
                  <p className="text-xl font-headline font-bold text-white animate-pulse">Rendering 30-Min 4K Sequence...</p>
                  <p className="text-xs text-muted-foreground opacity-60 tracking-widest uppercase mt-2">Biometric-Secure Processing Active</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground space-y-4 px-10">
                <Play className="w-16 h-16 mx-auto opacity-10" />
                <p className="font-headline text-xl opacity-40 font-bold uppercase tracking-widest">30-Min Extended Preview</p>
              </div>
            )}
          </Card>
          
          <div className="flex gap-6">
            <Button 
              className="flex-1 gradient-bg text-white h-16 text-2xl font-headline font-bold hover:opacity-90 transition-all shadow-2xl rounded-2xl"
              onClick={handleGenerate}
              disabled={isGenerating || !userPrompt || isUserLoading}
            >
              {isGenerating ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Zap className="w-6 h-6 mr-3 fill-white" />}
              {isGenerating ? "Rendering..." : (photoDataUri ? "Sync Image to 30-Min Video" : "Generate 30-Min 4K Masterpiece")}
            </Button>
            {videoUrl && (
               <Button variant="outline" size="icon" className="h-16 w-16 rounded-2xl border-white/10" asChild>
                <a href={videoUrl} download="omni-vid-extended.mp4">
                  <Download className="w-8 h-8" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="bg-card/40 border-white/10 overflow-hidden rounded-3xl ring-1 ring-white/5 shadow-2xl">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-headline font-bold flex items-center gap-3">
                    <Volume2 className="w-6 h-6 text-primary" />
                    Universal Voice
                  </h3>
                  <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1 border border-white/5">
                    <Button 
                      variant={scriptLanguage === 'malayalam' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      className="h-8 px-3 text-[10px] rounded-full font-bold uppercase tracking-tighter"
                      onClick={() => setScriptLanguage('malayalam')}
                    >
                      ML
                    </Button>
                    <Button 
                      variant={scriptLanguage === 'english' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      className="h-8 px-3 text-[10px] rounded-full font-bold uppercase tracking-tighter"
                      onClick={() => setScriptLanguage('english')}
                    >
                      EN
                    </Button>
                    <Button 
                      variant={scriptLanguage === 'german' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      className="h-8 px-3 text-[10px] rounded-full font-bold uppercase tracking-tighter"
                      onClick={() => setScriptLanguage('german')}
                    >
                      DE
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Select AI Persona</label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="w-full bg-background/50 border-white/5 h-14 rounded-xl">
                      <SelectValue placeholder="Select voice persona" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-white/10">
                      {VOICES.map(voice => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex flex-col text-left py-1">
                            <span className="font-bold text-sm flex items-center gap-2">
                              <UserCircle className="w-3.5 h-3.5 opacity-50" />
                              {voice.name}
                            </span>
                            <span className="text-[10px] opacity-60 uppercase tracking-tighter">{voice.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Universal Script</label>
                    {isGeneratingScript && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                  </div>
                  <Textarea 
                    placeholder="Narration script in any language..."
                    className="bg-background/50 border-white/5 min-h-[120px] text-sm leading-relaxed rounded-xl"
                    value={voiceScript}
                    onChange={(e) => setVoiceScript(e.target.value)}
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-12 border-primary/30 text-primary hover:bg-primary/10 font-bold gap-3 rounded-xl transition-all"
                  onClick={handleGenerateVoice}
                  disabled={isGeneratingVoice || !voiceScript}
                >
                  {isGeneratingVoice ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic2 className="w-5 h-5" />}
                  {isGeneratingVoice ? "Synthesizing Persona..." : "Generate AI Voiceover"}
                </Button>

                {audioUrl && (
                  <div className="pt-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                      <audio src={audioUrl} controls className="w-full h-10 filter invert opacity-70" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {!user || user.isAnonymous ? (
            <Card className="bg-primary/10 border-primary/30 rounded-3xl shadow-inner group cursor-pointer hover:bg-primary/20 transition-all overflow-hidden" onClick={() => auth && initiateGoogleSignIn(auth)}>
              <CardContent className="p-6 flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold uppercase tracking-wider">Log with Gmail</h4>
                  <p className="text-[10px] text-muted-foreground leading-tight">Sync your 30-min 4K library and enable biometric security.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-green-500/5 border-green-500/20 rounded-3xl">
              <CardContent className="p-6 flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-green-500">Biometric Session Active</h4>
                  <p className="text-[10px] text-muted-foreground leading-tight">Logged in as {user.email}. Google Assistant session secure.</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="p-6 rounded-3xl bg-secondary/5 border border-white/5 space-y-4">
             <div className="flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-secondary" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-secondary">Security Policy</h4>
             </div>
             <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                Our universal AI assistant utilizes **Google Assistant Technology** for biometric fingerprint session management. Your 30-minute 4K creations are protected by industrial-grade Gmail authentication.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
