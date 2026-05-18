import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, ShieldCheck, TrendingUp, Wallet, Star, Clock, AlertCircle } from 'lucide-react';

import { useCountUp } from '../hooks/useCountUp';
import DashboardMap from '../components/DashboardMap';
import WeeklyTrendChart from '../components/WeeklyTrendChart';
import { MOCK_FEEDBACK, MOCK_LIVE_RIDES } from '../utils/constants';

interface SummaryCardProps {
  label: string;
  targetValue: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  label, 
  targetValue, 
  prefix = '', 
  suffix = '', 
  icon, 
  trend, 
  trendUp 
}) => {
  const animatedValue = useCountUp(targetValue);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\n))/g, ',');
  };

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 transition-transform hover:-translate-y-0.5 duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#EB712B]/10 border border-[#EB712B]/20 flex items-center justify-center text-[#EB712B] shrink-0">
          {icon}
        </div>
        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
          trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
        }`}>
          {trendUp ? '↑' : '↓'} {trend.split(' ')[0]}
        </span>
      </div>

      <p className="font-poppins font-extrabold text-[28px] text-text-main leading-none tracking-tight">
        {prefix}{formatNumber(animatedValue)}{suffix}
      </p>
      
      <p className="font-poppins font-bold text-text-muted text-[11px] uppercase tracking-wider mt-3">
        {label}
      </p>

      <p className="font-roboto text-text-muted text-xs mt-1.5 opacity-80">
        {trend}
      </p>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard Overview | Ride With Pals</title>
      </Helmet>

      <div className="min-h-screen pt-4 pb-20 px-2 sm:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Subtitle Header */}
        <div>
          <h1 className="font-poppins font-extrabold text-2xl sm:text-[28px] text-text-main tracking-tight leading-none">
            Dashboard Overview
          </h1>
          <p className="font-roboto text-xs text-text-muted mt-1.5">
            Welcome back, Administrator. Realtime tracking hubs and coordination servers are active.
          </p>
        </div>

        {/* Top Summary Block (4-Column Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard 
            label="Total Registered Users"
            targetValue={5569}
            icon={<Users size={20} />}
            trend="+12% this month"
            trendUp={true}
          />
          <SummaryCard 
            label="Active Coordinated Clubs"
            targetValue={569}
            icon={<ShieldCheck size={20} />}
            trend="+5% this month"
            trendUp={true}
          />
          <SummaryCard 
            label="Monthly Coordination Fees"
            targetValue={5069}
            prefix="$"
            icon={<TrendingUp size={20} />}
            trend="+8% this month"
            trendUp={true}
          />
          <SummaryCard 
            label="Available Escrow Balance"
            targetValue={1599}
            prefix="$"
            icon={<Wallet size={20} />}
            trend="-2% vs last month"
            trendUp={false}
          />
        </div>

        {/* Middle Section: Vector Map Left, Ratings Terminal Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Interactive Map (2/3 width on large screens) */}
          <div className="lg:col-span-2 flex flex-col">
            <DashboardMap />
          </div>

          {/* User Feedback Ratings terminal (1/3 width) */}
          <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between h-[400px]">
            <div>
              <h3 className="font-poppins font-bold text-text-main text-[16px] tracking-tight">User Ratings Terminal</h3>
              <p className="font-roboto text-text-muted text-xs mt-1">Real-time coordinated club and run feedback streams</p>
            </div>

            {/* Ratings Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-1 my-4 space-y-4 custom-scrollbar">
              {MOCK_FEEDBACK.map(fb => (
                <div key={fb.id} className="bg-main-bg/30 border border-border/50 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={fb.avatar} 
                      alt={fb.username} 
                      className="w-8 h-8 rounded-full object-cover border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-roboto text-[13px] font-bold text-text-main truncate">{fb.username}</h4>
                      <p className="font-roboto text-[10px] text-text-muted">{fb.time}</p>
                    </div>
                    {/* Star Row */}
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

        {/* Under Map row: Bar Chart Left, Platform Operations Status Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          <WeeklyTrendChart 
            title="Weekly Dispatch Velocity"
            subtitle="Calculated weekly completed runs and platform coordinate logs"
          />

          {/* Operational Platform Metrics Card */}
          <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between h-[300px]">
            <div>
              <h3 className="font-poppins font-bold text-text-main text-[16px] tracking-tight">Operations Ledger</h3>
              <p className="font-roboto text-text-muted text-xs mt-1">Realtime coordinator servers and support queue statuses</p>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4 items-center my-4">
              <div className="bg-main-bg/30 border border-border/50 rounded-2xl p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between text-emerald-500">
                  <span className="font-poppins font-bold text-[11px] uppercase tracking-wider text-text-muted">Tracking Queue</span>
                  <Clock size={16} />
                </div>
                <div className="mt-2">
                  <h4 className="font-poppins font-extrabold text-2xl text-text-main leading-none">99.9%</h4>
                  <p className="font-roboto text-[10px] text-emerald-500 font-semibold mt-1">Active sync systems</p>
                </div>
              </div>

              <div className="bg-main-bg/30 border border-border/50 rounded-2xl p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between text-[#EB712B]">
                  <span className="font-poppins font-bold text-[11px] uppercase tracking-wider text-text-muted">Open Tickets</span>
                  <AlertCircle size={16} />
                </div>
                <div className="mt-2">
                  <h4 className="font-poppins font-extrabold text-2xl text-text-main leading-none">12</h4>
                  <p className="font-roboto text-[10px] text-text-muted font-semibold mt-1">Requires supervisor review</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center text-xs text-text-muted font-roboto">
              <span>Platform Version: <strong>v2.4.0</strong></span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All Systems Nominal</span>
            </div>
          </div>

        </div>

        {/* Bottom Section: Live Activity Ledger (Transaction Table) */}
        <div className="bg-surface border border-border rounded-3xl p-5 sm:p-6 overflow-hidden">
          <div className="mb-4">
            <h3 className="font-poppins font-bold text-text-main text-[16px] tracking-tight">Live Ongoing Runs</h3>
            <p className="font-roboto text-text-muted text-xs mt-1">Active coordinated road trails and tracking routes across global hub sectors</p>
          </div>

          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse text-left text-xs font-roboto">
              <thead>
                <tr className="border-b border-border text-text-muted font-poppins font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Ride ID</th>
                  <th className="py-3 px-4">User Account</th>
                  <th className="py-3 px-4">Departure Node</th>
                  <th className="py-3 px-4">Matched Club Space</th>
                  <th className="py-3 px-4 text-right">Live Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_LIVE_RIDES.map(ride => (
                  <tr key={ride.id} className="hover:bg-hover/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-text-main">{ride.id}</td>
                    <td className="py-3.5 px-4 font-medium text-text-main">{ride.user}</td>
                    <td className="py-3.5 px-4 text-text-muted">{ride.departure}</td>
                    <td className="py-3.5 px-4 text-text-muted">{ride.club}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                        ride.status === 'Ongoing' ? 'bg-emerald-500/10 text-emerald-500' :
                        ride.status === 'Completed' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {ride.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
