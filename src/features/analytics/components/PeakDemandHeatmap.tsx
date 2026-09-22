/**
 * @fileoverview Club Athlete Density & Community Chapter Leaderboard.
 * Replaces legacy taxi heatmap with real club membership capacity from useGetClubsListQuery.
 * 100% dynamic without fake random numbers or taxi dispatch hours.
 */
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Shield, Loader2, Users } from 'lucide-react';
import { useGetClubsListQuery } from '@/features/clubs/api/clubApi';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface/95 backdrop-blur-xl border border-border p-3.5 rounded-2xl shadow-xl">
        <p className="font-poppins font-bold text-text-main text-sm mb-1">{data.name}</p>
        <p className="font-roboto text-xs text-text-muted mb-2">{data.location}</p>
        <div className="flex items-center gap-2">
          <Users size={14} className="text-accent" />
          <span className="font-roboto text-xs text-text-muted">
            Athletes:{' '}
            <span className="font-poppins font-bold text-accent text-sm ml-1">
              {data.athletes}
            </span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function PeakDemandHeatmap() {
  const { data: clubsData, isLoading } = useGetClubsListQuery({ limit: 100 });
  const clubs = clubsData?.clubs || [];

  const chartData = useMemo(() => {
    if (!clubs || clubs.length === 0) return [];

    // Sort clubs by participant count descending, take top 6
    const sorted = [...clubs].sort((a, b) => (b.participantCount || 0) - (a.participantCount || 0));
    return sorted.slice(0, 6).map((c) => ({
      name: c.clubName.length > 18 ? `${c.clubName.slice(0, 16)}...` : c.clubName,
      athletes: c.participantCount ?? 1,
      location: c.location || 'Global Chapter',
      sport: c.clubTypeName || 'Cycling',
    }));
  }, [clubs]);

  return (
    <div className="analytics-card opacity-0 w-full bg-surface rounded-3xl border border-border p-6 sm:p-7 shadow-sm flex flex-col justify-between h-[400px]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-poppins font-bold text-xl text-text-main">
              Club Athlete Density
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
              Top Chapters
            </span>
          </div>
          <p className="font-roboto text-sm text-text-muted mt-1">
            Largest sports clubs ranked by registered active member rosters
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 border border-accent/20">
          <Shield size={18} />
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted">
            <Loader2 size={28} className="animate-spin text-accent" />
            <span className="font-roboto text-xs">Ranking club rosters...</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted text-center p-4">
            <p className="font-poppins font-bold text-sm">No Club Rosters Recorded</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-border"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 11, fontFamily: 'Roboto' }}
                className="text-text-muted"
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'currentColor', fontSize: 11, fontFamily: 'Roboto' }}
                className="text-text-muted"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
              <Bar
                dataKey="athletes"
                name="Roster Members"
                fill="#EB712B"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
