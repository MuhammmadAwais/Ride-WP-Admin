import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Award, Flame, Bike, ExternalLink, Activity } from 'lucide-react';
import type { ClubLeaderboardItem } from '../../types/clubTypes';
import { UserAvatar } from '@/Components/common/UserAvatar';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';

interface ClubLeaderboardTabProps {
  leaderboard: ClubLeaderboardItem[];
}

export const ClubLeaderboardTab: React.FC<ClubLeaderboardTabProps> = ({ leaderboard }) => {
  // Normalize leaderboard records
  const normalized = useMemo(() => {
    return leaderboard.map((item, index) => {
      const rank = item.rank || index + 1;
      const userId = Number(item.user?.id || item.id || 0);
      const name =
        item.fullName ||
        item.name ||
        item.userName ||
        item.user?.fullName ||
        item.user?.username ||
        `Athlete #${rank}`;

      const avatar =
        item.avatar ||
        item.profileImage ||
        item.user?.profileImage ||
        null;

      // Distance in km
      let distanceKm = '0.0';
      const rawDistance = item.totalDistance ?? item.totalKm ?? item.distance ?? item.user?.totalDistance;
      if (rawDistance !== undefined && rawDistance !== null) {
        const num = parseFloat(String(rawDistance));
        distanceKm = isNaN(num) ? String(rawDistance) : num.toFixed(1);
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

      return {
        id: rank,
        rank,
        userId,
        name,
        avatar,
        distanceKm,
        totalRides,
        attendance,
        team,
      };
    });
  }, [leaderboard]);

  if (normalized.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] bg-surface border border-border border-dashed rounded-3xl p-8 text-center mt-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
          <Trophy size={32} />
        </div>
        <h3 className="font-poppins font-bold text-lg text-text-main mb-1">No Leaderboard Standings</h3>
        <p className="text-text-muted font-roboto text-sm max-w-sm">
          No club ride performance data or athlete distance rankings have been recorded yet.
        </p>
      </div>
    );
  }

  // Split top 3 for podium highlight
  const topThree = normalized.slice(0, 3);

  const columns: ColumnDef<(typeof normalized)[0]>[] = [
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
              {item.team}
            </span>
          </div>
        </div>
      ),
      sortKey: 'name',
    },
    {
      header: 'Distance Covered',
      accessorKey: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-poppins font-black text-accent text-base">
            {item.distanceKm}
          </span>
          <span className="text-xs font-poppins font-bold text-text-muted uppercase">
            km
          </span>
        </div>
      ),
      sortKey: 'distanceKm',
    },
    {
      header: 'Rides Attended',
      accessorKey: (item) => (
        <div className="flex items-center gap-2">
          <Bike size={14} className="text-accent" />
          <span className="font-roboto font-bold text-text-main text-sm">
            {item.totalRides} {item.totalRides === 1 ? 'ride' : 'rides'}
          </span>
        </div>
      ),
    },
    {
      header: 'Attendance',
      accessorKey: (item) => (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-roboto font-bold bg-success/10 text-success border border-success/20">
            {item.attendance}
          </span>
        </div>
      ),
    },
    {
      header: 'Action',
      accessorKey: (item) =>
        item.userId > 0 ? (
          <Link
            to={`/users/${item.userId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-accent/40 text-text-main hover:text-accent font-poppins text-xs font-semibold transition-all shadow-sm"
          >
            <span>Profile</span>
            <ExternalLink size={12} />
          </Link>
        ) : (
          <span className="text-xs text-text-muted/50">—</span>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-poppins font-bold text-text-main flex items-center gap-2.5">
          Club Leaderboard
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
            Season Standings
          </span>
        </h3>
        <p className="text-sm font-roboto text-text-muted mt-0.5">
          Athletic distance rankings and ride participation honors.
        </p>
      </div>

      {/* Podium Spotlight Cards for Top 3 */}
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
                <p className="text-xs font-roboto text-text-muted mb-4">{rider.team}</p>

                <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-border/80">
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
                      <Activity size={11} className="text-success" /> Rides
                    </span>
                    <span className="font-poppins font-black text-text-main text-sm mt-0.5">
                      {rider.totalRides}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="flex flex-col gap-3">
        <h4 className="font-poppins font-bold text-base text-text-main">
          All Member Rankings
        </h4>
        <DataTable data={normalized} columns={columns} keyExtractor={(r) => r.id.toString()} />
      </div>
    </div>
  );
};
