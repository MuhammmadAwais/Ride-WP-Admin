import React from 'react';
import { HEATMAP_DATA, HEATMAP_HOURS } from '../utils/constants';

export function PeakDemandHeatmap() {
  // Helper to determine the opacity/color intensity based on value (0-100)
  const getIntensityClass = (value: number) => {
    if (value < 20) return 'bg-accent/5 border-transparent';
    if (value < 40) return 'bg-accent/20 border-accent/10';
    if (value < 60) return 'bg-accent/40 border-accent/20';
    if (value < 80) return 'bg-accent/60 border-accent/40';
    return 'bg-accent border-accent shadow-[0_0_10px_rgba(235,113,43,0.4)] text-white';
  };

  return (
    <div className="analytics-card opacity-0 w-full bg-surface rounded-3xl border border-border p-6 shadow-sm flex flex-col xl:col-span-2 overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-poppins font-bold text-xl text-text-main">Peak Demand Heatmap</h2>
          <p className="font-roboto text-sm text-text-muted mt-1">Activity hours across Rawalpindi segments</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-roboto text-text-muted">
          <span>Low</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-accent/5" />
            <div className="w-3 h-3 rounded-sm bg-accent/40" />
            <div className="w-3 h-3 rounded-sm bg-accent" />
          </div>
          <span>High</span>
        </div>
      </div>

      <div className="flex-1 w-full overflow-x-auto custom-scrollbar pb-2">
        <div className="min-w-[600px]">
          {/* Header Row (Hours) */}
          <div className="flex mb-2">
            <div className="w-12 flex-shrink-0" /> {/* Empty corner */}
            {HEATMAP_HOURS.map((hour, i) => (
              <div key={i} className="flex-1 text-center font-roboto text-xs font-medium text-text-muted">
                {hour}
              </div>
            ))}
          </div>

          {/* Grid Rows (Days) */}
          <div className="flex flex-col gap-2">
            {HEATMAP_DATA.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-10 flex-shrink-0 font-roboto text-sm font-semibold text-text-main text-right pr-2">
                  {row.day}
                </div>
                {row.data.map((val, j) => (
                  <div 
                    key={j} 
                    className={`flex-1 h-8 sm:h-10 rounded-md border transition-all duration-300 hover:scale-[1.05] cursor-pointer ${getIntensityClass(val)}`}
                    title={`${row.day} at ${HEATMAP_HOURS[j]}: ${val}% activity`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
