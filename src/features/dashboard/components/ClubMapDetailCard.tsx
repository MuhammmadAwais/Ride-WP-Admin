/**
 * @fileoverview Premium Club Details Card displayed when a club pin is clicked on Google Maps.
 * Automatically fetches comprehensive club details via useGetClubByIdQuery to resolve
 * high-resolution cover banner, club avatar, privacy/visibility badges, member metrics,
 * organizer attribution, and navigation action to the full club profile.
 */
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  MapPin,
  Globe,
  Lock,
  ExternalLink,
  UserCheck,
  Sparkles,
  Bike,
  Loader2,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGetClubByIdQuery } from '@/features/clubs/api/clubApi';
import type { ClubListItem } from '@/features/clubs/types/clubTypes';
import { SafeImage } from '@/Components/common/SafeImage';
import { ROUTES } from '@/Constants';

interface ClubMapDetailCardProps {
  club: ClubListItem;
  onClose: () => void;
}

export const ClubMapDetailCard: React.FC<ClubMapDetailCardProps> = ({ club, onClose }) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch full club details to get high-resolution banner/coverImage, accurate members, and live metadata
  const { data: detailData, isLoading: isDetailLoading } = useGetClubByIdQuery(
    { clubId: club.id },
    { skip: !club.id }
  );

  const profile = detailData?.profile;
  const stats = detailData?.stats;

  // Resolve cover image from detail profile first, or fallback to list item
  const bannerImage =
    profile?.coverImage ??
    (profile as any)?.cover_image ??
    (profile as any)?.cover ??
    (profile as any)?.bannerImage ??
    (profile as any)?.banner ??
    (profile as any)?.coverPhoto ??
    club.coverImage ??
    (club as any)?.cover_image;

  // Resolve dynamic fields with fallback to list item
  const clubName = profile?.clubName || club.clubName;
  const logoImage = profile?.logo ?? club.logo;
  const locationText = profile?.location || club.location || 'Global Headquarters';
  const discipline = profile?.clubTypeName || club.clubTypeName || 'Cycling';
  const isPrivate = ((profile?.clubPrivacyName || club.clubPrivacyName) || '').toLowerCase() === 'private';
  const memberCount = stats?.activeMembers ?? club.participantCount ?? 0;
  const establishedYear = (profile?.createdAt || club.createdAt)
    ? new Date(profile?.createdAt || club.createdAt).getFullYear()
    : 2026;
  const ownerName = profile?.owner?.fullName || club.owner?.fullName;

  // GSAP Entrance
  useGSAP(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.4)' }
      );
    }
  }, [club.id]);

  const handleClose = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 0.92,
        opacity: 0,
        y: 10,
        duration: 0.2,
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={cardRef}
      className="absolute bottom-5 left-4 right-4 sm:right-auto sm:left-6 sm:w-[380px] bg-surface/95 backdrop-blur-2xl border border-border/80 rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.35)] overflow-hidden z-30 pointer-events-auto"
    >
      {/* ── Banner Image Header ────────────────────────────────────────────── */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-main-bg">
        {isDetailLoading && !bannerImage ? (
          <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(#EB712B_1px,transparent_1px)] [background-size:16px_16px] opacity-15 animate-pulse" />
            <Loader2 size={24} className="animate-spin text-accent/50 z-10" />
          </div>
        ) : (
          <SafeImage
            src={bannerImage}
            alt={clubName}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            fallback={
              <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(#EB712B_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-accent/10" />
                <Bike size={44} className="text-accent/35" />
              </div>
            }
          />
        )}

        {/* Dynamic Gradient Overlay for contrast with floating tags & close button */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-black/25 to-black/60 pointer-events-none" />

        {/* Top Badges & Close Button */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {/* Category Tag */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-poppins font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-sm">
            <Sparkles size={11} className="text-accent" />
            <span>{discipline}</span>
          </span>

          <div className="flex items-center gap-2">
            {/* Privacy Pill */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-poppins font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm ${
                isPrivate
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {isPrivate ? <Lock size={11} /> : <Globe size={11} />}
              <span>{isPrivate ? 'Private' : 'Public'}</span>
            </span>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
              aria-label="Close club card"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content Body ────────────────────────────────────────────────────── */}
      <div className="p-5 pt-0">
        {/* Overlapping Avatar & Identity Header */}
        <div className="flex items-end gap-3.5 -mt-8 mb-3 relative z-10">
          <div className="w-16 h-16 rounded-2xl border-4 border-surface shadow-xl overflow-hidden bg-main-bg shrink-0">
            <SafeImage
              src={logoImage}
              alt={clubName}
              className="w-full h-full object-cover"
              fallback={
                <div className="w-full h-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center text-accent font-poppins font-bold text-xl">
                  {clubName.charAt(0).toUpperCase()}
                </div>
              }
            />
          </div>

          <div className="min-w-0 pb-1">
            <h3 className="font-poppins font-bold text-base sm:text-lg text-text-main truncate leading-tight">
              {clubName}
            </h3>
            {ownerName && (
              <p className="font-roboto text-xs text-text-muted flex items-center gap-1 mt-0.5">
                <UserCheck size={12} className="text-accent shrink-0" />
                <span className="truncate">Led by {ownerName}</span>
              </p>
            )}
          </div>
        </div>

        {/* Location Row */}
        <div className="flex items-start gap-2 text-xs font-roboto text-text-muted bg-main-bg/50 border border-border/60 rounded-xl p-2.5 mb-3">
          <MapPin size={14} className="text-accent shrink-0 mt-0.5" />
          <span className="line-clamp-2 leading-relaxed text-text-main/90">
            {locationText}
          </span>
        </div>

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-main-bg/70 border border-border/60 text-center mb-4">
          <div className="p-1">
            <span className="text-[10px] font-poppins font-semibold text-text-muted uppercase tracking-wider block">
              Members
            </span>
            <span className="font-poppins font-bold text-sm text-text-main mt-0.5 block">
              {memberCount}
            </span>
          </div>

          <div className="p-1 border-x border-border/60">
            <span className="text-[10px] font-poppins font-semibold text-text-muted uppercase tracking-wider block">
              Discipline
            </span>
            <span className="font-poppins font-bold text-sm text-accent mt-0.5 truncate block">
              {discipline}
            </span>
          </div>

          <div className="p-1">
            <span className="text-[10px] font-poppins font-semibold text-text-muted uppercase tracking-wider block">
              Est. Year
            </span>
            <span className="font-poppins font-bold text-sm text-text-main mt-0.5 block">
              {establishedYear}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate(`${ROUTES.CLUBS}/${club.id}`)}
          className="w-full py-3 px-4 rounded-xl bg-accent text-white font-poppins font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-accent/90 shadow-[0_8px_20px_-4px_rgba(235,113,43,0.5)] hover:scale-[1.02] transition-all cursor-pointer"
        >
          <span>Inspect Club</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

export default ClubMapDetailCard;
