"use client"

import { useEffect, useRef } from "react"

interface VideoIntroProps {
  onComplete: () => void
  onSkip: () => void
}

export default function VideoIntro({ onComplete, onSkip }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasSkippedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Simple autoplay attempt - let the browser handle it
    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay blocked - call onComplete so the site still loads
        if (!hasSkippedRef.current) {
          hasSkippedRef.current = true;
          onComplete();
        }
      });
    };

    // Try when video can play
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }
  }, [onComplete]);

  const handleSkip = () => {
    if (hasSkippedRef.current) return;
    hasSkippedRef.current = true;
    onSkip();
  };

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999] cursor-pointer"
      onClick={handleSkip}
    >
      <div className="w-full h-full flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          className="h-auto max-h-full w-auto max-w-full object-contain"
          playsInline={true}
          muted={true}
          autoPlay={true}
          onEnded={() => {
            if (!hasSkippedRef.current) {
              hasSkippedRef.current = true;
              onComplete();
            }
          }}
          preload="auto"
          disablePictureInPicture
          loop={false}
        >
          <source src="/engagement-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Skip button - clean and always visible */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/35 text-white text-sm font-medium backdrop-blur-sm border border-white/30 transition-all duration-200 z-10"
      >
        Skip ›
      </button>
    </div>
  );
}
