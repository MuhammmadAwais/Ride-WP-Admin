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
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-poppins font-bold text-2xl text-white">User Details</h1>
      </div>

      {/* Profile Header Card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex-shrink-0 bg-white/10 flex items-center justify-center border-4 border-white/10 overflow-hidden">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User size={48} className="text-white/40" />
          )}
        </div>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-white/50 text-xs font-poppins uppercase tracking-wider mb-1">Name of User</p>
            <p className="text-white font-semibold font-poppins text-lg">{user.name}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs font-poppins uppercase tracking-wider mb-1">Subscription</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              user.subscriptionPlan === 'Diamond' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
              user.subscriptionPlan === 'Gold' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
              'bg-gray-500/20 text-gray-300 border border-gray-500/30'
            }`}>
              {user.subscriptionPlan}
            </span>
          </div>
          <div>
            <p className="text-white/50 text-xs font-poppins uppercase tracking-wider mb-1">Phone number</p>
            <p className="text-white font-roboto">{user.phoneNo}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs font-poppins uppercase tracking-wider mb-1">Start/End Date</p>
            <p className="text-white font-roboto text-sm">{user.startDate} — {user.endDate}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs font-poppins uppercase tracking-wider mb-1">Email</p>
            <p className="text-white font-roboto">{user.email}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs font-poppins uppercase tracking-wider mb-1">Clubs Joined</p>
            <p className="text-white font-roboto font-medium">{user.clubsJoined}</p>
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
      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${r.role === 'Driver' ? 'bg-[#EB712B]/20 text-[#EB712B] border border-[#EB712B]/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
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
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-xl p-5 border border-white/5 bg-[#282828E5] flex items-center justify-between">
          <div>
            <p className="text-white/50 text-sm font-poppins mb-1">Total Rides</p>
            <p className="text-3xl font-bold text-white font-roboto">124</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="rounded-xl p-5 border border-white/5 bg-[#282828E5] flex items-center justify-between">
          <div>
            <p className="text-white/50 text-sm font-poppins mb-1">Distance Covered</p>
            <p className="text-3xl font-bold text-white font-roboto">1,240 <span className="text-lg text-white/50 font-normal">km</span></p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Car size={24} />
          </div>
        </div>
        <div className="rounded-xl p-5 border border-white/5 bg-[#282828E5] flex items-center justify-between">
          <div>
            <p className="text-white/50 text-sm font-poppins mb-1">User Reputation</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-white font-roboto">4.8</p>
              <p className="text-sm text-white/50 mb-1">/ 5.0</p>
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
        <div key={club.id} className="relative rounded-2xl overflow-hidden bg-[#282828E5] border border-white/5 group hover:border-white/10 transition-colors">
          <div className="h-24 bg-gradient-to-r from-[#EB712B]/20 to-purple-500/20 relative">
             <div className="absolute inset-0 backdrop-blur-md bg-white/5"></div>
          </div>
          <div className="px-5 pb-5 relative -mt-8">
            <div className="w-16 h-16 rounded-xl bg-[#1e1e1e] border-4 border-[#282828E5] flex items-center justify-center mb-3 shadow-lg">
              {club.image ? <img src={club.image} alt={club.name} className="w-full h-full rounded-lg" /> : <Shield size={24} className="text-[#EB712B]" />}
            </div>
            <h3 className="font-poppins font-semibold text-lg text-white mb-1">{club.name}</h3>
            <p className="font-roboto text-sm text-white/50 mb-4">{club.members} Members</p>
            
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${club.role === 'Admin' ? 'bg-[#EB712B]/20 text-[#EB712B]' : 'bg-white/10 text-white/70'}`}>
                {club.role}
              </span>
              <span className="font-roboto text-xs text-white/40">Joined {club.dateJoined}</span>
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
      <div className="rounded-2xl border border-white/5 bg-[#282828E5] p-6">
        <h3 className="font-poppins font-semibold text-lg text-white mb-4">Registered Vehicles</h3>
        <div className="space-y-4">
          {MOCK_VEHICLES.map((v) => (
            <div key={v.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="w-16 h-12 bg-white/10 rounded-md flex items-center justify-center flex-shrink-0">
                <Car size={24} className="text-white/40" />
              </div>
              <div className="flex-1">
                <h4 className="font-poppins font-medium text-white">{v.make} {v.model}</h4>
                <p className="font-roboto text-sm text-white/50">{v.year} • {v.condition}</p>
              </div>
              <div className="text-right">
                <div className="px-3 py-1 bg-white/10 rounded-md border border-white/10 font-mono text-sm text-white/80">
                  {v.licensePlate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="rounded-2xl border border-white/5 bg-[#282828E5] p-6">
        <h3 className="font-poppins font-semibold text-lg text-white mb-4">Scheduled Offers</h3>
        <div className="flex items-center justify-center h-[300px] bg-white/5 rounded-xl border border-white/5 border-dashed">
          <div className="text-center">
            <Car size={32} className="mx-auto text-white/20 mb-3" />
            <p className="font-poppins text-white/50">No active offers scheduled</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PurchasesTabContent() {
  const columns: ColumnDef<any>[] = [
    { header: 'Transaction ID', accessorKey: 'id' },
    { header: 'Date/Time', accessorKey: 'dateTime' },
    { header: 'Type', accessorKey: 'type' },
    { header: 'Amount', accessorKey: 'amount' },
    { header: 'Method', accessorKey: 'method' },
    { header: 'Status', accessorKey: (r) => (
      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
        r.status === 'Success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
        r.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
        'bg-red-500/20 text-red-400 border border-red-500/30'
      }`}>
        {r.status}
      </span>
    ), sortKey: 'status' }
  ];

  return (
    <div>
      <DataTable data={MOCK_PURCHASES} columns={columns} keyExtractor={(r) => r.id} />
    </div>
  );
}
