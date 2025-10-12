import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Mic, 
  Save, 
  Zap,
  Clock,
  Hash
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuickNote {
  id: string;
  content: string;
  timestamp: Date;
  tags: string[];
}

export const QuickCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [recentNotes, setRecentNotes] = useState<QuickNote[]>([
    {
      id: '1',
      content: 'Add blockchain integration to payment system',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ['tech', 'blockchain']
    },
    {
      id: '2', 
      content: 'Schedule meeting with potential co-founder',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['meeting', 'team']
    }
  ]);

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    
    const newNote: QuickNote = {
      id: Date.now().toString(),
      content: noteContent,
      timestamp: new Date(),
      tags: [] // Could add auto-tagging later
    };
    
    setRecentNotes(prev => [newNote, ...prev.slice(0, 4)]);
    setNoteContent("");
    setIsCapturing(false);
    
    toast({
      title: "Idea captured!",
      description: "Your note has been saved."
    });
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <Card className="card-elevated p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Quick Capture</h2>
        <Badge variant="outline" className="text-xs">
          <Zap className="w-3 h-3 mr-1" />
          Auto-saves
        </Badge>
      </div>
      
      {!isCapturing ? (
        <div className="space-y-3">
          <Button 
            variant="gradient" 
            className="w-full justify-start gap-3" 
            onClick={() => setIsCapturing(true)}
          >
            <Lightbulb className="w-4 h-4" />
            Capture an Idea
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3"
            onClick={() => toast({ title: "Voice recording", description: "Feature coming soon!" })}
          >
            <Mic className="w-4 h-4" />
            Voice Memo
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Textarea
            placeholder="What's your idea? Jot it down quickly..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="min-h-[80px] resize-none"
            autoFocus
          />
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleSaveNote}
              disabled={!noteContent.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setIsCapturing(false);
                setNoteContent("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {recentNotes.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border/50">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">Recent Ideas</h3>
          <div className="space-y-2">
            {recentNotes.slice(0, 3).map((note) => (
              <div 
                key={note.id}
                className="p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-smooth cursor-pointer"
              >
                <p className="text-sm leading-relaxed mb-2">
                  {note.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs h-5">
                        <Hash className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(note.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};