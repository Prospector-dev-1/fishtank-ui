import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Bookmark, Users, TrendingUp, HelpCircle, FileText, MessageCircle } from 'lucide-react';
import { VideoPlayer } from '@/components/investor/VideoPlayer';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageModal } from '@/components/investor/MessageModal';
import { mockStartups } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
export default function StartupDetail() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isButtonSticky, setIsButtonSticky] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const startup = mockStartups.find(s => s.id === id);
  if (!startup) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h1 font-bold mb-2">Startup not found</h1>
          <Button onClick={() => navigate('/discover')}>Back to The Tank</Button>
        </div>
      </div>;
  }
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  const getFullDescription = (startupName: string) => {
    return `${startup.description}

Our comprehensive business plan focuses on revolutionizing the ${startup.sector.toLowerCase()} industry through innovative technology solutions. We have identified key market opportunities that align with current industry trends and consumer demands.

Strategic Implementation Plan:
Phase 1 (Months 1-6): We will focus on product development refinement and initial market penetration. Our team will work on enhancing core features based on early user feedback while establishing partnerships with key industry players.

Phase 2 (Months 7-12): Scale operations and expand our user base through targeted marketing campaigns and strategic partnerships. We plan to onboard 10,000+ active users and establish revenue streams through our freemium model.

Phase 3 (Year 2): International expansion and feature diversification. We will explore new market segments and develop complementary products that enhance our core offering.

Market Analysis:
Our target market shows significant growth potential with a projected CAGR of 15-20% over the next five years. We have conducted extensive research indicating strong demand for our solution, with 78% of surveyed potential customers expressing interest in our product.

Competitive Advantage:
What sets us apart is our unique approach to solving industry pain points through cutting-edge technology and user-centric design. Our team's combined expertise and proven track record position us perfectly to capture market share and drive sustainable growth.

Financial Projections:
We project reaching profitability within 18 months, with conservative revenue estimates of $2M ARR by year two. Our lean operational model ensures efficient capital utilization while maintaining high growth potential.`;
  };
  useEffect(() => {
    const handleScroll = () => {
      if (buttonRef.current) {
        const buttonTop = buttonRef.current.offsetTop;
        const scrollY = window.scrollY;
        setIsButtonSticky(scrollY > buttonTop);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <div className="min-h-screen bg-background pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-h2 font-semibold truncate mx-4">{startup.name}</h1>
          
        </div>
      </div>

      {/* Sticky Message Button */}
      {isButtonSticky && <div className="fixed top-16 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-b border-border p-4">
          <div className="flex justify-center">
            <Button onClick={() => setIsMessageModalOpen(true)} className="w-full max-w-sm h-12 text-base font-semibold flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Message Innovator</span>
            </Button>
          </div>
        </div>}

      <div className="container-safe space-y-6">
        {/* Basic Info */}
        <div className="space-y-4 mx-0 py-[8px]">
          <div className="flex items-center space-x-2">
            <Chip variant="stage">{startup.stage}</Chip>
            <Chip variant="primary">{startup.sector}</Chip>
          </div>
          
          <div>
            <h2 className="text-h1 font-bold mb-1">{startup.name}</h2>
            <p className="text-body text-muted-foreground mb-3">
              Founded by {startup.founder}
            </p>
            <p className="text-h2 font-semibold text-primary mb-4">
              {startup.tagline}
            </p>
            <p className="text-body leading-relaxed">
              {showFullDescription ? getFullDescription(startup.name) : startup.description}
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowFullDescription(!showFullDescription)} className="mt-3">
              {showFullDescription ? 'View Less' : 'View Full Description'}
            </Button>
          </div>
        </div>

        {/* Message Innovator CTA */}
        <div ref={buttonRef} className="flex justify-center">
          <Button onClick={() => setIsMessageModalOpen(true)} className="w-full max-w-sm h-12 text-base font-semibold flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Message Innovator</span>
          </Button>
        </div>

        {/* Video Description Title */}
        <div className="pt-4">
          <h3 className="text-h2 font-semibold mb-4">Video Description</h3>
        </div>

        {/* Hero Video */}
        <div className="relative">
          <VideoPlayer primarySrc={startup.longVideo} poster={startup.poster} controls muted={false} className="w-full aspect-video rounded-xl overflow-hidden" />
          
          {/* Stats Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            
          </div>
        </div>

        {/* Team Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {startup.team.map((member, index) => <div key={index} className="flex items-center space-x-3 p-3 glass-subtle rounded-lg cursor-pointer hover:glass-intense transition-all duration-300 group" onClick={() => navigate(`/startup/${startup.id}/team/${member.id}`)}>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold group-hover:text-primary transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 group-hover:text-primary transition-colors" />
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* Traction Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Traction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {startup.traction.map((item, index) => <div key={index} className="flex justify-between items-center p-3 glass-subtle rounded-lg">
                  <div>
                    <h4 className="font-semibold">{item.metric}</h4>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  <div className="text-h2 font-bold text-primary">
                    {item.value}
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Key Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {startup.milestones.map((milestone, index) => <div key={index} className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium">{milestone.label}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.date}</p>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" />
              FAQ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {startup.faq.map((item, index) => <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.a}
                  </AccordionContent>
                </AccordionItem>)}
            </Accordion>
          </CardContent>
        </Card>

        {/* My Notes Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              My Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea placeholder="Add your thoughts about this startup..." value={notes} onChange={e => setNotes(e.target.value)} className="min-h-[100px]" />
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Tags:</p>
              <div className="flex flex-wrap gap-2">
                {['High Potential', 'Strong Team', 'Good Traction', 'Scalable', 'Competitive'].map(tag => <Button key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} size="sm" onClick={() => toggleTag(tag)}>
                    {tag}
                  </Button>)}
              </div>
            </div>
            
            <Button onClick={() => toast({
            title: "Notes saved!",
            description: "Your notes have been saved locally."
          })}>
              Save Notes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Message Modal */}
      <MessageModal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} recipientName={startup.founder} recipientAvatar={startup.team[0]?.avatar} startupName={startup.name} />
    </div>;
}