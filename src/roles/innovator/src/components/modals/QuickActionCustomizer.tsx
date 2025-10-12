import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Fish, Users, Briefcase, TrendingUp, MessageSquare, Handshake, Search, BarChart3, User } from "lucide-react";
import { QuickAction, AppPreferences } from "@/types";
import { lsGet, lsSet, STORAGE_KEYS } from "@/lib/storage";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (actions: QuickAction[]) => void;
  currentActions: QuickAction[];
}

const AVAILABLE_ACTIONS: QuickAction[] = [
  { id: 'tank', title: 'New Pitch', icon: 'Fish', route: '/tank', color: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'messages', title: 'Create Team', icon: 'Users', route: '/messages', color: 'bg-green-500 hover:bg-green-600' },
  { id: 'collaborate', title: 'Post Opportunity', icon: 'Briefcase', route: '/collaborate', color: 'bg-purple-500 hover:bg-purple-600' },
  { id: 'network', title: 'Browse Network', icon: 'TrendingUp', route: '/network', color: 'bg-orange-500 hover:bg-orange-600' },
  { id: 'messaging', title: 'View Messages', icon: 'MessageSquare', route: '/messaging', color: 'bg-cyan-500 hover:bg-cyan-600' },
  { id: 'search', title: 'Global Search', icon: 'Search', route: '/search', color: 'bg-indigo-500 hover:bg-indigo-600' },
  { id: 'analytics', title: 'View Analytics', icon: 'BarChart3', route: '/analytics', color: 'bg-emerald-500 hover:bg-emerald-600' },
  { id: 'profile', title: 'Edit Profile', icon: 'User', route: '/profile', color: 'bg-pink-500 hover:bg-pink-600' }
];

const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    Fish: Fish, 
    Users: Users, 
    Briefcase: Briefcase, 
    TrendingUp: TrendingUp, 
    MessageSquare: MessageSquare, 
    Handshake: Handshake, 
    Search: Search, 
    BarChart3: BarChart3, 
    User: User
  };
  return icons[iconName] || Fish;
};

export function QuickActionCustomizer({ open, onClose, onSave, currentActions }: Props) {
  const [selectedActions, setSelectedActions] = useState<QuickAction[]>(currentActions);

  useEffect(() => {
    setSelectedActions(currentActions);
  }, [currentActions]);

  const handleActionToggle = (action: QuickAction) => {
    if (selectedActions.find(a => a.id === action.id)) {
      // Remove action
      setSelectedActions(prev => prev.filter(a => a.id !== action.id));
    } else {
      // Add action (max 3)
      if (selectedActions.length < 3) {
        setSelectedActions(prev => [...prev, action]);
      } else {
        toast.error("You can only select up to 3 quick actions");
      }
    }
  };

  const handleSave = async () => {
    if (selectedActions.length !== 3) {
      toast.error("Please select exactly 3 quick actions");
      return;
    }

    try {
      const preferences: any = lsGet(STORAGE_KEYS.PREFERENCES, {});
      const updatedPreferences = {
        ...preferences,
        quickActions: selectedActions
      };
      lsSet(STORAGE_KEYS.PREFERENCES, updatedPreferences);
      
      onSave(selectedActions);
      toast.success("Quick actions updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save quick actions");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customize Quick Actions</DialogTitle>
          <DialogDescription>
            Select 3 actions for quick access from your homepage. You currently have {selectedActions.length}/3 selected.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {AVAILABLE_ACTIONS.map((action) => {
              const IconComponent = getIconComponent(action.icon);
              const isSelected = selectedActions.find(a => a.id === action.id);
              
              return (
                <Card 
                  key={action.id}
                  className={`p-3 cursor-pointer transition-all border-2 ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleActionToggle(action)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action.color.split(' ')[0]} text-white`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{action.title}</div>
                    </div>
                    {isSelected && (
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        <Check size={12} />
                      </Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {selectedActions.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Selected Actions ({selectedActions.length}/3):</h4>
              <div className="flex gap-2">
                {selectedActions.map((action, index) => {
                  const IconComponent = getIconComponent(action.icon);
                  return (
                    <div key={action.id} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                      <IconComponent size={12} />
                      <span>{index + 1}. {action.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={selectedActions.length !== 3}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}