import React, { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  audioUrl: string;
  transcript: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, transcript, className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        updateProgressBar();
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        updateProgressBar();
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioRef]);
  
  const updateProgressBar = () => {
    if (audioRef.current && progressRef.current && duration > 0) {
      const progress = (audioRef.current.currentTime / duration) * 100;
      progressRef.current.style.width = `${progress}%`;
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const progressBarWidth = rect.width;
      
      const seekTime = (clickPosition / progressBarWidth) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
      updateProgressBar();
    }
  };

  return (
    <div className={cn("neo-shadow rounded-lg overflow-hidden", className)}>
      <div className="p-3 bg-secondary/30">
        <div className="flex items-center gap-3">
          <button 
            onClick={togglePlayback}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-primary" />
            ) : (
              <Play className="w-4 h-4 text-primary ml-0.5" />
            )}
          </button>
          
          <div className="flex-1">
            <p className="text-sm mb-1 line-clamp-1">{transcript}</p>
            
            <div 
              className="h-2 bg-secondary rounded-full cursor-pointer"
              onClick={handleProgressBarClick}
            >
              <div 
                ref={progressRef}
                className="h-full bg-primary/60 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <audio 
        ref={audioRef} 
        src={audioUrl}
        preload="metadata"
      />
    </div>
  );
};

export default AudioPlayer;
