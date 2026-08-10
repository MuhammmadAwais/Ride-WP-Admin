import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { 
  ChevronLeft, CheckCircle2, ShieldCheck, 
  Users, Activity, DollarSign, Calendar,
  UserCheck, Shield, Loader2, Trophy, Store, ShoppingBag, FileText, Tag, User, Navigation
} from 'lucide-react';

import { ClubDetailTabs } from '../components/ClubDetailTabs';
import { type TabId } from '../utils/constants';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { useGetClubByIdQuery, useGetClubsListQuery } from '../api/clubApi';
import type { ClubRide, ClubMember } from '../types/clubTypes';
import { SafeImage } from '@/Components/common/SafeImage';

export default function ClubDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clubId = Number(id) || 1;
  const [activeTab, setActiveTab] = useState<TabId>('rides');

  const { data: profileData, isLoading: profileLoading, isError: profileError } = useGetClubByIdQuery({ clubId });
  const { data: tabData, isFetching: tabFetching } = useGetClubByIdQuery({ clubId, tab: activeTab });
  const { data: clubsListData } = useGetClubsListQuery();
  const contentRef = useRef<HTMLDivElement>(null);

  // GSAP Animation for smooth content entry transitions
  useGSAP(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, scale: 0.98, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, [activeTab]);

  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-surface/50 border border-border rounded-2xl">
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
          owner: { id: 0, fullName: 'Unknown Owner', email: '' },
        }
      : undefined);

  const stats = profileData?.stats ?? {
    activeMembers: (profileData as any)?.members?.length ?? clubFromList?.participantCount ?? 0,
    groupRuns: 0,
    revenue: 0,
  };

  if (profileError || (!profileData && !clubFromList) || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-500/5 border border-red-500/20 rounded-2xl text-center p-8">
        <h3 className="text-text-main font-poppins font-semibold text-lg mb-1">Failed to load club details</h3>
        <p className="text-text-muted text-sm font-roboto mb-4">Could not retrieve information for Club #{id}.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-xl bg-accent text-white font-poppins text-sm font-medium hover:bg-accent/90"
        >
          Go Back
        </button>
      </div>
    );
  }

  const bannerImage = profile?.coverImage;
  const avatarImage = profile?.logo;

  return (
    <div className="flex flex-col space-y-8 pb-12 min-h-full">
      {/* Top Navigation */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-surface border border-border hover:bg-accent/10 transition-colors text-text-muted hover:text-accent"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-poppins font-bold text-2xl text-text-main tracking-tight">Club Details</h1>
      </div>

      {/* Fixed Header Profile Card (Upper Zone) */}
      <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-surface">
        {/* Banner */}
        <div className="h-48 sm:h-64 relative w-full overflow-hidden bg-surface">
          <SafeImage 
            src={bannerImage} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-90"
            fallback={<div className="w-full h-full bg-accent/20" />}
          />
          {/* Flat Minimalist Tint Overlay */}
          <div className="absolute inset-0 bg-black/25 z-10" />
        </div>

        {/* Profile Content */}
        <div className="relative z-30 px-6 sm:px-10 pb-8 -mt-20 flex flex-col xl:flex-row gap-8 items-start xl:items-end justify-between">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end w-full xl:w-auto">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-surface bg-surface overflow-hidden shadow-2xl relative shrink-0">
              <SafeImage
                src={avatarImage}
                alt="Avatar"
                className="w-full h-full object-cover"
                fallback={<Shield size={40} className="m-auto text-accent/30" />}
              />
              <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1 border-2 border-surface shadow-md">
                <CheckCircle2 size={16} className="text-white" />
              </div>
            </div>
            <div className="mb-2 w-full">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-text-main tracking-tight leading-tight">{profile?.clubName || 'Club Details'}</h2>
                <ShieldCheck size={28} className="text-blue-500 shrink-0" />
              </div>
              <p className="font-roboto text-text-muted text-sm flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <span className="flex items-center gap-1.5"><UserCheck size={16} /> Created by {profile?.owner?.fullName || 'N/A'}</span>
                <span className="flex items-center gap-1.5"><Calendar size={16} /> {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</span>
              </p>
            </div>
          </div>

          {/* Micro-analytics banner tracking */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 bg-surface/50 backdrop-blur-xl border border-border p-4 rounded-2xl w-full xl:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Users size={18} className="sm:size-[20px]" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">Active Members</p>
                <p className="font-bold text-lg sm:text-xl text-text-main">{stats.activeMembers}</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Activity size={18} className="sm:size-[20px]" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">Group Runs</p>
                <p className="font-bold text-lg sm:text-xl text-text-main">{stats.groupRuns}</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
                <DollarSign size={18} className="sm:size-[20px]" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">Revenue (PKR)</p>
                <p className="font-bold text-lg sm:text-xl text-text-main">{stats.revenue}</p>
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
          <div className="absolute inset-0 z-10 bg-surface/50 backdrop-blur-sm rounded-3xl flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-accent" />
          </div>
        )}
        {activeTab === 'rides' && <RidesTab rides={tabData?.rides || []} />}
        {activeTab === 'news' && <NewsTab news={tabData?.news || []} />}
        {activeTab === 'leaderboard' && <LeaderboardTab leaderboard={tabData?.leaderboard || []} />}
        {activeTab === 'shop' && <ShopTab shop={tabData?.shop || []} />}
        {activeTab === 'discount' && <DiscountTab discounts={tabData?.discounts || []} />}
        {activeTab === 'marketplace' && <MarketplaceTab marketplace={tabData?.marketplace || []} />}
        {activeTab === 'members' && <MembersTab members={tabData?.members || []} />}
      </div>
    </div>
  );
}

function RidesTab({ rides }: { rides: ClubRide[] }) {
  if (rides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-2xl p-8 text-center mt-6">
        <Navigation size={48} className="text-text-muted/30 mb-4" />
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-1">No Rides Scheduled</h3>
        <p className="text-text-muted font-roboto text-sm">This club hasn't hosted any rides yet.</p>
      </div>
    );
  }

  const columns: ColumnDef<ClubRide>[] = [
    { header: 'Ride Name', accessorKey: 'rideName' },
    { header: 'Route', accessorKey: (r) => `${r.meetingPoint} → ${r.endingPoint || 'TBD'}` },
    { header: 'Date & Time', accessorKey: (r) => `${new Date(r.date).toLocaleDateString()} ${new Date(`1970-01-01T${r.time}`).toLocaleTimeString()}`, sortKey: 'date' },
    { header: 'Participants', accessorKey: 'participantsCount' },
    { header: 'Pace', accessorKey: 'pace' },
    { header: 'Distance', accessorKey: 'distance' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main">Club Rides</h3>
          <p className="text-sm font-roboto text-text-muted mt-1">Manage and monitor all official club events.</p>
        </div>
      </div>
      <DataTable data={rides} columns={columns} keyExtractor={(r) => r.id.toString()} />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NewsTab({ news }: { news: any[] }) {
  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-2xl p-8 text-center mt-6">
        <FileText size={48} className="text-text-muted/30 mb-4" />
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-1">No News Available</h3>
        <p className="text-text-muted font-roboto text-sm">There are no news updates from this club.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main">Club News & Updates</h3>
          <p className="text-sm font-roboto text-text-muted mt-1">Latest announcements broadcasted to members.</p>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LeaderboardTab({ leaderboard }: { leaderboard: any[] }) {
  if (leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-2xl p-8 text-center mt-6">
        <Trophy size={48} className="text-text-muted/30 mb-4" />
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-1">No Leaderboard Data</h3>
        <p className="text-text-muted font-roboto text-sm">Leaderboard data is currently unavailable.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main">Leaderboard</h3>
          <p className="text-sm font-roboto text-text-muted mt-1">Top performing members of the club.</p>
        </div>
      </div>
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        {leaderboard.map((user, i) => (
          <div key={i} className={`flex items-center gap-4 p-5 ${i !== leaderboard.length - 1 ? 'border-b border-border' : ''} hover:bg-text-muted/5 transition-colors`}>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm shrink-0">
              #{user.rank || i + 1}
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-accent/10 border-2 border-surface shadow-sm shrink-0">
               <SafeImage src={user.avatar} alt={user.name} className="w-full h-full object-cover" fallback={<Users size={20} className="text-accent m-auto mt-3" />} />
            </div>
            <div className="flex-1">
              <h4 className="font-poppins font-bold text-text-main">{user.name || 'Unknown'}</h4>
              <p className="text-xs font-roboto text-text-muted">{user.distance || 0} km driven • {user.journeys || 0} journeys</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-lg font-bold text-accent">{user.points || 0}</span>
              <span className="text-xs text-text-muted ml-1 uppercase font-bold">PTS</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ShopTab({ shop }: { shop: any[] }) {
  if (shop.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-2xl p-8 text-center mt-6">
        <ShoppingBag size={48} className="text-text-muted/30 mb-4" />
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-1">Shop is Empty</h3>
        <p className="text-text-muted font-roboto text-sm">No items are available in the club shop.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main">Club Merch & Shop</h3>
          <p className="text-sm font-roboto text-text-muted mt-1">Official merchandise and equipment.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {shop.map((item, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border p-4 shadow-sm hover:border-accent/30 transition-all group">
            <div className="aspect-square rounded-xl bg-accent/5 overflow-hidden mb-4 relative">
              <SafeImage src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" fallback={<ShoppingBag size={32} className="m-auto mt-[40%] text-accent/30" />} />
              <div className="absolute top-2 right-2 px-2 py-1 bg-surface/90 backdrop-blur-sm rounded text-[10px] font-bold text-text-main shadow-sm border border-border">
                {item.stock || 0} in stock
              </div>
            </div>
            <h4 className="font-poppins font-bold text-text-main text-sm mb-1 leading-tight">{item.name || 'Unknown Item'}</h4>
            <p className="font-mono text-accent font-bold text-sm">Rs. {item.price || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DiscountTab({ discounts }: { discounts: any[] }) {
  if (discounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-2xl p-8 text-center mt-6">
        <Tag size={48} className="text-text-muted/30 mb-4" />
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-1">No Active Discounts</h3>
        <p className="text-text-muted font-roboto text-sm">There are no discount offers available for this club.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main">Partner Discounts</h3>
          <p className="text-sm font-roboto text-text-muted mt-1">Exclusive perks for club members.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {discounts.map((discount, i) => (
          <div key={i} className={`rounded-2xl p-5 border ${discount.isActive ? 'border-border bg-surface hover:border-accent/40 shadow-sm' : 'border-border/50 bg-surface/40 opacity-70'} transition-colors relative overflow-hidden group`}>
            {discount.isActive && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-full pointer-events-none" />}
            <div className="w-12 h-12 rounded-xl bg-text-muted/5 flex items-center justify-center mb-4 overflow-hidden shadow-sm">
               <SafeImage src={discount.logo} alt={discount.brand} className="w-full h-full object-cover" fallback={<Tag size={20} className="text-text-muted" />} />
            </div>
            <h4 className="font-poppins font-bold text-text-main text-sm mb-1 line-clamp-1">{discount.brand || 'Partner'}</h4>
            <p className="font-mono font-bold text-accent text-[13px] mb-3">{discount.deal || 'Discount Available'}</p>
            <div className="flex justify-between items-center mt-auto">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{discount.expiry || ''}</span>
              {!discount.isActive && <span className="px-2 py-0.5 rounded bg-text-muted/10 text-text-muted text-[10px] font-bold">EXPIRED</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MarketplaceTab({ marketplace }: { marketplace: any[] }) {
  if (marketplace.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-2xl p-8 text-center mt-6">
        <Store size={48} className="text-text-muted/30 mb-4" />
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-1">Marketplace Empty</h3>
        <p className="text-text-muted font-roboto text-sm">No P2P items are currently listed by members.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main">P2P Marketplace</h3>
          <p className="text-sm font-roboto text-text-muted mt-1">Items listed by members for sale/trade.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {marketplace.map((item, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all shadow-sm">
            <div className="w-24 h-24 rounded-xl bg-accent/5 overflow-hidden shrink-0 border border-border/50">
              <SafeImage src={item.image} alt={item.product} className="w-full h-full object-cover" fallback={<Store size={24} className="m-auto mt-8 text-accent/30" />} />
            </div>
            <div className="flex flex-col flex-1 py-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-poppins font-bold text-text-main text-sm line-clamp-1">{item.product || 'Unknown Product'}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${item.status === 'Available' ? 'bg-green-500/10 text-green-500' : 'bg-text-muted/10 text-text-muted'}`}>
                  {item.status || 'Available'}
                </span>
              </div>
              <p className="font-mono text-accent font-bold text-sm mb-3">Rs. {item.price || 0}</p>
              
              <div className="flex items-center gap-2 mt-auto">
                <div className="w-5 h-5 rounded-full overflow-hidden bg-text-muted/10">
                  <SafeImage src={item.sellerAvatar} alt={item.seller} className="w-full h-full object-cover" fallback={<User size={12} className="m-auto text-text-muted" />} />
                </div>
                <span className="text-xs font-roboto text-text-muted">Listed by <span className="font-medium text-text-main">{item.seller || 'Unknown'}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MembersTab({ members }: { members: ClubMember[] }) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-2xl p-8 text-center mt-6">
        <Users size={48} className="text-text-muted/30 mb-4" />
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-1">No Members Found</h3>
        <p className="text-text-muted font-roboto text-sm">There are no members listed in this club.</p>
      </div>
    );
  }
  const columns: ColumnDef<ClubMember>[] = [
    { 
      header: 'Member', 
      accessorKey: (m) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden border border-border shrink-0">
             <SafeImage src={m.avatar || ''} alt={m.name || 'Member'} className="w-full h-full object-cover" fallback={<User size={14} className="text-accent" />} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-text-main text-sm">{m.name || 'Unknown User'}</span>
            <span className="text-[11px] text-text-muted">{m.email || 'No email provided'}</span>
          </div>
        </div>
      ),
      sortKey: 'name'
    },
    { 
      header: 'Role', 
      accessorKey: (m) => (
        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
          m.role === 'Owner' || m.role === 'Admin' ? 'bg-accent/10 text-accent border border-accent/20' : 
          m.role === 'Mod' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
          'bg-surface border border-border text-text-muted'
        }`}>
          {m.role || 'Member'}
        </span>
      ),
      sortKey: 'role'
    },
    { header: 'Joined', accessorKey: 'joinedDate' }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12 mt-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-xl font-poppins font-bold text-text-main">Club Members</h3>
          <p className="text-sm font-roboto text-text-muted mt-1">Manage and view all enrolled members.</p>
        </div>
      </div>
      <DataTable data={members} columns={columns} keyExtractor={(m) => m.id.toString()} />
    </div>
  );
}
