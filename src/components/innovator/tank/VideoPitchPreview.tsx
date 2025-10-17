import { Play, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VideoPitchPreviewProps {
  pitchName: string;
  videoUrl: string;
  duration: string;
}

export function VideoPitchPreview({ pitchName, videoUrl, duration }: VideoPitchPreviewProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Video Thumbnail/Player */}
          <div className="relative w-24 h-16 sm:w-32 sm:h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
              <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
              {duration}
            </div>
          </div>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">{pitchName}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 truncate">
              Variation of same innovation • {duration}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button size="sm" className="flex items-center gap-2 text-xs sm:text-sm">
                <Play className="w-3 h-3" />
                <span className="truncate">Play Preview</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs sm:text-sm">
                <ExternalLink className="w-3 h-3" />
                <span className="truncate">View Full</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}