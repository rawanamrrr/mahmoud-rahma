"use client"

import { useEffect, useRef } from "react"

interface VideoIntroProps {
  onComplete: () => void
  onSkip: () => void
}

export default function VideoIntro({ onComplete, onSkip }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartYRef = useRef<number | null>(null);
  const hasSkippedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Simple autoplay attempt - let the browser handle it
    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay blocked - browser will handle it
      });
    };

    // Try when video can play
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999]"
      onClick={onSkip}
      onTouchStart={(e) => {
        if (e.touches.length > 0) touchStartYRef.current = e.touches[0].clientY;
      }}
      onTouchMove={(e) => {
        if (hasSkippedRef.current) return;
        if (e.touches.length === 0) return;

        const startY = touchStartYRef.current;
        const currentY = e.touches[0].clientY;

        if (startY === null) {
          touchStartYRef.current = currentY;
          return;
        }

        const deltaY = currentY - startY;

        if (Math.abs(deltaY) >= 12) {
          hasSkippedRef.current = true;
          onSkip();
        }
      }}
      onWheel={() => {
        if (hasSkippedRef.current) return;
        hasSkippedRef.current = true;
        onSkip();
      }}
    >
      <div className="w-full h-full flex items-center justify-center bg-black">
        <video 
          ref={videoRef}
          className="h-auto max-h-full w-auto max-w-full object-contain"
          playsInline={true}
          muted={true}
          autoPlay={true}
          onEnded={() => {}}
          preload="auto"
          disablePictureInPicture
          loop={true}
        >
        <source src="/engagement-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
