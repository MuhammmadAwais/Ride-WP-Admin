import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ChevronLeft, User, TrendingUp, Star, Shield, Car, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
import { DetailTabs, type TabId } from '../components/DetailTabs';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { useGetUserByIdQuery } from '../api/userApi';
import type { UserRide, UserClub, UserListing, UserPurchase } from '../types/userTypes';
import { SafeImage } from '@/Components/common/SafeImage';
import { UserActionsMenu } from '../components/UserActionsMenu';
import { ROUTES } from '@/Constants';

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = Number(id) || 1;
  const { data, isLoading, isError } = useGetUserByIdQuery({ userId });

  const [activeTab, setActiveTab] = useState<TabId>('rides');
  const tabContentRef = useRef<HTMLDivElement>(null);

  // GSAP Animation for Tab Content Switching
  useGSAP(() => {
    if (!tabContentRef.current) return;
    
    gsap.fromTo(tabContentRef.current, 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-surface/50 border border-border rounded-2xl">
        <Loader2 size={36} className="animate-spin text-accent mb-3" />
        <p className="text-text-muted text-sm font-roboto">Loading user details...</p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = data?.profile ?? ((data as any)?.fullName ? (data as any) : undefined);

  if (isError || !data || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-500/5 border border-red-500/20 rounded-2xl text-center p-8">
        <h3 className="text-text-main font-poppins font-semibold text-lg mb-1">Failed to load user details</h3>
        <p className="text-text-muted text-sm font-roboto mb-4">Could not retrieve information for User #{id}.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-xl bg-accent text-white font-poppins text-sm font-medium hover:bg-accent/90"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 pb-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-surface border border-border hover:bg-accent/10 transition-colors text-text-muted hover:text-accent"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="font-poppins font-bold text-2xl text-text-main tracking-tight">User Details</h1>
        </div>

        <div className="flex items-center gap-3">
          <UserActionsMenu
            userId={userId}
            isSuspended={user?.isSuspended}
            userName={user?.fullName}
            onDeleteSuccess={() => navigate(ROUTES.USERS, { replace: true })}
          />
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full shrink-0 bg-accent/5 flex items-center justify-center border-4 border-border overflow-hidden">
          <SafeImage
            src={user?.profileImage}
            alt={user?.fullName || 'User'}
            className="w-full h-full object-cover"
            fallback={<User size={48} className="text-accent/30" />}
          />
        </div>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Name of User</p>
            <p className="text-text-main font-semibold font-poppins text-lg">{user?.fullName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Status</p>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                user?.isSuspended
                  ? 'bg-red-500/10 text-red-500 border-red-500/20'
                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  user?.isSuspended ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              />
              {user?.isSuspended ? 'Suspended' : 'Active'}
            </span>
          </div>
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Subscription</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              user?.subscriptionPlan === 'Diamond' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
              user?.subscriptionPlan === 'Gold' ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' :
              'bg-gray-500/10 text-gray-500 border border-gray-500/20'
            }`}>
              {user?.subscriptionPlan || 'Free'}
            </span>
          </div>
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Phone number</p>
            <p className="text-text-main font-roboto">{user?.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Start/End Date</p>
            <p className="text-text-main font-roboto text-sm">
              {user?.startDate ? new Date(user.startDate).toLocaleDateString() : 'N/A'} — {user?.endDate ? new Date(user.endDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Email</p>
            <p className="text-text-main font-roboto">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Clubs Joined</p>
            <p className="text-text-main font-roboto font-medium">{user?.clubsJoined ?? 0}</p>
          </div>
        </div>
      </div>

      {/* User Stats Card */}
      {data.stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-border bg-surface shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <Car size={24} />
            </div>
            <div>
              <p className="text-text-muted text-xs font-poppins uppercase tracking-wider">Total Rides</p>
              <p className="text-text-main font-poppins font-bold text-xl mt-0.5">{data.stats.totalRides}</p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-surface shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-text-muted text-xs font-poppins uppercase tracking-wider">Distance Covered</p>
              <p className="text-text-main font-poppins font-bold text-xl mt-0.5">{data.stats.distanceCovered}</p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-surface shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
              <Star size={24} />
            </div>
            <div>
              <p className="text-text-muted text-xs font-poppins uppercase tracking-wider">Reputation</p>
              <p className="text-text-main font-poppins font-bold text-xl mt-0.5">{data.stats.userReputation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Information Matrix */}
      <div className="flex flex-col space-y-6 mt-4">
        <DetailTabs activeTab={activeTab} onChange={setActiveTab} />

        <div ref={tabContentRef} className="min-h-[400px]">
          {activeTab === 'rides' && <RidesTabContent rides={data.rides || []} />}
          {activeTab === 'clubs' && <ClubsTabContent clubs={data.clubs || []} />}
          {activeTab === 'listings' && <ListingsTabContent listings={data.listings || []} />}
          {activeTab === 'purchases' && <PurchasesTabContent purchases={data.purchases || []} />}
        </div>
      </div>
    </div>
  );
}

// ─── Tab Contents ────────────────────────────────────────────────────────────

function RidesTabContent({ rides }: { rides: UserRide[] }) {
  const columns: ColumnDef<UserRide>[] = [
    { header: 'Date & Time', accessorKey: (r) => `${new Date(r.dateTime).toLocaleDateString()} ${new Date(r.dateTime).toLocaleTimeString()}`, sortKey: 'dateTime' },
    { header: 'Route', accessorKey: 'route' },
    { header: 'Club/Host Name', accessorKey: 'hostName' },
    { header: 'Pace', accessorKey: 'pace' },
    { header: 'Distance', accessorKey: 'distance' },
    { header: 'Status', accessorKey: (r) => (
      <div className="flex items-center gap-1.5">
        {r.status === 'Completed' && <CheckCircle2 size={14} className="text-green-400" />}
        {r.status === 'Upcoming' && <Clock size={14} className="text-yellow-400" />}
        {r.status === 'Cancelled' && <XCircle size={14} className="text-red-400" />}
        <span className={
          r.status === 'Completed' ? 'text-green-400' :
          r.status === 'Upcoming' ? 'text-yellow-400' : 'text-red-400'
        }>{r.status}</span>
      </div>
    ), sortKey: 'status' }
  ];

  return (
    <div className="flex flex-col space-y-8 pb-10">
      {/* Ride Participation Summary Card (from Image 2) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {rides.slice(0, 1).map((ride) => (
          <div key={ride.id} className="rounded-[32px] p-6 sm:p-8 bg-surface border border-border shadow-md relative overflow-hidden group">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-poppins font-bold text-text-main mb-2">{ride.route?.split('→')[0].trim() || 'Unknown'} Ride</h3>
                <div className="space-y-1">
                  <p className="text-sm sm:text-[15px] text-text-muted font-roboto flex items-center gap-2">
                    <Clock size={16} className="text-accent/60" /> {new Date(ride.dateTime).toLocaleString()}
                  </p>
                  <p className="text-sm sm:text-[15px] text-text-muted font-roboto flex items-center gap-2">
                    <Star size={16} className="text-accent/60" /> {ride.hostName}
                  </p>
                </div>
              </div>
              {ride.gpxFile && (
                <div className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg shadow-blue-600/20">
                  GPX
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-text-muted/5 dark:bg-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center group-hover:bg-accent/5 transition-colors border border-border/50 sm:border-0">
                <p className="text-lg sm:text-xl font-bold text-text-main mb-1">{ride.pace || 'N/A'}</p>
                <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">Pace</p>
              </div>
              <div className="bg-text-muted/5 dark:bg-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center group-hover:bg-accent/5 transition-colors border border-border/50 sm:border-0">
                <p className="text-lg sm:text-xl font-bold text-text-main mb-1">{ride.distance || 'N/A'}</p>
                <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">Distance</p>
              </div>
              <div className="bg-text-muted/5 dark:bg-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center group-hover:bg-accent/5 transition-colors border border-border/50 sm:border-0">
                <p className="text-lg sm:text-xl font-bold text-text-main mb-1">{ride.participantsCount || 0}</p>
                <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">Participants</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-xl p-5 border border-border bg-surface flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm font-poppins mb-1">Total Rides</p>
            <p className="text-3xl font-bold text-text-main font-roboto">124</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="rounded-xl p-5 border border-border bg-surface flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm font-poppins mb-1">Distance Covered</p>
            <p className="text-3xl font-bold text-text-main font-roboto">1,240 <span className="text-lg text-text-muted font-normal">km</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Car size={24} />
          </div>
        </div>
        <div className="rounded-xl p-5 border border-border bg-surface flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm font-poppins mb-1">User Reputation</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-text-main font-roboto">4.8</p>
              <p className="text-sm text-text-muted mb-1">/ 5.0</p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">
            <Star size={24} fill="currentColor" />
          </div>
        </div>
      </div>
      
      <DataTable data={rides} columns={columns} keyExtractor={(r) => r.id.toString()} />
    </div>
  );
}

function ClubsTabContent({ clubs }: { clubs: UserClub[] }) {
  if (clubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-2xl p-8 text-center">
        <Shield size={48} className="text-text-muted/30 mb-4" />
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-1">No Clubs Joined</h3>
        <p className="text-text-muted font-roboto text-sm">This user hasn't joined any clubs yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clubs.map((club) => (
        <div key={club.id} className="relative rounded-2xl overflow-hidden bg-surface border border-border group hover:border-accent/30 transition-all shadow-sm">
          <div className="h-24 bg-accent/10 relative">
             <div className="absolute inset-0 backdrop-blur-sm bg-white/5"></div>
          </div>
          <div className="px-5 pb-5 relative -mt-8">
            <div className="w-16 h-16 rounded-xl bg-surface border-4 border-surface flex items-center justify-center mb-3 shadow-lg overflow-hidden">
              <SafeImage
                src={null} // No image field in UserClub yet based on current API return
                alt={club.clubName}
                className="w-full h-full object-cover"
                fallback={<Shield size={24} className="text-accent" />}
              />
            </div>
            <h3 className="font-poppins font-semibold text-lg text-text-main mb-1">{club.clubName}</h3>
            <p className="font-roboto text-sm text-text-muted mb-4">{club.memberCount}</p>
            
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className={`px-2 py-1 rounded text-xs font-bold ${club.role === 'Admin' || club.role === 'Owner' ? 'bg-accent/10 text-accent' : 'bg-text-muted/10 text-text-muted'}`}>
                {club.role}
              </span>
              <span className="font-roboto text-xs text-text-muted/60 tracking-tight">Joined {new Date(club.joinedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListingsTabContent({ listings }: { listings: UserListing[] }) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-2xl p-8 text-center mt-6">
        <Car size={48} className="text-text-muted/30 mb-4" />
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-1">No Active Listings</h3>
        <p className="text-text-muted font-roboto text-sm">This user hasn't posted any listings.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-2">
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-6">User Listings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listings.map((v) => (
            <div key={v.id} className="flex items-center gap-4 p-4 rounded-2xl bg-text-muted/5 border border-border group hover:border-accent/30 transition-all">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
                <SafeImage src={v.image} alt={v.productName} fallback={<Car size={24} className="text-accent" />} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-poppins font-semibold text-text-main line-clamp-1">{v.productName}</h4>
                <p className="font-roboto text-sm text-text-muted capitalize">{v.condition}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${v.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {v.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {v.isSoldOut && <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-text-muted/10 text-text-muted">Sold Out</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="px-3 py-1.5 bg-surface rounded-lg border border-border font-mono text-[13px] font-bold text-accent shadow-sm">
                  Rs. {v.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PurchasesTabContent({ purchases }: { purchases: UserPurchase[] }) {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-2xl p-8 text-center mt-6">
        <TrendingUp size={48} className="text-text-muted/30 mb-4" />
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-1">No Purchases Found</h3>
        <p className="text-text-muted font-roboto text-sm">This user hasn't made any transactions yet.</p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<any>[] = [
    {
      header: 'Item',
      accessorKey: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/5 border border-border overflow-hidden shrink-0">
            <SafeImage
              src={r.itemImage}
              alt={r.type || 'Item'}
              className="w-full h-full object-cover"
              fallback={<TrendingUp size={18} className="m-auto text-accent/30" />}
            />
          </div>
          <span className="font-medium text-text-main">{r.type || 'Unknown Type'}</span>
        </div>
      ),
      sortable: false,
    },
    { header: 'Transaction ID', accessorKey: 'id' },
    { header: 'Date/Time', accessorKey: 'dateTime' },
    { header: 'Amount', accessorKey: (r) => <span className="font-bold text-accent">{r.amount || 'N/A'}</span>, sortKey: 'amount' },
    { header: 'Method', accessorKey: 'method' },
    { header: 'Status', accessorKey: (r) => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-tight ${
        r.status === 'Success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
        r.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' :
        'bg-red-500/10 text-red-600 border border-red-500/20'
      }`}>
        {r.status || 'Pending'}
      </span>
    ), sortKey: 'status' }
  ];

  return (
    <div className="pb-12">
      <DataTable data={purchases} columns={columns} keyExtractor={(r) => r.id.toString()} />
    </div>
  );
}
