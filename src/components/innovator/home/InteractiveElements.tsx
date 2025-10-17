import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  Flame, 
  Target, 
  Star,
  Award,
  Calendar,
  TrendingUp,
  Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  points: number;
}

export const InteractiveElements = () => {
  const [dailyCheckIn, setDailyCheckIn] = useState(false);
  const [streak, setStreak] = useState(7);
  const [mood, setMood] = useState<string | null>(null);
  const [weeklyGoalProgress, setWeeklyGoalProgress] = useState(68);

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Pitch',
      description: 'Submit your first pitch presentation',
      icon: '🎯',
      unlocked: true
    },
    {
      id: '2',
      title: 'Network Builder',
      description: 'Connect with 10 investors',
      icon: '🤝',
      unlocked: true,
      progress: 8,
      maxProgress: 10
    },
    {
      id: '3',
      title: 'Engagement Master',
      description: 'Receive 100+ profile views',
      icon: '👁️',
      unlocked: false,
      progress: 87,
      maxProgress: 100
    },
    {
      id: '4',
      title: 'Collaboration Pro',
      description: 'Join 5 collaborative projects',
      icon: '⚡',
      unlocked: false,
      progress: 2,
      maxProgress: 5
    }
  ];

  const dailyGoals: DailyGoal[] = [
    {
      id: '1',
      title: 'Check messages',
      completed: true,
      points: 10
    },
    {
      id: '2',
      title: 'Review investor matches',
      completed: false,
      points: 15
    },
    {
      id: '3',
      title: 'Update project progress',
      completed: false,
      points: 20
    }
  ];

  const moodOptions = [
    { emoji: '🚀', label: 'Energized', color: 'text-success' },
    { emoji: '😊', label: 'Optimistic', color: 'text-primary' },
    { emoji: '🤔', label: 'Thoughtful', color: 'text-accent' },
    { emoji: '😴', label: 'Tired', color: 'text-muted-foreground' }
  ];

  const handleDailyCheckIn = () => {
    setDailyCheckIn(true);
    toast({
      title: "Daily check-in complete!",
      description: `You've maintained your ${streak}-day streak! 🔥`
    });
  };

  const handleMoodSelect = (selectedMood: string) => {
    setMood(selectedMood);
    toast({
      title: "Mood logged!",
      description: "We'll use this to personalize your experience."
    });
  };

  const completedGoals = dailyGoals.filter(goal => goal.completed).length;
  const totalPoints = dailyGoals.filter(goal => goal.completed).reduce((sum, goal) => sum + goal.points, 0);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Daily Check-in */}
      <Card className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Daily Check-in
          </h2>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-destructive" />
            <Badge variant="outline" className="text-xs">
              {streak} day streak
            </Badge>
          </div>
        </div>

        {!dailyCheckIn ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              How are you feeling about your startup journey today?
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              {moodOptions.map((option) => (
                <Button
                  key={option.label}
                  variant="outline"
                  className="h-12 flex-col gap-1"
                  onClick={() => handleMoodSelect(option.label)}
                >
                  <span className="text-lg">{option.emoji}</span>
                  <span className="text-xs">{option.label}</span>
                </Button>
              ))}
            </div>
            
            <Button 
              variant="gradient" 
              className="w-full"
              onClick={handleDailyCheckIn}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Complete Check-in
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <p className="font-medium">Check-in complete!</p>
            <p className="text-sm text-muted-foreground mt-1">
              {mood && `Feeling ${mood.toLowerCase()} today`}
            </p>
          </div>
        )}
      </Card>

      {/* Daily Goals */}
      <Card className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            Today's Goals
          </h2>
          <div className="text-right">
            <p className="text-sm font-medium">{completedGoals}/{dailyGoals.length}</p>
            <p className="text-xs text-muted-foreground">{totalPoints} points</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {dailyGoals.map((goal) => (
            <div 
              key={goal.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-smooth ${
                goal.completed 
                  ? 'border-success/20 bg-success/5' 
                  : 'border-border/50 hover:border-primary/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  goal.completed 
                    ? 'border-success bg-success text-white' 
                    : 'border-muted-foreground'
                }`}>
                  {goal.completed && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <span className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {goal.title}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                +{goal.points}
              </Badge>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-border/50">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Weekly Progress</span>
            <span className="font-medium">{weeklyGoalProgress}%</span>
          </div>
          <Progress value={weeklyGoalProgress} className="h-2" />
        </div>
      </Card>

      {/* Achievements */}
      <Card className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-warning" />
            Achievements
          </h2>
          <Badge variant="outline" className="text-xs">
            {unlockedAchievements}/{achievements.length} unlocked
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`p-3 rounded-lg border transition-smooth ${
                achievement.unlocked 
                  ? 'border-warning/20 bg-warning/5' 
                  : 'border-border/50 opacity-60'
              }`}
            >
              <div className="text-center mb-2">
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <p className="font-medium text-xs leading-tight">
                  {achievement.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {achievement.description}
                </p>
              </div>

              {achievement.progress !== undefined && achievement.maxProgress && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.maxProgress) * 100} 
                    className="h-1.5" 
                  />
                </div>
              )}

              {achievement.unlocked && (
                <div className="flex items-center justify-center mt-2">
                  <Badge variant="outline" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Unlocked
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};