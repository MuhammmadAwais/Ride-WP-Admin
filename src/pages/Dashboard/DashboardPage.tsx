/**
 * @fileoverview Dashboard overview page.
 * Uses hardcoded CSS class names (stat-card, stats-grid, etc.) defined in
 * index.css for guaranteed spacing regardless of Tailwind utility generation.
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, ShieldCheck, TrendingUp, Wallet } from 'lucide-react';
import { APP_NAME, DASHBOARD_COPY } from '@/Constants';

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

const DashboardPage: React.FC = () => (
  <>
    <Helmet>
      <title>Dashboard — {APP_NAME} Admin</title>
    </Helmet>

    <div>
      {/* Welcome subtitle */}
      <p style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '14px',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '8px',
      }}>
        {DASHBOARD_COPY.WELCOME}
      </p>

      {/* Stats grid — spacing guaranteed via .stats-grid in index.css */}
      <div className="stats-grid">
        {STATS.map((stat, i) => (
          <div
            key={stat.id}
            id={stat.id}
            className="stat-card animate-fade-in"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {/* Icon row + trend badge */}
            <div className="stat-card-top">
              <div className="stat-card-icon">
                {stat.icon}
              </div>
              <span style={{
                fontFamily: 'Roboto, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '999px',
                background: stat.trendUp ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)',
                color: stat.trendUp ? '#34d399' : '#f87171',
              }}>
                {stat.trendUp ? '↑' : '↓'} {stat.trend.split(' ')[0]}
              </span>
            </div>

            {/* Big number */}
            <p className="stat-card-value">{stat.value}</p>

            {/* Label */}
            <p className="stat-card-label">{stat.label}</p>

            {/* Trend detail */}
            <p className="stat-card-trend">{stat.trend}</p>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default DashboardPage;
