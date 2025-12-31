import React, { useEffect, useRef, useState } from "react";
import textConfig from "../textConfig";

import music1 from "../music/music1.mp3";
import music2 from "../music/music2.mp3";
import music3 from "../music/music3.mp3";

import cover1 from "../musiccover/music1.jpg";
import cover2 from "../musiccover/music2.jpg";
import cover3 from "../musiccover/music3.jpg";

type Track = {
  id: number;
  title: string;
  caption: string;
  src: string;
  cover: string;
};

interface ChillZoneProps {
  onNext?: () => void;
}

// Global audio container to persist across unmounts
let globalAudioContainer: HTMLDivElement | null = null;
const getGlobalAudioContainer = () => {
  if (!globalAudioContainer) {
    globalAudioContainer = document.createElement('div');
    globalAudioContainer.id = 'persistent-audio-container';
    globalAudioContainer.style.display = 'none';
    document.body.appendChild(globalAudioContainer);
  }
  return globalAudioContainer;
};

export default function ChillZone({ onNext }: ChillZoneProps) {
  const tracks: Track[] = [
    { id: 1, title: textConfig.chillZone.tracks[0].title, caption: textConfig.chillZone.tracks[0].caption, src: music1, cover: cover1 },
    { id: 2, title: textConfig.chillZone.tracks[1].title, caption: textConfig.chillZone.tracks[1].caption, src: music2, cover: cover2 },
    { id: 3, title: textConfig.chillZone.tracks[2].title, caption: textConfig.chillZone.tracks[2].caption, src: music3, cover: cover3 },
  ];

  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Initialize audio elements in persistent container
  useEffect(() => {
    const container = getGlobalAudioContainer();
    
    // Create or reuse audio elements
    audioRefs.current = tracks.map((track) => {
      let audio = container.querySelector(`audio[data-track-id="${track.id}"]`) as HTMLAudioElement;
      if (!audio) {
        audio = document.createElement('audio');
        audio.src = track.src;
        audio.preload = 'metadata';
        audio.setAttribute('data-track-id', track.id.toString());
        container.appendChild(audio);
      }
      return audio;
    });

    // Check if any audio is playing and sync state
    audioRefs.current.forEach((audio, index) => {
      if (audio && !audio.paused) {
        setActiveIndex(index);
        setIsPlaying(true);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration || 0);
        setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
      }
    });
  }, []);

  // Check scroll position
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Scroll functions
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // play/pause logic: only one plays at a time
  const togglePlay = async (index: number) => {
    const currentAudio = audioRefs.current[index];
    if (!currentAudio) return;

    // if clicking the currently active track
    if (activeIndex === index) {
      if (currentAudio.paused) {
        await currentAudio.play();
        setIsPlaying(true);
      } else {
        currentAudio.pause();
        setIsPlaying(false);
      }
      return;
    }

    // pause other audios
    audioRefs.current.forEach((a, i) => {
      if (a && i !== index) {
        a.pause();
        a.currentTime = 0;
      }
    });

    // set up events for this audio
    setActiveIndex(index);
    setIsPlaying(true);

    try {
      await currentAudio.play();
    } catch (err) {
      console.warn("Playback blocked or failed:", err);
      setIsPlaying(false);
    }
  };

  // attach timeupdate / ended listeners when activeIndex changes
  useEffect(() => {
    const idx = activeIndex;
    if (idx == null) {
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      return;
    }
    const audio = audioRefs.current[idx];
    if (!audio) return;

    const onTimeUpdate = () => {
      const d = audio.duration || 0;
      setDuration(d);
      setCurrentTime(audio.currentTime);
      setProgress(d ? audio.currentTime / d : 0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setActiveIndex(null);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [activeIndex]);

  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const secs = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${secs}`;
  };

  // seek within active track
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (activeIndex == null) return;
    const audio = audioRefs.current[activeIndex];
    if (!audio || !audio.duration) return;
    const time = (val / 100) * audio.duration;
    audio.currentTime = time;
    setCurrentTime(time);
    setProgress(val / 100);
  };



  // Initialize scroll position check
  useEffect(() => {
    checkScrollPosition();
  }, []);

  return (
    <div className="font-display relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6">
      {/* Floating pastel icons */}
      <svg
        className="absolute top-16 left-8 w-10 h-10 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2l2.39 4.84L19 8.1l-3.5 3.41.82 5.04L12 15.77 7.68 16.55l.82-5.04L5 8.1l4.61-1.26L12 2z"
          fill="#FFF7A1"
        />
      </svg>

      <svg
        className="absolute right-10 top-20 w-12 h-12 opacity-80 animate-float"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M20 17.58A4.42 4.42 0 0115.58 22H7.42A4.42 4.42 0 013 17.58 4.5 4.5 0 017.5 13H8a5 5 0 019.9-1.2A3.5 3.5 0 0120 17.58z"
          fill="#B0E0E6"
        />
      </svg>

      <svg
        className="absolute left-16 bottom-32 w-8 h-8 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 21s-6-4.35-8.5-6.5C1.85 12.73 3 9 6 8c2.28-.75 3.5 1 6 1s3.72-1.75 6-1c3 1 4.15 4.73 2.5 6.5C18 16.65 12 21 12 21z"
          fill="#FFD1DC"
        />
      </svg>

      <div className="w-full max-w-4xl mx-auto">
        {/* Header with music emoji */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="text-center">
            <h2 className="text-[#f04299] text-lg font-bold leading-tight">
              {textConfig.chillZone.heading}
            </h2>
            <div className="text-xs text-[#9a4c73]">
              {textConfig.chillZone.subheading}
            </div>
          </div>
        </div>

        {/* Main Panel - centered with proper margins */}
        <div className="bg-[#FFF8E7] rounded-2xl p-4 sm:p-5 md:p-6 border border-pink-200 shadow-md animate-fadeIn mx-auto">

          {/* Fixed height container for consistent spacing */}
          <div className="mb-6 h-20 flex items-center justify-center">
            {/* Compact Now Playing Display */}
            {activeIndex != null ? (
              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/70 border border-pink-100 shadow-sm max-w-lg w-full mx-auto">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                  <img
                    src={tracks[activeIndex].cover}
                    alt={tracks[activeIndex].title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#1b0d14] truncate">
                    {tracks[activeIndex].title}
                  </div>
                  <div className="text-xs text-[#9a4c73] mb-2 truncate">
                    {tracks[activeIndex].caption}
                  </div>

                  {/* Compact Progress Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#9a4c73] w-8 text-left">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(progress * 100)}
                      onChange={handleSeek}
                      className="flex-1 h-1 accent-[#f04299] appearance-none bg-pink-100 rounded-full"
                    />
                    <span className="text-xs text-[#9a4c73] w-8 text-right">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Compact Play/Pause Button */}
                <button
                  onClick={() => togglePlay(activeIndex)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all transform ${isPlaying
                      ? "bg-[#f04299] text-white scale-105"
                      : "bg-white text-[#f04299] border border-pink-200"
                    } hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-300`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    {isPlaying ? (
                      <g fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="2"></rect>
                        <rect x="14" y="4" width="4" height="16" rx="2"></rect>
                      </g>
                    ) : (
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    )}
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-base text-[#9a4c73] font-medium text-center">
                {textConfig.chillZone.chooseTrackHint}
              </div>
            )}
          </div>

          {/* Track Selection Section */}
          <div className="mb-8">
            {/* Horizontal Scrollable Cards with Navigation */}
            <div className="relative max-w-4xl mx-auto">
              {/* Left Arrow */}
              <button
                onClick={scrollLeft}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-pink-200 flex items-center justify-center transition-all ${canScrollLeft
                    ? "text-[#f04299] hover:scale-110 hover:shadow-pink-300/50"
                    : "text-gray-300 cursor-not-allowed"
                  } focus:outline-none focus:ring-4 focus:ring-pink-300`}
                disabled={!canScrollLeft}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={scrollRight}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-pink-200 flex items-center justify-center transition-all ${canScrollRight
                    ? "text-[#f04299] hover:scale-110 hover:shadow-pink-300/50"
                    : "text-gray-300 cursor-not-allowed"
                  } focus:outline-none focus:ring-4 focus:ring-pink-300`}
                disabled={!canScrollRight}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Scrollable Container - better centered */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-14 py-2 justify-start"
                onScroll={checkScrollPosition}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {tracks.map((track, index) => {
                  const active = activeIndex === index;
                  return (
                    <div
                      key={track.id}
                      className={`group relative cursor-pointer transform transition-all duration-300 flex-shrink-0 w-56 ${active
                          ? "scale-105 z-10"
                          : "hover:scale-105 hover:z-10"
                        }`}
                      onClick={() => togglePlay(index)}
                    >
                      <div className={`relative bg-white rounded-xl p-4 border-2 shadow-lg transition-all ${active
                          ? "border-pink-300 shadow-pink-200/50 bg-pink-50/80"
                          : "border-pink-100 hover:border-pink-200 hover:shadow-xl group-hover:shadow-pink-200/30"
                        }`}>

                        {/* Album Cover */}
                        <div className="relative mb-3">
                          <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-md">
                            <img
                              src={track.cover}
                              alt={track.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Play button overlay */}
                          <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${active && isPlaying ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                            }`}>
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M8 5v14l11-7z" fill="#f04299" />
                              </svg>
                            </div>
                          </div>

                          {/* Playing indicator */}
                          {active && isPlaying && (
                            <div className="absolute top-3 right-3">
                              <div className="flex gap-1">
                                <div className="w-1 h-3 bg-[#f04299] rounded-full animate-music-bar-1"></div>
                                <div className="w-1 h-3 bg-[#f04299] rounded-full animate-music-bar-2"></div>
                                <div className="w-1 h-3 bg-[#f04299] rounded-full animate-music-bar-3"></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Track Info */}
                        <div className="text-center">
                          <div className="font-bold text-[#1b0d14] mb-1 text-sm">
                            {track.title}
                          </div>
                          <div className="text-xs text-[#9a4c73] leading-relaxed">
                            {track.caption}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={onNext}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#f04299] text-white font-semibold shadow-md transition-all transform hover:scale-105 active:scale-95 hover:shadow-pink-300/50 focus:outline-none focus:ring-4 focus:ring-pink-300"
            >
              {textConfig.chillZone.continueButton}
            </button>
          </div>
        </div>
      </div>

      {/* Animations & Styles */}
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
        @keyframes float-slow { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-6px);} }
        @keyframes bounce-slow { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-4px);} }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes music-bar-1 { 0%,40%,100% { transform: scaleY(0.4);} 20% { transform: scaleY(1);} }
        @keyframes music-bar-2 { 0%,20%,80%,100% { transform: scaleY(0.4);} 50% { transform: scaleY(1);} }
        @keyframes music-bar-3 { 0%,60%,100% { transform: scaleY(0.4);} 80% { transform: scaleY(1);} }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease forwards; }
        .animate-music-bar-1 { animation: music-bar-1 1s ease-in-out infinite; }
        .animate-music-bar-2 { animation: music-bar-2 1s ease-in-out infinite; }
        .animate-music-bar-3 { animation: music-bar-3 1s ease-in-out infinite; }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}