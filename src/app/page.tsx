
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Globe2, ShieldCheck, Zap, ArrowRight, Video, Play, Clock, Fingerprint, Mail, Volume2, Mic2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const landingPreview = PlaceHolderImages.find(img => img.id === 'landing-preview');

  const faqs = [
    {
      q: "Can I generate videos from ANY language?",
      a: "Yes! OmniVid AI features a universal translation engine. Whether you prompt in Malayalam, English, German, or any other global language, our AI will understand the intent and expand it into a 4K masterpiece."
    },
    {
      q: "Does it convert text into audio also?",
      a: "Absolutely. Our Universal Text-to-Audio converter allows you to transform any text into professional AI narration. You can choose from specialized personas including Old Man, Old Woman, Child, and narrative Male/Female voices in Malayalam, English, and German."
    },
    {
      q: "What is the '30-Minute Extended Session'?",
      a: "OmniVid AI is designed for long-form storytelling. While individual renders provide the maximum allowed high-fidelity sequences, you can create and compile unlimited sequences to build a 30-minute cinematic feature."
    },
    {
      q: "How does the Gmail and Biometric security work?",
      a: "We integrate with Google's professional authentication. By logging in with Gmail, you enable biometric-ready session management powered by Google Assistant technology, keeping your 30-minute 4K creations and voiceovers private and secure."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 gradient-bg blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 gradient-bg blur-[120px] rounded-full opacity-60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-morphism border-primary/20 text-primary text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-700">
              <Fingerprint className="w-4 h-4 text-primary animate-pulse" />
              Biometric Secure | Google Assistant Integrated
            </div>
            
            <h1 className="text-5xl md:text-8xl font-headline font-bold leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Any Language. <span className="gradient-text">30-Min 4K</span> Video & Audio.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              നിങ്ങളുടെ ഏത് ഭാഷയും 30 മിനിറ്റ് സിനിമയാക്കൂ. Log with Gmail and turn Malayalam, English, German, or any global text into stunning 4K cinematic reality and professional AI voiceovers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="/dashboard">
                <Button size="lg" className="gradient-bg text-white h-16 px-12 text-xl font-headline font-bold gap-3 rounded-2xl shadow-2xl hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6" />
                  Log Gmail & Start 4K
                </Button>
              </Link>
            </div>
            
            <div className="w-full max-w-6xl pt-16 animate-in fade-in zoom-in-95 duration-1000 delay-500">
              <div className="aspect-video relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(178,87,229,0.2)] group cursor-pointer">
                <img 
                  src={landingPreview?.imageUrl} 
                  data-ai-hint={landingPreview?.imageHint}
                  alt="4K Extended Video Preview" 
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <Play className="text-white fill-white w-10 h-10 ml-1" />
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                   <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-3 py-1 font-bold tracking-widest uppercase">
                    Unlimited 30-Min Masterpiece
                   </Badge>
                </div>
                <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-black/70 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-background bg-red-500 flex items-center justify-center text-[10px] font-bold">ML</div>
                    <div className="w-8 h-8 rounded-full border-2 border-background bg-blue-500 flex items-center justify-center text-[10px] font-bold">EN</div>
                    <div className="w-8 h-8 rounded-full border-2 border-background bg-yellow-500 flex items-center justify-center text-[10px] font-bold">DE</div>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/80">Universal Audio & Video Engine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-card/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6 text-center md:text-left group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto md:mx-0 group-hover:bg-primary/20 transition-colors">
                <Volume2 className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-headline font-bold">Text-to-Audio Converter</h3>
              <p className="text-muted-foreground text-lg">Convert any text into high-quality AI narration. Choose between old men, women, and children personas in Malayalam, English, and German.</p>
            </div>
            <div className="space-y-6 text-center md:text-left group">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto md:mx-0 group-hover:bg-secondary/20 transition-colors">
                <Fingerprint className="text-secondary w-8 h-8" />
              </div>
              <h3 className="text-2xl font-headline font-bold">Biometric Assistant Tech</h3>
              <p className="text-muted-foreground text-lg">Experience high-security session management. Google Assistant biometric technology ensures your Gmail-linked data is always safe.</p>
            </div>
            <div className="space-y-6 text-center md:text-left group">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto md:mx-0 group-hover:bg-green-500/20 transition-colors">
                <Zap className="text-green-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-headline font-bold">Unlimited 30-Min 4K</h3>
              <p className="text-muted-foreground text-lg">No time limits on creativity. Build extended long-form cinematic features up to 30 minutes with high-bitrate 4K rendering and voiceovers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-headline font-bold mb-16 text-center">Security & Universal Support FAQ</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-white/10 glass-morphism px-6 rounded-2xl border">
                <AccordionTrigger className="text-left font-headline font-bold text-lg py-6 hover:no-underline hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Video className="text-white w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight">OmniVid AI</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">© 2026 OmniVid AI. Google Assistant Biometric Tech Integrated. 30-Min 4K Suite.</p>
          <div className="flex gap-8 text-sm font-bold text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-primary" />
              Biometric Secure
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">Log Gmail</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
