import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Mic, Pause, StopCircle, X, Music } from "lucide-react";
import { AudioRecorderService, mockTranscribeAudio } from "@/utils/audioRecorder";

interface AudioRecorderProps {
  onRecordingComplete: (audioUrl: string, transcript: string) => void;
  onCancel: () => void;
  className?: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onCancel,
  className,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(30).fill(0.5));
  
  const recorderServiceRef = useRef<AudioRecorderService | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Initialize recorder service
    recorderServiceRef.current = new AudioRecorderService();
    
    return () => {
      // Clean up on unmount
      if (recorderServiceRef.current) {
        recorderServiceRef.current.cancelRecording();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRecording && !isPaused) {
      interval = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isRecording, isPaused]);

  const updateAudioVisualization = () => {
    if (!analyserRef.current || !dataArrayRef.current || isPaused) {
      return;
    }

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Calculate audio levels from the frequency data
    const bufferLength = dataArrayRef.current.length;
    const levelsCount = 30; // Number of bars in our visualization
    const newLevels = Array(levelsCount).fill(0);
    
    // Sample from the frequency data to create levels
    for (let i = 0; i < levelsCount; i++) {
      const startIndex = Math.floor((i / levelsCount) * bufferLength);
      const endIndex = Math.floor(((i + 1) / levelsCount) * bufferLength);
      let sum = 0;
      
      for (let j = startIndex; j < endIndex; j++) {
        sum += dataArrayRef.current[j];
      }
      
      // Normalize to 0-1 range
      newLevels[i] = (sum / (endIndex - startIndex)) / 255;
    }
    
    setAudioLevels(newLevels);
    
    // Continue the animation loop
    animationFrameRef.current = requestAnimationFrame(updateAudioVisualization);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const startRecording = async () => {
    try {
      if (recorderServiceRef.current) {
        const { stream, audioContext, analyser } = await recorderServiceRef.current.startRecording();
        
        // Set up analyser for visualization
        analyserRef.current = analyser;
        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        // Start animation loop
        animationFrameRef.current = requestAnimationFrame(updateAudioVisualization);
        
        setIsRecording(true);
        setIsPaused(false);
        setDuration(0);
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      // Show error message to user
    }
  };
  
  const pauseRecording = () => {
    if (recorderServiceRef.current) {
      recorderServiceRef.current.pauseRecording();
      setIsPaused(true);
      
      // Stop animation loop when paused
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  };
  
  const resumeRecording = () => {
    if (recorderServiceRef.current) {
      recorderServiceRef.current.resumeRecording();
      setIsPaused(false);
      
      // Resume animation loop
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateAudioVisualization);
      }
    }
  };
  
  const stopRecording = async () => {
    if (!recorderServiceRef.current) return;
    
    try {
      setIsRecording(false);
      setIsPaused(false);
      setIsTranscribing(true);
      
      // Stop animation loop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      const { audioUrl, blob } = await recorderServiceRef.current.stopRecording();
      
      // Mock transcription for now
      const transcript = await mockTranscribeAudio(blob);
      
      setIsTranscribing(false);
      onRecordingComplete(audioUrl, transcript);
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsTranscribing(false);
      onCancel();
    }
  };
  
  const handleCancel = () => {
    if (recorderServiceRef.current) {
      recorderServiceRef.current.cancelRecording();
    }
    
    // Stop animation loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setIsRecording(false);
    setIsPaused(false);
    setIsTranscribing(false);
    onCancel();
  };
  
  if (!isRecording && !isTranscribing) {
    return (
      <div className={cn("relative flex flex-col items-center", className)}>
        <button
          type="button"
          onClick={startRecording}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 transition-all hover:bg-primary/20"
        >
          <Mic className="w-4 h-4 text-primary" />
        </button>
        <div className="w-full h-px bg-border mt-3"></div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "w-full rounded-lg transition-all duration-300 neo-shadow",
      isTranscribing ? "bg-primary/5" : "bg-secondary/50",
      className
    )}>
      {isTranscribing ? (
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Music className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Transcribing...</p>
              <p className="text-xs text-muted-foreground">Converting your voice to text</p>
            </div>
          </div>
          <button onClick={handleCancel} className="p-1 hover:bg-secondary/80 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {isPaused ? "Recording Paused" : "Recording..."}
            </span>
            <span className="text-sm font-medium">{formatTime(duration)}</span>
          </div>
          
          <div className="flex items-center justify-center gap-1 mb-2 h-16">
            {audioLevels.map((level, i) => (
              <div 
                key={i}
                className={cn(
                  "bg-primary rounded-full transition-all",
                  isPaused ? "" : ""
                )}
                style={{ 
                  width: "2px",
                  height: `${Math.max(4, level * 64)}px`,
                  transform: isPaused ? "none" : `scaleY(${0.6 + Math.sin(i * 0.2) * 0.4})`,
                  transformOrigin: "bottom",
                  transition: "transform 50ms ease"
                }}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/50 hover:bg-white/70 glass-morphism"
              >
                {isPaused ? (
                  <Mic className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </button>
              
              <button 
                onClick={stopRecording}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/20 hover:bg-primary/30 glass-morphism"
              >
                <StopCircle className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
