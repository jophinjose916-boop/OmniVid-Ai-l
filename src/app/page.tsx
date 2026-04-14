
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Globe2, ShieldCheck, Zap, ArrowRight, Video, Play, ChevronRight, Clock, Fingerprint, Mail } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function Home() {
  const landingPreview = PlaceHolderImages.find(img => img.id === 'landing-preview');

  const faqs = [
    {
      q: "Is there a time limit on video generation?",
      a: "No! OmniVid AI provides extended 30-minute cinematic sessions. While individual AI sequences are rendered in high-fidelity shots, you can generate and combine as many as you need to reach a full 30-minute masterpiece with no credit limits."
    },
    {
      q: "Is 4K video generation really unlimited for 30 minutes?",
      a: "Yes! OmniVid AI offers unlimited 4K video generation. We believe long-form high-fidelity creativity shouldn't be gated. You can generate continuous cinematic sequences up to 30 minutes per creation."
    },
    {
      q: "Which languages are supported?",
      a: "We currently offer full cinematic support for Malayalam (മലയാളം), English, and German (Deutsch). Our AI handles translation and poetic scripting across all three languages."
    },
    {
      q: "Is my account secure with Gmail and Biometrics?",
      a: "Absolutely. We support 'Log Gmail' for seamless access and use Google Assistant technology for secure, biometric-ready session management. Your 30-minute 4K creations are private and protected."
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
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-morphism border-primary/20 text-primary text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-700">
              <Fingerprint className="w-4 h-4 text-primary animate-pulse" />
              Biometric Secure | Google Assistant Enabled
            </div>
            
            <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Unlimited <span className="gradient-text">30-Min 4K Video</span> Engine
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              നിങ്ങളുടെ ഭാവനയെ സിനിമയാക്കൂ. Log with Gmail and turn Malayalam, German, or English text into stunning 30-minute ultra-high-definition videos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="/dashboard">
                <Button size="lg" className="gradient-bg text-white h-14 px-10 text-lg font-headline font-bold gap-2">
                  Log Gmail & Start
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            
            <div className="w-full max-w-5xl pt-16 animate-in fade-in zoom-in-95 duration-1000 delay-500">
              <div className="aspect-video relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer">
                <img 
                  src={landingPreview?.imageUrl} 
                  data-ai-hint={landingPreview?.imageHint}
                  alt="4K Video Preview" 
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="text-white fill-white w-8 h-8 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                  <Fingerprint className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Assistant Biometric Tech Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-card/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto md:mx-0">
                <Mail className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold">Log Gmail Instantly</h3>
              <p className="text-muted-foreground">Seamless Google integration. Access your 30-minute 4K library from any device with professional Gmail authentication.</p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto md:mx-0">
                <Fingerprint className="text-secondary w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold">Biometric Assistant</h3>
              <p className="text-muted-foreground">Next-gen security with biometric-ready session management. Google Assistant technology ensures your creativity is safe.</p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto md:mx-0">
                <Globe2 className="text-green-500 w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold">ML / EN / DE Support</h3>
              <p className="text-muted-foreground">The world's first 30-minute 4K engine with poetic support for Malayalam, German, and English narratives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-12 text-center">Security & FAQ</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                <AccordionTrigger className="text-left font-headline font-bold hover:no-underline hover:text-primary transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Video className="text-white w-4 h-4" />
            </div>
            <span className="font-headline font-bold text-lg">OmniVid AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 OmniVid AI. Google Assistant Tech Integrated. 30-Min 4K Suite.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors flex items-center gap-1">
              <Fingerprint className="w-3 h-3" />
              Secure Mode
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
