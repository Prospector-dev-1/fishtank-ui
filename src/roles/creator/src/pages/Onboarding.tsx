import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, Plus, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/creatorData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Service {
  id: string;
  title: string;
  scope: string[];
  etaDays: number;
  price: number;
  offersEquity: boolean;
  offersCommission: boolean;
}
export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    headline: "",
    website: "",
    skills: [] as string[],
    bio: "",
    services: [] as Service[],
    defaultNDA: true,
    pricingModes: [] as string[],
    hourlyRate: "",
    hourlyFlexible: false,
    commissionRate: "",
    commissionFlexible: false,
    equityRange: "",
    equityFlexible: false
  });
  
  const [currentService, setCurrentService] = useState({
    title: "",
    scope: [] as string[],
    etaDays: "",
    price: "",
    offersEquity: false,
    offersCommission: false
  });
  const [currentScopeItem, setCurrentScopeItem] = useState("");
  
  const totalSteps = 5;
  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill]
    }));
  };
  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
      setCustomSkill("");
    }
  };
  const togglePricingMode = (mode: string) => {
    setFormData(prev => ({
      ...prev,
      pricingModes: prev.pricingModes.includes(mode) ? prev.pricingModes.filter(m => m !== mode) : [...prev.pricingModes, mode]
    }));
  };

  const addScopeItem = () => {
    if (currentScopeItem.trim() && !currentService.scope.includes(currentScopeItem.trim())) {
      setCurrentService(prev => ({
        ...prev,
        scope: [...prev.scope, currentScopeItem.trim()]
      }));
      setCurrentScopeItem("");
    }
  };

  const removeScopeItem = (item: string) => {
    setCurrentService(prev => ({
      ...prev,
      scope: prev.scope.filter(s => s !== item)
    }));
  };

  const addService = () => {
    if (currentService.title && currentService.scope.length > 0 && currentService.etaDays && currentService.price) {
      const newService: Service = {
        id: Date.now().toString(),
        title: currentService.title,
        scope: currentService.scope,
        etaDays: parseInt(currentService.etaDays),
        price: parseFloat(currentService.price),
        offersEquity: currentService.offersEquity,
        offersCommission: currentService.offersCommission
      };
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService]
      }));
      setCurrentService({
        title: "",
        scope: [],
        etaDays: "",
        price: "",
        offersEquity: false,
        offersCommission: false
      });
    }
  };

  const removeService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
  };
  const handleComplete = async () => {
    if (!user) {
      toast.error("Please log in to complete onboarding");
      return;
    }

    setSaving(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          bio: formData.bio,
          social_links: formData.website ? { website: formData.website } : {},
          hourly_rate: formData.hourlyFlexible ? null : (formData.hourlyRate ? parseFloat(formData.hourlyRate) : null),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Insert services
      if (formData.services.length > 0) {
        const servicesData = formData.services.map(service => ({
          creator_id: user.id,
          title: service.title,
          description: service.scope.join('\n'),
          delivery_days: service.etaDays,
          price: service.price,
          offers_equity: service.offersEquity,
          offers_commission: service.offersCommission,
        }));

        const { error: servicesError } = await supabase
          .from('services')
          .insert(servicesData);

        if (servicesError) throw servicesError;
      }

      // Get or create skills
      for (const skillName of formData.skills) {
        // Try to find existing skill
        const { data: existingSkill } = await supabase
          .from('skills')
          .select('id')
          .eq('name', skillName)
          .maybeSingle();

        let skillId = existingSkill?.id;

        // If skill doesn't exist, create it
        if (!skillId) {
          const { data: newSkill, error: skillError } = await supabase
            .from('skills')
            .insert({ name: skillName })
            .select('id')
            .single();

          if (skillError) {
            console.error('Error creating skill:', skillError);
            continue;
          }
          skillId = newSkill?.id;
        }

        // Link skill to creator
        if (skillId) {
          await supabase
            .from('creator_skills')
            .insert({ creator_id: user.id, skill_id: skillId });
        }
      }

      toast.success("Profile created successfully!");
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  return <div className="min-h-screen bg-gradient-subtle p-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
              {Array.from({
              length: totalSteps
            }, (_, i) => <div key={i} className={`h-2 w-8 rounded-full transition-colors ${i + 1 <= step ? 'bg-primary' : 'bg-muted'}`} />)}
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to Creator</CardTitle>
          <p className="text-muted-foreground">Let's set up your profile</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div>
                <label className="text-sm font-medium">Your Name</label>
                <Input value={formData.name} onChange={e => setFormData(prev => ({
              ...prev,
              name: e.target.value
            }))} placeholder="Alex Rivera" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Professional Headline</label>
                <Input value={formData.headline} onChange={e => setFormData(prev => ({
              ...prev,
              headline: e.target.value
            }))} placeholder="UI/UX Designer & Video Creator" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <Textarea value={formData.bio} onChange={e => setFormData(prev => ({
              ...prev,
              bio: e.target.value
            }))} placeholder="Tell potential clients about your experience and expertise..." className="mt-1" rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium">Website (Optional)</label>
                <Input value={formData.website} onChange={e => setFormData(prev => ({
              ...prev,
              website: e.target.value
            }))} placeholder="https://yourportfolio.com" className="mt-1" />
              </div>
            </div>}

          {step === 2 && <div className="space-y-4">
              <h3 className="text-lg font-semibold">Skills & Expertise</h3>
              <p className="text-sm text-muted-foreground">Select the services you offer</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(skill => <Badge key={skill} variant={formData.skills.includes(skill) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleSkill(skill)}>
                    {formData.skills.includes(skill) && <Check className="w-3 h-3 mr-1" />}
                    {skill}
                  </Badge>)}
              </div>
              
              <div className="pt-4 border-t">
                <label className="text-sm font-medium mb-2 block">Add Custom Skill</label>
                <div className="flex gap-2">
                  <Input value={customSkill} onChange={e => setCustomSkill(e.target.value)} placeholder="Enter a skill not listed above..." onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomSkill();
                }
              }} />
                  <Button type="button" variant="outline" onClick={addCustomSkill} disabled={!customSkill.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {formData.skills.length > 0 && <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">Selected skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map(skill => <Badge key={skill} variant="default" className="cursor-pointer" onClick={() => toggleSkill(skill)}>
                        {skill}
                        <span className="ml-1">×</span>
                      </Badge>)}
                  </div>
                </div>}
            </div>}

          {step === 3 && <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Services</h3>
              <p className="text-sm text-muted-foreground">Add service packages you offer (optional - you can always add these later)</p>
              
              {formData.services.length > 0 && (
                <div className="space-y-3">
                  {formData.services.map(service => (
                    <Card key={service.id} className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeService(service.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <CardContent className="pt-6">
                        <h4 className="text-lg font-semibold mb-2">{service.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {service.etaDays} days
                          </div>
                          <div className="text-lg font-semibold text-foreground">
                            ${service.price.toLocaleString()}
                          </div>
                        </div>
                        <ul className="space-y-2 mb-3">
                          {service.scope.map((item, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-muted-foreground mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        {(service.offersEquity || service.offersCommission) && (
                          <div className="flex gap-2">
                            {service.offersEquity && (
                              <Badge variant="secondary" className="text-xs">also accepts equity-based pay</Badge>
                            )}
                            {service.offersCommission && (
                              <Badge variant="secondary" className="text-xs">also accepts commission-based pay</Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add a Service Package</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Service Title</label>
                    <Input 
                      value={currentService.title} 
                      onChange={e => setCurrentService(prev => ({...prev, title: e.target.value}))}
                      placeholder="e.g., Pitch Deck Pro"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Duration (days)</label>
                      <Input 
                        type="number"
                        value={currentService.etaDays} 
                        onChange={e => setCurrentService(prev => ({...prev, etaDays: e.target.value}))}
                        placeholder="7"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price ($)</label>
                      <Input 
                        type="number"
                        value={currentService.price} 
                        onChange={e => setCurrentService(prev => ({...prev, price: e.target.value}))}
                        placeholder="2500"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">What's included</label>
                    {currentService.scope.length > 0 && (
                      <div className="space-y-1 mb-2">
                        {currentService.scope.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm bg-muted px-3 py-2 rounded">
                            <span>• {item}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => removeScopeItem(item)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input 
                        value={currentScopeItem} 
                        onChange={e => setCurrentScopeItem(e.target.value)}
                        placeholder="e.g., Complete 12-15 slide pitch deck design"
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addScopeItem();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addScopeItem}
                        disabled={!currentScopeItem.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <label className="text-sm font-medium">Also available for:</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        id="service-equity"
                        checked={currentService.offersEquity}
                        onChange={e => setCurrentService(prev => ({...prev, offersEquity: e.target.checked}))}
                        className="cursor-pointer"
                      />
                      <label htmlFor="service-equity" className="text-sm cursor-pointer">Equity-based</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        id="service-commission"
                        checked={currentService.offersCommission}
                        onChange={e => setCurrentService(prev => ({...prev, offersCommission: e.target.checked}))}
                        className="cursor-pointer"
                      />
                      <label htmlFor="service-commission" className="text-sm cursor-pointer">Commission-based</label>
                    </div>
                  </div>

                  {currentService.title && currentService.scope.length > 0 && currentService.etaDays && currentService.price && (
                    <div className="pt-4 border-t">
                      <label className="text-sm font-medium mb-3 block">Preview</label>
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                          <h4 className="text-lg font-semibold mb-2">{currentService.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {currentService.etaDays} days
                            </div>
                            <div className="text-lg font-semibold text-foreground">
                              ${parseFloat(currentService.price).toLocaleString()}
                            </div>
                          </div>
                          <ul className="space-y-2 mb-3">
                            {currentService.scope.map((item, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="text-muted-foreground mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                          {(currentService.offersEquity || currentService.offersCommission) && (
                            <div className="flex gap-2">
                              {currentService.offersEquity && (
                                <Badge variant="secondary" className="text-xs">also accepts equity-based pay</Badge>
                              )}
                              {currentService.offersCommission && (
                                <Badge variant="secondary" className="text-xs">also accepts commission-based pay</Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <Button 
                    onClick={addService}
                    disabled={!currentService.title || currentService.scope.length === 0 || !currentService.etaDays || !currentService.price}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </CardContent>
              </Card>
            </div>}

          {step === 4 && <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing & Availability</h3>
              <div>
                <label className="text-sm font-medium mb-2 block">Pricing Models (Select all that apply)</label>
                <div className="space-y-2">
                  {[{
                value: 'packages',
                label: 'Fixed Packages'
              }, {
                value: 'hourly',
                label: 'Hourly Rate'
              }, {
                value: 'commission',
                label: 'Commission-Based'
              }, {
                value: 'equity',
                label: 'Equity-Based'
              }].map(option => <div key={option.value} className="flex items-center space-x-2">
                      <input type="checkbox" id={option.value} checked={formData.pricingModes.includes(option.value)} onChange={() => togglePricingMode(option.value)} className="cursor-pointer" />
                      <label htmlFor={option.value} className="text-sm cursor-pointer">{option.label}</label>
                    </div>)}
                </div>
              </div>

              {formData.pricingModes.includes('hourly') && <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Hourly Rate ($)</label>
                    <div className="flex items-center gap-2">
                      <Switch checked={formData.hourlyFlexible} onCheckedChange={checked => setFormData(prev => ({
                  ...prev,
                  hourlyFlexible: checked
                }))} />
                      <span className="text-xs text-muted-foreground">I'm flexible</span>
                    </div>
                  </div>
                  {!formData.hourlyFlexible && <Input type="number" value={formData.hourlyRate} onChange={e => setFormData(prev => ({
              ...prev,
              hourlyRate: e.target.value
            }))} placeholder="85" />}
                  {formData.hourlyFlexible && <p className="text-xs text-muted-foreground">You're open to negotiating your hourly rate</p>}
                </div>}

              {formData.pricingModes.includes('commission') && <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Commission Rate (%)</label>
                    <div className="flex items-center gap-2">
                      <Switch checked={formData.commissionFlexible} onCheckedChange={checked => setFormData(prev => ({
                  ...prev,
                  commissionFlexible: checked
                }))} />
                      <span className="text-xs text-muted-foreground">I'm flexible</span>
                    </div>
                  </div>
                  {!formData.commissionFlexible && <>
                      <Input type="number" value={formData.commissionRate} onChange={e => setFormData(prev => ({
                ...prev,
                commissionRate: e.target.value
              }))} placeholder="10" />
                      <p className="text-xs text-muted-foreground">Percentage of revenue or sales</p>
                    </>}
                  {formData.commissionFlexible && <p className="text-xs text-muted-foreground">You're open to negotiating your commission rate</p>}
                </div>}

              {formData.pricingModes.includes('equity') && <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Equity Range (%)</label>
                    <div className="flex items-center gap-2">
                      <Switch checked={formData.equityFlexible} onCheckedChange={checked => setFormData(prev => ({
                  ...prev,
                  equityFlexible: checked
                }))} />
                      <span className="text-xs text-muted-foreground">I'm flexible</span>
                    </div>
                  </div>
                  {!formData.equityFlexible && <>
                      <Input type="text" value={formData.equityRange} onChange={e => setFormData(prev => ({
                ...prev,
                equityRange: e.target.value
              }))} placeholder="0.5 - 2" />
                      <p className="text-xs text-muted-foreground">Typical equity percentage you accept</p>
                    </>}
                  {formData.equityFlexible && <p className="text-xs text-muted-foreground">You're open to negotiating your equity stake</p>}
                </div>}
            </div>}

          {step === 5 && <div className="space-y-4">
              <div className="p-4 bg-success/10 rounded-lg">
                <h4 className="font-medium text-success mb-2">You're all set! 🎉</h4>
                <p className="text-sm text-muted-foreground">
                  You can always update these settings later in your profile.
                </p>
              </div>
            </div>}

          <div className="flex gap-3 pt-4">
            {step > 1 && <Button variant="outline" onClick={prevStep} className="flex-1">
                Back
              </Button>}
            <Button onClick={nextStep} className="flex-1">
              {step === totalSteps ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
}