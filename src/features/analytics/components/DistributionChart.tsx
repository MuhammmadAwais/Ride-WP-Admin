/**
 * @fileoverview Dynamic Sport Disciplines Breakdown Donut Chart.
 * Computes live category distributions across all registered sports clubs in the platform.
 * 100% dynamic with real club counts in the center.
 */
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useGetClubsListQuery } from '@/features/clubs/api/clubApi';

const ATHLETIC_PALETTE = ['#EB712B', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#06B6D4'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface/95 backdrop-blur-xl border border-border p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.fill }} />
        <span className="font-poppins font-bold text-text-main text-sm">
          {data.name}:{' '}
          <span className="text-accent font-roboto ml-1 font-semibold">
            {data.value} {data.value === 1 ? 'club' : 'clubs'}
          </span>
        </span>
      </div>
    );
  }
  return null;
};

export function DistributionChart() {
  const { data: clubsData, isLoading } = useGetClubsListQuery({ limit: 100 });
  const clubs = clubsData?.clubs || [];

  const { chartData, totalClubs } = useMemo(() => {
    if (!clubs || clubs.length === 0) {
      return {
        chartData: [
          { name: 'Cycling', value: 1, fill: ATHLETIC_PALETTE[0] },
          { name: 'Running', value: 0, fill: ATHLETIC_PALETTE[1] },
        ],
        totalClubs: 0,
      };
    }

    const counts: Record<string, number> = {};
    clubs.forEach((c) => {
      const type = (c.clubTypeName || 'Cycling').trim();
      counts[type] = (counts[type] || 0) + 1;
    });

    const data = Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      fill: ATHLETIC_PALETTE[idx % ATHLETIC_PALETTE.length],
    }));

    return {
      chartData: data,
      totalClubs: clubs.length,
    };
  }, [clubs]);

  return (
    <div className="analytics-card opacity-0 w-full h-[420px] bg-surface rounded-3xl border border-border p-6 sm:p-7 shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="font-poppins font-bold text-xl text-text-main">Sport Disciplines</h2>
        <p className="font-roboto text-sm text-text-muted mt-1">
          Active Clubs by Athletic Category
        </p>
      </div>

      <div className="flex-1 min-h-0 w-full relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted">
            <Loader2 size={28} className="animate-spin text-accent" />
            <span className="font-roboto text-xs">Aggregating disciplines...</span>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="82%"
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill || ATHLETIC_PALETTE[index % ATHLETIC_PALETTE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontFamily: 'Roboto', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Dynamic Total Count */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-7">
              <span className="font-poppins font-black text-3xl text-text-main">
                {totalClubs}
              </span>
              <span className="font-roboto text-[11px] text-text-muted uppercase tracking-wider font-semibold">
                Total Clubs
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
