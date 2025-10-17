import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/creator/utils";

interface IOSHeaderProps {
  title?: string;
  largeTitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
  transparent?: boolean;
}

export function IOSHeader({
  title,
  largeTitle,
  showBackButton = false,
  onBack,
  rightAction,
  className,
  transparent = false,
}: IOSHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <header 
        className={cn(
          "sticky top-0 z-40 w-full safe-top",
          transparent ? "bg-transparent" : "ios-frosted border-b border-border/30",
          "transition-all duration-280",
          className
        )}
      >
        <div className="flex items-center justify-between h-11 px-4 max-w-2xl mx-auto">
          {/* Left Side */}
          <div className="flex items-center min-w-[80px]">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-primary touch-target -ml-2 active:opacity-60 transition-opacity duration-120"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                <span className="text-body font-normal">Back</span>
              </button>
            )}
          </div>

          {/* Center Title (small) */}
          {title && !largeTitle && (
            <h1 className="text-body font-semibold text-center flex-1 truncate">
              {title}
            </h1>
          )}

          {/* Right Action */}
          <div className="flex items-center justify-end min-w-[80px]">
            {rightAction}
          </div>
        </div>
      </header>

      {/* Large Title (iOS-style, scrolls with content) */}
      {largeTitle && (
        <div className="px-4 pt-2 pb-3 max-w-2xl mx-auto">
          <h1 className="text-hero font-bold">{largeTitle}</h1>
        </div>
      )}
    </>
  );
}