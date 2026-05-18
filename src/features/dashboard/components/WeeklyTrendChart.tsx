import { useState } from 'react';

interface WeeklyTrendChartProps {
  title: string;
  subtitle: string;
}

const WEEKLY_DATA = [
  { day: 'Mon', value: 48 },
  { day: 'Tue', value: 65 },
  { day: 'Wed', value: 58 },
  { day: 'Thu', value: 82 },
  { day: 'Fri', value: 96 },
  { day: 'Sat', value: 120 },
  { day: 'Sun', value: 85 }
];

export default function WeeklyTrendChart({ title, subtitle }: WeeklyTrendChartProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // SVG Chart Geometry
  const chartHeight = 160;
  const chartWidth = 440;
  const padding = 30;
  const maxVal = 140;

  const barWidth = 32;
  const gap = 20;

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between h-[300px]">
      <div>
        <h3 className="font-poppins font-bold text-text-main text-[16px] tracking-tight">{title}</h3>
        <p className="font-roboto text-text-muted text-xs mt-1">{subtitle}</p>
      </div>

      {/* SVG Matte Bar Chart Canvas */}
      <div className="relative flex-1 flex items-end justify-center mt-4">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-full overflow-visible"
        >
          {/* Horizontal Gridlines */}
          {[0, 50, 100].map((gridY, i) => {
            const yPos = chartHeight - padding - (gridY / maxVal) * (chartHeight - padding * 2);
            return (
              <g key={i}>
                <line 
                  x1={padding} 
                  y1={yPos} 
                  x2={chartWidth - padding} 
                  y2={yPos} 
                  className="stroke-border/40 stroke-1"
                  strokeDasharray="4 4"
                />
                <text 
                  x={padding - 10} 
                  y={yPos + 3} 
                  className="fill-text-muted/60 font-roboto text-[9px] text-right font-medium"
                  textAnchor="end"
                >
                  {gridY}
                </text>
              </g>
            );
          })}

          {/* Render Bars */}
          {WEEKLY_DATA.map((d, index) => {
            const xPos = padding + index * (barWidth + gap) + 15;
            const barHeight = (d.value / maxVal) * (chartHeight - padding * 2);
            const yPos = chartHeight - padding - barHeight;

            return (
              <g key={index}>
                {/* Bar Rect */}
                <rect 
                  x={xPos} 
                  y={yPos} 
                  width={barWidth} 
                  height={barHeight} 
                  rx={6}
                  className={`transition-all duration-200 cursor-pointer ${
                    hoveredBar === index ? 'fill-[#EB712B] opacity-100' : 'fill-[#EB712B]/75'
                  }`}
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                />

                {/* Day Labels */}
                <text 
                  x={xPos + barWidth / 2} 
                  y={chartHeight - 10} 
                  className="fill-text-muted font-poppins text-[10px] font-semibold"
                  textAnchor="middle"
                >
                  {d.day}
                </text>

                {/* Hover Tooltip inside SVG */}
                {hoveredBar === index && (
                  <g>
                    <rect 
                      x={xPos + barWidth / 2 - 25} 
                      y={yPos - 28} 
                      width={50} 
                      height={20} 
                      rx={4}
                      className="fill-surface stroke-border stroke-1"
                    />
                    <text 
                      x={xPos + barWidth / 2} 
                      y={yPos - 14} 
                      className="fill-text-main font-poppins font-bold text-[10px]"
                      textAnchor="middle"
                    >
                      {d.value}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Baseline */}
          <line 
            x1={padding} 
            y1={chartHeight - padding} 
            x2={chartWidth - padding} 
            y2={chartHeight - padding} 
            className="stroke-border stroke-1"
          />
        </svg>
      </div>
    </div>
  );
}
