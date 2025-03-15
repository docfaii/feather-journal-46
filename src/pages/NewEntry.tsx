import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import BottomBar from "@/components/BottomBar";
import { cn } from "@/lib/utils";
import MoodSelector, { MoodType } from "@/components/MoodSelector";
import BabyKickTracker from "@/components/BabyKickTracker";
import SharingToggle from "@/components/SharingToggle";
import EntryHeading from "@/components/EntryHeading";
import EntryTitleInput from "@/components/EntryTitleInput";
import AttachmentHandler, { AttachmentType } from "@/components/AttachmentHandler";
import { saveEntry } from "@/lib/journalStorage";

const NewEntry = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<MoodType>(null);
  const [kickCount, setKickCount] = useState(0);
  const [isShared, setIsShared] = useState(false); // Default to private
  const [attachments, setAttachments] = useState<{ type: AttachmentType; url: string }[]>([]);
  const [backgroundColor, setBackgroundColor] = useState("#FAFAFA");

  useEffect(() => {
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
          return "#FAFAFA";
      }
    };

    setBackgroundColor(getMoodColor(mood));
  }, [mood]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for your entry",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Save the entry to localStorage
      saveEntry({
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString(), // Will be overwritten by saveEntry, but included for type safety
        favorite: false,
        media: attachments,
        mood: mood,
        kickCount: kickCount,
        isShared: isShared
      });
      
      toast({
        title: "Success",
        description: "Your journal entry has been saved",
      });
      
      // Revoke any object URLs to prevent memory leaks
      attachments.forEach(attachment => {
        if (attachment.type === "audio" || attachment.type === "photo" || attachment.type === "gallery") {
          URL.revokeObjectURL(attachment.url);
        }
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Failed to save your journal entry",
        variant: "destructive",
      });
    }
  };

  const handleSharingChange = (newValue: boolean) => {
    setIsShared(newValue);
  };

  return (
    <div
      className="min-h-screen pb-24 px-4 transition-colors duration-1000"
      style={{ backgroundColor: backgroundColor }}
    >
      <EntryHeading handleSubmit={handleSubmit} />
      
      <main className="animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          <EntryTitleInput title={title} setTitle={setTitle} />
          
          <MoodSelector 
            selectedMood={mood} 
            onChange={setMood} 
            className="mb-4" 
          />
          
          <AttachmentHandler 
            content={content}
            setContent={setContent}
            onAttachmentsChange={setAttachments}
          />

          <div className="flex items-stretch justify-between gap-3 my-4">
            <SharingToggle 
              isShared={isShared} 
              onShareChange={handleSharingChange} 
              className="flex-1 h-full"
            />
            
            <BabyKickTracker 
              kickCount={kickCount} 
              onKickCountChange={setKickCount} 
              className="flex-1 h-full"
            />
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewEntry;
