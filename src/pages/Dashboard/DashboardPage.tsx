/**
 * @fileoverview Dashboard overview page.
 * Displays key stats: Total Users, Total Clubs, Earnings, Balance.
 * Uses mock data — replace with API calls when backend is ready.
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, ShieldCheck, TrendingUp, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME, DASHBOARD_COPY } from '@/Constants';

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface StatCard {
  id: string;
  label: string;
  value: string;
  icon: React.ReactElement;
  trend: string;
  trendUp: boolean;
}

const STATS: StatCard[] = [
  {
    id: 'stat-total-users',
    label: DASHBOARD_COPY.TOTAL_USERS,
    value: '5,569',
    icon: <Users size={22} />,
    trend: '+12% this month',
    trendUp: true,
  },
  {
    id: 'stat-total-clubs',
    label: DASHBOARD_COPY.TOTAL_CLUBS,
    value: '569',
    icon: <ShieldCheck size={22} />,
    trend: '+5% this month',
    trendUp: true,
  },
  {
    id: 'stat-earnings',
    label: DASHBOARD_COPY.EARNINGS,
    value: '$5,069',
    icon: <TrendingUp size={22} />,
    trend: '+8% this month',
    trendUp: true,
  },
  {
    id: 'stat-balance',
    label: DASHBOARD_COPY.BALANCE,
    value: '$1,599',
    icon: <Wallet size={22} />,
    trend: '-2% vs last month',
    trendUp: false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Main dashboard overview page with stat cards.
 */
const DashboardPage: React.FC = () => (
  <>
    <Helmet>
      <title>Dashboard — {APP_NAME} Admin</title>
    </Helmet>

    <div className="space-y-6 animate-fade-up">
      {/* Page header */}
      <div>
        <h1 className="font-poppins font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
          {DASHBOARD_COPY.HEADING}
        </h1>
        <p className="text-sm mt-1 font-roboto" style={{ color: 'var(--text-secondary)' }}>
          {DASHBOARD_COPY.WELCOME}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.id}
            id={stat.id}
            className={cn(
              'rounded-card p-5 shadow-card animate-fade-up',
              'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
            )}
            style={{
              backgroundColor: 'var(--container)',
              animationDelay: `${i * 0.08}s`,
            }}
          >
            {/* Icon + label */}
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-soft flex items-center justify-center"
                style={{ background: 'rgba(235, 113, 43, 0.12)', color: '#EB712B' }}
              >
                {stat.icon}
              </div>
              <span
                className={cn(
                  'text-xs font-roboto font-medium px-2 py-0.5 rounded-pill',
                  stat.trendUp
                    ? 'bg-success/10 text-success'
                    : 'bg-error/10 text-error'
                )}
              >
                {stat.trendUp ? '↑' : '↓'} {stat.trend.split(' ')[0]}
              </span>
            </div>

            {/* Value */}
            <p
              className="font-poppins font-bold text-2xl mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {stat.value}
            </p>

            {/* Label */}
            <p className="text-sm font-roboto" style={{ color: 'var(--text-secondary)' }}>
              {stat.label}
            </p>

            {/* Trend */}
            <p
              className="text-xs font-roboto mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {stat.trend}
            </p>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default DashboardPage;
