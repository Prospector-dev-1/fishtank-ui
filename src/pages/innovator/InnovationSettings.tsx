import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { Button } from "@/components/innovator/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/innovator/ui/card";
import { Label } from "@/components/innovator/ui/label";
import { Switch } from "@/components/innovator/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/innovator/ui/radio-group";
import { Textarea } from "@/components/innovator/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/innovator/ui/alert-dialog";
import { innovationAPI } from "@/lib/innovator/tankApi";
import { useTeamPermissions } from "@/hooks/innovator/useTeamPermissions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Innovation } from "@/types";
import { Trash2 } from "lucide-react";
export default function InnovationSettings() {
  const navigate = useNavigate();
  const [innovation, setInnovation] = useState<Innovation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ndaRequired, setNdaRequired] = useState(true);
  const [ndaType, setNdaType] = useState<'standard' | 'custom'>('standard');
  const [customNdaText, setCustomNdaText] = useState('');
  const {
    canEditInnovation,
    isLoading: permissionsLoading
  } = useTeamPermissions(innovation?.id);
  useEffect(() => {
    loadInnovation();
  }, []);
  useEffect(() => {
    if (!permissionsLoading && innovation && !canEditInnovation) {
      toast.error('You do not have permission to access settings');
      navigate('/innovator/tank');
    }
  }, [canEditInnovation, permissionsLoading, innovation, navigate]);
  const loadInnovation = async () => {
    try {
      const primaryInnovation = await innovationAPI.getPrimaryInnovation();
      setInnovation(primaryInnovation);
      setIsPublished(primaryInnovation.status === 'published');
    } catch (error) {
      console.error('Error loading innovation:', error);
      toast.error('Failed to load innovation');
      navigate('/innovator/tank');
    } finally {
      setIsLoading(false);
    }
  };
  const handlePublishToggle = async (checked: boolean) => {
    if (!innovation) return;
    setIsSaving(true);
    try {
      const {
        error
      } = await supabase.from('innovations').update({
        status: checked ? 'published' : 'draft'
      }).eq('id', innovation.id);
      if (error) throw error;
      setIsPublished(checked);
      toast.success(checked ? 'Innovation published' : 'Innovation set to draft');
    } catch (error) {
      console.error('Error updating innovation:', error);
      toast.error('Failed to update innovation status');
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteInnovation = async () => {
    if (!innovation) return;
    setIsDeleting(true);
    try {
      const {
        error
      } = await supabase.from('innovations').delete().eq('id', innovation.id);
      if (error) throw error;
      toast.success('Innovation deleted successfully');
      navigate('/innovator/tank');
    } catch (error) {
      console.error('Error deleting innovation:', error);
      toast.error('Failed to delete innovation');
      setIsDeleting(false);
    }
  };
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <FishtankHeader title="Innovation Settings" showLogo={false} />
      
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-24 space-y-4">
        {/* Publishing Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>
              Control the visibility of your innovation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="publish">Publish Innovation</Label>
                <p className="text-sm text-muted-foreground">
                  Make your innovation visible to investors and the public
                </p>
              </div>
              <Switch id="publish" checked={isPublished} onCheckedChange={handlePublishToggle} disabled={isSaving} />
            </div>
          </CardContent>
        </Card>

        {/* NDA Settings */}
        <Card>
          <CardHeader>
            <CardTitle>NDA</CardTitle>
            <CardDescription>
              Require investors to sign an NDA before viewing detailed information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="nda">Require NDA</Label>
                <p className="text-sm text-muted-foreground">
                  Protect your intellectual property
                </p>
              </div>
              <Switch id="nda" checked={ndaRequired} onCheckedChange={setNdaRequired} disabled={isSaving} />
            </div>

            {ndaRequired && <div className="space-y-4 pt-4 border-t animate-in fade-in-50 slide-in-from-top-2">
                <div className="space-y-3">
                  <Label>NDA Type</Label>
                  <RadioGroup value={ndaType} onValueChange={value => setNdaType(value as 'standard' | 'custom')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-normal cursor-pointer">
                        Standard NDA
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="font-normal cursor-pointer">
                        Custom NDA
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {ndaType === 'custom' && <div className="space-y-2 animate-in fade-in-50 slide-in-from-top-2">
                    <Label htmlFor="custom-nda">Custom NDA Text</Label>
                    <Textarea id="custom-nda" placeholder="Enter your custom NDA terms and conditions..." value={customNdaText} onChange={e => setCustomNdaText(e.target.value)} className="min-h-[200px] resize-y" />
                    <p className="text-xs text-muted-foreground">
                      This NDA will be presented to investors before they can access detailed information
                    </p>
                  </div>}

                <Button onClick={() => toast.success('NDA settings saved')} disabled={isSaving} className="w-full">
                  Save NDA Settings
                </Button>
              </div>}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="w-full text-destructive border-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Innovation
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    innovation, all associated pitches, and remove all team members.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteInnovation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>;
}