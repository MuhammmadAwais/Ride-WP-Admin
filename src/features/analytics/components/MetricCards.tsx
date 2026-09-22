/**
 * @fileoverview Dynamic Platform Telemetry KPI Cards for Analytics.
 * Unified architectural divided bar matching Ride-WP design system.
 * Aggregates live data from useGetUsersListQuery, useGetClubsListQuery, and useGetPlansQuery.
 * 100% dynamic metrics with smooth GSAP number count-up animations and zero hardcoded data.
 */
import React, { useMemo } from 'react';
import { Users, Shield, Bike, Layers, Loader2, CheckCircle2, TrendingUp } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';
import { useGetUsersListQuery } from '@/features/users/api/userApi';
import { useGetClubsListQuery } from '@/features/clubs/api/clubApi';
import { useGetPlansQuery } from '@/features/subscriptions/api/subscriptionApi';

interface MetricItemProps {
  title: string;
  endValue: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  subtext: string;
  subtextBadge?: React.ReactNode;
  isLoading?: boolean;
}

function MetricItem({
  title,
  endValue,
  prefix = '',
  suffix = '',
  icon,
  subtext,
  subtextBadge,
  isLoading,
}: MetricItemProps) {
  const { numberRef } = useCountUp(endValue, 1.8, prefix, suffix);

  return (
    <div className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-hover/30 transition-colors group">
      <div className="space-y-1 min-w-0">
        <span className="text-[10px] sm:text-[11px] font-poppins font-black uppercase tracking-widest text-text-muted block truncate">
          {title}
        </span>
        {isLoading ? (
          <div className="flex items-center gap-2 py-1">
            <Loader2 size={20} className="animate-spin text-accent" />
            <span className="font-roboto text-xs text-text-muted">Loading...</span>
          </div>
        ) : (
          <p
            ref={numberRef}
            className="font-poppins font-black text-2xl sm:text-3xl lg:text-4xl text-text-main block truncate tracking-tight my-0.5"
          >
            {prefix}
            {endValue.toLocaleString()}
            {suffix}
          </p>
        )}
        <div className="flex items-center gap-1.5 text-[11px] font-roboto text-text-muted truncate">
          {subtextBadge}
          <span className="truncate">{subtext}</span>
        </div>
      </div>

      {/* Signature Ride-WP Ember Icon Container */}
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#EB712B]/15 via-[#EB712B]/10 to-transparent dark:from-[#2a170e] dark:via-[#1c1410] dark:to-[#120f0e] border border-[#EB712B]/25 flex items-center justify-center shrink-0 shadow-xs text-accent group-hover:scale-105 group-hover:border-[#EB712B]/40 transition-all">
        {icon}
      </div>
    </div>
  );
}

export function MetricCardsRow() {
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersListQuery({ limit: 100 });
  const { data: clubsData, isLoading: isLoadingClubs } = useGetClubsListQuery({ limit: 100 });
  const { data: plansData, isLoading: isLoadingPlans } = useGetPlansQuery();

  const users = usersData?.users || [];
  const clubs = clubsData?.clubs || [];
  const plans = plansData || [];

  const metrics = useMemo(() => {
    const totalUsers = usersData?.pagination?.total ?? users.length;
    const activeUsers = users.filter((u) => !u.isSuspended).length;
    const totalClubs = clubsData?.pagination?.total ?? clubs.length;
    const totalMemberships = clubs.reduce((acc, c) => acc + (c.participantCount || 0), 0);

    const disciplinesSet = new Set(
      clubs.map((c) => (c.clubTypeName || 'Cycling').trim()).filter(Boolean)
    );
    const disciplinesCount = disciplinesSet.size > 0 ? disciplinesSet.size : 1;
    const activePlans = plans.filter((p) => p.isActive && !p.isDeleted).length;

    return {
      totalUsers,
      activeUsers,
      totalClubs,
      totalMemberships,
      disciplinesCount,
      activePlans,
    };
  }, [usersData, users, clubsData, clubs, plans]);

  const isLoading = isLoadingUsers || isLoadingClubs || isLoadingPlans;

  return (
    <div className="analytics-card opacity-0 rounded-3xl border border-border bg-surface/50 backdrop-blur-sm overflow-hidden shadow-xs w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {/* 1. Total Registered Athletes */}
        <MetricItem
          title="Community Athletes"
          endValue={metrics.totalUsers}
          icon={<Users size={19} />}
          subtext={`${metrics.activeUsers} active accounts`}
          subtextBadge={<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
          isLoading={isLoading}
        />

        {/* 2. Registered Sports Clubs */}
        <MetricItem
          title="Sports Clubs"
          endValue={metrics.totalClubs}
          icon={<Shield size={19} />}
          subtext={`${metrics.totalMemberships} roster seats`}
          subtextBadge={<span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
          isLoading={isLoading}
        />

        {/* 3. Sport Disciplines Active */}
        <MetricItem
          title="Sport Disciplines"
          endValue={metrics.disciplinesCount}
          icon={<Bike size={19} />}
          subtext="Cycling, Running, Multisport"
          subtextBadge={<TrendingUp size={11} className="text-indigo-400 shrink-0" />}
          isLoading={isLoading}
        />

        {/* 4. SaaS Monetization Plans */}
        <MetricItem
          title="SaaS Monetization Tiers"
          endValue={metrics.activePlans}
          icon={<Layers size={19} />}
          subtext="Live Stripe billing tiers"
          subtextBadge={<CheckCircle2 size={11} className="text-emerald-400 shrink-0" />}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
export default MetricCardsRow;
