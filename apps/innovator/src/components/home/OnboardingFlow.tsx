import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  CheckCircle, 
  Target, 
  TrendingUp, 
  Users, 
  Shield,
  BarChart3,
  Briefcase,
  Globe,
  Zap
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
  user: any;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  benefits: string[];
}

export const OnboardingFlow = ({ onComplete, user }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to the Innovation Intelligence Platform',
      description: 'Your comprehensive platform for building, pitching, and scaling your startup.',
      icon: Target,
      benefits: [
        'Track pitch performance and investor engagement',
        'AI-powered market insights for your industry',
        'Connect with relevant investors and partners', 
        'Streamlined fundraising and growth workflows'
      ]
    },
    {
      id: 'analytics',
      title: 'Startup Analytics Dashboard',
      description: 'Get deep insights into your startup\'s performance and market position.',
      icon: BarChart3,
      benefits: [
        'User growth and revenue tracking',
        'Pitch performance analytics',
        'Market benchmarking vs competitors',
        'Investor interest and engagement metrics'
      ]
    },
    {
      id: 'network',
      title: 'Investor Network',
      description: 'Connect with investors, mentors, and fellow entrepreneurs in your ecosystem.',
      icon: Users,
      benefits: [
        'Verified investor profiles and preferences',
        'Startup community and peer networks',
        'Mentorship and advisory connections',
        'Industry events and networking opportunities'
      ]
    },
    {
      id: 'market',
      title: 'Market Intelligence',
      description: 'Stay ahead with real-time market data, trends, and funding opportunities.',
      icon: TrendingUp,
      benefits: [
        'Funding landscape and investor activity',
        'Industry trends and market timing',
        'Competitor analysis and positioning',
        'Regulatory updates and market news'
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <currentStepData.icon className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">
            {currentStepData.title}
          </h1>
          
          <p className="text-muted-foreground text-lg mb-6">
            {currentStepData.description}
          </p>

          {/* Key Benefits */}
          <div className="grid gap-3 text-left max-w-md mx-auto">
            {currentStepData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Skip Tour
          </Button>
          
          <div className="flex items-center gap-2">
            {/* Step Indicators */}
            <div className="flex gap-2 mr-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <Button onClick={handleNext} className="gap-2">
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Platform Features Preview */}
        {currentStep === 0 && (
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold mb-4">Platform Capabilities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Briefcase className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-xs font-medium">Portfolio Management</div>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-xs font-medium">Secure Transactions</div>
              </div>
              <div className="text-center">
                <Globe className="w-6 h-6 text-success mx-auto mb-2" />
                <div className="text-xs font-medium">Global Markets</div>
              </div>
              <div className="text-center">
                <Zap className="w-6 h-6 text-warning mx-auto mb-2" />
                <div className="text-xs font-medium">Real-time Data</div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};