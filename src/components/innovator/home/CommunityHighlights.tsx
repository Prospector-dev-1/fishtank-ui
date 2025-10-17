import { Card } from "@/components/innovator/ui/card";
import { Badge } from "@/components/innovator/ui/badge";
import { Button } from "@/components/innovator/ui/button";
import { Avatar } from "@/components/innovator/ui/avatar";
import { Progress } from "@/components/innovator/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/innovator/ui/tabs";
import { 
  Trophy, 
  TrendingUp, 
  Calendar, 
  MessageCircle,
  Star,
  ChevronRight,
  Flame,
  Users,
  BookOpen,
  Target,
  Zap,
  Crown,
  Medal,
  Lightbulb,
  Heart,
  Share,
  Eye,
  UserPlus,
  Gift,
  Clock,
  ThumbsUp,
  Play,
  FileText,
  Code,
  Rocket,
  Globe,
  Camera,
  Mic,
  Video,
  Award,
  Shield,
  Coins,
  Gamepad2,
  TrendingDown
} from "lucide-react";

// Enhanced interfaces for all community features
interface SuccessStory {
  id: string;
  user: {
    name: string;
    avatar?: string;
    title: string;
  };
  achievement: string;
  amount?: string;
  timeframe: string;
  category: string;
}

interface LiveActivity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: Date;
  type: 'pitch' | 'connection' | 'funding' | 'launch' | 'milestone';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  participants: number;
  reward: string;
  deadline: Date;
  progress?: number;
}

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  rating: number;
  responseTime: string;
  sessions: number;
}

interface LeaderboardEntry {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  points: number;
  level: number;
  badge: string;
  rank: number;
}

interface CommunityPost {
  id: string;
  user: {
    name: string;
    avatar?: string;
    title: string;
  };
  content: string;
  type: 'showcase' | 'question' | 'tip' | 'resource';
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  tags: string[];
}

interface CollabProject {
  id: string;
  title: string;
  description: string;
  skills: string[];
  teamSize: number;
  currentMembers: number;
  urgency: 'Low' | 'Medium' | 'High';
  type: 'Startup' | 'Side Project' | 'Open Source';
}

export const CommunityHighlights = () => {
  // Live Activity Feed Data
  const liveActivities: LiveActivity[] = [
    {
      id: '1',
      user: { name: 'Alex Kim', avatar: undefined },
      action: 'secured funding',
      target: 'EcoTech Solutions',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'funding'
    },
    {
      id: '2',
      user: { name: 'Maria Santos', avatar: undefined },
      action: 'launched beta',
      target: 'HealthConnect',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'launch'
    },
    {
      id: '3',
      user: { name: 'David Chen', avatar: undefined },
      action: 'connected with',
      target: 'Sarah Johnson (Investor)',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: 'connection'
    }
  ];

  // Community Challenges Data
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'AI Innovation Sprint',
      description: 'Build an AI-powered solution in 7 days',
      category: 'Technology',
      difficulty: 'Advanced',
      participants: 89,
      reward: '$5,000 + Mentorship',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      progress: 65
    },
    {
      id: '2',
      title: 'Sustainability Hackathon',
      description: 'Create solutions for climate change',
      category: 'Environment',
      difficulty: 'Intermediate',
      participants: 156,
      reward: '$3,000 + Funding Intro',
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'First-Time Founder Challenge',
      description: 'Complete your first pitch deck',
      category: 'Business',
      difficulty: 'Beginner',
      participants: 234,
      reward: 'Pitch Review + $500',
      deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      progress: 40
    }
  ];

  // Mentorship Data
  const mentors: Mentor[] = [
    {
      id: '1',
      name: 'Jennifer Walsh',
      title: 'Former VP of Product',
      company: 'Google',
      expertise: ['Product Strategy', 'Team Building', 'Scaling'],
      rating: 4.9,
      responseTime: '< 2 hours',
      sessions: 127
    },
    {
      id: '2',
      name: 'Michael Torres',
      title: 'Serial Entrepreneur',
      company: '3 Exits',
      expertise: ['Fundraising', 'Go-to-Market', 'B2B Sales'],
      rating: 4.8,
      responseTime: '< 4 hours',
      sessions: 89
    }
  ];

  // Leaderboard Data
  const leaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      user: { name: 'Sarah Kim', avatar: undefined },
      points: 2847,
      level: 12,
      badge: 'Innovation Master',
      rank: 1
    },
    {
      id: '2',
      user: { name: 'James Wilson', avatar: undefined },
      points: 2634,
      level: 11,
      badge: 'Community Champion',
      rank: 2
    },
    {
      id: '3',
      user: { name: 'Lisa Chen', avatar: undefined },
      points: 2401,
      level: 10,
      badge: 'Pitch Pro',
      rank: 3
    }
  ];

  // Community Posts Data
  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      user: {
        name: 'Rachel Green',
        avatar: undefined,
        title: 'Fintech Founder'
      },
      content: 'Just secured our first enterprise client! Here are 5 lessons learned from B2B sales...',
      type: 'tip',
      likes: 47,
      comments: 12,
      shares: 8,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ['B2B', 'Sales', 'Enterprise']
    },
    {
      id: '2',
      user: {
        name: 'Tom Rodriguez',
        avatar: undefined,
        title: 'AI Researcher'
      },
      content: 'Looking for feedback on our new AI model architecture. Early results show 40% improvement...',
      type: 'showcase',
      likes: 34,
      comments: 18,
      shares: 15,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      tags: ['AI', 'Research', 'Feedback']
    }
  ];

  // Collaboration Projects Data
  const collabProjects: CollabProject[] = [
    {
      id: '1',
      title: 'Climate Data Platform',
      description: 'Building a real-time climate monitoring dashboard for cities',
      skills: ['React', 'Python', 'Data Visualization', 'APIs'],
      teamSize: 5,
      currentMembers: 3,
      urgency: 'High',
      type: 'Startup'
    },
    {
      id: '2',
      title: 'Open Source CRM',
      description: 'Developer-friendly CRM for small businesses',
      skills: ['Node.js', 'PostgreSQL', 'TypeScript', 'UI/UX'],
      teamSize: 4,
      currentMembers: 2,
      urgency: 'Medium',
      type: 'Open Source'
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const formatDeadline = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Due tomorrow';
    if (diffDays <= 7) return `${diffDays} days left`;
    return date.toLocaleDateString();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success';
      case 'Intermediate': return 'text-warning';
      case 'Advanced': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Low': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'High': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getActivityIcon = (type: LiveActivity['type']) => {
    switch (type) {
      case 'funding': return <Coins className="w-4 h-4 text-success" />;
      case 'launch': return <Rocket className="w-4 h-4 text-accent" />;
      case 'connection': return <UserPlus className="w-4 h-4 text-primary" />;
      case 'pitch': return <Mic className="w-4 h-4 text-warning" />;
      case 'milestone': return <Target className="w-4 h-4 text-secondary" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">Live Feed</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        {/* Live Activity Feed */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Live Community Activity
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {liveActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>
                      <span className="text-muted-foreground"> {activity.action} </span>
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Community Wins */}
          <Card className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                Community Wins
              </h2>
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-warning/20 bg-warning/5">
                <Trophy className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Sarah Chen secured $2.5M Series A</p>
                  <p className="text-xs text-muted-foreground">AI Healthcare • This week</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-success/20 bg-success/5">
                <Rocket className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Marcus launched in 5 new markets</p>
                  <p className="text-xs text-muted-foreground">Fintech • Last month</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Leaderboard Preview */}
          <Card className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-warning" />
                Community Leaders
              </h2>
              <Button variant="ghost" size="sm">
                Full Leaderboard <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {leaderboard.slice(0, 3).map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-white text-sm font-bold">
                    {entry.rank}
                  </div>
                  <Avatar className="w-10 h-10">
                    <div className="w-full h-full bg-gradient-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {entry.user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{entry.user.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{entry.badge}</Badge>
                      <span className="text-xs text-muted-foreground">Level {entry.level}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{entry.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Challenges & Competitions */}
        <TabsContent value="challenges" className="space-y-4">
          <Card className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Active Challenges
              </h2>
              <Button variant="ghost" size="sm">
                Create Challenge <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="p-4 border-l-4 border-l-accent">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-sm">{challenge.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{challenge.description}</p>
                    </div>
                    <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {challenge.participants} joined
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDeadline(challenge.deadline)}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {challenge.category}
                    </Badge>
                  </div>

                  {challenge.progress && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Your Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Gift className="w-4 h-4 text-warning" />
                      <span className="text-xs font-medium">{challenge.reward}</span>
                    </div>
                    <Button size="sm" variant={challenge.progress ? "outline" : "default"}>
                      {challenge.progress ? "Continue" : "Join Challenge"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Mentorship & Learning */}
        <TabsContent value="mentorship" className="space-y-4">
          <Card className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Find a Mentor
              </h2>
              <Button variant="ghost" size="sm">
                Browse All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <div className="w-full h-full bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-sm">{mentor.name}</h3>
                          <p className="text-xs text-muted-foreground">{mentor.title} at {mentor.company}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span className="text-sm font-medium">{mentor.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {mentor.expertise.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {mentor.responseTime}
                          </span>
                          <span>{mentor.sessions} sessions</span>
                        </div>
                        <Button size="sm">
                          Book Session
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Learning Resources */}
          <Card className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning" />
                Learning Hub
              </h2>
              <Button variant="ghost" size="sm">
                All Resources <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-smooth">
                <Play className="w-8 h-8 p-2 bg-accent/10 text-accent rounded-lg" />
                <div>
                  <p className="font-medium text-sm">Fundraising Masterclass</p>
                  <p className="text-xs text-muted-foreground">45 min • Expert level</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-smooth">
                <FileText className="w-8 h-8 p-2 bg-primary/10 text-primary rounded-lg" />
                <div>
                  <p className="font-medium text-sm">Pitch Deck Template</p>
                  <p className="text-xs text-muted-foreground">Download • Template</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-smooth">
                <Users className="w-8 h-8 p-2 bg-success/10 text-success rounded-lg" />
                <div>
                  <p className="font-medium text-sm">Building Remote Teams</p>
                  <p className="text-xs text-muted-foreground">Live workshop • Tomorrow</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Social & Collaboration */}
        <TabsContent value="social" className="space-y-4">
          {/* Community Posts */}
          <Card className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Community Posts
              </h2>
              <Button variant="ghost" size="sm">
                Create Post <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <Card key={post.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <div className="w-full h-full bg-gradient-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {post.user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{post.user.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {post.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(post.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{post.user.title}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed mb-3">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-destructive transition-colors">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-1 hover:text-accent transition-colors">
                        <Share className="w-4 h-4" />
                        {post.shares}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Collaboration Projects */}
          <Card className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Find Collaborators
              </h2>
              <Button variant="ghost" size="sm">
                Post Project <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {collabProjects.map((project) => (
                <Card key={project.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-sm">{project.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                    </div>
                    <Badge variant="outline" className={getUrgencyColor(project.urgency)}>
                      {project.urgency} Priority
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {project.currentMembers}/{project.teamSize} members
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {project.type}
                      </Badge>
                    </div>
                    <Button size="sm">
                      Join Team
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Trending Discussions */}
          <Card className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-destructive" />
                Trending Discussions
              </h2>
              <Button variant="ghost" size="sm">
                Join Discussions <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-smooth">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <div>
                    <p className="font-medium text-sm">AI Ethics in Startup Development</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        127 participants
                      </span>
                      <Badge variant="outline" className="text-xs">Discussion</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-smooth">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <div>
                    <p className="font-medium text-sm">Sustainable Tech Funding Opportunities</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        89 participants
                      </span>
                      <Badge variant="outline" className="text-xs">Opportunities</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};