import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, Eye, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { recordView } from '@/lib/tankApi';
import { toast } from 'sonner';
import type { Pitch } from '@/types';
export default function PitchView() {
  const {
    pitchId
  } = useParams();
  const navigate = useNavigate();
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (pitchId) {
      loadPitch();
      recordView('pitch', pitchId);
    }
  }, [pitchId]);
  const loadPitch = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('pitches').select('*').eq('id', pitchId).single();
      if (error) throw error;
      setPitch(data as unknown as Pitch);
    } catch (error) {
      console.error('Error loading pitch:', error);
      toast.error('Failed to load pitch');
    } finally {
      setIsLoading(false);
    }
  };
  const handleShare = async () => {
    const url = `${window.location.origin}/pitch/${pitchId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Pitch link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading pitch...</p>
        </div>
      </div>;
  }
  if (!pitch) {
    return <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Pitch Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested pitch could not be found.</p>
          <Button onClick={() => navigate('/tank')}>Back to Tank</Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-black text-white relative">
      {/* Back Button */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/70 text-white">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* TikTok-Style Full Screen Video Container */}
      <div className="relative h-screen w-full max-w-lg mx-auto flex flex-col">
        {/* Video Area */}
        <div className="flex-1 relative bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
          {pitch.video_url ? <video src={pitch.video_url} controls autoPlay loop className="w-full h-full object-contain" poster={pitch.thumbnail_url || undefined} /> : pitch.thumbnail_url ? <img src={pitch.thumbnail_url} alt={pitch.caption || 'Pitch'} className="w-full h-full object-contain" /> : <div className="text-center p-8">
              <Eye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No video available</p>
            </div>}

          {/* Right Side Actions (TikTok style) */}
          <div className="absolute right-4 bottom-24 flex flex-col gap-6 z-40">
            

            <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">See More</span>
            </button>

            <button onClick={handleShare} className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Share</span>
            </button>

            <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <MoreVertical className="w-6 h-6" />
              </div>
            </button>
          </div>

          {/* Bottom Info Overlay (TikTok style) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-30">
            <div className="max-w-md">
              {/* Caption */}
              <p className="text-sm font-medium mb-2 line-clamp-3">
                {pitch.caption || 'No caption'}
              </p>

              {/* Hashtags */}
              {pitch.hashtags && pitch.hashtags.length > 0 && <div className="flex flex-wrap gap-2 mb-3">
                  {pitch.hashtags.map((tag, i) => <span key={i} className="text-sm text-blue-400 font-medium">
                      #{tag}
                    </span>)}
                </div>}

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-gray-300">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {pitch.views_count || 0} views
                </span>
                <Badge variant="secondary" className="bg-white/10 text-white border-none">
                  {pitch.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}