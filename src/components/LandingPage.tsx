import React, { useEffect, useState } from "react";
import IntroGif from "../imgs/intro.gif"
import IntroImg from "../imgs/intro.png"
import textConfig from "../textConfig";

type Props = {
  onEnter?: () => void;
  herName?: string;
  yourName?: string;
  gifSrc?: string;
};

const LandingPage: React.FC<Props> = ({
  onEnter,
  gifSrc,
}) => {
  const gifUrl = gifSrc || IntroGif;
  const handleEnter = () => {
    if (onEnter) onEnter();
    else {
      const el = document.getElementById("activity");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else console.log("Click to Begin pressed!");
    }
  };

  // Typing effect for last line
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(textConfig.landing.lastLine.slice(0, i));
      i++;
      if (i > textConfig.landing.lastLine.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-display relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-10">
      {/* Floating pastel icons */}
      <svg
        className="absolute top-10 left-10 w-12 h-12 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2l2.39 4.84L19 8.1l-3.5 3.41.82 5.04L12 15.77 7.68 16.55l.82-5.04L5 8.1l4.61-1.26L12 2z"
          fill="#FFF7A1"
        />
      </svg>

      <svg
        className="absolute right-12 top-16 w-16 h-16 opacity-80 animate-float"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M20 17.58A4.42 4.42 0 0115.58 22H7.42A4.42 4.42 0 173 17.58 4.5 4.5 0 717.5 13H8a5 5 0 919.9-1.2A3.5 3.5 0 0720 17.58z"
          fill="#B0E0E6"
        />
      </svg>

      <svg
        className="absolute left-12 bottom-20 w-10 h-10 animate-float-slow"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 21s-6-4.35-8.5-6.5C1.85 12.73 3 9 6 8c2.28-.75 3.5 1 6 1s3.72-1.75 6-1c3 1 4.15 4.73 2.5 6.5C18 16.65 12 21 12 21z"
          fill="#FFD1DC"
        />
      </svg>

      {/* Main Diary Window */}
      <div
        className="relative w-full max-w-2xl bg-[#FFF8E7] rounded-2xl shadow-lg border border-pink-200 p-6 sm:p-8 md:p-10 z-10 animate-fadeIn mx-auto"
      >
        {/* Floating transparent GIF */}
        <img
          src={gifUrl}
          alt="cute animation"
          className="absolute -top-10 right-6 w-20 h-20 sm:w-24 sm:h-24 object-contain animate-bounce-slow"
        />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-200 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#ff9ec7] border border-[#f081a9]" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#fff07a] border border-[#f0cf52]" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#b1f2b1] border border-[#92d992]" />
          </div>
          <p className="text-sm font-bold text-[#9a4c73] flex items-center gap-1">
            A Note for You
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-6-4.35-8.5-6.5C1.85 12.73 3 9 6 8c2.28-.75 3.5 1 6 1s3.72-1.75 6-1c3 1 4.15 4.73 2.5 6.5C18 16.65 12 21 12 21z"
                fill="#f04299"
              />
            </svg>
          </p>
          <div className="w-16" />
        </div>

        {/* Letter Content */}
        <div className="text-center space-y-6 relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1b0d14] leading-snug">
            {textConfig.landing.title}
          </h1>

          <div className="text-[#1b0d14]/80 text-base md:text-lg leading-relaxed relative mx-auto max-w-lg">
            <p>
              {textConfig.landing.subtitle}
            </p>
            <p className="pt-3">
              <span className="font-semibold text-[#f04299]">{typedText}</span>
              <span className="inline-block w-1.5 h-4 bg-[#f04299]/70 ml-1 animate-cursor" />
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleEnter}
            className="mt-4 inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#f04299] text-white font-semibold shadow-md transition-all transform hover:scale-105 active:scale-95 hover:shadow-pink-300/50 focus:outline-none focus:ring-4 focus:ring-pink-300"
          >
            {textConfig.landing.button}
          </button>

          {/* Landing page decorative image - positioned at bottom left of note */}
          <div 
            className="absolute -bottom-6 -left-4 animate-float-slow opacity-70 pointer-events-none"
            style={{
              transform: 'rotate(-15deg)',
              zIndex: 20
            }}
          >
            <img
              src={IntroImg}
              alt="Decorative"
              className="w-20 h-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-[#9a4c73] text-center">
        {textConfig.landing.footer}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
        @keyframes float-slow { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-6px);} }
        @keyframes bounce-slow { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes cursorBlink { 0%,50% { opacity: 1;} 50%,100% { opacity: 0;} }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 5s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 1s ease forwards; }
        .animate-cursor { animation: cursorBlink 1s infinite; }
      `}</style>
    </div>
  );
};

export default LandingPage;
