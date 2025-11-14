
"use client";

import { useEffect, useReducer, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock, Mic, RefreshCw, Settings, Square, ThumbsDown, ThumbsUp, Unlock } from 'lucide-react';
import { PlayerPanel } from './PlayerPanel';
import { Scoreboard } from './Scoreboard';
import { AudioPlayer } from './AudioPlayer';
import { SettingsDialog } from './SettingsDialog';
import { Logo } from '../icons/Logo';

const RECORDING_DURATION = 6; // seconds

type GamePhase =
  | 'IDLE'
  | 'REQUESTING_PERMISSION'
  | 'PERMISSION_DENIED'
  | 'RECORDING_ORIGINAL'
  | 'PREVIEW_ORIGINAL'
  | 'LOCKING_ORIGINAL'
  | 'AWAITING_IMITATION'
  | 'RECORDING_IMITATION'
  | 'PREVIEW_IMITATION'
  | 'REVERSING_IMITATION'
  | 'GUESSING'
  | 'REVEAL';

interface GameState {
  phase: GamePhase;
  p1Score: number;
  p2Score: number;
  originalAudioUrl: string | null;
  reversedOriginalAudioUrl: string | null;
  imitationAudioUrl: string | null;
  reversedImitationAudioUrl: string | null;
}

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PERMISSION_DENIED' }
  | { type: 'START_RECORDING_ORIGINAL' }
  | { type: 'FINISH_RECORDING_ORIGINAL'; payload: string }
  | { type: 'LOCK_ORIGINAL' }
  | { type: 'REVERSE_ORIGINAL_SUCCESS'; payload: string }
  | { type: 'START_RECORDING_IMITATION' }
  | { type: 'FINISH_RECORDING_IMITATION'; payload: string }
  | { type: 'REVERSE_IMITATION' }
  | { type: 'REVERSE_IMITATION_SUCCESS'; payload: string }
  | { type: 'ADD_POINT'; payload: 'p1' | 'p2' }
  | { type: 'NEXT_ROUND' };

const initialState: GameState = {
  phase: 'IDLE',
  p1Score: 0,
  p2Score: 0,
  originalAudioUrl: null,
  reversedOriginalAudioUrl: null,
  imitationAudioUrl: null,
  reversedImitationAudioUrl: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, phase: 'REQUESTING_PERMISSION' };
    case 'PERMISSION_DENIED':
      return { ...state, phase: 'PERMISSION_DENIED' };
    case 'START_RECORDING_ORIGINAL':
      return { ...state, phase: 'RECORDING_ORIGINAL', originalAudioUrl: null };
    case 'FINISH_RECORDING_ORIGINAL':
      return { ...state, phase: 'PREVIEW_ORIGINAL', originalAudioUrl: action.payload };
    case 'LOCK_ORIGINAL':
      return { ...state, phase: 'LOCKING_ORIGINAL' };
    case 'REVERSE_ORIGINAL_SUCCESS':
      return { ...state, phase: 'AWAITING_IMITATION', reversedOriginalAudioUrl: action.payload };
    case 'START_RECORDING_IMITATION':
      return { ...state, phase: 'RECORDING_IMITATION', imitationAudioUrl: null };
    case 'FINISH_RECORDING_IMITATION':
      return { ...state, phase: 'PREVIEW_IMITATION', imitationAudioUrl: action.payload };
    case 'REVERSE_IMITATION':
      return { ...state, phase: 'REVERSING_IMITATION' };
    case 'REVERSE_IMITATION_SUCCESS':
        return { ...state, phase: 'GUESSING', reversedImitationAudioUrl: action.payload };
    case 'ADD_POINT':
      return {
        ...state,
        phase: 'REVEAL',
        p1Score: state.p1Score + (action.payload === 'p1' ? 1 : 0),
        p2Score: state.p2Score + (action.payload === 'p2' ? 1 : 0),
      };
    case 'NEXT_ROUND':
      return {
        ...state,
        phase: 'IDLE',
        originalAudioUrl: null,
        reversedOriginalAudioUrl: null,
        imitationAudioUrl: null,
        reversedImitationAudioUrl: null,
      };
    default:
      return state;
  }
}

async function reverseAudio(audioUrl: string): Promise<string> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const response = await fetch(audioUrl);
  const audioBlob = await response.blob();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const reversedBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    const channelData = audioBuffer.getChannelData(i);
    const reversedChannelData = reversedBuffer.getChannelData(i);
    reversedChannelData.set(channelData.slice().reverse());
  }
  
  // This is a simplified way to get a WAV blob. A more robust solution might be needed.
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  const buffer = reversedBuffer;
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numSamples = buffer.length;
  const interleaved = new Float32Array(numSamples * numChannels);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < numSamples; i++) {
      interleaved[i * numChannels + channel] = channelData[i];
    }
  }
  
  const dataView = new DataView(new ArrayBuffer(44 + interleaved.length * 2));
  const format = 1; // PCM
  const bitDepth = 16;
  
  writeString(dataView, 0, 'RIFF');
  dataView.setUint32(4, 36 + interleaved.length * 2, true);
  writeString(dataView, 8, 'WAVE');
  writeString(dataView, 12, 'fmt ');
  dataView.setUint32(16, 16, true);
  dataView.setUint16(20, format, true);
  dataView.setUint16(22, numChannels, true);
  dataView.setUint32(24, sampleRate, true);
  dataView.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  dataView.setUint16(32, numChannels * (bitDepth / 8), true);
  dataView.setUint16(34, bitDepth, true);
  writeString(dataView, 36, 'data');
  dataView.setUint32(40, interleaved.length * 2, true);
  
  floatTo16BitPCM(dataView, 44, interleaved);
  
  const blob = new Blob([dataView], { type: 'audio/wav' });

  return URL.createObjectURL(blob);
}

export function GamePage() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { toast } = useToast();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const canRecord = state.phase === 'IDLE' || state.phase === 'PREVIEW_ORIGINAL' || state.phase === 'AWAITING_IMITATION' || state.phase === 'PREVIEW_IMITATION';
  const isP1Turn = state.phase === 'IDLE' || state.phase === 'RECORDING_ORIGINAL' || state.phase === 'PREVIEW_ORIGINAL';
  const isP2Turn = state.phase === 'AWAITING_IMITATION' || state.phase === 'RECORDING_IMITATION' || state.phase === 'PREVIEW_IMITATION';

  const requestMicrophone = async () => {
    if (state.phase !== 'IDLE') return;
    dispatch({ type: 'START_GAME' });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      if (isP1Turn) {
        dispatch({ type: 'START_RECORDING_ORIGINAL' });
      } else if (isP2Turn) {
        dispatch({ type: 'START_RECORDING_IMITATION' });
      }
    } catch (error) {
      console.error("Microphone access denied:", error);
      toast({
        variant: "destructive",
        title: "Microphone Required",
        description: "Please allow microphone access in your browser settings to play.",
      });
      dispatch({ type: 'PERMISSION_DENIED' });
    }
  };

  useEffect(() => {
    if (state.phase === 'RECORDING_ORIGINAL' || state.phase === 'RECORDING_IMITATION') {
      startRecording();
    }
  }, [state.phase]);

  const startRecording = () => {
    if (streamRef.current) {
      setIsRecording(true);
      setRecordingTime(0);
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (state.phase === 'RECORDING_ORIGINAL') {
          dispatch({ type: 'FINISH_RECORDING_ORIGINAL', payload: audioUrl });
        } else if (state.phase === 'RECORDING_IMITATION') {
          dispatch({ type: 'FINISH_RECORDING_IMITATION', payload: audioUrl });
        }
        setIsRecording(false);
      };
      mediaRecorderRef.current.start();
      
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev + 1 >= RECORDING_DURATION) {
            stopRecording();
            return RECORDING_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
  };
  
  const handleLockOriginal = async () => {
    dispatch({ type: 'LOCK_ORIGINAL' });
    if (state.originalAudioUrl) {
      try {
        const reversedUrl = await reverseAudio(state.originalAudioUrl);
        dispatch({ type: 'REVERSE_ORIGINAL_SUCCESS', payload: reversedUrl });
      } catch (error) {
        console.error("Failed to reverse audio:", error);
        toast({ title: "Error", description: "Could not reverse audio."});
        dispatch({ type: 'NEXT_ROUND' }); // Reset on error
      }
    }
  }
  
  const handleReverseImitation = async () => {
    dispatch({ type: 'REVERSE_IMITATION' });
    if (state.imitationAudioUrl) {
       try {
        const reversedUrl = await reverseAudio(state.imitationAudioUrl);
        dispatch({ type: 'REVERSE_IMITATION_SUCCESS', payload: reversedUrl });
      } catch (error) {
        console.error("Failed to reverse audio:", error);
        toast({ title: "Error", description: "Could not reverse audio."});
        dispatch({ type: 'NEXT_ROUND' }); // Reset on error
      }
    }
  }
  
  const handleRecordButton = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (state.phase === 'IDLE') {
        requestMicrophone();
      } else if (state.phase === 'PREVIEW_ORIGINAL') {
        dispatch({ type: 'START_RECORDING_ORIGINAL' });
      } else if (state.phase === 'AWAITING_IMITATION' || state.phase === 'PREVIEW_IMITATION') {
        dispatch({ type: 'START_RECORDING_IMITATION' });
      }
    }
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <Logo className="h-16 w-16" />
          <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">Akisum Duet</h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">The Reverse Music Guessing Game</p>
      </header>

      <div className="mb-8 flex w-full max-w-4xl items-center justify-between">
        <Scoreboard p1Score={state.p1Score} p2Score={state.p2Score} />
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={() => dispatch({ type: 'NEXT_ROUND' })}>
            <RefreshCw className="mr-2 h-4 w-4" /> New Game
          </Button>
          <SettingsDialog />
        </div>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <PlayerPanel title="Player A: Challenger" isActive={isP1Turn}>
          {state.phase === 'IDLE' && <Button onClick={handleRecordButton} size="lg" className="w-full bg-accent hover:bg-accent/90"><Mic className="mr-2" /> Record Song Fragment</Button>}
          {state.phase === 'PERMISSION_DENIED' && <p className="text-destructive">Microphone access was denied. Please enable it to play.</p>}
          {state.phase === 'REQUESTING_PERMISSION' && isP1Turn && <div className="flex items-center justify-center"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Requesting mic...</div>}

          {(state.phase === 'RECORDING_ORIGINAL' || (isRecording && isP1Turn)) && (
             <div className="flex w-full flex-col items-center gap-4">
              <Button onClick={stopRecording} variant="destructive" size="lg" className="w-full">
                <Square className="mr-2" /> Stop Recording
              </Button>
              <div className="font-mono text-lg text-primary">{recordingTime}s / {RECORDING_DURATION}s</div>
            </div>
          )}

          {state.phase === 'PREVIEW_ORIGINAL' && state.originalAudioUrl && (
            <div className="space-y-4">
              <AudioPlayer src={state.originalAudioUrl} title="Your Recording" />
              <div className="flex gap-2">
                <Button onClick={() => dispatch({ type: 'START_RECORDING_ORIGINAL' })} variant="secondary" className="w-full"><Mic className="mr-2" /> Record Again</Button>
                <Button onClick={handleLockOriginal} className="w-full bg-primary text-primary-foreground hover:bg-primary/90"><Lock className="mr-2" /> Lock It</Button>
              </div>
            </div>
          )}
          
          {state.phase === 'LOCKING_ORIGINAL' && <div className="flex items-center justify-center"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Locking & Reversing...</div>}

          {state.phase >= 'AWAITING_IMITATION' && state.originalAudioUrl && (
            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Original (Locked)</p>
                <AudioPlayer src={state.originalAudioUrl} title="Original Recording" />
            </div>
          )}
        </PlayerPanel>

        <PlayerPanel title="Player B: Imitator" isActive={isP2Turn || state.phase === 'GUESSING'}>
           {state.phase < 'AWAITING_IMITATION' && <p className="text-center text-muted-foreground">Waiting for Player A to lock a song...</p>}
           
           {state.phase === 'AWAITING_IMITATION' && state.reversedOriginalAudioUrl && (
             <div className="space-y-4">
                <p className="text-sm font-medium text-center">Listen to the reversed audio and prepare your imitation.</p>
                <AudioPlayer src={state.reversedOriginalAudioUrl} title="Reversed Original" />
                <Button onClick={handleRecordButton} size="lg" className="w-full bg-accent hover:bg-accent/90"><Mic className="mr-2" /> Record Imitation</Button>
             </div>
           )}

           {(state.phase === 'RECORDING_IMITATION' || (isRecording && isP2Turn)) && (
             <div className="flex w-full flex-col items-center gap-4">
              <Button onClick={stopRecording} variant="destructive" size="lg" className="w-full">
                <Square className="mr-2" /> Stop Recording
              </Button>
              <div className="font-mono text-lg text-primary">{recordingTime}s / {RECORDING_DURATION}s</div>
            </div>
           )}

          {state.phase === 'PREVIEW_IMITATION' && state.imitationAudioUrl && (
            <div className="space-y-4">
              <AudioPlayer src={state.imitationAudioUrl} title="Your Imitation" />
              <div className="flex gap-2">
                <Button onClick={() => dispatch({ type: 'START_RECORDING_IMITATION' })} variant="secondary" className="w-full"><Mic className="mr-2" /> Record Again</Button>
                <Button onClick={handleReverseImitation} className="w-full bg-primary text-primary-foreground hover:bg-primary/90"><Unlock className="mr-2" /> Reverse & Guess</Button>
              </div>
            </div>
          )}

          {state.phase === 'REVERSING_IMITATION' && <div className="flex items-center justify-center"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Reversing Imitation...</div>}

          {state.phase === 'GUESSING' && state.reversedImitationAudioUrl && (
              <div className="space-y-4 text-center">
                  <p className="font-medium">What song is it?</p>
                  <AudioPlayer src={state.reversedImitationAudioUrl} title="Your Reversed Imitation" />
                  <div className="flex gap-2 pt-4">
                      <Button onClick={() => dispatch({type: 'ADD_POINT', payload: 'p1'})} variant="destructive" className="w-full"><ThumbsDown className="mr-2"/> Give Up</Button>
                      <Button onClick={() => dispatch({type: 'ADD_POINT', payload: 'p2'})} variant="default" className="w-full bg-green-500 hover:bg-green-600"><ThumbsUp className="mr-2"/> I Got It!</Button>
                  </div>
              </div>
          )}
        </PlayerPanel>
      </div>

       {state.phase === 'REVEAL' && state.originalAudioUrl && (
          <div className="mt-8 w-full max-w-4xl">
              <PlayerPanel title="The Big Reveal" isActive={true}>
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-lg font-headline">The original song was...</p>
                    <AudioPlayer src={state.originalAudioUrl} title="Original Recording" />
                    <Button onClick={() => dispatch({ type: 'NEXT_ROUND' })} size="lg">
                      <RefreshCw className="mr-2" /> Next Round
                    </Button>
                  </div>
              </PlayerPanel>
          </div>
        )}
    </div>
  );
}

    