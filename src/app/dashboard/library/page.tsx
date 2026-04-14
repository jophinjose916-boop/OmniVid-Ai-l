
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share2, MoreVertical, Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_VIDEOS = [
  { id: '1', prompt: 'Cyberpunk Tokyo in the rain', date: '2 hours ago', thumb: 'https://picsum.photos/seed/tokyo/600/400' },
  { id: '2', prompt: 'An astronaut riding a horse on Mars', date: '5 hours ago', thumb: 'https://picsum.photos/seed/mars/600/400' },
  { id: '3', prompt: 'Peaceful garden with floating islands', date: 'Yesterday', thumb: 'https://picsum.photos/seed/garden/600/400' },
  { id: '4', prompt: 'Futuristic solar car racing in desert', date: '2 days ago', thumb: 'https://picsum.photos/seed/racing/600/400' },
];

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">My Library</h1>
            <p className="text-muted-foreground">Your recent creations and generated videos.</p>
          </div>
          <Button className="gradient-bg font-headline font-bold">New Creation</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_VIDEOS.map((video) => (
            <Card key={video.id} className="group relative overflow-hidden bg-card/50 border-white/10 hover:border-primary/50 transition-all duration-300">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={video.thumb} 
                  alt={video.prompt} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <p className="font-medium line-clamp-2 text-sm leading-snug">{video.prompt}</p>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {video.date}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="hover:text-primary transition-colors flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      Save
                    </button>
                    <button className="hover:text-primary transition-colors flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5" />
                      Share
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
