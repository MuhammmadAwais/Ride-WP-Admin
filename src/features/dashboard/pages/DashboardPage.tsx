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

      <div className="space-y-8 pb-12">
        {/* 1. Core Real-time Metrics Grid */}
        <MetricCards />

        {/* 2. Interactive Global Club Surveillance Map */}
        <div className="w-full">
          <DashboardMap />
        </div>

        {/* 3. Streamlined Community Push Broadcast Bar */}
        <DashboardBroadcastBar />

        {/* 4. Real-time Operations: Live Support & SaaS Subscription Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiveInquiriesTerminal />
          <DashboardPlansCard />
        </div>
      </div>
    </>
  );
}


