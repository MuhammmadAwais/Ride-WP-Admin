import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

export type TabId = 'rides' | 'clubs' | 'listings' | 'purchases';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'rides', label: 'Rides Participated' },
  { id: 'clubs', label: 'Joined Clubs' },
  { id: 'listings', label: 'Listings' },
  { id: 'purchases', label: 'Purchases' },
];

interface DetailTabsProps {
  activeTab: TabId;
  onChange: (tabId: TabId) => void;
}

export function DetailTabs({ activeTab, onChange }: DetailTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBgRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    if (!containerRef.current || !activeBgRef.current) return;
    
    // Find the active tab button element
    const activeBtn = containerRef.current.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLButtonElement;
    
    if (activeBtn) {
      const left = activeBtn.offsetLeft;
      const width = activeBtn.offsetWidth;
      
      // Update state for initial render, use GSAP for subsequent renders
      if (indicatorStyle.opacity === 0) {
        setIndicatorStyle({ left, width, opacity: 1 });
        gsap.set(activeBgRef.current, { x: left, width, opacity: 1 });
      } else {
        gsap.to(activeBgRef.current, {
          x: left,
          width,
          duration: 0.4,
          ease: 'power3.out',
        });
      }
    }
  }, [activeTab, indicatorStyle.opacity]);

  return (
    <div className="relative inline-flex backdrop-blur-md bg-white/5 p-1.5 rounded-xl border border-white/5 gap-2" ref={containerRef}>
      {/* Floating active background */}
      <div
        ref={activeBgRef}
        className="absolute top-1.5 bottom-1.5 left-0 rounded-lg bg-[#EB712B] shadow-[0_4px_15px_-3px_rgba(235,113,43,0.5)] pointer-events-none"
        style={{ opacity: 0 }} // Starts hidden until effect sets it
      />
      
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 px-4 py-2 font-poppins text-sm font-medium rounded-lg transition-colors duration-300",
              isActive ? "text-white" : "text-white/60 hover:text-white/90"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
