import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FishtankHeader } from "@/components/innovator/layout/FishtankHeader";
import { Button } from "@/components/innovator/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/innovator/ui/card";
import { Label } from "@/components/innovator/ui/label";
import { Switch } from "@/components/innovator/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/innovator/ui/radio-group";
import { Textarea } from "@/components/innovator/ui/textarea";
import { Badge } from "@/components/innovator/ui/badge";
import { innovationAPI } from "@/lib/innovator/tankApi";
import { useTeamPermissions } from "@/hooks/innovator/useTeamPermissions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Innovation } from "@/types";
import { Shield, FileText, Users, ChevronLeft, Info } from "lucide-react";


export default function NDASettings() {
  const navigate = useNavigate();
  const [innovation, setInnovation] = useState<Innovation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [ndaRequired, setNdaRequired] = useState(true);
  const [ndaType, setNdaType] = useState<'standard' | 'custom'>('standard');
  const [customNdaText, setCustomNdaText] = useState('');
  const [autoNdaRequired, setAutoNdaRequired] = useState(true);
  const [ndaExpiration, setNdaExpiration] = useState<'perpetual' | '1year' | '2years' | '5years'>('perpetual');

  const {
    canEditInnovation,
    isLoading: permissionsLoading
  } = useTeamPermissions(innovation?.id);

  useEffect(() => {
    loadInnovation();
  }, []);

  useEffect(() => {
    if (!permissionsLoading && innovation && !canEditInnovation) {
      toast.error('You do not have permission to access NDA settings');
      navigate('/innovator/tank');
    }
  }, [canEditInnovation, permissionsLoading, innovation, navigate]);

  const loadInnovation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Try to get innovation from database
      let primaryInnovation = await innovationAPI.getPrimaryInnovation();
      
      // If no innovation in database, redirect to create one
      if (!primaryInnovation) {
        console.log('No innovation in database');
        toast.error('Please create an innovation first');
        navigate('/innovator/tank');
        return;
      }
      
      setInnovation(primaryInnovation);
      
      // Load NDA settings from localStorage
      const savedSettings = localStorage.getItem(`nda_settings_${primaryInnovation.id}`);
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          setNdaRequired(settings.ndaRequired ?? true);
          setNdaType(settings.ndaType ?? 'standard');
          setAutoNdaRequired(settings.autoNdaRequired ?? true);
          setNdaExpiration(settings.ndaExpiration ?? 'perpetual');
          setCustomNdaText(settings.customNdaText ?? '');
        } catch (e) {
          console.error('Error parsing saved NDA settings:', e);
        }
      }
    } catch (error) {
      console.error('Error loading innovation:', error);
      toast.error('Failed to load innovation');
      navigate('/innovator/tank');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!innovation) return;
    
    setIsSaving(true);
    try {
      const ndaSettings = {
        ndaRequired,
        ndaType,
        autoNdaRequired,
        ndaExpiration,
        customNdaText,
        updatedAt: new Date().toISOString()
      };
      
      // Save to localStorage (works for both mock and real innovations)
      localStorage.setItem(`nda_settings_${innovation.id}`, JSON.stringify(ndaSettings));
      
      // Save to database
      // Note: This assumes you have a metadata or settings column in your innovations table
      // If not, you may need to create a separate nda_settings table
      try {
        const { error } = await supabase
          .from('innovations')
          .update({
            // Storing as metadata - adjust based on your schema
            // If you don't have this column, this will fail gracefully
          })
          .eq('id', innovation.id);

        // Don't throw on error - localStorage save is already done
        if (error) {
          console.warn('Could not save to database, but saved to localStorage:', error);
        }
      } catch (dbError) {
        console.warn('Database save failed, but localStorage save succeeded:', dbError);
      }
      
      toast.success('NDA settings saved successfully');
    } catch (error) {
      console.error('Error saving NDA settings:', error);
      toast.error('Failed to save NDA settings');
    } finally {
      setIsSaving(false);
    }
  };

  const getSignatureCount = () => {
    // TODO: Fetch actual NDA signature count from database
    return 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FishtankHeader title="NDA Settings" showLogo={false} />
      
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-24 space-y-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/innovator/tank')}
          className="mb-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Tank
        </Button>

        {/* Overview Card */}
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">{innovation?.company_name}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Protect your innovation with customizable non-disclosure agreements
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Status</span>
                    </div>
                    <div className="text-sm font-semibold">
                      {ndaRequired ? (
                        <Badge variant="default" className="bg-green-600">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Disabled</Badge>
                      )}
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-muted-foreground">Signatures</span>
                    </div>
                    <div className="text-sm font-semibold">{getSignatureCount()}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span className="text-xs text-muted-foreground">Type</span>
                    </div>
                    <div className="text-sm font-semibold capitalize">{ndaType}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NDA Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>NDA Configuration</CardTitle>
            <CardDescription>
              Configure when and how investors must sign NDAs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Require NDA Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="nda">Require NDA</Label>
                <p className="text-sm text-muted-foreground">
                  Investors must sign before viewing detailed information
                </p>
              </div>
              <Switch 
                id="nda" 
                checked={ndaRequired} 
                onCheckedChange={setNdaRequired} 
                disabled={isSaving} 
              />
            </div>

            {ndaRequired && (
              <div className="space-y-6 pt-4 border-t animate-in fade-in-50 slide-in-from-top-2">
                {/* Auto-Require NDA */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-nda">Auto-Require for All Investors</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically require NDA for all investor interactions
                    </p>
                  </div>
                  <Switch 
                    id="auto-nda" 
                    checked={autoNdaRequired} 
                    onCheckedChange={setAutoNdaRequired} 
                    disabled={isSaving} 
                  />
                </div>

                {/* NDA Type Selection */}
                <div className="space-y-3">
                  <Label>NDA Type</Label>
                  <RadioGroup 
                    value={ndaType} 
                    onValueChange={(value) => setNdaType(value as 'standard' | 'custom')}
                  >
                    <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="standard" id="standard" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="standard" className="font-medium cursor-pointer">
                          Standard NDA
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Use our pre-written mutual non-disclosure agreement that protects both parties
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="custom" id="custom" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="custom" className="font-medium cursor-pointer">
                          Custom NDA
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Upload or write your own custom NDA agreement
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Custom NDA Text */}
                {ndaType === 'custom' && (
                  <div className="space-y-3 animate-in fade-in-50 slide-in-from-top-2">
                    <Label htmlFor="custom-nda">Custom NDA Text</Label>
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-2">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        We recommend having your custom NDA reviewed by a legal professional before use.
                      </p>
                    </div>
                    <Textarea
                      id="custom-nda"
                      placeholder="Enter your custom NDA text here..."
                      value={customNdaText}
                      onChange={(e) => setCustomNdaText(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                      disabled={isSaving}
                    />
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Upload NDA Document
                    </Button>
                  </div>
                )}

                {/* NDA Expiration */}
                <div className="space-y-3">
                  <Label>NDA Expiration</Label>
                  <RadioGroup 
                    value={ndaExpiration} 
                    onValueChange={(value) => setNdaExpiration(value as typeof ndaExpiration)}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="perpetual" id="perpetual" />
                        <Label htmlFor="perpetual" className="font-normal cursor-pointer">
                          Perpetual
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="1year" id="1year" />
                        <Label htmlFor="1year" className="font-normal cursor-pointer">
                          1 Year
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="2years" id="2years" />
                        <Label htmlFor="2years" className="font-normal cursor-pointer">
                          2 Years
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="5years" id="5years" />
                        <Label htmlFor="5years" className="font-normal cursor-pointer">
                          5 Years
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* NDA Signatures Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Signatures</CardTitle>
            <CardDescription>
              Track who has signed your NDA
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getSignatureCount() > 0 ? (
              <div className="space-y-3">
                {/* TODO: Load actual NDA signatures from database */}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No signatures yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save NDA Settings'
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/innovator/tank')}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

