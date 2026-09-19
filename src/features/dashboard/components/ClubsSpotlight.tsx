import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, ArrowRight, Shield, Globe, Award, Sparkles } from 'lucide-react';
import { useGetClubsListQuery } from '@/features/clubs/api/clubApi';
import { SafeImage } from '@/Components/common/SafeImage';

export default function ClubsSpotlight() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetClubsListQuery({ limit: 6 });

  const clubs = data?.clubs || [];
  const totalCount = data?.pagination?.total ?? clubs.length;

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EB712B]" />
            <h3 className="font-poppins font-bold text-text-main text-lg tracking-tight">
              Active Club Ecosystem
            </h3>
          </div>
          <p className="font-roboto text-text-muted text-xs mt-0.5">
            Spotlight on top cycling chapters, running teams, and community hubs
          </p>
        </div>

        <button
          onClick={() => navigate('/clubs')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#EB712B] hover:text-[#d45e1d] transition-colors self-start sm:self-auto group"
        >
          <span>Explore All {totalCount > 0 ? `(${totalCount})` : 'Clubs'}</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid of Clubs */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-main-bg/40 border border-border rounded-2xl p-4 h-[160px] animate-pulse flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-border/60 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-border/60 rounded w-3/4" />
                  <div className="h-3 bg-border/40 rounded w-1/2" />
                </div>
              </div>
              <div className="h-8 bg-border/40 rounded-xl" />
            </div>
          ))}
        </div>
      ) : isError || clubs.length === 0 ? (
        <div className="text-center py-10 bg-main-bg/20 rounded-2xl border border-dashed border-border p-6">
          <Award className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-50" />
          <p className="font-poppins font-semibold text-text-main text-sm">No Clubs Registered Yet</p>
          <p className="font-roboto text-text-muted text-xs mt-1">
            New community clubs will appear here dynamically as athletes register.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((club) => {
            const memberCount = club.participantCount ?? 0;
            const isPrivate = club.clubPrivacyName?.toLowerCase() === 'private';
            const clubAvatar = club.logo || club.coverImage || undefined;
            const location = club.location || 'Global';
            const category = club.clubTypeName || 'Cycling & Run';
            const clubName = club.clubName || `Club #${club.id}`;

            return (
              <div
                key={club.id}
                onClick={() => navigate(`/clubs/${club.id}`)}
                className="group bg-main-bg/30 hover:bg-main-bg/70 border border-border/80 hover:border-[#EB712B]/60 rounded-2xl p-4.5 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-md relative overflow-hidden"
              >
                {/* Accent Top Border Glow */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#EB712B]/0 to-transparent group-hover:via-[#EB712B] transition-all duration-500" />

                <div>
                  <div className="flex items-start gap-3.5">
                    {/* Club Logo / Avatar */}
                    <SafeImage
                      src={clubAvatar}
                      alt={clubName}
                      className="w-12 h-12 rounded-2xl object-cover border border-border shrink-0 group-hover:scale-105 transition-transform duration-300"
                      fallback={
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EB712B]/20 to-[#EB712B]/5 border border-[#EB712B]/30 flex items-center justify-center font-poppins font-bold text-base text-[#EB712B] shrink-0 group-hover:scale-105 transition-transform">
                          {clubName.charAt(0).toUpperCase()}
                        </div>
                      }
                    />

                    {/* Club Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-poppins font-bold text-sm text-text-main truncate group-hover:text-[#EB712B] transition-colors">
                          {clubName}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 text-text-muted text-[11px] font-roboto mt-0.5">
                        <MapPin size={11} className="text-[#EB712B] shrink-0" />
                        <span className="truncate">{location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#EB712B]/10 text-[#EB712B] text-[10px] font-bold tracking-tight">
                      <Sparkles size={10} />
                      {category}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface border border-border text-text-muted text-[10px] font-medium">
                      {isPrivate ? (
                        <>
                          <Shield size={10} className="text-amber-500" />
                          Private
                        </>
                      ) : (
                        <>
                          <Globe size={10} className="text-blue-500" />
                          Public
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Footer stats */}
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-text-muted text-xs font-roboto">
                    <Users size={12} className="text-text-muted/70" />
                    <span>
                      <strong className="text-text-main font-semibold">{memberCount}</strong> members
                    </span>
                  </div>

                  <span className="font-poppins text-[11px] font-bold text-[#EB712B] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Inspect Club →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
