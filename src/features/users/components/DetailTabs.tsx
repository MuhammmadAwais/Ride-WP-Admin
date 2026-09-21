import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { Bike, Shield, ShoppingBag, Receipt } from 'lucide-react';

export type TabId = 'rides' | 'clubs' | 'listings' | 'purchases';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: 'rides', label: 'Rides', icon: Bike },
  { id: 'clubs', label: 'Joined Clubs', icon: Shield },
  { id: 'listings', label: 'Listings', icon: ShoppingBag },
  { id: 'purchases', label: 'Purchases', icon: Receipt },
];

interface DetailTabsProps {
  activeTab: TabId;
  onChange: (tabId: TabId) => void;
  counts?: Partial<Record<TabId, number>>;
}

export function DetailTabs({ activeTab, onChange, counts }: DetailTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBgRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    if (!containerRef.current || !activeBgRef.current) return;

    const activeBtn = containerRef.current.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLButtonElement;

    if (activeBtn) {
      const left = activeBtn.offsetLeft;
      const width = activeBtn.offsetWidth;

      if (indicatorStyle.opacity === 0) {
        setIndicatorStyle({ left, width, opacity: 1 });
        gsap.set(activeBgRef.current, { x: left, width, opacity: 1 });
      } else {
        gsap.to(activeBgRef.current, {
          x: left,
          width,
          duration: 0.35,
          ease: 'power3.out',
        });
      }
    }
  }, [activeTab, indicatorStyle.opacity, counts]);

  return (
    <div
      className="relative inline-flex backdrop-blur-md bg-surface p-1.5 rounded-2xl border border-border gap-2 overflow-x-auto no-scrollbar max-w-full shadow-xs"
      ref={containerRef}
    >
      {/* Floating active background pill */}
      <div
        ref={activeBgRef}
        className="absolute top-1.5 bottom-1.5 left-0 rounded-xl bg-accent shadow-[0_4px_16px_-2px_rgba(235,113,43,0.35)] pointer-events-none"
        style={{ opacity: 0 }}
      />

      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts?.[tab.id];
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 px-5 py-2.5 font-poppins text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 whitespace-nowrap inline-flex items-center gap-2 cursor-pointer",
              isActive ? "text-white" : "text-text-muted hover:text-text-main hover:bg-hover"
            )}
          >
            <Icon size={16} className={isActive ? "text-white" : "text-text-muted"} />
            <span>{tab.label}</span>
            {count !== undefined && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-pill text-[11px] font-black transition-colors",
                  isActive ? "bg-white/20 text-white" : "bg-accent/10 text-accent border border-accent/20"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
