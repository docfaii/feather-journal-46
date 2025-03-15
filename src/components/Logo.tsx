import React from "react";
import { cn } from "@/lib/utils";
import { Baby } from "lucide-react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Baby className="w-5 h-5" />
      <span className="font-semibold tracking-tight">Lil Baby Kicks</span>
    </div>
  );
};

export default Logo;
