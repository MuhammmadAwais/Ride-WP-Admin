import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  MapPin,
  Bike,
  Activity,
  Trophy,
  ExternalLink,
  Eye,
  Crown,
  Globe,
  Lock,
} from 'lucide-react';
import type { UserClub } from '../types/userTypes';
import { useGetClubByIdQuery } from '@/features/clubs/api/clubApi';
import { UserAvatar } from '@/Components/common/UserAvatar';
import { getImageUrl } from '@/utils/imageUrl';

interface UserClubCardProps {
  club: UserClub;
  onInspect: (club: UserClub) => void;
}

export const UserClubCard: React.FC<UserClubCardProps> = ({ club, onInspect }) => {
  // Query club detail to progressively enhance with logo, cover image, and metadata
  const { data: detailData } = useGetClubByIdQuery({ clubId: club.id });

  const profile = detailData?.profile;
  const stats = detailData?.stats;

  const clubName = profile?.clubName || club.clubName;
  const logo = profile?.logo || club.logo;
  const coverImage = profile?.coverImage || club.coverImage;
  const location = profile?.location || club.location;
  const sportType = profile?.clubTypeName || club.clubTypeName || 'Cycling';
  const privacy = profile?.clubPrivacyName || club.clubPrivacyName;
  const memberCount = stats?.activeMembers ?? club.memberCount;

  const coverSrc = coverImage ? getImageUrl(coverImage) : null;

  const renderSportIcon = () => {
    const s = sportType.toLowerCase();
    if (s.includes('run')) return <Activity size={11} className="text-warning" />;
    if (s.includes('triathlon')) return <Trophy size={11} className="text-info" />;
    return <Bike size={11} className="text-accent" />;
  };

  return (
    <div
      onClick={() => onInspect(club)}
      className="group rounded-3xl border border-border bg-main-bg/50 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md cursor-pointer select-none"
    >
      <div>
        {/* Card Mini Banner */}
        <div className="relative h-24 w-full bg-surface overflow-hidden border-b border-border/80">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={clubName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/15 via-surface to-main-bg" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Sport & Privacy Chips Over Banner */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
              {renderSportIcon()}
              <span>{sportType}</span>
            </span>

            {privacy && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                {privacy.toLowerCase() === 'public' ? (
                  <Globe size={10} className="text-success" />
                ) : (
                  <Lock size={10} className="text-warning" />
                )}
                <span>{privacy}</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Content & Avatar */}
        <div className="p-5 pt-0 relative">
          {/* Overlapping Club Avatar / Logo */}
          <div className="-mt-8 mb-3 flex items-end justify-between gap-3">
            <div className="shadow-lg rounded-2xl bg-surface border-2 border-border p-0.5">
              <UserAvatar
                src={logo}
                name={clubName}
                size="lg"
                shape="squircle"
              />
            </div>

            {/* Role Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider border shadow-xs ${
                club.role === 'Admin' || club.role === 'Owner'
                  ? 'bg-warning/10 text-warning border-warning/25'
                  : 'bg-accent/10 text-accent border-accent/25'
              }`}
            >
              {(club.role === 'Admin' || club.role === 'Owner') && <Crown size={11} />}
              <span>{club.role}</span>
            </span>
          </div>

          {/* Club Name & Location */}
          <div className="space-y-1">
            <h4
              className="font-poppins font-black text-base text-text-main group-hover:text-accent transition-colors truncate"
              title={clubName}
            >
              {clubName}
            </h4>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-roboto text-text-muted">
              {location && (
                <span className="flex items-center gap-1 truncate max-w-[180px]">
                  <MapPin size={12} className="text-accent shrink-0" />
                  <span className="truncate">{location}</span>
                </span>
              )}

              <span className="flex items-center gap-1">
                <Users size={12} className="text-accent shrink-0" />
                <span>{memberCount}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3.5 border-t border-border bg-surface/30 flex items-center justify-between text-xs">
        <span className="text-text-muted font-roboto text-[11px]">
          Joined: {new Date(club.joinedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect(club);
            }}
            className="inline-flex items-center gap-1 font-poppins font-bold text-accent hover:underline cursor-pointer"
          >
            <span>Inspect</span>
            <Eye size={12} />
          </button>

          <Link
            to={`/clubs/${club.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-text-muted hover:text-text-main transition-colors"
            title="Open Club Governance"
          >
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
