import { useState } from "react";
import { Card, CardContent } from "@/components/innovator/ui/card";
import { Button } from "@/components/innovator/ui/button";
import { Textarea } from "@/components/innovator/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/innovator/ui/avatar";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateThoughtProps {
  userProfile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  onThoughtCreated?: () => void;
}

export function CreateThought({ userProfile, onThoughtCreated }: CreateThoughtProps) {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error("Please write something");
      return;
    }

    if (content.length > 500) {
      toast.error("Thought is too long (max 500 characters)");
      return;
    }

    setIsPosting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to post");
        return;
      }

      const { error } = await supabase
        .from('thoughts')
        .insert({
          user_id: user.id,
          content: content.trim()
        });

      if (error) throw error;
      
      setContent("");
      toast.success("Thought shared!");
      onThoughtCreated?.();
    } catch (error) {
      toast.error("Failed to post thought");
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {getInitials(userProfile?.full_name || null)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts with fellow innovators..."
              className="min-h-[100px] resize-none border-0 bg-transparent focus-visible:ring-0 p-0"
              maxLength={500}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {content.length}/500
              </span>
              
              <Button
                onClick={handlePost}
                disabled={isPosting || !content.trim()}
                size="sm"
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Share Thought
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
