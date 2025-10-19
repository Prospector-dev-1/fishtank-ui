import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, MoreVertical, Edit, Share, Video, Eye, TrendingUp, Play, Users, Settings, Shield, ChevronRight, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { recordView } from "@/lib/innovator/tankApi";
import { useTeamPermissions } from "@/hooks/innovator/useTeamPermissions";
import type { Innovation, Pitch } from "@/types";
import { supabase } from '@/integrations/supabase/client';
import { TankAnalyticsSummary } from './TankAnalyticsSummary';
import { TeamManagement } from './TeamManagement';
import { InnovationPreview } from './InnovationPreview';

interface TankDashboardProps {
  innovation: Innovation;
}
export function TankDashboard({
  innovation: initialInnovation
}: TankDashboardProps) {
  const navigate = useNavigate();
  const [innovation, setInnovation] = useState(initialInnovation);
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [ndaEnabled, setNdaEnabled] = useState(true);
  const { canEditInnovation, canCreatePitch, canAccessTankUI } = useTeamPermissions(innovation.id);
  
  useEffect(() => {
    recordView('innovation', innovation.id);
    loadPitches();
    loadNDASettings();
  }, [innovation.id]);

  const loadNDASettings = () => {
    try {
      const savedSettings = localStorage.getItem(`nda_settings_${innovation.id}`);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setNdaEnabled(settings.ndaRequired ?? true);
      }
    } catch (error) {
      console.error('Error loading NDA settings:', error);
    }
  };
  const loadPitches = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('pitches').select('*').eq('innovation_id', innovation.id).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      setPitches((data || []) as unknown as Pitch[]);
    } catch (error) {
      console.error('Error loading pitches:', error);
      toast.error('Failed to load pitches');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats
  const totalPitches = pitches.length;
  const publishedPitches = pitches.filter(p => p.status === 'published').length;
  const totalViews = (innovation.metrics as any)?.views || 0;
  const handleShare = async () => {
    const url = `${window.location.origin}/innovation/${innovation.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Innovation link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };
  return <div className="min-h-screen bg-muted/30 pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        {/* Innovation Profile Card - iOS Style */}
        <div className="ios-card bg-card">
          <div className="p-4">
            <div className="flex items-start gap-4 mb-4">
              {innovation.thumbnail_url && <img src={innovation.thumbnail_url} alt={innovation.company_name} className="w-16 h-16 rounded-2xl bg-muted object-cover shadow-sm" />}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold mb-1 truncate">{innovation.company_name}</h1>
                <h2 className="text-sm text-muted-foreground mb-2">{innovation.title}</h2>
                <p className="text-xs text-muted-foreground line-clamp-2">{innovation.tagline}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEditInnovation && (
                    <DropdownMenuItem onClick={() => navigate('/innovator/tank/innovation/edit')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Innovation
                    </DropdownMenuItem>
                  )}
                  {canEditInnovation && (
                    <DropdownMenuItem onClick={() => navigate('/innovator/tank/innovation/settings')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => setShowPreview(true)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Innovation
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Badge variant="secondary" className="text-xs rounded-full">
                {innovation.category}
              </Badge>
              <Badge variant="outline" className="text-xs rounded-full">
                {innovation.stage}
              </Badge>
              <Badge variant="outline" className="text-xs rounded-full bg-background">
                {innovation.status === 'published' ? '✓ Published' : 'Draft'}
              </Badge>
            </div>

            {/* Stats - iOS Style */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-muted/50 rounded-2xl">
                <div className="text-2xl font-bold">{totalPitches}</div>
                <div className="text-xs text-muted-foreground mt-1">Pitches</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-2xl">
                <div className="text-2xl font-bold">{publishedPitches}</div>
                <div className="text-xs text-muted-foreground mt-1">Published</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-2xl">
                <div className="text-2xl font-bold">{totalViews}</div>
                <div className="text-xs text-muted-foreground mt-1">Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Management */}
        <TeamManagement innovationId={innovation.id} />

        {/* NDA Settings Card */}
        {canEditInnovation && (
          <div className="ios-card bg-card">
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold mb-1">NDA Settings</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Protect your innovation with customizable non-disclosure agreements
                  </p>
                  
                  {/* NDA Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-muted/30 rounded-xl p-2">
                      <div className="text-xs text-muted-foreground mb-0.5">NDA Status</div>
                      <div className={`text-sm font-semibold ${ndaEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                        {ndaEnabled ? 'Active' : 'Disabled'}
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-2">
                      <div className="text-xs text-muted-foreground mb-0.5">Signatures</div>
                      <div className="text-sm font-semibold">
                        {innovation.id.startsWith('innovation_') ? '12' : '0'}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full rounded-full"
                    onClick={() => navigate('/innovator/tank/innovation/nda-settings')}
                  >
                    Manage NDA Settings
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Summary */}
        <TankAnalyticsSummary pitches={pitches} />

        {/* Section Header */}
        {canAccessTankUI && (
          <div className="flex items-center justify-between px-1 pt-2">
            <div>
              <h3 className="text-lg font-semibold">My Pitches</h3>
              <p className="text-xs text-muted-foreground">
                Short-form videos for investors
              </p>
            </div>
            {canCreatePitch && (
              <Button size="sm" onClick={() => navigate('/innovator/tank/pitch/new')} className="rounded-full shadow-sm">
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            )}
          </div>
        )}

        {/* Pitches List */}
        {!canAccessTankUI ? (
          <div className="ios-card bg-card">
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-base font-semibold mb-2">Collaborator Access</h4>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                You're listed as a Collaborator on this innovation. Collaborators are recognized as team members but don't have access to manage pitches or view analytics.
              </p>
            </div>
          </div>
        ) : isLoading ? <div className="ios-card bg-card">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div> : pitches.length === 0 ? <div className="ios-card bg-card">
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-base font-semibold mb-2">No Pitches Yet</h4>
              <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                Create your first pitch video to share your innovation
              </p>
              <Button onClick={() => navigate('/innovator/tank/pitch/new')} className="rounded-full shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Create First Pitch
              </Button>
            </div>
          </div> : <div className="space-y-3">
            {pitches.map((pitch, index) => <div key={pitch.id} className="ios-card bg-card animate-fade-in" style={{
          animationDelay: `${index * 50}ms`
        }}>
                <div className="p-4">
                  {/* Video Thumbnail */}
                  <div className="aspect-video bg-muted/50 rounded-2xl mb-3 flex items-center justify-center relative overflow-hidden group cursor-pointer" onClick={() => navigate(`/innovator/pitch/${pitch.id}`)}>
                    {pitch.thumbnail_url ? <img src={pitch.thumbnail_url} alt={pitch.caption || 'Pitch'} className="w-full h-full object-cover" /> : <Video className="w-8 h-8 text-muted-foreground" />}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-foreground ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Pitch Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium line-clamp-2 flex-1">
                        {pitch.caption || 'No caption'}
                      </p>
                      <Badge variant={pitch.status === 'published' ? 'default' : 'outline'} className="shrink-0 text-xs rounded-full">
                        {pitch.status}
                      </Badge>
                    </div>
                    
                    {pitch.hashtags && pitch.hashtags.length > 0 && <div className="flex flex-wrap gap-1">
                        {pitch.hashtags.slice(0, 3).map((tag, i) => <Badge key={i} variant="secondary" className="text-xs rounded-full">
                            #{tag}
                          </Badge>)}
                        {pitch.hashtags.length > 3 && <Badge variant="secondary" className="text-xs rounded-full">
                            +{pitch.hashtags.length - 3}
                          </Badge>}
                      </div>}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pb-3 border-b border-border/50">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {pitch.views_count || 0}
                    </span>
                    <span>{new Date(pitch.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => navigate(`/innovator/pitch/${pitch.id}`)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => navigate(`/innovator/tank/pitch/${pitch.id}/analytics`)}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Analytics
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
                      onClick={() => navigate(`/innovator/tank/boost/${pitch.id}`)}
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Boost Pitch
                    </Button>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Innovation Preview</DialogTitle>
          </DialogHeader>
          <InnovationPreview innovation={innovation} />
        </DialogContent>
      </Dialog>
    </div>;
}