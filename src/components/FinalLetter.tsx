// src/components/FinalLetter.tsx
import React, { useEffect, useRef, useState } from "react";
import { Mail, Heart, Star } from "lucide-react";
import textConfig from "../textConfig";
import m1 from "../imgs/m1.jpeg";
import m2 from "../imgs/m2.jpeg";
import m3 from "../imgs/m3.jpeg";
import m4 from "../imgs/m4.jpeg";
import m5 from "../imgs/m5.jpeg";
import m6 from "../imgs/m6.jpeg";
import m7 from "../imgs/m7.jpeg";
import m8 from "../imgs/m8.jpeg";
import m9 from "../imgs/m9.jpeg";
import m10 from "../imgs/m10.jpeg";

interface FinalLetterProps {
  onRestart: () => void;
}

interface ImagePosition {
  x: number;
  y: number;
}

export default function FinalLetter({ onRestart }: FinalLetterProps) {
  const [showLetter, setShowLetter] = useState(false);
  const [showSealing, setShowSealing] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const typingTextRef = useRef(textConfig.finalLetter.typedDefault);
  const [typedText, setTypedText] = useState("");
  const typingTimerRef = useRef<number | null>(null);

  // kiss animation state: store an array of kiss particles to render
  const [kisses, setKisses] = useState<
    { id: number; left: number; delay: number; size: number; rotation: number }[]
  >([]);
  const kissIdRef = useRef(0);

  // Draggable images state
  const [imagePositions, setImagePositions] = useState<{ [key: string]: ImagePosition }>({});
  const [draggingImage, setDraggingImage] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<ImagePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const t = window.setTimeout(() => setShowLetter(true), 420);
    return () => window.clearTimeout(t);
  }, []);

  // typing for signature
  useEffect(() => {
    if (!isSealed) {
      setTypedText("");
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      return;
    }
    const str = typingTextRef.current;
    let i = 0;
    typingTimerRef.current = window.setInterval(() => {
      i += 1;
      setTypedText(str.slice(0, i));
      if (i >= str.length && typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    }, 45);
    return () => {
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [isSealed]);

  const sealLetter = () => {
    setShowSealing(true);
    setTimeout(() => {
      setIsSealed(true);
      setShowSealing(false);
    }, 1400);
  };

  const sendKiss = () => {
    // generate 10 kisses with varied x positions, sizes, delays and small rotations
    const batch: typeof kisses = [];
    for (let i = 0; i < 10; i++) {
      const id = ++kissIdRef.current;
      batch.push({
        id,
        left: 8 + Math.random() * 84, // percent
        delay: i * 80 + Math.random() * 120, // ms
        size: 18 + Math.round(Math.random() * 18), // px (emoji size)
        rotation: -20 + Math.random() * 40, // deg
      });
    }
    setKisses((s) => [...s, ...batch]);

    // cleanup kisses after animation (2.2s + max delay)
    const maxDelay = Math.max(...batch.map((k) => k.delay));
    setTimeout(() => {
      setKisses((s) => s.filter((k) => !batch.find((b) => b.id === k.id)));
    }, 2200 + maxDelay);
  };

  // Drag handlers for memory images
  const handleMouseDown = (e: React.MouseEvent, imageId: string) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    setDraggingImage(imageId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingImage) return;

    const container = document.querySelector('.memory-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    setImagePositions((prev) => ({
      ...prev,
      [draggingImage]: {
        x: e.clientX - containerRect.left - dragOffset.x,
        y: e.clientY - containerRect.top - dragOffset.y,
      },
    }));
  };

  const handleMouseUp = () => {
    setDraggingImage(null);
  };

  // Add and remove mouse event listeners
  useEffect(() => {
    if (draggingImage) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingImage]);

  return (
    <div className="font-display min-h-screen flex items-center justify-center py-10 px-4 bg-[#FFF4F8] relative overflow-hidden">
      {/* subtle grid-paper behind */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 grid-paper" />
        <Star className="absolute left-8 top-14 text-[#FFF7A1] opacity-70 w-5 h-5 animate-float-slow" />
        <Star className="absolute right-8 top-28 text-[#CDB4DB] opacity-60 w-4 h-4 animate-float-rev" />
        <Heart className="absolute left-6 bottom-28 text-[#FFD1DC] opacity-30 w-6 h-6 animate-pulse-tiny" />
        <Mail className="absolute right-6 bottom-20 text-[#B0E0E6] opacity-30 w-6 h-6 animate-float-slow" />
      </div>

      {/* kiss particles (improved animation) */}
      <div className="pointer-events-none fixed inset-0 z-40">
        {kisses.map((k) => (
          <div
            key={k.id}
            className="kiss-particle"
            style={{
              left: `${k.left}%`,
              bottom: 12,
              fontSize: k.size,
              transform: `translateX(-50%) rotate(${k.rotation}deg)`,
              animationDelay: `${k.delay}ms`,
            }}
          >
            <span className="block">🤗</span>
            <span className="sparkle" />
          </div>
        ))}
      </div>

      {/* sealing overlay */}
      {showSealing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fff0f4]/75">
          <div className="flex flex-col items-center gap-3">
            <div className="text-7xl animate-seal-spin">💌</div>
            <div className="text-sm text-[#9a4c73]">{textConfig.finalLetter.sealingText}</div>
          </div>
        </div>
      )}

      {/* main centered letter with surrounding memory images */}
      <div
        className={`relative z-10 w-full max-w-5xl transition-all duration-600 ${showLetter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
      >
        <div className="relative flex items-center justify-center memory-container">
          {/* Memory Images - positioned symmetrically on both sides */}

          {/* LEFT SIDE - 5 Images */}
          {/* Top Left */}
          <img
            src={m1}
            alt="Memory 1"
            className="memory-image absolute -top-8 -left-16 w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-2xl shadow-lg border-4 border-white transform -rotate-12"
            style={{
              animationDelay: '0.2s',
              left: imagePositions['m1'] ? `${imagePositions['m1'].x}px` : undefined,
              top: imagePositions['m1'] ? `${imagePositions['m1'].y}px` : undefined,
              cursor: draggingImage === 'm1' ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'm1')}
          />

          {/* Upper Middle Left */}
          <img
            src={m2}
            alt="Memory 2"
            className="memory-image absolute top-16 -left-24 w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl shadow-lg border-4 border-white transform rotate-6"
            style={{
              animationDelay: '0.4s',
              left: imagePositions['m2'] ? `${imagePositions['m2'].x}px` : undefined,
              top: imagePositions['m2'] ? `${imagePositions['m2'].y}px` : undefined,
              cursor: draggingImage === 'm2' ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'm2')}
          />

          {/* Center Left */}
          <img
            src={m3}
            alt="Memory 3"
            className="memory-image absolute top-1/3 -left-20 w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-2xl shadow-lg border-4 border-white transform -rotate-6"
            style={{
              animationDelay: '0.6s',
              left: imagePositions['m3'] ? `${imagePositions['m3'].x}px` : undefined,
              top: imagePositions['m3'] ? `${imagePositions['m3'].y}px` : undefined,
              cursor: draggingImage === 'm3' ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'm3')}
          />

          {/* Lower Middle Left */}
          <img
            src={m4}
            alt="Memory 4"
            className="memory-image absolute bottom-24 -left-16 w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-2xl shadow-lg border-4 border-white transform rotate-12"
            style={{
              animationDelay: '0.8s',
              left: imagePositions['m4'] ? `${imagePositions['m4'].x}px` : undefined,
              top: imagePositions['m4'] ? `${imagePositions['m4'].y}px` : undefined,
              cursor: draggingImage === 'm4' ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'm4')}
          />

          {/* Bottom Left */}
          <img
            src={m5}
            alt="Memory 5"
            className="memory-image absolute -bottom-12 -left-20 w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl shadow-lg border-4 border-white transform -rotate-12"
            style={{
              animationDelay: '1s',
              left: imagePositions['m5'] ? `${imagePositions['m5'].x}px` : undefined,
              top: imagePositions['m5'] ? `${imagePositions['m5'].y}px` : undefined,
              cursor: draggingImage === 'm5' ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'm5')}
          />

          {/* RIGHT SIDE - 5 Images (mirrored positions) */}
          {/* Top Right */}
          <img
            src={m6}
            alt="Memory 6"
            className="memory-image absolute -top-8 -right-16 w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-2xl shadow-lg border-4 border-white transform rotate-12"
            style={{
              animationDelay: '1.2s',
              left: imagePositions['m6'] ? `${imagePositions['m6'].x}px` : undefined,
              top: imagePositions['m6'] ? `${imagePositions['m6'].y}px` : undefined,
              cursor: draggingImage === 'm6' ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'm6')}
          />

          {/* Upper Middle Right */}
          <img
            src={m7}
            alt="Memory 7"
            className="memory-image absolute top-16 -right-24 w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl shadow-lg border-4 border-white transform -rotate-6"
            style={{
              animationDelay: '1.4s',
              left: imagePositions['m7'] ? `${imagePositions['m7'].x}px` : undefined,
              top: imagePositions['m7'] ? `${imagePositions['m7'].y}px` : undefined,
              cursor: draggingImage === 'm7' ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'm7')}
          />

          {/* Center Right */}
          <img
            src={m8}
            alt="Memory 8"
            className="memory-image absolute top-1/3 -right-20 w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-2xl shadow-lg border-4 border-white transform rotate-6"
            style={{
              animationDelay: '1.6s',
              left: imagePositions['m8'] ? `${imagePositions['m8'].x}px` : undefined,
              top: imagePositions['m8'] ? `${imagePositions['m8'].y}px` : undefined,
              cursor: draggingImage === 'm8' ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'm8')}
          />

          {/* Lower Middle Right */}
          <img
            src={m9}
            alt="Memory 9"
            className="memory-image absolute bottom-24 -right-16 w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-2xl shadow-lg border-4 border-white transform -rotate-12"
            style={{
              animationDelay: '1.8s',
              left: imagePositions['m9'] ? `${imagePositions['m9'].x}px` : undefined,
              top: imagePositions['m9'] ? `${imagePositions['m9'].y}px` : undefined,
              cursor: draggingImage === 'm9' ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'm9')}
          />

          {/* Bottom Right */}
          <img
            src={m10}
            alt="Memory 10"
            className="memory-image absolute -bottom-12 -right-20 w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl shadow-lg border-4 border-white transform rotate-12"
            style={{
              animationDelay: '2s',
              left: imagePositions['m10'] ? `${imagePositions['m10'].x}px` : undefined,
              top: imagePositions['m10'] ? `${imagePositions['m10'].y}px` : undefined,
              cursor: draggingImage === 'm10' ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'm10')}
          />

          {/* Main Letter Card - centered */}
          <div className="relative z-20 w-full max-w-2xl">
            {!isSealed ? (
              <div className="bg-[#FFF8E7] rounded-3xl p-6 sm:p-8 shadow-xl border border-pink-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f04299] flex items-center justify-center text-white shadow-md">
                      <Mail size={18} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#1b0d14]">{textConfig.finalLetter.title}</h3>
                  </div>
                </div>

                <article className="handwriting text-sm sm:text-base text-[#1b0d14] leading-relaxed space-y-4">
                  <p className="text-[#f04299] font-semibold">{textConfig.finalLetter.letterGreeting}</p>

                  <p>
                    {textConfig.finalLetter.letterParagraphs[0]}
                  </p>

                  <p className="text-[#7fbcd9]">
                    {textConfig.finalLetter.letterParagraphs[1]}
                  </p>

                  <p>
                    {textConfig.finalLetter.letterParagraphs[2]}
                  </p>

                  <p className="text-[#cdb4db]">
                    {textConfig.finalLetter.letterParagraphs[3]}
                  </p>

                  <p className="text-[#f04299] font-medium">{textConfig.finalLetter.letterParagraphs[4]}</p>
                </article>

                <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3 items-center">
                  <div className="text-xs text-[#9a4c73]">{textConfig.finalLetter.sealingNote}</div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        sealLetter();
                      }}
                      className="rounded-full bg-gradient-to-r from-[#ff9aa8] to-[#ffd1dc] px-5 py-2.5 text-sm sm:text-base font-bold shadow-md hover:scale-105 transition"
                    >
                      {textConfig.finalLetter.sealButton}
                    </button>

                    <button
                      onClick={onRestart}
                      className="rounded-full bg-[#9be7c4] px-4 py-2.5 text-sm sm:text-base font-medium shadow-md hover:brightness-95 transition"
                    >
                      {textConfig.finalLetter.restartButton}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#FFF8E7] rounded-3xl p-8 sm:p-10 shadow-2xl border border-pink-100 text-center">
                <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-[#ffbcd2] to-[#ffd1dc] flex items-center justify-center shadow-inner">
                  <div className="text-4xl">💝</div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#f04299] mb-2">
                  {textConfig.finalLetter.sealedTitle}
                </h2>
                <p className="text-sm sm:text-base text-[#9a4c73] mb-5">
                  {textConfig.finalLetter.sealedSubtitle}
                </p>

                <div className="flex justify-center gap-2 mb-5">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Heart
                      key={i}
                      size={18}
                      className="text-[#ffb6c1] animate-pulse-heart"
                      style={{ animationDelay: `${i * 140}ms` }}
                    />
                  ))}
                </div>

                <div className="text-lg sm:text-xl font-semibold text-[#1b0d14] mb-1">
                  <span className="text-[#c0396f]">{typedText || textConfig.finalLetter.typedDefault}</span>
                </div>
                <div className="text-xs text-[#9a4c73] mb-6">
                  {new Date().toLocaleDateString(textConfig.finalLetter.dateLocale, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={onRestart}
                    className="rounded-full bg-[#f04299] text-white px-5 py-2.5 text-sm sm:text-base font-semibold shadow hover:scale-105 transition"
                  >
                    {textConfig.finalLetter.experienceAgain}
                  </button>

                  <button
                    onClick={() => {
                      sendKiss();
                    }}
                    className="rounded-full bg-[#9be7c4] px-5 py-2.5 text-sm sm:text-base font-medium shadow hover:brightness-95 transition"
                  >
                    {textConfig.finalLetter.sendKissButton}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* styles */}
      <style>{`
        .grid-paper {
          background-image:
            linear-gradient(rgba(205,180,219,0.06) 1px, transparent 1px),
            linear-gradient(to right, rgba(240,66,153,0.05) 1px, transparent 1px);
          background-size: 22px 22px;
          background-color: transparent;
          opacity: 0.95;
        }

        .animate-float-slow { animation: floatSlow 10s ease-in-out infinite; }
        .animate-float-rev { animation: floatRev 9s ease-in-out infinite; }
        .animate-pulse-tiny { animation: pulseTiny 6s ease-in-out infinite; }
        .animate-seal-spin { animation: spinSeal 1.4s ease-in-out; }
        .animate-pulse-heart { animation: pulseHeart 1.1s ease-in-out infinite; }

        /* Memory Image Fade-in Animation */
        .memory-image {
          opacity: 0;
          animation: fadeInScale 0.8s ease-out forwards;
          transition: transform 0.3s ease;
          user-select: none;
          -webkit-user-drag: none;
        }

        .memory-image:hover {
          transform: scale(1.05) !important;
          z-index: 30;
        }

        .memory-image:active {
          cursor: grabbing !important;
        }

        .memory-container {
          position: relative;
        }

        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes floatSlow {
          0% { transform: translateY(0) translateX(0); opacity: .9; }
          50% { transform: translateY(-12px) translateX(6px); opacity: 1; }
          100% { transform: translateY(0) translateX(0); opacity: .9; }
        }
        @keyframes floatRev {
          0% { transform: translateY(0) translateX(0); opacity: .9; }
          50% { transform: translateY(10px) translateX(-6px); opacity: 1; }
          100% { transform: translateY(0) translateX(0); opacity: .9; }
        }
        @keyframes pulseTiny {
          0% { transform: scale(1); opacity: .85; }
          50% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: .85; }
        }
        @keyframes spinSeal {
          0% { transform: rotate(0deg) scale(0.8); opacity: 0; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 1; }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }
        @keyframes pulseHeart {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.18); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }

        /* Improved kiss particle animation: drift, rotate, fade, sparkle */
        .kiss-particle {
          position: absolute;
          bottom: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform-origin: center;
          will-change: transform, opacity;
          animation: kissRise 1600ms cubic-bezier(.2,.8,.2,1) forwards;
        }
        .kiss-particle .sparkle {
          width: 8px;
          height: 8px;
          margin-top: 6px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.6) 40%, transparent 60%);
          border-radius: 50%;
          opacity: 0.9;
          transform-origin: center;
          animation: sparklePop 800ms ease-out forwards;
        }

        @keyframes kissRise {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(0.9);
            opacity: 0.95;
          }
          30% {
            transform: translateY(-30px) translateX(var(--driftX, 0px)) rotate(var(--rot, 0deg)) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: translateY(-140px) translateX(var(--driftX, 0px)) rotate(calc(var(--rot, 0deg) * 1.3)) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes sparklePop {
          0% { transform: scale(0.6); opacity: 0; }
          30% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0; transform: translateY(-20px); }
        }

        /* small responsive tweaks */
        @media (max-width: 640px) {
          .font-display { padding: 12px; }
          .kiss-particle { font-size: 18px; }
          
          /* Reposition memory images for mobile - top and bottom of card */
          .memory-image {
            display: block !important;
            width: 80px !important;
            height: 80px !important;
          }

          /* Top row - 5 images */
          .memory-image:nth-child(1) { /* m1 */
            top: -100px !important;
            left: 10px !important;
            right: auto !important;
            bottom: auto !important;
          }
          .memory-image:nth-child(2) { /* m2 */
            top: -100px !important;
            left: 95px !important;
            right: auto !important;
            bottom: auto !important;
          }
          .memory-image:nth-child(3) { /* m3 */
            top: -100px !important;
            left: 50% !important;
            right: auto !important;
            bottom: auto !important;
            transform: translateX(-50%) rotate(-6deg) !important;
          }
          .memory-image:nth-child(4) { /* m4 */
            top: -100px !important;
            right: 95px !important;
            left: auto !important;
            bottom: auto !important;
          }
          .memory-image:nth-child(5) { /* m5 */
            top: -100px !important;
            right: 10px !important;
            left: auto !important;
            bottom: auto !important;
          }

          /* Bottom row - 5 images */
          .memory-image:nth-child(6) { /* m6 */
            bottom: -100px !important;
            left: 10px !important;
            right: auto !important;
            top: auto !important;
          }
          .memory-image:nth-child(7) { /* m7 */
            bottom: -100px !important;
            left: 95px !important;
            right: auto !important;
            top: auto !important;
          }
          .memory-image:nth-child(8) { /* m8 */
            bottom: -100px !important;
            left: 50% !important;
            right: auto !important;
            top: auto !important;
            transform: translateX(-50%) rotate(6deg) !important;
          }
          .memory-image:nth-child(9) { /* m9 */
            bottom: -100px !important;
            right: 95px !important;
            left: auto !important;
            top: auto !important;
          }
          .memory-image:nth-child(10) { /* m10 */
            bottom: -100px !important;
            right: 10px !important;
            left: auto !important;
            top: auto !important;
          }
        }

        /* Show memory images on tablets and larger */
        @media (min-width: 641px) and (max-width: 1024px) {
          .memory-image {
            width: 80px !important;
            height: 80px !important;
          }
        }
      `}</style>
    </div>
  );
}
