import React from "react";
import { cn } from "@/lib/utils";

interface AdCardProps {
  className?: string;
  variant?: "small" | "medium" | "large";
}

const AdCard: React.FC<AdCardProps> = ({ className, variant = "medium" }) => {
  // Determine dimensions based on variant
  const getDimensions = () => {
    switch (variant) {
      case "small":
        return "h-20";
      case "large":
        return "h-64";
      case "medium":
      default:
        return "h-36";
    }
  };

  return (
    <div 
      className={cn(
        "w-full neo-shadow rounded-xl overflow-hidden relative animate-fade-in",
        getDimensions(),
        className
      )}
    >
      <div className="absolute top-2 right-2 text-xs px-1.5 py-0.5 bg-black/10 rounded">
        Ad
      </div>
      <div className="w-full h-full flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">Advertisement</p>
          <p className="text-xs">Google AdSense Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
