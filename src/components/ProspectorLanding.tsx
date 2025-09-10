import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Bell, 
  PlayCircle, 
  Phone, 
  CheckCircle, 
  Lightbulb, 
  TrendingUp, 
  Target,
  ChevronDown,
  ChevronUp,
  Star,
  ChevronRight,
  ArrowUp,
  Download,
  Upload,
  BarChart3,
  Instagram,
  Brain,
  RotateCcw,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Import screenshots
import prospectorLogo from '/lovable-uploads/ca9da5b8-7e1a-4901-9e3f-07d28a663c4b.png';
import screenshot1 from '@/assets/screenshot-1.png';
import screenshot2 from '@/assets/screenshot-2.png';
import screenshot3 from '@/assets/screenshot-3.png';
import screenshot4 from '@/assets/screenshot-4.png';
import screenshot5 from '@/assets/screenshot-5.png';
import screenshot6 from '@/assets/screenshot-6.png';
import screenshot7 from '@/assets/screenshot-7.png';
import screenshot8 from '@/assets/screenshot-8.png';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0
  }
};

const floatVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function ProspectorLanding() {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [formData, setFormData] = useState({ email: '', name: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const scrollToBeta = () => {
    document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsNavVisible(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const MotionDiv = shouldReduceMotion ? 'div' : motion.div;
  const MotionCard = shouldReduceMotion ? Card : motion(Card);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isNavVisible 
          ? 'h-14 bg-background-charcoal/95 backdrop-blur-nav border-b border-divider' 
          : 'h-16 bg-background-charcoal/85 backdrop-blur-nav'
      }`}>
        <div className="container mx-auto h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={prospectorLogo} alt="Prospector logo" className="w-8 h-8" />
            <span className="text-body-s font-semibold tracking-wide hidden md:block">PROSPECTOR</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={scrollToHowItWorks}
              className="text-body-s text-text-medium hover:text-text-high transition-colors hover:underline underline-offset-4"
            >
              How it Works
            </button>
            <button 
              onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-body-s text-text-medium hover:text-text-high transition-colors hover:underline underline-offset-4"
            >
              Testimonials
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={scrollToBeta} className="hidden md:flex">
              Learn More
            </Button>
            <Button variant="ghost" size="sm" onClick={scrollToBeta} className="hidden md:flex">
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={scrollToBeta} className="md:hidden">
              Learn More
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-30 pb-16 md:pb-22">
        <div className="container mx-auto">
          <MotionDiv
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <motion.div className="mb-3">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
                  <img src={prospectorLogo} alt="Prospector" className="w-6 h-6" />
                  <span className="text-body-s font-medium text-text-medium">Prospector</span>
                </div>
                <p className="text-body-s text-text-medium">Your all-in-one sales gym</p>
              </motion.div>

              <motion.h1 className="text-h1 text-text-high mb-3 max-w-[10ch] lg:max-w-none mx-auto lg:mx-0">
                Master the art of cold calling
              </motion.h1>

              <motion.p className="text-body-l text-text-medium mb-6 max-w-[26ch] lg:max-w-[42ch] mx-auto lg:mx-0">
                Train, practice, and build confidence with AI-powered simulations.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={scrollToBeta}
                  className="w-full sm:w-auto"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Join the Beta
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  onClick={() => window.open('https://instagram.com/prospector.app', '_blank')}
                  className="w-full sm:w-auto"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Follow on Instagram
                </Button>
              </motion.div>
            </div>

            {/* Hero Visual */}
            <motion.div 
              animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
              transition={shouldReduceMotion ? {} : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent-glow/40 blur-[120px] rounded-full transform scale-150" />
                <img 
                  src="/lovable-uploads/f0760eb8-3e65-4be2-8896-12f6399c28f4.png" 
                  alt="Prospector app showing progress tracking and confidence metrics" 
                  className="relative w-[300px] lg:w-[400px] h-auto rounded-2xl shadow-card transform rotate-[8deg] hover:rotate-[6deg] transition-transform duration-300"
                />
              </div>
            </motion.div>
          </MotionDiv>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-t border-divider">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-body-s text-text-low uppercase tracking-widest mb-6">
              Trusted by salespeople and founders across North America
            </p>
            <div className="flex justify-center items-center gap-8 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-shrink-0 w-18 h-6 bg-surface-1 rounded opacity-70 hover:opacity-100 transition-opacity" />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section id="value-grid" className="py-16 md:py-30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-h2 text-text-high">Why Prospector works</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Phone,
                title: "AI Prospect Practice",
                description: "Simulate realistic cold calls with dynamic AI.",
                image: screenshot2
              },
              {
                icon: CheckCircle,
                title: "Call Review & Feedback",
                description: "Upload your calls for AI analysis and get actionable feedback.",
                image: screenshot5
              },
              {
                icon: Brain,
                title: "Script & Psychological Insight",
                description: "See inside your prospect's head and learn how to respond effectively.",
                image: screenshot6
              },
              {
                icon: RotateCcw,
                title: "Replay Mode & Challenges",
                description: "Replay key moments and complete challenges to master your skills.",
                image: screenshot7
              }
            ].map((card, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={shouldReduceMotion ? {} : { 
                  y: -4, 
                  boxShadow: "0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(15,122,81,0.25)" 
                }}
                className="bg-surface-1 border border-border rounded-lg p-6 hover:border-accent-glow/25 transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
                      <card.icon className="w-6 h-6 text-accent-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-h3 text-text-high mb-2">{card.title}</h3>
                      <p className="text-body-s text-text-medium">{card.description}</p>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={card.image} 
                      alt={`${card.title} screenshot`}
                      className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardContent>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-30 bg-surface-1">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-h2 text-text-high">What people say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Sales Director",
                quote: "Prospector made me comfortable before the real thing",
                rating: 5
              },
              {
                name: "Mike Rodriguez", 
                role: "Founder",
                quote: "Five stars for polish and clarity",
                rating: 5
              },
              {
                name: "Emily Johnson",
                role: "Sales Rep",
                quote: "Short, simple, and powerful practice",
                rating: 4
              }
            ].map((testimonial, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                className="bg-surface-2 border border-border rounded-lg p-6"
              >
                <CardContent className="p-0">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-accent-primary fill-current' : 'text-text-low'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-body-l text-text-high mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-1" />
                    <div>
                      <p className="text-body-s font-medium text-text-high">{testimonial.name}</p>
                      <p className="text-caption text-text-low">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-h2 text-text-high">How it works</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                number: 1,
                icon: Download,
                title: "Sign up & download",
                description: "Join the beta and install Prospector on your phone."
              },
              {
                number: 2,
                icon: Upload,
                title: "Practice & Upload",
                description: "Practice calls with AI and upload your real calls for analysis."
              },
              {
                number: 3,
                icon: Trophy,
                title: "Improve & Repeat",
                description: "Get feedback, replay key moments, and track your progress."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center relative"
              >
                <div className="w-12 h-12 rounded-full bg-accent-primary text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-accent-primary" />
                </div>
                <h3 className="text-h3 text-text-high mb-2">{step.title}</h3>
                <p className="text-body-s text-text-medium">{step.description}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-6 left-full w-full">
                    <ChevronRight className="w-6 h-6 text-border mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="py-16 md:py-30 bg-surface-1 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,90,60,0.1)_1px,transparent_1px)] bg-[length:24px_24px]" />
        </div>
        
        <div className="container mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-h2 text-text-high">See what's possible</h2>
          </motion.div>

          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {[
              { image: screenshot1, caption: "Dashboard & Quick Actions" },
              { image: screenshot2, caption: "AI Prospect scenarios" },
              { image: screenshot3, caption: "Practice session preview" },
              { image: screenshot4, caption: "Performance breakdown" },
              { image: screenshot5, caption: "Upload & Call Review" },
              { image: screenshot6, caption: "Psychological Insights" },
              { image: screenshot7, caption: "Replay Mode" },
              { image: screenshot8, caption: "Progress & Challenges" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 snap-center"
              >
                <div className="w-[280px] bg-surface-2 rounded-lg p-4 border border-border">
                  <img 
                    src={item.image} 
                    alt={item.caption}
                    className="w-full h-[400px] object-cover rounded-lg mb-3"
                  />
                  <p className="text-caption text-text-low text-center">{item.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: Masonry Grid */}
          <div className="hidden md:grid grid-cols-4 gap-6">
            {[
              { image: screenshot1, caption: "Dashboard & Quick Actions" },
              { image: screenshot2, caption: "AI Prospect scenarios" },
              { image: screenshot3, caption: "Practice session preview" },
              { image: screenshot4, caption: "Performance breakdown" },
              { image: screenshot5, caption: "Upload & Call Review" },
              { image: screenshot6, caption: "Psychological Insights" },
              { image: screenshot7, caption: "Replay Mode" },
              { image: screenshot8, caption: "Progress & Challenges" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.03, y: -4 }}
                className={`bg-surface-2 rounded-lg p-4 border border-border ${
                  index % 2 === 1 ? 'transform translate-y-8' : ''
                }`}
              >
                <img 
                  src={item.image} 
                  alt={item.caption}
                  className="w-full h-64 object-cover rounded-lg mb-3"
                />
                <p className="text-caption text-text-low text-center">{item.caption}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta Sign-up */}
      <section id="beta-signup" className="py-16 md:py-30">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-h2 text-text-high mb-4">Join the Beta</h2>
            <p className="text-body-l text-text-medium mb-8">
              Get early access to Prospector and build sales confidence ahead of everyone else.
            </p>

            {!isSubmitted ? (
              <Card className="bg-surface-1 border border-border">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-text-medium">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-surface-2 border-border focus:border-accent-primary"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-text-medium">Name (optional)</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-surface-2 border-border focus:border-accent-primary"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Joining...' : 'Join the Beta'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-accent-primary/10 border border-accent-primary/25">
                <CardContent className="p-6">
                  <CheckCircle className="w-12 h-12 text-accent-primary mx-auto mb-4" />
                  <h3 className="text-h3 text-text-high mb-2">Thanks! We'll be in touch.</h3>
                  <p className="text-body-s text-text-medium">
                    You'll receive updates about Prospector's beta launch.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-30 bg-surface-1">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-h2 text-text-high">Quick answers</h2>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "Is Prospector free?",
                answer: "Pricing may change. Download to see current options in your region."
              },
              {
                question: "Do I need experience?",
                answer: "No. Beginners start fast. Pros love the polish."
              },
              {
                question: "Does it work offline?",
                answer: "Check your app store listing for the most accurate details."
              },
              {
                question: "Is my data safe?",
                answer: "Prospector respects your privacy. See our policy in the footer."
              }
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-body-l text-text-high hover:text-accent-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-body-s text-text-medium">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,90,60,0.1)_1px,transparent_1px)] bg-[length:32px_32px] opacity-30" />
        
        <div className="container mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-h2 text-text-high mb-4">Ready to level up your sales game?</h2>
            <p className="text-body-l text-text-medium mb-8">Practice now. Confidence on your next call.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button variant="primary" size="lg" onClick={scrollToBeta}>
                Join the Beta
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => window.open('https://instagram.com/prospector.app', '_blank')}
              >
                <Instagram className="w-4 h-4 mr-2" />
                Follow on Instagram
              </Button>
            </div>
            
            <p className="text-caption text-text-low">No spam. Only useful updates.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-1 border-t border-divider py-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Logo & Company */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={prospectorLogo} alt="Prospector" className="w-6 h-6" />
                <span className="font-semibold text-text-high">Prospector</span>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-body-s font-medium text-text-high mb-4">Company</h4>
                <div className="space-y-2">
                  <a href="#" className="text-body-s text-text-medium hover:text-text-high transition-colors block">About</a>
                  <a href="#" className="text-body-s text-text-medium hover:text-text-high transition-colors block">Contact</a>
                </div>
              </div>
              <div>
                <h4 className="text-body-s font-medium text-text-high mb-4">Legal</h4>
                <div className="space-y-2">
                  <a href="#" className="text-body-s text-text-medium hover:text-text-high transition-colors block">Privacy Policy</a>
                  <a href="#" className="text-body-s text-text-medium hover:text-text-high transition-colors block">Terms of Service</a>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-body-s font-medium text-text-high mb-4">Social</h4>
              <button
                onClick={() => window.open('https://instagram.com/prospector.app', '_blank')}
                className="flex items-center gap-2 text-body-s text-text-medium hover:text-text-high transition-colors cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </button>
            </div>
          </div>

          <div className="border-t border-divider mt-8 pt-8 text-center">
            <p className="text-caption text-text-low">© 2025 Prospector. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isNavVisible ? 1 : 0, 
          y: isNavVisible ? 0 : 20 
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-accent-primary hover:bg-accent-hover text-white rounded-full flex items-center justify-center shadow-card hover:shadow-hover transition-all duration-200 z-40"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </div>
  );
}