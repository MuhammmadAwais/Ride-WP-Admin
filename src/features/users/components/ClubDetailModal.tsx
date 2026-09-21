import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Shield,
  Users,
  MapPin,
  Calendar,
  Globe,
  Lock,
  Bike,
  Activity,
  Trophy,
  ExternalLink,
  Crown,
  Loader2,
} from 'lucide-react';
import type { UserClub } from '../types/userTypes';
import { useGetClubByIdQuery } from '@/features/clubs/api/clubApi';
import { UserAvatar } from '@/Components/common/UserAvatar';
import { getImageUrl } from '@/utils/imageUrl';

interface ClubDetailModalProps {
  club: UserClub | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClubDetailModal: React.FC<ClubDetailModalProps> = ({
  club,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const clubId = club?.id || 0;

  // Fetch full club dossier by clubId
  const { data: clubDetail, isLoading } = useGetClubByIdQuery(
    { clubId },
    { skip: !clubId || !isOpen }
  );

  if (!club) return null;

  const profile = clubDetail?.profile;
  const stats = clubDetail?.stats;

  const clubName = profile?.clubName || club.clubName;
  const logo = profile?.logo || club.logo;
  const coverImage = profile?.coverImage || club.coverImage;
  const location = profile?.location || club.location || 'Location not specified';
  const sportType = profile?.clubTypeName || club.clubTypeName || 'Cycling';
  const privacy = profile?.clubPrivacyName || club.clubPrivacyName || 'Public';
  const memberCount = stats?.activeMembers ?? club.memberCount;
  const groupRuns = stats?.groupRuns ?? 0;
  const owner = profile?.owner;

  const coverSrc = coverImage ? getImageUrl(coverImage) : null;

  const renderSportIcon = () => {
    const s = sportType.toLowerCase();
    if (s.includes('run')) return <Activity size={12} className="text-warning" />;
    if (s.includes('triathlon')) return <Trophy size={12} className="text-info" />;
    return <Bike size={12} className="text-accent" />;
  };

  const handleOpenFullPage = () => {
    onClose();
    navigate(`/clubs/${clubId}`);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border border-border rounded-3xl p-0 shadow-2xl max-w-xl w-[92vw] z-50 animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar outline-none">
          {/* Header Banner */}
          <div className="relative h-36 sm:h-44 w-full bg-main-bg overflow-hidden border-b border-border">
            {coverSrc ? (
              <img
                src={coverSrc}
                alt={clubName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/25 via-surface to-main-bg flex items-center justify-center">
                <Shield size={64} className="text-accent/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </Dialog.Close>

            {/* Overlapping Club Avatar */}
            <div className="absolute -bottom-6 left-6 shadow-xl">
              <UserAvatar
                src={logo}
                name={clubName}
                size="xl"
                shape="squircle"
                className="border-4 border-surface shadow-lg"
              />
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 pt-10 space-y-6">
            {/* Title & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <Dialog.Title className="font-poppins font-black text-2xl text-text-main truncate" title={clubName}>
                  {clubName}
                </Dialog.Title>
                <Dialog.Description className="font-roboto text-xs text-text-muted flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-accent" />
                    <span>{location}</span>
                  </span>
                  <span>•</span>
                  <span>Joined: {new Date(club.joinedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </Dialog.Description>
              </div>

              {/* Club Badges */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface border border-border rounded-xl text-xs font-bold text-text-main shadow-xs">
                  {renderSportIcon()}
                  <span>{sportType}</span>
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-xs ${
                    club.role === 'Admin' || club.role === 'Owner'
                      ? 'bg-warning/10 text-warning border-warning/25'
                      : 'bg-accent/10 text-accent border-accent/25'
                  }`}
                >
                  <Crown size={12} />
                  <span>{club.role}</span>
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-main-bg/50 border border-border flex flex-col">
                <span className="text-[11px] font-roboto uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1">
                  <Users size={12} className="text-accent" /> Active Members
                </span>
                <span className="font-poppins font-black text-lg text-text-main mt-1">
                  {memberCount}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-main-bg/50 border border-border flex flex-col">
                <span className="text-[11px] font-roboto uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1">
                  <Bike size={12} className="text-info" /> Group Rides
                </span>
                <span className="font-poppins font-black text-lg text-text-main mt-1">
                  {groupRuns}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-main-bg/50 border border-border flex flex-col col-span-2 sm:col-span-1">
                <span className="text-[11px] font-roboto uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1">
                  {privacy.toLowerCase() === 'public' ? (
                    <Globe size={12} className="text-success" />
                  ) : (
                    <Lock size={12} className="text-warning" />
                  )}
                  Access
                </span>
                <span className="font-poppins font-black text-sm text-text-main mt-1.5 capitalize">
                  {privacy} Club
                </span>
              </div>
            </div>

            {/* Club Owner / Management Card */}
            {owner && (
              <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UserAvatar name={owner.fullName} size="md" shape="squircle" />
                  <div>
                    <p className="text-xs font-roboto text-text-muted uppercase font-semibold">Club Founder & Owner</p>
                    <p className="text-sm font-poppins font-bold text-text-main">{owner.fullName}</p>
                    <p className="text-xs font-roboto text-text-muted">{owner.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Description / Mission */}
            {profile?.description && (
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-1.5">
                <p className="text-xs font-roboto text-text-muted uppercase font-semibold">Club Mission & Bio</p>
                <p className="text-sm font-roboto text-text-main leading-relaxed">
                  {profile.description}
                </p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleOpenFullPage}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-poppins font-bold text-xs hover:brightness-105 transition-all shadow-sm cursor-pointer"
              >
                <span>Open Full Club Governance View</span>
                <ExternalLink size={13} />
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-surface border border-border text-text-main hover:bg-hover font-poppins text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
