import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StartupCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 p-4", className)}>
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-14" />
      </div>
    </div>
  );
}

export function ActivityItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="text-center space-y-2">
      <Skeleton className="h-8 w-16 mx-auto" />
      <Skeleton className="h-4 w-20 mx-auto" />
    </div>
  );
}