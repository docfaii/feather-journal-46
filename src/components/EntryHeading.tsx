import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EntryHeadingProps {
  handleSubmit: (e: React.FormEvent) => void;
  title?: string;
  date?: Date;
  mood?: string;
  kickCount?: number;
}

const EntryHeading: React.FC<EntryHeadingProps> = ({ handleSubmit }) => {
  const navigate = useNavigate();

  return (
    <header className="py-4 flex items-center justify-between mb-6 animate-slide-down">
      <button 
        onClick={() => navigate(-1)} 
        className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      <button 
        onClick={handleSubmit}
        className={cn(
          "flex items-center justify-center rounded-lg p-3 transition-all duration-300",
          "bg-primary/10 glass-morphism hover:bg-primary/20"
        )}
      >
        <Save className="w-4 h-4 mr-2 text-primary" />
        <span className="text-sm font-medium">Save</span>
      </button>
    </header>
  );
};

export default EntryHeading;
