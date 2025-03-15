import React from "react";
import { cn } from "@/lib/utils";

export type MoodType = "happy" | "content" | "neutral" | "sad" | "stressed" | null;

interface MoodSelectorProps {
  selectedMood: MoodType;
  onChange: (mood: MoodType) => void;
  className?: string;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onChange, className }) => {
  const moods = [
    { value: "happy", emoji: "😊", label: "Happy", activeColor: "#FEF7CD" },
    { value: "content", emoji: "😌", label: "Content", activeColor: "#F2FCE2" },
    { value: "neutral", emoji: "😐", label: "Neutral", activeColor: "#F1F0FB" },
    { value: "sad", emoji: "😔", label: "Sad", activeColor: "#D3E4FD" },
    { value: "stressed", emoji: "😰", label: "Stressed", activeColor: "#FFDEE2" },
  ] as const;

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">How are you feeling?</label>
      <div className="flex justify-between gap-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value as MoodType)}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-all duration-200",
              selectedMood === mood.value
                ? "scale-110"
                : "hover:bg-secondary filter grayscale hover:filter-none"
            )}
            style={selectedMood === mood.value ? { backgroundColor: mood.activeColor } : {}}
          >
            <span className={cn(
              "text-2xl mb-1",
              selectedMood === mood.value ? "" : "grayscale"
            )}>
              {mood.emoji}
            </span>
            <span className="text-xs">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
