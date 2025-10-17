import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    tagline: string;
    category: string;
    stage: string;
    fundingAsk: { amount: number; equity?: number };
    visibility: "public" | "under_nda";
    status: "draft" | "published";
    views?: number;
    messages?: number;
  };
  className?: string;
  onClick?: () => void;
}

export const ProjectCard = ({ project, className, onClick }: ProjectCardProps) => {
  return (
    <Card
      className={cn(
        "card-interactive p-6 space-y-4",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{project.title}</h3>
            {project.visibility === "under_nda" && (
              <Shield className="w-4 h-4 text-warning" />
            )}
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {project.tagline}
          </p>
          <div className="flex gap-2">
            <Badge variant="secondary">{project.category}</Badge>
            <Badge variant="outline">{project.stage}</Badge>
          </div>
        </div>
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          project.status === "published" 
            ? "bg-success/10 text-success" 
            : "bg-warning/10 text-warning"
        )}>
          {project.status === "published" ? "Live" : "Draft"}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          Seeking ${project.fundingAsk.amount.toLocaleString()}
          {project.fundingAsk.equity && ` for ${project.fundingAsk.equity}%`}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {project.views || 0}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {project.messages || 0}
          </div>
        </div>
      </div>
    </Card>
  );
};