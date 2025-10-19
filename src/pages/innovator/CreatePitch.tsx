import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTeamPermissions } from "@/hooks/innovator/useTeamPermissions";
import { Input } from '@/components/innovator/ui/input';
import { Textarea } from '@/components/innovator/ui/textarea';
import { X, Hash, Globe, Video, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { innovationAPI } from "@/lib/innovator/tankApi";
import type { Innovation } from "@/types";
const pitchSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  caption: z.string().min(1, 'Caption is required').max(500, 'Caption must be 500 characters or less'),
  description: z.string().optional(),
  video_url: z.string().optional(),
  thumbnail_url: z.string().optional(),
  hashtags: z.string().optional(),
  visibility: z.enum(['public', 'private', 'unlisted']),
  status: z.enum(['draft', 'published'])
});
type PitchFormData = z.infer<typeof pitchSchema>;
export default function CreatePitch() {
  const navigate = useNavigate();
  const [innovation, setInnovation] = useState<Innovation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionsChecked, setPermissionsChecked] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const {
    canCreatePitch,
    isLoading: permissionsLoading
  } = useTeamPermissions(innovation?.id);
  const form = useForm<PitchFormData>({
    resolver: zodResolver(pitchSchema),
    defaultValues: {
      title: '',
      caption: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      hashtags: '',
      visibility: 'public',
      status: 'published'
    }
  });
  useEffect(() => {
    loadInnovation();
  }, []);
  useEffect(() => {
    // Wait for both innovation to load AND permissions to finish loading
    if (innovation && !permissionsLoading && !permissionsChecked) {
      setPermissionsChecked(true);
      if (!canCreatePitch) {
        console.log('❌ Permission denied - redirecting', {
          canCreatePitch,
          permissionsLoading,
          innovationId: innovation?.id
        });
        toast.error('You do not have permission to create pitches');
        navigate('/innovator/tank');
      } else {
        console.log('✅ Permission granted - can create pitch', {
          canCreatePitch,
          permissionsLoading,
          innovationId: innovation?.id
        });
      }
    }
  }, [canCreatePitch, permissionsLoading, innovation, navigate, permissionsChecked]);
  const loadInnovation = async () => {
    const primaryInnovation = await innovationAPI.getPrimaryInnovation();
    if (!primaryInnovation) {
      toast.error('Please create an innovation first');
      navigate('/innovator/tank');
      return;
    }
    setInnovation(primaryInnovation);
  };
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      form.setValue('video_url', url);
      toast.success('Video added');
    }
  };
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      form.setValue('thumbnail_url', url);
      toast.success('Thumbnail added');
    }
  };
  const onSubmit = async (data: PitchFormData) => {
    if (!innovation) return;
    setIsSubmitting(true);
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to create a pitch');
        return;
      }

      // Parse hashtags from comma-separated string
      const hashtagsArray = data.hashtags ? data.hashtags.split(',').map(tag => tag.trim().replace(/^#/, '')).filter(Boolean) : [];
      const pitchData = {
        user_id: user.id,
        innovation_id: innovation.id,
        title: data.title,
        caption: data.caption,
        description: data.description || '',
        video_url: data.video_url,
        thumbnail_url: data.thumbnail_url,
        hashtags: hashtagsArray,
        visibility: data.visibility,
        status: data.status
      };
      const {
        error
      } = await supabase.from('pitches').insert([pitchData]);
      if (error) throw error;
      toast.success('Pitch created successfully!');
      navigate('/innovator/tank');
    } catch (error) {
      console.error('Error creating pitch:', error);
      toast.error('Failed to create pitch');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!innovation) {
    return <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-white/70 mt-2">Loading...</p>
        </div>
      </div>;
  }
  return <div className="fixed inset-0 bg-black flex flex-col">
      {/* Top Bar */}
      <div className="safe-top flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-sm z-10">
        <button onClick={() => navigate('/innovator/tank')} className="text-white p-2 active:scale-95 transition-transform">
          <X className="w-6 h-6" />
        </button>
        <span className="text-white text-sm font-medium">New Pitch</span>
        <div className="w-10" />
      </div>

      {/* Video Preview Area */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-900 to-gray-800">
        {videoPreview ? <video src={videoPreview} className="w-full h-full object-cover" controls playsInline /> : <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
              <Video className="w-12 h-12 text-white/70" />
            </div>
            <p className="text-white/70 text-sm mb-2">Add your pitch video</p>
            <button onClick={() => videoInputRef.current?.click()} className="px-6 py-2.5 bg-white text-black rounded-full font-semibold text-sm active:scale-95 transition-transform">
              Select Video
            </button>
          </div>}
        
        {/* Thumbnail Preview Overlay */}
        {thumbnailPreview && <div className="absolute bottom-4 left-4 w-16 h-16 rounded-lg overflow-hidden border-2 border-white/50">
            <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
          </div>}
      </div>

      {/* Bottom Details Form */}
      <div className="safe-bottom bg-black border-t border-white/10 overflow-y-auto max-h-[60vh]">
        <div className="px-4 py-4 space-y-4">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <button onClick={() => videoInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 rounded-xl text-white text-sm font-medium active:scale-95 transition-transform">
              <Video className="w-4 h-4" />
              {videoPreview ? 'Change Video' : 'Add Video'}
            </button>
            <button onClick={() => thumbnailInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 rounded-xl text-white text-sm font-medium active:scale-95 transition-transform">
              <ImageIcon className="w-4 h-4" />
              Thumbnail
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="text-white/70 text-xs mb-1.5 block">Title *</label>
            <Input placeholder="Give your pitch a title" {...form.register('title')} className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
            {form.formState.errors.title && <p className="text-sm text-red-400 mt-1">
                {form.formState.errors.title.message}
              </p>}
          </div>

          {/* Caption */}
          <div>
            <label className="text-white/70 text-xs mb-1.5 flex items-center justify-between">
              <span>Caption *</span>
              <span className="text-white/50">
                {form.watch('caption')?.length || 0}/500
              </span>
            </label>
            <Textarea placeholder="Write a compelling caption..." {...form.register('caption')} maxLength={500} rows={3} className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none" />
            {form.formState.errors.caption && <p className="text-sm text-red-400 mt-1">
                {form.formState.errors.caption.message}
              </p>}
          </div>

          {/* Hashtags */}
          <div>
            <label className="text-white/70 text-xs mb-1.5 flex items-center gap-2">
              <Hash className="w-3.5 h-3.5" />
              Hashtags
            </label>
            <Input placeholder="ai, innovation, startup" {...form.register('hashtags')} className="bg-white/5 border-white/10 text-white placeholder:text-white/40" />
            <p className="text-xs text-white/50 mt-1">
              Separate with commas
            </p>
          </div>

          {/* Visibility */}
          

          {/* Innovation Info */}
          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/50 mb-1">Pitching for</p>
            <p className="text-white font-semibold text-sm">{innovation.company_name}</p>
            <p className="text-white/60 text-xs">{innovation.tagline}</p>
          </div>

          {/* Post Button */}
          <button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || !videoPreview} className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold text-base disabled:opacity-50 disabled:from-gray-600 disabled:to-gray-600 active:scale-[0.98] transition-all">
            {isSubmitting ? 'Posting...' : 'Post Pitch'}
          </button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
      <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
    </div>;
}