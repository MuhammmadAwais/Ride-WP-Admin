import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  ChevronLeft,
  Mail,
  Phone,
  Shield,
  Bike,
  TrendingUp,
  Star,
  Download,
  ExternalLink,
  Crown,
  Package,
  Receipt,
  Loader2,
  Users,
  MapPin,
  Clock,
  Eye,
} from 'lucide-react';
import { DetailTabs, type TabId } from '../components/DetailTabs';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { useGetUserByIdQuery } from '../api/userApi';
import type { UserRide, UserClub, UserListing, UserPurchase } from '../types/userTypes';
import { UserActionsMenu } from '../components/UserActionsMenu';
import { UserAvatar } from '@/Components/common/UserAvatar';
import { SafeImage } from '@/Components/common/SafeImage';
import { RideDetailModal } from '../components/RideDetailModal';
import { ListingDetailModal } from '../components/ListingDetailModal';
import { ClubDetailModal } from '../components/ClubDetailModal';
import { UserClubCard } from '../components/UserClubCard';
import { ROUTES } from '@/Constants';

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = Number(id) || 1;
  const { data, isLoading, isError } = useGetUserByIdQuery({ userId });

  const [activeTab, setActiveTab] = useState<TabId>('rides');
  const tabContentRef = useRef<HTMLDivElement>(null);

  // Inspection modals state
  const [selectedRide, setSelectedRide] = useState<UserRide | null>(null);
  const [selectedListing, setSelectedListing] = useState<UserListing | null>(null);
  const [selectedClub, setSelectedClub] = useState<UserClub | null>(null);

  // GSAP Animation for Tab Content Switching
  useGSAP(() => {
    if (!tabContentRef.current) return;

    gsap.fromTo(
      tabContentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] bg-surface/50 border border-border rounded-3xl">
        <Loader2 size={40} className="animate-spin text-accent mb-3" />
        <p className="text-text-muted text-sm font-roboto">Loading athlete dossier...</p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = data?.profile ?? ((data as any)?.fullName ? (data as any) : undefined);

  if (isError || !data || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[460px] bg-error/5 border border-error/20 rounded-3xl text-center p-8">
        <h3 className="text-text-main font-poppins font-bold text-xl mb-1">Athlete Dossier Not Found</h3>
        <p className="text-text-muted text-sm font-roboto mb-5">Could not retrieve information for Athlete #{id}.</p>
        <button
          onClick={() => navigate(ROUTES.USERS)}
          className="px-6 py-2.5 rounded-xl bg-accent text-white font-poppins text-sm font-semibold hover:brightness-105 transition-all cursor-pointer shadow-sm"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const rides = data.rides || [];
  const clubs = data.clubs || [];
  const listings = data.listings || [];
  const purchases = data.purchases || [];

  return (
    <div className="flex flex-col space-y-8 pb-12">
      {/* ── 1. Top Navigation & Breadcrumbs ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.USERS)}
            className="p-2.5 rounded-2xl bg-surface border border-border hover:bg-hover hover:text-accent transition-colors text-text-muted shadow-xs cursor-pointer group"
            title="Back to Athletes"
          >
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-0.5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-roboto text-text-muted">
              <Link to={ROUTES.USERS} className="hover:text-accent transition-colors">
                Athletes
              </Link>
              <span>/</span>
              <span className="text-text-main font-medium">{user.fullName || `Athlete #${userId}`}</span>
            </div>
            <h1 className="font-poppins font-black text-2xl text-text-main tracking-tight mt-0.5">
              Athlete Profile & Dossier
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <UserActionsMenu
            userId={userId}
            isSuspended={user.isSuspended}
            userName={user.fullName}
            onDeleteSuccess={() => navigate(ROUTES.USERS, { replace: true })}
          />
        </div>
      </div>

      {/* ── 2. Executive Profile Card (Clean & Banner-free) ── */}
      <div className="rounded-3xl border border-border bg-surface shadow-xs p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center min-w-0 flex-1">
            {/* Squircle Avatar with Status Ring */}
            <div className="shrink-0 shadow-sm">
              <UserAvatar
                src={user.profileImage}
                name={user.fullName}
                size="2xl"
                shape="squircle"
                showStatus={true}
                isSuspended={user.isSuspended}
                className="border-2 border-border shadow-sm"
              />
            </div>

            {/* Name & Metadata Chips */}
            <div className="space-y-2.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2
                  className="text-2xl sm:text-3xl font-black font-poppins tracking-tight text-text-main uppercase truncate"
                  title={user.fullName}
                >
                  {user.fullName || 'Anonymous Rider'}
                </h2>

                {/* Plan Badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/25 rounded-xl text-xs font-black uppercase tracking-wider text-accent shadow-xs">
                  <Crown size={13} className="text-accent" />
                  <span>{user.subscriptionPlan || 'Free Rider'}</span>
                </span>
              </div>

              {/* Chips Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                {/* Email Chip */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-main-bg/60 border border-border rounded-xl text-xs font-semibold text-text-muted hover:text-text-main transition-colors"
                  title={user.email}
                >
                  <Mail size={13} className="text-accent shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-[320px]">{user.email}</span>
                </div>

                {/* Phone Chip */}
                {user.phone && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-main-bg/60 border border-border rounded-xl text-xs font-semibold text-text-muted">
                    <Phone size={13} className="text-accent shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}

                {/* Clubs Count Chip */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-main-bg/60 border border-border rounded-xl text-xs font-bold text-text-muted">
                  <Shield size={13} className="text-accent shrink-0" />
                  <span>{user.clubsJoined ?? 0} Clubs Joined</span>
                </div>

                {/* Status Chip */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border whitespace-nowrap ${
                    user.isSuspended
                      ? 'bg-error/10 text-error border-error/25'
                      : 'bg-success/10 text-success border-success/25'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.isSuspended ? 'bg-error' : 'bg-success'
                    }`}
                  />
                  <span>{user.isSuspended ? 'Suspended' : 'Active Account'}</span>
                </div>

                {/* Membership Validity Chip */}
                {user.startDate && user.endDate && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-main-bg/60 border border-border rounded-xl text-xs font-semibold text-text-muted">
                    <Clock size={13} className="text-accent shrink-0" />
                    <span>
                      Valid: {new Date(user.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – {new Date(user.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Hero Telemetry Stats Strip ── */}
      {data.stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl border border-border bg-surface shadow-xs flex items-center gap-4 hover:border-accent/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Bike size={24} />
            </div>
            <div>
              <p className="text-text-muted text-xs font-poppins uppercase tracking-wider font-semibold">Total Rides</p>
              <p className="text-text-main font-poppins font-black text-2xl mt-0.5">{data.stats.totalRides ?? 0}</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl border border-border bg-surface shadow-xs flex items-center gap-4 hover:border-info/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-info/10 text-info flex items-center justify-center shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-text-muted text-xs font-poppins uppercase tracking-wider font-semibold">Distance Covered</p>
              <p className="text-text-main font-poppins font-black text-2xl mt-0.5">{data.stats.distanceCovered || '0 km'}</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl border border-border bg-surface shadow-xs flex items-center gap-4 hover:border-warning/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-warning/10 text-warning flex items-center justify-center shrink-0">
              <Star size={24} />
            </div>
            <div>
              <p className="text-text-muted text-xs font-poppins uppercase tracking-wider font-semibold">Rider Reputation</p>
              <p className="text-text-main font-poppins font-black text-2xl mt-0.5">{data.stats.userReputation || '5.0'} / 5.0</p>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Sub-Resource Tabs (GSAP Animated) ── */}
      <div className="flex flex-col space-y-6">
        <DetailTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          counts={{
            rides: rides.length,
            clubs: clubs.length,
            listings: listings.length,
            purchases: purchases.length,
          }}
        />

        <div ref={tabContentRef} className="min-h-[400px]">
          {activeTab === 'rides' && (
            <RidesTabContent
              rides={rides}
              onInspectRide={(ride) => setSelectedRide(ride)}
            />
          )}
          {activeTab === 'clubs' && (
            <ClubsTabContent
              clubs={clubs}
              onInspectClub={(club) => setSelectedClub(club)}
            />
          )}
          {activeTab === 'listings' && (
            <ListingsTabContent
              listings={listings}
              onInspectListing={(listing) => setSelectedListing(listing)}
            />
          )}
          {activeTab === 'purchases' && <PurchasesTabContent purchases={purchases} />}
        </div>
      </div>

      {/* ── 5. Inspection Modals ── */}
      <RideDetailModal
        ride={selectedRide}
        isOpen={Boolean(selectedRide)}
        onClose={() => setSelectedRide(null)}
      />

      <ListingDetailModal
        listing={selectedListing}
        isOpen={Boolean(selectedListing)}
        onClose={() => setSelectedListing(null)}
      />

      <ClubDetailModal
        club={selectedClub}
        isOpen={Boolean(selectedClub)}
        onClose={() => setSelectedClub(null)}
      />
    </div>
  );
}

// ─── Sub-Resource Tab Content Components ──────────────────────────────────────

function RidesTabContent({
  rides,
  onInspectRide,
}: {
  rides: UserRide[];
  onInspectRide: (ride: UserRide) => void;
}) {
  if (rides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-3xl p-8 text-center">
        <Bike size={44} className="text-text-muted/30 mb-3" />
        <h3 className="font-poppins font-bold text-lg text-text-main mb-1">No Rides Recorded</h3>
        <p className="text-text-muted font-roboto text-sm max-w-sm">
          This athlete has not participated in or created any group rides yet.
        </p>
      </div>
    );
  }

  const columns: ColumnDef<UserRide>[] = [
    {
      header: 'Ride Name',
      accessorKey: (r) => (
        <div
          onClick={() => onInspectRide(r)}
          className="flex flex-col min-w-[200px] cursor-pointer group"
          title="Click to view full ride details"
        >
          <span className="font-poppins font-bold text-sm text-text-main group-hover:text-accent transition-colors flex items-center gap-1.5">
            <span>{r.rideName || 'Unnamed Ride'}</span>
            <Eye size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
          </span>
          <span className="font-roboto text-xs text-text-muted flex items-center gap-1 mt-0.5">
            <Users size={12} className="text-accent shrink-0" />
            Host: {r.hostName || 'Community'}
          </span>
        </div>
      ),
      sortable: true,
      sortKey: 'rideName',
    },
    {
      header: 'Date & Time',
      accessorKey: (r) => (
        <div className="flex flex-col text-xs font-roboto text-text-muted">
          <span className="text-text-main font-medium">
            {new Date(r.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-[11px] text-text-muted/70">
            {new Date(r.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ),
      sortable: true,
      sortKey: 'dateTime',
    },
    {
      header: 'Route / Meeting Point',
      accessorKey: (r) => (
        <div className="flex items-center gap-1.5 text-xs font-roboto text-text-muted max-w-[240px] truncate" title={r.route}>
          <MapPin size={13} className="text-accent shrink-0" />
          <span className="truncate">{r.route && r.route !== 'null → null' ? r.route : 'Custom Route'}</span>
        </div>
      ),
      sortable: false,
    },
    {
      header: 'Distance & Pace',
      accessorKey: (r) => (
        <div className="flex flex-col text-xs font-roboto">
          <span className="text-text-main font-bold">{r.distance ? `${r.distance} km` : '—'}</span>
          <span className="text-text-muted text-[11px]">{r.pace || 'Moderate'}</span>
        </div>
      ),
      sortable: false,
    },
    {
      header: 'Riders',
      accessorKey: (r) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-xs font-bold bg-surface border border-border text-text-main">
          <Users size={12} className="text-accent" />
          {r.participantsCount ?? 0}
        </span>
      ),
      sortable: true,
      sortKey: 'participantsCount',
    },
    {
      header: 'Status',
      accessorKey: (r) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border whitespace-nowrap ${
            r.status === 'Completed'
              ? 'bg-success/10 text-success border-success/25'
              : 'bg-accent/10 text-accent border-accent/25'
          }`}
        >
          {r.status || 'Scheduled'}
        </span>
      ),
      sortable: true,
      sortKey: 'status',
    },
    {
      header: 'Actions',
      accessorKey: (r) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onInspectRide(r)}
            className="p-2 rounded-xl bg-surface border border-border hover:bg-hover hover:text-accent transition-colors text-text-muted cursor-pointer"
            title="Inspect Ride Details"
          >
            <Eye size={14} />
          </button>

          {r.gpxFile && (
            <a
              href={r.gpxFile}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-surface border border-border hover:bg-hover hover:text-accent inline-flex items-center transition-colors text-text-muted"
              title="Download GPX File"
            >
              <Download size={14} />
            </a>
          )}
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-poppins font-bold text-lg text-text-main">Participated Group Rides</h3>
          <p className="text-text-muted font-roboto text-xs mt-0.5">Click any ride row to inspect route details and participants.</p>
        </div>
      </div>
      <DataTable data={rides} columns={columns} keyExtractor={(r) => String(r.id)} />
    </div>
  );
}

function ClubsTabContent({
  clubs,
  onInspectClub,
}: {
  clubs: UserClub[];
  onInspectClub: (club: UserClub) => void;
}) {
  if (clubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-3xl p-8 text-center">
        <Shield size={44} className="text-text-muted/30 mb-3" />
        <h3 className="font-poppins font-bold text-lg text-text-main mb-1">No Clubs Joined</h3>
        <p className="text-text-muted font-roboto text-sm max-w-sm">
          This athlete is not currently an active member of any registered club.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-poppins font-bold text-lg text-text-main">Joined Clubs & Affiliations</h3>
          <p className="text-text-muted font-roboto text-xs mt-0.5">Click any club card to inspect governance, cover photo, and live rosters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clubs.map((c) => (
          <UserClubCard key={c.id} club={c} onInspect={onInspectClub} />
        ))}
      </div>
    </div>
  );
}

function ListingsTabContent({
  listings,
  onInspectListing,
}: {
  listings: UserListing[];
  onInspectListing: (listing: UserListing) => void;
}) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-3xl p-8 text-center">
        <Package size={44} className="text-text-muted/30 mb-3" />
        <h3 className="font-poppins font-bold text-lg text-text-main mb-1">No Marketplace Listings</h3>
        <p className="text-text-muted font-roboto text-sm max-w-sm">
          This user has not listed any cycling or motorcycle gear in the community marketplace.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-poppins font-bold text-lg text-text-main">Marketplace Gear Listings</h3>
          <p className="text-text-muted font-roboto text-xs mt-0.5">Click any gear card to inspect full product specs and description.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((v) => (
          <div
            key={v.id}
            onClick={() => onInspectListing(v)}
            className="p-4 rounded-2xl bg-main-bg/50 border border-border hover:border-accent/40 transition-all flex flex-col justify-between group shadow-xs cursor-pointer"
          >
            <div className="flex gap-4 items-start">
              <div className="w-18 h-18 bg-surface rounded-xl overflow-hidden border border-border shrink-0">
                <SafeImage
                  src={v.image}
                  alt={v.productName}
                  fallback={<Package size={24} className="text-accent m-auto" />}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="font-poppins font-bold text-sm text-text-main truncate group-hover:text-accent transition-colors" title={v.productName}>
                  {v.productName}
                </h4>
                <p className="font-roboto text-xs text-text-muted capitalize mt-0.5">
                  Condition: <span className="font-medium text-text-main">{v.condition}</span>
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider border ${
                      v.isActive
                        ? 'bg-success/10 text-success border-success/25'
                        : 'bg-surface text-text-muted border-border'
                    }`}
                  >
                    {v.isActive ? 'Active' : 'Draft'}
                  </span>
                  {v.isSoldOut && (
                    <span className="text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider bg-error/10 text-error border-error/25">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-text-muted font-roboto">
                {new Date(v.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="font-poppins font-black text-sm text-accent">
                €{Number(v.price).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PurchasesTabContent({ purchases }: { purchases: UserPurchase[] }) {
  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface/50 border border-border border-dashed rounded-3xl p-8 text-center">
        <Receipt size={44} className="text-text-muted/30 mb-3" />
        <h3 className="font-poppins font-bold text-lg text-text-main mb-1">No Orders or Purchases</h3>
        <p className="text-text-muted font-roboto text-sm max-w-sm">
          This athlete has not placed any club shop orders or marketplace purchases yet.
        </p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<any>[] = [
    {
      header: 'Item / Service',
      accessorKey: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
            <Package size={18} />
          </div>
          <span className="font-poppins font-bold text-sm text-text-main">{r.type || r.title || 'Order'}</span>
        </div>
      ),
      sortable: false,
    },
    { header: 'Order ID', accessorKey: 'id' },
    {
      header: 'Date',
      accessorKey: (r) =>
        r.dateTime || r.createdAt
          ? new Date(r.dateTime || r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
          : '—',
    },
    {
      header: 'Amount',
      accessorKey: (r) => <span className="font-poppins font-bold text-accent">€{r.amount || '0.00'}</span>,
      sortKey: 'amount',
    },
    {
      header: 'Status',
      accessorKey: (r) => (
        <span className="px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-success/10 text-success border border-success/25">
          {r.status || 'Paid'}
        </span>
      ),
      sortKey: 'status',
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-poppins font-bold text-lg text-text-main">Order History & Purchases</h3>
          <p className="text-text-muted font-roboto text-xs mt-0.5">Purchases made in club shops and community gear marketplace.</p>
        </div>
      </div>
      <DataTable data={purchases} columns={columns} keyExtractor={(r) => String(r.id)} />
    </div>
  );
}
