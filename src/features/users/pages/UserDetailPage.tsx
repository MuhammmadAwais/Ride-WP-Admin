import React, { useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ChevronLeft, User, TrendingUp, Star, Shield, Car, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { DetailTabs, type TabId } from '../components/DetailTabs';
import { MOCK_USERS, MOCK_RIDES, MOCK_JOINED_CLUBS, MOCK_VEHICLES, MOCK_PURCHASES, type ParticipatedRide } from '../utils/constants';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = MOCK_USERS.find((u) => u.id === id) || MOCK_USERS[0]; // Fallback for demo
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

  return (
    <div className="flex flex-col space-y-8 pb-8">
      {/* Top Navigation */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-surface border border-border hover:bg-accent/10 transition-colors text-text-muted hover:text-accent"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-poppins font-bold text-2xl text-text-main tracking-tight">User Details</h1>
      </div>

      {/* Profile Header Card */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex-shrink-0 bg-accent/5 flex items-center justify-center border-4 border-border overflow-hidden">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User size={48} className="text-accent/30" />
          )}
        </div>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Name of User</p>
            <p className="text-text-main font-semibold font-poppins text-lg">{user.name}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Subscription</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              user.subscriptionPlan === 'Diamond' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
              user.subscriptionPlan === 'Gold' ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' :
              'bg-gray-500/10 text-gray-500 border border-gray-500/20'
            }`}>
              {user.subscriptionPlan}
            </span>
          </div>
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Phone number</p>
            <p className="text-text-main font-roboto">{user.phoneNo}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Start/End Date</p>
            <p className="text-text-main font-roboto text-sm">{user.startDate} — {user.endDate}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Email</p>
            <p className="text-text-main font-roboto">{user.email}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-poppins uppercase tracking-wider mb-1">Clubs Joined</p>
            <p className="text-text-main font-roboto font-medium">{user.clubsJoined}</p>
          </div>
        </div>
      </div>

      {/* Information Matrix */}
      <div className="flex flex-col space-y-6 mt-4">
        <DetailTabs activeTab={activeTab} onChange={setActiveTab} />

        <div ref={tabContentRef} className="min-h-[400px]">
          {activeTab === 'rides' && <RidesTabContent />}
          {activeTab === 'clubs' && <ClubsTabContent />}
          {activeTab === 'listings' && <ListingsTabContent />}
          {activeTab === 'purchases' && <PurchasesTabContent />}
        </div>
      </div>
    </div>
  );
}

// ─── Tab Contents ────────────────────────────────────────────────────────────

function RidesTabContent() {
  const columns: ColumnDef<ParticipatedRide>[] = [
    { header: 'Date & Time', accessorKey: (r) => `${r.date} ${r.time}`, sortKey: 'date' },
    { header: 'Route', accessorKey: 'route' },
    { header: 'Club/Host Name', accessorKey: 'clubName' },
    { header: 'Role', accessorKey: (r) => (
      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${r.role === 'Driver' ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
        {r.role}
      </span>
    ), sortKey: 'role' },
    { header: 'Fare Paid', accessorKey: 'fare' },
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_RIDES.slice(0, 1).map((ride) => (
          <div key={ride.id} className="rounded-[32px] p-8 bg-surface border border-border shadow-md relative overflow-hidden group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-poppins font-bold text-text-main mb-2">{ride.route.split('→')[0].trim()} Ride</h3>
                <div className="space-y-1">
                  <p className="text-[15px] text-text-muted font-roboto flex items-center gap-2">
                    <Clock size={16} className="text-accent/60" /> {ride.date} • {ride.time}
                  </p>
                  <p className="text-[15px] text-text-muted font-roboto flex items-center gap-2">
                    <Star size={16} className="text-accent/60" /> {ride.clubName}
                  </p>
                </div>
              </div>
              {ride.hasGpx && (
                <div className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold tracking-wide shadow-lg shadow-blue-600/20">
                  GPX
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-text-muted/10 dark:bg-white/5 rounded-3xl p-6 text-center group-hover:bg-accent/5 transition-colors">
                <p className="text-xl font-bold text-text-main mb-1">{ride.pace}</p>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Pace</p>
              </div>
              <div className="bg-text-muted/10 dark:bg-white/5 rounded-3xl p-6 text-center group-hover:bg-accent/5 transition-colors">
                <p className="text-xl font-bold text-text-main mb-1">{ride.distance}</p>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Distance</p>
              </div>
              <div className="bg-text-muted/10 dark:bg-white/5 rounded-3xl p-6 text-center group-hover:bg-accent/5 transition-colors">
                <p className="text-xl font-bold text-text-main mb-1">{ride.participants}</p>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Participants</p>
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
      
      <DataTable data={MOCK_RIDES} columns={columns} keyExtractor={(r) => r.id} />
    </div>
  );
}

function ClubsTabContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_JOINED_CLUBS.map((club) => (
        <div key={club.id} className="relative rounded-2xl overflow-hidden bg-surface border border-border group hover:border-accent/30 transition-all shadow-sm">
          <div className="h-24 bg-gradient-to-r from-accent/10 to-purple-500/10 relative">
             <div className="absolute inset-0 backdrop-blur-sm bg-white/5"></div>
          </div>
          <div className="px-5 pb-5 relative -mt-8">
            <div className="w-16 h-16 rounded-xl bg-surface border-4 border-surface flex items-center justify-center mb-3 shadow-lg overflow-hidden">
              {club.image ? <img src={club.image} alt={club.name} className="w-full h-full object-cover" /> : <Shield size={24} className="text-accent" />}
            </div>
            <h3 className="font-poppins font-semibold text-lg text-text-main mb-1">{club.name}</h3>
            <p className="font-roboto text-sm text-text-muted mb-4">{club.members} Members</p>
            
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className={`px-2 py-1 rounded text-xs font-bold ${club.role === 'Admin' ? 'bg-accent/10 text-accent' : 'bg-text-muted/10 text-text-muted'}`}>
                {club.role}
              </span>
              <span className="font-roboto text-xs text-text-muted/60 tracking-tight">Joined {club.dateJoined}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListingsTabContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-6">Registered Vehicles</h3>
        <div className="space-y-4">
          {MOCK_VEHICLES.map((v) => (
            <div key={v.id} className="flex items-center gap-4 p-4 rounded-2xl bg-text-muted/5 border border-border group hover:border-accent/30 transition-all">
              <div className="w-16 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Car size={24} className="text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-poppins font-semibold text-text-main">{v.make} {v.model}</h4>
                <p className="font-roboto text-sm text-text-muted">{v.year} • {v.condition}</p>
              </div>
              <div className="text-right">
                <div className="px-3 py-1.5 bg-surface rounded-lg border border-border font-mono text-[13px] font-bold text-text-main shadow-sm">
                  {v.licensePlate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h3 className="font-poppins font-semibold text-lg text-text-main mb-6">Scheduled Offers</h3>
        <div className="flex items-center justify-center h-[300px] bg-text-muted/5 rounded-2xl border-2 border-border border-dashed">
          <div className="text-center">
            <Car size={32} className="mx-auto text-text-muted/20 mb-3" />
            <p className="font-poppins text-text-muted font-medium">No active offers scheduled</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PurchasesTabContent() {
  const columns: ColumnDef<any>[] = [
    {
      header: 'Item',
      accessorKey: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/5 border border-border overflow-hidden flex-shrink-0">
            {r.itemImage ? (
              <img src={r.itemImage} alt={r.type} className="w-full h-full object-cover" />
            ) : (
              <TrendingUp size={18} className="m-auto text-accent/30" />
            )}
          </div>
          <span className="font-medium text-text-main">{r.type}</span>
        </div>
      ),
      sortable: false,
    },
    { header: 'Transaction ID', accessorKey: 'id' },
    { header: 'Date/Time', accessorKey: 'dateTime' },
    { header: 'Amount', accessorKey: (r) => <span className="font-bold text-accent">{r.amount}</span>, sortKey: 'amount' },
    { header: 'Method', accessorKey: 'method' },
    { header: 'Status', accessorKey: (r) => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-tight ${
        r.status === 'Success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
        r.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' :
        'bg-red-500/10 text-red-600 border border-red-500/20'
      }`}>
        {r.status}
      </span>
    ), sortKey: 'status' }
  ];

  return (
    <div className="pb-12">
      <DataTable data={MOCK_PURCHASES} columns={columns} keyExtractor={(r) => r.id} />
    </div>
  );
}
