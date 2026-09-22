/**
 * @fileoverview Club Leaderboard sub-tab supporting dual operating modes:
 * 1. App Rides Leaderboard (Internal club rides, rides attended, attendance rate, month filter)
 * 2. Strava Sync Leaderboard (Strava GPS activities, distance in km, period filter: week/month/year/all)
 * Features dynamic top-3 podium highlight cards and adaptive data tables.
 */
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Medal,
  Award,
  Flame,
  Bike,
  ExternalLink,
  Activity,
  Zap,
  Calendar,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import type { ClubLeaderboardItem } from '../../types/clubTypes';
import { UserAvatar } from '@/Components/common/UserAvatar';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';

interface ClubLeaderboardTabProps {
  leaderboard: ClubLeaderboardItem[];
}

const MONTHS = [
  { value: 'all', label: 'All Months' },
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

const STRAVA_PERIODS = [
  { value: 'all', label: 'All Time' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

export const ClubLeaderboardTab: React.FC<ClubLeaderboardTabProps> = ({ leaderboard }) => {
  const [activeMode, setActiveMode] = useState<'app' | 'strava'>('app');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [stravaPeriod, setStravaPeriod] = useState<string>('month');

  // ── Normalize and Sort Records by Active Mode ──────────────────────────────
  const normalized = useMemo(() => {
    const list = leaderboard.map((item, index) => {
      const userId = Number(item.user?.id || item.id || 0);
      const name =
        item.fullName ||
        item.name ||
        item.userName ||
        item.user?.fullName ||
        item.user?.username ||
        `Athlete #${index + 1}`;

      const avatar =
        item.avatar ||
        item.profileImage ||
        item.user?.profileImage ||
        null;

      // Distance in km
      let distanceKm = '0.0';
      let rawDistNum = 0;
      const rawDistance = item.totalDistance ?? item.totalKm ?? item.distance ?? item.user?.totalDistance;
      if (rawDistance !== undefined && rawDistance !== null) {
        const num = parseFloat(String(rawDistance));
        if (!isNaN(num)) {
          rawDistNum = num;
          distanceKm = num.toFixed(1);
        } else {
          distanceKm = String(rawDistance);
        }
      }

      // Total rides attended
      const totalRides =
        item.ridesCount ??
        item.totalRides ??
        item.rides ??
        item.user?.ridesCount ??
        0;

      // Attendance percentage
      const attendance = item.attendance !== undefined ? `${item.attendance}%` : '100%';
      const team = item.team || 'RWP Squad';
      const role = item.role || (item.user as any)?.role || 'Member';

      return {
        originalRank: item.rank || index + 1,
        userId,
        name,
        avatar,
        distanceKm,
        rawDistNum,
        totalRides,
        attendance,
        team,
        role,
        isStravaSynced: Boolean(item.stravaConnected || rawDistNum > 0),
      };
    });

    // Dynamic sorting depending on selected leaderboard mode
    if (activeMode === 'app') {
      list.sort((a, b) => {
        if (b.totalRides !== a.totalRides) {
          return b.totalRides - a.totalRides;
        }
        return b.rawDistNum - a.rawDistNum;
      });
    } else {
      list.sort((a, b) => b.rawDistNum - a.rawDistNum);
    }

    // Re-assign ranks 1..N based on mode-specific sorting
    return list.map((item, idx) => ({
      ...item,
      id: idx + 1,
      rank: idx + 1,
    }));
  }, [leaderboard, activeMode]);

  // Top 3 for Podium Highlight
  const topThree = normalized.slice(0, 3);

  // ── Columns Definition by Active Mode ──────────────────────────────────────
  const columns: ColumnDef<(typeof normalized)[0]>[] = useMemo(() => {
    const baseColumns: ColumnDef<(typeof normalized)[0]>[] = [
      {
        header: 'Rank',
        accessorKey: (item) => {
          if (item.rank === 1) {
            return (
              <div className="flex items-center gap-1.5 font-poppins font-black text-amber-400 text-base">
                <Trophy size={18} className="fill-amber-400/20" />
                <span>01</span>
              </div>
            );
          }
          if (item.rank === 2) {
            return (
              <div className="flex items-center gap-1.5 font-poppins font-black text-slate-300 text-base">
                <Medal size={18} className="fill-slate-300/20" />
                <span>02</span>
              </div>
            );
          }
          if (item.rank === 3) {
            return (
              <div className="flex items-center gap-1.5 font-poppins font-black text-amber-600 text-base">
                <Award size={18} className="fill-amber-600/20" />
                <span>03</span>
              </div>
            );
          }
          return (
            <span className="font-poppins font-bold text-text-muted text-sm pl-1">
              {item.rank < 10 ? `0${item.rank}` : item.rank}
            </span>
          );
        },
        sortKey: 'rank',
      },
      {
        header: 'Athlete',
        accessorKey: (item) => (
          <div className="flex items-center gap-3.5">
            <UserAvatar src={item.avatar} name={item.name} size="md" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-poppins font-bold text-text-main text-sm truncate">
                  {item.name}
                </span>
                {item.userId > 0 && (
                  <Link
                    to={`/users/${item.userId}`}
                    className="text-text-muted hover:text-accent transition-colors p-0.5"
                    title="View Athlete Dossier"
                  >
                    <ExternalLink size={13} />
                  </Link>
                )}
              </div>
              <span className="text-xs font-roboto text-text-muted truncate">
                {item.team} • {item.role}
              </span>
            </div>
          </div>
        ),
        sortKey: 'name',
      },
    ];

    if (activeMode === 'app') {
      baseColumns.push(
        {
          header: 'Rides Attended',
          accessorKey: (item) => (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Bike size={14} />
              </div>
              <span className="font-roboto font-bold text-text-main text-sm">
                {item.totalRides} {item.totalRides === 1 ? 'ride' : 'rides'}
              </span>
            </div>
          ),
          sortKey: 'totalRides',
        },
        {
          header: 'Attendance Rate',
          accessorKey: (item) => (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-roboto font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              {item.attendance}
            </span>
          ),
          sortKey: 'attendance',
        },
        {
          header: 'Distance Logged',
          accessorKey: (item) => (
            <span className="font-roboto text-xs text-text-muted">
              {item.distanceKm} km
            </span>
          ),
          sortKey: 'rawDistNum',
        }
      );
    } else {
      // Strava Mode Columns
      baseColumns.push(
        {
          header: 'Distance Covered',
          accessorKey: (item) => (
            <div className="flex items-center gap-1.5">
              <span className="font-poppins font-black text-accent text-base">
                {item.distanceKm}
              </span>
              <span className="text-xs font-poppins font-bold text-text-muted uppercase">
                km
              </span>
            </div>
          ),
          sortKey: 'rawDistNum',
        },
        {
          header: 'Strava Status',
          accessorKey: (item) => (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-poppins font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Zap size={11} className="text-orange-400" />
              <span>Synced</span>
            </span>
          ),
        },
        {
          header: 'Activities Logged',
          accessorKey: (item) => (
            <span className="font-roboto font-medium text-xs text-text-main">
              {item.totalRides} rides
            </span>
          ),
          sortKey: 'totalRides',
        }
      );
    }

    baseColumns.push({
      header: 'Action',
      accessorKey: (item) =>
        item.userId > 0 ? (
          <Link
            to={`/users/${item.userId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-accent/40 text-text-main hover:text-accent font-poppins text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <span>Dossier</span>
            <ExternalLink size={12} />
          </Link>
        ) : (
          <span className="text-xs text-text-muted/50">—</span>
        ),
    });

    return baseColumns;
  }, [activeMode]);

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      {/* ── Mode Switcher & Timeframe Filters Header ───────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface border border-border rounded-3xl p-5 shadow-sm">
        {/* Left: Mode Title and Subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-poppins font-bold text-text-main">
              Club Leaderboard
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
              {activeMode === 'app' ? 'App Rides' : 'Strava Sync'}
            </span>
          </div>
          <p className="text-xs font-roboto text-text-muted mt-1">
            {activeMode === 'app'
              ? 'Rankings by official Ride With Pals club rides and attendance honors'
              : 'Rankings by Strava GPS activity data and total cycling distance'}
          </p>
        </div>

        {/* Right: Controls Strip */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Segmented Control: App vs Strava */}
          <div className="flex items-center gap-1 bg-main-bg border border-border p-1 rounded-2xl shadow-inner font-poppins text-xs">
            <button
              onClick={() => setActiveMode('app')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'app'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Bike size={14} />
              <span>App Rides</span>
            </button>
            <button
              onClick={() => setActiveMode('strava')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'strava'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Zap size={14} />
              <span>Strava Sync</span>
            </button>
          </div>

          {/* Timeframe Dropdown */}
          <div className="relative">
            {activeMode === 'app' ? (
              <div className="flex items-center gap-1.5 bg-main-bg border border-border rounded-2xl px-3 py-1.5 text-xs font-roboto text-text-main shadow-sm">
                <Calendar size={13} className="text-accent shrink-0" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent border-none outline-none text-text-main cursor-pointer pr-2 font-medium"
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value} className="bg-surface text-text-main">
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-main-bg border border-border rounded-2xl px-3 py-1.5 text-xs font-roboto text-text-main shadow-sm">
                <Filter size={13} className="text-accent shrink-0" />
                <select
                  value={stravaPeriod}
                  onChange={(e) => setStravaPeriod(e.target.value)}
                  className="bg-transparent border-none outline-none text-text-main cursor-pointer pr-2 font-medium"
                >
                  {STRAVA_PERIODS.map((p) => (
                    <option key={p.value} value={p.value} className="bg-surface text-text-main">
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Empty State ─────────────────────────────────────────────────────── */}
      {normalized.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface border border-border border-dashed rounded-3xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
            <Trophy size={32} />
          </div>
          <h3 className="font-poppins font-bold text-lg text-text-main mb-1">
            No Leaderboard Standings
          </h3>
          <p className="text-text-muted font-roboto text-sm max-w-sm">
            {activeMode === 'app'
              ? 'No member ride attendance or club check-ins recorded for this timeframe.'
              : 'No Strava cycling activities synced for this club yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* ── Podium Spotlight Cards for Top 3 ──────────────────────────────── */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topThree.map((rider, idx) => {
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;

                const borderGlow = isFirst
                  ? 'border-amber-400/40 bg-gradient-to-b from-amber-400/10 via-surface to-surface'
                  : isSecond
                  ? 'border-slate-300/40 bg-gradient-to-b from-slate-300/10 via-surface to-surface'
                  : 'border-amber-600/40 bg-gradient-to-b from-amber-600/10 via-surface to-surface';

                const badgeColor = isFirst
                  ? 'bg-amber-400 text-black'
                  : isSecond
                  ? 'bg-slate-300 text-black'
                  : 'bg-amber-600 text-white';

                return (
                  <div
                    key={rider.id}
                    className={`relative rounded-3xl p-6 border ${borderGlow} flex flex-col items-center text-center shadow-lg transition-all hover:scale-[1.02]`}
                  >
                    {/* Podium Rank Pill */}
                    <div
                      className={`absolute -top-3 px-3.5 py-0.5 rounded-full text-xs font-poppins font-black uppercase tracking-wider shadow-md ${badgeColor}`}
                    >
                      {isFirst ? '1st Place' : isSecond ? '2nd Place' : '3rd Place'}
                    </div>

                    <div className="mt-2 mb-3">
                      <UserAvatar src={rider.avatar} name={rider.name} size="xl" />
                    </div>

                    <h4 className="font-poppins font-bold text-text-main text-base truncate max-w-full">
                      {rider.name}
                    </h4>
                    <p className="text-xs font-roboto text-text-muted mb-4">
                      {rider.team} • {rider.role}
                    </p>

                    {/* Adaptive Metric Strip Based on Active Mode */}
                    <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-border/80">
                      {activeMode === 'app' ? (
                        <>
                          <div className="bg-main-bg/60 rounded-2xl p-2.5 flex flex-col items-center">
                            <span className="text-[10px] uppercase font-poppins font-bold text-text-muted tracking-wider flex items-center gap-1">
                              <Activity size={11} className="text-accent" /> Rides
                            </span>
                            <span className="font-poppins font-black text-text-main text-sm mt-0.5">
                              {rider.totalRides}
                            </span>
                          </div>
                          <div className="bg-main-bg/60 rounded-2xl p-2.5 flex flex-col items-center">
                            <span className="text-[10px] uppercase font-poppins font-bold text-text-muted tracking-wider flex items-center gap-1">
                              <CheckCircle2 size={11} className="text-emerald-500" /> Attendance
                            </span>
                            <span className="font-poppins font-black text-emerald-500 text-sm mt-0.5">
                              {rider.attendance}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-main-bg/60 rounded-2xl p-2.5 flex flex-col items-center">
                            <span className="text-[10px] uppercase font-poppins font-bold text-text-muted tracking-wider flex items-center gap-1">
                              <Flame size={11} className="text-accent" /> Distance
                            </span>
                            <span className="font-poppins font-black text-accent text-sm mt-0.5">
                              {rider.distanceKm} km
                            </span>
                          </div>
                          <div className="bg-main-bg/60 rounded-2xl p-2.5 flex flex-col items-center">
                            <span className="text-[10px] uppercase font-poppins font-bold text-text-muted tracking-wider flex items-center gap-1">
                              <Zap size={11} className="text-orange-400" /> Strava
                            </span>
                            <span className="font-poppins font-black text-text-main text-sm mt-0.5">
                              Synced
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── All Member Standings Table ────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-poppins font-bold text-base text-text-main">
                All Athlete Standings ({normalized.length})
              </h4>
              <span className="text-xs font-roboto text-text-muted">
                Sorted by {activeMode === 'app' ? 'total rides attended' : 'distance covered (km)'}
              </span>
            </div>
            <DataTable
              data={normalized}
              columns={columns}
              keyExtractor={(r) => r.id.toString()}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ClubLeaderboardTab;
