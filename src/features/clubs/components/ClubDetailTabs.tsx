import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  Bike,
  Newspaper,
  Trophy,
  ShoppingBag,
  Percent,
  Layers,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { type TabId } from '../utils/constants';

interface ClubDetailTabsProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
  counts?: Partial<Record<TabId, number>>;
}

interface ClubTabItem {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

const TABS: ClubTabItem[] = [
  { id: 'rides', label: 'Rides', icon: Bike },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'discount', label: 'Discounts', icon: Percent },
  { id: 'marketplace', label: 'Marketplace', icon: Layers },
  { id: 'members', label: 'Members', icon: Users },
];

export function ClubDetailTabs({ activeTab, onChange, counts }: ClubDetailTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && indicatorRef.current) {
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
          duration: 0.35,
          ease: 'power3.out',
        });
      }
    }
  }, [activeTab]);

  return (
    <div className="relative w-full overflow-x-auto no-scrollbar pb-1">
      <div 
        ref={containerRef} 
        className="inline-flex items-center gap-1.5 p-1.5 bg-surface/80 backdrop-blur-md border border-border rounded-2xl relative min-w-max shadow-xs"
      >
        {/* Animated Highlight Indicator with signature ember glow */}
        <div
          ref={indicatorRef}
          className="absolute top-1.5 bottom-1.5 left-0 bg-accent rounded-xl z-0 pointer-events-none shadow-[0_4px_16px_-2px_rgba(235,113,43,0.35)]"
          style={{ width: 0, x: 0 }}
        />

        {/* Tab Buttons */}
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const count = counts?.[tab.id];

          return (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative z-10 px-4 sm:px-5 py-2.5 font-poppins text-xs sm:text-sm font-bold tracking-tight rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer select-none ${
                isActive
                  ? 'text-white'
                  : 'text-text-muted hover:text-text-main hover:bg-hover/50'
              }`}
            >
              <Icon
                size={15}
                className={
                  isActive
                    ? 'text-white shrink-0'
                    : 'text-text-muted group-hover:text-text-main shrink-0 transition-colors'
                }
              />
              <span>{tab.label}</span>
              {typeof count === 'number' && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-accent/10 text-accent border border-accent/20'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

