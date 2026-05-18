import  { useState, useRef } from 'react';
import {useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { 
  ChevronLeft, CheckCircle2, ShieldCheck, MapPin, 
  Users, Activity, DollarSign, Calendar, Edit2, Trash2, Pin,
  Clock,  Star,  Tag, ShoppingCart, UserCheck, Shield
} from 'lucide-react';

import { ClubDetailTabs } from '../components/ClubDetailTabs';
import { 
  type TabId, MOCK_CLUB_DETAILS, MOCK_CLUB_RIDES, MOCK_CLUB_NEWS,
  MOCK_CLUB_LEADERBOARD, MOCK_CLUB_INVENTORY, MOCK_CLUB_DISCOUNTS,
  MOCK_CLUB_MARKETPLACE, MOCK_CLUB_MEMBERS
} from '../utils/constants';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';

export default function ClubDetailsPage() {
  const navigate = useNavigate();
  const club = MOCK_CLUB_DETAILS;
  const [activeTab, setActiveTab] = useState<TabId>('rides');
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
          <img 
            src={club.bannerImage} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-90" 
          />
          {/* Flat Minimalist Tint Overlay */}
          <div className="absolute inset-0 bg-black/25 z-10" />
        </div>

        {/* Profile Content */}
        <div className="relative z-30 px-6 sm:px-10 pb-8 -mt-20 flex flex-col xl:flex-row gap-8 items-start xl:items-end justify-between">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end w-full xl:w-auto">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-surface bg-surface overflow-hidden shadow-2xl relative shrink-0">
              <img src={club.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
              {club.isVerified && (
                <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1 border-2 border-surface shadow-md">
                  <CheckCircle2 size={16} className="text-white" />
                </div>
              )}
            </div>
            <div className="mb-2 w-full">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-text-main tracking-tight leading-tight">{club.name}</h2>
                {club.isVerified && <ShieldCheck size={28} className="text-blue-500 shrink-0" />}
              </div>
              <p className="font-roboto text-text-muted text-sm flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <span className="flex items-center gap-1.5"><UserCheck size={16} /> Created by {club.creator}</span>
                <span className="flex items-center gap-1.5"><Calendar size={16} /> {club.createdAt}</span>
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
                <p className="font-bold text-lg sm:text-xl text-text-main">{club.stats.activeMembers}</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Activity size={18} className="sm:size-[20px]" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">Group Runs</p>
                <p className="font-bold text-lg sm:text-xl text-text-main">{club.stats.groupRuns}</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
                <DollarSign size={18} className="sm:size-[20px]" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">Revenue (PKR)</p>
                <p className="font-bold text-lg sm:text-xl text-text-main">{club.stats.revenue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Slide-Switcher */}
      <ClubDetailTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Functional Sub-Suites (Lower Zone) */}
      <div ref={contentRef} className="min-h-[500px]">
        {activeTab === 'rides' && <RidesTab />}
        {activeTab === 'news' && <NewsTab />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
        {activeTab === 'shop' && <ShopTab />}
        {activeTab === 'discount' && <DiscountTab />}
        {activeTab === 'marketplace' && <MarketplaceTab />}
        {activeTab === 'members' && <MembersTab />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── TAB SUB-SUITES ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function RidesTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
      {MOCK_CLUB_RIDES.map((ride) => (
        <div 
          key={ride.id} 
          className="bg-surface border border-border p-6 rounded-[28px] relative flex flex-col justify-between hover:border-accent/30 transition-all duration-300 shadow-sm"
        >
          {/* Top Row: Info + GPX Badge */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <h4 className="font-poppins font-bold text-[18px] text-text-main leading-tight mb-1">{ride.name}</h4>
              <p className="font-roboto text-[13px] text-text-muted flex items-center gap-1.5 mb-1">
                <Calendar size={14} className="opacity-70" /> {ride.date} • {ride.time}
              </p>
              <p className="font-roboto text-[13px] text-text-muted flex items-center gap-1.5">
                <MapPin size={14} className="text-accent" /> {ride.route}
              </p>
            </div>
            
            {ride.hasGpx && (
              <span className="bg-[#EB712B]/10 text-[#EB712B] border border-[#EB712B]/20 px-3.5 py-1 rounded-xl font-poppins font-bold text-[11px] tracking-wider uppercase select-none">
                GPX
              </span>
            )}
          </div>

          {/* Bottom Row: 3 Highlight Boxes (Pace, Distance, Participants) */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-main-bg/50 border border-border/40 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="font-poppins font-extrabold text-[15px] sm:text-[16px] text-text-main mb-0.5">{ride.pace}</span>
              <span className="font-roboto font-bold text-[9px] text-text-muted uppercase tracking-wider">Pace</span>
            </div>
            
            <div className="bg-main-bg/50 border border-border/40 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="font-poppins font-extrabold text-[15px] sm:text-[16px] text-text-main mb-0.5">{ride.distance}</span>
              <span className="font-roboto font-bold text-[9px] text-text-muted uppercase tracking-wider">Distance</span>
            </div>

            <div className="bg-main-bg/50 border border-border/40 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="font-poppins font-extrabold text-[15px] sm:text-[16px] text-text-main mb-0.5">{ride.participants}</span>
              <span className="font-roboto font-bold text-[9px] text-text-muted uppercase tracking-wider">Participants</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NewsTab() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {MOCK_CLUB_NEWS.map(news => (
        <div key={news.id} className="bg-surface border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-text-muted/10 hover:bg-accent/20 hover:text-accent rounded-lg transition-colors"><Pin size={16} /></button>
            <button className="p-2 bg-text-muted/10 hover:bg-blue-500/20 hover:text-blue-500 rounded-lg transition-colors"><Edit2 size={16} /></button>
            <button className="p-2 bg-text-muted/10 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Clock size={18} />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-lg text-text-main">{news.heading}</h3>
              <p className="text-xs text-text-muted font-roboto">{news.date}</p>
            </div>
          </div>
          
          {/* Mock Markdown Rendering */}
          <div className="prose prose-sm dark:prose-invert max-w-none font-roboto text-[15px] text-text-muted/90 leading-relaxed mb-4">
            {news.content.split('\n').map((line, i) => {
              // Basic bold/italic mock parsing
              let parsedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-main font-semibold">$1</strong>');
              parsedLine = parsedLine.replace(/\*(.*?)\*/g, '<em class="text-text-main italic">$1</em>');
              return <p key={i} dangerouslySetInnerHTML={{ __html: parsedLine }} />;
            })}
          </div>

          {news.image && (
            <div className="w-full h-64 rounded-2xl overflow-hidden border border-border/50">
              <img src={news.image} alt={news.heading} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LeaderboardTab() {
  const columns: ColumnDef<any>[] = [
    { header: 'Rank', accessorKey: (r) => {
      let colorClass = 'text-text-muted';
      if (r.rank === 1) { colorClass = 'text-yellow-400'; }
      if (r.rank === 2) { colorClass = 'text-gray-300'; }
      if (r.rank === 3) { colorClass = 'text-orange-400'; }
      
      return (
        <span className={`font-poppins font-black text-xl ${colorClass}`}>#{r.rank}</span>
      );
    }, sortKey: 'rank' },
    { header: 'Member Profile', accessorKey: (r) => (
      <div className="flex items-center gap-3">
        <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-border" />
        <span className="font-semibold text-text-main">{r.name}</span>
      </div>
    ) },
    { header: 'Total Distance', accessorKey: (r) => (
      <span className="font-mono text-[15px]">{r.distance.toLocaleString()} km</span>
    ), sortKey: 'distance' },
    { header: 'Pool Journeys', accessorKey: (r) => <span className="font-bold">{r.journeys}</span>, sortKey: 'journeys' },
    { header: 'Score Points', accessorKey: (r) => (
      <span className="flex items-center gap-1 text-accent font-bold"><Star size={14} fill="currentColor" /> {r.points.toLocaleString()}</span>
    ), sortKey: 'points' },
  ];

  return (
    <div>
      <DataTable data={MOCK_CLUB_LEADERBOARD} columns={columns} keyExtractor={(r) => r.rank.toString()} />
    </div>
  );
}

function ShopTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {MOCK_CLUB_INVENTORY.map(item => (
        <div key={item.id} className="bg-surface border border-border rounded-3xl overflow-hidden group hover:border-accent/40 transition-all shadow-sm flex flex-col">
          <div className="h-48 relative overflow-hidden bg-text-muted/5">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <button className="absolute top-3 right-3 p-2 bg-surface/80 backdrop-blur-md rounded-xl hover:bg-accent hover:text-white transition-colors opacity-0 group-hover:opacity-100">
              <Edit2 size={16} />
            </button>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h4 className="font-poppins font-semibold text-text-main line-clamp-1 mb-1">{item.name}</h4>
            <p className="text-xl font-bold text-accent font-mono mb-4">Rs. {item.price}</p>
            
            <div className="mt-auto">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">Stock Level</span>
                <span className="text-[11px] font-bold text-text-main">{item.stock} left</span>
              </div>
              <div className="h-2 w-full bg-text-muted/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${item.stock > 20 ? 'bg-green-500' : 'bg-red-500'}`} 
                  style={{ width: `${Math.min(item.stock, 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DiscountTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {MOCK_CLUB_DISCOUNTS.map(discount => (
        <div key={discount.id} className="bg-surface border border-border rounded-3xl p-5 shadow-sm hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border shadow-sm shrink-0">
              <img src={discount.logo} alt={discount.brand} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-poppins font-bold text-text-main leading-tight mb-1">{discount.brand}</h4>
              <p className="text-xs font-semibold text-text-muted flex items-center gap-1">
                <Clock size={12} /> {discount.expiry}
              </p>
            </div>
          </div>
          <div className="bg-[#EB712B]/10 border border-[#EB712B]/20 rounded-xl p-3 text-center mb-4 border-dashed">
            <span className="font-black text-[#EB712B] text-lg tracking-tight"><Tag size={16} className="inline mr-1" /> {discount.deal}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-muted">Status</span>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${discount.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {discount.isActive ? 'Active Voucher' : 'Expired'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MarketplaceTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {MOCK_CLUB_MARKETPLACE.map(item => (
        <div key={item.id} className="bg-surface border border-border rounded-3xl overflow-hidden group hover:border-accent/40 transition-all shadow-sm">
          <div className="h-48 relative overflow-hidden bg-text-muted/5">
            <img src={item.image} alt={item.product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-lg ${item.status === 'Available' ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                {item.status}
              </span>
            </div>
          </div>
          <div className="p-5">
            <h4 className="font-poppins font-semibold text-text-main line-clamp-2 mb-2 min-h-[44px]">{item.product}</h4>
            <p className="text-xl font-bold text-accent font-mono mb-4 flex items-center gap-1">
              <ShoppingCart size={18} /> Rs. {item.price}
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <img src={item.sellerAvatar} alt={item.seller} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-[10px] font-semibold text-text-muted uppercase">Seller</p>
                <p className="text-sm font-medium text-text-main">{item.seller}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MembersTab() {
  const columns: ColumnDef<any>[] = [
    { header: 'Profile', accessorKey: (r) => (
      <div className="flex items-center gap-3">
        <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-border" />
        <span className="font-semibold text-text-main">{r.name}</span>
      </div>
    ) },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Role', accessorKey: (r) => {
      let bg = 'bg-text-muted/10 text-text-muted';
      if (r.role === 'Owner') bg = 'bg-accent/20 text-accent border border-accent/20';
      if (r.role === 'Mod') bg = 'bg-blue-500/20 text-blue-500 border border-blue-500/20';
      
      return (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide flex items-center gap-1 w-fit ${bg}`}>
          {r.role === 'Owner' && <Shield size={12} />}
          {r.role}
        </span>
      );
    }, sortKey: 'role' },
    { header: 'Joined', accessorKey: 'joined' },
    { header: 'Actions', accessorKey: () => (
      <button className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
        Manage Role
      </button>
    ) }
  ];

  return (
    <div>
      <DataTable data={MOCK_CLUB_MEMBERS} columns={columns} keyExtractor={(r) => r.id} />
    </div>
  );
}
