"use client";

import { useEffect, useRef } from "react";

export function FadingVideo({ src, className, style }: { src: string; className?: string; style?: React.CSSProperties }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);
  const rAFRef = useRef<number>(null);

  const fadeTo = (target: number, duration: number) => {
    if (!videoRef.current) return;
    const el = videoRef.current;
    
    if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    
    const startOpacity = parseFloat(el.style.opacity || "0");
    const startTime = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentOpacity = startOpacity + (target - startOpacity) * progress;
      if (videoRef.current) videoRef.current.style.opacity = currentOpacity.toString();
      
      if (progress < 1) {
        rAFRef.current = requestAnimationFrame(animate);
      }
    };
    
    rAFRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      video.style.opacity = "0";
      video.play().catch(() => {});
      fadeTo(1, 500);
    };

    const handleTimeUpdate = () => {
      if (!video.duration || fadingOutRef.current) return;
      const timeLeft = video.duration - video.currentTime;
      if (timeLeft <= 0.55 && timeLeft > 0) {
        fadingOutRef.current = true;
        fadeTo(0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        if (!videoRef.current) return;
        video.currentTime = 0;
        video.play().catch(() => {});
        fadingOutRef.current = false;
        fadeTo(1, 500);
      }, 100);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{ ...style, opacity: 0 }}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
}
