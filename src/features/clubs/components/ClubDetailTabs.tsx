import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { type TabId } from '../utils/constants';

interface ClubDetailTabsProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'rides', label: 'Rides' },
  { id: 'news', label: 'News' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'shop', label: 'Shop' },
  { id: 'discount', label: 'Discounts' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'members', label: 'Members' },
];

export function ClubDetailTabs({ activeTab, onChange }: ClubDetailTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && indicatorRef.current) {
      // Direct DOM query based on data-tab-id
      const activeEl = containerRef.current.querySelector(
        `[data-tab-id="${activeTab}"]`
      ) as HTMLButtonElement | null;

      if (activeEl) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();

        const left = activeRect.left - containerRect.left;
        const width = activeRect.width;

        gsap.to(indicatorRef.current, {
          x: left,
          width: width,
          duration: 0.5,
          ease: 'power3.out',
        });
      }
    }
  }, [activeTab]);

  return (
    <div className="relative w-full overflow-x-auto custom-scrollbar pb-2">
      <div 
        ref={containerRef} 
        className="inline-flex items-center gap-1 p-1 bg-surface border border-border rounded-[18px] relative min-w-max"
      >
        {/* Animated Highlight Indicator */}
        <div
          ref={indicatorRef}
          className="absolute top-1 bottom-1 left-0 bg-[#EB712B] rounded-2xl z-0 pointer-events-none"
          style={{ width: 0, x: 0 }}
        />

        {/* Tab Buttons */}
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative z-10 px-5 py-2.5 font-poppins text-[14px] font-semibold tracking-wide rounded-2xl transition-all duration-300 ${
                isActive ? 'text-white' : 'text-text-muted hover:text-text-main hover:bg-accent/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
