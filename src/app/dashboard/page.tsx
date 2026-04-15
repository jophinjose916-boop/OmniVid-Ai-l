import { Navbar } from '@/components/layout/Navbar';
import { VideoCreator } from '@/components/video/VideoCreator';

export const maxDuration = 120;

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-headline font-bold mb-4">Create Magic</h1>
          <p className="text-muted-foreground text-lg">
            Turn your imagination into cinematic reality with multilingual AI video generation.
          </p>
        </div>
        <VideoCreator />
      </main>
    </div>
  );
}
