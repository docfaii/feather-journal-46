import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface EntryCardSkeletonProps {
  className?: string;
}

const EntryCardSkeleton: React.FC<EntryCardSkeletonProps> = ({ className }) => {
  return (
    <div className={cn("block neo-shadow rounded-xl p-4 animate-pulse", className)}>
      <div className="relative h-32 rounded-lg overflow-hidden mb-3">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">
          <Skeleton className="h-5 w-3/4" />
        </h3>
      </div>

      <p className="text-muted-foreground line-clamp-2 mb-3 text-sm">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </p>

      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>
          <Skeleton className="h-3 w-1/4" />
        </span>
        <div className="flex gap-2 items-center">
          <Skeleton className="w-5 h-5 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default EntryCardSkeleton;
