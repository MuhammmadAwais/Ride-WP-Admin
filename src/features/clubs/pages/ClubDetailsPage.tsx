import { useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { 
  ChevronLeft, CheckCircle2, ShieldCheck, 
  Users, Activity, DollarSign, Calendar,
  UserCheck, Shield, Loader2, MapPin, Globe, Bike
} from 'lucide-react';

import { ClubDetailTabs } from '../components/ClubDetailTabs';
import { type TabId } from '../utils/constants';
import { useGetClubByIdQuery, useGetClubsListQuery } from '../api/clubApi';
import { SafeImage } from '@/Components/common/SafeImage';
import { UserAvatar } from '@/Components/common/UserAvatar';
import { ClubActionsMenu } from '../components/ClubActionsMenu';
import { ROUTES } from '@/Constants';

// Modular Tab Components
import { ClubRidesTab } from '../components/tabs/ClubRidesTab';
import { ClubNewsTab } from '../components/tabs/ClubNewsTab';
import { ClubLeaderboardTab } from '../components/tabs/ClubLeaderboardTab';
import { ClubShopTab } from '../components/tabs/ClubShopTab';
import { ClubDiscountsTab } from '../components/tabs/ClubDiscountsTab';
import { ClubMarketplaceTab } from '../components/tabs/ClubMarketplaceTab';
import { ClubMembersTab } from '../components/tabs/ClubMembersTab';

export default function ClubDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clubId = Number(id) || 1;
  const [activeTab, setActiveTab] = useState<TabId>('rides');

  const { data: profileData, isLoading: profileLoading, isError: profileError } = useGetClubByIdQuery({ clubId });
  const { data: tabData, isFetching: tabFetching } = useGetClubByIdQuery({ clubId, tab: activeTab });
  const { data: clubsListData } = useGetClubsListQuery();
  const contentRef = useRef<HTMLDivElement>(null);

  // GSAP Animation for smooth content entry transitions across tabs
  useGSAP(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current, 
        { opacity: 0, scale: 0.99, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, [activeTab]);

  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-surface border border-border rounded-3xl">
        <Loader2 size={36} className="animate-spin text-accent mb-3" />
        <p className="text-text-muted text-sm font-roboto">Loading club details...</p>
      </div>
    );
  }

  const clubFromList = clubsListData?.clubs?.find((c) => c.id === clubId);

  const profile =
    profileData?.profile ??
    ((profileData as any)?.clubName ? (profileData as any) : undefined) ??
    (clubFromList
      ? {
          id: clubFromList.id,
          clubName: clubFromList.clubName,
          logo: clubFromList.logo,
          coverImage: clubFromList.coverImage,
          location: clubFromList.location,
          description: 'Active Riding Club',
          clubPrivacyName: clubFromList.clubPrivacyName,
          clubTypeName: clubFromList.clubTypeName,
          createdAt: clubFromList.createdAt,
          isSuspended: clubFromList.isSuspended,
          owner: clubFromList.owner,
        }
      : undefined) ??
    (profileData
      ? {
          id: clubId,
          clubName: `Club #${clubId}`,
          logo: null,
          coverImage: null,
          location: 'N/A',
          description: 'Active Riding Club',
          clubPrivacyName: 'Public',
          clubTypeName: 'Cycling',
          createdAt: new Date().toISOString(),
          isSuspended: false,
          owner: { id: 0, fullName: 'Unknown Owner', email: '' },
        }
      : undefined);

  const stats = profileData?.stats ?? {
    activeMembers: (profileData as any)?.members?.length ?? clubFromList?.participantCount ?? 0,
    groupRuns: profileData?.rides?.length ?? 0,
    revenue: 0,
  };

  if (profileError || (!profileData && !clubFromList) || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-error/5 border border-error/20 rounded-3xl text-center p-8">
        <h3 className="text-text-main font-poppins font-semibold text-lg mb-1">Failed to load club details</h3>
        <p className="text-text-muted text-sm font-roboto mb-4">Could not retrieve information for Club #{id}.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-xl bg-accent text-white font-poppins text-sm font-medium hover:bg-accent/90 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const bannerImage = profile?.coverImage;
  const avatarImage = profile?.logo;
  const ownerId = profile?.owner?.id;

  return (
    <div className="flex flex-col space-y-8 pb-12 min-h-full">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-2xl bg-surface border border-border hover:bg-accent/10 transition-colors text-text-muted hover:text-accent cursor-pointer"
            title="Go Back"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-poppins font-bold text-2xl text-text-main tracking-tight">Club Governance</h1>
            <p className="font-roboto text-xs text-text-muted mt-0.5">
              Comprehensive club inspection, athlete rosters, and performance control.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ClubActionsMenu
            clubId={clubId}
            isSuspended={profile?.isSuspended}
            clubName={profile?.clubName}
            onDeleteSuccess={() => navigate(ROUTES.CLUBS, { replace: true })}
          />
        </div>
      </div>

      {/* Fixed Header Profile Card (Upper Zone) */}
      <div className="relative rounded-[32px] overflow-hidden border border-border shadow-2xl bg-surface">
        {/* Banner Cover */}
        <div className="h-48 sm:h-64 relative w-full overflow-hidden bg-main-bg">
          <SafeImage 
            src={bannerImage} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-90"
            fallback={<div className="w-full h-full bg-gradient-to-r from-accent/20 via-surface to-main-bg" />}
          />
          {/* Subtle Contrast Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-black/20 to-transparent z-10" />
        </div>

        {/* Profile Content */}
        <div className="relative z-30 px-6 sm:px-10 pb-8 -mt-20 flex flex-col xl:flex-row gap-8 items-start xl:items-end justify-between">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end w-full xl:w-auto">
            {/* Club Logo Avatar */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl border-4 border-surface bg-surface overflow-hidden shadow-2xl relative shrink-0">
              <SafeImage
                src={avatarImage}
                alt={profile?.clubName || 'Club Logo'}
                className="w-full h-full object-cover"
                fallback={
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-surface flex items-center justify-center text-accent">
                    <Shield size={44} />
                  </div>
                }
              />
              <div className="absolute bottom-2 right-2 bg-info rounded-full p-1 border-2 border-surface shadow-md">
                <CheckCircle2 size={14} className="text-white" />
              </div>
            </div>

            {/* Club Identity & Metadata */}
            <div className="mb-2 w-full">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="font-poppins font-black text-2xl sm:text-4xl text-text-main tracking-tight leading-tight">
                  {profile?.clubName || 'Club Details'}
                </h2>
                <ShieldCheck size={26} className="text-info shrink-0" />
                
                {/* Status Badge */}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-poppins font-bold border ${
                    profile?.isSuspended
                      ? 'bg-error/10 text-error border-error/20'
                      : 'bg-success/10 text-success border-success/20'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      profile?.isSuspended ? 'bg-error' : 'bg-success'
                    }`}
                  />
                  {profile?.isSuspended ? 'Suspended' : 'Active Club'}
                </span>

                {/* Sport Type Badge */}
                {profile?.clubTypeName && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-poppins font-semibold bg-accent/10 text-accent border border-accent/20">
                    <Bike size={12} />
                    {profile.clubTypeName}
                  </span>
                )}

                {/* Privacy Badge */}
                {profile?.clubPrivacyName && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-roboto font-medium bg-surface border border-border text-text-muted">
                    <Globe size={12} />
                    {profile.clubPrivacyName}
                  </span>
                )}
              </div>

              {/* Founder and Location Metadata */}
              <div className="font-roboto text-text-muted text-xs sm:text-sm flex flex-wrap items-center gap-x-5 gap-y-1.5">
                <span className="flex items-center gap-1.5">
                  <UserCheck size={15} className="text-accent" /> 
                  Founded by{' '}
                  {ownerId ? (
                    <Link
                      to={`/users/${ownerId}`}
                      className="font-bold text-text-main hover:text-accent transition-colors underline decoration-dotted underline-offset-2"
                    >
                      {profile?.owner?.fullName || 'Club Founder'}
                    </Link>
                  ) : (
                    <strong className="font-bold text-text-main">
                      {profile?.owner?.fullName || 'Club Founder'}
                    </strong>
                  )}
                </span>

                {profile?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-accent" />
                    {profile.location}
                  </span>
                )}

                <span className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-accent" /> 
                  Formed {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Micro-analytics KPI Cards */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 bg-surface/70 backdrop-blur-xl border border-border p-4 rounded-3xl w-full xl:w-auto shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-poppins font-bold text-text-muted uppercase tracking-wider">Active Athletes</p>
                <p className="font-poppins font-black text-xl text-text-main">{stats.activeMembers}</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-border" />

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center text-success shrink-0">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-[10px] font-poppins font-bold text-text-muted uppercase tracking-wider">Group Runs</p>
                <p className="font-poppins font-black text-xl text-text-main">{stats.groupRuns}</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-border" />

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning shrink-0">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-[10px] font-poppins font-bold text-text-muted uppercase tracking-wider">Revenue (EUR)</p>
                <p className="font-poppins font-black text-xl text-text-main">
                  €{Number(stats.revenue || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Slide-Switcher */}
      <ClubDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Functional Sub-Suites (Lower Zone) */}
      <div ref={contentRef} className="min-h-[500px] relative">
        {tabFetching && (
          <div className="absolute inset-0 z-10 bg-surface/60 backdrop-blur-sm rounded-3xl flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-accent" />
          </div>
        )}
        {activeTab === 'rides' && <ClubRidesTab rides={tabData?.rides || []} />}
        {activeTab === 'news' && <ClubNewsTab news={tabData?.news || []} />}
        {activeTab === 'leaderboard' && <ClubLeaderboardTab leaderboard={tabData?.leaderboard || []} />}
        {activeTab === 'shop' && <ClubShopTab shop={tabData?.shop || []} />}
        {activeTab === 'discount' && <ClubDiscountsTab discounts={tabData?.discounts || []} />}
        {activeTab === 'marketplace' && <ClubMarketplaceTab marketplace={tabData?.marketplace || []} />}
        {activeTab === 'members' && (
          <ClubMembersTab members={tabData?.members || []} ownerId={profile?.owner?.id} />
        )}
      </div>
    </div>
  );
}
