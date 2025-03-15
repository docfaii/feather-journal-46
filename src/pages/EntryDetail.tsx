import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Play, Pause, Mic, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getEntry, toggleFavorite, updateEntry, JournalEntry, deleteEntry, updateSharing } from "@/lib/journalStorage";
import { EntryProps } from "@/components/EntryCard";
import BottomBar from "@/components/BottomBar";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { MoodType } from "@/components/MoodSelector";
import BabyKickTracker from "@/components/BabyKickTracker";
import SharingToggle from "@/components/SharingToggle";
import AudioPlayer from "@/components/AudioPlayer";
import EntryTitleInput from "@/components/EntryTitleInput";
import AttachmentHandler from "@/components/AttachmentHandler";
import { Link } from "react-router-dom";

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

const EntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entry, setEntry] = useState<EntryProps | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<any[]>([]);
  const [mood, setMood] = useState<MoodType | undefined>(undefined);
  const [kickCount, setKickCount] = useState(0);
  const [isShared, setIsShared] = useState(false);
  const [sharedWithGroups, setSharedWithGroups] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      const foundEntry = getEntry(id);
      if (foundEntry) {
        // Convert to EntryProps format for component
        const formattedEntry: EntryProps = {
          ...foundEntry,
          date: new Date(foundEntry.date), // Convert ISO string to Date
        };
        
        setEntry(formattedEntry);
        setIsFavorite(formattedEntry.favorite || false);
        setMood(formattedEntry.mood);
        setKickCount(formattedEntry.kickCount || 0);
        setIsShared(formattedEntry.isShared || false);
        setSharedWithGroups(foundEntry.sharedWithGroups || []);
        setTitle(formattedEntry.title);
        setContent(formattedEntry.content);
        setMedia(formattedEntry.media || []);
      } else {
        // Entry not found
        toast({
          title: "Error",
          description: "Journal entry not found",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [id, navigate, toast]);

  const handleToggleFavorite = () => {
    if (!id) return;
    
    const newFavoriteStatus = toggleFavorite(id);
    setIsFavorite(newFavoriteStatus);
    
    toast({
      title: newFavoriteStatus ? "Added to bookmarks" : "Removed from bookmarks",
      description: newFavoriteStatus ? "Entry added to your bookmarks" : "Entry removed from your bookmarks",
    });
  };

  const saveChanges = () => {
    if (!id || !entry) return;
    
    const updatedEntry: JournalEntry = {
      ...entry,
      title: isEditing ? title : entry.title,
      content: isEditing ? content : entry.content,
      media: isEditing ? media : entry.media,
      mood,
      kickCount,
      isShared,
      sharedWithGroups,
      date: entry.date instanceof Date ? entry.date.toISOString() : entry.date,
      favorite: isFavorite
    };
    
    updateEntry(updatedEntry);
    
    // Update local state
    setEntry({
      ...updatedEntry,
      date: new Date(updatedEntry.date),
    });
    
    // Exit edit mode if active
    if (isEditing) {
      setIsEditing(false);
    }
    
    toast({
      title: "Changes saved",
      description: "Your journal entry has been updated",
    });
  };

  const handleDeleteEntry = () => {
    if (!id) return;
    
    // Delete the entry and navigate back
    deleteEntry(id);
    
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been permanently deleted",
    });
    
    navigate('/');
  };

  const cycleMood = () => {
    const moods: MoodType[] = ["happy", "content", "neutral", "sad", "stressed"];
    const currentIndex = moods.indexOf(mood || "neutral");
    const nextIndex = (currentIndex + 1) % moods.length;
    setMood(moods[nextIndex]);
    
    // Save immediately on mood change
    setTimeout(saveChanges, 0);
  };

  const handleSharingChange = (shared: boolean, selectedGroups?: string[]) => {
    setIsShared(shared);
    if (selectedGroups) {
      setSharedWithGroups(selectedGroups);
    }
    
    // Update in storage
    if (id) {
      updateSharing(id, shared, selectedGroups);
    }
    
    // Toast notification
    if (shared) {
      const groupCount = selectedGroups ? selectedGroups.length : 0;
      toast({
        title: "Entry shared",
        description: `Your entry has been shared with ${groupCount} group(s)`,
      });
    } else {
      toast({
        title: "Entry private",
        description: "Your entry is now private",
      });
    }
  };

  const handleKickCountChange = (count: number) => {
    setKickCount(count);
    
    // We'll save changes immediately when kick count is changed
    setTimeout(saveChanges, 0);
  };

  const handleAttachmentsChange = (newMedia: any[]) => {
    setMedia(newMedia);
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Save changes when exiting edit mode
      saveChanges();
    }
    setIsEditing(!isEditing);
  };

  const renderMedia = () => {
    if (!entry?.media || entry.media.length === 0) return null;

    return (
      <div className="mt-6 mb-6 space-y-4">
        {entry.media.map((item, index) => {
          if (item.type === "photo" || item.type === "gallery") {
            return (
              <div key={index} className="rounded-xl overflow-hidden">
                <img src={item.url} alt={`Attachment ${index + 1}`} className="w-full max-h-80 object-cover" />
              </div>
            );
          }
          if (item.type === "audio") {
            return (
              <AudioPlayer 
                key={index}
                audioUrl={item.url} 
                transcript="Voice recording"
              />
            );
          }
          if (item.type === "video") {
            return (
              <div key={index} className="rounded-xl overflow-hidden relative bg-muted/30 h-64">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 rounded-full glass-morphism flex items-center justify-center">
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                </div>
                <video poster="/placeholder.svg" className="w-full h-full object-cover opacity-80" />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const moodColor = getMoodColor(mood);

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-pulse">Loading entry...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4" style={{ backgroundColor: moodColor }}>
      <header className="py-4 flex items-center justify-between mb-6 animate-slide-down">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleToggleFavorite}
            className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
          >
            <Bookmark className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-primary stroke-primary' : ''}`} />
          </button>
          
          <button 
            onClick={toggleEditMode}
            className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
          >
            <Pencil className={`w-5 h-5 transition-all duration-300 ${isEditing ? 'text-primary' : ''}`} />
          </button>
          
          <button 
            onClick={cycleMood}
            className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
          >
            {mood && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full relative z-20 text-foreground" 
                    style={{ backgroundColor: getMoodColor(mood) }}>
                {getMoodEmoji(mood)}
              </span>
            )}
          </button>
        </div>
      </header>
      
      <main className="animate-fade-in">
        <div className="mb-6">
          {isEditing ? (
            <EntryTitleInput
              title={title}
              setTitle={setTitle}
            />
          ) : (
            <div>
              <h1 className="text-2xl font-medium tracking-tight">{entry.title}</h1>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(entry.date, { addSuffix: true })}
              </span>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <AttachmentHandler
            content={content}
            setContent={setContent}
            onAttachmentsChange={handleAttachmentsChange}
            initialAttachments={media}
          />
        ) : (
          <>
            {renderMedia()}
            
            <div className="prose max-w-none">
              <p className="whitespace-pre-line leading-relaxed">
                {entry.content}
              </p>
            </div>
          </>
        )}

        <div className="flex items-stretch justify-between gap-3 my-4">
          <SharingToggle 
            isShared={isShared} 
            onShareChange={handleSharingChange} 
            className="flex-1 h-full"
          />
          
          <BabyKickTracker 
            kickCount={kickCount} 
            onKickCountChange={handleKickCountChange} 
            className="flex-1 h-full"
          />
        </div>
        
        {isEditing ? (
          <div className="mt-6 flex justify-between">
            <button 
              onClick={handleDeleteEntry}
              className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium"
            >
              Delete Entry
            </button>
            
            <button 
              onClick={saveChanges}
              className="px-4 py-2 rounded-lg bg-primary text-white font-medium"
            >
              Save Changes
            </button>
          </div>
        ) : null}
      </main>
      
      <BottomBar />
    </div>
  );
};

export default EntryDetail;
