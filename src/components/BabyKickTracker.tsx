import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Baby } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BabyKickTrackerProps {
  kickCount: number;
  onKickCountChange: (count: number) => void;
  className?: string;
}

const BabyKickTracker: React.FC<BabyKickTrackerProps> = ({
  kickCount,
  onKickCountChange,
  className,
}) => {
  const incrementKicks = () => {
    onKickCountChange(kickCount + 1);
  };

  const decrementKicks = () => {
    if (kickCount > 0) {
      onKickCountChange(kickCount - 1);
    }
  };

  const backgroundColor = kickCount > 0 ? "rgba(124, 58, 237, 0.1)" : "rgba(229, 231, 235, 0.8)"; // Light primary or light grey
  const hoverBackgroundColor = kickCount > 0 ? "rgba(124, 58, 237, 0.2)" : "rgba(229, 231, 235, 1)"; // Slightly darker on hover

  return (
    <div className={cn("", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button 
            type="button"
            className={cn(
              "flex items-center justify-between w-full rounded-lg p-3 transition-all duration-300",
              
            )}
            style={{
              backgroundColor: backgroundColor,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                kickCount > 0 ? "bg-primary/10" : "bg-background"
              )}>
                <Baby className={cn("w-4 h-4", kickCount > 0 && "text-primary")} />
              </div>
              <span className="text-sm font-medium">
                {kickCount > 0 ? `${kickCount} kicks` : "Baby Kicks"}
              </span>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <Baby className="w-4 h-4" />
              Baby Kicks Tracker
            </h4>
            <div className="flex items-center">
              <button
                type="button"
                onClick={decrementKicks}
                disabled={kickCount === 0}
                className="w-8 h-8 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center disabled:opacity-50"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <span className="text-lg font-medium">{kickCount}</span>
                <p className="text-xs text-muted-foreground">kicks today</p>
              </div>
              <button
                type="button"
                onClick={incrementKicks}
                className="w-8 h-8 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BabyKickTracker;
