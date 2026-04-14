import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Globe2, ShieldCheck, Zap, ArrowRight, Video, Play, ChevronRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function Home() {
  const landingPreview = PlaceHolderImages.find(img => img.id === 'landing-preview');

  const faqs = [
    {
      q: "Is 4K video generation really unlimited?",
      a: "Yes! OmniVid AI offers unlimited 4K video generation for all users. We believe creativity shouldn't be gated by credits or quotas."
    },
    {
      q: "How well does it understand Malayalam?",
      a: "Extremely well. Our AI is specifically tuned to understand Malayalam (മലയാളം) prompts and translate the poetic nuances into world-class cinematic visual descriptions."
    },
    {
      q: "Can I use my own photos as references?",
      a: "Absolutely. With our 'AI Editing' feature, you can upload a photo and the AI will use it as the starting point for your cinematic video sequence."
    },
    {
      q: "What voices are available for narration?",
      a: "We offer several professional AI voices, ranging from deep narrative tones to friendly and energetic styles, supporting both Malayalam and English narration."
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border-primary/20 text-primary text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-700">
              <ShieldCheck className="w-4 h-4 fill-primary" />
              Unlimited 4K Video Generation Enabled
            </div>
            
            <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Unlimited <span className="gradient-text">4K AI Video</span> in Malayalam & English
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              നിങ്ങളുടെ ഭാവനയെ 4K സിനിമയാക്കൂ. Turn Malayalam or English text into stunning ultra-high-definition videos. No credits, no limits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="/dashboard">
                <Button size="lg" className="gradient-bg text-white h-14 px-10 text-lg font-headline font-bold gap-2">
                  Generate Unlimited 4K / തുടങ്ങാം
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
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white">4K Cinematic Output</span>
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
                <Globe2 className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold">മലയാളം Support</h3>
              <p className="text-muted-foreground">Prompt in Malayalam. Our AI translates the soul of your message into cinematic 4K visuals.</p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto md:mx-0">
                <Zap className="text-secondary w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold">Unlimited 4K</h3>
              <p className="text-muted-foreground">High-fidelity generation for everyone. No credit systems, no hidden fees, just pure creative freedom.</p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto md:mx-0">
                <Sparkles className="text-green-500 w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold">AI Image Editing</h3>
              <p className="text-muted-foreground">Upload your photos and watch them come to life in 4K. Edit your memories into cinematic masterpieces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-headline font-bold mb-12 text-center">Frequently Asked Questions</h2>
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

      {/* CTA Section */}
      <section className="py-24 border-t bg-gradient-to-b from-card/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-headline font-bold mb-6">Ready to Create in 4K?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of creators turning Malayalam and English prompts into cinematic reality.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gradient-bg text-white h-14 px-12 text-lg font-headline font-bold gap-2">
              Start Free 4K Generation
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
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
          <p className="text-sm text-muted-foreground">© 2026 OmniVid AI. Unlimited 4K AI Video Suite. Powered by Google Veo.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">4K Guidelines</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
