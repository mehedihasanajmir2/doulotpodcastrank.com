import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, X, Music, Radio, ChevronRight, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PodcastEpisode } from '../data';

interface AudioPlayerWidgetProps {
  episode: PodcastEpisode | null;
  onClose: () => void;
}

export default function AudioPlayerWidget({ episode, onClose }: AudioPlayerWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (episode) {
      setIsPlaying(true);
      setCurrentTime(0);
    }
  }, [episode]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, episode]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!episode) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-[#0B132B]/95 p-4 shadow-2xl backdrop-blur-md md:bottom-6"
        id="audio-player-widget"
      >
        <audio
          ref={audioRef}
          src={episode.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          {/* Cover & Title */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-slate-950 shadow-sm">
              <img
                src={episode.image}
                alt={episode.title}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Radio className="h-5 w-5 text-white animate-pulse" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center rounded-md bg-purple-950/80 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                NOW PLAYING
              </span>
              <h4 className="truncate text-sm font-semibold text-white" title={episode.title}>
                {episode.title}
              </h4>
              <p className="text-xs text-slate-300">
                Hosted by {episode.host} • {episode.category}
              </p>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex flex-1 items-center justify-center gap-4">
            {/* Play Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-cyan text-slate-950 hover:bg-[#00e2c4] active:scale-95 transition-all shadow-md"
              id="player-play-toggle"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-5 w-5 text-slate-950" /> : <Play className="h-5 w-5 fill-slate-950 text-slate-950 ml-0.5" />}
            </button>

            {/* Time Slider */}
            <div className="flex flex-1 items-center gap-2 max-w-md">
              <span className="font-mono text-[10px] text-slate-400 w-8 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleProgressChange}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-800 accent-brand-purple focus:outline-none"
                id="player-progress-bar"
              />
              <span className="font-mono text-[10px] text-slate-400 w-8">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume and Actions */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-2 md:border-t-0 md:pt-0 gap-4">
            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-slate-400" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={handleVolumeChange}
                className="h-1 w-20 cursor-pointer appearance-none rounded-lg bg-slate-800 accent-brand-purple focus:outline-none"
                id="player-volume-slider"
              />
            </div>

            {/* Close */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={onClose}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
                id="player-close-btn"
                aria-label="Close player"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Animated equalizer bars on the top edge when playing */}
        {isPlaying && (
          <div className="absolute top-0 left-0 right-0 flex justify-center gap-[2px] h-[3px] overflow-hidden rounded-t-2xl px-4">
            {Array.from({ length: 48 }).map((_, i) => {
              const randomDelay = Math.random() * 0.8;
              const randomDuration = 0.5 + Math.random() * 0.6;
              return (
                <motion.div
                  key={i}
                  animate={{ scaleY: [1, 2.5, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: randomDuration,
                    delay: randomDelay,
                    ease: 'easeInOut',
                  }}
                  className="w-[6px] h-full bg-gradient-to-t from-brand-purple to-brand-cyan origin-bottom"
                />
              );
            })}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
