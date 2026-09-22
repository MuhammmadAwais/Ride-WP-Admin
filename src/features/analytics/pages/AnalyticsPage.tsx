/**
 * @fileoverview Platform Analytics Dashboard.
 * 100% Dynamic data telemetry aggregating live athletes, sports clubs, disciplines, and SaaS tiers.
 * Replaces all legacy taxi template artifacts with true athletic community analytics.
 */
import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '@/Constants';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useGetUsersListQuery } from '@/features/users/api/userApi';
import { useGetClubsListQuery } from '@/features/clubs/api/clubApi';
import { useGetPlansQuery } from '@/features/subscriptions/api/subscriptionApi';

// Components
import { MetricCardsRow } from '../components/MetricCards';
import { TimeSeriesChart } from '../components/TimeSeriesChart';
import { DistributionChart } from '../components/DistributionChart';
import { PeakDemandHeatmap } from '../components/PeakDemandHeatmap';
import { FinancialLedgerChart } from '../components/FinancialLedgerChart';

export default function AnalyticsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { refetch: refetchUsers, isFetching: isFetchingUsers } = useGetUsersListQuery({ limit: 100 });
  const { refetch: refetchClubs, isFetching: isFetchingClubs } = useGetClubsListQuery({ limit: 100 });
  const { refetch: refetchPlans, isFetching: isFetchingPlans } = useGetPlansQuery();

  const isRefreshing = isFetchingUsers || isFetchingClubs || isFetchingPlans;

  const handleRefreshAll = () => {
    refetchUsers();
    refetchClubs();
    refetchPlans();
  };

  // GSAP Stagger Animation for cards
  useGSAP(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.analytics-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.05,
      }
    );
  }, []);

  return (
    <div className="w-full h-full pb-12" ref={containerRef}>
      <Helmet>
        <title>Analytics Dashboard — {APP_NAME} Admin</title>
      </Helmet>

      {/* Outer Shell */}
      <div className="space-y-8">
        {/* Executive Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <Sparkles size={20} />
              </div>
              <h1 className="font-poppins font-bold text-2xl sm:text-3xl text-text-main tracking-tight">
                Platform Analytics
              </h1>
            </div>
            <p className="font-roboto text-sm text-text-muted mt-1 max-w-2xl">
              Real-time community telemetry, athletic discipline distributions, and platform monetization intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="p-2.5 rounded-2xl border border-border bg-surface text-text-muted hover:text-text-main transition-colors cursor-pointer shadow-sm flex items-center gap-2 text-xs font-poppins font-semibold"
              title="Refresh all platform telemetry"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-accent' : ''} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Telemetry
            </span>
          </div>
        </div>

        {/* 1. Real-Time Dynamic Metric Cards */}
        <MetricCardsRow />

        {/* 2. Asymmetric Charts Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Time-Series Growth Engine (Spans 2 columns on XL) */}
          <div className="xl:col-span-2 flex">
            <TimeSeriesChart />
          </div>

          {/* Athletic Disciplines Breakdown Donut (Spans 1 column) */}
          <div className="flex">
            <DistributionChart />
          </div>

          {/* Club Athlete Density Leaderboard (Spans 2 columns on XL) */}
          <div className="xl:col-span-2 flex">
            <PeakDemandHeatmap />
          </div>

          {/* SaaS Monetization & Quotas Matrix (Spans 1 column) */}
          <div className="flex">
            <FinancialLedgerChart />
          </div>
        </div>
      </div>
    </div>
  );
}
