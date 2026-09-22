import React from 'react';
import { Helmet } from 'react-helmet-async';

import MetricCards from '../components/MetricCards';
import DashboardMap from '../components/DashboardMap';
import DashboardBroadcastBar from '../components/DashboardBroadcastBar';
import LiveInquiriesTerminal from '../components/LiveInquiriesTerminal';
import DashboardPlansCard from '../components/DashboardPlansCard';

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard | Ride With Pals Admin</title>
      </Helmet>

      <div className="space-y-6 pb-12">
        {/* 1. Architectural Financial & Platform Telemetry Strip */}
        <MetricCards />

        {/* 2. Command Surveillance & Live Support Hub (75% Map / 25% Helpdesk) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          <div className="xl:col-span-8 2xl:col-span-9 h-[560px]">
            <DashboardMap />
          </div>
          <div className="xl:col-span-4 2xl:col-span-3 h-[560px]">
            <LiveInquiriesTerminal />
          </div>
        </div>

        {/* 3. Community Push Notification Broadcast Strip */}
        <DashboardBroadcastBar />

        {/* 4. Full-Width SaaS Monetization Showcase */}
        <DashboardPlansCard />
      </div>
    </>
  );
}
