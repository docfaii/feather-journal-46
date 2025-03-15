import React, { useState } from "react";
import { Heart, MessageSquare, Image, Music, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MoodType } from "./MoodSelector";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addComment, toggleLike } from "@/lib/journalStorage";

export interface GroupEntryProps {
  id: string;
  entryId: string;
  title: string;
  content: string;
  date: Date;
  media: {
    type: "photo" | "video" | "audio" | "gallery";
    url: string;
  }[];
  mood?: MoodType;
  sharedBy: string;
  comments: {
    id: string;
    author: string;
    content: string;
    date: Date;
  }[];
  likes: string[];
}

interface GroupEntryCardProps {
  entry: GroupEntryProps;
  className?: string;
  currentUser: string;
}

const GroupEntryCard: React.FC<GroupEntryCardProps> = ({
  entry,
  className,
  currentUser,
}) => {
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [entryLikes, setEntryLikes] = useState<string[]>(entry.likes || []);
  const [entryComments, setEntryComments] = useState(entry.comments || []);
  
  const isLiked = entryLikes.includes(currentUser);
  
  const renderMediaPreview = () => {
    if (!entry.media || entry.media.length === 0) return null;

    const firstMedia = entry.media[0];

    if (firstMedia.type === "photo") {
      return (
        <div className="relative h-48 rounded-lg overflow-hidden mb-3">
          <img src={firstMedia.url} alt="" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
            <Image className="w-4 h-4 text-white" />
          </div>
        </div>
      );
    }

    if (firstMedia.type === "gallery" && entry.media.length > 0) {
      return (
        <div className="grid grid-cols-3 gap-1 mb-3">
          {entry.media.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="relative h-24 rounded-lg overflow-hidden"
            >
              <img src={item.url} alt="" className="w-full h-full object-cover" />
              {index === 2 && entry.media.length > 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-medium">
                  +{entry.media.length - 3}
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
        <div className="relative h-48 rounded-lg overflow-hidden mb-3 bg-black/10 flex items-center justify-center">
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
  
  const handleToggleLike = () => {
    // Update storage
    const isNowLiked = toggleLike(entry.entryId, currentUser);
    
    // Update UI
    if (isLiked) {
      setEntryLikes(entryLikes.filter(id => id !== currentUser));
    } else {
      setEntryLikes([...entryLikes, currentUser]);
      
      toast({
        title: "Liked!",
        description: "You liked this memory",
      });
    }
  };
  
  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    // Add comment to storage
    const newComment = addComment(entry.entryId, currentUser, comment);
    
    // Update UI
    const formattedComment = {
      id: newComment.id,
      author: newComment.author,
      content: newComment.content,
      date: new Date(newComment.date)
    };
    
    setEntryComments([...entryComments, formattedComment]);
    setComment("");
    setShowComments(true);
    
    toast({
      title: "Comment added",
      description: "Your comment was added successfully",
    });
  };

  return (
    <div
      className={cn(
        "block neo-shadow rounded-xl p-4 transition-all animate-fade-in space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            {entry.sharedBy.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-medium">{entry.sharedBy}</h4>
            <p className="text-xs text-muted-foreground">
              {format(entry.date, "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-1">{entry.title}</h3>
        <p className="text-muted-foreground text-sm">{entry.content}</p>
      </div>
      
      {renderMediaPreview()}
      
      <div className="flex justify-between pt-2 border-t border-border">
        <button
          onClick={handleToggleLike}
          className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-sm",
            isLiked ? "text-red-500 bg-red-50" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Heart className={cn("w-4 h-4", isLiked && "fill-red-500")} />
          <span>{entryLikes.length}</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 px-3 py-1 rounded-full text-muted-foreground hover:bg-muted text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{entryComments.length}</span>
        </button>
      </div>
      
      {showComments && (
        <div className="space-y-3 pt-2">
          {entryComments.map(comment => (
            <div key={comment.id} className="bg-muted/50 p-2 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-medium text-xs">{comment.author}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(comment.date), "MMM d")}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-0 h-9 resize-none text-sm"
              maxLength={280}
            />
            <Button 
              size="sm" 
              onClick={handleAddComment}
              disabled={!comment.trim()}
            >
              Post
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupEntryCard;
