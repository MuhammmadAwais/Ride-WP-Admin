import React from 'react';
import { DollarSign, ShieldCheck, Users, Activity } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';

interface MetricCardProps {
  title: string;
  endValue: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

function MetricCard({ title, endValue, prefix, suffix, icon, colorClass, bgClass }: MetricCardProps) {
  const { numberRef } = useCountUp(endValue, 2, prefix, suffix);

  return (
    <div className="analytics-card opacity-0 rounded-2xl border border-border bg-surface p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:border-accent/30 transition-colors group">
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <p className="font-poppins font-semibold text-text-muted text-sm">{title}</p>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      <p className="font-roboto font-bold text-3xl sm:text-4xl text-text-main" ref={numberRef}>
        0
      </p>
    </div>
  );
}

export function MetricCardsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
      <MetricCard 
        title="Total Platform Revenue" 
        endValue={1245000} 
        prefix="PKR " 
        icon={<DollarSign size={24} />} 
        colorClass="text-emerald-500" 
        bgClass="bg-emerald-500/10" 
      />
      <MetricCard 
        title="Active Inter-City Clubs" 
        endValue={142} 
        icon={<ShieldCheck size={24} />} 
        colorClass="text-accent" 
        bgClass="bg-accent/10" 
      />
      <MetricCard 
        title="Total Matched Matches" 
        endValue={8590} 
        icon={<Users size={24} />} 
        colorClass="text-blue-500" 
        bgClass="bg-blue-500/10" 
      />
      <MetricCard 
        title="System Active Drivers" 
        endValue={3204} 
        icon={<Activity size={24} />} 
        colorClass="text-purple-500" 
        bgClass="bg-purple-500/10" 
      />
    </div>
  );
}
