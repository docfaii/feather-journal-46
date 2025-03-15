import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, HeartHandshake, Image, Music, Video, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MoodType } from "./MoodSelector";

export interface EntryProps {
  id: string;
  title: string;
  content: string;
  date: Date;
  favorite: boolean;
  media: {
    type: "photo" | "video" | "audio" | "gallery";
    url: string;
  }[];
  mood?: MoodType;
  kickCount?: number;
  isShared?: boolean;
}

interface EntryCardProps {
  entry: EntryProps;
  className?: string;
  onFavoriteToggle?: (id: string) => void;
}

const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  className,
  onFavoriteToggle,
}) => {
  const {
    id,
    title,
    content,
    date,
    favorite,
    media,
    mood,
    isShared,
  } = entry;

  // For mood emoji mapping
  const getMoodEmoji = (mood: MoodType | undefined) => {
    switch (mood) {
      case "happy":
        return "😊";
      case "content":
        return "😌";
      case "neutral":
        return "😐";
      case "sad":
        return "😔";
      case "stressed":
        return "😰";
      default:
        return null;
    }
  };

  // For mood colors
  const getMoodColor = (mood: MoodType | undefined) => {
    switch (mood) {
      case "happy":
        return "#FEF7CD";
      case "content":
        return "#F2FCE2";
      case "neutral":
        return "#F1F0FB";
      case "sad":
        return "#D3E4FD";
      case "stressed":
        return "#FFDEE2";
      default:
        return "transparent";
    }
  };

  const renderMediaPreview = () => {
    if (!media || media.length === 0) return null;

    const firstMedia = media[0];

    if (firstMedia.type === "photo") {
      return (
        <div className="relative h-32 rounded-lg overflow-hidden mb-3">
          <img src={firstMedia.url} alt="" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
            <Image className="w-4 h-4 text-white" />
          </div>
        </div>
      );
    }

    if (firstMedia.type === "gallery" && media.length > 0) {
      return (
        <div className="grid grid-cols-3 gap-1 mb-3">
          {media.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="relative h-20 rounded-lg overflow-hidden"
            >
              <img src={item.url} alt="" className="w-full h-full object-cover" />
              {index === 2 && media.length > 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-medium">
                  +{media.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (firstMedia.type === "audio" && firstMedia.url) {
      return (
        <div className="bg-secondary/50 rounded-lg p-3 flex items-center gap-2 mb-3 relative z-10">
          <Music className="w-4 h-4" />
          <span className="text-xs">Audio recording</span>
        </div>
      );
    }

    if (firstMedia.type === "video" && firstMedia.url) {
      return (
        <div className="relative h-32 rounded-lg overflow-hidden mb-3 bg-black/10 flex items-center justify-center">
          <Video className="w-8 h-8" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>
      );
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  const moodColor = getMoodColor(mood);

  return (
    <Link
      to={`/entry/${id}`}
      className={cn(
        "block neo-shadow rounded-xl p-4 transition-all hover:neo-inset animate-fade-in",
        className,
        moodColor && "relative overflow-hidden" // Add relative for absolute positioning
      )}
    >
      {moodColor && (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: moodColor, opacity: 0.95 }} // Adjust opacity as needed
        />
      )}
      {renderMediaPreview()}

      <div className="flex justify-between items-start mb-2 relative z-10">
        <h3 className="text-lg font-medium">{title}</h3>
        <button
          onClick={handleFavoriteClick}
          className="group p-1.5 -mt-1 -mr-1"
        >
          <Bookmark
            className={cn(
              "w-4 h-4 transition-colors",
              favorite ? "fill-primary stroke-primary" : "group-hover:fill-primary/20"
            )}
          />
        </button>
      </div>

      <p className="text-muted-foreground line-clamp-2 mb-3 text-sm relative z-10">
        {content}
      </p>

      <div className="flex justify-between items-center text-xs text-muted-foreground relative z-10">
        <div className="flex items-center">
          <span className="px-2 py-1 rounded-full glass-morphism flex items-center">
            {isShared ? (
              <HeartHandshake className="w-3 h-3 text-primary mr-1" />
            ) : (
              <Lock className="w-3 h-3 mr-1" />
            )}
            {format(date, "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          {mood && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full"
                  style={{ backgroundColor: getMoodColor(mood) }}>
              {getMoodEmoji(mood)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EntryCard;
