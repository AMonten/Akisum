"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface AudioPlayerProps {
  src: string;
  title: string;
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.pause();
    };
  }, [src]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex w-full items-center gap-4 rounded-lg bg-muted/50 p-4">
      <Button onClick={togglePlayPause} variant="ghost" size="icon" className="bg-primary/20 hover:bg-primary/40">
        {isPlaying ? <Pause className="h-6 w-6 text-primary" /> : <Play className="h-6 w-6 text-primary" />}
      </Button>
      <div className="w-full">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <div className="flex items-center gap-2">
            <Progress value={progress} className="h-2 w-full" />
            <span className="text-xs font-mono text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
            </span>
        </div>
      </div>
    </div>
  );
}
