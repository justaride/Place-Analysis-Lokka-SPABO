'use client';

import { useState, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import FadeIn from '@/components/ui/FadeIn';

interface Screenshot {
  filnavn: string;
  path: string;
  beskrivelse: string;
  kategori: string;
}

interface TabbedImageViewerProps {
  screenshots: Screenshot[];
  title?: string;
}

export default function TabbedImageViewer({ screenshots, title = "Plaace Analytics" }: TabbedImageViewerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.changedTouches[0]) {
      touchEndX.current = e.changedTouches[0].clientX;
      handleSwipe();
    }
  };

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // pixels

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left - next tab
        setActiveTab(Math.min(screenshots.length - 1, activeTab + 1));
      } else {
        // Swipe right - previous tab
        setActiveTab(Math.max(0, activeTab - 1));
      }
    }
  };

  return (
    <div className="mb-12 md:mb-20">
      {/* Section Header */}
      <FadeIn direction="none">
        <div className="mb-6 md:mb-8">
          <h2 className="mb-2 text-2xl font-bold text-lokka-primary md:mb-4 md:text-3xl">{title}</h2>
          <p className="text-xs text-lokka-secondary md:text-sm">
            Detaljert stedsanalyse med demografi, besøksmønstre og markedsdata
          </p>
        </div>
      </FadeIn>

      {/* Tab Navigation */}
      <FadeIn delay={100} direction="up">
        <div className="mb-4 overflow-x-auto md:mb-6">
          <div className="flex gap-2 border-b border-gray-200/50 pb-2">
            {screenshots.map((screenshot, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`whitespace-nowrap rounded-t-lg px-3 py-2 text-xs font-medium transition-all md:px-6 md:py-3 md:text-sm ${
                  activeTab === index
                    ? 'bg-lokka-primary text-white shadow-soft'
                    : 'bg-gray-100 text-lokka-secondary hover:bg-gray-200'
                }`}
              >
                {screenshot.filnavn}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Image Display */}
      <FadeIn delay={200} direction="up">
        <div
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className={`transition-opacity duration-300 ${
                activeTab === index ? 'opacity-100' : 'absolute inset-0 opacity-0 pointer-events-none'
              }`}
            >
              <div className="group relative w-full overflow-hidden rounded-2xl shadow-soft transition-all duration-500 ease-out hover:shadow-large">
                <Image
                  src={screenshot.path}
                  alt={screenshot.filnavn}
                  width={2480}
                  height={3508}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                  quality={85}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              </div>
              {screenshot.beskrivelse && (
                <p className="mt-4 text-sm text-lokka-secondary text-center">
                  {screenshot.beskrivelse}
                </p>
              )}
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Navigation Arrows */}
      <div className="mt-4 flex items-center justify-between md:mt-6">
        <button
          onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
          disabled={activeTab === 0}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-lokka-primary transition-all hover:bg-lokka-light disabled:cursor-not-allowed disabled:opacity-30 md:gap-2 md:px-4 md:text-sm"
        >
          <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden md:inline">Forrige</span>
        </button>

        <div className="text-xs text-lokka-secondary md:text-sm">
          {activeTab + 1} av {screenshots.length}
        </div>

        <button
          onClick={() => setActiveTab(Math.min(screenshots.length - 1, activeTab + 1))}
          disabled={activeTab === screenshots.length - 1}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-lokka-primary transition-all hover:bg-lokka-light disabled:cursor-not-allowed disabled:opacity-30 md:gap-2 md:px-4 md:text-sm"
        >
          <span className="hidden md:inline">Neste</span>
          <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
