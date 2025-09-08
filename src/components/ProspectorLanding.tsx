import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Bell, 
  PlayCircle, 
  CheckCircle, 
  Lightbulb, 
  TrendingUp, 
  Target,
  ChevronDown,
  ChevronUp,
  Star,
  ChevronRight,
  ArrowUp
} from 'lucide-react';
import heroImage from '@/assets/hero-phone-mockup.jpg';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.48,
      ease: "easeOut" as const
    }
  }
};

const floatVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled 
        ? 'h-14 bg-background-charcoal/95 backdrop-blur-nav border-b border-divider' 
        : 'h-16 bg-background-charcoal/85 backdrop-blur-nav'
    }`}>
      <div className="container mx-auto flex items-center justify-between h-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-hover ring-1 ring-accent-glow/25"></div>
          <span className="hidden md:block text-base font-semibold tracking-wide uppercase">Prospector</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('value-grid')}
            className="text-body-s text-text-medium hover:text-text-high transition-colors hover:border-b hover:border-accent-primary hover:pb-1"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="text-body-s text-text-medium hover:text-text-high transition-colors hover:border-b hover:border-accent-primary hover:pb-1"
          >
            How it Works
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')}
            className="text-body-s text-text-medium hover:text-text-high transition-colors hover:border-b hover:border-accent-primary hover:pb-1"
          >
            Testimonials
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => scrollToSection('value-grid')}
          >
            Learn More
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => scrollToSection('final-cta')}
            className="hidden md:inline-flex"
          >
            Download
          </Button>
        </div>
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -20]);

  return (
    <section className="relative pt-24 pb-18 md:pt-30 md:pb-22 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.h1 
              className="text-h1 text-text-high mb-3 max-w-[10ch] mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Prospector helps you master the art of cold calling
            </motion.h1>
            
            <motion.p 
              className="text-body-l text-text-medium mb-5 max-w-[26ch] lg:max-w-[42ch] mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Train, practice, and build confidence before you pick up the phone
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-sm mx-auto lg:mx-0"
              variants={itemVariants}
            >
              <Button variant="primary" size="xl" className="flex-1 sm:flex-initial">
                <Bell className="w-5 h-5" />
                Get updates
              </Button>
              <Button variant="ghost" size="xl" className="flex-1 sm:flex-initial">
                <PlayCircle className="w-5 h-5" />
                See how it works
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            className="relative flex justify-center lg:justify-end"
            style={{ y }}
          >
            <motion.div
              className="relative"
              variants={floatVariants}
              animate="animate"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 w-80 h-80 bg-accent-glow/25 rounded-full blur-[120px] -z-10 animate-glow-pulse"></div>
              
              {/* Phone Mockup */}
              <img 
                src={heroImage}
                alt="Prospector app interface showing cold calling practice features"
                className="w-72 md:w-80 lg:w-[520px] h-auto transform rotate-2 hover:rotate-1 transition-transform duration-500"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Trust Bar Section
const TrustBarSection = () => {
  const logos = [
    { name: "TechCorp", width: "w-16" },
    { name: "StartupLab", width: "w-20" },
    { name: "SalesForce", width: "w-18" },
    { name: "CallMaster", width: "w-16" },
    { name: "ProSell", width: "w-14" }
  ];

  return (
    <section className="py-8 border-t border-divider">
      <div className="container mx-auto text-center">
        <p className="text-body-s text-text-low uppercase tracking-widest mb-6">
          Trusted by salespeople and founders across North America
        </p>
        
        <div className="flex justify-center items-center gap-8 overflow-x-auto md:overflow-visible">
          {logos.map((logo, index) => (
            <div 
              key={index}
              className={`${logo.width} h-6 bg-text-low/20 rounded opacity-70 hover:opacity-100 transition-opacity flex-shrink-0`}
              aria-label={`${logo.name} logo`}
              role="img"
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Value Grid Section
const ValueGridSection = () => {
  const valueCards = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Boost your confidence",
      description: "Practice real conversations and reduce call anxiety with guided scenarios"
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Learn proven techniques", 
      description: "Use battle-tested approaches built for real sales teams and founders"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Improve every day",
      description: "Track progress and turn practice into consistent wins"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Built for doers",
      description: "Designed for anyone who needs to pick up the phone and perform"
    }
  ];

  return (
    <section id="value-grid" className="py-16 md:py-30">
      <div className="container mx-auto">
        <motion.h2 
          className="text-h2 text-text-high text-center mb-12"
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          Why Prospector works
        </motion.h2>

        <motion.div 
          className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show" 
          viewport={{ once: true }}
        >
          {valueCards.map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-5 md:p-6 bg-surface-1 border-border shadow-card hover:shadow-hover hover:glow-green transition-all duration-300 group cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-primary to-accent-hover flex items-center justify-center text-text-high mb-4 ring-1 ring-white/10">
                  {card.icon}
                </div>
                
                <h3 className="text-h3 text-text-high mb-2 group-hover:text-accent-hover transition-colors">
                  {card.title}
                </h3>
                
                <p className="text-body-s text-text-medium leading-relaxed">
                  {card.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Social Proof Section  
const SocialProofSection = () => {
  const testimonials = [
    {
      quote: "Prospector made me comfortable before the real thing",
      author: "Sarah Chen",
      role: "Sales Manager",
      rating: 5
    },
    {
      quote: "Five stars for polish and clarity",
      author: "Mike Rodriguez", 
      role: "Founder",
      rating: 5
    },
    {
      quote: "Short, simple, and powerful practice",
      author: "Emily Johnson",
      role: "Account Executive", 
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-20">
      <div className="container mx-auto">
        <motion.h2 
          className="text-h2 text-text-high text-center mb-12"
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          What people say
        </motion.h2>

        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-5 bg-surface-2 border-border hover:shadow-hover transition-all duration-300 group">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-accent-primary text-accent-primary" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-body-l text-text-high mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-primary/30 to-accent-hover/30"></div>
                  <div>
                    <p className="text-body-s text-text-high font-medium">{testimonial.author}</p>
                    <p className="text-caption text-text-low">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: "Download the app",
      description: "Install Prospector on your phone"
    },
    {
      number: 2, 
      title: "Practice conversations",
      description: "Build your rhythm in a safe space"
    },
    {
      number: 3,
      title: "Close more deals", 
      description: "Walk into calls with clarity and confidence"
    }
  ];

  return (
    <section id="how-it-works" className="py-18 md:py-30">
      <div className="container mx-auto">
        <motion.h2 
          className="text-h2 text-text-high text-center mb-12"
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          How it works
        </motion.h2>

        <motion.div 
          className="grid md:grid-cols-3 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="text-center md:text-left flex flex-col items-center md:items-start"
              variants={itemVariants}
            >
              {/* Step Number */}
              <div className="w-7 h-7 rounded-full bg-accent-primary text-text-high font-bold text-sm flex items-center justify-center mb-4">
                {step.number}
              </div>

              {/* Content */}
              <h3 className="text-h3 text-text-high mb-2">{step.title}</h3>
              <p className="text-body-s text-text-medium">{step.description}</p>

              {/* Connector Line (hidden on last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-3 left-12 w-8 h-px bg-border">
                  <ChevronRight className="w-4 h-4 text-text-low absolute -right-2 -top-2" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Visual Showcase Section
const VisualShowcaseSection = () => {
  const showcaseItems = [
    { caption: "Clean interface built for focus" },
    { caption: "Designed for real practice" },
    { caption: "Confidence that compounds" }
  ];

  return (
    <section className="py-18 md:py-22">
      <div className="container mx-auto">
        <motion.h2 
          className="text-h2 text-text-high text-center mb-12"
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          See what is possible
        </motion.h2>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {showcaseItems.map((item, index) => (
            <motion.div 
              key={index}
              className="text-center group"
              variants={itemVariants}
            >
              {/* Device Frame */}
              <div className="relative mx-auto w-32 h-56 bg-gradient-to-b from-white/8 to-black/40 rounded-3xl p-1 shadow-card group-hover:shadow-hover group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-surface-1 rounded-[22px] shadow-inner">
                  {/* Screen Content Placeholder */}
                  <div className="p-4 h-full flex flex-col">
                    <div className="w-full h-1 bg-accent-primary/30 rounded mb-4"></div>
                    <div className="space-y-2 flex-1">
                      <div className="w-3/4 h-2 bg-text-low/20 rounded"></div>
                      <div className="w-1/2 h-2 bg-text-low/20 rounded"></div>
                      <div className="w-5/6 h-2 bg-text-low/20 rounded"></div>
                    </div>
                    <div className="w-full h-8 bg-accent-primary/20 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <p className="text-caption text-text-low mt-3">{item.caption}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Secondary Persuasive Block
const SecondaryPersuasiveSection = () => {
  const stats = [
    { number: "10", label: "minutes a day" },
    { number: "∞", label: "Built for real calls" },
    { number: "★", label: "Designed for founders and reps" }
  ];

  return (
    <section className="py-16 md:py-20 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/12 via-transparent to-transparent"></div>
      
      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Statement */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-h2 text-text-high leading-tight max-w-[16ch] mb-8">
              Consistency beats talent when it comes to calls
            </h2>

            {/* Stats */}
            <div className="flex justify-between max-w-md">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-accent-primary mb-1">{stat.number}</div>
                  <div className="text-caption text-text-low">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            className="flex justify-center"
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Spotlight */}
              <div className="absolute inset-0 w-64 h-64 bg-gradient-radial from-accent-glow/30 to-transparent rounded-full blur-xl"></div>
              
              {/* Device */}
              <div className="relative w-48 h-80 bg-gradient-to-b from-white/10 to-black/50 rounded-3xl p-2 shadow-hover">
                <div className="w-full h-full bg-surface-1 rounded-2xl shadow-inner"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
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
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-2xl">
        <motion.h2 
          className="text-h2 text-text-high text-center mb-12"
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          Quick answers
        </motion.h2>

        <motion.div 
          className="space-y-1"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="border-t border-border"
              variants={itemVariants}
            >
              <button
                className="w-full py-4 px-3 flex items-center justify-between text-left hover:bg-surface-1/30 transition-colors focus:outline-none focus:bg-surface-1/30"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="text-body-l text-text-high">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-text-medium" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-medium" />
                )}
              </button>
              
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 pb-4"
                >
                  <p className="text-body-s text-text-medium">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Final CTA Section
const FinalCTASection = () => {
  return (
    <section id="final-cta" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/20 via-accent-primary/5 to-transparent"></div>
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
      </div>

      <div className="container mx-auto text-center relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-h2 text-text-high mb-3"
            variants={itemVariants}
          >
            Ready to level up your sales game?
          </motion.h2>
          
          <motion.p 
            className="text-body-l text-text-medium mb-8"
            variants={itemVariants}
          >
            Practice now. Confidence on the next call.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
            variants={itemVariants}
          >
            <Button variant="primary" size="xl" className="flex-1 sm:flex-initial">
              Get notified when available
            </Button>
            <Button variant="ghost" size="xl" className="flex-1 sm:flex-initial">
              Follow on Instagram
            </Button>
          </motion.div>

          <motion.p 
            className="text-caption text-text-low mt-4"
            variants={itemVariants}
          >
            No spam. Only useful updates.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface-1 border-t border-divider">
      <div className="container mx-auto py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-hover ring-1 ring-accent-glow/25"></div>
              <span className="text-base font-semibold tracking-wide uppercase text-text-high">Prospector</span>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
            {/* Company */}
            <div>
              <h4 className="text-body-s font-medium text-text-high mb-3">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-body-s text-text-medium hover:text-text-high hover:underline transition-colors">About</a>
                <a href="#" className="block text-body-s text-text-medium hover:text-text-high hover:underline transition-colors">Contact</a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-body-s font-medium text-text-high mb-3">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-body-s text-text-medium hover:text-text-high hover:underline transition-colors">Privacy Policy</a>
                <a href="#" className="block text-body-s text-text-medium hover:text-text-high hover:underline transition-colors">Terms of Service</a>
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-body-s font-medium text-text-high mb-3">Social</h4>
              <div className="space-y-2">
                <a href="#" className="block text-body-s text-text-medium hover:text-text-high hover:underline transition-colors">LinkedIn</a>
                <a href="#" className="block text-body-s text-text-medium hover:text-text-high hover:underline transition-colors">Instagram</a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-divider mt-8 pt-6">
          <p className="text-caption text-text-low text-center">
            Copyright Prospector 2025. All rights reserved.
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          className="fixed bottom-6 right-6 w-12 h-12 bg-accent-primary text-text-high rounded-full shadow-hover hover:bg-accent-hover transition-colors z-50 flex items-center justify-center"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </footer>
  );
};

// Main Component
const ProspectorLanding = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <TrustBarSection />
        <ValueGridSection />
        <SocialProofSection />
        <HowItWorksSection />
        <VisualShowcaseSection />
        <SecondaryPersuasiveSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default ProspectorLanding;