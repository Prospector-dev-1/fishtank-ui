import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Upload, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Innovation } from "@/types";

const step1Schema = z.object({
  company_name: z.string().min(1, 'Company name is required').max(100, 'Must be 100 characters or less'),
  title: z.string().min(1, 'Title is required').max(80, 'Title must be 80 characters or less'),
  tagline: z.string().min(1, 'Tagline is required').max(140, 'Tagline must be 140 characters or less'),
  category: z.string().min(1, 'Category is required'),
  stage: z.string().min(1, 'Stage is required'),
  thumbnail_url: z.string().optional(),
  video_url: z.string().optional()
});

const step2Schema = z.object({
  problem_statement: z.string().min(1, 'Problem statement is required'),
  solution: z.string().min(1, 'Solution description is required'),
  market_size: z.string().min(1, 'Market description is required'),
  businessModel: z.string().min(1, 'Business model is required'),
  traction: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  needs: z.array(z.string()).min(1, 'At least one need is required'),
  websiteUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  deckUrl: z.string().optional(),
  faqs: z.array(z.object({
    question: z.string().min(1, 'Question is required'),
    answer: z.string().min(1, 'Answer is required')
  })).default([]),
  longDescription: z.string().max(5000, 'Description must be less than 5000 characters').optional().or(z.literal(''))
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

interface InnovationSetupWizardProps {
  existingInnovation?: Innovation | null;
  onComplete?: () => void;
}

export function InnovationSetupWizard({ existingInnovation, onComplete }: InnovationSetupWizardProps = {}) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      company_name: existingInnovation?.company_name || '',
      title: existingInnovation?.title || '',
      tagline: existingInnovation?.tagline || '',
      category: existingInnovation?.category || 'AI',
      stage: existingInnovation?.stage || 'Idea',
      thumbnail_url: existingInnovation?.thumbnail_url || '',
      video_url: existingInnovation?.video_url || ''
    }
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      problem_statement: existingInnovation?.problem_statement || '',
      solution: existingInnovation?.solution || '',
      market_size: existingInnovation?.market_size || '',
      businessModel: existingInnovation?.full_description || '',
      traction: existingInnovation?.traction || '',
      tags: [],
      needs: [],
      websiteUrl: '',
      deckUrl: '',
      faqs: (existingInnovation?.faqs as Array<{question: string, answer: string}>) || [],
      longDescription: existingInnovation?.team_description || ''
    }
  });

  const handleStep1Submit = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: Step2Data) => {
    setCurrentStep(3);
  };

  const handleCreateInnovation = async () => {
    if (!step1Data) return;
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to create an innovation');
        return;
      }

      const step2Values = step2Form.getValues();
      
      const innovationData = {
        user_id: user.id,
        company_name: step1Data.company_name || '',
        title: step1Data.title || '',
        tagline: step1Data.tagline || '',
        category: step1Data.category || '',
        stage: step1Data.stage || 'Idea',
        thumbnail_url: step1Data.thumbnail_url,
        video_url: step1Data.video_url,
        problem_statement: step2Values.problem_statement || '',
        solution: step2Values.solution || '',
        market_size: step2Values.market_size || '',
        full_description: step2Values.businessModel || '',
        traction: step2Values.traction || '',
        team_description: step2Values.longDescription || '',
        faqs: step2Values.faqs || [],
        is_published: false,
        status: 'draft'
      };

      let error;
      if (existingInnovation) {
        // Update existing innovation
        const result = await supabase
          .from('innovations')
          .update(innovationData)
          .eq('id', existingInnovation.id)
          .select()
          .single();
        error = result.error;
      } else {
        // Create new innovation
        const result = await supabase
          .from('innovations')
          .insert([innovationData])
          .select()
          .single();
        error = result.error;
      }

      if (error) throw error;
      
      toast.success(existingInnovation ? 'Innovation updated successfully!' : 'Innovation created successfully!');
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      } else {
        // Force page reload to show the changes
        window.location.href = '/tank';
      }
    } catch (error) {
      console.error('Error saving innovation:', error);
      toast.error('Failed to save innovation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (field: 'thumbnail_url' | 'video_url' | 'deckUrl', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to upload files');
        return;
      }

      // Sanitize filename - remove spaces and special characters
      const sanitizedFileName = file.name
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');

      // Determine bucket and file path based on field
      let bucket = 'innovation-thumbnails';
      let filePath = '';
      
      if (field === 'thumbnail_url') {
        bucket = 'innovation-thumbnails';
        filePath = `${user.id}/${Date.now()}-${sanitizedFileName}`;
      } else if (field === 'video_url') {
        bucket = 'pitch-videos';
        filePath = `${user.id}/${Date.now()}-${sanitizedFileName}`;
      } else {
        bucket = 'pitch-decks';
        filePath = `${user.id}/${Date.now()}-${sanitizedFileName}`;
      }

      toast.info('Uploading file...');

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(error.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      // Set the form value with the public URL
      if (field === 'thumbnail_url') {
        step1Form.setValue('thumbnail_url', publicUrl, { shouldValidate: true });
      } else if (field === 'video_url') {
        step1Form.setValue('video_url', publicUrl, { shouldValidate: true });
      } else {
        step2Form.setValue('deckUrl', publicUrl, { shouldValidate: true });
      }
      
      toast.success(`${file.name} uploaded successfully`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload file');
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Create Your Innovation</h1>
            {currentStep > 1 && (
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(currentStep - 1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          
          {/* Stepper Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep} of 3</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs">
              <span className={currentStep >= 1 ? "text-primary font-medium" : "text-muted-foreground"}>
                1 • Basics
              </span>
              <span className={currentStep >= 2 ? "text-primary font-medium" : "text-muted-foreground"}>
                2 • Details
              </span>
              <span className={currentStep >= 3 ? "text-primary font-medium" : "text-muted-foreground"}>
                3 • Review
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Step 1: Basics */}
        {currentStep === 1 && (
          <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Innovation Basics</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Tell us about your innovation in a few key details
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    placeholder="e.g. AquaSense Inc."
                    {...step1Form.register('company_name')}
                  />
                  {step1Form.formState.errors.company_name && (
                    <p className="text-sm text-destructive mt-1">
                      {step1Form.formState.errors.company_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="title">Innovation Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. AquaSense"
                    {...step1Form.register('title')}
                  />
                  {step1Form.formState.errors.title && (
                    <p className="text-sm text-destructive mt-1">
                      {step1Form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tagline">Tagline *</Label>
                  <Textarea
                    id="tagline"
                    placeholder="Describe your innovation in one compelling sentence..."
                    className="min-h-[60px] resize-none"
                    maxLength={140}
                    {...step1Form.register('tagline')}
                  />
                  <div className="flex justify-between mt-1">
                    {step1Form.formState.errors.tagline && (
                      <p className="text-sm text-destructive">
                        {step1Form.formState.errors.tagline.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground ml-auto">
                      {step1Form.watch('tagline')?.length || 0}/140
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category *</Label>
                    <Select 
                      defaultValue="AI"
                      onValueChange={(value) => step1Form.setValue('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AI">AI/ML</SelectItem>
                        <SelectItem value="FinTech">FinTech</SelectItem>
                        <SelectItem value="HealthTech">HealthTech</SelectItem>
                        <SelectItem value="EdTech">EdTech</SelectItem>
                        <SelectItem value="ClimaTech">ClimateTech</SelectItem>
                        <SelectItem value="IoT">IoT</SelectItem>
                        <SelectItem value="SaaS">B2B SaaS</SelectItem>
                        <SelectItem value="Consumer">Consumer</SelectItem>
                      </SelectContent>
                    </Select>
                    {step1Form.formState.errors.category && (
                      <p className="text-sm text-destructive mt-1">
                        {step1Form.formState.errors.category.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Stage *</Label>
                    <Select 
                      defaultValue="Idea"
                      onValueChange={(value) => step1Form.setValue('stage', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Idea">Idea</SelectItem>
                        <SelectItem value="Prototype">Prototype</SelectItem>
                        <SelectItem value="MVP">MVP</SelectItem>
                        <SelectItem value="Beta">Beta</SelectItem>
                        <SelectItem value="Launched">Launched</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Logo</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your innovation logo
                    </p>
                    <input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('thumbnail_url', e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('thumbnail-upload')?.click()}
                    >
                      Choose File
                    </Button>
                    {step1Form.watch('thumbnail_url') && (
                      <div className="mt-2 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-600">Logo uploaded</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Video Description (Optional)</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Upload a 10-15 minute video describing your innovation
                  </p>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      MP4, MOV, or AVI format recommended
                    </p>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload('video_url', e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('video-upload')?.click()}
                    >
                      Choose Video
                    </Button>
                    {step1Form.watch('video_url') && (
                      <div className="mt-2 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-600">Video uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg">
              Continue to Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Innovation Details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Provide detailed information about your innovation
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="problem_statement">Problem Statement *</Label>
                  <Textarea
                    id="problem_statement"
                    placeholder="What problem are you solving?"
                    className="min-h-[80px]"
                    {...step2Form.register('problem_statement')}
                  />
                  {step2Form.formState.errors.problem_statement && (
                    <p className="text-sm text-destructive mt-1">
                      {step2Form.formState.errors.problem_statement.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="solution">Solution *</Label>
                  <Textarea
                    id="solution"
                    placeholder="How does your innovation solve this problem?"
                    className="min-h-[80px]"
                    {...step2Form.register('solution')}
                  />
                  {step2Form.formState.errors.solution && (
                    <p className="text-sm text-destructive mt-1">
                      {step2Form.formState.errors.solution.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="market_size">Market *</Label>
                  <Textarea
                    id="market_size"
                    placeholder="Describe your target market and opportunity size..."
                    className="min-h-[60px]"
                    {...step2Form.register('market_size')}
                  />
                  {step2Form.formState.errors.market_size && (
                    <p className="text-sm text-destructive mt-1">
                      {step2Form.formState.errors.market_size.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="businessModel">Business Model *</Label>
                  <Textarea
                    id="businessModel"
                    placeholder="How do you plan to make money?"
                    className="min-h-[60px]"
                    {...step2Form.register('businessModel')}
                  />
                  {step2Form.formState.errors.businessModel && (
                    <p className="text-sm text-destructive mt-1">
                      {step2Form.formState.errors.businessModel.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="traction">Traction (Optional)</Label>
                  <Textarea
                    id="traction"
                    placeholder="Key metrics, milestones achieved, user numbers, revenue, partnerships, etc."
                    className="min-h-[80px]"
                    {...step2Form.register('traction')}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Describe your progress, achievements, and key metrics
                  </p>
                  {step2Form.formState.errors.traction && (
                    <p className="text-sm text-destructive mt-1">
                      {step2Form.formState.errors.traction.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tags">Tags *</Label>
                  <Input
                    id="tags"
                    placeholder="e.g. iot, agriculture, sustainability"
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
                      step2Form.setValue('tags', tags);
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate multiple tags with commas
                  </p>
                  {step2Form.formState.errors.tags && (
                    <p className="text-sm text-destructive mt-1">
                      {step2Form.formState.errors.tags.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="needs">What do you need? *</Label>
                  <Input
                    id="needs"
                    placeholder="e.g. Investors, Technical co-founder, Marketing help"
                    onChange={(e) => {
                      const needs = e.target.value.split(',').map(need => need.trim()).filter(Boolean);
                      step2Form.setValue('needs', needs);
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate multiple needs with commas
                  </p>
                  {step2Form.formState.errors.needs && (
                    <p className="text-sm text-destructive mt-1">
                      {step2Form.formState.errors.needs.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>FAQs (Optional)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentFaqs = step2Form.getValues('faqs') || [];
                        step2Form.setValue('faqs', [...currentFaqs, { question: '', answer: '' }]);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add FAQ
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add frequently asked questions about your innovation
                  </p>
                  
                  {step2Form.watch('faqs')?.map((faq, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-3">
                            <div>
                              <Label htmlFor={`faq-question-${index}`}>Question</Label>
                              <Input
                                id={`faq-question-${index}`}
                                placeholder="e.g. What problem does this solve?"
                                value={faq.question}
                                onChange={(e) => {
                                  const faqs = step2Form.getValues('faqs');
                                  faqs[index].question = e.target.value;
                                  step2Form.setValue('faqs', faqs);
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                              <Textarea
                                id={`faq-answer-${index}`}
                                placeholder="Provide a clear answer..."
                                className="min-h-[60px]"
                                value={faq.answer}
                                onChange={(e) => {
                                  const faqs = step2Form.getValues('faqs');
                                  faqs[index].answer = e.target.value;
                                  step2Form.setValue('faqs', faqs);
                                }}
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const faqs = step2Form.getValues('faqs').filter((_, i) => i !== index);
                              step2Form.setValue('faqs', faqs);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div>
                  <Label htmlFor="longDescription">Long Description (Optional)</Label>
                  <Textarea
                    id="longDescription"
                    placeholder="Provide a detailed description of your innovation, including technical details, implementation, future plans, etc."
                    className="min-h-[200px]"
                    maxLength={5000}
                    {...step2Form.register('longDescription')}
                  />
                  <div className="flex justify-between mt-1">
                    {step2Form.formState.errors.longDescription && (
                      <p className="text-sm text-destructive">
                        {step2Form.formState.errors.longDescription.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground ml-auto">
                      {step2Form.watch('longDescription')?.length || 0}/5000
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="websiteUrl">Website</Label>
                  <Input
                    id="websiteUrl"
                    placeholder="https://yourwebsite.com"
                    {...step2Form.register('websiteUrl')}
                  />
                  {step2Form.formState.errors.websiteUrl && (
                    <p className="text-sm text-destructive mt-1">
                      {step2Form.formState.errors.websiteUrl.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Pitch Deck</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your pitch deck (PDF)
                    </p>
                    <input
                      id="deck-upload"
                      type="file"
                      accept=".pdf,.ppt,.pptx"
                      className="hidden"
                      onChange={(e) => handleFileUpload('deckUrl', e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('deck-upload')?.click()}
                    >
                      Choose File
                    </Button>
                    {step2Form.watch('deckUrl') && (
                      <div className="mt-2 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-green-600">Deck uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg">
              Review & Create
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && step1Data && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Your Innovation</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Please review your information before creating your innovation
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  {step1Data.thumbnail_url && (
                    <img 
                      src={step1Data.thumbnail_url} 
                      alt="Logo" 
                      className="w-16 h-16 rounded-lg border bg-muted" 
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{step1Data.title}</h3>
                    <p className="text-muted-foreground">{step1Data.tagline}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{step1Data.category}</Badge>
                      <Badge variant="outline">{step1Data.stage}</Badge>
                    </div>
                  </div>
                </div>

                {step1Data.video_url && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">VIDEO DESCRIPTION</h4>
                    <div className="border rounded-lg p-3 bg-muted/50">
                      <p className="text-sm">✓ Video uploaded successfully</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">PROBLEM</h4>
                    <p className="mt-1">{step2Form.watch('problem_statement')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">SOLUTION</h4>
                    <p className="mt-1">{step2Form.watch('solution')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">MARKET</h4>
                    <p className="mt-1">{step2Form.watch('market_size')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">BUSINESS MODEL</h4>
                    <p className="mt-1">{step2Form.watch('businessModel')}</p>
                  </div>

                  {step2Form.watch('traction') && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">TRACTION</h4>
                      <p className="mt-1 whitespace-pre-wrap">{step2Form.watch('traction')}</p>
                    </div>
                  )}
                  
                  {step2Form.watch('tags')?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">TAGS</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {step2Form.watch('tags').map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {step2Form.watch('needs')?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">NEEDS</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {step2Form.watch('needs').map((need, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {need}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {step2Form.watch('faqs')?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">FAQs</h4>
                      <div className="space-y-3 mt-2">
                        {step2Form.watch('faqs').map((faq, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <p className="font-medium text-sm">{faq.question}</p>
                            <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step2Form.watch('longDescription') && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">LONG DESCRIPTION</h4>
                      <p className="mt-1 whitespace-pre-wrap">{step2Form.watch('longDescription')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleCreateInnovation}
              disabled={isSubmitting}
              className="w-full" 
              size="lg"
            >
              {isSubmitting ? 'Creating Innovation...' : 'Create Innovation'}
              {!isSubmitting && <CheckCircle className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}