import React, { useState, useCallback, useRef } from "react";
import { Camera, ImageIcon, X, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import AudioRecorder from "@/components/AudioRecorder";
import AudioPlayer from "@/components/AudioPlayer";

export type AttachmentType = "photo" | "gallery" | "audio" | "video";

interface AttachmentHandlerProps {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  onAttachmentsChange: (attachments: { type: AttachmentType; url: string }[]) => void;
  initialAttachments?: { type: AttachmentType; url: string }[];
  className?: string;
}

const AttachmentHandler: React.FC<AttachmentHandlerProps> = ({
  content,
  setContent,
  onAttachmentsChange,
  initialAttachments = [],
  className,
}) => {
  const [attachments, setAttachments] = useState<{ type: AttachmentType; url: string }[]>(initialAttachments);
  const [isRecording, setIsRecording] = useState(false);
  
  // References for file input elements
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleAttachment = (type: AttachmentType, url: string) => {
    const newAttachment = { type, url };
    const updatedAttachments = [...attachments, newAttachment];
    setAttachments(updatedAttachments);
    onAttachmentsChange(updatedAttachments);
  };

  const handleAudioComplete = (audioUrl: string, transcript: string) => {
    setIsRecording(false);
    handleAttachment("audio", audioUrl);
    setContent(prev => {
      if (prev.trim() === "") return transcript;
      return `${prev}\n\n${transcript}`;
    });
  };

  const cancelAudioRecording = () => {
    setIsRecording(false);
  };

  const removeAttachment = (indexToRemove: number) => {
    const updatedAttachments = attachments.filter((_, index) => index !== indexToRemove);
    setAttachments(updatedAttachments);
    onAttachmentsChange(updatedAttachments);
    
    // If removing an audio attachment, also revoke the object URL
    const removedAttachment = attachments[indexToRemove];
    if (removedAttachment && removedAttachment.type === "audio") {
      URL.revokeObjectURL(removedAttachment.url);
    }
  };

  const renderAttachmentPreviews = useCallback(() => {
    return attachments.map((attachment, index) => {
      if (attachment.type === "photo" || attachment.type === "gallery") {
        return (
          <div key={index} className="relative mt-4 rounded-lg overflow-hidden">
            <img src={attachment.url} alt="Attachment preview" className="w-full h-48 object-cover" />
            <button 
              onClick={() => removeAttachment(index)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full glass-morphism flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      }
      
      if (attachment.type === "audio") {
        return (
          <div key={index} className="relative mt-4">
            <AudioPlayer 
              audioUrl={attachment.url} 
              transcript="Audio recording"
            />
            <button 
              onClick={() => removeAttachment(index)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full glass-morphism flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      }
      return null;
    });
  }, [attachments]);

  // Handles image files selected through input elements
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: AttachmentType) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        handleAttachment(type, imageUrl);
      }
    }
    
    // Reset the input
    e.target.value = '';
  };
  
  const handlePhotoUpload = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleGalleryUpload = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <div className="w-full h-px bg-border mb-2"></div>
        <textarea
          placeholder="Write your thoughts here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[200px] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground pr-2"
        />
        {!isRecording && (
          <div>
            <AudioRecorder 
              onRecordingComplete={handleAudioComplete}
              onCancel={cancelAudioRecording}
            />
          </div>
        )}
      </div>

      {renderAttachmentPreviews()}

      <div className="attachments-bar pt-4 border-t border-border">
        <div className="flex justify-center gap-8">
          {/* Hidden file inputs */}
          <input 
            type="file" 
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileInputChange(e, "photo")}
            className="hidden"
          />
          
          <input 
            type="file" 
            ref={galleryInputRef}
            accept="image/*"
            multiple
            onChange={(e) => handleFileInputChange(e, "gallery")}
            className="hidden"
          />
          
          <button 
            type="button" 
            onClick={handlePhotoUpload}
            className={cn(
              "attachment-button"
            )}
          >
            <Camera className="w-6 h-6" />
            <span className="text-xs mt-1">
              Camera
            </span>
          </button>
          
          <button 
            type="button" 
            onClick={handleGalleryUpload}
            className={cn(
              "attachment-button"
            )}
          >
            <ImageIcon className="w-6 h-6" />
            <span className="text-xs mt-1">
              Gallery
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachmentHandler;
