import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Users, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

interface MetricCardProps {
  label: string;
  targetValue: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  targetValue, 
  prefix = '', 
  suffix = '', 
  icon, 
  trend, 
  trendUp 
}) => {
  const countRef = useRef<HTMLParagraphElement>(null);

  // GSAP numerical interpolation rollup animation on mount (production ready, zero lag)
  useGSAP(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: targetValue,
      duration: 1.0,
      ease: 'power2.out',
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.innerText = `${prefix}${Math.floor(obj.val).toLocaleString()}${suffix}`;
        }
      }
    });
  }, [targetValue]);

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

      <p 
        ref={countRef}
        className="font-poppins font-extrabold text-[28px] text-text-main leading-none tracking-tight"
      >
        {prefix}0{suffix}
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

export default function MetricCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard 
        label="Total Platform Drivers"
        targetValue={5569}
        icon={<Users size={20} />}
        trend="+12% this month"
        trendUp={true}
      />
      <MetricCard 
        label="Completed Pool Rides"
        targetValue={4712}
        icon={<ShieldCheck size={20} />}
        trend="+5% this month"
        trendUp={true}
      />
      <MetricCard 
        label="Active Support Tickets"
        targetValue={12}
        icon={<AlertCircle size={20} />}
        trend="Requires supervisor review"
        trendUp={false}
      />
      <MetricCard 
        label="Active Inter-City Clubs"
        targetValue={569}
        icon={<Clock size={20} />}
        trend="+8% this month"
        trendUp={true}
      />
    </div>
  );
}
