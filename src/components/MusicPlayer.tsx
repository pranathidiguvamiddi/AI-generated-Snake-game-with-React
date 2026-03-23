import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { tracks } from '../data/tracks';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    playNext();
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#00ffff] p-4 screen-tear relative">
      <div className="absolute top-0 left-0 bg-[#00ffff] text-black font-arcade text-xs px-2 py-1">
        AUDIO_SUBSYSTEM
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-4 mt-6">
        <div className="relative w-16 h-16 border-2 border-[#ff00ff] shrink-0 overflow-hidden">
          <img src={currentTrack.cover} alt="Cover" className="w-full h-full object-cover filter grayscale contrast-200" />
          {isPlaying && (
            <div className="absolute inset-0 bg-[#ff00ff]/40 mix-blend-overlay animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 
            className="text-[#00ffff] font-arcade text-sm truncate glitch-text"
            data-text={currentTrack.title.toUpperCase()}
          >
            {currentTrack.title.toUpperCase()}
          </h3>
          <p className="text-[#ff00ff] text-xl font-digital truncate mt-1">ID: {currentTrack.artist.toUpperCase()}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={playPrev} className="p-2 cursor-pointer bg-black border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black">
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="p-3 cursor-pointer bg-black border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black"
          >
            {isPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} className="ml-1" />
            )}
          </button>
          <button onClick={playNext} className="p-2 cursor-pointer bg-black border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black">
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 px-2 border-t-2 border-dashed border-[#ff00ff] pt-4">
        <button onClick={() => setIsMuted(!isMuted)} className="cursor-pointer text-[#00ffff] hover:text-[#ff00ff]">
          {isMuted || volume === 0 ? (
            <VolumeX size={24} />
          ) : (
            <Volume2 size={24} />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="flex-1 h-2 bg-black border border-[#00ffff] appearance-none cursor-pointer accent-[#ff00ff]"
        />
      </div>
    </div>
  );
}
