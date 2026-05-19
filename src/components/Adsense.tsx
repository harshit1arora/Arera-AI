"use client";

import React, { useEffect, useRef, useState } from 'react';

interface AdsenseProps {
  className?: string;
}

export default function Adsense({ className = "" }: AdsenseProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // 1. Ensure the script is loaded globally only once
    const clientID = "ca-pub-7822328969323520";
    const scriptUrl = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientID}`;
    
    let script = document.querySelector(`script[src="${scriptUrl}"]`) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    // 2. Initialize the ad slot safely
    // Wait a brief tick to ensure DOM is ready and prevent potential React concurrent mode race conditions
    const timer = setTimeout(() => {
      if (!initializedRef.current) {
        try {
          const adsbygoogle = (window as any).adsbygoogle || [];
          adsbygoogle.push({});
          initializedRef.current = true;
          setAdLoaded(true);
        } catch (err) {
          console.warn("AdSense push issue:", err);
          // Set ad loaded anyway to show slot or fallback smoothly
          setAdLoaded(true);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 transition-all duration-1000 ease-out transform ${
        adLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.98]'
      } ${className}`}
    >
      {/* Premium Glassmorphic ad container wrapper */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-4 md:p-6 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        {/* Futuristic glowing corner accents */}
        <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-orange-500/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
        
        {/* AD LABEL */}
        <div className="mb-4 flex items-center justify-between text-[10px] font-mono tracking-wider text-gray-500 uppercase">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Sponsored Analytics
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
        </div>

        {/* The ad unit container with min-height to prevent Cumulative Layout Shift (CLS) */}
        <div className="min-h-[100px] md:min-h-[250px] w-full flex items-center justify-center overflow-hidden bg-black/20 rounded-2xl border border-white/5">
          <ins 
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client="ca-pub-7822328969323520"
            data-ad-slot="6649016479"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}
