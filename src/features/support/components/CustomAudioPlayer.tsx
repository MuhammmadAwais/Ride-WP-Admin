import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface CustomAudioPlayerProps {
  src: string;
  duration?: number; // Pre-known duration in seconds
  isOutgoing: boolean;
}

export function CustomAudioPlayer({ src, duration = 0, isOutgoing }: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && audio.duration !== Infinity) {
        setTotalDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (Number(e.target.value) / 100) * totalDuration;
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
      setProgress(Number(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Styling based on outgoing/incoming
  const iconColor = isOutgoing ? 'text-accent' : 'text-text-main';
  const iconBg = isOutgoing ? 'bg-white' : 'bg-accent/10';
  const trackBg = isOutgoing ? 'bg-white/30' : 'bg-border';
  const progressColor = isOutgoing ? 'bg-white' : 'bg-accent';
  const textColor = isOutgoing ? 'text-white/80' : 'text-text-muted';

  return (
    <div className="flex items-center gap-3 w-64 min-w-[200px]">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 ${iconBg}`}
      >
        {isPlaying ? (
          <Pause size={20} className={iconColor} fill="currentColor" />
        ) : (
          <Play size={20} className={`ml-1 ${iconColor}`} fill="currentColor" />
        )}
      </button>

      {/* Progress Track */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="relative w-full h-[6px] rounded-full mt-2" style={{ backgroundColor: trackBg ? '' : '' }}>
           {/* Custom Track Background applied via class */}
           <div className={`absolute inset-0 rounded-full ${trackBg}`} />
           
           {/* Active Progress */}
           <div 
             className={`absolute inset-y-0 left-0 rounded-full ${progressColor} transition-all duration-75`} 
             style={{ width: `${progress}%` }} 
           />
           
           {/* Seek Input (Invisible on top) */}
           <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Timestamps */}
        <div className={`flex justify-between items-center mt-1.5 text-[11px] font-roboto font-medium ${textColor}`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>
    </div>
  );
}
