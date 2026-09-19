import { Helmet } from 'react-helmet-async';
import { Star } from 'lucide-react';

import MetricCards from '../components/MetricCards';
import DashboardMap from '../components/DashboardMap';
import { MOCK_FEEDBACK, MOCK_LIVE_RIDES } from '../utils/constants';
import { DataTable, type ColumnDef } from '@/Components/ui/DataTable';
import { type LiveRideLog } from '../types';
import { SafeImage } from '@/Components/common/SafeImage';

const columns: ColumnDef<LiveRideLog>[] = [
  {
    header: 'Ride ID',
    accessorKey: (row) => <span className="font-mono font-bold text-text-main">{row.id}</span>,
    sortable: true,
    sortKey: 'id'
  },
  {
    header: 'User Account',
    accessorKey: (row) => <span className="font-medium text-text-main">{row.user}</span>,
    sortable: true,
    sortKey: 'user'
  },
  {
    header: 'Departure Location',
    accessorKey: 'departure',
    sortable: true
  },
  {
    header: 'Matched Club Name',
    accessorKey: 'club',
    sortable: true
  },
  {
    header: 'Live Status',
    accessorKey: (row) => (
      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg ${
        row.status === 'Ongoing' ? 'bg-emerald-500/10 text-emerald-500' :
        row.status === 'Completed' ? 'bg-blue-500/10 text-blue-500' :
        'bg-amber-500/10 text-amber-500'
      }`}>
        {row.status}
      </span>
    ),
    sortable: true,
    sortKey: 'status'
  }
];

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>Mission Control | Ride With Pals Admin</title>
      </Helmet>

      <div className="space-y-8 pb-12">
        
        {/* Top Banner / Welcome */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface border border-border rounded-3xl p-6 shadow-sm">
          <div>
            <h1 className="font-poppins font-bold text-text-main text-2xl tracking-tight">Mission Control</h1>
            <p className="font-roboto text-text-muted text-sm mt-1">Real-time telemetry and network oversight across global Ride With Pals cycling & athletic clubs</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              SYSTEMS OPTIMAL
            </span>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <MetricCards />

        {/* Live Surveillance Map + User Feedback Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2">
            <DashboardMap />
          </div>

          <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between h-[400px]">
            <div>
              <h3 className="font-poppins font-bold text-text-main text-[16px] tracking-tight">Athlete Ratings Terminal</h3>
              <p className="font-roboto text-text-muted text-xs mt-1">Real-time feedback streams from completed club rides</p>
            </div>

            {/* Ratings Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-1 my-4 space-y-4 custom-scrollbar">
              {MOCK_FEEDBACK.map(fb => (
                <div key={fb.id} className="bg-main-bg/30 border border-border/50 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <SafeImage 
                      src={fb.avatar} 
                      alt={fb.username} 
                      className="w-8 h-8 rounded-full object-cover border border-border"
                      fallback={<div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">{fb.username?.charAt(0)}</div>}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-roboto text-[13px] font-bold text-text-main truncate">{fb.username}</h4>
                      <p className="font-roboto text-[10px] text-text-muted">{fb.time}</p>
                    </div>
                    {/* Flat star indicators in solid flat orange */}
                    <div className="flex gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map(starIndex => (
                        <Star 
                          key={starIndex}
                          size={11}
                          className={starIndex <= fb.rating ? 'fill-[#EB712B] text-[#EB712B]' : 'text-text-muted/40'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="font-roboto text-text-muted text-xs leading-relaxed italic">
                    "{fb.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Cumulative Summary */}
            <div className="border-t border-border pt-4 flex items-center justify-between">
              <span className="font-poppins font-bold text-[11px] text-text-muted uppercase tracking-wider">Overall Index</span>
              <div className="flex items-center gap-1.5">
                <span className="font-poppins font-extrabold text-[15px] text-text-main leading-none">4.8</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} size={11} className="fill-[#EB712B] text-[#EB712B]" />)}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Zone: Live ongoing runs ledger table */}
        <div className="bg-surface border border-border rounded-3xl p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="font-poppins font-bold text-text-main text-[16px] tracking-tight">Active Coordinated Group Rides</h3>
            <p className="font-roboto text-text-muted text-xs mt-1">Active coordinated road trails, gravel loops, and tracking routes across global club chapters</p>
          </div>

          <DataTable 
            data={MOCK_LIVE_RIDES}
            columns={columns}
            keyExtractor={(ride) => ride.id}
          />
        </div>

      </div>
    </>
  );
}

