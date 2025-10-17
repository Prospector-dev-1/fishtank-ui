import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTeamPermissions } from "@/hooks/innovator/useTeamPermissions";
import { Button } from '@/components/innovator/ui/button';
import { Input } from '@/components/innovator/ui/input';
import { Textarea } from '@/components/innovator/ui/textarea';
import { Label } from '@/components/innovator/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/innovator/ui/card';
import { Badge } from '@/components/innovator/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/innovator/ui/select';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
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
  const handleFileUpload = (field: 'video_url' | 'thumbnail_url') => {
    // Simulate file upload
    const fileName = field === 'video_url' ? 'pitch-video.mp4' : 'thumbnail.jpg';
    const fakeUrl = `https://example.com/${fileName}`;
    form.setValue(field, fakeUrl);
    toast.success(`${fileName} uploaded successfully`);
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
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <FishtankHeader title="Create Pitch" showLogo={false} />
      
      <div className="max-w-3xl mx-auto p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/innovator/tank')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tank
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pitching: {innovation.company_name}</CardTitle>
            <p className="text-sm text-muted-foreground">{innovation.tagline}</p>
          </CardHeader>
        </Card>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pitch Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create a compelling pitch for your innovation
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Pitch Title *</Label>
                <Input id="title" placeholder="e.g. Our Revolutionary IoT Solution" {...form.register('title')} />
                {form.formState.errors.title && <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.title.message}
                  </p>}
              </div>

              <div>
                <Label htmlFor="caption">Caption *</Label>
                <Textarea id="caption" placeholder="Write a compelling caption for your pitch..." className="min-h-[100px]" maxLength={500} {...form.register('caption')} />
                <div className="flex justify-between mt-1">
                  {form.formState.errors.caption && <p className="text-sm text-destructive">
                      {form.formState.errors.caption.message}
                    </p>}
                  <p className="text-xs text-muted-foreground ml-auto">
                    {form.watch('caption')?.length || 0}/500
                  </p>
                </div>
              </div>

              

              <div>
                <Label>Pitch Video</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload your pitch video
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleFileUpload('video_url')}>
                    Choose File
                  </Button>
                  {form.watch('video_url') && <div className="mt-2 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-green-600">Video uploaded</span>
                    </div>}
                </div>
              </div>

              <div>
                <Label>Thumbnail</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a thumbnail for your pitch
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleFileUpload('thumbnail_url')}>
                    Choose File
                  </Button>
                  {form.watch('thumbnail_url') && <div className="mt-2 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-green-600">Thumbnail uploaded</span>
                    </div>}
                </div>
              </div>

              <div>
                <Label htmlFor="hashtags">Hashtags</Label>
                <Input id="hashtags" placeholder="e.g. ai, innovation, startup" {...form.register('hashtags')} />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple hashtags with commas
                </p>
              </div>

              
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/innovator/tank')} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creating Pitch...' : 'Create Pitch'}
            </Button>
          </div>
        </form>
      </div>
    </div>;
}