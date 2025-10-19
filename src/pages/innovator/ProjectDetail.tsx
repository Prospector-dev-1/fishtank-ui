import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, MessageCircle, Shield, Edit3, Share2, BarChart3 } from "lucide-react";
import { Button } from "@/components/innovator/ui/button";
import { Card } from "@/components/innovator/ui/card";
import { Badge } from "@/components/innovator/ui/badge";
import { toast } from "@/components/innovator/ui/use-toast";

interface Project {
  id: string;
  title: string;
  tagline: string;
  category: string;
  stage: string;
  fundingAsk: { amount: number; equity?: number };
  visibility: "public" | "under_nda";
  status: "draft" | "published";
  views: number;
  messages: number;
  problem: string;
  solution: string;
  market: string;
  traction: string;
  tags: string[];
  createdAt: string;
}


export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      // TODO: Load project from database
      setProject(null);
      setLoading(false);
    } catch (error) {
      console.error('Error loading project:', error);
      setProject(null);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/innovator")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleAction = (action: string) => {
    switch (action) {
      case "edit":
        navigate("/upload");
        break;
      case "share":
        navigator.clipboard?.writeText(window.location.href);
        toast({
          title: "Share Link Copied",
          description: "Project share link has been copied to clipboard."
        });
        break;
      case "analytics":
        navigate("/analytics");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container-mobile px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate("/innovator")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold">Project Details</h1>
            <Button variant="ghost" size="icon" onClick={() => handleAction("share")}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container-mobile px-4 py-6 space-y-6">
        {/* Project Header */}
        <Card className="card-elevated p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{project.title}</h1>
                {project.visibility === "under_nda" && (
                  <Shield className="w-5 h-5 text-warning" />
                )}
              </div>
              <p className="text-muted-foreground">{project.tagline}</p>
              <div className="flex gap-2">
                <Badge variant="secondary">{project.category}</Badge>
                <Badge variant="outline">{project.stage}</Badge>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === "published" 
                    ? "bg-success/10 text-success" 
                    : "bg-warning/10 text-warning"
                }`}>
                  {project.status === "published" ? "Live" : "Draft"}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-lg font-semibold">
              Seeking ${project.fundingAsk.amount.toLocaleString()}
              {project.fundingAsk.equity && ` for ${project.fundingAsk.equity}%`}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {project.views}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {project.messages}
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" onClick={() => handleAction("edit")}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={() => handleAction("analytics")}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" onClick={() => handleAction("share")}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Project Details */}
        <Card className="card-elevated p-6">
          <h3 className="font-semibold text-lg mb-4">Problem Statement</h3>
          <p className="text-muted-foreground leading-relaxed">
            {project.problem}
          </p>
        </Card>

        <Card className="card-elevated p-6">
          <h3 className="font-semibold text-lg mb-4">Our Solution</h3>
          <p className="text-muted-foreground leading-relaxed">
            {project.solution}
          </p>
        </Card>

        <Card className="card-elevated p-6">
          <h3 className="font-semibold text-lg mb-4">Market Opportunity</h3>
          <p className="text-muted-foreground leading-relaxed">
            {project.market}
          </p>
        </Card>

        <Card className="card-elevated p-6">
          <h3 className="font-semibold text-lg mb-4">Traction & Metrics</h3>
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {project.traction}
          </div>
        </Card>

        {/* Tags */}
        <Card className="card-elevated p-6">
          <h3 className="font-semibold text-lg mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}