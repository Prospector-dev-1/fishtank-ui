import { cn } from "@/lib/innovator/utils";

interface ScorePillProps {
  score: number;
  className?: string;
}

export const ScorePill = ({ score, className }: ScorePillProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-success text-success-foreground";
    if (score >= 75) return "bg-primary text-primary-foreground";
    if (score >= 60) return "bg-warning text-warning-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
        getScoreColor(score),
        className
      )}
    >
      {score}% match
    </div>
  );
};