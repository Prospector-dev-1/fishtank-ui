import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricDisplayProps {
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

export function MetricDisplay({
  value,
  label,
  trend,
  trendValue,
  icon,
  variant = 'default',
  size = 'md'
}: MetricDisplayProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };
  
  const variantClasses = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    primary: "text-primary"
  };
  
  const trendClasses = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground"
  };

  return (
    <div className="text-center space-y-2 animate-fade-in-up">
      <div className="flex items-center justify-center space-x-2">
        {icon && (
          <div className={cn("p-2 rounded-lg bg-primary/10", variantClasses[variant])}>
            {icon}
          </div>
        )}
      </div>
      
      <div className={cn("font-bold", sizeClasses[size], variantClasses[variant])}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      
      <div className="text-sm text-muted-foreground font-medium">
        {label}
      </div>
      
      {trend && trendValue && (
        <div className={cn("flex items-center justify-center space-x-1 text-xs font-medium", trendClasses[trend])}>
          {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : null}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}