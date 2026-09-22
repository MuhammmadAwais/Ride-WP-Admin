import React from 'react';
import { Helmet } from 'react-helmet-async';

import MetricCards from '../components/MetricCards';
import DashboardMap from '../components/DashboardMap';
import DashboardBroadcastBar from '../components/DashboardBroadcastBar';

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
      </div>
    </>
  );
}

