import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Activity, RefreshCw } from 'lucide-react';

import MetricCards from '../components/MetricCards';
import DashboardMap from '../components/DashboardMap';
import LiveInquiriesTerminal from '../components/LiveInquiriesTerminal';
import ClubsSpotlight from '../components/ClubsSpotlight';
import DashboardOperationsDeck from '../components/DashboardOperationsDeck';
import RecentRidesTable from '../components/RecentRidesTable';
import { useChat } from '@/features/support/context/ChatContext';

export default function DashboardPage() {
  const { refreshThreads } = useChat();

  return (
    <>
      <Helmet>
        <title>Mission Control | Ride With Pals Admin</title>
      </Helmet>

      <div className="space-y-8 pb-12">
        
        {/* Top Banner / Mission Control Welcome */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface border border-border rounded-3xl p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#EB712B]/10 text-[#EB712B] flex items-center justify-center">
                <Activity size={18} />
              </div>
              <h1 className="font-poppins font-bold text-text-main text-2xl tracking-tight">
                Mission Control
              </h1>
            </div>
            <p className="font-roboto text-text-muted text-sm mt-1">
              Real-time telemetry and network oversight across global Ride With Pals cycling & athletic clubs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshThreads()}
              className="p-2.5 rounded-2xl bg-surface border border-border hover:border-text-muted/40 text-text-muted hover:text-text-main transition-colors shadow-sm"
              title="Refresh telemetry"
            >
              <RefreshCw size={15} />
            </button>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              SYSTEMS OPTIMAL
            </span>
          </div>
        </div>

        {/* 1. Core Real-time Metrics Grid */}
        <MetricCards />

        {/* 2. Interactive World Club Surveillance Map + Live Helpdesk Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardMap />
          </div>
          <div className="lg:col-span-1">
            <LiveInquiriesTerminal />
          </div>
        </div>

        {/* 3. Active Sports Clubs Ecosystem Spotlight */}
        <ClubsSpotlight />

        {/* 4. Operations Deck: SaaS Monetization Tiers + Broadcast Push Transmissions */}
        <DashboardOperationsDeck />

        {/* 5. Coordinated Group Rides & Activity Streams Ledger */}
        <RecentRidesTable />

      </div>
    </>
  );
}
